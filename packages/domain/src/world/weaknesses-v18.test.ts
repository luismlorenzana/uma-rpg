// Weaknesses v2 on engine v18 (H115, D235; weaknesses-v2.md WK1–WK4, WK8, WK10, WK11): the stage dealer's rule, the
// generators reading it from v18, and v17's generation byte for byte whatever the switch says (digests taken on the
// generators before H115).
import { describe, expect, it } from 'vitest'
import type { BattleEnemy, BattleWeaknesses } from '../rpg/battle/types'
import { rpgCampaignChapter, type RpgCampaignChapter } from '../rpg/campaign/chapters'
import { rpgStageWeaknesses, rpgWeakCounts, type WeakFoe } from '../rpg/campaign/weaknesses'
import { RPG_ELEMENTS, RPG_WEAPON_KINDS, rpgElementWeakness, type RpgElement } from '../rpg/kinds'
import { RPG_V2_CLASSES, rpgHand } from '../rpg/rules'
import { capitalChapter } from './capital'
import { regionChapter, worldContinent } from './world'

const V17 = 17, V18 = 18
const cast = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))
const continents = (orders: readonly number[]) => orders.map((order) => worldContinent({ name: 'T', order }))
const TIER1 = continents([1, 2, 3, 4, 5])
const chapters = (list: ReturnType<typeof continents>, engine: number): RpgCampaignChapter[] =>
  list.flatMap((c) => [...c.regions.map((r) => regionChapter(r, cast, engine)), capitalChapter(c, cast, engine)])
const scenario = (engine: number): RpgCampaignChapter[] =>
  Array.from({ length: 15 }, (_, i) => rpgCampaignChapter({ scenarioId: 1000 + i, name: `C${i}`, order: i + 1 }, cast, engine))
const wavesOf = (chapter: RpgCampaignChapter): BattleEnemy[][][] =>
  chapter.nodes.filter((n) => n.kind !== 'camp').map((n) => [n.enemies, ...(n.waves ?? [])])
const own = (e: Pick<BattleEnemy, 'element' | 'element2'>): RpgElement[] => [e.element, ...(e.element2 ? [e.element2] : [])]
const same = (a: readonly string[], b: readonly string[]) => a.length === b.length && a.every((x) => b.includes(x))
const whole = (w: BattleWeaknesses): string[] => [...w.weapons, ...w.elements]

function fnv1a(text: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i += 1) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) }
  return (h >>> 0).toString(16).padStart(8, '0')
}

describe('the stage dealer (WK1–WK4)', () => {
  it('counts by rank and tier: Tier 1 regulars 2 + 2, every other foe 3, a regular from Tier 2 by her role', () => {
    expect(rpgWeakCounts({ rank: 'regular' }, 1, false)).toEqual({ arms: 2, elements: 2 })
    expect(rpgWeakCounts({ rank: 'regular', role: 'guard' }, 1, true)).toEqual({ arms: 2, elements: 2 })
    for (const rank of ['sub-boss', 'boss'] as const) {
      expect(rpgWeakCounts({ rank }, 1, false)).toEqual({ arms: 2, elements: 1 })
      expect(rpgWeakCounts({ rank }, 3, true)).toEqual({ arms: 1, elements: 2 })
    }
    expect(rpgWeakCounts({ rank: 'regular', role: 'striker' }, 2, false)).toEqual({ arms: 1, elements: 2 })
    expect(rpgWeakCounts({ rank: 'regular', role: 'guard' }, 2, false)).toEqual({ arms: 1, elements: 2 })
    expect(rpgWeakCounts({ rank: 'regular', role: 'caster' }, 2, true)).toEqual({ arms: 2, elements: 1 })
    expect(rpgWeakCounts({ rank: 'regular', role: 'skirmisher' }, 3, true)).toEqual({ arms: 2, elements: 1 })
    expect(rpgWeakCounts({ rank: 'regular' }, 2, true)).toEqual({ arms: 1, elements: 2 })
  })

  it('leads with the ring, never names her own element, and deals Light + Dark from the ring', () => {
    for (const a of RPG_ELEMENTS) for (const b of RPG_ELEMENTS) for (const rank of ['regular', 'sub-boss', 'boss'] as const) {
      const foe: WeakFoe = { rank, element: a, ...(a === b ? {} : { element2: b }) }
      for (let s = 0; s < 6; s++) {
        const w = rpgStageWeaknesses(`t-${a}-${b}-${rank}-${s}`).next(foe)
        const mine = own({ element: a, ...(a === b ? {} : { element2: b }) })
        expect(w.weapons.length + w.elements.length, JSON.stringify(foe)).toBe(rank === 'regular' ? 4 : 3)
        expect(w.weapons.length).toBeGreaterThan(0)
        expect(w.elements.length).toBeGreaterThan(0)
        for (const e of mine) expect(w.elements).not.toContain(e)
        expect(new Set(w.weapons).size).toBe(w.weapons.length)
        expect(new Set(w.elements).size).toBe(w.elements.length)
        const answer = mine.map(rpgElementWeakness).find((x) => !mine.includes(x))
        if (answer) expect(w.elements[0]).toBe(answer)
        if (mine.includes('light') && mine.includes('dark')) for (const e of w.elements) expect(['fire', 'ice', 'lightning']).toContain(e)
      }
    }
  })

  it('deals five different Arms before one repeats, never the previous foe’s set, the same every time', () => {
    for (let s = 0; s < 40; s++) {
      const id = `w1-1-1-s${s}`
      const deal = () => { const d = rpgStageWeaknesses(id); return Array.from({ length: 6 }, (_, i) => d.next({ rank: 'regular', element: RPG_ELEMENTS[i % 3]! })) }
      const lists = deal()
      expect(deal()).toEqual(lists)
      const arms = lists.flatMap((w) => w.weapons)
      expect(new Set(arms.slice(0, 5)).size).toBe(5)
      for (let i = 1; i < lists.length; i++) {
        expect(same(lists[i]!.weapons, lists[i - 1]!.weapons), id).toBe(false)
        expect(same(whole(lists[i]!), whole(lists[i - 1]!)), id).toBe(false)
      }
    }
    expect(RPG_WEAPON_KINDS).toHaveLength(5)
  })
})

describe('the generators from v18 (WK10)', () => {
  const all = [...chapters(TIER1, V18), ...scenario(V18)]

  it('give every foe of every region, capital and scenario chapter the dealer’s list, in slot order', () => {
    for (const c of chapters(TIER1, V18)) {
      for (const [n, waves] of wavesOf(c).entries()) {
        const node = c.nodes.filter((x) => x.kind !== 'camp')[n]!
        const capital = c.id.endsWith('-capital')
        if (capital) continue // a capital reuses its scenario chapter's nodes, checked below
        const dealer = rpgStageWeaknesses(node.id, c.tier)
        for (const e of waves.flat()) {
          // A foe doesn't keep her role; Tier 1's counts don't read it.
          expect(e.weaknesses, `${node.id} ${e.id}`).toEqual(dealer.next({ rank: e.rank, element: e.element, ...(e.element2 ? { element2: e.element2 } : {}) }))
        }
      }
    }
  })

  it('keep both channels on every foe and change nothing but the lists', () => {
    for (const c of all) for (const waves of wavesOf(c)) for (const e of waves.flat()) {
      expect(e.weaknesses.weapons.length, e.id).toBeGreaterThan(0)
      expect(e.weaknesses.elements.length, e.id).toBeGreaterThan(0)
      expect(e.weaknesses.weapons.length + e.weaknesses.elements.length, `${c.id} ${e.id}`).toBe(e.rank === 'regular' && c.tier === 1 ? 4 : 3)
      for (const x of own(e)) expect(e.weaknesses.elements).not.toContain(x)
    }
    const strip = (list: RpgCampaignChapter[]) => JSON.stringify(list.map((c) => c.nodes.map((n) => ({ ...n,
      enemies: n.enemies.map(({ weaknesses: _w, ...e }) => e), ...(n.waves ? { waves: n.waves.map((w) => w.map(({ weaknesses: _w, ...e }) => e)) } : {}) }))))
    expect(strip(chapters(TIER1, V18))).toBe(strip(chapters(TIER1, V17)))
    expect(strip(scenario(V18))).toBe(strip(scenario(V17)))
  })

  it('never give neighbours in a wave the same Arms or the same list', () => {
    for (const c of all) for (const waves of wavesOf(c)) for (const wave of waves) for (let i = 1; i < wave.length; i++) {
      const a = wave[i - 1]!.weaknesses, b = wave[i]!.weaknesses
      expect(same(whole(a), whole(b)), `${c.id} ${wave[i]!.id}`).toBe(false)
      if (a.weapons.length === b.weapons.length) expect(same(a.weapons, b.weapons), `${c.id} ${wave[i]!.id}`).toBe(false)
    }
  })

  it('give every Tier 2 and 3 foe three kinds, a region leaning by its roles', () => {
    for (const c of chapters(continents([6, 11]), V18)) for (const waves of wavesOf(c)) for (const e of waves.flat()) {
      expect(e.weaknesses.weapons.length + e.weaknesses.elements.length, e.id).toBe(3)
    }
    // Glacier's regular stages are all guards and Storm Peaks' all skirmishers (biomes.ts): they lean as their roles do.
    const lean = (biome: string) => [6, 7, 8, 9, 10].flatMap((order) => worldContinent({ name: 'T', order }).regions.filter((r) => r.biome === biome))
      .flatMap((r) => regionChapter(r, cast, V18).nodes.filter((n) => n.kind === 'fight')).flatMap((n) => [n.enemies, ...(n.waves ?? [])].flat())
    expect(lean('glacier').length).toBeGreaterThan(0)
    for (const e of lean('glacier')) expect(e.weaknesses.elements.length, e.id).toBe(2)
    expect(lean('peaks').length).toBeGreaterThan(0)
    for (const e of lean('peaks')) expect(e.weaknesses.weapons.length, e.id).toBe(2)
  })
})

describe('v17’s generation, byte for byte (H115)', () => {
  it('keeps Tier 1’s regions and capitals, every tier and the scenario chapters at their digests before H115', () => {
    const t1 = TIER1.flatMap((c) => [...c.regions.map((r) => JSON.stringify(regionChapter(r, cast, V17).nodes)), JSON.stringify(capitalChapter(c, cast, V17).nodes)])
    expect(t1).toHaveLength(5 * 41)
    expect(fnv1a(t1.join('\n'))).toBe('e94279ca')
    const world = chapters(continents(Array.from({ length: 15 }, (_, i) => i + 1)), V17).map((c) => JSON.stringify(c.nodes))
    expect(fnv1a(world.join('\n'))).toBe('b83ee4ca')
    expect(fnv1a(scenario(V17).map((c) => JSON.stringify(c)).join('\n'))).toBe('06d6650f')
  })
})

describe('the mirror’s knob on v18 (H115)', () => {
  it('raises the Summoner’s Tome 0.58 → 0.62 and moves no other hand', () => {
    expect([rpgHand({ classId: 'summoner' }, V17).tome, rpgHand({ classId: 'summoner' }, V18).tome]).toEqual([0.58, 0.62])
    expect(rpgHand({ classId: 'summoner' }, V18)).toEqual({ ...rpgHand({ classId: 'summoner' }, V17), power: 0.62, tome: 0.62 })
    for (const c of RPG_V2_CLASSES.filter((x) => x !== 'summoner')) expect(rpgHand({ classId: c }, V18), c).toEqual(rpgHand({ classId: c }, V17))
  })
})
