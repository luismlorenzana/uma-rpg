// An item's icon from the shared atlas (@luismlorenzana/uma-art, P37): ten grades across, a raw and a refined row per
// family in catalog order, drawn pixel-crisp at any whole-number size.
import { ITEM_FAMILIES, itemById } from '@rpg/domain'
import atlasUrl from '@luismlorenzana/uma-art/items/atlas.png?url'

export const ATLAS_CELL = 32
const ROW = new Map(ITEM_FAMILIES.map((f, i) => [f.id, i * 2]))

/** Where an item sits on the atlas, in atlas pixels. */
export function itemFrame(id: string): { x: number; y: number } | null {
  const item = itemById(id)
  const row = item ? ROW.get(item.family) : undefined
  return item && row !== undefined ? { x: (item.grade - 1) * ATLAS_CELL, y: (row + (item.refined ? 1 : 0)) * ATLAS_CELL } : null
}

export function ItemIcon({ id, size = 32, className = '', label }: { id: string; size?: number; className?: string; label?: string }) {
  const frame = itemFrame(id)
  const scale = size / ATLAS_CELL
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`inline-block shrink-0 bg-no-repeat ${className}`}
      style={{
        width: size, height: size, imageRendering: 'pixelated',
        ...(frame ? { backgroundImage: `url(${atlasUrl})`, backgroundSize: `${320 * scale}px ${1024 * scale}px`, backgroundPosition: `-${frame.x * scale}px -${frame.y * scale}px` } : {}),
      }}
    />
  )
}
