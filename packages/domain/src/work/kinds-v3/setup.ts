// What the job kinds plan with (H77): the world's tier, which a `TierWorld` doesn't know (the env carries it; only R3's
// Branch Gem reads it), and the caller's trade resolver, when it has one.
import type { TradeOf } from '../../economy/professions'
import type { WorldTier } from '../../items/made'

export interface KindSetup { tier: WorldTier; tradeOf?: TradeOf }
