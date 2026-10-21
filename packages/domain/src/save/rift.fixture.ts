// Test-only (excluded from the build): a v23 save with the Rift in use (D163). Tier 1's first run is won and ascended,
// and its twenty live in Tier 2; its second is open, with twenty Tier 1 Umas.
import { newOwnedUma, newSave, newTierWorld, type Save } from './save'

export const RIFT_TIMES = ['2026-10-01T12:00:00.000Z', '2026-10-05T12:00:00.000Z', '2026-10-09T12:00:00.000Z', '2026-10-09T13:00:00.000Z', '2026-10-10T12:00:00.000Z'] as const
const [T0, T1, T2, T3, T4] = RIFT_TIMES
const twenty = (from: number): string[] => Array.from({ length: 20 }, (_, i) => `${from + i}`)
/** Tier 1's Umas, on the open run `t1-r2`. */
export const TIER1_ROSTER = twenty(101)
/** The ascended run `t1-r1`'s Umas, now in Tier 2. */
export const TIER2_ROSTER = twenty(201)

export function riftSave(): Save {
  const save = newSave('Rift test', T0)
  const t1 = save.tierWorlds['1']!, t2 = newTierWorld(T3, 0)
  for (const id of TIER1_ROSTER) t1.umas[id] = newOwnedUma(T0)
  for (const id of TIER2_ROSTER) t2.umas[id] = newOwnedUma(T3)
  t1.rift = {
    runs: [
      { id: 't1-r1', roster: [...TIER2_ROSTER], startedAt: T0, fronts: { iron: 12, arcane: 12, duel: 12, horde: 12 }, convergence: { attempts: 2 }, wonAt: T2, ascendedAt: T3 },
      { id: 't1-r2', roster: [...TIER1_ROSTER], startedAt: T4, fronts: { iron: 12, arcane: 3, duel: 0, horde: 0 }, convergence: { attempts: 0 }, wonAt: null, ascendedAt: null },
    ],
    echoes: { iron: { '50': T1 } },
  }
  save.tierWorlds['2'] = t2
  save.account.achievements = { 'rift-conquered': { at: T2, run: 't1-r1' }, bestiary: { at: T4, run: null } }
  save.account.history = Object.fromEntries(TIER2_ROSTER.map((id) => [id, [{ tier: 2, at: T3, run: 't1-r1' }]]))
  return save
}
