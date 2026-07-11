# Issue #23 validation — five-minute, 30-minute and regression-seed harness

## Existing infrastructure reused

This closure builds on the repository's existing partial test implementation rather than replacing it:

- `ANNALS_DEBUG` and deterministic headless simulation;
- browser boot and WebGL smoke coverage;
- runtime/world/RNG guards;
- Chronicle structural regression coverage;
- structured event totals and bounded Chronicle counters;
- performance, overlay and culture browser checks;
- 20-, 50- and 200-year stability soak reports.

The new harness provides the missing unified acceptance contract over those systems.

## Acceptance windows

The original watchability windows are converted to simulation days using the default pace of eight simulated days per second:

- five minutes: `5 × 60 × 8 = 2,400` simulated days;
- 30 minutes: `30 × 60 × 8 = 14,400` simulated days.

Changing the visible simulation speed does not change these acceptance thresholds.

## Five-minute contract

A run passes the five-minute checkpoint when all of the following have occurred by day 2,400:

- at least one season change;
- at least eight new Chronicle entries;
- at least one structured event involving a named character;
- at least one visible incident, such as plague, drought, fire, rebellion, war, banditry or dragon activity;
- visible settlement growth, measured by at least one additional building.

## 30-minute contract

A run passes the 30-minute checkpoint when:

- the five-minute checkpoint passed; and
- at least one succession or declared war occurred by day 14,400.

The report also records battles, peace outcomes, disasters, growth events, added reigns and completed wars so later issues can strengthen the closure threshold without replacing the harness.

## Regression seeds

The maintained acceptance seeds are:

- `1234567`;
- `987654`;
- `424242`.

They are available through `ANNALS_DEBUG.acceptanceSeeds`, the **Test** drawer tab and the browser CI report.

## Browser and manual use

The **Test** tab shows live progress for the currently watched realm. It is hidden with the rest of the management UI in Watch mode.

Each regression-seed button opens an isolated URL using:

```text
annals.html#s=<seed>&debug=1&accept=1
```

The isolated page performs the accelerated 14,400-day run and displays the completed report without replacing the realm in the original tab.

Console/debug entry points:

```js
ANNALS_DEBUG.acceptanceSummary()
ANNALS_DEBUG.runAcceptance('1234567', 14400)
ANNALS_DEBUG.acceptanceWindows
ANNALS_DEBUG.acceptanceSeeds
```

No acceptance result is persisted to local storage, session storage or a backend.

## Automated evidence

`.github/scripts/acceptance-smoke.mjs` runs all three regression seeds in Chromium and fails when:

- generation errors or exceeds the bounded generation threshold;
- any five-minute criterion fails;
- neither succession nor war occurs in the longer window;
- battle, peace or disaster evidence is missing from the longer run;
- a final simulation value is non-finite;
- the browser reports a page or console error.

The browser workflow uploads `acceptance-smoke-report.json` with the other browser-smoke artefacts.

## Acceptance-criteria mapping

- **Default run reports whether the five-minute test passed:** live and accelerated reports expose `fiveMinute.complete`, `fiveMinute.passed`, checks and evidence.
- **Longer run reports whether succession/war occurred:** `thirtyMinute.checks.successionOrWar` and detailed counters are included.
- **Regression seeds can be entered and verified manually:** the Test tab exposes direct isolated links for all maintained seeds.
- **Generation stalls are surfaced:** existing boot recovery remains active; the accelerated report records generation duration/error, and Playwright retains a hard navigation/boot timeout.
- **Instrumentation can be hidden:** it lives inside the normal drawer and disappears in Watch mode.
- **Criteria are documented:** this file defines the windows, pass contract, debug API and automated evidence.
