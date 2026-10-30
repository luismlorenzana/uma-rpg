import { describe, expect, it } from 'vitest'
import { byLevel, workOrder } from '@luismlorenzana/uma-kit/roster'
import { availabilityBlock, availableWorkers, newOwnedUma, newTierWorld, startJob, worldOf } from '@rpg/domain'
import { activePartyRows } from './party-rows'
import { albumRows, stableFacets, STABLE_FACETS, stableResult, STABLE_SCHEMA, STABLE_SORTS, TIER_ONE_SCOPE } from './rows'
import { albumFixture, NOW } from './testing'

describe('SB4 RPG album adapters', () => {
  it('projects shared master rows and the RPG values without mutating the save', async () => {
    const { view, world } = await albumFixture(), before = JSON.stringify(world)
    const rows = albumRows(view, world, ['81001'], NOW)
    expect(rows[0]).toMatchObject({ id: '81001', name: 'Aster', level: 3, workLevel: 12, isNew: false, classId: 'recruit' })
    expect(rows[1]?.isNew).toBe(true)
    expect(rows[5]).toMatchObject({ level: null, workLevel: null, uma: null, free: false })
    expect(JSON.stringify(world)).toBe(before)
  })

  it('uses kit level order, preserving release ties and the RPG ownership group for all seven sorts both ways', async () => {
    const { view, world } = await albumFixture(), rows = albumRows(view, world, [], NOW)
    expect([...rows].sort(byLevel).map(row => row.id)).toEqual(['81003', '81002', '81004', '81001', '81005', '81006'])
    for (const sort of STABLE_SORTS) for (const direction of ['asc', 'desc'] as const) {
      const shown = stableResult(rows, { ...STABLE_SCHEMA.fallback, sort: sort.key, direction }).rows
      expect(shown.map(row => row.uma !== null), `${sort.key}/${direction}`).toEqual([true, true, true, true, true, false])
    }
  })

  it('feeds the kit all RPG facets, and applies ownership counts before its tab', async () => {
    const { view, world } = await albumFixture(), rows = albumRows(view, world, ['81001'], NOW)
    const query = { ...STABLE_SCHEMA.fallback, filters: { ownership: ['owned'], new: true, class: ['brawler'] } }
    expect(stableResult(rows, query).rows.map(row => row.id)).not.toContain('81001')
    expect(stableResult(rows, { ...STABLE_SCHEMA.fallback, filters: { ownership: ['locked'] } }).counts.ownership).toEqual({ owned: 5, locked: 1 })
    expect(rows.every(row => 'surface' in row.facets && 'distance' in row.facets && 'strategy' in row.facets && 'sex' in row.facets)).toBe(true)
  })

  it('keeps a working Uma eligible for battle/Manuals but orders work by free first, then Craft Level', async () => {
    const { view, save } = await albumFixture()
    const busy = worldOf(startJob(save, 'monster-den', 0, view.roster[0]!, 'quartz', 3, NOW))
    const rows = albumRows(view, busy, [], NOW)
    expect(rows[0]).toMatchObject({ busy: true, free: false, level: 3 })
    expect(availabilityBlock(busy, '81001', NOW)).toBe('Already working')
    expect(availableWorkers(busy, NOW).has('81001')).toBe(false)
    expect([...rows].sort(workOrder).map(row => row.id)).toEqual(['81003', '81004', '81002', '81005', '81001', '81006'])
    expect(stableResult(rows, { ...STABLE_SCHEMA.fallback, filters: { free: true } }).rows.map(row => row.id)).not.toContain('81001')
    expect(albumRows(view, busy, [], '2026-10-18T12:00:00.000Z')[0]?.free).toBe(true)
  })

  it('keeps whole-party selection, including partial parties and master ids no longer known', async () => {
    const { view, world } = await albumFixture()
    world.parties[0]!.slots = ['81001', '81003', null, null, null]
    world.parties[1]!.slots = ['81002', null, null, null, null]
    world.parties[2]!.slots = ['missing', null, null, null, null]
    const rows = activePartyRows(view, world).sort(byLevel)
    expect(rows.map(row => [row.id, row.partyIndex, row.members.length])).toEqual([
      ['81001', 0, 2], ['81002', 1, 1], ['missing', 2, 1],
    ])
    expect(world.parties[0]!.slots).toEqual(['81001', '81003', null, null, null])
  })
})

describe('one Uma, one tier world in the album (H35)', () => {
  it('keeps today’s rows by default: every owned Uma, then the catalogue to unlock', async () => {
    const { view, world } = await albumFixture()
    const rows = albumRows(view, world, [], NOW)
    expect(rows.map(row => row.id)).toEqual(['81001', '81002', '81003', '81004', '81005', '81006'])
    expect(albumRows(view, world, [], NOW, TIER_ONE_SCOPE)).toEqual(rows)
    expect(albumRows(view, world, [], NOW, { tier: 1, elsewhere: new Set() })).toEqual(rows)
  })

  it('drops from Tier 1 an outfit another tier’s world owns', async () => {
    const { view, world } = await albumFixture()
    const rows = albumRows(view, world, [], NOW, { tier: 1, elsewhere: new Set(['81006']) })
    expect(rows.map(row => row.id)).toEqual(['81001', '81002', '81003', '81004', '81005'])
  })

  it('lists only Tier 2’s own Umas in Tier 2, with no catalogue to unlock', async () => {
    const { view, world } = await albumFixture()
    const tier2 = { ...newTierWorld(NOW, 0), umas: { '81006': newOwnedUma(NOW) } }
    const rows = albumRows(view, tier2, [], NOW, { tier: 2, elsewhere: new Set(Object.keys(world.umas)) })
    expect(rows.map(row => [row.id, row.uma !== null])).toEqual([['81006', true]])
    expect(albumRows(view, newTierWorld(NOW, 0), [], NOW, { tier: 2, elsewhere: new Set() })).toEqual([])
  })
})

describe('the Stable\'s Template filters (UT15, H70)', () => {
  /** The six invented outfits re-shaped: 81001 a front runner at Long (a Warrior, an Ironhide), 81002 a Pace Uma at Medium
   * (a Spellblade, a Spellfencer; owned, with a v18 pick of the Spell Blade that v19 ignores), the rest Pace Umas at Mile
   * (Duelists). */
  async function templated() {
    const fx = await albumFixture()
    const [ironhide, pacer, ...rest] = fx.view.roster
    Object.assign(ironhide!, { aptitudes: { ...ironhide!.aptitudes, strategy: { front: 'A', pace: 'C', late: 'C', end: 'C' },
      distance: { sprint: 'C', mile: 'C', medium: 'B', long: 'A' } } })
    Object.assign(pacer!, { baseStats: { ...pacer!.baseStats, power: 80, wit: 120 }, aptitudes: { ...pacer!.aptitudes,
      strategy: { front: 'C', pace: 'A', late: 'C', end: 'C' }, distance: { sprint: 'C', mile: 'C', medium: 'A', long: 'C' } } })
    for (const o of rest) Object.assign(o, { baseStats: { ...o.baseStats, power: 120, wit: 80 }, aptitudes: { ...o.aptitudes,
      strategy: { front: 'C', pace: 'A', late: 'C', end: 'C' }, distance: { sprint: 'C', mile: 'A', medium: 'C', long: 'C' } } })
    fx.world.umas['81002'] = { ...fx.world.umas['81002']!, calling: { pick: 'spellblade', confirmed: false } }
    return fx
  }

  it('adds a Template group after RPG (Calling, Stride, Knack, and from R2 her Signature), then R2\'s Trade group (H79, H80; live since H82)', () => {
    const at = STABLE_FACETS.findIndex((f) => f.group === 'Template')
    expect(STABLE_FACETS[at - 1]!.group).toBe('RPG')
    expect(STABLE_FACETS.slice(at).map((f) => [f.group, f.key, f.options!.map((o) => o.label)])).toEqual([
      ['Template', 'calling', ['Warrior', 'Spellblade', 'Mage', 'Summoner', 'Healer']],
      ['Template', 'stride', ['Dash', 'Middle', 'Stayer']],
      ['Template', 'knack', ['Fleet', 'Mighty', 'Tireless', 'Gritty', 'Clever']],
      ['Template', 'signature', ['Pendant', 'Orb', 'Bell', 'Insignia']],
      ['Trade', 'trade', ['Mine · Weapon Forge', 'Forest · Armorer', 'Fields · Tome Forge', 'Fishery · Charm Forge', 'Monster Den · Lapidary']],
    ])
  })

  it('finds an Ironhide by her template\'s name, and files each Uma under her running style\'s Tier 0', async () => {
    const { view, world } = await templated()
    const rows = albumRows(view, world, [], NOW, TIER_ONE_SCOPE)
    const found = stableResult(rows, { ...STABLE_SCHEMA.fallback, search: 'ironhide' }).rows.map((r) => r.id)
    expect(found).toEqual(['81001'])
    expect(rows[0]!.facets).toMatchObject({ calling: ['recruit'], stride: ['stayer'] })
    // Pace alone makes her a Spellblade (a Spellfencer by name); her old pick no longer counts.
    expect(rows[1]!.facets.calling).toEqual(['duelist'])
    expect(rows[1]!.search).toContain('spellfencer')
    const duelists = stableResult(rows, { ...STABLE_SCHEMA.fallback, filters: { calling: ['duelist'] } })
    expect(duelists.rows.map((r) => r.id).sort()).toEqual(['81002', '81003', '81004', '81005', '81006'])
    expect(duelists.counts.calling).toMatchObject({ recruit: 1, duelist: 5, apprentice: 0 })
  })
})

describe('the Stable’s Calling and Class facets (v19; CV §14.5, H134)', () => {
  const labels = (key: string, facets = STABLE_FACETS) => facets.find((f) => f.key === key)!.options!.map((o) => o.label)

  it('lists the five Tier 0s as callings and the thirteen classes, Tier 0 first', () => {
    expect(labels('calling')).toEqual(['Warrior', 'Spellblade', 'Mage', 'Summoner', 'Healer'])
    expect(labels('class')).toEqual(['Warrior', 'Spellblade', 'Healer', 'Summoner', 'Mage',
      'Brawler', 'Arms Spellblade', 'Arms Summoner', 'Paladin', 'Cleric', 'Tome Summoner', 'Tome Spellblade', 'Sorcerer'])
    // The groups and their order stay: Class and Can upgrade in RPG, Calling first in Template.
    expect(STABLE_FACETS.map((f) => f.key)).toEqual(['ownership', 'rarity', 'surface', 'distance', 'strategy', 'sex', 'new', 'free', 'class', 'upgrade',
      'calling', 'stride', 'knack', 'signature', 'trade'])
    // An explicit older engine keeps v18's six.
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
