// Promotion with R2's stock (H77; profession-progression.md PP23), with the switch mocked to engine v17: materials and
// made items stay in the old world's Warehouse, and she arrives in the new tier at Craft Lv 1. (H78 returns the made items
// her grades used.)
import { describe, expect, it, vi } from 'vitest'
import { ascend, signUpRift } from './rift'
import { riftWorldSave, T, TWENTY } from './rift-rules.fixture'
import { worldOf } from './rules'
import type { Save, TierWorld } from './save'

vi.mock('../rpg/battle/caps', async (orig) => (await import('../rpg/battle/caps-at.fixture')).capsAt(17, await orig()))

const edit = (save: Save, change: (w: TierWorld) => void): Save => {
  const copy: Save = JSON.parse(JSON.stringify(save))
  change(copy.tierWorlds['1']!)
  return copy
}

describe('ascending with R2\'s Warehouse (PP23)', () => {
  it('leaves materials and made items in the old world and starts her at Craft Lv 1', () => {
    const stock = { 'copper-ore': 12, 'iron-ingot': 7, 'weapon-gem-g3': 2, 'jewel-moon-1': 1, 'accessory-setting-g10': 1 }
    const save = edit(signUpRift(riftWorldSave(), TWENTY, T(1)), (w) => {
      Object.assign(w.rift.runs[0]!, { fronts: { iron: 12, arcane: 12, duel: 12, horde: 12 }, convergence: { attempts: 1, open: null }, wonAt: T(50) })
      w.items = { ...stock }
      for (const id of TWENTY) w.umas[id]!.craft = { level: 46, exp: 120 }
    })
    const after = ascend(save, T(70)).save
    expect(worldOf(after, '1').items).toEqual(stock)
    const up = worldOf(after, '2')
    expect(up.items).toEqual({})
    expect(TWENTY.every((id) => up.umas[id]!.craft.level === 1 && up.umas[id]!.craft.exp === 0)).toBe(true)
    expect(TWENTY.every((id) => worldOf(after, '1').umas[id] === undefined)).toBe(true)
  })
})
