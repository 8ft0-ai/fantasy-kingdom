import { chromium } from 'playwright';
import fs from 'node:fs';

const baseUrl = (process.env.ANNALS_BASE_URL || 'http://127.0.0.1:4173').replace(/\/$/, '');
const seeds = ['1234567', '987654', '424242'];
const reportPath = 'culture-smoke-report.json';
const results = [];

function failure(message) {
  throw new Error(message);
}

const browser = await chromium.launch({ headless: true });
try {
  for (const seed of seeds) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const consoleErrors = [];
    const pageErrors = [];
    page.on('console', message => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', error => pageErrors.push(error.message));
    const result = { seed, passed: false };
    try {
      await page.goto(`${baseUrl}/annals.html#s=${seed}`, { waitUntil: 'domcontentloaded', timeout: 45_000 });
      await page.waitForFunction(() => Boolean(window.ANNALS_DEBUG?.cultureSummary) && window.ANNALS_GUARDS?.summary()?.boot?.ready === true, { timeout: 45_000 });
      const evidence = await page.evaluate(() => {
        window.setDrawerTab('houses');
        const summary = window.ANNALS_DEBUG.cultureSummary();
        const uiSigils = [...document.querySelectorAll('.house-card .house-sigil')].map(image => ({
          signature: image.dataset.sigil,
          src: image.getAttribute('src') || '',
          alt: image.getAttribute('alt') || '',
        }));
        const beforeWar = window.ANNALS_DEBUG.heraldry();
        const campaignId = window.ANNALS_DEBUG.startCivilWar();
        const afterWar = window.ANNALS_DEBUG.heraldry();
        return {
          summary,
          uiSigils,
          beforeWar,
          afterWar,
          campaignId,
          documentTitle: document.title,
          hash: location.hash,
          chronicleText: [...document.querySelectorAll('.entry .txt')].map(node => node.textContent || '').join(' '),
        };
      });

      const failures = [];
      const { summary } = evidence;
      if (evidence.hash !== `#s=${seed}`) failures.push(`expected #s=${seed}, received ${evidence.hash}`);
      if (evidence.documentTitle !== summary.fullTitle) failures.push(`document title ${evidence.documentTitle} did not match ${summary.fullTitle}`);
      if (!summary.allPlacesMatch || summary.suffixMatches !== summary.places.length) failures.push('one or more settlement names fell outside the selected phonology suffix bank');
      if (summary.culture.male.length < 4 || summary.culture.female.length < 4 || summary.culture.neutral.length < 2) failures.push('gendered given-name banks were incomplete');
      if (summary.distinctSigils !== summary.houses.length) failures.push(`expected ${summary.houses.length} distinct sigils, received ${summary.distinctSigils}`);
      if (new Set(summary.houses.map(house => house.name)).size !== summary.houses.length) failures.push('house names were not unique');
      if (evidence.uiSigils.length !== summary.houses.length) failures.push(`expected ${summary.houses.length} Houses-panel sigils, received ${evidence.uiSigils.length}`);
      if (evidence.uiSigils.some(item => !item.src.startsWith('data:image/png;base64,') || !item.signature || !item.alt.includes('Sigil of'))) failures.push('one or more UI sigils lacked generated image data or identity metadata');
      if (evidence.beforeWar.worldBanners < summary.places.length) failures.push(`expected at least ${summary.places.length} settlement banners, received ${evidence.beforeWar.worldBanners}`);
      if (!evidence.campaignId) failures.push('civil-war fixture did not start');
      if (evidence.afterWar.armyBanners < 2) failures.push(`expected at least two army sigil banners, received ${evidence.afterWar.armyBanners}`);
      const houseSignatures = new Set(summary.houses.map(house => house.sigil.signature));
      if (evidence.afterWar.armySignatures.some(signature => !houseSignatures.has(signature))) failures.push('an army banner used a sigil not owned by a generated house');
      const coherentNames = [summary.title, ...summary.places.slice(0, 3), ...summary.houses.slice(0, 2).map(house => house.name.replace(/^House /, ''))];
      if (!coherentNames.some(name => evidence.chronicleText.includes(name))) failures.push('Chronicle text did not use generated realm, place or house names');
      if (!window) failure('unreachable');

      await page.reload({ waitUntil: 'domcontentloaded', timeout: 45_000 });
      await page.waitForFunction(() => Boolean(window.ANNALS_DEBUG?.cultureSummary) && window.ANNALS_GUARDS?.summary()?.boot?.ready === true, { timeout: 45_000 });
      const repeat = await page.evaluate(() => window.ANNALS_DEBUG.cultureSummary());
      if (repeat.signature !== summary.signature) failures.push('same-seed reload changed names or sigils');
      if (consoleErrors.length) failures.push(`console errors: ${consoleErrors.join(' | ')}`);
      if (pageErrors.length) failures.push(`page errors: ${pageErrors.join(' | ')}`);

      result.evidence = evidence;
      result.repeatSignature = repeat.signature;
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

const passingTitles = results.filter(result => result.passed).map(result => result.evidence.summary.title);
if (passingTitles.length === seeds.length && new Set(passingTitles).size !== seeds.length) {
  results[0].passed = false;
  results[0].failures = [...(results[0].failures || []), 'regression seeds did not produce distinct realm titles'];
}

fs.writeFileSync(reportPath, `${JSON.stringify(results, null, 2)}\n`);
const failures = results.filter(result => !result.passed);
if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  failure(`${failures.length} culture and heraldry smoke case(s) failed`);
}
console.log(JSON.stringify(results.map(result => ({ seed: result.seed, title: result.evidence.summary.title, culture: result.evidence.summary.culture.id, sigils: result.evidence.summary.distinctSigils, banners: result.evidence.afterWar })), null, 2));
