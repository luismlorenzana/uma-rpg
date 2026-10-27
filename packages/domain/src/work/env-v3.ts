// uma-rpg's work env for R2's Wilds (D195, D208; profession-progression.md §4–§5, PP4, PP12, PP13, PP16; H77): ten places
// of four slots at ×1.25 from day 1 and no upgrades, the four job kinds planning by the world's tier (a `TierWorld`
// doesn't know it, so the env carries it) and gated by her trade when the caller can say it. Speed Tickets, Craft EXP,
// Laurels and who may work are v1's (`env.ts`), which stays as it is for the deployed game and the migrations.
// `liveWorkEnv` picks by `rpgRework('economy')`, so the live game keeps v1's env until R2's switch (H82).
import { buildingTable, type WorkEnv } from '@luismlorenzana/uma-work'
import { PLACE_SLOTS_V3, PLACE_SPEED_V3, PLACES_V3, type TradeOf } from '../economy/professions'
import { worldMaterialTier } from '../items/made'
import { rpgRework } from '../rpg/battle/caps'
import type { TierWorld } from '../save/save'
import { farmByLine } from '../save/version'
import { RPG_WORK_ENV } from './env'
import { rpgWorkEnvV4 } from './env-v4'
import { makeV3 } from './kinds-v3/make'
import { materialKindV3 } from './kinds-v3/material'

export { openShop, tradeBlock, ANOTHER_TRADE, TRADE_REFUSAL } from './kinds-v3/trade'
export { madeLive } from './kinds-v3/make'

export { PLACE_SLOTS_V3, PLACE_SPEED_V3 } from '../economy/professions'

/** The ten places as buildings, in the Wilds' order (the engine's tie-break order). */
export const RPG_BUILDINGS_V3 = buildingTable(Object.fromEntries(PLACES_V3.map((p) => [p.id, { slots: [PLACE_SLOTS_V3], speed: [PLACE_SPEED_V3], upgrades: [] }])))

/** What the caller knows beyond the save: each Uma's trade (from her template's calling), for the trade gate. */
export interface WorkContext { tradeOf?: TradeOf }

/** R2's env for a world of `tier` (clamped to the catalog's three). */
export function rpgWorkEnv(tier: number, context: WorkContext = {}): WorkEnv<TierWorld> {
  const setup = { tier: worldMaterialTier(tier), ...(context.tradeOf ? { tradeOf: context.tradeOf } : {}) }
  return {
    ...RPG_WORK_ENV,
    kinds: { gather: materialKindV3('gather', setup), refine: materialKindV3('refine', setup), craft: makeV3('craft', setup), cut: makeV3('cut', setup) },
    buildings: RPG_BUILDINGS_V3,
  }
}

/** The live game's env: v1's facilities until R2's switch, then R2's places for a world of `tier`, then the farm by line's
 * from its switch (save v30, H112). */
export function liveWorkEnv(tier: number, context?: WorkContext): WorkEnv<TierWorld> {
  if (farmByLine()) return rpgWorkEnvV4(tier, context)
  return rpgRework('economy') ? rpgWorkEnv(tier, context) : RPG_WORK_ENV
}
