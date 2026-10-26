// R2's job kinds and trade gate (H77; profession-progression.md §4.3, §5, PP12, PP13, PP16), on engine v17 (live
// since H82): gathering, processing and making by the world's tier, the gates, the times and the open shop.
import { isRefusal, kindRules, type PlannedItem, type Refusal, type WorkEnv } from '@luismlorenzana/uma-work'
import { describe, expect, it } from 'vitest'
import { itemMinutes, jobExp, refineMinutes } from '../economy/pacing'
import { tradeOfCalling, type TradeOf } from '../economy/professions'
import type { RpgClass } from '../rpg/kinds'
import { ECONOMY_V3_NOW, gradedUma, gradedWorld } from '../save/economy-v3.fixture'
import type { TierWorld } from '../save/save'
import { refusalText } from '../save/work'
import { RPG_WORK_ENV } from './env'
import { liveWorkEnv, openShop, RPG_BUILDINGS_V3, rpgWorkEnv, type WorkContext } from './env-v3'


const SPEED = 1.25
/** A world of Umas by outfit id, each at a Craft Level, with these items. */
function worldOf(umas: Record<string, number>, items: Record<string, number> = {}): TierWorld {
  return gradedWorld({ items, umas: Object.fromEntries(Object.entries(umas).map(([id, level]) => [id, gradedUma({ craft: { level, exp: 0 } })])) })
}
/** A trade resolver over invented callings, by outfit id. */
const tradesOf = (callings: Record<string, RpgClass>): TradeOf => (id) => (callings[id] ? tradeOfCalling(callings[id]!) : null)

function plan(world: TierWorld, place: string, kind: string, item: string, opts: { tier?: number; count?: number; who?: string; context?: WorkContext } = {}):
  readonly PlannedItem[] | Refusal {
  const env: WorkEnv<TierWorld> = rpgWorkEnv(opts.tier ?? 1, opts.context)
  return kindRules(env, kind)!.plan(world, opts.who ?? '101', { kind: kind as never, item, count: opts.count ?? 1 }, 0,
    { slot: { building: place, slot: 0 }, speed: SPEED, earlier: [], env })
}
const why = (result: readonly PlannedItem[] | Refusal): string | null => (isRefusal(result) ? refusalText(result, 0) : null)
const first = (result: readonly PlannedItem[] | Refusal): PlannedItem => {
  if (isRefusal(result)) throw new Error(refusalText(result, 0))
  return result[0]!
}
const GATHER = itemMinutes(1)

describe('R2\'s env (PP4)', () => {
  it('is the live env from v17: ten places of four slots at ×1.25, nothing to upgrade', () => {
    const env = liveWorkEnv(1)
    expect(env).not.toBe(RPG_WORK_ENV)
    expect(env.buildings).toBe(RPG_BUILDINGS_V3)
    expect(RPG_BUILDINGS_V3.ids).toEqual(['mine', 'forge', 'forest', 'armorer', 'fields', 'workbench', 'fishery', 'charm-shop', 'monster-den', 'lapidary'])
    for (const id of RPG_BUILDINGS_V3.ids) {
      expect([RPG_BUILDINGS_V3.slots(id, 1), RPG_BUILDINGS_V3.speed(id, 1), RPG_BUILDINGS_V3.maxLevel(id)]).toEqual([4, 1.25, 1])
    }
    expect(env.tickets).toBe(RPG_WORK_ENV.tickets)
    expect(env.exp).toBe(RPG_WORK_ENV.exp)
  })
})

describe('gathering (PP7, PP12, PP13)', () => {
  it('gathers Copper Ore at the Mine at Craft Lv 1 in 2,592 seconds an item for 108 Craft EXP', () => {
    const items = plan(worldOf({ 101: 1 }), 'mine', 'gather', 'copper-ore', { count: 3 })
    expect(items).toHaveLength(3)
    expect(first(items)).toEqual({ seconds: 2592, inputs: [], output: { item: 'copper-ore' }, exp: 108 })
    expect(jobExp(GATHER)).toBe(108)
  })

  it('opens Iron Ore at Craft Lv 26 and refuses what isn\'t the place\'s line', () => {
    expect(why(plan(worldOf({ 101: 25 }), 'mine', 'gather', 'iron-ore'))).toBe('Needs Craft Lv26')
    expect(first(plan(worldOf({ 101: 26 }), 'mine', 'gather', 'iron-ore')).seconds).toBe(Math.round((itemMinutes(26) * 60) / SPEED))
    expect(why(plan(worldOf({ 101: 50 }), 'mine', 'gather', 'carrot'))).toBe("That isn't made here.")
    expect(why(plan(worldOf({ 101: 50 }), 'mine', 'gather', 'copper-ingot'))).toBe("That isn't made here.")
    expect(why(plan(worldOf({ 101: 50 }), 'mine', 'gather', 'tin-ore'))).toBe("That isn't made here.")
    expect(first(plan(worldOf({ 101: 1 }), 'fields', 'gather', 'carrot')).output).toEqual({ item: 'carrot' })
    expect(first(plan(worldOf({ 101: 1 }), 'monster-den', 'gather', 'quartz')).output).toEqual({ item: 'quartz' })
  })

  it('gathers a later tier\'s pair only in a world of that tier or above', () => {
    expect(why(plan(worldOf({ 101: 1 }), 'mine', 'gather', 'gold-ore', { tier: 1 }))).toBe("That isn't made here.")
    expect(first(plan(worldOf({ 101: 1 }), 'mine', 'gather', 'gold-ore', { tier: 2 })).output).toEqual({ item: 'gold-ore' })
    expect(why(plan(worldOf({ 101: 1 }), 'mine', 'gather', 'mythril-ore', { tier: 2 }))).toBe("That isn't made here.")
    expect(why(plan(worldOf({ 101: 25 }), 'mine', 'gather', 'orichalcum-ore', { tier: 3 }))).toBe('Needs Craft Lv26')
  })
})

describe('processing (PP12)', () => {
  it('processes one raw item into its refined form at the Workbench, a quarter of a gather, up to ×40', () => {
    const items = plan(worldOf({ 101: 1 }), 'workbench', 'refine', 'copper-ingot', { count: 40 })
    expect(items).toHaveLength(40)
    expect(first(items)).toEqual({ seconds: Math.round((refineMinutes(1) * 60) / SPEED), inputs: [{ item: 'copper-ore', qty: 1 }],
      output: { item: 'copper-ingot' }, exp: jobExp(refineMinutes(1)) })
    expect(rpgWorkEnv(1).kinds.refine!.maxItems).toBe(40)
    expect(why(plan(worldOf({ 101: 1 }), 'workbench', 'refine', 'shredded-cabbage'))).toBe('Needs Craft Lv26')
    expect(why(plan(worldOf({ 101: 50 }), 'workbench', 'refine', 'carrot'))).toBe("That isn't made here.")
    expect(why(plan(worldOf({ 101: 50 }), 'workbench', 'refine', 'gold-ingot'))).toBe("That isn't made here.")
    expect(first(plan(worldOf({ 101: 50 }), 'workbench', 'refine', 'gold-ingot', { tier: 2 })).inputs).toEqual([{ item: 'gold-ore', qty: 1 }])
  })
})

describe('making (PP10, PP12, PP13)', () => {
  it('plans a Weapon Gem G3 at the Forge from 2 Copper Ingot and 2 Pine Plank in four gathers\' time, and no Branch Gem', () => {
    const gem = first(plan(worldOf({ 101: 11 }), 'forge', 'craft', 'weapon-gem-g3'))
    expect(gem).toEqual({ seconds: Math.round((4 * itemMinutes(11) * 60) / SPEED), inputs: [{ item: 'copper-ingot', qty: 2 }, { item: 'pine-plank', qty: 2 }],
      output: { item: 'weapon-gem-g3' }, exp: jobExp(4 * itemMinutes(11)) })
    expect(why(plan(worldOf({ 101: 10 }), 'forge', 'craft', 'weapon-gem-g3'))).toBe('Needs Craft Lv11')
    expect(why(plan(worldOf({ 101: 50 }), 'forge', 'craft', 'branch-gem', { tier: 2 }))).toBe("That isn't made here.")
    expect(why(plan(worldOf({ 101: 50 }), 'forge', 'craft', 'armor-fittings-g1'))).toBe("That isn't made here.")
    expect(why(plan(worldOf({ 101: 50 }), 'forge', 'cut', 'weapon-gem-g1'))).toBe("That isn't made here.")
  })

  it('makes an Accessory Setting G7 at the Charm Shop from 6 Shredded Cabbage and 6 Sardine Fillet in twelve gathers\' time', () => {
    const setting = first(plan(worldOf({ 101: 31 }), 'charm-shop', 'craft', 'accessory-setting-g7'))
    expect(setting.inputs).toEqual([{ item: 'shredded-cabbage', qty: 6 }, { item: 'sardine-fillet', qty: 6 }])
    expect(setting.seconds).toBe(Math.round((12 * itemMinutes(31) * 60) / SPEED))
    expect(setting.exp).toBe(jobExp(12 * itemMinutes(31)))
  })

  it('cuts Armor Fittings at the Armorer and jewels at the Lapidary by the world\'s ladder', () => {
    expect(first(plan(worldOf({ 101: 46 }), 'armorer', 'craft', 'armor-fittings-g10', { tier: 2 })).inputs)
      .toEqual([{ item: 'titanium-ingot', qty: 1 }, { item: 'ebony-plank', qty: 1 }, { item: 'cut-diamond', qty: 1 }])
    const moon = first(plan(worldOf({ 101: 46 }), 'lapidary', 'cut', 'jewel-moon-5', { tier: 2 }))
    expect(moon.inputs).toEqual([{ item: 'cut-diamond', qty: 3 }, { item: 'titanium-ingot', qty: 1 }])
    expect(moon.seconds).toBe(Math.round((4 * itemMinutes(46) * 60) / SPEED))
    expect(why(plan(worldOf({ 101: 45 }), 'lapidary', 'cut', 'jewel-moon-5', { tier: 2 }))).toBe('Needs Craft Lv46')
    expect(why(plan(worldOf({ 101: 4 }), 'lapidary', 'cut', 'jewel-planet-2'))).toBe('Needs Craft Lv11')
    expect(first(plan(worldOf({ 101: 1 }), 'lapidary', 'cut', 'jewel-planet-1')).inputs.map((q) => q.qty)).toEqual([3, 3, 3, 3])
  })

  it('pays made items into the Warehouse with the materials', () => {
    const world = worldOf({ 101: 1 }, { 'carp-fillet': 2 })
    const paid = rpgWorkEnv(1).kinds.craft!.pay(world, '101', [{ item: 'weapon-gem-g1' }, { item: 'weapon-gem-g1' }],
      { now: Date.parse(ECONOMY_V3_NOW), env: rpgWorkEnv(1) })
    expect(paid.state.items).toEqual({ 'carp-fillet': 2, 'weapon-gem-g1': 2 })
    expect(paid.state.gear).toEqual(world.gear)
    expect(paid.state.gems).toEqual(world.gems)
  })
})

describe('the trade gate and the open shop (PP2, PP16)', () => {
  // 101 a Mage (Monster Den · Lapidary), 102 a Brawler (Mine · Forge), 103 a Cleric (Fields · Workbench).
  const world = worldOf({ 101: 50, 102: 50, 103: 50 })
  const context = { tradeOf: tradesOf({ 101: 'mage', 102: 'brawler', 103: 'cleric' }) }

  it('keeps a Mage to her trade\'s two places', () => {
    expect(why(plan(world, 'mine', 'gather', 'copper-ore', { context }))).toBe('Another trade')
    expect(why(plan(world, 'forge', 'craft', 'weapon-gem-g1', { context }))).toBe('Another trade')
    expect(why(plan(world, 'workbench', 'refine', 'cut-quartz', { context }))).toBe('Another trade')
    expect(why(plan(world, 'monster-den', 'gather', 'quartz', { context }))).toBeNull()
    expect(why(plan(world, 'lapidary', 'cut', 'jewel-moon-1', { context }))).toBeNull()
    expect(why(plan(world, 'mine', 'gather', 'copper-ore', { context, who: '102' }))).toBeNull()
    // Not here comes first: the gate only judges this place's own work.
    expect(why(plan(world, 'mine', 'gather', 'carrot', { context }))).toBe("That isn't made here.")
  })

  it('opens a trade\'s two places to everyone while the world has no Uma of it', () => {
    // No Summoner here: the Fishery and the Charm Shop are open shops.
    expect(openShop(world, 'fishery', context.tradeOf)).toBe(true)
    expect(openShop(world, 'charm-shop', context.tradeOf)).toBe(true)
    expect(openShop(world, 'mine', context.tradeOf)).toBe(false)
    expect(why(plan(world, 'fishery', 'gather', 'carp', { context }))).toBeNull()
    expect(why(plan(world, 'charm-shop', 'craft', 'accessory-setting-g1', { context }))).toBeNull()
    // Without its Brawler, the Mine and the Forge take the Mage.
    const noBrawler = worldOf({ 101: 50, 103: 50 })
    expect(openShop(noBrawler, 'mine', context.tradeOf)).toBe(true)
    expect(why(plan(noBrawler, 'mine', 'gather', 'copper-ore', { context }))).toBeNull()
    expect(why(plan(noBrawler, 'forge', 'craft', 'weapon-gem-g1', { context }))).toBeNull()
    expect(why(plan(noBrawler, 'workbench', 'refine', 'cut-quartz', { context }))).toBe('Another trade')
  })

  it('stays open when the caller can\'t say her trade', () => {
    for (const [place, kind, item] of [['mine', 'gather', 'copper-ore'], ['forge', 'craft', 'weapon-gem-g1'], ['workbench', 'refine', 'cut-quartz']]) {
      expect(why(plan(world, place!, kind!, item!)), place).toBeNull()
      expect(why(plan(world, place!, kind!, item!, { context: { tradeOf: () => null } })), place).toBeNull()
    }
  })
})
