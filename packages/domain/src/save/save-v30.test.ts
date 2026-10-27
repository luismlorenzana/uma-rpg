// Save v30's parse (H110, live since H112; farm-by-line.md FL2, FL5, FL8): a migrated world reads, a making place's work
// holds a process or a make of its own line, and the Warehouse holds the same fifty types in every world.
import { describe, expect, it } from 'vitest'
import { toV30 } from './migrations'
import { parseSave, SAVE_SCHEMA_VERSION, type Save } from './save'
import { gradedUma, gradedWorld } from './economy-v3.fixture'
import { V29_T0, v29Save } from './v29.fixture'
import { startJob } from './work'

type Raw = Record<string, unknown>
const json = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T

/** The fixture's save migrated and labelled v30. */
function v30Save(): Save {
  const save = json(v29Save())
  const tierWorlds = Object.fromEntries(Object.entries(save.tierWorlds).map(([tier, world]) => [tier, toV30(world as unknown as Raw)]))
  return { ...save, schemaVersion: SAVE_SCHEMA_VERSION, tierWorlds } as unknown as Save
}
/** A v30 save with one job started on the farm by line's rules. */
function withJob(place: string, item: string, stock: Record<string, number>): Save {
  const save: Save = { ...v30Save(), tierWorlds: { '1': gradedWorld({ items: stock, umas: { '101': gradedUma({ craft: { level: 50, exp: 0 } }) } }) } }
  return json(startJob(save, place, 0, { outfitId: '101' }, item, 1, V29_T0))
}

describe('save v30\'s parse', () => {
  it('reads the migrated save: settled, converted, every world', () => {
    const parsed = parseSave(v30Save())
    expect(parsed.schemaVersion).toBe(30)
    expect(parsed.tierWorlds['1']!.work).toEqual({})
    expect(parsed.tierWorlds['1']!.items['weapon-gem-g2']).toBe(3)
    expect(parsed.tierWorlds['2']!.items).toEqual({ 'copper-ore': 4, 'gold-ingot': 3, 'gold-ore': 2, 'carp-fillet': 5 })
    expect(Object.keys(parsed.tierWorlds['3']!.items)).toHaveLength(20)
  })

  it('reads a process and a make at a making place, a gather at a gathering place', () => {
    const process = withJob('forge', 'copper-ingot', { 'copper-ore': 1 })
    expect(parseSave(process).tierWorlds['1']!.work['101']!.entries[0]!.request).toEqual({ kind: 'refine', item: 'copper-ingot', count: 1 })
    const make = withJob('workbench', 'tome-ink-g1', { 'chopped-carrot': 7 })
    expect(parseSave(make).tierWorlds['1']!.work['101']!.entries[0]!.request).toEqual({ kind: 'craft', item: 'tome-ink-g1', count: 1 })
    expect(parseSave(withJob('fishery', 'trout', {})).tierWorlds['1']!.work['101']!.entries[0]!.request.kind).toBe('gather')
    expect(parseSave(withJob('lapidary', 'jewel-moon-1', { 'cut-amethyst': 4 })).tierWorlds['1']!.work['101']!.entries[0]!.request.kind).toBe('cut')
  })

  it('refuses another line\'s process, a kind the place doesn\'t take and a count past its batch', () => {
    const other = withJob('forge', 'copper-ingot', { 'copper-ore': 1 }) as unknown as { tierWorlds: Record<string, { work: Record<string, { entries: Raw[] }> }> }
    const entry = other.tierWorlds['1']!.work['101']!.entries[0]! as { request: Raw; outputs: Raw[] }
    entry.request.item = 'pine-plank'
    entry.outputs[0]!.item = 'pine-plank'
    expect(() => parseSave(other as unknown as Save)).toThrow('not made at this place')
    const craft = withJob('mine', 'copper-ore', {}) as unknown as { tierWorlds: Record<string, { work: Record<string, { entries: { request: Raw }[] }> }> }
    craft.tierWorlds['1']!.work['101']!.entries[0]!.request.kind = 'craft'
    expect(() => parseSave(craft as unknown as Save)).toThrow('expected gather')
    const big = withJob('forge', 'weapon-gem-g1', { 'copper-ingot': 7 }) as unknown as { tierWorlds: Record<string, { work: Record<string, { entries: { request: Raw }[] }> }> }
    big.tierWorlds['1']!.work['101']!.entries[0]!.request.count = 11
    expect(() => parseSave(big as unknown as Save)).toThrow()
  })

  it('holds Tome Ink and every grade in every world, R2\'s tiers gone (FL8)', () => {
    const save = v30Save()
    ;(save.tierWorlds['1']!.items as Record<string, number>)['tome-ink-g3'] = 1
    ;(save.tierWorlds['1']!.items as Record<string, number>)['mythril-ore'] = 2
    ;(save.tierWorlds['1']!.items as Record<string, number>)['trout-fillet'] = 3
    const items = parseSave(json(save)).tierWorlds['1']!.items
    expect([items['tome-ink-g3'], items['mythril-ore'], items['trout-fillet']]).toEqual([1, 2, 3])
  })
})
