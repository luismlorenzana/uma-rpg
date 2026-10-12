import { describe, expect, it } from 'vitest'
import { regionChapter, worldContinent } from '../world/world'
import { applyPoints } from '../economy/bonus'
import { equippedGuard, equippedMight, equippedOrb, equippedPoints, gearById, gearPoints, recipeFamilies, EQUIP_TYPES } from '../economy/gear'
import { makeMinutes, MINUTE } from '../economy/pacing'
import { rpgFoe } from '../rpg/campaign/enemies'
import { projectRpgStats } from '../rpg/rules'
import { classOf, holdWeapon, startFight, umaPointParts, umaPoints, umaProfile } from './battle'
import { rpgProfileTrees } from '../rpg/rules'
import { equipBlock, equipGear, unequipGear, wearArmor } from './forge'
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

describe('gear (S7, D103)', () => {
  it('names thirty types in ten grades: weapons and Orbs by grade, armor with an accent; recipes by half', () => {
    const arms = { 'copper-ingot': 1, 'limestone-block': 1, 'pine-plank': 1, 'puffbun-leather': 1 }
    const arcana = { 'cut-quartz': 1, linen: 1, 'mist-infusion': 1, 'shell-carving': 1 }
    expect(EQUIP_TYPES).toHaveLength(28)
    expect(gearById('greatsword-g1')).toMatchObject({ name: 'Copper Greatsword', accent: null, inputs: arms })
    expect(gearById('tome-fire-g1')!.inputs).toEqual(arcana)
    expect(gearById('helm-g1-atk')).toMatchObject({ name: 'Fierce Copper Helm', accent: 'atk', inputs: arms })
    expect(gearById('robe-g1-mdef')!.inputs).toEqual(arcana)
    expect(gearById('orb-fire-g1')!.inputs).toEqual(arcana)
    expect(gearById('orb-katana-g1')!.inputs).toEqual(arms)
    for (const type of EQUIP_TYPES) expect(new Set(recipeFamilies(type)).size).toBe(4)
    for (const bad of ['greatsword-g1-atk', 'helm-g1', 'mail-g1-atk', 'ring-g1-hp', 'orb-fire-g1-hp', 'greatsword-g11', 'boots-g1-atk']) expect(gearById(bad), bad).toBeUndefined()
  })

  it('gives a weapon Might on its own hits, armor its defense and accent, physical armor a Barrier and magical Regen (D104)', () => {
    expect(Object.values(gearPoints(gearById('greatsword-g5')!)).every((n) => n === 0)).toBe(true)
    expect(gearPoints(gearById('helm-g4-atk')!)).toMatchObject({ def: 4, atk: 2, mdef: 0 })
    expect(gearPoints(gearById('robe-g4-speed')!)).toMatchObject({ mdef: 4, speed: 2, def: 0 })
    expect(Object.values(gearPoints(gearById('orb-fire-g4')!)).every((n) => n === 0)).toBe(true)
    // Might counts only the weapons in her class's slots: a Brawler's Fire Tome adds nothing.
    expect(equippedMight({ lance: 'lance-g3', 'tome-fire': 'tome-fire-g2' }, ['greatsword', 'axe', 'lance', 'bow', 'katana'])).toEqual({ lance: 12 })
    expect(equippedMight({ 'tome-fire': 'tome-fire-g2' }, ['tome-fire', 'tome-ice', 'tome-lightning', 'tome-light', 'tome-dark'])).toEqual({ fire: 8 })
    expect(equippedGuard({ head: 'helm-g2-hp', body: 'robe-g3-hp', accessory: 'orb-fire-g1' })).toEqual({ barrier: 10, regen: 3 })
    expect(equippedPoints({ head: 'helm-g2-hp', lance: 'lance-g3' })).toMatchObject({ def: 2, hp: 1, atk: 0 })
    expect(equippedOrb({ accessory: 'orb-lance-g1' })).toBe('lance')
    expect(equippedOrb({})).toBeUndefined()
  })
})

describe('the Forge and equipping (S7)', () => {
  it('crafts with Gathering & Crafting into the gear stock', () => {
    let save = edit(umas('101'), (w) => ({ ...w, items: { 'copper-ingot': 2, 'limestone-block': 2, 'pine-plank': 2, 'puffbun-leather': 2 } }))
    const plan = planJob(worldOf(save), 'forge', smith, 'greatsword-g1', 2)!
    expect(plan).toMatchObject({ block: null, profession: 'gathering', msEach: makeMinutes(1) * MINUTE / 2 })
    expect(planJob(worldOf(save), 'forge', smith, 'greatsword-g2', 1)!.block).toBe('Needs Craft Lv6')
    save = startJob(save, 'forge', 0, smith, 'greatsword-g1', 2, at(0))
    save = collectJob(save, 'forge', 0, at(2 * plan.msEach)).save
    expect(worldOf(save).gear).toEqual({ 'greatsword-g1': 2 })
    expect(worldOf(save).items).toEqual({})
  })

  it('binds a piece to whoever equips it; she swaps among her own; her rank sets the grade she wears', () => {
    let save = edit(umas('101', '102'), (w) => ({ ...w, gear: { 'greatsword-g1': 1, 'cuirass-g2-def': 1 } }))
    save = equipGear(save, '101', 'greatsword-g1', at(0))
    expect(worldOf(save).gear).toEqual({ 'cuirass-g2-def': 1 })
    expect(worldOf(save).umas['101']!.gear).toEqual({ locker: ['greatsword-g1'], equipped: { greatsword: 'greatsword-g1' }, kinds: {} })
    expect(() => equipGear(save, '102', 'greatsword-g1', at(0))).toThrow(/none in stock/)
    expect(equipBlock(worldOf(save).umas['101']!, 'cuirass-g2-def')).toBe('Needs Cuirass Rank 2')
    save = unequipGear(save, '101', 'greatsword', at(0))
    expect(worldOf(save).umas['101']!.gear.locker).toEqual(['greatsword-g1'])
    save = equipGear(save, '101', 'greatsword-g1', at(0))
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
    const stolen = JSON.parse(JSON.stringify(save))
    stolen.tierWorlds['1'].umas['102'].gear.equipped.greatsword = 'greatsword-g1'
    expect(() => parseSave(stolen)).toThrow(SaveParseError)
  })

  it('wears one kind per armor slot: a crafted piece or its Training piece, physical or magical (D103)', () => {
    let save = edit(umas('101'), (w) => ({ ...w, gear: { 'robe-g1-hp': 1, 'helm-g1-atk': 1 } }))
    const gear = () => worldOf(save).umas['101']!.gear
    save = wearArmor(save, '101', 'body', 'robe', 'robe-g1-hp', at(0))
    expect(gear()).toMatchObject({ equipped: { body: 'robe-g1-hp' }, kinds: { body: 'robe' } })
    // Back to a Cuirass: its Training piece, and the Robe stays in her locker.
    save = wearArmor(save, '101', 'body', 'cuirass', null, at(1))
    expect(gear()).toMatchObject({ equipped: {}, kinds: { body: 'cuirass' }, locker: ['robe-g1-hp'] })
    expect(() => wearArmor(save, '101', 'head', 'robe', null, at(2))).toThrow(/doesn’t go in this slot/)
    expect(() => wearArmor(save, '101', 'head', 'circlet', 'helm-g1-atk', at(2))).toThrow(/isn’t this armor/)
    save = equipGear(save, '101', 'helm-g1-atk', at(3))
    expect(gear().kinds.head).toBe('helm')
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
    const wrong = JSON.parse(JSON.stringify(save))
    wrong.tierWorlds['1'].umas['101'].gear.kinds.head = 'circlet'
    expect(() => parseSave(wrong)).toThrow(/not the kind this slot holds/)
  })

  it('brings what she wears into her fights: Might, Barrier, Regen, Orb and armor points (engine v8)', () => {
    let save = edit(umas('101', '102', '103', '104', '105'), (w) => ({ ...w, gear: { 'greatsword-g1': 1, 'lance-g1': 1, 'helm-g1-atk': 1, 'robe-g1-speed': 1, 'orb-fire-g1': 1 } }))
    for (const g of ['greatsword-g1', 'lance-g1', 'helm-g1-atk', 'robe-g1-speed', 'orb-fire-g1']) save = equipGear(save, '101', g, at(0))
    const uma = worldOf(save).umas['101']!
    expect(umaPoints(uma, 'brawler')).toMatchObject({ atk: 1, def: 1, mdef: 1, speed: 1 })
    ;['101', '102', '103', '104', '105'].forEach((id, i) => { save = setPartySlot(save, 0, i, id, at(0)) })
    const ura = regionChapter(worldContinent({ name: 'URA', order: 1 }).regions[0]!, [{ id: 'c', name: 'C' }])
    const outfits = new Map(['101', '102', '103', '104', '105'].map((id) => [id, { ...smith, outfitId: id }]))
    const input = worldOf(startFight(save, ura, 'w1-1-1-s1', outfits, at(0))).world.run.battle!.input
    const ally = input.allies[0]!
    const bare = projectRpgStats(umaProfile(smith, uma, 1, 'brawler'))
    expect(input.version).toBe(9)
    expect(ally).toMatchObject({ classRank: 1, might: { greatsword: 4, lance: 4 }, barrier: 5, regen: 1, orb: 'fire', evasion: 6 })
    expect(ally.stats.atk).toBe(applyPoints(bare, umaPoints(uma, 'brawler')).stats.atk)
    expect(ally.stats.atk).toBe(bare.atk + 1)
  })
})

describe('weapon slots (D98)', () => {
  it('fills a class\'s five slots with Training weapons until she holds crafted ones; the slots pick her trees', () => {
    let save = edit(umas('101'), (w) => ({ ...w, gear: { 'lance-g1': 1 } }))
    const uma = () => worldOf(save).umas['101']!
    // A new Spell Blade holds the default spread, every one a Training weapon: no Might.
    expect(classOf(uma(), 'spellblade').weapons).toEqual(['greatsword', 'lance', 'katana', 'tome-fire', 'tome-lightning'])
    expect(equippedMight(uma().gear.equipped, classOf(uma(), 'spellblade').weapons)).toEqual({})
    expect(Object.values(umaPointParts(uma(), 'spellblade').gear).every((n) => n === 0)).toBe(true)
    // An Axe in slot 1 opens the Axe tree in place of the Greatsword's.
    save = holdWeapon(save, '101', 'spellblade', 0, 'axe', null, at(1))
    expect(rpgProfileTrees({ classId: 'spellblade', weapons: classOf(uma(), 'spellblade').weapons })).toContain('spellblade-axe')
    expect(rpgProfileTrees({ classId: 'spellblade', weapons: classOf(uma(), 'spellblade').weapons })).not.toContain('spellblade-greatsword')
    // A crafted Lance takes the Training one's place and binds to her; choosing Training again takes it off.
    save = holdWeapon(save, '101', 'spellblade', 1, 'lance', 'lance-g1', at(2))
    expect(uma().gear.equipped.lance).toBe('lance-g1')
    expect(equippedMight(uma().gear.equipped, classOf(uma(), 'spellblade').weapons)).toEqual({ lance: 4 })
    save = holdWeapon(save, '101', 'spellblade', 1, 'lance', null, at(3))
    expect(uma().gear.equipped.lance).toBeUndefined()
    expect(uma().gear.locker).toContain('lance-g1')
    // A Tome already in the other Tome slot swaps places; a Tome can't go in an Arms slot; a Brawler's slots are fixed.
    save = holdWeapon(save, '101', 'spellblade', 3, 'tome-lightning', null, at(4))
    expect(classOf(uma(), 'spellblade').weapons.slice(3)).toEqual(['tome-lightning', 'tome-fire'])
    expect(() => holdWeapon(save, '101', 'spellblade', 0, 'tome-ice', null, at(5))).toThrow(/doesn’t fit/)
    expect(() => holdWeapon(save, '101', 'brawler', 0, 'bow', null, at(5))).toThrow(/fixed/)
    expect(() => holdWeapon(save, '101', 'spellblade', 2, 'katana', 'lance-g1', at(5))).toThrow(/isn’t this weapon/)
    // A Brawler can still trade a slot's Training weapon for a crafted one of its kind.
    save = holdWeapon(save, '101', 'brawler', classOf(uma(), 'brawler').weapons.indexOf('lance'), 'lance', 'lance-g1', at(6))
    expect(uma().gear.equipped.lance).toBe('lance-g1')
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
