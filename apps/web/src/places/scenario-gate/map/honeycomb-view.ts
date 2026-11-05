import { continentHoneycomb, honeycombXY, type CapitalRun, type TierWorld, type WorldContinent } from '@rpg/domain'

export const HEX_SIZE = 50
export const hexPoints = (radius: number): string => Array.from({ length: 6 }, (_, i) => {
  const a = (60 * i - 30) * Math.PI / 180
  return `${radius * Math.cos(a)},${radius * Math.sin(a)}`
}).join(' ')
export const hexProgress = (won: number, total: number, radius = 41): string => `${6 * radius * won / total} ${6 * radius}`
export const runProgress = (run: CapitalRun): number => run.lanes.reduce((sum, l) => sum + l.generals + (l.finalAt ? 1 : 0), 0)
export interface RunSeat { id: string; won: boolean; at?: string; lanes: string[][]; progress: number }
export function capitalSeats(world: TierWorld, continent: string): RunSeat[] {
  const open = (world.capitalRuns ?? []).filter((r) => r.continent === continent)
    .map((r) => ({ id: r.id, won: false, lanes: r.lanes.map((l) => l.umas), progress: runProgress(r) }))
  const won = (world.capitals?.[continent]?.recent ?? []).slice(0, Math.max(0, 6 - open.length))
    .map((r) => ({ id: r.id, won: true, at: r.wonAt, lanes: r.lanes, progress: 16 }))
  return [...won, ...open]
}
export function honeycombGeometry(continent: WorldContinent) {
  const tiles = continentHoneycomb(continent), points = tiles.map((t) => honeycombXY(t, HEX_SIZE))
  const left = Math.min(...points.map((p) => p.x)) - 47, right = Math.max(...points.map((p) => p.x)) + 47
  const top = Math.min(...points.map((p) => p.y)) - 54, bottom = Math.max(...points.map((p) => p.y)) + 54
  return { tiles, left, right, top, bottom, width: right - left, height: bottom - top }
}
export function honeycombFrontier(continent: WorldContinent, completed: (id: string) => boolean): string {
  const regions = new Map(continent.regions.map((r) => [r.id, r]))
  return continentHoneycomb(continent).filter((t) => t.kind === 'region' && t.id && !completed(t.id))
    .sort((a, b) => regions.get(a.id!)!.level - regions.get(b.id!)!.level)[0]?.id ?? continent.id
}
export interface MapTransform { zoom: number; x: number; y: number }
/** Centre on the frontier where the fitted map can scroll; keep the whole fitted map in view on a smaller axis. */
export function fittedTransform(g: ReturnType<typeof honeycombGeometry>, width: number, height: number, frontier: string): MapTransform {
  const fit = Math.min((width - 8) / g.width, (height - 8) / g.height)
  const tile = g.tiles.find((t) => t.id === frontier), point = tile ? honeycombXY(tile, HEX_SIZE) : { x: 0, y: 0 }
  const axis = (size: number, low: number, high: number, focus: number) => {
    if ((high - low) * fit <= size - 8) return size / 2 - (low + high) * fit / 2
    const start = size / 2 - focus * fit
    return Math.max(size - 4 - high * fit, Math.min(4 - low * fit, start))
  }
  return { zoom: 1, x: axis(width, g.left, g.right, point.x), y: axis(height, g.top, g.bottom, point.y) }
}
export const dotColor = (id: string): string => `hsl(${[...id].reduce((n, c) => (n * 31 + c.charCodeAt(0)) % 360, 0)} 58% 56%)`
export const mapDate = (at: string): string => new Date(at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
