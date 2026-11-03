# H163 — The honeycomb's world: 48 regions, six Springs and the layout, dark

**uma-rpg · ChatGPT or Claude · M · Needs: nothing · Unblocks: H164, H165**

## Why

The owner approved the continent map as a honeycomb (D295, [the design](../../design/world-map/honeycomb.md), HM1–HM12):
- the capital at the centre, ringed by six run seats;
- Lv 6–10 regions only on the inner rings, Lv 1–5 only on the shore;
- six Springs at the honeycomb's six symmetrical points;
- 48 regions a continent (eight new) for 24 parties.

This packet writes the world's new shape in the domain: the eight new regions, the sixth Spring, the honeycomb's layout
as pure data, and each region's nearest Spring. It's built **dark** behind `honeycombLive()`: until H166 the live world
keeps its 40 regions and five Springs.

## Context (read first)

- `CLAUDE.md`, `AGENTS.md`, [the manual](../../game/README.md): [maps](../../game/maps.md) (Shape, Springs).
- **The design:** [honeycomb.md](../../design/world-map/honeycomb.md) §1 (the layout) and §5 (what it needs).
- **The reference layout:** the [preview](../../design/world-map/previews/honeycomb.html)'s script, from "The honeycomb
  (HM2, HM3, HM11, HM12)" down to `springOf`. It is the layout to reproduce exactly:
  - axial pointy-top hexes;
  - `ring(k)`, `corner(k, i)`;
  - `clockwise(list, startAngle)`;
  - each ring's assignment;
  - the nearest Spring.
- **The world generator:** `packages/domain/src/world/world.ts`:
  - `worldContinent(source)`: 40 regions as rows × 4, biomes "every biome twice, the Meadow and the continent's lean a
    third time", names with `ROMAN`, and `WORLD_SPRINGS = 5` Springs at `row: k * 2`;
  - `regionChapter(region, roster, engine)` and its seeds;
  - `TWIN_BOSS_ROW`;
  - `stageRegionId`.
- **Springs today:**
  - The save already keeps a Spring's recharge by any id `w<n>-spring<k>` (`useSpring` in `save/battle.ts`,
    `world.springs`).
  - A region's Spring is a screen lookup, `springForRegion` in `apps/web/src/places/scenario-gate/map/layout.ts`: the
    Spring of its two-row band.
- **The dark pattern:** `save/collections.ts` (`collectionsLive`, `capitalRunsLive` from H160).

## Decisions made

1. **The switch:** `export const HONEYCOMB_SAVE = 38` and `honeycombLive(version = SAVE_SCHEMA_VERSION) => version >= 38`
   in `save/collections.ts`.
2. **Eight new regions a continent** (when live), appended after today's forty so none of them moves:
   - **Ids:** `${continent.id}-x-${k}`, k = 1–8.
   - **Bands:** 1–4 are in the Lv 1–5 band (`row: 0`, levels as rows 1–5), 5–8 in the Lv 6–10 band (`row: 5`, levels
     as rows 6–10). They're never on the twin-boss row.
   - **`col`:** 4 to 11, so it doesn't collide with today's four columns.
   - **Biomes:** eight different ones from the 17 this continent holds only twice, so no biome reaches a fourth copy:
     `shuffle(twiceOnly, `${id}:extra`)`, its first four for k = 1–4 and the next four for k = 5–8. Each takes the
     next `ROMAN` numeral ("Coast III").
   - **Their stages** come from `regionChapter` like any region's, seeded by the new id.
   - `stageRegionId('w1-x-3-s5')` is `'w1-x-3'`.
3. **Six Springs** (when live): `WORLD_SPRINGS` becomes 6, as `${id}-spring${k}` with k = 1–6.
   - Springs 1–5 keep their ids, so their recharge in a save carries over.
   - A Spring's `row` no longer places it (the honeycomb does). Keep the field for the old map until H166.
4. **The layout,** `continentHoneycomb(continent): HoneyTile[]` in a new `world/honeycomb.ts`:
   - `HoneyTile = { q, r, kind: 'capital' | 'seat' | 'spring' | 'region' | 'open', id?, seat? }`.
   - It's pure and identical to the preview's:
     - the capital at (0, 0);
     - ring 1: six seats, 1–6 clockwise from the top;
     - ring 2: rows 10, 9 and 8 clockwise from the top;
     - ring 3: the six Springs on its corners in `DIRS` order (spring k on corner k − 1), new regions 5–8 on its two flat
       sides (`|r| = 3`, in `ring(3)`'s own order), and rows 7 then 6 clockwise from the top on its slanted sides;
     - ring 4: new regions 1–4 on its four diagonal corners, and rows 1–5 clockwise from the bottom.
   - Add `honeycombXY(tile, size)` for pixel positions.
   - When not live, it returns the same layout for 40 regions with its eight new slots empty (`kind: 'open'`), for the
     preview's second pass and tests. The screens read it only when live.
5. **Each region's Spring,** `nearestSpring(continent, regionId)`: the honeycomb's nearest Spring corner, by pixel
   distance.
   - Twelve hexes sit exactly between two Springs. Each goes to the Spring that **follows it clockwise on screen** (the
     preview's `springOf`).
   - So every Spring serves exactly eight regions (test it). Breaking ties by the lower number would give 10, 8, 8, 8, 8
     and 6.
6. **No save change** in this packet: H164 owns v38's fields.

## Do

1. The switch, the eight new regions and the six Springs, all gated by `honeycombLive()`. Live play must not change.
2. `world/honeycomb.ts` and its tests:
   - the ring contents;
   - the clean bands (no Lv 6–10 region on ring 4, no Lv 1–5 inside it);
   - six Springs on the ring 3 corners, eight regions each;
   - Continent 1's tiles (kind, id and `q, r`) equal to the preview's `cells`, regenerated in the test. The preview's
     eight new regions have made-up biomes, so compare their ids and places, not their names;
   - determinism.
3. Tests for the generator:
   - the 48 regions, the eight new ids and bands;
   - each new biome a third copy;
   - the 40 old regions byte for byte as before, compared against `worldContinent` while dark;
   - six Springs.
4. Export `continentHoneycomb`, `nearestSpring`, `honeycombLive` and the types from the domain index.
5. Log the D-row (fetch `main` first).

## Done when

- [ ] `pnpm lint && pnpm test:ci && pnpm build` pass, and main JS stays under 230 KB.
- [ ] Live play is unchanged while dark (40 regions, five Springs).
- [ ] Nothing from the original games in git (`git status`).
- [ ] Deployed green (`gh run watch <id> -R luismlorenzana/uma-rpg --exit-status`) and https://uma-rpg.web.app/api/health
      shows the commit.

## Deliver

- **Claude:** commit to `main`: "feat(domain): the honeycomb's world, 48 regions and six Springs, dark (H163)".
- **ChatGPT:** a branch and a pull request with that title. Merge it yourself when the checks and CI are green. Fetch
  `main` before you push so the D-number is free.
- **Flag it done:** delete this file and add a Done row in [README.md](../README.md) with the commit.
