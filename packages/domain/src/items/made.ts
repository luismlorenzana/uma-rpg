// The made items' names, places and recipes (R2, D208; profession-progression.md §3.4–§3.5, §6, PP9–PP12;
// weapon-progression.md WP26; extra-stats-progression.md EP17–EP18; H77). Their ids are `made-id.ts`'s (H74).
//
// One fixed recipe an item, the same amounts in every tier (PP10, PP11): a Weapon Gem 2 metal and 2 wood; Armor Fittings 1
// vegetable and 1 fish in the low band, 1 metal, 1 wood and 1 stone in the high band; an Accessory Setting 12 refined
// split over the tier's accessory slots, half vegetables and half fish; a Planet Jewel 3 each of stone, wood, vegetables
// and fish; a Moon Jewel 3 stone on 1 metal; the Branch Gem its world's G5 Weapon Gem. The ladder (PP9) picks each
// type: a grade's band picks the low or high type, and a later world moves the top grade of each band onto its own
// pairs (Tier 2: G5 and G10 on Tier 2's; Tier 3: G4 and G9 on Tier 2's, G5 and G10 on Tier 3's). A jewel's grade is its
// node's (Planet n 2n − 1, Moon n 2n).
import { accessorySlotCount, type GearTier } from '../economy/grades'
import type { PlaceIdV3 } from '../economy/professions'
import { madeIdentity, type MadeLine } from './made-id'
import { materialType, type MaterialBand, type MaterialLine, type MaterialTier } from './materials-id'

const NUMERALS = ['I', 'II', 'III', 'IV', 'V'] as const
const LINE_NAME: Readonly<Record<MadeLine, string>> = {
  'weapon-gem': 'Weapon Gem', 'armor-fittings': 'Armor Fittings', 'accessory-setting': 'Accessory Setting', 'branch-gem': 'Branch Gem',
  'jewel-planet': 'Planet Jewel', 'jewel-moon': 'Moon Jewel', 'tome-ink': 'Tome Ink',
}

/** "Weapon Gem G3", "Armor Fittings G3", "Accessory Setting G3", "Branch Gem", "Planet Jewel III", "Moon Jewel II". */
export function madeName(id: string): string | undefined {
  const made = madeIdentity(id)
  if (!made) return undefined
  if (made.line === 'branch-gem') return LINE_NAME[made.line]
  if (made.line === 'jewel-planet' || made.line === 'jewel-moon') return `${LINE_NAME[made.line]} ${NUMERALS[Math.ceil(made.grade / 2) - 1]}`
  return `${LINE_NAME[made.line]} G${made.grade}`
}

const LINE_PLACE: Readonly<Record<MadeLine, PlaceIdV3>> = {
  'weapon-gem': 'forge', 'branch-gem': 'forge', 'armor-fittings': 'armorer', 'accessory-setting': 'charm-shop', 'jewel-planet': 'lapidary', 'jewel-moon': 'lapidary',
  'tome-ink': 'workbench',
}
/** The making place of a line (PP4): the Forge, the Armorer, the Charm Shop or the Lapidary; Tome Ink the Workbench, under
 * the farm by line (FL3). */
export const madePlace = (line: MadeLine): PlaceIdV3 => LINE_PLACE[line]

/** A world's tier as a material tier: the catalog has three. */
export const worldMaterialTier = (worldTier: number): MaterialTier => Math.min(3, Math.max(1, Math.floor(worldTier))) as MaterialTier

/** A grade's band: grades 1–5 low, 6–10 high. */
export const gradeBand = (grade: number): MaterialBand => (grade <= 5 ? 'low' : 'high')

/** The ladder (PP9): the tier whose pair a grade's material comes from in a world of `worldTier`. A band's top grade (5,
 * 10) takes the world's own pair, the one below (4, 9) the tier before it, and so on down to Tier 1's. */
export function ladderTier(grade: number, worldTier: number): MaterialTier {
  const fromTop = 4 - ((Math.max(1, Math.floor(grade)) - 1) % 5)
  return Math.max(1, worldMaterialTier(worldTier) - fromTop) as MaterialTier
}

/** An Accessory Setting's refined items, split over the tier's accessory slots (12 · 6 · 4 at 1 · 2 · 3; D208: one slot
 * in every tier until R3). */
export const ACCESSORY_SETTING_REFINED = 12

type Part = readonly [MaterialLine, number]
function parts(line: MadeLine, grade: number, slots: number): readonly Part[] {
  const band = gradeBand(grade)
  switch (line) {
    case 'weapon-gem':
    case 'branch-gem': return [['metal', 2], ['wood', 2]]
    case 'armor-fittings': return band === 'low' ? [['vegetables', 1], ['fish', 1]] : [['metal', 1], ['wood', 1], ['stone', 1]]
    case 'accessory-setting': {
      const half = ACCESSORY_SETTING_REFINED / slots / 2
      if (!Number.isInteger(half) || half < 1) throw new RangeError(`No Accessory Setting for ${slots} slots`)
      return [['vegetables', half], ['fish', half]]
    }
    case 'jewel-planet': return [['stone', 3], ['wood', 3], ['vegetables', 3], ['fish', 3]]
    case 'jewel-moon': return [['stone', 3], ['metal', 1]]
    case 'tome-ink': throw new RangeError('Tome Ink is the farm by line\'s: `madeRecipeV4`')
  }
}

/** What one made item takes in a world of `worldTier` (PP §6.2): refined id → quantity, in the recipe's order. `slots` is
 * the tier's accessory slot count (only the Accessory Setting reads it). Throws for an id that isn't a made item. */
export function madeRecipe(id: string, worldTier: number, slots: number = accessorySlotCount(worldMaterialTier(worldTier) as GearTier)): Readonly<Record<string, number>> {
  const made = madeIdentity(id)
  if (!made) throw new RangeError(`${id} isn't a made item`)
  const tier = ladderTier(made.grade, worldTier)
  const band = gradeBand(made.grade)
  return Object.fromEntries(parts(made.line, made.grade, slots).map(([line, qty]) => [materialType(line, tier, band).refined, qty]))
}

/** A made item's refined count: its make time in gathers (PP12). */
export function madeRefined(id: string, worldTier: number, slots?: number): number {
  return Object.values(madeRecipe(id, worldTier, slots)).reduce((a, b) => a + b, 0)
}
