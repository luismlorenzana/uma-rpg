// The farm by line through the save's rules (H109, live since H112; farm-by-line.md FL4, FL5, FL9, FL12–FL14, FL22): the
// Warehouse's ids, work on its env (a job's kind by its item), gear by channel (Arms Gems and Tome Ink), Can upgrade,
// Ascend, targets by line, the Exchange by grade and the names.
import { describe, expect, it } from 'vitest'
import { gradeItemId, raiseBlock, newGrades, type GradeTarget } from '../economy/grades'
import { stockName } from '../economy/stock'
import { wildsPlaces } from '../hub/places'
import { isStockItemId } from '../items/stock-id'
import { liveWorkEnv } from '../work/env-v3'
import { RPG_BUILDINGS_V4 } from '../work/env-v4'
import { ECONOMY_V3_NOW as NOW, gradedUma, gradedWorld } from './economy-v3.fixture'
import { buyRawItem, rawPriceV4, sellPrice, stockedTypes } from './exchange'
import { raiseGrade, raiseGradeTo } from './forge'
import { ascend, signUpRift } from './rift'
import { riftWorldSave, T, TWENTY } from './rift-rules.fixture'
import { worldOf } from './rules'
import type { Save, TierWorld } from './save'
import { facilityTargets, targetPlan } from './targets'
import { upgradesFor } from './upgrades'
import { SAVE_SCHEMA_VERSION } from './version'
import { planJob, startJob } from './work'

const saveOf = (world: TierWorld, tier = 1): Save => ({
  schemaVersion: SAVE_SCHEMA_VERSION,
  account: { trainerName: 'Tester', createdAt: NOW, updatedAt: NOW, achievements: {}, history: {}, defeated: {} },
  tierWorlds: { [String(tier)]: world },
})
const one = (items: Record<string, number>, uma = gradedUma()) => saveOf(gradedWorld({ items, umas: { '101': uma } }))
const katana: GradeTarget = { kind: 'weapon', weapon: 'katana' }
const fire: GradeTarget = { kind: 'weapon', weapon: 'tome-fire' }
/** A world with wins on these continents of its own tier (1–5). */
function worldWith(tier: number, continents: readonly number[]): TierWorld {
  const base = gradedWorld()
  const wins = Object.fromEntries(continents.map((c) => [`w${(tier - 1) * 5 + c}-1-1-s1`, 1]))
  return { ...base, world: { ...base.world, run: { ...base.world.run, wins: { start: 1, ...wins } } } }
}

describe('the farm by line (save v30)', () => {
  it('is the live save', () => {
    expect(SAVE_SCHEMA_VERSION).toBe(30)
  })

  it('lets the Warehouse hold the hundred line items and Tome Ink (FL5, FL14)', () => {
    for (const id of ['trout', 'diced-potato', 'cut-ruby', 'tome-ink-g3', 'weapon-gem-g3', 'iron-ore']) expect(isStockItemId(id), id).toBe(true)
    expect(isStockItemId('tome-ink-g3', 16)).toBe(false)
    expect(isStockItemId('branch-gem')).toBe(false)
  })
})

describe('work on the farm by line\'s env (FL2, FL10)', () => {
  it('is the live env', () => {
    expect(liveWorkEnv(1).buildings).toBe(RPG_BUILDINGS_V4)
  })

  it('starts a process at the Forge and a make after it: each job\'s kind follows its item', () => {
    const save = startJob(one({ 'copper-ore': 8 }), 'forge', 0, { outfitId: '101' }, 'copper-ingot', 8, NOW)
    const row = worldOf(save, '1').work['101']!
    expect(row.entries[0]!.request).toEqual({ kind: 'refine', item: 'copper-ingot', count: 8 })
    expect(worldOf(save, '1').items).toEqual({})
    const made = startJob(one({ 'copper-ingot': 7 }), 'forge', 1, { outfitId: '101' }, 'weapon-gem-g1', 1, NOW)
    expect(worldOf(made, '1').work['101']!.entries[0]!.request).toEqual({ kind: 'craft', item: 'weapon-gem-g1', count: 1 })
    expect(() => startJob(one({ 'pine-log': 1 }), 'forge', 0, { outfitId: '101' }, 'pine-plank', 1, NOW)).toThrow("That isn't made here.")
  })

  it('plans a job\'s item, inputs and gate for the pickers', () => {
    const world = gradedWorld({ umas: { '101': gradedUma() } })
    const gem = planJob(world, 'forge', { outfitId: '101' }, 'weapon-gem-g1', 1)!
    expect(gem.output).toEqual({ id: 'weapon-gem-g1', name: 'Arms Gem G1', grade: 1 })
    expect(gem.inputs).toEqual({ 'copper-ingot': 7 })
    expect(gem.block).toBe('Needs 7 Copper Ingot')
    const ink = planJob(world, 'workbench', { outfitId: '101' }, 'tome-ink-g2', 1)!
    expect(ink.output).toEqual({ id: 'tome-ink-g2', name: 'Tome Ink G2', grade: 2 })
    expect(ink.block).toBe('Needs Craft Lv6')
    expect(planJob(world, 'mine', { outfitId: '101' }, 'tin-ore', 1)!.output).toEqual({ id: 'tin-ore', name: 'Tin Ore', grade: 2 })
  })
})

describe('gear by channel (FL4, FL16)', () => {
  it('raises an Arms weapon with Arms Gems and a Tome with Tome Ink, each refused with the other\'s item', () => {
    expect(gradeItemId(katana, 3)).toBe('weapon-gem-g3')
    expect(gradeItemId(fire, 3)).toBe('tome-ink-g3')
    expect(worldOf(raiseGrade(one({ 'weapon-gem-g1': 1 }), '101', katana, NOW), '1').umas['101']!.gear).toMatchObject({ weapons: { katana: { grade: 1 } } })
    expect(worldOf(raiseGrade(one({ 'tome-ink-g1': 1 }), '101', fire, NOW), '1').items).toEqual({})
    expect(() => raiseGrade(one({ 'weapon-gem-g1': 1 }), '101', fire, NOW)).toThrow('Needs 1 Tome Ink G1')
    expect(() => raiseGrade(one({ 'tome-ink-g1': 1 }), '101', katana, NOW)).toThrow('Needs 1 Arms Gem G1')
    expect(() => raiseGradeTo(one({ 'tome-ink-g1': 1 }, gradedUma({ level: 11 })), '101', fire, 3, NOW)).toThrow('Needs Tome Ink G2 and G3')
    expect(raiseBlock(newGrades(1), katana, 16, {}, 3)).toBe('Needs Arms Gems G1, G2 and G3')
  })

  it('counts Tome Ink as an upgrade for a Mage\'s Tome', () => {
    const world = gradedWorld({ items: { 'tome-ink-g1': 1 }, umas: { '101': gradedUma({ classId: 'mage' }) } })
    expect(upgradesFor(world, '101', 'mage', 1)!.grades).toEqual([{ kind: 'weapon', weapon: 'tome-fire' }, { kind: 'weapon', weapon: 'tome-ice' },
      { kind: 'weapon', weapon: 'tome-lightning' }])
    const gems = gradedWorld({ items: { 'weapon-gem-g1': 1 }, umas: { '101': gradedUma({ classId: 'mage' }) } })
    expect(upgradesFor(gems, '101', 'mage', 1)!.grades).toEqual([])
  })

  it('gives back Tome Ink for a Tome\'s grades on Ascend', () => {
    const save: Save = JSON.parse(JSON.stringify(signUpRift(riftWorldSave(), TWENTY, T(1))))
    const w = save.tierWorlds['1']!
    Object.assign(w.rift.runs[0]!, { fronts: { iron: 12, arcane: 12, duel: 12, horde: 12 }, convergence: { attempts: 1, open: null }, wonAt: T(50) })
    w.umas['101']!.gear = { weapons: { 'tome-fire': { grade: 2 }, katana: { grade: 1 } }, armor: {}, accessories: [{ grade: 0, family: null, form: 'base' }] }
    expect(worldOf(ascend(save, T(70)).save, '1').items).toEqual({ 'tome-ink-g1': 1, 'tome-ink-g2': 1, 'weapon-gem-g1': 1 })
  })
})

describe('targets by line (FL9, FL22)', () => {
  const planFor = (classId: 'mage' | 'brawler') => {
    const world = gradedWorld({ targets: ['101'], umas: { '101': gradedUma({ classId, gear: newGrades(1), stars: { open: [], moons: [] } }) } })
    return targetPlan(world, () => classId, 1)
  }
  const total = (rows: readonly { need: number }[]) => rows.reduce((sum, row) => sum + row.need, 0)

  it('asks a Mage\'s Tomes for Tome Ink, down to vegetable cuts at the Workbench and vegetables at the Fields', () => {
    const plan = planFor('mage')
    expect(total(plan.made.filter((r) => r.key.startsWith('tome-ink-')))).toBe(30)
    expect(plan.made.some((r) => r.key.startsWith('weapon-gem-'))).toBe(false)
    // 30 Tome Ink × 7 = 210 vegetable cuts; 50 Fittings × 2 Planks; 10 Settings × 10 Fillets; 5 Planets × 10 and 17 Moons × 4.
    expect(total(plan.refined)).toBe(210 + 100 + 100 + 50 + 68)
    expect(total(plan.raw)).toBe(total(plan.refined))
    expect(plan.made.find((r) => r.key === 'tome-ink-g3')).toMatchObject({ name: 'Tome Ink G3', grade: 3, need: 3 })
    const workbench = facilityTargets(plan, 'workbench')
    expect(workbench.map((r) => r.key).slice(0, 10)).toEqual(Array.from({ length: 10 }, (_, i) => `tome-ink-g${i + 1}`))
    expect(workbench.slice(10).map((r) => r.key)).toEqual(['chopped-carrot', 'diced-potato', 'shredded-cabbage', 'diced-onion', 'tomato-puree',
      'sliced-bell-pepper', 'sliced-eggplant', 'trimmed-asparagus', 'golden-carrot-puree', 'pumpkin-puree'])
    expect(facilityTargets(plan, 'fields').map((r) => r.key)).toEqual(['carrot', 'potato', 'cabbage', 'onion', 'tomato', 'bell-pepper', 'eggplant',
      'asparagus', 'golden-carrot', 'emperor-pumpkin'])
    expect(facilityTargets(plan, 'forge')).toEqual([])
  })

  it('lists a Brawler\'s Arms Gems, then Ingots, at the Forge', () => {
    const forge = facilityTargets(planFor('brawler'), 'forge')
    expect(forge[0]).toMatchObject({ key: 'weapon-gem-g1', name: 'Arms Gem G1', need: 3 })
    expect(forge.filter((r) => r.key.startsWith('weapon-gem-'))).toHaveLength(10)
    expect(forge.slice(10).map((r) => r.key)[0]).toBe('copper-ingot')
    expect(forge.find((r) => r.key === 'iron-ingot')).toMatchObject({ name: 'Iron Ingot', grade: 3, need: 21 })
    expect(facilityTargets(planFor('brawler'), 'mine').map((r) => r.key)[1]).toBe('tin-ore')
  })
})

describe('the Exchange by grade (FL12, FL13)', () => {
  it('stocks G1–G5 after the tier\'s first win and G6–G10 after continent 3, in every tier', () => {
    expect(stockedTypes(worldWith(1, []), 1)).toEqual([])
    const first = stockedTypes(worldWith(1, [1]), 1)
    expect(first).toHaveLength(25)
    expect(first.slice(0, 5)).toEqual(['copper-ore', 'tin-ore', 'iron-ore', 'silver-ore', 'cobalt-ore'])
    expect(stockedTypes(worldWith(1, [1, 2]), 1)).toHaveLength(25)
    expect(stockedTypes(worldWith(1, [1, 2, 3]), 1)).toHaveLength(50)
    expect(stockedTypes(worldWith(2, [3]), 2)).toHaveLength(50)
  })

  it('prices raw G1–G5 at 30 and G6–G10 at 80 Laurels × the tier, and sells as R2 does by grade', () => {
    expect([rawPriceV4('tin-ore', 1), rawPriceV4('gold-ore', 1), rawPriceV4('trout', 2), rawPriceV4('tin-ingot', 1)]).toEqual([30, 80, 60, 0])
    expect([sellPrice('items', 'trout'), sellPrice('items', 'eel'), sellPrice('items', 'eel-fillet'), sellPrice('items', 'tome-ink-g3', 2)]).toEqual([6, 16, 32, 48])
    const world = worldWith(1, [1])
    const bought = buyRawItem(saveOf({ ...world, wallet: { ...world.wallet, laurels: 100 } }), 'tin-ore', 3, stockedTypes(world, 1), NOW, '1')
    expect(worldOf(bought, '1').items).toEqual({ 'tin-ore': 3 })
    expect(worldOf(bought, '1').wallet.laurels).toBe(10)
    expect(() => buyRawItem(saveOf(world), 'tin-ingot', 1, stockedTypes(world, 1), NOW, '1')).toThrow('raw items only')
    expect(() => buyRawItem(saveOf(world), 'gold-ore', 1, stockedTypes(world, 1), NOW, '1')).toThrow('Not stocked yet')
  })
})

describe('names and places (FL14, FL16)', () => {
  it('names stock by the farm by line', () => {
    expect(['weapon-gem-g2', 'tome-ink-g2', 'trout-fillet', 'tomato-puree', 'iron-ore'].map(stockName))
      .toEqual(['Arms Gem G2', 'Tome Ink G2', 'Trout Fillet', 'Tomato Purée', 'Iron Ore'])
  })

  it('describes the Wilds\' places by line', () => {
    const places = Object.fromEntries(wildsPlaces().map((p) => [p.id, p]))
    expect(places.forge!.blurb).toBe('Arms Crafting: Arms Gems.')
    expect(places.workbench!.blurb).toBe('Tome Crafting: Tome Ink.')
    expect(places.mine!.blurb).toBe('Mining: metal, G1–G10.')
    expect(places.lapidary!.details[0]).toBe('Processes Stone, makes Planet and Moon Jewels I–V')
  })
})
