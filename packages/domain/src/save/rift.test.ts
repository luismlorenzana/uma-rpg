import { describe, expect, it } from 'vitest'
import { RIFT_TUNING } from '../rift/fronts'
import { riftFight } from '../rift/generate'
import { RIFT_TRACES, type RiftFightRef } from '../rift/state'
import { createBattle, replayBattle } from '../rpg/battle/engine'
import type { BattleAction, BattleInput } from '../rpg/battle/types'
import { rpgFoe } from '../rpg/campaign/enemies'
import { rpgBattleExp } from '../rpg/campaign/rewards'
import { CLASS_EXP_SHARE, weaponExpShares } from '../economy/ranks'
import { balanceMember } from '../world/balance-party'
import { classOf, usedWeapons } from './battle'
import {
  abandonConvergence, actInRiftFight, ascend, ascendBlock, ASCEND_PURSE, bankedMarks, beginConvergence, cancelRiftBlock, cancelRiftRun, convergenceBlock,
  ECHO_RANK_PAY, echoFoeLevel, leaveRiftFight, riftBattleStep, riftContextFor, riftFightBlock, riftTraces, signUpBlock, signUpRift, startRiftFight,
  sweepEcho, sweepEchoBlock,
} from './rift'
import { doom, ids, OUTFITS, play, riftWorldSave, ROSTER, T, TWENTY, weaken } from './rift-rules.fixture'
import { setPartySlot, worldOf } from './rules'
import { newOwnedUma, newTierWorld, parseSave, type Save, type TierWorld } from './save'

const IRON1: RiftFightRef = { kind: 'front', front: 'iron', stage: 1 }
const roundTrip = (save: Save) => expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
const world1 = (save: Save): TierWorld => worldOf(save, '1')
/** Changes Tier 1's world in place of a rule (test setup only). */
const edit = (save: Save, change: (w: TierWorld) => void): Save => {
  const copy: Save = JSON.parse(JSON.stringify(save))
  change(copy.tierWorlds['1']!)
  return copy
}
/** Twenty-five Lv 50 Umas in parties 0–4, the first twenty (parties 0–3) signed up at minute 1. */
const signedUp = (): Save => signUpRift(riftWorldSave(), TWENTY, T(1))
/** A front's stages cleared by hand, as if fought. */
const cleared = (save: Save, fronts: Partial<Record<'iron' | 'arcane' | 'duel' | 'horde', number>>): Save =>
  edit(save, (w) => { Object.assign(w.rift.runs.at(-1)!.fronts, fronts) })
const sealed = (save: Save): Save => cleared(save, { iron: 12, arcane: 12, duel: 12, horde: 12 })
const tierOf = (castId: string) => ROSTER.find((m) => m.id === castId)!.tier

describe('opening and sign-up (rift.md §4, R2)', () => {
  it('opens at five Lv 50 Umas, not four, and never in Tier 3', () => {
    const four = riftWorldSave(4)
    expect(signUpBlock(four, TWENTY)).toBe('Opens at 5 Lv 50 Umas')
    expect(riftFightBlock(four, { kind: 'echo', front: 'iron', level: '50' }, 0)).toBe('Opens at 5 Lv 50 Umas')
    const five = riftWorldSave(5)
    expect(riftFightBlock(five, { kind: 'echo', front: 'iron', level: '50' }, 0)).toBeNull()
    // Tier 3's Rift waits for its fifth scenario (T9).
    const t3 = riftWorldSave(25)
    t3.tierWorlds['3'] = t3.tierWorlds['1']!
    delete t3.tierWorlds['1']
    t3.tierWorlds['1'] = newTierWorld(T(0), 0)
    expect(signUpBlock(t3, ids(101, 20), '3')).toBe('No Rift in this tier yet')
    expect(riftFightBlock(t3, { kind: 'echo', front: 'iron', level: '50' }, 0, '3')).toBe('No Rift in this tier yet')
  })

  it('signs up exactly twenty distinct Lv 50 Umas of this world, one run at a time', () => {
    const save = riftWorldSave()
    expect(signUpBlock(save, TWENTY.slice(0, 19))).toBe('Pick 20 Umas')
    expect(signUpBlock(save, [...TWENTY.slice(0, 19), '101'])).toBe('An Uma is picked twice')
    const lv49 = edit(save, (w) => { w.umas['120']!.level = 49 })
    expect(signUpBlock(lv49, TWENTY)).toBe('Only Lv 50 Umas')
    const other: Save = { ...save, tierWorlds: { ...save.tierWorlds, '2': { ...newTierWorld(T(0), 0), umas: { '201': { ...newOwnedUma(T(0)), level: 50 } } } } }
    expect(signUpBlock(other, [...TWENTY.slice(0, 19), '201'])).toBe('Only this tier’s Umas')
    expect(() => signUpRift(lv49, TWENTY, T(1))).toThrow('Only Lv 50 Umas')

    const run = signUpRift(save, TWENTY, T(1))
    expect(world1(run).rift.runs).toEqual([{ id: 't1-r1', roster: TWENTY, startedAt: T(1), fronts: { iron: 0, arcane: 0, duel: 0, horde: 0 },
      convergence: { attempts: 0, open: null }, traces: {}, wonAt: null, ascendedAt: null }])
    expect(signUpBlock(run, ids(106, 20))).toBe('A run is already on')
    roundTrip(run)
  })

  it('cancels a run only while untouched', () => {
    const save = signedUp()
    expect(cancelRiftBlock(save)).toBeNull()
    expect(world1(cancelRiftRun(save, T(2))).rift.runs).toEqual([])
    expect(cancelRiftBlock(cleared(save, { iron: 1 }))).toBe('The run has started')
    expect(() => cancelRiftRun(cleared(save, { iron: 1 }), T(2))).toThrow('The run has started')
    expect(cancelRiftBlock(startRiftFight(save, IRON1, 0, OUTFITS, ROSTER, T(2)))).toBe('Finish the open Rift fight first')
    expect(cancelRiftBlock(riftWorldSave())).toBe('No run to cancel')
  })
})

describe('front fights (§4–§5, R4)', () => {
  it('takes the next stage only, by a full party of the roster', () => {
    const save = signedUp()
    expect(riftFightBlock(save, { kind: 'front', front: 'iron', stage: 2 }, 0)).toBe('Stage 1 is next')
    expect(() => startRiftFight(save, { kind: 'front', front: 'iron', stage: 2 }, 0, OUTFITS, ROSTER, T(2))).toThrow('Stage 1 is next')
    // Party 4 holds 121–125, off the roster; party 3 is fine until one of them joins it.
    expect(riftFightBlock(save, IRON1, 4)).toBe('Only the run’s twenty fight here')
    expect(riftFightBlock(setPartySlot(save, 3, 0, '121', T(2)), IRON1, 3)).toBe('Only the run’s twenty fight here')
    expect(riftFightBlock(setPartySlot(save, 3, 0, null, T(2)), IRON1, 3)).toBe('Needs a full party')
    expect(riftFightBlock(save, IRON1, null)).toBe('Pick a party')
    expect(riftFightBlock(save, IRON1, 3)).toBeNull()
    expect(riftFightBlock(cleared(save, { iron: 12 }), { kind: 'front', front: 'iron', stage: 12 }, 0)).toBe('Iron is sealed')
    expect(riftFightBlock(riftWorldSave(), IRON1, 0)).toBe('Sign up a run first')
  })

  it('starts with HP and MP full, carried world-map MP or not, one Rift fight at a time beside the map’s', () => {
    const tired = edit(signedUp(), (w) => { w.world.run.mp = { '101': 1 } })
    const save = startRiftFight(tired, IRON1, 0, OUTFITS, ROSTER, T(2))
    const battle = world1(save).rift.battle!
    expect(battle).toMatchObject({ battleId: 'rift:t1:1', ref: IRON1, startedAt: T(2), actions: [] })
    expect(world1(save).rift.battles).toBe(1)
    expect(battle.input.allies.map((a) => a.id)).toEqual(ids(101, 5))
    for (const a of battle.input.allies) expect(a.mp).toBe(a.stats.mp)
    for (const u of createBattle(battle.input).state.units.filter((x) => x.side === 'ally')) expect(u.hp).toBe(battle.input.allies.find((a) => a.id === u.id)!.stats.hp)
    // The world map's MP is untouched, and the generator built the foes.
    expect(world1(save).world.run.mp).toEqual({ '101': 1 })
    expect(battle.input.enemies).toEqual(riftFight(riftContextFor(save, IRON1, ROSTER), IRON1).enemies)
    expect(riftFightBlock(save, { kind: 'echo', front: 'iron', level: '50' }, 4)).toBe('Finish the open Rift fight first')
    roundTrip(save)
  })

  it('settles a loss with nothing changed but the open fight and the count; a retry draws a new id and seed against the same foes', () => {
    const before = signedUp()
    const started = startRiftFight(before, IRON1, 0, OUTFITS, ROSTER, T(2))
    const lost = play(doom(started))
    expect(lost.result).toMatchObject({ outcome: 'loss', ref: IRON1, members: [], cleared: null, attempt: null, runWon: false, earned: [] })
    const w = world1(lost.save)
    expect(w.rift).toEqual({ ...world1(before).rift, battle: null, battles: 1 })
    expect(w.umas).toEqual(world1(before).umas)
    expect(w.wallet).toEqual(world1(before).wallet)
    expect(lost.save.account.defeated).toEqual({})
    expect(lost.save.account.achievements).toEqual({})

    const retry = world1(startRiftFight(lost.save, IRON1, 0, OUTFITS, ROSTER, T(300))).rift.battle!
    const first = world1(started).rift.battle!
    expect(retry.battleId).toBe('rift:t1:2')
    expect(retry.input.seed).not.toBe(first.input.seed)
    expect(retry.input.enemies).toEqual(first.input.enemies)
    expect(retry.input.waves).toEqual(first.input.waves)
  })

  it('a win clears the stage, merges its traces, and records each boss and sub-boss face first defeated', () => {
    const started = startRiftFight(signedUp(), IRON1, 0, OUTFITS, ROSTER, T(2))
    const foes = world1(started).rift.battle!.input.enemies
    // Stage 1 is a sub-boss captain and her key guards (D173; one since H51): only the captain's face is recorded.
    expect(foes.map((f) => tierOf(f.castId)).sort()).toEqual([...Array<string>(RIFT_TUNING.escort.guards).fill('key'), 'subboss'])
    const captain = foes.find((f) => tierOf(f.castId) === 'subboss')!.castId
    const won = play(weaken(started))
    expect(won.result).toMatchObject({ outcome: 'victory', ref: IRON1, members: [], gearMarks: 0, classMarks: 0, cleared: 1, attempt: null, runWon: false })
    const run = world1(won.save).rift.runs[0]!
    expect(run.fronts).toEqual({ iron: 1, arcane: 0, duel: 0, horde: 0 })
    const traces = riftTraces(won.battle.input, won.battle.actions)
    expect(traces.length).toBeGreaterThan(0)
    expect(run.traces).toEqual({ iron: traces })
    expect(won.save.account.defeated).toEqual({ [captain]: won.save.account.updatedAt })
    // Front fights pay nothing else (D168); a win confirms each fighter's calling (CP29, H69).
    const fighters = new Set(won.battle.input.allies.map((a) => a.id))
    expect(world1(won.save).umas).toEqual(Object.fromEntries(Object.entries(world1(started).umas)
      .map(([id, u]) => [id, fighters.has(id) ? { ...u, calling: { ...u.calling, confirmed: true } } : u])))
    expect(world1(won.save).wallet).toEqual(world1(started).wallet)
    expect(world1(won.save).rift.battle).toBeNull()
    roundTrip(won.save)

    // Stage 2: the traces merge in `RIFT_TRACES` order, and a face keeps the time it was first defeated.
    const next = startRiftFight(edit(won.save, (w) => { w.rift.runs[0]!.traces.iron = ['ko'] }), { kind: 'front', front: 'iron', stage: 2 }, 0, OUTFITS, ROSTER, T(400))
    const face = world1(next).rift.battle!.input.enemies.find((f) => tierOf(f.castId) === 'subboss')!.castId
    const early = { ...next, account: { ...next.account, defeated: { ...next.account.defeated, [face]: T(3) } } }
    const two = play(weaken(early), 500)
    const fresh = riftTraces(two.battle.input, two.battle.actions)
    expect(world1(two.save).rift.runs[0]!.traces.iron).toEqual(RIFT_TRACES.filter((t) => t === 'ko' || fresh.includes(t)))
    expect(two.save.account.defeated[face]).toBe(T(3))
    expect(two.result.cleared).toBe(2)
  })

  it('seals a front at stage 12, which earns its seal through the achievement rules (H49)', () => {
    const save = startRiftFight(cleared(signedUp(), { iron: 11 }), { kind: 'front', front: 'iron', stage: 12 }, 0, OUTFITS, ROSTER, T(2))
    const won = play(weaken(save))
    expect(won.result.cleared).toBe(12)
    expect(world1(won.save).rift.runs[0]!.fronts.iron).toBe(12)
    expect(won.result.earned.map((g) => g.id)).toContain('t1-seal-iron')
    expect(won.save.account.achievements['t1-seal-iron']).toEqual({ at: won.save.account.updatedAt, run: 't1-r1' })
    roundTrip(won.save)
  })
})

describe('the Convergence (§6)', () => {
  it('needs every front sealed and four different full parties that are exactly the roster', () => {
    const save = signedUp()
    expect(convergenceBlock(save, [0, 1, 2, 3])).toBe('Seal all four fronts first')
    expect(convergenceBlock(cleared(save, { iron: 12, arcane: 12, duel: 12, horde: 11 }), [0, 1, 2, 3])).toBe('Seal all four fronts first')
    const ready = sealed(save)
    expect(convergenceBlock(ready, [0, 1, 2])).toBe('Pick 4 parties')
    expect(convergenceBlock(ready, [0, 1, 2, 2])).toBe('Pick 4 different parties')
    expect(convergenceBlock(ready, [0, 1, 2, 4])).toBe('The four parties must be the run’s twenty')
    expect(convergenceBlock(ready, [3, 2, 1, 0])).toBeNull()
    expect(() => beginConvergence(save, [0, 1, 2, 3], T(2))).toThrow('Seal all four fronts first')
  })

  it('freezes the twenty, counts the attempt, fights in order, and a loss or a retreat ends it', () => {
    const begun = beginConvergence(sealed(signedUp()), [3, 2, 1, 0], T(2))
    const attempt = world1(begun).rift.runs[0]!.convergence
    expect(attempt).toEqual({ attempts: 1, open: { parties: [ids(116, 5), ids(111, 5), ids(106, 5), ids(101, 5)], rounds: [] } })
    roundTrip(begun)
    expect(convergenceBlock(begun, [0, 1, 2, 3])).toBe('An attempt is on')
    expect(riftFightBlock(begun, { kind: 'convergence', fight: 1 }, null)).toBe('Fight 1 is next')
    // The world's parties change freely between fights; the attempt's don't.
    const moved = setPartySlot(begun, 4, 0, '116', T(3))
    const fight0 = startRiftFight(moved, { kind: 'convergence', fight: 0 }, 2, OUTFITS, ROSTER, T(4))
    expect(world1(fight0).rift.battle!.input.allies.map((a) => a.id)).toEqual(ids(116, 5))
    roundTrip(fight0)

    const lost = play(doom(fight0))
    expect(lost.result).toMatchObject({ outcome: 'loss', attempt: null, runWon: false })
    expect(world1(lost.save).rift.runs[0]!.convergence).toEqual({ attempts: 1, open: null })
    expect(riftFightBlock(lost.save, { kind: 'convergence', fight: 0 }, null)).toBe('Begin an attempt first')

    const again = beginConvergence(setPartySlot(lost.save, 3, 0, '116', T(399)), [3, 2, 1, 0], T(400))
    expect(world1(again).rift.runs[0]!.convergence.attempts).toBe(2)
    expect(riftFightBlock(again, { kind: 'convergence', fight: 0 }, null)).toBeNull()
    const left = leaveRiftFight(startRiftFight(again, { kind: 'convergence', fight: 0 }, null, OUTFITS, ROSTER, T(401)), T(402))
    expect(world1(left).rift.runs[0]!.convergence).toEqual({ attempts: 2, open: null })
    expect(world1(left).rift.battle).toBeNull()

    const third = beginConvergence(left, [3, 2, 1, 0], T(403))
    expect(world1(abandonConvergence(third, T(404))).rift.runs[0]!.convergence).toEqual({ attempts: 3, open: null })
    const fighting = startRiftFight(third, { kind: 'convergence', fight: 0 }, null, OUTFITS, ROSTER, T(405))
    expect(() => abandonConvergence(fighting, T(406))).toThrow('Leave the open fight first')
    expect(() => abandonConvergence(left, T(406))).toThrow('No attempt is on')
  })

  it('four wins in a row win the run and conquer the Rift', () => {
    let save = beginConvergence(sealed(signedUp()), [0, 1, 2, 3], T(2))
    const results = []
    for (let fight = 0; fight < 4; fight += 1) {
      save = startRiftFight(save, { kind: 'convergence', fight }, null, OUTFITS, ROSTER, T(10 + 100 * fight))
      expect(world1(save).rift.battle!.input.allies.map((a) => a.id)).toEqual(ids(101 + 5 * fight, 5))
      const won = play(weaken(save), 50 + 100 * fight)
      save = won.save
      results.push(won.result)
      if (fight < 3) roundTrip(save)
    }
    expect(results.map((r) => [r.attempt, r.runWon])).toEqual([[1, false], [2, false], [3, false], [4, true]])
    const run = world1(save).rift.runs[0]!
    expect(run.convergence.open).toBeNull()
    expect(run.wonAt).toBe(save.account.updatedAt)
    expect(results[3]!.earned.map((g) => g.id)).toContain('t1-rift-conquered')
    expect(riftFightBlock(save, IRON1, 0)).toBe('Sign up a run first')
    roundTrip(save)
  })
})

describe('Echoes (§8, R6)', () => {
  const echo = (level: '45' | '50' | '55'): RiftFightRef => ({ kind: 'echo', front: 'iron', level })

  it('take any full party of Lv 50 Umas while the Rift is open, no run needed', () => {
    const save = riftWorldSave()
    expect(riftFightBlock(save, echo('50'), 4)).toBeNull()
    expect(riftFightBlock(edit(save, (w) => { w.umas['121']!.level = 49 }), echo('50'), 4)).toBe('Needs five Lv 50 Umas')
    expect(riftFightBlock(save, { kind: 'echo', front: 'iron', level: '60' as '50' }, 4)).toBe('No such fight')
  })

  it('pay 2× a stage’s Class rank EXP, Class Marks past the cap, and nothing else (R2 retired the gear bars, H82)', () => {
    // Uma 121 at Class Rank 50; 122 a Hero with a Bond.
    const base = edit(riftWorldSave(), (w) => {
      const u = w.umas['121']!
      u.ranks = { ...u.ranks, classes: { brawler: { rank: 50, exp: 0 } } }
      w.heroes = { 'mage-1': { hero: '122', learners: [] } }
      w.umas['122']!.bonds = { 'mage-1': { level: 2, exp: 5 } }
    })
    const started = startRiftFight(base, echo('50'), 4, OUTFITS, ROSTER, T(2))
    const input = world1(started).rift.battle!.input
    expect(input.enemies[0]!.level).toBe(echoFoeLevel(1, '50'))
    const won = play(weaken(started))
    const E = rpgBattleExp('fight', 50, 50)
    const w = world1(won.save)
    expect(won.result).toMatchObject({ outcome: 'victory', cleared: null, attempt: null, runWon: false })
    expect(won.result.members).toHaveLength(5)
    for (const m of won.result.members) {
      const ally = input.allies.find((a) => a.id === m.outfitId)!
      expect(m).toMatchObject({ exp: 0, beforeLevel: 50, afterLevel: 50, afterExp: 0, shards: 0, bonds: [] })
      const gain = (kind: string, id: string) => m.ranks.find((g) => g.ref.kind === kind && g.ref.id === id)?.exp
      expect(gain('class', ally.classId)).toBe(ECHO_RANK_PAY * CLASS_EXP_SHARE * E)
      expect(m.ranks.every((g) => g.ref.kind === 'class')).toBe(true)
    }
    // 121's class bar is capped: its 4E banks at half as Class Marks; no Gear Marks (v28's wallet has none).
    expect(won.result.classMarks).toBe(Math.floor(ECHO_RANK_PAY * CLASS_EXP_SHARE * E * 0.5))
    expect(won.result.gearMarks).toBe(0)
    expect(w.wallet).toEqual({ ...world1(base).wallet, classMarks: won.result.classMarks })
    expect(w.umas['122']!.bonds).toEqual({ 'mage-1': { level: 2, exp: 5 } })
    for (const id of ids(121, 5)) expect({ level: w.umas[id]!.level, exp: w.umas[id]!.exp }).toEqual({ level: 50, exp: 0 })
    expect(w.rift.echoes).toEqual({ iron: { '50': won.save.account.updatedAt } })
    roundTrip(won.save)

    // A second win keeps the first time.
    const again = play(weaken(startRiftFight(won.save, echo('50'), 4, OUTFITS, ROSTER, T(900))), 1000)
    expect(world1(again.save).rift.echoes).toEqual(w.rift.echoes)
  })

  it('pay Lv 45 at half of Lv 50, and Lv 55 the same as Lv 50', () => {
    const classGain = (level: '45' | '50' | '55') => {
      const won = play(weaken(startRiftFight(riftWorldSave(), echo(level), 4, OUTFITS, ROSTER, T(2))))
      return won.result.members[0]!.ranks[0]!.exp
    }
    const e45 = rpgBattleExp('fight', 45, 50), e50 = rpgBattleExp('fight', 50, 50)
    expect(e45).toBe(Math.round(e50 / 2))
    expect(classGain('45')).toBe(ECHO_RANK_PAY * CLASS_EXP_SHARE * e45)
    expect(classGain('50')).toBe(ECHO_RANK_PAY * CLASS_EXP_SHARE * e50)
    expect(classGain('55')).toBe(classGain('50'))
    expect(echoFoeLevel(1, '55')).toBe(50)
    expect(echoFoeLevel(2, '45')).toBe(95)
  })
})

describe('Sweeps of won Echoes (§8)', () => {
  it('are refused before a win and without tickets, and pay as many Echo wins as tickets spent, Class Rank only', () => {
    const save = edit(riftWorldSave(), (w) => { w.wallet.sweepTickets = 5 })
    expect(sweepEchoBlock(save, 'iron', '50', 4)).toBe('Win it first')
    const won = play(weaken(startRiftFight(save, { kind: 'echo', front: 'iron', level: '50' }, 4, OUTFITS, ROSTER, T(2))))
    expect(sweepEchoBlock(edit(won.save, (w) => { w.wallet.sweepTickets = 0 }), 'iron', '50', 4)).toBe('No Sweep Tickets')
    expect(sweepEchoBlock(won.save, 'iron', '50', 3)).toBeNull()
    expect(sweepEchoBlock(edit(won.save, (w) => { w.umas['116']!.level = 49 }), 'iron', '50', 3)).toBe('Needs five Lv 50 Umas')

    const swept = sweepEcho(won.save, 'iron', '50', 3, 3, OUTFITS, T(800))
    const E = rpgBattleExp('fight', 50, 50)
    expect(swept.swept).toBe(3)
    expect(world1(swept.save).wallet.sweepTickets).toBe(2)
    expect(swept.result).toMatchObject({ outcome: 'victory', ref: { kind: 'echo', front: 'iron', level: '50' }, rounds: 0, earned: [], swept: 3 })
    const m = swept.result.members.find((x) => x.outfitId === '116')!
    const uma = world1(won.save).umas['116']!
    expect(m.ranks.find((g) => g.ref.kind === 'class')!.exp).toBe(3 * ECHO_RANK_PAY * CLASS_EXP_SHARE * E)
    // R2 retired the gear bars (H82): a Sweep pays her Class bar alone.
    expect(m.ranks.every((g) => g.ref.kind === 'class')).toBe(true)
    expect(world1(swept.save).umas['116']!.ranks.classes[uma.classId!]).toEqual(m.ranks.find((g) => g.ref.kind === 'class')!.after)
    expect(swept.save.account.defeated).toEqual(won.save.account.defeated)
    expect(swept.save.account.achievements).toEqual(won.save.account.achievements)
    roundTrip(swept.save)

    // It stops when the tickets run out.
    expect(sweepEcho(swept.save, 'iron', '50', 3, 5, OUTFITS, T(801)).swept).toBe(2)
    expect(() => sweepEcho(swept.save, 'iron', '50', 3, 0, OUTFITS, T(801))).toThrow('sweep 1–99 times')
  })
})

describe('riftTraces (§7)', () => {
  /** A Lv 50 regular striker, her HP and ATK set. */
  const foe = (hp: number, atk: number) => {
    const f = rpgFoe({ id: 'f1', castId: 'al-boss-1', element: 'fire', role: 'striker', rank: 'regular', level: 50, shield: 1, weaknesses: { weapons: [], elements: ['ice'] } })
    return { ...f, stats: { ...f.stats, hp, atk, matk: 0 } }
  }
  /** Five Lv 50 Brawlers, each with `extra`. */
  const brawlers = (extra: (b: BattleInput['allies'][number]) => Partial<BattleInput['allies'][number]> = () => ({})) =>
    [1, 2, 3, 4, 5].map((i) => { const b = balanceMember('brawler', i, 50, { engine: 14 }); return { ...b, ...extra(b) } })
  const input = (allies: BattleInput['allies'], hp: number, atk: number): BattleInput => ({ version: 14, seed: 1, allies, enemies: [foe(hp, atk)] })
  /** `rounds` rounds of every Uma attacking the foe, or guarding the next Uma. */
  const rounds = (allies: BattleInput['allies'], kind: 'attack' | 'guard', n: number): BattleAction[] => Array.from({ length: n }, () => allies.map((a, i): BattleAction =>
    kind === 'attack' ? { kind: 'attack', actorId: a.id, targetId: 'f1' } : { kind: 'guard', actorId: a.id, targetId: allies[(i + 1) % allies.length]!.id })).flat()

  it('reads physical damage an Uma dealt, not a Thorns return, and a knocked-out Uma', () => {
    const party = brawlers()
    expect(riftTraces(input(party, 10_000_000, 1), rounds(party, 'attack', 2))).toEqual(['physical'])
    // Umas with Thorns guarding each other: the foe's hits come back as Thorns, which isn't damage the party dealt.
    const thorny = brawlers(() => ({ thorns: 500 }))
    const fight = input(thorny, 10_000_000, 200)
    const moves = rounds(thorny, 'guard', 2)
    expect(replayBattle(fight, moves).cues.some((c) => c.kind === 'hit' && c.label === 'Thorns')).toBe(true)
    expect(riftTraces(fight, moves)).toEqual([])
    const frail = brawlers((b) => ({ stats: { ...b.stats, hp: 1 } }))
    expect(riftTraces(input(frail, 10_000_000, 5000), rounds(frail, 'attack', 1))).toEqual(['physical', 'ko'])
  })
})

describe('Ascend (tiers.md §5, R7)', () => {
  /** A won run of 101–120: parties 0–2 hold 101–115 ("Iron Team" first), party 3 holds 116–119 and 121, 120 is in no
   * party; 101 is a Hero with Learners 102 and 125, 103 learns under 124, and 101 and 121 are targets. */
  function wonRun(): Save {
    const save = signedUp()
    return edit(save, (w) => {
      w.parties[0]!.name = 'Iron Team'
      w.parties[3]!.slots = ['116', '117', '118', '119', '121']
      w.parties[4]!.slots = ['122', '123', '124', '125', null]
      w.world.activeParty = 2
      const run = w.rift.runs[0]!
      Object.assign(run, { fronts: { iron: 12, arcane: 12, duel: 12, horde: 12 }, convergence: { attempts: 1, open: null }, wonAt: T(50) })
      w.heroes = { 'brawler-1': { hero: '101', learners: ['102', '125'] }, 'mage-2': { hero: '124', learners: ['103'] } }
      w.umas['101']!.bonds = { 'brawler-1': { level: 4, exp: 0 } }
      w.umas['102']!.bonds = { 'brawler-1': { level: 1, exp: 0 } }
      w.targets = ['101', '121']
      w.world.run.mp = { '101': 3, '121': 4 }
      w.umas['101']!.exp = 12_345
      w.umas['102']!.exp = 30_000
      w.umas['101']!.classes = { brawler: { weapons: ['greatsword', 'axe', 'lance'], lines: {}, loadout: null } }
      w.work = { '103': { outfitId: '103', slot: null, entries: [], queue: [], last: null, dropped: null } }
    })
  }

  it('is blocked before the win, by an open Rift or world-map fight, by a working Uma, and once ascended', () => {
    const save = wonRun()
    roundTrip(save)
    expect(ascendBlock(signedUp())).toBe('Win the Rift first')
    const fullFive = edit(save, (w) => { w.parties[4]!.slots[4] = '121'; w.parties[3]!.slots[4] = null })
    expect(ascendBlock(startRiftFight(fullFive, { kind: 'echo', front: 'iron', level: '50' }, 4, OUTFITS, ROSTER, T(60)))).toBe('Finish the open Rift fight first')
    const mapFight = edit(save, (w) => { w.world.run.battle = { battleId: 'battle:0:world:1', nodeId: 'w1-1-1-s1', startedAt: T(60), input: {} as never, actions: [] } })
    expect(ascendBlock(mapFight)).toBe('Finish the open fight first')
    const working = edit(save, (w) => { w.work['105'] = { outfitId: '105', slot: { building: 'mine', slot: 0 }, entries: [{} as never], queue: [], last: null, dropped: null } })
    expect(ascendBlock(working)).toBe('Recall or collect: 105')
    expect(ascendBlock(working, '1', (id) => `Uma ${id}`)).toBe('Recall or collect: Uma 105')
    expect(() => ascend(working, T(70))).toThrow('Recall or collect: 105')
    const done = ascend(save, T(70)).save
    expect(ascendBlock(done)).toBe('Win the Rift first')
    expect(() => ascend(done, T(71))).toThrow('Win the Rift first')
  })

  it('moves the twenty to Tier 2 at Lv 1 in one transaction, with the purse, their banked EXP as Marks and their parties', () => {
    const save = wonRun()
    const before = world1(save)
    const { save: after, summary } = ascend(save, T(70))
    expect(bankedMarks(12_345)).toBe(1_234)
    expect(bankedMarks(30_000)).toBe(2_000)
    expect(summary).toEqual({ from: 1, to: 2, umas: TWENTY, laurels: 20_000, speedTickets: 100, classMarks: 3_234 })

    // The old world: they're gone from every list (their grades and made items: `ascend-v3.test.ts`).
    const old = world1(after)
    expect(Object.keys(old.umas).sort()).toEqual(ids(121, 5))
    expect(old.parties.slice(0, 5).map((p) => [p.name, p.slots])).toEqual([
      ['Party 1', [null, null, null, null, null]], ['Party 2', [null, null, null, null, null]], ['Party 3', [null, null, null, null, null]],
      ['Party 4', [null, null, null, null, '121']], ['Party 5', ['122', '123', '124', '125', null]],
    ])
    expect(old.world.activeParty).toBe(2)
    expect(old.targets).toEqual(['121'])
    expect(old.world.run.mp).toEqual({ '121': 4 })
    expect(old.work).toEqual({})
    // 101's seat empties and sends its Learner 125 away; 103 leaves 124's seat.
    expect(old.heroes).toEqual({ 'mage-2': { hero: '124', learners: [] } })
    expect(old.wallet).toEqual(before.wallet)
    expect(old.rift.runs[0]!.ascendedAt).toBe(T(70))

    // The new world: Lv 1, Class Rank 1, no skills, every grade G0, an empty map, Craft Lv 1, no Bonds; her class kept.
    const up = worldOf(after, '2')
    expect(Object.keys(up.umas).sort()).toEqual(TWENTY)
    expect(up.umas['101']).toEqual({ ...newOwnedUma(T(0)), classId: 'brawler' })
    expect(up.umas['102']).toEqual({ ...newOwnedUma(T(0)), classId: 'mage' })
    expect(up.wallet).toEqual({ ...newTierWorld(T(70), 0).wallet, laurels: 20_000, timeTickets: 100, classMarks: 3_234 })
    expect(up.parties.slice(0, 5).map((p) => [p.name, p.slots])).toEqual([
      ['Iron Team', ids(101, 5)], ['Party 2', ids(106, 5)], ['Party 3', ids(111, 5)], ['Party 4', ids(116, 5)], ['Party 5', [null, null, null, null, null]],
    ])
    expect(up.world.activeParty).toBe(0)
    expect(up.heroes).toEqual({})

    // The record.
    expect(after.account.history['101']).toEqual([{ tier: 2, at: T(70), run: 't1-r1' }])
    expect(Object.keys(after.account.history).sort()).toEqual(TWENTY)
    roundTrip(after)
  })

  it('lands in an existing Tier 2 world: whole parties into its first empty ones, the rest after them', () => {
    const save = wonRun()
    save.tierWorlds['2'] = { ...newTierWorld(T(0), 0), umas: { '201': newOwnedUma(T(0)) }, wallet: { ...newTierWorld(T(0), 0).wallet, laurels: 5000 } }
    save.tierWorlds['2'].parties[0]!.slots[0] = '201'
    const up = worldOf(ascend(save, T(70)).save, '2')
    expect(up.parties.slice(0, 6).map((p) => [p.name, p.slots[0]])).toEqual([
      ['Party 1', '201'], ['Iron Team', '101'], ['Party 2', '106'], ['Party 3', '111'], ['Party 5', '116'], ['Party 6', null],
    ])
    expect(up.wallet.laurels).toBe(25_000)
    expect(up.umas['201']).toBeDefined()
  })
})

describe('the strict parser takes everything the rules write', () => {
  it('round-trips an open run with a won stage, an open attempt, an Echo win and an Ascend', () => {
    const won = play(weaken(startRiftFight(signedUp(), IRON1, 0, OUTFITS, ROSTER, T(2))))
    roundTrip(won.save)
    const attempt = beginConvergence(sealed(won.save), [0, 1, 2, 3], T(300))
    roundTrip(attempt)
    const echo = play(weaken(startRiftFight(attempt, { kind: 'echo', front: 'arcane', level: '55' }, 4, OUTFITS, ROSTER, T(301))), 400)
    roundTrip(echo.save)
    const step = riftBattleStep(world1(startRiftFight(echo.save, { kind: 'convergence', fight: 0 }, null, OUTFITS, ROSTER, T(600))))
    expect(step?.state.outcome).toBe('active')
    const action = actInRiftFight(startRiftFight(echo.save, { kind: 'convergence', fight: 0 }, null, OUTFITS, ROSTER, T(600)),
      { kind: 'guard', actorId: '101', targetId: '102' }, ROSTER, T(601))
    roundTrip(action.save)
  })
})
