// One tier world on screen at a time (H35, tiers.md §4): the shell renders under the active tier's key, so switching tiers
// unmounts and remounts the bars, every place, the Hub's Phaser scene and every component cache, as a different app
// instance would. A `?tier=n` link (a push notification's) switches to that tier when the save has its world, then the
// param is dropped from the address.
import { withParam } from '@luismlorenzana/uma-kit/shell'
import { useLayoutEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { setActiveTier, useActiveTier } from '../save/game'
import { Shell } from './Shell'

export function TierShell() {
  const tier = useActiveTier()
  const location = useLocation()
  const navigate = useNavigate()
  const asked = new URLSearchParams(location.search).get('tier')

  useLayoutEffect(() => {
    if (asked === null) return
    // An invalid tier, or one without a world, changes nothing; the param goes either way.
    if (/^[1-9]\d*$/.test(asked)) setActiveTier(Number(asked))
    void navigate(withParam(location, 'tier', null), { replace: true, state: location.state })
    // Only a new `?tier=` acts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asked])

  return <Shell key={tier} />
}
