import { describe, expect, it } from 'vitest'
import { albumRows, stableResult, STABLE_PRESETS, STABLE_SCHEMA } from './rows'
import { albumFixture, NOW } from './testing'
import { umaUpgrades, withUpgrades } from './upgrades'

describe('Can upgrade on the Stable (H34)', () => {
  it('caches per world: the same world returns the same object; a new world recomputes', async () => {
    const { view, world } = await albumFixture()
    const aster = view.roster[0]!
    const first = umaUpgrades(world, aster)
    expect(first).toMatchObject({ any: false })
    expect(umaUpgrades(world, aster)).toBe(first)
    // A Weapon Gem G1 in the Warehouse raises her Greatsword (R2's grades, live since H82).
    const stocked = { ...world, items: { 'weapon-gem-g1': 1 } }
    const next = umaUpgrades(stocked, aster)
    expect(next).not.toBe(first)
    expect(next).toMatchObject({ grades: expect.arrayContaining([{ kind: 'weapon', weapon: 'greatsword' }]), any: true })
    expect(umaUpgrades(stocked, view.roster[5]!)).toBeNull()
    expect(umaUpgrades(null, aster)).toBeNull()
  })

  it('withUpgrades sets the facet, and the Can upgrade preset keeps only those Umas', async () => {
    const { view, world } = await albumFixture()
    const aster = world.umas['81001']!
    // Her accessory slot raised to G1 with no family yet: she can choose one (R2, live since H82).
    world.umas['81001'] = { ...aster, gear: { weapons: {}, armor: {}, accessories: [{ grade: 1, family: null, form: 'base' }] } }
    const plain = albumRows(view, world, [], NOW)
    expect(plain.every(row => row.upgrades === null && row.facets.upgrade === false)).toBe(true)
    const rows = withUpgrades(plain, world)
    expect(rows.find(row => row.id === '81001')).toMatchObject({ upgrades: { grades: [{ kind: 'accessory', slot: 0 }], any: true }, facets: { upgrade: true } })
    expect(rows.find(row => row.id === '81006')).toMatchObject({ upgrades: null, facets: { upgrade: false } })
    const picked = STABLE_PRESETS.find(p => p.key === 'upgrade')!.apply(STABLE_SCHEMA.fallback)
    expect(picked.filters).toEqual({ upgrade: true })
    const result = stableResult(rows, picked)
    expect(result.rows.map(row => row.id)).toEqual(['81001'])
    expect(result.counts.upgrade).toEqual({ true: 1 })
  })
})
