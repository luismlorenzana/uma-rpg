// The Hub's ground as a tile grid (D61): seeded ground variants, a path network from every place's door to the page's
// trunk road down the middle (the Wilds also get a stream along their east edge), and props scattered where nothing else is. Pure, so the
// same page always lays out the same way; the scene only draws what this returns. Frame ids follow the tiles atlas
// in @luismlorenzana/uma-art (`<page>/ground-<n>`, `<page>/path-<mask>`, `wilds/water-<mask>`, `<page>/<prop>`).
import type { HubPage } from '@rpg/domain'
import { placeCell } from '../grid'

/** Connection bits for path and water masks. */
export const N = 1, E = 2, S = 4, W = 8

export const PROPS: Readonly<Record<HubPage, readonly { id: string; tall: boolean }[]>> = {
  wilds: [{ id: 'pine', tall: true }, { id: 'boulder', tall: false }, { id: 'rock', tall: false }, { id: 'grass-tuft', tall: false }, { id: 'mushrooms', tall: false }, { id: 'log', tall: false }],
  learning: [{ id: 'lamp', tall: true }, { id: 'hedge', tall: false }, { id: 'bench', tall: false }, { id: 'banner', tall: true }, { id: 'flower-bed', tall: false }],
  town: [{ id: 'lamp', tall: true }, { id: 'barrel', tall: false }, { id: 'crate', tall: false }, { id: 'flower-pot', tall: false }, { id: 'bench', tall: false }, { id: 'tree', tall: true }],
}

export interface TerrainPlace { id: string; at: { x: number; y: number } }
export interface Terrain {
  cols: number
  rows: number
  /** One frame id per cell, row by row: ground, path or water. */
  cells: string[]
  /** Props, bottom-left cell; tall ones take the cell above too. */
  props: { col: number; row: number; frame: string; tall: boolean }[]
  /** Each place's footprint: columns c−1…c+1 and rows r−2…r. */
  footprints: Record<string, { col: number; row: number }>
}

function hash(a: number, b: number, c: number): number {
  let h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

export function layTerrain(page: HubPage, places: readonly TerrainPlace[], cols: number, rows: number): Terrain {
  const seed = page.length * 31 + page.charCodeAt(0)
  const kind: ('ground' | 'path' | 'water' | 'block' | 'clear')[] = Array.from({ length: cols * rows }, () => 'ground')
  const at = (c: number, r: number) => (c >= 0 && r >= 0 && c < cols && r < rows ? kind[r * cols + c] : undefined)
  const set = (c: number, r: number, k: (typeof kind)[number], over: readonly string[] = ['ground', 'clear']) => {
    if (c < 0 || r < 0 || c >= cols || r >= rows) return
    if (over.includes(kind[r * cols + c]!)) kind[r * cols + c] = k
  }
  const footprints: Terrain['footprints'] = {}
  for (const p of places) {
    const cell = placeCell(p.at, cols, rows)
    footprints[p.id] = cell
    for (let c = cell.col - 1; c <= cell.col + 1; c++) for (let r = cell.row - 2; r <= cell.row; r++) set(c, r, 'block', ['ground', 'clear', 'path', 'water'])
  }
  const mid = Math.floor(cols / 2)
  // One road down the middle; the Wilds also get a stream along the east edge, clear of every building.
  const trunks = [mid]
  if (page === 'wilds') {
    for (let r = 0; r < rows; r++) {
      const wobble = hash(Math.floor(r / 5), 1, seed) > 0.5 ? 1 : 0
      set(cols - 2 + wobble, r, 'water')
      // Where the stream steps sideways, both cells carry water so the banks join.
      if (r > 0 && at(cols - 2 + wobble, r - 1) !== 'water') set(cols - 2 + (1 - wobble), r, 'water')
    }
  }
  // No cross road: place rows sit too close together, so it would run into buildings and double up beside their doors.
  for (const t of trunks) for (let r = 0; r < rows; r++) set(t, r, 'path')
  // Branches: from each place's door (the cell below its footprint) to the nearest trunk on its side.
  for (const p of places) {
    const { col, row } = footprints[p.id]!
    const door = row + 1
    if (door >= rows) continue
    const trunk = trunks.reduce((best, t) => (Math.abs(t - col) < Math.abs(best - col) ? t : best), trunks[0]!)
    const step = trunk >= col ? 1 : -1
    for (let c = col; c !== trunk + step; c += step) set(c, door, 'path')
  }
  // Keep each place's label row clear of props (it sits under the door).
  for (const p of places) {
    const { col, row } = footprints[p.id]!
    for (let c = col - 2; c <= col + 2; c++) for (let r = row + 1; r <= row + 2; r++) set(c, r, 'clear')
  }
  // Paths and water at the map's edge run on off the map.
  const mask = (c: number, r: number, k: 'path' | 'water') => {
    const same = (cc: number, rr: number) => {
      const v = at(cc, rr)
      return v === undefined ? true : v === k
    }
    return (same(c, r - 1) ? N : 0) | (same(c + 1, r) ? E : 0) | (same(c, r + 1) ? S : 0) | (same(c - 1, r) ? W : 0)
  }
  const cells: string[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const k = kind[r * cols + c]
      if (k === 'path') cells.push(`${page}/path-${mask(c, r, 'path')}`)
      else if (k === 'water') cells.push(`wilds/water-${mask(c, r, 'water')}`)
      else {
        const v = hash(c, r, seed)
        cells.push(`${page}/ground-${v < 0.62 ? 0 : v < 0.82 ? 1 : v < 0.92 ? 2 : 3}`)
      }
    }
  }
  // Props: on plain ground away from paths, water and buildings, about one cell in eight.
  const props: Terrain['props'] = []
  const free = (c: number, r: number) => at(c, r) === 'ground'
  const nearBusy = (c: number, r: number) => {
    for (let dc = -1; dc <= 1; dc++) for (let dr = -1; dr <= 1; dr++) {
      const v = at(c + dc, r + dr)
      if (v === 'block' || v === 'water' || (v === 'path' && dc === 0 && dr === 0)) return true
    }
    return false
  }
  const list = PROPS[page]
  for (let r = 1; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!free(c, r) || nearBusy(c, r) || hash(c, r, seed + 7) > 0.12) continue
      const prop = list[Math.floor(hash(c, r, seed + 13) * list.length)]!
      if (prop.tall && (!free(c, r - 1) || nearBusy(c, r - 1))) continue
      if (props.some((p) => Math.abs(p.col - c) <= 1 && Math.abs(p.row - r) <= 1)) continue
      props.push({ col: c, row: r, frame: `${page}/${prop.id}`, tall: prop.tall })
    }
  }
  return { cols, rows, cells, props, footprints }
}
