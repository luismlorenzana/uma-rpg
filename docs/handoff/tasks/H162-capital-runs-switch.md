# H162 — The switch: capital runs live (save v37)

**uma-rpg · ChatGPT or Claude · M · Needs: H159, H160, H161 · Unblocks: nothing**

## Why

H159–H161 built capital runs dark (D293). This packet turns them on:
- every capital becomes runs of four full parties;
- the World step lights on a won run;
- the window record loses its champions mask;
- the old three-route capital goes.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, [the manual](../../game/README.md), [the phone check](../../testing/phone-check.md).
- **The design:** [capitals.md](../../design/capitals/capitals.md), all of it.
- **The packets' Done rows** in [README.md](../README.md), with anything H159–H161 noted for the manual.
- **The last switch to copy:** H157 (D288) turned save v35 on. D289's commit `8fe15c6` moved v35 to v36: the list of
  tests that pin the live version is in that diff, and they all move again.
- **Production save rules** (the 2026-10-30 incident, D292): this packet doesn't touch the production save by hand. The
  game migrates it on first load, and the server copies the stored v36 save to `saveBackups/{uid}-v36` on the first
  v37 write.

## Decisions made

1. **The bump:** `SAVE_SCHEMA_VERSION = 37`, and `capitalRunsLive()` is now true everywhere.
2. **What goes:**
   - The three-route capital: `capitalChapter`'s vanguard and champion nodes, `capitalStageIds` and `CapitalMap.tsx`.
   - `stageExpPay`'s capital rule in `world/world.ts`.
   - `recordChampion`, and `championBit`, `championsWon` and `WINDOW_ROUTES`.
   - The record's `champions`, which becomes required-absent.
   - `RPG_FINALS_ROUTES` (runs read `RPG_FINALS_LANES`).

   The v35 credit (`windows.ts` `credit`) still lights World for a save before v35. Have it light the `world-n` step
   directly where it set the mask: a continent's three champions won in that world and her level at its top.

   Any `world.run.wins` entries for old capital stages stay, inert. An open fight on an old capital stage settles as a
   removed node does: a regular fight at its foes' level.
3. **The continent map:** the capital spot always reads runs (H161's line). The capital castle, the map and the routes
   are otherwise unchanged.
4. **The manual:**
   - [maps](../../game/maps.md): Capitals is rewritten for runs (lanes, generals, the Final, pay) and the shape table's
     capital line is updated.
   - [loops](../../game/loops.md): the Windows section's World bullet ("a won capital run") and the record (no mask),
     Leveling's capital line, and a short **Capital runs** section beside the Rift's, or folded into maps with a link.
   - [sections](../../game/sections.md): the Scenario Gate's capital page, New run, a run's page, the fight's words.
   - [architecture](../../game/architecture.md): save v37 in the history and the shape (`capitalRuns`, `capitals`;
     the record's `champions` gone).
   - Then `pnpm docs:update` (the World rows of the live `windows` table change).
5. **The phone check gains:** a New run with four parties, a general won, the Final locked until all twelve fall, a
   final won, and a won run lighting World I for its twenty on their windows.

## Do

1. The bump. Delete what decision 2 lists. Move the tests that pinned v36 as live to 37; old-save tests keep their
   fixtures.
2. A scratch migration of a local save copy (never the production one): a v36 save gains empty runs, its records lose
   `champions`, and nothing else changes (a field diff). `updatedAt` never moves.
3. The manual (decision 4), then `docs:update`, then the phone check (decision 5).
4. Look at it end to end on the local preview (`.claude/launch.json`'s `rpg-api` and `rpg-web`):
   - a migrated save opens;
   - a run starts with four parties;
   - generals advance, and the Final opens and is won;
   - World I lights for the twenty;
   - a second run by the same Umas pays a quarter.

   Check at 390×844 and 375×667, light and dark.
5. Log the D-row (fetch `main` first) and update [README.md](../README.md)'s status (save v37).

## Done when

- [ ] `pnpm lint && pnpm test:ci && pnpm build` pass. Give the main JS figure against the 230 KB budget.
- [ ] The scratch migration's diff shows only the new fields and the dropped masks.
- [ ] Nothing from the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and https://uma-rpg.web.app/api/health
      shows the commit.
- [ ] The owner has the phone check's new lines.

## Deliver

- **Claude:** commit to `main`: "feat: capital runs live, save v37 (H162)".
- **ChatGPT:** a branch and a pull request with that title. Merge it yourself when the checks and CI are green. Fetch
  `main` before you push so the D-number is free.
- **Flag it done:** delete this file and add a Done row in [README.md](../README.md) with the commit.
