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

The Browser smoke workflow also runs focused suites for the first-kingdom tutorial, culture, acceptance, notable lives, economy, disasters, war, camera, rendering, overlays and performance. Run the scripts relevant to your change, or let the pull-request workflow execute the complete set.

## 6. Manually inspect maintained seeds

Load:

```text
#s=1234567
#s=987654
#s=424242
```

Confirm that each realm clears **Forging the realm…**, retains its seed, produces Chronicle entries and has no console or page errors.

## Documentation validation

Run:

```bash
python3 scripts/check_docs_targets.py
python3 scripts/test_docs_targets.py
```

The checker validates inline local Markdown path existence only. It does not validate anchors, reference-style links, rendered Markdown, external URLs or semantic accuracy.

## Pull-request classification

Every pull request runs:

- **Documentation local targets**;
- **Verify generated runtime**.

Browser smoke, Chronicle regression and Long-run soak also run when the pull request changes any of:

- `src/**`;
- `annals.html` or `index.html`;
- `scripts/build.py`;
- `.github/scripts/**`;
- `.github/workflows/**`.

Therefore an ordinary documentation-only pull request avoids the heavyweight suites, while runtime, build, workflow and acceptance-test changes continue to receive the complete relevant validation.

Run the deterministic classification contract with:

```bash
python3 scripts/check_ci_classification.py
```

Pushes to `main` remain unfiltered. Documentation targets, generated-runtime verification, Browser smoke, Chronicle regression and Long-run soak also run on a weekly Monday schedule and remain manually dispatchable.

Do not merge while any workflow required for the changed paths is failing or still running. Passing CI alone is not evidence that documentation is semantically accurate.
