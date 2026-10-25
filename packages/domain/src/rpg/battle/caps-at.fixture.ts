// Test-only (excluded from the build): the one switch mocked to an engine (H64, D200). A rule's default `engine` closes over
// `caps.ts`'s own BATTLE_ENGINE_VERSION, so a mock overrides the constant and every predicate that reads it as a default.
// A test file mocks the switch in a file of its own; `vi.mock` is hoisted above the imports, so its factory imports this
// module itself:
//
//   vi.mock('./caps', async (orig) => (await import('./caps-at.fixture')).capsAt(17, await orig()))
//
// with the paths to `rpg/battle/caps` and this file from that test. R1's packets (H65–H71) mocked 16 until H72 made it
// live; R2's mock 17.
import type * as Caps from './caps'

type CapsModule = typeof Caps

/** `caps.ts` (the module `vi.mock`'s `importOriginal` gives) with the switch at `version`: BATTLE_ENGINE_VERSION, and
 * `rpgV2` and `rpgRework` reading it as their default. */
export function capsAt(version: number, original: unknown): CapsModule {
  const caps = original as CapsModule
  return {
    ...caps,
    BATTLE_ENGINE_VERSION: version as CapsModule['BATTLE_ENGINE_VERSION'],
    rpgV2: (engine: number = version) => engine >= caps.RPG_V2_ENGINE,
    rpgRework: (stage: Caps.RpgReworkStage, engine: number = version) => engine >= caps.RPG_REWORK_ENGINE[stage],
  }
}
