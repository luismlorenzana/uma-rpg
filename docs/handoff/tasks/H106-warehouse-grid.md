# H106 — The Warehouse as an icon grid again, filtered by line and grade

**uma-rpg · ChatGPT · S · Needs: H82 (live) · Unblocks: —**

## Why

The owner's review of the live game (D219, point 3): the Warehouse "used to be where I could filter significantly and
filter G1–G10, but now it looks super simplified". H80 (D216) drew R2's Warehouse as a list of rows, one stack a row;
that was the H80 worker's call, not the design's. The owner picked **v1's icon grid, filtered**:
- **shelves by line:** All · Metal · Wood · Vegetables · Fish · Stone · Made items;
- **the kit's grade chips** (every grade, the highest of each line, one grade), as v1 had them.

Materials have no grade (two types a line, profession-progression §3; the owner kept it, D219), so the chips filter
the made items; a material's row says its tier and band. A stack's grade comes from the domain.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md` (player text short; 44 pt targets; 390×844 and 375×667; explanations behind the (i), D95),
  [change-protocol.md](../../change-protocol.md): **the kit draws the shelves**. This game passes shelves, items, layout,
  words and details as props, with **no kit change and no fork**.
- D216 (H80's Warehouse), D219 (this review), the manual's [Warehouse](../../game/sections.md#warehouse).
- **The code:**
  - `apps/web/src/places/warehouse/warehouse-shelves.ts` (all: `warehouseView`, the v1 and v3 views, `MATERIAL_ORDER_V3`,
    `MADE_ORDER`);
  - `WarehousePage.tsx` (all: `ShelfView` with `layout`, `rowDetail`, `details`, `price`, `onSell`);
  - `warehouse-shelves.test.ts`.
- **The kit's `ShelfView`** (uma-platform `packages/kit/src/places/ShelfView.tsx`, uma-kit 0.14.0):
  - props `shelves`, `items`, `layout: 'grid' | 'rows'`, `grades` (chips on by default), `initialShelf`, `words`,
    `header`;
  - an item's `shelf` decides its tab; its `grade` gives the chips; `group` decides "Highest";
  - the shelf tabs are the kit's `Tabs`, which share the row equally: **check that seven labels fit at 375 pt** (below).
- **The domain:** `MATERIAL_LINES`, `MATERIAL_TYPES` (each type's `line`, `raw`, `refined`, tier and band),
  `MADE_IDENTITIES` (`line`, `grade`), `stockName`, `sellPrice`; `items/v3-words.ts`' `materialFacts`, `madeFacts`,
  `materialPair`.

## Decisions made

- **Layout `grid`**, icons with counts, as v1. Each stack's sheet keeps today's lines and sell options ("Tier 1 · high ·
  raw · Refines into Iron Ingot", "Grade 5 · Raises a weapon one grade", "Opens Planet III").
- **Shelves, in this order:** All, Metal, Wood, Vegetables, Fish, Stone, Made items. **All** opens first.
  - A material sits on its line's shelf, and a made item on Made items.
  - **All** holds every stack. Give each stack two entries, one on `all` and one on its own shelf. `ShelfView` shows one
    shelf at a time and finds an open stack by `id`, so both entries share the id; check that the stock sheet opens the
    same stack from either shelf.
- **Order on every shelf:** line by line (the professions' order); raw, then refined; tier by tier. Within a line, low
  before high. Made items: Weapon Gems, Armor Fittings and Accessory Settings G1–G10,
  then Planet Jewels I–V and Moon Jewels I–V (and the Branch Gem from R3, before Armor Fittings).
- **Grade chips:** on. A stack's `grade` comes from the domain:
  - made items: their grade;
  - materials: `null`;
  - `group` is the stack's line for "Highest", e.g. `weapon-gem`, `metal-raw`.
  - The chips then show only where some stack on the shelf has a grade. That is the kit's behaviour; check it on the
    Metal shelf today, where there should be no chips.
- **The header stays:** "120 materials · 35 made items".
- **Fit at 375 pt:** with seven tabs the kit gives each about 45 pt. If a label clips at 375×667:
  1. drop **All**, and open on Metal;
  2. if a label still clips, keep two shelves (Materials, Made items) with the grid and chips, and write a **"Both
     apps:"** request in your delivery for a scrolling facet row in `ShelfView` (the owner sends it to uma-platform).
  Never fork or restyle the kit's tabs. Say which step you shipped.
- **v1's Warehouse retires:** `rpgRework('economy')` is live since H82, so `warehouseView`'s v1 branch, its Star Gems
  and Gear shelves and `StockDetails` are dead code. Remove them, and their tests with them.
- **Words** in `ShelfView`'s `words` only where the kit's defaults don't fit (`empty`: "Nothing here yet.").

## Do

1. `warehouse-shelves.ts`: the seven shelves, the All entries, the order, the grade and group of each stack; remove the
   v1 view.
2. `WarehousePage.tsx`: `layout="grid"`, the shelves, chips on; remove `rowDetail` and `StockDetails`.
3. **Tests** (`warehouse-shelves.test.ts`):
   - every stack is on All and on its line's shelf (or on Made items);
   - the order within a shelf;
   - made items carry grades, and today's materials carry `null`;
   - the header's counts;
   - a world holding nothing gives empty shelves.
4. **The manual:** `docs/game/sections.md` § Warehouse, in its short style: the grid, the shelves, the chips, the sheet.
   Run `pnpm docs:update`.
5. **Check it locally:**
   - your own ports, in a desktop browser, never the iOS Simulator;
   - a v28 save built from the CJS build with materials of several lines and made items of several grades (`newSave`,
     `unlockUma`, then `items` set by hand);
   - at 390×844 and 375×667, light and dark: every shelf, the chips on Made items, a sheet opened from All and from
     its line, a sale.
   - Describe what you saw. Screenshots with original art stay local.

## Done when

- [ ] `pnpm lint && pnpm test && pnpm build` pass; say the main JS number (budget 230 KB).
- [ ] The tests in step 3 pass; the manual's Warehouse matches the screen; `pnpm docs:update` leaves no diff.
- [ ] The fit at 375 pt is checked and the step shipped is named.
- [ ] A D-row is logged (fetch `main` first so the number doesn't collide). Nothing from the original games in git.
- [ ] Deployed green and https://uma-rpg.web.app/api/health shows the commit.

## Deliver

- A pull request from `feat/h106-warehouse-grid` with one commit,
  `feat(web): the Warehouse as an icon grid again, by line and grade (H106)`. Fetch `main` before you push.
- **ChatGPT merges it itself** once CI is green (the owner, 2026-10-26: full autonomy to merge and deploy), then watches
  the deploy: `gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`. Rerun a failed job once if it's the web
  suite's known flake (`Timeout calling "onTaskUpdate"`).
- **Flag it done:** a `docs(handoff): H106 done (D…)` commit deletes this file and adds a Done row to
  `docs/handoff/README.md`.
