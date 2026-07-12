# Adaptive rendering and local detail

ANNALS must present a whole kingdom and still allow the camera to descend towards individual settlements. Rendering maximum detail everywhere would undermine both performance and visual legibility.

The renderer therefore combines altitude-based level of detail with quality profiles. At realm scale, simplified district masses preserve political and settlement structure. Moving closer reveals simplified buildings, market props, local structures, citizens, animals, smoke and lights. Only the nearest relevant settlement receives the most expensive local detail.

This is not merely an optimisation. Each altitude band answers a different visual question:

- far views show the shape and ownership of the realm;
- mid views show settlement form;
- near views show streets, markets and local infrastructure;
- bubble views show ambient life.

Quality profiles bound the amount of work inside those bands. Pixel ratio, dynamic lights, particles, ambience, overlays, terrain complexity and procedural resources are capped together rather than degraded independently into an incoherent scene.

The runtime monitors frame health and explicit rendering budgets. Sustained low performance or a budget breach lowers quality one level. Recovery is deliberately slower so the renderer does not oscillate between profiles. A user can also force a profile when predictable output matters more than adaptation.

The result is graceful degradation: lower-end devices lose density and effects before they lose the kingdom's major spatial and narrative signals. Hidden detail is not counted as active rendered work, while total scene-node reporting remains available to detect memory growth.

See [Platform and performance reference](../reference/platform-and-performance.md) for exact budgets and thresholds.
