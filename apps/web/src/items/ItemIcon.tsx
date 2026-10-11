// An item, dish or gear icon from the shared atlases (@luismlorenzana/uma-art, P37–P38), drawn pixel-crisp at any
// size. Gear shows its accent as a coloured mark in the corner the art leaves clear.
import dishesUrl from '@luismlorenzana/uma-art/dishes/atlas.png?url'
import gearUrl from '@luismlorenzana/uma-art/gear/atlas.png?url'
import itemsUrl from '@luismlorenzana/uma-art/items/atlas.png?url'
import { tokenById } from '@rpg/domain'
import { ACCENT_COLOR, ATLAS_CELL, iconFrame, SHEET_SIZE, type Sheet } from './frames'
import { TokenBadge } from './TokenBadge'

export { ATLAS_CELL } from './frames'
const URL: Readonly<Record<Sheet, string>> = { items: itemsUrl, dishes: dishesUrl, gear: gearUrl }

export function ItemIcon({ id, size = 32, className = '', label }: { id: string; size?: number; className?: string; label?: string }) {
  const token = tokenById(id)
  if (token) {
    return (
      <span role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} className={`inline-block shrink-0 ${className}`} style={{ width: size, height: size }}>
        <TokenBadge token={token} size={size} />
      </span>
    )
  }
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
      {frame?.accent && (
        <span className="absolute rounded-full ring-1 ring-black/70"
          style={{ right: 1.5 * scale, bottom: 1.5 * scale, width: 6 * scale, height: 6 * scale, background: ACCENT_COLOR[frame.accent] }} />
      )}
    </span>
  )
}
