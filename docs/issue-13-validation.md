# Issue #13 validation — war, armies, battles, sieges and peace

This closure builds on the campaign slice delivered in PR #55 and the later notable, dynasty, scar, economy, rendering and acceptance infrastructure.

## Existing implementation retained

- Civil war between a rebel great house and the crown.
- Named commanders and bounded army/campaign registries.
- Army strength derived from population, prosperity, fortifications and house strength.
- Road-based marching, supply consumption and attrition.
- Terrain, weather, morale and commander modifiers.
- Skirmish, clash and rout battle phases.
- Visible banners, near-view soldiers, siege tents and campfires.
- Granary countdown, settlement cession and status-quo peace.
- Named battlefield scars and clickable cairn markers.
- Persistent settlement ownership after peace.

## Completion work

### Campaign structure

- A loyal great house can answer the crown with an allied supporting army.
- Allied banners march visibly and add bounded support when they arrive.
- Every campaign tracks a signed war score from battle, allied arrival, sorties, assaults and occupation.
- Rebel and crown exhaustion accumulate independently from marching, casualties, shortage and siege duration.
- Armies retain individual exhaustion alongside strength, morale and supply.

### Battles

- The existing battle result now records separate phase evidence for skirmish, clash and rout.
- Phase evidence includes losses, terrain, weather, morale, commander modifiers and allied support.
- A battle always records a commander consequence: a death where one occurred, otherwise a war epithet for the victor.
- The battlefield retains its named historical scar and clickable cairn.

### Sieges

- Investment begins with a visible camp, palisade, tents and multiple campfires.
- The defenders can launch a sortie after twelve days.
- The besiegers can assault after twenty-eight days.
- Sorties affect strength, morale, exhaustion and war score.
- Assaults affect casualties, wall integrity, occupation and war score.
- A breach creates visible smoke and enables district occupation.
- Granary depletion and campaign supply continue to constrain the siege.
- Exhausted or undersupplied besiegers can accept status quo.
- Campaigns that last ninety days negotiate or settle according to score.

### Persistent damage

- Assaults ruin a bounded group of real lots in one named district.
- Ruined districts retain their original street and lot identities.
- A persistent `Ruined <district> of <settlement>` scar records the damage.
- Existing rebuilding can later alter the site without erasing its history.

### Peace outcomes

- **Status quo:** the crown retains the existing territorial settlement.
- **Settlement ceded:** the target changes owner after a successful siege.
- **New dynasty:** decisive occupation of the capital installs the rebel commander as monarch, displaces the prior dynasty and changes the capital's banner.
- **Exiled house:** decisive crown victory removes the rebel house from its seat, marks its dynasty exiled and gives survivors restoration agendas.
- **Negotiated peace:** balanced score and exhaustion disband both sides without territorial change.
- Every peace record preserves score, exhaustion, occupation and ownership changes.

## Product surface

The World and Acts panels show:

- the active or most recent campaign;
- war score and both sides' exhaustion;
- allied house count;
- latest phase;
- siege wall integrity and occupation;
- final peace and ownership changes;
- persistent ruined districts;
- a working `Raise rival banners` action when no campaign is active.

Army inspection shows:

- campaign name and phase;
- war score;
- army and side exhaustion;
- allied or principal-banner role;
- existing commander, strength, supply, morale and heraldry.

## Automated acceptance

`.github/scripts/war-smoke.mjs` validates seeds:

- `1234567`
- `987654`
- `424242`

For each seed it requires:

- a visible march, named battle and peace outcome;
- supply-related weakening;
- a siege with at least one sortie and one assault;
- a named clickable battlefield scar;
- a commander death or war epithet;
- allied participation;
- a persistent ruined district;
- territory changes after decisive peace;
- verified new-dynasty, exiled-house and status-quo outcomes;
- visible army and siege markers;
- complete World, Acts and army-inspector fields;
- no browser console or page errors.

The deterministic acceptance scenarios use the actual campaign functions. They adjust only initial relative strength and requested settlement outcome so all branches are covered without depending on a lucky random battle.

## Long-run protection

The existing soak suite remains unchanged and must continue to pass:

- three 20-year seeds;
- one 50-year run;
- one full 200-year run;
- finite and bounded state;
- continuing territorial diversity;
- bounded campaign, army, notable, scar and event registries;
- Chronicle pacing below the existing threshold.

## Closure

The issue acceptance criteria and remaining follow-up scope from the earlier partial slice are covered. The PR therefore uses `Closes #13`.
