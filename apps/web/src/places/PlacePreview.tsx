import { SLICE_GOALS } from '@rpg/domain'
import type { PeekProps } from './registry'

/** The default overlay: what the place is for, its empty slots, and which slice opens it. */
export function PlacePreview({ place }: PeekProps) {
  return (
    <div className="space-y-4 p-4">
      <p className="text-[15px] leading-relaxed text-ink">{place.blurb}</p>
      {place.slots > 0 && (
        <section>
          <h3 className="text-micro mb-2">Uma slots</h3>
          <div className="flex gap-2">
            {Array.from({ length: place.slots }, (_, i) => (
              <div key={i} className="flex size-16 items-center justify-center rounded-md border border-dashed border-hairline-strong text-ink-faint" aria-label="Empty slot">
                +
              </div>
            ))}
          </div>
        </section>
      )}
      <section className="rounded-md border border-accent/40 bg-accent/10 p-3">
        <p className="font-display text-[15px] font-bold text-accent">Opens in {place.opensIn}</p>
        <p className="text-[13px] text-ink-soft">{SLICE_GOALS[place.opensIn]}</p>
      </section>
      {place.details.length > 0 && (
        <section>
          <h3 className="text-micro mb-2">What it will do</h3>
          <ul className="space-y-1.5">
            {place.details.map((d) => (
              <li key={d} className="flex gap-2 text-[14px] text-ink-soft">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                {d}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
