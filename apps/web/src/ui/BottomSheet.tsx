// A bottom sheet over the current screen: title, close, Escape, and focus moved in and back out. It renders into
// <body>, so an ancestor with a transform or backdrop filter (the maps' sticky header) can't become its containing block
// and squeeze it into that box.
import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon } from './icons'

export function BottomSheet({ title, onClose, children, footer }: { title: string; onClose: () => void; children: ReactNode; footer?: ReactNode }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      previous?.focus()
    }
  }, [onClose])
  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col justify-end" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="absolute inset-0 bg-black/55" aria-label="Close" tabIndex={-1} onClick={onClose} />
      <div className="pb-safe relative flex max-h-[85dvh] flex-col rounded-t-lg border-t border-hairline-strong bg-panel shadow-3">
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <h2 className="text-lg">{title}</h2>
          <button ref={closeRef} type="button" onClick={onClose} className="flex size-11 items-center justify-center rounded-full text-ink-soft" aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">{children}</div>
        {footer && <div className="border-t border-hairline px-4 py-3">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
