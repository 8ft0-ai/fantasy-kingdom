# ANNALS runtime structure

This note documents the internal structure that `annals.html` preserves while remaining a single-file, no-runtime-build, vanilla JavaScript application.

## Deployment and source model

`annals.html` is the committed deployable application. Maintainable source lives under `src/` and is assembled by `scripts/build.py` according to `src/manifest.txt`. There is no module loader, framework, backend, or deployment build step.

The generator now validates the manifest before writing the runtime and adds a module index plus a searchable section banner before every source module. These comments are diagnostic structure only; they do not alter execution order.

## Generated internal sections

Each manifest module is labelled under one of these generated section families:

1. **Constants, RNG and runtime state** — dimensions, name tables, shared state and seeded random helpers.
2. **Runtime guards and assertions** — dependency compatibility, RNG separation, world-shape and boot checks.
3. **World generation** — terrain, hydrology, settlement placement, roads, houses and procedural layouts.
4. **Simulation and Chronicle systems** — events, named lives, economy, wars, threats, scars, memory and stability.
5. **Rendering** — Three.js scene setup, terrain, settlements, moving agents, weather, overlays and performance controls.
6. **Camera and director** — camera movement, follow mode, picking and cinematic shot selection.
7. **UI and controls** — Chronicle rendering, controls, inspectors, export/share and product surfaces.
8. **Animation and boot** — dependency checks, event listeners, initial entries and the animation loop.
9. **Debug and acceptance** — headless summaries, regression hooks and soak-test APIs.

The generated banner format is:

```text
ANNALS MODULE 03/65 · WORLD GENERATION
Source: src/world/generation.js
```

The module number changes as the manifest changes; the source path is the stable locator.

## Manifest contract

`scripts/build.py` enforces:

- no duplicate manifest entries;
- no missing or empty JavaScript modules;
- no absolute paths or `..` path traversal;
- `core/runtime.js` is first;
- `simulation/chronicle-regression.js` is last;
- guards load before world generation and simulation;
- world generation loads before event and simulation wrappers;
- economy, war, threats and stability retain their dependency order;
- scene setup loads before rendering extensions;
- camera loads before cinematic behaviour;
- boot loads after core debug and before debug extension modules;
- browser persistence APIs are absent from runtime source.

These rules intentionally cover only load-bearing dependencies. Feature modules may still interleave by subsystem when wrapper order requires it.

## RNG stream boundary

The app has two seeded random streams:

- **Generation stream**: seeded from the URL seed plus the `generation` tag. It controls terrain, rivers, settlement placement, building placement, roads, house colours and other initial structure.
- **History stream**: seeded from the URL seed plus the `history` tag. It controls named lives, simulation rolls, trade, threats, politics, Chronicle events, war and fates.

`assertRngStreams(seed)` constructs fresh probe streams. It confirms that generation is reproducible and that generation/history digests differ, without consuming `genR` or `hisR` used by the live realm.

## Runtime guard points

The runtime guard layer checks:

- Three.js exists and reports revision 128 before scene setup;
- the generated world has a seed, title, settlements, houses, roads, buildings, resources, rivers and Chronicle collection;
- settlement, house and building IDs are unique;
- roads reference existing settlements and contain finite points;
- settlements, buildings, resources and road points use finite coordinates;
- every settlement owner refers to a real house;
- the generated-world guard completed before boot;
- scene, camera, renderer and canvas exist;
- named characters and initial Chronicle entries exist before the forge overlay is removed.

Guard failures flow into the existing recoverable boot screen. The current state is available through:

```js
ANNALS_GUARDS.summary()
```

## System order

The simulation uses nested wrappers rather than one monolithic `tick()`, but the effective order remains intentional:

1. advance day, season and weather;
2. update base population, stores, growth and politics;
3. update named lives and dynasty consequences;
4. update economy and trade;
5. update scars and historical memory;
6. update wars and armies;
7. update threats and mythic consequences;
8. apply long-run stability governors at bounded intervals;
9. emit Chronicle-worthy events and periodically refresh browser UI.

The animation loop then updates camera/director state, moving trade and war markers, threats, labels, HUD, adaptive performance state and finally renders the scene.

## Required regression seeds

Every runtime change must continue to validate:

```text
#s=1234567
#s=987654
#s=424242
```

The Browser smoke workflow loads each seed and the runtime-guard pass requires:

- the forge overlay clears;
- the seed remains in the URL;
- Three.js r128 is active;
- RNG probes are reproducible and separated;
- world-shape assertions pass;
- boot readiness passes with named characters and Chronicle entries;
- no console or page errors occur.

## Non-goals

This structure does not permit a framework, backend, runtime bundler, browser persistence, external textures or models, or a multi-file deployment. The source tree is modular for maintenance; the delivered app remains `annals.html`.
