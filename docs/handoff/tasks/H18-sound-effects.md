# H18 — Synthesized sound effects

**Priority P3 · ChatGPT · uma-rpg · S.**

## Why

The game is silent. A few short sounds make hits, breaks, level-ups and collected jobs feel like something happened.
Synthesizing them with Web Audio needs no audio files to author, license or download. It's the same "drawn from code"
idea as the pixel art.

## Context

- **Battle cues:** `describeCue` in `apps/web/src/battle/battle-view.ts`; `BattleScene.play(cues)` in
  `apps/web/src/battle/scene/BattleScene.ts`. Its cue kinds include `hit` (with a weak flag), `break`, `limit`, `summon`, `status`, `ko`, `victory` and `loss`.
- **Other moments:**
  - collecting a job (`collect` in `apps/web/src/save/game.ts`);
  - rank-ups and level-ups;
  - crafting (Forge);
  - a Spring.
- **The account sheet:** `apps/web/src/hub/AccountBar.tsx` and `MenuSheet.tsx` hold settings like notifications.

## Do

1. **`apps/web/src/audio/sfx.ts`:** a tiny synth on one lazily created `AudioContext`. About 12 named sounds, each a
   few oscillators or a filtered noise burst with an envelope, under 400 ms:

   | Group | Sounds |
   |---|---|
   | Hits | `hit-arms`, `hit-element` (pitched per element) |
   | Battle moments | `weak`, `break`, `limit`, `summon`, `ko`, `victory`, `defeat` |
   | Rewards | `collect`, `level-up`, `craft` |
   | Interface | `tap` (subtle) |

2. **Play them** at the matching cues and actions. Keep the iOS rules:
   - create or resume the context on the first user tap;
   - respect the silent switch: Web Audio already does on iOS, so check it.

   Scale with battle speed (H02): at 4×, skip `hit` sounds closer than 60 ms apart.
3. **A Sound setting** in the menu sheet: On or Off, plus a volume step (low, medium, high), remembered per device in
   `localStorage` (try/catch). Default: On at medium.

## Done when

- In the browser, every sound plays at its moment, and the setting mutes them at once.
- No audio work happens before the first tap.
- The main chunk grows by under 3 KB gzip (lazy-load the synth if it's more).
- `pnpm lint && pnpm test && pnpm build` pass.

## Deliver

A pull request on `feat/sfx`, titled `feat(web): synthesized sound effects (H18)`.
