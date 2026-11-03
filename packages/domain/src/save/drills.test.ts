// Drills and Training Logs (save v35, D283, H154).
import { describe, expect, it } from 'vitest'
import { autoAction } from '../rpg/battle/auto'
import { battleActionsLeft, replayBattle } from '../rpg/battle/engine'
import type { BattleEnemy } from '../rpg/battle/types'
import { drillChapter, drillDay, drillNodeId, logExp } from '../rpg/drills'
import { rpgExpToNext } from '../rpg/rules'
import { actInFight, retreat } from './battle'
import { drillFightBlock, drillsOn, logsToLevel, readLogs, readLogsBlock, startDrill, sweepDrill, sweepDrillBlock } from './drills'
import { OUTFITS, riftWorldSave, ROSTER, T } from './rift-rules.fixture'
import { worldOf } from './rules'
import { newOwnedUma, type Save } from './save'

const TODAY = '2026-11-02'
const chapter = drillChapter(1, ROSTER)

/** Tier 1 with a full active party of `level` on their Tier 0s (the fixture's Tier 1 classes hold no rank, which a world
 * fight refuses), a map stage won, and the day's runs. */
function ready(level = 20): Save {
  const save: Save = JSON.parse(JSON.stringify(riftWorldSave(5, level)))
  const world = worldOf(save, '1')
  for (const id of Object.keys(world.umas)) world.umas[id] = { ...newOwnedUma(T(0)), level }
  world.world.run.wins['w1-1-1-s1'] = 1
  return save
}

/** Every foe of the open world fight at 1 HP, then Auto to the end. */
function win(save: Save, from = 10) {
  const world = worldOf(save, '1')
  const battle = world.world.run.battle!
  const soft = (e: BattleEnemy): BattleEnemy => ({ ...e, stats: { ...e.stats, hp: 1 } })
  battle.input = { ...battle.input, enemies: battle.input.enemies.map(soft), ...(battle.input.waves ? { waves: battle.input.waves.map((w) => w.map(soft)) } : {}) }
  let s = save
  for (let n = 0; n < 500; n += 1) {
    const b = worldOf(s, '1').world.run.battle!
    const state = replayBattle(b.input, b.actions).state
    const ally = state.units.find((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(state, u.id) > 0)!
    const acted = actInFight(s, chapter, autoAction(state, ally.id), T(from + n))
    s = acted.save
    if (acted.result) return acted
  }
  throw new Error('the Drill never ended')
}

describe('the five Drills', () => {
  it('stand at the tier\'s Lv 10 to 50, each open from the camp, under their own ids', () => {
    const drills = chapter.nodes.filter((n) => n.kind !== 'camp')
    expect(drills.map((n) => [n.id, n.level, n.name])).toEqual([
      ['drill-t1-1', 10, 'Drill I'], ['drill-t1-2', 20, 'Drill II'], ['drill-t1-3', 30, 'Drill III'], ['drill-t1-4', 40, 'Drill IV'], ['drill-t1-5', 50, 'Drill V']])
    expect(chapter.nodes[0]!.exits).toEqual(drills.map((n) => n.id))
    expect(drills.every((n) => n.enemies.length > 0)).toBe(true)
    expect(drillChapter(2, ROSTER).nodes[1]!.level).toBe(60)
  })

  it('turn their day at 04:00 on the phone', () => {
    expect(drillDay(new Date(2026, 10, 2, 3, 59))).toBe('2026-11-01')
    expect(drillDay(new Date(2026, 10, 2, 4, 0))).toBe('2026-11-02')
  })
})

describe('the day\'s runs', () => {
  it('start at ten, add ten a day turned and bank up to thirty', () => {
    expect(drillsOn(undefined, TODAY)).toEqual({ day: TODAY, runs: 10, won: {} })
    const today = { day: TODAY, runs: 4, won: {} }
    expect(drillsOn(today, TODAY)).toBe(today)
    expect(drillsOn(today, '2026-11-03').runs).toBe(14)
    expect(drillsOn(today, '2026-11-09').runs).toBe(30)
  })
})

describe('a Drill fight', () => {
  it('waits for the tier\'s first win and a run', () => {
    const fresh: Save = JSON.parse(JSON.stringify(riftWorldSave(5, 20)))
    expect(drillFightBlock(fresh, 1, OUTFITS, TODAY)).toBe('Win a stage first')
    const save = ready()
    expect(drillFightBlock(save, 1, OUTFITS, TODAY)).toBeNull()
    worldOf(save, '1').drills = { day: TODAY, runs: 0, won: {} }
    expect(drillFightBlock(save, 1, OUTFITS, TODAY)).toBe('No runs left')
  })

  it('starts at full MP, pays its Logs on a win, spends one run, and leaves the map and its MP alone', () => {
    const save = ready()
    worldOf(save, '1').world.run.mp = { '101': 3 }
    const started = startDrill(save, chapter, 3, OUTFITS, TODAY, T(5))
    const battle = worldOf(started, '1').world.run.battle!
    expect(battle.nodeId).toBe(drillNodeId(1, 3))
    expect(battle.input.allies.every((a) => a.mp === a.stats.mp)).toBe(true)
    expect(worldOf(started, '1').world.run.mp).toEqual({ '101': 3 })
    const { save: after, result } = win(started)
    expect(result).toMatchObject({ outcome: 'victory', logs: 4, firstClear: true, members: [] })
    const world = worldOf(after, '1')
    expect(world.wallet.trainingLogs).toBe(4)
    expect(world.drills).toMatchObject({ day: TODAY, runs: 9, won: { 'drill-3': expect.any(String) } })
    expect(world.world.run.wins[drillNodeId(1, 3)]).toBeUndefined()
    expect(world.world.run.mp).toEqual({ '101': 3 })
    expect(world.umas['101']!.level).toBe(20)
  })

  it('costs nothing when given up', () => {
    const started = startDrill(ready(), chapter, 1, OUTFITS, TODAY, T(5))
    const left = worldOf(retreat(started, T(6)), '1')
    expect(left.drills!.runs).toBe(10)
    expect(left.wallet.trainingLogs).toBe(0)
  })
})

describe('sweeps', () => {
  it('need a won Drill and the runs, and pay its Logs a run', () => {
    const save = ready()
    expect(sweepDrillBlock(save, 5, 1, TODAY)).toBe('Win it first')
    worldOf(save, '1').drills = { day: TODAY, runs: 3, won: { 'drill-5': T(1) } }
    expect(sweepDrillBlock(save, 5, 5, TODAY)).toBe('3 runs left')
    const { save: after, logs } = sweepDrill(save, 5, 3, TODAY, T(2))
    expect(logs).toBe(18)
    expect(worldOf(after, '1').drills!.runs).toBe(0)
    expect(worldOf(after, '1').wallet.trainingLogs).toBe(18)
    // The next day brings ten more.
    expect(sweepDrillBlock(after, 5, 5, '2026-11-03')).toBeNull()
  })
})

describe('Training Logs', () => {
  it('make one level of three at any level, 147 from Lv 1 to 50', () => {
    for (const level of [1, 25, 49]) expect(3 * logExp(level)).toBeGreaterThanOrEqual(rpgExpToNext(level))
    expect(logsToLevel(1, 0, 50)).toBe(147)
    expect(logsToLevel(30, 0, 31)).toBe(3)
  })

  it('pay her like a win: Uma EXP and twice that to the class she fights as', () => {
    const save = ready(1)
    worldOf(save, '1').wallet.trainingLogs = 10
    const { save: after, result } = readLogs(save, '101', 3, OUTFITS, T(5))
    expect(result).toMatchObject({ read: 3, before: { level: 1 }, after: { level: 2 } })
    // Her calling's Tier 0 (a Front A outfit's Warrior) takes twice each Log's EXP: 2 × 46 × 3.
    expect(worldOf(after, '1').umas['101']!.ranks.classes.recruit).toEqual({ rank: 2, exp: 276 - 272 })
    expect(worldOf(after, '1').wallet.trainingLogs).toBe(7)
  })

  it('stop at Lv 50, and refuse one there', () => {
    const save = ready(49)
    worldOf(save, '1').wallet.trainingLogs = 10
    const { save: after, result } = readLogs(save, '101', 10, OUTFITS, T(5))
    expect(result.read).toBe(3)
    expect(worldOf(after, '1').wallet.trainingLogs).toBe(7)
    expect(readLogsBlock(after, '101', 1)).toBe('Lv 50 · Trials pay ranks')
  })
})
