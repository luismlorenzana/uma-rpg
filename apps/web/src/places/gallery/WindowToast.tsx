// "Window +1 · Craft 30" (D283, H155 decision 8): a short note when a change on this device lights steps, a fight's
// included. A sync that brings steps lit elsewhere and the switch's first credit stay quiet. Lazy, mounted from save v35.
import { useEffect, useRef, useState } from 'react'
import { masterRoster } from '../../master/master'
import { useGame } from '../../save/game'
import { litBetween, windowToast } from './glass-view'

const SHOWN_MS = 2600

export default function WindowToast() {
  const [toast, setToast] = useState<{ key: number; title: string; line: string } | null>(null)
  const count = useRef(0)
  useEffect(() => useGame.subscribe((state, prev) => {
    const after = state.save?.account, before = prev.save?.account
    if (!after || !before || after.windows === before.windows || !state.dirty || !before.windowsStart) return
    const names = new Map((masterRoster() ?? []).map((o) => [o.outfitId, o.name]))
    const next = windowToast(litBetween(before.windows, after.windows), (id) => names.get(id) ?? 'An Uma')
    if (next) setToast({ key: (count.current += 1), ...next })
  }), [])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), SHOWN_MS)
    return () => clearTimeout(t)
  }, [toast])
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+84px)] z-50 flex justify-center px-4">
      {toast && (
        <p key={toast.key} className="rounded-md bg-panel px-4 py-2 text-center text-[13px] shadow-2 ring-1 ring-hairline-strong" data-window-toast>
          <b className="block font-display">{toast.title}</b>
          {toast.line}
        </p>
      )}
    </div>
  )
}
