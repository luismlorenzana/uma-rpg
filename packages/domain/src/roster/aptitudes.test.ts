import { describe, expect, it } from 'vitest'
import { syntheticMasterData } from '@luismlorenzana/uma-data/testing'
import { buildRoster } from '../master/roster'
import { best, bestAptitudeLine, learningTime } from './aptitudes'
import { statTotal } from './stats'

describe('RPG aptitude labels and stat total', () => {
  it('retains the game-owned aptitude rules and labels after album queries move to the kit', () => {
    const outfit = buildRoster(syntheticMasterData())[0]!
    expect(best({ turf: 'B', dirt: 'A' })).toEqual(['dirt', 'A'])
    expect(bestAptitudeLine(outfit.aptitudes).split(' · ')).toHaveLength(3)
    expect(learningTime('A')).toBe(.5)
    expect(learningTime('G')).toBe(1)
    expect(statTotal(outfit)).toBe(Object.values(outfit.baseStats).reduce((sum, n) => sum + n, 0))
  })
})
