import { describe, expect, it } from 'vitest'
import { HOUR, itemMinutes, MINUTE, professionExpToNext, PROFESSION_MAX_LEVEL } from '../economy/pacing'
import { rpgCampaignChapter } from '../rpg/campaign/chapters'
import { startFight, type BattleOutfit } from './battle'
import { buyRawItem, buyTickets, stockedGrades, sweepBlock, sweepFight } from './exchange'
import { setPartySlot, unlockUma, worldOf } from './rules'
import { newSave, parseSave, SaveParseError, type Save } from './save'
import { isBusy } from './rules'
import { collectAll, collectJob, facilityOf, grantProfessionExp, planJob, queueJob, recallJob, rushCost, rushJob, startJob, unqueueJob, upgradeCost, upgradeFacility, type WorkOutfit } from './work'

const T0 = Date.parse('2026-10-10T12:00:00.000Z')
const at = (ms: number) => new Date(T0 + ms).toISOString()
// Invented outfits only.
const outfit = (id: string, turf: 'A' | 'G' = 'G', dirt: 'A' | 'G' = 'G'): WorkOutfit & BattleOutfit => ({
  outfitId: id, aptitudes: { surface: { turf, dirt }, strategy: { front: 'A', pace: 'G', late: 'G', end: 'G' } } as never,
  baseStats: { speed: 100, stamina: 100, power: 100, guts: 100, wit: 100 }, growthRatePercents: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0 },
})
const turfA = outfit('101', 'A')
// One grade-1 item at A aptitude: the unit these tests count time in.
const U = (itemMinutes(1) * MINUTE) / 2
const EXP1 = itemMinutes(1) * 2
const plain = outfit('102')

function withUmas(...ids: string[]): Save {
  return ids.reduce((s, id) => unlockUma(s, id, at(0)), newSave('Luis', at(0)))
}
const give = (save: Save, items: Record<string, number>, laurels = 0): Save => {
  const w = worldOf(save)
  return { ...save, tierWorlds: { '1': { ...w, items: { ...w.items, ...items }, wallet: { ...w.wallet, laurels: w.wallet.laurels + laurels } } } }
}

describe('gathering (S4)', () => {
  it('makes items one after another, at aptitude speed, and pays EXP when collected', () => {
    let save = withUmas('101', '102')
    save = startJob(save, 'fields', 0, turfA, 'wheat', 3, at(0))
    save = startJob(save, 'fields', 1, plain, 'wheat', 3, at(0))
    const [a, g] = facilityOf(worldOf(save), 'fields').jobs
    expect(a!.msEach).toBe(itemMinutes(1) * MINUTE / 2)
    expect(g!.msEach).toBe(itemMinutes(1) * MINUTE)
    // Two of the A-turf Uma's three are done after 2¼ items' time; collecting pays 2 wheat and their EXP.
    const half = collectJob(save, 'fields', 0, at(2.25 * U))
    expect(half.got).toMatchObject({ items: 2, exp: 2 * EXP1, done: false })
    expect(worldOf(half.save).items.wheat).toBe(2)
    expect(worldOf(half.save).umas['101']!.professions.farming).toEqual(grantProfessionExp({ level: 1, exp: 0 }, 2 * EXP1))
    const all = collectAll(half.save, at(6 * U))
    expect(all.items).toBe(4)
    expect(worldOf(all.save).items.wheat).toBe(6)
    expect(worldOf(all.save).umas['101']!.professions.farming).toEqual(grantProfessionExp({ level: 1, exp: 0 }, 3 * EXP1))
    expect(facilityOf(worldOf(all.save), 'fields').jobs).toEqual([null, null])
  })

  it('opens a grade every five profession levels and makes only the site’s family', () => {
    const world = worldOf(withUmas('101'))
    expect(planJob(world, 'fields', turfA, 'oats')?.block).toBe('Needs Farm Lv6')
    expect(planJob(world, 'fields', turfA, 'apple')?.block).toBe('Not made here')
    expect(planJob(world, 'mine', turfA, 'copper-ore')?.block).toBeNull()
  })

  it('keeps an Uma to one job, out of fights, and refuses fights while she works', () => {
    let save = withUmas('101', '102', '103', '104', '105')
    save = startJob(save, 'fields', 0, turfA, 'wheat', 1, at(0))
    expect(isBusy(worldOf(save), '101')).toBe(true)
    expect(() => startJob(save, 'orchard', 0, turfA, 'apple', 1, at(0))).toThrow(/Already working/)
    ;['101', '102', '103', '104', '105'].forEach((id, i) => { save = setPartySlot(save, 0, i, id, at(0)) })
    const ura = rpgCampaignChapter({ scenarioId: 1, name: 'URA', order: 1 }, [{ id: 'c', name: 'C' }])
    const outfits = new Map(['101', '102', '103', '104', '105'].map((id) => [id, outfit(id)]))
    expect(() => startFight(save, ura, 0, 'a1r1c1', outfits, at(0))).toThrow(/recall/)
    save = recallJob(save, 'fields', 0, at(MINUTE))
    expect(isBusy(worldOf(save), '101')).toBe(false)
    expect(() => startFight(save, ura, 0, 'a1r1c1', outfits, at(MINUTE))).not.toThrow()
  })
})

describe('refining (S4)', () => {
  it('reserves inputs, returns the ones for unmade items on recall, and loses the item in progress', () => {
    let save = give(withUmas('101'), { wheat: 5 })
    expect(() => startJob(save, 'pantry', 0, turfA, 'wheat-flour', 6, at(0))).toThrow(/Needs 6 Wheat/)
    save = startJob(save, 'pantry', 0, turfA, 'wheat-flour', 5, at(0))
    expect(worldOf(save).items.wheat).toBeUndefined()
    // 2 done at 2½ items' time, the third half made.
    save = recallJob(save, 'pantry', 0, at(2.5 * U))
    expect(worldOf(save).items).toEqual({ 'wheat-flour': 2, wheat: 3 })
    expect(() => startJob(save, 'pantry', 0, turfA, 'copper-ingot', 1, at(0))).toThrow(/Not refined here/)
  })
})

describe('Rush Tickets, upgrades and the Exchange (S4)', () => {
  it('rushes a job for one ticket per hour left', () => {
    let save = startJob(withUmas('102'), 'fields', 0, plain, 'wheat', 3, at(0)) // an hour each at G
    const job = facilityOf(worldOf(save), 'fields').jobs[0]!
    expect(rushCost(job, at(0))).toBe(3)
    expect(() => rushJob(save, 'fields', 0, at(0))).toThrow(/3 Rush Tickets/)
    save = buyTickets(give(save, {}, 60), 'rush', 3, at(0))
    save = rushJob(save, 'fields', 0, at(MINUTE))
    expect(collectJob(save, 'fields', 0, at(MINUTE)).got).toMatchObject({ items: 3, done: true })
    expect(worldOf(save).wallet).toMatchObject({ laurels: 0, rushTickets: 0 })
  })

  it('upgrades a facility with Laurels and refined items of its two families', () => {
    let save = withUmas('101')
    expect(upgradeCost(worldOf(save), 'fields')).toEqual({ laurels: 150, items: { 'rolled-oats': 1, 'boarling-leather': 1 } })
    expect(() => upgradeFacility(save, 'fields', at(0))).toThrow(/Laurels/)
    save = give(save, { 'rolled-oats': 1, 'boarling-leather': 1 }, 150)
    save = upgradeFacility(save, 'fields', at(0))
    expect(facilityOf(worldOf(save), 'fields')).toEqual({ level: 2, jobs: [null, null, null] })
    expect(worldOf(save).items).toEqual({})
    expect(upgradeCost(worldOf(save), 'pantry')?.items).toEqual({ 'sandstone-block': 1, 'birch-plank': 1 })
  })

  it('stocks the grades of reached chapters and sells raw items and tickets for Laurels', () => {
    const save = give(withUmas('101'), {}, 100)
    const chapters = [{ id: '1', order: 1 }, { id: '2', order: 2 }, { id: '7', order: 7 }]
    expect(stockedGrades(worldOf(save), chapters)).toEqual([])
    const w = worldOf(save)
    const reached = { ...w, runs: { '0:2': { party: 0, chapterId: '2', wins: { start: 1, a1r1c1: 1 }, mp: {}, battle: null, battles: 1, clearedAt: null, updatedAt: at(0) },
      '0:7': { party: 0, chapterId: '7', wins: { start: 1, a1r1c1: 1 }, mp: {}, battle: null, battles: 1, clearedAt: null, updatedAt: at(0) } } }
    const grades = stockedGrades(reached, chapters)
    expect(grades).toEqual([3, 4])
    expect(() => buyRawItem(save, 'wheat', 1, grades, at(0))).toThrow(/stocked/)
    const bought = buyRawItem(save, 'barley', 2, grades, at(0)) // 40 Laurels each
    expect(worldOf(bought).items.barley).toBe(2)
    expect(worldOf(bought).wallet.laurels).toBe(20)
    expect(() => buyRawItem(bought, 'barley', 2, grades, at(0))).toThrow(/Laurels/)
    expect(() => buyRawItem(save, 'pearl-barley', 1, grades, at(0))).toThrow(/raw/)
  })

  it('sweeps a beaten regular fight for EXP and Shards, without Laurels', () => {
    let save = give(withUmas('101', '102', '103', '104', '105'), {}, 15)
    ;['101', '102', '103', '104', '105'].forEach((id, i) => { save = setPartySlot(save, 0, i, id, at(0)) })
    const ura = rpgCampaignChapter({ scenarioId: 1, name: 'URA', order: 1 }, [{ id: 'c', name: 'C' }])
    expect(sweepBlock(worldOf(save), ura, 0, 'a1r1c1')).toBe('Beat it with this party first')
    const w = worldOf(save)
    save = { ...save, tierWorlds: { '1': { ...w, runs: { '0:1': { party: 0, chapterId: '1', wins: { start: 1, a1r1c1: 1, a1boss: 1 }, mp: {}, battle: null, battles: 2, clearedAt: null, updatedAt: at(0) } } } } }
    expect(sweepBlock(worldOf(save), ura, 0, 'a1boss')).toBe('Only regular fights can be swept')
    expect(sweepBlock(worldOf(save), ura, 0, 'a1r1c1')).toBe('No Sweep Tickets')
    save = buyTickets(save, 'sweep', 1, at(0))
    const swept = sweepFight(save, ura, 0, 'a1r1c1', at(0))
    expect(swept.result).toMatchObject({ outcome: 'victory', laurels: 0 })
    expect(swept.result.members.every((m) => m.exp > 0)).toBe(true)
    expect(worldOf(swept.save).wallet).toMatchObject({ laurels: 0, sweepTickets: 0 })
    expect(worldOf(swept.save).runs['0:1']!.wins.a1r1c1).toBe(2)
  })
})

describe('slow single items (D65)', () => {
  it('starts jobs of up to 10, and still loads saves holding jobs of up to 50', () => {
    const save = startJob(withUmas('101'), 'fields', 0, turfA, 'wheat', 10, at(0))
    expect(() => startJob(save, 'fields', 1, plain, 'wheat', 11, at(0))).toThrow(/1–10/)
    const old = JSON.parse(JSON.stringify(save))
    old.tierWorlds['1'].facilities.fields.jobs[0].count = 50
    expect(facilityOf(worldOf(parseSave(old)), 'fields').jobs[0]!.count).toBe(50)
    expect(itemMinutes(1)).toBe(60)
  })
})

describe('save v4', () => {
  it('round-trips the Warehouse, facilities and jobs, and rejects an Uma in two jobs or an unknown item', () => {
    let save = give(withUmas('101', '102'), { wheat: 3 })
    save = startJob(save, 'fields', 0, turfA, 'wheat', 2, at(0))
    save = startJob(save, 'pantry', 0, plain, 'wheat-flour', 3, at(0))
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
    const twice = JSON.parse(JSON.stringify(save))
    twice.tierWorlds['1'].facilities.pantry.jobs[1] = { ...twice.tierWorlds['1'].facilities.fields.jobs[0], kind: 'refine', output: 'wheat-flour' }
    expect(() => parseSave(twice)).toThrow(/already working/)
    const unknown = JSON.parse(JSON.stringify(save))
    unknown.tierWorlds['1'].items.unobtainium = 1
    expect(() => parseSave(unknown)).toThrow(SaveParseError)
  })
})

describe('pacing model (D54)', () => {
  const minutesTo = (level: number, aptitudeShare: number) => {
    let exp = 0
    for (let l = 1; l < level; l++) exp += professionExpToNext(l)
    return (exp / 2) * aptitudeShare // 2 EXP per base minute
  }
  it('takes about 59 hours of work to reach grade 10 at G, half that at A', () => {
    expect(Math.round(minutesTo(46, 1) / 60)).toBe(59)
    expect(Math.round(minutesTo(46, 0.5) / 60)).toBe(30)
    expect(Math.round(minutesTo(PROFESSION_MAX_LEVEL, 1) / 60)).toBe(69)
    expect(HOUR).toBe(60 * MINUTE)
  })
})

describe('Sweep ×N (QoL)', () => {
  it('sweeps until the tickets run out and adds up what it paid', async () => {
    const { sweepMany } = await import('./exchange')
    let save = give(withUmas('101', '102', '103', '104', '105'), {}, 45)
    ;['101', '102', '103', '104', '105'].forEach((id, i) => { save = setPartySlot(save, 0, i, id, at(0)) })
    const ura = rpgCampaignChapter({ scenarioId: 1, name: 'URA', order: 1 }, [{ id: 'c', name: 'C' }])
    const w = worldOf(save)
    save = { ...save, tierWorlds: { '1': { ...w, runs: { '0:1': { party: 0, chapterId: '1', wins: { start: 1, a1r1c1: 1 }, mp: {}, battle: null, battles: 1, clearedAt: null, updatedAt: at(0) } } } } }
    save = buyTickets(save, 'sweep', 3, at(0))
    const one = sweepFight(save, ura, 0, 'a1r1c1', at(0)).result.members[0]!.exp
    const r = sweepMany(save, ura, 0, 'a1r1c1', 5, at(0))
    expect(r.swept).toBe(3)
    expect(r.result.members[0]!.exp).toBeGreaterThanOrEqual(3 * one - 3)
    expect(r.result.members[0]!.beforeLevel).toBe(1)
    expect(worldOf(r.save).wallet.sweepTickets).toBe(0)
    expect(worldOf(r.save).runs['0:1']!.wins.a1r1c1).toBe(4)
  })
})

describe('selling (QoL)', () => {
  it('sells spare stock for far less than it costs to buy', async () => {
    const { sellPrice, sellStock } = await import('./exchange')
    expect([sellPrice('items', 'barley'), sellPrice('items', 'pearl-barley'), sellPrice('dishes', 'dish-fruits-2'), sellPrice('gear', 'greatsword-g4-atk')]).toEqual([8, 16, 18, 30])
    let save = give(withUmas('101'), { barley: 5 })
    save = sellStock(save, 'items', 'barley', 5, at(0))
    expect(worldOf(save).items.barley).toBeUndefined()
    expect(worldOf(save).wallet.laurels).toBe(40)
    expect(() => sellStock(save, 'items', 'barley', 1, at(0))).toThrow(/you have 0/)
  })
})

describe('job queues (QoL, D62)', () => {
  it('starts each queued job when the last one finishes, catching up however late it’s collected', () => {
    let save = startJob(withUmas('101'), 'fields', 0, turfA, 'wheat', 2, at(0))
    save = queueJob(save, 'fields', 0, turfA, 'wheat', 3, at(0))
    save = queueJob(save, 'fields', 0, turfA, 'wheat', 1, at(0))
    expect(() => queueJob(save, 'fields', 0, plain, 'wheat', 1, at(0))).toThrow(/her own job/)
    expect(() => queueJob(save, 'fields', 0, turfA, 'oats', 1, at(0))).toThrow(/Needs Farm Lv6/)
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
    // The first job ends at 2 items' time; the second starts then and has one done at 3.
    const mid = collectJob(save, 'fields', 0, at(3.5 * U))
    expect(mid.got).toMatchObject({ items: 3, done: false })
    const job = facilityOf(worldOf(mid.save), 'fields').jobs[0]!
    expect(job).toMatchObject({ count: 3, collected: 1, startedAt: at(2 * U) })
    expect(job.queue).toHaveLength(1)
    const end = collectAll(mid.save, at(7 * U))
    expect(worldOf(end.save).items.wheat).toBe(6)
    expect(facilityOf(worldOf(end.save), 'fields').jobs[0]).toBeNull()
  })

  it('takes a queued job’s inputs when it starts, and drops the queue when the Warehouse can’t cover it', () => {
    let save = give(withUmas('101'), { wheat: 2 })
    save = startJob(save, 'pantry', 0, turfA, 'wheat-flour', 2, at(0))
    save = queueJob(save, 'pantry', 0, turfA, 'wheat-flour', 2, at(0))
    const short = collectJob(save, 'pantry', 0, at(5 * U)).save
    expect(worldOf(short).items).toEqual({ 'wheat-flour': 2 })
    expect(facilityOf(worldOf(short), 'pantry').jobs[0]).toBeNull()
    const stocked = collectJob(give(save, { wheat: 3 }), 'pantry', 0, at(5 * U)).save
    expect(worldOf(stocked).items).toEqual({ 'wheat-flour': 4, wheat: 1 })
  })

  it('removes a queued job, and a recall drops the whole queue without taking its inputs', () => {
    let save = give(withUmas('101'), { wheat: 4 })
    save = startJob(save, 'pantry', 0, turfA, 'wheat-flour', 2, at(0))
    save = queueJob(save, 'pantry', 0, turfA, 'wheat-flour', 1, at(0))
    save = queueJob(save, 'pantry', 0, turfA, 'wheat-flour', 2, at(0))
    save = unqueueJob(save, 'pantry', 0, 0, at(0))
    expect(facilityOf(worldOf(save), 'pantry').jobs[0]!.queue.map((q) => q.count)).toEqual([2])
    save = recallJob(save, 'pantry', 0, at(2 * U))
    expect(worldOf(save).items).toEqual({ 'wheat-flour': 2, wheat: 2 })
    expect(facilityOf(worldOf(save), 'pantry').jobs[0]).toBeNull()
  })
})
