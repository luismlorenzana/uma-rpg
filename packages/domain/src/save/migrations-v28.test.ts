// Save v28's migration (H78; profession-progression.md §14.4, §14.7, PP19–PP20; WP27, EP21; R2's build decisions 4–9):
// `toV28` on the rich v27 save and on small worlds, unmocked, so today's live game parses beside it. It isn't chained yet
// (H82 does both), and `migrateWorld` hands each world its tier.
import { describe, expect, it, vi } from 'vitest'
import { ITEM_IDENTITIES } from '../items/identity'
import { migrateWorld, toV28, type TierGrant } from './migrations'
import { newSave, parseSave, SAVE_SCHEMA_VERSION } from './save'
import { facilitiesAt, richV27Save, v27Entry, v27Row, v27Uma, v27World } from './v28.fixture'
import { v26Save } from './v27.fixture'

vi.mock('./migrations', async (orig) => {
  const m = await orig<typeof import('./migrations')>()
  return { ...m, migrateWorld: vi.fn(m.migrateWorld) }
})

type Raw = Record<string, unknown>
type World = Raw & { umas: Record<string, Raw>; items: Record<string, number>; wallet: Record<string, number>; grant: TierGrant | null }
const richWorld = (): Raw => richV27Save().tierWorlds['1'] as Raw
const v28 = (world: Raw, tier = 1): World => toV28(world, tier) as World

describe('toV28 (D214): R2\'s economy and the compensation, dark until H82', () => {
  it('isn\'t chained yet: the save stays v27 and migrateWorld stops at it', () => {
    expect(SAVE_SCHEMA_VERSION).toBe(27)
    const raw = richWorld()
    expect(migrateWorld(raw, 27)).toBe(raw)
  })

  it('the rich v27 save is a real one: it parses today, as v27', () => {
    const save = parseSave(richV27Save())
    expect(save.tierWorlds['1']!.work['101']!.entries).toHaveLength(1)
    expect(save.tierWorlds['1']!.gems).toEqual({ 'gem-hp-1': 2, 'gem-sun-4': 1 })
  })

  it('settles work first: a gather\'s items reach the stock, a craft\'s pieces and a cut\'s gems count as deleted, each item\'s EXP reaches her tickets, a queue leaves no trace', () => {
    const world = v27World({ 1: v27Uma({ level: 10, exp: 0 }), 2: v27Uma({ level: 1, exp: 0 }), 3: v27Uma({ level: 1, exp: 0 }) }, {
      buildings: {},
      work: {
        1: v27Row('1', 'mine', 0, [v27Entry('gather', 'copper-ore', 3, 40, 1)], [{ kind: 'gather', item: 'tin-ore', count: 5 }]),
        2: v27Row('2', 'forge', 0, [v27Entry('craft', 'greatsword-g1', 2, 120)]),
        3: v27Row('3', 'lapidary', 0, [v27Entry('cut', 'gem-hp-1', 1, 60)]),
      },
    })
    const after = v28(world)
    // Two of three gathers were still to hand over: Copper Ore (legacy, Ores G1) is v3's Copper Ore.
    expect(after.items).toEqual({ 'copper-ore': 2 })
    expect(after.work).toEqual({})
    expect(after.grant!.deleted).toEqual({ gear: 2, gems: 1, upgrades: 0 })
    // Her bank after the settle: Lv 10 (13,500 + 80), the crafter 240, the cutter 60.
    expect(after.grant!.umas).toEqual({
      1: { level: 10, exp: 80, tickets: Math.ceil((1425 * 9 + 7.5 * 90 + 80) / 60) }, 2: { level: 1, exp: 240, tickets: 4 }, 3: { level: 1, exp: 60, tickets: 1 },
    })
    // The settled pieces and gem join the floor as if they had been in stock.
    const stocked = v28(v27World({}, { gear: { 'greatsword-g1': 2 }, gems: { 'gem-hp-1': 1 } }))
    expect(after.grant!.floor).toBe(stocked.grant!.floor)
  })

  it('converts the stock one for one by family and band (§14.7), raw to raw and refined to refined, collisions summed', () => {
    const pairs: Readonly<Record<string, readonly [string, string, string, string]>> = {
      ores: ['copper-ore', 'copper-ingot', 'iron-ore', 'iron-ingot'], stones: ['copper-ore', 'copper-ingot', 'iron-ore', 'iron-ingot'],
      woods: ['pine-log', 'pine-plank', 'cedar-log', 'cedar-plank'], fibers: ['carrot', 'chopped-carrot', 'cabbage', 'shredded-cabbage'],
      essences: ['carp', 'carp-fillet', 'sardine', 'sardine-fillet'], 'bones-horns': ['carp', 'carp-fillet', 'sardine', 'sardine-fillet'],
      crystals: ['quartz', 'cut-quartz', 'citrine', 'cut-citrine'], 'hides-scales': ['quartz', 'cut-quartz', 'citrine', 'cut-citrine'],
    }
    for (const family of ITEM_IDENTITIES) {
      const [lowRaw, lowRefined, highRaw, highRefined] = pairs[family.id]!
      for (let g = 1; g <= 10; g++) {
        const after = v28(v27World({}, { items: { [family.raw[g - 1]!]: 3, [family.refined[g - 1]!]: 2 } })).items
        expect(after, `${family.id} G${g}`).toEqual(g <= 5 ? { [lowRaw]: 3, [lowRefined]: 2 } : { [highRaw]: 3, [highRefined]: 2 })
      }
    }
    // Legacy Iron Ore is Ores G3 and becomes Copper Ore beside legacy Copper Ore; Gold Ore (G6) becomes Iron Ore; a
    // Limestone Block (Stones G1, refined) a Copper Ingot. An id the legacy catalog doesn't know is left for the parse.
    expect(v28(v27World({}, { items: { 'copper-ore': 5, 'iron-ore': 3, 'gold-ore': 2, 'limestone-block': 4, mystery: 1 } })).items)
      .toEqual({ 'copper-ore': 8, 'iron-ore': 2, 'copper-ingot': 4, mystery: 1 })
  })

  it('gives upgrades back before the conversion: their Laurels and refined items', () => {
    // The Mine at level 3 (Ores and Crystals): 650 Laurels, Tin Ingot and Cut Amethyst, two Cobalt Ingots and two Cut
    // Emeralds; the Workbench at level 2 (Stones and Woods): 150, a Sandstone Block and a Birch Plank.
    const after = v28(v27World({}, { buildings: { mine: { level: 3 }, workbench: { level: 2 } } }))
    expect(after.items).toEqual({ 'copper-ingot': 4, 'cut-quartz': 3, 'pine-plank': 1 })
    expect(after.wallet.laurels).toBe(800)
    expect(after.buildings).toEqual({})
    expect(after.grant).toMatchObject({ deleted: { gear: 0, gems: 0, upgrades: 3 }, back: { laurels: 800, items: 8, stock: 8 } })
    // Eleven at level 3: 7,150 Laurels and 66 items.
    expect(v28(v27World({}, { buildings: facilitiesAt(3) })).grant!.back).toEqual({ laurels: 7150, items: 66, stock: 66 })
  })

  it('reshapes each Uma: G0 grades and one slot with no family, an empty map, Class Ranks only, Craft Lv 1; the rest of her untouched', () => {
    const before = richWorld() as World
    const after = v28(before)
    for (const [id, was] of Object.entries(before.umas)) {
      const uma = after.umas[id]!
      expect(uma.gear).toEqual({ weapons: {}, armor: {}, accessories: [{ grade: 0, family: null, form: 'base' }] })
      expect(uma.stars).toEqual({ open: [], moons: [] })
      expect(uma.ranks).toEqual({ classes: (was.ranks as Raw).classes })
      expect(uma.craft).toEqual({ level: 1, exp: 0 })
      for (const key of ['unlockedAt', 'level', 'exp', 'classId', 'classes', 'bonds', 'calling']) expect(uma[key], `${id}.${key}`).toEqual(was[key])
    }
  })

  it('adds Gear Marks to Class Marks, pays the grant and the upgrades\' Laurels, and drops the gear and gem shelves', () => {
    const after = v28(richWorld())
    expect(after.wallet).toEqual({ unlockTickets: 20, shards: 0, laurels: 1800, timeTickets: 3907, sweepTickets: 0, classMarks: 50 })
    expect('gear' in after || 'gems' in after).toBe(false)
    expect(after.buildings).toEqual({})
    expect(after.work).toEqual({})
  })

  it('keeps the open world-map and Rift fights, the parties, targets and Halls byte for byte', () => {
    const before = richWorld()
    const after = v28(before)
    for (const key of ['world', 'rift', 'parties', 'targets', 'heroes', 'createdAt']) expect(JSON.stringify(after[key]), key).toBe(JSON.stringify(before[key]))
  })

  it('writes the grant as specified for the rich world, and none for a world with nothing to pay', () => {
    const after = v28(richWorld())
    const umas: TierGrant['umas'] = {
      100: { level: 50, exp: 30_000, tickets: 1970 }, 101: { level: 36, exp: 164, tickets: 992 }, 102: { level: 26, exp: 460, tickets: 683 },
      103: { level: 11, exp: 200, tickets: 255 },
    }
    for (let id = 104; id < 120; id++) umas[`${id}`] = { level: 1, exp: 0, tickets: 0 }
    expect(after.grant).toEqual({
      tickets: 3900, floor: 115, umas, deleted: { gear: 8, gems: 7, upgrades: 3 }, back: { laurels: 800, items: 8, stock: 37 }, seen: false,
    })
    expect(after.items).toEqual({
      'copper-ore': 10, 'iron-ore': 2, 'copper-ingot': 8, 'pine-log': 1, carrot: 2, 'shredded-cabbage': 1, carp: 3, 'sardine-fillet': 1,
      quartz: 2, citrine: 1, 'cut-quartz': 5, 'pine-plank': 1,
    })
    expect(v28(v27World({})).grant).toBeNull()
  })

  it('runs twice as once: a world in v28\'s shape is returned as it is', () => {
    const once = v28(richWorld())
    expect(toV28(once, 1)).toBe(once)
    expect(toV28(JSON.parse(JSON.stringify(once)), 1)).toEqual(once)
  })

  it('hands each world its tier through the chain (R3\'s v29 reads it, H87)', () => {
    const v26 = v26Save()
    const save = { ...v26, tierWorlds: { ...v26.tierWorlds, 2: v27World({}) } }
    vi.mocked(migrateWorld).mockClear()
    parseSave(save)
    expect(vi.mocked(migrateWorld).mock.calls.map(([, version, tier]) => [version, tier])).toEqual([[26, 1], [26, 2]])
    // v28 doesn't read it: a Tier 2 world migrates as a Tier 1 world does.
    expect(toV28(richWorld(), 2)).toEqual(toV28(richWorld(), 1))
  })

  it('leaves today\'s saves as they are: a new save is v27\'s and round-trips', () => {
    const save = newSave('Today', '2026-10-25T12:00:00.000Z')
    expect(save.tierWorlds['1']).toMatchObject({ gems: {}, gear: {}, wallet: { gearMarks: 0 } })
    expect('grant' in save.tierWorlds['1']!).toBe(false)
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
  })
})
