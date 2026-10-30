// Her class tree as the screens draw it (Classes v3 §14.1, CV32; H126, moved here by H137, D253): one tile a class of her
// world in the state language. Its own module, out of `save/class.ts`, so it loads with the Stable that draws it and not
// in the main bundle (the root index exports it). Pure.
import { BATTLE_ENGINE_VERSION, rpgRework } from '../rpg/battle/caps'
import { rpgClasses, rpgIsTier0, type RpgTier0Class } from '../rpg/kinds'
import { RPG_CLASS_PARENTS, RPG_TIER0_MAX_RANK, rpgClassGate, rpgHoldsTier1, rpgSuggestedPromotion, type RpgClass } from '../rpg/rules'
import { activeClass, type BattleOutfit } from './class'
import type { OwnedUma } from './save'

/** A class's state on her class tree (profile v2's language, UP23): `on` her active class; `available` a class she holds
 * (a Tier 1 class promoted into, or a Tier 0 she has started); `ready` a child she can promote into now; `open` a class
 * she may start at Rank 1 (a Tier 0 in Tier 1's world, a Tier 1 class in a later one); `closed` with its gate. */
export type RpgClassTileState = 'on' | 'available' | 'ready' | 'open' | 'closed'
/** One class on her class tree (H120's Classes sheet). `rank` is her Class Rank in it (1 with no track); `waiting` the EXP a
 * Tier 0 at Rank 10 holds for her next promotion; `gate` a closed class's ("Opens with Warrior R10 or Summoner R10");
 * `suggested` a Ready class that is the suggested promotion (CV11) of a parent she has at Rank 10. */
export interface RpgClassTile {
  classId: RpgClass
  tier: 0 | 1
  state: RpgClassTileState
  rank: number
  waiting: number
  gate: string | null
  suggested: boolean
}
/**
 * Her class tree as the screens draw it (Classes v3 §14.1, H120; H126): one tile per class of her world in the tree's
 * order: Tier 1's world all thirteen, a later world the eight Tier 1 classes; before v19 the generation's classes, each
 * `on` or `available`. A Tier 0 or a Tier 1 class she has started (a Class Rank track or a saved setup) is `available`.
 */
export function umaClassTree(uma: Pick<OwnedUma, 'classId' | 'ranks' | 'classes'>, outfit: BattleOutfit, tier: number | string = 1,
  engine: number = BATTLE_ENGINE_VERSION): RpgClassTile[] {
  const active = activeClass(outfit, uma, tier, engine)
  const v3 = rpgRework('classes', engine)
  const tierOne = Number(tier) === 1
  const stats = outfit.baseStats
  const classes = rpgClasses(engine).filter((c) => !v3 || tierOne || !rpgIsTier0(c))
  return classes.map((classId): RpgClassTile => {
    const track = uma.ranks.classes[classId]
    const rank = track?.rank ?? 1
    const tier0 = v3 && rpgIsTier0(classId)
    const waiting = tier0 && rank >= RPG_TIER0_MAX_RANK ? track?.exp ?? 0 : 0
    const started = !!track || !!uma.classes[classId]
    const gate = rpgClassGate(uma.ranks, classId, tier, engine)
    const parents = v3 && tierOne && !tier0 ? RPG_CLASS_PARENTS[classId as Exclude<RpgClass, RpgTier0Class>] : []
    const atTen = parents.filter((p) => (uma.ranks.classes[p]?.rank ?? 1) >= RPG_TIER0_MAX_RANK)
    const held = !v3 || !tierOne || tier0 ? started : rpgHoldsTier1(uma.ranks, classId as Exclude<RpgClass, RpgTier0Class>)
    const state: RpgClassTileState = classId === active ? 'on' : gate === null ? (held || !v3 ? 'available' : 'open')
      : atTen.length ? 'ready' : 'closed'
    const suggested = state === 'ready' && atTen.some((p) => rpgSuggestedPromotion(p, stats) === classId)
    return { classId, tier: tier0 ? 0 : 1, state, rank, waiting, gate: state === 'closed' ? gate : null, suggested }
  })
}
