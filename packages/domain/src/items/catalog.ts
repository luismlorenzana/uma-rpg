// The item catalog as the rules use it: every raw and refined item with its family, effect and grade. Built from the
// id-only snapshot (identity.ts), so the 160 v1 names stay out of the main bundle: they load on demand with
// `names-v1.ts`, the only module that reads `families.ts` (H136).
import { ITEM_IDENTITIES } from './identity'
import type { ItemEffect } from './kinds'

export * from './kinds'

export interface ItemDef {
  id: string
  family: string
  effect: ItemEffect
  grade: number
  refined: boolean
  /** The other form: a raw item's refined id, a refined item's raw id. */
  pair: string
}
export interface ItemFamily {
  id: string
  effect: ItemEffect
  site: string
  raw: ItemDef[]
  refined: ItemDef[]
}

export const ITEM_GRADES = 10

export const ITEM_FAMILIES: readonly ItemFamily[] = ITEM_IDENTITIES.map((f) => {
  const make = (list: readonly string[], refined: boolean, other: readonly string[]): ItemDef[] =>
    list.map((id, i) => ({ id, family: f.id, effect: f.effect, grade: i + 1, refined, pair: other[i]! }))
  return { id: f.id, effect: f.effect, site: f.site, raw: make(f.raw, false, f.refined), refined: make(f.refined, true, f.raw) }
})

export const ITEMS: readonly ItemDef[] = ITEM_FAMILIES.flatMap((f) => [...f.raw, ...f.refined])
const BY_ID = new Map(ITEMS.map((i) => [i.id, i]))
const FAMILY_BY_ID = new Map(ITEM_FAMILIES.map((f) => [f.id, f]))

export const itemById = (id: string): ItemDef | undefined => BY_ID.get(id)
export const familyById = (id: string): ItemFamily | undefined => FAMILY_BY_ID.get(id)
/** Craft Level opens one grade every five levels: grade k at Lv 5k − 4 (1, 6, 11 … 46). */
export const gradeUnlockLevel = (grade: number): number => 5 * grade - 4
export const highestGrade = (craftLevel: number): number => Math.min(ITEM_GRADES, Math.floor((craftLevel + 4) / 5))

/** Display names for the eight effects. */
export const EFFECT_LABEL: Readonly<Record<ItemEffect, string>> = {
  hp: 'HP', mp: 'MP', atk: 'ATK', matk: 'M.ATK', def: 'DEF', mdef: 'M.DEF', speed: 'Speed', limit: 'Limit Break charge',
}
