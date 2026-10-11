# H02 — Auto-battle and battle speed

**Priority P1 · ChatGPT · uma-rpg · M.**

## Why

The owner is about to test fights for hours: replays at 25% (D79), late-level Laurels (D82) and five classes after
D86. Tapping every turn of an easy replay is the slowest part. An **Auto** toggle and a **speed** toggle make
testing and grinding bearable.

## Context

- **Rules:** `docs/design/battles.md`, the class rework `docs/design/class-rework.md` (D86: one act per turn, Spell
  Blade pairs an Arms half with a Tome half, Summoner summons linger, Limit Breaks).
- **Engine** (`packages/domain/src/rpg/battle/`):
  - `engine.ts`: `createBattle`, `applyBattleAction`, `battleActionsLeft`, `battleActorSkill`, `battleHitIsWeak`.
  - `types.ts`: `BattleAction`, with `pair` for a Spell Blade.
  - `limit.ts`: Limit plans.
- **A working policy already exists** in `packages/domain/src/world/balance.test.ts` (`play()` and `score()`): each ally
  picks her best affordable skill or Attack, weakness-aware, and a Spell Blade picks one of each half. Move it into the
  domain rather than writing a new one.
- **The fight screen:** `apps/web/src/places/scenario-gate/FightScreen.tsx` (`act()` applies an action and plays its
  cues). The view helpers are in `apps/web/src/battle/battle-view.ts`: `limitReady`, `limitOptions`, `limitMode`,
  `pairMode` and `actionFor`.
- **The stage:** `apps/web/src/battle/scene/BattleScene.ts` (`play(cues)` runs tweens and `delayedCall`s; reduced
  motion already skips).
- **Saving:** every action is saved through `fightAction` in `apps/web/src/save/game.ts`, so a fight can resume
  mid-way.

## Do

1. **Domain: `packages/domain/src/rpg/battle/auto.ts`**, exporting `autoAction(state, actorId): BattleAction`.
   - Use balance.test's policy: the best scoring affordable skill or Attack against the best target, weaknesses first,
     every-foe skills valued by the number of foes, and a Spell Blade picking an Arms half and a Tome half.
   - When the actor's Limit is ready, use it, picking its first option.
   - If the chosen action would be rejected, fall back to Attack with the first weapon, then to Guard.
   - Export it from the package index. Make `balance.test.ts` import it instead of its private copy, so the simulation
     and the game share one policy.
2. **Web: an Auto toggle** on the fight screen, next to the menu.
   - When on, each ready ally acts through `autoAction` after the previous cues finish, in the same order a player
     would.
   - Any manual tap (a unit, a skill, the menu) or tapping Auto again turns it off.
   - It stays off when a fight starts, unless the owner left it on: remember the choice per device in `localStorage`,
     wrapped in try/catch.
3. **Web: a speed toggle**, cycling 1× → 2× → 4×, remembered the same way.
   - Scale the scene with Phaser's own clocks, `this.tweens.timeScale` and `this.time.timeScale`.
   - Divide any fixed waits in `FightScreen` between cues by the same factor.
   - Reduced motion keeps skipping as today.
4. **Both toggles** are 44 pt targets with clear on and off states, and fit the 375 px layout.

## Done when

- **Domain tests:**
  - `autoAction` never returns an action the engine rejects, across every stage of one region per continent at its
    level. Reuse balance.test's `member()` party for this.
  - A Lv1 party on Auto wins the opening pairs.
  - `pnpm --filter @rpg/domain test` passes, and so does `SIM=1` balance output (unchanged numbers or better).
- **In the browser** (`pnpm --filter @rpg/api dev` + `pnpm --filter @rpg/web dev`, local save, auth off):
  - Auto at 4× finishes a Meadow Lv1 stage without a tap.
  - Turning Auto off mid-fight hands control back.
  - Reloading mid-fight resumes where it was.
- `pnpm lint && pnpm test && pnpm build` pass. Main JS stays within D56's 230 KB gzip.

## Deliver

A pull request on `feat/auto-battle`, titled `feat(battle): auto-battle and speed (H02)`. Attach a short screen
recording or two screenshots (Auto on and off) at 390×844.
