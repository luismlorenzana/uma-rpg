import type { EnemyTier, Franchise, RosterMember, RpgCampaignChapter } from '@rpg/domain'
import { riftFight } from '@rpg/domain/rift'
import { describe, expect, it } from 'vitest'
import { byRank, campaignFightSource, faceRank } from './fight-source'
import { actsBadge, WARD_BADGE } from './FoeRow'
import { stageLayout } from './stage-layout'

/** A small invented roster: per pack, bosses, sub-bosses and keys. */
function roster(): RosterMember[] {
  const packs: Franchise[] = ['azurlane', 'nikke', 'priconne']
  const tiers: [EnemyTier, number][] = [['boss', 4], ['subboss', 6], ['key', 10]]
  return packs.flatMap((franchise) => tiers.flatMap(([tier, n]) =>
    Array.from({ length: n }, (_, i) => ({ id: `${franchise}-${tier}-${i}`, name: `${tier} ${i}`, franchise, tier }))))
}

describe('how a foe reads (H50)', () => {
  it('reads a Rift foe by her face: a Horde stage 9’s regular-rank leaders stand as a sub-boss and a boss', () => {
    const members = roster()
    const plan = riftFight({ tier: 1, runId: 't1-r1', roster: members, defeated: new Set() }, { kind: 'front', front: 'horde', stage: 9 })
    const waves = [plan.enemies, ...(plan.waves ?? [])]
    // Every Horde foe is regular rank, so the HP budget works (D173)...
    expect(waves.flat().every((e) => e.rank === 'regular')).toBe(true)
    // ...but each wave's leader reads as her face: sub-bosses lead the first two, a boss the last.
    const face = faceRank(new Map(members.map((m) => [m.id, m])))
    expect(waves.map((w) => face(w[0]!))).toEqual(['sub-boss', 'sub-boss', 'boss'])
    expect(waves.flatMap((w) => w.slice(1)).every((e) => face(e) === 'regular')).toBe(true)
    // The world map's source keeps her rank.
    expect(waves.map((w) => byRank(w[0]!))).toEqual(['regular', 'regular', 'regular'])
    // So the boss stands taller on the stage than a key beside her.
    const last = waves[2]!
    const layout = stageLayout(390, 600, last.map(face), 5)
    expect(layout.enemies[0]!.h).toBeGreaterThan(layout.enemies[1]!.h)
  })

  it('falls back to her rank for a face the roster lacks', () => {
    const face = faceRank(new Map())
    expect(face({ castId: 'gone', rank: 'sub-boss' })).toBe('sub-boss')
    expect(faceRank(new Map([['k', { tier: 'key' as const }]]))({ castId: 'k', rank: 'boss' })).toBe('boss')
  })

  it('gives the world map’s fight its chapter, stage and biome, and reads foes by rank', () => {
    const chapter = { id: 'w1-1-1', title: 'Meadow', nodes: [] } as unknown as RpgCampaignChapter
    const source = campaignFightSource(null, chapter, { id: 'w1-1-1', continentId: 'w1', biome: 'meadow', name: 'Meadow', level: 1, levelTop: 5, row: 0, col: 0 })
    expect(source).toMatchObject({ battle: null, title: 'Meadow', name: 'Fight', biome: 'meadow', back: 'Back to the map' })
    expect(source.rank).toBe(byRank)
    expect(campaignFightSource(null, chapter, null).biome).toBe('ruins')
  })
})

describe('a foe’s traits in lists (D169)', () => {
  it('names how often she acts and the channel she wards', () => {
    expect(actsBadge({})).toBeNull()
    expect(actsBadge({ twice: true })).toBe('Acts twice')
    expect(actsBadge({ thrice: true })).toBe('Acts three times')
    expect(WARD_BADGE).toEqual({ physical: 'Wards Arms', magical: 'Wards Tomes' })
  })
})
