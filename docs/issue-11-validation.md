# Issue #11 validation — notable families and life arcs

This closes the remaining work in **#11 — Notables, dynasty, families, traits, and life arcs**. The implementation extends the existing named-character, dynasty, succession, war, plague and Chronicle systems rather than replacing them.

## Existing implementation retained

The repository already provided:

- a seeded initial notable cast;
- traits, agendas, roles and grudges;
- dynasty membership, parents, children, siblings and spouses;
- ageing and ordinary death hazards;
- monarch succession and contested claims;
- war commanders, battle deaths and war epithets;
- plague, dragon and disaster systems;
- character, dynasty and notable inspectors;
- bounded registries and 200-year recovery/compaction.

## Remaining work delivered

### Cast and roles

- Initial generation remains approximately 108–130 living notables.
- The bounded registry increases from 128 to 140 so marriages can produce children before long-run archival compaction.
- High Priest, Master of Coin, smith, commanders, prophet and Bandit King roles remain part of the generated role cycle.

### Marriage and family continuity

- Eligible adult notables are ranked by alliance value.
- Cross-house marriages favour politically useful links between low-loyalty or high-claim households.
- Marriage improves the linked houses’ loyalty and records their alliance.
- Existing spouse grudges are removed and allied grudges decay over time.
- Recorded marriages can produce named children with two parent links.
- Children inherit the stronger parent’s house and dynasty and enter the succession with a cross-house claim bonus.
- A small number of plausible parent/child links are seeded within existing dynasties to create cross-generational households.

### Inheritance and succession

- When a non-ruling notable dies, a living child, spouse or sibling can inherit claim strength and an unfinished agenda.
- If no inheritance occurs naturally, an elderly non-ruling parent eventually closes their account and passes a claim to a living child.
- Any unscheduled monarch death immediately invokes the existing dynasty succession system.
- Scheduled succession continues to support ordinary and contested outcomes.

### Related Chronicle life arc

- One younger office-holder receives a continuing realm concern.
- The same person appears in three linked Chronicle stages:
  1. charge;
  2. reckoning;
  3. legacy.
- Structured-event metadata retains the same arc ID, character ID and theme across all three entries.
- The completed character receives the epithet **the Realm-Keeper**.

### Death pathways and epithets

Notable deaths can now be explicitly classified as:

- age;
- battle;
- plague;
- assassination;
- disaster.

Natural plague and assassination hazards use settlement infection and existing grudges. Fire and drought Acts can affect named residents. War continues to use the battle system. A deterministic debug matrix exercises all five pathways without relying on random timing.

Event-specific epithets include battle, dragon, fire, flood, earthquake, plague, grain relief, festival, drought and contested-succession outcomes.

### Inspector and Houses panel

The existing character inspector still shows:

- age;
- traits;
- house;
- role;
- agenda;
- spouse and heirs;
- grudges.

It now also shows:

- parents and siblings;
- children with direct navigation;
- alliance-marriage date and score;
- claim and legitimacy;
- received or transferred inheritance;
- recurring life-arc theme and entry count;
- classified death hazard.

The Houses panel adds family-link, marriage, birth and recurring-arc totals.

## Automated evidence

`.github/scripts/notable-life-smoke.mjs` runs seeds:

- `1234567`;
- `987654`;
- `424242`.

For each seed it verifies:

- initial living count is between 100 and 140;
- registry remains within the 140-person bound;
- alliance marriage and two-parent childbirth occur;
- inheritance occurs;
- the same named character appears in three distinct but related Chronicle stages;
- succession is represented by reign and structured-event evidence;
- High Priest, Master of Coin, smith, commander, prophet and Bandit King roles exist;
- age, battle, plague, assassination and disaster deaths are all exercisable;
- the complete inspector and Houses summary are rendered;
- no console or page errors occur.

The normal pull-request checks remain authoritative:

- Verify generated runtime;
- Browser smoke, including notable-life coverage;
- Chronicle regression;
- Long-run soak through 200 simulated years.

## Acceptance mapping

| Issue acceptance criterion | Evidence |
| --- | --- |
| Roughly 100–140 living notables after generation | Three-seed browser report records `initialLiving` and enforces the range. |
| One person appears in three related Chronicle entries | The retained arc entries share character ID, theme and name across charge, reckoning and legacy. |
| Monarch death produces succession, regency or crisis behaviour | Existing dynastic succession is invoked for scheduled and unscheduled monarch deaths; report records reigns and succession events. |
| Deaths can occur from age, battle, plague, assassination or disaster | Deterministic hazard matrix exercises and classifies all five pathways. |
| Inspector shows age, traits, house, spouse/heirs, grudges, role and agenda | Browser test checks every required label plus expanded family, claim and life-arc fields. |

## Constraints preserved

- Generated single-file `annals.html` runtime.
- Vanilla JavaScript and Three.js r128.
- No framework, backend, external media assets or browser persistence.
- Deterministic URL-seed behaviour.
- Bounded notable, event, dynasty, war and long-run archival collections.
