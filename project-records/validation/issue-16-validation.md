# Issue #16 validation — rendering, LOD, weather, seasons and ambient life

This closure builds on the first rendering slice delivered in PR #58. That slice established formal altitude bands, far district masses, bounded near/bubble ambience, seasonal sky/fog palettes, weather particles, capped settlement lights and basic render counters.

## Completion work

### Four meaningful altitude bands

- **Far** retains house-coloured district masses and hides local geometry.
- **Mid** adds instanced simplified buildings, roofs, trunks and tree crowns around the nearest settlement.
- **Near** adds instanced market stalls and carts plus a local well, laundry, lamp posts, banners, bridge rails and window surfaces.
- **Bubble** adds instanced citizens, sheep and birds plus bounded local chimney smoke.
- Only the nearest settlement receives mid, near and bubble ambience.

### Procedural illuminated-manuscript treatment

- A generated canvas atlas provides cross-hatched cloth, wall and roof surface variation without external assets.
- The atlas is created at runtime and bundled into the generated single-file app.
- New local props and simplified building masses reuse a bounded material set.

### Water

- Lake surfaces use a procedural shader with animated displacement, shallow/deep colour blending and edge-brightening.
- River paths use dashed translucent water lines with seasonal colour changes.
- Water darkens at night and becomes more agitated during storms.

### Seasons and ground treatment

- Spring, summer, autumn and winter apply distinct sky, fog, terrain and water palettes.
- Winter blends snow accumulation into terrain according to elevation.
- Rain and storms darken the terrain to create a wet-ground treatment.
- Seasonal transformations reuse the original deterministic terrain vertex colours.

### Day, night and settlement glow

- The existing fractional simulation clock drives a deterministic sun path.
- Directional and hemisphere light intensity follows the day/night cycle.
- Near and bubble settlements expose instanced warm window glow at night.
- Local point lights remain capped by the active performance profile, with a hard maximum of eight.
- Lamp bulbs and window glow use non-dynamic emissive geometry so readable night scenes do not require one light per window.

### Weather and ambience

- Rain uses capped local line segments.
- Winter uses capped local snowfall points.
- Storms use heavier rain and deterministic lightning flashes through the existing global lights.
- Weather follows the camera target and is not generated across the whole realm.
- Banners, birds, sheep, citizens, smoke and water receive bounded visual animation.

### Instancing and performance

- Mid-range building masses and trees are instanced.
- Near market stalls, carts, lamp posts, bulbs, laundry and bridge rails are instanced where practical.
- Bubble citizens, sheep and birds are instanced rather than represented by one draw call per figure.
- Existing quality profiles continue to cap lights, particles, citizens, sheep, birds, smoke, stalls and carts.
- Draw calls, triangles, visible scene objects, active lights, particle vertices and instanced group counts remain inspectable.

## Automated browser acceptance

The rendering browser pass runs seeds `1234567`, `987654` and `424242` and requires:

- the expected far, mid, near and bubble band at representative altitudes;
- meaningful additional detail in each closer band;
- a generated 128×128 procedural atlas;
- warm night window glow with point lights remaining inside the active profile cap;
- four distinct seasonal ground signatures;
- visible rain, storm and snow states inside the particle cap;
- an observable deterministic storm-lightning peak;
- animated water with at least one river or lake surface;
- local ambience attached to only the nearest settlement;
- draw calls and visible scene objects remaining within the existing budgets;
- no browser console or page errors.

The pass records `rendering-smoke-report.json` in the standard Browser smoke artefact.

## Regression validation

The final branch must pass on the same head:

- Verify generated runtime;
- Browser smoke, including rendering, camera, overlays and performance;
- Chronicle regression;
- Long-run soak through 200 simulated years.

## Constraints preserved

- Generated single-file `annals.html` runtime.
- Vanilla JavaScript and Three.js r128.
- No external models, textures, frameworks, backend or browser persistence.
- Deterministic URL seeds and separated simulation/visual RNG streams.
- Bubble citizens remain visual-only and local rather than globally simulated.
