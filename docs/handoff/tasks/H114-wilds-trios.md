# H114 — The Wilds' trios: fifteen places, a workbench a line, equal steps, save v31

**uma-rpg · ChatGPT · L · Needs: H113 (uma-art 2.14.0 published) · Unblocks: R3 (its saves become v32–v34)**

## Why

The owner likes the farm by line's loop, Farming → Processing → Crafting, and wants each step in its own building:
**fifteen places, five rows of three, connected by roads** (D230). The design is
[farm-by-line.md](../../design/tier-rework/farm-by-line.md) §11 (FL25–FL33) with its per-Uma review; this packet builds it
and ships it live, as H112 did. It **migrates the live save** (v30 → v31).

In short:
- every line works **three places**: its gathering place (unchanged), a **new workbench** that only processes, and its
  making place, which only makes and three of which are renamed (Weapon Forge, Tome Forge, Charm Forge);
- **every step takes the same time** (36 minutes at Craft Lv 1 → 24 at Lv 50, per item), so a refined item costs what it
  costs today and each building of a trio is equally busy;
- **the amounts stay** (the review: the weapon trades don't fall behind);
- the Wilds map holds the fifteen buildings, the workbench of each row standing on the trunk road.

## Scope

- **In:** the domain (places, professions, trades, job kinds, step times, targets, the ledger, place blurbs), save v31
  and its parse, the API test, every screen that names or lists a place, the map's spots and frames, the uma-art pin, the
  manual, R3–R5's save notes, the scratch migration, the deploy.
- **Out:** the art (H113); any recipe amount, price or batch size; uma-kit (the map is expected to fit as it is, FL32: if
  it doesn't, stop and write a "Both apps:" request, [change-protocol.md](../../change-protocol.md), never a fork).

## Context (read first)

- `CLAUDE.md`, `AGENTS.md` (commands, player text short, 44 pt targets, 390×844 and 375×667, explanations behind the
  (i)); D224–D228 (the farm by line and how H109–H112 built it), D230 (this design).
- [farm-by-line.md](../../design/tier-rework/farm-by-line.md): §1–§8 (the farm as played) and **§11** (FL25–FL33, every
  name, id and number here).
- **The domain** (`packages/domain/src/`):
  - `economy/professions.ts` (`PROFESSION_IDS`, `PROFESSIONS`, `PLACE_IDS_V3`, `Trade`, `TRADES`, `tradeProfessions`,
    `tradePlaces`, the slots and speed);
  - `economy/places-v4.ts` (`PLACES_V4`, `placeSpecV4`, `isMakingPlaceV4`, `jobKindV4`, `PROFESSION_NAMES_V4`,
    `workPlace`);
  - `economy/pacing.ts` (`itemMinutes`, `refineMinutes`, `MAKE_SHARE_V4`, `makeMinutesV4`, `REFINE_BATCHES`);
  - `work/kinds-v4/material.ts`, `make.ts`, `work/env-v4.ts`, `work/kinds-v3/trade.ts` (the gate and the open shop);
  - `save/work.ts` (`kindAt`, `planJob`), `save/targets.ts` (`facilityTargets`), `save/save.ts` (`parseSlotV28`,
    `madeAtV30`, `parseRequestV30`, `v30Work`), `save/migrations.ts` (`settleWork`, `toV30`, `migrateWorld`),
    `save/version.ts`, `save/v29.fixture.ts` (the pattern for a fixture with literal work rows);
  - `hub/places.ts` (`WILDS_LAYOUT`, `placeV3`, `WILDS_V4`, `wildsPlaces`);
  - `economy/professions.sim.ts` and `professions-v4.sim.ts` with its test (the ledger);
  - `docs/render.ts` (the manual's generated tables: families, jobs, facilities, places).
- **The web** (`apps/web/src/`): `places/work/PlaceV3.tsx` (the shell), `PlaceV4.tsx` and `place-view-v4.ts` (the What
  step, sizes, help, quick look), `place-view.ts` (`whoAt`), `FacilityPage.tsx`, `places/registry.tsx`, `save/trade.ts`
  (`tradeLabel`: the Stable's Trade facet and the Work tab), `hub/HubScreen.tsx` (places on the map).
- **The kit's map** (uma-platform `packages/kit/src/hub/grid.ts`, `terrain.ts`): 16 px tiles at 1.5 CSS px, an odd column
  count (17 at 375–390 px), the trunk road on the middle column, a branch path from each door to it, a lane round any
  building on it, the stream on the east edge, 112 px place links.
- **The API:** `apps/api/src/save/firestore-save.repository.test.ts` (v29 → v30 today).

## Decisions made

1. **The places** (FL25, FL26), `PLACE_IDS_V3` in the Wilds' new order, one row a line:

   | Row | Gather (kind `gather`) | Workbench (kind `refine`, new) | Make (kind `craft`, the Lapidary `cut`) |
   |---|---|---|---|
   | Metal | `mine` Mine · Mining | `mine-workbench` Mine Workbench · Smelting | `weapon-forge` Weapon Forge · Arms Crafting |
   | Vegetables | `fields` Fields · Farming | `fields-workbench` Fields Workbench · Prepping | `tome-forge` Tome Forge · Tome Crafting |
   | Wood | `forest` Forest · Wood Chopping | `forest-workbench` Forest Workbench · Sawing | `armorer` Armorer · Armor Crafting |
   | Fish | `fishery` Fishery · Fishing | `fishery-workbench` Fishery Workbench · Filleting | `charm-forge` Charm Forge · Accessory Crafting |
   | Stone | `monster-den` Monster Den · Hunting | `den-workbench` Den Workbench · Stonecutting | `lapidary` Lapidary · Jewel Crafting |

   - `PlaceSpecV4` keeps its shape: a workbench `{ line, kinds: ['refine'], made: [] }`, a making place `{ kinds:
     ['craft'] }` (the Lapidary `['cut']`) with its made lines (`weapon-forge` keeps the Branch Gem for R3).
   - Profession ids: add `smelting`, `prepping`, `sawing`, `filleting`, `stonecutting`; rename `weapon-crafting` →
     `arms-crafting` and `processing` → `tome-crafting`. `ProfessionKind` is `gathering`, `processing` or `making`.
   - `Trade { gathering, processing, crafting }`; `tradeProfessions` and `tradePlaces` return three, gathering first.
     The trades' order (`TRADE_IDS`) doesn't change.
2. **The rules** (FL2, FL27):
   - processing (`refine`) only at its line's workbench; making only at its making place; gathering as today;
   - `jobKindV4` follows: a refined item is a `refine` at its line's workbench only; a made item a `craft`/`cut` at its
     making place only; a raw item a `gather` at its gathering place;
   - the trade gate and the open shop as today, per place (a trade's three places are hers).
3. **Equal steps** (FL28), in `pacing.ts`:
   - `STEP_MINUTES = { atFirst: 36, atMax: 24 }` and `stepMinutes(level)`, linear like `itemMinutes`;
   - the v4 kinds use it for all three: a gather `stepMinutes`, a process `stepMinutes`, a make `stepMinutes ×
     refined`; `MAKE_SHARE_V4` and the v4 use of `refineMinutes` go;
   - **`itemMinutes` (54 → 36) stays as it is**: v1's rules and `toV28`'s grant floor read it;
   - batches, Craft EXP (2 a minute before the place's speed), Speed Tickets: unchanged.
4. **Save v31** (FL31): `toV31` = `settleWork` (outputs into `items`, EXP into `craft`, queued requests drop, `work: {}`),
   chained after `toV30`; `SAVE_SCHEMA_VERSION` 31. The v31 parse: the fifteen places' slots; a request's kind must be
   its place's one kind. Nothing else in a save names a place.
5. **The map** (FL32): `WILDS_LAYOUT` holds fifteen spots, row by row: left `x: 0.2`, middle `x: 0.5` (on the trunk
   road), right `x: 0.8`, at today's heights (`y` 0.1, 0.3, 0.5, 0.7, 0.9; nudge a right building left if the stream
   touches it). Frames: each new place by its id (H113's frames), the Fields `vegetable-garden`, the Armorer
   `lancers-barracks`, the Lapidary `lapidary`. Blurbs: a workbench "Smelting: ores into ingots.", "Prepping:
   vegetables into cuts.", "Sawing: logs into planks.", "Filleting: fish into fillets.", "Stonecutting: stones into cut
   stones."; a making place "Arms Crafting: Arms Gems." (Weapon Forge), "Tome Crafting: Tome Ink." (Tome Forge), "Armor
   Crafting: Armor Fittings.", "Accessory Crafting: Accessory Settings." (Charm Forge), "Jewel Crafting: Planet and Moon
   Jewels."; a gathering place's stays.
6. **The screens:**
   - **A gathering place:** as today.
   - **A workbench:** its What step is its line's ten refined tiles (`processTilesV4`), sizes ×1 … ×40, the chosen item's
     card; opens on the highest grade she can process; its quick look shows the ten refined icons; (i): "Processes
     {line}'s raw items into refined ones, one for one. Grade g opens at Craft Lv 5g − 4."
   - **A making place:** its What step is its Make chips only (no Process group), sizes 1–10; (i): "Makes {item} from
     {refined}, one step for each in it. Grade g opens at Craft Lv 5g − 4."; quick look: its chips.
   - **For your targets:** a gathering place its line's raw items, a workbench its line's refined items, a making place
     its made items.
   - **The header:** "Mine Workbench · Smelting · 4 slots · ×1.25".
   - **The Stable's Trade facet and the Work tab:** a trade by its first and last places, "Mine · Weapon Forge".
   - **The open shop line** names the trade's class as today, at all three of its places.
7. **The ledger** (FL30): three places a trade, workers capped at twelve (`3 × PLACE_SLOTS_V3`); the workbench carries the
   processing, the making place the making, each `stepMinutes(25)` an item. Assert: 520 refined (528), 783.2 h (795.2),
   each place 50.2 (Wood, Fish) · 52.7 (Metal, Vegetables) · 55.2 (Stone) h, place supply 2.39 · 2.28 · 2.17, trades as
   today, FORTY 1.27 a day binding on the magical trade, TWENTY 0.54, G10 held on day 22.5.

## Do

1. **Pin** uma-art 2.14.0 (wherever 2.13.0 is pinned) once H113 is published; check the eight frames exist.
2. **Domain:** professions and trades (1), places (1, 5), kinds and steps (2, 3), `kindAt`, `facilityTargets` (6), the
   blurbs and layout (5), `render.ts`' tables (families: gathered at · processed at · made at; facilities: fifteen rows
   with kind Gathering, Processing or Making; jobs: one step 36 → 24 min).
3. **Save v31:** `toV31`, the chain, the version, the v31 parse; a `v30.fixture.ts` (a v30 world with a process running at
   `weapon-forge` and a make at `workbench`, as v30 wrote them, as literal rows; a queue; stock) for the tests and the
   scratch migration.
4. **The web:** (6), the registry (fifteen place pages from `PLACES_V4`), the map's places.
5. **Tests:**
   - professions and trades (fifteen professions, three places a trade, the ids);
   - places: fifteen spots in five rows of three, middle column on the trunk, frames and blurbs;
   - kinds (`kinds-v4.test.ts`): a workbench processes its line and refuses another's, a gather and a make; a making place
     makes and refuses a process; `stepMinutes(1)` 36 and `(50)` 24; an Arms Gem G1 takes 7 × 36 minutes at Lv 1; a
     process 36;
   - targets: each place's list (6);
   - the ledger (7);
   - `migrations-v31.test.ts` (settled, EXP paid, queue dropped, chained, new saves at v31) and `save-v31.test.ts` (a
     process at a workbench parses; a process at a making place and a make at a workbench are refused);
   - the API test v30 → v31 (backup `saveBackups/u-v30`);
   - web: the workbench's and a making place's What steps and sizes (`place-view-v4.test.ts`, the adoption test), the
     Trade facet's labels;
   - the version pins that read the live save move to v31 (as D221 and H112 did).
6. **The manual:** `sections.md` (the Wilds' place and facilities tables, the map's rows, a place's page by kind),
   `loops.md` (Craft Level: her trade's three places, the step time; the jobs table; a "save v31" note beside the farm
   by line's), `materials.md` (where each line is processed), `architecture.md` (save v31 in the history), `render.ts`;
   `pnpm docs:update` leaves no diff.
7. **The docs around it:** farm-by-line.md §11 "Live from H114"; implementation.md, the handoff index's R3–R5 headers
   and the thirteen R3–R5 packets' notes: saves **v32, v33 and v34** ("read save v29 as v32, v30 as v33, v31 as v34
   (D221, D224, D230)").
8. **Check it locally, before merging** (your own ports, avoid 8098/5198; a desktop browser, never the iOS Simulator):
   - a **v30** scratch save from the CJS build: running jobs at the old places (a process at the Weapon Forge, a make at
     the Tome Forge, a queue), stock in every line;
   - load it: the jobs settle, nothing else moves; put the before and after in the pull request;
   - the Hub with `?canvas` (the preview can't screenshot WebGL otherwise): the Wilds page shows fifteen buildings in
     five rows of three, the workbench of each row on the trunk road, every door on a road, no building on the stream,
     the place links not overlapping, at 390×844 and 375×667, light and dark;
   - play one row's three steps: gather at the Mine, process at the Mine Workbench (×8), make an Arms Gem at the Weapon
     Forge (finish with Speed Tickets); a workbench and a making place's pages, sizes and targets strips;
   - describe what you saw; screenshots with original art stay local.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number (budget 230 KB).
- [ ] The ledger asserts FL30; the migration and parse tests pass; the replay tests stay green (no engine change).
- [ ] The pull request has the scratch migration's before and after and what the map looked like.
- [ ] The manual matches the game; `pnpm docs:update` leaves no diff.
- [ ] A D-row logs the build (fetch `main` first). Nothing from the original games in git.
- [ ] Deployed green, and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- A pull request from `feat/h114-wilds-trios`, one commit: `feat: the Wilds' trios, fifteen places, save v31 (H114)`.
- **ChatGPT merges it itself** once CI is green and the scratch migration is in the pull request (the owner,
  2026-10-26: full autonomy), then watches the deploy: `gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`.
  Rerun a failed job once if it's the web suite's known flake (`Timeout calling "onTaskUpdate"`).
- **Tell the owner what to check on the phone:** the Wilds page's fifteen buildings and roads; one row's loop (gather,
  process at its workbench, make).
- **Flag it done:** a `docs(handoff): H114 done (D…)` commit deletes this file and adds a Done row to
  `docs/handoff/README.md`.
