// Geometry follows uma-platform scripts/pixel-art/src/world/maps.ts (H06). No painters or DOM.
import type { Biome } from '@rpg/domain'
import { visuals } from './visuals'
import { rng } from './random'
export const cornerMaskAt = (on: (x: number, y: number) => boolean, x: number, y: number): number =>
  (on(x, y) ? 1 : 0) | (on(x + 1, y) ? 2 : 0) | (on(x + 1, y + 1) ? 4 : 0) | (on(x, y + 1) ? 8 : 0)
export const edgeMaskAt = (on: (x: number, y: number) => boolean, x: number, y: number): number =>
  (on(x, y - 1) ? 1 : 0) | (on(x + 1, y) ? 2 : 0) | (on(x, y + 1) ? 4 : 0) | (on(x - 1, y) ? 8 : 0)
export function closesBlock(c: ReadonlySet<string>, x: number, y: number): boolean {
  for (const [dx, dy] of [[0, 0], [-1, 0], [0, -1], [-1, -1]]) {
    const ox = x + dx!, oy = y + dy!
    if ([[ox, oy], [ox + 1, oy], [ox, oy + 1], [ox + 1, oy + 1]]
      .filter(([cx, cy]) => cx !== x || cy !== y).every(([cx, cy]) => hasCell(c, cx!, cy!))) return true
  }
  return false
}
type StageKind = 'fight' | 'elite' | 'boss'
type StageState = 'locked' | 'open' | 'cleared'
export const REGION_COLS = 16, REGION_ROWS = 22, STAGE_TILES = 2
export const REGION_SPRING = { col: 8, row: 19 } as const
export type Cells = Set<string>
export const cellKey = (x: number, y: number): string => `${x},${y}`
export const hasCell = (cells: ReadonlySet<string>, x: number, y: number): boolean => cells.has(cellKey(x, y))
export interface StageSpot { x: number; y: number; kind: StageKind; state: StageState }
export interface RegionLayout { road: Cells; wet: Cells; stages: StageSpot[]; ponds: Cells[] }
/** Half-tile columns and quarter-tile rises still land on whole art pixels; reserve every intersecting tile. */
export const stageCoversCell = (s: StageSpot, x: number, y: number): boolean =>
  x < s.x + STAGE_TILES && x + 1 > s.x && y < s.y + STAGE_TILES && y + 1 > s.y
export const stageEntrance = (s: StageSpot): { x: number; y: number } =>
  ({ x: Math.floor(s.x + STAGE_TILES / 2), y: Math.ceil(s.y + STAGE_TILES) })

/** Every 2×2 ground deal contains all four variants, shuffled independently so a 4×4 plot has no regular pattern. */
export function worldVariantAt(label: string, x: number, y: number): number {
  const order = [0, 1, 2, 3], r = rng(`${label}:ground:${Math.floor(x / 2)},${Math.floor(y / 2)}`)
  for (let i = 3; i > 0; i--) {
    const j = Math.floor(r() * (i + 1)), v = order[i]!
    order[i] = order[j]!; order[j] = v
  }
  return order[(x % 2) + (y % 2) * 2]!
}

function markRoad(cells: Cells, x: number, y: number, rows: number): void {
  if (x >= 0 && x < REGION_COLS && y >= 0 && y < rows && !closesBlock(cells, x, y)) cells.add(cellKey(x, y))
}

/** Grow a filled blob from a 2×2 seed, adding overlapping 2×2 lobes, never stamping an ellipse.
 * Every vertex remains in a full core; bounded growth keeps the narrow map's roads/markers clear. */
export function growPond(random: () => number, px: number, py: number): Cells {
  const block = (x: number, y: number): string[] => [cellKey(x, y), cellKey(x + 1, y), cellKey(x, y + 1), cellKey(x + 1, y + 1)]
  const cells = new Set(block(px, py)), target = 7 + Math.floor(random() * 3)
  for (let step = 0; step < 20 && cells.size < target; step++) {
    const choices: string[][] = []
    for (let y = py - 2; y <= py + 2; y++) for (let x = px - 2; x <= px + 2; x++) {
      const lobe = block(x, y), overlap = lobe.filter((k) => cells.has(k)).length
      if (overlap < 2 || overlap === 4) continue
      const points = [...cells, ...lobe].map((k) => k.split(',').map(Number))
      const xs = points.map((p) => p[0]!), ys = points.map((p) => p[1]!)
      if (Math.max(...xs) - Math.min(...xs) > 3 || Math.max(...ys) - Math.min(...ys) > 4) continue
      choices.push(lobe)
    }
    if (!choices.length) break
    for (const k of choices[Math.floor(random() * choices.length)]!) cells.add(k)
  }
  return cells
}

export function regionTopology(biome: Biome, label: string): RegionLayout {
  const road: Cells = new Set()
  const stages: StageSpot[] = []
  for (let i = 0; i < 12; i++) {
    const band = Math.floor(i / 3), step = i % 3, col = band % 2 === 0 ? step : 2 - step
    stages.push({ x: 2.5 + col * 5, y: 16 - band * 4 - step / 4,
      kind: i === 11 ? 'boss' : i === 10 ? 'elite' : 'fight', state: i < 4 ? 'cleared' : i === 4 ? 'open' : 'locked' })
  }
  const line = (x0: number, y0: number, x1: number, y1: number) => {
    for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++)
      for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) markRoad(road, x, y, REGION_ROWS)
  }
  // Three-column snake: 1→2→3, 6←5←4, 7→8→9, 12←11←10. Each following sprite rises 4px within its row.
  // Roads join the doors below each row, turning outside the footprints on alternating edges.
  line(3, REGION_ROWS - 1, 3, 18)
  stages.forEach((s, i) => {
    if (!i) return
    const p = stageEntrance(stages[i - 1]!), next = stageEntrance(s), px = p.x, py = p.y, x = next.x, y = next.y
    if (py === y) line(px, y, x, y)
    else {
      const edge = px < 8 ? 0 : 15
      line(px, py, edge, py); line(edge, py, edge, y); line(edge, y, x, y)
    }
  })
  // The same continent Spring stays below the first row, with room for its 44pt target.
  line(REGION_SPRING.col, 18, REGION_SPRING.col, REGION_SPRING.row + 1)
  const occupied = (x: number, y: number) => stages.some((s) => stageCoversCell(s, x, y))
    || x === REGION_SPRING.col && y >= REGION_SPRING.row && y < REGION_SPRING.row + 2
  const wet: Cells = new Set(), ponds: Cells[] = []
  if (visuals[biome].liquid) {
    const r = rng(`${label}:liquid`)
    for (let attempt = 0; attempt < 150 && ponds.length < 2; attempt++) {
      const px = 1 + Math.floor(r() * (REGION_COLS - 2)), py = 1 + Math.floor(r() * (REGION_ROWS - 2))
      const patch = growPond(r, px, py)
      const points = [...patch].map((k) => k.split(',').map(Number))
      const minX = Math.min(...points.map((p) => p[0]!)), maxX = Math.max(...points.map((p) => p[0]!))
      const minY = Math.min(...points.map((p) => p[1]!)), maxY = Math.max(...points.map((p) => p[1]!))
      // Reject rectangles too: each accepted pond has at least one irregular inlet or lobe.
      if (patch.size === (maxX - minX + 1) * (maxY - minY + 1)) continue
      const touches = (tx: number, ty: number) => cornerMaskAt((cx, cy) => hasCell(patch, cx, cy), tx, ty) !== 0
      let fits = true
      for (let ty = minY - 1; ty <= maxY; ty++)
        for (let tx = minX - 1; tx <= maxX; tx++) {
          if (!touches(tx, ty)) continue
          if (tx < 0 || ty < 0 || tx >= REGION_COLS || ty >= REGION_ROWS || hasCell(road, tx, ty) || cornerMaskAt((cx, cy) => hasCell(wet, cx, cy), tx, ty)
            || occupied(tx, ty)) fits = false
        }
      if (!fits) continue
      patch.forEach((k) => wet.add(k)); ponds.push(patch)
    }
  }
  return { road, wet, stages, ponds }
}
