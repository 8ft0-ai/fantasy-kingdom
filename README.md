# ANNALS — single-file procedural fantasy kingdom

ANNALS is a seeded procedural fantasy kingdom prototype. The app generates a realm, runs a visible history simulation, and writes events into the Chronicle as the world changes. The current runtime is intentionally small and static: `annals.html` is the application, and `index.html` is a lightweight GitHub Pages entrypoint that redirects to it while preserving URL hash seeds.

## Runtime constraints

The prototype is deliberately constrained:

- single static web app;
- vanilla JavaScript;
- Three.js r128 loaded from CDN;
- no build step;
- no framework;
- no backend;
- no external textures, models, or media assets;
- no browser persistence APIs;
- deterministic sharing by URL hash seed.

These constraints are part of the product shape. Future changes should keep the app runnable from GitHub Pages and should avoid turning the repository into a bundled application unless a generated single-file output remains the runtime artefact.

## Files

| File | Purpose |
| --- | --- |
| `annals.html` | Main runtime. Contains the HTML shell, styles, JavaScript simulation, rendering, UI, Chronicle, controls, and boot path. |
| `index.html` | GitHub Pages root entrypoint. Redirects to `annals.html` and preserves hash seeds such as `#s=1234567`. |
| `README.md` | Repository baseline, running notes, sharing notes, deployment notes, and constraints. |

## Running locally

Because the app is a single static HTML file, the quickest option is to open `annals.html` directly in a browser. For a closer match to GitHub Pages, serve the directory with a local static server:

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

The root page should redirect to `annals.html#s=1234567`.

## Sharing deterministic seeds

ANNALS reads the seed from the URL hash using the `s` parameter:

```text
annals.html#s=1234567
```

The same seed should regenerate the same initial kingdom. The runtime keeps separate seeded random streams for generation and history:

- the generation stream controls the initial map, settlement layout, buildings, roads, and procedural visual placement;
- the history stream controls cast generation, Chronicle events, simulation rolls, manual acts, war, trade, and fates.

This separation is important because future world-generation changes should not accidentally rewrite the historical sequence for an otherwise unchanged realm, and future history-system changes should not unexpectedly reshape the starting map.

## Exporting the Chronicle

Open the left control drawer, find the **World** section, and choose **Export chronicle**. The app downloads a plain-text annals file named with the active seed, for example:

```text
annals-1234567.txt
```

The export is generated in the browser from the current Chronicle entries. It does not require a backend.

## Useful controls

- **Time buttons** in the top bar pause or change simulation speed.
- **Watch mode** hides the management UI and lets the director fly to Chronicle-worthy events.
- **Copy link** copies the current seed URL when the Clipboard API is available.
- **Reforge** regenerates the realm from the seed field.
- **Acts** let you manually trigger events such as fire, plague, flood, comet, dragon, festival, or war activity.
- Keyboard shortcuts: Space pauses, 1–4 change speed, H hides the UI, C toggles watch mode, Esc clears the inspector, WASD pans, and the mouse wheel zooms.

## Deploying

### GitHub Pages

Use the repository root as the Pages source. `index.html` is intentionally lightweight and redirects to `annals.html` while preserving hash seeds.

### Netlify or another static host

Deploy the repository root as a static site. No build command is required. The publish directory is the repository root.

## Maintenance notes

`annals.html` now has internal section banners for the main systems: constants, RNG, world generation, rendering, Chronicle/simulation systems, and UI/director/boot. Keep new work inside the relevant section where possible. If a change cuts across systems, prefer a small named helper or guard over broad rewrites.

Before opening a PR, check at least the following:

```bash
node --check <extracted-inline-script.js>
```

Then load these seeds in a browser or an equivalent test harness:

```text
#s=1234567
#s=987654
#s=424242
```

Confirm that the app gets past **Forging the realm…**, the Chronicle receives entries, the time controls still work, watch mode still works, export/share behaviour still works, and the root `index.html` still preserves seed hashes when redirecting.
