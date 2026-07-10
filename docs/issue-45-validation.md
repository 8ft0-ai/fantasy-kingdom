# Issue #45 validation checklist

## Implementation checklist

- [x] Add a bounded structured event registry with deterministic IDs.
- [x] Add a single `emitWorldEvent(...)` API.
- [x] Route drought, food shortage, rebellion, harvest, grain relief, festival and fire outcomes through structured events.
- [x] Derive Chronicle entries for migrated outcomes from an event consumer.
- [x] Derive director targets for migrated outcomes from the same event.
- [x] Ensure event locations contain finite coordinates and stable entity references where available.
- [x] Expose structured event summaries and retention limits through the debug/headless harness.
- [x] Regenerate `annals.html` from modular source.

## Regression expectations

- App advances beyond “Forging the realm…”.
- Seeded generation remains deterministic.
- Chronicle receives entries.
- Director/watch mode, time controls, export/share and root routing remain unchanged.
- Manual drought, fire, festival and grain relief acts remain available.

## Retention

The structured event registry is capped at 320 newest events. Chronicle retention remains independently capped at 240 entries.
