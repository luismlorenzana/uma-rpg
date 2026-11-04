// Native pixel crests and stat marks from uma-art's UI atlas (H141, H144).
import type { MapBody } from '@rpg/domain'
import { PixelIcon } from '../../battle/pixel-icons'

/** A body's 24 px crest. Decorative: its button names it. */
export function StarCrest({ body }: { body: MapBody }) {
  return <PixelIcon frame={`star/${body}`} />
}
export type StatMarkId = 'hp' | 'mp' | 'atk' | 'matk' | 'def' | 'mdef' | 'evasion' | 'limit'

/** A stat's 16 px mark. Decorative: its label stays beside it. */
export function StatMark({ stat, className = '' }: { stat: StatMarkId; className?: string }) {
  return <span aria-hidden="true" className={`inline-block size-4 shrink-0 leading-none ${className}`} data-stat-mark={stat}>
    <PixelIcon frame={`stat/${stat}`} />
  </span>
}
