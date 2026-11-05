import { beforeHoneycomb } from './pre-honeycomb.fixture'
import { describe, expect, it } from 'vitest'

import { autoAction } from '../rpg/battle/auto'
import { battleActionsLeft, replayBattle } from '../rpg/battle/engine'
import type { BattleEnemy } from '../rpg/battle/types'
import type { RpgCampaignChapter } from '../rpg/campaign/chapters'
import { drillChapter } from '../rpg/drills'
import { capitalRunChapter } from '../world/capital'
import { capitalChapter } from '../world/legacy-capital.fixture'
import { regionChapter, worldContinent } from '../world/world'
import { actInFight, retreat, settleFight, startFight } from './battle'
import { capitalRunBlock, startCapitalFight, startCapitalRun } from './capital'
import { startDrill } from './drills'
import { sweepFight } from './exchange'
import { migrateWorld, toV38 } from './migrations'
import { honeycombState, regionTeamsOf, REGION_TEAMS_MAX, type RegionTeams } from './region-teams'
import { signUpRift, startRiftFight } from './rift'
import { ids, outfit, play, ROSTER, T, weaken } from './rift-rules.fixture'
import { setPartySlot, worldOf } from './rules'
import { CAPITAL_RUNS_MAX, newOwnedUma, newSave, newTierWorld, parseSave, parseSaveAsync, PARTY_COUNT, type Save } from './save'

const w = (s: Save) => worldOf(s, '1'), clone = <T>(v: T): T => structuredClone(v)
const outfits = new Map(ids(101, 140).map((id) => [id, outfit(id)]))
const continent = worldContinent({ name: 'Synthetic continent', order: 1 })
const chapter = (id = 'w1-1-1') => regionChapter(continent.regions.find((r) => r.id === id)!, ROSTER)
const team = (umas = ids(101, 5), at = T(3)) => ({ umas, at })

function ready(count = 5, level = 20): Save {
  const s = newSave('Honeycomb rules', T(0))
  ids(101, count).forEach((id, i) => {
    w(s).umas[id] = { ...newOwnedUma(T(0)), level }
    const p = w(s).parties[Math.floor(i / 5)]
    if (p) p.slots[i % 5] = id
  })
  return s
}

/** Real engine replays on synthetic foes, shortened to 1 HP as in the capital/Drill suites. */
function win(s: Save, c: RpgCampaignChapter, at = 3) {
  const input = w(s).world.run.battle!.input
  const soft = (e: BattleEnemy) => ({ ...e, stats: { ...e.stats, hp: 1 } })
  input.enemies = input.enemies.map(soft)
  if (input.waves) input.waves = input.waves.map((wave) => wave.map(soft))
  for (let n = 0; n < 500; n++) {
    const b = w(s).world.run.battle!, state = replayBattle(b.input, b.actions).state
    const actor = state.units.find((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(state, u.id) > 0)!
    const acted = actInFight(s, c, autoAction(state, actor.id), T(at))
    s = acted.save
    if (acted.result) { expect(acted.result.outcome).toBe('victory'); return s }
  }
  throw new Error('Synthetic fight did not finish')
}

function fight(s: Save, c = chapter(), stage = 1, at = 3) {
  for (let n = 1; n < stage; n++) w(s).world.run.wins[`${c.id}-s${n}`] ??= 1
  return win(startFight(s, c, `${c.id}-s${stage}`, outfits, T(at - 1)), c, at)
}

describe('save v38 live (H164, H166)', () => {
  it('constructs 24 parties and empty region teams, round trips synchronously and on device boot', async () => {
    const s = ready()
    expect(PARTY_COUNT).toBe(24); expect(CAPITAL_RUNS_MAX).toBe(6)
    expect(w(s).parties).toHaveLength(24); expect(w(s).regionTeams).toEqual({})
    expect(parseSave(s)).toEqual(s)
    expect(await parseSaveAsync(s)).toEqual(s)
  })

  it('migrates every v37 world with only four appended parties and an empty record, keeping the account and timestamps', async () => {
    const raw: Omit<Save, 'schemaVersion'> & { schemaVersion: number } = { ...ready(), schemaVersion: 37 }
    raw.tierWorlds['2'] = newTierWorld(T(1), 0)
    for (const world of Object.values(raw.tierWorlds)) { world.parties = world.parties.slice(0, 20); delete world.regionTeams }
    raw.tierWorlds['1']!.parties[0]!.name = 'Keep my order'; raw.tierWorlds['1']!.parties[0]!.lead = '104'
    raw.tierWorlds['1']!.world.run.wins['w1-1-1-s12'] = 2
    raw.tierWorlds['1']!.world.springs['w1-spring5'] = T(1)
    const before = clone(raw), result = parseSave(raw)
    expect(result).toEqual({ ...before, schemaVersion: 38,
      tierWorlds: Object.fromEntries(Object.entries(before.tierWorlds).map(([key, world]) => [key, toV38(world as unknown as Record<string, unknown>)])) })
    expect(result.account).toEqual(before.account)
    expect(result.tierWorlds['1']!.parties.slice(20)).toEqual([21, 22, 23, 24].map((n) => ({ name: `Party ${n}`, slots: [null, null, null, null, null], lead: null })))
    expect(await parseSaveAsync(raw)).toEqual(result)
    expect(raw).toEqual(before)
    expect(migrateWorld(before.tierWorlds['1'], 37)).toEqual(toV38(before.tierWorlds['1'] as unknown as Record<string, unknown>))
  })

  it('chains after v37 for v36 saves, and also preserves pre-v10 parties through their reset', () => {
    const raw = JSON.parse(JSON.stringify(ready())); raw.schemaVersion = 36
    raw.tierWorlds['1']!.parties = raw.tierWorlds['1']!.parties.slice(0, 20); delete raw.tierWorlds['1']!.regionTeams; delete raw.tierWorlds['1']!.capitalRuns; delete raw.tierWorlds['1']!.capitals
    expect(w(parseSave(raw))).toMatchObject({ regionTeams: {}, capitalRuns: [], capitals: {} })
    beforeHoneycomb(raw)
    raw.schemaVersion = 9
    const reset = parseSave(raw)
    expect(w(reset).parties).toHaveLength(24)
    expect(w(reset).parties[0]!.slots).toEqual(ids(101, 5))
    expect(w(reset).regionTeams).toEqual({})
  })

  it('refuses 20 parties in a current save, and enforces the new active/open-fight party bounds', () => {
    const raw = ready(); raw.tierWorlds['1']!.parties = raw.tierWorlds['1']!.parties.slice(0, 20)
    expect(() => parseSave(raw)).toThrow('expected 24 parties')
    const s = ready(); w(s).world.activeParty = 23; w(s).world.run.party = 23
    expect(parseSave(s)).toEqual(s)
    w(s).world.activeParty = 24
    expect(() => parseSave(s)).toThrow('expected 0–23')
    w(s).world.activeParty = 0; w(s).world.run.party = 24
    expect(() => parseSave(s)).toThrow('expected 0–23')
    expect(w(setPartySlot(ready(), 23, 0, '101', T(2))).parties[23]!.slots[0]).toBe('101')
    expect(() => setPartySlot(ready(), 24, 0, '101', T(2))).toThrow("doesn't exist")
    const last = signUpRift(ready(120, 50), ids(201, 20), T(1))
    const begun = startRiftFight(last, { kind: 'front', front: 'iron', stage: 1 }, 23, outfits, ROSTER, T(2))
    expect(w(begun).rift.battle!.input.allies.map((a) => a.id)).toEqual(ids(216, 5))
    expect(parseSave(begun)).toEqual(begun)
  })
})

describe('the bounded strict team record', () => {
  it('requires the field at v38 and validates region ids relative to their own tier', () => {
    const s = ready(); delete w(s).regionTeams
    expect(() => parseSave(s)).toThrow('regionTeams: expected an object')
    w(s).regionTeams = {}
    s.tierWorlds['2'] = newTierWorld(T(1), 0)
    s.tierWorlds['2']!.regionTeams = { 'w6-x-8': { clear: team(['9999']) } }
    expect(parseSave(s)).toEqual(s)
  })
  it('accepts all 240 regions, including new ids, and historical faces that are no longer owned', () => {
    const s = ready()
    w(s).regionTeams = Object.fromEntries([1, 2, 3, 4, 5].flatMap((order) => worldContinent({ name: 'Synthetic', order }).regions
      .map((r) => [r.id, { claim: team(['9001']), clear: team(['9002'], T(4)) }])))
    expect(Object.keys(w(s).regionTeams!)).toHaveLength(REGION_TEAMS_MAX)
    expect(parseSave(s)).toEqual(s)
    w(s).regionTeams!.extra = { claim: team() }
    expect(() => parseSave(s)).toThrow('regionTeams: too many entries')
  })

  it.each(['w1-0-1', 'w1-11-1', 'w1-1-5', 'w1-x-0', 'w1-x-9', 'w6-1-1', 'w1-capital', 'drill-t1-1', 'w01-1-1'])('refuses an unknown or wrong-tier region %s', (id) => {
    const s = ready(); w(s).regionTeams = { [id]: { claim: team() } }
    expect(() => parseSave(s)).toThrow('not a region of this tier')
  })

  it.each([
    [{}, 'expected a claim or clear'],
    [{ claim: { umas: [], at: T(3) } }, 'one to five'],
    [{ claim: team(ids(101, 6)) }, 'at most 5'],
    [{ claim: team(['101', '101']) }, 'duplicate ids'],
    [{ claim: team(['bad-id']) }, 'outfit ids'],
    [{ claim: team(['0']) }, 'outfit ids'],
    [{ clear: team(['101'], 'not-a-time') }, 'ISO timestamp'],
    [{ claim: { ...team(), extra: 1 } }, 'unknown keys'],
    [{ claim: team(), extra: 1 }, 'unknown keys'],
  ] as const)('refuses malformed teams %#', (record, message) => {
    const s = ready(); w(s).regionTeams = { 'w1-1-1': record as unknown as RegionTeams }
    expect(() => parseSave(s)).toThrow(message)
  })
})

describe('first claim and first clear', () => {
  it('keeps the first fight and boss teams, in frozen entrant order, through later wins and replays', () => {
    let s = ready(10)
    w(s).parties[0]!.slots = ['105', '103', '101', '104', '102']
    s = fight(s)
    expect(regionTeamsOf(w(s), 'w1-1-1')).toEqual({ claim: team(['105', '103', '101', '104', '102']) })
    w(s).world.activeParty = 1
    s = fight(s, chapter(), 2, 4)
    expect(regionTeamsOf(w(s), 'w1-1-1')!.claim).toEqual(team(['105', '103', '101', '104', '102']))
    s = fight(s, chapter(), 12, 5)
    const record = clone(regionTeamsOf(w(s), 'w1-1-1'))
    expect(record!.clear).toEqual(team(ids(106, 5), T(5)))
    s = fight(s, chapter(), 12, 6)
    expect(regionTeamsOf(w(s), 'w1-1-1')).toEqual(record)
    expect(parseSave(s)).toEqual(s)
  })

  it('adds no claim to an old region, adds its first later boss clear, and never invents a team for an old boss', () => {
    let s = ready(); w(s).world.run.wins['w1-1-1-s1'] = 2
    s = fight(s, chapter(), 2)
    expect(regionTeamsOf(w(s), 'w1-1-1')).toBeUndefined()
    s = fight(s, chapter(), 12, 4)
    expect(regionTeamsOf(w(s), 'w1-1-1')).toEqual({ clear: team(ids(101, 5), T(4)) })
    let old = ready(); w(old).world.run.wins['w1-1-1-s12'] = 1
    old = fight(old, chapter(), 12)
    expect(regionTeamsOf(w(old), 'w1-1-1')).toBeUndefined()
  })

  it('records a shorter frozen input rather than the current Party Hall slots', () => {
    let s = startFight(ready(10), chapter(), 'w1-1-1-s1', outfits, T(2))
    // The current engine requires five to start. Exercise settlement's one-to-five record contract directly.
    const state = replayBattle(w(s).world.run.battle!.input, []).state
    w(s).world.run.battle!.input.allies = w(s).world.run.battle!.input.allies.slice(0, 3)
    ;[w(s).parties[0]!.slots, w(s).parties[1]!.slots] = [w(s).parties[1]!.slots, w(s).parties[0]!.slots]
    s = settleFight(s, chapter(), w(s).world.run, { ...state, outcome: 'victory' }, T(3)).save
    expect(regionTeamsOf(w(s), 'w1-1-1')).toEqual({ claim: team(ids(101, 3)) })
    expect(parseSave(s)).toEqual(s)
  })

  it('records new regions and exposes pure capped progress and old clears without faces', () => {
    let s = fight(ready(), chapter('w1-x-2'))
    s = fight(s, chapter('w1-x-2'), 12, 4)
    w(s).world.run.wins['w1-x-2-s1'] = 999
    w(s).world.run.wins['w1-1-1-s12'] = 1
    const before = clone(s), state = honeycombState(w(s), continent)
    expect(Object.keys(state)).toHaveLength(48)
    expect(state['w1-x-2']).toEqual({ won: 12, completed: true, claim: team(), clear: team(ids(101, 5), T(4)) })
    expect(state['w1-1-1']).toEqual({ won: 1, completed: true })
    expect(state['w1-1-2']).toEqual({ won: 0, completed: false })
    expect(s).toEqual(before)
  })

  it('writes nothing on retreat, Sweep, Drill, capital fights (old or new), or the Rift', () => {
    const fresh = ready(), c = chapter()
    expect(w(retreat(startFight(fresh, c, 'w1-1-1-s1', outfits, T(1)), T(2))).regionTeams).toEqual({})
    const swept = ready(); w(swept).world.run.wins['w1-1-1-s1'] = 1; w(swept).wallet.sweepTickets = 1
    expect(w(sweepFight(swept, c, 'w1-1-1-s1', outfits, T(3)).save).regionTeams).toEqual({})
    const drill = drillChapter(1, ROSTER)
    expect(w(win(startDrill(swept, drill, 1, outfits, T(2).slice(0, 10), T(2)), drill)).regionTeams).toEqual({})
    const signed = startCapitalRun(ready(20), 'w1', [0, 1, 2, 3], T(1)), cap = capitalRunChapter(continent, 'w1-run1', ROSTER)
    expect(w(win(startCapitalFight(signed, cap, cap.id, 1, 'general', outfits, T(2)), cap)).regionTeams).toEqual({})
    const legacy = capitalChapter(continent, ROSTER), old = startFight(ready(), legacy, legacy.nodes[1]!.id, outfits, T(2))
    expect(w(win(old, legacy)).regionTeams).toEqual({})
    const rift = startRiftFight(signUpRift(ready(20, 50), ids(101, 20), T(1)), { kind: 'front', front: 'iron', stage: 1 }, 0, outfits, ROSTER, T(2))
    expect(w(play(weaken(rift)).save).regionTeams).toEqual({})
  })
})

it('allows six frozen capital runs with 24 parties, and refuses a seventh in rules and strict parse', () => {
  let s = ready(140, 1)
  for (let n = 0; n < 6; n++) s = startCapitalRun(s, 'w1', [0, 1, 2, 3].map((p) => p + n * 4), T(n + 1))
  expect(w(s).capitalRuns).toHaveLength(6)
  expect(w(s).capitalRuns![5]!.lanes.map((l) => l.party)).toEqual([20, 21, 22, 23])
  expect(parseSave(s)).toEqual(s)
  for (let n = 0; n < 4; n++) w(s).parties[n]!.slots = ids(221 + n * 5, 5)
  expect(capitalRunBlock(s, 'w1', [0, 1, 2, 3])).toBe('Six runs are open')
  expect(() => startCapitalRun(s, 'w1', [0, 1, 2, 3], T(9))).toThrow('Six runs are open')
  w(s).capitalRuns!.push(clone(w(s).capitalRuns![0]!))
  expect(() => parseSave(s)).toThrow('expected 0–6 entries')
})
