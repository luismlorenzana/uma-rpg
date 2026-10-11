// The tappable, accessible layer over the Phaser map (D33): one button per place at its registry position, with its
// name, its Uma slots (the face of whoever works there, ringed by her job's progress, D22) and the slice badge. The
// canvas underneath only draws.
import { CURRENT_SLICE, facilityOf, facilitySpec, isOpen, jobFinished, jobProgress, type Place, type TierWorld } from '@rpg/domain'
import { AtlasSprite } from '../master/art'
import { useMaster } from '../master/master'
import { useWorld } from '../save/game'
import { useNow } from '../ui/useNow'

/** Places with something to collect. */
export function readyPlaces(world: TierWorld | null, now: string): Set<string> {
  const ready = new Set<string>()
  for (const [id, f] of Object.entries(world?.facilities ?? {})) {
    if (f.jobs.some((j) => j && (jobFinished(j, now) > j.collected || jobFinished(j, now) >= j.count))) ready.add(id)
  }
  return ready
}

export function PlaceTargets({ places, onOpen }: { places: Place[]; onOpen: (place: Place) => void }) {
  const world = useWorld()
  const now = useNow(15_000)
  const master = useMaster()
  const art = master.status === 'ready' ? master.view.art : null
  const ready = readyPlaces(world, now)
  return (
    <div className="absolute inset-0">
      {places.map((place) => {
        const open = isOpen(place, CURRENT_SLICE)
        return (
          <button
            key={place.id}
            type="button"
            data-place={place.id}
            onClick={() => onOpen(place)}
            aria-label={open ? place.name : `${place.name}, opens in ${place.opensIn}`}
            className="group absolute flex w-32 flex-col items-center"
            style={{ left: `${place.at.x * 100}%`, top: `${place.at.y * 100}%`, transform: 'translate(-50%, -36px)' }}
          >
            <span className="relative h-12 w-20 rounded-md transition group-active:scale-95 group-active:bg-white/10">
              {!open && (
                <span className="absolute -right-1 -top-1 rounded-full bg-sunken/90 px-1.5 text-[10px] font-bold leading-4 text-ink-soft ring-1 ring-hairline-strong">
                  {place.opensIn}
                </span>
              )}
            </span>
            {open && ready.has(place.id) && (
              <span className="absolute right-6 top-0 rounded-full bg-success px-1.5 text-[10px] font-bold leading-4 text-white shadow-2">Ready</span>
            )}
            {place.slots > 0 && (
              <span className="mt-0.5 flex gap-1" aria-hidden="true">
                {(open && world && facilitySpec(place.id) ? facilityOf(world, place.id).jobs : Array.from({ length: place.slots }, () => null)).map((job, i) =>
                  job ? (
                    <span key={i} className="rounded-full p-[2px]" style={{ background: `conic-gradient(#d6a23e ${jobProgress(job, now) * 360}deg, rgb(255 255 255 / 0.18) 0)` }}>
                      <AtlasSprite art={art} family="outfit-icons" frameKey={job.outfitId} size={18} className="rounded-full" />
                    </span>
                  ) : (
                    <span key={i} className="mt-[5px] size-2 rounded-full border border-white/50 bg-black/30" />
                  ),
                )}
              </span>
            )}
            <span className={`mt-0.5 max-w-full truncate rounded-full px-2 py-0.5 text-[11px] font-semibold leading-4 shadow-2 ${open ? 'bg-accent text-accent-ink' : 'bg-sunken/85 text-ink'}`}>
              {place.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
