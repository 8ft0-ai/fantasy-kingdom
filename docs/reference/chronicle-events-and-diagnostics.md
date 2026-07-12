# Chronicle, events and diagnostics reference

This page defines the current relationship between structured simulation events, Chronicle presentation, cinematic direction, historical memory, export and repository diagnostics.

## Structured events

A structured event is the machine-readable simulation record. The current event contract includes:

| Field | Contract |
| --- | --- |
| `id` | Stable within a generated run, formatted from the seed and a monotonically increasing event number. |
| `day` | Integer simulation day on which the event was emitted. |
| `type` | Event type such as `festival`, `rebellion`, `fire` or `food-shortage`. |
| `severity` | Bounded numeric priority from 0 to 10. |
| `location` | Finite `x`, `y`, `z` coordinates plus an optional entity ID and display name. |
| `causes` | Up to eight causal statements. |
| `consequences` | Up to eight consequence statements. |
| `participants` | Up to twelve participant names or identifiers. |
| `metadata` | Subsystem and presentation metadata used by current runtime contracts. |

The structured-event registry is bounded to the newest **320** events. `structuredEvents()` returns defensive summaries rather than the live registry objects.

## Chronicle entries

The Chronicle is the reader-facing historical presentation. A Chronicle entry contains:

- simulation day;
- presentation class and priority;
- world position and location name;
- annalistic text;
- event kind;
- reign number;
- optional structured-event ID;
- header status for reign or section entries.

The visible Chronicle history is bounded to the newest **240** entries.

A structured event may carry Chronicle metadata. When consumed, that metadata creates the Chronicle entry and preserves the structured-event ID. Not every Chronicle entry must originate from a structured event: opening entries and some background annalist entries can be created directly.

## Cinematic direction

A structured event can also carry Director metadata. When direction is enabled and the event has a usable location, the same event location and priority are placed in the Director queue.

This shared source allows the Chronicle and camera to refer to the same underlying occurrence. An event may explicitly suppress cinematic direction while still producing structured or Chronicle evidence.

## Causes, consequences and participants

Calls through `eventChronicle(...)` create a structured event and package the Chronicle and Director presentation contract together. Subsystems should record concrete causes, consequences and participants where they are known rather than relying on prose extraction from the Chronicle.

Manual Acts use the same event path and identify `manual-act` as their source metadata.

## Historical memory and scars

Historical memory and scar systems consume significant events and preserve relationships that outlive the visible Chronicle window. Current behaviour includes:

- stable references to prior events, people, houses and locations;
- persistent named scars for supported battles, disasters and other material outcomes;
- later Chronicle or inspector references to a related prior event;
- bounded registries and compaction suitable for long-running simulation.

Memory and scar summaries are diagnostic views of these relationships. They are not substitutes for the current Chronicle or product-interface reference.

## Chronicle export

**Export Chronicle** creates a plain-text browser download named:

```text
annals-<seed>.txt
```

The payload represents the Chronicle entries retained in the current session at export time. It is generated entirely in the browser and does not include the complete structured-event registry, hidden diagnostic state or records already removed by Chronicle bounding.

## Principal diagnostic contracts

`ANNALS_DEBUG` is the repository diagnostic namespace. It is not an end-user control surface. The exact set can grow as subsystems add stable acceptance summaries, but the following are current repository-used contracts.

| Interface | Purpose |
| --- | --- |
| `ANNALS_GUARDS.summary()` | Current dependency, generation, world-shape and boot-readiness guards. |
| `ANNALS_DEBUG.performanceSummary()` | Frame health, budgets, quality, rendered object and bounded simulation counts. |
| `ANNALS_DEBUG.performanceProfiles` | Current performance profile definitions. |
| `ANNALS_DEBUG.setPerformanceQuality(name)` | Force a supported quality profile for diagnostics and acceptance tests. |
| `ANNALS_DEBUG.acceptanceSummary()` | Current five-minute and 30-minute-equivalent acceptance evidence. |
| `ANNALS_DEBUG.runAcceptance(seed, days)` | Run the bounded accelerated acceptance contract. |
| `ANNALS_DEBUG.acceptanceSeeds` | Maintained regression seed list. |
| `ANNALS_DEBUG.acceptanceWindows` | Supported simulated-day windows for the acceptance contract. |
| `ANNALS_DEBUG.runSoak(...)` | Run long-horizon simulation validation where exposed by the soak module. |

Subsystem debug modules also expose focused summaries used by `.github/scripts/*.mjs`, including product UI, overlays, camera, rendering, culture, characters, economy, war, threats, memories, scars and dynasties. These interfaces are diagnostic and acceptance contracts only when a current repository test consumes them.

## Headless simulation contract

The repository can construct an isolated deterministic realm and advance it without normal DOM rendering. The headless summary includes:

- seed and application version;
- generated geography and settlement evidence;
- Chronicle text;
- structured-event summaries and current event limit;
- building and road summaries.

Headless and accelerated runs support regression and soak validation. They do not replace visible browser acceptance for interactions, rendering or the tutorial journey.

## Acceptance evidence

The current browser suites validate the public and diagnostic contracts through focused scripts for:

- initial boot and runtime guards;
- the first-kingdom tutorial journey;
- Chronicle regression;
- product UI and targeted Acts;
- overlays;
- camera, Follow and Watch behaviour;
- performance and rendering;
- culture, characters, economy, disasters, war and long-run stability.

Passing these suites demonstrates the tested behaviour for the current application version. It does not make historical issue-validation records authoritative for current behaviour.

## Related reference

- [Product interface](product-interface.md)
- [Controls](controls.md)
- [Runtime guards and debug interfaces](runtime-guards-and-debug.md)
- [URL and seeds](url-and-seeds.md)
- [Platform and performance](platform-and-performance.md)

For design rationale rather than lookup, see [Simulation, Chronicle and cinematic direction](../explanation/simulation-chronicle-and-director.md).