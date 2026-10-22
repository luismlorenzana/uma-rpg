// The Hub (S1, D43, D147): a page's map on uma-kit (`HubMap`: the Phaser canvas, the place links and the page swipe),
// Town Hall's plaza crowd, the Collect all pill and a place's quick look in the side panel (`?peek=:placeId`).
// /:page/:placeId/* is a place's page; a link to a place on another page (an old `/town/scenario-gate`) goes there.
import {
  facilitySpec, hallClass, HERO_LIMIT_IDS, heroLimitClass, HUB_PAGE_NAMES, HUB_PAGES, isHubPage, RPG_WORK_ENV,
  placeById, placeLock, placeOnPage, placeOpen, placesOn, type HubPage, type Place, type TierWorld,
} from '@rpg/domain'
import { HubMap, type HubMapPlace, type PipModel } from '@luismlorenzana/uma-kit/hub'
import { FloatingPill, navState, PeekPanel, peekPath, useLeave, withParam } from '@luismlorenzana/uma-kit/shell'
import { useReducedMotionSetting } from '@luismlorenzana/uma-kit/ui'
import { FaceTile } from '@luismlorenzana/uma-kit/album'
import { workView } from '@luismlorenzana/uma-kit/work'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router'
import { PlacePage } from '../places/PlacePage'
import { PlacePreview } from '../places/PlacePreview'
import { PLACE_UI } from '../places/registry'
import { prefetchFight } from '../battle/prefetch'
import { collectEverything, useActiveTier, useWorld } from '../save/game'
import { useNow } from '../ui/useNow'
import { plaza, sheetFor, useCrowd } from './Featured'
import { pageGround } from './grounds'
import { readyPlaces } from './ready'
import { lastPage } from './start'

/** /:page, with an optional ?peek=:placeId quick look. */
export function HubRoute() {
  const { page } = useParams()
  const [params] = useSearchParams()
  const location = useLocation()
  if (!isHubPage(page)) return <Navigate to={`/${lastPage()}`} replace />
  const peekId = params.get('peek')
  const peek = peekId === null ? undefined : placeOnPage(page, peekId)
  if (peekId !== null && (peek === undefined || peek.direct)) {
    // A quick look on another page (an old link) moves there; an unknown or direct place drops the panel.
    const elsewhere = placeById(peekId)
    if (elsewhere && elsewhere.page !== page && !elsewhere.hidden) return <Navigate to={peekPath(elsewhere.page, elsewhere.id)} replace />
    return <Navigate to={withParam(location, 'peek', null)} replace />
  }
  return <HubScreen page={page} peek={peek} />
}

/** /:page/:placeId/*, a place's page; a place on another page (an old link, a push URL) redirects to its own. */
export function PlaceRoute() {
  const params = useParams()
  const location = useLocation()
  const page = params.page
  const rest = params['*'] ?? ''
  const place = placeById(params.placeId)
  if (!place) return <Navigate to={`/${isHubPage(page) ? page : lastPage()}`} replace />
  if (place.page !== page) return <Navigate to={`/${place.page}/${place.id}${rest ? `/${rest}` : ''}${location.search}`} replace state={location.state} />
  return <PlacePage place={place} rest={rest} />
}

/** A place's slot pips: workers' faces ringed by their job's progress, a hall's four Heroes, or free dots. */
function pipsOf(place: Place, world: TierWorld | null, tier: number, now: string): PipModel[] | undefined {
  if (place.slots === 0 || !placeOpen(place, world, tier)) return undefined
  const face = (outfitId: string) => <FaceTile outfitId={outfitId} size={16} label="Assigned Uma" round />
  const hall = hallClass(place.id)
  if (hall && world) {
    return HERO_LIMIT_IDS.filter((id) => heroLimitClass(id) === hall).map((id): PipModel => {
      const hero = world.heroes[id]?.hero
      return hero ? { state: 'busy', progress: 1, tone: 'var(--color-accent)', face: face(hero) } : { state: 'free' }
    })
  }
  if (!world || !facilitySpec(place.id)) return Array.from({ length: place.slots }, (): PipModel => ({ state: 'free' }))
  return workView(world, Date.parse(now), RPG_WORK_ENV).cards(place.id).map((card): PipModel => {
    if (card.kind === 'free') return { state: 'free' }
    return { state: card.running ? 'busy' : 'ready', progress: card.progress, queued: card.queue.length, face: face(card.outfitId) }
  })
}

function QuickLook({ place }: { place: Place }) {
  const Peek = PLACE_UI[place.id]?.Peek
  return Peek ? <Suspense fallback={<p className="p-4 text-ink-soft">Loading…</p>}><Peek place={place} /></Suspense> : <PlacePreview place={place} />
}

/** One tap collects every finished job on every page. */
function CollectAll({ world, now }: { world: TierWorld | null; now: string }) {
  const [note, setNote] = useState<string | null>(null)
  const ready = readyPlaces(world, now).size
  if (ready === 0 && !note) return null
  return (
    <FloatingPill
      text={note ?? `Collect all · ${ready} ready`}
      onClick={() => {
        if (ready === 0) return
        void collectEverything().then((r) => {
          setNote(r.items > 0 ? `+${r.items} collected` : 'Collected')
          setTimeout(() => setNote(null), 2200)
        })
      }}
    />
  )
}

function HubScreen({ page, peek }: { page: HubPage; peek: Place | undefined }) {
  const world = useWorld()
  const tier = useActiveTier()
  const now = useNow(15_000)
  const [params] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const leave = useLeave()
  const reducedMotion = useReducedMotionSetting()
  const crowd = useCrowd()
  const ready = readyPlaces(world, now)
  const ground = useMemo(() => pageGround(page), [page])
  // The fight's code is lazy (H62): fetch it once the Hub has painted.
  useEffect(prefetchFight, [])
  const places = placesOn(page).map((place): HubMapPlace => {
    const open = placeOpen(place, world, tier)
    const lock = placeLock(place, world, tier)
    const isReady = open && ready.has(place.id)
    return {
      id: place.id,
      name: place.name,
      frame: place.frame ?? place.id,
      at: place.at,
      to: place.direct && open ? `/${place.page}/${place.id}` : peekPath(place.page, place.id),
      label: lock ? `${place.name}, ${lock.charAt(0).toLowerCase()}${lock.slice(1)}` : isReady ? `${place.name}, ready to collect` : place.name,
      ready: isReady ? 'Ready' : undefined,
      locked: !open,
      pips: pipsOf(place, world, tier, now),
    }
  })
  const covered = peek !== undefined || params.get('sheet') !== null
  const enterable = peek !== undefined && PLACE_UI[peek.id]?.Page !== undefined && placeOpen(peek, world, tier)
  return (
    <>
      <HubMap
        label={`${HUB_PAGE_NAMES[page]} map`}
        page={page}
        pages={HUB_PAGES}
        onPage={(next) => navigate(`/${next}`, { replace: true })}
        ground={ground}
        places={places}
        plaza={page === 'town' ? plaza(crowd, (id) => sheetFor(location, id)) : undefined}
        covered={covered}
        reducedMotion={reducedMotion}
        canvas={import.meta.env.DEV && params.has('canvas')}
        debug={import.meta.env.DEV}
      >
        <CollectAll world={world} now={now} />
      </HubMap>
      {peek && (
        <PeekPanel
          key={peek.id}
          title={peek.name}
          about={<p>{peek.blurb}</p>}
          onClose={() => leave(withParam(location, 'peek', null))}
          enter={enterable ? { to: `/${peek.page}/${peek.id}`, label: `Enter ${peek.name.replace(/^The /, 'the ')}`, state: { back: navState(location).back } } : undefined}
          words={{ close: 'Close', about: `About ${peek.name}`, backTo: `Back to ${HUB_PAGE_NAMES[page]}` }}
          focusKey={`[data-place="${peek.id}"]`}
        >
          <QuickLook place={peek} />
        </PeekPanel>
      )}
    </>
  )
}
