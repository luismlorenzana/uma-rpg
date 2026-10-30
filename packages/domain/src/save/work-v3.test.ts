// The Wilds' work over the save (H77; profession-progression.md §4–§5, PP4, PP16; the farm by line since H112, D224),
// on engine v17: the live env, four slots a place, no levels, collects, Speed Tickets, the trade gate through the
// operations' context and none for settles.
import { describe, expect, it } from 'vitest'
import { SAVE_SCHEMA_VERSION } from './version'
import { jobExp, MINUTE, stepMinutes } from '../economy/pacing'
import { tradeOfCalling } from '../economy/professions'
import type { UmaCallingClass } from '../roster/template'
import { ECONOMY_V3_NOW, gradedUma, gradedWorld } from './economy-v3.fixture'
import { worldOf } from './rules'
import type { Save } from './save'
import {
  availableWorkers, checkRestartStopped, collectJob, cutJobTime, NO_PLACE_LEVELS, planJob, queueJob, readyWork, repeatJob, slotJobOf, startJob,
  upgradeCost, upgradeFacility,
} from './work'


const T0 = Date.parse(ECONOMY_V3_NOW)
const at = (ms: number) => new Date(T0 + ms).toISOString()
/** One Craft Lv 1 step in a slot: 36 minutes ÷ 1.25. */
const GATHER_MS = Math.round((stepMinutes(1) * 60) / 1.25) * 1000

function saveOf(umas: Record<string, number>, items: Record<string, number> = {}, tier = '1', wallet: Partial<Save['tierWorlds'][string]['wallet']> = {}): Save {
  const base = gradedWorld({})
  const world = gradedWorld({ items, wallet: { ...base.wallet, ...wallet },
    umas: Object.fromEntries(Object.entries(umas).map(([id, level]) => [id, gradedUma({ craft: { level, exp: 0 } })])) })
  return {
    schemaVersion: SAVE_SCHEMA_VERSION,
    account: { trainerName: 'Tester', createdAt: ECONOMY_V3_NOW, updatedAt: ECONOMY_V3_NOW, achievements: {}, history: {}, defeated: {} },
    tierWorlds: { [tier]: world },
  }
}
const tradesOf = (callings: Record<string, UmaCallingClass>) => ({ tradeOf: (id: string) => (callings[id] ? tradeOfCalling(callings[id]!) : null) })

describe('the Wilds\' places over the save', () => {
  it('starts jobs in slots 0–3 of a place and refuses slot 4', () => {
    let save = saveOf({ 101: 1, 102: 1, 103: 1, 104: 1, 105: 1 })
    for (const [slot, id] of ['101', '102', '103', '104'].entries()) save = startJob(save, 'mine', slot, { outfitId: id }, 'copper-ore', 1, at(0))
    expect(Object.values(worldOf(save).work).map((row) => row.slot?.slot)).toEqual([0, 1, 2, 3])
    expect(() => startJob(save, 'mine', 4, { outfitId: '105' }, 'copper-ore', 1, at(0))).toThrow("slot 4 doesn't exist")
    expect(() => startJob(save, 'quarry', 0, { outfitId: '105' }, 'limestone', 1, at(0))).toThrow()
  })

  it('has no levels to upgrade', () => {
    const save = saveOf({ 101: 1 }, {}, '1', { laurels: 10_000 })
    expect(upgradeCost(worldOf(save), 'mine')).toBeNull()
    expect(() => upgradeFacility(save, 'mine', at(0))).toThrow(NO_PLACE_LEVELS)
    expect(NO_PLACE_LEVELS).toBe('Places have no levels')
  })

  it('collects the items and the Craft EXP', () => {
    let save = startJob(saveOf({ 101: 1 }), 'mine', 0, { outfitId: '101' }, 'copper-ore', 2, at(0))
    expect(slotJobOf(worldOf(save), '101', at(GATHER_MS), 1)?.finished).toBe(1)
    expect([...readyWork(worldOf(save), at(2 * GATHER_MS), 1)]).toEqual([['mine', 1]])
    const { save: after, got } = collectJob(save, 'mine', 0, at(2 * GATHER_MS))
    expect(got).toEqual({ items: 2, exp: 2 * jobExp(stepMinutes(1)), levelsUp: 0, done: true })
    expect(worldOf(after).items).toEqual({ 'copper-ore': 2 })
    expect(worldOf(after).umas['101']!.craft).toEqual({ level: 1, exp: 96 })
    save = after
    expect(availableWorkers(worldOf(save), at(2 * GATHER_MS), 1).has('101')).toBe(true)
  })

  it('makes a made item from the Warehouse and pays it back into it: 10 Ingots, one step each', () => {
    let save = saveOf({ 101: 1 }, { 'copper-ingot': 11, 'pine-plank': 3 })
    save = startJob(save, 'weapon-forge', 0, { outfitId: '101' }, 'weapon-gem-g1', 1, at(0))
    expect(worldOf(save).items).toEqual({ 'copper-ingot': 1, 'pine-plank': 3 })
    const done = collectJob(save, 'weapon-forge', 0, at(10 * GATHER_MS)).save
    expect(worldOf(done).items).toEqual({ 'copper-ingot': 1, 'pine-plank': 3, 'weapon-gem-g1': 1 })
    expect(worldOf(done).gear).toBeUndefined()
  })

  it('takes 30 minutes off with a Speed Ticket', () => {
    let save = startJob(saveOf({ 101: 1 }, {}, '1', { timeTickets: 2 }), 'mine', 0, { outfitId: '101' }, 'copper-ore', 2, at(0))
    const before = slotJobOf(worldOf(save), '101', at(0))!.endsAt
    save = cutJobTime(save, 'mine', 0, 1, at(0))
    expect(slotJobOf(worldOf(save), '101', at(0))!.endsAt).toBe(before - 30 * MINUTE)
    expect(worldOf(save).wallet.timeTickets).toBe(1)
  })

  it('plans the same grades in every world, each opening at Craft Lv 5g − 4 (FL6, FL8)', () => {
    expect(() => startJob(saveOf({ 101: 1 }), 'mine', 0, { outfitId: '101' }, 'gold-ore', 1, at(0))).toThrow('Needs Craft Lv26')
    const tier2 = startJob(saveOf({ 201: 26 }, {}, '2'), 'mine', 0, { outfitId: '201' }, 'gold-ore', 1, at(0), '2')
    expect(worldOf(tier2, '2').work['201']?.entries[0]?.request.item).toBe('gold-ore')
    const plan = planJob(worldOf(saveOf({ 101: 46 }, {}, '2'), '2'), 'lapidary', { outfitId: '101' }, 'jewel-moon-5', 1, 2)!
    expect(plan.inputs).toEqual({ 'cut-philosophers-stone': 5 })
    expect(plan.output).toEqual({ id: 'jewel-moon-5', name: 'Moon Jewel V', grade: 10 })
    expect(plan.block).toBe("Needs 5 Cut Philosopher's Stone")
    expect(plan.item).toBeNull()
    expect(planJob(worldOf(saveOf({ 101: 1 })), 'mine', { outfitId: '101' }, 'iron-ore')).toMatchObject({
      output: { id: 'iron-ore', name: 'Iron Ore', grade: 3 }, itemMs: GATHER_MS, block: 'Needs Craft Lv11' })
  })

  it('gates a job by her trade when the caller says it, and never a settle or a queue start', () => {
    // 101 a Mage, 102 a Brawler: the Mine is the Brawler's.
    const context = tradesOf({ 101: 'mage', 102: 'brawler' })
    const save = saveOf({ 101: 1, 102: 1 }, { 'copper-ore': 4 })
    expect(() => startJob(save, 'mine', 0, { outfitId: '101' }, 'copper-ore', 1, at(0), '1', context)).toThrow('Another trade')
    expect(planJob(worldOf(save), 'mine', { outfitId: '101' }, 'copper-ore', 1, 1, context)?.block).toBe('Another trade')
    // The Fields Workbench is the healers' and the world has none: an open shop.
    let running = startJob({ ...save, tierWorlds: { '1': { ...worldOf(save), items: { ...worldOf(save).items, carrot: 2 } } } }, 'fields-workbench', 0, { outfitId: '101' },
      'chopped-carrot', 1, at(0), '1', context)
    running = startJob(running, 'mine', 0, { outfitId: '102' }, 'copper-ore', 1, at(0), '1', context)
    expect(() => queueJob(running, 'mine', 0, { outfitId: '102' }, 'iron-ore', 1, at(0), '1', context)).toThrow('Needs Craft Lv11')
    running = queueJob(running, 'mine', 0, { outfitId: '102' }, 'copper-ore', 1, at(0), '1', context)
    // Settled with no context, the queued job starts when the first ends.
    expect(slotJobOf(worldOf(running), '102', at(GATHER_MS + 1000))?.output).toBe('copper-ore')
    // Repeat keeps the gate: the Mage can't repeat at a place her trade lost.
    const done = collectJob(running, 'fields-workbench', 0, at(GATHER_MS)).save
    const withHealer = { ...done, tierWorlds: { '1': { ...worldOf(done), umas: { ...worldOf(done).umas, '103': gradedUma() } } } }
    const healer = tradesOf({ 101: 'mage', 102: 'brawler', 103: 'cleric' })
    expect(() => repeatJob(withHealer, '101', at(GATHER_MS), '1', healer)).toThrow('Another trade')
    expect(worldOf(repeatJob(withHealer, '101', at(GATHER_MS))).work['101']?.entries).toHaveLength(1)
    expect(checkRestartStopped(worldOf(withHealer), '101', T0 + GATHER_MS, 1, healer)).toBeNull()
  })
})
