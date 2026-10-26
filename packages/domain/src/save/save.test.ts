import { describe, expect, it } from 'vitest'
import { newSave, normalizeTrainerName, parseSave, parseSavePut, renameTrainer, resolveConflict, SaveParseError, STARTING_UNLOCK_TICKETS, SAVE_SCHEMA_VERSION } from './save'
import { convergenceSave, RIFT_TIMES, riftSave, TIER1_ROSTER, TIER2_ROSTER } from './rift.fixture'

const NOW = '2026-10-10T12:00:00.000Z'
const LATER = '2026-10-10T13:00:00.000Z'

describe('save', () => {
  it('starts Tier 1 with 20 Uma Tickets and nothing else', () => {
    const save = newSave('  Luis  ', NOW)
    expect(save.account.trainerName).toBe('Luis')
    expect(save.tierWorlds['1']?.wallet).toEqual({ unlockTickets: STARTING_UNLOCK_TICKETS, shards: 0, laurels: 0, timeTickets: 0, sweepTickets: 0, classMarks: 0 })
    expect(STARTING_UNLOCK_TICKETS).toBe(20)
  })

  it('falls back to the default name when the given one is unusable', () => {
    expect(newSave('   ', NOW).account.trainerName).toBe('Trainer')
  })

  it('normalizes trainer names and enforces 1–24 characters', () => {
    expect(normalizeTrainerName('  Quiet   Harbor ')).toBe('Quiet Harbor')
    expect(normalizeTrainerName('')).toBeNull()
    expect(normalizeTrainerName('x'.repeat(25))).toBeNull()
    expect(normalizeTrainerName('x'.repeat(24))).toHaveLength(24)
  })

  it('round-trips through the parser', () => {
    const save = newSave('Luis', NOW)
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
  })

  it('rejects unknown keys, a missing Tier 1, bad counts and untrimmed names', () => {
    const save = newSave('Luis', NOW)
    expect(() => parseSave({ ...save, extra: 1 })).toThrow(SaveParseError)
    expect(() => parseSave({ ...save, tierWorlds: {} })).toThrow(/tier 1 is required/)
    expect(() => parseSave({ ...save, tierWorlds: { '1': { ...save.tierWorlds['1'], wallet: { unlockTickets: -1, shards: 0, laurels: 0 } } } })).toThrow(/unlockTickets/)
    expect(() => parseSave({ ...save, tierWorlds: { x: save.tierWorlds['1'] } })).toThrow(/positive integers/)
    expect(() => parseSave({ ...save, account: { ...save.account, trainerName: ' Luis' } })).toThrow(/trainerName/)
    expect(() => parseSave({ ...save, schemaVersion: SAVE_SCHEMA_VERSION + 1 })).toThrow(/schemaVersion/)
  })

  it('parses a PUT body', () => {
    const save = newSave('Luis', NOW)
    expect(parseSavePut({ baseRevision: 3, save }).baseRevision).toBe(3)
    expect(() => parseSavePut({ baseRevision: 1.5, save })).toThrow(/baseRevision/)
  })

  it('renames and stamps updatedAt', () => {
    const renamed = renameTrainer(newSave('Luis', NOW), 'Trainer Luis', LATER)
    expect(renamed.account).toMatchObject({ trainerName: 'Trainer Luis', updatedAt: LATER, createdAt: NOW })
    expect(() => renameTrainer(newSave('Luis', NOW), ' ', LATER)).toThrow(SaveParseError)
  })

  it('keeps the most recently changed save on a conflict', () => {
    const a = newSave('A', NOW)
    const b = renameTrainer(newSave('B', NOW), 'B2', LATER)
    expect(resolveConflict(a, b)).toBe(b)
    expect(resolveConflict(b, a)).toBe(b)
  })
})

/** JSON copies of the populated v24 fixtures, to edit. */
const rift = (): any => JSON.parse(JSON.stringify(riftSave()))
const convergence = (): any => JSON.parse(JSON.stringify(convergenceSave()))
const [T0, T1, T2, T3, T4] = RIFT_TIMES

describe('save v23–v24: achievements, tier history, defeated faces and the Rift (D163, D171)', () => {
  it('starts with no achievements, history or defeated faces, an empty Rift and no Rift fight, and round-trips', () => {
    const save = newSave('Luis', NOW)
    expect(save.schemaVersion).toBe(SAVE_SCHEMA_VERSION)
    expect(save.account).toMatchObject({ achievements: {}, history: {}, defeated: {} })
    expect(save.tierWorlds['1']!.rift).toEqual({ runs: [], echoes: {}, battle: null, battles: 0 })
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
  })

  it('round-trips a Rift in use: a run ascended into Tier 2, an open one with traces and an open front fight, an Echo win, achievements, history and defeated faces', () => {
    const save = riftSave()
    const parsed = parseSave(rift())
    expect(parsed).toEqual(save)
    expect(parseSave(JSON.parse(JSON.stringify(parsed)))).toEqual(save)
    const r = parsed.tierWorlds['1']!.rift
    expect(r.runs.map((run) => run.id)).toEqual(['t1-r1', 't1-r2'])
    expect(r.runs[1]!.fronts).toEqual({ iron: 12, arcane: 3, duel: 0, horde: 0 })
    expect(r.runs[1]!.traces).toEqual({ iron: ['physical'], arcane: ['magical', 'ko'] })
    expect(r.runs[1]!.convergence).toEqual({ attempts: 0, open: null })
    expect(r.echoes).toEqual({ iron: { '50': T1 } })
    expect(r.battles).toBe(3)
    expect(r.battle).toMatchObject({ battleId: 'rift:t1:3', ref: { kind: 'front', front: 'arcane', stage: 4 }, startedAt: T4 })
    expect(r.battle!.input.allies.map((a) => a.id)).toEqual(['101', '102', '103', '104', '105'])
    expect(r.battle!.actions).toHaveLength(2)
    expect(parsed.account.achievements).toEqual({ 't1-rift-conquered': { at: T2, run: 't1-r1' }, bestiary: { at: T4, run: null } })
    expect(Object.keys(parsed.account.history)).toEqual(TIER2_ROSTER)
    expect(parsed.account.history['201']).toEqual([{ tier: 2, at: T3, run: 't1-r1' }])
    expect(parsed.account.defeated).toEqual({ 'boss-a': T1, 'subboss-b': T4 })
  })

  it('round-trips an open Convergence attempt and its second fight, taken by its second party', () => {
    const save = convergenceSave()
    const parsed = parseSave(convergence())
    expect(parsed).toEqual(save)
    expect(parseSave(JSON.parse(JSON.stringify(parsed)))).toEqual(save)
    const r = parsed.tierWorlds['1']!.rift, open = r.runs[1]!.convergence.open!
    expect(r.runs[1]!.convergence.attempts).toBe(1)
    expect(open.parties).toHaveLength(4)
    expect(open.parties.flat().sort()).toEqual([...TIER1_ROSTER].sort())
    expect(open.rounds).toEqual([6])
    expect(r.battle).toMatchObject({ battleId: 'rift:t1:4', ref: { kind: 'convergence', fight: 1 } })
    expect(r.battle!.input.allies.map((a) => a.id)).toEqual(open.parties[1])
  })

  it('accepts an Echo fight by any party of Umas owned here, with or without a run', () => {
    const s = rift()
    s.tierWorlds['1'].rift.battle.ref = { kind: 'echo', front: 'duel', level: '55' }
    expect(parseSave(s).tierWorlds['1']!.rift.battle!.ref).toEqual({ kind: 'echo', front: 'duel', level: '55' })
    s.tierWorlds['1'].rift.runs.pop()
    expect(parseSave(s).tierWorlds['1']!.rift.battle!.ref.kind).toBe('echo')
  })

  it('accepts traces as an empty list on a front with a stage cleared', () => {
    const s = rift()
    s.tierWorlds['1'].rift.runs[1].traces.iron = []
    expect(parseSave(s).tierWorlds['1']!.rift.runs[1]!.traces.iron).toEqual([])
  })

  const R = 'save\\.tierWorlds\\.1\\.rift', RUN = `${R}\\.runs`, A = 'save\\.account'
  const refusals: [string, (s: ReturnType<typeof rift>) => void, string][] = [
    // The account
    ['an unknown key in the account', (s) => { s.account.titles = {} }, `${A}: unknown keys titles`],
    ['an account missing achievements', (s) => { delete s.account.achievements }, `${A}\\.achievements: expected an object`],
    ['more than 200 achievements', (s) => { for (let i = 0; i < 200; i++) s.account.achievements[`a${i}`] = { at: T0, run: null } }, `${A}\\.achievements: expected at most 200`],
    ['an achievement id that isn\'t kebab-case', (s) => { s.account.achievements['Rift Conquered'] = { at: T0, run: null } }, `${A}\\.achievements\\.Rift Conquered: achievement ids are kebab-case`],
    ['an achievement id over 48 characters', (s) => { s.account.achievements['a'.repeat(49)] = { at: T0, run: null } }, 'achievement ids are kebab-case, 1–48 characters'],
    ['an unknown key in an achievement', (s) => { s.account.achievements.bestiary.tier = 1 }, `${A}\\.achievements\\.bestiary: unknown keys tier`],
    ['an achievement without a time', (s) => { s.account.achievements.bestiary.at = 'soon' }, `${A}\\.achievements\\.bestiary\\.at: expected an ISO timestamp`],
    ['an achievement without its run key', (s) => { delete s.account.achievements.bestiary.run }, `${A}\\.achievements\\.bestiary\\.run: expected a run id`],
    ['an achievement whose run doesn\'t exist', (s) => { s.account.achievements['t1-rift-conquered'].run = 't1-r3' }, `${A}\\.achievements\\.t1-rift-conquered\\.run: no run t1-r3`],
    ['an achievement in a world that doesn\'t exist', (s) => { s.account.achievements['t1-rift-conquered'].run = 't3-r1' }, `${A}\\.achievements\\.t1-rift-conquered\\.run: no run t3-r1`],
    ['an achievement id outside the catalog', (s) => { s.account.achievements['seal-fire'] = { at: T0, run: null } }, `${A}\\.achievements\\.seal-fire: not in the achievement catalog`],
    ['D163\'s untiered "rift-conquered"', (s) => { s.account.achievements['rift-conquered'] = { at: T2, run: 't1-r1' } }, `${A}\\.achievements\\.rift-conquered: not in the achievement catalog`],
    ['a seal of a tier with no Rift', (s) => { s.account.achievements['t3-seal-iron'] = { at: T2, run: 't1-r1' } }, `${A}\\.achievements\\.t3-seal-iron: not in the achievement catalog`],
    // Defeated faces
    ['an account missing its defeated faces', (s) => { delete s.account.defeated }, `${A}\\.defeated: expected an object`],
    ['defeated faces as a list', (s) => { s.account.defeated = ['boss-a'] }, `${A}\\.defeated: expected an object`],
    ['more than 2,000 defeated faces', (s) => { for (let i = 0; i < 2000; i++) s.account.defeated[`c${i}`] = T0 }, `${A}\\.defeated: expected at most 2000`],
    ['a defeated key with a space', (s) => { s.account.defeated['boss a'] = T0 }, `${A}\\.defeated\\.boss a: not a cast id`],
    ['a defeated key starting with a dash', (s) => { s.account.defeated['-boss'] = T0 }, `${A}\\.defeated\\.-boss: not a cast id`],
    ['a defeated face without a time', (s) => { s.account.defeated['boss-a'] = 'yesterday' }, `${A}\\.defeated\\.boss-a: expected an ISO timestamp`],
    // Tier history
    ['a history key that isn\'t an outfit id', (s) => { s.account.history.abc = s.account.history['201'] }, `${A}\\.history\\.abc: outfit ids are positive integers`],
    ['an empty history', (s) => { s.account.history['201'] = [] }, `${A}\\.history\\.201: expected 1–10 entries`],
    ['more than ten promotions', (s) => { s.account.history['201'] = Array.from({ length: 11 }, (_, i) => ({ tier: i + 2, at: T3, run: 't1-r1' })) }, `${A}\\.history\\.201: expected 1–10 entries`],
    ['an unknown key in a history entry', (s) => { s.account.history['201'][0].party = 0 }, `${A}\\.history\\.201\\.0: unknown keys party`],
    ['a history entry at tier 1', (s) => { s.account.history['201'][0].tier = 1 }, `${A}\\.history\\.201\\.0\\.tier: expected 2 or more`],
    ['tiers that don\'t climb', (s) => { s.account.history['201'].push({ tier: 2, at: T3, run: 't1-r1' }) }, `${A}\\.history\\.201\\.1\\.tier: expected above the entry before`],
    ['a promotion before the one before it', (s) => { s.account.history['201'].push({ tier: 3, at: T0, run: 't2-r1' }) }, `${A}\\.history\\.201\\.1\\.at: before the entry before`],
    ['a history entry naming no run', (s) => { s.account.history['201'][0].run = 'ascended' }, `${A}\\.history\\.201\\.0\\.run: expected a run id`],
    ['a history entry naming an open run', (s) => { s.account.history['201'][0].run = 't1-r2' }, `${A}\\.history\\.201\\.0\\.run: run t1-r2 hasn't ascended`],
    ['a history entry naming a run of the wrong tier', (s) => { s.account.history['201'][0].run = 't2-r1' }, `${A}\\.history\\.201\\.0\\.run: expected a Tier 1 run`],
    ['a history entry naming a run that doesn\'t exist', (s) => { s.account.history['201'][0].run = 't1-r3' }, `${A}\\.history\\.201\\.0\\.run: expected a Tier 1 run`],
    ['a history entry whose run lacks her', (s) => { s.tierWorlds['2'].umas['301'] = s.tierWorlds['2'].umas['201']; s.account.history['301'] = s.account.history['201'] },
      `${A}\\.history\\.301\\.0\\.run: outfit 301 isn't on run t1-r1's roster`],
    ['her last tier not where she lives', (s) => { delete s.tierWorlds['2'].umas['220'] }, `${A}\\.history\\.220: expected her in Tier 2`],
    // The Rift
    ['an unknown key in the Rift', (s) => { s.tierWorlds['1'].rift.seals = {} }, `${R}: unknown keys seals`],
    ['more than 1,000 runs', (s) => { s.tierWorlds['1'].rift.runs = Array.from({ length: 1001 }, () => s.tierWorlds['1'].rift.runs[0]) }, `${RUN}: expected 0–1000 entries`],
    ['an unknown key in a run', (s) => { s.tierWorlds['1'].rift.runs[0].party = 0 }, `${RUN}\\.0: unknown keys party`],
    ['an unknown key in the Convergence', (s) => { s.tierWorlds['1'].rift.runs[0].convergence.best = 3 }, `${RUN}\\.0\\.convergence: unknown keys best`],
    ['a run id out of place', (s) => { s.tierWorlds['1'].rift.runs[0].id = 't1-r2' }, `${RUN}\\.0\\.id: expected t1-r1`],
    ['a run id of another tier', (s) => { s.tierWorlds['1'].rift.runs[1].id = 't2-r2' }, `${RUN}\\.1\\.id: expected t1-r2`],
    ['a roster of 19', (s) => { s.tierWorlds['1'].rift.runs[1].roster.pop() }, `${RUN}\\.1\\.roster: expected 20 outfit ids`],
    ['a roster of 21', (s) => { s.tierWorlds['1'].rift.runs[1].roster.push('999') }, `${RUN}\\.1\\.roster: expected at most 20 ids`],
    ['duplicate roster ids', (s) => { s.tierWorlds['1'].rift.runs[1].roster[19] = '101' }, `${RUN}\\.1\\.roster: duplicate ids`],
    ['a roster id that isn\'t an outfit id', (s) => { s.tierWorlds['1'].rift.runs[0].roster[19] = 'x' }, `${RUN}\\.0\\.roster: outfit ids are positive integers`],
    ['a front at 13', (s) => { s.tierWorlds['1'].rift.runs[1].fronts.iron = 13 }, `${RUN}\\.1\\.fronts\\.iron: expected 0–12`],
    ['an unknown front in a run', (s) => { s.tierWorlds['1'].rift.runs[1].fronts.fire = 0 }, `${RUN}\\.1\\.fronts: unknown keys fire`],
    ['a run missing a front', (s) => { delete s.tierWorlds['1'].rift.runs[1].fronts.horde }, `${RUN}\\.1\\.fronts\\.horde: expected a non-negative integer`],
    ['negative Convergence attempts', (s) => { s.tierWorlds['1'].rift.runs[1].convergence.attempts = -1 }, `${RUN}\\.1\\.convergence\\.attempts: expected a non-negative integer`],
    ['a run without its wonAt key', (s) => { delete s.tierWorlds['1'].rift.runs[1].wonAt }, `${RUN}\\.1\\.wonAt: expected an ISO timestamp`],
    ['wonAt with a front below 12', (s) => { s.tierWorlds['1'].rift.runs[0].fronts.duel = 11 }, `${RUN}\\.0\\.wonAt: every front must be sealed first`],
    ['wonAt with no Convergence attempt', (s) => { s.tierWorlds['1'].rift.runs[0].convergence.attempts = 0 }, `${RUN}\\.0\\.wonAt: the Convergence was never attempted`],
    ['wonAt before the run started', (s) => { s.tierWorlds['1'].rift.runs[0].startedAt = T4 }, `${RUN}\\.0\\.wonAt: before the run started`],
    ['ascendedAt without wonAt', (s) => { s.tierWorlds['1'].rift.runs[0].wonAt = null }, `${RUN}\\.0\\.ascendedAt: the run must be won first`],
    ['ascendedAt before wonAt', (s) => { s.tierWorlds['1'].rift.runs[0].ascendedAt = T1 }, `${RUN}\\.0\\.ascendedAt: before the run was won`],
    ['two open runs', (s) => { s.tierWorlds['1'].rift.runs[0].ascendedAt = null }, `${RUN}\\.0\\.ascendedAt: only the last run may be open`],
    ['an open run\'s Uma not owned', (s) => { s.tierWorlds['1'].rift.runs[1].roster[0] = '999' }, `${RUN}\\.1\\.roster: outfit 999 isn't owned in this world`],
    ['an Echo front fire', (s) => { s.tierWorlds['1'].rift.echoes.fire = {} }, `${R}\\.echoes: unknown keys fire`],
    ['an Echo level 60', (s) => { s.tierWorlds['1'].rift.echoes.iron['60'] = T1 }, `${R}\\.echoes\\.iron: unknown keys 60`],
    ['an Echo win that isn\'t a time', (s) => { s.tierWorlds['1'].rift.echoes.iron['50'] = true }, `${R}\\.echoes\\.iron\\.50: expected an ISO timestamp`],
    // The Rift's fight count
    ['a Rift without its fight count', (s) => { delete s.tierWorlds['1'].rift.battles }, `${R}\\.battles: expected a non-negative integer`],
    ['a negative fight count', (s) => { s.tierWorlds['1'].rift.battles = -1 }, `${R}\\.battles: expected a non-negative integer`],
    // A run's traces
    ['a run without traces', (s) => { delete s.tierWorlds['1'].rift.runs[1].traces }, `${RUN}\\.1\\.traces: expected an object`],
    ['traces on a front fire', (s) => { s.tierWorlds['1'].rift.runs[1].traces.fire = ['physical'] }, `${RUN}\\.1\\.traces: unknown keys fire`],
    ['a trace that isn\'t one', (s) => { s.tierWorlds['1'].rift.runs[1].traces.iron = ['poison'] }, `${RUN}\\.1\\.traces\\.iron: expected a list of physical, magical, ko`],
    ['traces that aren\'t a list', (s) => { s.tierWorlds['1'].rift.runs[1].traces.iron = 'physical' }, `${RUN}\\.1\\.traces\\.iron: expected a list of physical, magical, ko`],
    ['a duplicate trace', (s) => { s.tierWorlds['1'].rift.runs[1].traces.iron = ['physical', 'physical'] }, `${RUN}\\.1\\.traces\\.iron: expected distinct traces in the order physical, magical, ko`],
    ['traces out of order', (s) => { s.tierWorlds['1'].rift.runs[1].traces.arcane = ['ko', 'magical'] }, `${RUN}\\.1\\.traces\\.arcane: expected distinct traces in the order`],
    ['traces on a front with 0 cleared', (s) => { s.tierWorlds['1'].rift.runs[1].traces.duel = ['physical'] }, `${RUN}\\.1\\.traces\\.duel: no stage of this front is cleared`],
    // The Convergence's open attempt
    ['a Convergence without its open attempt key', (s) => { delete s.tierWorlds['1'].rift.runs[1].convergence.open }, `${RUN}\\.1\\.convergence\\.open: expected an object`],
    ['an attempt on a run with fronts to clear', (s) => {
      s.tierWorlds['1'].rift.runs[1].convergence = { attempts: 1, open: { parties: [0, 5, 10, 15].map((i) => TIER1_ROSTER.slice(i, i + 5)), rounds: [] } }
    }, `${RUN}\\.1\\.convergence\\.open: every front must be sealed first`],
    ['an attempt on a won run', (s) => {
      s.tierWorlds['1'].rift.runs[0].convergence.open = { parties: [0, 5, 10, 15].map((i) => TIER2_ROSTER.slice(i, i + 5)), rounds: [] }
    }, `${RUN}\\.0\\.convergence\\.open: the run is already won`],
    // The open Rift fight
    ['an unknown key in the fight', (s) => { s.tierWorlds['1'].rift.battle.nodeId = 'arcane-4' }, `${R}\\.battle: unknown keys nodeId`],
    ['a Rift without its fight key', (s) => { delete s.tierWorlds['1'].rift.battle }, `${R}\\.battle: expected an object`],
    ['a fight id of another tier', (s) => { s.tierWorlds['1'].rift.battle.battleId = 'rift:t2:1' }, `${R}\\.battle\\.battleId: expected rift:t1:<n>, n from 1 to 3`],
    ['a fight id past the count', (s) => { s.tierWorlds['1'].rift.battle.battleId = 'rift:t1:4' }, `${R}\\.battle\\.battleId: expected rift:t1:<n>, n from 1 to 3`],
    ['a fight id of the world map', (s) => { s.tierWorlds['1'].rift.battle.battleId = 'world:3' }, `${R}\\.battle\\.battleId: expected rift:t1:<n>`],
    ['a fight with no time', (s) => { s.tierWorlds['1'].rift.battle.startedAt = 'now' }, `${R}\\.battle\\.startedAt: expected an ISO timestamp`],
    ['a fight of an unknown kind', (s) => { s.tierWorlds['1'].rift.battle.ref = { kind: 'boss', front: 'iron', stage: 1 } }, `${R}\\.battle\\.ref\\.kind: expected front, convergence or echo`],
    ['a ref with another shape\'s key', (s) => { s.tierWorlds['1'].rift.battle.ref.fight = 0 }, `${R}\\.battle\\.ref: unknown keys fight`],
    ['a ref that isn\'t an object', (s) => { s.tierWorlds['1'].rift.battle.ref = 'arcane:4' }, `${R}\\.battle\\.ref: expected an object`],
    ['a front fire', (s) => { s.tierWorlds['1'].rift.battle.ref.front = 'fire' }, `${R}\\.battle\\.ref\\.front: expected iron, arcane, duel, horde`],
    ['a stage 13', (s) => { s.tierWorlds['1'].rift.battle.ref.stage = 13 }, `${R}\\.battle\\.ref\\.stage: expected 1–12`],
    ['a stage 0', (s) => { s.tierWorlds['1'].rift.battle.ref.stage = 0 }, `${R}\\.battle\\.ref\\.stage: expected 1–12`],
    ['a Convergence fight 4', (s) => { s.tierWorlds['1'].rift.battle.ref = { kind: 'convergence', fight: 4 } }, `${R}\\.battle\\.ref\\.fight: expected 0–3`],
    ['an Echo at level 60', (s) => { s.tierWorlds['1'].rift.battle.ref = { kind: 'echo', front: 'iron', level: '60' } }, `${R}\\.battle\\.ref\\.level: expected 45, 50, 55`],
    ['an Echo level as a number', (s) => { s.tierWorlds['1'].rift.battle.ref = { kind: 'echo', front: 'iron', level: 55 } }, `${R}\\.battle\\.ref\\.level: expected 45, 50, 55`],
    ['a front fight for a stage already cleared', (s) => { s.tierWorlds['1'].rift.battle.ref.stage = 3 }, `${R}\\.battle\\.ref\\.stage: expected stage 4 of arcane`],
    ['a front fight past the next stage', (s) => { s.tierWorlds['1'].rift.battle.ref.stage = 5 }, `${R}\\.battle\\.ref\\.stage: expected stage 4 of arcane`],
    ['a front fight on a sealed front', (s) => { s.tierWorlds['1'].rift.battle.ref = { kind: 'front', front: 'iron', stage: 12 } }, `${R}\\.battle\\.ref\\.stage: iron is sealed`],
    ['a front fight with no open run', (s) => { s.tierWorlds['1'].rift.runs.pop() }, `${R}\\.battle\\.ref: no open run`],
    ['a front fight on a won run waiting for Ascend', (s) => {
      Object.assign(s.tierWorlds['1'].rift.runs[1], { fronts: { iron: 12, arcane: 12, duel: 12, horde: 12 }, convergence: { attempts: 1, open: null }, wonAt: T4 })
      s.tierWorlds['1'].rift.battle.ref = { kind: 'front', front: 'duel', stage: 1 }
    }, `${R}\\.battle\\.ref: no open run`],
    ['a Convergence fight with no open attempt', (s) => { s.tierWorlds['1'].rift.battle.ref = { kind: 'convergence', fight: 0 } }, `${R}\\.battle\\.ref: no open Convergence attempt`],
    ['a front fight by an Uma off the run\'s roster', (s) => { s.tierWorlds['1'].umas['121'] = s.tierWorlds['1'].umas['120']; s.tierWorlds['1'].rift.runs[1].roster[0] = '121' },
      `${R}\\.battle\\.input\\.allies\\.0: outfit 101 isn't on run t1-r2's roster`],
    ['a fight by an Uma not owned here', (s) => {
      const w = s.tierWorlds['1']
      w.umas['121'] = w.umas['101']; delete w.umas['101']; w.rift.runs[1].roster[0] = '121'
    }, `${R}\\.battle\\.input\\.allies\\.0: outfit 101 isn't owned in this world`],
    ['an Echo fight by an Uma of another tier', (s) => {
      const w = s.tierWorlds['1']
      w.rift.battle.ref = { kind: 'echo', front: 'iron', level: '45' }
      w.umas['121'] = w.umas['101']; delete w.umas['101']; w.rift.runs[1].roster[0] = '121'
      s.tierWorlds['2'].umas['101'] = s.tierWorlds['2'].umas['201']
    }, `${R}\\.battle\\.input\\.allies\\.0: outfit 101 isn't owned in this world`],
    ['an unknown action', (s) => { s.tierWorlds['1'].rift.battle.actions.push({ kind: 'flee', actorId: '103', targetId: 'f1' }) }, `${R}\\.battle\\.actions\\.2: unknown action`],
    ['an action with an unknown key', (s) => { s.tierWorlds['1'].rift.battle.actions[0].extra = 1 }, `${R}\\.battle\\.actions\\.0: unknown keys extra`],
    ['an action the engine refuses', (s) => { s.tierWorlds['1'].rift.battle.actions.push({ kind: 'guard', actorId: '101', targetId: '101' }) }, `${R}\\.battle\\.actions: an action was refused`],
    ['a fight input the engine refuses', (s) => { s.tierWorlds['1'].rift.battle.input.seed = -1 }, `${R}\\.battle\\.input: `],
  ]

  it.each(refusals)('refuses %s', (_, edit, message) => {
    const s = rift()
    edit(s)
    expect(() => parseSave(s)).toThrow(SaveParseError)
    expect(() => parseSave(s)).toThrow(new RegExp(message))
  })

  const OPEN = `${RUN}\\.1\\.convergence\\.open`
  const attemptRefusals: [string, (s: ReturnType<typeof convergence>) => void, string][] = [
    ['an unknown key in the attempt', (s) => { s.tierWorlds['1'].rift.runs[1].convergence.open.fight = 1 }, `${OPEN}: unknown keys fight`],
    ['an attempt of three parties', (s) => { s.tierWorlds['1'].rift.runs[1].convergence.open.parties.pop() }, `${OPEN}\\.parties: expected 4–4 entries`],
    ['an attempt of five parties', (s) => { s.tierWorlds['1'].rift.runs[1].convergence.open.parties.push([]) }, `${OPEN}\\.parties: expected 4–4 entries`],
    ['an attempt of 19 Umas', (s) => { s.tierWorlds['1'].rift.runs[1].convergence.open.parties[3].pop() }, `${OPEN}\\.parties\\.3: expected 5 outfit ids`],
    ['a party of six', (s) => { s.tierWorlds['1'].rift.runs[1].convergence.open.parties[3].push('121') }, `${OPEN}\\.parties\\.3: expected at most 5 ids`],
    ['an Uma in two parties', (s) => { s.tierWorlds['1'].rift.runs[1].convergence.open.parties[3][4] = '101' }, `${OPEN}\\.parties: an Uma in two parties`],
    ['an attempt with an Uma off the roster', (s) => { s.tierWorlds['1'].rift.runs[1].convergence.open.parties[3][4] = '999' }, `${OPEN}\\.parties: outfit 999 isn't on the run's roster`],
    ['an attempt on a run with a front at 11', (s) => { s.tierWorlds['1'].rift.runs[1].fronts.horde = 11 }, `${OPEN}: every front must be sealed first`],
    ['an attempt not counted', (s) => { s.tierWorlds['1'].rift.runs[1].convergence.attempts = 0 }, `${OPEN}: expected the attempt counted in attempts`],
    ['an attempt on a won run', (s) => { s.tierWorlds['1'].rift.runs[1].wonAt = T4 }, `${OPEN}: the run is already won`],
    ['rounds of four entries', (s) => { s.tierWorlds['1'].rift.runs[1].convergence.open.rounds = [6, 6, 6, 6] }, `${OPEN}\\.rounds: expected 0–3 entries`],
    ['a round of 0', (s) => { s.tierWorlds['1'].rift.runs[1].convergence.open.rounds = [0] }, `${OPEN}\\.rounds\\.0: expected 1–40`],
    ['a round past the cap', (s) => { s.tierWorlds['1'].rift.runs[1].convergence.open.rounds = [41] }, `${OPEN}\\.rounds\\.0: expected 1–40`],
    ['a Convergence fight 2 when one round is recorded', (s) => { s.tierWorlds['1'].rift.battle.ref.fight = 2 }, `${R}\\.battle\\.ref\\.fight: expected fight 1`],
    ['a Convergence fight 0 when one round is recorded', (s) => { s.tierWorlds['1'].rift.battle.ref.fight = 0 }, `${R}\\.battle\\.ref\\.fight: expected fight 1`],
    ['a Convergence fight by other allies', (s) => {
      const parties = s.tierWorlds['1'].rift.runs[1].convergence.open.parties
      ;[parties[1], parties[2]] = [parties[2], parties[1]]
    }, `${R}\\.battle\\.input\\.allies: expected the attempt's party 1`],
    ['a front fight during an attempt', (s) => { s.tierWorlds['1'].rift.battle.ref = { kind: 'front', front: 'horde', stage: 12 } }, `${R}\\.battle\\.ref\\.stage: horde is sealed`],
  ]

  it.each(attemptRefusals)('refuses %s', (_, edit, message) => {
    const s = convergence()
    edit(s)
    expect(() => parseSave(s)).toThrow(SaveParseError)
    expect(() => parseSave(s)).toThrow(new RegExp(message))
  })

  it('accepts a won run waiting for Ascend as the last one, its twenty still at home', () => {
    const s = rift()
    s.tierWorlds['1'].rift.battle = null
    s.tierWorlds['1'].rift.runs.pop()
    s.tierWorlds['1'].rift.runs[0].ascendedAt = null
    for (const id of TIER2_ROSTER) s.tierWorlds['1'].umas[id] = s.tierWorlds['2'].umas[id]
    delete s.tierWorlds['2']
    s.account.history = {}
    expect(parseSave(s).tierWorlds['1']!.rift.runs[0]).toMatchObject({ wonAt: T2, ascendedAt: null })
  })
})

describe('the v23 migration (D163)', () => {
  /** A v22 save as it was stored: two worlds with no Rift, and a three-key account. */
  function v22(): any {
    const save = JSON.parse(JSON.stringify(newSave('Luis', NOW)))
    save.schemaVersion = 22
    save.tierWorlds['2'] = JSON.parse(JSON.stringify(save.tierWorlds['1']))
    for (const w of Object.values(save.tierWorlds) as Record<string, unknown>[]) delete w.rift
    delete save.account.achievements
    delete save.account.history
    delete save.account.defeated
    return save
  }

  it('parses a v22 save as current with empty achievements, history, defeated faces and Rift, and round-trips', () => {
    const raw = v22()
    expect(Object.keys(raw.account)).toEqual(['trainerName', 'createdAt', 'updatedAt'])
    const migrated = parseSave(raw)
    expect(migrated.schemaVersion).toBe(SAVE_SCHEMA_VERSION)
    expect(migrated.account).toEqual({ trainerName: 'Luis', createdAt: NOW, updatedAt: NOW, achievements: {}, history: {}, defeated: {} })
    expect(migrated.tierWorlds['1']!.rift).toEqual({ runs: [], echoes: {}, battle: null, battles: 0 })
    expect(migrated.tierWorlds['2']!.rift).toEqual({ runs: [], echoes: {}, battle: null, battles: 0 })
    expect(parseSave(JSON.parse(JSON.stringify(migrated)))).toEqual(migrated)
  })

  it('refuses a v23 save missing its Rift, or an account missing its history', () => {
    const noRift = v22()
    noRift.schemaVersion = 23
    noRift.account.achievements = {}
    noRift.account.history = {}
    expect(() => parseSave(noRift)).toThrow(/save\.tierWorlds\.1\.rift: expected an object/)
    const noHistory = rift()
    delete noHistory.account.history
    expect(() => parseSave(noHistory)).toThrow(/save\.account\.history: expected an object/)
  })
})

describe('the v24 migration (D171)', () => {
  /** The populated save as v23 stored it (D163's shape): no defeated faces, no Rift fight or count, and runs with only
   * their attempts. Its achievements already use the catalog's ids: no stored save held one before v24. */
  function v23(): any {
    const save = rift()
    save.schemaVersion = 23
    delete save.account.defeated
    for (const w of Object.values(save.tierWorlds) as any[]) {
      delete w.rift.battle
      delete w.rift.battles
      for (const run of w.rift.runs) { delete run.traces; delete run.convergence.open }
    }
    return save
  }

  it('parses a v23 save as v24 with no defeated faces, no Rift fight, and runs without traces or an open attempt, and round-trips', () => {
    const raw = v23()
    expect(Object.keys(raw.account)).toEqual(['trainerName', 'createdAt', 'updatedAt', 'achievements', 'history'])
    expect(Object.keys(raw.tierWorlds['1'].rift)).toEqual(['runs', 'echoes'])
    expect(raw.tierWorlds['1'].rift.runs[0].convergence).toEqual({ attempts: 2 })
    const before = JSON.stringify(raw)
    const migrated = parseSave(raw)
    expect(JSON.stringify(raw)).toBe(before)
    expect(migrated.schemaVersion).toBe(SAVE_SCHEMA_VERSION)
    expect(migrated.account.defeated).toEqual({})
    expect(migrated.account.achievements).toEqual(riftSave().account.achievements)
    const r = migrated.tierWorlds['1']!.rift
    expect(r.battle).toBeNull()
    expect(r.battles).toBe(0)
    expect(r.runs.map((run) => [run.convergence, run.traces])).toEqual([[{ attempts: 2, open: null }, {}], [{ attempts: 0, open: null }, {}]])
    expect(r.echoes).toEqual({ iron: { '50': T1 } })
    expect(migrated.tierWorlds['2']!.rift).toEqual({ runs: [], echoes: {}, battle: null, battles: 0 })
    expect(parseSave(JSON.parse(JSON.stringify(migrated)))).toEqual(migrated)
  })

  it('overwrites, so a v24 save relabelled v23 still parses, emptied', () => {
    const relabelled = rift()
    relabelled.schemaVersion = 23
    const migrated = parseSave(relabelled)
    expect(migrated.account.defeated).toEqual({})
    expect(migrated.tierWorlds['1']!.rift).toMatchObject({ battle: null, battles: 0 })
    expect(migrated.tierWorlds['1']!.rift.runs[1]!.traces).toEqual({})
  })

  it('leaves a malformed v23 Rift for the strict parse', () => {
    const extra = v23()
    extra.tierWorlds['1'].rift.runs[0].convergence.best = 3
    expect(() => parseSave(extra)).toThrow(/save\.tierWorlds\.1\.rift\.runs\.0\.convergence: unknown keys best/)
    const noAttempts = v23()
    delete noAttempts.tierWorlds['1'].rift.runs[1].convergence.attempts
    expect(() => parseSave(noAttempts)).toThrow(/save\.tierWorlds\.1\.rift\.runs\.1\.convergence\.attempts: expected a non-negative integer/)
    const notRun = v23()
    notRun.tierWorlds['1'].rift.runs[1] = 't1-r2'
    expect(() => parseSave(notRun)).toThrow(/save\.tierWorlds\.1\.rift\.runs\.1: expected an object/)
    const untiered = v23()
    untiered.account.achievements = { 'rift-conquered': { at: T2, run: 't1-r1' } }
    expect(() => parseSave(untiered)).toThrow(/save\.account\.achievements\.rift-conquered: not in the achievement catalog/)
  })

  it('refuses a v24 save missing its Rift fight, a run\'s traces or the account\'s defeated faces', () => {
    const noBattle = rift()
    delete noBattle.tierWorlds['1'].rift.battle
    expect(() => parseSave(noBattle)).toThrow(/save\.tierWorlds\.1\.rift\.battle: expected an object/)
    const noTraces = rift()
    delete noTraces.tierWorlds['1'].rift.runs[0].traces
    expect(() => parseSave(noTraces)).toThrow(/save\.tierWorlds\.1\.rift\.runs\.0\.traces: expected an object/)
    const noDefeated = rift()
    delete noDefeated.account.defeated
    expect(() => parseSave(noDefeated)).toThrow(/save\.account\.defeated: expected an object/)
  })
})
