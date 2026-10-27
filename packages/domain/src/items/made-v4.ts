// The farm by line's recipes (D224; farm-by-line.md FL7, FL9, FL14; H109): a made item takes one line's refined items of
// its own grade, the same amount at every grade (a jewel's grade is its node's: Planet n 2n − 1, Moon n 2n). An Arms Gem
// (R2's Weapon Gem, renamed) or Tome Ink 7, Armor Fittings 2, an Accessory Setting 10, a Planet Jewel 10, a Moon Jewel 4;
// each line carries about 100–110 refined items a maxed Uma (FL9). Live since H112 (save v30).
import { lineItemId, type MaterialLine } from './lines'
import { madeName } from './made'
import { madeIdentity, type MadeLine } from './made-id'

/** Each made line's line and amount (FL9). The Branch Gem is R3's (not live): its world's G5 metal, a placeholder R3
 * replaces. */
export const RECIPE_V4: Readonly<Record<MadeLine, { line: MaterialLine; qty: number }>> = {
  'weapon-gem': { line: 'metal', qty: 7 },
  'tome-ink': { line: 'vegetables', qty: 7 },
  'armor-fittings': { line: 'wood', qty: 2 },
  'accessory-setting': { line: 'fish', qty: 10 },
  'jewel-planet': { line: 'stone', qty: 10 },
  'jewel-moon': { line: 'stone', qty: 4 },
  'branch-gem': { line: 'metal', qty: 7 },
}

/** What one made item takes: its line's refined item of its grade → the amount. Throws for an id that isn't a made item. */
export function madeRecipeV4(id: string): Readonly<Record<string, number>> {
  const made = madeIdentity(id)
  if (!made) throw new RangeError(`${id} isn't a made item`)
  const { line, qty } = RECIPE_V4[made.line]
  return { [lineItemId(line, made.grade, true)]: qty }
}

/** A made item's refined count: its make time in three-quarter gathers (FL10). */
export const madeRefinedV4 = (id: string): number => Object.values(madeRecipeV4(id)).reduce((a, b) => a + b, 0)

/** A made item's name: `madeName`, which reads Arms Gem for a Weapon Gem since the farm by line (FL14). */
export const madeNameV4 = (id: string): string | undefined => madeName(id)
