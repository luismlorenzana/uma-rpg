import { describe, expect, it } from 'vitest'
import { byLevel, workOrder } from '@luismlorenzana/uma-kit/roster'
import { availabilityBlock, availableWorkers, startJob, worldOf } from '@rpg/domain'
import { activePartyRows } from './party-rows'
import { albumRows, stableResult, STABLE_SCHEMA, STABLE_SORTS } from './rows'
import { albumFixture, NOW } from './testing'

describe('SB4 RPG album adapters', () => {
  it('projects shared master rows and the RPG values without mutating the save', async () => {
    const { view, world } = await albumFixture(), before = JSON.stringify(world)
    const rows = albumRows(view, world, ['81001'], NOW)
    expect(rows[0]).toMatchObject({ id: '81001', name: 'Aster', level: 3, workLevel: 12, isNew: false, classId: 'brawler' })
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
    const busy = worldOf(startJob(save, 'monster-den', 0, view.roster[0]!, 'puffbun-pelt', 3, NOW))
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
      ['81003', 0, 2], ['81002', 1, 1], ['missing', 2, 1],
    ])
    expect(world.parties[0]!.slots).toEqual(['81001', '81003', null, null, null])
  })
})
