# Issue 16 validation

## Acceptance checklist

- [x] Formal far, mid, near and bubble altitude bands.
- [x] Far range shows district colour masses while detailed settlement geometry is hidden.
- [x] Near range adds bounded market stalls and carts around the nearest settlement.
- [x] Bubble range adds local-only citizens, sheep, birds and chimney smoke.
- [x] Seasonal sky and fog palettes distinguish spring, summer, autumn and winter.
- [x] Rain, storm and winter states produce capped local particles.
- [x] Bubble settlement lights are capped at eight point lights.
- [x] Draw-call, triangle, object, particle and light counts are exposed through `ANNALS_DEBUG.renderingSummary()`.
- [x] Existing camera, Chronicle, seed and GitHub Pages behaviour remain unchanged.

## Smallest coherent slice

This PR formalises the altitude LOD contract and adds visible procedural seasonal, weather and ambient-life differences without external assets. Generated atlases, deeper water shaders, snow accumulation and instanced building consolidation remain follow-up work.

## Manual browser checks

Use seeds `#s=1234567`, `#s=987654` and `#s=424242`. Move through all four altitude bands and confirm that detail increases near a settlement, weather particles remain local, and the app does not remain on “Forging the realm…”.
