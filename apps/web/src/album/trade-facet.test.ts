// The Stable's Trade filter (R2, PP21; H80): a Trade group of five values by their two places, each trade's head count
// from her calling (an owned Uma's pick counts), on locked outfits too. `stableFacets(true)` is the list from the switch.
import { describe, expect, it } from 'vitest'
import { albumRows, stableFacets, stableResult, STABLE_SCHEMA, TIER_ONE_SCOPE } from './rows'
import { albumFixture, NOW } from './testing'

/** The six invented outfits: 81001 a front runner (a Brawler), 81002 a Pace Uma with Wit over Power who picked the Spell
 * Blade, the rest Pace Umas with Power (Spell Blades); 81006 isn't owned. */
async function templated() {
  const fx = await albumFixture()
  const [brawler, pacer, ...rest] = fx.view.roster
  Object.assign(brawler!, { aptitudes: { ...brawler!.aptitudes, strategy: { front: 'A', pace: 'C', late: 'C', end: 'C' } } })
  Object.assign(pacer!, { baseStats: { ...pacer!.baseStats, power: 80, wit: 120 }, aptitudes: { ...pacer!.aptitudes,
    strategy: { front: 'C', pace: 'A', late: 'C', end: 'C' }, distance: { sprint: 'C', mile: 'C', medium: 'A', long: 'C' } } })
  for (const o of rest) Object.assign(o, { baseStats: { ...o.baseStats, power: 120, wit: 80 }, aptitudes: { ...o.aptitudes,
    strategy: { front: 'C', pace: 'A', late: 'C', end: 'C' }, distance: { sprint: 'C', mile: 'A', medium: 'C', long: 'C' } } })
  fx.world.umas['81002'] = { ...fx.world.umas['81002']!, calling: { pick: 'spellblade', confirmed: false } }
  return fx
}

describe('the Stable\'s Trade filter', () => {
  it('is a Trade group of five, named by their places, only from the switch', () => {
    const trade = stableFacets(true).at(-1)!
    expect([trade.group, trade.key, trade.options!.map((o) => o.label)]).toEqual(['Trade', 'trade', [
      'Mine · Forge', 'Forest · Armorer', 'Fields · Workbench', 'Fishery · Charm Shop', 'Monster Den · Lapidary',
    ]])
    expect(stableFacets(false).some((f) => f.key === 'trade')).toBe(false)
  })

  it('counts each trade\'s heads, owned and locked', async () => {
    const { view, world } = await templated()
    const rows = albumRows(view, world, [], NOW, TIER_ONE_SCOPE)
    const facets = stableFacets(true)
    expect(stableResult(rows, STABLE_SCHEMA.fallback, facets).counts.trade).toMatchObject({ physical: 1, 'physical-hybrid': 5, magical: 0 })
    const owned = stableResult(rows, { ...STABLE_SCHEMA.fallback, filters: { ownership: ['owned'] } }, facets)
    expect(owned.counts.trade).toMatchObject({ physical: 1, 'physical-hybrid': 4 })
    const smiths = stableResult(rows, { ...STABLE_SCHEMA.fallback, filters: { trade: ['physical'] } }, facets)
    expect(smiths.rows.map((r) => r.id)).toEqual(['81001'])
  })
})
