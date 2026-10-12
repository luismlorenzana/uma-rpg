# The world map's art (W5)

> **Status: spec, 2026-10-11 (D87, D90).** The world, continent and region screens are lists with flat biome colors today
> (W2, D72). This page specifies their pixel art: what uma-platform draws (the `world` atlas) and how uma-rpg lays it
> out. H06 drew the atlas (published in `@luismlorenzana/uma-art` 2.0.0); the handoff packet
> [H07](../../handoff/tasks/H07-world-map-screens.md) (screens) builds the maps; [H08](../../handoff/tasks/H08-battle-backdrops.md)
> reuses the biome palettes for battle backdrops.

## Decisions

- **Drawn from code** in uma-platform's `scripts/pixel-art`, like every other atlas (P35, P38), and published in
  `@luismlorenzana/uma-art` as one more family: `world/atlas.png` + `world/atlas.json`.
- **Composed at runtime** in uma-rpg from the tiles, the way the Hub lays its pages (D64). The continents are generated
  from release data (D72), so a pre-painted picture would drift; tiles never do.
- **A plain 2D canvas**, not Phaser: the maps are still images with DOM buttons on top (D33's rule: no text in the
  canvas). No WebGL, so screenshots and previews work, and nothing heavy loads.
- **Low levels at the bottom, the capital on top** (the design's original order, [README](README.md)): the map is a
  climb. Each map opens scrolled to the party's frontier: the lowest row with a stage left to clear. (Since D97 a region
  climbs five levels: rows 1–5 hold a continent's first five levels and rows 6–10 its last five.)
- **Same look as the Hub**: 16 px tiles, light from the top left, a 1 px outline on props and markers (never on ground),
  soft shadows, six-tone ramps from `color.ts`. Placement is seeded by ids, so a map looks the same on every visit.

## The atlas

Every frame id below is part of the contract; the build checks the list. Sizes are in art pixels.

| Group | Frame ids | Size | Count |
|---|---|---|---|
| Ground | `ground/<biome>-0` … `-3`, plus `ground/ocean-0` … `-3` | 16×16, seamless with each other in any order | 80 |
| Props | `prop/<biome>/<name>`, three per biome (names in the table below) | 16×16, or 16×32 when tall | 57 |
| Liquids | `liquid/<liquid>-<mask>` for `water`, `lava`, `marsh`, `ice`, `void`, `cloud`; corner mask 1–15 | 16×16 | 90 |
| Roads | `road/<material>-<mask>` for `dirt`, `stone`, `boards`; mask 0–15 | 16×16 | 48 |
| Stage markers | `marker/<fight\|elite\|boss>-<locked\|open\|cleared>` | 16×16 | 9 |
| Frontier ring | `marker/frontier-0`, `marker/frontier-1` (a two-frame pulse drawn over a marker) | 16×16 | 2 |
| Places | `marker/spring`, `marker/spring-dry`, `marker/flag`, `marker/flag-cleared` | 16×32 | 4 |
| Capital | `marker/capital` (ground line at y = 44, like the Hub's buildings) | 48×48 | 1 |
| Biome icons | `icon/<biome>` for list cells and headers | 16×16 | 19 |
| Backdrops | `backdrop/<biome>` (battle horizon strips, [H08](../../handoff/tasks/H08-battle-backdrops.md)) | 128×48, seamless left to right | 19 |

**Two kinds of autotile** (D90, after the [H01 calibration](../../handoff/README.md)):

- **Roads are networks** with the Hub's edge masks (`scripts/pixel-art/src/tiles/autotile.ts`): the mask is the sum of
  the neighbors that are road, N 1, E 2, S 4, W 8. Layouts never close a 2×2 block of road (the Hub's `closesBlock` in
  `tiles/maps.ts`), so junctions never show as little loops. Stone roads are flagstone paths with grass or dust in the
  joints, not brick walls.
- **Liquids are areas** with corner masks, so a pond is a filled blob with a shore all round. The liquid is placed on
  the grid's corners (vertices); a tile's mask is the sum of its corners that are liquid, NW 1, NE 2, SE 4, SW 8. Mask
  15 is open liquid, 0 is never drawn, and the other 14 are shores and inlets. A layout's liquid patch is a blob of
  corners at least 2×2, grown from a seed by the region's hash, so no two ponds look alike.

Both are transparent overlays drawn over the biome's ground, so one family serves every biome.

`atlas.json` follows the tiles atlas' shape: `{ schemaVersion: 1, width, height, frames: { id: { x, y, w, h, group,
biome?, anchorY? } } }`.

## The biomes

Base colors are the biome colors in uma-rpg's `packages/domain/src/world/biomes.ts`. The ground is that color's ramp
with the texture described. The liquid is drawn as features inside region plots.

| Biome | Base | Ground | Props | Liquid | Road |
|---|---|---|---|---|---|
| `meadow` Meadow | `#7fbf5a` | Bright grass, clover, white and yellow specks | `oak` (tall), `flowers`, `rock` | water (pond) | dirt |
| `forest` Forest | `#2f7d3b` | Dark grass, leaf litter, root lines | `pine` (tall), `stump`, `mushrooms` | water (stream) | dirt |
| `coast` Coast | `#4bb3b0` | Pale sand, shell flecks, dune grass tufts (the base tints the sea) | `palm` (tall), `shell-rock`, `driftwood` | water (sea) | boards |
| `swamp` Swamp | `#6b7340` | Olive mud, reed stubble, puddle glints | `dead-tree` (tall), `reeds`, `log` | marsh | boards |
| `jungle` Jungle | `#3fa34d` | Lush leaves, fern fronds, deep shade | `jungle-tree` (tall), `fern`, `vine-rock` | water (river) | dirt |
| `desert` Desert | `#d9b24c` | Rippled dunes, wind lines | `cactus` (tall), `bones`, `sandstone` | water (oasis) | dirt |
| `canyon` Canyon | `#b5583a` | Red strata bands, dry cracks | `mesa` (tall), `dry-bush`, `boulder` | none | stone |
| `volcano` Volcano | `#c43b2b` | Black basalt with a few glowing cracks (the base is the glow) | `vent` (smoking), `obsidian`, `charred-tree` (tall) | lava | stone |
| `geyser` Geyser Basin | `#e0b98f` | Pale sinter terraces, orange mineral streaks | `geyser` (tall, steam), `mineral-mound`, `steam-vent` | water (turquoise hot spring) | boards |
| `tundra` Tundra | `#a9c7d9` | Patchy snow over frozen moss | `snowy-pine` (tall), `ice-rock`, `frozen-shrub` | ice | dirt |
| `glacier` Glacier | `#dcecf5` | Packed snow, blue crevasse lines | `ice-spire` (tall), `snowdrift`, `ice-block` | ice | stone |
| `peaks` Storm Peaks | `#6f7a8c` | Slate scree, white chips | `crag` (tall), `scree`, `stormstone` (glowing) | none | stone |
| `highlands` Highlands | `#9a86b5` | Heather, short grass, lilac specks | `standing-stone` (tall), `heather`, `cairn` | water (tarn) | dirt |
| `sky` Sky Isles | `#efe0a8` | Golden grass on pale rock | `golden-tree` (tall), `sky-crystal` (floating), `cloud-tuft` | cloud (the isle's edge) | boards |
| `underworld` Underworld | `#4a3366` | Dark violet stone, ember motes | `bone-pillar` (tall), `soul-flame`, `skull-rock` | void | stone |
| `moor` Haunted Moor | `#6d6880` | Grey-lavender grass, fog wisps | `bare-tree` (tall), `gravestone`, `wisp` | marsh | dirt |
| `crystal` Crystal Caverns | `#59c9d9` | Dark cave floor, cyan crystal chips (the base is the crystal) | `crystal-spire` (tall), `crystal-cluster`, `glow-cap` | water (cave pool) | stone |
| `ruins` Ancient Ruins | `#a39a86` | Cracked flagstones, grass in the joints | `broken-column` (tall), `rubble`, `statue-head` | water (moat) | stone |
| `rift` Twilight Rift | `#3d3f8f` | Indigo ground, star specks, a faint light/dark split | `rift-shard` (tall), `star-mote`, `floating-rock` | void | stone |

The ocean (`ground/ocean-*`) is deep blue water with sparse wave marks, used around the world map's islands.

## The screens (uma-rpg)

All three keep the current list view one tap away (a **Map / List** switch in the header, remembered per device), so
nothing is lost while the art settles. Buttons over the canvas carry the names and counts.

### Region: twelve stages up a path

- **16 tiles wide**, about 28 tall, the region's biome ground everywhere. A road (the biome's material) winds from the
  bottom edge to an arena at the top.
- Stage 1 sits at the bottom; stages climb in pairs, alternating sides of the road every two rows; the elite is stage
  11, the boss stands alone in the top arena.
- Each stage shows its marker: kind (fight, elite, boss) by state (locked, open, cleared). The frontier stage (the next
  to clear) wears the pulsing ring. A DOM button over each marker opens today's stage sheet.
- Decoration: two to four liquid patches if the biome has one, props scattered on open ground (more along the edges),
  none on the road or within one tile of a marker. Seeded by the region id.

### Continent: ten levels and a capital

- **16 tiles wide.** Each row is a band four tiles tall: four **region plots** of 4×3 tiles (each in its own biome, with
  a liquid patch or prop and a flag marker in the middle), and a one-tile road row below them.
- Roads run along each band and switch sides between bands (left end, then right end), so one road climbs the whole
  continent from row 1 at the bottom to the capital at the top.
- **Springs** sit on the road between the bands the domain gives them (`WorldSpring.row`): `marker/spring` when ready,
  `marker/spring-dry` while recharging; the button keeps today's behavior.
- The **capital** stands in a 16×4 plaza of the continent's most common road material at the top.
- The flag turns to `flag-cleared` at 12/12. A DOM heading carries each half's levels ("Lv 1–5", "Lv 6–10", D97), and
  DOM chips each region's name and count on its plot.

### World: five islands

- **16 tiles wide, about 22 tall**, an ocean of `ground/ocean-*`. Five islands of about 6×4 tiles, staggered left and
  right from Continent 1 at the bottom to Continent 5 at the top, each made of its continent's two most common biomes,
  with `liquid/water` shores.
- A DOM button per island carries the scenario crest, the continent's name, its levels and its stages cleared.

### Scale

Reuse the Hub's grid rules (`apps/web/src/hub/grid.ts`): art pixels land on whole device pixels (`artScale`), the map
is 16 tiles wide and centered, and on a 375 px screen the outer half-tile is cropped. The canvas is drawn once per
change of progress, not every frame; only the frontier ring animates (two frames, off under reduced motion).
