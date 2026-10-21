// The enemy roster (D135): the three franchises' units, each with a face, a vertical (`art`) and, above Regular, a splash;
// served by /api/content to the signed-in owner as enemies.json and loaded once a session. uma-kit/content owns the
// authenticated requests plus the in-memory and Cache Storage copies of hash-named images (SE3).
import { isEnemyTier, isFranchise, type EnemyTier, type Franchise, type RosterMember } from '@rpg/domain'
import { contentProblem } from '@luismlorenzana/uma-kit/content'
import { useSyncExternalStore } from 'react'
import { CONTENT } from './client'

export interface CastImage { path: string; width: number; height: number }
export interface CastMember extends RosterMember {
  franchise: Franchise
  tier: EnemyTier
  nameJa?: string
  /** Behind a face that doesn't fill its circle. */
  color: string
  /** A square face for round icons. */
  face: CastImage
  /** The 2:3 vertical the battle stage shows. */
  art: CastImage
  /** The 16:9 splash a Key enemy, Sub-boss or Boss cuts in with. */
  splash?: CastImage
}
export interface Cast {
  members: CastMember[]
  byId: Map<string, CastMember>
}
export type CastState = { status: 'idle' | 'loading' } | { status: 'ready'; cast: Cast } | { status: 'error'; message: string }

let state: CastState = { status: 'idle' }
const listeners = new Set<() => void>()
const set = (next: CastState) => {
  state = next
  for (const l of listeners) l()
}

const IMAGE = /^enemies\/[a-z0-9]+(-[a-z0-9]+)*-(face|art|splash)\.[a-f0-9]{8}\.webp$/
const isImage = (v: unknown): v is CastImage => {
  const i = v as CastImage | undefined
  return typeof i?.path === 'string' && IMAGE.test(i.path) && Number.isFinite(i.width) && Number.isFinite(i.height)
}

/** The list's units the game can use; anything malformed is left out rather than breaking the map. */
export function parseRoster(raw: unknown): CastMember[] {
  const { schemaVersion, units } = (raw ?? {}) as { schemaVersion?: number; units?: unknown }
  if (schemaVersion !== 2 || !Array.isArray(units) || units.length === 0) throw new Error('The enemy list is missing or empty')
  return units.filter((u): u is CastMember =>
    typeof u?.id === 'string' && typeof u?.name === 'string' && isFranchise(u?.franchise) && isEnemyTier(u?.tier) &&
    isImage(u?.face) && isImage(u?.art) && (u?.splash === undefined || isImage(u.splash)))
    .map((u) => ({ ...u, color: typeof u.color === 'string' ? u.color : '#3a4a66' }))
}

function loadCast(): void {
  if (state.status === 'loading' || state.status === 'ready') return
  set({ status: 'loading' })
  void (async () => {
    try {
      const bytes = await CONTENT.pack('enemies.json')
      const members = parseRoster(JSON.parse(new TextDecoder().decode(bytes)))
      set({ status: 'ready', cast: { members, byId: new Map(members.map((m) => [m.id, m])) } })
    } catch (err) {
      set({ status: 'error', message: contentProblem(err) === 'missing' ? 'The enemies haven’t been published yet.' : err instanceof Error ? err.message : String(err) })
    }
  })()
}

export function retryCast(): void {
  if (state.status === 'error') {
    set({ status: 'idle' })
    loadCast()
  }
}

export function useCast(): CastState {
  const snapshot = useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => state,
    () => state,
  )
  if (snapshot.status === 'idle') queueMicrotask(loadCast)
  return snapshot
}

/** A blob URL for an enemy image (`enemies/<unit>-<role>.<hash>.webp`). */
export const castArtUrl = (path: string): Promise<string> => CONTENT.packUrl(path)
