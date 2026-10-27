// The made items' ids (R2, D208–D209): what the Forge, the Armorer, the Charm Shop and the Lapidary make. Ids, lines and grades
// only, safe for the main bundle and the save's parse; names and places are `items/made.ts`'s (H77), recipes
// `made-v4.ts`'. Tome Ink (D224, FL14; H109) is the farm by line's, made at the Workbench for Tomes.
export const MADE_LINES = ['weapon-gem', 'armor-fittings', 'accessory-setting', 'branch-gem', 'jewel-planet', 'jewel-moon', 'tome-ink'] as const
export type MadeLine = typeof MADE_LINES[number]
export interface MadeIdentity { id: string; line: MadeLine; grade: number }
const graded = (line: MadeLine): MadeIdentity[] => Array.from({ length: 10 }, (_, i) => ({ id: `${line}-g${i + 1}`, line, grade: i + 1 }))
export const MADE_IDENTITIES: readonly MadeIdentity[] = [
  ...graded('weapon-gem'), ...graded('armor-fittings'), ...graded('accessory-setting'),
  { id: 'branch-gem', line: 'branch-gem', grade: 5 },
  ...[1, 2, 3, 4, 5].map((n): MadeIdentity => ({ id: `jewel-planet-${n}`, line: 'jewel-planet', grade: 2 * n - 1 })),
  ...[1, 2, 3, 4, 5].map((n): MadeIdentity => ({ id: `jewel-moon-${n}`, line: 'jewel-moon', grade: 2 * n })),
  ...graded('tome-ink'),
]
const BY_ID = new Map(MADE_IDENTITIES.map((m) => [m.id, m]))
export const madeIdentity = (id: string): MadeIdentity | undefined => BY_ID.get(id)
export const isMadeId = (id: string): boolean => BY_ID.has(id)
/** The made lines a slot's grade climbs with: an Arms weapon's Arms Gems, a Tome's Tome Ink, armor, accessories. */
export type GradeLine = 'weapon-gem' | 'tome-ink' | 'armor-fittings' | 'accessory-setting'
export const gradeItem = (line: GradeLine, grade: number): string => `${line}-g${grade}`
export const jewelId = (body: 'planet' | 'moon', numeral: number): string => `jewel-${body}-${numeral}`
