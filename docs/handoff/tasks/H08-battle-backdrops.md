# H08 — Battle backdrops by biome

**Priority P2 · ChatGPT · uma-platform, then uma-rpg · M.** After H06 (it uses the world atlas' ground and adds
`backdrop/<biome>`).

## Why

Every fight happens on a dark gradient tinted by the biome's color. A horizon and a floor in the region's own biome
make a volcano fight feel unlike a glacier fight, with very little art.

## Context

- **The stage:** uma-rpg `apps/web/src/battle/scene/BattleScene.ts`. `drawBackground()` paints a gradient from
  `setup.color`, a floor line at 50% height and a darker band for the party below 62%. Foes stand on the floor line;
  the party sits in the lower band.
- **What the scene receives:** `apps/web/src/battle/BattleStage.tsx` and `stage-layout.ts` build the setup. The region
  (and so its biome) is known in `FightScreen.tsx`.
- **The art spec:** [`docs/design/world/map-art.md`](../../design/world/map-art.md): `backdrop/<biome>`, 128×48,
  seamless left to right, plus the biomes' palettes.
- **The atlas pipeline:** H06's `scripts/pixel-art/src/world/`.

## Do

1. **Art (uma-platform)**, `backdrop/<biome>` for all 19 biomes: a horizon strip with a transparent sky, the biome's far
   silhouettes in two depth layers drawn into one frame, its foot blending into the biome's ground color. Examples:
   - Meadow: rolling hills and an oak line.
   - Volcano: cones with a glow.
   - Sky Isles: floating isles and cloud banks.
   - Ruins: broken colonnades.
   - Crystal Caverns: a cave ceiling edge with spires.
   - Twilight Rift: a split sky band.

   Add them to the world atlas and preview, with a changeset (minor).
2. **The game (uma-rpg)**, once that's published:
   - Pass the biome into the battle setup.
   - In `drawBackground()`, draw:
     - a sky gradient from the biome palette;
     - the strip, repeated across the width, resting on the floor line;
     - the floor below it, tiled from the biome's `ground/<biome>-*` at the Hub's art scale.
   - Keep the party band's darkening, so units and numbers stay readable.
   - If the art isn't loaded, keep today's gradient.
3. Draw it once into a render texture, as the Hub does, not every frame.

## Done when

- The world build's checks include the backdrops (size, seamless edges).
- In the browser, at 390×844: a fight in Meadow, Volcano, Glacier, Underworld and Sky Isles each shows its own backdrop.
  HP bars, damage numbers and portraits stay as readable as before.
- `pnpm lint && pnpm test && pnpm build` pass in both repos.

## Deliver

Two pull requests:

- `feat/battle-backdrops-art` in uma-platform;
- `feat/battle-backdrops` in uma-rpg, with five screenshots.
