// The shell (D147, uma-kit's AppFrame): the top bar, the page between, the bottom bar in the thumb zone, and the global
// sheets (`?sheet=menu`, `?sheet=featured`). A fight hides both bars. Each page visit is remembered for `/`.
import { isHubPage } from '@rpg/domain'
import { AppFrame, useLeave } from '@luismlorenzana/uma-kit/shell'
import { useEffect } from 'react'
import { Outlet, useLocation, useParams, useSearchParams } from 'react-router'
import { RpgAccountBar, RpgBottomBar } from './Bars'
import { FeaturedSheet, withoutSheet } from './Featured'
import { MenuSheet } from './MenuSheet'
import { rememberPage } from './start'

export function Shell() {
  const params = useParams()
  const page = isHubPage(params.page) ? params.page : null
  const [search] = useSearchParams()
  const location = useLocation()
  const leave = useLeave()
  const fullScreen = params.placeId === 'scenario-gate' && (params['*'] ?? '').startsWith('fight')
  const sheet = search.get('sheet')
  const closeSheet = () => leave(withoutSheet(location))

  useEffect(() => {
    if (page !== null) rememberPage(page)
  }, [page])

  return (
    <AppFrame
      top={<RpgAccountBar />}
      bottom={<RpgBottomBar active={page} />}
      fullScreen={fullScreen}
      overlays={<>
        <MenuSheet open={sheet === 'menu'} onClose={closeSheet} />
        <FeaturedSheet open={sheet === 'featured'} onClose={closeSheet} />
      </>}
    >
      <Outlet />
    </AppFrame>
  )
}
