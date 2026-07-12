# Platform and performance reference

## Runtime constraints

ANNALS is intentionally constrained to:

- one generated static application file, `annals.html`;
- vanilla JavaScript;
- Three.js revision 128 loaded from a CDN;
- no framework, backend or deployment build step;
- no browser persistence through `localStorage` or `sessionStorage`;
- no external textures, models or media assets;
- procedural visuals;
- deterministic URL-seed sharing.

## Rendering budgets

| Metric | Budget |
| --- | ---: |
| Draw calls | 250 |
| Triangles | 350,000 |
| Active renderable scene objects | 2,400 |

Total scene nodes are reported separately for memory-growth diagnosis and are not treated as rendered work when hidden by level-of-detail controls.

## Quality profiles

ANNALS provides `minimal`, `low`, `balanced` and `high` profiles. Profiles cap device pixel ratio, dynamic lights, particles, local ambience, market detail, overlays, terrain complexity and visible procedural resources.

The initial profile is inferred from reported device memory and hardware concurrency.

## Adaptive behaviour

When quality is not manually forced, the runtime:

- downgrades after two consecutive evaluation seconds below 42 FPS or over a rendering budget;
- upgrades after ten consecutive seconds above 56 FPS with draw calls below 72% of budget;
- changes one quality level at a time.

## Debug interfaces

```js
ANNALS_DEBUG.performanceSummary()
ANNALS_DEBUG.performanceProfiles
ANNALS_DEBUG.setPerformanceQuality('balanced')
```

The performance summary reports frame health, rendering counts, budget breaches, quality changes, active and total scene objects, and bounded simulation collection sizes.
