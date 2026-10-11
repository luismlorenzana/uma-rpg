// Push notifications when work and training finish (D63). iOS delivers Web Push only to the Home Screen app (16.4+);
// the server pushes from a Cloud Scheduler tick, so nothing runs on the phone until a notification arrives.
import { authHeaders } from '../api/client'

export type PushState = 'loading' | 'unsupported' | 'install' | 'unavailable' | 'denied' | 'off' | 'on'

const standalone = (): boolean =>
  window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true

async function call(path: string, method: string, body?: unknown): Promise<Response> {
  return fetch(path, { method, headers: { 'Content-Type': 'application/json', ...(await authHeaders()) }, body: body === undefined ? undefined : JSON.stringify(body) })
}

export async function pushState(): Promise<PushState> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
    return /iPhone|iPad|iPod/.test(navigator.userAgent) && !standalone() ? 'install' : 'unsupported'
  }
  if (Notification.permission === 'denied') return 'denied'
  // No service worker in development: push only works in a production build.
  const reg = await navigator.serviceWorker.getRegistration()
  if (!reg) return 'unavailable'
  return (await reg.pushManager.getSubscription()) ? 'on' : 'off'
}

/** The server's VAPID public key, or null when push is off there. Fetch it before the tap: iOS wants the permission
 * prompt straight from the gesture. */
export async function pushKey(): Promise<string | null> {
  const res = await call('/api/push/key', 'GET').catch(() => null)
  if (!res?.ok) return null
  return ((await res.json()) as { publicKey: string }).publicKey
}

function keyBytes(base64url: string): Uint8Array<ArrayBuffer> {
  const b64 = (base64url + '='.repeat((4 - (base64url.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(b64)
  const out = new Uint8Array(new ArrayBuffer(raw.length))
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i)
  return out
}

/** Call from the tap itself. */
export async function enablePush(publicKey: string): Promise<void> {
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') throw new Error('Notifications are blocked. Allow them for Uma RPG in Settings.')
  const reg = await navigator.serviceWorker.ready
  const sub = (await reg.pushManager.getSubscription()) ?? (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(publicKey) }))
  const res = await call('/api/push/subscription', 'PUT', sub.toJSON())
  if (!res.ok) throw new Error('Couldn’t reach the server. Try again.')
}

export async function disablePush(): Promise<void> {
  const reg = await navigator.serviceWorker.getRegistration()
  const sub = await reg?.pushManager.getSubscription()
  if (!sub) return
  await call('/api/push/subscription', 'DELETE', sub.toJSON()).catch(() => null)
  await sub.unsubscribe()
}

export async function testPush(): Promise<number> {
  const res = await call('/api/push/test', 'POST')
  return res.ok ? ((await res.json()) as { devices: number }).devices : 0
}

/** Opening the app clears the badge a push set. */
export function clearBadgeOnOpen(): void {
  const clear = () => {
    if (document.visibilityState === 'visible') void (navigator as Navigator & { clearAppBadge?: () => Promise<void> }).clearAppBadge?.().catch(() => {})
  }
  clear()
  document.addEventListener('visibilitychange', clear)
}
