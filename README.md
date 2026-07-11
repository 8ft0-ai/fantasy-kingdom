# ANNALS — single-file procedural fantasy kingdom

ANNALS is a seeded procedural fantasy kingdom prototype. The app generates a realm, runs a visible history simulation, and writes events into the Chronicle as the world changes. The deployed runtime remains intentionally small and static: `annals.html` is the application, and `index.html` is a lightweight GitHub Pages entrypoint that redirects to it while preserving URL hash seeds.

## Runtime constraints

The prototype is deliberately constrained:

- single static web app;
- vanilla JavaScript;
- Three.js r128 loaded from CDN;
- no framework;
- no backend;
- no external textures, models, or media assets;
- no browser persistence APIs;
- deterministic sharing by URL hash seed.

The maintainable source is split by subsystem under `src/`, but GitHub Pages still serves the committed, generated `annals.html`. There is no runtime module loading or production bundler.

## Repository structure

| Path | Purpose |
| --- | --- |
| `src/shell.html` | HTML shell containing the runtime contract and build placeholders for styles and scripts. |
| `src/styles.css` | Runtime styles. |
| `src/core/` | Shared constants, random-number helpers, runtime state, assertions and debug helpers. |
| `src/world/` | Terrain, hydrology, resources, settlements, roads, procedural layouts and generated-world guards. |
| `src/simulation/` | Time, economy, crises, Chronicle events, long-run stability and simulation acts. |
| `src/rendering/` | Three.js scene, terrain, water, roads, settlements and building meshes. |
| `src/ui/` | Chronicle rendering, controls, inspectors and export/share behaviour. |
| `src/director/` | Camera movement, picking and cinematic director behaviour. |
| `src/boot.js` | Browser boot path, dependency checks and event wiring. |
| `src/manifest.txt` | Ordered JavaScript module list used to generate the runtime. |
| `scripts/build.py` | Validates the manifest and regenerates or checks `annals.html`. |
| `annals.html` | Generated, single-file deployable runtime committed to the repository. |
| `index.html` | Lightweight GitHub Pages redirect preserving seed hashes. |

## Development workflow

Edit the appropriate files under `src/`, then regenerate the deployable artefact:

```bash
python3 scripts/build.py
```

Before committing, verify that the generated runtime is current:

```bash
python3 scripts/build.py --check
```

Both source changes and the regenerated `annals.html` should be committed together. CI rejects a pull request when the generated artefact is stale, its inline JavaScript is syntactically invalid, the manifest is unsafe or out of order, a module is duplicated or missing, or runtime source introduces browser persistence.

### Generated section markers

`annals.html` begins with a runtime-contract header and a generated module index. Every JavaScript module is preceded by a searchable banner such as:

```text
ANNALS MODULE 03/65 · WORLD GENERATION
Source: src/world/generation.js
```

The banner order is generated directly from `src/manifest.txt`. Do not edit `annals.html` to move or rename sections; edit the source module or manifest and rebuild it.

### Runtime guards

The runtime checks:

- Three.js loaded at revision 128;
- generation and history RNG streams are reproducible and distinct;
- world collections exist and use finite coordinates;
- settlement, house and building IDs are unique;
- roads reference real settlements and contain usable paths;
- the renderer, named cast and initial Chronicle are ready before the forge screen disappears.

In a browser console, inspect the current result with:

```js
ANNALS_GUARDS.summary()
```

Failures use the existing recoverable boot screen and safe-seed retry path.

## Running locally

Serve the repository root with a static server:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/annals.html#s=1234567
```

You can also open the root page:

```text
http://localhost:8000/#s=1234567
```

The root page redirects to `annals.html#s=1234567`.

## Sharing deterministic seeds

ANNALS reads the seed from the URL hash using the `s` parameter:

```text
annals.html#s=1234567
```

The same seed regenerates the same initial kingdom. The runtime keeps separate seeded random streams for generation and history:

- the generation stream controls the initial map, settlement layout, buildings, roads and procedural visual placement;
- the history stream controls Chronicle events, simulation rolls, manual acts, war, trade and fates.

This separation prevents world-generation changes from unnecessarily rewriting the historical sequence, and history-system changes from unexpectedly reshaping the starting map. Runtime guards probe fresh streams, so validating this boundary does not consume or alter the live streams.

## Exporting the Chronicle

Open the left control drawer and choose **Export**. The app downloads a plain-text annals file named with the active seed, for example:

```text
annals-1234567.txt
```

The export is generated in the browser and requires no backend.

## Useful controls

- **Time buttons** pause or change simulation speed.
- **Watch mode** hides the management UI and lets the director fly to Chronicle-worthy events.
- **Copy link** copies the current seed URL when the Clipboard API is available.
- **Reforge** generates a new seed.
- **Acts** trigger visible events such as drought, fire, festival and grain relief.
- Keyboard shortcuts: Space pauses, 1–4 change speed, H hides the UI, C toggles watch mode, Esc clears the inspector, WASD pans, and the mouse wheel zooms.

## Deploying

Use the repository root as the GitHub Pages source. `index.html` remains lightweight and redirects to the generated `annals.html` while preserving hash seeds. No deployment build step is required because the generated runtime is committed.

The same repository root can be deployed to Netlify as a static site. Use no build command and publish the repository root.

## Validation baseline

Before opening a pull request, run:

```bash
python3 scripts/build.py --check
```

Then load these seeds in a browser or equivalent test harness:

```text
#s=1234567
#s=987654
#s=424242
```

Confirm that the app gets past **Forging the realm…**, `ANNALS_GUARDS.summary()` reports a ready boot, the Chronicle receives entries, time controls and watch mode work, export/share behaviour still works, and the root `index.html` preserves the seed hash when redirecting.
