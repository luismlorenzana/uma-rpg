// The Rift's quick look (H50): why it's shut, or its status and the run's fronts at a glance. Main-index selectors only.
import { FRONT_NAME, openRiftRun, placeLock, RIFT_FRONTS, RIFT_OPEN_AT, RIFT_ROSTER, RIFT_STAGES, riftLevel50s } from '@rpg/domain'
import { FrontCrest } from '../../battle/pixel-icons'
import { riftLine } from '../../hub/TierSheet'
import { useActiveTier, useWorld } from '../../save/game'
import { LockIcon } from '../../ui/icons'
import type { PeekProps } from '../registry'

export default function RiftPeek({ place }: PeekProps) {
  const world = useWorld()
  const tier = useActiveTier()
  const lock = placeLock(place, world, tier)
  if (!world) return null
  const run = openRiftRun(world.rift)
  const n50 = riftLevel50s(world)
  return (
    <div className="space-y-3 p-4">
      {lock ? (
        <p className="flex items-center gap-2 text-[13px] text-ink-faint">
          <LockIcon size={16} className="text-locked" /> {lock}{lock.startsWith('Opens') ? ` · ${n50}/${RIFT_OPEN_AT}` : ''}
        </p>
      ) : (
        <div>
          <p className="text-[14px] font-semibold">{riftLine(world, tier)}</p>
          {!run && <p className="text-[13px] text-ink-soft">{n50 >= RIFT_ROSTER ? `${n50} Lv 50 Umas` : `${n50} of ${RIFT_ROSTER} at Lv 50 to sign up`}</p>}
        </div>
      )}
      {!lock && run && (
        <ul className="grid grid-cols-2 gap-1.5">
          {RIFT_FRONTS.map((front) => (
            <li key={front} className="flex items-center gap-2 rounded-sm bg-raised px-2.5 py-2 text-[13px]">
              <FrontCrest front={front} />
              <span className="min-w-0 flex-1 truncate font-semibold">{FRONT_NAME[front]}</span>
              <span className="shrink-0 text-ink-soft">{run.fronts[front] >= RIFT_STAGES ? 'Sealed' : `${run.fronts[front]}/${RIFT_STAGES}`}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
