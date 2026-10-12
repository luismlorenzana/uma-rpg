// Save/profile validation needs ids and gates, not skill names, hit definitions or the full generated catalog (H16).
import { isRpgWeapon, RPG_CLASSES, RPG_TOMES, RPG_WEAPON_KINDS, RPG_WEAPONS, type RpgClass, type RpgTreeId, type RpgWeapon } from './kinds'

export interface RpgNodeIdentity {
  id: string; tree: RpgTreeId; classId: RpgClass; weapon: RpgWeapon; depth: number; variant: 'a' | 'b' | null
  /** Side skills cost their depth; cores are free but retain this catalog field. */
  cost: number
}
/** The weapons a class has trees for. */
export const rpgClassWeapons = (classId: RpgClass): readonly RpgWeapon[] =>
  classId === 'brawler' ? RPG_WEAPON_KINDS : classId === 'mage' ? RPG_TOMES : RPG_WEAPONS
export const rpgTreeOf = (classId: RpgClass, weapon: RpgWeapon): RpgTreeId => `${classId}-${weapon}`
/** Side skills open at Uma Lv 5, 15, 25, 35 and 45 (D73); cores use the class rank (D77). */
export const rpgSideNodeLevel = (depth: number): number => 10 * depth - 5

/** The catalog's exact grammar: 40 class/weapon trees × five depths × core/A/B, with no aliases or zero padding. */
export function rpgNodeIdentity(id: string): RpgNodeIdentity | undefined {
  if (typeof id !== 'string') return undefined
  const match = /^([a-z]+)-([a-z-]+)\.([1-5])([ab])?$/.exec(id)
  if (!match) return undefined
  const classId = match[1] as RpgClass, weapon = match[2] as RpgWeapon
  if (!RPG_CLASSES.includes(classId) || !isRpgWeapon(weapon) || !rpgClassWeapons(classId).includes(weapon)) return undefined
  const depth = Number(match[3])
  return { id, tree: rpgTreeOf(classId, weapon), classId, weapon, depth, variant: (match[4] as 'a' | 'b' | undefined) ?? null, cost: depth }
}
