// Extra Stats (S6, design §10, D58, D144): each Uma's Sun-and-planets map of 100 nodes, and the ids of the Star Gems that
// open them. Ids and the map's rules only, without recipes or names, so a save can be checked on boot (H16).
import { ITEM_EFFECTS, type ItemEffect } from '../items/kinds'

/** The planets in their ring: each bridge joins a planet to the next. */
export const RING: readonly ItemEffect[] = ['hp', 'def', 'mdef', 'mp', 'matk', 'atk', 'speed', 'limit']
export const MOONS = 10
export const BRIDGE_GRADES = [3, 7] as const
export const SUN_GRADES = [4, 6, 8, 10] as const
export const BRIDGES: readonly (readonly [ItemEffect, ItemEffect])[] = RING.map((e, i) => [e, RING[(i + 1) % RING.length]!] as const)

/** `moon:<effect>:<1–10>`, `bridge:<a>-<b>:<1–2>`, `sun:<1–4>`: 100 in all. */
export const STAR_NODES: readonly string[] = [
  ...RING.flatMap((e) => Array.from({ length: MOONS }, (_, i) => `moon:${e}:${i + 1}`)),
  ...BRIDGES.flatMap(([a, b]) => [1, 2].map((n) => `bridge:${a}-${b}:${n}`)),
  ...[1, 2, 3, 4].map((n) => `sun:${n}`),
]
const NODE_SET = new Set(STAR_NODES)
export const isStarNode = (id: string): boolean => NODE_SET.has(id)

/** The grade of the gem a node needs: a moon's own number, a bridge's 3 or 7, a Sun node's 4, 6, 8 or 10. */
export function nodeGrade(id: string): number {
  const [kind, key, n] = id.split(':')
  if (kind === 'moon') return Number(n)
  if (kind === 'bridge') return BRIDGE_GRADES[Number(n) - 1]!
  return SUN_GRADES[Number(key) - 1]!
}

/** Points per effect from a set of active nodes, worth their grade (D141): a moon of grade g gives g, a bridge g ÷ 2 to
 * each side, a Sun node g ÷ 8 to all eight. */
export function starPoints(active: readonly string[]): Record<ItemEffect, number> {
  const points = Object.fromEntries(ITEM_EFFECTS.map((e) => [e, 0])) as Record<ItemEffect, number>
  for (const id of active) {
    const [kind, key] = id.split(':')
    const g = nodeGrade(id)
    if (kind === 'moon') points[key as ItemEffect] += g
    else if (kind === 'bridge') for (const e of key!.split('-')) points[e as ItemEffect] += g / 2
    else if (kind === 'sun') for (const e of ITEM_EFFECTS) points[e] += g / 8
  }
  return points
}

// --- Star Gems' ids ----------------------------------------------------------------------------------------------------

export type GemKind = 'moon' | 'bridge' | 'sun'
/** A Star Gem without its recipe or name: `gem-<effect>-<g>` (a moon gem), `gem-<a>-<b>-<g>` (a bridge gem),
 * `gem-sun-<g>` (a Sun gem). `effects`: the one planet, the bridge's pair, or all eight. */
export interface GemIdentity { id: string; kind: GemKind; grade: number; effects: ItemEffect[] }

export const GEM_IDENTITIES: readonly GemIdentity[] = [
  ...ITEM_EFFECTS.flatMap((e) => Array.from({ length: MOONS }, (_, i): GemIdentity => ({ id: `gem-${e}-${i + 1}`, kind: 'moon', grade: i + 1, effects: [e] }))),
  ...BRIDGES.flatMap(([a, b]) => BRIDGE_GRADES.map((g): GemIdentity => ({ id: `gem-${a}-${b}-${g}`, kind: 'bridge', grade: g, effects: [a, b] }))),
  ...SUN_GRADES.map((g): GemIdentity => ({ id: `gem-sun-${g}`, kind: 'sun', grade: g, effects: [...ITEM_EFFECTS] })),
]
const GEM_BY_ID = new Map(GEM_IDENTITIES.map((g) => [g.id, g]))
export const gemIdentity = (id: string): GemIdentity | undefined => GEM_BY_ID.get(id)
export const isGemId = (id: string): boolean => GEM_BY_ID.has(id)

/** The gem that opens a node at exactly its grade: a moon gem its moon, a bridge gem its bridge, a Sun gem its Sun node. */
export function nodeGem(node: string): string {
  const [kind, key, n] = node.split(':')
  if (kind === 'moon') return `gem-${key}-${n}`
  if (kind === 'bridge') return `gem-${key}-${BRIDGE_GRADES[Number(n) - 1]}`
  return `gem-sun-${SUN_GRADES[Number(key) - 1]}`
}

/** The nodes a gem can open, lowest first: those of its track up to its grade. */
export function gemNodes(gem: GemIdentity): string[] {
  if (gem.kind === 'moon') return Array.from({ length: MOONS }, (_, i) => `moon:${gem.effects[0]}:${i + 1}`).filter((n) => nodeGrade(n) <= gem.grade)
  if (gem.kind === 'bridge') return [1, 2].map((n) => `bridge:${gem.effects[0]}-${gem.effects[1]}:${n}`).filter((n) => nodeGrade(n) <= gem.grade)
  return [1, 2, 3, 4].map((n) => `sun:${n}`).filter((n) => nodeGrade(n) <= gem.grade)
}
