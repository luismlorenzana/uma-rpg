// R2's Exchange and the calling pick's block (H77; profession-progression.md §10, PP2, PP17), on engine v17 (live
// since H82): raw materials by pair as a world's continents fall, × the world's tier, selling materials and made items,
// and her work's block on the pick (the pick itself refused for everyone from v19, CV19).
import { describe, expect, it } from 'vitest'
import { CALLING_NO_PICK } from '../roster/template'
import { pickCalling, type BattleOutfit } from './battle'
import { ECONOMY_V3_NOW, gradedUma, gradedWorld } from './economy-v3.fixture'
import { buyRawItem, buyTickets, rawPriceV4, sellPrice, sellStock, stockedTypes } from './exchange'
import { worldOf } from './rules'
import { SAVE_SCHEMA_VERSION, type Save, type TierWorld } from './save'
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
  schemaVersion: SAVE_SCHEMA_VERSION,
  account: { trainerName: 'Tester', createdAt: NOW, updatedAt: NOW, achievements: {}, history: {}, defeated: {} },
  tierWorlds: { [String(tier)]: world },
})

describe('what the Exchange stocks (PP17, FL12)', () => {
  it('opens each line\'s G1–G5 after the tier\'s first win and G6–G10 after continent 3, in every tier', () => {
    expect(stockedTypes(worldWith(1, []), 1)).toEqual([])
    const first = stockedTypes(worldWith(1, [1]), 1)
    expect(first).toHaveLength(25)
    expect(first.filter((id) => ['copper-ore', 'cobalt-ore', 'gold-ore'].includes(id))).toEqual(['copper-ore', 'cobalt-ore'])
    expect(stockedTypes(worldWith(1, [1, 2]), 1)).toHaveLength(25)
    expect(stockedTypes(worldWith(1, [1, 2, 3]), 1)).toHaveLength(50)
    expect(stockedTypes(worldWith(2, [1]), 2)).toEqual(first)
    expect(stockedTypes(worldWith(3, [5]), 3)).toHaveLength(50)
  })
})

describe('buying and selling (PP17)', () => {
  it('sells a stocked raw item at 30 (G1–G5) or 80 (G6–G10) Laurels × the world\'s tier', () => {
    expect([1, 2, 3].map((t) => [rawPriceV4('copper-ore', t), rawPriceV4('iron-ore', t), rawPriceV4('gold-ore', t), rawPriceV4('titanium-ore', t)]))
      .toEqual([[30, 30, 80, 80], [60, 60, 160, 160], [90, 90, 240, 240]])
    expect(rawPriceV4('copper-ingot', 1)).toBe(0)
    const world = worldWith(2, [1, 2], { wallet: { ...gradedWorld().wallet, laurels: 1000 } })
    const stocked = stockedTypes(world, 2)
    const bought = buyRawItem(saveOf(2, world), 'tin-ore', 3, stocked, NOW, '2')
    expect(worldOf(bought, '2').items).toEqual({ 'tin-ore': 3 })
    expect(worldOf(bought, '2').wallet.laurels).toBe(1000 - 3 * 60)
    expect(() => buyRawItem(saveOf(2, world), 'gold-ore', 1, stocked, NOW, '2')).toThrow('Not stocked yet')
    expect(() => buyRawItem(saveOf(2, world), 'gold-ingot', 1, stocked, NOW, '2')).toThrow('raw items only')
    expect(() => buyRawItem(saveOf(2, world), 'weapon-gem-g1', 1, stocked, NOW, '2')).toThrow('raw items only')
    expect(() => buyRawItem(saveOf(2, world), 'carp', 17, stocked, NOW, '2')).toThrow('needs 1020 Laurels')
  })

  it('buys back materials and made items × the world\'s tier, and nothing off the retired shelves', () => {
    const prices = (tier: number) => ['carrot', 'cabbage', 'chopped-carrot', 'shredded-cabbage', 'weapon-gem-g1', 'weapon-gem-g10', 'jewel-moon-5', 'branch-gem']
      .map((id) => sellPrice('items', id, tier))
    // Cabbage is G3 now: a low band's price, as Carrot's.
    expect(prices(1)).toEqual([6, 6, 12, 12, 12, 66, 66, 36])
    expect(prices(2)).toEqual([12, 12, 24, 24, 24, 132, 132, 72])
    expect(prices(3)).toEqual([18, 18, 36, 36, 36, 198, 198, 108])
    expect([sellPrice('items', 'eel', 1), sellPrice('items', 'tome-ink-g3', 1), sellPrice('items', 'nothing', 1)]).toEqual([16, 24, 0])
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
  // An invented Pace Uma, Power over Wit: to v18 her pick moved her between the Spell Blade's and the Mage's trades.
  const pace: BattleOutfit = {
    outfitId: '101', baseStats: { speed: 110, stamina: 110, power: 104, guts: 110, wit: 90 }, growthRatePercents: { speed: 10, stamina: 0, power: 0, guts: 0, wit: 0 },
    aptitudes: { strategy: { front: 'B', pace: 'A', late: 'B', end: 'B' }, distance: { sprint: 'B', mile: 'A', medium: 'B', long: 'B' } },
  }
  const save = saveOf(1, worldWith(1, [], { items: { 'pine-log': 2 }, umas: { '101': gradedUma({ level: 5 }) } }))

  it('is blocked while she has work started or ready, and not once collected; from v19 the pick is refused first', () => {
    expect(callingPickBlock(worldOf(save), '101', NOW)).toBeNull()
    expect(() => pickCalling(save, pace, 'mage', NOW)).toThrow(CALLING_NO_PICK)
    const working = startJob(save, 'forest', 0, { outfitId: '101' }, 'pine-log', 1, NOW)
    expect(callingPickBlock(worldOf(working), '101', NOW)).toBe(CALLING_WORKING)
    expect(CALLING_WORKING).toBe('Finish her work first')
    expect(() => pickCalling(working, pace, 'mage', NOW)).toThrow(CALLING_NO_PICK)
    const later = new Date(Date.parse(NOW) + 3 * 3_600_000).toISOString()
    expect(callingPickBlock(worldOf(working), '101', later)).toBe(CALLING_WORKING)
    const collected = collectJob(working, 'forest', 0, later).save
    expect(callingPickBlock(worldOf(collected), '101', later)).toBeNull()
  })
})
