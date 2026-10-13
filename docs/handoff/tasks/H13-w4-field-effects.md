# H13 — W4: field effects and home ground

**Claude · uma-rpg · M.**

## Why

Biomes differ by their foes' elements and formations. W4 makes them **play** differently:

- a field effect per biome;
- home-ground strength for foes native to it.

This is the step the world plan calls "biomes that play differently".

## Context

- `docs/design/world/encounters.md`: "one modifier per fight, applied by the engine's existing damage and turn-order
  hooks", the field-effect column, the effect list.
- `docs/design/world/regions.md`: each biome's lean.
- **Engine** (v10): `packages/domain/src/rpg/battle/engine.ts` (`battleDamage`, turn order).
- `world/balance.test.ts` (`SIM=1`).

## Do

1. **A field effect per biome** in `world/biomes.ts`, from encounters.md's list, small and legible:
   - Volcano: fire hits +15%, ice −15%.
   - Glacier: everyone's speed −10%.
   - Storm Peaks: lightning crits.
   - Twilight Rift: light and dark +10%.
   - …

   The engine reads it from the battle input (engine v11), so v6–v10 fights replay unchanged.
2. **Home ground:** foes whose element matches the biome's signature get a small edge (+5% damage), shown on the stage
   sheet.
3. **The UI:**
   - The region header and the stage sheet show the field effect in one line, with the element glyph.
   - The fight screen shows it in the top bar.
4. **Retune** with `SIM=1` to `world/balance.test.ts`'s targets. Record the table.

## Done when

- The engine tests cover each effect's hook and a v10 replay.
- The sim stays on target.
- The manual (`docs/game/combat.md`, `maps.md`, `pnpm docs:update`), `encounters.md` and a decision row are updated.

## Deliver

A direct push to `main` per CLAUDE.md, the deploy watched, the owner told what to test.
