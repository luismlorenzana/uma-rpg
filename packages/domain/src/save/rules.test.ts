import { describe, expect, it } from 'vitest'
import { armorHalf } from '../economy/grades'
import { rpgClasses, RPG_TIER0_CLASSES, type RpgTier0Class } from '../rpg/kinds'
import { RPG_CLASS_ARMOR, RPG_CLASSES, type RpgClass } from '../rpg/rules'
import { newOwnedUma, newSave, newWallet, parseSave, PARTY_COUNT, SaveParseError, SAVE_SCHEMA_VERSION } from './save'
import { addShards, isPartyFull, ownerTier, partyLead, partyOf, renameParty, savedTiers, SaveRuleError, setPartyLead, setPartySlot, TIER_ONE, tierKey, unlockUma, worldOf } from './rules'
import { TIER2_LAURELS, TIER2_UMAS, withTierTwo } from './tiers.fixture'

const T0 = '2026-10-10T12:00:00.000Z'
const T1 = '2026-10-10T13:00:00.000Z'

const unlocked = (...ids: string[]) => ids.reduce((save, id) => unlockUma(save, id, T1), newSave('Luis', T0))

describe('collection rules', () => {
  it('unlocks an outfit for one ticket, at Lv1, and stamps updatedAt', () => {
    const save = unlockUma(newSave('Luis', T0), '100101', T1)
    const world = worldOf(save)
    expect(world.wallet.unlockTickets).toBe(19)
    expect(world.umas['100101']).toEqual(newOwnedUma(T1))
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

  it('starts a new Healer, Summoner or Mage in magical armor and a Warrior or Spellblade in physical (D160, D180; v28: her class’s half, H82; from v19 her Tier 0, CV10)', () => {
    const want: Record<RpgTier0Class, 'physical' | 'magical'> = { recruit: 'physical', duelist: 'physical', acolyte: 'magical', caller: 'magical', apprentice: 'magical' }
    const before = unlocked('100101')
    for (const c of RPG_TIER0_CLASSES) {
      const save = unlockUma(before, '100201', T1, TIER_ONE, c)
      const world = worldOf(save)
      const uma = world.umas['100201']!
      // Every grade G0; her armor's half is her class's, so nothing about it is written.
      expect(uma.gear).toEqual({ weapons: {}, armor: {}, accessories: [{ grade: 0, family: null, form: 'base' }] })
      expect(armorHalf(uma.classId!)).toBe(want[c])
      // From v16 her start is written as her class (H67), whichever it is.
      expect(uma.classId).toBe(c)
      // The Umas already owned are untouched.
      expect(world.umas['100101']).toBe(worldOf(before).umas['100101'])
      expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
    }
    // Without a starting class (tests, the pacing sim) she starts with no class and every grade G0.
    expect(worldOf(unlockUma(before, '100201', T1)).umas['100201']!).toMatchObject({ classId: null, gear: { weapons: {}, armor: {}, accessories: [{ grade: 0, family: null, form: 'base' }] } })
  })

  it('gives magical armor to exactly the Mage, Summoner and Cleric of v18’s six (D160 §7), and from v19 to the Tome Spellblade and three Tier 0 too', () => {
    expect(rpgClasses(18).filter((c) => RPG_CLASS_ARMOR[c] === 'magical').sort()).toEqual(['cleric', 'mage', 'summoner'])
    expect(RPG_CLASSES.filter((c) => RPG_CLASS_ARMOR[c] === 'magical').sort()).toEqual(['acolyte', 'apprentice', 'caller', 'cleric', 'mage', 'summoner', 'tomeblade'])
  })

  it('turns every five Uma Shards into a Ticket', () => {
    expect(addShards(newWallet(0), 4)).toEqual({ ...newWallet(0), shards: 4 })
    expect(addShards({ ...newWallet(0), shards: 3 }, 4)).toEqual({ ...newWallet(1), shards: 2 })
    expect(addShards({ ...newWallet(2), laurels: 7 }, 10)).toEqual({ ...newWallet(4), laurels: 7 })
  })
})

describe('party rules', () => {
  it('starts with twenty empty parties', () => {
    const world = worldOf(newSave('Luis', T0))
    expect(world.parties).toHaveLength(PARTY_COUNT)
    expect(world.parties[19]?.name).toBe('Party 20')
    expect(world.parties.every((p) => p.slots.length === 5 && p.slots.every((s) => s === null))).toBe(true)
    expect(world.parties.every((p) => p.lead === null)).toBe(true)
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

  it('stores the lead independently without moving the party slots', () => {
    let save = unlocked('100101', '100201', '100301')
    save = setPartySlot(save, 0, 1, '100101', T1)
    save = setPartySlot(save, 0, 3, '100201', T1)
    expect(partyLead(worldOf(save).parties[0]!)).toBe('100101')

    const led = setPartyLead(save, 0, '100201', T1)
    expect(worldOf(led).parties[0]!.slots).toEqual([null, '100101', null, '100201', null])
    expect(worldOf(led).parties[0]!.lead).toBe('100201')
    expect(partyLead(worldOf(led).parties[0]!)).toBe('100201')
    expect(() => setPartyLead(led, 0, '100301', T1)).toThrow(/party member/)

    const removed = setPartySlot(led, 0, 3, null, T1)
    expect(worldOf(removed).parties[0]!.lead).toBeNull()
    expect(partyLead(worldOf(removed).parties[0]!)).toBe('100101')
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
    expect(migrated.schemaVersion).toBe(SAVE_SCHEMA_VERSION)
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
    const badLead = JSON.parse(JSON.stringify(save))
    badLead.tierWorlds['1'].parties[0].lead = '555'
    expect(() => parseSave(badLead)).toThrow(/member of this party/)
    const level = JSON.parse(JSON.stringify(save))
    level.tierWorlds['1'].umas['100101'].level = 51
    expect(() => parseSave(level)).toThrow(/level/)
    const short = JSON.parse(JSON.stringify(save))
    short.tierWorlds['1'].parties.pop()
    expect(() => parseSave(short)).toThrow(/20 parties/)
  })
})

describe('one Uma, one tier world (H35, D159 §3)', () => {
  const twoTiers = () => withTierTwo(unlocked('100101', '100201'), T1)

  it('lists the saved tiers lowest first, and keys them as strings', () => {
    expect(savedTiers(newSave('Luis', T0))).toEqual([1])
    expect(savedTiers(twoTiers())).toEqual([1, 2])
    expect(tierKey(2)).toBe('2')
    expect(worldOf(twoTiers(), tierKey(2)).wallet.laurels).toBe(TIER2_LAURELS)
  })

  it('knows which world each Uma lives in', () => {
    const save = twoTiers()
    expect(ownerTier(save, '100101')).toBe(1)
    expect(ownerTier(save, TIER2_UMAS[0])).toBe(2)
    expect(ownerTier(save, '999999')).toBeNull()
  })

  it('refuses to unlock in Tier 1 an outfit Tier 2 owns', () => {
    const save = twoTiers()
    expect(() => unlockUma(save, TIER2_UMAS[0], T1)).toThrow(/already in Tier 2/)
    expect(() => unlockUma(save, '100101', T1)).toThrow(/already unlocked/)
    expect(Object.keys(worldOf(unlockUma(save, '100301', T1)).umas)).toContain('100301')
  })

  it('parses a two-tier save, and refuses an outfit owned in two worlds', () => {
    const save = twoTiers()
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
    const twice = JSON.parse(JSON.stringify(save))
    twice.tierWorlds['2'].umas['100101'] = twice.tierWorlds['1'].umas['100101']
    expect(() => parseSave(twice)).toThrow(SaveParseError)
    expect(() => parseSave(twice)).toThrow(/lives in one tier world/)
  })
})
