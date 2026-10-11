# H03 — Gear icons for D86: Katana, Lance, five Tomes, ten Orbs

**Priority P1 · ChatGPT, then Claude wires uma-rpg · uma-platform · M.** After H01 passes.

## Why

The class rework (D86) has new gear: Katana, Lance, five Tomes and ten Orbs. Until they have their own art, they borrow
Short Sword, Spear, Summoner Tome and Ring icons with a small kind badge. That shows on every equipment, forge and
warehouse screen. Four of the old rows (the three staves and the Summoner Tome) aren't gear anymore.

## Context

- **The pipeline:** uma-platform `scripts/pixel-art/src/gear/`.
  - `spec.ts` lists the types in atlas row order, with each type's material by grade.
  - `index.ts` maps types to painters; `build.ts` writes `packages/art/gear/atlas.{png,json}`, contact sheet
    `assets/previews/gear.png`.
  - The atlas is 32 px cells, ten grades across, one row per type. The bottom-right 9×9 stays clear for the game's
    accent mark (the build checks it).
- **H01's** Katana, Fire Tome and Fire Orb painters are the starting point.
- **The game side:** uma-rpg's `apps/web/src/items/frames.ts`, where `GEAR_ART_ROWS` and `gearArt()` hold today's
  fallbacks. In `packages/domain/src/economy/gear.ts`:
  - `ORB_TYPES` is `orb-<kind>` for the ten kinds `greatsword`, `axe`, `lance`, `bow`, `katana`, `fire`, `ice`,
    `lightning`, `light`, `dark`;
  - `recipeFamilies` gives the Arms half (ores, stones, woods, hides-scales) to weapons, Arms Orbs and Arms gear, and
    the Arcana half (crystals, fibers, essences, bones-horns) to Tomes and Elemental Orbs.
- **Element colors** (uma-rpg `apps/web/src/battle/labels.tsx`): fire `#ff8a5c`, ice `#8fd3ff`, lightning `#ffd84d`,
  light `#fff2b0`, dark `#c79bff`.

## Do

1. **The new row order** in `spec.ts` (26 rows):

   | Group | Rows |
   |---|---|
   | Arms | `greatsword`, `axe`, `lance`, `bow`, `katana` |
   | Tomes | `tome-fire`, `tome-ice`, `tome-lightning`, `tome-light`, `tome-dark` |
   | Armor | `garb`, `leather`, `mail`, `plate` |
   | Accessories | `ring`, `charm` |
   | Orbs | `orb-greatsword`, `orb-axe`, `orb-lance`, `orb-bow`, `orb-katana`, `orb-fire`, `orb-ice`, `orb-lightning`, `orb-light`, `orb-dark` |

   Remove the `short-sword`, `spear`, `mage-staff`, `arcane-staff`, `cleric-staff` and `summoner-tome` rows, and their
   painters once nothing uses them.
2. **The new painters:**

   | Type | How it looks | Material by grade |
   |---|---|---|
   | Lance | A cavalry lance: long tapered cone, round hand guard (vamplate). The old spear painter is a fine base | Ingots |
   | Katana | As in H01 | Ingots |
   | Five Tomes | One book shape. The cover takes the element's color; the emblem shows the element (flame, snowflake, bolt, sunburst, crescent). Clasp and corners: the grade's material | Cut gems |
   | Ten Orbs | One sphere in a claw setting. Elemental Orbs glow in their element's color with a tiny emblem. Arms Orbs are polished steel spheres with the weapon's silhouette etched in | Elemental: cut gems; Arms: ingots |

   The setting's material changes by grade.
3. **Materials by grade:** reuse the `INGOTS` and `CUT_GEMS` ramps already in `spec.ts`. The type's main family is the
   first of its `recipeFamilies`: ores for Arms, crystals for Arcana.
4. **Rebuild** with `pnpm art:draw`: the gear atlas, its JSON and the contact sheet.
5. **A changeset** for `@luismlorenzana/uma-art`, **major**: the gear rows moved, so a consumer must update its row
   map. Describe the new row order in it and in `packages/art/README.md`.

## Done when

- `pnpm --filter @uma-platform/pixel-art lint`, `pnpm art:draw` (twice, byte-identical) and the repo's
  `pnpm lint && pnpm test` pass.
- The gear build's own checks pass, including the clear 9×9 corner.
- `assets/previews/gear.png` shows 26 rows. The five Tomes and the ten Orbs are told apart at 1×, and grades 1 → 10
  read as a progression.

## Deliver

A pull request on `feat/gear-icons-d86`, titled `feat(art): D86 gear icons (H03)`, with `gear.png` inline.

**Then Claude:** versions and publishes uma-art 2.0.0, bumps it in uma-rpg, rewrites `GEAR_ART_ROWS` and `gearArt()`
to the new rows, drops the kind-badge fallback and logs the decision.
