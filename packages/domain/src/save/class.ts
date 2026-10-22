// An Uma's class over the save (D86, D180): the class she starts in, fights as, her setup for each, and one healer a
// party (H59). Kept out of `save/battle.ts` so the main bundle and the party screens can read them without loading the
// fight rules and the engine, which only the lazy `@rpg/domain/battle` subpath reaches (H62). `save/battle.ts`
// re-exports all of it. Pure.
import type { Aptitudes } from '@luismlorenzana/uma-data'
import { BATTLE_ENGINE_VERSION, rpgV2 } from '../rpg/battle/caps'
import { rpgIsHealer } from '../rpg/kinds'
import { rpgDefaultClass, rpgDefaultWeapons, type RpgClass } from '../rpg/rules'
import { best } from '../roster/aptitudes'
import type { ClassLoadout, OwnedUma, TierWorld } from './save'

/** What the battle rules need from an outfit's master data (a `RosterOutfit` fits). */
export interface BattleOutfit {
  outfitId: string
  baseStats: Record<'speed' | 'stamina' | 'power' | 'guts' | 'wit', number>
  growthRatePercents: Record<'speed' | 'stamina' | 'power' | 'guts' | 'wit', number>
  aptitudes: Pick<Aptitudes, 'strategy'>
}

/** Her best running style's class (ties: front, pace, late, end): what an Uma who never picked fights as. */
export const styleClass = (outfit: Pick<BattleOutfit, 'aptitudes'>): RpgClass => rpgDefaultClass(best(outfit.aptitudes.strategy)[0])

/** What `startingClass` reads: her aptitudes, and her base stats (an outfit always has them; without, her style's class). */
export type StartingOutfit = Pick<BattleOutfit, 'aptitudes'> & { baseStats?: Pick<BattleOutfit['baseStats'], 'power' | 'wit'> }
/** The class she starts in at unlock: her style's, except that from classes v2 a Late surger whose base Power beats her
 * base Wit starts as a Paladin (§3.3, D180; ties stay Cleric). The save writes that start as her class. */
export function startingClass(outfit: StartingOutfit, engine: number = BATTLE_ENGINE_VERSION): RpgClass {
  const style = styleClass(outfit), stats = outfit.baseStats
  return style === 'cleric' && rpgV2(engine) && !!stats && stats.power > stats.wit ? 'paladin' : style
}

/** The class she fights as: the chosen one, or her style's, so no Uma who never picked changes class at the switch. */
export function activeClass(outfit: BattleOutfit, uma: Pick<OwnedUma, 'classId'>): RpgClass {
  return uma.classId ?? styleClass(outfit)
}

/** Her setup for a class: what she saved, or its default five weapons with nothing learned and skills chosen for her. */
export const classOf = (uma: Pick<OwnedUma, 'classes'>, classId: RpgClass): ClassLoadout =>
  uma.classes[classId] ?? { weapons: rpgDefaultWeapons(classId), tree: [], loadout: null }

/** What `healerBlock` says. */
export const ONE_HEALER = 'One healer a party'
/** Why these Umas can't fight together, or null: from classes v2, at most one of them fights as a healer, a Paladin or a
 * Cleric (C8, D178). Checked where a party fights, never on party edits or class switches; the party screens show it. */
export function healerBlock(world: Pick<TierWorld, 'umas'>, ids: readonly string[], outfits: ReadonlyMap<string, BattleOutfit>,
  engine: number = BATTLE_ENGINE_VERSION): string | null {
  const healers = ids.filter((id) => {
    const outfit = outfits.get(id), uma = world.umas[id]
    return !!outfit && !!uma && rpgIsHealer(activeClass(outfit, uma), engine)
  })
  return healers.length > 1 ? ONE_HEALER : null
}
