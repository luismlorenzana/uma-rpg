// What R2's job kinds plan with (H77): the world's tier, which a `TierWorld` doesn't know (the env carries it), and the
// caller's trade resolver, when it has one.
import type { TradeOf } from '../../economy/professions'
import type { MaterialTier } from '../../items/materials-id'

export interface KindSetup { tier: MaterialTier; tradeOf?: TradeOf }
