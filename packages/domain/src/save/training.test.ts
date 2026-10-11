import { describe, expect, it } from 'vitest'
import { HOUR } from '../economy/pacing'
import { depthsOpen } from '../economy/training'
import { rpgCampaignChapter } from '../rpg/campaign/chapters'
import { learnSkill, startFight, umaProfile } from './battle'
import { setPartySlot, unlockUma, worldOf } from './rules'
import { newSave, parseSave, SaveParseError, type Save, SAVE_SCHEMA_VERSION } from './save'
import { collectJob, facilityOf, queueJob, rushJob, startTraining } from './work'

const T0 = Date.parse('2026-10-10T12:00:00.000Z')
const at = (ms: number) => new Date(T0 + ms).toISOString()
// Invented outfits: a Front A sprinter and an all-G one.
const front = {
  outfitId: '101', baseStats: { speed: 100, stamina: 100, power: 100, guts: 100, wit: 100 }, growthRatePercents: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0 },
  aptitudes: { surface: { turf: 'G', dirt: 'G' }, strategy: { front: 'A', pace: 'G', late: 'G', end: 'G' }, distance: { sprint: 'A', mile: 'G', medium: 'G', long: 'G' } },
} as const
const plain = { ...front, outfitId: '102', aptitudes: { ...front.aptitudes, strategy: { front: 'G', pace: 'G', late: 'G', end: 'G' } } } as const

const umas = (...ids: string[]): Save => ids.reduce((s, id) => unlockUma(s, id, at(0)), newSave('Luis', at(0)))

describe('class ranks (S5, D57)', () => {
  it('trains one rank at running-style speed, pays it on collect, and opens a skill depth per rank', () => {
    let save = umas('101', '102')
    save = startTraining(save, 'brawler-dojo', 0, front, { kind: 'class', classId: 'brawler' }, at(0))
    save = startTraining(save, 'brawler-dojo', 1, plain, { kind: 'class', classId: 'brawler' }, at(0))
    expect(facilityOf(worldOf(save), 'brawler-dojo').jobs.map((j) => j!.msEach)).toEqual([0.25 * HOUR, 0.5 * HOUR])
    expect(() => rushJob(save, 'brawler-dojo', 0, at(0))).toThrow(/can’t be rushed/)
    expect(collectJob(save, 'brawler-dojo', 0, at(0.2 * HOUR)).got.done).toBe(false)
    save = collectJob(save, 'brawler-dojo', 0, at(0.25 * HOUR)).save
    expect(worldOf(save).umas['101']!.ranks.classes.brawler).toBe(2)
    expect(umaProfile(front, worldOf(save).umas['101']!, 1, 'greatsword-spear').maxDepth).toBe(1)
    save = learnSkill(save, front, 'greatsword-spear', 'greatsword.fire.1', at(HOUR))
    expect(() => learnSkill(save, front, 'greatsword-spear', 'greatsword.ice.2', at(HOUR))).toThrow(/class rank 3/)
    expect([1, 2, 6].map(depthsOpen)).toEqual([0, 1, 5])
  })

  it('trains gear mastery in the armory of its distance, at distance speed', () => {
    let save = umas('101')
    expect(() => startTraining(save, 'rangers-lodge', 0, front, { kind: 'mastery', type: 'greatsword' }, at(0))).toThrow(/not trained here/)
    save = startTraining(save, 'rangers-lodge', 0, front, { kind: 'mastery', type: 'bow' }, at(0))
    expect(facilityOf(worldOf(save), 'rangers-lodge').jobs[0]!.msEach).toBe(0.25 * HOUR)
    save = collectJob(save, 'rangers-lodge', 0, at(HOUR)).save
    expect(worldOf(save).umas['101']!.ranks.mastery.bow).toBe(2)
  })

  it('lets an Uma fight with skills deeper than her level would open, once her rank opens them', () => {
    let save = umas('101', '102', '103', '104', '105')
    const w = worldOf(save)
    save = { ...save, tierWorlds: { '1': { ...w, umas: { ...w.umas, '101': { ...w.umas['101']!, level: 5, ranks: { ...w.umas['101']!.ranks, classes: { ...w.umas['101']!.ranks.classes, brawler: 3 } } } } } } }
    save = learnSkill(save, front, 'greatsword-spear', 'greatsword.fire.1', at(0))
    save = learnSkill(save, front, 'greatsword-spear', 'greatsword.fire.2', at(0))
    ;['101', '102', '103', '104', '105'].forEach((id, i) => { save = setPartySlot(save, 0, i, id, at(0)) })
    const ura = rpgCampaignChapter({ scenarioId: 1, name: 'URA', order: 1 }, [{ id: 'c', name: 'C' }])
    const outfits = new Map(['101', '102', '103', '104', '105'].map((id) => [id, { ...front, outfitId: id }]))
    const fighting = startFight(save, ura, 0, 'a1r1c1', outfits, at(0))
    expect(parseSave(JSON.parse(JSON.stringify(fighting)))).toEqual(fighting)
  })
})

describe('save v5', () => {
  it('migrates a v4 save: classes start at the rank their learned skills need', () => {
    let save = umas('101')
    save = learnSkill({ ...save, tierWorlds: { '1': { ...worldOf(save), umas: { '101': { ...worldOf(save).umas['101']!, ranks: { ...worldOf(save).umas['101']!.ranks, classes: { brawler: 2, mage: 1, spellblade: 1, cleric: 1, summoner: 1 } } } } } } },
      front, 'greatsword-spear', 'greatsword.fire.1', at(0))
    const v4 = JSON.parse(JSON.stringify(save))
    v4.schemaVersion = 4
    delete v4.tierWorlds['1'].umas['101'].ranks
    delete v4.tierWorlds['1'].umas['101'].stars
    delete v4.tierWorlds['1'].dishes
    delete v4.tierWorlds['1'].gear
    delete v4.tierWorlds['1'].umas['101'].gear
    const migrated = parseSave(v4)
    expect(migrated.schemaVersion).toBe(SAVE_SCHEMA_VERSION)
    expect(migrated.tierWorlds['1']!.umas['101']!.ranks.classes).toEqual({ brawler: 2, mage: 1, spellblade: 1, cleric: 1, summoner: 1 })
    expect(migrated.tierWorlds['1']!.umas['101']!.ranks.mastery.plate).toBe(1)
  })

  it('rejects a skill deeper than its class rank and training a track elsewhere', () => {
    const save = learnSkill({ ...umas('101'), tierWorlds: { '1': { ...worldOf(umas('101')), umas: { '101': { ...worldOf(umas('101')).umas['101']!, ranks: { ...worldOf(umas('101')).umas['101']!.ranks, classes: { brawler: 2, mage: 1, spellblade: 1, cleric: 1, summoner: 1 } } } } } } },
      front, 'greatsword-spear', 'greatsword.fire.1', at(0))
    const low = JSON.parse(JSON.stringify(save))
    low.tierWorlds['1'].umas['101'].ranks.classes.brawler = 1
    expect(() => parseSave(low)).toThrow(/tree/)
    const elsewhere = JSON.parse(JSON.stringify(startTraining(umas('101'), 'brawler-dojo', 0, front, { kind: 'class', classId: 'brawler' }, at(0))))
    elsewhere.tierWorlds['1'].facilities['mage-tower'] = elsewhere.tierWorlds['1'].facilities['brawler-dojo']
    delete elsewhere.tierWorlds['1'].facilities['brawler-dojo']
    expect(() => parseSave(elsewhere)).toThrow(SaveParseError)
  })
})

describe('queued training (QoL, D62)', () => {
  it('queues the next ranks of a track, each timed from the rank it will train', () => {
    let save = startTraining(umas('101'), 'brawler-dojo', 0, front, { kind: 'class', classId: 'brawler' }, at(0))
    save = queueJob(save, 'brawler-dojo', 0, front, 'class:brawler', 1, at(0))
    save = queueJob(save, 'brawler-dojo', 0, front, 'class:brawler', 1, at(0))
    // Rank 2→3 is 2 hours and 3→4 is 6, halved by Front A.
    expect(facilityOf(worldOf(save), 'brawler-dojo').jobs[0]!.queue.map((q) => q.msEach)).toEqual([HOUR, 3 * HOUR])
    expect(() => queueJob(save, 'brawler-dojo', 0, front, 'class:mage', 1, at(0))).toThrow(/not trained here/)
    const r = collectJob(save, 'brawler-dojo', 0, at(1.5 * HOUR))
    expect(r.got.rankUp).toBe(true)
    expect(worldOf(r.save).umas['101']!.ranks.classes.brawler).toBe(3)
    expect(facilityOf(worldOf(r.save), 'brawler-dojo').jobs[0]).toMatchObject({ output: 'class:brawler', startedAt: at(1.25 * HOUR) })
  })
})
