# Controls reference

## Time

| Control | Behaviour |
| --- | --- |
| Time buttons | Pause or change simulation speed. |
| `Space` | Pause or resume simulation. |
| `1`–`4` | Select a simulation speed. |

## Camera modes

| Mode or control | Behaviour |
| --- | --- |
| **Free orbit** | Returns the camera to direct manual control. |
| **Director** | Lets significant events and idle beats select cinematic shots. |
| **Follow** | Tracks the selected caravan or cog, army, dragon, notable or incident. |
| **Watch mode** | Gives the Director control and hides the drawer, Chronicle, inspector and speed controls while retaining the compact cinematic HUD. |
| `C` | Toggle Watch mode. |

## Pointer camera controls

| Control | Behaviour |
| --- | --- |
| Left-drag | Orbit around the current camera target. |
| Shift-left-drag | Pan the camera target across the terrain. |
| Right-drag | Pan the camera target across the terrain. |
| Mouse wheel | Zoom along the curved altitude path. |
| Click a visible follow marker | Enter Follow mode for a travelling caravan or cog, army, dragon, siege, plague, bandit or active disaster marker when that subject is available. |

Orbit, pan, wheel and keyboard camera input return the camera to Free mode and temporarily suspend cinematic Director behaviour. Dragging beyond the click threshold suppresses accidental world selection.

## Keyboard and presentation controls

| Control | Behaviour |
| --- | --- |
| `W`, `A`, `S`, `D` | Pan relative to the current camera heading in Free mode. |
| `H` | Hide or show the interface. |
| `Esc` | Clear the current inspector selection. |

## Follow controls

The **Time** tab exposes buttons for up to four living notables and up to five current incidents. These buttons enter Follow mode when their targets remain available.

Current inspectors also expose:

- **Follow _name_** for a living notable;
- **Follow this site** for a persistent historical scar.

Direct marker clicks provide Follow entry points for supported moving and incident subjects. If a followed target is no longer valid, the camera returns to Director mode.

## Product drawer

| Tab | Purpose |
| --- | --- |
| **Time** | Simulation pace, camera modes, Watch controls and current Follow choices. |
| **Rates** | Taxation, treasury, trade and economic outcomes. |
| **Acts** | Implemented interventions and their current targets. |
| **World** | Realm overlays and inspectable moving or threatening subjects. |
| **Houses** | House seat, loyalty, might, rebellion and dynasty information. |

## Sharing and export

| Control | Behaviour |
| --- | --- |
| **Copy link** | Copies the active seed URL when the Clipboard API is available. |
| **Reforge** | Creates a new seed and kingdom. |
| **Export** | Downloads the Chronicle as a plain-text file named for the active seed. |