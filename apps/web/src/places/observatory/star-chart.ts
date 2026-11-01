// The Stars tab's chart (H142; profile-polish §3, PP16–PP24): where every star sits and what state it's in, with no DOM. One table,
// so "not even well positioned" fails `star-chart.test.ts`: the three moons on one true circle around the Planet, each body's
// stars clockwise from I. The sky is the same in both themes, so its colors are constants, not tokens.
import { MAP_BODIES, MAP_NODES, nodeBody, nodeNumeral, type MapBody, type StarMap } from '@rpg/domain'

export type Point = readonly [x: number, y: number]
export const CHART_W = 360, CHART_H = 350
/** A star's radius, and its tap target's: 44 pt, at 375 wide too (`star-chart.test.ts`). */
export const STAR_R = 13, STAR_TARGET = 22
export const PLANET_AT: Point = [180, 208]
export const ORBIT = 132, PLANET_RING = 44
const PENTAGON = 44

const round = (value: number) => Math.round(value * 10) / 10
const onCircle = (center: Point, radius: number, degrees: number): Point => {
  const angle = (degrees * Math.PI) / 180
  return [center[0] + Math.cos(angle) * radius, center[1] + Math.sin(angle) * radius]
}
const moon = (degrees: number): Point => onCircle(PLANET_AT, ORBIT, degrees)
const regular = (radius: number): readonly Point[] => [0, 1, 2, 3, 4].map((i) => onCircle([0, 0], radius, -90 + i * 72))

export interface ChartStar { id: string; numeral: number; x: number; y: number }
export interface ChartBody {
  id: MapBody
  color: string
  center: Point
  /** The disc behind its crest; her moon has none: her crest sits between her stars. */
  hubRadius: number
  /** The crest's centre. */
  hub: Point
  /** The Planet's stars link along a true ring; every other body's by straight lines. */
  ring: number | null
  stars: readonly ChartStar[]
  label: { x: number; y: number; anchor: 'middle' | 'end' }
}

const body = (id: MapBody, color: string, center: Point, figure: readonly Point[], label: ChartBody['label'],
  hubRadius: number, ring: number | null = null, hub: Point = center): ChartBody => ({
    id, color, center, hubRadius, hub, ring, label,
    stars: figure.map(([x, y], i) => ({ id: `${id}:${i + 1}`, numeral: i + 1, x: round(center[0] + x), y: round(center[1] + y) })),
  })
const middle = (x: number, y: number): ChartBody['label'] => ({ x, y, anchor: 'middle' })
const PROWESS_AT = moon(-90)

/** Every body, in map order. Her moon's label runs from the right edge, so any template name fits (PP24). */
export const CHART_BODIES: readonly ChartBody[] = [
  body('planet', '#ffd84d', PLANET_AT, regular(PLANET_RING), middle(180, 276), 24, PLANET_RING),
  body('prowess', '#ff9a6b', PROWESS_AT, [[0, -58], [35, -12], [25, 34], [-25, 34], [-35, -12]], middle(86, 60), 21, null, [PROWESS_AT[0], PROWESS_AT[1] - 2]),
  body('vigor', '#ff8fb6', moon(150), regular(PENTAGON), middle(66, 208), 21),
  body('guard', '#8fd3ff', moon(30), [[-40, -34], [40, -34], [46, 12], [0, 52], [-46, 12]], middle(294, 216), 21),
  body('template', '#f0b8ff', [304, 62], [[-35, 0], [35, 0]], { x: 352, y: 96, anchor: 'end' }, 0),
]

/** Every star, by id. */
export const CHART_STARS: readonly ChartStar[] = CHART_BODIES.flatMap((b) => b.stars)

/** Open, set; Ready, a held jewel opens it now; Next, next in line without a level or a jewel; Later, behind that (PP21). */
export type StarState = 'open' | 'ready' | 'next' | 'later'
export function starState(map: Pick<StarMap, 'open'>, id: string, ready: (id: string) => boolean): StarState {
  if (map.open.includes(id)) return 'open'
  const numeral = nodeNumeral(id)
  if (numeral > 1 && !map.open.includes(`${nodeBody(id)}:${numeral - 1}`)) return 'later'
  return ready(id) ? 'ready' : 'next'
}

/** How a body's stars show now. */
export const openCount = (map: Pick<StarMap, 'open'>, b: Pick<ChartBody, 'stars'>): number => b.stars.filter((star) => map.open.includes(star.id)).length
/** The node a tap on a body opens: its next, or its last when full (PP26). */
export function bodyNode(map: Pick<StarMap, 'open'>, b: Pick<ChartBody, 'stars'>): string {
  return (b.stars.find((star) => !map.open.includes(star.id)) ?? b.stars[b.stars.length - 1]!).id
}

export interface ChartLink { key: string; path: string; lit: boolean; closing: boolean }
const arc = (center: Point, radius: number, from: number, to: number): string => {
  const [x0, y0] = onCircle(center, radius, from), [x1, y1] = onCircle(center, radius, to)
  return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${radius} ${radius} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`
}
/** A straight line between two stars, stopped at their edges. */
const line = (a: ChartStar, b: ChartStar): string => {
  const dx = b.x - a.x, dy = b.y - a.y, gap = (STAR_R + 1) / Math.hypot(dx, dy)
  return `M${(a.x + dx * gap).toFixed(1)} ${(a.y + dy * gap).toFixed(1)}L${(b.x - dx * gap).toFixed(1)} ${(b.y - dy * gap).toFixed(1)}`
}
/** A body's links in order, I to II and on. The last, V to I, closes the figure, lit only when the body is full; a pair has one. */
export function chartLinks(b: ChartBody, map: Pick<StarMap, 'open'>): ChartLink[] {
  const count = b.stars.length, open = (star: ChartStar) => map.open.includes(star.id)
  return b.stars.slice(0, count === 2 ? 1 : count).map((star, i) => {
    const next = b.stars[(i + 1) % count]!
    const from = -90 + i * 72 + 19
    return { key: star.id, path: b.ring ? arc(b.center, b.ring, from, from + 34) : line(star, next), lit: open(star) && open(next), closing: count > 2 && i === count - 1 }
  })
}

/** The orbit, three arcs of one true circle cut around the moons (PP17). */
export const ORBIT_ARCS: readonly string[] = [[-90, 30], [30, 150], [150, 270]].map(([from, to]) => arc(PLANET_AT, ORBIT, from! + 27, to! - 27))

/** The sky's stars, fixed from a seed so a redraw doesn't move them: x, y, radius and opacity. */
export const SKY: readonly (readonly [number, number, number, number])[] = (() => {
  let seed = 42
  const next = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  return Array.from({ length: 64 }, () => [round(next() * CHART_W), round(next() * CHART_H), round(0.5 + next() * 0.8), round(0.18 + next() * 0.42)] as const)
})()

/** Guards the table against the rules': every node once, in map order. */
export const chartCoversTheMap = (): boolean => MAP_BODIES.every((id) => CHART_BODIES.some((b) => b.id === id)) &&
  CHART_STARS.map((star) => star.id).join() === MAP_NODES.join()
