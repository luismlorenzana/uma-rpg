import { describe, expect, it } from 'vitest'
import { applyPoints } from '../economy/bonus'
import { equippedPoints, gearById, gearPoints } from '../economy/gear'
import { makeMinutes, MINUTE } from '../economy/pacing'
import { rpgFoe } from '../rpg/campaign/enemies'
import { rpgCampaignChapter } from '../rpg/campaign/chapters'
import { projectRpgStats } from '../rpg/rules'
import { startFight, umaPoints, umaProfile } from './battle'
import { equipBlock, equipGear, unequipGear } from './forge'
import { setPartySlot, unlockUma, worldOf } from './rules'
import { newSave, parseSave, SaveParseError, type Save } from './save'
import { collectJob, planJob, startJob } from './work'

const T0 = Date.parse('2026-10-10T12:00:00.000Z')
const at = (ms: number) => new Date(T0 + ms).toISOString()
const smith = {
  outfitId: '101', baseStats: { speed: 100, stamina: 100, power: 100, guts: 100, wit: 100 }, growthRatePercents: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0 },
  aptitudes: { surface: { turf: 'G', dirt: 'A' }, strategy: { front: 'A', pace: 'G', late: 'G', end: 'G' }, distance: { sprint: 'G', mile: 'G', medium: 'G', long: 'G' } },
} as const
const umas = (...ids: string[]): Save => ids.reduce((s, id) => unlockUma(s, id, at(0)), newSave('Luis', at(0)))
const edit = (save: Save, fn: (w: ReturnType<typeof worldOf>) => ReturnType<typeof worldOf>): Save => ({ ...save, tierWorlds: { '1': fn(worldOf(save)) } })

describe('gear (S7, D59)', () => {
  it('generates any type × grade × accent from its main material, accent material and extras', () => {
    expect(gearById('greatsword-g1-atk')).toMatchObject({ name: 'Fierce Copper Greatsword', inputs: { 'copper-ingot': 2, 'token-craft-atk-1': 1 } })
    expect(gearById('bow-g1-speed')!.inputs).toEqual({ 'pine-plank': 2, 'token-craft-speed-1': 1 })
    expect(Object.values(gearById('plate-g5-hp')!.inputs).reduce((a, b) => a + b, 0)).toBe(4)
    expect(Object.values(gearById('ring-g9-mp')!.inputs).reduce((a, b) => a + b, 0)).toBe(5)
    expect(gearById('short-sword-g3-def')?.type).toBe('short-sword')
    expect(gearById('greatsword-g11-atk')).toBeUndefined()
    expect(gearById('boots-g1-atk')).toBeUndefined()
  })

  it('gives weapons offense split across her build’s weapons, armor defense, accessories their accent twice', () => {
    expect(gearPoints(gearById('greatsword-g4-hp')!, 2)).toMatchObject({ atk: 2, hp: 2 })
    expect(gearPoints(gearById('mage-staff-g4-mp')!, 1)).toMatchObject({ matk: 4, mp: 2 })
    expect(gearPoints(gearById('plate-g4-def')!)).toMatchObject({ def: 7, mdef: 2, hp: 2 })
    expect(gearPoints(gearById('garb-g4-speed')!)).toMatchObject({ def: 2, mdef: 2, speed: 4 })
    expect(gearPoints(gearById('ring-g4-limit')!)).toMatchObject({ limit: 4, atk: 0 })
    // A Mage's staves don't count while she fights as a Brawler.
    expect(equippedPoints({ 'mage-staff': 'mage-staff-g4-mp' }, ['greatsword', 'spear']).matk).toBe(0)
  })
})

describe('the Forge and equipping (S7)', () => {
  it('crafts with Gathering & Crafting into the gear stock', () => {
    let save = edit(umas('101'), (w) => ({ ...w, items: { 'copper-ingot': 4, 'token-craft-atk-1': 2 } }))
    const plan = planJob(worldOf(save), 'forge', smith, 'greatsword-g1-atk', 2)!
    expect(plan).toMatchObject({ block: null, profession: 'gathering', msEach: makeMinutes(1) * MINUTE / 2 })
    expect(planJob(worldOf(save), 'forge', smith, 'greatsword-g2-atk', 1)!.block).toBe('Needs Craft Lv6')
    save = startJob(save, 'forge', 0, smith, 'greatsword-g1-atk', 2, at(0))
    save = collectJob(save, 'forge', 0, at(2 * plan.msEach)).save
    expect(worldOf(save).gear).toEqual({ 'greatsword-g1-atk': 2 })
    expect(worldOf(save).items).toEqual({})
  })

  it('binds a piece to whoever equips it; she swaps among her own; nobody else can take it', () => {
    let save = edit(umas('101', '102'), (w) => ({ ...w, gear: { 'greatsword-g1-atk': 1, 'plate-g2-def': 1 } }))
    save = equipGear(save, '101', 'greatsword-g1-atk', at(0))
    expect(worldOf(save).gear).toEqual({ 'plate-g2-def': 1 })
    expect(worldOf(save).umas['101']!.gear).toEqual({ locker: ['greatsword-g1-atk'], equipped: { greatsword: 'greatsword-g1-atk' } })
    expect(() => equipGear(save, '102', 'greatsword-g1-atk', at(0))).toThrow(/none in stock/)
    expect(equipBlock(worldOf(save).umas['101']!, 'plate-g2-def')).toMatch(/Armor Level 2/)
    save = unequipGear(save, '101', 'greatsword', at(0))
    expect(worldOf(save).umas['101']!.gear.locker).toEqual(['greatsword-g1-atk'])
    save = equipGear(save, '101', 'greatsword-g1-atk', at(0))
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
    const stolen = JSON.parse(JSON.stringify(save))
    stolen.tierWorlds['1'].umas['102'].gear.equipped.greatsword = 'greatsword-g1-atk'
    expect(() => parseSave(stolen)).toThrow(SaveParseError)
  })

  it('brings what she wears into her fights, for the build she fights as', () => {
    let save = edit(umas('101', '102', '103', '104', '105'), (w) => ({ ...w, gear: { 'greatsword-g1-atk': 1, 'spear-g1-atk': 1, 'garb-g1-speed': 1 } }))
    for (const g of ['greatsword-g1-atk', 'spear-g1-atk', 'garb-g1-speed']) save = equipGear(save, '101', g, at(0))
    const uma = worldOf(save).umas['101']!
    expect(umaPoints(uma, 'greatsword-spear')).toMatchObject({ atk: 3, speed: 1.5, def: 0.5 })
    ;['101', '102', '103', '104', '105'].forEach((id, i) => { save = setPartySlot(save, 0, i, id, at(0)) })
    const ura = rpgCampaignChapter({ scenarioId: 1, name: 'URA', order: 1 }, [{ id: 'c', name: 'C' }])
    const outfits = new Map(['101', '102', '103', '104', '105'].map((id) => [id, { ...smith, outfitId: id }]))
    const ally = worldOf(startFight(save, ura, 0, 'a1r1c1', outfits, at(0))).runs['0:1']!.battle!.input.allies[0]!
    const bare = projectRpgStats(umaProfile(smith, uma, 1, 'greatsword-spear'))
    expect(ally.stats.atk).toBe(applyPoints(bare, umaPoints(uma, 'greatsword-spear')).stats.atk)
    expect(ally.stats.atk).toBeGreaterThan(bare.atk)
    expect(ally.evasion).toBe(9)
  })
})

describe('the foe budget (§7.3)', () => {
  it('gives foes past the first chapter the gear and Extra Stats a party is expected to have', () => {
    const at10 = rpgFoe({ id: 'f', castId: 'c', element: 'fire', role: 'striker', rank: 'regular', level: 10, shield: 2, weaknesses: { weapons: [], elements: [] } })
    const at30 = rpgFoe({ id: 'f', castId: 'c', element: 'fire', role: 'striker', rank: 'regular', level: 30, shield: 2, weaknesses: { weapons: [], elements: [] } })
    const plain30 = (stat: number, ref: number) => Math.round(stat / 1.07) === Math.round(ref) || Math.abs(stat / 1.07 - ref) < 1
    expect(at10.stats.atk).toBe(Math.round((22 + 1.59 * 9) * 3))
    expect(plain30(at30.stats.atk, (22 + 1.59 * 29) * 3)).toBe(true)
  })
})
