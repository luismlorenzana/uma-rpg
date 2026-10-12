// The Learning District (S5, design §5–§6, D57, D70, D77): five class halls each train their class's rank (1–5) and Weapon
// Level (1–10); the Armory trains the Armor Level and the Jeweler the Accessory Level (1–10 each).
import type { AptitudeGrade, Aptitudes } from '@luismlorenzana/uma-data'
import { RPG_TOMES, RPG_WEAPON_KINDS, RPG_WEAPONS, type RpgClass } from '../rpg/kinds'
import { CLASS_MAX_RANK, classRankHours, MASTERY_MAX_RANK, masteryRankHours } from './pacing'

/** Every weapon and armor type (gear types, §7.2): the ten weapons of D86, then the four armors. */
export const WEAPON_TYPES = RPG_WEAPONS
export const ARMOR_TYPES = ['garb', 'leather', 'mail', 'plate'] as const
export const GEAR_TYPES = [...WEAPON_TYPES, ...ARMOR_TYPES] as const
export type WeaponType = typeof WEAPON_TYPES[number]
export type ArmorType = typeof ARMOR_TYPES[number]
export type GearType = typeof GEAR_TYPES[number]
export const isGearType = (v: unknown): v is GearType => GEAR_TYPES.includes(v as GearType)

export const GEAR_TYPE_LABEL: Readonly<Record<GearType, string>> = {
  greatsword: 'Greatsword', axe: 'Axe', lance: 'Lance', bow: 'Bow', katana: 'Katana',
  'tome-fire': 'Fire Tome', 'tome-ice': 'Blizzard Tome', 'tome-lightning': 'Thunder Tome', 'tome-light': 'Light Tome', 'tome-dark': 'Dark Tome',
  garb: 'Garb', leather: 'Leather', mail: 'Mail', plate: 'Plate',
}

type Style = keyof Aptitudes['strategy']

/** The weapons each class can wield (D86): the Brawler the five Arms, the Mage the five Tomes, the others any. */
export const CLASS_WEAPONS: Readonly<Record<RpgClass, readonly WeaponType[]>> = {
  brawler: RPG_WEAPON_KINDS, mage: RPG_TOMES, spellblade: RPG_WEAPONS, cleric: RPG_WEAPONS, summoner: RPG_WEAPONS,
}
const CLASS_IDS: readonly RpgClass[] = ['brawler', 'mage', 'spellblade', 'cleric', 'summoner']
/** The classes that wield a weapon type. */
export const weaponClasses = (type: WeaponType): RpgClass[] => CLASS_IDS.filter((c) => CLASS_WEAPONS[c].includes(type))

/** Each class hall trains its class's rank and its Weapon Level, sped by one running style (§4.1, D70). */
export const CLASS_HALLS: Readonly<Record<string, { classId: RpgClass; style: Style }>> = {
  'brawler-dojo': { classId: 'brawler', style: 'front' },
  'mage-tower': { classId: 'mage', style: 'pace' },
  'spell-blade-salle': { classId: 'spellblade', style: 'pace' },
  'cleric-chapel': { classId: 'cleric', style: 'late' },
  'summoner-circle': { classId: 'summoner', style: 'end' },
}
/** The Armory trains the Armor Level, the Jeweler the Accessory Level (Rings, Charms and Orbs), D70/D86. */
export const GEAR_HALLS: Readonly<Record<string, 'armor' | 'accessory'>> = { armory: 'armor', jeweler: 'accessory' }

/**
 * An Uma's training (D57, D70, D77): a rank per class (1–5, spending Promotion Tokens), a Weapon Level per class
 * (1–10), and one Armor and one Accessory Level (1–10). Gear levels spend Mastery Tokens (D94).
 */
export interface Ranks {
  classes: Record<RpgClass, number>
  weapons: Record<RpgClass, number>
  armor: number
  accessory: number
}
export const newRanks = (): Ranks => ({
  classes: { brawler: 1, mage: 1, spellblade: 1, cleric: 1, summoner: 1 },
  weapons: { brawler: 1, mage: 1, spellblade: 1, cleric: 1, summoner: 1 },
  armor: 1,
  accessory: 1,
})

/** A training track, as a job's output: `class:<id>`, `weapons:<id>`, `armor` or `accessory`. */
export type Track = { kind: 'class'; classId: RpgClass } | { kind: 'weapons'; classId: RpgClass } | { kind: 'armor' } | { kind: 'accessory' }
export function parseTrack(output: string): Track | null {
  if (output === 'armor' || output === 'accessory') return { kind: output }
  const [kind, id] = output.split(':')
  if ((kind === 'class' || kind === 'weapons') && CLASS_IDS.includes(id as RpgClass)) return { kind, classId: id as RpgClass }
  return null
}
export const trackId = (t: Track): string => (t.kind === 'class' || t.kind === 'weapons' ? `${t.kind}:${t.classId}` : t.kind)
/** The tracks a Learning District place trains. */
export function tracksAt(placeId: string): Track[] {
  const hall = CLASS_HALLS[placeId]
  if (hall) return [{ kind: 'class', classId: hall.classId }, { kind: 'weapons', classId: hall.classId }]
  const gear = GEAR_HALLS[placeId]
  return gear ? [{ kind: gear }] : []
}

export function rankOf(ranks: Ranks, t: Track): number {
  if (t.kind === 'class') return ranks.classes[t.classId]
  if (t.kind === 'weapons') return ranks.weapons[t.classId]
  return ranks[t.kind]
}
export const maxRankOf = (t: Track): number => (t.kind === 'class' ? CLASS_MAX_RANK : MASTERY_MAX_RANK)
/** Base hours from the current rank to the next (D68). */
export const trackHours = (t: Track, rank: number): number => (t.kind === 'class' ? classRankHours(rank) : masteryRankHours(rank))
/** The aptitude that sets a track's speed: the class's running style; her best distance for armor; her best running
 * style for accessories. */
export function trackAptitude(t: Track, aptitudes: Pick<Aptitudes, 'strategy' | 'distance'>): AptitudeGrade {
  if (t.kind === 'class' || t.kind === 'weapons') return aptitudes.strategy[Object.values(CLASS_HALLS).find((h) => h.classId === t.classId)!.style]
  return bestGrade(t.kind === 'armor' ? aptitudes.distance : aptitudes.strategy)
}
const GRADE_ORDER: readonly AptitudeGrade[] = ['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G']
const bestGrade = (grades: Record<string, AptitudeGrade>): AptitudeGrade =>
  Object.values(grades).reduce((top, g) => (GRADE_ORDER.indexOf(g) < GRADE_ORDER.indexOf(top) ? g : top), 'G' as AptitudeGrade)

/** Her ranks with one track moved to `rank`. */
export function withRank(ranks: Ranks, t: Track, rank: number): Ranks {
  if (t.kind === 'class') return { ...ranks, classes: { ...ranks.classes, [t.classId]: rank } }
  if (t.kind === 'weapons') return { ...ranks, weapons: { ...ranks.weapons, [t.classId]: rank } }
  return { ...ranks, [t.kind]: rank }
}

/** Skill depths a class rank opens: rank r opens depths 1–r (D77), each also waiting on its Uma level gate. */
export const depthsOpen = (classRank: number): number => Math.max(0, Math.min(5, classRank))
