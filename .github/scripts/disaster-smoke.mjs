import { chromium } from 'playwright';
import fs from 'node:fs';

const baseUrl = (process.env.ANNALS_BASE_URL || 'http://127.0.0.1:4173').replace(/\/$/, '');
const seeds = ['1234567', '987654', '424242'];
const reportPath = 'disaster-smoke-report.json';
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
      await page.waitForFunction(() => Boolean(window.ANNALS_DEBUG?.runDisasterAcceptance) && window.ANNALS_GUARDS?.summary()?.boot?.ready === true, { timeout: 45_000 });
      const ui = await page.evaluate(() => {
        setDrawerTab('world');
        showInspector({ kind: 'settlement', settlement: world.settlements[0] });
        startUrbanFire(world.settlements[0], { weather: 'Clear', drought: true });
        updateThreatMarkers();
        return {
          drawer: document.getElementById('drawer').innerText,
          inspector: document.getElementById('inspect').innerText,
          markerCount: typeof disasterMarkerGroup !== 'undefined' ? disasterMarkerGroup.children.length : 0,
        };
      });
      const evidence = await page.evaluate(seedValue => window.ANNALS_DEBUG.runDisasterAcceptance(seedValue), seed);
      const failures = result.failures;
      if (!evidence.passed) failures.push('disaster acceptance did not pass');
      for (const [name, passed] of Object.entries(evidence.checks || {})) if (!passed) failures.push(`disaster check failed: ${name}`);
      if (!evidence.plague?.spread || !evidence.plague?.quarantined) failures.push('plague did not spread by trade and trigger quarantine');
      if (!(evidence.fire?.dry > evidence.fire?.rain)) failures.push('rain did not reduce adjacent fire spread');
      if (!((evidence.flood?.damagedLotIds?.length || 0) + (evidence.flood?.bridges?.length || 0))) failures.push('flood damaged neither riverside lots nor bridges');
      if (!(evidence.quake?.radius > 0) || !(evidence.quake?.damagedLotIds?.length > 0)) failures.push('earthquake produced no bounded radius damage');
      if (!(evidence.dragon?.treasuryAfter < evidence.dragon?.treasuryBefore)) failures.push('dragon raid did not reduce treasury');
      if (!(evidence.dragon?.ruinsAfter > evidence.dragon?.ruinsBefore)) failures.push('dragon raid did not damage settlement buildings');
      if (evidence.dragon?.legitimacyAfter === evidence.dragon?.legitimacyBefore) failures.push('dragon outcome did not change legitimacy');
      if (!evidence.bandit?.kingId || !evidence.bandit?.bounty) failures.push('bandit camp did not escalate and respond to a bounty');
      if (!(evidence.myth?.off?.omens === 0 && evidence.myth?.off?.dragonRaids === 0)) failures.push('Myth Off still produced mythical events');
      if (!(evidence.myth?.high?.omens > evidence.myth?.low?.omens)) failures.push('Myth High did not increase omen frequency');
      if (!evidence.myth?.high?.prophet) failures.push('Myth High produced no named prophet');
      if (!ui.drawer.includes('Disasters and Myth') || !ui.drawer.includes('Myth Off') || !ui.drawer.includes('Myth High')) failures.push('drawer omitted Myth controls and disaster ledger');
      if (!ui.inspector.includes('Disaster exposure')) failures.push('settlement inspector omitted disaster exposure');
      if (ui.markerCount < 1) failures.push('procedural disaster markers were not visible');
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

fs.writeFileSync(reportPath, `${JSON.stringify(results, null, 2)}\n`);
const failures = results.filter(result => !result.passed);
if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  throw new Error(`${failures.length} disaster acceptance case(s) failed`);
}
console.log(JSON.stringify(results.map(result => ({
  seed: result.seed,
  fire: result.evidence.fire,
  floodLots: result.evidence.flood.damagedLotIds.length,
  floodBridges: result.evidence.flood.bridges.length,
  quakeLots: result.evidence.quake.damagedLotIds.length,
  dragon: result.evidence.dragon.raid,
  myth: result.evidence.myth,
})), null, 2));
