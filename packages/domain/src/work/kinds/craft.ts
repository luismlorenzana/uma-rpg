// Crafting at the Forge (S7, D124, D139): a piece of gear into the gear stock, where equipping binds it.
import { gearById } from '../../economy/gear'
import { madeKind } from './made'

export const craft = madeKind('craft', gearById, 'gear')
