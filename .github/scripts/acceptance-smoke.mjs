import { chromium } from 'playwright';
import fs from 'node:fs';

const baseUrl = (process.env.ANNALS_BASE_URL || 'http://127.0.0.1:4173').replace(/\/$/, '');
const seeds = ['1234567', '987654', '424242'];
const reportPath = 'acceptance-smoke-report.json';
const results = [];

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
      await page.waitForFunction(() => Boolean(window.ANNALS_DEBUG?.runAcceptance) && window.ANNALS_GUARDS?.summary()?.boot?.ready === true, { timeout: 45_000 });
      const evidence = await page.evaluate(seedValue => {
        const windows = window.ANNALS_DEBUG.acceptanceWindows;
        return window.ANNALS_DEBUG.runAcceptance(seedValue, windows.thirtyMinuteDays);
      }, seed);

      const failures = result.failures;
      if (!evidence.knownSeed) failures.push('seed was not registered as a regression seed');
      if (JSON.stringify(evidence.knownSeeds) !== JSON.stringify(seeds)) failures.push(`known seed list differed: ${JSON.stringify(evidence.knownSeeds)}`);
      if (evidence.windows.fiveMinuteDays !== 2400 || evidence.windows.thirtyMinuteDays !== 14400) failures.push('acceptance windows did not match the default 8 days/second pace');
      if (!evidence.generation?.passed) failures.push(`generation exceeded ${evidence.generation?.limitMs} ms or failed`);
      if (!evidence.fiveMinute?.complete || !evidence.fiveMinute?.passed) failures.push('five-minute acceptance did not pass');
      if (!evidence.thirtyMinute?.complete || !evidence.thirtyMinute?.passed) failures.push('30-minute acceptance did not pass');
      const fiveChecks = evidence.fiveMinute?.checks || {};
      for (const key of ['seasonChange', 'chronicleEntries', 'namedCharacterEvent', 'visibleIncident', 'visibleGrowth']) {
        if (!fiveChecks[key]) failures.push(`five-minute check failed: ${key}`);
      }
      if ((evidence.fiveMinute?.evidence?.chronicleEntries || 0) < 8) failures.push('fewer than eight Chronicle entries were recorded');
      if ((evidence.fiveMinute?.evidence?.buildingsAdded || 0) < 1) failures.push('no visible settlement growth was recorded');
      if (!evidence.thirtyMinute?.checks?.successionOrWar) failures.push('neither succession nor war occurred in the 30-minute window');
      for (const key of ['successions', 'wars', 'battles', 'peace', 'disasters', 'growthEvents']) {
        if (!Number.isFinite(evidence.thirtyMinute?.evidence?.[key])) failures.push(`30-minute counter was not finite: ${key}`);
      }
      if ((evidence.thirtyMinute?.evidence?.battles || 0) < 1) failures.push('no battle was recorded in the longer acceptance run');
      if ((evidence.thirtyMinute?.evidence?.peace || 0) < 1) failures.push('no peace outcome was recorded in the longer acceptance run');
      if ((evidence.thirtyMinute?.evidence?.disasters || 0) < 1) failures.push('no disaster was recorded in the longer acceptance run');
      if (!evidence.stability?.finite) failures.push('acceptance run ended with a non-finite simulation value');
      if (consoleErrors.length) failures.push(`console errors: ${consoleErrors.join(' | ')}`);
      if (pageErrors.length) failures.push(`page errors: ${pageErrors.join(' | ')}`);
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
  throw new Error(`${failures.length} acceptance harness case(s) failed`);
}
console.log(JSON.stringify(results.map(result => ({
  seed: result.seed,
  fiveMinute: result.evidence.fiveMinute.evidence,
  thirtyMinute: result.evidence.thirtyMinute.evidence,
  durationMs: result.evidence.durationMs,
})), null, 2));
