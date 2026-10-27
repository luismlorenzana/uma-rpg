// What a world's Warehouse (`TierWorld.items`) may hold, by generation (D208; H77): the legacy 160 items to engine v16;
// from v17 (R2's economy) the sixty materials and the made items, which live beside them (R2's build decision 5), the
// Branch Gem only from R3's weapons (v18). Ids only, for save v28's parse (H78). The farm by line (D224, H109) holds its
// hundred line items and Tome Ink, from save v30 (`farmByLine`).
import { BATTLE_ENGINE_VERSION, rpgRework } from '../rpg/battle/caps'
import { farmByLine, SAVE_SCHEMA_VERSION } from '../save/version'
import { isItemId } from './identity'
import { isLineItemId } from './lines'
import { isMadeId, madeIdentity } from './made-id'
import { isMaterialId } from './materials-id'

export function isStockItemId(id: string, engine: number = BATTLE_ENGINE_VERSION, save: number = SAVE_SCHEMA_VERSION): boolean {
  if (!rpgRework('economy', engine)) return isItemId(id)
  if (id === 'branch-gem') return rpgRework('t2Weapons', engine)
  if (farmByLine(save)) return isLineItemId(id) || isMadeId(id)
  return isMaterialId(id) || (isMadeId(id) && madeIdentity(id)!.line !== 'tome-ink')
}
