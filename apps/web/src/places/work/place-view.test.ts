// R2's place pages as data (H80): a gathering place's tiles by world tier and band, the Workbench's grid, the making
// places' grade chips by the ladder in Tiers 1–3, the Lapidary's rows, and who comes first with "Another trade" and the
// open shop. The helpers read static catalogs, so no switch is needed.
import { newOwnedUma, newTierWorld, openShop, tradeOfCalling, type RpgClass, type TierWorld } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { gatherRows, gradeChips, jewelRows, peekTypes, whoAt, workbenchRows } from './place-view'

const NOW = '2026-10-25T12:00:00.000Z'

describe('a gathering place\'s What step', () => {
  it('lists a tier a row, low then high, up to the world\'s tier', () => {
    expect(gatherRows('metal', 1, 1).map((r) => [r.tier, r.tiles.map((t) => t.id)])).toEqual([[1, ['copper-ore', 'iron-ore']]])
    expect(gatherRows('stone', 3, 50).map((r) => r.tiles.map((t) => t.id))).toEqual([
      ['quartz', 'citrine'], ['sapphire', 'diamond'], ['starstone', 'philosophers-stone'],
    ])
    expect(peekTypes('fish', 1)).toHaveLength(2)
    expect(peekTypes('fish', 2)).toHaveLength(4)
    expect(peekTypes('fish', 3)).toHaveLength(6)
  })

  it('says "From Craft Lv 26" on a high type until then', () => {
    const [low, high] = gatherRows('wood', 2, 25).flatMap((r) => r.tiles)
    expect([low!.locked, high!.locked]).toEqual([null, 'From Craft Lv 26'])
    expect(gatherRows('wood', 2, 26).flatMap((r) => r.tiles).every((t) => t.locked === null)).toBe(true)
  })
})

describe('the Workbench', () => {
  it('has five columns, one a line, and a row per tier and band', () => {
    const rows = workbenchRows(2, 1)
    expect(rows.map((r) => `${r.tier} ${r.band}`)).toEqual(['1 low', '1 high', '2 low', '2 high'])
    expect(rows[0]!.cells.map((c) => [c.line, c.id])).toEqual([
      ['metal', 'copper-ingot'], ['wood', 'pine-plank'], ['vegetables', 'chopped-carrot'], ['fish', 'carp-fillet'], ['stone', 'cut-quartz'],
    ])
    expect(rows[1]!.cells.every((c) => c.locked === 'From Craft Lv 26')).toBe(true)
    expect(workbenchRows(3, 50)).toHaveLength(6)
  })
})

describe('the making places\' grade chips', () => {
  const tiers = (worldTier: number) => gradeChips('weapon-gem', worldTier, 50).map((c) => c.tier)

  it('colour each grade by its material\'s tier: the ladder', () => {
    expect(tiers(1)).toEqual([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
    expect(tiers(2)).toEqual([1, 1, 1, 1, 2, 1, 1, 1, 1, 2])
    expect(tiers(3)).toEqual([1, 1, 1, 2, 3, 1, 1, 1, 2, 3])
  })

  it('open grade g at Craft Lv 5g − 4', () => {
    expect(gradeChips('armor-fittings', 1, 6).map((c) => c.locked)).toEqual([
      null, null, 'From Craft Lv 11', 'From Craft Lv 16', 'From Craft Lv 21', 'From Craft Lv 26', 'From Craft Lv 31', 'From Craft Lv 36',
      'From Craft Lv 41', 'From Craft Lv 46',
    ])
    expect(gradeChips('accessory-setting', 1, 1)[0]).toMatchObject({ id: 'accessory-setting-g1', label: '1' })
  })

  it('the Lapidary: Planet I–V and Moon I–V, by their nodes\' grades', () => {
    const rows = jewelRows(3, 50)
    expect(rows.map((r) => [r.label, r.chips.map((c) => `${c.label}:${c.grade}:${c.tier}`)])).toEqual([
      ['Planet', ['I:1:1', 'II:3:1', 'III:5:3', 'IV:7:1', 'V:9:2']],
      ['Moon', ['I:2:1', 'II:4:2', 'III:6:1', 'IV:8:1', 'V:10:3']],
    ])
    expect(jewelRows(2, 50).flatMap((r) => r.chips).filter((c) => c.tier === 2).map((c) => c.id)).toEqual(['jewel-planet-3', 'jewel-moon-5'])
  })
})

describe('who takes a slot', () => {
  const world = (callings: Record<string, RpgClass>): { world: TierWorld; tradeOf: (id: string) => ReturnType<typeof tradeOfCalling> | null } => {
    const base = newTierWorld(NOW, 0)
    return {
      world: { ...base, umas: Object.fromEntries(Object.keys(callings).map((id) => [id, newOwnedUma(NOW, callings[id]!)])) },
      tradeOf: (id) => (callings[id] ? tradeOfCalling(callings[id]!) : null),
    }
  }

  it('puts her trade\'s Umas first and greys the rest "Another trade"', () => {
    const { world: w, tradeOf } = world({ 101: 'brawler', 102: 'mage', 103: 'cleric' })
    const who = whoAt('forge', tradeOf, openShop(w, 'forge', tradeOf))
    expect(['101', '102', '103'].map((id) => [who.first(id), who.reason(id)])).toEqual([[true, null], [false, 'Another trade'], [false, 'Another trade']])
    // The Workbench is the healers' crafting place: a Paladin and a Cleric both work it.
    const bench = whoAt('workbench', tradeOf, openShop(w, 'workbench', tradeOf))
    expect(bench.first('103')).toBe(true)
    // An Uma whose trade nobody can say is never greyed (D208).
    expect(who.reason('999')).toBeNull()
  })

  it('opens the shop to everyone in a world with none of its trade', () => {
    const { world: w, tradeOf } = world({ 101: 'brawler', 102: 'cleric' })
    expect(openShop(w, 'lapidary', tradeOf)).toBe(true)
    const who = whoAt('lapidary', tradeOf, true)
    expect(['101', '102'].map((id) => [who.first(id), who.reason(id)])).toEqual([[true, null], [true, null]])
  })
})
