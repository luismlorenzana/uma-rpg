import { describe, expect, it } from 'vitest'
import { familyById } from '../items/catalog'
import { unlockUma, worldOf } from './rules'
import { newSave, parseSave, type Save } from './save'
import { facilityTargets, setTarget, targetPlan } from './targets'
import { startJob } from './work'

const T0 = Date.parse('2026-10-12T12:00:00.000Z')
const at = (ms: number) => new Date(T0 + ms).toISOString()
const umas = (...ids: string[]): Save => ids.reduce((s, id) => unlockUma(s, id, at(0)), newSave('Luis', at(0)))
const brawler = () => 'brawler' as const
// Invented outfit only.
const farmer = { outfitId: '102', aptitudes: { surface: { turf: 'A', dirt: 'G' } } } as const

describe('farming targets (D100)', () => {
  it('marks up to five owned Umas, and keeps them in the save', () => {
    let save = umas('101', '102', '103', '104', '105', '106')
    for (const id of ['101', '102', '103', '104', '105']) save = setTarget(save, id, true, at(1))
    expect(() => setTarget(save, '106', true, at(2))).toThrow(/5 targets at most/)
    expect(() => setTarget(save, '999', true, at(2))).toThrow(/owned/)
    save = setTarget(setTarget(save, '103', false, at(3)), '106', true, at(3))
    expect(worldOf(save).targets).toEqual(['101', '102', '104', '105', '106'])
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
    // A v16 save has none.
    const old = JSON.parse(JSON.stringify(save))
    old.schemaVersion = 16
    delete old.tierWorlds['1'].targets
    expect(worldOf(parseSave(old)).targets).toEqual([])
  })

  it('plans a dish for every closed node and the best piece she can wear in each slot, cascading to refined and raw', () => {
    let save = setTarget(umas('101', '102'), '101', true, at(1))
    let plan = targetPlan(worldOf(save), brawler)
    // A new Brawler: her five Arms, a Mail and a Ring, all grade 1; and all 100 nodes' dishes.
    expect(plan.gear.map((g) => g.key)).toEqual(['axe-g1', 'bow-g1', 'greatsword-g1', 'katana-g1', 'lance-g1', 'mail-g1', 'ring-g1'])
    expect(plan.dishes).toHaveLength(100)
    expect(plan.dishes.every((d) => d.need === 1 && d.short === 1)).toBe(true)
    // Every refined line is fed by the gear and dishes short; every raw line by the refined short, one for one.
    const flourId = familyById('grains')!.refined[0]!.id, wheatId = familyById('grains')!.raw[0]!.id
    const flour = plan.refined.find((r) => r.key === flourId)!
    expect(flour.short).toBeGreaterThan(0)
    expect(plan.raw.find((r) => r.key === wheatId)!.need).toBe(flour.short)
    // Wheat on the way counts first, and flour in the Warehouse means no wheat at all.
    save = startJob(save, 'fields', 0, farmer, wheatId, flour.short, at(2))
    plan = targetPlan(worldOf(save), brawler)
    expect(plan.raw.find((r) => r.key === wheatId)).toMatchObject({ need: flour.short, coming: flour.short, short: 0 })
    expect(facilityTargets(plan, 'fields').some((n) => n.key === wheatId)).toBe(false)
    const w = worldOf(save)
    plan = targetPlan({ ...w, items: { ...w.items, [flourId]: flour.short } }, brawler)
    expect(plan.refined.find((r) => r.key === flourId)).toMatchObject({ have: flour.short, short: 0 })
    expect(plan.raw.some((r) => r.key === wheatId)).toBe(false)
    // Each facility shows its own lines: Fields its grains, the Pantry farming refined items, the Kitchen dishes.
    expect(facilityTargets(plan, 'fields').every((n) => n.key.length > 0 && familyById('grains')!.raw.some((i) => i.id === n.key))).toBe(true)
    expect(facilityTargets(plan, 'pantry').length).toBeGreaterThan(0)
    expect(facilityTargets(plan, 'kitchen')).toHaveLength(100)
    expect(facilityTargets(plan, 'forge')).toHaveLength(7)
  })

  it('counts a piece she owns at that grade as done, and none for an Uma who isn\'t a target', () => {
    let save = setTarget(umas('101'), '101', true, at(1))
    const w = worldOf(save)
    const uma = w.umas['101']!
    save = { ...save, tierWorlds: { '1': { ...w, umas: { '101': { ...uma, gear: { locker: ['axe-g1-hp', 'plate-g1-def'], equipped: { axe: 'axe-g1-hp' } } } } } } }
    expect(targetPlan(worldOf(save), brawler).gear.map((g) => g.key)).toEqual(['bow-g1', 'greatsword-g1', 'katana-g1', 'lance-g1', 'ring-g1'])
    expect(targetPlan(worldOf(setTarget(save, '101', false, at(2))), brawler)).toEqual({ gear: [], dishes: [], refined: [], raw: [] })
  })
})
