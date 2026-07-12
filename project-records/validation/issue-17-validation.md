# Issue 17 validation

## Acceptance checklist

- [x] Left drawer uses Time, Rates, Acts, World and Houses tabs.
- [x] Only implemented Acts are shown: grain relief, festival, drought and fire.
- [x] Acts clearly identify the current pressure-point target and still write Chronicle entries.
- [x] Trade-tax slider binds directly to `economyState().taxRate` and applies house-loyalty pressure.
- [x] HUD shows date, season, weather, monarch, treasury, population and camera mode.
- [x] World tab exposes useful inspection for caravans, armies, bandit camps and dragon state.
- [x] Existing settlement, building, notable, scar, memory and dynasty inspectors remain available.
- [x] Houses tab shows colour mark, seat, loyalty, might, rebellion and dynasty state.
- [x] Space, 1–4, H, C and Escape remain wired.
- [x] Copy link and Chronicle export remain available.
- [x] Product UI structure is exposed through the headless/debug API.

## Regression behaviours

- App must load beyond “Forging the realm…”.
- URL hash seeds remain deterministic.
- Chronicle, Director, time controls, export and sharing remain functional.
- No storage APIs or backend dependencies are introduced.

## Known limitations

- Cursor-placement Acts are not shown because they are not yet implemented.
- Overlays are intentionally omitted until issue #18 provides working overlays.
- Cogs, active fires and all ruin categories do not yet have dedicated product-surface inspectors.
- The Houses tab uses colour marks rather than a full procedural sigil atlas.
