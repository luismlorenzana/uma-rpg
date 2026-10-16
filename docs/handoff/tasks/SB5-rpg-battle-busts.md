# SB5 — Busts on the battle stage, no chibis

**uma-rpg · Either · S · Needs: nothing (start any time) · Part of sibling Phase B.**

## Why

The owner (2026-10-16): "I don't want the Chibi Art in fights or races, I would prefer the bust there." The party on
the battle stage draws idle and cheer chibis today. Busts replace them. The Limit Break cut-in already uses the bust.
Chibis stay only on Town Hall's plaza (D150).

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`; `docs/game/combat.md` and `docs/game/sections.md` § Scenario Gate → Fight (the stage);
  the stage decisions D53, D81 and D91, and H10 in `docs/decisions.md`.
- **The art loading:** `apps/web/src/places/scenario-gate/FightScreen.tsx`, about lines 41–72. It loads
  `outfit-chibis` `<id>-a` (idle) and `<id>-b` (cheer), plus `outfit-busts` per ally, and busts for heroes. Around line
  386 is a DOM fallback when an ally has no idle chibi.
- **The stage:** `apps/web/src/battle/scene/BattleScene.ts`.
  - `StageAlly { id, idle, cheer, bust }`.
  - Textures `ally-<id>`, `cheer-<id>`, `bust-<id>`.
  - `addActor` sizes a sprite to its box (`setDisplaySize`), and the idle tween breathes `scaleY` by 1.03.
  - The cheer swaps to `cheer-<id>` on a win (around line 640).
  - The Limit Break cut-in slides `bust-<id>` (around line 550).
- `background-layout.ts`: the party's row boxes (six-to-eight foes on top, the party below).

## Decisions made

- **The party draws its busts** (`outfit-busts`, 256 px, head and shoulders), each fitted to its box. Keep the aspect
  ratio, anchor at the bottom center, and leave a light drop shadow under it, like the foes.
- **Motion:**
  - **Idle:** a breath: scaleY 1.015, slower than the chibi's.
  - **Win:** a small hop and a brief glow on each ally, instead of a cheer pose.
  - **Hit:** the existing shake.
  - **Knocked out:** the existing fade and tilt.
  - All of it off under reduced motion, as now.
- **No chibi request in a fight:** stop loading `outfit-chibis` there. `StageAlly` keeps `{ id, bust }`.
- **Fallback:** when an outfit has no bust, keep the existing DOM fallback (line 386), now keyed on the bust.
- **The cut-in** is unchanged.

## Do

1. **Loading:** in `FightScreen.tsx`, load only busts for allies. Simplify `StageAlly` and every use.
2. **The stage:** in `BattleScene.ts`, draw allies from `bust-<id>`. Replace the cheer swap with the hop and glow, and
   retune the idle breath. Keep the actor boxes from `background-layout.ts`, adjusting the ally row's box shape if a
   bust reads too small (note it under Decisions).
3. **Tests:** update `background-layout.test.ts` if the ally boxes change, and any test that builds a `StageAlly`.
4. **Docs:**
   - `docs/game/sections.md` § Fight → Stage: "the party below, as busts".
   - `docs/game/combat.md`, if it names chibis.
   - Log a D-decision (the owner's instruction).
5. **Check it** in the iOS Simulator's Home Screen app:
   - a fight with five allies: the busts are framed and none is cut off;
   - a win's hop;
   - a knockout;
   - the Limit Break cut-in;
   - reduced motion on.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; the main JS is under budget.
- [ ] `grep -rn "outfit-chibis" apps/web/src/places/scenario-gate apps/web/src/battle` finds nothing.
- [ ] The Simulator check was done and described. The docs and the D-decision are in, and it's deployed (green
      `gh run watch`, `/api/health` shows the commit).

## Deliver

- Claude: commit to `main`, `feat(web): busts on the battle stage, no chibis (SB5)`.
- ChatGPT: branch `sib/sb5-battle-busts`, a pull request with the same title.
- **Flag it done:**
  - delete this file;
  - add a Done row here;
  - set SB5 to Done in uma-platform's queue.
