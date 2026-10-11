// The Learning District (S5, design §5–§6, D57): five class halls train class proficiency (ranks 1–6) and four armories
// train gear mastery (ranks 1–10). Running style sets a class's speed and distance sets a gear type's (§4.1).
import type { Aptitudes } from '@luismlorenzana/uma-data'
import type { RpgClass } from '../rpg/kinds'
import { CLASS_MAX_RANK, classRankHours, MASTERY_MAX_RANK, masteryRankHours } from './pacing'

/** Every weapon and armor type, each with its own mastery (§7.2). */
export const WEAPON_TYPES = ['short-sword', 'bow', 'spear', 'axe', 'mage-staff', 'arcane-staff', 'greatsword', 'cleric-staff', 'summoner-tome'] as const
export const ARMOR_TYPES = ['garb', 'leather', 'mail', 'plate'] as const
export const GEAR_TYPES = [...WEAPON_TYPES, ...ARMOR_TYPES] as const
export type WeaponType = typeof WEAPON_TYPES[number]
export type ArmorType = typeof ARMOR_TYPES[number]
export type GearType = typeof GEAR_TYPES[number]
export const isGearType = (v: unknown): v is GearType => GEAR_TYPES.includes(v as GearType)

export const GEAR_TYPE_LABEL: Readonly<Record<GearType, string>> = {
  'short-sword': 'Short Sword', bow: 'Bow', spear: 'Spear', axe: 'Axe', 'mage-staff': 'Mage Staff', 'arcane-staff': 'Arcane Staff',
  greatsword: 'Greatsword', 'cleric-staff': 'Cleric Staff', 'summoner-tome': 'Summoner Tome', garb: 'Garb', leather: 'Leather', mail: 'Mail', plate: 'Plate',
}

type Distance = keyof Aptitudes['distance']
type Style = keyof Aptitudes['strategy']

/** Each armory holds one distance's gear (§6, §7.2). */
export const ARMORIES: Readonly<Record<string, { distance: Distance; types: readonly GearType[] }>> = {
  'rangers-lodge': { distance: 'sprint', types: ['short-sword', 'bow', 'garb'] },
  'lancers-barracks': { distance: 'mile', types: ['spear', 'axe', 'leather'] },
  'arcane-armory': { distance: 'medium', types: ['mage-staff', 'arcane-staff', 'mail'] },
  'knights-bastion': { distance: 'long', types: ['greatsword', 'cleric-staff', 'summoner-tome', 'plate'] },
}
/** Each class hall trains one class, sped by one running style (§4.1). */
export const CLASS_HALLS: Readonly<Record<string, { classId: RpgClass; style: Style }>> = {
  'brawler-dojo': { classId: 'brawler', style: 'front' },
  'mage-tower': { classId: 'mage', style: 'pace' },
  'spell-blade-salle': { classId: 'spellblade', style: 'pace' },
  'cleric-chapel': { classId: 'cleric', style: 'late' },
  'summoner-circle': { classId: 'summoner', style: 'end' },
}
export const gearDistance = (type: GearType): Distance => Object.values(ARMORIES).find((a) => a.types.includes(type))!.distance

export interface Ranks {
  classes: Record<RpgClass, number>
  mastery: Record<GearType, number>
}
export const newRanks = (): Ranks => ({
  classes: { brawler: 1, mage: 1, spellblade: 1, cleric: 1, summoner: 1 },
  mastery: Object.fromEntries(GEAR_TYPES.map((t) => [t, 1])) as Record<GearType, number>,
})

/** A training track, as a job's output: `class:<id>` or `mastery:<type>`. */
export type Track = { kind: 'class'; classId: RpgClass } | { kind: 'mastery'; type: GearType }
export function parseTrack(output: string): Track | null {
  const [kind, id] = output.split(':')
  if (kind === 'class' && id && Object.values(CLASS_HALLS).some((h) => h.classId === id)) return { kind: 'class', classId: id as RpgClass }
  if (kind === 'mastery' && isGearType(id)) return { kind: 'mastery', type: id }
  return null
}
export const trackId = (t: Track): string => (t.kind === 'class' ? `class:${t.classId}` : `mastery:${t.type}`)
/** The tracks a Learning District place trains. */
export function tracksAt(placeId: string): Track[] {
  const hall = CLASS_HALLS[placeId]
  if (hall) return [{ kind: 'class', classId: hall.classId }]
  return (ARMORIES[placeId]?.types ?? []).map((type) => ({ kind: 'mastery', type }))
}

export const rankOf = (ranks: Ranks, t: Track): number => (t.kind === 'class' ? ranks.classes[t.classId] : ranks.mastery[t.type])
export const maxRankOf = (t: Track): number => (t.kind === 'class' ? CLASS_MAX_RANK : MASTERY_MAX_RANK)
/** Base hours from the current rank to the next. */
export const trackHours = (t: Track, rank: number): number => (t.kind === 'class' ? classRankHours(rank) : masteryRankHours(rank))
/** The aptitude that sets a track's speed: the class's running style, or the gear's distance. */
export function trackAptitude(t: Track, aptitudes: Pick<Aptitudes, 'strategy' | 'distance'>) {
  if (t.kind === 'class') return aptitudes.strategy[Object.values(CLASS_HALLS).find((h) => h.classId === t.classId)!.style]
  return aptitudes.distance[gearDistance(t.type)]
}

/** Skill depths a class rank opens: none at rank 1, then one more per rank (rank 6 opens depth 5, §5). */
export const depthsOpen = (classRank: number): number => Math.max(0, Math.min(5, classRank - 1))
