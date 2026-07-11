import { chromium } from 'playwright';
import fs from 'node:fs';

const baseUrl = (process.env.ANNALS_BASE_URL || 'http://127.0.0.1:4173').replace(/\/$/, '');
const seeds = ['1234567', '987654', '424242'];
const reportPath = 'notable-life-smoke-report.json';
const results = [];
const requiredRoles = ['high priest', 'master of coin', 'smith', 'commander', 'prophet', 'bandit king'];
const inspectorLabels = ['Role', 'Age', 'House', 'Traits', 'Agenda', 'Spouse', 'Heirs', 'Grudges', 'Family and claim', 'Parents', 'Siblings', 'Children / heirs', 'Claim', 'Recurring life arc'];

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
    const result = { seed, passed: false, failures: [] };
    try {
      await page.goto(`${baseUrl}/annals.html#s=${seed}`, { waitUntil: 'domcontentloaded', timeout: 45_000 });
      await page.waitForFunction(() => Boolean(window.ANNALS_DEBUG?.lifeArcs) && window.ANNALS_GUARDS?.summary()?.boot?.ready === true, { timeout: 45_000 });

      const uiEvidence = await page.evaluate(() => {
        const summary = window.ANNALS_DEBUG.lifeArcs();
        const anchorId = summary.arcs[0]?.characterId;
        if (anchorId) window.showCharacter(anchorId);
        window.setDrawerTab('houses');
        return {
          anchorId,
          inspectorText: document.getElementById('inspect')?.textContent || '',
          housesText: document.getElementById('drawer')?.textContent || '',
          initialSummary: summary,
        };
      });

      const acceptance = await page.evaluate(seedValue => window.ANNALS_DEBUG.runNotableAcceptance(seedValue, 2400), seed);
      const hazards = await page.evaluate(seedValue => window.ANNALS_DEBUG.runNotableHazardMatrix(seedValue), seed);
      const failures = [];

      if (acceptance.initialLiving < 100 || acceptance.initialLiving > 140) failures.push(`initial living notable count ${acceptance.initialLiving} fell outside 100-140`);
      if (!acceptance.passed) failures.push('notable acceptance report did not pass');
      if (acceptance.final.registry > acceptance.final.limit || acceptance.final.limit !== 140) failures.push(`registry ${acceptance.final.registry}/${acceptance.final.limit} exceeded or did not expose the 140-person bound`);
      if (!acceptance.final.marriages.length) failures.push('no alliance marriage was recorded');
      if (!acceptance.final.births.length) failures.push('no child was born to a recorded marriage');
      if (!acceptance.final.inheritances.length) failures.push('no inheritance event was recorded');
      if (acceptance.reign <= 1 || !acceptance.reigns.length || !acceptance.successionEvents.length) failures.push('monarch death did not produce explicit succession evidence');

      const marriagePairs = new Set(acceptance.final.marriages.map(m => [m.aId, m.bId].sort().join('|')));
      for (const birth of acceptance.final.births) {
        if (!Array.isArray(birth.parentIds) || birth.parentIds.length !== 2) failures.push(`birth ${birth.id} did not retain two parents`);
        if (!marriagePairs.has([...birth.parentIds].sort().join('|'))) failures.push(`birth ${birth.id} was not linked to its recorded marriage`);
      }

      const arc = acceptance.final.recurringArcs[0];
      if (!arc || arc.eventCount < 3 || !Array.isArray(arc.entries) || arc.entries.length < 3) {
        failures.push('no named person completed a three-entry related Chronicle arc');
      } else {
        if (new Set(arc.entries.map(entry => entry.type)).size < 3) failures.push('the recurring arc did not contain three distinct stages');
        if (arc.entries.some(entry => !entry.text.includes(arc.character))) failures.push('one or more related Chronicle entries omitted the recurring person’s name');
        if (arc.entries.some(entry => entry.characterId !== arc.characterId || entry.theme !== arc.theme)) failures.push('related Chronicle entries did not retain the same person and theme');
      }

      for (const role of requiredRoles) {
        if (!acceptance.final.roles[role]) failures.push(`required notable role ${role} was absent`);
      }
      if (!hazards.passed) failures.push('the five-path notable hazard matrix did not pass');
      for (const category of ['age', 'battle', 'plague', 'assassination', 'disaster']) {
        const item = hazards.results.find(entry => entry.category === category);
        if (!item?.applied || item.deathCategory !== category || hazards.hazardDeaths[category] < 1) failures.push(`death pathway ${category} was not exercised`);
      }

      for (const label of inspectorLabels) {
        if (!uiEvidence.inspectorText.includes(label)) failures.push(`inspector omitted ${label}`);
      }
      if (!uiEvidence.housesText.includes('Families and remembered lives')) failures.push('Houses panel omitted the family and life-arc summary');
      if (consoleErrors.length) failures.push(`console errors: ${consoleErrors.join(' | ')}`);
      if (pageErrors.length) failures.push(`page errors: ${pageErrors.join(' | ')}`);

      result.uiEvidence = uiEvidence;
      result.acceptance = acceptance;
      result.hazards = hazards;
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
  throw new Error(`${failures.length} notable life smoke case(s) failed`);
}
console.log(JSON.stringify(results.map(result => ({
  seed: result.seed,
  initialLiving: result.acceptance.initialLiving,
  marriages: result.acceptance.final.marriages.length,
  births: result.acceptance.final.births.length,
  inheritances: result.acceptance.final.inheritances.length,
  recurringArc: result.acceptance.final.recurringArcs[0]?.eventCount || 0,
  reign: result.acceptance.reign,
  hazards: result.hazards.hazardDeaths,
})), null, 2));