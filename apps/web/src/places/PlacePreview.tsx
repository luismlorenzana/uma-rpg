import { CURRENT_SLICE, isOpen } from '@rpg/domain'
import { LockIcon } from '../ui/icons'
import type { PeekProps } from './registry'

/** The default quick look: one line on what the place is, and a lock when it isn't open yet. */
export function PlacePreview({ place }: PeekProps) {
  return (
    <div className="space-y-3 p-4">
      <p className="text-[15px] leading-relaxed text-ink">{place.blurb}</p>
      {!isOpen(place, CURRENT_SLICE) && (
        <p className="flex items-center gap-2 text-[13px] text-ink-faint">
          <LockIcon size={16} className="text-locked" /> Not open yet
        </p>
      )}
    </div>
  )
}
