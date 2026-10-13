import atlas from '@luismlorenzana/uma-art/ui/atlas.json'
import atlasUrl from '@luismlorenzana/uma-art/ui/atlas.png?url'
import type { BattleStatus, RpgClass } from '@rpg/domain'
import type { CSSProperties } from 'react'
import { STATUS_LABEL } from './labels'

const frames: Readonly<Record<string, { x: number; y: number; w: number; h: number }>> = atlas.frames
/** Native 24/12 CSS-pixel sizes: no fractional sprite scaling at phone widths. */
function PixelIcon({ frame }: { frame: string }) {
  const f = frames[frame]
  if (!f) return null
  return <span aria-hidden="true" className="inline-block shrink-0 bg-no-repeat align-middle" style={{
    width: f.w, height: f.h, backgroundImage: `url(${atlasUrl})`,
    backgroundSize: `${atlas.width}px ${atlas.height}px`, backgroundPosition: `-${f.x}px -${f.y}px`,
    imageRendering: 'pixelated',
  }} />
}
/** Decorative beside the full class name, not a replacement for it. */
export function ClassEmblem({ classId }: { classId: RpgClass }) {
  return <PixelIcon frame={'class/' + classId} />
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
