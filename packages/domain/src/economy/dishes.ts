// Dishes and the Sun-and-planets map (S6, design §8.4 and §10, D58). Every dish is generated from the item catalog:
// a planet dish per farming family and grade, a Duo dish per bridge (grades 3 and 7), and four Feasts. Eating a dish
// unlocks one node on an Uma's map; her active nodes add points to her stats.
import { ITEM_EFFECTS, ITEM_FAMILIES, type ItemEffect, type ItemFamily } from '../items/catalog'

/** The ring, in order (§10): stats that build together sit side by side. */
export const RING: readonly ItemEffect[] = ['hp', 'def', 'mdef', 'mp', 'matk', 'atk', 'speed', 'limit']
export const BRIDGE_GRADES = [3, 7] as const
export const FEAST_GRADES = [4, 6, 8, 10] as const
export const MOONS = 10

const FARM = ITEM_FAMILIES.filter((f) => f.side === 'farming')
const farmOf = (effect: ItemEffect): ItemFamily => FARM.find((f) => f.effect === effect)!

/** A family's dish style (its raw item names the dish: "Apple Tart"). */
const STYLE: Readonly<Record<string, string>> = {
  grains: 'Bread', fruits: 'Tart', fishes: 'Grill', fish: 'Grill', 'herbs-spices': 'Curry', vegetables: 'Salad', mushrooms: 'Soup', sweets: 'Cake', 'nuts-seeds': 'Cookies',
}
const SHORT: Readonly<Record<string, string>> = {
  grains: 'Grain', fruits: 'Fruit', fish: 'Fish', 'herbs-spices': 'Herb', vegetables: 'Garden', mushrooms: 'Mushroom', sweets: 'Honey', 'nuts-seeds': 'Nut',
}

export type DishKind = 'planet' | 'duo' | 'feast'
export interface Dish {
  id: string
  name: string
  kind: DishKind
  grade: number
  /** The effects it feeds: one planet, a bridge's pair, or all eight. */
  effects: ItemEffect[]
  /** Refined ingredients per dish. */
  inputs: Record<string, number>
}

/** Sides: grade-⌈g/2⌉ refined items of other families, from grade 4 on, so every family stays in demand (D65). */
function sides(star: ItemFamily, grade: number, count: number): Record<string, number> {
  const i = FARM.indexOf(star)
  const out: Record<string, number> = {}
  for (let k = 0; k < count; k++) {
    const family = FARM[(i + 1 + 2 * k) % FARM.length]!
    const id = family.refined[Math.ceil(grade / 2) - 1]!.id
    out[id] = (out[id] ?? 0) + 1
  }
  return out
}
const add = (a: Record<string, number>, b: Record<string, number>): Record<string, number> => {
  const out = { ...a }
  for (const [k, v] of Object.entries(b)) out[k] = (out[k] ?? 0) + v
  return out
}

const PLANET_DISHES: Dish[] = FARM.flatMap((f) => f.refined.map((refined, i): Dish => {
  const grade = i + 1
  const raw = f.raw[i]!
  return { id: `dish-${f.id}-${grade}`, name: `${raw.name} ${STYLE[f.id] ?? 'Dish'}`, kind: 'planet', grade, effects: [f.effect],
    inputs: add({ [refined.id]: 1 }, sides(f, grade, grade <= 3 ? 0 : grade <= 7 ? 1 : 2)) }
}))

export const BRIDGES: readonly (readonly [ItemEffect, ItemEffect])[] = RING.map((e, i) => [e, RING[(i + 1) % RING.length]!] as const)
const DUO_DISHES: Dish[] = BRIDGES.flatMap(([a, b]) => BRIDGE_GRADES.map((grade): Dish => {
  const fa = farmOf(a), fb = farmOf(b)
  return { id: `duo-${a}-${b}-${grade}`, name: `${SHORT[fa.id]} & ${SHORT[fb.id]} Platter${grade >= 7 ? ' Deluxe' : ''}`, kind: 'duo', grade, effects: [a, b],
    inputs: add({ [fa.refined[grade - 1]!.id]: 1, [fb.refined[grade - 1]!.id]: 1 }, sides(fa, grade, grade >= 7 ? 1 : 0)) }
}))
const FEAST_NAMES: Record<number, string> = { 4: 'Spring Feast', 6: 'Summer Feast', 8: 'Harvest Feast', 10: 'Grand Feast' }
const FEASTS: Dish[] = FEAST_GRADES.map((grade): Dish => ({
  id: `feast-${grade}`, name: FEAST_NAMES[grade]!, kind: 'feast', grade, effects: [...ITEM_EFFECTS],
  inputs: Object.fromEntries(FARM.map((f) => [f.refined[grade - 1]!.id, 1])),
}))

export const DISHES: readonly Dish[] = [...PLANET_DISHES, ...DUO_DISHES, ...FEASTS]
const BY_ID = new Map(DISHES.map((d) => [d.id, d]))
export const dishById = (id: string): Dish | undefined => BY_ID.get(id)

// --- The map (§10) -------------------------------------------------------------------------------------------------

/** Node ids: `moon:<effect>:<1–10>`, `bridge:<a>-<b>:<1–2>`, `sun:<1–4>`. 100 in all. */
export const STAR_NODES: readonly string[] = [
  ...RING.flatMap((e) => Array.from({ length: MOONS }, (_, i) => `moon:${e}:${i + 1}`)),
  ...BRIDGES.flatMap(([a, b]) => [1, 2].map((n) => `bridge:${a}-${b}:${n}`)),
  ...[1, 2, 3, 4].map((n) => `sun:${n}`),
]
const NODE_SET = new Set(STAR_NODES)
export const isStarNode = (id: string): boolean => NODE_SET.has(id)

/** The minimum dish grade a node needs. */
export function nodeGrade(id: string): number {
  const [kind, , n] = id.split(':')
  if (kind === 'moon') return Number(n)
  if (kind === 'bridge') return BRIDGE_GRADES[Number(n) - 1]!
  return FEAST_GRADES[Number(id.split(':')[1]) - 1]!
}

/** The nodes a dish can unlock, lowest first. */
export function nodesFor(dish: Dish): string[] {
  if (dish.kind === 'planet') return Array.from({ length: MOONS }, (_, i) => `moon:${dish.effects[0]}:${i + 1}`).filter((n) => nodeGrade(n) <= dish.grade)
  if (dish.kind === 'duo') return [1, 2].map((n) => `bridge:${dish.effects[0]}-${dish.effects[1]}:${n}`).filter((n) => nodeGrade(n) <= dish.grade)
  return [1, 2, 3, 4].map((n) => `sun:${n}`).filter((n) => nodeGrade(n) <= dish.grade)
}

/** Points per effect from a set of active nodes: a moon gives 1, a bridge ½ to each side, the Sun ⅛ to all eight. */
export function starPoints(active: readonly string[]): Record<ItemEffect, number> {
  const points = Object.fromEntries(ITEM_EFFECTS.map((e) => [e, 0])) as Record<ItemEffect, number>
  for (const id of active) {
    const [kind, key] = id.split(':')
    if (kind === 'moon') points[key as ItemEffect] += 1
    else if (kind === 'bridge') for (const e of key!.split('-')) points[e as ItemEffect] += 0.5
    else if (kind === 'sun') for (const e of ITEM_EFFECTS) points[e] += 0.125
  }
  return points
}

