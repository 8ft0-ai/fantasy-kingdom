# Issue #20 validation — long-run stability and 200-year soak

This PR is a focused first slice of issue #20.

## Delivered

- A deterministic accelerated soak path exposed as `ANNALS_DEBUG.runSoak(seed, years)`.
- Checkpoint reports for 20-, 50- and 200-year runs.
- Tracking for population, treasury, settlements, houses, territorial owners, notables, deaths, reigns, wars, disasters, Chronicle rate and bounded registries.
- Finite-value scanning across settlement, economy, house, army and notable state.
- Quarterly population, hunger, unrest and treasury balancing predators after the first five years.
- Automatic conclusion of drought cycles.
- Notable-history compaction into a bounded 256-entry archive while retaining recent deaths and all living people.
- Named-life recovery when the living cast falls below 96.
- War-history compaction so completed armies do not permanently consume the 24-army limit.
- Recovery for stalled wars with missing armies.
- Periodic patrols that clear old bandit camps when threat pressure remains high.
- Territorial recovery when all settlements collapse into one owner.
- Headless simulation mode that suppresses Chronicle/HUD DOM rendering and director-queue growth.
- A dedicated `Long-run soak` GitHub Actions check with JSON artefacts.

## Soak matrix

The CI suite runs:

- 20 years — seed `1234567`
- 20 years — seed `987654`
- 20 years — seed `424242`
- 50 years — seed `1234567`
- 200 years — seed `1234567`

## Sanity thresholds

- Population: 800–60,000.
- Treasury: 0–75,000 crowns.
- Living notables: at least 70.
- Distinct territorial owners after 20 years: at least two.
- Chronicle rate: 2–30 entries per year over the latest 20 years.
- No Chronicle gap above 720 simulated days.
- Notables, archived notables, campaigns, armies, trades and world events remain within declared registry limits.
- No more than one active civil war.
- Every checked numeric state remains finite.

## 200-year evidence

The 200-year case additionally requires:

- at least ten completed wars;
- at least twenty reigns;
- at least 100 recorded deaths;
- full completion within four minutes in CI.

## Known limitations

- Thresholds are deliberately broad and prove sanity rather than perfect balance.
- The bounded notable archive eventually discards the oldest tombstones after 256 archived lives.
- The soak test is non-visual and does not replace a 30-minute real-time Watch-mode test.
- Only one seed currently receives the full 200-year test; additional 200-year seeds remain follow-up work.
