// The save's size bounds (D292): a world that has won every stage of its tier still parses. The old bound, 200 wins,
// refused every upload once a world passed it, and the device couldn't read its own copy back.
import { describe, expect, it } from 'vitest'
import { drillNodeId } from '../rpg/drill-id'
import { capitalStageIds } from '../world/capital'
import { worldContinent } from '../world/world'
import { MP_MAX, newSave, parseSave, WINS_MAX } from './save'

const T = '2026-11-03T03:00:00.000Z'

describe('the save\'s bounds (D292)', () => {
  it('parses a world that has won every stage of Tier 1: its regions, capitals and Drills', () => {
    const save = JSON.parse(JSON.stringify(newSave('Bounds', T)))
    const wins: Record<string, number> = {}
    for (let order = 1; order <= 5; order++) {
      const c = worldContinent({ name: '', order })
      for (const r of c.regions) for (let s = 1; s <= 12; s++) wins[`${r.id}-s${s}`] = 3
      for (const route of [1, 2, 3]) { const ids = capitalStageIds(c.id, route); wins[ids.vanguard] = 1; wins[ids.champion] = 1 }
    }
    for (let n = 1; n <= 5; n++) wins[drillNodeId(1, n)] = 9
    expect(Object.keys(wins).length).toBeGreaterThan(2_400)
    save.tierWorlds['1'].world.run.wins = wins
    expect(Object.keys(parseSave(save).tierWorlds['1']!.world.run.wins)).toHaveLength(Object.keys(wins).length)
  })

  it('still refuses a runaway record', () => {
    const save = JSON.parse(JSON.stringify(newSave('Bounds', T)))
    save.tierWorlds['1'].world.run.wins = Object.fromEntries(Array.from({ length: WINS_MAX + 1 }, (_, i) => [`x-${i}`, 1]))
    expect(() => parseSave(save)).toThrow(/wins: too many entries/)
    expect(MP_MAX).toBeGreaterThanOrEqual(500)
  })
})
