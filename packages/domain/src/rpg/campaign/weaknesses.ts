// Weaknesses v2 (D235; docs/design/tier-rework/weaknesses-v2.md WK1–WK4, WK8): every foe of a stage her own list, dealt
// in slot order. Tier 1: a regular-rank foe (Keys and guards too) is weak to 2 Arms and 2 elements, a sub-boss or a boss
// to 3 (2 Arms + 1 element, or 1 + 2, by seed); from Tier 2 every rank to 3, a regular's split by her role. Her elements
// lead with the ring's answer; the rest, and her Arms, come from two decks shuffled by the stage's seed, never twice in a
// foe and never the previous foe's set again, so neighbours differ and a wave sees every Arm before one repeats. Engine
// v18's generation (`rpgRework('weak', engine)`): the regions (`world/world.ts`), the scenario chapters and through them
// the capitals' Finals (`chapters.ts`) read it. The Rift keeps its fronts' draws (WK9).
import type { BattleWeaknesses, EnemyRank } from '../battle/types'
import { RPG_ELEMENTS, RPG_WEAPON_KINDS, rpgElementWeakness, type RpgElement } from '../kinds'
import type { RpgFoeRole } from './enemies'

/** FNV-1a, as the generators hash their seeds. */
function hash(text: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i += 1) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) }
  return h >>> 0
}
/** A list in the seed's order, each card by its own hash. */
const shuffled = <T extends string>(list: readonly T[], key: string): T[] => [...list].sort((a, b) => hash(`${key}:${a}`) - hash(`${key}:${b}`))
const same = (a: readonly string[], b: readonly string[]): boolean => a.length === b.length && a.every((x) => b.includes(x))

/** A deck dealt across a stage: the first card that fits, reshuffled when it runs out or holds none that does. */
function deck<T extends string>(cards: readonly T[], key: string): (fits: (card: T) => boolean) => T | undefined {
  let pile: T[] = []
  let shuffles = 0
  return (fits) => {
    for (let fresh = pile.length === 0; ; fresh = true) {
      if (fresh) pile = shuffled(cards, `${key}:${shuffles++}`)
      const at = pile.findIndex(fits)
      if (at >= 0) return pile.splice(at, 1)[0]!
      if (fresh) return undefined
    }
  }
}

/** The ring's three elements: a Light + Dark foe answers to none of her own pair, so hers are dealt from these (WK2). */
const RING: readonly RpgElement[] = ['fire', 'ice', 'lightning']

/** What the dealer reads of a foe. */
export interface WeakFoe { rank: EnemyRank; element: RpgElement; element2?: RpgElement; role?: RpgFoeRole }

/** How many Arms and elements a foe is weak to (WK1, WK8). `flip` is her seeded split, for the ranks that take one. */
export function rpgWeakCounts(foe: Pick<WeakFoe, 'rank' | 'role'>, tier: number, flip: boolean): { arms: number; elements: number } {
  if (foe.rank === 'regular' && tier <= 1) return { arms: 2, elements: 2 }
  // From Tier 2 a regular leans to the channel her weaker defense guards: strikers and guards (M.DEF lower) two
  // elements, casters and skirmishers two Arms.
  if (foe.rank === 'regular' && foe.role !== undefined && foe.role !== 'captain' && foe.role !== 'champion') {
    return foe.role === 'striker' || foe.role === 'guard' ? { arms: 1, elements: 2 } : { arms: 2, elements: 1 }
  }
  return flip ? { arms: 1, elements: 2 } : { arms: 2, elements: 1 }
}

/** A stage's dealer: call `next` once a foe, in slot order across her waves. */
export interface StageWeaknesses { next(foe: WeakFoe): BattleWeaknesses }

export function rpgStageWeaknesses(stageId: string, tier = 1): StageWeaknesses {
  const arm = deck(RPG_WEAPON_KINDS, `${stageId}:deck`)
  const element = deck(RPG_ELEMENTS, `${stageId}:edeck`)
  let slot = 0
  let prev: BattleWeaknesses | null = null
  return {
    next(foe) {
      const counts = rpgWeakCounts(foe, tier, hash(`${stageId}:${slot}:split`) % 2 === 1)
      slot += 1
      // A last card never makes the previous foe's set again when another one fits.
      const fresh = (have: readonly string[], card: string, n: number, last: readonly string[] | undefined) =>
        !(have.length === n - 1 && last !== undefined && same([...have, card], last))
      const weapons: (typeof RPG_WEAPON_KINDS)[number][] = []
      while (weapons.length < counts.arms) {
        const free = (x: (typeof RPG_WEAPON_KINDS)[number]) => !weapons.includes(x)
        weapons.push((arm((x) => free(x) && fresh(weapons, x, counts.arms, prev?.weapons)) ?? arm(free))!)
      }
      const own = [foe.element, ...(foe.element2 !== undefined && foe.element2 !== foe.element ? [foe.element2] : [])]
      const twilight = own.includes('light') && own.includes('dark')
      const elements: RpgElement[] = []
      // The ring's answers lead: her lead element's, then her second's; never one of her own.
      for (const answer of own.map(rpgElementWeakness)) {
        if (elements.length < counts.elements && !own.includes(answer) && !elements.includes(answer)) elements.push(answer)
      }
      const allowed = (x: RpgElement) => !own.includes(x) && !elements.includes(x) && (!twilight || RING.includes(x))
      while (elements.length < counts.elements) {
        const x = element((y) => allowed(y) && fresh(elements, y, counts.elements, prev?.elements)) ?? element(allowed)
        if (x === undefined) break
        elements.push(x)
      }
      prev = { weapons, elements }
      return prev
    },
  }
}
