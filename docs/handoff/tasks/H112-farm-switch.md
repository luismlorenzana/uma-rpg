# H112 — The farm by line's switch: save v30 live, R2's farm retired, the manual

**uma-rpg · ChatGPT · M · Needs: H110, H111 · Unblocks: R3 (its saves become v31–v33)**

## Why

H109–H111 built the farm by line dark and inert (D224;
[farm-by-line.md](../../design/tier-rework/farm-by-line.md)). This packet turns it on.
- **The steps:** chain `toV30`, move the save to v30, and delete R2's farm rules and screens.
- **The docs:** rewrite the manual, and re-plan R3–R5's save numbers.
- **The risk:** it is **the one irreversible step**. It migrates the owner's live save, so it runs the migration on a
  full-shaped scratch save before merging and shows the result in the pull request (H82's way).

## Scope

- **In:**
  - the chain and the version;
  - the deletions;
  - the API test;
  - the manual and the docs around it;
  - the local check;
  - the deploy.
- **Out:** any rule or screen change beyond what FL1–FL24 and H109–H111 built. If something is wrong, fix the smallest
  thing and log it.

## Context (read first)

- [farm-by-line.md](../../design/tier-rework/farm-by-line.md) (all); D224 and H109–H111's D-rows; D218 (H82, R2's
  switch: the pattern); D221 (the last version re-plan's notes).
- `save/version.ts` (`SAVE_SCHEMA_VERSION`, `farmByLine`), `save/migrations.ts` (`migrateWorld`, `toV30`), `save/save.ts`
  (the parse), `apps/api/src/save/firestore-save.repository.test.ts` (v28 → v29 today).
- The manual: `docs/game/materials.md`, `loops.md`, `sections.md`, `classes.md`, `architecture.md`, and
  `packages/domain/src/docs/render.ts` (the generated tables).

## Do

1. **Turn it on:**
   - `migrateWorld` chains `toV30` after `toV29` (`version < 30`);
   - `SAVE_SCHEMA_VERSION` 30, so `farmByLine()` is true;
   - new saves are v30.
2. **Retire R2's farm.** Delete every path `farmByLine()` false selects, then the switch itself (`farmByLine`,
   `FARM_BY_LINE_SAVE`), so each rule has one path.
   - **Domain:**
     - R2's catalog of sixty types with tiers and bands (`items/materials-id.ts`, `materials.ts`), the ladder and R2's
       recipes (`items/made.ts`' `madeRecipe`, `ladderTier`, `gradeBand`);
     - `PLACES_V3`' single `kind` (keep `PLACE_IDS_V3`, `PlaceIdV3`, `PLACE_SLOTS_V3`, `PLACE_SPEED_V3`, the trades);
     - `work/kinds-v3/material.ts` and `make.ts`, `rpgWorkEnv`;
     - the v28 request parse (`madeAtV28`, `parseRequestV28`, `v28Work`): a stored v28 or v29 save is migrated before
       it's parsed;
     - R2's Exchange and targets paths;
     - R2's ledger (`professions.sim.ts`), replaced by H109's.
   - **Web:** `place-view.ts`' R2 helpers and the Workbench grid, `PlaceV3`'s R2 What step and peek, R2's Exchange rows,
     the Warehouse's R2 order and facts.
   - Keep what the migrations need: they use literals; check that `toV28` and `toV29` import nothing you delete.
   - Keep H109's `V4` names; renaming is not part of this packet.
   - Their tests go with them; R2's migration tests stay.
3. **The API** (FL20): `firestore-save.repository.test.ts` moves to v29 → v30:
   - a stored v29 save with stock is read and parsed to v30 without writing;
   - the first v30 write keeps `saveBackups/u-v29`;
   - a v29 app is refused once v30 is stored.
4. **The tests that pin the live save** move to v30, as D221 did for v29: `save-v28.test.ts`' checks, the typed test
   saves.
5. **The manual** (as played after this packet):
   - `materials.md`:
     - the five lines with ten grades each;
     - one making place's item each;
     - the recipes and the gear table's "What raises a slot" (Arms Gem, Tome Ink, Armor Fittings, Accessory Setting by
       grade);
     - the Exchange line;
   - `loops.md`:
     - the loop diagram (gather → process and make at her line's making place);
     - the Craft Level section (her trade's three steps, the gate, speeds with making at ¾, batches);
     - the jobs table;
     - currencies and prices;
     - Targets' places;
   - `sections.md`: the Wilds' place table and facilities table (Arms Crafting, Tome Crafting), and a place's page (the
     Process and Make groups, the sizes, the quick looks);
   - `classes.md`: weapons raised with Arms Gems or Tome Ink;
   - `architecture.md`: save v30 in the save history;
   - `render.ts`' generated blocks: families, items, gems, gear, prices, jobs, facilities.
   - Run `pnpm docs:update`; it leaves no diff after your commit.
6. **The docs around it:**
   - **The design docs:** a banner on
     [profession-progression.md](../../design/tier-rework/profession-progression.md): "Superseded in part by D224
     (H109–H112): §3, §4's processing, §6's recipes and times, PP7–PP13, PP17." On farm-by-line.md: "Live from H112".
   - **The version re-plan** (FL21): implementation.md's note, and the handoff index's R3, R4 and R5 headers. R3, R4 and
     R5 take saves v31, v32 and v33.
   - **The R3–R5 packets:** in each one, its D221 note becomes "read save v29 as v31, v30 as v32, v31 as v33 (D221,
     D224)".
   - **R3's header:** one line that H83 (the Branch Gem's recipe), H84 (the Accessory Setting over two slots), H85 (Moon
     Jewels) and H86 (the secondary profession) re-read the farm by line.
7. **The scratch migration, before merging:**
   - Build a full-shaped **v29** save from the CJS build: H110's fixture's shape, with work running and queued, every one
     of R2's sixty ids in stock, Weapon Gems, a Tome and an Arms weapon graded, a `grant`, and a Tier 2 world with stock.
   - Load it in the switched build, on your own ports (avoid 8098 and 5198), in a desktop browser, never the iOS
     Simulator.
   - **Put in the pull request:** each world's stock before and after (old id → count → new id → count) and the settled
     jobs.
   - **Then play it:**
     - each line's three steps at G1 (gather, process ×8 at its making place, make one item);
     - raise a Katana with an Arms Gem and a Fire Tome with Tome Ink;
     - the Exchange's tabs;
     - the Warehouse's grade chips;
     - the targets strip at the Forge and the Fields;
     - the first launch on a v29 save, with no error.
   - Check at 390×844 and 375×667, light and dark. Describe what you saw; screenshots with original art stay local.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; the main JS number (budget 230 KB).
- [ ] No `farmByLine` left; no R2 farm rule or screen left; the migration tests (v25–v30) and the replay tests green.
- [ ] The pull request shows the scratch migration's before and after.
- [ ] The manual matches the game; `pnpm docs:update` leaves no diff.
- [ ] A D-row logs the switch (fetch `main` first). Nothing from the original games in git.
- [ ] Deployed green, and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- A pull request from `feat/h112-farm-switch`, one commit: `feat: the farm by line live, save v30 (H112)`.
- **ChatGPT merges it itself** once CI is green and the scratch migration is in the pull request (the owner, 2026-10-26:
  full autonomy), then watches the deploy: `gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`. Rerun a failed
  job once if it's the web suite's known flake (`Timeout calling "onTaskUpdate"`).
- **Tell the owner what to check on the phone:**
  - his Warehouse after the update (Iron Ore became Gold Ore, and the like);
  - the Forge processing then making;
  - the Workbench making Tome Ink;
  - a Mage's Upgrade view.
- **Flag it done:** a `docs(handoff): H112 done (D…)` commit deletes this file and adds a Done row to
  `docs/handoff/README.md`.
