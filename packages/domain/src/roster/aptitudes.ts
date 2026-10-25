// An Uma's original aptitudes as labels, and her best of each group. What they do in uma-rpg is her template (engine v16,
// uma-templates.md, D203): her styles and distances read her calling and stride (`roster/template.ts`). The old rows
// (style → class training speed, distance → gear mastery speed: `STYLE_CLASSES`, `DISTANCE_GEAR`, `learningTime`)
// retired with them (H72, D210). Surface no longer sets job speed (D139).
import { APTITUDE_GRADES, type Aptitudes, type AptitudeGrade } from '@luismlorenzana/uma-data'

export const KEY_LABELS: Record<string, string> = {
  turf: 'Turf', dirt: 'Dirt', sprint: 'Sprint', mile: 'Mile', medium: 'Medium', long: 'Long', front: 'Front', pace: 'Pace', late: 'Late', end: 'End',
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
