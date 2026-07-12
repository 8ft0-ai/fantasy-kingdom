# Product interface reference

This page describes the current user-visible ANNALS product surface. Exact keyboard and pointer gestures are owned by the [controls reference](controls.md).

## Drawer tabs

| Tab | Current responsibility |
| --- | --- |
| **Time** | Pause or change simulation speed and enter Watch mode. |
| **Rates** | Change live trade and harvest tax, production, new trade-load and Chronicle pacing values. |
| **Acts** | Place one implemented intervention into the realm. |
| **World** | Inspect settlements, moving subjects, people, ruins and scars; access sharing, export and performance controls. |
| **Houses** | Inspect live heraldry, seats, loyalty, might, rebellion, grudges, dynasties and succession order. |
| **Overlays** | Display one visual realm overlay at a time. |
| **Test** | Inspect and launch the repository acceptance harness. This is a diagnostic surface rather than ordinary kingdom management. |

Tabs and controls are assembled by layered UI modules. A tab may be conditionally added after the core drawer is created, but the table above is the current complete product surface.

## Simulation speed

The Time tab provides:

| Label | Runtime speed |
| --- | ---: |
| **Pause** | `0` |
| **1×** | `0.5` |
| **4×** | `2` |
| **16×** | `8` |
| **60×** | `30` |

The keyboard speed controls remain documented in [Controls](controls.md).

## Rates

| Control | Range | Effect |
| --- | ---: | --- |
| Trade and harvest tax | 0–30% | Changes treasury receipts and applies unrest and house-loyalty pressure. |
| Harvest and extraction | 50–150% | Scales grain, fish, timber, ore, cloth and wine production. |
| Caravan and cog loads | 50–200% | Scales cargo committed to newly launched trade journeys. |
| Chronicle pace | 50–200% | Changes the interval between background annalist entries without consuming generation randomness. |

Values are live for the current session and reset when the realm reloads.

## Camera modes and Follow

ANNALS supports Free, Follow, Director and Watch behaviour. Manual camera input returns control to Free mode and temporarily suspends Director behaviour. Watch mode removes most management UI and gives the cinematic director greater control.

Follow entry points currently include:

- direct world selection for supported caravans, cogs, armies and the active dragon;
- Follow actions for living notables and persistent scar sites;
- incident-follow controls for supported fires, floods, earthquakes, omens, plague settlements, bandit camps and siege camps.

See [Controls](controls.md) for the exact pointer and keyboard gestures.

## Acts

The Acts tab exposes exactly four implemented actions:

| Act | Targeting and immediate contract |
| --- | --- |
| **Release grain** | Select a settlement or nearby world location; increases grain stores, reduces hunger and unrest, and spends treasury funds. |
| **Proclaim festival** | Select a settlement or nearby world location; reduces unrest and increases prosperity. |
| **Declare drought** | Select a settlement or nearby world location; enables realm-wide drought pressure and applies immediate hunger pressure at the selected settlement. |
| **Start great fire** | Select a settlement or nearby world location; starts an urban fire where the implementation can do so. |

After choosing an Act, click a settlement, building, road subject or place in the realm. `Esc` or the visible cancel action clears pending placement. Every successful Act produces a structured event and Chronicle consequence.

## Realm overlays

Only one overlay can be active. Overlays are visual-only, do not intercept world selection and are intended for realm or regional altitude.

| Overlay | Purpose |
| --- | --- |
| **None** | Disable the current overlay. |
| **Territories** | Show live political ownership. |
| **Trade** | Show road and active trade intensity. |
| **Prosperity** | Show settlement prosperity. |
| **Plague** | Show infection, quarantine and connected risk. |
| **Unrest** | Show unrest and revolt pressure. |
| **Terrain** | Show elevation, slope, biome and bounded resources. |

## Inspectors

Current inspection entry points cover:

- settlements and individual buildings;
- living notables and dynasties;
- great houses;
- travelling road caravans and coastal cogs;
- active armies and campaigns;
- active bandit camps and the dragon;
- ruins and rebuilding structures;
- persistent scars and related memories;
- supported disasters and incidents through camera-follow or specialised inspector paths.

The fields shown depend on the selected subject. Stable IDs are exposed for several moving or simulated subjects to support diagnostics and acceptance tests.

## Sharing, Reforge and export

| Control | Behaviour |
| --- | --- |
| **Reforge** | Replaces the hash seed with a new timestamp-derived seed and reloads the application. |
| **Copy link** | Copies the active URL through the Clipboard API or browser fallback. |
| **Export Chronicle** | Downloads the current Chronicle as `annals-<seed>.txt`. |

See [URL and seeds](url-and-seeds.md) for the determinism contract and [Chronicle, events and diagnostics](chronicle-events-and-diagnostics.md) for export semantics.

## Visible performance controls

The World tab includes:

- **Auto**, which restores the inferred adaptive device profile;
- fixed **High**, **Balanced**, **Low** and **Minimal** quality profiles;
- **Metrics**, which toggles the visible performance meter.

The panel reports frame rate, draw calls, triangles, active scene objects and object growth against the current budgets. Exact budgets and adaptive thresholds are owned by [Platform and performance](platform-and-performance.md).

## Diagnostic Test tab

The Test tab exposes five-minute and 30-minute-equivalent acceptance status and links for the maintained regression seeds. It is a repository diagnostic contract, not an end-user game mechanic. Its stable programmatic interfaces are listed in [Chronicle, events and diagnostics](chronicle-events-and-diagnostics.md).