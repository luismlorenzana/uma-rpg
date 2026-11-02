# H153 — Trials: the Echoes' own place on the Battle page

**uma-rpg · Claude or ChatGPT · M · Needs: nothing · Unblocks: H155 (works on the Rift page after the Echoes leave it)**

## Why

The owner asked for content for maxing ranks. It exists: the Rift's Echoes, Lv 50 parties at Lv 45, 50 and 55 paying
twice a stage's Class EXP. They sit at the bottom of the Rift page, which is why they were forgotten. The approved design
(D283, CO20) gives them their own place, **Trials**, with the same fights, pay, Sweeps and records. **This packet ships
live:** it changes no save and no rule, only where the fights are found and what they're called.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, [the manual](../../game/README.md): [loops](../../game/loops.md#the-rift) (Echoes),
  [sections](../../game/sections.md#the-rift) (the Rift page, the Echo sheet).
- **The design:** [collections.md](../../design/collections/collections.md) §6.3 and §7.5; the
  [screens page](../../design/collections/previews/screens.html), phone 7.
- **Places:** `packages/domain/src/hub/places.ts` (the Battle page: `scenario-gate` at (0.5, 0.3), `tier-finale` at
  (0.5, 0.72) with `frame: 'rift'`; `placeOpen`, `placeLock`: the Rift's five-Lv-50 rule), its tests;
  `apps/web/src/places/registry.tsx`.
- **The Echoes on screen:** `apps/web/src/places/rift/RiftPage.tsx` (the `data-rift-echoes` list, `EchoSheet`),
  `EchoSheet.tsx`, `RiftFightRoute.tsx`, `RiftResult.tsx` (an Echo's buttons and title), `rift-view.ts`, `use-rift.ts`.
- **Rules:** `save/rift.ts` (`sweepEcho`, `riftFightBlock`), `rift/generate.ts` (`riftFight`); untouched.
- **Copy:** `apps/web/src/places/stable/copy.ts` and the copy test (≤ 6 words a surface string).

## Decisions made

1. **The place:** `trials`, page `battle`, kind `battle`, name "Trials", at **(0.2, 0.52)**; it opens and locks with the
   Rift's rule (five Lv 50 Umas, Tiers 1 and 2; "No Trials in this tier yet" in Tier 3, as the Rift). Until H156's art,
   its building is uma-art's unused `knights-bastion` (`frame`). Line: "Class EXP ×2 for Lv 50 parties."
2. **The Battle page's four places** (H154 adds the fourth): Scenario Gate (0.5, 0.3) and the Rift (0.5, 0.72) stay;
   Trials (0.2, 0.52); Drills (0.8, 0.52). Check the layout with `?canvas` (the preview pane can't screenshot WebGL
   otherwise) at 390×844 and 375×667; move the two new ones a little if a building overlaps a road or a prop, and say so.
3. **The page** (`places/trials/TrialsPage.tsx`): "Trials" and "Class EXP ×2 · Lv 50 parties", then today's Echo grid,
   four fronts × Lv 45, 50, 55, "✓" on each won. A tap opens today's Echo sheet, moved to `places/trials/`, retitled
   "Iron Trial · Lv 55". Fight, Sweep ×1 and ×5 as today.
4. **Names on screen:** "Trial" wherever the player read "Echo": the sheet, the fight's title ("Trial · Iron · Lv 55"), the
   result's buttons, "Back to Trials". Code and save keep `echo` (`RiftFightRef` kind `echo`, `rift.echoes`), so no save or
   replay moves.
5. **Routes:** `/battle/trials` and its sheet's param; the Rift's old Echo links go to Trials.
6. **The Rift page** loses its Echo list and sheet; nothing else on it changes here (H155 changes its Ascend).
7. **The quick look:** Trials' line, or "Opens at five Lv 50 Umas · 3/5" while shut.

## Do

1. The place, its tests (`places.test.ts`'s layouts), the registry entry.
2. Move the Echo grid and sheet to the Trials page; rename on screen; routes and redirects.
3. Copy into `copy.ts` first; the copy test passes.
4. The manual: [sections](../../game/sections.md) (Battle's places, a Trials section, the Rift page without Echoes),
   [loops](../../game/loops.md#the-rift) (the Echoes are fought at Trials), `pnpm docs:update` if a live block moves.
5. Look at it: the Battle page with `?canvas`, Trials' page, a Trial fight and its result, at 390×844 and 375×667, light
   and dark.
6. Log the D-row (fetch `main` first).

## Done when

- [ ] `pnpm lint && pnpm test:ci && pnpm build` pass. Say the main JS number, of 230 KB.
- [ ] Every Echo win, Sweep and record works from Trials; the Rift page has no Echo left.
- [ ] Nothing from the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and https://uma-rpg.web.app/api/health
      shows the commit.

## Deliver

- **Claude:** commit to `main`, "feat(web): Trials, the Echoes' own place (H153)".
- **ChatGPT:** a branch and a pull request with that title; merge it yourself when the checks and CI are green. Fetch
  `main` before you push so the D-number is free.
- **Flag it done:** delete this file and add a Done row in [README.md](../README.md) with the commit.
