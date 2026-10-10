// The tappable, accessible layer over the Phaser map (D33): one button per place at its registry position, with its
// name, Uma slot pips and the slice badge. The canvas underneath only draws.
import { CURRENT_SLICE, isOpen, type Place } from '@rpg/domain'

export function PlaceTargets({ places, onOpen }: { places: Place[]; onOpen: (place: Place) => void }) {
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
            {place.slots > 0 && (
              <span className="mt-0.5 flex gap-1" aria-hidden="true">
                {Array.from({ length: place.slots }, (_, i) => (
                  <span key={i} className="size-2 rounded-full border border-white/50 bg-black/30" />
                ))}
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
