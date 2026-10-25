// Test-only constructors for R2's graded save shape (H74). H75–H78 extend these instead of duplicating v28-shaped rows.
import { newGrades, type AccessoryFamily, type AccessorySlotState } from '../economy/grades'
import { CORE_NODES, MAP_NODES, type StarMap } from '../economy/planet'
import type { RpgClass, RpgDamageKind } from '../rpg/kinds'
import { UMA_KNACKS, type UmaKnack } from '../roster/template'
import type { BattleOutfit } from './class'
import { newOwnedUma, newTierWorld, type OwnedUma, type TierWorld } from './save'

export const ECONOMY_V3_NOW = '2026-10-25T12:00:00.000Z'

export function gradedUma(overrides: Partial<OwnedUma> = {}): OwnedUma {
  const fresh = newOwnedUma(ECONOMY_V3_NOW, 'brawler')
  return { ...fresh, classId: 'brawler', ...overrides, gear: overrides.gear ?? newGrades(1) }
}

export function gradedWorld(overrides: Partial<TierWorld> = {}): TierWorld {
  const fresh = newTierWorld(ECONOMY_V3_NOW, 0)
  const { gearMarks: _retired, ...wallet } = fresh.wallet
  return { ...fresh, ...overrides, wallet: { ...wallet, ...overrides.wallet }, umas: overrides.umas ?? { '101': gradedUma() } }
}

/** A v3 map (H76) with these nodes open. */
export const starMap = (...open: string[]): StarMap => ({ open, moons: [] })
/** The full core, 20 nodes, and the full map with her moon's two. */
export const FULL_CORE: StarMap = starMap(...CORE_NODES)
export const FULL_MAP: StarMap = starMap(...MAP_NODES)

/** The growth stat each knack reads (her top growth rate). */
const KNACK_GROWTH: Readonly<Record<UmaKnack, keyof BattleOutfit['growthRatePercents']>> = {
  fleet: 'speed', tireless: 'stamina', mighty: 'power', gritty: 'guts', clever: 'wit',
}
/**
 * An invented outfit whose template (H67) has this knack and a calling on this channel (UT10's two readings for her
 * moon): base 110 everywhere and +20% growth on her knack's stat; physical is a Front runner (row 1, the Brawler),
 * magical an End closer (row 3, the Summoner). Medium A, a Middle stride.
 */
export function templateOutfit(outfitId: string, knack: UmaKnack, channel: 'physical' | 'magical'): BattleOutfit {
  const growth = { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0 }
  growth[KNACK_GROWTH[knack]] = 20
  const front = channel === 'physical'
  return {
    outfitId, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 }, growthRatePercents: growth,
    aptitudes: { strategy: { front: front ? 'A' : 'G', pace: 'G', late: 'G', end: front ? 'G' : 'A' },
      distance: { sprint: 'G', mile: 'G', medium: 'A', long: 'G' } },
  }
}
/** Every knack on both channels, for tables. */
export const TEMPLATE_CASES: readonly { knack: UmaKnack; channel: 'physical' | 'magical'; calling: RpgClass }[] =
  UMA_KNACKS.flatMap((knack) => (['physical', 'magical'] as const).map((channel) => ({ knack, channel, calling: channel === 'physical' ? 'brawler' as const : 'summoner' as const })))

// --- Accessories v3 (H75) ---------------------------------------------------------------------------------------------

/** An accessory slot (R2): a family's base form at a grade, with an Orb's or a Bell's kind. */
export function accessorySlot(family: AccessoryFamily | null, grade: number, kind?: RpgDamageKind): AccessorySlotState {
  return { grade, family, form: 'base', ...(kind ? { kind } : {}) }
}
