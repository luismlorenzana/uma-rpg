// The Rift's save shape and constants (D161, save v23). Its generator and run rules come with the Rift
// (docs/design/rift.md §10); until then nothing writes a run.

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

/** One run of a tier's Rift (rift.md §4). Unset times are null, never absent: Firestore refuses `undefined`. */
export interface RiftRun {
  /** `t<tier>-r<n>`: n is its place in this world's runs, from 1. */
  id: string
  /** The twenty outfit ids signed up. */
  roster: string[]
  startedAt: string
  /** Stages cleared on each front, 0–12. */
  fronts: Record<RiftFront, number>
  convergence: { attempts: number }
  wonAt: string | null
  ascendedAt: string | null
}

/** A tier world's Rift: its runs, oldest first, and the time each Echo was first won (absent: never won). */
export interface RiftState {
  runs: RiftRun[]
  echoes: Partial<Record<RiftFront, Partial<Record<EchoLevel, string>>>>
}

export const newRiftState = (): RiftState => ({ runs: [], echoes: {} })
export const riftRunId = (tier: number, n: number): string => `t${tier}-r${n}`
