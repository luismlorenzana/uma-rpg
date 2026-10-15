import { describe, expect, it } from 'vitest'
import { regionChapter, worldContinent } from '../world/world'
import { EXP_PER_MINUTE, FACILITY_SPEED, HOUR, itemMinutes, jobExp, makeMinutes, MINUTE, professionExpToNext, PROFESSION_MAX_LEVEL, REFINE_BATCHES, refineMinutes } from '../economy/pacing'
import { ITEM_FAMILIES } from '../items/catalog'
import { startFight, type BattleOutfit } from './battle'
import { buyRawItem, buyTickets, stockedGrades, sweepBlock, sweepFight } from './exchange'
import { setPartySlot, unlockUma, worldOf } from './rules'
import { newSave, parseSave, SaveParseError, type Save } from './save'
import { isBusy } from './rules'
import { availabilityBlock, collectAll, collectJob, facilityOf, grantProfessionExp, planJob, queueJob, recallJob, cutJobTime, ticketsToFinish, startJob, unqueueJob, upgradeCost, upgradeFacility, type WorkOutfit } from './work'

const T0 = Date.parse('2026-10-10T12:00:00.000Z')
const at = (ms: number) => new Date(T0 + ms).toISOString()
// Invented outfits only.
const outfit = (id: string, turf: 'A' | 'G' = 'G', dirt: 'A' | 'G' = 'G'): WorkOutfit & BattleOutfit => ({
  outfitId: id, aptitudes: { surface: { turf, dirt }, strategy: { front: 'A', pace: 'G', late: 'G', end: 'G' } } as never,
  baseStats: { speed: 100, stamina: 100, power: 100, guts: 100, wit: 100 }, growthRatePercents: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0 },
})
const turfA = outfit('101', 'A')
// One item at Lv1, any grade, any aptitude (D139): the unit these tests count time in.
const U = itemMinutes(1) * MINUTE
const EXP1 = jobExp(itemMinutes(1))
const plain = outfit('102')
/** Every outfit the tests unlock, for fights and Sweeps. */
const OUTFITS = new Map(['101', '102', '103', '104', '105'].map((id) => [id, outfit(id)]))

function withUmas(...ids: string[]): Save {
  return ids.reduce((s, id) => unlockUma(s, id, at(0)), newSave('Luis', at(0)))
}
const give = (save: Save, items: Record<string, number>, laurels = 0): Save => {
  const w = worldOf(save)
  return { ...save, tierWorlds: { '1': { ...w, items: { ...w.items, ...items }, wallet: { ...w.wallet, laurels: w.wallet.laurels + laurels } } } }
}

describe('gathering (S4)', () => {
  it('makes items one after another, at her Farm Level’s speed whatever her aptitude, and pays EXP when collected', () => {
    let save = withUmas('101', '102')
    save = startJob(save, 'fields', 0, turfA, 'wheat', 3, at(0))
    save = startJob(save, 'fields', 1, plain, 'wheat', 3, at(0))
    const [a, g] = facilityOf(worldOf(save), 'fields').jobs
    // D139: A turf and G turf at the same Farm Level take the same time.
    expect(a!.msEach).toBe(U)
    expect(g!.msEach).toBe(U)
    // Two of three are done after 2¼ items' time; collecting pays 2 wheat and their EXP.
    const half = collectJob(save, 'fields', 0, at(2.25 * U))
    expect(half.got).toMatchObject({ items: 2, exp: 2 * EXP1, done: false })
    expect(worldOf(half.save).items.wheat).toBe(2)
    expect(worldOf(half.save).umas['101']!.professions.farming).toEqual(grantProfessionExp({ level: 1, exp: 0 }, 2 * EXP1))
    const all = collectAll(half.save, at(3 * U))
    expect(all.items).toBe(4)
    expect(worldOf(all.save).items.wheat).toBe(6)
    expect(worldOf(all.save).umas['101']!.professions.farming).toEqual(grantProfessionExp({ level: 1, exp: 0 }, 3 * EXP1))
    expect(facilityOf(worldOf(all.save), 'fields').jobs).toEqual([null, null])
  })

  it('times a job by profession level alone: 9 hours for ten at Lv1, 6 at Lv50, every grade alike (D139)', () => {
    expect([1, 25, 50].map((l) => (10 * itemMinutes(l)) / 60)).toEqual([9, 7.5306122448979593, 6].map((h) => expect.closeTo(h, 6)))
    expect(itemMinutes(0)).toBe(itemMinutes(1))
    expect(itemMinutes(99)).toBe(itemMinutes(50))
    const w = worldOf(withUmas('101'))
    const at50 = { ...w, umas: { ...w.umas, '101': { ...w.umas['101']!, professions: { farming: { level: 50, exp: 0 }, gathering: { level: 25, exp: 0 } } } } }
    const grains = ITEM_FAMILIES.find((f) => f.id === 'grains')!
    for (let grade = 1; grade <= 10; grade++) {
      expect(planJob(at50, 'fields', turfA, grains.raw[grade - 1]!.id)!.msEach).toBe(36 * MINUTE)
      expect(planJob(at50, 'pantry', turfA, grains.refined[grade - 1]!.id)!.msEach).toBe(9 * MINUTE)
      expect(planJob(at50, 'kitchen', turfA, `dish-grains-${grade}`)!.msEach).toBe(makeMinutes(50) * MINUTE)
    }
    // Craft Level, not Farm Level, times the Wilds.
    expect(planJob(at50, 'mine', turfA, 'copper-ore')!.msEach).toBe(Math.round(itemMinutes(25) * MINUTE))
  })

  it('opens a grade every five profession levels and makes only the site’s family', () => {
    const world = worldOf(withUmas('101'))
    expect(planJob(world, 'fields', turfA, 'oats')?.block).toBe('Needs Farm Lv6')
    expect(planJob(world, 'fields', turfA, 'apple')?.block).toBe('Not made here')
    expect(planJob(world, 'mine', turfA, 'copper-ore')?.block).toBeNull()
  })

  it('keeps an Uma to one job, and lets her fight while she works and work while she fights (D119)', () => {
    let save = withUmas('101', '102', '103', '104', '105')
    save = startJob(save, 'fields', 0, turfA, 'wheat', 1, at(0))
    expect(isBusy(worldOf(save), '101')).toBe(true)
    expect(() => startJob(save, 'orchard', 0, turfA, 'apple', 1, at(0))).toThrow(/Already working/)
    ;['101', '102', '103', '104', '105'].forEach((id, i) => { save = setPartySlot(save, 0, i, id, at(0)) })
    const ura = regionChapter(worldContinent({ name: 'URA', order: 1 }).regions[0]!, [{ id: 'c', name: 'C' }])
    const outfits = new Map(['101', '102', '103', '104', '105'].map((id) => [id, outfit(id)]))
    save = startFight(save, ura, 'w1-1-1-s1', outfits, at(0))
    expect(availabilityBlock(worldOf(save), '102')).toBeNull()
    save = startJob(save, 'orchard', 0, outfit('102', 'A'), 'apple', 1, at(0))
    expect(isBusy(worldOf(save), '102')).toBe(true)
  })
})

describe('refining (S4)', () => {
  it('reserves inputs, returns the ones for unmade items on recall, and loses the item in progress', () => {
    let save = give(withUmas('101'), { wheat: 5 })
    expect(() => startJob(save, 'pantry', 0, turfA, 'wheat-flour', 6, at(0))).toThrow(/Needs 6 Wheat/)
    save = startJob(save, 'pantry', 0, turfA, 'wheat-flour', 5, at(0))
    expect(worldOf(save).items.wheat).toBeUndefined()
    // Refining takes a quarter of gathering (D101): 2 done at 2½ items' time, the third half made.
    const R = refineMinutes(1) * MINUTE
    expect(facilityOf(worldOf(save), 'pantry').jobs[0]!.msEach).toBe(R)
    save = recallJob(save, 'pantry', 0, at(2.5 * R))
    expect(worldOf(save).items).toEqual({ 'wheat-flour': 2, wheat: 3 })
    expect(() => startJob(save, 'pantry', 0, turfA, 'copper-ingot', 1, at(0))).toThrow(/Not refined here/)
  })
})

describe('job EXP (D96, D101)', () => {
  it('pays every job the same EXP per real minute, whatever it makes, at any grade, aptitude or facility level', () => {
    // Profession EXP is 2 per minute of the job at her level, so a faster job pays less per item and never more per hour.
    let save = withUmas('101', '102')
    for (const level of [1, 2, 3] as const) {
      const w = worldOf(save)
      const facilities = Object.fromEntries(['fields', 'pantry', 'kitchen'].map((id) => [id, { level, jobs: Array.from({ length: level === 1 ? 2 : 3 }, () => null) }]))
      save = { ...save, tierWorlds: { '1': { ...w, facilities } } }
      for (const outfit of [turfA, plain]) {
        const perMinute = EXP_PER_MINUTE * FACILITY_SPEED[level - 1]!
        for (let grade = 1; grade <= 10; grade++) {
          const grains = ITEM_FAMILIES.find((f) => f.id === 'grains')!
          for (const [place, output] of [['fields', grains.raw[grade - 1]!.id], ['pantry', grains.refined[grade - 1]!.id], ['kitchen', `dish-grains-${grade}`]] as const) {
            const plan = planJob(worldOf(save), place, outfit, output, 1)!
            expect((plan.expEach * MINUTE) / plan.msEach, `${place} G${grade} L${level}`).toBeCloseTo(perMinute, 3)
          }
        }
      }
    }
  })

  it('levels a refiner in a level-3 Pantry about twice in a full day from Lv1', () => {
    const msEach = (refineMinutes(1) * MINUTE) / 1.25
    const items = Math.floor((24 * HOUR) / msEach)
    const after = grantProfessionExp({ level: 1, exp: 0 }, items * jobExp(refineMinutes(1)))
    expect(after.level - 1).toBe(2)
  })
})

describe('Time Tickets, upgrades and the Exchange (S4, D74)', () => {
  it('takes 30 minutes off a job per Time Ticket, never past done', () => {
    let save = startJob(withUmas('102'), 'fields', 0, plain, 'wheat', 3, at(0)) // 54 minutes each at Lv1
    const job = facilityOf(worldOf(save), 'fields').jobs[0]!
    expect(ticketsToFinish(job, at(0))).toBe(6)
    expect(() => cutJobTime(save, 'fields', 0, 1, at(0))).toThrow(/1 Time Ticket/)
    save = buyTickets(give(save, {}, 70), 'time', 7, at(0))
    expect(() => cutJobTime(save, 'fields', 0, 7, at(0))).toThrow(/1–6/)
    save = cutJobTime(save, 'fields', 0, 2, at(0))
    expect(collectJob(save, 'fields', 0, at(MINUTE)).got).toMatchObject({ items: 1, done: false })
    save = cutJobTime(save, 'fields', 0, 4, at(MINUTE))
    expect(collectJob(save, 'fields', 0, at(MINUTE)).got).toMatchObject({ items: 3, done: true })
    expect(worldOf(save).wallet).toMatchObject({ laurels: 0, timeTickets: 1 })
  })

  it('turns each Rush Ticket of a v11 save into two Time Tickets', () => {
    const old = JSON.parse(JSON.stringify(withUmas('101')))
    old.schemaVersion = 11
    // Before v14 an Uma had builds, not classes (D86).
    for (const uma of Object.values(old.tierWorlds['1'].umas) as Record<string, unknown>[]) { delete uma.classId; delete uma.classes; uma.build = null; uma.builds = {} }
    const wallet = old.tierWorlds['1'].wallet
    delete wallet.timeTickets
    wallet.rushTickets = 3
    expect(worldOf(parseSave(old)).wallet.timeTickets).toBe(6)
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

  it('stocks the grades of continents with a won stage and sells raw items and tickets for Laurels', () => {
    const save = give(withUmas('101'), {}, 100)
    expect(stockedGrades(worldOf(save))).toEqual([])
    const w = worldOf(save)
    const reached = { ...w, world: { ...w.world, run: { ...w.world.run, wins: { start: 1, 'w2-1-1-s1': 1, 'w2-3-4-s2': 2 } } } }
    const grades = stockedGrades(reached)
    expect(grades).toEqual([3, 4])
    expect(() => buyRawItem(save, 'wheat', 1, grades, at(0))).toThrow(/stocked/)
    const bought = buyRawItem(save, 'barley', 2, grades, at(0)) // 40 Laurels each
    expect(worldOf(bought).items.barley).toBe(2)
    expect(worldOf(bought).wallet.laurels).toBe(20)
    expect(() => buyRawItem(bought, 'barley', 2, grades, at(0))).toThrow(/Laurels/)
    expect(() => buyRawItem(save, 'pearl-barley', 1, grades, at(0))).toThrow(/raw/)
  })

  it('sweeps a beaten regular stage as a replay: a quarter of its first clear (D79)', () => {
    let save = give(withUmas('101', '102', '103', '104', '105'), {}, 15)
    ;['101', '102', '103', '104', '105'].forEach((id, i) => { save = setPartySlot(save, 0, i, id, at(0)) })
    const ura = regionChapter(worldContinent({ name: 'URA', order: 1 }).regions[0]!, [{ id: 'c', name: 'C' }])
    expect(sweepBlock(worldOf(save), ura, 'w1-1-1-s1')).toBe('Clear it first')
    const w = worldOf(save)
    save = { ...save, tierWorlds: { '1': { ...w, world: { ...w.world, run: { ...w.world.run, wins: { start: 1, 'w1-1-1-s1': 1, 'w1-1-1-s12': 1 } } } } } }
    expect(sweepBlock(worldOf(save), ura, 'w1-1-1-s12')).toBe('Only regular stages can be swept')
    expect(sweepBlock(worldOf(save), ura, 'w1-1-1-s1')).toBe('No Sweep Tickets')
    save = buyTickets(save, 'sweep', 1, at(0))
    const swept = sweepFight(save, ura, 'w1-1-1-s1', OUTFITS, at(0))
    expect(swept.result).toMatchObject({ outcome: 'victory', laurels: 8, firstClear: false })
    expect(swept.result.members.every((m) => m.exp > 0)).toBe(true)
    expect(worldOf(swept.save).wallet).toMatchObject({ laurels: 8, sweepTickets: 0 })
    expect(worldOf(swept.save).world.run.wins['w1-1-1-s1']).toBe(2)
  })
})

describe('batch sizes (D65, D139)', () => {
  it('starts gathering jobs of up to 10 and refining of up to 40, and still loads saves holding jobs of up to 50', () => {
    const save = startJob(withUmas('101'), 'fields', 0, turfA, 'wheat', 10, at(0))
    expect(() => startJob(save, 'fields', 1, plain, 'wheat', 11, at(0))).toThrow(/1–10/)
    expect(REFINE_BATCHES).toEqual([1, 4, 8, 20, 40])
    const refining = give(withUmas('101', '102'), { wheat: 41 })
    const forty = startJob(refining, 'pantry', 0, turfA, 'wheat-flour', 40, at(0))
    // Forty refines take as long as ten gathers.
    const job = facilityOf(worldOf(forty), 'pantry').jobs[0]!
    expect(job.count * job.msEach).toBe(10 * itemMinutes(1) * MINUTE)
    expect(() => startJob(refining, 'pantry', 1, plain, 'wheat-flour', 41, at(0))).toThrow(/1–40/)
    const old = JSON.parse(JSON.stringify(save))
    old.tierWorlds['1'].facilities.fields.jobs[0].count = 50
    expect(facilityOf(worldOf(parseSave(old)), 'fields').jobs[0]!.count).toBe(50)
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

describe('profession pacing (D96)', () => {
  const DAY = 24 * 60
  // EXP from Lv1 to a level, and the real minutes of steady work it takes at an aptitude share (2 EXP per base minute).
  const expTo = (level: number) => { let exp = 0; for (let l = 1; l < level; l++) exp += professionExpToNext(l); return exp }
  const minutesTo = (level: number, aptitudeShare: number, speed = 1) => (expTo(level) / 2) * aptitudeShare / speed
  it('gains about 4 levels a day at A aptitude, 3 at C and 2 at G early on, never more than 5', () => {
    expect(DAY / ((professionExpToNext(1) / 2) * 0.5)).toBe(4)
    expect(DAY / ((professionExpToNext(1) / 2) * (2 / 3))).toBe(3)
    expect(DAY / (professionExpToNext(1) / 2)).toBe(2)
    // A level-3 facility works a quarter faster: 5 a day at A.
    expect(DAY / ((professionExpToNext(1) / 2) * 0.5 / 1.25)).toBe(5)
  })
  it('reaches Lv50 in about two weeks of steady work at A and a month at G; grade 10 a day or two sooner', () => {
    expect(expTo(PROFESSION_MAX_LEVEL)).toBe(88_200)
    expect(Math.round(minutesTo(PROFESSION_MAX_LEVEL, 0.5) / DAY)).toBe(15)
    expect(Math.round(minutesTo(PROFESSION_MAX_LEVEL, 0.5, 1.25) / DAY)).toBe(12)
    expect(Math.round(minutesTo(PROFESSION_MAX_LEVEL, 1) / DAY)).toBe(31)
    expect(Math.round(minutesTo(46, 0.5) / DAY)).toBe(14)
    expect(HOUR).toBe(60 * MINUTE)
  })
  it('moves a v15 save\'s levels to what the same work earns on the new curve', () => {
    const old = JSON.parse(JSON.stringify(withUmas('101', '102')))
    old.schemaVersion = 15
    // Lv27 with 50 EXP on the old 20 + 6L curve is 2,676 EXP of work; Lv50 with 100 banked is 8,430.
    old.tierWorlds['1'].umas['101'].professions = { farming: { level: 27, exp: 50 }, gathering: { level: 1, exp: 0 } }
    old.tierWorlds['1'].umas['102'].professions = { farming: { level: 50, exp: 100 }, gathering: { level: 6, exp: 10 } }
    const moved = worldOf(parseSave(old)).umas
    expect(moved['101']!.professions).toEqual({ farming: { level: 2, exp: 2676 - 1440 }, gathering: { level: 1, exp: 0 } })
    expect(moved['102']!.professions).toEqual({ farming: grantProfessionExp({ level: 1, exp: 0 }, 8430), gathering: { level: 1, exp: 200 } })
    expect(moved['102']!.professions.farming.level).toBe(6)
  })
})

describe('Sweep ×N (QoL)', () => {
  it('sweeps until the tickets run out and adds up what it paid', async () => {
    const { sweepMany } = await import('./exchange')
    let save = give(withUmas('101', '102', '103', '104', '105'), {}, 45)
    ;['101', '102', '103', '104', '105'].forEach((id, i) => { save = setPartySlot(save, 0, i, id, at(0)) })
    const ura = regionChapter(worldContinent({ name: 'URA', order: 1 }).regions[0]!, [{ id: 'c', name: 'C' }])
    const w = worldOf(save)
    save = { ...save, tierWorlds: { '1': { ...w, world: { ...w.world, run: { ...w.world.run, wins: { start: 1, 'w1-1-1-s1': 1 } } } } } }
    save = buyTickets(save, 'sweep', 3, at(0))
    const one = sweepFight(save, ura, 'w1-1-1-s1', OUTFITS, at(0)).result.members[0]!.exp
    const r = sweepMany(save, ura, 'w1-1-1-s1', 5, OUTFITS, at(0))
    expect(r.swept).toBe(3)
    expect(r.result.members[0]!.exp).toBeGreaterThanOrEqual(3 * one - 3)
    expect(r.result.members[0]!.beforeLevel).toBe(1)
    expect(worldOf(r.save).wallet.sweepTickets).toBe(0)
    expect(worldOf(r.save).world.run.wins['w1-1-1-s1']).toBe(4)
  })
})

describe('selling (QoL)', () => {
  it('sells spare stock for far less than it costs to buy', async () => {
    const { sellPrice, sellStock } = await import('./exchange')
    expect([sellPrice('items', 'barley'), sellPrice('items', 'pearl-barley'), sellPrice('dishes', 'dish-fruits-2'), sellPrice('gear', 'greatsword-g4')]).toEqual([8, 16, 18, 30])
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
