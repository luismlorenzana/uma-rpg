// The Account's notification switch (D63).
import { useEffect, useState } from 'react'
import { disablePush, enablePush, pushKey, pushState, testPush, type PushState } from './push'

const NOTE: Partial<Record<PushState, string>> = {
  install: 'Add Uma RPG to your Home Screen (Share → Add to Home Screen), then turn them on from there.',
  unsupported: 'This browser can’t receive notifications.',
  unavailable: 'Notifications work in the installed app.',
  denied: 'Notifications are blocked. Allow them for Uma RPG in Settings → Notifications.',
}

export function NotificationsCard() {
  const [state, setState] = useState<PushState>('loading')
  const [key, setKey] = useState<string | null | undefined>(undefined)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  useEffect(() => {
    void pushState().then(setState)
    void pushKey().then(setKey)
  }, [])
  const on = state === 'on'
  const ready = state === 'on' || state === 'off'
  const toggle = () => {
    if (busy || !ready || (!on && !key)) return
    setBusy(true)
    setMessage(null)
    const op = on ? disablePush() : enablePush(key!)
    op.then(() => pushState().then(setState), (err: unknown) => setMessage(err instanceof Error ? err.message : 'That didn’t work.')).finally(() => setBusy(false))
  }
  return (
    <section className="rounded-md bg-raised p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[14px] font-semibold">Notifications</p>
          <p className="text-[12px] text-ink-soft">Work and training done</p>
        </div>
        <button type="button" role="switch" aria-checked={on} aria-label="Notify me when work finishes" disabled={!ready || busy || (!on && key === null)} onClick={toggle}
          className={`relative h-8 w-14 shrink-0 rounded-full transition-colors disabled:opacity-40 ${on ? 'bg-accent' : 'bg-sunken'}`}>
          <span className={`absolute top-1 size-6 rounded-full bg-white shadow-2 transition-all ${on ? 'left-7' : 'left-1'}`} />
        </button>
      </div>
      {NOTE[state] && <p className="mt-2 text-[12px] text-ink-faint">{NOTE[state]}</p>}
      {on && (
        <button type="button" onClick={() => void testPush().then((n) => setMessage(n > 0 ? 'Sent: it should arrive in a moment.' : 'No device is subscribed.'))}
          className="mt-2 min-h-9 rounded-sm bg-panel px-3 text-[12px] font-semibold">Send a test</button>
      )}
      {message && <p className="mt-2 text-[12px] text-ink-soft">{message}</p>}
    </section>
  )
}
