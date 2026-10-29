// An Uma's class over the save (D86, D180): the class she starts in, fights as, her setup for each, and one healer a
// party (H59). Kept out of `save/battle.ts` so the main bundle and the party screens can read them without loading the
// fight rules and the engine, which only the lazy `@rpg/domain/battle` subpath reaches (H62). `save/battle.ts`
// re-exports all of it but Classes v3's class tree (the root index exports that). Pure.
// Classes v3 (engine v19, D240; H126, dark until H134): her class when none is chosen reads her world (her calling's Tier 0
// in Tier 1's, its suggested promotion later), the classes she holds, and her class tree as the screens draw it.
import type { Aptitudes } from '@luismlorenzana/uma-data'
import { BATTLE_ENGINE_VERSION, rpgRework, rpgV2 } from '../rpg/battle/caps'
import { rpgClasses, rpgIsHealer, rpgIsTier0, type RpgTier0Class } from '../rpg/kinds'
import { rpgNodeIdentity } from '../rpg/node-identity'
import {
  RPG_CLASS_PARENTS, RPG_TIER0_MAX_RANK, rpgClassGate, rpgDefaultClass, rpgDefaultWeapons, rpgHoldsTier1, rpgSuggestedPromotion,
  type RpgClass, type RpgWeapon,
} from '../rpg/rules'
import { best } from '../roster/aptitudes'
import { umaCalling, type CallingOutfit } from '../roster/template'
import type { ClassLoadout, OwnedUma, TierWorld } from './save'

/** What the battle rules need from an outfit's master data (a `RosterOutfit` fits). */
export interface BattleOutfit {
  outfitId: string
  baseStats: Record<'speed' | 'stamina' | 'power' | 'guts' | 'wit', number>
  growthRatePercents: Record<'speed' | 'stamina' | 'power' | 'guts' | 'wit', number>
  /** Her styles (her style's class) and distances (her template's calling and stride, H67). */
  aptitudes: Pick<Aptitudes, 'strategy' | 'distance'>
}

/** Her best running style's class (ties: front, pace, late, end): what an Uma who never picked fights as. */
export const styleClass = (outfit: Pick<BattleOutfit, 'aptitudes'>): RpgClass => rpgDefaultClass(best(outfit.aptitudes.strategy)[0])

/** What `startingClass` reads: her styles and distances, and her base Power and Wit (an outfit always has them; without,
 * her style's class to v15, and Power = Wit from v16). */
export type StartingOutfit = Pick<CallingOutfit, 'aptitudes'> & { baseStats?: CallingOutfit['baseStats'] }
/** Her class in a world from her calling's Tier 0 (Classes v3, CV10): the Tier 0 itself in Tier 1's world, its suggested
 * promotion (CV11, by her base Power and Wit) in a Tier 2 or 3 world. */
function tier0ClassIn(tier0: RpgTier0Class, stats: { power: number; wit: number }, tier: number | string): RpgClass {
  return Number(tier) === 1 ? tier0 : rpgSuggestedPromotion(tier0, stats)
}

/** The class she starts in at unlock. From engine v16 her calling, the pick's pre-selection (`umaCalling`; CP29, H67). To
 * v15 her style's, except that from classes v2 a Late surger whose base Power beats her base Wit starts as a Paladin
 * (§3.3, D180; ties stay Cleric). From v19 (Classes v3, CV10) her calling's Tier 0 in Tier 1's world, its suggested
 * promotion in a later one. The save writes that start as her class (`newOwnedUma`). */
export function startingClass(outfit: StartingOutfit, engine: number = BATTLE_ENGINE_VERSION, tier: number | string = 1): RpgClass {
  const stats = outfit.baseStats
  const calling = { aptitudes: outfit.aptitudes, baseStats: stats ?? { power: 0, wit: 0 } }
  if (rpgRework('classes', engine)) {
    const tier0 = umaCalling(calling, null, engine)
    return rpgIsTier0(tier0) ? tier0ClassIn(tier0, calling.baseStats, tier) : tier0
  }
  if (rpgRework('fight', engine)) return umaCalling(calling, null, engine)
  const style = styleClass(outfit)
  return style === 'cleric' && rpgV2(engine) && !!stats && stats.power > stats.wit ? 'paladin' : style
}

/** The class she fights as: the chosen one, or her style's, so no Uma who never picked changes class at the switch. From
 * v16 every new unlock is written with her start (H67), so the fallback holds only for Umas unlocked before it (UT17).
 * From v19 (Classes v3, H126) a null class reads her world, `tier`: her calling's Tier 0 in Tier 1's, its suggested
 * promotion in a later one (save v32 leaves a reset Uma's class null, and Ascend sends a Tier 0 Uma up with none). */
export function activeClass(outfit: BattleOutfit, uma: Pick<OwnedUma, 'classId'>, tier: number | string = 1,
  engine: number = BATTLE_ENGINE_VERSION): RpgClass {
  if (uma.classId !== null) return uma.classId
  if (!rpgRework('classes', engine)) return styleClass(outfit)
  return startingClass(outfit, engine, tier)
}

/** The classes she may fight as now, in the tree's order (Classes v3, CV9, CV10; H126): before v19 every class of the
 * generation; from v19 in Tier 1's world every Tier 0 and each Tier 1 class she holds (promoted into: Rank 10 or more),
 * in a later world the eight Tier 1 classes. */
export function umaHeldClasses(uma: Pick<OwnedUma, 'ranks'>, tier: number | string = 1, engine: number = BATTLE_ENGINE_VERSION): RpgClass[] {
  return rpgClasses(engine).filter((c) => rpgClassGate(uma.ranks, c, tier, engine) === null)
}

/** A class's state on her class tree (profile v2's language, UP23): `on` her active class; `available` a class she holds
 * (a Tier 1 class promoted into, or a Tier 0 she has started); `ready` a child she can promote into now; `open` a class
 * she may start at Rank 1 (a Tier 0 in Tier 1's world, a Tier 1 class in a later one); `closed` with its gate. */
export type RpgClassTileState = 'on' | 'available' | 'ready' | 'open' | 'closed'
/** One class on her class tree (H120's Classes sheet). `rank` is her Class Rank in it (1 with no track); `waiting` the EXP a
 * Tier 0 at Rank 10 holds for her next promotion; `gate` a closed class's ("Opens with Recruit R10 or Caller R10");
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

/** Her setup for a class: what she saved, or its three default weapons, every tree on line A and skills chosen for her
 * (save v27, H69). */
export const classOf = (uma: Pick<OwnedUma, 'classes'>, classId: RpgClass): ClassLoadout =>
  uma.classes[classId] ?? { weapons: rpgDefaultWeapons(classId), lines: {}, loadout: null }

/** Her setup for a class with new weapons (save v27, H69): her equipped skills of a tree she no longer slots leave her
 * loadout, so it stays one she could hold (a loadout this empties goes back to auto). */
export function withClassWeapons(setup: ClassLoadout, weapons: readonly RpgWeapon[]): ClassLoadout {
  const next = { ...setup, weapons: [...weapons] }
  if (setup.loadout === null) return next
  const kept = setup.loadout.filter((id) => { const node = rpgNodeIdentity(id); return !!node && weapons.includes(node.weapon) })
  return { ...next, loadout: kept.length === setup.loadout.length ? [...setup.loadout] : kept.length ? kept : null }
}

/** What `healerBlock` says. */
export const ONE_HEALER = 'One healer a party'
/** Why these Umas can't fight together, or null: from classes v2, at most one of them fights as a healer, a Paladin or a
 * Cleric (C8, D178; a Tier 0 is none, CV22). Checked where a party fights, never on party edits or class switches; the
 * party screens show it. Each as her active class in her world (`tier`). */
export function healerBlock(world: Pick<TierWorld, 'umas'>, ids: readonly string[], outfits: ReadonlyMap<string, BattleOutfit>,
  engine: number = BATTLE_ENGINE_VERSION, tier: number | string = 1): string | null {
  const healers = ids.filter((id) => {
    const outfit = outfits.get(id), uma = world.umas[id]
    return !!outfit && !!uma && rpgIsHealer(activeClass(outfit, uma, tier, engine), engine)
  })
  return healers.length > 1 ? ONE_HEALER : null
}
