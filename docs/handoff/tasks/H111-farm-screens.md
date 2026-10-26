# H111 — The farm by line: the screens (inert)

**uma-rpg · ChatGPT · L · Needs: H109 · Unblocks: H112 · Runs beside H110 (different files)**

## Why

The farm by line (D224; [farm-by-line.md](../../design/tier-rework/farm-by-line.md)) changes what the place pages, the
Exchange, the Warehouse and the Gear tab show. This packet builds those screens **inert**: they show only when
`farmByLine()` is on, which H112 does. With the switch off, every screen stays exactly as it is.

## Scope

- **In:** everything under `apps/web/src/` that FL16, FL22 and FL23 describe, read from H109's rules.
- **Out:**
  - domain rules (H109);
  - the save (H110);
  - turning on, deleting R2's screens, the manual (H112).
- **No kit change and no fork** ([change-protocol.md](../../change-protocol.md)): the kit's `JobSheet`, `Tabs`,
  `ShelfView` and chips do everything here.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`: player text short; 44 pt targets; 390×844 and 375×667; explanations behind the (i), D95.
- [farm-by-line.md](../../design/tier-rework/farm-by-line.md) §6 (FL14–FL16, every word), §8 (FL22–FL23), §10 (H109's
  exports); D224; D216, D217, D222, D223 (the screens you change).
- **The place pages:** `places/work/PlaceV3.tsx`, `place-view.ts` and its test, `FacilityPage.tsx`.
- **Elsewhere:**
  - `places/exchange/ExchangePage.tsx` and `exchange-rows.ts`;
  - `places/warehouse/warehouse-shelves.ts`;
  - `items/v3-words.ts`, `items/frames.ts`;
  - `places/stable/gear-v3.ts`, `GearCardV3.tsx`, `SkillTree.tsx`.
- **The kit:** `JobSheet` reads `sizeRule` on every render (uma-platform `packages/kit/src/work/JobSheet.tsx`), so a
  page can change it as the picked job changes.

## Do

1. **The place pages' data**, new `places/work/place-view-v4.ts`, pure:
   - `gatherTilesV4(line, level)`: ten tiles `{ id, grade, locked }` (raw, G1–G10), locked "From Craft Lv 11".
   - `processTilesV4(line, level)`: the line's ten refined tiles, the same shape.
   - `makeGroupsV4(placeId, level)`:
     - the Forge, the Armorer, the Workbench and the Charm Shop: one group of ten chips of their item;
     - the Lapidary: Planet I–V and Moon I–V, as `jewelRows` today but without the tier.
     - Each chip `{ id, grade, label, locked }`.
   - `jobKindV4(placeId, id)`: `gather`, `refine`, `craft` or `cut`.
   - `jobSizesV4(kind)`: `REFINE_BATCHES` to process, 1–10 otherwise.
   - `helpLinesV4(placeId)`, `peekV4(placeId)`: FL16's words.
2. **The place page** (FL22). A `PlaceBodyV4` and `PlacePeekV4`, chosen by `farmByLine()` where `PlaceV3`'s are chosen
   today; R2's stay untouched:
   - **A gathering place's What:** the ten raw tiles in two rows of five, with the chosen type's card (FL16's facts,
     what's held).
   - **A making place's What:** two labelled groups, **Process** (the ten refined tiles) and **Make** (the chips).
     - Picking either sets the job.
     - The page keeps the picked job's kind in state (wrap the `onChange` `renderWhat` gives) and passes
       `sizeRule={{ mode: 'count', sizes: jobSizesV4(kind) }}`.
     - `request(job, count)` gives `{ kind: jobKindV4(placeId, job), item: job, count }`.
     - `initialJob` is the highest Make chip her Craft Level opens; a deep link's `job` opens on its own kind.
   - **The recipe card:** a refined tile: "Copper Ingot · G1 · Refined from Copper Ore" and what's held; a made chip:
     "Arms Gem G3 · Raises an Arms weapon one grade" and "7× Iron Ingot", each with what's held.
   - **Retired under the switch:** the Workbench's five-column grid, the tier rows, the chips' tier colours and legend.
   - **The header, slots, Collect, Repeat, Speed up, Finish all, stopped queues** stay as they are.
   - **For your targets** (D100): the strip reads `facilityTargets` (H109 orders a making place's made items, then its
     refined).
   - **Quick look:** a gathering place the ten icons; a making place its chips and "Processes Metal G1–G10".
   - **The (i):** `helpLinesV4`.
3. **The Exchange** (FL12, FL23):
   - `rawRowsV4(world, tier)`: per line, ten rows `{ id, name, grade, price, have, locked }`; locked rows say "After the
     tier’s first win" or "After a win on continent 3".
   - Under the switch, `RawMaterials` puts the lines behind the kit's `Tabs` (Metal, Wood, Vegetables, Fish, Stone), Metal
     first, the tab remembered for the session (`sessionStorage`, in a try/catch); a row's detail is "G3 · have 12".
4. **The Warehouse** (FL23), `warehouse-shelves.ts` under the switch:
   - a material's stack carries `grade` (its `LineItem` grade), so the kit's grade chips filter every material shelf;
   - groups stay `${line}-raw` and `${line}-refined`;
   - order is each line's raw G1–G10, then refined G1–G10;
   - made items: Arms Gems, Tome Ink, the Branch Gem, Armor Fittings, Accessory Settings, Planet Jewels, Moon Jewels;
   - the header still counts materials and made items.
5. **Words and icons** (FL14–FL16):
   - `items/v3-words.ts` under the switch: `materialFacts` "Metal · G3 · raw"; `madeUse` "Raises an Arms weapon one
     grade" and "Raises a Tome one grade"; `MADE_PLURAL` "Arms Gems" and "Tome Ink"; names from `madeNameV4`.
   - `items/frames.ts`:
     - a line item's icon is its family's raw or refined row at its grade (`LineItem.art`);
     - `tome-ink` uses atlas row 19 (uma-art's `essences` refined row) at its grade, beside `MADE_ROW`.
6. **The Gear tab and the Skills page** (FL16, FL23):
   - the Upgrade view's rows, icons and blockers come from `gradeItemId` and `raiseBlock`, which H109 switched; check an
     Arms row and a Tome row;
   - the "Grades" (i) names Arms Gems and Tome Ink;
   - `SkillTree.tsx`' weapon line is FL16's under the switch.
7. **Tests** (switch on by mocking `@rpg/domain`'s `farmByLine`, or the helpers taking it as an argument):
   - `place-view-v4.test.ts`:
     - ten gather tiles with their gates (Tin Ore locked at Craft Lv 5, open at 6);
     - the Forge's Process and Make groups;
     - the Lapidary's rows;
     - `jobKindV4` for every place;
     - `jobSizesV4`.
   - `exchange-rows.test.ts`: ten rows a line, prices × tier 2, locks by continent.
   - `warehouse-shelves.test.ts`: grades on material stacks, the order, Tome Ink on Made items.
   - The words; the Tome Ink icon's frame.
   - With the switch off, every existing web test unchanged and green.
8. **Check it locally:**
   - A throwaway worktree with H112's switch applied by hand, not committed: `SAVE_SCHEMA_VERSION` 30, with `toV30`
     chained if H110 has merged. Otherwise write a v30 scratch save from the CJS build with H109's ids directly.
   - Your own ports (avoid 8098 and 5198), in a desktop browser, never the iOS Simulator.
   - At 390×844 and 375×667, light and dark:
     - **The Forge:** process Copper Ore ×8 (the sizes switch to ×1…×40), then make an Arms Gem G1 (sizes 1–10);
     - a locked G2 tile and chip;
     - **the Workbench:** make Tome Ink;
     - **the Lapidary's** rows;
     - **the Mine's** ten tiles;
     - the targets strip at the Forge;
     - quick looks;
     - **the Exchange's** tabs;
     - **the Warehouse's** grade chips on Metal;
     - **a Mage's** Upgrade view asking for Tome Ink.
   - Describe what you saw; screenshots with original art stay local.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; the main JS number (budget 230 KB).
- [ ] With the switch off (the build), every screen is as today; with it on, everything in Do works as checked.
- [ ] The tests above pass. A D-row logs the build (fetch `main` first). Nothing from the original games in git.
- [ ] Deployed green, and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- A pull request from `feat/h111-farm-screens`, one commit: `feat(web): the farm by line's screens, inert (H111)`.
- H110 runs at the same time and touches only `packages/domain/src/save/`; fetch `main` before you push.
- **ChatGPT merges it itself** once CI is green, then watches the deploy:
  `gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`. Rerun a failed job once if it's the web suite's known
  flake (`Timeout calling "onTaskUpdate"`).
- **Flag it done:** a `docs(handoff): H111 done (D…)` commit deletes this file and adds a Done row to
  `docs/handoff/README.md`.
