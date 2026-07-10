# Issue #14 validation — coupled threats and Myth slice

## Acceptance checklist

- [x] Each settlement has bounded SIR-lite disease state.
- [x] Plague begins at a deterministic connected settlement and can follow completed caravan routes.
- [x] Infection can trigger quarantine, blocking new caravans to and from the settlement.
- [x] Plague produces visible pyres, population loss, prosperity pressure and paced Chronicle entries.
- [x] Bandit camps occupy real roads and can ambush, reduce and delay cargo.
- [x] Ignored camps strengthen and produce a persistent named Bandit King.
- [x] Dragon wake and raid behaviour depends on treasury and Myth level.
- [x] Dragon raids reduce treasury, damage settlement lots and weaken monarch legitimacy.
- [x] Myth Off, Low and High materially change dragon availability, timing and severity.
- [x] Threat state, bounds and outcomes are exposed in the headless harness.

## Core behaviours protected

- App loads beyond “Forging the realm…”.
- Seeded generation and separate history randomness remain deterministic.
- Chronicle, director, time controls, export and share behaviour remain available.
- Trade, war, characters, dynasties, scars and memory remain integrated.
- GitHub Pages continues to serve through the lightweight root entry point.

## Partial scope

This PR deliberately leaves adjacent-building fire propagation, river flooding and earthquake radius damage for later focused slices. It references rather than closes issue #14.
