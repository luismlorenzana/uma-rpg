# H52 — The Rift's finale: every champion of the run

**uma-rpg · Either · S · Needs: H50 (done) · Unblocks: nothing (closes the Rift build)**

## Why

[rift.md](../../design/rift.md) §6 ends a won run with "a last cut-in of every champion of the run. **The run is won.**"
H50 built the Rift's page and result but left this out (its D175). It is the climax of the whole event, the one screen
that shows the twenty Umas beat all of them. Build it.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, rift.md §6 and §7, D173–D176 in `docs/decisions.md`.
- **The result:** `apps/web/src/places/rift/RiftResult.tsx` shows `AchievementCutIn` first when `result.earned` is
  non-empty (`cutIn` state), then the result. `RiftFightResult` comes from `@rpg/domain/rift` (`save/rift.ts`).
- **The faces:** `riftFight(ctx, ref)` / `riftChain(ctx, front)` / `riftConvergence(ctx)` in
  `packages/domain/src/rift/generate.ts` give `RiftFightPlan`s whose `enemies` (and `waves`) carry each foe's `castId`.
  The Convergence's four fights draw their own faces (`picker.ts`: a run's 52 fights in allocation order). `riftContextFor`
  (`save/rift.ts`) builds the context for the run; use the run's own id so the faces match what was fought.
- **The art:** `battle/CastFace.tsx` (H50 moved it there) draws a cast face from the roster; `useRoster`/the content
  loader as `RiftFightRoute.tsx` uses it. Enemy art is master data by stable id: nothing from the original games in git.
- **The cut-in's look:** `achievements/AchievementCutIn.tsx` (opaque `fixed inset-0 z-50`, dark theme, a dialog, focus to
  Continue, reduced motion draws at rest). Match it.

## Decisions made

- **Which faces:** every boss-faced foe (`RosterMember.tier === 'boss'`) of the run's four champions (each front's stage
  12) and its four Convergence fights, deduplicated by cast id, in that order (Iron, Arcane, Duel, Horde, then the
  Convergence). Faces not in the loaded roster are skipped.
- **When:** only on the win that wins the run (the last Convergence fight; the run's `wonAt` is set by it). It plays
  **before** the achievement cut-in, then the achievements (Rift conquered, Swift Convergence…), then the result.
- **What it shows:** a title, "The Rift is won", the tier ("Tier 1"), the faces in a wrapped grid (busts or face crops at
  a size that fits two rows of four at 375 wide; more wrap and the panel scrolls), one line "Twenty Umas, four fronts,
  n champions", and Continue. A short staggered reveal of the faces; under reduced motion all at rest.
- **Pure helper:** `riftFinaleFaces(plans, roster): string[]` in `places/rift/rift-view.ts`, tested.

## Do

1. `riftFinaleFaces` and its test in `rift-view.test.ts` (dedup, order, boss faces only, unknown ids skipped).
2. `places/rift/RiftFinale.tsx` (`{ tier, faces, onDone }`), with a test: renders the title and n faces, Continue calls
   `onDone` once, reduced motion renders without animation.
3. `RiftResult.tsx`: on the run-winning result, the finale first, then `AchievementCutIn`, then the result. A test in
   `RiftResult.test.tsx` for the order; every other outcome unchanged.
4. Docs: `sections.md` § The Rift gains the finale bullet; rift.md §6: "Built in H52 (D…)". Log the D-decision (fetch
   `main` first; the next free number). Run `pnpm docs:update`.
5. Check it locally at 390×844 and 375×667, light and dark, in a desktop browser (never the iOS Simulator), on a scratch
   save in your worktree's `apps/api/.data` built with a script on the domain's CJS build: every front sealed, the
   Convergence open at fight 3; win it (weaken the foes in the scratch input if needed) and see finale → achievements →
   result. Enemy art may be missing locally (coloured circles); say so.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; the finale is in the lazy Rift chunk (main JS unchanged; say it).
- [ ] The tests in steps 1–3 pass.
- [ ] The local check in step 5 was done at both widths and both appearances, and described.
- [ ] `docs/game/` and rift.md are in step, `pnpm docs:update` leaves no diff, the D-decision is logged.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- **Claude:** commit to `main` as `feat(web): the Rift's finale, every champion of the run (H52)`, push, watch the deploy.
- **Flag it done:** delete this file, set H52's State to Done in `docs/handoff/README.md`, and add a Done row.
