import { BIOMES, worldContinent } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { clearedIn, continentLayout, regionLayout, springForRegion, worldLayout, type MapLayout } from './layout'
import { cornerMaskAt, hasCell, regionTopology, REGION_ROWS, stageEntrance, STAGE_TILES } from './topology'
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
  const markers = layout.sprites.filter((s) => /^(marker|stage|stage-compact)\//.test(s.frame))
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
// Lays out every region of every continent: well under a second here, but a loaded CI runner can pass 5s.
describe('published world compositions', { timeout: 30_000 }, () => {
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
    expect(partial.sprites.some((s) => s.frame === 'stage-compact/meadow/fight-cleared')).toBe(true)
    expect(partial.sprites.some((s) => s.frame === 'stage-compact/meadow/fight-open')).toBe(true)
    expect(partial.sprites.some((s) => s.frame === 'stage-compact/meadow/elite-locked')).toBe(true)
    expect(partial.sprites.some((s) => s.frame === 'stage-compact/meadow/boss-locked')).toBe(true)
    expect(regionLayout(region, { wins: Object.fromEntries(start.spots.map((s) => [s.id, 1])) }).frontier).toBeUndefined()
  })
  it.each(continents)('$id: fits two-tile towers and separate phone targets along one connected road without covering ponds', (c) => {
    for (const r of c.regions) {
      const spring = springForRegion(c, r)!, out = regionLayout(r, progress, spring.id)
      expect(out.rows).toBe(REGION_ROWS)
      const { road, wet, stages } = regionTopology(r.biome, r.id)
      const queue = ['3,21'], connected = new Set(queue)
      for (let i = 0; i < queue.length; i++) {
        const [x, y] = queue[i]!.split(',').map(Number) as [number, number]
        for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
          const key = `${x + dx!},${y + dy!}`
          if (road.has(key) && !connected.has(key)) { connected.add(key); queue.push(key) }
        }
      }
      expect(connected.size).toBe(road.size)
      for (const s of stages) {
        const door=stageEntrance(s)
        expect(connected.has(`${door.x},${door.y}`)).toBe(true)
        for (let y = Math.floor(s.y); y < Math.ceil(s.y + STAGE_TILES); y++) for (let x = Math.floor(s.x); x < Math.ceil(s.x + STAGE_TILES); x++) {
          expect(hasCell(road, x, y)).toBe(false)
          expect(cornerMaskAt((cx, cy) => hasCell(wet, cx, cy), x, y)).toBe(0)
        }
      }
      const spots = out.spots.filter((s) => s.kind === 'stage')
      expect(spots.every((s) => s.w === 32 && s.h === 32)).toBe(true)
      // Native 2×2 footprints are 48 CSS px on 2× phones, and retain 44px minimums at 1×.
      for (const scale of [1, 1.5]) for (let i = 0; i < out.spots.length; i++) for (const b of out.spots.slice(i + 1)) {
        const a = out.spots[i]!, aw = Math.max(44, a.w * scale), ah = Math.max(44, a.h * scale)
        const bw = Math.max(44, b.w * scale), bh = Math.max(44, b.h * scale)
        expect(Math.abs((a.x + a.w/2 - b.x - b.w/2) * scale) < (aw+bw)/2
          && Math.abs((a.y + a.h/2 - b.y - b.h/2) * scale) < (ah+bh)/2).toBe(false)
      }
      check(out)
    }
  })
  it('follows the owner’s three-column snake and rises 4px per stage within each row', () => {
    const out=regionLayout(continents[0]!.regions[0]!,{wins:{}}), spots=out.spots
    expect(out.rows).toBe(22)
    expect(spots.map(s=>s.x)).toEqual([40,120,200,200,120,40,40,120,200,200,120,40])
    for(let i=1;i<spots.length;i++) {
      const rise=spots[i-1]!.y-spots[i]!.y
      expect(rise).toBe(i%3===0?56:4)
    }
    expect(out.sprites.find(s=>s.frame.endsWith('/elite-locked'))?.x).toBe(spots[10]!.x)
    expect(out.sprites.find(s=>s.frame.endsWith('/boss-locked'))?.x).toBe(spots[11]!.x)
  })
  it.each(continents)('$id: exposes the same continent Springs across their two-row region bands, with shared ready/dry frames', (c) => {
    for (const r of c.regions) {
      const spring = springForRegion(c, r)!
      expect(spring.row).toBe(Math.floor(r.row / 2) * 2)
      const ready = regionLayout(r, { wins: {} }, spring.id)
      const dry = regionLayout(r, { wins: {}, drySprings: new Set([spring.id]) }, spring.id)
      expect(ready.spots.filter((s) => s.kind === 'spring').map((s) => s.id)).toEqual([spring.id])
      expect(dry.spots).toEqual(ready.spots); expect(dry.cells).toEqual(ready.cells)
      expect(ready.sprites.some((s) => s.frame === 'marker/spring')).toBe(true)
      expect(dry.sprites.some((s) => s.frame === 'marker/spring-dry')).toBe(true)
    }
    expect(springForRegion(undefined, continents[0]!.regions[0]!)).toBeUndefined()
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
