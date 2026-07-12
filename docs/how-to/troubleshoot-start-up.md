# Troubleshoot start-up

Use this guide when ANNALS remains on **Forging the realm…**, shows the recoverable boot screen or does not produce an initial Chronicle.

## 1. Confirm you are serving the repository

Open ANNALS through a local static server rather than relying on a direct `file://` URL:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/annals.html#s=1234567
```

## 2. Try the maintained safe seed

Use:

```text
#s=1234567
```

The recoverable boot path also exposes this seed as the safe retry target when generation or later start-up fails.

## 3. Inspect runtime guards

Open the browser developer console and run:

```js
ANNALS_GUARDS.summary()
```

Look for the first failed guard. The guard layer checks the Three.js revision, random-stream separation, generated world collections and coordinates, unique IDs, valid road references, scene readiness, named characters and the initial Chronicle.

## 4. Check browser errors

In the developer console, identify the first page or JavaScript error. Resolve that error before investigating later messages, which may be consequences of the original failure.

## 5. Verify generated output

From the repository root, run:

```bash
python3 scripts/build.py --check
```

If the runtime is stale, regenerate it:

```bash
python3 scripts/build.py
```

Reload the page after the check succeeds.

## 6. Compare maintained seeds

Try:

```text
#s=1234567
#s=987654
#s=424242
```

A failure on every maintained seed usually indicates a runtime or dependency problem. A failure limited to one seed is more likely to indicate an invalid generated-world edge case.

Record the failing seed, guard summary and first console error in any bug report.
