import { describe, expect, it } from 'vitest'
import { newSave, normalizeTrainerName, parseSave, parseSavePut, renameTrainer, resolveConflict, SaveParseError, STARTING_UNLOCK_TICKETS, SAVE_SCHEMA_VERSION } from './save'
import { RIFT_TIMES, riftSave, TIER2_ROSTER } from './rift.fixture'

const NOW = '2026-10-10T12:00:00.000Z'
const LATER = '2026-10-10T13:00:00.000Z'

describe('save', () => {
  it('starts Tier 1 with 20 Uma Tickets and nothing else', () => {
    const save = newSave('  Luis  ', NOW)
    expect(save.account.trainerName).toBe('Luis')
    expect(save.tierWorlds['1']?.wallet).toEqual({ unlockTickets: STARTING_UNLOCK_TICKETS, shards: 0, laurels: 0, timeTickets: 0, sweepTickets: 0, gearMarks: 0, classMarks: 0 })
    expect(STARTING_UNLOCK_TICKETS).toBe(20)
  })

  it('falls back to the default name when the given one is unusable', () => {
    expect(newSave('   ', NOW).account.trainerName).toBe('Trainer')
  })

  it('normalizes trainer names and enforces 1–24 characters', () => {
    expect(normalizeTrainerName('  Silence   Suzuka ')).toBe('Silence Suzuka')
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

/** A JSON copy of the populated v23 fixture, to edit. */
const rift = (): any => JSON.parse(JSON.stringify(riftSave()))
const [T0, T1, T2, T3, T4] = RIFT_TIMES

describe('save v23: achievements, tier history and the Rift (D163)', () => {
  it('starts with no achievements, no history and an empty Rift, and round-trips', () => {
    const save = newSave('Luis', NOW)
    expect(save.schemaVersion).toBe(23)
    expect(save.account).toMatchObject({ achievements: {}, history: {} })
    expect(save.tierWorlds['1']!.rift).toEqual({ runs: [], echoes: {} })
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
  })

  it('round-trips a Rift in use: a run ascended into Tier 2, an open one, an Echo win, achievements and history', () => {
    const save = riftSave()
    const parsed = parseSave(rift())
    expect(parsed).toEqual(save)
    expect(parseSave(JSON.parse(JSON.stringify(parsed)))).toEqual(save)
    expect(parsed.tierWorlds['1']!.rift.runs.map((r) => r.id)).toEqual(['t1-r1', 't1-r2'])
    expect(parsed.tierWorlds['1']!.rift.runs[1]!.fronts).toEqual({ iron: 12, arcane: 3, duel: 0, horde: 0 })
    expect(parsed.tierWorlds['1']!.rift.echoes).toEqual({ iron: { '50': T1 } })
    expect(parsed.account.achievements).toEqual({ 'rift-conquered': { at: T2, run: 't1-r1' }, bestiary: { at: T4, run: null } })
    expect(Object.keys(parsed.account.history)).toEqual(TIER2_ROSTER)
    expect(parsed.account.history['201']).toEqual([{ tier: 2, at: T3, run: 't1-r1' }])
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
    ['an achievement whose run doesn\'t exist', (s) => { s.account.achievements['rift-conquered'].run = 't1-r3' }, `${A}\\.achievements\\.rift-conquered\\.run: no run t1-r3`],
    ['an achievement in a world that doesn\'t exist', (s) => { s.account.achievements['rift-conquered'].run = 't3-r1' }, `${A}\\.achievements\\.rift-conquered\\.run: no run t3-r1`],
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
  ]

  it.each(refusals)('refuses %s', (_, edit, message) => {
    const s = rift()
    edit(s)
    expect(() => parseSave(s)).toThrow(SaveParseError)
    expect(() => parseSave(s)).toThrow(new RegExp(message))
  })

  it('accepts a won run waiting for Ascend as the last one, its twenty still at home', () => {
    const s = rift()
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
    return save
  }

  it('parses a v22 save as v23 with empty achievements, history and Rift, and round-trips', () => {
    const raw = v22()
    expect(Object.keys(raw.account)).toEqual(['trainerName', 'createdAt', 'updatedAt'])
    const migrated = parseSave(raw)
    expect(migrated.schemaVersion).toBe(SAVE_SCHEMA_VERSION)
    expect(migrated.account).toEqual({ trainerName: 'Luis', createdAt: NOW, updatedAt: NOW, achievements: {}, history: {} })
    expect(migrated.tierWorlds['1']!.rift).toEqual({ runs: [], echoes: {} })
    expect(migrated.tierWorlds['2']!.rift).toEqual({ runs: [], echoes: {} })
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
