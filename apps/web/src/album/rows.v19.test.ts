// The Stable's Calling and Class facets from Classes v3 (CV §14.5; H134), with the switch mocked to 19 until the flip merges
// this into rows.test.ts: Calling the five Tier 0s by running style (no pick), Class the thirteen in the tree's order (the
// five Tier 0s, then the eight Tier 1 classes). Invented outfits only.
import { describe, expect, it, vi } from 'vitest'
import { albumRows, stableFacets, STABLE_FACETS, stableResult, STABLE_SCHEMA, TIER_ONE_SCOPE } from './rows'
import { albumFixture, NOW } from './testing'

vi.mock('../../../../packages/domain/src/rpg/battle/caps', async (orig) =>
  (await import('../../../../packages/domain/src/rpg/battle/caps-at.fixture')).capsAt(19, await orig()))

const labels = (key: string, facets = STABLE_FACETS) => facets.find((f) => f.key === key)!.options!.map((o) => o.label)

describe('the Stable’s Calling and Class facets (v19)', () => {
  it('lists the five Tier 0s as callings and the thirteen classes, Tier 0 first', () => {
    expect(labels('calling')).toEqual(['Recruit', 'Duelist', 'Initiate', 'Caller', 'Acolyte'])
    expect(labels('class')).toEqual(['Recruit', 'Duelist', 'Acolyte', 'Caller', 'Initiate',
      'Brawler', 'Arms Spellblade', 'Arms Summoner', 'Paladin', 'Cleric', 'Tome Summoner', 'Tome Spellblade', 'Sorcerer'])
    // The groups and their order stay: Class and Can upgrade in RPG, Calling first in Template.
    expect(STABLE_FACETS.map((f) => f.key)).toEqual(['ownership', 'rarity', 'surface', 'distance', 'strategy', 'sex', 'new', 'free', 'class', 'upgrade',
      'calling', 'stride', 'knack', 'signature', 'trade'])
    // An explicit older engine keeps today's six.
    expect(labels('calling', stableFacets(18))).toEqual(['Brawler', 'Mage', 'Spell Blade', 'Cleric', 'Summoner', 'Paladin'])
    expect(labels('class', stableFacets(18))).toEqual(['Brawler', 'Mage', 'Spell Blade', 'Cleric', 'Summoner', 'Paladin'])
  })

  it('files each Uma under her style’s Tier 0, a pick ignored, and her class as the one she fights as', async () => {
    const fx = await albumFixture()
    const [front, pacer, closer] = fx.view.roster
    Object.assign(front!, { aptitudes: { ...front!.aptitudes, strategy: { front: 'A', pace: 'A', late: 'C', end: 'C' } } })
    Object.assign(pacer!, { aptitudes: { ...pacer!.aptitudes, strategy: { front: 'C', pace: 'A', late: 'C', end: 'C' } } })
    Object.assign(closer!, { aptitudes: { ...closer!.aptitudes, strategy: { front: 'C', pace: 'C', late: 'A', end: 'A' } } })
    fx.world.umas['81002'] = { ...fx.world.umas['81002']!, classId: null, calling: { pick: 'mage', confirmed: true } }
    fx.world.umas['81003'] = { ...fx.world.umas['81003']!, classId: 'summoner', ranks: { classes: { caller: { rank: 10, exp: 0 }, summoner: { rank: 10, exp: 0 } } } }
    const rows = albumRows(fx.view, fx.world, [], NOW, TIER_ONE_SCOPE)
    expect(rows.slice(0, 3).map((r) => [r.facets.calling, r.facets.class])).toEqual([
      [['recruit'], ['recruit']], [['duelist'], ['duelist']], [['caller'], ['summoner']],
    ])
    const recruits = stableResult(rows, { ...STABLE_SCHEMA.fallback, filters: { calling: ['recruit'] } })
    expect(recruits.rows.map((r) => r.id)).toContain('81001')
    expect(recruits.rows.map((r) => r.id)).not.toContain('81002')
    const summoners = stableResult(rows, { ...STABLE_SCHEMA.fallback, filters: { class: ['summoner'] } })
    expect(summoners.rows.map((r) => r.id)).toEqual(['81003'])
  })
})
