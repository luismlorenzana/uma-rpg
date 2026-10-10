// Every screen is a place on the Hub (D31, D43): /:page (+ ?peek=) and /:page/:placeId/*. Nothing else is a route.
import { createBrowserRouter, Navigate } from 'react-router'
import { HubRoute, PlaceRoute } from '../hub/HubScreen'
import { lastPage } from '../hub/swipe'
import { Root } from './Root'

function RedirectToLastPage() {
  return <Navigate to={`/${lastPage()}`} replace />
}

export const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      { index: true, element: <RedirectToLastPage /> },
      { path: ':page', element: <HubRoute /> },
      { path: ':page/:placeId/*', element: <PlaceRoute /> },
    ],
  },
])
