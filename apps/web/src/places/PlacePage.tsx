// A place's page (D43, D147): uma-kit's place header (Back, the name, an optional counter and (i) with its blurb) over a
// scrolling body, inside the shell's bars. Back pops to where the page was opened from, or goes up: a sub-view to its
// place, a place to its page.
import { HUB_PAGE_NAMES, placeOpen, type Place } from '@rpg/domain'
import { PlaceHeader, peekPath, useLeave } from '@luismlorenzana/uma-kit/shell'
import { Suspense } from 'react'
import { Navigate } from 'react-router'
import { useActiveTier, useWorld } from '../save/game'
import { PLACE_UI } from './registry'

export function PlacePage({ place, rest }: { place: Place; rest: string }) {
  const ui = PLACE_UI[place.id]
  const leave = useLeave()
  const world = useWorld()
  const tier = useActiveTier()
  if (!ui?.Page || !placeOpen(place, world, tier)) return <Navigate to={peekPath(place.page, place.id)} replace />
  const Page = ui.Page
  const Counter = ui.Counter
  const up = rest ? `/${place.page}/${place.id}` : `/${place.page}`
  return (
    <div className="absolute inset-0 flex flex-col" data-place-page={place.id}>
      <PlaceHeader
        title={place.name}
        onBack={() => leave(up)}
        about={<p>{place.blurb}</p>}
        words={{ back: rest ? `Back to ${place.name}` : `Back to ${HUB_PAGE_NAMES[place.page]}`, about: `About ${place.name}` }}
      >
        {Counter && (
          <Suspense fallback={null}>
            <div className="pr-1">
              <Counter />
            </div>
          </Suspense>
        )}
      </PlaceHeader>
      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <Suspense fallback={<p className="p-4 text-ink-soft">Loading…</p>}>
          <Page place={place} rest={rest} />
        </Suspense>
      </main>
    </div>
  )
}
