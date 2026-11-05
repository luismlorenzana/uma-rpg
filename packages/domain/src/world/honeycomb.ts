// The approved preview's geometry (D295, H163). Pure data: the screen and save records are separate packets.
import type { WorldContinent } from './world'

interface Axial { q: number; r: number }
export interface HoneyTile extends Axial {
  kind: 'capital' | 'seat' | 'spring' | 'region' | 'open'
  id?: string
  seat?: number
}

const DIRS: readonly Axial[] = [{ q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 },
  { q: -1, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 }]
const corner = (k: number, i: number): Axial => ({ q: DIRS[i]!.q * k, r: DIRS[i]!.r * k })
const same = (a: Axial, b: Axial): boolean => a.q === b.q && a.r === b.r

/** Pointy-top axial coordinates; size is a hex's centre-to-corner radius. Screen y increases downwards. */
export function honeycombXY(tile: Axial, size: number): { x: number; y: number } {
  return { x: size * Math.sqrt(3) * (tile.q + tile.r / 2), y: size * 1.5 * tile.r }
}

function ring(k: number): Axial[] {
  const out: Axial[] = []
  let cur = corner(k, 4)
  for (const dir of DIRS) for (let j = 0; j < k; j++) {
    out.push(cur)
    cur = { q: cur.q + dir.q, r: cur.r + dir.r }
  }
  return out
}

const angle = (tile: Axial): number => {
  const { x, y } = honeycombXY(tile, 50)
  return ((Math.atan2(y, x) * 180 / Math.PI) % 360 + 360) % 360
}
const ahead = (tile: Axial, start: number): number => ((angle(tile) - start) % 360 + 360) % 360
const clockwise = (list: readonly Axial[], start: number): Axial[] => [...list].sort((a, b) => ahead(a, start) - ahead(b, start))

/** All 61 places in preview order. Partial historical inputs leave missing region slots open. */
export function continentHoneycomb(continent: WorldContinent): HoneyTile[] {
  const out: HoneyTile[] = [{ q: 0, r: 0, kind: 'capital' }]
  const byRow = (row: number) => continent.regions.filter((r) => r.row === row && r.col < 4).sort((a, b) => a.col - b.col)
  const place = (at: Axial, id: string | undefined) => out.push({ ...at, kind: id ? 'region' : 'open', ...(id ? { id } : {}) })
  const extra = (n: number) => continent.regions.find((r) => r.id === `${continent.id}-x-${n}`)?.id

  clockwise(ring(1), 270).forEach((at, i) => out.push({ ...at, kind: 'seat', seat: i + 1 }))
  const inner = [9, 8, 7].flatMap(byRow)
  clockwise(ring(2), 270).forEach((at, i) => place(at, inner[i]?.id))

  const corners3 = DIRS.map((_, i) => corner(3, i))
  corners3.forEach((at, i) => out.push({ ...at, kind: 'spring', id: `${continent.id}-spring${i + 1}` }))
  const sides3 = ring(3).filter((at) => !corners3.some((c) => same(c, at)))
  sides3.filter((at) => Math.abs(at.r) === 3).forEach((at, i) => place(at, extra(5 + i)))
  const middle = [6, 5].flatMap(byRow)
  clockwise(sides3.filter((at) => Math.abs(at.r) !== 3), 270).forEach((at, i) => place(at, middle[i]?.id))

  const diagonals4 = [1, 2, 4, 5].map((i) => corner(4, i))
  diagonals4.forEach((at, i) => place(at, extra(i + 1)))
  const shore = [0, 1, 2, 3, 4].flatMap(byRow)
  clockwise(ring(4).filter((at) => !diagonals4.some((c) => same(c, at))), 90).forEach((at, i) => place(at, shore[i]?.id))
  return out
}

/** The nearest Spring's id, or undefined for an unknown region. Equal distances go to the Spring ahead clockwise,
 * rather than to the lowest id: this gives all six Springs exactly eight regions in the 48-region world. */
export function nearestSpring(continent: WorldContinent, regionId: string): string | undefined {
  const tiles = continentHoneycomb(continent), region = tiles.find((t) => t.kind === 'region' && t.id === regionId)
  if (!region) return undefined
  const { x, y } = honeycombXY(region, 50)
  const springs = tiles.filter((t) => t.kind === 'spring').map((tile) => {
    const pos = honeycombXY(tile, 50)
    return { tile, distance: (pos.x - x) ** 2 + (pos.y - y) ** 2 }
  })
  const min = Math.min(...springs.map((s) => s.distance))
  return springs.filter((s) => s.distance - min < 1e-6)
    .sort((a, b) => ahead(a.tile, angle(region)) - ahead(b.tile, angle(region)))[0]?.tile.id
}
