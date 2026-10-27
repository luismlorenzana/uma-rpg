// Save v31's strict work parse (H114): fifteen places, four slots, and exactly one job kind at each place.
import { describe, expect, it } from 'vitest'
import { gradedUma, gradedWorld } from './economy-v3.fixture'
import { parseSave, SAVE_SCHEMA_VERSION, type Save } from './save'
import { startJob } from './work'

const NOW = '2026-10-27T12:00:00.000Z'
const json = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T
const base = (): Save => ({
  schemaVersion: SAVE_SCHEMA_VERSION,
  account: { trainerName: 'Tester', createdAt: NOW, updatedAt: NOW, achievements: {}, history: {}, defeated: {} },
  tierWorlds: { '1': gradedWorld({ items: { 'copper-ore': 4, 'copper-ingot': 7 }, umas: { '101': gradedUma({ craft: { level: 50, exp: 0 } }) } }) },
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
})
