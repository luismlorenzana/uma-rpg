# H157 — The switch: windows, Drills and per-Uma Ascend live (save v35)

**uma-rpg · Claude · M · Needs: H152, H153, H154, H155 · Unblocks: H158**

## Why

H152, H154 and H155 built the collections dark (D283). This packet turns them on: save v35, every Uma's window, the
Gallery in the Observatory's place, Drills and Training Logs, and Ascend one Uma at a time once her window is full.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, [the manual](../../game/README.md), [the phone check](../../testing/phone-check.md).
- **The design:** [collections.md](../../design/collections/collections.md), all of it; §9 is the switch.
- **The packets' Done rows** in [README.md](../README.md): what H152, H154 and H155 built and anything they noted for the
  manual.
- **The save:** `save/version.ts`, `save/migrations.ts` (`migrateWorld`), `toV35`, `parseSaveChecked`;
  `docs/technical/infrastructure.md` (production saves).
- **The docs' live blocks:** `packages/domain/src/docs/render.ts` and `docs.test.ts`.
- **Production save rules** (the 2026-10-30 incident): this packet doesn't touch the production save by hand. The game
  migrates it on first load, as every bump has.

## Decisions made

1. **The bump:** `SAVE_SCHEMA_VERSION = 35`; `migrateWorld` chains `toV35`; the account's fields are added in
   `parseSaveChecked`. `collectionsLive()` is now true everywhere.
2. **What goes:** the run-level `ascend`, `ascendBlock`, the Rift's old Ascend sheet and every caller; the Observatory's
   page and place (if H155 kept them for the dark period).
3. **The manual:**
   - [loops](../../game/loops.md): a **Windows** section (the board as a live table, `windows`, every tier; latching; the
     switch's credit), **Drills and Training Logs** (a live table, `drills`), the Rift's sign-up and runs, **Ascend**
     one Uma at a time; the loop diagram gains windows; Currencies gain Training Logs.
   - [sections](../../game/sections.md): the profile's companion and the Window sheet, the Gallery (in Learning, the
     Observatory's section replaced), Trials and Drills (Battle), the Rift page, Ascend.
   - [architecture](../../game/architecture.md): save v35 in the history.
   - [heroes](../../game/heroes.md): the Learning page's layout (the Gallery under the Sanctum).
   - `pnpm docs:update`.
4. **The phone check** gains the windows: a profile's companion, the Window sheet, the Gallery's order and percentages,
   a Drill's sweep, a Log read, an Ascend.
5. **From H155 (D287), for the manual and the check:** the Gallery's words are in `places/gallery/glass-view.ts`; the
   Observatory's page and registry entry are still there for the dark period (delete them, and `copy.test.ts`'s
   `ObservatoryPage.tsx` line); the Rift's `riftWonLine` and the windows in its roster sheet; the "Window +1" note
   (`WindowToast`) stands in for a fight result's line; the 390×844 and 375×667 look at the profile, the sheet, the
   Gallery and an Ascend happens here (H155 moved it).
6. **A won run waiting to ascend** at the switch keeps its twenty in their world; they ascend from the Gallery once their
   windows are full (collections.md §9; the owner was told on 2026-11-02).

## Do

1. The bump and the chain; delete what decision 2 lists; tests that pinned v34 as the live version move to 35
   (old-save tests keep their fixtures).
2. A scratch migration of the newest full-shaped fixtures and of a local save copy (never the production one):
   windows latched, World credit right, the record's size, nothing else changed (a field diff).
3. The manual (decision 3) and `docs:update`; the phone check (decision 4).
4. Look at it end to end on the local preview (`rpg-api`, `rpg-web`): a migrated save opens, windows light, the Gallery
   ranks, a Drill pays, Logs level an Uma, an Ascend lands in Tier 2, at 390×844 and 375×667, light and dark.
5. Log the D-row (fetch `main` first) and update [README.md](../README.md)'s status (save v35).

## Done when

- [ ] `pnpm lint && pnpm test:ci && pnpm build` pass. Say the main JS number, of 230 KB.
- [ ] The scratch migration's diff shows only the new fields and latched steps.
- [ ] Nothing from the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and https://uma-rpg.web.app/api/health
      shows the commit.
- [ ] The owner has the phone check's new lines.

## Deliver

- **Claude:** commit to `main`, "feat: collections live, save v35 (H157)".
- **Flag it done:** delete this file and add a Done row in [README.md](../README.md) with the commit.
