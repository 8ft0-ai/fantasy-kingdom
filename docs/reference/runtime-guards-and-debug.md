# Runtime guards and debug reference

## Guard summary

In the browser developer console:

```js
ANNALS_GUARDS.summary()
```

The result exposes current dependency, generation, world-shape and boot-readiness guard state.

## Guard coverage

The runtime checks:

- Three.js exists and reports revision 128 before scene setup;
- deterministic random probes are reproducible and separated;
- the generated world has a seed, title and required collections;
- settlement, house and building IDs are unique;
- settlements, buildings, resources and roads use finite coordinates;
- roads reference existing settlements and contain usable paths;
- settlement owners refer to real houses;
- generated-world validation completes before boot;
- scene, camera, renderer and canvas exist;
- named characters and initial Chronicle entries exist before the forge overlay clears.

Guard failures use the recoverable boot screen and expose seed `1234567` as the safe retry path.

## Performance summary

Where performance debug APIs are available:

```js
ANNALS_DEBUG.performanceSummary()
```

The summary reports the active quality profile, FPS, frame time, draw calls, triangles, scene objects, budget breaches and bounded simulation collection counts.

The visible performance meter can also be enabled through the product interface or by including `debug=1` in the URL hash.

## Acceptance and regression APIs

`ANNALS_DEBUG` also exposes subsystem summaries and acceptance hooks used by the repository's `.github/scripts/*.mjs` suites. These interfaces are test and diagnostic contracts rather than end-user controls.

Use the focused script matching the subsystem under change, and allow the complete pull-request workflows to remain the final integration gate.
