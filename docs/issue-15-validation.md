# Issue 15 validation

## Implemented slice

- Shared Free, Follow and Director camera state.
- Smoothed camera and target movement with terrain clearance.
- Follow adapters for caravans, armies and the active dragon.
- Manual movement and wheel zoom suspend Director mode.
- Category cooldowns prevent repeated low-value fixation.
- High-priority queued events can interrupt lower-priority shots.
- Shot grammar includes wide, push-in, low tracking, slow orbit, high reveal and territory views.
- Idle Director uses settlement views with lower-third beat cards.
- Watch mode retains a minimal cinematic beat card.
- Debug summaries expose modes, shot categories and terrain clearance.

## Regression checklist

- App loads beyond Forging the realm.
- Seeds 1234567, 987654 and 424242 remain deterministic.
- Chronicle, time controls, sharing and export remain functional.
- Camera position remains at least 55 units above sampled terrain.
- Manual input changes camera mode to Free and extends Director suspension.
- Follow controls only appear for currently available moving subjects.

## Remaining issue scope

- Full pointer orbit/pan gestures.
- Direct world-object click selection for all followable subjects.
- Richer notable follow shots and more sophisticated golden-hour lighting.
- Dedicated 10-minute visual shot-variety assertion.
