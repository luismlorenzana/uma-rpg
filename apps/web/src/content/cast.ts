// The private PriConne cast (D50): names and bust portraits served by /api/content to the signed-in owner, loaded once a
// session. Portraits are hash-named, so their blob URLs are kept for the session and the service worker caches the bytes.
import type { RpgCastMember } from '@rpg/domain'
import { useSyncExternalStore } from 'react'
import { authHeaders } from '../api/client'

export interface CastMember extends RpgCastMember {
  nameJa: string
  color: string
  art: { path: string; width: number; height: number }
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

function parseCast(raw: unknown): Cast {
  const members = (raw as { schemaVersion?: number; members?: unknown })?.members
  if ((raw as { schemaVersion?: number }).schemaVersion !== 1 || !Array.isArray(members) || members.length === 0) throw new Error('The cast list is missing or empty')
  const valid = members.filter((m): m is CastMember =>
    typeof m?.id === 'string' && typeof m?.name === 'string' && typeof m?.art?.path === 'string' && /^cast\/[a-z0-9_-]+\.[a-f0-9]{8}\.webp$/.test(m.art.path))
  return { members: valid, byId: new Map(valid.map((m) => [m.id, m])) }
}

export function loadCast(): void {
  if (state.status === 'loading' || state.status === 'ready') return
  set({ status: 'loading' })
  void (async () => {
    try {
      const res = await fetch('/api/content/cast.json', { headers: await authHeaders() })
      if (!res.ok) throw new Error(res.status === 404 ? 'The cast hasn’t been published yet.' : `cast ${res.status}`)
      set({ status: 'ready', cast: parseCast(await res.json()) })
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
