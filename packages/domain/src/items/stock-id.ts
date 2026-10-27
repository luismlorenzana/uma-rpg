// What a world's Warehouse (`TierWorld.items`) may hold, by generation (D208; H77): the legacy 160 items to engine v16;
// from v17 (R2's economy, the farm by line since save v30, D224) the hundred line items and the made items, which live
// beside them (R2's build decision 5), the Branch Gem only from R3's weapons (v18). Ids only, for the save's parse.
import { BATTLE_ENGINE_VERSION, rpgRework } from '../rpg/battle/caps'
import { isItemId } from './identity'
import { isLineItemId } from './lines'
import { isMadeId } from './made-id'

export function isStockItemId(id: string, engine: number = BATTLE_ENGINE_VERSION): boolean {
  if (!rpgRework('economy', engine)) return isItemId(id)
  if (id === 'branch-gem') return rpgRework('t2Weapons', engine)
  return isLineItemId(id) || isMadeId(id)
}
