// Save v31's strict work parse (H114): fifteen places, four slots, and exactly one job kind at each place.
import { describe, expect, it } from 'vitest'
import { HOUR, JOB_SIZES, jobSizes, MINUTE, stepMinutes } from '../economy/pacing'
import { PLACE_SPEED_V3 } from '../economy/professions'
import { gradedUma, gradedWorld } from './economy-v3.fixture'
import { parseSave, SAVE_SCHEMA_VERSION, type Save } from './save'
import { startJob } from './work'

const NOW = '2026-10-27T12:00:00.000Z'
const json = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T
const base = (): Save => ({
  schemaVersion: SAVE_SCHEMA_VERSION,
  account: { trainerName: 'Tester', createdAt: NOW, updatedAt: NOW, achievements: {}, history: {}, defeated: {} },
  // A Warrior: the fixture's Brawler is held only from Rank 10 since Classes v3 (H134), and work doesn't read her class.
  tierWorlds: { '1': gradedWorld({ items: { 'copper-ore': 4, 'copper-ingot': 7 }, umas: { '101': gradedUma({ classId: 'recruit', craft: { level: 50, exp: 0 } }) } }) },
})

interface RawSave { tierWorlds: Record<string, { work: Record<string, { slot: { building: string } }> }> }

describe('save v31 work', () => {
  it('parses a process at a workbench, a make at its forge and a gather', () => {
    for (const [place, item, kind] of [
      ['mine-workbench', 'copper-ingot', 'refine'], ['weapon-forge', 'weapon-gem-g1', 'craft'], ['mine', 'copper-ore', 'gather'],
    ] as const) {
      const parsed = parseSave(json(startJob(base(), place, 0, { outfitId: '101' }, item, 1, NOW)))
      expect(parsed.tierWorlds['1']!.work['101']!.entries[0]!.request.kind).toBe(kind)
    }
  })

  it('refuses a process at a making place and a make at a workbench', () => {
    const process = json(startJob(base(), 'mine-workbench', 0, { outfitId: '101' }, 'copper-ingot', 1, NOW)) as unknown as RawSave
    process.tierWorlds['1']!.work['101']!.slot.building = 'weapon-forge'
    expect(() => parseSave(process as unknown as Save)).toThrow('expected craft')
    const make = json(startJob(base(), 'weapon-forge', 0, { outfitId: '101' }, 'weapon-gem-g1', 1, NOW)) as unknown as RawSave
    make.tierWorlds['1']!.work['101']!.slot.building = 'mine-workbench'
    expect(() => parseSave(make as unknown as Save)).toThrow('expected refine')
  })

  it('takes the Wilds\' job sizes: a gather or a process up to ×20, about 8 hours (D233)', () => {
    expect(JOB_SIZES).toEqual([1, 2, 3, 5, 10, 15, 20])
    expect([1, 2, 4, 7, 10].map(jobSizes)).toEqual([JOB_SIZES, [1, 2, 3, 5, 10], [1, 2, 3, 5], [1, 2, 3], [1, 2]])
    // Twenty steps at Craft Lv 25 and the place's speed: about 8 hours.
    expect((20 * stepMinutes(25) * MINUTE) / PLACE_SPEED_V3 / HOUR).toBeCloseTo(8, 1)
    const gather = (count: number) => json(startJob(base(), 'mine', 0, { outfitId: '101' }, 'copper-ore', count, NOW))
    expect(parseSave(gather(20)).tierWorlds['1']!.work['101']!.entries[0]!.request.count).toBe(20)
    expect(() => startJob(base(), 'mine', 0, { outfitId: '101' }, 'copper-ore', 21, NOW)).toThrow()
    const over = gather(20) as unknown as { tierWorlds: Record<string, { work: Record<string, { entries: { request: { count: number } }[] }> }> }
    over.tierWorlds['1']!.work['101']!.entries[0]!.request.count = 21
    expect(() => parseSave(over as unknown as Save)).toThrow('expected 1–20')
  })
})
