# Run the regression baseline

Use this guide before opening a pull request that changes ANNALS behaviour or its generated runtime.

## 1. Check generated output

Run:

```bash
python3 scripts/build.py --check
```

Resolve any stale runtime or manifest error before continuing.

## 2. Start the local test server

The browser suites expect the repository at port `4173`:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Leave the server running in that terminal.

## 3. Install the browser-test dependency

In another terminal:

```bash
npm install --no-save playwright
npx playwright install chromium
```

## 4. Run the core browser checks

Set the local base URL and run the smoke and guard suites:

```bash
export ANNALS_BASE_URL=http://127.0.0.1:4173
node .github/scripts/browser-smoke.mjs
node .github/scripts/runtime-guard-smoke.mjs
```

Run the Chronicle regression suite:

```bash
node .github/scripts/chronicle-regression.mjs
```

## 5. Run affected subsystem checks

The Browser smoke workflow also runs focused suites for culture, acceptance, notable lives, economy, disasters, war, camera, rendering, overlays and performance. Run the scripts relevant to your change, or let the pull-request workflow execute the complete set.

## 6. Manually inspect maintained seeds

Load:

```text
#s=1234567
#s=987654
#s=424242
```

Confirm that each realm clears **Forging the realm…**, retains its seed, produces Chronicle entries and has no console or page errors.

## Pull-request gate

Every pull request runs:

- Verify generated runtime;
- Browser smoke and focused browser acceptance suites;
- Chronicle regression;
- Long-run soak.

Do not merge while any required workflow is failing or still running.
