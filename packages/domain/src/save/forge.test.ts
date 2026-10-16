import { describe, expect, it } from 'vitest'
import { regionChapter, worldContinent } from '../world/world'
import { applyPoints } from '../economy/bonus'
import { equippedAccessories, equippedMight, equippedPoints, gearById, gearPoints, recipeFamilies, EQUIP_TYPES } from '../economy/gear'
import { accessoryFightFields } from '../economy/gear-id'
import { makeMinutes, MINUTE } from '../economy/pacing'
import { RPG_FOE_TUNING, rpgFoe, rpgFoeBudget, rpgFoeHitShare } from '../rpg/campaign/enemies'
import { projectRpgStats } from '../rpg/rules'
import { classOf, holdWeapon, startFight, umaPointParts, umaPoints, umaProfile } from './battle'
import { rpgProfileTrees } from '../rpg/rules'
import { boundGrade, equipBlock, equipGear, gearChoices, unequipGear, wearAccessory, wearArmor } from './forge'
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

describe('gear (S7, D124, D125)', () => {
  it('names forty types in ten grades, all by grade; a recipe is two refined items, its pair turning with the grade (D139)', () => {
    expect(EQUIP_TYPES).toHaveLength(40)
    expect(gearById('greatsword-g1')).toMatchObject({ name: 'Copper Greatsword', inputs: { 'pine-plank': 1, 'mist-infusion': 1 } })
    expect(gearById('greatsword-g2')!.inputs).toEqual({ 'boarling-leather': 1, 'ammonite-carving': 1 })
    expect(gearById('tome-fire-g1')!.inputs).toEqual({ 'puffbun-leather': 1, 'shell-carving': 1 })
    expect(gearById('helm-g1')).toMatchObject({ name: 'Copper Helm', inputs: { 'limestone-block': 1, linen: 1 } })
    expect(gearById('boots-g1')).toMatchObject({ name: 'Copper Boots' })
    expect(gearById('talisman-vital-g1')).toMatchObject({ name: 'Copper Vital Talisman', inputs: { 'limestone-block': 1, linen: 1 } })
    expect(gearById('amulet-mirror-g1')!.inputs).toEqual({ 'copper-ingot': 1, 'cut-quartz': 1 })
    for (const type of EQUIP_TYPES) for (let g = 1; g <= 10; g++) expect(new Set(recipeFamilies(type, g)).size).toBe(2)
    for (const bad of ['greatsword-g1-atk', 'helm-g1-atk', 'mail-g1', 'ring-g1', 'orb-fire-g1-hp', 'greatsword-g11', 'talisman-g1', 'amulet-heal-g1']) expect(gearById(bad), bad).toBeUndefined()
  })

  it('gives a weapon Might on its own hits, armor its offense and its slot\'s defense, accessories their effects (D124, D141)', () => {
    expect(Object.values(gearPoints(gearById('greatsword-g5')!)).every((n) => n === 0)).toBe(true)
    // D141: the slot's defensive stat is +2 a grade.
    expect(gearPoints(gearById('helm-g4')!)).toMatchObject({ atk: 2, def: 8, matk: 0 })
    expect(gearPoints(gearById('robe-g4')!)).toMatchObject({ matk: 2, hp: 8, atk: 0 })
    expect(gearPoints(gearById('leggings-g3')!)).toMatchObject({ matk: 2, mp: 6 })
    expect(gearPoints(gearById('gauntlets-g10')!)).toMatchObject({ atk: 5, mdef: 20 })
    expect(gearPoints(gearById('slippers-g5')!)).toMatchObject({ matk: 3, speed: 10 })
    // D143: armor's offense starts at grade 1 again.
    expect(gearPoints(gearById('helm-g1')!)).toMatchObject({ atk: 1, def: 2 })
    expect(Object.values(gearPoints(gearById('orb-fire-g4')!)).every((n) => n === 0)).toBe(true)
    // Might by grade (D142), counting only the weapons in her class's slots.
    expect(equippedMight({ lance: 'lance-g3', 'tome-fire': 'tome-fire-g2' }, ['greatsword', 'axe', 'lance', 'bow', 'katana'])).toEqual({ lance: 8 })
    expect(equippedMight({ 'tome-fire': 'tome-fire-g2' }, ['tome-fire', 'tome-ice', 'tome-lightning', 'tome-light', 'tome-dark'])).toEqual({ fire: 4 })
    expect(equippedMight({ bow: 'bow-g10' }, ['bow'] as never)).toEqual({ bow: 68 })
    expect(equippedPoints({ head: 'helm-g2', lance: 'lance-g3' })).toMatchObject({ def: 4, atk: 1, hp: 0 })
    // A Bulwark's shield is 2% of her max HP a grade (per mille here), made into HP when a fight starts.
    expect(equippedAccessories({ 'accessory-1': 'orb-lance-g1', 'accessory-2': 'talisman-bulwark-g3' })).toMatchObject({ orbs: ['lance'], barrier: 60, veil: 0 })
    expect(accessoryFightFields(equippedAccessories({ 'accessory-1': 'talisman-vital-g10', 'accessory-2': 'amulet-spring-g4' }), 1000))
      .toEqual({ regen: 50, mpRegen: 4 })
    expect(equippedAccessories({ 'accessory-1': 'amulet-spring-g3', 'accessory-2': 'talisman-vampire-g10' })).toMatchObject({ mpRegen: 3, lifesteal: 200 })
    expect(equippedAccessories({ 'accessory-1': 'amulet-siphon-g10', 'accessory-2': 'amulet-ward-g4' })).toMatchObject({ mpSteal: 50, resist: 60 })
    expect(equippedAccessories({ 'accessory-1': 'talisman-thorn-g2', 'accessory-2': 'amulet-mirror-g3' })).toMatchObject({ thorns: 60, mirror: 90 })
    expect(equippedAccessories({})).toMatchObject({ orbs: [], barrier: 0, regen: 0 })
  })
})

describe('the Forge and equipping (S7)', () => {
  it('crafts with Craft Level into the gear stock', () => {
    let save = edit(umas('101'), (w) => ({ ...w, items: { 'pine-plank': 2, 'mist-infusion': 2 } }))
    const plan = planJob(worldOf(save), 'forge', smith, 'greatsword-g1', 2)!
    expect(plan).toMatchObject({ block: null, msEach: makeMinutes(1) * MINUTE })
    expect(planJob(worldOf(save), 'forge', smith, 'greatsword-g2', 1)!.block).toBe('Needs Craft Lv6')
    save = startJob(save, 'forge', 0, smith, 'greatsword-g1', 2, at(0))
    save = collectJob(save, 'forge', 0, at(2 * plan.msEach)).save
    expect(worldOf(save).gear).toEqual({ 'greatsword-g1': 2 })
    expect(worldOf(save).items).toEqual({})
  })

  it('binds each track in order, one grade above her best, and offers only her best pieces and the stock above (D119)', () => {
    const top = { rank: 10, exp: 0 }
    let save = edit(umas('101'), (w) => ({ ...w,
      gear: { 'greatsword-g1': 2, 'greatsword-g2': 1, 'greatsword-g3': 1, 'helm-g1': 2, 'orb-fire-g2': 1, 'orb-ice-g1': 1 },
      umas: { '101': { ...w.umas['101']!, ranks: { ...w.umas['101']!.ranks, weapons: { greatsword: top }, armors: { helm: top }, accessories: { 'elemental-orb': top } } } } }))
    const uma = () => worldOf(save).umas['101']!
    const greatswords = () => gearChoices(uma(), worldOf(save).gear, (p) => p.type === 'greatsword')
    // Nothing bound yet: grade 1 is next; grade 2 and 3 wait their turn.
    expect(boundGrade(uma(), 'greatsword')).toBe(0)
    expect(equipBlock(uma(), 'greatsword-g2')).toBe('Needs G1 first')
    expect(() => equipGear(save, '101', 'greatsword-g3', at(0))).toThrow(/Needs G1 first/)
    expect(greatswords()).toEqual([{ id: 'greatsword-g1', bound: false }, { id: 'greatsword-g2', bound: false }, { id: 'greatsword-g3', bound: false }])
    save = equipGear(save, '101', 'greatsword-g1', at(0))
    save = equipGear(save, '101', 'greatsword-g2', at(0))
    // Grade 1 is spent: the spare in stock no longer shows, and her own grade 1 hides behind her grade 2.
    expect(equipBlock(uma(), 'greatsword-g1')).toBeNull() // her own swaps freely
    expect(greatswords()).toEqual([{ id: 'greatsword-g2', bound: true }, { id: 'greatsword-g3', bound: false }])
    save = equipGear(save, '101', 'greatsword-g3', at(0))
    expect(greatswords()).toEqual([{ id: 'greatsword-g3', bound: true }])
    // A lower piece she still wears stays in view, so the sheet can show it held.
    save = equipGear(save, '101', 'greatsword-g1', at(0))
    expect(greatswords().map((c) => c.id)).toEqual(['greatsword-g3', 'greatsword-g1'])
    // Armor climbs by kind: her grade-1 Helm spends grade 1, so the spare in stock no longer shows.
    save = equipGear(save, '101', 'helm-g1', at(0))
    expect(gearChoices(uma(), worldOf(save).gear, (p) => p.type === 'helm')).toEqual([{ id: 'helm-g1', bound: true }])
    // Each Orb climbs on its own: Fire waits for grade 1, Ice starts now.
    expect(equipBlock(uma(), 'orb-fire-g2')).toBe('Needs G1 first')
    expect(equipBlock(uma(), 'orb-ice-g1')).toBeNull()
  })

  it('binds a piece to whoever equips it; she swaps among her own; her rank sets the grade she wears', () => {
    let save = edit(umas('101', '102'), (w) => ({ ...w, gear: { 'greatsword-g1': 1, 'cuirass-g2': 1 } }))
    save = equipGear(save, '101', 'greatsword-g1', at(0))
    expect(worldOf(save).gear).toEqual({ 'cuirass-g2': 1 })
    expect(worldOf(save).umas['101']!.gear).toEqual({ locker: ['greatsword-g1'], equipped: { greatsword: 'greatsword-g1' }, kinds: {} })
    expect(() => equipGear(save, '102', 'greatsword-g1', at(0))).toThrow(/none in stock/)
    expect(equipBlock(worldOf(save).umas['101']!, 'cuirass-g2')).toBe('Needs Cuirass Rank 2')
    save = unequipGear(save, '101', 'greatsword', at(0))
    expect(worldOf(save).umas['101']!.gear.locker).toEqual(['greatsword-g1'])
    save = equipGear(save, '101', 'greatsword-g1', at(0))
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
    const stolen = JSON.parse(JSON.stringify(save))
    stolen.tierWorlds['1'].umas['102'].gear.equipped.greatsword = 'greatsword-g1'
    expect(() => parseSave(stolen)).toThrow(SaveParseError)
  })

  it('wears one kind per armor slot: a crafted piece or its Training piece, physical or magical (D103)', () => {
    let save = edit(umas('101'), (w) => ({ ...w, gear: { 'robe-g1': 1, 'helm-g1': 1, 'slippers-g1': 1 } }))
    const gear = () => worldOf(save).umas['101']!.gear
    save = wearArmor(save, '101', 'body', 'robe', 'robe-g1', at(0))
    expect(gear()).toMatchObject({ equipped: { body: 'robe-g1' }, kinds: { body: 'robe' } })
    // Back to a Cuirass: its Training piece, and the Robe stays in her locker.
    save = wearArmor(save, '101', 'body', 'cuirass', null, at(1))
    expect(gear()).toMatchObject({ equipped: {}, kinds: { body: 'cuirass' }, locker: ['robe-g1'] })
    expect(() => wearArmor(save, '101', 'head', 'robe', null, at(2))).toThrow(/doesn’t go in this slot/)
    expect(() => wearArmor(save, '101', 'head', 'circlet', 'helm-g1', at(2))).toThrow(/isn’t this armor/)
    save = wearArmor(save, '101', 'feet', 'slippers', 'slippers-g1', at(3))
    expect(gear()).toMatchObject({ equipped: { feet: 'slippers-g1' }, kinds: { body: 'cuirass', feet: 'slippers' } })
    save = equipGear(save, '101', 'helm-g1', at(3))
    expect(gear().kinds.head).toBe('helm')
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
    const wrong = JSON.parse(JSON.stringify(save))
    wrong.tierWorlds['1'].umas['101'].gear.kinds.head = 'circlet'
    expect(() => parseSave(wrong)).toThrow(/not the kind this slot holds/)
  })

  it('wears two accessories of different types, in either slot; an empty slot holds nothing (D124)', () => {
    let save = edit(umas('101'), (w) => ({ ...w, gear: { 'orb-fire-g1': 2, 'talisman-vital-g1': 1, 'amulet-veil-g1': 1 } }))
    const gear = () => worldOf(save).umas['101']!.gear
    save = equipGear(save, '101', 'orb-fire-g1', at(0))
    save = equipGear(save, '101', 'talisman-vital-g1', at(1))
    expect(gear().equipped).toEqual({ 'accessory-1': 'orb-fire-g1', 'accessory-2': 'talisman-vital-g1' })
    // Swapping the second slot to an Amulet keeps the Talisman in her locker; the first can't take a second Fire Orb's type.
    save = wearAccessory(save, '101', 'accessory-2', 'amulet-veil-g1', at(2))
    expect(gear().equipped['accessory-2']).toBe('amulet-veil-g1')
    expect(gear().locker).toContain('talisman-vital-g1')
    save = wearAccessory(save, '101', 'accessory-1', null, at(3))
    expect(gear().equipped).toEqual({ 'accessory-2': 'amulet-veil-g1' })
    save = wearAccessory(save, '101', 'accessory-1', 'orb-fire-g1', at(4))
    expect(() => wearAccessory(save, '101', 'accessory-2', 'orb-fire-g1', at(5))).toThrow(/already wears one/)
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
    const twice = JSON.parse(JSON.stringify(save))
    twice.tierWorlds['1'].umas['101'].gear.equipped['accessory-2'] = 'orb-fire-g1'
    expect(() => parseSave(twice)).toThrow(/same type/)
  })

  it('brings what she wears into her fights: Might, armor points, Orb kinds and accessory effects (engine v11)', () => {
    let save = edit(umas('101', '102', '103', '104', '105'), (w) => ({ ...w,
      gear: { 'greatsword-g1': 1, 'lance-g1': 1, 'helm-g1': 1, 'robe-g1': 1, 'boots-g1': 1, 'orb-fire-g1': 1, 'talisman-bulwark-g1': 1 } }))
    for (const g of ['greatsword-g1', 'lance-g1', 'helm-g1', 'robe-g1', 'boots-g1', 'orb-fire-g1', 'talisman-bulwark-g1']) save = equipGear(save, '101', g, at(0))
    const uma = worldOf(save).umas['101']!
    expect(umaPoints(uma, 'brawler')).toMatchObject({ atk: 2, matk: 1, def: 2, hp: 2, speed: 2 })
    ;['101', '102', '103', '104', '105'].forEach((id, i) => { save = setPartySlot(save, 0, i, id, at(0)) })
    const ura = regionChapter(worldContinent({ name: 'URA', order: 1 }).regions[0]!, [{ id: 'c', name: 'C' }])
    const outfits = new Map(['101', '102', '103', '104', '105'].map((id) => [id, { ...smith, outfitId: id }]))
    const input = worldOf(startFight(save, ura, 'w1-1-1-s1', outfits, at(0))).world.run.battle!.input
    const ally = input.allies[0]!
    const bare = projectRpgStats(umaProfile(smith, uma, 1, 'brawler'))
    expect(input.version).toBe(13)
    expect(ally).toMatchObject({ classRank: 1, might: { greatsword: 1, lance: 1 }, barrier: Math.round(ally.stats.hp * 0.02), orbs: ['fire'], evasion: 12 })
    expect(ally).not.toHaveProperty('orb')
    expect(ally).not.toHaveProperty('regen')
    expect(ally.stats.atk).toBe(applyPoints(bare, umaPoints(uma, 'brawler')).stats.atk)
    expect(ally.stats.atk).toBe(bare.atk + 2)
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
    expect(equippedMight(uma().gear.equipped, classOf(uma(), 'spellblade').weapons)).toEqual({ lance: 1 })
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

describe('the foe budget (§7.3, D141)', () => {
  const striker = (level: number) => rpgFoe({ id: 'f', castId: 'c', element: 'fire', role: 'striker', rank: 'regular', level, shield: 2, weaknesses: { weapons: [], elements: [] } })
  it('sets a foe’s offense so a 100% hit takes its share of an average Uma’s HP, raised by the budget of a built one', () => {
    for (const level of [1, 10, 30, 50]) {
      const s = 22 + 1.59 * (level - 1), atk = striker(level).stats.atk
      const share = rpgFoeHitShare(level) * rpgFoeBudget(level, RPG_FOE_TUNING.offenseBudgetPerLevel)
      expect(Math.abs((atk * atk) / (atk + s) / (100 + 7 * s) - share), `Lv${level}`).toBeLessThan(0.01)
    }
    // A fresh party's first fights are gentler: 20% at Lv 1, 28% from Lv 10 on.
    expect(rpgFoeHitShare(1)).toBe(0.2)
    expect(rpgFoeHitShare(10)).toBeCloseTo(0.28)
    expect(rpgFoeHitShare(40)).toBeCloseTo(0.28)
  })
  it('grows HP with the square of the level, for the gear and Extra Stats a built party has', () => {
    expect(rpgFoeBudget(1, 0.035)).toBe(1)
    expect(rpgFoeBudget(50, 0.035)).toBeCloseTo(2.715)
    expect(striker(50).stats.hp).toBeGreaterThan(striker(25).stats.hp * 2)
  })
})

describe('save v20: gear symmetry (D124, D125)', () => {
  it('drops armor accents, keeps one of each piece an Uma holds, moves the Orb and its rank, seeds Boots and Slippers, re-costs queued Forge jobs', () => {
    const raw = JSON.parse(JSON.stringify(umas('101'))) as Record<string, any>
    raw.schemaVersion = 19
    const w = raw.tierWorlds['1']
    const uma = w.umas['101']
    const r5 = { rank: 5, exp: 0 }
    uma.ranks = { classes: {}, weapons: {}, armors: { helm: r5, greaves: { rank: 3, exp: 7 }, leggings: r5, 'arms-orb': { rank: 2, exp: 1 } } }
    uma.gear = { locker: ['helm-g2-atk', 'helm-g2-def', 'helm-g1-hp', 'orb-katana-g1'], equipped: { head: 'helm-g2-def', accessory: 'orb-katana-g1' },
      kinds: { head: 'helm', accessory: 'arms-orb' } }
    w.gear = { 'cuirass-g1-atk': 2, 'cuirass-g1-mp': 1, 'lance-g1': 1 }
    const queued = { output: 'robe-g1-mdef', count: 2, msEach: 1000, expEach: 1, inputs: { 'cut-quartz': 1, linen: 1, 'mist-infusion': 1, 'shell-carving': 1 } }
    w.facilities = { forge: { level: 1, jobs: [{ kind: 'craft', outfitId: '101', output: 'helm-g1-atk', count: 1, collected: 0, startedAt: at(0), msEach: 1000,
      expEach: 1, inputs: { 'copper-ingot': 1 }, queue: [queued] }, null] } }
    const save = parseSave(raw)
    const after = worldOf(save).umas['101']!
    expect(after.gear).toEqual({ locker: ['helm-g2', 'helm-g1', 'orb-katana-g1'], equipped: { head: 'helm-g2', 'accessory-1': 'orb-katana-g1' }, kinds: { head: 'helm' } })
    expect(after.ranks.armors).toEqual({ helm: r5, greaves: { rank: 3, exp: 7 }, leggings: r5, boots: { rank: 3, exp: 7 }, slippers: r5 })
    expect(after.ranks.accessories).toEqual({ 'arms-orb': { rank: 2, exp: 1 } })
    expect(worldOf(save).gear).toEqual({ 'cuirass-g1': 3, 'lance-g1': 1 })
    const job = worldOf(save).facilities.forge!.jobs[0]!
    expect(job.output).toBe('helm-g1')
    expect(job.queue[0]).toMatchObject({ output: 'robe-g1', inputs: gearById('robe-g1')!.inputs })
  })
})
