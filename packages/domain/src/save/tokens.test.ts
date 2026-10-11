import { describe, expect, it } from 'vitest'
import { dishById } from '../economy/dishes'
import { gearById } from '../economy/gear'
import { cookTokenId, craftTokenId, gradeBand, levelBand, promotionTokenId, rollTokens, TOKENS, tokenById } from '../economy/tokens'
import { unlockUma, worldOf } from './rules'
import { newSave, parseSave, type Save } from './save'
import { swapTokens } from './exchange'

const at = (n: number) => new Date(Date.parse('2026-10-11T12:00:00.000Z') + n).toISOString()
const give = (save: Save, items: Record<string, number>): Save => ({ ...save, tierWorlds: { '1': { ...worldOf(save), items: { ...worldOf(save).items, ...items } } } })

describe('tokens (D67)', () => {
  it('mirrors crafting and cooking: eight stats each, five promotions, per band', () => {
    expect(TOKENS).toHaveLength(5 * (5 + 8 + 8))
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
    expect(Object.values(fight).reduce((a, b) => a + b, 0)).toBe(2)
    for (let i = 0; i < 40; i++) {
      const boss = rollTokens(`seed:${i}`, 'boss', 3)
      expect(Object.values(boss).reduce((a, b) => a + b, 0)).toBe(6)
      expect(Object.keys(boss).some((id) => id.startsWith('token-class-') && id.endsWith('-3'))).toBe(true)
    }
  })

  it('swaps three of a kind and band for one of your choice, and saves tokens like items', () => {
    let save = give(unlockUma(newSave('Luis', at(0)), '101', at(0)), { 'token-cook-hp-1': 2, 'token-cook-mp-1': 1, 'token-craft-hp-1': 1 })
    expect(() => swapTokens(save, { 'token-cook-hp-1': 2, 'token-craft-hp-1': 1 }, 'token-cook-atk-1', at(1))).toThrow(/same kind and band/)
    expect(() => swapTokens(save, { 'token-cook-hp-1': 2 }, 'token-cook-atk-1', at(1))).toThrow(/swap 3/)
    save = swapTokens(save, { 'token-cook-hp-1': 2, 'token-cook-mp-1': 1 }, 'token-cook-atk-1', at(1))
    expect(worldOf(save).items).toEqual({ 'token-craft-hp-1': 1, 'token-cook-atk-1': 1 })
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
  })
})
