// Cutting at the Lapidary (D144): a Star Gem onto the gem shelf, waiting to be set at the Observatory.
import { gemById } from '../../economy/gems'
import { madeKind } from './made'

export const cut = madeKind('cut', gemById, 'gems')
