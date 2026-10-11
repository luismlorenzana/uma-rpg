import { describe, expect, it } from 'vitest'
import { regionChapter, worldContinent } from '../world/world'
import { HOUR } from '../economy/pacing'
import { depthsOpen } from '../economy/training'
import { learnSkill, startFight, umaProfile } from './battle'
import { setPartySlot, unlockUma, worldOf } from './rules'
import { newSave, parseSave, SaveParseError, type Save, SAVE_SCHEMA_VERSION } from './save'
import { collectJob, cutJobTime, facilityOf, queueJob, startTraining } from './work'
import { trackId, tracksAt } from '../economy/training'

const T0 = Date.parse('2026-10-10T12:00:00.000Z')
const at = (ms: number) => new Date(T0 + ms).toISOString()
// Invented outfits: a Front A sprinter and an all-G one.
const front = {
  outfitId: '101', baseStats: { speed: 100, stamina: 100, power: 100, guts: 100, wit: 100 }, growthRatePercents: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0 },
  aptitudes: { surface: { turf: 'G', dirt: 'G' }, strategy: { front: 'A', pace: 'G', late: 'G', end: 'G' }, distance: { sprint: 'A', mile: 'G', medium: 'G', long: 'G' } },
} as const
const plain = { ...front, outfitId: '102', aptitudes: { ...front.aptitudes, strategy: { front: 'G', pace: 'G', late: 'G', end: 'G' } } } as const

const umas = (...ids: string[]): Save => ids.reduce((s, id) => unlockUma(s, id, at(0)), newSave('Luis', at(0)))
const give = (save: Save, items: Record<string, number>): Save => ({ ...save, tierWorlds: { '1': { ...worldOf(save), items: { ...worldOf(save).items, ...items } } } })

describe('class ranks (S5, D57)', () => {
  it('trains one rank at running-style speed, pays it on collect, and opens a skill depth per rank', () => {
    let save = umas('101', '102')
    // Promotion to rank 2 spends a band-1 Promotion Token (D67).
    expect(() => startTraining(save, 'brawler-dojo', 0, front, { kind: 'class', classId: 'brawler' }, at(0))).toThrow(/Needs 1 Brawler Promotion Token \(rank 2\)/)
    save = give(save, { 'token-class-brawler-1': 2 })
    save = startTraining(save, 'brawler-dojo', 0, front, { kind: 'class', classId: 'brawler' }, at(0))
    save = startTraining(save, 'brawler-dojo', 1, plain, { kind: 'class', classId: 'brawler' }, at(0))
    expect(worldOf(save).items['token-class-brawler-1']).toBeUndefined()
    // Every rank is 6 base hours (D68), halved by Front A.
    expect(facilityOf(worldOf(save), 'brawler-dojo').jobs.map((j) => j!.msEach)).toEqual([3 * HOUR, 6 * HOUR])
    // Training takes Time Tickets too (D74); none in the wallet yet.
    expect(() => cutJobTime(save, 'brawler-dojo', 0, 1, at(0))).toThrow(/Time Ticket/)
    expect(collectJob(save, 'brawler-dojo', 0, at(2.5 * HOUR)).got.done).toBe(false)
    save = collectJob(save, 'brawler-dojo', 0, at(3 * HOUR)).save
    expect(worldOf(save).umas['101']!.ranks.classes.brawler).toBe(2)
    expect(umaProfile(front, worldOf(save).umas['101']!, 1, 'greatsword-spear').maxDepth).toBe(1)
    save = learnSkill(save, front, 'greatsword-spear', 'greatsword.fire.1', at(4 * HOUR))
    expect(() => learnSkill(save, front, 'greatsword-spear', 'greatsword.ice.2', at(4 * HOUR))).toThrow(/class rank 3/)
    expect([1, 2, 6].map(depthsOpen)).toEqual([0, 1, 5])
  })

  it('trains each class’s Weapon Level in its hall, and armor and accessories in their own halls (D70)', () => {
    let save = umas('101', '102')
    expect(tracksAt('brawler-dojo').map(trackId)).toEqual(['class:brawler', 'weapons:brawler'])
    expect(tracksAt('armory').map(trackId)).toEqual(['armor'])
    expect(tracksAt('jeweler').map(trackId)).toEqual(['accessory'])
    expect(() => startTraining(save, 'armory', 0, front, { kind: 'weapons', classId: 'brawler' }, at(0))).toThrow(/not trained here/)
    // Weapon Levels train at the class's running style (Front A here) and spend no token: 3 base hours, halved.
    save = startTraining(save, 'brawler-dojo', 0, front, { kind: 'weapons', classId: 'brawler' }, at(0))
    expect(facilityOf(worldOf(save), 'brawler-dojo').jobs[0]!.msEach).toBe(1.5 * HOUR)
    // Armor trains at her best distance (Sprint A even for an all-G runner); accessories at her best running style.
    save = startTraining(save, 'armory', 0, plain, { kind: 'armor' }, at(0))
    expect(facilityOf(worldOf(save), 'armory').jobs[0]!.msEach).toBe(1.5 * HOUR)
    save = collectJob(collectJob(save, 'brawler-dojo', 0, at(2 * HOUR)).save, 'armory', 0, at(2 * HOUR)).save
    expect(worldOf(save).umas['101']!.ranks.weapons.brawler).toBe(2)
    expect(worldOf(save).umas['102']!.ranks.armor).toBe(2)
  })

  it('lets an Uma fight with skills deeper than her level would open, once her rank opens them', () => {
    let save = umas('101', '102', '103', '104', '105')
    const w = worldOf(save)
    save = { ...save, tierWorlds: { '1': { ...w, umas: { ...w.umas, '101': { ...w.umas['101']!, level: 5, ranks: { ...w.umas['101']!.ranks, classes: { ...w.umas['101']!.ranks.classes, brawler: 3 } } } } } } }
    save = learnSkill(save, front, 'greatsword-spear', 'greatsword.fire.1', at(0))
    save = learnSkill(save, front, 'greatsword-spear', 'greatsword.fire.2', at(0))
    ;['101', '102', '103', '104', '105'].forEach((id, i) => { save = setPartySlot(save, 0, i, id, at(0)) })
    const ura = regionChapter(worldContinent({ name: 'URA', order: 1 }).regions[0]!, [{ id: 'c', name: 'C' }])
    const outfits = new Map(['101', '102', '103', '104', '105'].map((id) => [id, { ...front, outfitId: id }]))
    const fighting = startFight(save, ura, 'w1-1-1-s1', outfits, at(0))
    expect(parseSave(JSON.parse(JSON.stringify(fighting)))).toEqual(fighting)
  })
})

describe('saves', () => {
  it('starts an older save over, keeping its Umas, parties and Unlock Tickets (D69)', () => {
    let save = umas('101', '102')
    save = setPartySlot(save, 0, 0, '101', at(0))
    const w = worldOf(save)
    save = { ...save, tierWorlds: { '1': { ...w, items: { wheat: 4 }, wallet: { ...w.wallet, laurels: 300 },
      umas: { ...w.umas, '101': { ...w.umas['101']!, level: 12, ranks: { ...w.umas['101']!.ranks, classes: { ...w.umas['101']!.ranks.classes, brawler: 3 } } } } } } }
    const old = JSON.parse(JSON.stringify(save))
    old.schemaVersion = 9
    old.tierWorlds['1'].umas['101'].ranks = { classes: { brawler: 3, mage: 1, spellblade: 1, cleric: 1, summoner: 1 }, mastery: { bow: 4 } }
    const reset = parseSave(old)
    expect(reset.schemaVersion).toBe(SAVE_SCHEMA_VERSION)
    const world = reset.tierWorlds['1']!
    expect(Object.keys(world.umas)).toEqual(['101', '102'])
    expect(world.umas['101']).toMatchObject({ level: 1, exp: 0, build: null, builds: {} })
    expect(world.umas['101']!.ranks.classes.brawler).toBe(1)
    expect(world.parties[0]!.slots[0]).toBe('101')
    expect(world.wallet).toEqual({ unlockTickets: w.wallet.unlockTickets, shards: 0, laurels: 0, timeTickets: 0, sweepTickets: 0 })
    expect(world.items).toEqual({})
    expect(parseSave(JSON.parse(JSON.stringify(reset)))).toEqual(reset)
  })

  it('rejects a skill deeper than its class rank and training a track elsewhere', () => {
    const save = learnSkill({ ...umas('101'), tierWorlds: { '1': { ...worldOf(umas('101')), umas: { '101': { ...worldOf(umas('101')).umas['101']!, ranks: { ...worldOf(umas('101')).umas['101']!.ranks, classes: { brawler: 2, mage: 1, spellblade: 1, cleric: 1, summoner: 1 } } } } } } },
      front, 'greatsword-spear', 'greatsword.fire.1', at(0))
    const low = JSON.parse(JSON.stringify(save))
    low.tierWorlds['1'].umas['101'].ranks.classes.brawler = 1
    expect(() => parseSave(low)).toThrow(/tree/)
    const elsewhere = JSON.parse(JSON.stringify(startTraining(give(umas('101'), { 'token-class-brawler-1': 1 }), 'brawler-dojo', 0, front, { kind: 'class', classId: 'brawler' }, at(0))))
    elsewhere.tierWorlds['1'].facilities['mage-tower'] = elsewhere.tierWorlds['1'].facilities['brawler-dojo']
    delete elsewhere.tierWorlds['1'].facilities['brawler-dojo']
    expect(() => parseSave(elsewhere)).toThrow(SaveParseError)
  })
})

describe('queued training (QoL, D62)', () => {
  it('queues the next ranks of a track, each spending its band’s token when it starts', () => {
    let save = startTraining(give(umas('101'), { 'token-class-brawler-1': 1 }), 'brawler-dojo', 0, front, { kind: 'class', classId: 'brawler' }, at(0))
    save = queueJob(save, 'brawler-dojo', 0, front, 'class:brawler', 1, at(0))
    save = queueJob(save, 'brawler-dojo', 0, front, 'class:brawler', 1, at(0))
    // Every rank takes the same time; ranks 2→3 and 3→4 want band-2 and band-3 tokens.
    expect(facilityOf(worldOf(save), 'brawler-dojo').jobs[0]!.queue.map((q) => [q.msEach, q.inputs])).toEqual([
      [3 * HOUR, { 'token-class-brawler-2': 1 }], [3 * HOUR, { 'token-class-brawler-3': 1 }]])
    expect(() => queueJob(save, 'brawler-dojo', 0, front, 'class:mage', 1, at(0))).toThrow(/not trained here/)
    // Without the band-2 token the queue stops after the first rank.
    const short = collectJob(save, 'brawler-dojo', 0, at(7 * HOUR)).save
    expect(worldOf(short).umas['101']!.ranks.classes.brawler).toBe(2)
    expect(facilityOf(worldOf(short), 'brawler-dojo').jobs[0]).toBeNull()
    const r = collectJob(give(save, { 'token-class-brawler-2': 1, 'token-class-brawler-3': 1 }), 'brawler-dojo', 0, at(6.5 * HOUR))
    expect(r.got.rankUp).toBe(true)
    expect(worldOf(r.save).umas['101']!.ranks.classes.brawler).toBe(3)
    expect(facilityOf(worldOf(r.save), 'brawler-dojo').jobs[0]).toMatchObject({ output: 'class:brawler', startedAt: at(6 * HOUR) })
    expect(worldOf(r.save).items).toEqual({})
  })
})
