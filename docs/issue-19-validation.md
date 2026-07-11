# Issue #19 validation — performance guardrails

This PR is a focused first slice of issue #19.

## Delivered

- Rolling FPS and frame-time measurement.
- Debug counters for draw calls, triangles, active renderables, total scene nodes and bounded simulation collections.
- A 250 draw-call budget, 350,000-triangle budget and 2,400 active-renderable budget.
- Separate total scene-node reporting for memory-growth diagnosis without treating hidden LOD objects as rendered work.
- Adaptive High, Balanced, Low and Minimal quality profiles.
- Device-informed initial quality selection.
- Automatic degradation after sustained low frame rate or a rendering-budget breach.
- Slow recovery after sustained frame headroom.
- Quality-specific caps for pixel ratio, lights, weather particles, citizens, sheep, birds, smoke, stalls, carts, district masses, overlay tessellation and terrain/resource detail.
- Altitude- and quality-aware settlement-detail visibility.
- A visible debug performance meter and product-drawer controls.
- Active-renderable baseline and growth monitoring.
- Recoverable generation fallback to seed `1234567` and an actionable retry message for later startup failures.
- Playwright performance smoke coverage.

## Browser assertions

The performance smoke test:

1. Loads seed `1234567` with the debug meter visible.
2. Forces Minimal quality.
3. Requires finite positive FPS and frame-time metrics.
4. Requires draw calls, triangles and active renderables to remain within their declared budgets.
5. Requires lights and particles to respect the active profile.
6. Cycles quality profiles and overlays repeatedly.
7. Requires active-renderable drift to remain below 80 objects.
8. Requires the overlay layer to return to an empty state.
9. Confirms the safe recovery seed is exposed.

## Known limitations

- This slice does not yet merge or instance the complete building mesh population.
- A browser smoke run is not equivalent to a physical mid-tier laptop benchmark.
- Thirty-minute Watch-mode and 200-year soak evidence remain follow-up work.
- FPS thresholds intentionally trigger graceful degradation rather than asserting a fixed CI frame rate under software-rendered Chromium.
