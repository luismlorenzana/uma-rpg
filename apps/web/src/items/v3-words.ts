// R2's materials and made items in the player's words (profession-progression.md §3, §4.4, PP9; H80): a material's tier
// and band ("Tier 1 · high · raw"), or under the farm by line its line and grade ("Metal · G3 · raw", FL16); its pair ("Refines into Iron Ingot"); a made item's grade and use
// ("Raises a weapon one grade", "Opens Planet III"). The place pages, the Warehouse and the job sheet share them.
import { farmByLine, lineItem, madeIdentity, madeName, materialIdentity, stockName, type MadeLine, type MaterialLine } from '@rpg/domain'

/** "Tier 1 · high · raw"; under the farm by line (FL16) "Metal · G3 · raw"; null for an id that isn't a material. */
export function materialFacts(id: string): string | null {
  if (farmByLine()) {
    const line = lineItem(id)
    return line ? `${LINE_WORD[line.line]} · G${line.grade} · ${line.refined ? 'refined' : 'raw'}` : null
  }
  const m = materialIdentity(id)
  return m ? `Tier ${m.tier} · ${m.band} · ${m.refined ? 'refined' : 'raw'}` : null
}

/** "Refines into Iron Ingot" or "Refined from Iron Ore". */
export function materialPair(id: string): string | null {
  const m = farmByLine() ? lineItem(id) : materialIdentity(id)
  return m ? `${m.refined ? 'Refined from' : 'Refines into'} ${stockName(m.pair)}` : null
}

const USE: Readonly<Record<Exclude<MadeLine, 'jewel-planet' | 'jewel-moon'>, string>> = {
  'weapon-gem': 'Raises a weapon one grade',
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
  // The farm by line (FL4): the Arms Gem raises Arms only; Tome Ink raises Tomes.
  if (made.line === 'weapon-gem' && farmByLine()) return 'Raises an Arms weapon one grade'
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
  'weapon-gem': 'Weapon Gems', 'armor-fittings': 'Armor Fittings', 'accessory-setting': 'Accessory Settings', 'branch-gem': 'Branch Gems',
  'jewel-planet': 'Planet Jewels', 'jewel-moon': 'Moon Jewels', 'tome-ink': 'Tome Ink',
}
