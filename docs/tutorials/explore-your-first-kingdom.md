# Explore your first kingdom

This tutorial takes one maintained ANNALS kingdom from generation through observation, intervention, sharing and Chronicle export.

You will follow one exact path through seed `1234567`. In the current version, this seed creates **The Annals of Reedfen**, centred on the capital settlement of **Bellford**.

## Before you begin

You need:

- Python 3;
- a browser with WebGL support;
- a desktop-sized browser window so the left drawer and Chronicle remain visible.

From the repository root, start a static server:

```bash
python3 -m http.server 8000
```

Open exactly:

```text
http://localhost:8000/annals.html#s=1234567
```

## 1. Confirm that Reedfen has formed

Wait for **Forging the realm…** to disappear.

Confirm that:

- the title reads **The Annals of Reedfen**;
- Bellford is visible near the centre of the realm;
- the Chronicle contains opening entries;
- the URL still ends in `#s=1234567`.

The same seed and application version reproduce the same initial kingdom.

## 2. Advance and pause history

Press `2` once.

This selects the 4× simulation speed. Confirm that the date in the top bar begins to advance.

Press `Space` once.

Confirm that the date stops advancing. Leave the simulation paused for the remaining steps so the documented targets do not change while you use them.

## 3. Enter and leave Watch mode

Press `C` once.

Confirm that the left drawer, Chronicle and speed controls disappear while the title and compact cinematic camera chip remain visible.

Press `C` again.

Confirm that the normal interface returns.

## 4. Inspect Bellford

In the left drawer, select **World**.

Under **Inspect settlements**, select **Bellford**.

The inspector should open with the title **Bellford** and show its type, lots, districts, stores and current state.

## 5. Proclaim a festival in Bellford

In the Chronicle, select the opening entry whose date line includes:

```text
coronation · Bellford
```

Wait for the camera to finish moving and place Bellford near the centre of the realm.

In the left drawer:

1. select **Acts**;
2. select **Proclaim festival**;
3. click the Bellford settlement marker in the realm.

Confirm that:

- the Bellford inspector is visible;
- placement mode has ended;
- the Chronicle contains a new entry labelled `festival · Bellford`;
- the entry begins **A royal festival was proclaimed in Bellford**.

This Act is part of the current browser session. Reloading the seed resets the tutorial to its initial state.

## 6. Open the same starting kingdom in another tab

Select **World**, then select **Copy link**.

Paste the copied URL into a new browser tab and open it.

Confirm that the new tab:

- opens **The Annals of Reedfen**;
- retains `#s=1234567`;
- starts from the initial kingdom rather than including the festival from the first tab.

A shared seed guarantees the same initial realm for the same application version. Subsequent history matches only when the sequence and timing of user actions also match.

## 7. Export the Chronicle from the first tab

Return to the first tab, select **World**, then select **Export Chronicle**.

The browser should download:

```text
annals-1234567.txt
```

Open the file and confirm that it contains:

```text
THE ANNALS OF REEDFEN
Seed 1234567
```

It should also contain the sentence beginning:

```text
A royal festival was proclaimed in Bellford
```

## Recover the supported path

Use these recovery steps rather than improvising a different tutorial journey:

- If **Forging the realm…** does not disappear, reload the exact tutorial URL once. If it still does not clear, follow [Troubleshoot start-up](../how-to/troubleshoot-start-up.md).
- If **World**, **Bellford** or **Proclaim festival** is unavailable, restore a desktop-sized browser window and reload the exact tutorial URL. Persistent absence is a tutorial regression.
- If you select another target, advance too far or otherwise diverge from the steps, reload `http://localhost:8000/annals.html#s=1234567` and begin again. ANNALS does not persist the changed session in browser storage.

## You have completed the tutorial

You have now:

- generated and identified a maintained deterministic kingdom;
- advanced and paused simulation time;
- observed Watch mode;
- inspected the capital through a prescribed product control;
- caused and verified a Bellford festival;
- reopened the same initial realm from its seed link;
- exported the Chronicle produced by your session.

Return to the [documentation landing page](../README.md) for task guides, technical reference and architectural explanation.