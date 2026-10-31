// The Observatory (H122; D239 UP15): a door. Its page lists her owned Umas, those with a jewel ready first, and a tap opens her
// profile on the Stars tab; Back returns here. `/learning/observatory/:id` redirects to that tab, keeping its navigation state.
import { FaceTile } from '@luismlorenzana/uma-kit/album'
import { byLevel } from '@luismlorenzana/uma-kit/roster'
import { isStarMap, type TierWorld } from '@rpg/domain'
import { useMemo } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { albumRows } from '../../album/rows'
import type { MasterView } from '../../master/master'
import { useAlbumScope, useWorld } from '../../save/game'
import { MasterGate } from '../MasterGate'
import type { PageProps } from '../registry'
import { extraStatsRow } from '../stable/copy'
import { profileDoor } from '../stable/profile-tabs'
import { observatoryOrder, setAllPlan } from './stars-view'

export default function ObservatoryPage({ rest }: PageProps) {
  const location = useLocation()
  const [id] = rest.split('/').filter(Boolean)
  if (id) return <Navigate replace to={`/town/stable/outfit/${encodeURIComponent(id)}/stars`} state={location.state} />
  return <MasterGate>{(view) => <Observatory view={view} />}</MasterGate>
}

const readyOf = (world: TierWorld, id: string): number => {
  const uma = world.umas[id]
  return uma && isStarMap(uma.stars) ? setAllPlan(uma.stars, world.items, uma.level).length : 0
}

function Observatory({ view }: { view: MasterView }) {
  const world = useWorld()
  const scope = useAlbumScope()
  const navigate = useNavigate()
  const rows = useMemo(() => {
    if (!world) return []
    const ready = new Map(Object.keys(world.umas).map((id) => [id, readyOf(world, id)]))
    const owned = albumRows(view, world, [], undefined, scope).filter((row) => row.uma)
    return observatoryOrder(owned, (id) => ready.get(id) ?? 0, byLevel).map((row) => ({ row, ready: ready.get(row.id) ?? 0 }))
  }, [view, world, scope])
  if (!world) return null
  if (rows.length === 0) return <p className="p-4 text-ink-soft">Unlock an Uma first.</p>
  const list = rows.map(({ row }) => row.id)
  const open = (id: string) => {
    const door = profileDoor(id, { tab: 'stars', list })
    navigate(door.to, { state: door.state })
  }
  return (
    <ul className="space-y-1 p-3" aria-label="Umas" data-observatory-list>
      {rows.map(({ row, ready }) => {
        const uma = world.umas[row.id]
        return (
          <li key={row.id}>
            <button type="button" onClick={() => open(row.id)} className="flex min-h-11 w-full items-center gap-2.5 rounded-sm bg-raised px-2 py-1.5 text-left">
              <span className="w-9 shrink-0"><FaceTile outfitId={row.id} size={36} label={row.name} round /></span>
              <span className="min-w-0 flex-1 truncate text-[14px] font-semibold">{row.name}</span>
              <span className="shrink-0 text-[12.5px] text-ink-soft">{extraStatsRow(uma && isStarMap(uma.stars) ? uma.stars.open.length : 0, ready)}</span>
              {ready > 0 && <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-success" />}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
