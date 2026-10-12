// Dish and Extra Stats identities without ingredient recipes or display names (H16).
import { ITEM_IDENTITIES } from '../items/identity'
import type { ItemEffect } from '../items/kinds'

export const RING: readonly ItemEffect[] = ['hp', 'def', 'mdef', 'mp', 'matk', 'atk', 'speed', 'limit']
export const BRIDGE_GRADES = [3, 7] as const
export const FEAST_GRADES = [4, 6, 8, 10] as const
export const MOONS = 10
export const BRIDGES: readonly (readonly [ItemEffect, ItemEffect])[] = RING.map((e, i) => [e, RING[(i + 1) % RING.length]!] as const)
const DISH_IDS = new Set([
  ...ITEM_IDENTITIES.filter((f) => f.side === 'farming').flatMap((f) => Array.from({ length: MOONS }, (_, i) => `dish-${f.id}-${i + 1}`)),
  ...BRIDGES.flatMap(([a, b]) => BRIDGE_GRADES.map((g) => `duo-${a}-${b}-${g}`)),
  ...FEAST_GRADES.map((g) => `feast-${g}`),
])
export const isDishId = (id: string): boolean => DISH_IDS.has(id)
/** `moon:<effect>:<1–10>`, `bridge:<a>-<b>:<1–2>`, `sun:<1–4>`: 100 in all. */
export const STAR_NODES: readonly string[] = [
  ...RING.flatMap((e) => Array.from({ length: MOONS }, (_, i) => `moon:${e}:${i + 1}`)),
  ...BRIDGES.flatMap(([a, b]) => [1, 2].map((n) => `bridge:${a}-${b}:${n}`)),
  ...[1, 2, 3, 4].map((n) => `sun:${n}`),
]
const NODE_SET = new Set(STAR_NODES)
export const isStarNode = (id: string): boolean => NODE_SET.has(id)
