import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { describe, expect, it } from 'vitest'
import { legacyWorldContinent } from './legacy-continent.fixture'
import { BIOMES, biomeById } from './biomes'
import { continentHoneycomb, honeycombXY, nearestSpring, type HoneyTile } from './honeycomb'
import { regionChapter, stageRegionId, TWIN_BOSS_ROW, WORLD_SPRINGS, worldContinent } from './world'

const source = (order: number) => ({ name: 'Synthetic continent', order })
const live = (order = 1) => worldContinent(source(order))
const radius = ({ q, r }: HoneyTile) => Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r))

// Regenerate the actual approved preview's cells and Spring map, without any DOM, progress or copied layout table.
// Names and the preview's made-up extra biomes are deliberately not part of the comparison.
function preview() {
  const html = readFileSync(new URL('../../../../docs/design/world-map/previews/honeycomb.html', import.meta.url), 'utf8')
  const script = html.split('<script>')[1]!.split('const SPRING_STATE')[0]!
  return JSON.parse(runInNewContext(`${script}\nJSON.stringify({
    cells: cells.map(({ tile, at }) => ({ q: at[0], r: at[1], kind: tile.kind,
      ...(tile.id ? { id: tile.id } : {}), ...(tile.kind === 'seat' ? { seat: tile.n } : {}) })),
    springs: [...springOf.entries()]
  })`, {}, { timeout: 1000 }) as string) as { cells: HoneyTile[]; springs: [string, number][] }
}

describe('the honeycomb world, live on save v38 (D295, H166)', () => {
  it('keeps all fifteen pre-v38 continent fixtures byte-identical', () => {
    expect(WORLD_SPRINGS).toBe(6)
    const continents = Array.from({ length: 15 }, (_, i) => legacyWorldContinent(source(i + 1)))
    // Captured before H163, from synthetic source names only.
    expect(createHash('sha256').update(JSON.stringify(continents)).digest('hex'))
      .toBe('87bbf3c63906181273b878352da919435ef33b5377adb5c823131db06ecf82f1')
  })

  it.each(Array.from({ length: 15 }, (_, i) => i + 1))('appends eight stable regions and one Spring to continent %i', (order) => {
    const dark = legacyWorldContinent(source(order)), c = live(order), extras = c.regions.slice(40)
    expect(c.regions).toHaveLength(48)
    expect(new Set(c.regions.map((r) => r.id)).size).toBe(48)
    expect(JSON.stringify(c.regions.slice(0, 40))).toBe(JSON.stringify(dark.regions))
    expect(JSON.stringify(c.springs.slice(0, 5))).toBe(JSON.stringify(dark.springs.map(({ id, continentId }) => ({ id, continentId }))))
    expect(c.springs.map((s) => s.id)).toEqual([1, 2, 3, 4, 5, 6].map((k) => `w${order}-spring${k}`))
    expect(extras.map((r) => r.id)).toEqual(Array.from({ length: 8 }, (_, i) => `w${order}-x-${i + 1}`))
    expect(extras.map((r) => [r.row, r.col])).toEqual(Array.from({ length: 8 }, (_, i) => [i < 4 ? 0 : 5, i + 4]))
    expect(c.regions.filter((r) => r.level === c.levelStart)).toHaveLength(24)
    expect(c.regions.filter((r) => r.level === c.levelStart + 5)).toHaveLength(24)
    expect(new Set(extras.map((r) => r.biome)).size).toBe(8)
    for (const r of extras) {
      expect(dark.regions.filter((old) => old.biome === r.biome)).toHaveLength(2)
      expect(c.regions.filter((other) => other.biome === r.biome)).toHaveLength(3)
      expect(r.name).toBe(`${biomeById(r.biome).name} III`)
      expect(r.levelTop).toBe(r.level + 4)
      expect(r.row).not.toBe(TWIN_BOSS_ROW)
    }
    for (const b of BIOMES) expect(c.regions.filter((r) => r.biome === b.id).length).toBeLessThanOrEqual(3)
    expect(c).toEqual(live(order))
  })

  it('gives every new region its own deterministic twelve-stage chapter and ordinary boss', () => {
    const roster = Array.from({ length: 12 }, (_, i) => ({ id: `r${i}`, name: `Rival ${i}` }))
    const fingerprints = new Set<string>()
    for (const region of live().regions.slice(40)) {
      const c = regionChapter(region, roster), stages = c.nodes.slice(1)
      expect(stages).toHaveLength(12)
      expect(stages.map((n) => n.id)).toEqual(Array.from({ length: 12 }, (_, i) => `${region.id}-s${i + 1}`))
      expect(stages.map((n) => stageRegionId(n.id))).toEqual(Array(12).fill(region.id))
      expect(stages.map((n) => n.level)).toEqual([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4, 4].map((n) => region.level + n))
      const boss = stages.at(-1)!
      expect([boss.enemies, ...(boss.waves ?? [])].flat().filter((f) => f.rank === 'boss')).toHaveLength(1)
      expect(c).toEqual(regionChapter(region, [...roster].reverse()))
      fingerprints.add(JSON.stringify(stages.map((n) => [n.name, n.enemies, n.waves])))
    }
    expect(fingerprints.size).toBe(8)
    expect(stageRegionId('w1-x-3-s5')).toBe('w1-x-3')
  })
})

describe('the approved honeycomb layout (H163)', () => {
  it('regenerates exactly the preview cells, in their original order', () => {
    expect(continentHoneycomb(live())).toEqual(preview().cells)
  })

  it.each([1, 2, 3, 4, 5, 6, 10, 15])('uses every hex once and keeps the clean level bands on continent %i', (order) => {
    const c = live(order), tiles = continentHoneycomb(c)
    expect(tiles).toHaveLength(61)
    expect(new Set(tiles.map((t) => `${t.q},${t.r}`)).size).toBe(61)
    expect([0, 1, 2, 3, 4].map((k) => tiles.filter((t) => radius(t) === k).length)).toEqual([1, 6, 12, 18, 24])
    expect(tiles[0]).toEqual({ q: 0, r: 0, kind: 'capital' })
    expect(tiles.filter((t) => t.kind === 'seat').map((t) => [radius(t), t.seat])).toEqual([1, 2, 3, 4, 5, 6].map((n) => [1, n]))
    expect(tiles.filter((t) => radius(t) === 2).map((t) => c.regions.find((r) => r.id === t.id)!.row))
      .toEqual([9, 8, 7].flatMap((n) => Array(4).fill(n)))
    expect(tiles.filter((t) => t.kind === 'region')).toHaveLength(48)
    expect(tiles.some((t) => t.kind === 'open')).toBe(false)
    for (const t of tiles.filter((t) => t.kind === 'region')) {
      const r = c.regions.find((r) => r.id === t.id)!
      expect(radius(t) === 4, r.id).toBe(r.level === c.levelStart)
    }
    expect(tiles.filter((t) => t.kind === 'spring').map((t) => [t.q, t.r, t.id])).toEqual([
      [3, 0, `${c.id}-spring1`], [3, -3, `${c.id}-spring2`], [0, -3, `${c.id}-spring3`],
      [-3, 0, `${c.id}-spring4`], [-3, 3, `${c.id}-spring5`], [0, 3, `${c.id}-spring6`],
    ])
    expect(tiles.filter((t) => t.id?.match(/-x-[5-8]$/)).every((t) => radius(t) === 3 && Math.abs(t.r) === 3)).toBe(true)
    const before = structuredClone(c)
    expect(continentHoneycomb(c)).toEqual(tiles)
    expect(continentHoneycomb({ ...c, regions: [...c.regions].reverse(), springs: [...c.springs].reverse() })).toEqual(tiles)
    expect(c).toEqual(before)
  })

  it('leaves precisely the eight new slots open for a dark continent, without shifting existing regions', () => {
    const c = legacyWorldContinent(source(1)), dark = continentHoneycomb(c), all = continentHoneycomb(live())
    expect(dark.filter((t) => t.kind === 'region')).toHaveLength(40)
    expect(dark.filter((t) => t.kind === 'open')).toHaveLength(8)
    expect(dark).toEqual(all.map((t) => t.id?.includes('-x-') ? { q: t.q, r: t.r, kind: 'open' } : t))
    expect(c.springs).toHaveLength(5) // Historical fixture only; production always has six.
  })

  it('converts axial positions to pointy-top pixels at any scale', () => {
    expect(honeycombXY({ q: 0, r: 0 }, 50)).toEqual({ x: 0, y: 0 })
    expect(honeycombXY({ q: 1, r: 0 }, 50)).toEqual({ x: 50 * Math.sqrt(3), y: 0 })
    expect(honeycombXY({ q: 0, r: 1 }, 20)).toEqual({ x: 10 * Math.sqrt(3), y: 30 })
    expect(honeycombXY({ q: -2, r: 3 }, 50)).toEqual({ x: -25 * Math.sqrt(3), y: 225 })
  })

  it('matches every preview Spring assignment, including the clockwise ties', () => {
    const c = live()
    for (const [id, spring] of preview().springs) expect(nearestSpring(c, id), id).toBe(`w1-spring${spring}`)
    expect(nearestSpring(c, 'w1-x-9')).toBeUndefined()
    expect(nearestSpring(c, 'w1-spring1')).toBeUndefined()
    expect(nearestSpring(c, 'w2-1-1')).toBeUndefined()
  })

  it.each(Array.from({ length: 15 }, (_, i) => i + 1))('serves exactly eight regions at every nearest Spring on continent %i', (order) => {
    const c = live(order), tiles = continentHoneycomb(c), springs = tiles.filter((t) => t.kind === 'spring')
    let ties = 0
    for (const r of c.regions) {
      const pos = honeycombXY(tiles.find((t) => t.id === r.id)!, 50)
      const distances = springs.map((s) => {
        const at = honeycombXY(s, 50)
        return { id: s.id, distance: Math.hypot(at.x - pos.x, at.y - pos.y) }
      })
      const min = Math.min(...distances.map((d) => d.distance)), closest = distances.filter((d) => Math.abs(d.distance - min) < 1e-6)
      if (closest.length === 2) ties++
      expect(closest.map((d) => d.id)).toContain(nearestSpring(c, r.id))
    }
    expect(ties).toBe(12)
    for (const s of c.springs) expect(c.regions.filter((r) => nearestSpring(c, r.id) === s.id), s.id).toHaveLength(8)
  })
})
