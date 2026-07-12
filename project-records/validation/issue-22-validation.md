# Issue #22 validation — names, heraldry, sigils, and cultural coherence

This PR completes issue #22 with a deterministic cultural identity layer shared by world generation, named characters, rendering, UI, and the Chronicle.

## Cultural naming

- A dedicated culture RNG stream selects one of five phonological profiles without consuming the generation or history streams.
- Each profile defines related roots, earthy place suffixes, surnames, and male, female, and neutral given-name banks.
- The realm title and every settlement name are generated from the selected profile.
- Great-house names are derived from seats, heraldic charges, or the local cadence.
- House-affiliated characters inherit their house family name; other notables use surnames from the selected profile.
- Generated names are deterministic for a shared URL seed.

## Heraldry

- Every house receives a deterministic field colour, secondary colour, division, charge, motto, and stable sigil signature.
- Charges include stag, tower, wave, oak, wolf, comet, key, and sun.
- House fields are guaranteed distinct within one realm.
- Sigils are drawn procedurally to generated canvases with no external image assets.
- The same cached canvas texture is reused for settlement/keep banners and army flags.
- The same generated image and signature appear in the Houses panel, monarch HUD, and army inspector.
- Settlement heraldry rebuilds after ownership changes.

## Determinism and RNG boundaries

The runtime now exposes three independent deterministic streams:

1. `generation` — terrain, hydrology, settlement geometry, roads, and initial physical structure;
2. `history` — simulation outcomes, named-life events, war, trade, threats, and the Chronicle;
3. `culture-profile` and related culture tags — phonology, realm/settlement names, house identity, and sigils.

Culture generation uses fresh tagged streams and does not consume `genR` or `hisR`. Runtime guards verify reproducibility and separation.

## Automated acceptance

The Browser smoke workflow runs `.github/scripts/culture-smoke.mjs` for seeds:

- `1234567`
- `987654`
- `424242`

For each seed it verifies:

- the document title matches `The Annals of <realm>`;
- every settlement name matches the active suffix bank;
- gendered given-name banks are present;
- all six houses have unique names and sigil signatures;
- all Houses-panel sigils contain generated PNG data and identity metadata;
- every settlement has a procedural world banner;
- a deterministic civil-war fixture produces at least two sigil-bearing army flags;
- army signatures belong to generated houses;
- Chronicle text uses generated realm, settlement, or house names;
- reloading the same seed preserves the complete names-and-sigils signature;
- the three regression seeds produce distinct realm titles;
- no browser or console errors occur.

The existing generated-runtime, Chronicle regression, performance, overlay, browser-entrypoint, runtime-guard, and 200-year soak checks remain required.

## Constraints preserved

- One generated `annals.html` runtime.
- Vanilla JavaScript and Three.js r128.
- No backend, framework, external images, fonts, models, or APIs.
- No local or session browser persistence.
- Deterministic sharing through the URL seed.
