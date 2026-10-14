import { describe, expect, it } from 'vitest'
import { gearById } from '../economy/gear'
import { planRequirements } from '../economy/requirements'
import { familyById } from '../items/catalog'
import { unlockUma, worldOf } from './rules'
import { newSave, parseSave, type Save, type TierWorld } from './save'
import { equipGear } from './forge'
import { eatDish } from './kitchen'
import { facilityTargets, jobSupply, setTarget, targetPlan } from './targets'
import { startJob } from './work'

const T0 = Date.parse('2026-10-14T12:00:00.000Z')
const at = (ms: number) => new Date(T0 + ms).toISOString()
const umas = (...ids: string[]): Save => ids.reduce((s, id) => unlockUma(s, id, at(0)), newSave('Luis', at(0)))
const brawler = () => 'brawler' as const
const withWorld = (save: Save, fn: (w: TierWorld) => TierWorld): Save => ({ ...save, tierWorlds: { '1': fn(worldOf(save)) } })
// Invented outfits only.
const farmer = { outfitId: '102', aptitudes: { surface: { turf: 'A', dirt: 'A' } } } as const
const grains = () => familyById('grains')!
const ARMS = ['greatsword', 'axe', 'lance', 'bow', 'katana'], ARMOR = ['helm', 'cuirass', 'greaves', 'gauntlets', 'boots']

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

describe('farming targets (D100, D126)', () => {
  it('marks up to five owned Umas, and keeps them in the save', () => {
    let save = umas('101', '102', '103', '104', '105', '106')
    for (const id of ['101', '102', '103', '104', '105']) save = setTarget(save, id, true, at(1))
    expect(() => setTarget(save, '106', true, at(2))).toThrow(/5 targets at most/)
    expect(() => setTarget(save, '999', true, at(2))).toThrow(/owned/)
    save = setTarget(setTarget(save, '103', false, at(3)), '106', true, at(3))
    expect(worldOf(save).targets).toEqual(['101', '102', '104', '105', '106'])
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
  })

  it('plans every track she climbs all the way to grade 10, and every dish her Extra Stats still need', () => {
    const save = setTarget(umas('101', '102'), '101', true, at(1))
    const plan = targetPlan(worldOf(save), brawler)
    // A new Brawler: her five Arms and five physical armor kinds, grades 1–10 each; no accessory, so none planned.
    const expected = [...ARMS, ...ARMOR].flatMap((t) => Array.from({ length: 10 }, (_, i) => `${t}-g${i + 1}`)).sort()
    expect(plan.gear.map((g) => g.key).sort()).toEqual(expected)
    expect(plan.gear.every((g) => g.need === 1 && g.have === 0 && g.short === 1)).toBe(true)
    expect(plan.dishes).toHaveLength(100)
    expect(facilityTargets(plan, 'forge')).toHaveLength(100)
    expect(facilityTargets(plan, 'kitchen')).toHaveLength(100)
  })

  it('plans the type in each accessory slot, and nothing for an empty one', () => {
    let save = withWorld(setTarget(umas('101'), '101', true, at(1)), (w) => ({ ...w, gear: { 'talisman-vital-g1': 1 } }))
    save = equipGear(save, '101', 'talisman-vital-g1', at(2))
    const gear = targetPlan(worldOf(save), brawler).gear.map((g) => g.key)
    // Grade 1 is bound, so 2–10; nothing for the empty second slot.
    expect(gear.filter((k) => k.startsWith('talisman-'))).toEqual(Array.from({ length: 9 }, (_, i) => `talisman-vital-g${i + 2}`))
    expect(gear.some((k) => k.startsWith('orb-') || k.startsWith('amulet-'))).toBe(false)
  })

  it('keeps a line until the Warehouse holds it, and cascades: only what is still short reaches the ingredients', () => {
    let save = setTarget(umas('101', '102'), '101', true, at(1))
    const flourId = grains().refined[0]!.id, wheatId = grains().raw[0]!.id
    const flour = () => targetPlan(worldOf(save), brawler).refined.find((r) => r.key === flourId)!
    const wheat = () => targetPlan(worldOf(save), brawler).raw.find((r) => r.key === wheatId)
    const need = flour().short
    expect(need).toBeGreaterThan(0)
    expect(wheat()!.need).toBe(need)
    // Wheat being gathered is coming: nothing left to start, but the line stays until it's in the Warehouse.
    save = startJob(save, 'fields', 0, farmer, wheatId, need, at(2))
    expect(wheat()).toMatchObject({ need, have: 0, coming: need, short: 0 })
    expect(facilityTargets(targetPlan(worldOf(save), brawler), 'fields').some((n) => n.key === wheatId)).toBe(true)
    // Flour in the Warehouse: its line goes, and with it every wheat line it fed.
    save = withWorld(save, (w) => ({ ...w, items: { ...w.items, [flourId]: need } }))
    expect(flour()).toMatchObject({ have: need, short: 0 })
    expect(facilityTargets(targetPlan(worldOf(save), brawler), 'pantry').some((n) => n.key === flourId)).toBe(false)
    expect(wheat()).toBeUndefined()
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
    // Three targets need three grade-1 flours. One is being made; one is queued, holding the only wheat in the Warehouse.
    let save = umas('101', '102', '103')
    for (const id of ['101', '102', '103']) save = setTarget(save, id, true, at(1))
    const flourId = grains().refined[0]!.id, wheatId = grains().raw[0]!.id
    const job = { kind: 'refine' as const, outfitId: '101', output: flourId, count: 1, collected: 0, startedAt: at(2), msEach: 1000, expEach: 1,
      inputs: { [wheatId]: 1 }, queue: [{ output: flourId, count: 1, msEach: 1000, expEach: 1, inputs: { [wheatId]: 1 } }] }
    save = withWorld(save, (w) => ({ ...w, items: { [wheatId]: 1 }, facilities: { pantry: { level: 1, jobs: [job, null] } } }))
    const { coming, held } = jobSupply(worldOf(save))
    expect(held.get(wheatId)).toBe(1)
    expect(coming.get(flourId)).toBe(2)
    const plan = targetPlan(worldOf(save), brawler)
    expect(plan.refined.find((r) => r.key === flourId)).toMatchObject({ need: 3, coming: 2, short: 1 })
    // The held wheat isn't free: the third flour still needs wheat gathered.
    expect(plan.raw.find((r) => r.key === wheatId)).toMatchObject({ need: 1, have: 0, short: 1 })
    // A queued job whose inputs aren't in the Warehouse brings nothing, so two flours are short.
    const empty = withWorld(save, (w) => ({ ...w, items: {} }))
    expect(jobSupply(worldOf(empty)).coming.get(flourId)).toBe(1)
    expect(targetPlan(worldOf(empty), brawler).refined.find((r) => r.key === flourId)).toMatchObject({ coming: 1, short: 2 })
  })

  it('drops what she has eaten or bound, adds up several targets, and plans nothing for an Uma who isn\'t one', () => {
    let save = setTarget(setTarget(umas('101', '102'), '101', true, at(1)), '102', true, at(1))
    save = withWorld(save, (w) => ({ ...w, gear: { 'axe-g1': 1 }, dishes: { 'dish-grains-1': 1 } }))
    const plan = () => targetPlan(worldOf(save), brawler)
    expect(plan().gear.find((g) => g.key === 'axe-g1')).toMatchObject({ need: 2, have: 1, short: 1 })
    save = equipGear(save, '101', 'axe-g1', at(2))
    save = eatDish(save, '101', 'dish-grains-1', at(2)).save
    expect(plan().gear.find((g) => g.key === 'axe-g1')).toMatchObject({ need: 1, have: 0 })
    expect(plan().dishes.find((d) => d.key === 'dish-grains-1')).toMatchObject({ need: 1, have: 0 })
    save = setTarget(setTarget(save, '101', false, at(3)), '102', false, at(3))
    expect(targetPlan(worldOf(save), brawler)).toEqual({ gear: [], dishes: [], refined: [], raw: [] })
  })
})
