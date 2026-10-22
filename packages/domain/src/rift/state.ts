// The Rift's save shape, constants and achievement ids (D161; save v23, D163; save v24, D171). Its generator and run
// rules come with the Rift (docs/design/rift.md §10); until then nothing writes a run. In the main bundle: types and
// small constants only.
import type { BattleAction, BattleInput } from '../rpg/battle/types'

/** The four fronts (rift.md §5). */
export const RIFT_FRONTS = ['iron', 'arcane', 'duel', 'horde'] as const
export type RiftFront = (typeof RIFT_FRONTS)[number]
/** A front's stages; clearing the 12th seals it. */
export const RIFT_STAGES = 12
/** The Umas a run signs up (R2). */
export const RIFT_ROSTER = 20
/** The Echoes' three difficulties, as save keys (R6). */
export const ECHO_LEVELS = ['45', '50', '55'] as const
export type EchoLevel = (typeof ECHO_LEVELS)[number]
/** The tiers whose Rift can run (T9: Tier 3's waits for its fifth scenario). */
export const RIFT_TIERS = [1, 2] as const
/** What a front's won fights showed in a run: damage of a channel dealt by the party, an Uma knocked out. */
export const RIFT_TRACES = ['physical', 'magical', 'ko'] as const
export type RiftTrace = (typeof RIFT_TRACES)[number]
/** The Convergence's fights, one per front in `RIFT_FRONTS` order (§6). */
export const CONVERGENCE_FIGHTS = 4

/** An attempt at the Convergence: four parties frozen at its start, and the rounds of each fight won so far. */
export interface RiftAttempt { parties: string[][]; rounds: number[] }

/** One run of a tier's Rift (rift.md §4). Unset times are null, never absent: Firestore refuses `undefined`. */
export interface RiftRun {
  /** `t<tier>-r<n>`: n is its place in this world's runs, from 1. */
  id: string
  /** The twenty outfit ids signed up. */
  roster: string[]
  startedAt: string
  /** Stages cleared on each front, 0–12. */
  fronts: Record<RiftFront, number>
  convergence: { attempts: number; open: RiftAttempt | null }
  /** By front, what its won fights in this run showed, in `RIFT_TRACES` order; absent: nothing yet. */
  traces: Partial<Record<RiftFront, RiftTrace[]>>
  wonAt: string | null
  ascendedAt: string | null
}

/** Which Rift fight: a front's stage (1–12), a Convergence fight (0–3), or an Echo. */
export type RiftFightRef =
  | { kind: 'front'; front: RiftFront; stage: number }
  | { kind: 'convergence'; fight: number }
  | { kind: 'echo'; front: RiftFront; level: EchoLevel }

/** The open Rift fight, replayed from its input and actions (D52). */
export interface RiftBattle { battleId: string; ref: RiftFightRef; startedAt: string; input: BattleInput; actions: BattleAction[] }

/** A tier world's Rift: its runs, oldest first, the time each Echo was first won (absent: never won), and its fights. */
export interface RiftState {
  runs: RiftRun[]
  echoes: Partial<Record<RiftFront, Partial<Record<EchoLevel, string>>>>
  /** One open Rift fight a world at most. */
  battle: RiftBattle | null
  /** Rift fights started in this world; the next fight's id and seed come from it. */
  battles: number
}

export const newRiftState = (): RiftState => ({ runs: [], echoes: {}, battle: null, battles: 0 })
export const riftRunId = (tier: number, n: number): string => `t${tier}-r${n}`
/** `rift:t<tier>:<n>`, n counting this world's Rift fights from 1. */
export const riftBattleId = (tier: number, n: number): string => `rift:t${tier}:${n}`

/** A fight's stable key, for seeds and screens: `iron:5`, `convergence:2`, `echo:iron:55`. */
export function riftRefKey(ref: RiftFightRef): string {
  switch (ref.kind) {
    case 'front': return `${ref.front}:${ref.stage}`
    case 'convergence': return `convergence:${ref.fight}`
    case 'echo': return `echo:${ref.front}:${ref.level}`
  }
}

/** The achievement catalog's ids (D161 §7). The four seals and "Rift conquered" carry their tier (a run's seals belong
 * to it, R9; tier2-world §12); the titles are earned once per account, in any tier. */
export const RIFT_TITLES = ['iron-will', 'arcane-purity', 'untouched-iron', 'untouched-arcane', 'untouched-duel',
  'untouched-horde', 'swift-convergence', 'bestiary', 'crossover'] as const
export const sealId = (tier: number, front: RiftFront): string => `t${tier}-seal-${front}`
export const conqueredId = (tier: number): string => `t${tier}-rift-conquered`
export const ACHIEVEMENT_IDS: readonly string[] =
  [...RIFT_TIERS.flatMap((t) => [...RIFT_FRONTS.map((f) => sealId(t, f)), conqueredId(t)]), ...RIFT_TITLES]
export type AchievementId = string
export const isAchievementId = (id: string): boolean => ACHIEVEMENT_IDS.includes(id)
