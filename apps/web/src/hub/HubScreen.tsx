// The Hub (S1/S2): account bar, the page map with its place buttons, page tabs and the global menu. `?peek=` opens a
// place's quick look; /:page/:placeId/* is its full page (D43).
import { CURRENT_SLICE, isHubPage, isOpen, placeOnPage, placesOn, type HubPage, type Place } from '@rpg/domain'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router'
import { PlacePage } from '../places/PlacePage'
import { PlacePreview } from '../places/PlacePreview'
import { PLACE_UI } from '../places/registry'
import { AccountBar } from './AccountBar'
import { HubCanvas } from './HubCanvas'
import { MenuSheet } from './MenuSheet'
import { useHubNavigation } from './navigation'
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

/** /:page, with an optional ?peek=:placeId quick look. */
export function HubRoute() {
  const { page } = useParams()
  const [params] = useSearchParams()
  if (!isHubPage(page)) return <Navigate to={`/${lastPage()}`} replace />
  const peekId = params.get('peek') ?? undefined
  const peek = peekId === undefined ? undefined : placeOnPage(page, peekId)
  if (peekId !== undefined && !peek) return <Navigate to={`/${page}`} replace />
  return <HubScreen page={page} peek={peek} />
}

/** /:page/:placeId/*, a place's full page. */
export function PlaceRoute() {
  const params = useParams()
  const page = params.page
  if (!isHubPage(page)) return <Navigate to={`/${lastPage()}`} replace />
  const place = placeOnPage(page, params.placeId)
  if (!place) return <Navigate to={`/${page}`} replace />
  return <PlacePage place={place} rest={params['*'] ?? ''} />
}

function QuickLook({ place, onEnter }: { place: Place; onEnter: () => void }) {
  const ui = PLACE_UI[place.id]
  const Peek = ui?.Peek
  const enterable = ui?.Page !== undefined && isOpen(place, CURRENT_SLICE)
  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1">{Peek ? <Suspense fallback={<p className="p-4 text-ink-soft">Loading…</p>}><Peek place={place} /></Suspense> : <PlacePreview place={place} />}</div>
      {enterable && (
        <div className="sticky bottom-0 border-t border-hairline bg-panel/95 p-3 backdrop-blur">
          <button type="button" onClick={onEnter} className="min-h-12 w-full rounded-sm bg-accent font-display text-base font-bold text-accent-ink">
            Enter {place.name}
          </button>
        </div>
      )}
    </div>
  )
}

function HubScreen({ page, peek }: { page: HubPage; peek: Place | undefined }) {
  const nav = useHubNavigation()
  const [menu, setMenu] = useState(false)
  const reducedMotion = useReducedMotion()
  const places = useMemo(() => placesOn(page), [page])
  const swipeStart = useRef<Point | null>(null)

  useEffect(() => rememberPage(page), [page])

  return (
    <div className="game-surface flex h-dvh flex-col bg-page">
      <AccountBar onOpenAccount={() => nav.open({ page: 'town', id: 'account' })} />
      <main
        className="relative min-h-0 flex-1"
        aria-label={`${page} map`}
        onPointerDown={(e) => (swipeStart.current = { x: e.clientX, y: e.clientY })}
        onPointerUp={(e) => {
          const start = swipeStart.current
          swipeStart.current = null
          if (!start || peek || menu) return
          const direction = swipeDirection(start, { x: e.clientX, y: e.clientY })
          const next = direction === 0 ? null : neighbourPage(page, direction)
          if (next) nav.goPage(next)
        }}
      >
        <HubCanvas page={page} places={places} paused={peek !== undefined || menu} reducedMotion={reducedMotion} />
        <PlaceTargets places={places} onOpen={nav.peek} />
      </main>
      <PageTabs page={page} onPage={nav.goPage} onMenu={() => setMenu(true)} />
      {menu && (
        <MenuSheet
          onClose={() => setMenu(false)}
          onOpen={(p) => {
            setMenu(false)
            if (p.hidden) nav.open(p)
            else nav.peek(p)
          }}
        />
      )}
      {peek && (
        <OverlayHost place={peek} onClose={() => nav.toHub(page)}>
          <QuickLook place={peek} onEnter={() => nav.enter(peek)} />
        </OverlayHost>
      )}
    </div>
  )
}
