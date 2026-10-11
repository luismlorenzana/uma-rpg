import { describe, expect, it } from 'vitest'
import { dishById } from '../economy/dishes'
import { gearById } from '../economy/gear'
import { BATTLE_LAURELS, FIRST_CLEAR_LAURELS, LATE_LAURELS } from '../economy/pacing'
import {
  cookTokenId, craftTokenId, gradeBand, levelBand, promotionTokenId, rollTokens, TOKEN_DROPS, TOKEN_ODDS, tokenBuyPrice, TOKENS, tokenById, tokenSellPrice,
} from '../economy/tokens'
import { RPG_BATTLE_EXP_WEIGHTS } from '../rpg/campaign/rewards'
import { unlockUma, worldOf } from './rules'
import { newSave, parseSave, type Save } from './save'
import { buyTokens, sellPrice, sellStock } from './exchange'

const at = (n: number) => new Date(Date.parse('2026-10-11T12:00:00.000Z') + n).toISOString()
const give = (save: Save, items: Record<string, number>): Save => ({ ...save, tierWorlds: { '1': { ...worldOf(save), items: { ...worldOf(save).items, ...items } } } })

describe('tokens (D67)', () => {
  it('mirrors crafting and cooking: eight stats each, five promotions, per band', () => {
    // Class ranks top out at 5 (D77): band 5 has no Promotion Tokens, and its bosses drop Crafting or Cooking instead.
    expect(TOKENS).toHaveLength(5 * (8 + 8) + 4 * 5)
    expect(tokenById(promotionTokenId('mage', 5))).toBeUndefined()
    for (let n = 0; n < 40; n++) expect(Object.keys(rollTokens(`b5-${n}`, 'boss', 5)).some((id) => id.startsWith('token-class'))).toBe(false)
    expect(Object.keys(rollTokens('b4', 'boss', 4)).some((id) => id.startsWith('token-class'))).toBe(true)
    expect(tokenById(craftTokenId('atk', 2))).toMatchObject({ kind: 'craft', band: 2, effect: 'atk', name: 'ATK Crafting Token (G3–4)' })
    expect(tokenById(cookTokenId('atk', 2))!.name).toBe('ATK Cooking Token (G3–4)')
    expect(tokenById(promotionTokenId('spellblade', 1))!.name).toBe('Spell Blade Promotion Token (rank 2)')
    expect([1, 2, 9, 10].map(gradeBand)).toEqual([1, 1, 5, 5])
    expect([1, 10, 11, 50, 51].map(levelBand)).toEqual([1, 1, 2, 5, 1])
  })

  it('asks a token of the stat and band for every piece and dish', () => {
    expect(gearById('greatsword-g3-hp')!.inputs['token-craft-hp-2']).toBe(1)
    expect(dishById('dish-grains-5')!.inputs['token-cook-hp-3']).toBe(1)
    expect(Object.keys(dishById('duo-hp-def-3')!.inputs).filter((id) => id.startsWith('token-'))).toEqual(['token-cook-hp-2', 'token-cook-def-2'])
    expect(Object.keys(dishById('feast-4')!.inputs).filter((id) => id.startsWith('token-'))).toHaveLength(8)
  })

  it('drops the same tokens for the same fight, more from bosses, always a promotion from a boss', () => {
    const fight = rollTokens('seed:a1r1c1', 'fight', 1)
    expect(rollTokens('seed:a1r1c1', 'fight', 1)).toEqual(fight)
    expect(Object.values(fight).reduce((a, b) => a + b, 0)).toBe(TOKEN_DROPS.fight)
    for (let i = 0; i < 40; i++) {
      const boss = rollTokens(`seed:${i}`, 'boss', 3)
      expect(Object.values(boss).reduce((a, b) => a + b, 0)).toBe(TOKEN_DROPS.boss)
      expect(Object.keys(boss).some((id) => id.startsWith('token-class-') && id.endsWith('-3'))).toBe(true)
    }
  })

  it('earns each Uma, Lv1 to 50, two class tracks, two weapon tracks and two planets, plus ~1.5 classes of late Laurels (D82)', () => {
    // A region's twelve stages pay 5.4 levels of EXP at its level, so a party clears about 10 / 5.4 regions per band;
    // each Uma counts a fifth of what her party's fights drop.
    const w = RPG_BATTLE_EXP_WEIGHTS
    const regionsPerBand = 10 / (10 * w.fight + w['sub-boss'] + w.boss)
    const drops = 10 * TOKEN_DROPS.fight + TOKEN_DROPS['sub-boss'] + TOKEN_DROPS.boss
    const promotions = 2 + (drops - 2) * TOKEN_ODDS.class
    const perUma = (perRegion: number, bands: number) => (perRegion * regionsPerBand * bands) / 5
    // Bands 1–4 promote; band 5's promotion share goes half to Crafting, half to Cooking.
    const craft = perUma((drops - promotions) / 2, 4) + perUma(drops / 2, 1)
    expect(perUma(promotions, 4)).toBeGreaterThanOrEqual(2 * 4) // two classes, ranks 1 → 5
    expect(craft).toBeGreaterThanOrEqual(2 * 10) // two weapons, one per grade
    expect(TOKEN_ODDS.craft).toBe(TOKEN_ODDS.cook) // and as many Cooking: two planets of ten moons
    // Lv41–50 Laurels: the extra over a band, per Uma, against a full class bought at the Exchange.
    const firstClears = (10 * BATTLE_LAURELS.fight + BATTLE_LAURELS['sub-boss'] + BATTLE_LAURELS.boss) * FIRST_CLEAR_LAURELS
    const extra = perUma(firstClears * (LATE_LAURELS.factor - 1), 1)
    const fullClass = [1, 2, 3, 4].reduce((n, band) => n + tokenBuyPrice(promotionTokenId('mage', band)), 0)
    expect(extra / fullClass).toBeGreaterThan(1.2)
    expect(extra / fullClass).toBeLessThan(2)
  })

  it('drops each token with a one-in-four chance on a replay (D79)', () => {
    let dropped = 0
    for (let i = 0; i < 400; i++) dropped += Object.values(rollTokens(`replay:${i}`, 'fight', 1, 0.25)).reduce((a, b) => a + b, 0)
    // 400 regular wins would drop 800 tokens; a quarter of that, give or take.
    expect(dropped).toBeGreaterThan(160)
    expect(dropped).toBeLessThan(240)
  })

  it('sells any token for 20 × its band and buys any for twice that: two tokens buy one of another kind (D80)', () => {
    let save = give(unlockUma(newSave('Luis', at(0)), '101', at(0)), { 'token-cook-hp-1': 2, 'token-craft-atk-3': 1 })
    expect([tokenSellPrice('token-cook-hp-1'), tokenBuyPrice('token-cook-hp-1'), tokenBuyPrice('token-class-mage-4'), sellPrice('items', 'token-craft-atk-3')]).toEqual([20, 40, 160, 60])
    save = sellStock(save, 'items', 'token-cook-hp-1', 2, at(1))
    expect(worldOf(save).wallet.laurels).toBe(40)
    save = buyTokens(save, 'token-class-brawler-1', 1, at(2))
    expect(worldOf(save).items).toEqual({ 'token-craft-atk-3': 1, 'token-class-brawler-1': 1 })
    expect(worldOf(save).wallet.laurels).toBe(0)
    expect(() => buyTokens(save, 'token-cook-hp-1', 1, at(3))).toThrow(/40 Laurels/)
    expect(() => buyTokens(save, 'token-class-mage-5', 1, at(3))).toThrow(/not a token/)
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
  })
})
