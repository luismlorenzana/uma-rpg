// The made items' ids (R2, D208–D209): what the Forge, the Armorer, the Charm Shop and the Lapidary make. Ids, lines and grades
// only, safe for the main bundle and the save's parse; names, places and recipes are `items/made.ts`'s (H77).
export const MADE_LINES = ['weapon-gem', 'armor-fittings', 'accessory-setting', 'branch-gem', 'jewel-planet', 'jewel-moon'] as const
export type MadeLine = typeof MADE_LINES[number]
export interface MadeIdentity { id: string; line: MadeLine; grade: number }
const graded = (line: MadeLine): MadeIdentity[] => Array.from({ length: 10 }, (_, i) => ({ id: `${line}-g${i + 1}`, line, grade: i + 1 }))
export const MADE_IDENTITIES: readonly MadeIdentity[] = [
  ...graded('weapon-gem'), ...graded('armor-fittings'), ...graded('accessory-setting'),
  { id: 'branch-gem', line: 'branch-gem', grade: 5 },
  ...[1, 2, 3, 4, 5].map((n): MadeIdentity => ({ id: `jewel-planet-${n}`, line: 'jewel-planet', grade: 2 * n - 1 })),
  ...[1, 2, 3, 4, 5].map((n): MadeIdentity => ({ id: `jewel-moon-${n}`, line: 'jewel-moon', grade: 2 * n })),
]
const BY_ID = new Map(MADE_IDENTITIES.map((m) => [m.id, m]))
export const madeIdentity = (id: string): MadeIdentity | undefined => BY_ID.get(id)
export const isMadeId = (id: string): boolean => BY_ID.has(id)
export const gradeItem = (line: 'weapon-gem' | 'armor-fittings' | 'accessory-setting', grade: number): string => `${line}-g${grade}`
export const jewelId = (body: 'planet' | 'moon', numeral: number): string => `jewel-${body}-${numeral}`
