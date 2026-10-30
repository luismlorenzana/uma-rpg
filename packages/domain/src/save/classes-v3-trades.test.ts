// Save v32's trade step (H130; classes-v3.md §8.4, CV20, CV28), live since H134: after the reset, an Uma whose trade the
// new calling moves has her running work finished into the Warehouse with its Craft EXP and her queue dropped; one whose
// trade stays keeps working. Made-up outfits only, never master data.
import { describe, expect, it } from 'vitest'
import { grantProfessionExp } from '../economy/pacing'
import type { CallingOutfit } from '../roster/template'
import { settleClassesV3Trades } from './classes-v3'
import { toV32 } from './migrations'
import { newSave, parseSave, umaPick, type Save } from './save'
import { UMA, v31Save } from './v31.fixture'

const NOW = '2026-10-29T12:00:00.000Z'
type Grade = 'A' | 'B'
const outfit = (outfitId: string, styles: Partial<Record<'front' | 'pace' | 'late' | 'end', Grade>>, power: number, wit: number): CallingOutfit & { outfitId: string } => ({
  outfitId, baseStats: { power, wit },
  aptitudes: { strategy: { front: 'B', pace: 'B', late: 'B', end: 'B', ...styles }, distance: { sprint: 'B', mile: 'B', medium: 'A', long: 'B' } },
})
// B: Pace A, Late A, Power 96 > Wit 88, Medium; her v31 pick the Spell Blade (Wood), her Tier 0 the Mage (Stone).
const B = outfit(UMA.B, { pace: 'A', late: 'A' }, 96, 88)
// D: Pace A, Wit ≥ Power; v31's Mage (Stone), her Tier 0 the Spellblade (Wood).
const D = outfit(UMA.D, { pace: 'A' }, 90, 100)
// F: Front A; the Brawler and the Warrior, both Metal.
const F = outfit(UMA.F, { front: 'A' }, 110, 90)

/** The v31 save through `toV32` and v32's parse (labelled 32, so the chain doesn't run again). */
const reset = (): Save => {
  const save = JSON.parse(JSON.stringify(v31Save())) as { tierWorlds: Record<string, Record<string, unknown>> }
  return parseSave({ ...save, schemaVersion: 32, tierWorlds: Object.fromEntries(Object.entries(save.tierWorlds).map(([k, w]) => [k, toV32(w, Number(k))])) })
}

describe('settleClassesV3Trades (CV28)', () => {
  it('moves B from Wood to Stone: her Forest job\'s outputs and Craft EXP land, her queue drops, her row goes', () => {
    const before = reset()
    const was = before.tierWorlds['1']!
    const row = was.work[UMA.B]!
    expect(row.queue).toHaveLength(1)
    const after = settleClassesV3Trades(before, [B, D, F], NOW)
    const world = after.tierWorlds['1']!
    expect(world.work[UMA.B]).toBeUndefined()
    // Two of her three Pine Logs were still to collect, 30 Craft EXP each.
    expect(world.items['pine-log']).toBe((was.items['pine-log'] ?? 0) + 2)
    expect(world.umas[UMA.B]!.craft).toEqual(grantProfessionExp(was.umas[UMA.B]!.craft, 60))
    expect(world.classesV3!.umas[UMA.B]!.trade).toEqual({ from: 'physical-hybrid', to: 'magical' })
    expect(after.account.updatedAt).toBe(NOW)
    expect(parseSave(JSON.parse(JSON.stringify(after)))).toEqual(after)
  })

  it('moves D from Stone to Wood with no work to settle, and leaves F at work in the Mine', () => {
    const before = reset()
    const world = settleClassesV3Trades(before, [B, D, F], NOW).tierWorlds['1']!
    expect(world.classesV3!.umas[UMA.D]!.trade).toEqual({ from: 'magical', to: 'physical-hybrid' })
    expect(world.umas[UMA.D]).toEqual(before.tierWorlds['1']!.umas[UMA.D])
    expect(world.classesV3!.umas[UMA.F]!.trade).toBeUndefined()
    expect(world.work[UMA.F]).toEqual(before.tierWorlds['1']!.work[UMA.F])
    expect(world.umas[UMA.F]).toEqual(before.tierWorlds['1']!.umas[UMA.F])
  })

  it('runs once: every world with a record is traded, and a second run changes nothing', () => {
    const once = settleClassesV3Trades(reset(), [B, D, F], NOW)
    expect([once.tierWorlds['1']!.classesV3!.traded, once.tierWorlds['2']!.classesV3!.traded]).toEqual([true, true])
    expect(settleClassesV3Trades(once, [B, D, F], '2026-10-30T12:00:00.000Z')).toBe(once)
  })

  it('leaves an Uma whose outfit is missing untouched, and a world with no record', () => {
    const before = reset()
    const world = settleClassesV3Trades(before, [D, F], NOW).tierWorlds['1']!
    expect(world.work[UMA.B]).toEqual(before.tierWorlds['1']!.work[UMA.B])
    expect(world.classesV3!.umas[UMA.B]).toEqual(before.tierWorlds['1']!.classesV3!.umas[UMA.B])
    expect(world.classesV3!.traded).toBe(true)
    const fresh = newSave('Luis', NOW)
    expect(settleClassesV3Trades(fresh, [B, D, F], NOW)).toBe(fresh)
  })

  it('leaves every pick null after the reset (umaPick; D220\'s calling repair retired with the pick, H134)', () => {
    const save = reset()
    expect(Object.values(save.tierWorlds['1']!.umas).map(umaPick).every((p) => p === null)).toBe(true)
    expect(umaPick({ calling: { pick: 'mage', confirmed: true } })).toBe('mage')
  })
})
