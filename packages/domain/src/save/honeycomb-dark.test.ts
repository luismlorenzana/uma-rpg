import { expect, it } from 'vitest'
import { actInFight, startFight } from './battle'
import { capitalRunBlock, startCapitalRun } from './capital'
import { honeycombLive } from './collections'
import { migrateWorld } from './migrations'
import { regionTeamsOf } from './region-teams'
import { ids, outfit, ROSTER, T } from './rift-rules.fixture'
import { newSave, newOwnedUma, parseSave, parseSaveAsync, PARTY_COUNT, CAPITAL_RUNS_MAX } from './save'
import { autoAction } from '../rpg/battle/auto'
import { battleActionsLeft, replayBattle } from '../rpg/battle/engine'
import { regionChapter, worldContinent } from '../world/world'

it('leaves a v37 save unchanged, with 20 parties, five open runs at most and no team field', async () => {
  const s = newSave('Dark honeycomb', T(0)), w = s.tierWorlds['1']!
  expect(s.schemaVersion).toBe(37); expect(honeycombLive()).toBe(false)
  expect(PARTY_COUNT).toBe(20); expect(CAPITAL_RUNS_MAX).toBe(5)
  expect(w.parties).toHaveLength(20); expect(w).not.toHaveProperty('regionTeams')
  expect(parseSave(s)).toEqual(s); expect(await parseSaveAsync(s)).toEqual(s)
  expect(migrateWorld(w, 37)).toBe(w)
  const raw = structuredClone(s); raw.tierWorlds['1']!.regionTeams = {}
  expect(() => parseSave(raw)).toThrow('unknown keys regionTeams')
  ids(101, 120).forEach((id, i) => {
    w.umas[id] = newOwnedUma(T(0))
    if (i < 100) w.parties[Math.floor(i / 5)]!.slots[i % 5] = id
  })
  let signed = s
  for (let n = 0; n < 5; n++) signed = startCapitalRun(signed, 'w1', [0, 1, 2, 3].map((p) => p + n * 4), T(n + 1))
  for (let n = 0; n < 4; n++) signed.tierWorlds['1']!.parties[n]!.slots = ids(201 + n * 5, 5)
  expect(capitalRunBlock(signed, 'w1', [0, 1, 2, 3])).toBe('Five runs are open')
})

it('continues paying a real v37 region win without adding a team record', () => {
  let s = newSave('Dark win', T(0)), w = s.tierWorlds['1']!
  const outfits = new Map(ids(101, 5).map((id, i) => { w.umas[id] = { ...newOwnedUma(T(0)), level: 20 }; w.parties[0]!.slots[i] = id; return [id, outfit(id)] }))
  const c = regionChapter(worldContinent({ name: 'Synthetic', order: 1 }).regions[0]!, ROSTER)
  s = startFight(s, c, c.nodes[1]!.id, outfits, T(1))
  s.tierWorlds['1']!.world.run.battle!.input.enemies.forEach((e) => { e.stats.hp = 1 })
  for (let n = 0; n < 500; n++) {
    const battle = s.tierWorlds['1']!.world.run.battle!, state = replayBattle(battle.input, battle.actions).state
    const actor = state.units.find((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(state, u.id) > 0)!
    const acted = actInFight(s, c, autoAction(state, actor.id), T(3)); s = acted.save
    if (acted.result) {
      expect(acted.result.outcome).toBe('victory'); expect(acted.result.members.every((m) => m.exp > 0)).toBe(true)
      expect(regionTeamsOf(s.tierWorlds['1']!, c.id)).toBeUndefined()
      expect(s.tierWorlds['1']).not.toHaveProperty('regionTeams'); expect(parseSave(s)).toEqual(s)
      return
    }
  }
  throw new Error('Synthetic dark fight did not finish')
})
