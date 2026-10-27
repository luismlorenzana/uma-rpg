// The made items (H77; the farm by line since H112, D224, FL3, FL14): names, places and grades. Their recipes, one line
// each, are `made-v4.ts`' (checked in `work/kinds-v4.test.ts`).
import { describe, expect, it } from 'vitest'
import { madeName, madePlace, worldMaterialTier } from './made'
import { jewelId, MADE_IDENTITIES, MADE_LINES, madeIdentity } from './made-id'

describe('made items: names, places and grades', () => {
  it('names every line: the Weapon Gem reads Arms Gem, and Tome Ink is its own line', () => {
    expect(['weapon-gem-g3', 'tome-ink-g3', 'armor-fittings-g3', 'accessory-setting-g3', 'branch-gem', 'jewel-planet-3', 'jewel-moon-2', 'weapon-gem-g10']
      .map(madeName)).toEqual(['Arms Gem G3', 'Tome Ink G3', 'Armor Fittings G3', 'Accessory Setting G3', 'Branch Gem', 'Planet Jewel III', 'Moon Jewel II',
      'Arms Gem G10'])
    expect([1, 2, 3, 4, 5].map((n) => madeName(jewelId('planet', n)))).toEqual(['Planet Jewel I', 'Planet Jewel II', 'Planet Jewel III', 'Planet Jewel IV', 'Planet Jewel V'])
    expect(madeName('copper-ore')).toBeUndefined()
    expect(new Set(MADE_IDENTITIES.map((m) => madeName(m.id))).size).toBe(MADE_IDENTITIES.length)
  })

  it('makes each line at its own place (FL3), a jewel at its node\'s grade and the Branch Gem at G5', () => {
    expect(MADE_LINES.map((l) => madePlace(l))).toEqual(['forge', 'armorer', 'charm-shop', 'forge', 'lapidary', 'lapidary', 'workbench'])
    expect([1, 2, 3, 4, 5].map((n) => madeIdentity(jewelId('planet', n))!.grade)).toEqual([1, 3, 5, 7, 9])
    expect([1, 2, 3, 4, 5].map((n) => madeIdentity(jewelId('moon', n))!.grade)).toEqual([2, 4, 6, 8, 10])
    expect(madeIdentity('branch-gem')!.grade).toBe(5)
    // 41 of R2's and Tome Ink's ten.
    expect(MADE_IDENTITIES).toHaveLength(51)
    expect([0, 1, 2.9, 3, 7].map(worldMaterialTier)).toEqual([1, 1, 2, 3, 3])
  })
})
