// The live work env (H77; the farm by line since H112, D224): v1's facilities to engine v16 (`work/env.ts`), and from the
// economy stage (v17) the Wilds' ten places of four slots at ×1.25, each one line's (`env-v4.ts`), gated by her trade when
// the caller can say it. Speed Tickets, Craft EXP, Laurels and who may work are v1's.
import type { WorkEnv } from '@luismlorenzana/uma-work'
import type { TradeOf } from '../economy/professions'
import { rpgRework } from '../rpg/battle/caps'
import type { TierWorld } from '../save/save'
import { RPG_WORK_ENV } from './env'
import { rpgWorkEnvV4 } from './env-v4'

export { openShop, tradeBlock, ANOTHER_TRADE, TRADE_REFUSAL } from './kinds-v3/trade'
export { madeLive } from './kinds-v4/make'

export { PLACE_SLOTS_V3, PLACE_SPEED_V3 } from '../economy/professions'

/** What the caller knows beyond the save: each Uma's trade (from her template's calling), for the trade gate. */
export interface WorkContext { tradeOf?: TradeOf }

/** The live game's env: v1's facilities to engine v16, then the Wilds' places for a world of `tier`. */
export function liveWorkEnv(tier: number, context?: WorkContext): WorkEnv<TierWorld> {
  return rpgRework('economy') ? rpgWorkEnvV4(tier, context) : RPG_WORK_ENV
}
