import { describe, expect, it } from 'vitest'
import { newSave, parseSave, PARTY_COUNT, SaveParseError } from './save'
import { addShards, isPartyFull, partyOf, renameParty, SaveRuleError, setPartySlot, unlockUma, worldOf } from './rules'

const T0 = '2026-10-10T12:00:00.000Z'
const T1 = '2026-10-10T13:00:00.000Z'

const unlocked = (...ids: string[]) => ids.reduce((save, id) => unlockUma(save, id, T1), newSave('Luis', T0))

describe('collection rules', () => {
  it('unlocks an outfit for one ticket, at Lv1, and stamps updatedAt', () => {
    const save = unlockUma(newSave('Luis', T0), '100101', T1)
    const world = worldOf(save)
    expect(world.wallet.unlockTickets).toBe(19)
    expect(world.umas['100101']).toEqual({ unlockedAt: T1, level: 1, exp: 0 })
    expect(save.account.updatedAt).toBe(T1)
  })

  it('refuses to unlock twice or without tickets', () => {
    expect(() => unlockUma(unlocked('100101'), '100101', T1)).toThrow(SaveRuleError)
    let save = newSave('Luis', T0)
    for (let i = 0; i < 20; i++) save = unlockUma(save, String(100101 + i), T1)
    expect(worldOf(save).wallet.unlockTickets).toBe(0)
    const err = (() => {
      try {
        unlockUma(save, '200101', T1)
      } catch (e) {
        return e
      }
    })()
    expect(err).toBeInstanceOf(SaveRuleError)
    expect((err as SaveRuleError).reason).toBe('no-ticket')
  })

  it('turns every five Shards into a Ticket', () => {
    expect(addShards({ unlockTickets: 0, shards: 3, laurels: 0 }, 4)).toEqual({ unlockTickets: 1, shards: 2, laurels: 0 })
    expect(addShards({ unlockTickets: 2, shards: 0, laurels: 7 }, 10)).toEqual({ unlockTickets: 4, shards: 0, laurels: 7 })
  })
})

describe('party rules', () => {
  it('starts with twenty empty parties', () => {
    const world = worldOf(newSave('Luis', T0))
    expect(world.parties).toHaveLength(PARTY_COUNT)
    expect(world.parties[19]?.name).toBe('Party 20')
    expect(world.parties.every((p) => p.slots.length === 5 && p.slots.every((s) => s === null))).toBe(true)
  })

  it('adds owned Umas, moves them between parties and slots, and removes them', () => {
    let save = unlocked('100101', '100201')
    save = setPartySlot(save, 0, 0, '100101', T1)
    save = setPartySlot(save, 0, 1, '100201', T1)
    expect(partyOf(worldOf(save), '100101')).toEqual({ party: 0, slot: 0 })
    save = setPartySlot(save, 3, 2, '100101', T1) // moves to Party 4
    expect(partyOf(worldOf(save), '100101')).toEqual({ party: 3, slot: 2 })
    expect(worldOf(save).parties[0]?.slots[0]).toBeNull()
    save = setPartySlot(save, 0, 4, '100201', T1) // moves within Party 1
    expect(worldOf(save).parties[0]?.slots).toEqual([null, null, null, null, '100201'])
    save = setPartySlot(save, 0, 4, null, T1)
    expect(partyOf(worldOf(save), '100201')).toBeNull()
  })

  it('refuses unowned Umas and bad positions', () => {
    const save = unlocked('100101')
    expect(() => setPartySlot(save, 0, 0, '999999', T1)).toThrow(/owned/)
    expect(() => setPartySlot(save, 20, 0, '100101', T1)).toThrow(SaveRuleError)
    expect(() => setPartySlot(save, 0, 5, '100101', T1)).toThrow(SaveRuleError)
  })

  it('renames with 1–24 characters', () => {
    const save = renameParty(newSave('Luis', T0), 2, '  Front   runners ', T1)
    expect(worldOf(save).parties[2]?.name).toBe('Front runners')
    expect(() => renameParty(save, 2, '   ', T1)).toThrow(SaveRuleError)
    expect(() => renameParty(save, 2, 'x'.repeat(25), T1)).toThrow(SaveRuleError)
  })

  it('knows a full party', () => {
    let save = unlocked('1', '2', '3', '4', '5')
    for (let i = 0; i < 5; i++) save = setPartySlot(save, 0, i, String(i + 1), T1)
    expect(isPartyFull(worldOf(save).parties[0]!)).toBe(true)
    expect(isPartyFull(worldOf(save).parties[1]!)).toBe(false)
  })
})

describe('save v2 parsing', () => {
  it('round-trips a save with Umas and parties', () => {
    const save = setPartySlot(unlocked('100101'), 0, 0, '100101', T1)
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
  })

  it('migrates a v1 save: no Umas, twenty empty parties', () => {
    const v1 = { schemaVersion: 1, account: { trainerName: 'Luis', createdAt: T0, updatedAt: T0 }, tierWorlds: { '1': { createdAt: T0, wallet: { unlockTickets: 20, shards: 0, laurels: 0 } } } }
    const migrated = parseSave(v1)
    expect(migrated.schemaVersion).toBe(2)
    expect(migrated.tierWorlds['1']?.umas).toEqual({})
    expect(migrated.tierWorlds['1']?.parties).toHaveLength(20)
  })

  it('rejects an Uma in two places, an unowned slot, bad levels and a wrong party count', () => {
    const save = setPartySlot(unlocked('100101'), 0, 0, '100101', T1)
    const raw = JSON.parse(JSON.stringify(save))
    raw.tierWorlds['1'].parties[1].slots[0] = '100101'
    expect(() => parseSave(raw)).toThrow(/already in a party/)
    const unowned = JSON.parse(JSON.stringify(save))
    unowned.tierWorlds['1'].parties[1].slots[0] = '555'
    expect(() => parseSave(unowned)).toThrow(SaveParseError)
    const level = JSON.parse(JSON.stringify(save))
    level.tierWorlds['1'].umas['100101'].level = 51
    expect(() => parseSave(level)).toThrow(/level/)
    const short = JSON.parse(JSON.stringify(save))
    short.tierWorlds['1'].parties.pop()
    expect(() => parseSave(short)).toThrow(/20 parties/)
  })
})
