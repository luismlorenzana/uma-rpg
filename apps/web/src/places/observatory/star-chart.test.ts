// H142: the owner's "not even well positioned" as tests. Every star, ring and label is checked, and a star moved by hand fails here.
import { MAP_NODES, UMA_TYPE_NAMES, type StarMap } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { bodyName } from '../stable/copy'
import { bodyNode, CHART_BODIES, CHART_H, CHART_STARS, CHART_W, chartCoversTheMap, chartLinks, openCount, ORBIT, PLANET_AT, PLANET_RING, STAR_R, starState } from './star-chart'

const map = (...open: string[]): Pick<StarMap, 'open'> => ({ open })
/** Whole CSS px a viewBox unit is at the narrowest phone: 343 wide of 360. */
const NARROWEST = 343 / CHART_W
const ofBody = (id: string) => CHART_BODIES.find((b) => b.id === id)!

describe('the chart’s geometry', () => {
  it('has all 22 nodes, once each, in map order', () => {
    expect(CHART_STARS).toHaveLength(22)
    expect(new Set(CHART_STARS.map((star) => star.id)).size).toBe(22)
    expect(CHART_STARS.map((star) => star.id)).toEqual([...MAP_NODES])
    expect(chartCoversTheMap()).toBe(true)
  })

  it('keeps every two stars apart by a 44 pt target at 375 wide', () => {
    for (let i = 0; i < CHART_STARS.length; i++) for (let j = i + 1; j < CHART_STARS.length; j++) {
      const a = CHART_STARS[i]!, b = CHART_STARS[j]!
      expect(Math.hypot(a.x - b.x, a.y - b.y) * NARROWEST, `${a.id}, ${b.id}`).toBeGreaterThanOrEqual(44)
    }
  })

  it('keeps a body’s 44 pt crest button off its stars’ discs', () => {
    for (const body of CHART_BODIES) for (const star of body.stars) {
      expect(Math.hypot(body.hub[0] - star.x, body.hub[1] - star.y), `${body.id} ${star.id}`).toBeGreaterThanOrEqual(STAR_R + 22)
    }
  })

  it('keeps every star inside the chart', () => {
    for (const { id, x, y } of CHART_STARS) {
      expect(Math.min(x, y, CHART_W - x, CHART_H - y) - STAR_R, id).toBeGreaterThanOrEqual(4)
    }
  })

  it('puts the Planet’s stars on its ring and the moons on one true orbit', () => {
    for (const { id, x, y } of ofBody('planet').stars) expect(Math.abs(Math.hypot(x - PLANET_AT[0], y - PLANET_AT[1]) - PLANET_RING), id).toBeLessThan(0.1)
    for (const id of ['prowess', 'vigor', 'guard']) {
      const [x, y] = ofBody(id).center
      expect(Math.abs(Math.hypot(x - PLANET_AT[0], y - PLANET_AT[1]) - ORBIT), id).toBeLessThan(0.1)
    }
  })

  it('turns every body clockwise, star by star, from the top', () => {
    for (const body of CHART_BODIES.filter((b) => b.stars.length === 5)) {
      const [cx, cy] = body.center
      body.stars.forEach((star, i) => {
        const next = body.stars[(i + 1) % 5]!
        expect((star.x - cx) * (next.y - cy) - (star.y - cy) * (next.x - cx), `${star.id} to ${next.id}`).toBeGreaterThan(0)
      })
      expect(body.stars[0]!.y, body.id).toBeLessThan(cy)
    }
  })

  it('keeps labels off the stars and inside the chart, for the longest template name', () => {
    const longest = Object.values(UMA_TYPE_NAMES).flatMap((names) => Object.values(names)).reduce((a, b) => (b.length > a.length ? b : a))
    for (const body of CHART_BODIES) {
      const text = `${bodyName(body.id, longest)} ${body.stars.length}/${body.stars.length}`
      const width = text.length * 12 * 0.62
      const left = body.label.anchor === 'end' ? body.label.x - width : body.label.x - width / 2
      const right = left + width, top = body.label.y - 12, bottom = body.label.y + 3
      expect(left, text).toBeGreaterThanOrEqual(4)
      expect(right, text).toBeLessThanOrEqual(CHART_W - 4)
      for (const star of CHART_STARS) {
        const clear = star.x + STAR_R < left || star.x - STAR_R > right || star.y + STAR_R < top || star.y - STAR_R > bottom
        expect(clear, `${text} over ${star.id}`).toBe(true)
      }
    }
  })
})

describe('a star’s state', () => {
  const ready = (ids: string[]) => (id: string) => ids.includes(id)

  it('reads Open, Ready, Next and Later', () => {
    const open = map('guard:1', 'guard:2')
    expect(starState(open, 'guard:2', ready([]))).toBe('open')
    expect(starState(open, 'guard:3', ready(['guard:3']))).toBe('ready')
    expect(starState(open, 'guard:3', ready([]))).toBe('next')
    expect(starState(open, 'guard:4', ready(['guard:4']))).toBe('later')
    expect(starState(open, 'prowess:1', ready([]))).toBe('next')
  })

  it('never reads her moon Ready, since no jewel opens it, and Open once the moons bring it', () => {
    expect(starState(map(), 'template:1', ready([]))).toBe('next')
    expect(starState(map(), 'template:2', ready([]))).toBe('later')
    expect(starState(map('template:1'), 'template:1', ready([]))).toBe('open')
  })
})

describe('a body', () => {
  const guard = ofBody('guard')

  it('lights a link between two open stars, and closes its figure only when full', () => {
    const lit = (...open: string[]) => chartLinks(guard, map(...open)).filter((link) => link.lit).length
    expect(lit()).toBe(0)
    expect(lit('guard:1')).toBe(0)
    expect(lit('guard:1', 'guard:2', 'guard:3')).toBe(2)
    expect(lit('guard:1', 'guard:2', 'guard:3', 'guard:4')).toBe(3)
    const links = chartLinks(guard, map('guard:1', 'guard:2', 'guard:3', 'guard:4', 'guard:5'))
    expect(links).toHaveLength(5)
    expect(links.map((link) => link.closing)).toEqual([false, false, false, false, true])
    expect(links.every((link) => link.lit)).toBe(true)
  })

  it('gives a pair one link, no closing line', () => {
    expect(chartLinks(ofBody('template'), map())).toHaveLength(1)
    expect(chartLinks(ofBody('template'), map())[0]!.closing).toBe(false)
  })

  it('opens on its next node, or its last when full', () => {
    expect(bodyNode(map(), guard)).toBe('guard:1')
    expect(bodyNode(map('guard:1', 'guard:2'), guard)).toBe('guard:3')
    expect(bodyNode(map(...guard.stars.map((star) => star.id)), guard)).toBe('guard:5')
    expect(openCount(map('guard:1', 'prowess:1'), guard)).toBe(1)
  })
})
