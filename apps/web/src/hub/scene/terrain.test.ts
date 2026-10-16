import { placesOn, HUB_PAGES } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { buildingFrame } from '../grid'
import { E, layTerrain, N, S, W } from './terrain'

const COLS = 17
const ROWS = 30

describe('Hub terrain (D61)', () => {
  for (const page of HUB_PAGES) {
    it(`lays out ${page}: deterministic, every door on the path network, joined masks, props on free ground`, () => {
      const places = placesOn(page)
      const t = layTerrain(page, places, COLS, ROWS)
      expect(layTerrain(page, places, COLS, ROWS)).toEqual(t)
      expect(t.cells).toHaveLength(COLS * ROWS)
      const kindAt = (c: number, r: number) => (c < 0 || r < 0 || c >= COLS || r >= ROWS ? 'edge' : t.cells[r * COLS + c]!.split('/')[1]!.split('-')[0]!)
      const maskAt = (c: number, r: number) => Number(t.cells[r * COLS + c]!.split('-').pop())
      // Masks agree with their neighbours both ways.
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        const k = kindAt(c, r)
        if (k !== 'path' && k !== 'water') continue
        const m = maskAt(c, r)
        for (const [bit, dc, dr] of [[N, 0, -1], [E, 1, 0], [S, 0, 1], [W, -1, 0]] as const) {
          const n = kindAt(c + dc, r + dr)
          expect(Boolean(m & bit)).toBe(n === k || n === 'edge')
        }
      }
      // Every place's door is a path cell that reaches the map edge (a trunk) through paths.
      const seen = new Set<string>()
      const queue: [number, number][] = []
      for (let c = 0; c < COLS; c++) for (const r of [0, ROWS - 1]) if (kindAt(c, r) === 'path') queue.push([c, r])
      while (queue.length) {
        const [c, r] = queue.pop()!
        const key = `${c},${r}`
        if (seen.has(key) || kindAt(c, r) !== 'path') continue
        seen.add(key)
        queue.push([c + 1, r], [c - 1, r], [c, r + 1], [c, r - 1])
      }
      for (const p of places) {
        const { col, row } = t.footprints[p.id]!
        if (row + 1 >= ROWS) continue
        expect(seen.has(`${col},${row + 1}`), `${p.id}'s door`).toBe(true)
      }
      for (const prop of t.props) {
        expect(kindAt(prop.col, prop.row)).toBe('ground')
        if (prop.tall) expect(kindAt(prop.col, prop.row - 1)).toBe('ground')
      }
      expect(t.props.length).toBeGreaterThan(3)
    })
  }
})

describe('Hub art (P38)', () => {
  it('uses the dedicated H29 Lapidary workshop, not an Armory alias', async () => {
    const { frames } = (await import('@luismlorenzana/uma-art/buildings/atlas.json')).default
    expect(buildingFrame('lapidary')).toBe('lapidary')
    expect(frames.lapidary).toEqual({ x: 192, y: 288, w: 48, h: 48, page: 'wilds', anchorY: 44 })
    expect(placesOn('wilds').some(p => p.id === 'lapidary')).toBe(true)
  })
  it('draws only frames the tiles and buildings atlases have', async () => {
    const tiles = (await import('@luismlorenzana/uma-art/tiles/atlas.json')).default.frames as Record<string, unknown>
    const buildings = (await import('@luismlorenzana/uma-art/buildings/atlas.json')).default.frames as Record<string, unknown>
    const { PROPS } = await import('./terrain')
    for (const page of HUB_PAGES) {
      for (const n of [0, 1, 2, 3]) expect(tiles[`${page}/ground-${n}`], `${page}/ground-${n}`).toBeDefined()
      for (let m = 0; m < 16; m++) expect(tiles[`${page}/path-${m}`], `${page}/path-${m}`).toBeDefined()
      for (const p of PROPS[page]) expect(tiles[`${page}/${p.id}`], `${page}/${p.id}`).toBeDefined()
      for (const place of placesOn(page)) expect(buildings[buildingFrame(place.id)], place.id).toBeDefined()
      for (const [cols, rows] of [[16, 29], [COLS, ROWS], [12, 22]] as const) for (const f of layTerrain(page, placesOn(page), cols, rows).cells) expect(tiles[f], f).toBeDefined()
    }
    for (let m = 0; m < 16; m++) expect(tiles[`wilds/water-${m}`]).toBeDefined()
  })
})
