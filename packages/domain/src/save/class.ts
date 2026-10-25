// An Uma's class over the save (D86, D180): the class she starts in, fights as, her setup for each, and one healer a
// party (H59). Kept out of `save/battle.ts` so the main bundle and the party screens can read them without loading the
// fight rules and the engine, which only the lazy `@rpg/domain/battle` subpath reaches (H62). `save/battle.ts`
// re-exports all of it. Pure.
import type { Aptitudes } from '@luismlorenzana/uma-data'
import { BATTLE_ENGINE_VERSION, rpgRework, rpgV2 } from '../rpg/battle/caps'
import { rpgIsHealer } from '../rpg/kinds'
import { rpgNodeIdentity } from '../rpg/node-identity'
import { rpgDefaultClass, rpgDefaultWeapons, type RpgClass, type RpgWeapon } from '../rpg/rules'
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
/** The class she starts in at unlock. From engine v16 her calling, the pick's pre-selection (`umaCalling`; CP29, H67). To
 * v15 her style's, except that from classes v2 a Late surger whose base Power beats her base Wit starts as a Paladin
 * (§3.3, D180; ties stay Cleric). The save writes that start as her class (`newOwnedUma`). */
export function startingClass(outfit: StartingOutfit, engine: number = BATTLE_ENGINE_VERSION): RpgClass {
  const stats = outfit.baseStats
  if (rpgRework('fight', engine)) return umaCalling({ aptitudes: outfit.aptitudes, baseStats: stats ?? { power: 0, wit: 0 } })
  const style = styleClass(outfit)
  return style === 'cleric' && rpgV2(engine) && !!stats && stats.power > stats.wit ? 'paladin' : style
}

/** The class she fights as: the chosen one, or her style's, so no Uma who never picked changes class at the switch. From
 * v16 every new unlock is written with her start (H67), so the fallback holds only for Umas unlocked before it (UT17). */
export function activeClass(outfit: BattleOutfit, uma: Pick<OwnedUma, 'classId'>): RpgClass {
  return uma.classId ?? styleClass(outfit)
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
 * Cleric (C8, D178). Checked where a party fights, never on party edits or class switches; the party screens show it. */
export function healerBlock(world: Pick<TierWorld, 'umas'>, ids: readonly string[], outfits: ReadonlyMap<string, BattleOutfit>,
  engine: number = BATTLE_ENGINE_VERSION): string | null {
  const healers = ids.filter((id) => {
    const outfit = outfits.get(id), uma = world.umas[id]
    return !!outfit && !!uma && rpgIsHealer(activeClass(outfit, uma), engine)
  })
  return healers.length > 1 ? ONE_HEALER : null
}
