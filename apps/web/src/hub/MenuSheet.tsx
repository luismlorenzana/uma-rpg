import { CURRENT_SLICE, HUB_PAGE_NAMES, HUB_PAGES, isOpen, placeById, placesOn, type Place } from '@rpg/domain'
import { useEffect, useRef } from 'react'
import { CloseIcon, LockIcon } from '../ui/icons'

/** Every place grouped by page, plus the Account and the Guide (T006 global menu). */
export function MenuSheet({ onClose, onOpen }: { onClose: () => void; onOpen: (place: Place) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  const account = placeById('account')
  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end" role="dialog" aria-modal="true" aria-label="Menu">
      <button type="button" className="absolute inset-0 bg-black/55" aria-label="Close menu" onClick={onClose} />
      <div className="pb-safe relative max-h-[82dvh] overflow-y-auto rounded-t-lg border-t border-hairline-strong bg-panel shadow-3">
        <div className="sticky top-0 flex items-center justify-between bg-panel/95 px-4 py-3 backdrop-blur">
          <h2 className="text-lg">Every place</h2>
          <button ref={closeRef} type="button" onClick={onClose} className="flex size-11 items-center justify-center rounded-full text-ink-soft" aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        <div className="space-y-4 px-4 pb-4">
          {HUB_PAGES.map((page) => (
            <section key={page}>
              <h3 className="text-micro mb-1.5">{HUB_PAGE_NAMES[page]}</h3>
              <ul className="grid grid-cols-2 gap-1.5">
                {placesOn(page).map((place) => (
                  <li key={place.id}>
                    <button type="button" onClick={() => onOpen(place)} className="flex min-h-11 w-full items-center justify-between gap-2 rounded-sm bg-raised px-3 text-left text-[13px] font-semibold">
                      <span className="truncate">{place.name}</span>
                      {!isOpen(place, CURRENT_SLICE) && <LockIcon size={14} className="shrink-0 text-locked" aria-label="Not open yet" />}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <section className="grid grid-cols-2 gap-1.5 border-t border-hairline pt-3">
            {account && (
              <button type="button" onClick={() => onOpen(account)} className="min-h-11 rounded-sm bg-raised px-3 text-left text-[13px] font-semibold">
                Account
              </button>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
