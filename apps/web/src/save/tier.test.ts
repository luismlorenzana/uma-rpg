import { newOwnedUma, newSave, newTierWorld, unlockUma, type Save } from '@rpg/domain'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { rememberedTier, rememberTier, startTier } from './tier'

const NOW = '2026-10-21T12:00:00.000Z'
/** Tier 1 with one Uma, plus a synthetic Tier 2 world (no promotion exists yet), with or without Umas. */
const twoTiers = (tier2Umas: boolean): Save => {
  const save = unlockUma(newSave('Luis', NOW), '101', NOW)
  return { ...save, tierWorlds: { ...save.tierWorlds, '2': { ...newTierWorld(NOW, 0), umas: tier2Umas ? { '201': newOwnedUma(NOW) } : {} } } }
}

describe('the start tier (H35)', () => {
  it('opens on the asked tier, else the remembered one, else the highest tier with Umas', () => {
    const save = twoTiers(true)
    expect(startTier(save, '1', 2)).toBe(1)
    expect(startTier(save, '2', 1)).toBe(2)
    expect(startTier(save, null, 1)).toBe(1)
    expect(startTier(save, null, null)).toBe(2)
  })

  it('ignores an asked or remembered tier with no world, or that is no tier at all', () => {
    const save = twoTiers(true)
    expect(startTier(save, '3', 1)).toBe(1)
    expect(startTier(save, '9', null)).toBe(2)
    expect(startTier(save, null, 7)).toBe(2)
    for (const bad of ['0', '-1', '1.5', 'two', '']) expect(startTier(save, bad, 1), bad).toBe(1)
  })

  it('opens an empty Tier 2 world only when asked: Tier 1 with Umas wins', () => {
    const save = twoTiers(false)
    expect(startTier(save, null, null)).toBe(1)
    expect(startTier(save, '2', null)).toBe(2)
    expect(startTier(newSave('Luis', NOW), null, null)).toBe(1)
  })
})

describe('the remembered tier, rpg.tier', () => {
  let rows: Map<string, string>
  beforeEach(() => {
    rows = new Map()
    vi.stubGlobal('localStorage', { getItem: (key: string) => rows.get(key) ?? null, setItem: (key: string, value: string) => rows.set(key, value) })
  })
  afterEach(() => vi.unstubAllGlobals())

  it('round-trips a tier and ignores anything else', () => {
    expect(rememberedTier()).toBeNull()
    rememberTier(2)
    expect(rows.get('rpg.tier')).toBe('2')
    expect(rememberedTier()).toBe(2)
    rows.set('rpg.tier', 'nonsense')
    expect(rememberedTier()).toBeNull()
  })

  it('survives blocked storage', () => {
    vi.stubGlobal('localStorage', { getItem: () => { throw new Error('blocked') }, setItem: () => { throw new Error('blocked') } })
    expect(rememberedTier()).toBeNull()
    expect(() => rememberTier(2)).not.toThrow()
  })
})
