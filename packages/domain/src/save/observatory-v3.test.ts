// Extra Stats v3's jewels on the save (H76; EP5, EP17, EP §3.5), on engine v17 (live since H82): a jewel from the Warehouse
// opens its node, in order, at Uma Lv 5g − 4; the Set list's nodes, the one furthest behind first.
import { describe, expect, it } from 'vitest'
import { BATTLE_ENGINE_VERSION } from '../rpg/battle/caps'
import { ECONOMY_V3_NOW as NOW, gradedUma, gradedWorld, starMap } from './economy-v3.fixture'
import { jewelBlock, jewelNodes, setActiveNodes, setGem, setJewel } from './observatory'
import { worldOf } from './rules'
import type { OwnedUma, Save, TierWorld } from './save'


const saveOf = (world: TierWorld): Save => ({ schemaVersion: 30, account: { trainerName: 'Tester', createdAt: NOW, updatedAt: NOW, achievements: {}, history: {},
  defeated: {} }, tierWorlds: { '1': world } })
const withUma = (uma: Partial<OwnedUma>, items: Record<string, number> = {}): Save =>
  saveOf(gradedWorld({ items, umas: { '101': gradedUma({ stars: starMap(), ...uma }) } }))
const umaOf = (save: Save) => worldOf(save).umas['101']!

describe('setJewel (EP5, EP17)', () => {
  it('runs with R2’s economy live', () => expect(BATTLE_ENGINE_VERSION).toBe(17))

  it('a Lv 1 Uma sets a Planet Jewel I on Planet I: the node opens and the count falls', () => {
    const save = setJewel(withUma({ level: 1 }, { 'jewel-planet-1': 2 }), '101', 'jewel-planet-1', 'planet:1', '2026-10-25T13:00:00.000Z')
    expect(umaOf(save).stars).toEqual({ open: ['planet:1'], moons: [] })
    expect(worldOf(save).items['jewel-planet-1']).toBe(1)
    expect(save.account.updatedAt).toBe('2026-10-25T13:00:00.000Z')
    const last = setJewel(withUma({ level: 1 }, { 'jewel-planet-1': 1 }), '101', 'jewel-planet-1', 'planet:1', NOW)
    expect('jewel-planet-1' in worldOf(last).items).toBe(false)
  })

  it('a jewel above her level waits: Planet Jewel II at Lv 10 opens at Lv 11', () => {
    const save = withUma({ level: 10, stars: starMap('planet:1') }, { 'jewel-planet-2': 1 })
    expect(() => setJewel(save, '101', 'jewel-planet-2', 'planet:2', NOW)).toThrow('Opens at Lv 11')
    expect(umaOf(setJewel(withUma({ level: 11, stars: starMap('planet:1') }, { 'jewel-planet-2': 1 }), '101', 'jewel-planet-2', 'planet:2', NOW)).stars)
      .toEqual(starMap('planet:1', 'planet:2'))
  })

  it('in order: a Moon Jewel II on Prowess II before Prowess I is "Set Moon Jewel I first"', () => {
    const save = withUma({ level: 16 }, { 'jewel-moon-2': 1 })
    expect(() => setJewel(save, '101', 'jewel-moon-2', 'prowess:2', NOW)).toThrow('Set Moon Jewel I first')
    expect(() => setJewel(withUma({ level: 21 }, { 'jewel-planet-3': 1 }), '101', 'jewel-planet-3', 'planet:3', NOW)).toThrow('Set Planet Jewel I first')
  })

  it('refuses a jewel that doesn’t fit the node', () => {
    const save = withUma({ level: 50, stars: starMap('vigor:1', 'planet:1') }, { 'jewel-moon-3': 1, 'jewel-planet-2': 1, 'jewel-moon-2': 1 })
    expect(() => setJewel(save, '101', 'jewel-moon-3', 'vigor:2', NOW)).toThrow('A Moon Jewel III opens a node III')
    expect(() => setJewel(save, '101', 'jewel-planet-2', 'vigor:2', NOW)).toThrow('A Planet Jewel II opens Planet II')
    expect(() => setJewel(save, '101', 'jewel-moon-2', 'planet:2', NOW)).toThrow('A Moon Jewel II opens a node II')
    expect(() => setJewel(save, '101', 'jewel-moon-2', 'template:2', NOW)).toThrow('A Moon Jewel II opens a node II')
    expect(() => setJewel(save, '101', 'weapon-gem-g2', 'vigor:2', NOW)).toThrow('Not a jewel')
    expect(() => setJewel(save, '101', 'jewel-moon-2', 'moon:hp:2', NOW)).toThrow('Unknown node')
  })

  it('refuses an open node and an empty Warehouse', () => {
    expect(() => setJewel(withUma({ level: 6, stars: starMap('guard:1') }, { 'jewel-moon-1': 1 }), '101', 'jewel-moon-1', 'guard:1', NOW)).toThrow('Already open')
    expect(() => setJewel(withUma({ level: 6 }), '101', 'jewel-moon-1', 'guard:1', NOW)).toThrow('None in the Warehouse')
    expect(() => setJewel(withUma({ level: 6 }, { 'jewel-moon-1': 0 }), '101', 'jewel-moon-1', 'guard:1', NOW)).toThrow('None in the Warehouse')
  })

  it('her moon: a Moon Jewel II opens template:1 at Lv 16, a Moon Jewel IV template:2 only after it', () => {
    const items = { 'jewel-moon-2': 1, 'jewel-moon-4': 2 }
    expect(() => setJewel(withUma({ level: 15 }, items), '101', 'jewel-moon-2', 'template:1', NOW)).toThrow('Opens at Lv 16')
    expect(() => setJewel(withUma({ level: 40 }, items), '101', 'jewel-moon-4', 'template:2', NOW)).toThrow('Set Moon Jewel II first')
    let save = setJewel(withUma({ level: 16 }, items), '101', 'jewel-moon-2', 'template:1', NOW)
    expect(umaOf(save).stars).toEqual(starMap('template:1'))
    save = saveOf({ ...worldOf(save), umas: { '101': { ...umaOf(save), level: 35 } } })
    expect(() => setJewel(save, '101', 'jewel-moon-4', 'template:2', NOW)).toThrow('Opens at Lv 36')
    save = saveOf({ ...worldOf(save), umas: { '101': { ...umaOf(save), level: 36 } } })
    save = setJewel(save, '101', 'jewel-moon-4', 'template:2', NOW)
    expect(umaOf(save).stars).toEqual(starMap('template:1', 'template:2'))
    expect(worldOf(save).items).toEqual({ 'jewel-moon-4': 1 })
  })

  it('a v1 map is "Not graded", and a v3 map refuses Star Gems and active slots', () => {
    const v1 = saveOf(gradedWorld({ items: { 'jewel-planet-1': 1 }, umas: { '101': gradedUma({ stars: { unlocked: [], active: [] } }) } }))
    expect(umaOf(v1).stars).toEqual({ unlocked: [], active: [] })
    expect(() => setJewel(v1, '101', 'jewel-planet-1', 'planet:1', NOW)).toThrow('Not graded')
    const v3 = withUma({ level: 10 }, {})
    const gems = saveOf({ ...worldOf(v3), gems: { 'gem-hp-1': 1 } })
    expect(() => setGem(gems, '101', 'gem-hp-1', NOW)).toThrow('Star Gems are retired')
    expect(() => setActiveNodes(v3, '101', [], NOW)).toThrow('Star Gems are retired')
    expect(() => setJewel(v3, '999', 'jewel-planet-1', 'planet:1', NOW)).toThrow('Not unlocked')
  })
})

describe('jewelNodes (EP §3.5)', () => {
  it('a Moon Jewel I at Lv 6 opens Prowess, Vigor and Guard in map order', () => {
    expect(jewelNodes(starMap('planet:1'), 'jewel-moon-1', 6)).toEqual(['prowess:1', 'vigor:1', 'guard:1'])
    expect(jewelNodes(starMap('planet:1'), 'jewel-moon-1', 5)).toEqual([])
  })

  it('lists Prowess, Vigor, Guard and her moon, the one furthest behind first', () => {
    const map = starMap('planet:1', 'prowess:1', 'vigor:1', 'guard:1')
    expect(jewelNodes(map, 'jewel-moon-2', 16)).toEqual(['template:1', 'prowess:2', 'vigor:2', 'guard:2'])
    const later = starMap('planet:1', 'planet:2', 'prowess:1', 'prowess:2', 'prowess:3', 'vigor:1', 'vigor:2', 'vigor:3', 'guard:1', 'guard:2', 'guard:3', 'template:1')
    expect(jewelNodes(later, 'jewel-moon-4', 36)).toEqual(['template:2', 'prowess:4', 'vigor:4', 'guard:4'])
    expect(jewelNodes(later, 'jewel-moon-4', 35)).toEqual([])
    expect(jewelNodes(starMap('prowess:1', 'template:1'), 'jewel-moon-2', 50)).toEqual(['prowess:2'])
  })

  it('a Planet Jewel opens one node at most; none when it’s open or its body is behind', () => {
    expect(jewelNodes(starMap('planet:1'), 'jewel-planet-2', 11)).toEqual(['planet:2'])
    expect(jewelNodes(starMap('planet:1', 'planet:2'), 'jewel-planet-2', 50)).toEqual([])
    expect(jewelNodes(starMap(), 'jewel-planet-2', 50)).toEqual([])
    expect(jewelNodes(starMap(), 'weapon-gem-g1', 50)).toEqual([])
  })

  it('jewelBlock checks the fit, then the node and the one before it, then her level, then the stock', () => {
    expect(jewelBlock(starMap(), 'jewel-moon-2', 'vigor:2', 1, {})).toBe('Set Moon Jewel I first')
    expect(jewelBlock(starMap('vigor:1'), 'jewel-moon-2', 'vigor:2', 1, {})).toBe('Opens at Lv 16')
    expect(jewelBlock(starMap('vigor:1'), 'jewel-moon-2', 'vigor:2', 16, {})).toBe('None in the Warehouse')
    expect(jewelBlock(starMap('vigor:1'), 'jewel-moon-2', 'vigor:2', 16, { 'jewel-moon-2': 1 })).toBeNull()
  })
})
