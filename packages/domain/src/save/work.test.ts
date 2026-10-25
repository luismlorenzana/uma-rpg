import { describe, expect, it } from 'vitest'
import { regionChapter, worldContinent } from '../world/world'
import { EXP_PER_MINUTE, FACILITY_SPEED, HOUR, itemMinutes, jobExp, makeMinutes, MINUTE, professionExpToNext, PROFESSION_MAX_LEVEL, REFINE_BATCHES, refineMinutes } from '../economy/pacing'
import { ITEM_FAMILIES } from '../items/catalog'
import { RPG_BUILDINGS, RPG_WORK_ENV } from '../work/env'
import type { RpgWorkRequest } from '../work/request'
import {
  chainTimes, endsAt, finishedCount, isRefusal, kindRules, progress, remainingMs, settle, slotHolder, slotsOf, statusOf,
  ticketsToFinish, type Entry, type WorkRow,
} from '@luismlorenzana/uma-work'
import { startFight, type BattleOutfit } from './battle'
import { buyRawItem, buyTickets, stockedGrades, sweepBlock, sweepFight } from './exchange'
import { setPartySlot, unlockUma, worldOf } from './rules'
import { newSave, parseSave, SAVE_SCHEMA_VERSION, SaveParseError, type Save } from './save'
import { isBusy } from './rules'
import {
  availabilityBlock, collectAll, collectJob, cutJobTime, dismissStopped, grantProfessionExp, planJob, queueJob, recallJob, refusalText, repeatJob, restartStopped,
  startJob, unqueueJob, upgradeCost, upgradeFacility, type WorkOutfit,
} from './work'
import { stockName } from '../economy/stock'

const T0 = Date.parse('2026-10-10T12:00:00.000Z')
const at = (ms: number) => new Date(T0 + ms).toISOString()
// Invented outfits only.
const outfit = (id: string, turf: 'A' | 'G' = 'G', dirt: 'A' | 'G' = 'G'): WorkOutfit & BattleOutfit => ({
  // Her distances read her template's stride from engine v16 (her Flourish, H68).
  outfitId: id, aptitudes: { surface: { turf, dirt }, strategy: { front: 'A', pace: 'G', late: 'G', end: 'G' },
    distance: { sprint: 'G', mile: 'A', medium: 'G', long: 'G' } } as never,
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

/** Engine readings used by the rules tests after SC4 removed the old product-screen adapter. */
function facilityView(world: ReturnType<typeof worldOf>, placeId: string, nowIso: string) {
  const now = Date.parse(nowIso)
  const settled = settle(world, now, RPG_WORK_ENV).state
  const readyItems = (row: WorkRow<RpgWorkRequest>) => row.entries.reduce((n, entry) => n + finishedCount(entry, now) - entry.collected, 0)
  const jobs = slotsOf(settled, placeId, RPG_BUILDINGS).map((slot) => {
    const outfitId = slotHolder(settled, slot)
    if (!outfitId) return null
    const row = settled.work[outfitId] as WorkRow<RpgWorkRequest>
    const last: Entry<RpgWorkRequest> = row.entries.at(-1)!
    const queuedSeconds = row.queue.map((request) => {
      const made = kindRules(RPG_WORK_ENV, request.kind)!.plan(settled, outfitId, request, now, { slot: row.slot!, speed: last.speed, earlier: [], env: RPG_WORK_ENV })
      return isRefusal(made) ? [] : made.map((item) => item.seconds)
    })
    const times = chainTimes(row, queuedSeconds)
    const status = statusOf(row, now)
    return {
      outfitId, count: last.request.count, finished: finishedCount(last, now), ready: readyItems(row),
      done: status === 'ready', startedAt: last.startedAt, endsAt: endsAt(last), progress: progress(last, now),
      ticketsToFinish: status === 'ready' ? 0 : ticketsToFinish(remainingMs(last, now)),
      queue: row.queue.map((request, index) => ({ output: request.item, count: request.count, startsAt: times.queued[index]?.startsAt ?? 0, endsAt: times.queued[index]?.endsAt ?? 0 })),
    }
  })
  const stopped = Object.values(settled.work).filter((row) => row.dropped?.slot.building === placeId).map((row) => ({
    outfitId: row.outfitId,
    requests: row.dropped!.requests,
    why: row.dropped!.refused ? refusalText(row.dropped!.refused, now) : row.dropped!.short.map((item) => `short ${item.qty} ${stockName(item.item)}`).join(', '),
  }))
  return { level: settled.buildings[placeId]?.level ?? 1, jobs, stopped }
}

describe('gathering (S4)', () => {
  it('makes items one after another, at her Craft Level’s speed whatever her aptitude, and pays EXP when collected', () => {
    let save = withUmas('101', '102')
    save = startJob(save, 'monster-den', 0, turfA, 'puffbun-pelt', 3, at(0))
    save = startJob(save, 'monster-den', 1, plain, 'puffbun-pelt', 3, at(0))
    const [a, g] = facilityView(worldOf(save), 'monster-den', at(0)).jobs
    // D139: A turf and G turf at the same Craft Level take the same time: three items end at 3U.
    expect(a!.endsAt - T0).toBe(3 * U)
    expect(g!.endsAt - T0).toBe(3 * U)
    // Two of three are done after 2¼ items' time; collecting pays 2 pelts and their EXP.
    const half = collectJob(save, 'monster-den', 0, at(2.25 * U))
    expect(half.got).toMatchObject({ items: 2, exp: 2 * EXP1, done: false })
    expect(worldOf(half.save).items['puffbun-pelt']).toBe(2)
    expect(worldOf(half.save).umas['101']!.craft).toEqual(grantProfessionExp({ level: 1, exp: 0 }, 2 * EXP1))
    const all = collectAll(half.save, at(3 * U))
    expect(all.items).toBe(4)
    expect(worldOf(all.save).items['puffbun-pelt']).toBe(6)
    expect(worldOf(all.save).umas['101']!.craft).toEqual(grantProfessionExp({ level: 1, exp: 0 }, 3 * EXP1))
    expect(facilityView(worldOf(all.save), 'monster-den', at(3 * U)).jobs).toEqual([null, null, null])
  })

  it('times a job by Craft Level alone: 9 hours for ten at Lv1, 6 at Lv50, every grade alike (D139)', () => {
    expect([1, 25, 50].map((l) => (10 * itemMinutes(l)) / 60)).toEqual([9, 7.5306122448979593, 6].map((h) => expect.closeTo(h, 6)))
    expect(itemMinutes(0)).toBe(itemMinutes(1))
    expect(itemMinutes(99)).toBe(itemMinutes(50))
    const w = worldOf(withUmas('101'))
    const at50 = { ...w, umas: { ...w.umas, '101': { ...w.umas['101']!, craft: { level: 50, exp: 0 } } } }
    const hides = ITEM_FAMILIES.find((f) => f.id === 'hides-scales')!
    for (let grade = 1; grade <= 10; grade++) {
      expect(planJob(at50, 'monster-den', turfA, hides.raw[grade - 1]!.id)!.itemMs).toBe(36 * MINUTE)
      expect(planJob(at50, 'workbench', turfA, hides.refined[grade - 1]!.id)!.itemMs).toBe(9 * MINUTE)
      expect(planJob(at50, 'lapidary', turfA, `gem-hp-${grade}`)!.itemMs).toBe(makeMinutes(50) * MINUTE)
    }
  })

  it('opens a grade every five Craft Levels and makes only the site’s family', () => {
    const world = worldOf(withUmas('101'))
    expect(planJob(world, 'monster-den', turfA, 'boarling-hide')?.block).toBe('Needs Craft Lv6')
    expect(planJob(world, 'monster-den', turfA, 'mist-essence')?.block).toBe("That isn't made here.")
    expect(planJob(world, 'mine', turfA, 'copper-ore')?.block).toBeNull()
  })

  it('keeps an Uma to one job, and lets her fight while she works and work while she fights (D119)', () => {
    let save = withUmas('101', '102', '103', '104', '105')
    save = startJob(save, 'monster-den', 0, turfA, 'puffbun-pelt', 1, at(0))
    expect(isBusy(worldOf(save), '101')).toBe(true)
    expect(() => startJob(save, 'ley-spring', 0, turfA, 'mist-essence', 1, at(0))).toThrow(/busy for another 54 min/)
    ;['101', '102', '103', '104', '105'].forEach((id, i) => { save = setPartySlot(save, 0, i, id, at(0)) })
    const ura = regionChapter(worldContinent({ name: 'URA', order: 1 }).regions[0]!, [{ id: 'c', name: 'C' }])
    const outfits = new Map(['101', '102', '103', '104', '105'].map((id) => [id, outfit(id)]))
    save = startFight(save, ura, 'w1-1-1-s1', outfits, at(0))
    expect(availabilityBlock(worldOf(save), '102', at(0))).toBeNull()
    expect(availabilityBlock(worldOf(save), '101', at(0))).toBe('Already working')
    save = startJob(save, 'ley-spring', 0, outfit('102', 'A'), 'mist-essence', 1, at(0))
    expect(isBusy(worldOf(save), '102')).toBe(true)
  })
})

describe('refining (S4)', () => {
  it('reserves inputs, returns the ones for unmade items on recall, and loses the item in progress', () => {
    let save = give(withUmas('101'), { 'puffbun-pelt': 5 })
    expect(() => startJob(save, 'workbench', 0, turfA, 'puffbun-leather', 6, at(0))).toThrow(/Short 1 Puffbun Pelt/)
    save = startJob(save, 'workbench', 0, turfA, 'puffbun-leather', 5, at(0))
    expect(worldOf(save).items['puffbun-pelt']).toBeUndefined()
    // Refining takes a quarter of gathering (D101): 2 done at 2½ items' time, the third half made.
    const R = refineMinutes(1) * MINUTE
    expect(facilityView(worldOf(save), 'workbench', at(0)).jobs[0]!.endsAt - T0).toBe(5 * R)
    save = recallJob(save, 'workbench', 0, at(2.5 * R))
    expect(worldOf(save).items).toEqual({ 'puffbun-leather': 2, 'puffbun-pelt': 3 })
    expect(() => startJob(save, 'workbench', 0, turfA, 'copper-ore', 1, at(0))).toThrow(/isn't made here/)
  })
})

describe('job EXP (D96, D101)', () => {
  it('pays every job the same EXP per real minute, whatever it makes, at any grade, aptitude or facility level', () => {
    // Profession EXP is 2 per minute of the job at her level, so a faster job pays less per item and never more per hour.
    let save = withUmas('101', '102')
    for (const level of [1, 2, 3] as const) {
      const w = worldOf(save)
      const buildings = Object.fromEntries(['monster-den', 'workbench', 'lapidary'].map((id) => [id, { level }]))
      save = { ...save, tierWorlds: { '1': { ...w, buildings } } }
      for (const outfit of [turfA, plain]) {
        const perMinute = EXP_PER_MINUTE * FACILITY_SPEED[level - 1]!
        for (let grade = 1; grade <= 10; grade++) {
          const hides = ITEM_FAMILIES.find((f) => f.id === 'hides-scales')!
          for (const [place, output] of [['monster-den', hides.raw[grade - 1]!.id], ['workbench', hides.refined[grade - 1]!.id], ['lapidary', `gem-hp-${grade}`]] as const) {
            const plan = planJob(worldOf(save), place, outfit, output, 1)!
            expect((plan.expEach * MINUTE) / plan.itemMs, `${place} G${grade} L${level}`).toBeCloseTo(perMinute, 3)
          }
        }
      }
    }
  })

  it('levels a refiner in a level-3 Workbench about twice in a full day from Lv1', () => {
    const msEach = (refineMinutes(1) * MINUTE) / 1.25
    const items = Math.floor((24 * HOUR) / msEach)
    const after = grantProfessionExp({ level: 1, exp: 0 }, items * jobExp(refineMinutes(1)))
    expect(after.level - 1).toBe(2)
  })
})

describe('Speed Tickets, upgrades and the Exchange (S4, D74)', () => {
  it('takes 30 minutes off a job per Speed Ticket, never past done, and never spends more than finish it', () => {
    let save = startJob(withUmas('102'), 'monster-den', 0, plain, 'puffbun-pelt', 3, at(0)) // 54 minutes each at Lv1
    expect(facilityView(worldOf(save), 'monster-den', at(0)).jobs[0]!.ticketsToFinish).toBe(6)
    expect(() => cutJobTime(save, 'monster-den', 0, 1, at(0))).toThrow(/^Needs 1 Speed Ticket$/)
    save = buyTickets(give(save, {}, 80), 'time', 8, at(0))
    save = cutJobTime(save, 'monster-den', 0, 2, at(0))
    expect(collectJob(save, 'monster-den', 0, at(MINUTE)).got).toMatchObject({ items: 1, done: false })
    // Seven asked, four finish it: four spent.
    save = cutJobTime(save, 'monster-den', 0, 7, at(MINUTE))
    expect(collectJob(save, 'monster-den', 0, at(MINUTE)).got).toMatchObject({ items: 3, done: true })
    expect(worldOf(save).wallet).toMatchObject({ laurels: 0, timeTickets: 2 })
  })

  it('turns each Rush Ticket of a v11 save into two Speed Tickets', () => {
    const old = JSON.parse(JSON.stringify(withUmas('101')))
    old.schemaVersion = 11
    // Before v14 an Uma had builds, not classes (D86).
    // Before v21 an Uma had professions, not a Craft Level (D144).
    for (const uma of Object.values(old.tierWorlds['1'].umas) as Record<string, unknown>[]) {
      delete uma.classId; delete uma.classes; uma.build = null; uma.builds = {}
      uma.professions = { gathering: uma.craft }; delete uma.craft
    }
    const wallet = old.tierWorlds['1'].wallet
    delete wallet.timeTickets
    wallet.rushTickets = 3
    expect(worldOf(parseSave(old)).wallet.timeTickets).toBe(6)
  })

  it('upgrades a facility with Laurels and refined items of its two families', () => {
    let save = withUmas('101')
    expect(upgradeCost(worldOf(save), 'monster-den')).toEqual({ laurels: 150, items: { 'boarling-leather': 1, 'ammonite-carving': 1 } })
    expect(() => upgradeFacility(save, 'monster-den', at(0))).toThrow(/Laurels/)
    save = give(save, { 'boarling-leather': 1, 'ammonite-carving': 1 }, 150)
    save = upgradeFacility(save, 'monster-den', at(0))
    expect(facilityView(worldOf(save), 'monster-den', at(0))).toMatchObject({ level: 2, jobs: [null, null, null, null] })
    expect(worldOf(save).buildings).toEqual({ 'monster-den': { level: 2 } })
    expect(worldOf(save).items).toEqual({})
    expect(upgradeCost(worldOf(save), 'workbench')?.items).toEqual({ 'sandstone-block': 1, 'birch-plank': 1 })
  })

  it('stocks the grades of continents with a won stage and sells raw items and tickets for Laurels', () => {
    const save = give(withUmas('101'), {}, 100)
    expect(stockedGrades(worldOf(save))).toEqual([])
    const w = worldOf(save)
    const reached = { ...w, world: { ...w.world, run: { ...w.world.run, wins: { start: 1, 'w2-1-1-s1': 1, 'w2-3-4-s2': 2 } } } }
    const grades = stockedGrades(reached)
    expect(grades).toEqual([3, 4])
    expect(() => buyRawItem(save, 'puffbun-pelt', 1, grades, at(0))).toThrow(/stocked/)
    const bought = buyRawItem(save, 'wolfkin-pelt', 2, grades, at(0)) // 40 Laurels each
    expect(worldOf(bought).items['wolfkin-pelt']).toBe(2)
    expect(worldOf(bought).wallet.laurels).toBe(20)
    expect(() => buyRawItem(bought, 'wolfkin-pelt', 2, grades, at(0))).toThrow(/Laurels/)
    expect(() => buyRawItem(save, 'wolfkin-leather', 1, grades, at(0))).toThrow(/raw/)
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
  it('starts gathering jobs of up to 10 and refining of up to 40', () => {
    const save = startJob(withUmas('101', '102'), 'monster-den', 0, turfA, 'puffbun-pelt', 10, at(0))
    expect(() => startJob(save, 'monster-den', 1, plain, 'puffbun-pelt', 11, at(0))).toThrow(/1 to 10/)
    expect(REFINE_BATCHES).toEqual([1, 4, 8, 20, 40])
    const refining = give(withUmas('101', '102'), { 'puffbun-pelt': 41 })
    const forty = startJob(refining, 'workbench', 0, turfA, 'puffbun-leather', 40, at(0))
    // Forty refines take as long as ten gathers.
    expect(facilityView(worldOf(forty), 'workbench', at(0)).jobs[0]!.endsAt - T0).toBe(10 * itemMinutes(1) * MINUTE)
    expect(() => startJob(refining, 'workbench', 1, plain, 'puffbun-leather', 41, at(0))).toThrow(/1 to 40/)
  })
})

describe('save v22 (SC3)', () => {
  it('round-trips the Warehouse, buildings and work rows, and rejects two Umas in one slot or an unknown item', () => {
    let save = give(withUmas('101', '102'), { 'puffbun-pelt': 3 })
    save = startJob(save, 'monster-den', 0, turfA, 'puffbun-pelt', 2, at(0))
    save = startJob(save, 'workbench', 0, plain, 'puffbun-leather', 3, at(0))
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
    const twice = JSON.parse(JSON.stringify(save))
    twice.tierWorlds['1'].work['102'] = { ...twice.tierWorlds['1'].work['101'], outfitId: '102' }
    expect(() => parseSave(twice)).toThrow(/already held/)
    const stray = JSON.parse(JSON.stringify(save))
    stray.tierWorlds['1'].work['101'].room = 'gym'
    expect(() => parseSave(stray)).toThrow(/unknown keys room/)
    const unknown = JSON.parse(JSON.stringify(save))
    unknown.tierWorlds['1'].items.unobtainium = 1
    expect(() => parseSave(unknown)).toThrow(SaveParseError)
  })
})

describe('the v22 migration (SC3)', () => {
  /** A v21 save as it was stored: jobs in facility slots, a queue behind one, empty slots and a facility at Lv 3. */
  function v21(): Record<string, unknown> {
    const old = JSON.parse(JSON.stringify(withUmas('101', '102', '103')))
    old.schemaVersion = 21
    const w = old.tierWorlds['1']
    delete w.buildings
    delete w.work
    w.items = { 'puffbun-pelt': 1 }
    const job = (kind: string, outfitId: string, output: string, count: number, collected: number, expEach: number, inputs: Record<string, number>, queue: unknown[] = []) =>
      ({ kind, outfitId, output, count, collected, startedAt: at(0), msEach: U, expEach, inputs, queue })
    w.facilities = {
      'monster-den': { level: 2, jobs: [job('gather', '101', 'puffbun-pelt', 5, 2, 108, {}, [{ output: 'puffbun-pelt', count: 3, msEach: U, expEach: 108, inputs: {} }]), null, null, null] },
      workbench: { level: 1, jobs: [null, job('refine', '102', 'puffbun-leather', 4, 0, 27, { 'puffbun-pelt': 1 }), null] },
      forge: { level: 1, jobs: [job('craft', '103', 'greatsword-g1', 1, 0, 216, { 'copper-ingot': 1, 'cut-quartz': 1 }), null, null] },
      lapidary: { level: 3, jobs: [null, null, null, null, null] },
    }
    return old
  }

  it('finishes every running job into its shelf with its Craft EXP, drops queues, keeps levels and frees every Uma', () => {
    const world = worldOf(parseSave(v21()))
    expect(world.buildings).toEqual({ 'monster-den': { level: 2 }, lapidary: { level: 3 } })
    expect(world.work).toEqual({})
    // Three pelts still to hand over join the one in stock; four leathers (their pelts were taken at start); one sword.
    expect(world.items).toEqual({ 'puffbun-pelt': 4, 'puffbun-leather': 4 })
    expect(world.gear).toEqual({ 'greatsword-g1': 1 })
    // The queued three pelts reserved nothing and pay nothing.
    expect(world.umas['101']!.craft).toEqual(grantProfessionExp({ level: 1, exp: 0 }, 3 * 108))
    expect(world.umas['102']!.craft).toEqual(grantProfessionExp({ level: 1, exp: 0 }, 4 * 27))
    expect(world.umas['103']!.craft).toEqual(grantProfessionExp({ level: 1, exp: 0 }, 216))
    expect(['101', '102', '103'].map((id) => availabilityBlock(world, id, at(0)))).toEqual([null, null, null])
    // The migrated save round-trips at the current version.
    const migrated = parseSave(v21())
    expect(migrated.schemaVersion).toBe(SAVE_SCHEMA_VERSION)
    expect(parseSave(JSON.parse(JSON.stringify(migrated)))).toEqual(migrated)
  })

  it('migrates a v21 save with no facilities at all', () => {
    const old = v21() as { tierWorlds: Record<string, Record<string, unknown>> }
    old.tierWorlds['1']!.facilities = {}
    expect(worldOf(parseSave(old))).toMatchObject({ buildings: {}, work: {}, items: { 'puffbun-pelt': 1 } })
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
  it('moves a v15 save\'s levels to what the same work earns on the new curve, then keeps the higher as Craft Level (D144)', () => {
    const old = JSON.parse(JSON.stringify(withUmas('101', '102')))
    old.schemaVersion = 15
    // The old save's two professions. Lv27 with 50 EXP on the old 20 + 6L curve is 2,676 EXP of work; Lv50 with 100 banked is 8,430.
    old.tierWorlds['1'].umas['101'].professions = { farming: { level: 27, exp: 50 }, gathering: { level: 1, exp: 0 } }
    old.tierWorlds['1'].umas['102'].professions = { farming: { level: 50, exp: 100 }, gathering: { level: 6, exp: 10 } }
    const moved = worldOf(parseSave(old)).umas
    expect(moved['101']!.craft).toEqual({ level: 2, exp: 2676 - 1440 })
    expect(moved['102']!.craft).toEqual(grantProfessionExp({ level: 1, exp: 0 }, 8430))
    expect(moved['102']!.craft.level).toBe(6)
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
    expect([sellPrice('items', 'wolfkin-pelt'), sellPrice('items', 'wolfkin-leather'), sellPrice('gems', 'gem-mp-2'), sellPrice('gear', 'greatsword-g4')]).toEqual([8, 16, 18, 30])
    let save = give(withUmas('101'), { 'wolfkin-pelt': 5 })
    save = sellStock(save, 'items', 'wolfkin-pelt', 5, at(0))
    expect(worldOf(save).items['wolfkin-pelt']).toBeUndefined()
    expect(worldOf(save).wallet.laurels).toBe(40)
    expect(() => sellStock(save, 'items', 'wolfkin-pelt', 1, at(0))).toThrow(/you have 0/)
  })
})

describe('job queues (QoL, D62)', () => {
  it('starts each queued job when the last one finishes, catching up however late it’s collected', () => {
    let save = startJob(withUmas('101'), 'monster-den', 0, turfA, 'puffbun-pelt', 2, at(0))
    save = queueJob(save, 'monster-den', 0, turfA, 'puffbun-pelt', 3, at(0))
    save = queueJob(save, 'monster-den', 0, turfA, 'puffbun-pelt', 1, at(0))
    expect(() => queueJob(save, 'monster-den', 0, plain, 'puffbun-pelt', 1, at(0))).toThrow(/her own job/)
    expect(() => queueJob(save, 'monster-den', 0, turfA, 'boarling-hide', 1, at(0))).toThrow(/Needs Craft Lv6/)
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
    // The first job ends at 2 items' time; the second starts then and has one done at 3.
    const mid = collectJob(save, 'monster-den', 0, at(3.5 * U))
    expect(mid.got).toMatchObject({ items: 3, done: false })
    const job = facilityView(worldOf(mid.save), 'monster-den', at(3.5 * U)).jobs[0]!
    expect(job).toMatchObject({ count: 3, finished: 1, ready: 0, startedAt: T0 + 2 * U })
    expect(job.queue).toEqual([{ output: 'puffbun-pelt', count: 1, startsAt: T0 + 5 * U, endsAt: T0 + 6 * U }])
    const end = collectAll(mid.save, at(7 * U))
    expect(worldOf(end.save).items['puffbun-pelt']).toBe(6)
    expect(facilityView(worldOf(end.save), 'monster-den', at(7 * U)).jobs[0]).toBeNull()
  })

  it('takes a queued job’s inputs when it starts, and keeps a queue the Warehouse can’t cover as stopped (SC3)', () => {
    let save = give(withUmas('101'), { 'puffbun-pelt': 2 })
    save = startJob(save, 'workbench', 0, turfA, 'puffbun-leather', 2, at(0))
    save = queueJob(save, 'workbench', 0, turfA, 'puffbun-leather', 2, at(0))
    const short = collectJob(save, 'workbench', 0, at(5 * U)).save
    expect(worldOf(short).items).toEqual({ 'puffbun-leather': 2 })
    const view = facilityView(worldOf(short), 'workbench', at(5 * U))
    expect(view.jobs[0]).toBeNull()
    expect(view.stopped).toEqual([{ outfitId: '101', requests: [{ kind: 'refine', item: 'puffbun-leather', count: 2 }], why: 'short 2 Puffbun Pelt' }])
    // Restarting it needs the inputs now; dismissing forgets it.
    expect(() => restartStopped(short, '101', at(5 * U))).toThrow(/Short 2 Puffbun Pelt/)
    const restarted = restartStopped(give(short, { 'puffbun-pelt': 2 }), '101', at(5 * U))
    expect(facilityView(worldOf(restarted), 'workbench', at(5 * U))).toMatchObject({ stopped: [], jobs: [{ outfitId: '101', count: 2 }, null, null] })
    expect(facilityView(worldOf(dismissStopped(short, '101', at(5 * U))), 'workbench', at(5 * U)).stopped).toEqual([])
    const stocked = collectJob(give(save, { 'puffbun-pelt': 3 }), 'workbench', 0, at(5 * U)).save
    expect(worldOf(stocked).items).toEqual({ 'puffbun-leather': 4, 'puffbun-pelt': 1 })
  })

  it('removes a queued job, and a recall drops the whole queue without taking its inputs', () => {
    let save = give(withUmas('101'), { 'puffbun-pelt': 4 })
    save = startJob(save, 'workbench', 0, turfA, 'puffbun-leather', 2, at(0))
    save = queueJob(save, 'workbench', 0, turfA, 'puffbun-leather', 1, at(0))
    save = queueJob(save, 'workbench', 0, turfA, 'puffbun-leather', 2, at(0))
    save = unqueueJob(save, 'workbench', 0, 0, at(0))
    expect(facilityView(worldOf(save), 'workbench', at(0)).jobs[0]!.queue.map((q) => q.count)).toEqual([2])
    // Halfway through her second refine: one made, the one in progress lost and its input back, the queue dropped unstarted.
    const R = refineMinutes(1) * MINUTE
    save = recallJob(save, 'workbench', 0, at(1.5 * R))
    expect(worldOf(save).items).toEqual({ 'puffbun-leather': 1, 'puffbun-pelt': 3 })
    expect(facilityView(worldOf(save), 'workbench', at(1.5 * R))).toMatchObject({ jobs: [null, null, null], stopped: [] })
    // A recall forgets her last job: nothing to repeat.
    expect(() => repeatJob(save, '101', at(1.5 * R))).toThrow(/nothing to repeat/)
  })

  it('repeats her last job where she did it, collecting first when she is ready (SC3)', () => {
    let save = withUmas('101', '102')
    save = startJob(save, 'monster-den', 1, turfA, 'puffbun-pelt', 2, at(0))
    // Ready: Repeat collects her two and starts two more in the same slot.
    save = repeatJob(save, '101', at(2 * U))
    expect(worldOf(save).items['puffbun-pelt']).toBe(2)
    expect(facilityView(worldOf(save), 'monster-den', at(2 * U)).jobs[1]).toMatchObject({ outfitId: '101', count: 2, startedAt: T0 + 2 * U })
    // Collected and free: Repeat reads her last job; her slot taken, she takes the first free one.
    save = collectJob(save, 'monster-den', 1, at(4 * U)).save
    save = startJob(save, 'monster-den', 1, plain, 'puffbun-pelt', 1, at(4 * U))
    save = repeatJob(save, '101', at(4 * U))
    expect(facilityView(worldOf(save), 'monster-den', at(4 * U)).jobs.map((j) => j?.outfitId ?? null)).toEqual(['101', '102', null])
  })
})
