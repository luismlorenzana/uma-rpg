// Star Gems (D144): cut at the Lapidary from refined Wilds items, one for each node of an Uma's Extra Stats map. They take
// the recipes the farm's dishes had (D65, D86), on the Wilds family of each stat, so every family is used alike:
// - a moon gem: one refined item of its stat's family at its grade, plus a half-grade side from grade 4 and a second
//   from grade 8;
// - a bridge gem (grades 3 and 7): one refined item of each of its two families, plus a side at grade 7;
// - a Sun gem (grades 4, 6, 8, 10): one refined item of every family.
// A gem is named for its grade's stone on the Crystal Cavern's ladder and its stat's virtue, "Garnet of Strength":
// `gemNameV1` (items/names-v1.ts), which loads on demand (H136).
import { ITEM_FAMILIES, type ItemEffect, type ItemFamily } from '../items/catalog'
import { GEM_IDENTITIES, type GemIdentity } from './stars'
export * from './stars'

const familyOf = (effect: ItemEffect): ItemFamily => ITEM_FAMILIES.find((f) => f.effect === effect)!

export interface Gem extends GemIdentity {
  /** Refined items per gem. */
  inputs: Record<string, number>
}

/** Sides: grade-⌈g/2⌉ refined items of other families, walking the families two at a time from the star's (D65). */
function sides(star: ItemFamily, grade: number, count: number): Record<string, number> {
  const i = ITEM_FAMILIES.indexOf(star)
  const out: Record<string, number> = {}
  for (let k = 0; k < count; k++) {
    const id = ITEM_FAMILIES[(i + 1 + 2 * k) % ITEM_FAMILIES.length]!.refined[Math.ceil(grade / 2) - 1]!.id
    out[id] = (out[id] ?? 0) + 1
  }
  return out
}
const add = (a: Record<string, number>, b: Record<string, number>): Record<string, number> => {
  const out = { ...a }
  for (const [k, v] of Object.entries(b)) out[k] = (out[k] ?? 0) + v
  return out
}

function recipe(gem: GemIdentity): Gem {
  const g = gem.grade
  if (gem.kind === 'moon') {
    const f = familyOf(gem.effects[0]!)
    return { ...gem, inputs: add({ [f.refined[g - 1]!.id]: 1 }, sides(f, g, g <= 3 ? 0 : g <= 7 ? 1 : 2)) }
  }
  if (gem.kind === 'bridge') {
    const [fa, fb] = gem.effects.map(familyOf) as [ItemFamily, ItemFamily]
    return { ...gem, inputs: add({ [fa.refined[g - 1]!.id]: 1, [fb.refined[g - 1]!.id]: 1 }, sides(fa, g, g >= 7 ? 1 : 0)) }
  }
  return { ...gem, inputs: Object.fromEntries(ITEM_FAMILIES.map((f) => [f.refined[g - 1]!.id, 1])) }
}

export const GEMS: readonly Gem[] = GEM_IDENTITIES.map(recipe)
const BY_ID = new Map(GEMS.map((g) => [g.id, g]))
export const gemById = (id: string): Gem | undefined => BY_ID.get(id)
