// What each place shows (D43): a quick look in the side panel (Peek), a full page (Page) and a header counter. Places
// without a Peek use the honest preview; places without a Page have no Enter button. Every body is a lazy chunk.
import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { Place } from '@rpg/domain'

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
  },
  account: {
    Page: lazy(() => import('./account/AccountPage')),
  },
}
