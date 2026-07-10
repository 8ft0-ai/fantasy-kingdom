import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const baseUrl = (process.env.ANNALS_BASE_URL || 'http://127.0.0.1:4173').replace(/\/$/, '');
const screenshotsDir = 'screenshots';
const reportPath = 'browser-smoke-report.json';
const testCases = [
  { name: 'annals-seed-1234567', path: '/annals.html#s=1234567', expectedHash: '#s=1234567', expectedPath: /\/annals\.html$/ },
  { name: 'annals-seed-987654', path: '/annals.html#s=987654', expectedHash: '#s=987654', expectedPath: /\/annals\.html$/ },
  { name: 'annals-seed-424242', path: '/annals.html#s=424242', expectedHash: '#s=424242', expectedPath: /\/annals\.html$/ },
  { name: 'index-seed-1234567', path: '/index.html#s=1234567', expectedHash: '#s=1234567', expectedPath: /\/annals\.html$/ },
];

fs.mkdirSync(screenshotsDir, { recursive: true });

async function waitForServer() {
  const deadline = Date.now() + 30_000;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/index.html`, { redirect: 'manual' });
      if (response.ok) return;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  throw new Error(`Static server did not become ready at ${baseUrl}: ${lastError?.message || 'unknown error'}`);
}

function fail(message, details = {}) {
  const error = new Error(message);
  error.details = details;
  return error;
}

function normaliseConsoleText(text) {
  return text.replace(/\s+/g, ' ').trim();
}

await waitForServer();

const browser = await chromium.launch({ headless: true });
const report = [];

try {
  for (const testCase of testCases) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const consoleErrors = [];
    const pageErrors = [];
    const failedRequests = [];
    const url = `${baseUrl}${testCase.path}`;

    page.on('console', message => {
      if (message.type() === 'error') {
        consoleErrors.push(normaliseConsoleText(message.text()));
      }
    });
    page.on('pageerror', error => {
      pageErrors.push(error.message);
    });
    page.on('requestfailed', request => {
      const requestUrl = request.url();
      if (request.resourceType() === 'script' || request.resourceType() === 'document') {
        failedRequests.push({ url: requestUrl, failure: request.failure()?.errorText || 'unknown failure' });
      }
    });

    const result = { name: testCase.name, url, passed: false };

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45_000 });

      await page.waitForFunction(() => {
        const forge = document.querySelector('#forge, #f');
        if (!forge) return true;
        const style = getComputedStyle(forge);
        const text = (forge.textContent || '').toLowerCase();
        const hidden = style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0' || forge.classList.contains('hidden');
        return hidden || !text.includes('forging');
      }, { timeout: 45_000 });

      await page.waitForFunction(() => {
        const canvas = document.querySelector('canvas');
        const entries = document.querySelectorAll('.entry, .e').length;
        const debugReady = Boolean(window.ANNALS_DEBUG);
        if (!canvas || !debugReady || entries < 1) return false;
        const rect = canvas.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      }, { timeout: 30_000 });

      await page.waitForTimeout(750);

      const state = await page.evaluate(() => {
        const canvas = document.querySelector('canvas');
        const rect = canvas?.getBoundingClientRect();
        let hasWebGLContext = false;
        if (canvas) {
          hasWebGLContext = Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl') || canvas.getContext('webgl2'));
        }
        return {
          title: document.title,
          pathname: location.pathname,
          hash: location.hash,
          hasDebug: Boolean(window.ANNALS_DEBUG),
          canvasCount: document.querySelectorAll('canvas').length,
          canvasWidth: rect?.width || 0,
          canvasHeight: rect?.height || 0,
          hasWebGLContext,
          chronicleEntries: document.querySelectorAll('.entry, .e').length,
          forgeText: document.querySelector('#forge, #f')?.textContent || '',
          bodyClass: document.body.className,
        };
      });

      const assertions = [];
      if (!testCase.expectedPath.test(state.pathname)) assertions.push(`expected final path to match ${testCase.expectedPath}, got ${state.pathname}`);
      if (state.hash !== testCase.expectedHash) assertions.push(`expected hash ${testCase.expectedHash}, got ${state.hash}`);
      if (!state.hasDebug) assertions.push('window.ANNALS_DEBUG was not present');
      if (state.canvasCount < 1) assertions.push('no canvas was rendered');
      if (state.canvasWidth <= 0 || state.canvasHeight <= 0) assertions.push(`canvas size was invalid: ${state.canvasWidth}x${state.canvasHeight}`);
      if (!state.hasWebGLContext) assertions.push('canvas did not expose a WebGL context');
      if (state.chronicleEntries < 1) assertions.push('Chronicle did not render any entries');
      if (consoleErrors.length) assertions.push(`console errors: ${consoleErrors.join(' | ')}`);
      if (pageErrors.length) assertions.push(`page errors: ${pageErrors.join(' | ')}`);
      if (failedRequests.length) assertions.push(`failed critical requests: ${failedRequests.map(r => `${r.url} (${r.failure})`).join(' | ')}`);

      result.state = state;
      result.consoleErrors = consoleErrors;
      result.pageErrors = pageErrors;
      result.failedRequests = failedRequests;
      result.passed = assertions.length === 0;
      if (assertions.length) result.assertions = assertions;

      await page.screenshot({ path: path.join(screenshotsDir, `${testCase.name}.png`), fullPage: false });
    } catch (error) {
      result.error = error.message;
      if (error.details) result.details = error.details;
      result.consoleErrors = consoleErrors;
      result.pageErrors = pageErrors;
      result.failedRequests = failedRequests;
      try {
        await page.screenshot({ path: path.join(screenshotsDir, `${testCase.name}-failure.png`), fullPage: false });
      } catch {
        // Ignore screenshot failures so the primary assertion error is preserved.
      }
    } finally {
      report.push(result);
      await page.close();
    }
  }
} finally {
  await browser.close();
}

fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

const failures = report.filter(item => !item.passed);
if (failures.length > 0) {
  console.error(JSON.stringify(failures, null, 2));
  throw fail(`${failures.length} ANNALS browser smoke case(s) failed`);
}

console.log(JSON.stringify(report, null, 2));
