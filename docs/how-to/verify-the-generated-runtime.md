# Verify the generated runtime

Use this guide when you need to confirm that `annals.html` still matches the maintainable source and satisfies the build contract.

## Run the check

From the repository root:

```bash
python3 scripts/build.py --check
```

A successful result prints:

```text
annals.html is up to date and the manifest is valid
```

## Resolve a stale runtime

When the check reports that `annals.html` is stale, regenerate it:

```bash
python3 scripts/build.py
```

Then repeat:

```bash
python3 scripts/build.py --check
```

Review and commit the regenerated `annals.html` with the source changes that caused it.

## Resolve a manifest failure

The build stops before writing output when `src/manifest.txt`:

- contains duplicate, missing, empty or unsafe module entries;
- does not begin with `core/runtime.js`;
- does not end with `simulation/chronicle-regression.js`;
- violates an enforced load-order dependency;
- references source containing `localStorage` or `sessionStorage`.

Correct the manifest or source identified by the error, regenerate the runtime and rerun the check.

For the complete contract, see [Build and manifest reference](../reference/build-and-manifest.md).