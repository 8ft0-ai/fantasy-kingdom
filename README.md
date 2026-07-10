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
| `src/shell.html` | HTML shell containing build placeholders for styles and scripts. |
| `src/styles.css` | Runtime styles. |
| `src/core/` | Shared constants, random-number helpers, runtime state and debug helpers. |
| `src/world/` | Terrain, hydrology, resources, settlements, roads and procedural layouts. |
| `src/simulation/` | Time, economy, crises, Chronicle events and simulation acts. |
| `src/rendering/` | Three.js scene, terrain, water, roads, settlements and building meshes. |
| `src/ui/` | Chronicle rendering, controls, inspectors and export/share behaviour. |
| `src/director/` | Camera movement, picking and cinematic director behaviour. |
| `src/boot.js` | Browser boot path and event wiring. |
| `src/manifest.txt` | Ordered JavaScript module list used to generate the runtime. |
| `scripts/build.py` | Regenerates `annals.html` or checks that it is current. |
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

Both source changes and the regenerated `annals.html` should be committed together. CI rejects a pull request when the generated artefact is stale or its inline JavaScript is syntactically invalid.

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

This separation prevents world-generation changes from unnecessarily rewriting the historical sequence, and history-system changes from unexpectedly reshaping the starting map.

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

Confirm that the app gets past **Forging the realm…**, the Chronicle receives entries, time controls and watch mode work, export/share behaviour still works, and the root `index.html` preserves the seed hash when redirecting.
