# Change ANNALS source

Use this guide when you need to modify the application while preserving the generated single-file runtime contract.

## 1. Edit maintainable source

Make the change under `src/` rather than editing generated sections in `annals.html` directly.

Typical locations include:

- `src/world/` for generated realm structure;
- `src/simulation/` for time, economy, politics, threats and Chronicle events;
- `src/rendering/` for Three.js scene behaviour;
- `src/director/` for camera and cinematic behaviour;
- `src/ui/` for controls, inspectors and export or sharing behaviour;
- `src/styles.css` for runtime styling.

If you add or remove a JavaScript module, update `src/manifest.txt` in the required execution order.

## 2. Regenerate the deployable runtime

Run:

```bash
python3 scripts/build.py
```

A successful build rewrites `annals.html` from `src/shell.html`, `src/styles.css` and the ordered JavaScript modules.

## 3. Verify the generated file

Run:

```bash
python3 scripts/build.py --check
```

The expected output is:

```text
annals.html is up to date and the manifest is valid
```

## 4. Test the change

Serve the repository and load the maintained seeds:

```text
#s=1234567
#s=987654
#s=424242
```

Confirm that the application clears **Forging the realm…**, the Chronicle advances and the affected behaviour works.

## 5. Commit both source and generated output

Commit the changed `src/` files and regenerated `annals.html` together. CI rejects stale generated output, invalid manifest ordering, missing modules and forbidden browser persistence APIs.

For exact build invariants, see [Build and manifest reference](../reference/build-and-manifest.md). For the broader validation sequence, see [Run the regression baseline](run-the-regression-baseline.md).