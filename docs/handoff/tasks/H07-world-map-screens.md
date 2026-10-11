# H07 — World, continent and region screens in pixel art

**Priority P2 · ChatGPT · uma-rpg · L.** After H06 is published in `@luismlorenzana/uma-art`.

## Why

With the world atlas drawn (H06), the three map screens can become maps: a climb up each region's path, a continent
of 40 regions in ten bands with Springs and a capital, and a world of five islands. This is W5 of the world map plan.

## Context

- **The spec:** [`docs/design/world/map-art.md`](../../design/world/map-art.md), especially "Decisions" and "The
  screens". It decides the stack (a 2D canvas, DOM buttons on top), the order (Lv1 at the bottom, opening at the
  frontier) and the layouts.
- **Today's screens:**
  - `apps/web/src/places/scenario-gate/ScenarioGatePage.tsx` has `WorldMap` and `ContinentMap` (lists).
  - `RegionMap.tsx` is a list of 12 stages with a BottomSheet per stage.
  - Keep their behavior: the active party bar, Resume fight, Springs, the stage sheet, sweeps and errors.
- **Data** (`packages/domain/src/world/`):
  - `world.ts` has `WorldContinent`, `WorldRegion` (`row`, `col`, `biome`, `level`) and `WorldSpring` (`row`), plus
    `regionChapter`.
  - `biomes.ts` has `biomeById`.
  - Progress comes through `worldRun(world).wins`, `rpgNodeStatus` and `springReadyAt`.
- **How the Hub does it:**
  - `apps/web/src/hub/grid.ts` has `ART_TILE`, `artScale` and `hubDpr`;
  - `apps/web/src/hub/scene/terrain.ts` lays tiles;
  - `HubScene.ts` imports `@luismlorenzana/uma-art/tiles/atlas.json` and the `.png?url`.

  Import the `world` atlas the same way.

## Do

1. **A pure layout module**, `apps/web/src/places/scenario-gate/map/layout.ts`, with no DOM. Each of
   `regionLayout(region, progress)`, `continentLayout(continent, progress)` and `worldLayout(continents, progress)`
   returns:
   - `{ cols, rows, cells: { col, row, frame }[], sprites: { x, y, frame }[], spots: { id, kind, x, y, w, h }[] }`;
   - the ground, liquid and road cells with autotile masks;
   - props and markers;
   - the tappable spots.

   Seed decoration by the region or continent id.
2. **`MapCanvas.tsx`:**
   - Draws a layout with a 2D canvas, `imageSmoothingEnabled = false`, at the Hub's art scale.
   - Positions a DOM button over every spot, with an accessible name: "Ember Crater, Lv 8, 5 of 12 cleared".
   - Redraws only when progress changes.
   - The frontier ring animates in two frames, and not at all under reduced motion.
3. **Wire the three screens:**
   - The map is the default view. A **Map / List** switch in the sticky header shows today's list, remembered per
     device in `localStorage` (wrapped in try/catch).
   - Each map scrolls vertically. The continent and the region open scrolled to the frontier.
   - Level chips and region names are DOM over the canvas.
   - Springs show ready or dry, and tap as today.
4. **Biome icons:** use `icon/<biome>` in the list views too (continent cells and the region header), where today
   there's only a color.

## Done when

- **Unit tests for the layouts:**
  - the same input gives the same output;
  - 12 stage spots per region (boss on top), 40 region spots and 5 Springs per continent, 5 island spots;
  - no prop on a road or a marker;
  - every frame id exists in the atlas JSON.
- **In the browser**, at 390×844 and 375×667:
  - all three maps render;
  - taps open the same sheets and screens as the lists;
  - nothing scrolls sideways;
  - the list switch works.
- `pnpm lint && pnpm test && pnpm build` pass. The map code loads lazily, so the main chunk stays within 230 KB gzip.

## Deliver

A pull request on `feat/world-map-art`, titled `feat(world): pixel-art world, continent and region maps (H07)`, with
screenshots of the three maps.
