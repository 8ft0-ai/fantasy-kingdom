# Issue #14 validation — disasters, threats, dragon, bandits, omens and Myth

This closure builds on the plague, bandit and dragon slice delivered in PR #56 and the later economy, notable, scar, rendering and acceptance infrastructure.

## Existing implementation retained

- Bounded SIR-lite disease state per settlement.
- Plague transmission through completed road and coastal trade.
- Emergent quarantine and visible funeral pyres.
- Road-based bandit camps, cargo loss, delivery delay and Bandit King escalation.
- Treasury-linked dragon raids, tribute, settlement damage and legitimacy loss.
- Myth Off, Low and High dragon timing and severity.
- Bounded threat summaries, Chronicle pacing and historical scars.

## Completion work

### Adjacent urban fire

- Fire begins on a real settlement lot.
- Spread follows neighbouring lots within a bounded street distance.
- Timber and hovel construction increase spread probability.
- Stone construction lowers spread probability.
- Drought increases spread and can guarantee a multi-building dry-quarter fire.
- Rain and storms sharply suppress spread.
- The event reduces stores and prosperity, raises unrest, leaves ruined buildings and creates a fire scar.
- Procedural flame and smoke markers remain visible while the event is active.

### Snowpack and flooding

- Winter rain and storms accumulate bounded snowpack.
- Spring weather converts snowpack into a melt pulse.
- Spring rain or storms can trigger a flood after sufficient melt.
- Floods target the settlement closest to a river.
- Riverside lots become ruins and nearby bridges enter a damaged state.
- Damaged bridges delay new road trade and repair after a bounded interval.
- Floods reduce stores and prosperity, increase unrest and create a persistent historical scar.
- Procedural flood markers identify the affected settlement and bridges.

### Earthquakes

- Earthquakes have a named epicentre, radius and severity.
- Building damage probability falls with distance from the epicentre.
- Construction tier affects vulnerability.
- Bridges inside the radius can be damaged.
- A bounded event record and quake scar preserve the affected location.
- A procedural epicentre ring remains visible after the event.

### Bandit response

- Ignored road camps still strengthen and can create a named Bandit King.
- A royal bounty funds an organised patrol against the strongest camp.
- The bounty is paid from the treasury and recorded in economic spending.
- The cleared camp remains in bounded history rather than disappearing silently.
- The Acts panel exposes the bounty only when a camp exists and the treasury can afford it.

### Dragon outcomes

- Existing raids continue to reduce treasury, damage buildings and lower legitimacy.
- Sufficient realm might can produce a deterministic slaying outcome.
- A successful commander gains the epithet `the Wyrm-Slayer`.
- Part of the tribute is recovered, legitimacy rises and further raids are suppressed for ten years.
- Failed responses retain the existing tribute outcome.

### Myth depth

- **Off:** no dragon raids, omens, prophets or preparations.
- **Low:** rare ambiguous omens create minor unrest but no formal response.
- **High:** frequent prophecies create a named prophet and prepare for fire, flood or earthquake.
- Preparation reduces the next matching disaster's damage.
- High Myth continues to lower dragon thresholds and increase raid severity.
- The World and Rates panels show Myth controls, disaster counts, snowpack, damaged bridges, prophet and current preparation.

## User-visible acceptance

Settlement inspection shows:

- river distance;
- recorded fires and floods;
- nearby damaged bridges;
- drought-driven fire risk.

The product surface shows:

- Myth Off, Low and High controls;
- fire, flood, earthquake and omen totals;
- snowpack and bridge damage;
- named prophet and current preparation;
- bandit bounty cost and availability.

Procedural markers show:

- active flames and smoke;
- flood water and damaged bridges;
- earthquake epicentre rings;
- Low- and High-Myth omen sites.

## Automated acceptance

`.github/scripts/disaster-smoke.mjs` validates seeds:

- `1234567`
- `987654`
- `424242`

For every seed it requires:

- trade-linked plague transmission and quarantine;
- a dry adjacent-building fire damaging more lots than the same fire in rain;
- flood damage to riverside lots or bridges;
- bounded earthquake radius damage;
- dragon effects on treasury, settlement ruins and legitimacy;
- Bandit King escalation followed by a funded bounty response;
- no mythical events under Myth Off;
- more omens and a named prophet under Myth High than Myth Low;
- visible procedural disaster markers;
- complete drawer and settlement-inspector fields;
- no browser console or page errors.

The normal repository checks additionally require:

- generated runtime freshness and JavaScript syntax;
- Chronicle regression invariants;
- browser, overlay and performance smoke coverage;
- the existing economy, notable, culture and unified acceptance suites;
- 20-, 50- and 200-year stability thresholds.

## Constraints preserved

- Generated single-file `annals.html` runtime.
- Vanilla JavaScript and Three.js r128.
- No framework, backend, browser persistence or external media assets.
- Deterministic URL seed behaviour and separated RNG streams.
- Bounded histories, registries, particles and marker geometry.
