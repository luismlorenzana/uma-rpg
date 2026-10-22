// What an Uma's original aptitudes do in uma-rpg (design §4.1): running style → class training speed, distance → gear
// mastery speed. A takes half the time of G. Surface no longer sets job speed (D139).
import { APTITUDE_GRADES, type Aptitudes, type AptitudeGrade } from '@luismlorenzana/uma-data'
import { rpgV2 } from '../rpg/battle/caps'

/** The live generation's: from classes v2 a Late surger starts as a Paladin or a Cleric (§3.3, D180). */
export const STYLE_CLASSES: Record<keyof Aptitudes['strategy'], string[]> = {
  front: ['Brawler'],
  pace: ['Mage', 'Spell Blade'],
  late: rpgV2() ? ['Paladin', 'Cleric'] : ['Cleric'],
  end: ['Summoner'],
}

/** What her best distance speeds (D70): Armor Level training at the Armory, whichever distance it is. */
export const DISTANCE_GEAR: Record<keyof Aptitudes['distance'], { armory: string; gear: string }> = {
  sprint: { armory: 'Armory', gear: 'Armor Level (Armory)' },
  mile: { armory: 'Armory', gear: 'Armor Level (Armory)' },
  medium: { armory: 'Armory', gear: 'Armor Level (Armory)' },
  long: { armory: 'Armory', gear: 'Armor Level (Armory)' },
}

export const KEY_LABELS: Record<string, string> = {
  turf: 'Turf', dirt: 'Dirt', sprint: 'Sprint', mile: 'Mile', medium: 'Medium', long: 'Long', front: 'Front', pace: 'Pace', late: 'Late', end: 'End',
}

/** Time to finish as a share of the G-grade time (design §4.1: A 50% … G 100%; S counts as A). */
export function learningTime(grade: AptitudeGrade): number {
  const steps: Record<AptitudeGrade, number> = { S: 0.5, A: 0.5, B: 7 / 12, C: 2 / 3, D: 0.75, E: 5 / 6, F: 11 / 12, G: 1 }
  return steps[grade]
}

/** The best key of a group (ties keep the group's order). */
export function best<K extends string>(grades: Record<K, AptitudeGrade>): [K, AptitudeGrade] {
  const order = APTITUDE_GRADES as readonly string[]
  const entries = Object.entries(grades) as [K, AptitudeGrade][]
  return entries.reduce((top, e) => (order.indexOf(e[1]) < order.indexOf(top[1]) ? e : top), entries[0] as [K, AptitudeGrade])
}

/** "Turf A · Medium A · Pace A": her best surface, distance and style. */
export function bestAptitudeLine(a: Aptitudes): string {
  return [best(a.surface), best(a.distance), best(a.strategy)].map(([k, g]) => `${KEY_LABELS[k] ?? k} ${g}`).join(' · ')
}
