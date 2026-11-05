import { beforeHoneycomb } from './pre-honeycomb.fixture'
import { describe, expect, it } from 'vitest'

import { autoAction } from '../rpg/battle/auto'
import { battleActionsLeft, replayBattle } from '../rpg/battle/engine'
import type { BattleEnemy } from '../rpg/battle/types'
import { rpgBattleExp, rpgBattleLaurels } from '../rpg/campaign/rewards'
import { rpgExpToNext } from '../rpg/rules'
import { windowBoard } from '../rpg/windows'
import { capitalRunChapter } from '../world/capital'
import { capitalStageIds } from '../world/legacy-capital.fixture'
import { capitalRunNodeId } from '../world/capital-run-id'
import { worldContinent } from '../world/world'
import { actInFight, retreat } from './battle'
import { abandonCapitalRun, capitalFightBlock, capitalRunBlock, startCapitalFight, startCapitalRun } from './capital'
import { capitalRunsLive } from './collections'
import { toV37 } from './migrations'
import { ascendUmasBlock } from './rift'
import { ids, outfit, ROSTER, T, TWENTY } from './rift-rules.fixture'
import { worldOf } from './rules'
import { newOwnedUma, newSave, parseSave, parseSaveAsync, type CapitalLane, type Save } from './save'
import { emptyWindow, stepDay, withSteps } from './window-record'
import { latchWindows, recordCapitalWin, windowMet, windowNext } from './windows'

const c1 = worldContinent({ order: 1, name: 'Test Continent' })
const outfits = new Map(ids(101, 100).map((id) => [id, outfit(id)]))
const chapter = (id = 'w1-run1') => capitalRunChapter(c1, id, ROSTER)
const world = (s: Save) => worldOf(s, '1')
const clone = <T>(v: T): T => structuredClone(v)

function ready(count = 20, level = 10): Save {
  const s = newSave('Capital rules', T(0)), w = world(s)
  ids(101, count).forEach((id, i) => {
    w.umas[id] = { ...newOwnedUma(T(0)), level }
    w.parties[Math.floor(i / 5)]!.slots[i % 5] = id
  })
  return s
}
const signed = (count = 20, level = 10) => startCapitalRun(ready(count, level), 'w1', [0, 1, 2, 3], T(1))

/** Real two-wave replays and settlement; only synthetic foes' HP is reduced so a suite isn't a balance test. */
function win(save: Save, id = 'w1-run1', at = 101) {
  let s = clone(save)
  const battle = world(s).world.run.battle!
  const soft = (e: BattleEnemy): BattleEnemy => ({ ...e, stats: { ...e.stats, hp: 1 } })
  battle.input = { ...battle.input, enemies: battle.input.enemies.map(soft), ...(battle.input.waves ? { waves: battle.input.waves.map((wave) => wave.map(soft)) } : {}) }
  for (let n = 0; n < 500; n++) {
    const b = world(s).world.run.battle!, state = replayBattle(b.input, b.actions).state
    const ally = state.units.find((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(state, u.id) > 0)!
    const acted = actInFight(s, chapter(id), autoAction(state, ally.id), T(at))
    s = acted.save
    if (acted.result) return { save: s, result: acted.result }
  }
  throw new Error('The capital fight never ended')
}
function fight(s: Save, lane: number, kind: 'general' | 'final', id = 'w1-run1', at = 100) {
  return win(startCapitalFight(s, chapter(id), id, lane, kind, outfits, T(at)), id, at + 1)
}

describe('capital runs live at v38', () => {
  it('creates only the new empty fields and round trips at v38, synchronously and on browser boot', async () => {
    expect(capitalRunsLive()).toBe(true)
    const s = ready()
    expect(s.schemaVersion).toBe(38)
    expect(world(s)).toMatchObject({ capitalRuns: [], capitals: {} })
    expect(parseSave(s)).toEqual(s)
    expect(await parseSaveAsync(s)).toEqual(s)
    const prior = { ...clone(world(s)), capitalRuns: undefined, capitals: undefined }
    expect(toV37(prior)).toEqual({ ...prior, capitalRuns: [], capitals: {} })
  })

  it('migrates v36, keeping every lit step, old map win and timestamp, and dropping only champions', async () => {
    const s = JSON.parse(JSON.stringify(ready()))
    beforeHoneycomb(s)
    s.schemaVersion = 36
    delete world(s).capitalRuns; delete world(s).capitals
    world(s).world.run.wins['w1-capital-r1-s2'] = 2
    s.account.windows = { '101': { '1': { ...withSteps(emptyWindow(), ['world-1', 'craft-2'], T(3)), champions: 17 } } }
    const parsed = parseSave(s)
    expect(parsed).toEqual({ ...s, schemaVersion: 38, account: { ...s.account, windows: { '101': { '1': { steps: s.account.windows['101']!['1']!.steps } } } },
      tierWorlds: { '1': { ...world(s), capitalRuns: [], capitals: {}, regionTeams: {}, parties: [...world(s).parties, ...newSave('Empty', T(0)).tierWorlds['1']!.parties.slice(20)] } } })
    expect(await parseSaveAsync(s)).toEqual(parsed)
  })
})

describe('sign-up, frozen lanes, and abandon', () => {
  it('needs four different full parties, with twenty different owned Umas, and no level gate', () => {
    const s = ready(25, 1)
    expect(capitalRunBlock(s, 'w1', [0, 1, 2, 3])).toBeNull()
    expect(capitalRunBlock(s, 'w6', [0, 1, 2, 3])).toBe('Not a continent of this tier')
    expect(capitalRunBlock(s, 'w0', [0, 1, 2, 3])).toBe('Not a continent of this tier')
    expect(capitalRunBlock(s, 'w1', [0, 1, 2])).toBe('Pick four different parties')
    expect(capitalRunBlock(s, 'w1', [0, 1, 2, 2])).toBe('Pick four different parties')
    expect(capitalRunBlock(s, 'w1', [0, 1, 2, 99])).toBe('No such party')
    world(s).parties[2]!.slots[1] = null
    expect(capitalRunBlock(s, 'w1', [0, 1, 2, 3])).toBe("Party 3 isn't full")
    world(s).parties[2]!.slots[1] = '101'
    expect(capitalRunBlock(s, 'w1', [0, 1, 2, 3])).toBe('An Uma is in two parties')
    expect(() => startCapitalRun(s, 'w1', [0, 1, 2, 3], T(2))).toThrow('An Uma is in two parties')
  })

  it('keeps the twenty in slot order through Party Hall edits; one run per Uma, across continents', () => {
    const s = signed(40), roster = clone(world(s).capitalRuns![0]!.lanes)
    expect(capitalRunBlock(s, 'w2', [0, 1, 2, 3], '1', (id) => `Uma ${id}`)).toBe('Uma 101 is in Run 1')
    const p = world(s).parties
    ;[p[0]!.slots, p[4]!.slots] = [p[4]!.slots, p[0]!.slots]
    const begun = startCapitalFight(s, chapter(), 'w1-run1', 1, 'general', outfits, T(2))
    expect(world(begun).world.run.battle!.input.allies.map((a) => a.id)).toEqual(ids(101, 5))
    expect(world(begun).capitalRuns![0]!.lanes).toEqual(roster)
    expect(parseSave(begun)).toEqual(begun)
    // A Hall row is only its sign-up label: it can supply five different Umas to a later run.
    const second = startCapitalRun(s, 'w1', [0, 5, 6, 7], T(3))
    expect(parseSave(second)).toEqual(second)
    expect(world(second).capitals!.w1!.started).toBe(2)
  })

  it('supports five concurrent runs with twenty parties, and does not reuse abandoned ids', () => {
    let s = ready(100, 1)
    for (let i = 0; i < 5; i++) s = startCapitalRun(s, 'w1', [0, 1, 2, 3].map((p) => p + 4 * i), T(i + 1))
    expect(world(s).capitalRuns!.map((r) => r.id)).toEqual([1, 2, 3, 4, 5].map((n) => `w1-run${n}`))
    expect(parseSave(s)).toEqual(s)
    const purse = clone(world(s).wallet)
    s = abandonCapitalRun(s, 'w1-run3', T(7))
    expect(world(s).wallet).toEqual(purse)
    s = startCapitalRun(s, 'w1', [8, 9, 10, 11], T(8))
    expect(world(s).capitalRuns!.at(-1)!.id).toBe('w1-run6')
    expect(world(s).capitals!.w1).toEqual({ started: 6, won: 0, recent: [] })
    expect(parseSave(s)).toEqual(s)
  })

  it('blocks abandoning its open fight, but not another run while that fight is open', () => {
    let s = startCapitalRun(signed(40), 'w2', [4, 5, 6, 7], T(2))
    s = startCapitalFight(s, chapter(), 'w1-run1', 1, 'general', outfits, T(3))
    expect(() => abandonCapitalRun(s, 'w1-run1', T(4))).toThrow('Finish the open fight first')
    const next = abandonCapitalRun(s, 'w2-run1', T(4))
    expect(world(next).capitalRuns!.map((r) => r.id)).toEqual(['w1-run1'])
    expect(world(next).world.run.battle).toEqual(world(s).world.run.battle)
  })
})

describe('the sixteen fights', () => {
  it('walks twelve generals in order, then four finals in any order; only the last lights all twenty windows', async () => {
    let s = signed()
    world(s).world.run.mp = { '101': 2, '120': 0 }
    world(s).world.run.wins = { 'w1-1-1-s1': 3, 'w1-capital-r1-s2': 1 }
    const carried = clone(world(s).world.run.mp), wins = clone(world(s).world.run.wins)
    for (const lane of [1, 2, 3, 4]) {
      for (const general of [1, 2, 3]) {
        expect(capitalFightBlock(s, 'w1-run1', lane, 'final', outfits)).toBe('Beat every lane’s generals')
        const start = startCapitalFight(s, chapter(), 'w1-run1', lane, 'general', outfits, T(10))
        const b = world(start).world.run.battle!
        expect(b.nodeId).toBe(capitalRunNodeId('w1-run1', lane, general as 1 | 2 | 3))
        expect(b.input.allies.every((a) => a.mp === a.stats.mp)).toBe(true)
        expect(await parseSaveAsync(start)).toEqual(start)
        const ended = win(start); s = ended.save
        expect(ended.result.capital).toEqual({ runId: 'w1-run1', lane, general, won: false })
        expect(world(s).world.run.wins).toEqual(wins)
        expect(world(s).world.run.mp).toEqual(carried)
      }
      expect(capitalFightBlock(s, 'w1-run1', lane, 'general', outfits)).toBe('This lane’s generals are beaten')
    }
    let final = 0
    for (const lane of [3, 1, 4, 2]) {
      const ended = fight(s, lane, 'final'); s = ended.save; final++
      expect(ended.result.capital).toEqual({ runId: 'w1-run1', lane, final, won: final === 4 })
      if (final < 4) {
        expect(capitalFightBlock(s, 'w1-run1', lane, 'final', outfits)).toBe('This final is won')
        expect(TWENTY.every((id) => !s.account.windows?.[id]?.['1'] || stepDay(s.account.windows[id]!['1']!, 'world-1') === null)).toBe(true)
        expect(windowNext(s, world(s).umas['101']!, outfits.get('101')!, '101', 1).find((n) => n.track === 'world'))
          .toEqual({ track: 'world', numeral: 1, have: final, need: 4, run: 'w1-run1' })
      }
      expect(parseSave(s)).toEqual(s)
    }
    expect(world(s).capitalRuns).toEqual([])
    expect(world(s).capitals!.w1).toEqual({ started: 1, won: 1, recent: [{ id: 'w1-run1', wonAt: T(101), lanes: [ids(101, 5), ids(106, 5), ids(111, 5), ids(116, 5)] }] })
    for (const id of TWENTY) expect(stepDay(s.account.windows![id]!['1']!, 'world-1')).toBe(T(101).slice(0, 10))
    expect(world(s).world.run.wins).toEqual(wins)
    expect(world(s).world.run.mp).toEqual(carried)
    // The next run of the same continent pays a quarter to these same Umas.
    s = startCapitalRun(s, 'w1', [0, 1, 2, 3], T(102))
    const level = world(s).umas['101']!.level, second = fight(s, 1, 'general', 'w1-run2', 103)
    expect(second.result.members[0]!.exp).toBe(Math.max(1, Math.round(rpgBattleExp('sub-boss', 10, level) * 0.5 * 0.25)))
    expect(second.result.firstClear).toBe(false)
    expect(second.result.laurels).toBe(Math.round(rpgBattleLaurels('sub-boss', 1) * 3 * 0.25))
  })

  it('blocks a second open map fight and the healer rule, while retries draw a fresh seed', () => {
    let s = signed()
    world(s).umas['101']!.classId = 'paladin'; world(s).umas['102']!.classId = 'cleric'
    expect(capitalFightBlock(s, 'w1-run1', 1, 'general', outfits)).toBe('One healer a party')
    world(s).umas['102']!.classId = null
    world(s).umas['101']!.ranks.classes.paladin = { rank: 10, exp: 0 }
    s = startCapitalFight(s, chapter(), 'w1-run1', 1, 'general', outfits, T(2))
    expect(capitalFightBlock(s, 'w1-run1', 2, 'general', outfits)).toBe('Finish the open fight first')
    const seed = world(s).world.run.battle!.input.seed, progress = clone(world(s).capitalRuns), purse = clone(world(s).wallet)
    const left = retreat(s, T(3))
    expect(world(left).capitalRuns).toEqual(progress)
    expect(world(left).wallet).toEqual(purse)
    const retry = startCapitalFight(left, chapter(), 'w1-run1', 1, 'general', outfits, T(4))
    expect(world(retry).world.run.battle!.input.seed).not.toBe(seed)
    expect(ascendUmasBlock(left, ['101'])).toBe('In a capital run')
  })

  it('pays each mixed entrant by her own World step; class EXP and Shards follow the actual Uma EXP', () => {
    const s = signed(20, 9)
    world(s).heroes['brawler-1'] = { hero: '106', learners: ['101'] }
    for (const uma of Object.values(world(s).umas)) uma.exp = rpgExpToNext(9) - 1
    s.account.windows = { '101': { '1': withSteps(emptyWindow(), ['world-1'], T(1)) }, '102': { '1': withSteps(emptyWindow(), ['world-1'], T(1)) } }
    const { save: paid, result } = fight(s, 1, 'general')
    expect(result.members.map((m) => m.exp)).toEqual([0.25, 0.25, 1, 1, 1].map((share) => Math.round(rpgBattleExp('sub-boss', 10, 9) * 0.5 * share)))
    for (const m of result.members) expect(m.ranks[0]!.exp).toBe(2 * m.exp)
    expect(result.shards).toBe(5); expect(result.tickets).toBe(1)
    expect(world(paid).wallet.shards).toBe(0)
    expect(result.laurels).toBe(rpgBattleLaurels('sub-boss', 1) * 3)
    expect(result.firstClear).toBe(true)
    expect(result.members[0]!.bonds).not.toHaveLength(0)
    expect(world(paid).umas['101']!.bonds['brawler-1']!.exp).toBeGreaterThan(0)
  })

  it('pays and advances nothing on a real loss, preserving the map’s wins and carried MP', () => {
    const s = signed()
    world(s).world.run.mp = { '101': 0 }
    const before = clone(world(s))
    let current = startCapitalFight(s, chapter(), 'w1-run1', 1, 'general', outfits, T(2))
    const b = world(current).world.run.battle!
    b.input = { ...b.input, allies: b.input.allies.map((a) => ({ ...a, stats: { ...a.stats, hp: 1 } })) }
    for (let n = 0; n < 500; n++) {
      const battle = world(current).world.run.battle!, state = replayBattle(battle.input, battle.actions).state
      const ally = state.units.find((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(state, u.id) > 0)!
      const acted = actInFight(current, chapter(), autoAction(state, ally.id), T(3)); current = acted.save
      if (!acted.result) continue
      expect(acted.result).toMatchObject({ outcome: 'loss', members: [], laurels: 0, capital: { won: false, general: 1 } })
      const after = world(current)
      expect(after.wallet).toEqual(before.wallet)
      expect(after.umas).toEqual(before.umas)
      expect(after.capitalRuns).toEqual(before.capitalRuns)
      expect(after.world.run).toMatchObject({ battle: null, wins: before.world.run.wins, mp: before.world.run.mp })
      return
    }
    throw new Error('The loss never ended')
  })

  it('pays the two-wave final as a boss ×1.5 and retains only the six newest won runs', () => {
    let s = signed()
    for (let n = 1; n <= 7; n++) {
      if (n > 1) s = startCapitalRun(s, 'w1', [0, 1, 2, 3], T(n * 10))
      const run = world(s).capitalRuns![0]!
      run.lanes.forEach((lane, i) => { lane.generals = 3; lane.finalAt = i === 3 ? null : T(n * 10) })
      const before = world(s).umas['116']!.level, id = `w1-run${n}`
      const result = fight(s, 4, 'final', id, n * 10 + 1); s = result.save
      expect(result.result.members[0]!.exp).toBe(Math.round(rpgBattleExp('boss', 10, before) * 1.5 * (n === 1 ? 1 : 0.25)))
      // A wave multiplies the usual stage Laurels, including that rule's first rounding on a replay.
      expect(result.result.laurels).toBe(Math.round(Math.round((n === 1 ? 3 : 0.75) * rpgBattleLaurels('boss', 1)) * 1.5))
      expect(parseSave(s)).toEqual(s)
    }
    expect(world(s).capitals!.w1).toMatchObject({ started: 7, won: 7, recent: [7, 6, 5, 4, 3, 2].map((n) => ({ id: `w1-run${n}` })) })
  })
})

describe('World steps at v38', () => {
  it('names a won run, ignores retired stage wins on a normal latch, and shows Not run progress', () => {
    const s = ready()
    for (const route of [1, 2, 3]) world(s).world.run.wins[capitalStageIds('w1', route).champion] = 1
    expect(windowBoard(2, true).find((n) => n.id === 'world-1')!.rule).toBe('Continent 6: a won capital run')
    expect(windowMet(world(s).umas['101']!, outfits.get('101')!, 1).has('world-1')).toBe(false)
    const latched = latchWindows(s, outfits, T(5))
    expect(stepDay(latched.account.windows!['101']!['1']!, 'world-1')).toBeNull()
    expect(windowNext(latched, world(s).umas['101']!, outfits.get('101')!, '101', 1).find((n) => n.track === 'world'))
      .toEqual({ track: 'world', numeral: 1, have: 0, need: 4 })
    expect(parseSave(latched)).toEqual(latched)
  })

  it('preserves the once-only pre-v35 credit even on a direct migration to v38', () => {
    const s = ready(); s.account.windowsStart = null
    for (const route of [1, 2, 3]) world(s).world.run.wins[capitalStageIds('w1', route).champion] = 1
    const latched = latchWindows(s, outfits, T(5))
    expect(stepDay(latched.account.windows!['101']!['1']!, 'world-1')).toBe(T(5).slice(0, 10))
    expect(latched.account.windows!['101']!['1']).not.toHaveProperty('champions')
    expect(parseSave(latched)).toEqual(latched)
    const pending = latchWindows(s, new Map(), T(5))
    expect(stepDay(pending.account.windows!['101']!['1']!, 'world-1')).toBe(T(5).slice(0, 10))
    expect(parseSave(pending)).toEqual(pending)
  })

  it('uses the tier-relative World numeral and the progress of her own run', () => {
    let s = newSave('Tier 2 capital', T(0))
    s.tierWorlds['2'] = world(ready())
    s = startCapitalRun(s, 'w6', [0, 1, 2, 3], T(1), '2')
    expect(capitalRunBlock(s, 'w1', [0, 1, 2, 3], '2')).toBe('Not a continent of this tier')
    const w = worldOf(s, '2'), run = w.capitalRuns![0]!
    run.lanes.forEach((l, i) => { l.generals = 3; if (i < 2) l.finalAt = T(2) })
    expect(windowNext(s, w.umas['101']!, outfits.get('101')!, '101', 2).find((n) => n.track === 'world'))
      .toEqual({ track: 'world', numeral: 1, have: 2, need: 4, run: 'w6-run1' })
    expect(parseSave(s)).toEqual(s)
    const lit = recordCapitalWin(s, '2', 'w6', TWENTY, T(3))
    expect(TWENTY.every((id) => stepDay(lit.account.windows![id]!['2']!, 'world-1') === T(3).slice(0, 10))).toBe(true)
    expect(lit.account.windows!['101']!['1']).toBeUndefined()
    expect(recordCapitalWin(lit, '2', 'w1', TWENTY, T(4))).toBe(lit)
  })
})

describe('strict capital parsing', () => {
  const cases: [string, (s: Save) => void][] = [
    ['wrong tier', (s) => { world(s).capitalRuns![0]!.continent = 'w6' }],
    ['malformed run id', (s) => { world(s).capitalRuns![0]!.id = 'bad' }],
    ['id of another capital', (s) => { world(s).capitalRuns![0]!.id = 'w2-run1' }],
    ['unstarted id', (s) => { world(s).capitalRuns![0]!.id = 'w1-run2' }],
    ['five lanes', (s) => { world(s).capitalRuns![0]!.lanes.push(clone(world(s).capitalRuns![0]!.lanes[0])) }],
    ['four Umas', (s) => { world(s).capitalRuns![0]!.lanes[0].umas.pop() }],
    ['duplicate Uma in lane', (s) => { world(s).capitalRuns![0]!.lanes[0].umas[1] = '101' }],
    ['duplicate Uma across lanes', (s) => { world(s).capitalRuns![0]!.lanes[1].umas[0] = '101' }],
    ['unowned Uma', (s) => { world(s).capitalRuns![0]!.lanes[0].umas[0] = '999' }],
    ['duplicate party index', (s) => { world(s).capitalRuns![0]!.lanes[1].party = 0 }],
    ['party out of bounds', (s) => { world(s).capitalRuns![0]!.lanes[0].party = 24 }],
    ['four generals', (s) => { world(s).capitalRuns![0]!.lanes[0].generals = 4 as CapitalLane['generals'] }],
    ['early final', (s) => { world(s).capitalRuns![0]!.lanes[0].finalAt = T(2) }],
    ['final before sign-up', (s) => { world(s).capitalRuns![0]!.lanes.forEach((l) => { l.generals = 3 }); world(s).capitalRuns![0]!.lanes[0].finalAt = T(0) }],
    ['finished open run', (s) => { world(s).capitalRuns![0]!.lanes.forEach((l) => { l.generals = 3; l.finalAt = T(2) }) }],
    ['fractional counter', (s) => { world(s).capitals!.w1!.started = 1.5 }],
    ['more wins than starts', (s) => { world(s).capitals!.w1!.won = 2 }],
    ['foreign capital counter', (s) => { world(s).capitals!.w6 = { started: 0, won: 0, recent: [] } }],
    ['old champion field at v37', (s) => { Object.assign(s.account, { windows: { '101': { '1': { ...emptyWindow(), champions: 0 } } } }) }],
  ]
  it.each(cases)('refuses %s', (_name, change) => { const s = signed(); change(s); expect(() => parseSave(s)).toThrow() })

  it('refuses duplicate Umas across runs and a seventh run', () => {
    const s = startCapitalRun(signed(40), 'w1', [4, 5, 6, 7], T(2))
    world(s).capitalRuns![1]!.lanes[0].umas[0] = '101'
    expect(() => parseSave(s)).toThrow('two lanes or runs')
    world(s).capitalRuns = Array.from({ length: 7 }, () => clone(world(s).capitalRuns![0]!))
    expect(() => parseSave(s)).toThrow('0–6')
  })

  it('refuses a forged open fight’s lane and entrants, including browser boot', async () => {
    const s = startCapitalFight(signed(), chapter(), 'w1-run1', 1, 'general', outfits, T(2))
    world(s).world.run.battle!.nodeId = 'w1-run1-l1-g2'
    expect(() => parseSave(s)).toThrow('next fight')
    await expect(parseSaveAsync(s)).rejects.toThrow('next fight')
    world(s).world.run.battle!.nodeId = 'w1-run1-l2-g1'
    expect(() => parseSave(s)).toThrow('signed lane')
  })

  it('checks recent rosters, counters and run ids, while allowing their faces to have left the world', () => {
    const s = signed(), w = world(s)
    const lanes = w.capitalRuns![0]!.lanes.map((l) => [...l.umas] as typeof l.umas)
    w.capitalRuns = []; w.capitals = { w1: { started: 1, won: 1, recent: [{ id: 'w1-run1', wonAt: T(2), lanes }] } }
    w.umas = {}; w.parties.forEach((p) => { p.slots = [null, null, null, null, null] })
    expect(parseSave(s)).toEqual(s)
    const bad = clone(s); world(bad).capitals!.w1!.recent[0]!.lanes[1]![0] = '101'
    expect(() => parseSave(bad)).toThrow('two lanes or runs')
    const missing = clone(s); world(missing).capitals!.w1!.recent = []
    expect(() => parseSave(missing)).toThrow('1–1')
    const foreign = clone(s); world(foreign).capitals!.w1!.recent[0]!.id = 'w2-run1'
    expect(() => parseSave(foreign)).toThrow('started run of this capital')
    const duplicate = clone(s); world(duplicate).capitals!.w1!.started = 2; world(duplicate).capitals!.w1!.won = 2
    world(duplicate).capitals!.w1!.recent.push(clone(world(duplicate).capitals!.w1!.recent[0]!))
    expect(() => parseSave(duplicate)).toThrow('duplicate run id')
  })
})
