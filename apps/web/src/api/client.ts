// Fetch client with a pluggable token provider (uma-racer's pattern). The API is same-origin: /api is proxied by Vite in
// dev and rewritten to Cloud Run by Firebase Hosting in production.
import type { Save, SaveEnvelope } from '@rpg/domain'

let tokenProvider: () => Promise<string | null> = async () => null
export function setTokenProvider(fn: () => Promise<string | null>): void {
  tokenProvider = fn
}

export async function authHeaders(): Promise<Record<string, string>> {
  const token = await tokenProvider()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/** Also used by the save tests' dynamic importOriginal API mock. */
export class ApiError extends Error {
  readonly path: string
  readonly status: number
  readonly body: unknown
  constructor(path: string, status: number, body: unknown) {
    super(`API ${status} on ${path}`)
    this.name = 'ApiError'
    this.path = path
    this.status = status
    this.body = body
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(await authHeaders()), ...init.headers },
  })
  const text = await res.text()
  const body: unknown = text ? JSON.parse(text) : null
  if (!res.ok) throw new ApiError(path, res.status, body)
  return body as T
}

export const saveApi = {
  load: () => request<SaveEnvelope>('/api/save'),
  put: (baseRevision: number, save: Save) => request<SaveEnvelope>('/api/save', { method: 'PUT', body: JSON.stringify({ baseRevision, save }) }),
}

/** The stored envelope a 409 carries, or null when the error isn't a revision conflict. */
export function conflictEnvelope(error: unknown): SaveEnvelope | null {
  if (!(error instanceof ApiError) || error.status !== 409) return null
  const current = (error.body as { current?: SaveEnvelope } | null)?.current
  return current && typeof current.revision === 'number' ? current : null
}
