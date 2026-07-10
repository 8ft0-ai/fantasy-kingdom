# Issue #13 validation

Partial vertical slice (`Refs #13`).

## Implementation checklist

- [x] Civil war creates two bounded armies tied to houses, settlements and named commanders.
- [x] Army strength derives from population, prosperity, fortifications and house loyalty.
- [x] Armies march along an existing road and consume supply during the campaign.
- [x] Low supply weakens army strength and morale.
- [x] Battle resolution records skirmish, clash and rout phases.
- [x] Terrain, weather, morale and commander traits affect battle outcome.
- [x] A commander can die or receive a war epithet.
- [x] Rebel victory creates a visible siege camp and granary countdown.
- [x] Peace records status quo or settlement cession.
- [x] Settlement ownership persists after peace.
- [x] Battles create named, clickable battlefield scars through the existing scar system.
- [x] Campaign and army registries are bounded.

## Core regression checklist

- [ ] App loads beyond “Forging the realm…”.
- [ ] Seeds `1234567`, `987654`, and `424242` complete browser and Chronicle regression checks.
- [ ] Chronicle, director, time controls, export/share and GitHub Pages entrypoint continue to work.
- [ ] No browser or syntax errors are introduced.

## Known follow-up work

- Multi-front wars and multiple simultaneous campaigns.
- Richer near-view instanced formations.
- Sorties, assaults and negotiated siege outcomes.
- Dynasty exile and broader territorial partition outcomes.
