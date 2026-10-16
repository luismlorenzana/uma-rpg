// Picks an owned Uma for a party slot. Umas already in another party are marked; picking one moves her (D46).
import { byUmaLevel, matchesSearch, partyOf, type TierWorld } from '@rpg/domain'
import { useMemo, useState } from 'react'
import { AtlasSprite } from '../../master/art'
import type { MasterView } from '../../master/master'
import { BottomSheet } from '../../ui/BottomSheet'
import { SearchIcon } from '../../ui/icons'

export function UmaPicker({ view, world, partyIndex, onPick, onClose }: { view: MasterView; world: TierWorld; partyIndex: number; onPick: (outfitId: string) => void; onClose: () => void }) {
  const [search, setSearch] = useState('')
  const owned = useMemo(
    () => view.roster.filter((o) => world.umas[o.outfitId] && matchesSearch(o, search))
      .map(outfit => ({ outfit, owned: world.umas[outfit.outfitId]! })).sort(byUmaLevel).map(e => e.outfit),
    [view.roster, world.umas, search],
  )
  return (
    <BottomSheet title="Choose an Uma" onClose={onClose}>
      <label className="sticky top-0 mb-2 flex items-center gap-2 rounded-sm bg-sunken px-3">
        <SearchIcon size={18} className="text-ink-faint" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search your Umas" className="min-h-11 w-full bg-transparent text-ink outline-none placeholder:text-ink-faint" aria-label="Search your Umas" />
      </label>
      {owned.length === 0 ? (
        <p className="py-6 text-center text-ink-soft">{search ? 'No owned Uma matches.' : 'Unlock Umas in the Stable first.'}</p>
      ) : (
        <ul className="space-y-1.5">
          {owned.map((o) => {
            const at = partyOf(world, o.outfitId)
            const here = at?.party === partyIndex
            return (
              <li key={o.outfitId}>
                <button type="button" onClick={() => onPick(o.outfitId)} className="flex min-h-14 w-full items-center gap-3 rounded-md bg-raised p-2 text-left active:bg-white/5">
                  <AtlasSprite art={view.art} family="outfit-icons" frameKey={o.outfitId} size={44} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold">{o.name}</span>
                    <span className="block truncate text-[11px] text-ink-faint">
                      Lv {world.umas[o.outfitId]?.level ?? 1} · {o.title ?? ''}
                    </span>
                  </span>
                  {at && <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${here ? 'bg-accent/15 text-accent' : 'bg-sunken text-ink-soft'}`}>{here ? 'In this party' : `Moves from ${world.parties[at.party]?.name}`}</span>}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </BottomSheet>
  )
}
