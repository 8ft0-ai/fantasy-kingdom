import { chromium } from 'playwright';
import fs from 'node:fs';

const baseUrl = (process.env.ANNALS_BASE_URL || 'http://127.0.0.1:4173').replace(/\/$/, '');
const seed = '1234567';
const expectedTitle = 'The Annals of Reedfen';
const expectedSettlement = 'Bellford';
const reportPath = 'tutorial-smoke-report.json';
const screenshotPath = 'screenshots/tutorial-smoke.png';
const result = { seed, passed: false, checks: {}, evidence: {}, failures: [] };

function record(name, passed, detail = null) {
  result.checks[name] = Boolean(passed);
  if (detail !== null) result.evidence[name] = detail;
  if (!passed) result.failures.push(name);
}

fs.mkdirSync('screenshots', { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
const page = await context.newPage();
const consoleErrors = [];
const pageErrors = [];
page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('pageerror', error => pageErrors.push(error.message));

try {
  await page.goto(`${baseUrl}/annals.html#s=${seed}`, { waitUntil: 'domcontentloaded', timeout: 45_000 });
  await page.waitForFunction(() => window.ANNALS_GUARDS?.summary()?.boot?.ready === true, { timeout: 45_000 });

  const start = await page.evaluate(() => ({
    title: document.title,
    heading: document.getElementById('title')?.textContent?.trim(),
    hash: location.hash,
    forgeDisplay: getComputedStyle(document.getElementById('forge')).display,
    chronicleEntries: document.querySelectorAll('#entries .entry').length,
    day: clock.day,
  }));
  result.evidence.start = start;
  record('realm title', start.title === expectedTitle && start.heading === expectedTitle, start.title);
  record('seed retained', start.hash === `#s=${seed}`, start.hash);
  record('forge cleared', start.forgeDisplay === 'none', start.forgeDisplay);
  record('opening Chronicle available', start.chronicleEntries > 0, start.chronicleEntries);

  const dayBeforeSpeed = await page.evaluate(() => clock.day);
  await page.keyboard.press('2');
  await page.waitForFunction(day => clock.speed === 2 && clock.day > day, dayBeforeSpeed, { timeout: 5_000 });
  const running = await page.evaluate(() => ({ speed: clock.speed, day: clock.day }));
  record('4x speed advances time', running.speed === 2 && running.day > dayBeforeSpeed, running);

  await page.keyboard.press('Space');
  await page.waitForFunction(() => clock.speed === 0, { timeout: 2_000 });
  await page.waitForTimeout(100);
  const pausedDay = await page.evaluate(() => clock.day);
  await page.waitForTimeout(350);
  const pausedAfter = await page.evaluate(() => clock.day);
  record('pause stops time', pausedAfter === pausedDay, { pausedDay, pausedAfter });

  await page.keyboard.press('c');
  await page.waitForFunction(() => document.body.classList.contains('watch'), { timeout: 2_000 });
  const watch = await page.evaluate(() => ({
    drawer: getComputedStyle(document.getElementById('drawer')).display,
    chronicle: getComputedStyle(document.getElementById('chron')).display,
    speed: getComputedStyle(document.getElementById('speed')).display,
    chip: (() => {
      const element = document.querySelector('.camera-watch');
      return element ? getComputedStyle(element).display : null;
    })(),
  }));
  record('Watch mode presents cinematic UI', watch.drawer === 'none' && watch.chronicle === 'none' && watch.speed === 'none' && watch.chip !== null && watch.chip !== 'none', watch);

  await page.keyboard.press('c');
  await page.waitForFunction(() => !document.body.classList.contains('watch'), { timeout: 2_000 });
  record('Watch mode exits', await page.evaluate(() => getComputedStyle(document.getElementById('drawer')).display !== 'none'));

  await page.getByRole('button', { name: 'World', exact: true }).click();
  await page.getByRole('button', { name: expectedSettlement, exact: true }).click();
  const inspector = page.locator('#inspect');
  await inspector.waitFor({ state: 'visible', timeout: 3_000 });
  const inspectorText = (await inspector.textContent()) || '';
  record('Bellford inspector opens', ['Bellford', 'Type', 'Lots', 'Districts', 'Stores', 'State'].every(text => inspectorText.includes(text)), inspectorText);

  const capitalEntry = page.locator('#entries .entry').filter({ hasText: 'coronation' }).filter({ hasText: expectedSettlement }).first();
  record('Bellford coronation entry available', await capitalEntry.count() === 1);
  await capitalEntry.click();
  await page.waitForTimeout(2_000);

  await page.getByRole('button', { name: 'Acts', exact: true }).click();
  await page.getByRole('button', { name: 'Proclaim festival', exact: true }).click();
  await page.waitForFunction(() => document.body.classList.contains('targeting-act'), { timeout: 2_000 });
  const placementPoint = await page.evaluate(settlementName => {
    const settlement = world.settlements.find(item => item.name === settlementName);
    if (!settlement || !renderer?.domElement || !camera || typeof THREE === 'undefined') return null;
    const rect = renderer.domElement.getBoundingClientRect();
    const point = new THREE.Vector3(settlement.x, Math.max(settlement.y || 0, hWorld(settlement.x, settlement.z)) + 30, settlement.z).project(camera);
    return {
      x: rect.left + (point.x * 0.5 + 0.5) * rect.width,
      y: rect.top + (-point.y * 0.5 + 0.5) * rect.height,
    };
  }, expectedSettlement);
  if (!placementPoint || !Number.isFinite(placementPoint.x) || !Number.isFinite(placementPoint.y)) throw new Error('Bellford was not available for festival placement');
  result.evidence.placementPoint = placementPoint;
  await page.mouse.click(placementPoint.x, placementPoint.y);
  await page.waitForFunction(settlement => [...document.querySelectorAll('#entries .entry')].some(entry => entry.textContent?.includes('festival') && entry.textContent?.includes(settlement)), expectedSettlement, { timeout: 5_000 });
  const festival = await page.evaluate(settlement => {
    const entry = [...document.querySelectorAll('#entries .entry')].find(item => item.textContent?.includes('festival') && item.textContent?.includes(settlement));
    return {
      text: entry?.textContent?.replace(/\s+/g, ' ').trim() || '',
      inspectorTitle: document.querySelector('#inspect .inspector-title')?.textContent?.trim() || '',
      pendingAct: productUiState().pendingAct,
    };
  }, expectedSettlement);
  record('festival is placed at Bellford', festival.text.includes('A royal festival was proclaimed in Bellford') && festival.inspectorTitle === expectedSettlement && festival.pendingAct === null, festival);

  await page.getByRole('button', { name: 'World', exact: true }).click();
  await page.evaluate(() => {
    window.__tutorialCopiedLink = null;
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async text => { window.__tutorialCopiedLink = text; } },
    });
  });
  await page.getByRole('button', { name: 'Copy link', exact: true }).click();
  await page.waitForFunction(() => typeof window.__tutorialCopiedLink === 'string', { timeout: 2_000 });
  const copiedLink = await page.evaluate(() => window.__tutorialCopiedLink);
  record('Copy link retains the seed', copiedLink === `${baseUrl}/annals.html#s=${seed}`, copiedLink);

  const sharedPage = await context.newPage();
  await sharedPage.goto(copiedLink, { waitUntil: 'domcontentloaded', timeout: 45_000 });
  await sharedPage.waitForFunction(() => window.ANNALS_GUARDS?.summary()?.boot?.ready === true, { timeout: 45_000 });
  const shared = await sharedPage.evaluate(() => ({ title: document.title, hash: location.hash }));
  record('shared link recreates the initial realm', shared.title === expectedTitle && shared.hash === `#s=${seed}`, shared);
  await sharedPage.close();

  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 5_000 }),
    page.getByRole('button', { name: 'Export Chronicle', exact: true }).click(),
  ]);
  const downloadPath = await download.path();
  const exportText = downloadPath ? fs.readFileSync(downloadPath, 'utf8') : '';
  const exportEvidence = {
    filename: download.suggestedFilename(),
    hasTitle: exportText.includes('THE ANNALS OF REEDFEN'),
    hasSeed: exportText.includes(`Seed ${seed}`),
    hasFestival: exportText.includes('A royal festival was proclaimed in Bellford'),
  };
  record('Chronicle export matches the journey', exportEvidence.filename === `annals-${seed}.txt` && exportEvidence.hasTitle && exportEvidence.hasSeed && exportEvidence.hasFestival, exportEvidence);

  await page.screenshot({ path: screenshotPath, fullPage: true });
  record('no browser errors', consoleErrors.length === 0 && pageErrors.length === 0, { consoleErrors, pageErrors });
  result.passed = result.failures.length === 0;
} catch (error) {
  result.error = error.message;
  result.consoleErrors = consoleErrors;
  result.pageErrors = pageErrors;
  try { await page.screenshot({ path: screenshotPath, fullPage: true }); } catch {}
} finally {
  await context.close();
  await browser.close();
}

fs.writeFileSync(reportPath, `${JSON.stringify(result, null, 2)}\n`);
if (!result.passed) {
  console.error(JSON.stringify(result, null, 2));
  throw new Error(`first-kingdom tutorial acceptance failed: ${result.failures.join(', ') || result.error || 'unknown failure'}`);
}
console.log(JSON.stringify({ seed, checks: result.checks, export: result.evidence['Chronicle export matches the journey'] }, null, 2));
