# Explore your first kingdom

This tutorial introduces ANNALS by taking one maintained kingdom from generation through observation, intervention and Chronicle export.

You will use seed `1234567`, which is also part of the repository's regression baseline.

## Before you begin

You need Python 3 and a browser with WebGL support.

From the repository root, start a static server:

```bash
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000/annals.html#s=1234567
```

## 1. Let the realm form

Wait for **Forging the realm…** to disappear.

You should see:

- a generated realm rendered in 3D;
- the current date, season, weather, monarch, treasury and population in the interface;
- a Chronicle containing the opening entries for the kingdom;
- the seed retained in the URL.

The same seed will regenerate the same initial kingdom.

## 2. Change the pace of history

Use the time controls in the left drawer, or press a number key from `1` to `4`, to change the simulation speed.

Let several Chronicle entries appear, then press `Space` to pause.

You should see the date advance while the simulation is running and stop advancing while paused.

## 3. Watch the Chronicle direct the camera

Press `C` to enable Watch mode, then resume the simulation.

As significant events occur, the cinematic director should move the camera towards the place or subject connected to the Chronicle entry. Watch mode may hide some management interface elements so that the realm becomes the focus.

Press `C` again when you are ready to return to direct control.

## 4. Inspect part of the realm

Select a visible settlement, notable, moving caravan, army or other inspectable subject.

The inspector should show information relevant to the selected subject. Settlement information may include population, prosperity, owner and local economic state. Moving or threatening subjects expose their route, status or target where applicable.

Press `Esc` to clear the inspector.

## 5. Intervene with an Act

Open the **Acts** tab in the left drawer. ANNALS only displays Acts that are currently implemented, including grain relief, festival, drought and fire.

Choose an Act and review the target shown by the interface before triggering it.

After the Act is applied, you should see a Chronicle entry describing the intervention and its immediate consequence. The camera may also follow the event when Director or Watch mode is active.

## 6. Share the same starting kingdom

Use **Copy link** in the interface, or copy the browser URL directly.

The URL should retain:

```text
#s=1234567
```

Opening that URL in another browser session recreates the same initial realm. Subsequent history remains deterministic only for the same application version when the sequence and timing of user actions also match.

## 7. Export the Chronicle

Open the left control drawer and choose **Export**.

The browser should download a plain-text file named:

```text
annals-1234567.txt
```

Open the file and confirm that it contains the Chronicle entries produced during your session, including the Act you triggered.

## You have completed the tutorial

You have now:

- generated a deterministic kingdom;
- changed and paused simulation time;
- observed the cinematic director;
- inspected the simulated world;
- caused a visible historical event;
- shared the kingdom by URL seed;
- exported its Chronicle.

Return to the [documentation landing page](../README.md) to find task guides, technical reference and architectural explanation.