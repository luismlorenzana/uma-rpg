// A display name for anything the Warehouse holds: items, dishes, gear and tokens.
import { itemById } from '../items/catalog'
import { dishById } from './dishes'
import { gearById } from './gear'
import { tokenById } from './tokens'

export const stockName = (id: string): string => itemById(id)?.name ?? tokenById(id)?.name ?? dishById(id)?.name ?? gearById(id)?.name ?? id
