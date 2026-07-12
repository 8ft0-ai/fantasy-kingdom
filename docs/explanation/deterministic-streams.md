# Deterministic generation and history

A URL seed is part of the ANNALS product contract. It allows a realm to be revisited, shared and tested without storing browser state.

A single undifferentiated random sequence would make that contract fragile. Adding one decorative tree during generation could consume an extra random value and change every later settlement, ruler, war and Chronicle event.

ANNALS therefore derives tagged deterministic streams from the seed. The two principal boundaries are:

- **generation**, which creates terrain, hydrology, settlements, roads, buildings, resources and initial spatial structure;
- **history**, which drives named lives, economy, politics, threats, war, Chronicle events and fates.

Culture and visual systems also use deterministic seed-derived boundaries where they need variation without consuming the live history stream.

The runtime guard probes construct fresh streams rather than sampling the active streams. This confirms reproducibility and separation without moving the live simulation forward.

This design does not promise that every code change will preserve every historical outcome. A change to history rules is expected to change history, and a change to generation rules may change the generated world. The boundary instead prevents unrelated random consumption from causing unnecessary cross-system changes.

For users, the practical guarantee is that the same seed and application version reproduce the same initial kingdom. Two sessions can diverge after different user actions or timing choices.

See [URL and seed reference](../reference/url-and-seeds.md) for the external contract.
