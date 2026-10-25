// The result sheet's Skill Rank lines (H70; class-progression.md §6.1, CP23, CP32), asked with an explicit engine: one line a
// skill whose rank rose with her Class Rank, "opened" for a depth that just opened, nothing before v16. Invented outfit.
import { newOwnedUma, rpgNode, type BattleOutfit, type OwnedUma, type RankGain, type TierWorld } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { rankUpLines } from './rank-ups'

const NOW = '2026-10-25T12:00:00.000Z'
const OUTFIT: BattleOutfit = {
  outfitId: '801', baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
  growthRatePercents: { speed: 10, stamina: 0, power: 0, guts: 0, wit: 0 },
  aptitudes: { strategy: { front: 'A', pace: 'C', late: 'C', end: 'C' }, distance: { sprint: 'C', mile: 'C', medium: 'A', long: 'C' } },
}
const uma: OwnedUma = { ...newOwnedUma(NOW, 'brawler'), level: 30, classId: 'brawler',
  classes: { brawler: { weapons: ['greatsword', 'axe', 'lance'], loadout: null } } }
const world = { umas: { '801': uma } } as unknown as TierWorld
const gain = (before: number, after: number): RankGain =>
  ({ ref: { kind: 'class', id: 'brawler' }, exp: 10, before: { rank: before, exp: 0 }, after: { rank: after, exp: 0 } })
const name = (id: string) => rpgNode(id)!.name

describe('a win\'s Skill Rank lines (H70)', () => {
  it('names each skill that reached a rank, and a depth that opened, from v16', () => {
    expect(rankUpLines(world, OUTFIT, gain(21, 22), 1, 16)).toEqual(['greatsword', 'axe', 'lance'].map((w) => `${name(`brawler-${w}.3`)} reached Rank 2`))
    expect(rankUpLines(world, OUTFIT, gain(19, 20), 1, 16)).toEqual(['greatsword', 'axe', 'lance'].map((w) => `${name(`brawler-${w}.3`)} opened`))
    // Two ranks in one win: depth 2 reaches its top at 18, depth 3 opens at 20.
    expect(rankUpLines(world, OUTFIT, gain(17, 20), 1, 16)).toEqual([
      ...['greatsword', 'axe', 'lance'].map((w) => `${name(`brawler-${w}.2`)} reached Rank 5`),
      ...['greatsword', 'axe', 'lance'].map((w) => `${name(`brawler-${w}.3`)} opened`),
    ])
    expect(rankUpLines(world, OUTFIT, gain(22, 22), 1, 16)).toEqual([])
  })

  it('says nothing before v16, or without her', () => {
    expect(rankUpLines(world, OUTFIT, gain(21, 22), 1, 15)).toEqual([])
    expect(rankUpLines(null, OUTFIT, gain(21, 22), 1, 16)).toEqual([])
    expect(rankUpLines(world, undefined, gain(21, 22), 1, 16)).toEqual([])
    expect(rankUpLines(world, OUTFIT, undefined, 1, 16)).toEqual([])
  })
})
