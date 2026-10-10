// The side overlay a place opens in (T006): slides in from the right over most of the screen, the Hub dimmed behind.
// Closes with ✕, a swipe right, a tap on the Hub, Escape or back; keeps focus inside and returns it on close.
import type { Place } from '@rpg/domain'
import { Suspense, useEffect, useRef, type ReactNode } from 'react'
import { CloseIcon } from '../ui/icons'
import { swipeDirection, type Point } from './swipe'

export function OverlayHost({ place, onClose, children }: { place: Place; onClose: () => void; children: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const start = useRef<Point | null>(null)

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    closeButton.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key !== 'Tab' || !panel.current) return
      const focusable = panel.current.querySelectorAll<HTMLElement>('button, a[href], input, [tabindex]:not([tabindex="-1"])')
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      const target = previous ?? document.querySelector<HTMLElement>(`[data-place="${place.id}"]`)
      target?.focus()
    }
  }, [onClose, place.id])

  return (
    <div className="fixed inset-0 z-30" role="dialog" aria-modal="true" aria-labelledby="overlay-title">
      <button type="button" className="absolute inset-0 bg-black/45" aria-label="Back to the Hub" onClick={onClose} tabIndex={-1} />
      <div
        ref={panel}
        className="animate-[overlay-in_220ms_cubic-bezier(0.2,0,0,1)] pt-safe pb-safe absolute inset-y-0 right-0 flex w-[88%] max-w-md flex-col border-l border-hairline-strong bg-panel shadow-3"
        onPointerDown={(e) => (start.current = { x: e.clientX, y: e.clientY })}
        onPointerUp={(e) => {
          if (start.current && swipeDirection(start.current, { x: e.clientX, y: e.clientY }) === -1) onClose()
          start.current = null
        }}
      >
        <div className="flex items-center gap-2 border-b border-hairline px-4 py-2">
          <h2 id="overlay-title" className="min-w-0 flex-1 truncate text-lg">{place.name}</h2>
          <button ref={closeButton} type="button" onClick={onClose} className="flex size-11 items-center justify-center rounded-full text-ink-soft" aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <Suspense fallback={<p className="p-4 text-ink-soft">Loading…</p>}>{children}</Suspense>
        </div>
      </div>
    </div>
  )
}
