// Extra Stats v3's map (H76; extra-stats-progression §3, §6, EP1–EP8, EP14, EP23; uma-templates UT10): ids, grades, gates,
// jewels and every value in Tiers 1–3.
import { describe, expect, it } from 'vitest'
import { applyPoints } from './bonus'
import type { RpgCoreStats } from '../rpg/rules'
import { umaCalling } from '../roster/template'
import type { GearTier } from './grades'
import {
  CORE_NODES, isMapNode, MAP_NODES, mapNodeGate, mapNodeGrade, mapPoints, moonTemplate, nodeBody, nodeJewel, nodeNumeral, nodePoints,
  prowessSplit, type MoonTemplate,
} from './planet'
import { RPG_CLASSES, rpgIsTier0, type RpgClass, type RpgTier1Class } from '../rpg/kinds'
import { templateOutfit, TEMPLATE_CASES } from '../save/economy-v3.fixture'

const TIERS: readonly GearTier[] = [1, 2, 3]
/** A bare sheet to apply points to. */
const BASE: RpgCoreStats = { speed: 100, stamina: 100, power: 100, guts: 100, wit: 100, atk: 100, matk: 100, initiative: 100, pdef: 100,
  mdef: 100, dexterity: 0, hp: 1000, mp: 100 }
const body = (b: string) => [1, 2, 3, 4, 5].map((n) => `${b}:${n}`)
const total = (ids: readonly string[], tier: GearTier) => ids.reduce((n, id) => n + nodePoints(id, tier), 0)

describe('the map’s ids (EP1, EP §15)', () => {
  it('lists the 22 ids in map order: the Planet, Prowess, Vigor, Guard, her moon', () => {
    expect(MAP_NODES).toEqual([...body('planet'), ...body('prowess'), ...body('vigor'), ...body('guard'), 'template:1', 'template:2'])
    expect(CORE_NODES).toEqual(MAP_NODES.slice(0, 20))
    expect(MAP_NODES.every(isMapNode)).toBe(true)
    expect(['moon:hp:1', 'sun:1', 'planet:6', 'template:3', 'weapon-moon-1:1', 'strength:1'].some(isMapNode)).toBe(false)
    expect([nodeBody('prowess:3'), nodeNumeral('prowess:3'), nodeBody('template:2'), nodeNumeral('template:2')]).toEqual(['prowess', 3, 'template', 2])
  })

  it('grades, gates and jewels: the Planet on odd grades, the moons on even, her moon on II and IV', () => {
    const row = (id: string) => [mapNodeGrade(id), mapNodeGate(id), nodeJewel(id)]
    expect(body('planet').map(row)).toEqual([[1, 1, 'jewel-planet-1'], [3, 11, 'jewel-planet-2'], [5, 21, 'jewel-planet-3'],
      [7, 31, 'jewel-planet-4'], [9, 41, 'jewel-planet-5']])
    for (const moon of ['prowess', 'vigor', 'guard']) {
      expect(body(moon).map(row)).toEqual([[2, 6, 'jewel-moon-1'], [4, 16, 'jewel-moon-2'], [6, 26, 'jewel-moon-3'], [8, 36, 'jewel-moon-4'],
        [10, 46, 'jewel-moon-5']])
    }
    expect(['template:1', 'template:2'].map(row)).toEqual([[4, 16, 'jewel-moon-2'], [8, 36, 'jewel-moon-4']])
  })
})

describe('the values by tier (EP2, EP3, EP7)', () => {
  it('the Planet: +1, +2, +4, +6, +8 in Tier 1, +38 and +55 after, rounded per node', () => {
    expect(TIERS.map((t) => body('planet').map((id) => nodePoints(id, t)))).toEqual([[1, 2, 4, 6, 8], [2, 4, 7, 11, 14], [3, 5, 10, 16, 21]])
    expect(TIERS.map((t) => total(body('planet'), t))).toEqual([21, 38, 55])
  })

  it('a moon: +2 … +10 in Tier 1, +54 and +78 after', () => {
    for (const moon of ['prowess', 'vigor', 'guard']) {
      expect(TIERS.map((t) => body(moon).map((id) => nodePoints(id, t)))).toEqual([[2, 4, 6, 8, 10], [4, 7, 11, 14, 18], [5, 10, 16, 21, 26]])
      expect(TIERS.map((t) => total(body(moon), t))).toEqual([30, 54, 78])
    }
  })

  it('the Planet gives every core stat, never Speed or Limit (EP8)', () => {
    expect(mapPoints(body('planet'), 'brawler', 1)).toEqual({ hp: 21, mp: 21, atk: 21, matk: 21, def: 21, mdef: 21, speed: 0, limit: 0 })
    expect(mapPoints(body('planet'), 'mage', 3)).toEqual({ hp: 55, mp: 55, atk: 55, matk: 55, def: 55, mdef: 55, speed: 0, limit: 0 })
  })

  it('Vigor gives HP and MP, Guard DEF and M.DEF (EP3, EP4)', () => {
    const vigor = mapPoints(body('vigor'), 'cleric', 1)
    expect(vigor).toMatchObject({ hp: 30, mp: 30, atk: 0, matk: 0, def: 0, mdef: 0 })
    expect(TIERS.map((t) => mapPoints(body('vigor'), 'brawler', t).hp * 5)).toEqual([150, 270, 390])
    expect(TIERS.map((t) => mapPoints(body('guard'), 'brawler', t))).toEqual(TIERS.map((t) => ({ hp: 0, mp: 0, atk: 0, matk: 0,
      def: [30, 54, 78][t - 1], mdef: [30, 54, 78][t - 1], speed: 0, limit: 0 })))
  })
})

describe('Prowess, split by her class (EP23, §3.3)', () => {
  const nodes = (classId: RpgClass, tier: GearTier) => body('prowess').map((id) => {
    const p = mapPoints([id], classId, tier)
    return `${p.atk}/${p.matk}`
  })
  const sums = (classId: RpgClass, tier: GearTier) => { const p = mapPoints(body('prowess'), classId, tier); return `${p.atk}/${p.matk}` }

  it('the node table for the Spell Blade, the Paladin and their mirrors', () => {
    expect(TIERS.map((t) => nodes('spellblade', t))).toEqual([
      ['1/1', '3/1', '4/2', '6/2', '7/3'], ['3/1', '5/2', '8/3', '10/4', '13/5'], ['4/1', '7/3', '11/5', '15/6', '18/8']])
    expect(TIERS.map((t) => nodes('paladin', t))).toEqual([
      ['2/0', '3/1', '5/1', '6/2', '8/2'], ['3/1', '6/1', '9/2', '11/3', '14/4'], ['4/1', '8/2', '13/3', '17/4', '21/5']])
    const mirror = (s: string) => s.split('/').reverse().join('/')
    for (const t of TIERS) {
      expect(nodes('summoner', t)).toEqual(nodes('spellblade', t).map(mirror))
      expect(nodes('cleric', t)).toEqual(nodes('paladin', t).map(mirror))
    }
  })

  it('the Brawler all ATK, the Mage all M.ATK', () => {
    expect(TIERS.map((t) => nodes('brawler', t))).toEqual([['2/0', '4/0', '6/0', '8/0', '10/0'], ['4/0', '7/0', '11/0', '14/0', '18/0'],
      ['5/0', '10/0', '16/0', '21/0', '26/0']])
    expect(TIERS.map((t) => nodes('mage', t))).toEqual([['0/2', '0/4', '0/6', '0/8', '0/10'], ['0/4', '0/7', '0/11', '0/14', '0/18'],
      ['0/5', '0/10', '0/16', '0/21', '0/26']])
  })

  it('every class’s sums in Tiers 1–3, each node keeping its total', () => {
    // The Tier 1 classes by their table, the new hybrids their pair's mirror (CV18); a Tier 0's by her slots: planet-v19.test.ts.
    const expected: Record<RpgTier1Class, string[]> = {
      brawler: ['30/0', '54/0', '78/0'], mage: ['0/30', '0/54', '0/78'], spellblade: ['21/9', '39/15', '55/23'],
      summoner: ['9/21', '15/39', '23/55'], paladin: ['24/6', '43/11', '63/15'], cleric: ['6/24', '11/43', '15/63'],
      armsummoner: ['21/9', '39/15', '55/23'], tomeblade: ['9/21', '15/39', '23/55'],
    }
    const tier1 = RPG_CLASSES.filter((c): c is RpgTier1Class => !rpgIsTier0(c))
    expect(tier1).toHaveLength(8)
    for (const classId of tier1) expect(TIERS.map((t) => sums(classId, t)), classId).toEqual(expected[classId])
    for (const classId of RPG_CLASSES) for (const points of [2, 4, 5, 7, 10, 11, 14, 16, 18, 21, 26]) {
      const split = prowessSplit(points, classId)
      expect(split.atk + split.matk).toBe(points)
    }
  })
})

describe('her moon (EP14, UT10)', () => {
  const moon = (template: MoonTemplate, tier: GearTier, ids = ['template:1', 'template:2']) => mapPoints(ids, 'brawler', tier, template)

  it('node I by her knack: Tireless HP, Clever MP, Mighty both defenses × tier; Fleet and Gritty every tier the same', () => {
    const one = (knack: MoonTemplate['knack'], t: GearTier) => moon({ knack, channel: 'physical' }, t, ['template:1'])
    expect(TIERS.map((t) => one('tireless', t).hp * 5)).toEqual([20, 35, 50])
    expect(TIERS.map((t) => one('clever', t).mp)).toEqual([4, 7, 10])
    expect(TIERS.map((t) => [one('mighty', t).def, one('mighty', t).mdef])).toEqual([[4, 4], [7, 7], [10, 10]])
    for (const t of TIERS) {
      expect(applyPoints(BASE, one('fleet', t)).evasion).toBe(24)
      expect(one('fleet', t)).toMatchObject({ speed: 4, hp: 0, def: 0 })
      expect(one('gritty', t)).toMatchObject({ limit: 4, hp: 0, def: 0 })
      // 4 Limit points are 1.6 of the gauge's 12; the engine's gauge is whole, so `applyPoints` starts her at 1, as today.
      expect(applyPoints(BASE, one('gritty', t)).limitStart).toBe(1)
    }
  })

  it('node II on her calling channel’s defense: DEF if physical, M.DEF if magical, +8 · +14 · +21', () => {
    const two = (channel: MoonTemplate['channel'], t: GearTier) => moon({ knack: 'tireless', channel }, t, ['template:2'])
    expect(TIERS.map((t) => [two('physical', t).def, two('physical', t).mdef])).toEqual([[8, 0], [14, 0], [21, 0]])
    expect(TIERS.map((t) => [two('magical', t).def, two('magical', t).mdef])).toEqual([[0, 8], [0, 14], [0, 21]])
  })

  it('every knack and channel from an invented outfit’s template, in every class (v18’s calling)', () => {
    // The fixture's channels are v18's callings (a Front runner's Brawler, an End closer's Summoner); from v19 her Tier 0's
    // root names node II (template-v19.test.ts).
    for (const { knack, channel, calling } of TEMPLATE_CASES) {
      const outfit = templateOutfit('1', knack, channel)
      expect(moonTemplate(outfit, null, 18)).toEqual({ knack, channel })
      for (const t of TIERS) for (const classId of RPG_CLASSES) {
        const both = mapPoints(['template:1', 'template:2'], classId, t, moonTemplate(outfit, null, 18))
        expect(both[channel === 'physical' ? 'def' : 'mdef']).toBeGreaterThanOrEqual([8, 14, 21][t - 1]!)
        expect(both.atk + both.matk).toBe(0)
      }
      expect(umaCalling(outfit, null, 18)).toBe(calling)
    }
  })

  it('counts nothing without a template (the balance party’s average Uma, XR12)', () => {
    expect(mapPoints(['template:1', 'template:2'], 'brawler', 1)).toEqual(mapPoints([], 'brawler', 1))
  })
})

describe('a full Tier 1 map (§3.3, §8.1)', () => {
  it('a Spell Blade: HP +255, MP +51, ATK +42, M.ATK +30, DEF +51, M.DEF +51 after applyPoints', () => {
    const boosted = applyPoints(BASE, mapPoints(CORE_NODES, 'spellblade', 1))
    expect(boosted.stats).toMatchObject({ hp: 1255, mp: 151, atk: 142, matk: 130, pdef: 151, mdef: 151 })
    expect([boosted.evasion, boosted.limitStart]).toEqual([0, 0])
  })

  it('every class at Lv 50 in Tiers 1–3 (§8.1’s grants)', () => {
    // Every Tier 1 class; a Tier 0's Prowess by her slots: planet-v19.test.ts.
    const offense: Record<RpgTier1Class, number[][]> = {
      brawler: [[51, 21], [92, 38], [133, 55]], mage: [[21, 51], [38, 92], [55, 133]], spellblade: [[42, 30], [77, 53], [110, 78]],
      summoner: [[30, 42], [53, 77], [78, 110]], paladin: [[45, 27], [81, 49], [118, 70]], cleric: [[27, 45], [49, 81], [70, 118]],
      armsummoner: [[42, 30], [77, 53], [110, 78]], tomeblade: [[30, 42], [53, 77], [78, 110]],
    }
    for (const classId of RPG_CLASSES.filter((c): c is RpgTier1Class => !rpgIsTier0(c))) for (const t of TIERS) {
      const p = mapPoints(CORE_NODES, classId, t)
      const stat = [51, 92, 133][t - 1]
      expect([p.hp * 5, p.mp, p.atk, p.matk, p.def, p.mdef]).toEqual([[255, 460, 665][t - 1], stat, ...offense[classId][t - 1]!, stat, stat])
    }
  })
})
