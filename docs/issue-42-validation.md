# Issue #42 validation checklist

## Implementation checklist

- [x] Add a bounded registry of persistent historical scars.
- [x] Support battlefield, fire, ruined-structure, abandoned-settlement, plague and omen scar types.
- [x] Give scars stable IDs, locations, dates, causes, states and related event IDs.
- [x] Target originating and later Chronicle entries at stable scar locations.
- [x] Render procedural markers with bounded count and altitude LOD.
- [x] Make scars inspectable from markers, settlements and Chronicle entries.
- [x] Progress fire scars from ruin to rebuilding to memorial.
- [x] Preserve bounded per-scar history and debug/headless summaries.

## Regression expectations

- App advances beyond “Forging the realm…”.
- Seeds remain deterministic.
- Chronicle, director/watch mode, time controls, export/share and Pages routing remain functional.
- Manual fire creates a persistent scar and later restoration entries.

## Bounds and LOD

Scar storage is capped at 80 entities. Each scar retains at most 12 state-history records and 16 related event IDs. Markers are hidden above 2.6 km camera altitude and no external assets are used.
