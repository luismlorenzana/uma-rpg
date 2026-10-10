// Opening and closing places (D31): every screen is /:page/:placeId/*. Opening from the Hub pushes a history entry,
// so the back gesture closes the overlay; closing pops it when it came from the Hub, or replaces it after a deep link.
import type { HubPage, Place } from '@rpg/domain'
import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router'

export interface HubState {
  fromHub?: boolean
}

export function placePath(place: Pick<Place, 'page' | 'id'>, rest = ''): string {
  return `/${place.page}/${place.id}${rest ? `/${rest}` : ''}`
}

export function usePlaceNavigation(page: HubPage) {
  const navigate = useNavigate()
  const location = useLocation()
  const fromHub = (location.state as HubState | null)?.fromHub === true
  const open = useCallback((place: Pick<Place, 'page' | 'id'>) => navigate(placePath(place), { state: { fromHub: true } satisfies HubState }), [navigate])
  const close = useCallback(() => (fromHub ? navigate(-1) : navigate(`/${page}`, { replace: true })), [fromHub, navigate, page])
  const goPage = useCallback((next: HubPage) => navigate(`/${next}`, { replace: true }), [navigate])
  return { open, close, goPage }
}
