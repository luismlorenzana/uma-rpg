// The materials and made items in the player's words (H80; the farm by line since H112, D224, FL16): a material's line
// and grade ("Metal · G3 · raw"); its pair ("Refines into Iron Ingot"); a made item's grade and use
// ("Raises a weapon one grade", "Opens Planet III"). The place pages, the Warehouse and the job sheet share them.
import { lineItem, madeIdentity, madeName, stockName, type MadeLine, type MaterialLine } from '@rpg/domain'

/** "Metal · G3 · raw" (FL16), or null for an id that isn't a material. */
export function materialFacts(id: string): string | null {
  const line = lineItem(id)
  return line ? `${LINE_WORD[line.line]} · G${line.grade} · ${line.refined ? 'refined' : 'raw'}` : null
}

/** "Refines into Iron Ingot" or "Refined from Iron Ore". */
export function materialPair(id: string): string | null {
  const m = lineItem(id)
  return m ? `${m.refined ? 'Refined from' : 'Refines into'} ${stockName(m.pair)}` : null
}

const USE: Readonly<Record<Exclude<MadeLine, 'jewel-planet' | 'jewel-moon'>, string>> = {
  'weapon-gem': 'Raises an Arms weapon one grade',
  'armor-fittings': 'Raises an armor piece one grade',
  'accessory-setting': 'Raises an accessory one grade',
  'branch-gem': 'Picks a weapon’s branch',
  'tome-ink': 'Raises a Tome one grade',
}

/** What a made item does: "Raises a weapon one grade", "Opens Planet III", "Opens a moon’s node II". */
export function madeUse(id: string): string | null {
  const made = madeIdentity(id)
  if (!made) return null
  const numeral = madeName(id)!.split(' ').at(-1)
  if (made.line === 'jewel-planet') return `Opens Planet ${numeral}`
  if (made.line === 'jewel-moon') return `Opens a moon’s node ${numeral}`
  return USE[made.line]
}

/** "Grade 5 · Raises a weapon one grade"; a jewel by its node ("Opens Planet III"). */
export function madeFacts(id: string): string | null {
  const made = madeIdentity(id)
  if (!made) return null
  return made.line === 'jewel-planet' || made.line === 'jewel-moon' ? madeUse(id) : `Grade ${made.grade} · ${madeUse(id)}`
}

/** A material line by its profession's work: the Workbench's columns and the Warehouse's rows. */
export const LINE_WORD: Readonly<Record<MaterialLine, string>> = { metal: 'Metal', wood: 'Wood', vegetables: 'Vegetables', fish: 'Fish', stone: 'Stone' }

/** The made lines' plural names, as their shelves and places say them. */
export const MADE_PLURAL: Readonly<Record<MadeLine, string>> = {
  'weapon-gem': 'Arms Gems', 'armor-fittings': 'Armor Fittings', 'accessory-setting': 'Accessory Settings', 'branch-gem': 'Branch Gems',
  'jewel-planet': 'Planet Jewels', 'jewel-moon': 'Moon Jewels', 'tome-ink': 'Tome Ink',
}
