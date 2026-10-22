import { placeLock } from '@rpg/domain'
import { useActiveTier, useWorld } from '../save/game'
import { LockIcon } from '../ui/icons'
import type { PeekProps } from './registry'

/** The default quick look: one line on what the place is, and a lock with its reason when it isn't open. */
export function PlacePreview({ place }: PeekProps) {
  const lock = placeLock(place, useWorld(), useActiveTier())
  return (
    <div className="space-y-3 p-4">
      <p className="text-[15px] leading-relaxed text-ink">{place.blurb}</p>
      {lock && (
        <p className="flex items-center gap-2 text-[13px] text-ink-faint">
          <LockIcon size={16} className="text-locked" /> {lock}
        </p>
      )}
    </div>
  )
}
