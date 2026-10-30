// An Uma's class over the save (D86, D180): the class she starts in, fights as, her setup for each, and one healer a
// party (H59). Kept out of `save/battle.ts` so the main bundle and the party screens can read them without loading the
// fight rules and the engine, which only the lazy `@rpg/domain/battle` subpath reaches (H62). `save/battle.ts`
// re-exports all of it. Pure.
// Classes v3 (engine v19, D240; H126, dark until H134): her class when none is chosen reads her world (her calling's Tier 0
// in Tier 1's, its suggested promotion later) and the classes she holds; her class tree as the screens draw it is
// `save/class-tiles.ts` (H137), which loads with the screens that draw it.
import type { Aptitudes } from '@luismlorenzana/uma-data'
import { BATTLE_ENGINE_VERSION, rpgRework, rpgV2 } from '../rpg/battle/caps'
import { rpgClasses, rpgIsHealer, rpgIsTier0, type RpgTier0Class } from '../rpg/kinds'
import { rpgNodeIdentity } from '../rpg/node-identity'
import { rpgClassGate, rpgDefaultClass, rpgDefaultWeapons, rpgSuggestedPromotion, type RpgClass, type RpgWeapon } from '../rpg/rules'
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
