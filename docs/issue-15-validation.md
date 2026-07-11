# Issue #15 validation — camera rig, Follow mode, Director grammar and Watch mode

This closure builds on the cinematic camera slice delivered in PR #57 and the later economy, war, disaster, notable and acceptance infrastructure.

## Existing implementation retained

- Shared Free, Follow and Director mode state.
- Smoothed camera and target movement.
- Terrain clearance during ordinary movement.
- Follow adapters for caravans, armies and the active dragon.
- Manual keyboard movement and wheel input suspend the Director.
- Director category cooldowns and priority interruption.
- Wide, push-in, low-tracking, slow-orbit, high-reveal and territory shots.
- Idle settlement views and lower-third beat cards.
- Existing Watch class that hides the drawer, Chronicle and inspector.

## Completion work

### Shared camera rig

- Free, Follow and Director now use the same velocity-based spring-damper transform.
- Camera and target each retain bounded velocity state.
- Terrain safety samples both the camera position and the line of sight to the target.
- Normal movement maintains at least 58 world units of terrain clearance.
- The camera target is also clamped above local terrain.

### Curved altitude path

- Free-camera distance determines the viewing pitch.
- Low altitude produces a shallow horizon or street-like angle.
- High altitude progressively becomes a map-like overhead view.
- Wheel zoom moves along this curved path instead of changing only vertical height.
- User orbit pitch remains a bounded offset around the altitude curve.

### Free mode controls

- Left-drag orbits around the current target.
- Shift-left-drag or right-drag pans across the terrain.
- Wheel input controls distance along the curved altitude path.
- WASD pans relative to the current camera heading.
- Pointer movement beyond the click threshold suppresses accidental world selection.
- Every manual gesture enters Free mode and extends the Director suspension interval.

### Follow mode

Follow adapters now cover:

- road caravans and coastal cogs;
- marching, supporting and besieging armies;
- the active dragon;
- living notables;
- fires, floods, earthquakes and omens;
- plague settlements and bandit camps;
- active siege camps;
- persistent historical scar sites.

Moving targets use a readable trailing shot with heading-based lead. Static notables and incidents use slow tracking orbits.

### Direct world selection

- Trade markers carry stable follow metadata.
- Army banners carry stable follow metadata.
- The procedural dragon marker carries stable follow metadata.
- Threat and disaster markers carry incident follow metadata.
- A ray-picked click on a caravan, army or dragon enters Follow mode directly.
- Existing settlement, building and scar inspection remains available when the clicked object is not a follow target.

### Director grammar

- Shot selection is deterministic for the seed, event class, day and shot count.
- Consecutive shots avoid repeating the same form when alternatives exist.
- War, trade, fate, crown, notable and idle classes use different shot families.
- New portrait-orbit and golden-orbit forms complement the existing grammar.
- Low-value trade, hunger and bandit categories receive longer cooldowns.
- A category cannot occupy more than two of the latest six low-priority shots.
- Priority-nine and priority-ten events can interrupt a lower-priority active shot.
- Old low-priority queued events expire rather than accumulating indefinitely.

### Watch mode

- Watch mode retains the title, one current-camera chip and the lower-third beat card.
- Speed controls, drawer, Chronicle and inspector are hidden.
- Idle behaviour deliberately uses golden-hour settlement orbits, wide views and territory views.
- Shot history records form, category, priority and day.
- Debug output reports shot variety, repeated low-value categories and minimum terrain clearance.

## Product surface

The Time panel now exposes:

- Free, Director and Watch controls;
- current mode, camera distance and terrain clearance;
- recent shot-form and category counts;
- pointer gesture guidance;
- direct notable-follow buttons;
- direct incident-follow buttons.

Character inspection includes a Follow action for every living notable. Scar inspection includes a Follow this site action.

## Automated acceptance

`.github/scripts/camera-smoke.mjs` validates seeds:

- `1234567`
- `987654`
- `424242`

For every seed it requires:

- a ray-picked caravan click entering Follow mode;
- a ray-picked army click entering Follow mode;
- a ray-picked dragon click entering Follow mode;
- pointer orbit changing yaw and suspending the Director;
- pointer pan moving the camera target;
- wheel zoom changing curved-path distance;
- valid notable and incident follow adapters;
- low-value category cooldown preventing immediate fixation;
- a priority-ten battle interrupting an idle shot;
- a 4,800-day Watch-equivalent run, corresponding to ten minutes at the default eight simulated days per second;
- at least 24 recorded shots, five shot forms and four event categories;
- no more than two consecutive low-value shots from one category;
- minimum terrain clearance of at least 57 units;
- minimal Watch UI and an available lower third;
- no browser console or page errors.

## Regression requirements

The closure PR must also pass:

- generated-runtime freshness and JavaScript syntax verification;
- the complete Browser smoke suite;
- Chronicle regression on maintained seeds;
- the 20-, 50- and 200-year soak matrix;
- existing culture, notable, economy, disaster, war, overlay and performance checks.

## Constraints preserved

- Generated single-file `annals.html` runtime.
- Vanilla JavaScript and Three.js r128.
- No external camera library.
- No backend, browser persistence or external media assets.
- Deterministic URL-seed behaviour and separated RNG streams.
- Bounded camera and shot histories.
