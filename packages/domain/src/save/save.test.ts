import { describe, expect, it } from 'vitest'
import { newSave, normalizeTrainerName, parseSave, parseSavePut, renameTrainer, resolveConflict, SaveParseError, STARTING_UNLOCK_TICKETS, SAVE_SCHEMA_VERSION } from './save'

const NOW = '2026-10-10T12:00:00.000Z'
const LATER = '2026-10-10T13:00:00.000Z'

describe('save', () => {
  it('starts Tier 1 with 20 Unlock Tickets and nothing else', () => {
    const save = newSave('  Luis  ', NOW)
    expect(save.account.trainerName).toBe('Luis')
    expect(save.tierWorlds['1']?.wallet).toEqual({ unlockTickets: STARTING_UNLOCK_TICKETS, shards: 0, laurels: 0, timeTickets: 0, sweepTickets: 0 })
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
