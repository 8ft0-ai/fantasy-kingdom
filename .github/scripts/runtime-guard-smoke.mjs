import { chromium } from 'playwright';
import fs from 'node:fs';

const baseUrl = (process.env.ANNALS_BASE_URL || 'http://127.0.0.1:4173').replace(/\/$/, '');
const seeds = ['1234567', '987654', '424242'];
const reportPath = 'runtime-guard-smoke-report.json';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const manifest = fs.readFileSync('src/manifest.txt', 'utf8')
  .split(/\r?\n/)
  .map(line => line.trim())
  .filter(line => line && !line.startsWith('#'));
const runtime = fs.readFileSync('annals.html', 'utf8');

assert(runtime.includes('ANNALS · generated single-file runtime · v0.8'), 'generated runtime header is missing');
assert(runtime.includes('ANNALS GENERATED MODULE INDEX'), 'generated module index is missing');
assert(!/\b(?:localStorage|sessionStorage)\b/.test(runtime), 'generated runtime contains a browser persistence API');
let previousIndex = -1;
for (const [index, relative] of manifest.entries()) {
  const marker = `ANNALS MODULE ${String(index + 1).padStart(2, '0')}/${String(manifest.length).padStart(2, '0')}`;
  const source = `Source: src/${relative}`;
  const markerIndex = runtime.indexOf(marker);
  const sourceIndex = runtime.indexOf(source, markerIndex);
  assert(markerIndex > previousIndex, `module marker is missing or out of order for ${relative}`);
  assert(sourceIndex > markerIndex, `source marker is missing for ${relative}`);
  previousIndex = markerIndex;
}

const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const seed of seeds) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const consoleErrors = [];
    const pageErrors = [];
    page.on('console', message => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', error => pageErrors.push(error.message));
    const result = { seed, passed: false };
    try {
      await page.goto(`${baseUrl}/annals.html#s=${seed}`, { waitUntil: 'domcontentloaded', timeout: 45_000 });
      await page.waitForFunction(() => window.ANNALS_GUARDS?.summary()?.boot?.ready === true, { timeout: 45_000 });
      const summary = await page.evaluate(() => window.ANNALS_GUARDS.summary());
      const pageState = await page.evaluate(() => ({ hash: location.hash, meta: document.querySelector('meta[name="annals-runtime"]')?.content || '' }));
      const failures = [];
      if (pageState.hash !== `#s=${seed}`) failures.push(`expected hash #s=${seed}, received ${pageState.hash}`);
      if (!pageState.meta.includes('three-r128')) failures.push('runtime compatibility meta tag is missing');
      if (summary.runtime?.version !== 'v0.8') failures.push(`unexpected runtime version ${summary.runtime?.version}`);
      if (summary.runtime?.persistence !== 'none') failures.push('runtime persistence contract is not none');
      if (summary.dependencies?.threeRevision !== '128') failures.push(`unexpected Three.js revision ${summary.dependencies?.threeRevision}`);
      if (!summary.rng?.reproducible || !summary.rng?.separated) failures.push('RNG streams are not reproducible and separated');
      if (summary.rng?.generation === summary.rng?.history) failures.push('generation and history RNG digests are identical');
      if (!summary.world?.valid || summary.world.settlements < 3 || summary.world.roads < 1 || summary.world.buildings < 1) failures.push('world shape guard did not pass');
      if (!summary.boot?.ready || summary.boot.chronicleEntries < 1 || summary.boot.characters < 1) failures.push('boot readiness guard did not pass');
      if (summary.seed !== seed) failures.push(`guard summary seed ${summary.seed} does not match ${seed}`);
      if (consoleErrors.length) failures.push(`console errors: ${consoleErrors.join(' | ')}`);
      if (pageErrors.length) failures.push(`page errors: ${pageErrors.join(' | ')}`);
      result.summary = summary;
      result.pageState = pageState;
      result.failures = failures;
      result.passed = failures.length === 0;
    } catch (error) {
      result.error = error.message;
      result.consoleErrors = consoleErrors;
      result.pageErrors = pageErrors;
    } finally {
      results.push(result);
      await page.close();
    }
  }
} finally {
  await browser.close();
}

fs.writeFileSync(reportPath, `${JSON.stringify({ manifestModules: manifest.length, results }, null, 2)}\n`);
const failures = results.filter(result => !result.passed);
if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  throw new Error(`${failures.length} runtime guard smoke case(s) failed`);
}
console.log(JSON.stringify({ manifestModules: manifest.length, seeds: results.map(result => ({ seed: result.seed, summary: result.summary })) }, null, 2));
