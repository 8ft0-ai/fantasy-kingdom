# ANNALS runtime structure

This note documents the internal structure that `annals.html` should preserve while remaining a single-file, no-build, vanilla JavaScript runtime.

## Smallest coherent vertical slice for issue #21

Issue #21 is about making future work safer without changing the deployment model. The smallest useful slice is:

1. keep `index.html` as the lightweight root entrypoint that preserves hash seeds;
2. keep `annals.html` as the only runtime application file;
3. document how to run, deploy, share seeds, and export the Chronicle;
4. document the RNG stream boundary between generation and history;
5. define stable internal sections for future edits;
6. add lightweight guards where generation, rendering, simulation, UI, and boot can fail.

## Intended internal section order

`annals.html` should be organised in this order, even while it remains one file:

1. **Header and constraints** — version, runtime constraints, Three.js r128 compatibility, and no-build expectations.
2. **CSS and static shell** — fixed DOM structure, HUD, control drawer, Chronicle, inspector, beat card, forge overlay.
3. **Constants and runtime state** — dimensions, name tables, goods, global scene/simulation state.
4. **Seeded RNG and utilities** — `xmur3`, `sfc32`, `rngFrom`, selection helpers, geometry helpers, clamp/lerp/distance helpers.
5. **Runtime guards and assertions** — small checks for missing Three.js, malformed generated worlds, missing Chronicle state, non-finite co-ordinates, and boot failures.
6. **World generation** — terrain, hydrology, settlement placement, roads, houses, cast, and mythic fates.
7. **Rendering** — Three.js scene setup, terrain/water/roads/buildings/trees/props/agents/fates/labels.
8. **Chronicle** — event creation, filtering, entry rendering, date text, and director queue integration.
9. **Simulation systems** — tick order, weather, economy, population, politics, threats, trade, growth, rebuilding, war, caravans, armies, fates.
10. **UI and controls** — sliders, world controls, manual acts, share/export controls, filters, inspector.
11. **Camera and director** — fly-to behaviour, watch mode, manual camera controls, cinematic beat selection.
12. **Animation and boot** — animation loop, event listeners, initial Chronicle entries, forge overlay dismissal.
13. **Debug hooks** — explicitly named diagnostic helpers only; no persistent browser storage.

## RNG stream boundary

The app currently has two seeded random streams:

- **Generation stream**: seeded from the URL seed plus a generation tag. This stream controls map and visual structure: height field, rivers, settlement placement, building placement, roads, house colours, prop placement, and other initial geometry.
- **History stream**: seeded from the URL seed plus a history tag. This stream controls cast generation, historical rolls, trade outcomes, threats, politics, manual acts, Chronicle events, war, dragon behaviour, and other simulation outcomes.

This separation should be preserved. A change to history behaviour should not unexpectedly reshape the starting map, and a change to terrain or settlement layout should avoid consuming history rolls.

## Suggested guard points

Keep guards small and targeted. They should fail loudly during development but not introduce persistence or heavy framework-style machinery.

Useful guard points:

- Three.js is loaded before scene setup begins.
- The generated world has a title, a seed, settlements, roads, houses, notables, and a dragon before rendering starts.
- Height lookups, camera targets, agent co-ordinates, and Chronicle target positions remain finite.
- Hydrology does not assume a long enough river path when adding tributaries.
- Boot catches fatal errors and replaces the forge overlay text with a clear failure message instead of leaving the user stuck at **Forging the realm…**.
- Initial Chronicle entries exist before the animation loop begins.

## System order

The simulation should continue to use a clear order inside `tick()` so cause and consequence remain legible:

1. advance day and season;
2. update weather;
3. update economy and prices;
4. update population and disease;
5. update politics and succession;
6. resolve threats and fates;
7. resolve growth, scars, rebuilding, and trade spawning;
8. emit Chronicle-worthy story pulses;
9. refresh UI state periodically.

The animation loop should then update agents, props, camera, director, labels, seasonal look, HUD, and finally render the scene.

## Manual validation checklist

For every runtime change, check at least these seeds:

```text
#s=1234567
#s=987654
#s=424242
```

For each seed, verify:

- the app gets past **Forging the realm…**;
- the hash remains in the URL;
- settlements, roads, and the Chronicle appear;
- the Chronicle receives entries after start;
- time controls change speed and pause/resume;
- watch mode hides the control UI and the director continues selecting events;
- at least one manual act produces visible or Chronicle-recorded consequence;
- export creates a text Chronicle;
- copy link uses the current seed when the Clipboard API is available;
- no obvious console/runtime errors appear.

## Non-goals

This structure is not permission to introduce a framework, backend, build step, localStorage, sessionStorage, external textures, external models, or a multi-file runtime bundle.
