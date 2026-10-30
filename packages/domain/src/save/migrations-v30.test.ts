// Save v30's migration (H110, chained by H112; farm-by-line.md FL17–FL19): `toV30` settles work with no clock and
// converts R2's sixty types to the farm by line's G1 and G6 by the Craft Level they opened at; everything else stays.
import { describe, expect, it } from 'vitest'
import { lineItem } from '../items/lines'
import { migrateWorld, settleWork, toV30, toV31, toV32, V30_TYPES } from './migrations'
import { parseSave, SAVE_SCHEMA_VERSION, type TierWorld } from './save'
import { R2_TYPES, V29_ALL_STOCK, V29_MADE_STOCK, V29_MATERIAL_STOCK, V29_TIER2_STOCK, v29Save, v29World } from './v29.fixture'

type Raw = Record<string, unknown>
const raw = (world: TierWorld): Raw => JSON.parse(JSON.stringify(world)) as Raw
const migrated = (world: TierWorld = v29World()) => toV30(raw(world)) as unknown as TierWorld

/** What the fixture's stock becomes by FL18, before the settled jobs. */
function converted(stock: Readonly<Record<string, number>>): Record<string, number> {
  const out: Record<string, number> = {}
  for (const [id, n] of Object.entries(stock)) {
    const to = V30_TYPES.get(id) ?? id
    out[to] = (out[to] ?? 0) + n
  }
  return out
}

describe('V30_TYPES (FL18)', () => {
  it('sends each of R2\'s sixty ids to its line\'s G1 (a low type) or G6 (a high type), raw to raw, refined to refined', () => {
    expect(V30_TYPES.size).toBe(60)
    for (const m of R2_TYPES) {
      const to = lineItem(V30_TYPES.get(m.id)!)!
      expect(to, m.id).toMatchObject({ line: m.line, refined: m.refined, grade: m.band === 'low' ? 1 : 6 })
    }
    expect(['iron-ore', 'cedar-plank', 'gold-ore', 'cabbage', 'sardine-fillet', 'citrine', 'philosophers-stone'].map((id) => V30_TYPES.get(id)))
      .toEqual(['gold-ore', 'cherry-plank', 'copper-ore', 'bell-pepper', 'sea-bream-fillet', 'sapphire', 'sapphire'])
  })
})

describe('toV30 (FL17–FL19)', () => {
  it('settles every running job into the Warehouse with its Craft EXP and drops the queue', () => {
    const before = v29World()
    const after = migrated(before)
    expect(after.work).toEqual({})
    // The Workbench's six uncollected Iron Ingots (now Gold Ingot), the Forge's three Weapon Gems G2, the Fishery's five
    // Sardines (now Sea Bream); the queued two never ran.
    const want = converted({ ...V29_MATERIAL_STOCK, ...V29_MADE_STOCK })
    want['gold-ingot']! += 6
    want['weapon-gem-g2'] = 3
    want['sea-bream']! += 5
    expect(after.items).toEqual(want)
    // Each working Uma's Craft EXP grows by her uncollected items' EXP, as `settleWork` pays it.
    const settled = { ...raw(before).umas as Raw }
    settleWork(raw(before), settled, () => {})
    for (const id of ['201', '202', '203']) {
      const entry = before.work[id]!.entries[0]!
      expect(entry.exp.slice(entry.collected).reduce((a, b) => a + b, 0), id).toBeGreaterThan(0)
      expect(after.umas[id]!.craft, id).toEqual((settled[id] as TierWorld['umas'][string]).craft)
      expect(after.umas[id]!.craft, id).not.toEqual(before.umas[id]!.craft)
    }
    expect(after.umas['201']!.craft.level).toBeGreaterThanOrEqual(26)
    expect(after.umas['204']!.craft).toEqual(before.umas['204']!.craft)
  })

  it('converts all sixty ids by FL18 in a Tier 3 world, summing what lands on one id', () => {
    const S = V29_ALL_STOCK
    const items = migrated(v29Save().tierWorlds['3']!).items
    expect(items['copper-ore']).toBe(S['copper-ore']! + S['gold-ore']! + S['mythril-ore']!)
    expect(items['gold-ore']).toBe(S['iron-ore']! + S['titanium-ore']! + S['orichalcum-ore']!)
    expect(items['cut-sapphire']).toBe(S['cut-citrine']! + S['cut-diamond']! + S['cut-philosophers-stone']!)
    expect(items).toEqual(converted(S))
    // Twenty ids are left, each a line's G1 or G6, and no stock is lost.
    expect(Object.keys(items)).toHaveLength(20)
    for (const id of Object.keys(items)) expect([1, 6], id).toContain(lineItem(id)!.grade)
    const total = (r: Readonly<Record<string, number>>) => Object.values(r).reduce((a, b) => a + b, 0)
    expect(total(items)).toBe(total(S))
  })

  it('turns a Tier 1 world\'s high types into G6: Iron Ore into Gold Ore, Cabbage into Bell Pepper', () => {
    const items = migrated().items
    expect(items['gold-ore']).toBe(V29_MATERIAL_STOCK['iron-ore'])
    expect(items['bell-pepper']).toBe(V29_MATERIAL_STOCK.cabbage)
    expect(items['copper-ore']).toBe(V29_MATERIAL_STOCK['copper-ore'])
    expect(items['iron-ore']).toBeUndefined()
  })

  it('keeps made items, grades, the wallet, targets, parties and the grant', () => {
    const before = v29World()
    const after = migrated(before)
    for (const [id, n] of Object.entries(V29_MADE_STOCK)) expect(after.items[id], id).toBe(n)
    expect(after.umas['204']!.gear).toEqual(before.umas['204']!.gear)
    expect(after.wallet).toEqual(before.wallet)
    expect(after.targets).toEqual(['204'])
    expect(after.parties).toEqual(before.parties)
    expect(after.grant).toEqual(before.grant)
    expect(after.rift).toEqual(before.rift)
  })

  it('converts a Tier 2 world by the same table', () => {
    const world = v29Save().tierWorlds['2']!
    expect(migrated(world).items).toEqual({ 'copper-ore': 4, 'gold-ingot': 3, 'gold-ore': 2, 'carp-fillet': 5 })
    expect(converted(V29_TIER2_STOCK)).toEqual({ 'copper-ore': 4, 'gold-ingot': 3, 'gold-ore': 2, 'carp-fillet': 5 })
  })

  it('leaves a world whose Warehouse isn\'t an object to the strict parse', () => {
    const odd = { ...raw(v29World()), items: 'nope' }
    expect(toV30(odd)).toBe(odd)
  })
})

describe('chained (H114; through v33 since D261)', () => {
  it('runs once from v29 through v33 and leaves a v33 world untouched', () => {
    expect(SAVE_SCHEMA_VERSION).toBe(33)
    const world = raw(v29World())
    expect(migrateWorld(world, 29)).toEqual(toV32(toV31(toV30(raw(v29World())))))
    const v30 = toV30(raw(v29World()))
    expect(migrateWorld(v30, 30)).toEqual(toV32(toV31(v30)))
    const v32 = toV32(toV31(toV30(raw(v29World()))))
    expect(migrateWorld(v32, 33)).toBe(v32)
  })

  it('parses a stored v29 save to v33: settled, converted, every world', () => {
    const parsed = parseSave(JSON.parse(JSON.stringify(v29Save())))
    expect(parsed.schemaVersion).toBe(33)
    expect(parsed.tierWorlds['1']!.work).toEqual({})
    expect(parsed.tierWorlds['1']!.items['gold-ingot']).toBe(V29_MATERIAL_STOCK['iron-ingot']! + 6)
    expect(parsed.tierWorlds['2']!.items).toEqual({ 'copper-ore': 4, 'gold-ingot': 3, 'gold-ore': 2, 'carp-fillet': 5 })
    expect(Object.keys(parsed.tierWorlds['3']!.items)).toHaveLength(20)
  })
})
