// Achievements (D161 §7; the hook's contract from save v24, D171; the catalog and rules, H49). The run rules (H48's
// `settleRiftFight`) call `achievementsEarned` when they settle a won Rift fight and store each grant on the account.
// The catalog (`ACHIEVEMENTS`) is small and is exported from `src/index.ts` for the Account's list; the rules reach the
// app through the Rift's own subpath.
import type { BattleState } from '../rpg/battle/types'
import type { EnemyRoster } from '../world/roster'
import {
  ACHIEVEMENT_IDS, CONVERGENCE_FIGHTS, conqueredId, RIFT_FRONTS, RIFT_STAGES, RIFT_TIERS, sealId,
  type AchievementId, type RiftFightRef, type RiftFront, type RiftRun,
} from './state'

/** A won Rift fight once the run rules have recorded it (H48's `settleRiftFight`). */
export interface RiftWin {
  tier: number
  ref: RiftFightRef
  /** The run after this win (front and Convergence fights); null for an Echo. */
  run: RiftRun | null
  /** A Convergence fight: the attempt's rounds including this one (the attempt closes on its last win); else null. */
  attemptRounds: number[] | null
  /** The finished fight: the party is `state.input.allies`, the rounds `state.round`. */
  state: BattleState
  /** The account's defeated faces after this win. */
  defeated: Readonly<Record<string, string>>
  roster: EnemyRoster
}

/** An achievement a win earns, with the run it came from (null for the Bestiary). */
export interface AchievementGrant { id: AchievementId; run: string | null }

/** One entry of the catalog: its words and its uma-art `ui` frame (2.11.0). */
export interface AchievementDef {
  id: AchievementId
  kind: 'seal' | 'conquered' | 'title'
  /** The tier a seal or "Rift conquered" belongs to; null for a title. */
  tier: number | null
  /** The front a seal or Untouched names; null otherwise. */
  front: RiftFront | null
  name: string
  /** One short line: how it's earned. */
  how: string
  /** Its uma-art `ui` frame. */
  badge: string
}

export const FRONT_NAME: Readonly<Record<RiftFront, string>> = { iron: 'Iron', arcane: 'Arcane', duel: 'Duel', horde: 'Horde' }
/** Swift Convergence: every Convergence fight of the attempt won in fewer rounds than this. */
export const SWIFT_CONVERGENCE_ROUNDS = 8
/** Crossover: the different classes one party fields (rift.md §7's "all six", for today's five classes; H49). */
export const CROSSOVER_CLASSES = 5

const title = (id: string, name: string, how: string, front: RiftFront | null = null): AchievementDef =>
  ({ id, kind: 'title', tier: null, front, name, how, badge: `achievement/${front ? 'untouched' : id}` })
const DEFS: readonly AchievementDef[] = [
  ...RIFT_TIERS.flatMap((tier): AchievementDef[] => [
    ...RIFT_FRONTS.map((front): AchievementDef => ({ id: sealId(tier, front), kind: 'seal', tier, front, name: `${FRONT_NAME[front]} Seal`,
      how: `Win the ${FRONT_NAME[front]} front’s champion`, badge: `achievement/seal-${front}` })),
    { id: conqueredId(tier), kind: 'conquered', tier, front: null, name: 'Rift Conquered', how: 'Win the Convergence', badge: 'achievement/rift-conquered' },
  ]),
  title('iron-will', 'Iron Will', 'Seal Iron with no magic dealt'),
  title('arcane-purity', 'Arcane Purity', 'Seal Arcane with no physical damage'),
  ...RIFT_FRONTS.map((front) => title(`untouched-${front}`, `Untouched · ${FRONT_NAME[front]}`, `Seal ${FRONT_NAME[front]} with no Uma knocked out`, front)),
  title('swift-convergence', 'Swift Convergence', 'Win the Convergence, every fight under 8 rounds'),
  title('bestiary', 'Bestiary', 'Defeat every boss and sub-boss'),
  title('crossover', 'Crossover', 'Win a champion with five classes in one party'),
]
const BY_ID = new Map(DEFS.map((d) => [d.id, d]))

/** The catalog, in `ACHIEVEMENT_IDS` order: each tier's four seals and "Rift Conquered", then the nine titles. */
export const ACHIEVEMENTS: readonly AchievementDef[] = ACHIEVEMENT_IDS.flatMap((id) => BY_ID.get(id) ?? [])
export const achievementDef = (id: string): AchievementDef | undefined => BY_ID.get(id)

/** What this win earns that `held` (the account's achievements) lacks, in `ACHIEVEMENT_IDS` order. */
export function achievementsEarned(win: RiftWin, held: Readonly<Record<string, unknown>>): AchievementGrant[] {
  if (win.state.outcome !== 'victory') return []
  const { ref, run, tier } = win
  const earned = new Map<AchievementId, string | null>()
  const bosses = win.roster.filter((m) => m.tier === 'boss' || m.tier === 'subboss')
  if (bosses.length > 0 && bosses.every((m) => win.defeated[m.id] !== undefined)) earned.set('bestiary', null)
  if (run && ref.kind !== 'echo') {
    const champion = ref.kind === 'front' && ref.stage === RIFT_STAGES
    const finale = ref.kind === 'convergence' && ref.fight === CONVERGENCE_FIGHTS - 1
    if (ref.kind === 'front' && champion) {
      const traces = run.traces[ref.front] ?? []
      earned.set(sealId(tier, ref.front), run.id)
      if (ref.front === 'iron' && !traces.includes('magical')) earned.set('iron-will', run.id)
      if (ref.front === 'arcane' && !traces.includes('physical')) earned.set('arcane-purity', run.id)
      if (!traces.includes('ko')) earned.set(`untouched-${ref.front}`, run.id)
    }
    if (finale) {
      earned.set(conqueredId(tier), run.id)
      const rounds = win.attemptRounds ?? []
      if (rounds.length === CONVERGENCE_FIGHTS && rounds.every((r) => r < SWIFT_CONVERGENCE_ROUNDS)) earned.set('swift-convergence', run.id)
    }
    if ((champion || ref.kind === 'convergence') && new Set(win.state.input.allies.map((a) => a.classId)).size >= CROSSOVER_CLASSES) {
      earned.set('crossover', run.id)
    }
  }
  return ACHIEVEMENT_IDS.filter((id) => earned.has(id) && held[id] === undefined).map((id) => ({ id, run: earned.get(id) ?? null }))
}
