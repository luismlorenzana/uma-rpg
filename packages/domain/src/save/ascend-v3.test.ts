// Promotion with R2's stock (H77; profession-progression.md PP23), on engine v17 (live since H82): materials and
// made items stay in the old world's Warehouse, and she arrives in the new tier at Craft Lv 1. Her grades' made items go
// back to the old world's Warehouse, her open jewels don't, and she arrives at G0 with her slot's form (H78; R2's build
// decision 9, WP §3.10, GE14).
import { describe, expect, it } from 'vitest'
import { ascend, signUpRift } from './rift'
import { riftWorldSave, T, TWENTY } from './rift-rules.fixture'
import { worldOf } from './rules'
import type { Save, TierWorld } from './save'


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

  it('returns the made items her grades used to the old world, not her jewels, and she arrives at G0 with her slot\'s form', () => {
    const save = edit(signUpRift(riftWorldSave(), TWENTY, T(1)), (w) => {
      Object.assign(w.rift.runs[0]!, { fronts: { iron: 12, arcane: 12, duel: 12, horde: 12 }, convergence: { attempts: 1, open: null }, wonAt: T(50) })
      w.umas['101']!.gear = {
        weapons: { greatsword: { grade: 7 } },
        armor: { head: { grade: 5 }, body: { grade: 5 }, legs: { grade: 5 }, arms: { grade: 5 }, feet: { grade: 5 } },
        accessories: [{ grade: 3, family: 'orb', form: 'base', kind: 'greatsword' }, { grade: 0, family: 'bell', form: 'base' }, { grade: 0, family: null, form: 'base' }],
      }
      w.umas['101']!.stars = { open: ['planet:1', 'prowess:1'], moons: [] }
    })
    const after = ascend(save, T(70)).save
    const back: Record<string, number> = {}
    for (let g = 1; g <= 7; g++) back[`weapon-gem-g${g}`] = 1
    for (let g = 1; g <= 5; g++) back[`armor-fittings-g${g}`] = 5
    for (let g = 1; g <= 3; g++) back[`accessory-setting-g${g}`] = 1
    expect(worldOf(after, '1').items).toEqual(back)
    expect(worldOf(after, '1').gear).toBeUndefined()
    const her = worldOf(after, '2').umas['101']!
    expect(her.gear).toEqual({ weapons: {}, armor: {}, accessories: [{ grade: 0, family: 'orb', form: 'base', kind: 'greatsword' }, { grade: 0, family: 'bell', form: 'base' }, { grade: 0, family: null, form: 'base' }] })
    expect(her.stars).toEqual({ open: [], moons: [] })
  })
})
