import { chromium } from 'playwright';
import fs from 'node:fs';

const baseUrl = (process.env.ANNALS_BASE_URL || 'http://127.0.0.1:4173').replace(/\/$/, '');
const seeds = ['1234567', '987654', '424242'];
const expectedGoods = ['grain', 'fish', 'timber', 'ore', 'tools', 'cloth', 'wine'];
const reportPath = 'economy-smoke-report.json';
const results = [];
const browser = await chromium.launch({ headless: true });
try {
  for (const seed of seeds) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const consoleErrors = [];
    const pageErrors = [];
    page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    page.on('pageerror', error => pageErrors.push(error.message));
    const result = { seed, passed: false, failures: [] };
    try {
      await page.goto(`${baseUrl}/annals.html#s=${seed}`, { waitUntil: 'domcontentloaded', timeout: 45_000 });
      await page.waitForFunction(() => Boolean(window.ANNALS_DEBUG?.runEconomyAcceptance) && window.ANNALS_GUARDS?.summary()?.boot?.ready === true, { timeout: 45_000 });
      const ui = await page.evaluate(() => {
        showInspector({ kind: 'settlement', settlement: world.settlements[0] });
        setDrawerTab('rates');
        return {
          inspector: document.getElementById('inspect').innerText,
          drawer: document.getElementById('drawer').innerText,
        };
      });
      const evidence = await page.evaluate(seedValue => window.ANNALS_DEBUG.runEconomyAcceptance(seedValue), seed);
      const failures = result.failures;
      if (!evidence.passed) failures.push('50-year economy acceptance did not pass');
      if (JSON.stringify(evidence.summary.goods) !== JSON.stringify(expectedGoods)) failures.push(`goods differed: ${JSON.stringify(evidence.summary.goods)}`);
      for (const [name, passed] of Object.entries(evidence.checks || {})) if (!passed) failures.push(`economy check failed: ${name}`);
      for (const good of expectedGoods) {
        if (!ui.inspector.toLowerCase().includes(good)) failures.push(`inspector omitted ${good}`);
      }
      if (!ui.inspector.includes('Production and need')) failures.push('inspector omitted production and need');
      if (!ui.drawer.includes('Economic accounts')) failures.push('Rates panel omitted economic accounts');
      if ((evidence.summary.completedByMode?.road || 0) < 1) failures.push('no road caravan completed');
      if ((evidence.summary.highValueArrivals || 0) < 1) failures.push('no high-value arbitrage trade completed');
      if ((evidence.summary.ports?.length || 0) >= 2 && (evidence.summary.completedByMode?.cog || 0) < 1) failures.push('coastal realm completed no cog trade');
      for (const key of ['war', 'plague', 'bandit', 'drought']) if ((evidence.summary.disruptions?.[key] || 0) < 1) failures.push(`no ${key} disruption recorded`);
      if ((evidence.summary.conversion?.toolsProduced || 0) < 1 || (evidence.summary.conversion?.oreConsumed || 0) < 1 || (evidence.summary.conversion?.timberConsumed || 0) < 1) failures.push('tool conversion did not consume ore and timber');
      if ((evidence.summary.hungerCascade?.mortality || 0) < 1 || (evidence.summary.hungerCascade?.migrated || 0) < 1) failures.push('hunger cascade did not produce mortality and migration');
      if ((evidence.summary.harvestTaxCollected || 0) <= 0) failures.push('harvest taxation collected no revenue');
      const spendTotal = Object.values(evidence.summary.spending || {}).reduce((sum, value) => sum + value, 0);
      if (!(spendTotal > 0) || !(evidence.summary.spending?.armies > 0)) failures.push('treasury spending pressure was not observed');
      const { low, high } = evidence.taxProbe || {};
      if (!(high?.taxCollected > low?.taxCollected)) failures.push('higher tax did not increase revenue');
      if (!(high?.loyalty < low?.loyalty)) failures.push('higher tax did not reduce house loyalty');
      if (!(high?.unrest > low?.unrest)) failures.push('higher tax did not increase unrest');
      if (consoleErrors.length) failures.push(`console errors: ${consoleErrors.join(' | ')}`);
      if (pageErrors.length) failures.push(`page errors: ${pageErrors.join(' | ')}`);
      result.ui = ui;
      result.evidence = evidence;
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

const coastal = results.filter(result => (result.evidence?.summary?.ports?.length || 0) >= 2);
if (!coastal.length) results[0].failures.push('maintained seeds contained no two-port coastal realm for cog validation');
else if (!coastal.some(result => (result.evidence?.summary?.completedByMode?.cog || 0) > 0)) coastal[0].failures.push('no maintained coastal seed completed a cog voyage');
for (const result of results) result.passed = !result.error && result.failures.length === 0;
fs.writeFileSync(reportPath, `${JSON.stringify(results, null, 2)}\n`);
const failures = results.filter(result => !result.passed);
if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  throw new Error(`${failures.length} economy acceptance case(s) failed`);
}
console.log(JSON.stringify(results.map(result => ({
  seed: result.seed,
  treasury: result.evidence.summary.treasury,
  roadArrivals: result.evidence.summary.completedByMode.road,
  cogArrivals: result.evidence.summary.completedByMode.cog,
  disruptions: result.evidence.summary.disruptions,
  hungerCascade: result.evidence.summary.hungerCascade,
  taxProbe: result.evidence.taxProbe,
})), null, 2));