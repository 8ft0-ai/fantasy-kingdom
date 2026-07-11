import { chromium } from 'playwright';
import fs from 'node:fs';

const baseUrl = (process.env.ANNALS_BASE_URL || 'http://127.0.0.1:4173').replace(/\/$/, '');
const cases = [
  { seed: '1234567', years: 20 },
  { seed: '987654', years: 20 },
  { seed: '424242', years: 20 },
  { seed: '1234567', years: 50 },
  { seed: '1234567', years: 200 },
];
const reportPath = 'soak-regression-report.json';

async function waitForServer() {
  const deadline = Date.now() + 30_000;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/annals.html`, { redirect: 'manual' });
      if (response.ok) return;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  throw new Error(`Static server did not become ready: ${lastError?.message || 'unknown error'}`);
}

await waitForServer();
const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const testCase of cases) {
    const page = await browser.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    page.on('console', message => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', error => pageErrors.push(error.message));
    const result = { ...testCase, passed: false };
    try {
      await page.goto(`${baseUrl}/annals.html#s=${testCase.seed}`, { waitUntil: 'domcontentloaded', timeout: 45_000 });
      await page.waitForFunction(() => Boolean(window.ANNALS_DEBUG?.runSoak), { timeout: 45_000 });
      const soak = await page.evaluate(({ seed, years }) => window.ANNALS_DEBUG.runSoak(seed, years), testCase, { timeout: 300_000 });
      result.soak = soak;
      result.consoleErrors = consoleErrors;
      result.pageErrors = pageErrors;
      const failures = [...(soak.failures || [])];
      if (!soak.passed) failures.push('soak report did not pass');
      if (soak.requestedYears !== testCase.years) failures.push(`expected ${testCase.years} requested years, got ${soak.requestedYears}`);
      if (soak.final?.completedYears !== testCase.years) failures.push(`expected ${testCase.years} completed years, got ${soak.final?.completedYears}`);
      if (testCase.years === 200 && soak.final?.warsCompleted < 10) failures.push(`expected recurring wars, got ${soak.final?.warsCompleted}`);
      if (testCase.years === 200 && soak.final?.reigns < 20) failures.push(`expected recurring reigns, got ${soak.final?.reigns}`);
      if (testCase.years === 200 && soak.final?.deaths < 100) failures.push(`expected visible life turnover, got ${soak.final?.deaths}`);
      if (soak.durationMs > 240_000) failures.push(`soak took ${soak.durationMs}ms, above 240000ms limit`);
      if (consoleErrors.length) failures.push(`console errors: ${consoleErrors.join(' | ')}`);
      if (pageErrors.length) failures.push(`page errors: ${pageErrors.join(' | ')}`);
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

fs.writeFileSync(reportPath, `${JSON.stringify(results, null, 2)}\n`);
const failures = results.filter(result => !result.passed);
if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  throw new Error(`${failures.length} long-run soak case(s) failed`);
}
console.log(JSON.stringify(results.map(result => ({ seed: result.seed, years: result.years, durationMs: result.soak.durationMs, final: result.soak.final })), null, 2));
