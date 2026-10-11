import { syntheticMasterData } from '@luismlorenzana/uma-data/testing'
import { describe, expect, it } from 'vitest'
import { buildRoster, type RosterOutfit } from '../master/roster'
import { best, bestAptitudeLine, learningTime } from './aptitudes'
import { DEFAULT_ROSTER_QUERY, EMPTY_FACETS, runRosterQuery, type RosterQuery } from './query'

const NOW = Date.parse('2026-10-10T12:00:00.000Z')
const roster: RosterOutfit[] = buildRoster(syntheticMasterData())
const first = roster[0]!
const umas = { [first.outfitId]: { unlockedAt: '2026-10-10T11:00:00.000Z', level: 3, exp: 0, build: null, builds: {} } }
const q = (patch: Partial<RosterQuery>): RosterQuery => ({ ...DEFAULT_ROSTER_QUERY, ...patch })

describe('roster query', () => {
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
