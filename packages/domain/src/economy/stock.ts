// A display name for anything the Warehouse holds: items, dishes and gear.
import { itemById } from '../items/catalog'
import { dishById } from './dishes'
import { gearById } from './gear'

export const stockName = (id: string): string => itemById(id)?.name ?? dishById(id)?.name ?? gearById(id)?.name ?? id
