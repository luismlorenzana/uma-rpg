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

/** "Can upgrade" from v19 (H137, D253): a Tier 0 she fights as at Class Rank 10 with a child she doesn't hold carries the
 * mark and the filter finds her (one reason, Promote); below Rank 10, or once she fights as a Tier 1 class, nothing. */
describe('Can upgrade: Promote (v19)', () => {
  it('marks a Warrior at R10 and the preset keeps her; a Warrior at R9 and a Brawler stay unmarked', async () => {
    const { view, world } = await albumFixture()
    const set = (id: string, classId: 'recruit' | 'brawler', classes: Record<string, { rank: number; exp: number }>) => {
      world.umas[id] = { ...world.umas[id]!, classId, ranks: { classes } }
    }
    set('81001', 'recruit', { recruit: { rank: 10, exp: 400 } })
    set('81002', 'recruit', { recruit: { rank: 9, exp: 0 } })
    set('81003', 'brawler', { recruit: { rank: 10, exp: 0 }, brawler: { rank: 12, exp: 0 } })
    expect(umaUpgrades(world, view.roster[0]!)).toMatchObject({ promote: true, gear: 0, stars: 0, any: true })
    const rows = withUpgrades(albumRows(view, world, [], NOW), world)
    const picked = STABLE_PRESETS.find((p) => p.key === 'upgrade')!.apply(STABLE_SCHEMA.fallback)
    expect(stableResult(rows, picked).rows.map((row) => row.id)).toEqual(['81001'])
    expect(rows.find((row) => row.id === '81003')).toMatchObject({ upgrades: { promote: false }, facets: { upgrade: false } })
  })
})
