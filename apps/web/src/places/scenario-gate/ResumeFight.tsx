import { openFightOf } from '@rpg/domain'
import { useHubNavigation } from '../../hub/navigation'
import { useWorld } from '../../save/game'
import type { PageProps } from '../registry'
import { fightPlace } from './fight-place'

/** The map’s shared open fight, including Drills and capital runs. */
export function ResumeFight({ place }: { place: PageProps['place'] }) {
  const world = useWorld()
  const nav = useHubNavigation()
  const open = world ? openFightOf(world) : null
  if (!open) return null
  return <button type="button" onClick={() => nav.sub(fightPlace(place, open.battle?.nodeId), 'fight')} className="flex min-h-11 w-full items-center justify-center rounded-sm bg-accent font-display font-bold text-accent-ink">
    Resume the open fight
  </button>
}
