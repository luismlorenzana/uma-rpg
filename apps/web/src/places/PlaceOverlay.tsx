// Which body a place's overlay shows: live places get their own lazy chunk; the rest show the honest preview (T008).
import type { Place } from '@rpg/domain'
import { lazy, type ComponentType } from 'react'
import { PlacePreview } from './PlacePreview'

export interface PlaceBodyProps {
  place: Place
  /** The sub-route inside the place, e.g. `outfit/100101`. */
  rest: string
}

const LIVE: Record<string, ComponentType<PlaceBodyProps>> = {
  stable: lazy(() => import('./StablePlace')),
  'scenario-gate': lazy(() => import('./ScenarioGatePlace')),
  account: lazy(() => import('./AccountPlace')),
}

export function PlaceOverlay({ place, rest }: PlaceBodyProps) {
  const Body = LIVE[place.id] ?? PlacePreview
  return <Body place={place} rest={rest} />
}
