// The Stable header's trailing slot (H124 decision 1): Uma Tickets on the roster, and on a profile ‹ n/N › over the list the door
// passed, or the roster's own order on a shared link. A step keeps the tab and replaces the entry, so ‹ › never stack Backs, and
// the profile's body is keyed by her id, so an open sheet closes. Hidden with one Uma and on a locked profile.
import { useAlbumPrefs } from '@luismlorenzana/uma-kit/album'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { albumRows, stableResult, STABLE_SCHEMA } from '../../album/rows'
import { withUpgrades } from '../../album/upgrades'
import { useMaster, type MasterView } from '../../master/master'
import { useActiveTier, useAlbumScope, useWorld } from '../../save/game'
import { profileRoute, rosterList, scrollProfileTop, stepper } from './profile-nav'
import { storedTab, type ProfileNavState, type ProfileTab } from './profile-tabs'
import TicketCounter from './TicketCounter'

export default function StableCounter() {
  const location = useLocation()
  const route = profileRoute(location.pathname)
  const master = useMaster()
  if (!route) return <TicketCounter />
  const list = (location.state as ProfileNavState | null)?.list
  if (list) return <Steps list={list} id={route.id} tab={route.tab} />
  return master.status === 'ready' ? <RosterSteps view={master.view} id={route.id} tab={route.tab} /> : null
}

/** A shared link has no list: the roster's sort and filter, owned Umas only. */
function RosterSteps({ view, id, tab }: { view: MasterView; id: string; tab: ProfileTab | null }) {
  const world = useWorld()
  const scope = useAlbumScope()
  const tier = useActiveTier()
  const prefs = useAlbumPrefs('stable', STABLE_SCHEMA)
  const list = useMemo(() => rosterList(stableResult(withUpgrades(albumRows(view, world, prefs.seen, undefined, scope), world, tier), prefs.query).rows),
    [view, world, prefs.seen, prefs.query, scope, tier])
  return <Steps list={list} id={id} tab={tab} />
}

function Steps({ list, id, tab }: { list: readonly string[]; id: string; tab: ProfileTab | null }) {
  const world = useWorld()
  const navigate = useNavigate()
  const location = useLocation()
  const steps = stepper(list.filter((uma) => world?.umas[uma]), id)
  if (!steps) return null
  const go = (next: string) => {
    navigate(`/town/stable/outfit/${encodeURIComponent(next)}/${tab ?? storedTab()}`, { replace: true, state: location.state })
    scrollProfileTop()
  }
  return (
    <span className="flex items-center" role="group" aria-label={steps.name} data-profile-stepper>
      <button type="button" onClick={() => go(steps.previous)} aria-label="Previous Uma" className="flex size-11 items-center justify-center text-[20px] font-semibold text-ink-soft">‹</button>
      <span aria-hidden className="min-w-10 text-center text-[12.5px] font-semibold tabular-nums">{steps.label}</span>
      <button type="button" onClick={() => go(steps.next)} aria-label="Next Uma" className="flex size-11 items-center justify-center text-[20px] font-semibold text-ink-soft">›</button>
    </span>
  )
}
