// Test-only constructors for R2's graded save shape (H74). H75–H78 extend these instead of duplicating v28-shaped rows.
import { newGrades } from '../economy/grades'
import { newOwnedUma, newTierWorld, type OwnedUma, type TierWorld } from './save'

export const ECONOMY_V3_NOW = '2026-10-25T12:00:00.000Z'

export function gradedUma(overrides: Partial<OwnedUma> = {}): OwnedUma {
  const fresh = newOwnedUma(ECONOMY_V3_NOW, 'brawler', 17)
  return { ...fresh, classId: 'brawler', ...overrides, gear: overrides.gear ?? newGrades(1) }
}

export function gradedWorld(overrides: Partial<TierWorld> = {}): TierWorld {
  const fresh = newTierWorld(ECONOMY_V3_NOW, 0)
  const { gearMarks: _retired, ...wallet } = fresh.wallet
  return { ...fresh, ...overrides, wallet: { ...wallet, ...overrides.wallet }, umas: overrides.umas ?? { '101': gradedUma() } }
}
