# H06 — The world atlas: 19 biomes' tiles, props, liquids, roads, markers, icons

**Priority P2 · ChatGPT · uma-platform · L.** After H01 passes; continues H01's `src/world/`.

## Why

The world map (D72) is lists with flat biome colors. The owner wants it to look like a world. This packet draws every
piece of art the three map screens need. [H07](H07-world-map-screens.md) lays them out in the game.

## Context

- **The spec is uma-rpg [`docs/design/world/map-art.md`](../../design/world/map-art.md)**: frame ids, sizes, the 19
  biomes' palettes, ground, props, liquids and roads, and how the screens use them. It is the contract; follow it
  exactly.
- **The closest existing code** is the Hub terrain in uma-platform `scripts/pixel-art/src/tiles/`:
  - `ground.ts` (seeded ground styles), `paths.ts` and `water.ts` (autotiles);
  - `autotile.ts` (masks N 1, E 2, S 4, W 8);
  - `check.ts` (seam checks);
  - `props/` and `maps.ts` (sample pages);
  - `build.ts` (atlas, JSON, previews).

  Reuse its helpers rather than copying them.
- **H01's** Meadow, Volcano and Glacier work is the first three biomes.
- **The biome list** mirrors uma-rpg `packages/domain/src/world/biomes.ts`. Copy the 19 ids and colors into
  `src/world/spec.ts`, with a comment naming that file as the source.

## From H01's review

H01 passed (D90). Its painters in `scripts/pixel-art/src/world/` are the base. Three things change at full scale:

- **Liquids become areas** with corner masks (map-art.md, "Two kinds of autotile"). The band liquids made ponds that
  read as L-shaped strips. Redraw `liquid/*` as corner tiles, and grow each patch as a blob of at least 2×2 corners.
- **Roads never close a 2×2 block.** H01's junctions show little window holes. Reuse `closesBlock` from
  `src/tiles/maps.ts` in every layout.
- **Stone roads are flagstones**, irregular slabs with darker joints and a ragged edge into the ground, not
  rows of bricks.

## Do

Work in three milestones, a pull request each, so the owner sees the look early.

1. **Framework and five biomes.**
   - `src/world/`: `spec.ts` (ids, palettes, the frame list from map-art.md), the ground, prop, liquid and road
     painters, markers, icons, and `build.ts` writing `packages/art/world/atlas.png` + `atlas.json` and
     `assets/previews/world.png` + `world.html`.
   - Biomes: Meadow, Forest, Coast, Volcano, Glacier.
   - All six liquids and three roads.
   - Every marker, the Spring (ready and dry), the flags and the 48×48 capital.
   - Add the build to the `draw` script in `scripts/pixel-art/package.json`.
2. **The other fourteen biomes**, plus `ground/ocean-*`.
3. **Sample maps in the preview**, composed in code exactly as map-art.md's "The screens" describes, so H07 can match
   them:
   - one region map per biome (19);
   - one continent: 10 bands of 4 plots, with Springs above rows 1, 3, 5, 7 and 9 and the capital on top, biomes
     picked by a seeded shuffle;
   - the world: five islands.

   Show the frontier ring on one stage of each region.

Then:

- **Checks in the build** (fail on any miss):
  - every frame id in the spec exists, at the right size;
  - ground variants are seamless with each other;
  - every liquid and road autotile joins its neighbors at all 16 masks;
  - tall props and the capital keep their ground line.
- **A changeset** for `@luismlorenzana/uma-art`, **minor** (a new family). Document the `world` family in
  `packages/art/README.md`.

## Done when

- `pnpm --filter @uma-platform/pixel-art lint` passes, `pnpm art:draw` twice gives byte-identical output, and the repo's
  `pnpm lint && pnpm test` pass.
- `assets/previews/world.png` shows every frame at 3×, plus the sample maps.
- Each biome is recognizable from its region map alone at 2×. Two neighboring continent plots of different biomes read
  as different places.

## Deliver

Pull requests on `feat/world-atlas-1`, `-2` and `-3`, titled `feat(art): world atlas, part n (H06)`, each with the
preview inline. Claude versions and publishes uma-art after the last one.
