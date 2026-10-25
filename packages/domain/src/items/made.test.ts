// R2's made items (H77; profession-progression.md §3.4–§3.5, §6.2, §7.1, PP9–PP11): names, places and grades, every
// recipe in world Tiers 1–3 against PP §6.2's tables, and one Uma's Tier 1 demand against §7.1.
import { describe, expect, it } from 'vitest'
import { gradeBand, ladderTier, madeName, madePlace, madeRecipe, madeRefined } from './made'
import { gradeItem, jewelId, MADE_IDENTITIES, madeIdentity } from './made-id'
import { materialIdentity } from './materials-id'

type Recipe = Readonly<Record<string, number>>
const grades = Array.from({ length: 10 }, (_, i) => i + 1)

describe('made items: names, places and grades', () => {
  it('names every line as the docs do', () => {
    expect(['weapon-gem-g3', 'armor-fittings-g3', 'accessory-setting-g3', 'branch-gem', 'jewel-planet-3', 'jewel-moon-2', 'weapon-gem-g10'].map(madeName))
      .toEqual(['Weapon Gem G3', 'Armor Fittings G3', 'Accessory Setting G3', 'Branch Gem', 'Planet Jewel III', 'Moon Jewel II', 'Weapon Gem G10'])
    expect([1, 2, 3, 4, 5].map((n) => madeName(jewelId('planet', n)))).toEqual(['Planet Jewel I', 'Planet Jewel II', 'Planet Jewel III', 'Planet Jewel IV', 'Planet Jewel V'])
    expect(madeName('copper-ore')).toBeUndefined()
    expect(new Set(MADE_IDENTITIES.map((m) => madeName(m.id))).size).toBe(MADE_IDENTITIES.length)
  })

  it('makes each line at its place, a jewel at its node\'s grade and the Branch Gem at G5', () => {
    expect(['weapon-gem', 'branch-gem', 'armor-fittings', 'accessory-setting', 'jewel-planet', 'jewel-moon'].map((l) => madePlace(l as never)))
      .toEqual(['forge', 'forge', 'armorer', 'charm-shop', 'lapidary', 'lapidary'])
    expect([1, 2, 3, 4, 5].map((n) => madeIdentity(jewelId('planet', n))!.grade)).toEqual([1, 3, 5, 7, 9])
    expect([1, 2, 3, 4, 5].map((n) => madeIdentity(jewelId('moon', n))!.grade)).toEqual([2, 4, 6, 8, 10])
    expect(madeIdentity('branch-gem')!.grade).toBe(5)
    expect(MADE_IDENTITIES).toHaveLength(41)
  })

  it('reads the ladder (PP9): a band\'s top grade on the world\'s own pair, the one below on the tier before', () => {
    expect(grades.map((g) => ladderTier(g, 1))).toEqual([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
    expect(grades.map((g) => ladderTier(g, 2))).toEqual([1, 1, 1, 1, 2, 1, 1, 1, 1, 2])
    expect(grades.map((g) => ladderTier(g, 3))).toEqual([1, 1, 1, 2, 3, 1, 1, 1, 2, 3])
    expect(grades.map(gradeBand)).toEqual(['low', 'low', 'low', 'low', 'low', 'high', 'high', 'high', 'high', 'high'])
  })
})

// --- PP §6.2, transcribed: each tier's row of ten grades names one recipe of the line's set ------------------------------

const two = (metal: string, wood: string): Recipe => ({ [`${metal}-ingot`]: 2, [`${wood}-plank`]: 2 })
const WEAPON = { cp: two('copper', 'pine'), ic: two('iron', 'cedar'), gc: two('gold', 'cherry'), te: two('titanium', 'ebony'),
  me: two('mythril', 'elderwood'), oy: two('orichalcum', 'yggdrasil') }
const WEAPON_ROWS: Readonly<Record<number, readonly (keyof typeof WEAPON)[]>> = {
  1: ['cp', 'cp', 'cp', 'cp', 'cp', 'ic', 'ic', 'ic', 'ic', 'ic'],
  2: ['cp', 'cp', 'cp', 'cp', 'gc', 'ic', 'ic', 'ic', 'ic', 'te'],
  3: ['cp', 'cp', 'cp', 'gc', 'me', 'ic', 'ic', 'ic', 'te', 'oy'],
}

const FITTINGS = {
  cc: { 'chopped-carrot': 1, 'carp-fillet': 1 }, bs: { 'sliced-bell-pepper': 1, 'sea-bream-fillet': 1 }, gs: { 'golden-carrot-puree': 1, 'silverfin-fillet': 1 },
  icc: { 'iron-ingot': 1, 'cedar-plank': 1, 'cut-citrine': 1 }, ted: { 'titanium-ingot': 1, 'ebony-plank': 1, 'cut-diamond': 1 },
  oyp: { 'orichalcum-ingot': 1, 'yggdrasil-plank': 1, 'cut-philosophers-stone': 1 },
} satisfies Record<string, Recipe>
const FITTINGS_ROWS: Readonly<Record<number, readonly (keyof typeof FITTINGS)[]>> = {
  1: ['cc', 'cc', 'cc', 'cc', 'cc', 'icc', 'icc', 'icc', 'icc', 'icc'],
  2: ['cc', 'cc', 'cc', 'cc', 'bs', 'icc', 'icc', 'icc', 'icc', 'ted'],
  3: ['cc', 'cc', 'cc', 'bs', 'gs', 'icc', 'icc', 'icc', 'ted', 'oyp'],
}

const setting = (veg: string, fish: string, n: number): Recipe => ({ [veg]: n, [fish]: n })
const SETTING_PAIRS = { cc: ['chopped-carrot', 'carp-fillet'], ss: ['shredded-cabbage', 'sardine-fillet'], bs: ['sliced-bell-pepper', 'sea-bream-fillet'],
  ta: ['trimmed-asparagus', 'tuna-fillet'], gs: ['golden-carrot-puree', 'silverfin-fillet'], pr: ['pumpkin-puree', 'rainbow-koi-fillet'] } as const
const SETTING_ROWS: Readonly<Record<number, readonly (keyof typeof SETTING_PAIRS)[]>> = {
  1: ['cc', 'cc', 'cc', 'cc', 'cc', 'ss', 'ss', 'ss', 'ss', 'ss'],
  2: ['cc', 'cc', 'cc', 'cc', 'bs', 'ss', 'ss', 'ss', 'ss', 'ta'],
  3: ['cc', 'cc', 'cc', 'bs', 'gs', 'ss', 'ss', 'ss', 'ta', 'pr'],
}

const planet = (stone: string, wood: string, veg: string, fish: string): Recipe => ({ [stone]: 3, [wood]: 3, [veg]: 3, [fish]: 3 })
const PLANET = {
  low: planet('cut-quartz', 'pine-plank', 'chopped-carrot', 'carp-fillet'), high: planet('cut-citrine', 'cedar-plank', 'shredded-cabbage', 'sardine-fillet'),
  t2low: planet('cut-sapphire', 'cherry-plank', 'sliced-bell-pepper', 'sea-bream-fillet'), t2high: planet('cut-diamond', 'ebony-plank', 'trimmed-asparagus', 'tuna-fillet'),
  t3low: planet('cut-starstone', 'elderwood-plank', 'golden-carrot-puree', 'silverfin-fillet'),
}
/** Planet Jewels I–V (grades 1, 3, 5, 7, 9). */
const PLANET_ROWS: Readonly<Record<number, readonly (keyof typeof PLANET)[]>> = {
  1: ['low', 'low', 'low', 'high', 'high'],
  2: ['low', 'low', 't2low', 'high', 'high'],
  3: ['low', 'low', 't3low', 'high', 't2high'],
}

const moon = (stone: string, metal: string): Recipe => ({ [stone]: 3, [metal]: 1 })
const MOON = { qc: moon('cut-quartz', 'copper-ingot'), ci: moon('cut-citrine', 'iron-ingot'), sg: moon('cut-sapphire', 'gold-ingot'),
  dt: moon('cut-diamond', 'titanium-ingot'), po: moon('cut-philosophers-stone', 'orichalcum-ingot') }
/** Moon Jewels I–V (grades 2, 4, 6, 8, 10). */
const MOON_ROWS: Readonly<Record<number, readonly (keyof typeof MOON)[]>> = {
  1: ['qc', 'qc', 'ci', 'ci', 'ci'],
  2: ['qc', 'qc', 'ci', 'ci', 'dt'],
  3: ['qc', 'sg', 'ci', 'ci', 'po'],
}

describe('every recipe in world Tiers 1–3 (PP §6.2)', () => {
  for (const tier of [1, 2, 3]) {
    it(`matches the tables in a Tier ${tier} world`, () => {
      // Recipes are equal as ordered entries, so the recipe's order is checked too.
      const entries = (r: Recipe) => Object.entries(r)
      for (const g of grades) {
        expect(entries(madeRecipe(gradeItem('weapon-gem', g), tier)), `weapon G${g}`).toEqual(entries(WEAPON[WEAPON_ROWS[tier]![g - 1]!]))
        expect(entries(madeRecipe(gradeItem('armor-fittings', g), tier)), `fittings G${g}`).toEqual(entries(FITTINGS[FITTINGS_ROWS[tier]![g - 1]!]))
        const [veg, fish] = SETTING_PAIRS[SETTING_ROWS[tier]![g - 1]!]
        // One slot in every tier while R2 gives every tier one (D208): 6 + 6; R3's two and three slots: 3 + 3, 2 + 2.
        expect(madeRecipe(gradeItem('accessory-setting', g), tier), `setting G${g}`).toEqual(setting(veg, fish, 6))
        expect(madeRecipe(gradeItem('accessory-setting', g), tier, 2)).toEqual(setting(veg, fish, 3))
        expect(madeRecipe(gradeItem('accessory-setting', g), tier, 3)).toEqual(setting(veg, fish, 2))
      }
      for (const n of [1, 2, 3, 4, 5]) {
        expect(entries(madeRecipe(jewelId('planet', n), tier)), `planet ${n}`).toEqual(entries(PLANET[PLANET_ROWS[tier]![n - 1]!]))
        expect(entries(madeRecipe(jewelId('moon', n), tier)), `moon ${n}`).toEqual(entries(MOON[MOON_ROWS[tier]![n - 1]!]))
      }
    })
  }

  it('makes the Branch Gem its world\'s G5 Weapon Gem: Gold and Cherry in Tier 2, Mythril and Elderwood in Tier 3', () => {
    expect(madeRecipe('branch-gem', 2)).toEqual(WEAPON.gc)
    expect(madeRecipe('branch-gem', 3)).toEqual(WEAPON.me)
    expect(madeRefined('branch-gem', 3)).toBe(4)
  })

  it('takes the same amounts in every tier (PP11), and the Setting 12 · 6 · 4 by its slots', () => {
    for (const m of MADE_IDENTITIES) {
      const sizes = [1, 2, 3].map((tier) => madeRefined(m.id, tier))
      expect(new Set(sizes).size, m.id).toBe(1)
    }
    expect([1, 2, 3].map((slots) => madeRefined('accessory-setting-g1', 1, slots))).toEqual([12, 6, 4])
    expect(() => madeRecipe('copper-ore', 1)).toThrow(RangeError)
    expect(() => madeRecipe('accessory-setting-g1', 1, 5)).toThrow(RangeError)
  })

  it('takes refined materials only, every one of a tier at or below the world\'s', () => {
    for (const tier of [1, 2, 3]) {
      for (const m of MADE_IDENTITIES) {
        for (const id of Object.keys(madeRecipe(m.id, tier))) {
          const material = materialIdentity(id)
          expect(material?.refined, id).toBe(true)
          expect(material!.tier).toBeLessThanOrEqual(tier)
        }
      }
    }
  })
})

describe('one Uma\'s Tier 1 demand (PP §7.1)', () => {
  /** Three weapons and five armor slots G1–G10, one accessory slot G1–G10, Planet Jewels I–V and Moon Jewels I–V on three moons. */
  const pieces = [
    ...grades.flatMap((g) => Array<string>(3).fill(gradeItem('weapon-gem', g))),
    ...grades.flatMap((g) => Array<string>(5).fill(gradeItem('armor-fittings', g))),
    ...grades.map((g) => gradeItem('accessory-setting', g)),
    ...[1, 2, 3, 4, 5].map((n) => jewelId('planet', n)),
    ...[1, 2, 3, 4, 5].flatMap((n) => Array<string>(3).fill(jewelId('moon', n))),
  ]
  const demand = (list: readonly string[]) => {
    const out: Record<string, number> = {}
    for (const id of list) for (const [item, qty] of Object.entries(madeRecipe(id, 1))) out[item] = (out[item] ?? 0) + qty
    return out
  }
  const total = (r: Recipe) => Object.values(r).reduce((a, b) => a + b, 0)

  it('is 110 pieces and 485 refined items, by type as §7.1', () => {
    expect(pieces).toHaveLength(110)
    const refined = demand(pieces)
    expect(total(refined)).toBe(485)
    expect(refined).toEqual({
      'copper-ingot': 36, 'iron-ingot': 64, 'pine-plank': 39, 'cedar-plank': 61, 'chopped-carrot': 64, 'shredded-cabbage': 36,
      'carp-fillet': 64, 'sardine-fillet': 36, 'cut-quartz': 27, 'cut-citrine': 58,
    })
  })

  it('is 493 with her moon\'s Moon Jewels II and IV', () => {
    const refined = demand([...pieces, jewelId('moon', 2), jewelId('moon', 4)])
    expect(total(refined)).toBe(493)
    expect(refined).toMatchObject({ 'copper-ingot': 37, 'iron-ingot': 65, 'cut-quartz': 30, 'cut-citrine': 61 })
  })

  it('splits about a quarter to each making place: the Forge 120, the Armorer 125, the Charm Shop 120, the Lapidary 120', () => {
    const byPlace: Record<string, number> = {}
    for (const id of pieces) {
      const place = madePlace(madeIdentity(id)!.line)
      byPlace[place] = (byPlace[place] ?? 0) + madeRefined(id, 1)
    }
    expect(byPlace).toEqual({ forge: 120, armorer: 125, 'charm-shop': 120, lapidary: 120 })
  })
})
