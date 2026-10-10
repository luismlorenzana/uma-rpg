// A place's full page (D43): header with ← (back to the Hub, or up from a sub-view), the name and an optional counter.
import { CURRENT_SLICE, isOpen, type Place } from '@rpg/domain'
import { Suspense } from 'react'
import { Navigate } from 'react-router'
import { useHubNavigation, peekPath } from '../hub/navigation'
import { BackIcon } from '../ui/icons'
import { PLACE_UI } from './registry'

export function PlacePage({ place, rest }: { place: Place; rest: string }) {
  const ui = PLACE_UI[place.id]
  const nav = useHubNavigation()
  if (!ui?.Page || !isOpen(place, CURRENT_SLICE)) return <Navigate to={peekPath(place)} replace />
  const Page = ui.Page
  const Counter = ui.Counter
  return (
    <div className="flex h-dvh flex-col bg-page">
      <header className="pt-safe z-20 border-b border-hairline bg-panel/95 backdrop-blur">
        <div className="flex min-h-13 items-center gap-1 px-1.5">
          <button
            type="button"
            onClick={() => (rest ? nav.subBack(place) : nav.toHub(place.page))}
            className="flex size-11 items-center justify-center rounded-full text-ink-soft"
            aria-label={rest ? `Back to ${place.name}` : 'Back to the Hub'}
          >
            <BackIcon />
          </button>
          <h1 className="min-w-0 flex-1 truncate text-lg">{place.name}</h1>
          {Counter && (
            <Suspense fallback={null}>
              <div className="pr-2">
                <Counter />
              </div>
            </Suspense>
          )}
        </div>
      </header>
      <main className="pb-safe min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <Suspense fallback={<p className="p-4 text-ink-soft">Loading…</p>}>
          <Page place={place} rest={rest} />
        </Suspense>
      </main>
    </div>
  )
}
