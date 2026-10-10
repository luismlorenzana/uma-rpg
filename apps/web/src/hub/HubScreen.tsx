// The Hub (S1): account bar, the page map with its place buttons, page tabs and the global menu. A place in the URL
// opens its overlay (D31).
import { isHubPage, placeOnPage, placesOn, type HubPage, type Place } from '@rpg/domain'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router'
import { PlaceOverlay } from '../places/PlaceOverlay'
import { AccountBar } from './AccountBar'
import { HubCanvas } from './HubCanvas'
import { MenuSheet } from './MenuSheet'
import { usePlaceNavigation } from './navigation'
import { OverlayHost } from './OverlayHost'
import { PageTabs } from './PageTabs'
import { PlaceTargets } from './PlaceTargets'
import { lastPage, neighbourPage, rememberPage, swipeDirection, type Point } from './swipe'

function useReducedMotion(): boolean {
  const query = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
  const [reduced, setReduced] = useState(query?.matches ?? false)
  useEffect(() => {
    if (!query) return
    const onChange = () => setReduced(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [query])
  return reduced
}

export function HubRoute() {
  const params = useParams()
  const page = params.page
  if (!isHubPage(page)) return <Navigate to={`/${lastPage()}`} replace />
  const place = params.placeId === undefined ? undefined : placeOnPage(page, params.placeId)
  if (params.placeId !== undefined && !place) return <Navigate to={`/${page}`} replace />
  return <HubScreen page={page} place={place} rest={params['*'] ?? ''} />
}

function HubScreen({ page, place, rest }: { page: HubPage; place: Place | undefined; rest: string }) {
  const { open, close, goPage } = usePlaceNavigation(page)
  const [menu, setMenu] = useState(false)
  const reducedMotion = useReducedMotion()
  const places = useMemo(() => placesOn(page), [page])
  const swipeStart = useRef<Point | null>(null)

  useEffect(() => rememberPage(page), [page])

  return (
    <div className="game-surface flex h-dvh flex-col bg-page">
      <AccountBar onOpenAccount={() => open({ page: 'town', id: 'account' })} />
      <main
        className="relative min-h-0 flex-1"
        aria-label={`${page} map`}
        onPointerDown={(e) => (swipeStart.current = { x: e.clientX, y: e.clientY })}
        onPointerUp={(e) => {
          const start = swipeStart.current
          swipeStart.current = null
          if (!start || place || menu) return
          const direction = swipeDirection(start, { x: e.clientX, y: e.clientY })
          const next = direction === 0 ? null : neighbourPage(page, direction)
          if (next) goPage(next)
        }}
      >
        <HubCanvas page={page} places={places} paused={place !== undefined || menu} reducedMotion={reducedMotion} />
        <PlaceTargets places={places} onOpen={open} />
      </main>
      <PageTabs page={page} onPage={goPage} onMenu={() => setMenu(true)} />
      {menu && (
        <MenuSheet
          onClose={() => setMenu(false)}
          onOpen={(p) => {
            setMenu(false)
            open(p)
          }}
        />
      )}
      {place && (
        <OverlayHost place={place} onClose={close}>
          <PlaceOverlay place={place} rest={rest} />
        </OverlayHost>
      )}
    </div>
  )
}
