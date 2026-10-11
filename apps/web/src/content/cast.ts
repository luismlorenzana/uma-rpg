// The foes' faces, by franchise (D50, D76): PriConne's cast (required), Azur Lane's and Puzzle & Dragons' (optional until
// published), served by /api/content to the signed-in owner and loaded once a session. Portraits are hash-named, so
// their blob URLs are kept for the session and the service worker caches the bytes.
import { isRpgElement, type Franchise, type RpgCastMember } from '@rpg/domain'
import { useSyncExternalStore } from 'react'
import { authHeaders } from '../api/client'

export interface CastMember extends RpgCastMember {
  nameJa: string
  color: string
  art: { path: string; width: number; height: number }
}
export interface Cast {
  /** Every pack's members. */
  members: CastMember[]
  byId: Map<string, CastMember>
  packs: Record<Franchise, CastMember[]>
}
export type CastState = { status: 'idle' | 'loading' } | { status: 'ready'; cast: Cast } | { status: 'error'; message: string }

let state: CastState = { status: 'idle' }
const listeners = new Set<() => void>()
const set = (next: CastState) => {
  state = next
  for (const l of listeners) l()
}

function parsePack(raw: unknown, folder: string): CastMember[] {
  const members = (raw as { schemaVersion?: number; members?: unknown })?.members
  if ((raw as { schemaVersion?: number }).schemaVersion !== 1 || !Array.isArray(members) || members.length === 0) throw new Error('The cast list is missing or empty')
  const art = new RegExp(`^${folder}cast\\/[a-z0-9_-]+\\.[a-f0-9]{8}\\.(webp|png)$`)
  return members.filter((m): m is CastMember =>
    typeof m?.id === 'string' && typeof m?.name === 'string' && typeof m?.art?.path === 'string' && art.test(m.art.path) &&
    (m.element === undefined || isRpgElement(m.element)))
}

async function fetchPack(folder: string): Promise<CastMember[] | null> {
  const res = await fetch(`/api/content/${folder}cast.json`, { headers: await authHeaders() })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`cast ${res.status}`)
  return parsePack(await res.json(), folder)
}

export function loadCast(): void {
  if (state.status === 'loading' || state.status === 'ready') return
  set({ status: 'loading' })
  void (async () => {
    try {
      const [priconne, azurlane, pad] = await Promise.all([fetchPack(''), fetchPack('azurlane/').catch(() => null), fetchPack('pad/').catch(() => null)])
      if (!priconne) throw new Error('The cast hasn’t been published yet.')
      const packs: Record<Franchise, CastMember[]> = { priconne, azurlane: azurlane ?? [], pad: pad ?? [] }
      const members = [...packs.priconne, ...packs.azurlane, ...packs.pad]
      set({ status: 'ready', cast: { members, byId: new Map(members.map((m) => [m.id, m])), packs } })
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

/** A blob URL for a cast portrait (`cast/<slug>.<hash>.webp`). */
export function castArtUrl(path: string): Promise<string> {
  let url = blobUrls.get(path)
  if (!url) {
    url = (async () => {
      const res = await fetch(`/api/content/${path}`, { headers: await authHeaders() })
      if (!res.ok) throw new Error(`cast art ${res.status}`)
      return URL.createObjectURL(await res.blob())
    })()
    url.catch(() => blobUrls.delete(path))
    blobUrls.set(path, url)
  }
  return url
}
