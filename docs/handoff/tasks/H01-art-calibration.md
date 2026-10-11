# H01 — Art calibration: can ChatGPT draw our pixel art?

**Priority P1 · ChatGPT · uma-platform · S.** Gates H03, H06, H08, H10 and H11.

## Why

The owner wants ChatGPT to author a lot of pixel art: gear icons, the whole world map, battle art. Before that, a small
round on real deliverables shows whether the result is good enough. Nothing here is throwaway: if it passes, H03 and
H06 continue on this code.

## Context

- uma-platform `scripts/pixel-art/README.md`: all original art is **drawn from code** (TypeScript, no dependencies, its
  own PNG encoder), deterministic, built by `pnpm art:draw` into `packages/art/<family>/atlas.{png,json}` with contact
  sheets in `assets/previews/`. Decisions P35 and P38 in `docs/decisions.md`.
- Study the existing painters first: `src/tiles/` (Hub ground, paths, water, props: the closest to the world map),
  `src/gear/` (weapons, `tome.ts`, `jewelry.ts`) and the helpers `color.ts` (six-tone ramps), `shape.ts` (masks,
  dome shading), `sprite.ts` (outline, drop shadow, glints).
- The look to match: open `assets/previews/tiles.png`, `gear.png` and `items.png`. Light from the top left, 1 px
  selective outline on objects (none on ground), soft drop shadow, legendary grades (9–10) get glints.
- The world map spec: uma-rpg [`docs/design/world/map-art.md`](../../design/world/map-art.md). The D86 gear types:
  [H03](H03-gear-icons-d86.md).

## Do

1. **World, three biomes** (the start of H06's `src/world/`): Meadow, Volcano and Glacier, as specified in map-art.md:
   - `ground/<biome>-0…3` (16×16, seamless together in any order);
   - their three props each;
   - the liquids they use (`water`, `lava`, `ice`) as full 16-mask autotiles;
   - the `dirt` and `stone` roads;
   - `icon/<biome>`.
2. **A sample region map per biome**, composed in code: 16×28 tiles, a road winding from the bottom edge to the top, 12
   stage spots marked with a placeholder disc, liquid patches and props scattered as the spec says.
3. **Three D86 gear icons**, ten grades each, as new painters in `src/gear/`:
   - **Katana**: a slim curved single-edged blade, small round guard, wrapped grip.
   - **Fire Tome**: a bound book with a flame emblem on the cover.
   - **Fire Orb**: a glowing sphere in a small claw setting.

   Grades read the way the other gear does: the material ramp from `spec.ts` (ingots for the Katana; cut gems for the
   Tome's and Orb's fittings), glints at 9–10. The fire red comes from uma-rpg's element color `#ff8a5c`.
4. A build entry `src/calibration/build.ts` writing **`assets/previews/calibration.png`**:
   - a 3× contact sheet of every new frame;
   - the three sample maps at 2×;
   - the 30 gear icons at 1× and 3×.

   Leave the published atlases alone for now: H03 and H06 integrate them.
5. **The comparison the owner asked for:** use ChatGPT's own image generator to make one mockup of the same three
   biomes as a 16 px pixel-art region map, scaled to true pixel size. Attach it to the pull request description, next
   to `calibration.png`. It's for judging only; keep it out of the repo.

## Done when

- `pnpm --filter @uma-platform/pixel-art lint` passes.
- Running the calibration build twice gives byte-identical PNGs.
- `pnpm art:draw` leaves `packages/art/` unchanged (`git status` is clean there).
- In `calibration.png`, the ground tiles show no seams and the autotiles join at every mask. Each icon reads at 1×
  (32 px) as what it is, and grade 1 vs 10 is obvious.

## Deliver

A **draft** pull request on `feat/art-calibration`, titled `feat(art): calibration round (H01)`. In the body:

- the contact sheet and maps inline;
- the image-generator mockup;
- one paragraph on what was hard and what you'd do differently at full scale.

The owner judges it. If it passes, continue with H03 and H06 on the same branch's code, after Claude merges it.
