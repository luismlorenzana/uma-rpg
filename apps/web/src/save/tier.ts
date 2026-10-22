// The active tier on this device (H35, tiers.md §4): which tier world every screen shows. Remembered as `rpg.tier`; the
// app opens on an asked tier (a `?tier=` link), else the remembered one, else the highest tier with Umas, else Tier 1.
import { savedTiers, tierKey, type Save } from '@rpg/domain'

const KEY = 'rpg.tier'

const asTier = (value: string | number | null | undefined): number | null => {
  const text = value === null || value === undefined ? '' : String(value)
  return /^[1-9]\d{0,2}$/.test(text) ? Number(text) : null
}

/** The tier last viewed on this device, or null. */
export function rememberedTier(): number | null {
  try {
    return asTier(localStorage.getItem(KEY))
  } catch {
    return null
  }
}

export function rememberTier(tier: number): void {
  try {
    localStorage.setItem(KEY, String(tier))
  } catch {
    // Storage blocked: the app opens on the highest tier with Umas next time.
  }
}

/** A tier the save has a world for, or null. Invalid or missing ones are ignored. */
export function savedTier(save: Save, tier: string | number | null | undefined): number | null {
  const n = asTier(tier)
  return n !== null && save.tierWorlds[tierKey(n)] ? n : null
}

/** Where the app opens: the asked tier, else the remembered one, else the highest tier whose world has an Uma, else 1. */
export function startTier(save: Save, asked: string | number | null, remembered: number | null): number {
  const withUmas = savedTiers(save).filter((t) => Object.keys(save.tierWorlds[tierKey(t)]!.umas).length > 0)
  return savedTier(save, asked) ?? savedTier(save, remembered) ?? withUmas.at(-1) ?? 1
}
