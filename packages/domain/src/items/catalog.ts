// The item catalog as the rules use it: every raw and refined item with its family, side, effect and grade.
import { FAMILY_SPECS, type ItemEffect, type ItemSide } from './families'

export * from './families'

export interface ItemDef {
  id: string
  name: string
  family: string
  side: ItemSide
  effect: ItemEffect
  grade: number
  refined: boolean
  /** The other form: a raw item's refined id, a refined item's raw id. */
  pair: string
}
export interface ItemFamily {
  id: string
  name: string
  side: ItemSide
  effect: ItemEffect
  site: string
  raw: ItemDef[]
  refined: ItemDef[]
}

export const ITEM_GRADES = 10

export const ITEM_FAMILIES: readonly ItemFamily[] = FAMILY_SPECS.map((f) => {
  const make = (list: typeof f.raw, refined: boolean, other: typeof f.raw): ItemDef[] =>
    list.map(([id, name], i) => ({ id, name, family: f.id, side: f.side, effect: f.effect, grade: i + 1, refined, pair: other[i]![0] }))
  return { id: f.id, name: f.name, side: f.side, effect: f.effect, site: f.site, raw: make(f.raw, false, f.refined), refined: make(f.refined, true, f.raw) }
})

export const ITEMS: readonly ItemDef[] = ITEM_FAMILIES.flatMap((f) => [...f.raw, ...f.refined])
const BY_ID = new Map(ITEMS.map((i) => [i.id, i]))
const FAMILY_BY_ID = new Map(ITEM_FAMILIES.map((f) => [f.id, f]))
const FAMILY_BY_SITE = new Map(ITEM_FAMILIES.map((f) => [f.site, f]))

export const itemById = (id: string): ItemDef | undefined => BY_ID.get(id)
export const familyById = (id: string): ItemFamily | undefined => FAMILY_BY_ID.get(id)
/** The family a Hub site produces (Fields → Grains …). */
export const familyOfSite = (placeId: string): ItemFamily | undefined => FAMILY_BY_SITE.get(placeId)
/** A profession level opens one grade every five levels: grade k at Lv 5k − 4 (1, 6, 11 … 46). */
export const gradeUnlockLevel = (grade: number): number => 5 * grade - 4
export const highestGrade = (professionLevel: number): number => Math.min(ITEM_GRADES, Math.floor((professionLevel + 4) / 5))

/** Display names for the eight effects. */
export const EFFECT_LABEL: Readonly<Record<ItemEffect, string>> = {
  hp: 'HP', mp: 'MP', atk: 'ATK', matk: 'M.ATK', def: 'DEF', mdef: 'M.DEF', speed: 'Speed', limit: 'Limit Break charge',
}
