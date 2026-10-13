# The world map's art (W5)

> **Status: built, 2026-10-12 (H07; D87, D90).** World, continent and region screens compose the published
> `@luismlorenzana/uma-art` 2.0.0 world atlas in a plain 2D canvas, with DOM buttons and the complete lists alongside.
> H08 adds the battle backdrops below, published in uma-art 2.2.0.
> The owner's map feedback adds four-tile biome buildings in uma-art 2.3.0 and exposes each region band's existing Spring.

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
| Backdrops | `backdrop/<biome>` (battle horizon strips, H08) | 128×48, seamless left to right | 19 |
| Stage buildings | `stage/<biome>/<fight\|elite\|boss>-<locked\|open\|cleared>` | 64×64, ground line y=58 | 171 |
| Building frontier | `stage/frontier-0`, `stage/frontier-1` | 64×64 | 2 |

The 2.3.0 atlas contains 502 frames at 256×3792. All 329 earlier frame positions and pixels remain unchanged.

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

## Battle backdrops (H08, built)

All nineteen `backdrop/<biome>` strips are 128×48 with matching horizontal border pixels, a transparent sky,
two silhouette depths and a foot blending into the matching ground. Appending them keeps H06's original 310
positions and pixels; the world sheet is now 256×976 / 329 frames. CSS sprite users read dimensions from its JSON.

The Phaser stage draws its biome gradient behind the strip, repeating it on the rivals' floor at half the stage
height, and tiles `ground/<biome>-*` below at the Hub's art scale. A render texture is stamped once on configuration
or resize. The ground is muted and the party's lower 38% darkened; foe information has a dark DOM backplate.
If the atlas or frame is missing, the old gradient is kept. Capital Finals use Ruins; actor and hit coordinates
are unchanged, including the two foe rows and later waves.

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

- **16 tiles wide, 46 tall**, with the region's biome ground everywhere. A serpentine road passes below each pair of
  four-tile buildings; vertical climbs run along the outside edges, never through a building.
- Stage 1 sits at the bottom; ten regular stages climb in pairs, the elite tower is stage 11, and the boss stronghold
  stands alone at the top. All buildings are 64×64 native art pixels (4×4 times the previous 16×16 symbols), with
  biome-specific roofs, stone, snow, vines or ornaments. On 2× iPhones the footprints/targets are 96×96 CSS pixels.
- Cleared buildings are completely grayscale. Uncleared buildings retain their biome colors; locked doors are
  boarded and windows dark, while open stages have lit windows and an open doorway. The next stage wears the larger
  frontier ring. DOM captions add a check or lock, and accessible labels name the state; cleared stages still replay.
- Each region exposes the existing Spring for its continent's two-row band (`floor(region.row / 2) * 2`), at the road's
  start and in the sticky header. Both call the same refill operation and share the continent Spring id/cooldown.
  Its ready/dry art and short countdown update every 30 seconds; use is disabled during a fight. No new refill charges.
- Decoration: up to three seeded, irregular liquid patches where the biome has one and props on free ground. Roads,
  full building footprints, the Spring and its target stay separate; no prop or pond covers a building.

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
is 16 tiles wide and centered. On a 2× 375 px screen the outer half-tile is cropped; tap targets are clamped inside
its visible edges. On narrower or 1× viewports the scale steps down to the next whole device-pixel size. The canvas is drawn once per
change of progress, not every frame; only the frontier ring animates (two frames, off under reduced motion).
