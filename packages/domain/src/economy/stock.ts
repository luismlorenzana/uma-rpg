// A display name for anything the Warehouse holds: items, Star Gems and gear; from R2 the materials and made items (H77;
// the farm by line's hundred line items since H112). The ids both catalogs hold share uma-art's names ("Iron Ore" either
// way), so the lookup needs no generation.
import { itemById } from '../items/catalog'
import { lineItem } from '../items/lines'
import { madeName } from '../items/made'
import { gemById } from './gems'
import { gearById } from './gear'

export const stockName = (id: string): string =>
  lineItem(id)?.name ?? madeName(id) ?? itemById(id)?.name ?? gemById(id)?.name ?? gearById(id)?.name ?? id
