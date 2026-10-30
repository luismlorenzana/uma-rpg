// Save v31 (H114, FL31): v30 work settles without a clock before the Wilds' ten place ids become fifteen. Uncollected
// output and Craft EXP are paid, queues drop, and everything else stays. Since H134 the chain runs `toV32` after it.
import { describe, expect, it } from 'vitest'
import { migrateWorld, toV31, toV32, toV33, toV34 } from './migrations'
import { newSave, parseSave, SAVE_SCHEMA_VERSION, type TierWorld } from './save'
import { v30Save, v30World } from './v30.fixture'

type Raw = Record<string, unknown>
const raw = (world: TierWorld): Raw => JSON.parse(JSON.stringify(world)) as Raw

describe('toV31 (D230, FL31)', () => {
  it('settles started output and EXP, drops the queue, and changes nothing else', () => {
    const before = v30World()
    const after = toV31(raw(before)) as unknown as TierWorld
    expect(after.work).toEqual({})
    expect(after.items['copper-ingot']).toBe((before.items['copper-ingot'] ?? 0) + 1)
    expect(after.items['tome-ink-g1']).toBe((before.items['tome-ink-g1'] ?? 0) + 1)
    expect(after.items['iron-ingot']).toBe(before.items['iron-ingot'])
    expect(after.umas['201']!.craft).not.toEqual(before.umas['201']!.craft)
    expect(after.umas['202']!.craft).not.toEqual(before.umas['202']!.craft)
    for (const key of ['wallet', 'parties', 'world', 'targets', 'heroes', 'rift', 'grant'] as const) expect(after[key]).toEqual(before[key])
  })

  it('is chained once after v30, with toV32 after it', () => {
    const before = raw(v30World())
    const expected = toV34(toV33(toV32(toV31(raw(v30World())))))
    expect(migrateWorld(before, 30)).toEqual(expected)
    const v31 = toV31(raw(v30World()))
    expect(migrateWorld(v31, 31)).toEqual(expected)
    const v32 = toV32(toV31(raw(v30World())))
    expect(migrateWorld(v32, 34)).toBe(v32)
  })

  it('parses a stored v30 save through v31 to v34 and starts new saves at v34', () => {
    const parsed = parseSave(JSON.parse(JSON.stringify(v30Save())))
    expect(parsed.schemaVersion).toBe(34)
    expect(Object.values(parsed.tierWorlds).every((world) => Object.keys(world.work).length === 0)).toBe(true)
    expect(SAVE_SCHEMA_VERSION).toBe(34)
    const fresh = newSave('Today', '2026-10-27T12:00:00.000Z')
    expect(fresh.schemaVersion).toBe(34)
    expect(parseSave(JSON.parse(JSON.stringify(fresh)))).toEqual(fresh)
  })
})
