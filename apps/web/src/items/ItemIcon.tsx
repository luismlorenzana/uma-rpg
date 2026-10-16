// An item, gear or Star Gem icon from the shared atlases (@luismlorenzana/uma-art, P37–P38), drawn pixel-crisp at any
// size. A piece drawn with another type's art shows its kind as a badge (D86); Star Gems use their own sheet (H29).
import gearUrl from '@luismlorenzana/uma-art/gear/atlas.png?url'
import gemsUrl from '@luismlorenzana/uma-art/gems/atlas.png?url'
import itemsUrl from '@luismlorenzana/uma-art/items/atlas.png?url'
import { KindMark } from '../battle/labels'
import { ATLAS_CELL, iconFrame, SHEET_SIZE, type Sheet } from './frames'

const URL: Readonly<Record<Sheet, string>> = { items: itemsUrl, gear: gearUrl, gems: gemsUrl }

export function ItemIcon({ id, size = 32, className = '', label }: { id: string; size?: number; className?: string; label?: string }) {
  const frame = iconFrame(id)
  const scale = size / ATLAS_CELL
  const sheet = frame ? SHEET_SIZE[frame.sheet] : null
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`relative inline-block shrink-0 bg-no-repeat ${className}`}
      style={{
        width: size, height: size, imageRendering: 'pixelated',
        ...(frame && sheet ? { backgroundImage: `url(${URL[frame.sheet]})`, backgroundSize: `${sheet.w * scale}px ${sheet.h * scale}px`, backgroundPosition: `-${frame.x * scale}px -${frame.y * scale}px` } : {}),
      }}
    >
      {frame?.kind && (
        <span className="absolute left-0 top-0 inline-flex items-center justify-center rounded-full bg-black/70" style={{ width: 12 * scale, height: 12 * scale }}>
          <KindMark kind={frame.kind} size={Math.max(8, Math.round(9 * scale))} />
        </span>
      )}
    </span>
  )
}
