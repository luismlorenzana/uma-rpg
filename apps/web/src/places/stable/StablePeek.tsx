import { AlbumGrid } from '@luismlorenzana/uma-kit/album'
import { albumRows } from '../../album/rows'
import { useActiveTier, useAlbumScope, useWorld } from '../../save/game'
import { MasterGate } from '../MasterGate'
import { TicketIcon } from '../../ui/icons'

/** The Stable's quick look: owned / total, tickets left (Tier 1 only, D5), the last Umas unlocked. */
export default function StablePeek() {
  const world = useWorld()
  const scope = useAlbumScope()
  const tickets = useActiveTier() === 1
  const owned = Object.entries(world?.umas ?? {}).sort(([, a], [, b]) => b.unlockedAt.localeCompare(a.unlockedAt))
  return (
    <MasterGate>
      {(view) => {
        const rows = new Map(albumRows(view, world, [], undefined, scope).map(row => [row.id, row]))
        return (
        <div className="space-y-4 p-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md bg-raised p-3">
              <p className="text-micro">Owned</p>
              <p className="font-display text-2xl font-bold">
                {owned.length} <span className="text-base text-ink-faint">/ {view.roster.length}</span>
              </p>
            </div>
            {tickets && (
              <div className="rounded-md bg-raised p-3">
                <p className="text-micro">Tickets</p>
                <p className="flex items-center gap-1.5 font-display text-2xl font-bold">
                  <TicketIcon size={22} /> {world?.wallet.unlockTickets ?? 0}
                </p>
              </div>
            )}
          </div>
          {owned.length > 0 && (
            <section>
              <h3 className="text-micro mb-2">Latest unlocks</h3>
              <AlbumGrid view="icons" rows={owned.slice(0, 4).flatMap(([id]) => rows.has(id) ? [rows.get(id)!] : [])} />
            </section>
          )}
        </div>
        )
      }}
    </MasterGate>
  )
}
