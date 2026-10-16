// Every screen is a place on the Hub (D31, D43): /:page (+ ?peek=, ?sheet=) and /:page/:placeId/*, inside the shell's bars
// (D147). Nothing else is a route.
import { createBrowserRouter, Navigate } from 'react-router'
import { HubRoute, PlaceRoute } from '../hub/HubScreen'
import { Shell } from '../hub/Shell'
import { lastPage } from '../hub/start'
import { Root } from './Root'

function RedirectToLastPage() {
  return <Navigate to={`/${lastPage()}`} replace />
}

export const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      { index: true, element: <RedirectToLastPage /> },
      {
        element: <Shell />,
        children: [
          { path: ':page', element: <HubRoute /> },
          { path: ':page/:placeId/*', element: <PlaceRoute /> },
        ],
      },
    ],
  },
])
