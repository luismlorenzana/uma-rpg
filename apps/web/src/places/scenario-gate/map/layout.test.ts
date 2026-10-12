import { BIOMES, worldContinent } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { clearedIn, continentLayout, regionLayout, worldLayout, type MapLayout } from './layout'
import { frames } from './visuals'
const continents = Array.from({ length: 5 }, (_, i) => worldContinent({ name: 'Synthetic island ' + i, order: i + 1 }))
const progress = { wins: { 'w1-1-1-s1': 1, 'w1-1-1-s2': 1, 'w1-1-1-s3': 2, 'w1-1-1-s4': 1 } }
function check(layout: MapLayout) {
  for (const c of layout.cells) { expect(frames[c.frame], c.frame).toBeDefined(); expect(c.col).toBeGreaterThanOrEqual(0); expect(c.col).toBeLessThan(layout.cols); expect(c.row).toBeGreaterThanOrEqual(0); expect(c.row).toBeLessThan(layout.rows) }
  const roads = new Set(layout.cells.filter((c) => c.frame.startsWith('road/')).map((c) => c.col + ',' + c.row))
  for (const k of roads) {
    const [x, y] = k.split(',').map(Number) as [number, number]
    expect([roads.has((x + 1) + ',' + y), roads.has(x + ',' + (y + 1)), roads.has((x + 1) + ',' + (y + 1))].every(Boolean)).toBe(false)
  }
  const markers = layout.sprites.filter((s) => s.frame.startsWith('marker/'))
  for (const s of layout.sprites) {
    const f = frames[s.frame]!
    expect(f, s.frame).toBeDefined()
    expect(s.x).toBeGreaterThanOrEqual(0); expect(s.y).toBeGreaterThanOrEqual(0)
    expect(s.x + f.w).toBeLessThanOrEqual(layout.cols * 16); expect(s.y + f.h).toBeLessThanOrEqual(layout.rows * 16)
    if (!s.frame.startsWith('prop/')) continue
    for (let y = s.y / 16; y < (s.y + f.h) / 16; y++) expect(roads.has(s.x / 16 + ',' + y), s.frame).toBe(false)
    for (const m of markers) { const mf = frames[m.frame]!; expect(s.x < m.x + mf.w && s.x + f.w > m.x && s.y < m.y + mf.h && s.y + f.h > m.y, s.frame + ' overlaps ' + m.frame).toBe(false) }
  }
  for (const s of layout.spots) { expect(s.x + s.w).toBeLessThanOrEqual(layout.cols * 16); expect(s.y + s.h).toBeLessThanOrEqual(layout.rows * 16) }
}
describe('published world compositions', () => {
  it.each(continents)('$id: twelve deterministic stages in every biome, boss on top, clear props and real atlas ids', (continent) => {
    for (const r of continent.regions) {
      const layout = regionLayout(r, progress)
      expect(layout).toEqual(regionLayout(r, progress)); expect(layout.spots).toHaveLength(12)
      expect(layout.spots.at(-1)!.y).toBe(Math.min(...layout.spots.map((s) => s.y)))
      check(layout)
    }
    expect(new Set(continents.flatMap((c) => c.regions.map((r) => r.biome))).size).toBe(BIOMES.length)
  })
  it('changes only markers with progress, opens the next stage and handles a fully cleared region', () => {
    const region = continents[0]!.regions[0]!, start = regionLayout(region, { wins: {} }), partial = regionLayout(region, progress)
    expect(partial.cells).toEqual(start.cells)
    expect(partial.sprites.filter((s) => s.frame.startsWith('prop/'))).toEqual(start.sprites.filter((s) => s.frame.startsWith('prop/')))
    expect(partial.frontier).toBe(region.id + '-s5'); expect(clearedIn(region.id, progress)).toBe(4)
    expect(regionLayout(region, { wins: Object.fromEntries(start.spots.map((s) => [s.id, 1])) }).frontier).toBeUndefined()
  })
  it('makes forty plots, five domain Springs, a capital and the lowest uncleared frontier regardless of input order', () => {
    for (const c of continents) {
      const p = { wins: Object.fromEntries(c.regions.slice(0, 4).flatMap((r) => Array.from({ length: 12 }, (_, i) => [r.id + '-s' + (i + 1), 1]))), drySprings: new Set([c.springs[0]!.id]) }
      const out = continentLayout(c, p)
      expect(out).toEqual(continentLayout({ ...c, regions: [...c.regions].reverse(), springs: [...c.springs].reverse() }, p))
      expect(out.spots.filter((s) => s.kind === 'region')).toHaveLength(40)
      expect(out.spots.filter((s) => s.kind === 'spring').map((s) => s.id)).toEqual(c.springs.map((s) => s.id))
      expect(out.spots.filter((s) => s.kind === 'capital')).toHaveLength(1)
      expect(out.frontier).toBe(c.regions[4]!.id)
      expect(out.sprites.filter((s) => s.frame === 'marker/spring-dry')).toHaveLength(1)
      check(out)
    }
  })
  it('makes five shore-edged islands, ordered from low at the bottom to high at the top', () => {
    const out = worldLayout(continents, progress)
    expect(out).toEqual(worldLayout([...continents].reverse(), progress)); expect(out.spots).toHaveLength(5)
    expect(out.spots.map((s) => s.id)).toEqual(continents.map((c) => c.id))
    expect(out.spots[0]!.y).toBeGreaterThan(out.spots[4]!.y)
    check(out)
  })
})
