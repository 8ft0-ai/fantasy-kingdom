# Issue #18 validation — realm overlays

## Acceptance checklist

- [x] Overlay state is single-active and defaults to none.
- [x] Territories show house colours and rebuild when settlement ownership changes.
- [x] Trade shows the road network with stronger, wider routes for recent and active caravans.
- [x] Prosperity shows settlement heat derived from live prosperity values.
- [x] Plague shows infection intensity, quarantine rings and infected road connections.
- [x] Unrest shows settlement heat and explicit revolt-risk rings above 70 unrest.
- [x] Terrain shows elevation, slope, biome and bounded resource points.
- [x] Overlays are rendered above terrain and are not added to the pickable collection.
- [x] Overlay geometry is rebuilt only when its state signature changes.
- [x] Browser smoke switches every overlay and verifies active state, legend and visible geometry.

## Non-regression checklist

- [x] `annals.html` is regenerated from the source manifest.
- [x] URL seed hashes remain unchanged.
- [x] Chronicle, director, camera, Acts and inspectors retain their existing ownership.
- [x] Ambient rendering updates are preserved through the shared render-loop wrapper.
- [x] No local or session storage is introduced.
- [x] All overlay objects are procedural and asset-free.

## Required seeds

- `#s=1234567`
- `#s=987654`
- `#s=424242`

## Remaining work

- True Voronoi territory polygons and animated political borders.
- District-level prosperity tinting.
- Directional trade arrows and maritime cog routes.
- More detailed terrain legend and resource filtering.
