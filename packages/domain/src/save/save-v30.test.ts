// Stored v30 saves migrate to v31 before the strict parser sees their old work rows (H114, FL31), and on to v32 (H134).
import { describe, expect, it } from 'vitest'
import { parseSave } from './save'
import { v30Save } from './v30.fixture'

describe('save v30 compatibility', () => {
  it('settles the old work rows and keeps the farm-by-line stock', () => {
    const parsed = parseSave(JSON.parse(JSON.stringify(v30Save())))
    expect(parsed.schemaVersion).toBe(32)
    expect(parsed.tierWorlds['1']!.work).toEqual({})
    expect(parsed.tierWorlds['1']!.items['weapon-gem-g2']).toBe(3)
    expect(parsed.tierWorlds['2']!.items).toEqual({ 'copper-ore': 4, 'gold-ingot': 3, 'gold-ore': 2, 'carp-fillet': 5 })
    expect(Object.keys(parsed.tierWorlds['3']!.items)).toHaveLength(20)
  })

  it('keeps every current stock id', () => {
    const save = v30Save()
    save.tierWorlds['1']!.items['tome-ink-g3'] = 1
    save.tierWorlds['1']!.items['mythril-ore'] = 2
    save.tierWorlds['1']!.items['trout-fillet'] = 3
    const items = parseSave(JSON.parse(JSON.stringify(save))).tierWorlds['1']!.items
    expect([items['tome-ink-g3'], items['mythril-ore'], items['trout-fillet']]).toEqual([1, 2, 3])
  })
})
