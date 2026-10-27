// The farm by line's job kinds (H109; farm-by-line.md FL2, FL6, FL9, FL10): every place one line's, a making place
// processing its own line and making its one item, every gate Craft Lv 5g − 4, making at three quarters of a gather a
// refined item. Read from `rpgWorkEnvV4`, the live env since H112.
import { isRefusal, kindRules, type PlannedItem, type Refusal, type WorkEnv } from '@luismlorenzana/uma-work'
import { describe, expect, it } from 'vitest'
import { jobExp, makeMinutesV4, stepMinutes } from '../economy/pacing'
import { jobKindV4, PLACES_V4, placeSpecV4, PROFESSION_NAMES_V4 } from '../economy/places-v4'
import { PLACE_IDS_V3, PROFESSIONS, tradeOfCalling, type TradeOf } from '../economy/professions'
import { madeRecipeV4, madeNameV4, madeRefinedV4 } from '../items/made-v4'
import { gradeItem, jewelId, MADE_IDENTITIES } from '../items/made-id'
import { lineItem } from '../items/lines'
import type { RpgClass } from '../rpg/kinds'
import { gradedUma, gradedWorld } from '../save/economy-v3.fixture'
import type { TierWorld } from '../save/save'
import { refusalText } from '../save/work'
import { RPG_WORK_ENV } from './env'
import { liveWorkEnv } from './env-v3'
import { RPG_BUILDINGS_V4, rpgWorkEnvV4 } from './env-v4'
import type { WorkContext } from './env-v3'

const SPEED = 1.25
function worldOf(umas: Record<string, number>, items: Record<string, number> = {}): TierWorld {
  return gradedWorld({ items, umas: Object.fromEntries(Object.entries(umas).map(([id, level]) => [id, gradedUma({ craft: { level, exp: 0 } })])) })
}
const tradesOf = (callings: Record<string, RpgClass>): TradeOf => (id) => (callings[id] ? tradeOfCalling(callings[id]!) : null)

function plan(world: TierWorld, place: string, kind: string, item: string, opts: { tier?: number; count?: number; who?: string; context?: WorkContext } = {}):
  readonly PlannedItem[] | Refusal {
  const env: WorkEnv<TierWorld> = rpgWorkEnvV4(opts.tier ?? 1, opts.context)
  return kindRules(env, kind)!.plan(world, opts.who ?? '101', { kind: kind as never, item, count: opts.count ?? 1 }, 0,
    { slot: { building: place, slot: 0 }, speed: SPEED, earlier: [], env })
}
const why = (result: readonly PlannedItem[] | Refusal): string | null => (isRefusal(result) ? refusalText(result, 0) : null)
const first = (result: readonly PlannedItem[] | Refusal): PlannedItem => {
  if (isRefusal(result)) throw new Error(refusalText(result, 0))
  return result[0]!
}
const seconds = (minutes: number) => Math.round((minutes * 60) / SPEED)
const NOT_HERE = "That isn't made here."

describe('the farm by line\'s places and env (FL1–FL3)', () => {
  it('has fifteen places, slots and speed, each one line and one kind', () => {
    expect(PLACES_V4.map((p) => p.id)).toEqual([...PLACE_IDS_V3])
    expect(PLACES_V4.map((p) => p.profession)).toEqual(PLACE_IDS_V3.map((id) => PROFESSIONS.find((p) => p.place === id)!.id))
    expect(PLACES_V4.map((p) => `${p.id}:${p.line}:${p.kinds.join('+')}:${p.made.join('+')}`)).toEqual([
      'mine:metal:gather:', 'mine-workbench:metal:refine:', 'weapon-forge:metal:craft:weapon-gem+branch-gem',
      'fields:vegetables:gather:', 'fields-workbench:vegetables:refine:', 'tome-forge:vegetables:craft:tome-ink',
      'forest:wood:gather:', 'forest-workbench:wood:refine:', 'armorer:wood:craft:armor-fittings',
      'fishery:fish:gather:', 'fishery-workbench:fish:refine:', 'charm-forge:fish:craft:accessory-setting',
      'monster-den:stone:gather:', 'den-workbench:stone:refine:', 'lapidary:stone:cut:jewel-planet+jewel-moon',
    ])
    for (const id of RPG_BUILDINGS_V4.ids) expect([RPG_BUILDINGS_V4.slots(id, 1), RPG_BUILDINGS_V4.speed(id, 1), RPG_BUILDINGS_V4.maxLevel(id)]).toEqual([4, 1.25, 1])
    expect(PROFESSION_NAMES_V4['arms-crafting']).toBe('Arms Crafting')
    expect(PROFESSION_NAMES_V4['tome-crafting']).toBe('Tome Crafting')
    expect(PROFESSION_NAMES_V4.smelting).toBe('Smelting')
    expect(PROFESSION_NAMES_V4.mining).toBe('Mining')
  })

  it('is the live env from the economy stage (H112)', () => {
    expect(liveWorkEnv(1).buildings).toBe(RPG_BUILDINGS_V4)
    expect(rpgWorkEnvV4(1).exp).toBe(RPG_WORK_ENV.exp)
  })

  it('tells a job\'s kind by its item at the place', () => {
    expect(jobKindV4('mine', 'tin-ore')).toBe('gather')
    expect(jobKindV4('mine', 'tin-ingot')).toBeNull()
    expect(jobKindV4('mine-workbench', 'tin-ingot')).toBe('refine')
    expect(jobKindV4('mine-workbench', 'tin-ore')).toBeNull()
    expect(jobKindV4('weapon-forge', 'weapon-gem-g2')).toBe('craft')
    expect(jobKindV4('weapon-forge', 'tin-ingot')).toBeNull()
    expect(jobKindV4('tome-forge', 'tome-ink-g1')).toBe('craft')
    expect(jobKindV4('lapidary', 'jewel-moon-3')).toBe('cut')
    expect(jobKindV4('den-workbench', 'cut-ruby')).toBe('refine')
    expect(jobKindV4('nowhere', 'tin-ore')).toBeNull()
  })
})

describe('gathering (FL5, FL6)', () => {
  it('gathers its line\'s raw items only, grade g from Craft Lv 5g − 4', () => {
    expect(first(plan(worldOf({ 101: 1 }), 'mine', 'gather', 'copper-ore', { count: 3 }))).toEqual({ seconds: 1728, inputs: [], output: { item: 'copper-ore' }, exp: 72 })
    expect(why(plan(worldOf({ 101: 5 }), 'mine', 'gather', 'tin-ore'))).toBe('Needs Craft Lv6')
    expect(first(plan(worldOf({ 101: 6 }), 'mine', 'gather', 'tin-ore')).seconds).toBe(seconds(stepMinutes(6)))
    expect(why(plan(worldOf({ 101: 10 }), 'mine', 'gather', 'iron-ore'))).toBe('Needs Craft Lv11')
    expect(why(plan(worldOf({ 101: 46 }), 'mine', 'gather', 'orichalcum-ore'))).toBeNull()
    expect(why(plan(worldOf({ 101: 50 }), 'mine', 'gather', 'pine-log'))).toBe(NOT_HERE)
    expect(why(plan(worldOf({ 101: 50 }), 'mine', 'gather', 'copper-ingot'))).toBe(NOT_HERE)
    expect(why(plan(worldOf({ 101: 50 }), 'weapon-forge', 'gather', 'copper-ore'))).toBe(NOT_HERE)
    expect(first(plan(worldOf({ 101: 6 }), 'fields', 'gather', 'potato')).output).toEqual({ item: 'potato' })
    expect(first(plan(worldOf({ 101: 6 }), 'fishery', 'gather', 'trout')).output).toEqual({ item: 'trout' })
  })

  it('gathers the same fifty types in every world (FL8)', () => {
    expect(first(plan(worldOf({ 101: 26 }), 'mine', 'gather', 'gold-ore', { tier: 1 })).output).toEqual({ item: 'gold-ore' })
    expect(first(plan(worldOf({ 101: 1 }), 'mine', 'gather', 'copper-ore', { tier: 2 })).output).toEqual({ item: 'copper-ore' })
    expect(why(plan(worldOf({ 101: 1 }), 'mine', 'gather', 'gold-ore', { tier: 2 }))).toBe('Needs Craft Lv26')
  })
})

describe('processing at the line\'s making place (FL2, FL10)', () => {
  it('processes its own line one for one, one step each, up to ×40', () => {
    const items = plan(worldOf({ 101: 1 }), 'mine-workbench', 'refine', 'copper-ingot', { count: 40 })
    expect(items).toHaveLength(40)
    expect(first(items)).toEqual({ seconds: seconds(stepMinutes(1)), inputs: [{ item: 'copper-ore', qty: 1 }], output: { item: 'copper-ingot' }, exp: jobExp(stepMinutes(1)) })
    expect(why(plan(worldOf({ 101: 50 }), 'mine-workbench', 'refine', 'pine-plank'))).toBe(NOT_HERE)
    expect(why(plan(worldOf({ 101: 50 }), 'mine-workbench', 'refine', 'copper-ore'))).toBe(NOT_HERE)
    expect(why(plan(worldOf({ 101: 50 }), 'mine', 'refine', 'copper-ingot'))).toBe(NOT_HERE)
    expect(why(plan(worldOf({ 101: 10 }), 'forest-workbench', 'refine', 'cedar-plank'))).toBe('Needs Craft Lv11')
    expect(first(plan(worldOf({ 101: 11 }), 'forest-workbench', 'refine', 'cedar-plank')).inputs).toEqual([{ item: 'cedar-log', qty: 1 }])
  })

  it('each line has its own workbench', () => {
    expect(first(plan(worldOf({ 101: 1 }), 'fields-workbench', 'refine', 'chopped-carrot')).inputs).toEqual([{ item: 'carrot', qty: 1 }])
    for (const id of ['copper-ingot', 'pine-plank', 'carp-fillet', 'cut-quartz']) expect(why(plan(worldOf({ 101: 50 }), 'fields-workbench', 'refine', id)), id).toBe(NOT_HERE)
    expect(first(plan(worldOf({ 101: 1 }), 'fishery-workbench', 'refine', 'carp-fillet')).output).toEqual({ item: 'carp-fillet' })
    expect(first(plan(worldOf({ 101: 1 }), 'den-workbench', 'refine', 'cut-quartz')).output).toEqual({ item: 'cut-quartz' })
  })
})

describe('making (FL3, FL7, FL9, FL10)', () => {
  it('takes one line\'s refined items of its own grade, the same amount at every grade', () => {
    expect(madeRecipeV4('weapon-gem-g3')).toEqual({ 'iron-ingot': 7 })
    expect(madeRecipeV4('tome-ink-g1')).toEqual({ 'chopped-carrot': 7 })
    expect(madeRecipeV4('armor-fittings-g10')).toEqual({ 'yggdrasil-plank': 2 })
    expect(madeRecipeV4('accessory-setting-g4')).toEqual({ 'mackerel-fillet': 10 })
    expect(madeRecipeV4('jewel-planet-3')).toEqual({ 'cut-emerald': 10 })
    expect(madeRecipeV4('jewel-moon-5')).toEqual({ 'cut-philosophers-stone': 4 })
    expect(madeRecipeV4('branch-gem')).toEqual({ 'cobalt-ingot': 7 })
    expect(() => madeRecipeV4('copper-ore')).toThrow(RangeError)
    const want = { 'weapon-gem': ['metal', 7], 'tome-ink': ['vegetables', 7], 'armor-fittings': ['wood', 2], 'accessory-setting': ['fish', 10],
      'jewel-planet': ['stone', 10], 'jewel-moon': ['stone', 4], 'branch-gem': ['metal', 7] } as const
    for (const m of MADE_IDENTITIES) {
      const [[id, qty]] = Object.entries(madeRecipeV4(m.id)) as [[string, number]]
      expect(lineItem(id), m.id).toMatchObject({ line: want[m.line][0], grade: m.grade, refined: true })
      expect(qty, m.id).toBe(want[m.line][1])
      expect(madeRefinedV4(m.id)).toBe(qty)
    }
  })

  it('makes an Arms Gem G1 from 7 Copper Ingot at one step each: 252 minutes at Craft Lv 1', () => {
    expect(makeMinutesV4(1, 7)).toBe(252)
    expect(makeMinutesV4(50, 7)).toBe(168)
    const gem = first(plan(worldOf({ 101: 1 }), 'weapon-forge', 'craft', 'weapon-gem-g1', { count: 10 }))
    expect(gem).toEqual({ seconds: seconds(252), inputs: [{ item: 'copper-ingot', qty: 7 }], output: { item: 'weapon-gem-g1' }, exp: jobExp(252) })
    expect(plan(worldOf({ 101: 1 }), 'weapon-forge', 'craft', 'weapon-gem-g1', { count: 10 })).toHaveLength(10)
    expect(why(plan(worldOf({ 101: 50 }), 'weapon-forge', 'craft', 'tome-ink-g1'))).toBe(NOT_HERE)
    expect(why(plan(worldOf({ 101: 50 }), 'weapon-forge', 'craft', 'branch-gem', { tier: 2 }))).toBe(NOT_HERE)
  })

  it('makes Tome Ink at its Forge, Settings at the Charm Forge, Fittings at the Armorer and jewels at the Lapidary', () => {
    expect(first(plan(worldOf({ 101: 1 }), 'tome-forge', 'craft', 'tome-ink-g1')).inputs).toEqual([{ item: 'chopped-carrot', qty: 7 }])
    expect(first(plan(worldOf({ 101: 16 }), 'charm-forge', 'craft', 'accessory-setting-g4')).seconds).toBe(seconds(makeMinutesV4(16, 10)))
    expect(first(plan(worldOf({ 101: 1 }), 'armorer', 'craft', 'armor-fittings-g1')).seconds).toBe(seconds(72))
    expect(why(plan(worldOf({ 101: 20 }), 'lapidary', 'cut', 'jewel-planet-3'))).toBe('Needs Craft Lv21')
    expect(first(plan(worldOf({ 101: 21 }), 'lapidary', 'cut', 'jewel-planet-3')).inputs).toEqual([{ item: 'cut-emerald', qty: 10 }])
    expect(why(plan(worldOf({ 101: 50 }), 'lapidary', 'craft', 'jewel-planet-3'))).toBe(NOT_HERE)
    expect(why(plan(worldOf({ 101: 50 }), 'tome-forge', 'craft', 'weapon-gem-g1'))).toBe(NOT_HERE)
  })

  it('names the Weapon Gem Arms Gem and the new line Tome Ink (FL14)', () => {
    expect([gradeItem('weapon-gem', 3), gradeItem('tome-ink', 3), 'armor-fittings-g3', jewelId('planet', 2)].map(madeNameV4))
      .toEqual(['Arms Gem G3', 'Tome Ink G3', 'Armor Fittings G3', 'Planet Jewel II'])
  })
})

describe('the trade gate (PP15, PP16), unchanged', () => {
  const context = { tradeOf: tradesOf({ 101: 'cleric', 102: 'brawler', 103: 'mage' }) }
  const world = worldOf({ 101: 50, 102: 50, 103: 50 })

  it('keeps each Uma to her trade\'s three places, the open shop as R2\'s', () => {
    expect(why(plan(world, 'tome-forge', 'craft', 'tome-ink-g1', { context }))).toBeNull()
    expect(why(plan(world, 'fields-workbench', 'refine', 'chopped-carrot', { context }))).toBeNull()
    expect(why(plan(world, 'tome-forge', 'craft', 'tome-ink-g1', { context, who: '102' }))).toBe('Another trade')
    expect(why(plan(world, 'mine-workbench', 'refine', 'copper-ingot', { context, who: '102' }))).toBeNull()
    expect(why(plan(world, 'mine-workbench', 'refine', 'copper-ingot', { context }))).toBe('Another trade')
    // No Summoner in this world: all three Fish places are open shops.
    expect(why(plan(world, 'fishery-workbench', 'refine', 'carp-fillet', { context, who: '102' }))).toBeNull()
  })
})
