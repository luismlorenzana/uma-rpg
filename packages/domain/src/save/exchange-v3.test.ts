// R2's Exchange and the calling pick's block (H77; profession-progression.md §10, PP2, PP17), on engine v17 (live
// since H82): raw materials by pair as a world's continents fall, × the world's tier, selling materials and made items,
// and the pick refused while she works.
import { describe, expect, it } from 'vitest'
import { pickCalling, type BattleOutfit } from './battle'
import { ECONOMY_V3_NOW, gradedUma, gradedWorld } from './economy-v3.fixture'
import { buyRawItem, buyTickets, rawPriceV3, sellPrice, sellStock, stockedTypes } from './exchange'
import { worldOf } from './rules'
import type { Save, TierWorld } from './save'
import { callingPickBlock, CALLING_WORKING } from './status'
import { collectJob, startJob } from './work'


const NOW = ECONOMY_V3_NOW
/** A world of a tier with wins on these continents of its own tier (1–5). */
function worldWith(tier: number, continents: readonly number[], overrides: Partial<TierWorld> = {}): TierWorld {
  const base = gradedWorld(overrides)
  const wins = Object.fromEntries(continents.map((c) => [`w${(tier - 1) * 5 + c}-1-1-s1`, 1]))
  return { ...base, world: { ...base.world, run: { ...base.world.run, wins: { start: 1, ...wins } } } }
}
const saveOf = (tier: number, world: TierWorld): Save => ({
  schemaVersion: 29,
  account: { trainerName: 'Tester', createdAt: NOW, updatedAt: NOW, achievements: {}, history: {}, defeated: {} },
  tierWorlds: { [String(tier)]: world },
})

describe('what the Exchange stocks (PP17)', () => {
  it('opens Tier 1\'s low types after the first win and its high types after continent 3', () => {
    expect(stockedTypes(worldWith(1, []), 1)).toEqual([])
    expect(stockedTypes(worldWith(1, [1]), 1)).toEqual(['copper-ore', 'pine-log', 'carrot', 'carp', 'quartz'])
    expect(stockedTypes(worldWith(1, [1, 2]), 1)).toEqual(['copper-ore', 'pine-log', 'carrot', 'carp', 'quartz'])
    expect(stockedTypes(worldWith(1, [1, 2, 3]), 1)).toEqual(['copper-ore', 'iron-ore', 'pine-log', 'cedar-log', 'carrot', 'cabbage', 'carp', 'sardine',
      'quartz', 'citrine'])
    expect(stockedTypes(worldWith(1, [5]), 1)).toHaveLength(10)
  })

  it('adds Tier 2\'s pair in a Tier 2 world: low after continent 2, high after continent 4', () => {
    expect(stockedTypes(worldWith(2, [1]), 2)).toEqual(['copper-ore', 'pine-log', 'carrot', 'carp', 'quartz'])
    expect(stockedTypes(worldWith(2, [1, 2]), 2)).toEqual(['copper-ore', 'gold-ore', 'pine-log', 'cherry-log', 'carrot', 'bell-pepper', 'carp', 'sea-bream',
      'quartz', 'sapphire'])
    expect(stockedTypes(worldWith(2, [1, 2, 3]), 2)).toHaveLength(15)
    expect(stockedTypes(worldWith(2, [1, 2, 3, 4]), 2)).toHaveLength(20)
    expect(stockedTypes(worldWith(2, [1, 2, 3, 4]), 2)).not.toContain('mythril-ore')
  })

  it('adds Tier 3\'s pair beside Tier 2\'s in a Tier 3 world', () => {
    expect(stockedTypes(worldWith(3, [1, 2]), 3).filter((id) => ['gold-ore', 'mythril-ore', 'titanium-ore', 'orichalcum-ore'].includes(id)))
      .toEqual(['gold-ore', 'mythril-ore'])
    expect(stockedTypes(worldWith(3, [1, 2, 3, 4]), 3)).toHaveLength(30)
  })
})

describe('buying and selling (PP17)', () => {
  it('sells a stocked raw type at 30 or 80 Laurels × the world\'s tier', () => {
    expect([1, 2, 3].map((t) => [rawPriceV3('copper-ore', t), rawPriceV3('iron-ore', t), rawPriceV3('gold-ore', t), rawPriceV3('titanium-ore', t)]))
      .toEqual([[30, 80, 30, 80], [60, 160, 60, 160], [90, 240, 90, 240]])
    expect(rawPriceV3('copper-ingot', 1)).toBe(0)
    const world = worldWith(2, [1, 2], { wallet: { ...gradedWorld().wallet, laurels: 1000 } })
    const stocked = stockedTypes(world, 2)
    const bought = buyRawItem(saveOf(2, world), 'gold-ore', 3, stocked, NOW, '2')
    expect(worldOf(bought, '2').items).toEqual({ 'gold-ore': 3 })
    expect(worldOf(bought, '2').wallet.laurels).toBe(1000 - 3 * 60)
    expect(() => buyRawItem(saveOf(2, world), 'iron-ore', 1, stocked, NOW, '2')).toThrow('Not stocked yet')
    expect(() => buyRawItem(saveOf(2, world), 'gold-ingot', 1, stocked, NOW, '2')).toThrow('raw items only')
    expect(() => buyRawItem(saveOf(2, world), 'tin-ore', 1, stocked, NOW, '2')).toThrow('raw items only')
    expect(() => buyRawItem(saveOf(2, world), 'carp', 17, stocked, NOW, '2')).toThrow('needs 1020 Laurels')
  })

  it('buys back materials and made items × the world\'s tier, and nothing off the retired shelves', () => {
    const prices = (tier: number) => ['carrot', 'cabbage', 'chopped-carrot', 'shredded-cabbage', 'weapon-gem-g1', 'weapon-gem-g10', 'jewel-moon-5', 'branch-gem']
      .map((id) => sellPrice('items', id, tier))
    expect(prices(1)).toEqual([6, 16, 12, 32, 12, 66, 66, 36])
    expect(prices(2)).toEqual([12, 32, 24, 64, 24, 132, 132, 72])
    expect(prices(3)).toEqual([18, 48, 36, 96, 36, 198, 198, 108])
    expect(sellPrice('items', 'tin-ore', 1)).toBe(0)
    expect(sellPrice('gems', 'moon-atk-1', 1)).toBe(0)
    const world = worldWith(2, [], { items: { 'cut-diamond': 2 } })
    const sold = sellStock(saveOf(2, world), 'items', 'cut-diamond', 2, NOW, '2')
    expect(worldOf(sold, '2').items).toEqual({})
    expect(worldOf(sold, '2').wallet.laurels).toBe(world.wallet.laurels + 2 * 64)
  })

  it('keeps the tickets as they are', () => {
    const world = worldWith(1, [], { wallet: { ...gradedWorld().wallet, laurels: 100 } })
    const after = worldOf(buyTickets(saveOf(1, world), 'time', 2, NOW), '1').wallet
    expect([after.laurels, after.timeTickets]).toEqual([80, world.wallet.timeTickets + 2])
  })
})

describe('the calling pick while she works (PP2)', () => {
  // An invented Pace Uma, Power over Wit: her pick moves her between the Spell Blade's and the Mage's trades.
  const pace: BattleOutfit = {
    outfitId: '101', baseStats: { speed: 110, stamina: 110, power: 104, guts: 110, wit: 90 }, growthRatePercents: { speed: 10, stamina: 0, power: 0, guts: 0, wit: 0 },
    aptitudes: { strategy: { front: 'B', pace: 'A', late: 'B', end: 'B' }, distance: { sprint: 'B', mile: 'A', medium: 'B', long: 'B' } },
  }
  const save = saveOf(1, worldWith(1, [], { items: { 'pine-log': 2 }, umas: { '101': gradedUma({ level: 5, calling: { pick: null, confirmed: false } }) } }))

  it('is refused while she has work started or ready, and free once collected', () => {
    expect(callingPickBlock(worldOf(save), '101', NOW)).toBeNull()
    expect(worldOf(pickCalling(save, pace, 'mage', NOW)).umas['101']!.calling).toEqual({ pick: 'mage', confirmed: false })
    const working = startJob(save, 'forest', 0, { outfitId: '101' }, 'pine-log', 1, NOW)
    expect(callingPickBlock(worldOf(working), '101', NOW)).toBe(CALLING_WORKING)
    expect(CALLING_WORKING).toBe('Finish her work first')
    expect(() => pickCalling(working, pace, 'mage', NOW)).toThrow('Finish her work first')
    const later = new Date(Date.parse(NOW) + 3 * 3_600_000).toISOString()
    expect(callingPickBlock(worldOf(working), '101', later)).toBe(CALLING_WORKING)
    const collected = collectJob(working, 'forest', 0, later).save
    expect(callingPickBlock(worldOf(collected), '101', later)).toBeNull()
    expect(worldOf(pickCalling(collected, pace, 'mage', later)).umas['101']!.calling.pick).toBe('mage')
  })
})
