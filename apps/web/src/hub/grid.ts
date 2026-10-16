// The Hub map's grid (D61, P38): 16 px art tiles drawn at a whole number of device pixels per art pixel. Shared by the
// Phaser scene, which snaps every building to it, and the DOM labels, which sit on the same spots.

export const ART_TILE = 16
/** A building sprite's size and ground line, in art pixels (uma-art buildings atlas). */
export const BUILDING = { size: 48, anchorY: 44 } as const

/** The device pixel ratio the Hub renders at (2 at most: more costs fill rate for nothing visible). */
export const hubDpr = (): number => Math.min(window.devicePixelRatio || 1, 2)
/** CSS px per art pixel: 1.5 on 2× screens (3 device pixels), 2 on 1× ones. */
export const artScale = (dpr: number): number => (dpr >= 2 ? 1.5 : 2)

export interface HubGrid { scale: number; tile: number; cols: number; rows: number }
export function hubGrid(w: number, h: number, dpr: number): HubGrid {
  const scale = artScale(dpr)
  const tile = ART_TILE * scale
  return { scale, tile, cols: Math.max(1, Math.ceil(w / tile)), rows: Math.max(1, Math.ceil(h / tile)) }
}

/** The cell a place stands on: its column and the row its ground line is in. */
export function placeCell(at: { x: number; y: number }, cols: number, rows: number): { col: number; row: number } {
  return { col: Math.min(cols - 1, Math.max(0, Math.floor(at.x * cols))), row: Math.min(rows - 1, Math.max(0, Math.floor(at.y * rows))) }
}

/** Where a place's building meets the ground, in CSS px: its sprite spans its column ±1 and the two rows above. */
export function placeAnchor(at: { x: number; y: number }, grid: HubGrid): { x: number; y: number } {
  const { col, row } = placeCell(at, grid.cols, grid.rows)
  return { x: (col + 0.5) * grid.tile, y: (row - 2) * grid.tile + BUILDING.anchorY * grid.scale }
}

/** Places drawn with another place's sprite until they get their own (D70 merged four armories into these two; the
 * Lapidary, D144, waits for H29's building). */
const BUILDING_ART: Readonly<Record<string, string>> = { armory: 'knights-bastion', jeweler: 'arcane-armory', lapidary: 'arcane-armory' }
export const buildingFrame = (placeId: string): string => BUILDING_ART[placeId] ?? placeId
