// A display name for anything the Warehouse holds: items, Star Gems and gear.
import { itemById } from '../items/catalog'
import { gemById } from './gems'
import { gearById } from './gear'

export const stockName = (id: string): string => itemById(id)?.name ?? gemById(id)?.name ?? gearById(id)?.name ?? id
