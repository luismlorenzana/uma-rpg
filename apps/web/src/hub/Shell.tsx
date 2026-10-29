// The shell (D147, uma-kit's AppFrame): the top bar, the page between, the bottom bar in the thumb zone, and the global
// sheets (`?sheet=menu`, `?sheet=featured`, `?sheet=tier`, `?sheet=grant`, `?sheet=classes`). A fight hides both bars.
// Each page visit is remembered for `/`. The frame wears the active tier's look (H36): Tier 1 day, Tier 2 dusk, Tier 3
// night. A world with an unseen grant (save v28, PP25; H80) opens "The Wilds are rebuilt" once, outside a fight, and one
// with an unseen class reset (save v32, CV30; H132) "The classes are rebuilt" after it (`one-time.ts`); their code is lazy.
import { isHubPage, tierKey, tierLook } from '@rpg/domain'
import { AppFrame, useLeave } from '@luismlorenzana/uma-kit/shell'
import { lazy, Suspense, useEffect } from 'react'
import { Outlet, useLocation, useNavigate, useParams, useSearchParams } from 'react-router'
import { seeClassesRebuilt, seeGrant, useActiveTier, useGame } from '../save/game'
import { RpgAccountBar, RpgBottomBar } from './Bars'
import { FeaturedSheet, withoutSheet } from './Featured'
import { MenuSheet } from './MenuSheet'
import { dueSheet, shownSheet } from './one-time'
import { rememberPage } from './start'
import { TierSheet } from './TierSheet'

const GrantSheet = lazy(() => import('../grant/GrantSheet'))
const ClassesSheet = lazy(() => import('../grant/ClassesSheet'))

export function Shell() {
  const params = useParams()
  const page = isHubPage(params.page) ? params.page : null
  const [search] = useSearchParams()
  const location = useLocation()
  const leave = useLeave()
  const tier = useActiveTier()
  const navigate = useNavigate()
  const due = useGame((s) => dueSheet(s.save?.tierWorlds[tierKey(s.activeTier)]))
  const fullScreen = params.placeId === 'scenario-gate' && (params['*'] ?? '').startsWith('fight')
  const sheet = search.get('sheet')
  const closeSheet = () => leave(withoutSheet(location))
  const oneTime = shownSheet(sheet, due, fullScreen)
  const grantLater = () => {
    void seeGrant()
    if (sheet === 'grant') closeSheet()
  }
  const grantWilds = () => {
    void seeGrant()
    navigate('/wilds')
  }
  const classesLater = () => {
    void seeClassesRebuilt()
    if (sheet === 'classes') closeSheet()
  }
  const classesExchange = () => {
    void seeClassesRebuilt()
    navigate('/town/exchange/manual', { state: { back: true } })
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
        {oneTime === 'grant' && <Suspense fallback={null}><GrantSheet onLater={grantLater} onWilds={grantWilds} /></Suspense>}
        {oneTime === 'classes' && <Suspense fallback={null}><ClassesSheet onLater={classesLater} onExchange={classesExchange} /></Suspense>}
      </>}
    >
      <Outlet />
    </AppFrame>
  )
}
