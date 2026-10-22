import atlas from '@luismlorenzana/uma-art/ui/atlas.json'
import atlasUrl from '@luismlorenzana/uma-art/ui/atlas.png?url'
import { achievementDef, FRONT_NAME, type BattleStatus, type RiftFront, type RpgClass } from '@rpg/domain'
import type { CSSProperties } from 'react'
import { STATUS_LABEL } from './labels'

const frames: Readonly<Record<string, { x: number; y: number; w: number; h: number }>> = atlas.frames
export type PixelScale = 1 | 2 | 4
/** A `ui` frame at its native CSS-pixel size (24/16/12) or a whole-number scale: never fractional at phone widths.
 * Decorative unless it's given a label. */
function PixelIcon({ frame, scale = 1, className = '', label }: { frame: string; scale?: PixelScale; className?: string; label?: string }) {
  const f = frames[frame]
  if (!f) return null
  const named = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true }
  return <span {...named} className={`inline-block shrink-0 bg-no-repeat align-middle ${className}`} style={{
    width: f.w * scale, height: f.h * scale, backgroundImage: `url(${atlasUrl})`,
    backgroundSize: `${atlas.width * scale}px ${atlas.height * scale}px`, backgroundPosition: `-${f.x * scale}px -${f.y * scale}px`,
    imageRendering: 'pixelated',
  }} />
}
/** Decorative beside the full class name, not a replacement for it. */
export function ClassEmblem({ classId }: { classId: RpgClass }) {
  return <PixelIcon frame={'class/' + classId} />
}
/** A Rift front's 16 px crest (uma-art 2.11.0), named "Iron front". */
export function FrontCrest({ front, scale = 1 }: { front: RiftFront; scale?: PixelScale }) {
  return <PixelIcon frame={'front/' + front} scale={scale} label={`${FRONT_NAME[front]} front`} />
}
/** An achievement's 24 px badge (uma-art 2.11.0). Decorative: its row or card names it. `dim`: not earned yet. */
export function AchievementBadge({ id, scale = 1, dim = false }: { id: string; scale?: PixelScale; dim?: boolean }) {
  const def = achievementDef(id)
  return def ? <PixelIcon frame={def.badge} scale={scale} className={dim ? 'opacity-40' : ''} /> : null
}
export function StatusGlyph({ status }: { status: keyof typeof STATUS_LABEL }) {
  return <PixelIcon frame={'status/' + status} />
}
export function StatusChips({ statuses, className = '', style }: {
  statuses: readonly BattleStatus[]; className?: string; style?: CSSProperties
}) {
  const live = statuses.filter((s) => s.stacks > 0 && s.turns > 0)
  if (!live.length) return null
  return <span role="group" aria-label="Statuses" className={`flex flex-wrap items-center justify-center gap-0.5 ${className}`} style={style}>
    {live.map((s) => {
      const label = `${STATUS_LABEL[s.kind]} ${s.stacks}`
      return <span key={s.kind} role="img" aria-label={label} title={label} className="inline-flex items-center gap-0.5 rounded-xs bg-page/95 px-0.5 py-px text-[10px] font-bold leading-3 text-ink">
        {frames['status/' + s.kind] ? <StatusGlyph status={s.kind} /> : <span>{STATUS_LABEL[s.kind]}</span>}
        <span aria-hidden="true">{s.stacks}</span>
      </span>
    })}
  </span>
}
