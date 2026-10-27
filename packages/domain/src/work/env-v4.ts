// uma-rpg's work env for the Wilds (D224, D230; farm-by-line.md FL1–FL10, FL25–FL28): fifteen places of four slots at ×1.25,
// each one line and one kind. Speed Tickets, Craft EXP, Laurels
// and who may work are v1's (`env.ts`); the trade gate and the open shop are R2's. `liveWorkEnv` (`env-v3.ts`) picks it
// from the economy stage.
import { buildingTable, type WorkEnv } from '@luismlorenzana/uma-work'
import { PLACE_SLOTS_V3, PLACE_SPEED_V3 } from '../economy/professions'
import { PLACES_V4 } from '../economy/places-v4'
import { worldMaterialTier } from '../items/made'
import type { TierWorld } from '../save/save'
import { RPG_WORK_ENV } from './env'
import type { WorkContext } from './env-v3'
import { makeV4 } from './kinds-v4/make'
import { materialKindV4 } from './kinds-v4/material'

/** The fifteen places as buildings, in the Wilds' order (the engine's tie-break order). */
export const RPG_BUILDINGS_V4 = buildingTable(Object.fromEntries(PLACES_V4.map((p) => [p.id, { slots: [PLACE_SLOTS_V3], speed: [PLACE_SPEED_V3], upgrades: [] }])))

/** The farm by line's env for a world of `tier` (the tier only gates R3's Branch Gem). */
export function rpgWorkEnvV4(tier: number, context: WorkContext = {}): WorkEnv<TierWorld> {
  const setup = { tier: worldMaterialTier(tier), ...(context.tradeOf ? { tradeOf: context.tradeOf } : {}) }
  return {
    ...RPG_WORK_ENV,
    kinds: { gather: materialKindV4('gather', setup), refine: materialKindV4('refine', setup), craft: makeV4('craft', setup), cut: makeV4('cut', setup) },
    buildings: RPG_BUILDINGS_V4,
  }
}
