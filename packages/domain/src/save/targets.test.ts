import { describe, expect, it } from 'vitest'
import { planRequirements } from '@luismlorenzana/uma-work'
import { gearById } from '../economy/gear'
import { familyById } from '../items/catalog'
import { unlockUma, worldOf } from './rules'
import { newSave, parseSave, type Save, type TierWorld } from './save'
import { equipGear } from './forge'
import { setGem } from './observatory'
import { facilityTargets, jobSupply, setTarget, targetPlan } from './targets'
import { queueJob, startJob } from './work'

const T0 = Date.parse('2026-10-14T12:00:00.000Z')
const at = (ms: number) => new Date(T0 + ms).toISOString()
const umas = (...ids: string[]): Save => ids.reduce((s, id) => unlockUma(s, id, at(0)), newSave('Luis', at(0)))
const brawler = () => 'brawler' as const
const withWorld = (save: Save, fn: (w: TierWorld) => TierWorld): Save => ({ ...save, tierWorlds: { '1': fn(worldOf(save)) } })
// Invented outfits only.
const worker = { outfitId: '102' } as const
const hides = () => familyById('hides-scales')!
const ARMS = ['greatsword', 'axe', 'lance'], ARMOR = ['helm', 'cuirass', 'greaves', 'gauntlets', 'boots']

describe('the requirements engine (D126)', () => {
  it('nets each item once, parents first, and passes down only what is still short', () => {
    const recipe = (id: string) => ({ sword: { ingot: 2 }, shield: { ingot: 1 }, ingot: { ore: 1 } } as Record<string, Record<string, number>>)[id] ?? null
    const supply = (id: string) => ({ onHand: { sword: 1, ingot: 2 }[id] ?? 0, coming: { ore: 1 }[id] ?? 0 })
    const plan = planRequirements({ demand: new Map([['sword', 3], ['shield', 1]]), recipe, supply })
    expect(plan.get('sword')).toEqual({ id: 'sword', gross: 3, onHand: 1, coming: 0, net: 2 })
    // The ingot is netted after both its parents: 2 × 2 + 1 = 5 needed, 2 held, 3 to make.
    expect(plan.get('ingot')).toEqual({ id: 'ingot', gross: 5, onHand: 2, coming: 0, net: 3 })
    expect(plan.get('ore')).toEqual({ id: 'ore', gross: 3, onHand: 0, coming: 1, net: 2 })
  })
})

describe('targets (D100, D126, D144)', () => {
  it('marks ten owned Umas, persists them, and refuses an eleventh without changing the save', () => {
    const ids = Array.from({ length: 11 }, (_, i) => String(101 + i))
    let save = umas(...ids)
    for (const id of ids.slice(0, 10)) save = setTarget(save, id, true, at(1))
    expect(worldOf(save).targets).toEqual(ids.slice(0, 10))
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
    const before = JSON.stringify(save)
    expect(() => setTarget(save, '111', true, at(2))).toThrow(/10 targets at most/)
    expect(JSON.stringify(save)).toBe(before)
    expect(() => setTarget(save, '999', true, at(2))).toThrow(/owned/)
    // Marking an existing target again still fits; removing one frees a place for another.
    save = setTarget(save, '110', true, at(3))
    save = setTarget(setTarget(save, '103', false, at(3)), '111', true, at(3))
    expect(worldOf(save).targets).toEqual([...ids.slice(0, 10).filter(id => id !== '103'), '111'])
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
    const invalid = { ...save, tierWorlds: { '1': { ...worldOf(save), targets: ids } } }
    expect(() => parseSave(invalid)).toThrow(/targets/)
  })

  it('keeps existing five-target saves and plans gear, gems and materials for all ten', () => {
    const ids = Array.from({ length: 10 }, (_, i) => String(101 + i))
    let save = umas(...ids)
    const single = targetPlan(worldOf(setTarget(save, ids[0]!, true, at(1))), brawler)
    for (const id of ids.slice(0, 5)) save = setTarget(save, id, true, at(1))
    save = parseSave(JSON.parse(JSON.stringify(save)))
    expect(worldOf(save).targets).toEqual(ids.slice(0, 5))
    for (const id of ids.slice(5)) save = setTarget(save, id, true, at(2))
    const plan = targetPlan(worldOf(save), brawler)
    for (const family of ['gear', 'gems', 'refined', 'raw'] as const) {
      expect(plan[family]).toHaveLength(single[family].length)
      for (const line of single[family]) expect(plan[family].find(n => n.key === line.key)).toMatchObject({ need: line.need * 10, short: line.short * 10 })
    }
    expect(facilityTargets(plan, 'forest').length).toBeGreaterThan(0)
    expect(facilityTargets(plan, 'forge').every(line => line.need === 10)).toBe(true)
  })

  it('plans every track she climbs all the way to grade 10, and every Star Gem her Extra Stats still need', () => {
    const save = setTarget(umas('101', '102'), '101', true, at(1))
    const plan = targetPlan(worldOf(save), brawler)
    // A new Brawler: her three Arms (engine v16) and five physical armor kinds, grades 1–10 each; no accessory, so none planned.
    const expected = [...ARMS, ...ARMOR].flatMap((t) => Array.from({ length: 10 }, (_, i) => `${t}-g${i + 1}`)).sort()
    expect(plan.gear.map((g) => g.key).sort()).toEqual(expected)
    expect(plan.gear.every((g) => g.need === 1 && g.have === 0 && g.short === 1)).toBe(true)
    expect(plan.gems).toHaveLength(100)
    expect(facilityTargets(plan, 'forge')).toHaveLength(80)
    expect(facilityTargets(plan, 'lapidary')).toHaveLength(100)
  })

  it('plans the type in each accessory slot, and nothing for an empty one', () => {
    let save = withWorld(setTarget(umas('101'), '101', true, at(1)), (w) => ({ ...w, gear: { 'talisman-vital-g1': 1 } }))
    save = equipGear(save, '101', 'talisman-vital-g1', at(2))
    const gear = targetPlan(worldOf(save), brawler).gear.map((g) => g.key)
    // Grade 1 is bound, so 2–10; nothing for the empty second slot.
    expect(gear.filter((k) => k.startsWith('talisman-'))).toEqual(Array.from({ length: 9 }, (_, i) => `talisman-vital-g${i + 2}`))
    expect(gear.some((k) => k.startsWith('orb-') || k.startsWith('amulet-'))).toBe(false)
  })

  it('keeps a line until the Warehouse holds it, and cascades: only what is still short reaches the materials', () => {
    let save = setTarget(umas('101', '102'), '101', true, at(1))
    const leatherId = hides().refined[0]!.id, peltId = hides().raw[0]!.id
    const leather = () => targetPlan(worldOf(save), brawler).refined.find((r) => r.key === leatherId)!
    const pelt = () => targetPlan(worldOf(save), brawler).raw.find((r) => r.key === peltId)
    const need = leather().short
    expect(need).toBeGreaterThan(0)
    expect(pelt()!.need).toBe(need)
    // Pelts being gathered are coming: nothing left to start, but the line stays until they're in the Warehouse.
    save = startJob(save, 'monster-den', 0, worker, peltId, need, at(2))
    expect(pelt()).toMatchObject({ need, have: 0, coming: need, short: 0 })
    expect(facilityTargets(targetPlan(worldOf(save), brawler), 'monster-den').some((n) => n.key === peltId)).toBe(true)
    // Leather in the Warehouse: its line goes, and with it every pelt line it fed.
    save = withWorld(save, (w) => ({ ...w, items: { ...w.items, [leatherId]: need } }))
    expect(leather()).toMatchObject({ have: need, short: 0 })
    expect(facilityTargets(targetPlan(worldOf(save), brawler), 'workbench').some((n) => n.key === leatherId)).toBe(false)
    expect(pelt()).toBeUndefined()
  })

  it('cascades from gear too: a piece in stock needs no refined items, and refined items in stock no raw', () => {
    let save = setTarget(umas('101'), '101', true, at(1))
    const piece = gearById('greatsword-g1')!
    const [ingot] = Object.keys(piece.inputs)
    const ingotNeed = () => targetPlan(worldOf(save), brawler).refined.find((r) => r.key === ingot)?.need ?? 0
    const before = ingotNeed()
    save = withWorld(save, (w) => ({ ...w, gear: { 'greatsword-g1': 1 } }))
    expect(ingotNeed()).toBe(before - 1)
    expect(facilityTargets(targetPlan(worldOf(save), brawler), 'forge').some((n) => n.key === 'greatsword-g1')).toBe(false)
  })

  it('keeps inputs held by queued jobs out of stock, and counts a queued job only if it can start', () => {
    // Each target needs n grade-1 leathers (a gem and her gear). One is being made; one is queued, holding the only pelt in
    // the Warehouse.
    const n = targetPlan(worldOf(setTarget(umas('101'), '101', true, at(1))), brawler).refined.find((r) => r.key === hides().refined[0]!.id)!.need
    let save = umas('101', '102', '103')
    for (const id of ['101', '102', '103']) save = setTarget(save, id, true, at(1))
    const leatherId = hides().refined[0]!.id, peltId = hides().raw[0]!.id
    save = withWorld(save, (w) => ({ ...w, items: { [peltId]: 2 } }))
    save = startJob(save, 'workbench', 0, { outfitId: '101' }, leatherId, 1, at(2))
    save = queueJob(save, 'workbench', 0, { outfitId: '101' }, leatherId, 1, at(2))
    const { coming, held } = jobSupply(worldOf(save))
    expect(held.get(peltId)).toBe(1)
    expect(coming.get(leatherId)).toBe(2)
    const plan = targetPlan(worldOf(save), brawler)
    expect(plan.refined.find((r) => r.key === leatherId)).toMatchObject({ need: 3 * n, coming: 2, short: 3 * n - 2 })
    // The held pelt isn't free: every leather still short needs a pelt gathered.
    expect(plan.raw.find((r) => r.key === peltId)).toMatchObject({ need: 3 * n - 2, have: 0, short: 3 * n - 2 })
    // A queued job whose inputs aren't in the Warehouse brings nothing, so one more leather is short.
    const empty = withWorld(save, (w) => ({ ...w, items: {} }))
    expect(jobSupply(worldOf(empty)).coming.get(leatherId)).toBe(1)
    expect(targetPlan(worldOf(empty), brawler).refined.find((r) => r.key === leatherId)).toMatchObject({ coming: 1, short: 3 * n - 1 })
  })

  it('drops what she has set or bound, adds up several targets, and plans nothing for an Uma who isn\'t one', () => {
    let save = setTarget(setTarget(umas('101', '102'), '101', true, at(1)), '102', true, at(1))
    save = withWorld(save, (w) => ({ ...w, gear: { 'axe-g1': 1 }, gems: { 'gem-hp-1': 1 } }))
    const plan = () => targetPlan(worldOf(save), brawler)
    expect(plan().gear.find((g) => g.key === 'axe-g1')).toMatchObject({ need: 2, have: 1, short: 1 })
    save = equipGear(save, '101', 'axe-g1', at(2))
    save = setGem(save, '101', 'gem-hp-1', at(2)).save
    expect(plan().gear.find((g) => g.key === 'axe-g1')).toMatchObject({ need: 1, have: 0 })
    expect(plan().gems.find((d) => d.key === 'gem-hp-1')).toMatchObject({ need: 1, have: 0 })
    save = setTarget(setTarget(save, '101', false, at(3)), '102', false, at(3))
    expect(targetPlan(worldOf(save), brawler)).toEqual({ gear: [], gems: [], made: [], refined: [], raw: [] })
  })
})
