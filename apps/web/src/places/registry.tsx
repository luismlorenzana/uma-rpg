// What each place shows (D43): a quick look in the side panel (Peek), a full page (Page) and a header counter. Places
// without a Peek use the honest preview; places without a Page have no Enter button. Every body is a lazy chunk.
import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import { FACILITIES, HERO_HALLS, PLACES_V3, rpgRework, type Place } from '@rpg/domain'

export interface PeekProps {
  place: Place
}

export interface PageProps {
  place: Place
  /** The sub-route inside the place, e.g. `outfit/100101`. */
  rest: string
}

export interface PlaceUi {
  Peek?: LazyExoticComponent<ComponentType<PeekProps>>
  Page?: LazyExoticComponent<ComponentType<PageProps>>
  Counter?: LazyExoticComponent<ComponentType>
}

export const PLACE_UI: Record<string, PlaceUi> = {
  stable: {
    Peek: lazy(() => import('./stable/StablePeek')),
    Page: lazy(() => import('./stable/StablePage')),
    Counter: lazy(() => import('./stable/TicketCounter')),
  },
  'party-hall': {
    Peek: lazy(() => import('./party-hall/PartyHallPeek')),
    Page: lazy(() => import('./party-hall/PartyHallPage')),
    Counter: lazy(() => import('./party-hall/PartyCounter')),
  },
  'scenario-gate': {
    Peek: lazy(() => import('./scenario-gate/ScenarioGatePeek')),
    Page: lazy(() => import('./scenario-gate/ScenarioGatePage')),
    Counter: lazy(() => import('./scenario-gate/LaurelCounter')),
  },
  'tier-finale': {
    Peek: lazy(() => import('./rift/RiftPeek')),
    Page: lazy(() => import('./rift/RiftPage')),
  },
  account: {
    Page: lazy(() => import('./account/AccountPage')),
  },
  warehouse: {
    Page: lazy(() => import('./warehouse/WarehousePage')),
  },
  observatory: {
    Page: lazy(() => import('./observatory/ObservatoryPage')),
  },
  exchange: {
    Page: lazy(() => import('./exchange/ExchangePage')),
    Counter: lazy(() => import('./scenario-gate/LaurelCounter')),
  },
}

// Every site and station shares one page (S4).
const FacilityPage = lazy(() => import('./work/FacilityPage'))
const FacilityPeek = lazy(() => import('./work/FacilityPage').then((m) => ({ default: m.FacilityPeek })))
// Every working facility shares one page (S4): today's eleven, or R2's ten places from its switch (H80). A link to a place
// R2 removed has no place to open, so the router falls back to the Wilds page.
for (const f of rpgRework('economy') ? PLACES_V3 : FACILITIES) {
  PLACE_UI[f.id] = { Peek: FacilityPeek, Page: FacilityPage }
}

// The five Halls of Heroes share one page (D106).
const HallPage = lazy(() => import('./halls/HallPage'))
const HallPeek = lazy(() => import('./halls/HallPage').then((m) => ({ default: m.HallPeek })))
for (const id of Object.values(HERO_HALLS)) PLACE_UI[id] = { Peek: HallPeek, Page: HallPage }
