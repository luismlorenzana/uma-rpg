// Places (D43): the Hub page is /:page, a place's quick look is /:page?peek=:placeId, its full page /:page/:placeId/*.
// Opening from the Hub pushes history, so back always returns where you came from.
import type { HubPage, Place } from '@rpg/domain'
import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router'

export interface NavState {
  /** This entry was pushed from the Hub: back pops it. */
  fromHub?: boolean
  /** This entry was pushed from inside a place page: back pops to the place. */
  fromPlace?: boolean
}

type PlaceRef = Pick<Place, 'page' | 'id'>

export function peekPath(place: PlaceRef): string {
  return `/${place.page}?peek=${encodeURIComponent(place.id)}`
}

export function pagePath(place: PlaceRef, rest = ''): string {
  return `/${place.page}/${place.id}${rest ? `/${rest}` : ''}`
}

export function useHubNavigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state as NavState | null) ?? {}
  /** Opens a place's quick look over its Hub page. */
  const peek = useCallback((place: PlaceRef) => navigate(peekPath(place), { state: { fromHub: true } satisfies NavState }), [navigate])
  /** From a quick look: replace it with the full page, so back returns to the Hub, not the panel. */
  const enter = useCallback(
    (place: PlaceRef) => navigate(pagePath(place), { replace: state.fromHub === true, state: { fromHub: true } satisfies NavState }),
    [navigate, state.fromHub],
  )
  /** Opens a full page straight from the Hub (the account bar). */
  const open = useCallback((place: PlaceRef) => navigate(pagePath(place), { state: { fromHub: true } satisfies NavState }), [navigate])
  /** Back to the Hub page: pop when we came from it, otherwise replace (deep link). */
  const toHub = useCallback((page: HubPage) => (state.fromHub ? navigate(-1) : navigate(`/${page}`, { replace: true })), [navigate, state.fromHub])
  /** Inside a place: go to a sub-view, or back up to the place's root. */
  const sub = useCallback((place: PlaceRef, rest: string) => navigate(pagePath(place, rest), { state: { fromPlace: true } satisfies NavState }), [navigate])
  const subBack = useCallback((place: PlaceRef) => (state.fromPlace ? navigate(-1) : navigate(pagePath(place), { replace: true })), [navigate, state.fromPlace])
  const goPage = useCallback((next: HubPage) => navigate(`/${next}`, { replace: true }), [navigate])
  return { peek, enter, open, toHub, sub, subBack, goPage }
}
