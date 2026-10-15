# H13 — W4: field effects and home ground

**Claude · uma-rpg · M.**

## Audit — 2026-10-15

**Still unimplemented**, checked against `e9c6385`. Biomes currently select element signatures, formations, foe roles
and map/scenery colours (`world/biomes.ts`, `world/world.ts`). They do not modify battle damage or turn order.
`BattleInput` has no field-effect input; the stage generator has no signature-matched +5% home-ground bonus, and the
region header, rival sheet and fight header have no field-effect label. The existing balance simulator is built,
but there is no field-effect ruleset to exercise. Visual biome backdrops (H08) are not W4 combat effects.

Remaining: field modifiers, the home-ground bonus, their three UI labels, replay tests and a post-change balance
table. The four examples below differ from the older `regions.md` proposal (for example, Volcano burn versus damage
modifiers); keep design/manual text consistent when implementing. This audit does not add or cancel combat rules.
Engine v11 already belongs to D124's accessory rules, so W4 must not reuse that version.

## Why

Biomes differ by their foes' elements and formations. W4 makes them **play** differently:

- a field effect per biome;
- home-ground strength for foes native to it.

This is the step the world plan calls "biomes that play differently".

## Context

- `docs/design/world/encounters.md`: "one modifier per fight, applied by the engine's existing damage and turn-order
  hooks", the field-effect column, the effect list.
- `docs/design/world/regions.md`: each biome's lean.
- **Engine** (v11): `packages/domain/src/rpg/battle/engine.ts` (`battleDamage`, turn order).
- `world/balance.test.ts` (`SIM=1`).

## Do

1. **A field effect per biome** in `world/biomes.ts`, from encounters.md's list, small and legible:
   - Volcano: fire hits +15%, ice −15%.
   - Glacier: everyone's speed −10%.
   - Storm Peaks: lightning crits.
   - Twilight Rift: light and dark +10%.
   - …

   The engine reads it from a new-version battle input (v12 or the next unused version), so v6–v11 fights replay unchanged.
2. **Home ground:** foes whose element matches the biome's signature get a small edge (+5% damage), shown on the stage
   sheet.
3. **The UI:**
   - The region header and the stage sheet show the field effect in one line, with the element glyph.
   - The fight screen shows it in the top bar.
4. **Retune** with `SIM=1` to `world/balance.test.ts`'s targets. Record the table.

## Done when

- The engine tests cover each effect's hook and preserve v6–v11 replays.
- The sim stays on target.
- The manual (`docs/game/combat.md`, `maps.md`, `pnpm docs:update`), `encounters.md` and a decision row are updated.

## Deliver

A direct push to `main` per CLAUDE.md, the deploy watched, the owner told what to test.
