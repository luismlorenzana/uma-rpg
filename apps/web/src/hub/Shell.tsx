// The shell (D147, uma-kit's AppFrame): the top bar, the page between, the bottom bar in the thumb zone, and the global
// sheets (`?sheet=menu`, `?sheet=featured`, `?sheet=tier`, `?sheet=grant`). A fight hides both bars. Each page visit is
// remembered for `/`. The frame wears the active tier's look (H36): Tier 1 day, Tier 2 dusk, Tier 3 night. A world with
// an unseen grant (save v28, PP25; H80) opens "The Wilds are rebuilt" once, outside a fight; its code is lazy.
import { isHubPage, tierKey, tierLook } from '@rpg/domain'
import { AppFrame, useLeave } from '@luismlorenzana/uma-kit/shell'
import { lazy, Suspense, useEffect } from 'react'
import { Outlet, useLocation, useNavigate, useParams, useSearchParams } from 'react-router'
import { seeGrant, useActiveTier, useGame } from '../save/game'
import { RpgAccountBar, RpgBottomBar } from './Bars'
import { FeaturedSheet, withoutSheet } from './Featured'
import { MenuSheet } from './MenuSheet'
import { rememberPage } from './start'
import { TierSheet } from './TierSheet'

const GrantSheet = lazy(() => import('../grant/GrantSheet'))

export function Shell() {
  const params = useParams()
  const page = isHubPage(params.page) ? params.page : null
  const [search] = useSearchParams()
  const location = useLocation()
  const leave = useLeave()
  const tier = useActiveTier()
  const navigate = useNavigate()
  const grantDue = useGame((s) => { const grant = s.save?.tierWorlds[tierKey(s.activeTier)]?.grant; return !!grant && !grant.seen })
  const fullScreen = params.placeId === 'scenario-gate' && (params['*'] ?? '').startsWith('fight')
  const sheet = search.get('sheet')
  const closeSheet = () => leave(withoutSheet(location))
  const showGrant = sheet === 'grant' || (grantDue && !fullScreen)
  const grantLater = () => {
    void seeGrant()
    if (sheet === 'grant') closeSheet()
  }
  const grantWilds = () => {
    void seeGrant()
    navigate('/wilds')
  }

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
        {showGrant && <Suspense fallback={null}><GrantSheet onLater={grantLater} onWilds={grantWilds} /></Suspense>}
      </>}
    >
      <Outlet />
    </AppFrame>
  )
}
