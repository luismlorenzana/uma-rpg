// The enemy roster (D135): the three franchises' units, each with a face, a vertical (`art`) and, above Regular, a splash;
// served by /api/content to the signed-in owner as enemies.json and loaded once a session. Images are hash-named, so
// their blob URLs are kept for the session and the service worker caches the bytes.
import { isEnemyTier, isFranchise, type EnemyTier, type Franchise, type RosterMember } from '@rpg/domain'
import { useSyncExternalStore } from 'react'
import { authHeaders } from '../api/client'

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
      const res = await fetch('/api/content/enemies.json', { headers: await authHeaders() })
      if (res.status === 404) throw new Error('The enemies haven’t been published yet.')
      if (!res.ok) throw new Error(`enemies ${res.status}`)
      const members = parseRoster(await res.json())
      set({ status: 'ready', cast: { members, byId: new Map(members.map((m) => [m.id, m])) } })
    } catch (err) {
      set({ status: 'error', message: err instanceof Error ? err.message : String(err) })
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

const blobUrls = new Map<string, Promise<string>>()

/** A blob URL for an enemy image (`enemies/<unit>-<role>.<hash>.webp`). */
export function castArtUrl(path: string): Promise<string> {
  let url = blobUrls.get(path)
  if (!url) {
    url = (async () => {
      const res = await fetch(`/api/content/${path}`, { headers: await authHeaders() })
      if (!res.ok) throw new Error(`enemy image ${res.status}`)
      return URL.createObjectURL(await res.blob())
    })()
    url.catch(() => blobUrls.delete(path))
    blobUrls.set(path, url)
  }
  return url
}
