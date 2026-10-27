// A display name for anything the Warehouse holds: items, Star Gems and gear; from R2 the materials and made items (H77).
// The 36 ids both catalogs hold share uma-art's names ("Iron Ore" either way), so the lookup needs no generation. Under the
// farm by line (H109) its hundred line items and Tome Ink come first, and the Weapon Gem reads Arms Gem.
import { itemById } from '../items/catalog'
import { madeName } from '../items/made'
import { lineItem } from '../items/lines'
import { madeNameV4 } from '../items/made-v4'
import { materialName } from '../items/materials'
import { farmByLine } from '../save/version'
import { gemById } from './gems'
import { gearById } from './gear'

export const stockName = (id: string): string => farmByLine()
  ? lineItem(id)?.name ?? madeNameV4(id) ?? itemById(id)?.name ?? gemById(id)?.name ?? gearById(id)?.name ?? id
  : itemById(id)?.name ?? gemById(id)?.name ?? gearById(id)?.name ?? materialName(id) ?? madeName(id) ?? id
