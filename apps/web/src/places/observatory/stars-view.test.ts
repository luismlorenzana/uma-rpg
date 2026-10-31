// The Stars tab's rules (H122): Set all's plan by UP22 and D264, before → after from the battle sheet, a node's sheet, and the
// Observatory's order. Made-up outfits only.
import { newOwnedUma, type BattleOutfit, type OwnedUma, type StarMap, type TemplateOutfit } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { mapNodeTitle, nodeBeforeAfter, nodeReady, nodeSheet, observatoryOrder, setAllLines, setAllPlan } from './stars-view'

const NOW = '2026-10-31T12:00:00.000Z'
const map = (...open: string[]): StarMap => ({ open, moons: [] })
const outfit: BattleOutfit & TemplateOutfit = {
  outfitId: '81001', baseStats: { speed: 100, stamina: 100, power: 110, guts: 100, wit: 90 },
  growthRatePercents: { speed: 20, stamina: 0, power: 0, guts: 0, wit: 0 },
  aptitudes: { strategy: { front: 'A', pace: 'B', late: 'B', end: 'B' }, distance: { sprint: 'B', mile: 'B', medium: 'A', long: 'B' } },
}
const WEAPONS = ['greatsword', 'axe', 'lance'] as const
const uma = (open: string[], level = 40): OwnedUma => ({ ...newOwnedUma(NOW, 'brawler'), level, classId: 'brawler', stars: map(...open),
  ranks: { classes: { brawler: { rank: 34, exp: 0 } } } })

describe('Set all (H122, UP22, D264)', () => {
  it('gives a Moon Jewel to the moon with the fewest open nodes, Prowess, Vigor, Guard on a tie', () => {
    expect(setAllPlan(map('prowess:1', 'vigor:1', 'guard:1'), { 'jewel-moon-2': 1 }, 20)).toEqual([{ jewel: 'jewel-moon-2', node: 'prowess:2' }])
    expect(setAllPlan(map('prowess:1', 'prowess:2', 'vigor:1', 'guard:1'), { 'jewel-moon-2': 1 }, 20)).toEqual([{ jewel: 'jewel-moon-2', node: 'vigor:2' }])
    expect(setAllPlan(map('prowess:1', 'prowess:2', 'vigor:1', 'vigor:2', 'guard:1'), { 'jewel-moon-2': 1 }, 20)).toEqual([{ jewel: 'jewel-moon-2', node: 'guard:2' }])
  })

  it('spreads several jewels across the moons, and never gives one to her moon, which opens with them', () => {
    const steps = setAllPlan(map('prowess:1', 'vigor:1', 'guard:1'), { 'jewel-moon-2': 4 }, 20)
    expect(steps.map((s) => s.node)).toEqual(['prowess:2', 'vigor:2', 'guard:2'])
    expect(steps.every((s) => !s.node.startsWith('template:'))).toBe(true)
  })

  it('opens a Planet node with three jewels, in order, and none with fewer or out of order', () => {
    expect(setAllPlan(map('planet:1', 'planet:2'), { 'jewel-planet-3': 7 }, 30)).toEqual([{ jewel: 'jewel-planet-3', node: 'planet:3' }])
    expect(setAllPlan(map('planet:1', 'planet:2'), { 'jewel-planet-3': 2 }, 30)).toEqual([])
    expect(setAllPlan(map(), { 'jewel-planet-3': 3 }, 30)).toEqual([])
  })

  it('climbs in order: Planet Jewels first, a jewel of a later rank once its node before opens, level gates held', () => {
    const steps = setAllPlan(map(), { 'jewel-planet-1': 3, 'jewel-planet-2': 3, 'jewel-moon-1': 1, 'jewel-moon-2': 1 }, 20)
    expect(steps.map((s) => s.node)).toEqual(['planet:1', 'planet:2', 'prowess:1', 'prowess:2'])
    expect(setAllPlan(map('planet:1', 'planet:2', 'planet:3', 'planet:4'), { 'jewel-planet-5': 3 }, 40)).toEqual([])
    expect(setAllPlan(map('planet:1', 'planet:2', 'planet:3', 'planet:4'), { 'jewel-planet-5': 3 }, 41)).toHaveLength(1)
  })

  it('writes one line a step', () => {
    const her = uma(['prowess:1', 'vigor:1', 'guard:1', 'guard:2', 'prowess:2', 'vigor:2'])
    const steps = setAllPlan(her.stars as StarMap, { 'jewel-moon-3': 1, 'jewel-planet-1': 3 }, 40)
    expect(setAllLines(steps, outfit, her, 'brawler', WEAPONS, 1)).toEqual(['Planet Jewel I ×3 → Planet I · +1 · all six', 'Moon Jewel III → Prowess III · ATK +6'])
  })
})

describe('before → after (H122)', () => {
  const change = (node: string, open: string[] = []) => nodeBeforeAfter(outfit, uma(open), node, 'brawler', 1)
  const pair = (line: string) => line.match(/^(.+) (\d+) → (\d+)$/)!.slice(1)

  it('moves DEF and M.DEF by a Guard node\'s points', () => {
    const lines = change('guard:1')
    expect(lines.map((l) => pair(l)[0])).toEqual(['DEF', 'M.DEF'])
    for (const line of lines) { const [, a, b] = pair(line); expect(Number(b) - Number(a)).toBe(2) }
  })

  it('moves only ATK for Prowess as a Brawler, and all six for the Planet', () => {
    expect(change('prowess:1').map((l) => pair(l)[0])).toEqual(['ATK'])
    expect(change('planet:1').map((l) => l.split(' ')[0])).toEqual(['ATK', 'M.ATK', 'DEF', 'M.DEF', 'HP', 'MP'])
  })

  it('counts the moon node it brings, and nothing for an open node', () => {
    const lines = change('guard:2', ['prowess:1', 'prowess:2', 'vigor:1', 'vigor:2', 'guard:1'])
    expect(lines.length).toBeGreaterThan(2)
    expect(change('guard:1', ['guard:1'])).toEqual([])
  })
})

describe('a node\'s sheet (H122)', () => {
  const view = (node: string, open: string[], stock: Record<string, number> = {}, level = 40) => nodeSheet(outfit, uma(open, level), node, 'brawler', WEAPONS, 1, stock)

  it('reads its value, jewel with what\'s held, and Set', () => {
    const sheet = view('guard:3', ['guard:1', 'guard:2'], { 'jewel-moon-3': 4 })
    expect(sheet).toMatchObject({ title: 'Guard III', value: 'DEF/M.DEF +6', jewel: 'Moon Jewel III ×1 · 4 held', open: false, footer: { label: 'Set', ready: true } })
    expect(view('prowess:3', ['prowess:1', 'prowess:2'], { 'jewel-moon-3': 1 }).value).toBe('ATK +6')
  })

  it('names three jewels on a Planet node and what\'s short', () => {
    expect(view('planet:1', [], { 'jewel-planet-1': 1 })).toMatchObject({ jewel: 'Planet Jewel I ×3 · 1 held', footer: { label: 'Planet Jewel I ×1', ready: false } })
  })

  it('closes by the node before it first, then her level', () => {
    expect(view('guard:3', ['guard:1'], { 'jewel-moon-3': 1 }).footer).toEqual({ label: 'Guard II first', ready: false })
    expect(view('planet:5', ['planet:1', 'planet:2', 'planet:3', 'planet:4'], { 'jewel-planet-5': 3 }).footer).toEqual({ label: 'Lv 41', ready: false })
  })

  it('reads Open with no button on an open node, and her moon takes no jewel', () => {
    expect(view('guard:1', ['guard:1'])).toMatchObject({ open: true, footer: null, jewel: null, changes: [] })
    expect(view('template:1', [])).toMatchObject({ jewel: null, footer: { label: 'With its moons', ready: false } })
    expect(nodeReady(map(), 'template:1', 50, { 'jewel-moon-2': 5 })).toBe(false)
    expect(mapNodeTitle('template:2', 'bruiser')).toBe('★ Bruiser\'s moon II')
  })
})

describe('the Observatory\'s order (H122)', () => {
  it('puts the most ready first, then the roster\'s order', () => {
    const rows = [{ id: 'a', n: 1 }, { id: 'b', n: 2 }, { id: 'c', n: 3 }]
    expect(observatoryOrder(rows, (id) => (id === 'c' ? 2 : 0), (x, y) => y.n - x.n).map((r) => r.id)).toEqual(['c', 'b', 'a'])
  })
})
