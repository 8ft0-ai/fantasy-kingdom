# Build and manifest reference

## Commands

Generate the deployable runtime:

```bash
python3 scripts/build.py
```

Check that the committed runtime is current:

```bash
python3 scripts/build.py --check
```

Successful check output:

```text
annals.html is up to date and the manifest is valid
```

## Inputs and output

| Path | Role |
| --- | --- |
| `src/shell.html` | Provides the HTML shell and the two build tokens. |
| `src/styles.css` | Replaces `{{ANNALS_STYLES}}`. |
| `src/manifest.txt` | Defines ordered JavaScript source modules. |
| `src/**/*.js` | Replaces `{{ANNALS_SCRIPTS}}` in manifest order. |
| `annals.html` | Generated output. |

## Manifest invariants

`scripts/build.py` enforces:

- no duplicate entries;
- no missing or empty JavaScript modules;
- no absolute paths or `..` path traversal;
- `.js` module paths only;
- `core/runtime.js` first;
- `simulation/chronicle-regression.js` last;
- required core, world, simulation, rendering, director, UI, debug and boot modules present;
- load-bearing ordering constraints between dependent subsystems;
- no `localStorage` or `sessionStorage` references in runtime source.

## Generated structure

The output begins with a generated module index. Each module is preceded by a searchable banner:

```text
ANNALS MODULE 03/65 · WORLD GENERATION
Source: src/world/generation.js
```

The module count and number may change. The source path is the stable locator.

Do not manually edit generated module order or banners in `annals.html`; edit `src/manifest.txt` or the source module and rebuild.
