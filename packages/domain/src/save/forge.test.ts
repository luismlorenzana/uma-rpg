import { describe, expect, it } from 'vitest'
import { regionChapter, worldContinent } from '../world/world'
import { applyPoints } from '../economy/bonus'
import { equippedOrb, equippedPoints, gearById, gearPoints, recipeFamilies, EQUIP_TYPES } from '../economy/gear'
import { makeMinutes, MINUTE } from '../economy/pacing'
import { rpgFoe } from '../rpg/campaign/enemies'
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
  it('makes every piece from four refined items, one of each of four families, and no token (D86, D94)', () => {
    const arms = { 'copper-ingot': 1, 'limestone-block': 1, 'pine-plank': 1, 'puffbun-leather': 1 }
    expect(gearById('greatsword-g1-atk')).toMatchObject({ name: 'Fierce Copper Greatsword', inputs: arms })
    expect(gearById('bow-g1-speed')!.inputs).toEqual(arms)
    expect(gearById('tome-fire-g1-matk')!.inputs).toEqual({ 'cut-quartz': 1, linen: 1, 'mist-infusion': 1, 'shell-carving': 1 })
    expect(gearById('orb-fire-g1-hp')!.inputs).toEqual(gearById('tome-fire-g1-hp')!.inputs)
    expect(gearById('orb-katana-g1-hp')!.inputs).toEqual(gearById('katana-g1-hp')!.inputs)
    for (const type of EQUIP_TYPES) expect(new Set(recipeFamilies(type)).size).toBe(4)
    expect(gearById('katana-g3-def')?.type).toBe('katana')
    expect(gearById('short-sword-g3-def')).toBeUndefined()
    expect(gearById('greatsword-g11-atk')).toBeUndefined()
    expect(gearById('boots-g1-atk')).toBeUndefined()
  })

  it('gives weapons offense split across her five weapons, armor defense, Rings their accent twice and Orbs once', () => {
    expect(gearPoints(gearById('greatsword-g5-hp')!, 5)).toMatchObject({ atk: 1, hp: 3 })
    expect(gearPoints(gearById('tome-ice-g5-mp')!, 5)).toMatchObject({ matk: 1, mp: 3 })
    expect(gearPoints(gearById('plate-g4-def')!)).toMatchObject({ def: 7, mdef: 2, hp: 2 })
    expect(gearPoints(gearById('garb-g4-speed')!)).toMatchObject({ def: 2, mdef: 2, speed: 4 })
    expect(gearPoints(gearById('ring-g4-limit')!)).toMatchObject({ limit: 4, atk: 0 })
    expect(gearPoints(gearById('orb-fire-g4-limit')!)).toMatchObject({ limit: 2, atk: 0 })
    // A Mage's Tomes don't count while she fights as a Brawler.
    expect(equippedPoints({ 'tome-fire': 'tome-fire-g4-mp' }, ['greatsword', 'axe', 'lance', 'bow', 'katana']).matk).toBe(0)
    expect(equippedOrb({ accessory: 'orb-lance-g1-hp' })).toBe('lance')
    expect(equippedOrb({ accessory: 'ring-g1-hp' })).toBeUndefined()
  })
})

describe('the Forge and equipping (S7)', () => {
  it('crafts with Gathering & Crafting into the gear stock', () => {
    let save = edit(umas('101'), (w) => ({ ...w, items: { 'copper-ingot': 2, 'limestone-block': 2, 'pine-plank': 2, 'puffbun-leather': 2 } }))
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

  it('brings what she wears into her fights, for the class she fights as, Orb included', () => {
    let save = edit(umas('101', '102', '103', '104', '105'), (w) => ({ ...w, gear: { 'greatsword-g1-atk': 1, 'lance-g1-atk': 1, 'garb-g1-speed': 1, 'orb-fire-g1-hp': 1 } }))
    for (const g of ['greatsword-g1-atk', 'lance-g1-atk', 'garb-g1-speed', 'orb-fire-g1-hp']) save = equipGear(save, '101', g, at(0))
    const uma = worldOf(save).umas['101']!
    expect(umaPoints(uma, 'brawler')).toMatchObject({ atk: 2.4, speed: 1.5, def: 0.5, hp: 1 })
    ;['101', '102', '103', '104', '105'].forEach((id, i) => { save = setPartySlot(save, 0, i, id, at(0)) })
    const ura = regionChapter(worldContinent({ name: 'URA', order: 1 }).regions[0]!, [{ id: 'c', name: 'C' }])
    const outfits = new Map(['101', '102', '103', '104', '105'].map((id) => [id, { ...smith, outfitId: id }]))
    const ally = worldOf(startFight(save, ura, 'w1-1-1-s1', outfits, at(0))).world.run.battle!.input.allies[0]!
    const bare = projectRpgStats(umaProfile(smith, uma, 1, 'brawler'))
    expect(ally.stats.atk).toBe(applyPoints(bare, umaPoints(uma, 'brawler')).stats.atk)
    expect(ally.orb).toBe('fire')
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
