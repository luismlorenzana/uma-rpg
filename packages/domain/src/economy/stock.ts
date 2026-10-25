// A display name for anything the Warehouse holds: items, Star Gems and gear; from R2 the materials and made items (H77).
// The 36 ids both catalogs hold share uma-art's names ("Iron Ore" either way), so the lookup needs no generation.
import { itemById } from '../items/catalog'
import { madeName } from '../items/made'
import { materialName } from '../items/materials'
import { gemById } from './gems'
import { gearById } from './gear'

export const stockName = (id: string): string =>
  itemById(id)?.name ?? gemById(id)?.name ?? gearById(id)?.name ?? materialName(id) ?? madeName(id) ?? id
