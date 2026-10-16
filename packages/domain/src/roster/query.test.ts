import { syntheticMasterData } from '@luismlorenzana/uma-data/testing'
import { newOwnedUma } from '../save/save'
import { describe, expect, it } from 'vitest'
import { buildRoster, type RosterOutfit } from '../master/roster'
import { best, bestAptitudeLine, learningTime } from './aptitudes'
import { byUmaLevel, DEFAULT_ROSTER_QUERY, EMPTY_FACETS, runRosterQuery, SORT_LABELS, type RosterEntry, type RosterQuery, type RosterSortKey } from './query'

const NOW = Date.parse('2026-10-10T12:00:00.000Z')
const roster: RosterOutfit[] = buildRoster(syntheticMasterData())
const first = roster[0]!
const umas = { [first.outfitId]: { ...newOwnedUma('2026-10-10T11:00:00.000Z'), level: 3 } }
const q = (patch: Partial<RosterQuery>): RosterQuery => ({ ...DEFAULT_ROSTER_QUERY, ...patch })
const entry = (id: number, level: number | null, release: string, name: string): RosterEntry => ({
  outfit: { ...first, outfitId: String(id), masterId: id, name, releasedJp: release },
  owned: level === null ? null : { ...newOwnedUma('2026-10-10T11:00:00.000Z'), level }, isNew: false,
})
// Deliberately not in release, name, id or level order; all values are synthetic.
const mixed = [entry(5, null, '2030-01-01', 'Locked'), entry(4, 4, '2026-01-01', 'Low'),
  entry(3, 20, '2025-01-01', 'Older'), entry(2, 20, '2026-01-01', 'Beta'), entry(7, 20, '2026-01-01', 'Alpha'),
  entry(1, null, '2024-01-01', 'Other locked')]

describe('roster query', () => {
  it('defaults to Uma Level descending, with owned before locked and newest release/name ties', () => {
    expect(DEFAULT_ROSTER_QUERY.sort).toEqual({ key: 'level', direction: 'desc' })
    const outfits = mixed.map(e => e.outfit), owned = Object.fromEntries(mixed.flatMap(e => e.owned ? [[e.outfit.outfitId, e.owned]] : []))
    expect(runRosterQuery(outfits, owned, DEFAULT_ROSTER_QUERY, NOW).entries.map(e => e.outfit.outfitId)).toEqual(['7', '2', '3', '4', '5', '1'])
    expect(outfits.map(o => o.outfitId)).toEqual(['5', '4', '3', '2', '7', '1'])
  })

  it('shares the same level comparator with every Uma picker, including locked entries and a final stable id tie', () => {
    expect([...mixed].sort(byUmaLevel).map(e => e.outfit.outfitId)).toEqual(['7', '2', '3', '4', '5', '1'])
    const a = entry(8, 20, '2026-01-01', 'Alpha'), b = entry(9, 20, '2026-01-01', 'Alpha')
    expect(byUmaLevel(a, a)).toBe(0)
    expect(byUmaLevel(a, b)).toBeLessThan(0)
    expect(byUmaLevel(b, a)).toBeGreaterThan(0)
    expect(byUmaLevel(mixed[0]!, mixed[1]!)).toBeGreaterThan(0)
  })

  for (const key of Object.keys(SORT_LABELS) as RosterSortKey[]) for (const direction of ['asc', 'desc'] as const) {
    it(`keeps owned before locked for ${key} ${direction}`, () => {
      const outfits = mixed.map(e => e.outfit), owned = Object.fromEntries(mixed.flatMap(e => e.owned ? [[e.outfit.outfitId, e.owned]] : []))
      const entries = runRosterQuery(outfits, owned, q({ sort: { key, direction } }), NOW).entries
      expect(entries.map(e => e.owned !== null)).toEqual([true, true, true, true, false, false])
      if (key === 'level') expect(entries.slice(0, 4).map(e => e.owned!.level)).toEqual(direction === 'asc' ? [4, 20, 20, 20] : [20, 20, 20, 4])
    })
  }

  it('counts owned and locked, and switches ownership', () => {
    const all = runRosterQuery(roster, umas, q({}), NOW)
    expect(all.counts).toEqual({ all: roster.length, owned: 1, locked: roster.length - 1 })
    expect(runRosterQuery(roster, umas, q({ ownership: 'owned' }), NOW).entries.map((e) => e.outfit.outfitId)).toEqual([first.outfitId])
    expect(runRosterQuery(roster, umas, q({ ownership: 'locked' }), NOW).entries).toHaveLength(roster.length - 1)
  })

  it('marks Umas unlocked in the last day as new, and filters by it', () => {
    const result = runRosterQuery(roster, umas, q({ facets: { ...EMPTY_FACETS, newOnly: true } }), NOW)
    expect(result.entries.map((e) => [e.outfit.outfitId, e.isNew])).toEqual([[first.outfitId, true]])
    expect(runRosterQuery(roster, umas, q({ facets: { ...EMPTY_FACETS, newOnly: true } }), NOW + 2 * 86400000).entries).toHaveLength(0)
  })

  it('filters aptitudes at A or better, OR within a facet and AND across', () => {
    const front = runRosterQuery(roster, {}, q({ facets: { ...EMPTY_FACETS, strategy: ['front'] } }), NOW).entries
    expect(front.every((e) => ['S', 'A'].includes(e.outfit.aptitudes.strategy.front))).toBe(true)
    const both = runRosterQuery(roster, {}, q({ facets: { ...EMPTY_FACETS, strategy: ['front', 'end'] } }), NOW).entries
    expect(both.length).toBeGreaterThanOrEqual(front.length)
    const narrowed = runRosterQuery(roster, {}, q({ facets: { ...EMPTY_FACETS, strategy: ['front'], rarity: [3] } }), NOW).entries
    expect(narrowed.every((e) => e.outfit.rarity === 3)).toBe(true)
  })

  it('sorts by name, rarity, stats and level in both directions', () => {
    const names = runRosterQuery(roster, {}, q({ sort: { key: 'name', direction: 'asc' } }), NOW).entries.map((e) => e.outfit.name)
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
    const levels = runRosterQuery(roster, umas, q({ sort: { key: 'level', direction: 'desc' } }), NOW).entries
    expect(levels[0]?.outfit.outfitId).toBe(first.outfitId)
    const rarity = runRosterQuery(roster, {}, q({ sort: { key: 'rarity', direction: 'asc' } }), NOW).entries.map((e) => e.outfit.rarity)
    expect(rarity).toEqual([...rarity].sort((a, b) => a - b))
  })

  it('reads aptitudes: best keys, the summary line, learning time', () => {
    expect(best({ turf: 'B', dirt: 'A' })).toEqual(['dirt', 'A'])
    expect(bestAptitudeLine(first.aptitudes).split(' · ')).toHaveLength(3)
    expect(learningTime('A')).toBe(0.5)
    expect(learningTime('G')).toBe(1)
  })
})
