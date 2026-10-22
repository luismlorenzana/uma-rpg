// The shell (D147, uma-kit's AppFrame): the top bar, the page between, the bottom bar in the thumb zone, and the global
// sheets (`?sheet=menu`, `?sheet=featured`, `?sheet=tier`). A fight hides both bars. Each page visit is remembered for
// `/`. The frame wears the active tier's look (H36): Tier 1 day, Tier 2 dusk, Tier 3 night.
import { isHubPage, tierLook } from '@rpg/domain'
import { AppFrame, useLeave } from '@luismlorenzana/uma-kit/shell'
import { useEffect } from 'react'
import { Outlet, useLocation, useParams, useSearchParams } from 'react-router'
import { useActiveTier } from '../save/game'
import { RpgAccountBar, RpgBottomBar } from './Bars'
import { FeaturedSheet, withoutSheet } from './Featured'
import { MenuSheet } from './MenuSheet'
import { rememberPage } from './start'
import { TierSheet } from './TierSheet'

export function Shell() {
  const params = useParams()
  const page = isHubPage(params.page) ? params.page : null
  const [search] = useSearchParams()
  const location = useLocation()
  const leave = useLeave()
  const tier = useActiveTier()
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
      tint={tierLook(tier)}
      overlays={<>
        <MenuSheet open={sheet === 'menu'} onClose={closeSheet} />
        <FeaturedSheet open={sheet === 'featured'} onClose={closeSheet} />
        <TierSheet open={sheet === 'tier'} onClose={closeSheet} />
      </>}
    >
      <Outlet />
    </AppFrame>
  )
}
