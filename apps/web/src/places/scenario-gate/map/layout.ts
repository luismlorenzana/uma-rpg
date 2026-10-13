// Runtime adapter for the published atlas, following platform's maps-full.ts composition.
// Cells are tile coordinates; sprites and tap spots are native art pixels. No DOM or master-data names.
import { BIOMES, type WorldContinent, type WorldRegion } from '@rpg/domain'
import { frames, propsOf, ROADS, visuals } from './visuals'
import { rng } from './random'
import { cellKey, hasCell, closesBlock, cornerMaskAt, edgeMaskAt, regionTopology, REGION_ROWS, STAGE_TILES, worldVariantAt } from './topology'

export interface MapCell { col: number; row: number; frame: string }
export interface MapSprite { x: number; y: number; frame: string }
export interface MapSpot { id: string; kind: 'stage' | 'region' | 'spring' | 'capital' | 'continent'; x: number; y: number; w: number; h: number }
export interface MapLayout { cols: number; rows: number; cells: MapCell[]; sprites: MapSprite[]; spots: MapSpot[]; frontier?: string }
export interface MapProgress { wins: Readonly<Record<string, number>>; drySprings?: ReadonlySet<string> }
const TILE = 16
export const clearedIn = (id: string, progress: MapProgress): number =>
  Array.from({ length: 12 }, (_, i) => (progress.wins[id + '-s' + (i + 1)] ?? 0) > 0 ? 1 : 0).reduce<number>((a, b) => a + b, 0)
const empty = (rows: number): MapLayout => ({ cols: 16, rows, cells: [], sprites: [], spots: [] })
const sprite = (out: MapLayout, frame: string, x: number, y: number) => out.sprites.push({ frame, x, y })

/** The existing Spring on the way into this two-row continent band. Its id/cooldown is shared across screens. */
export function springForRegion(continent: WorldContinent | undefined, region: WorldRegion) {
  return continent?.springs.find((s) => s.row === Math.floor(region.row / 2) * 2)
}
export function regionLayout(region: WorldRegion, progress: MapProgress, springId?: string): MapLayout {
  const out = empty(REGION_ROWS), { road, wet, stages } = regionTopology(region.biome, region.id)
  const liquidMask = (x: number, y: number) => cornerMaskAt((cx, cy) => hasCell(wet, cx, cy), x, y)
  for (let row = 0; row < out.rows; row++) for (let col = 0; col < out.cols; col++) {
    out.cells.push({ col, row, frame: 'ground/' + region.biome + '-' + worldVariantAt(region.id, col, row) })
    const mask = liquidMask(col, row)
    if (mask) out.cells.push({ col, row, frame: 'liquid/' + visuals[region.biome].liquid + '-' + mask })
    if (hasCell(road, col, row)) out.cells.push({ col, row, frame: 'road/' + visuals[region.biome].road + '-' + edgeMaskAt((x, y) => hasCell(road, x, y), col, row) })
  }
  const random = rng(region.id + ':props'), taken = new Set<string>(), props = propsOf(region.biome)
  const free = (x: number, y: number) => !hasCell(road, x, y) && !liquidMask(x, y) && !hasCell(taken, x, y)
    && !stages.some((s) => x >= s.x && x < s.x + STAGE_TILES && y >= s.y && y < s.y + STAGE_TILES)
    && !(x === 7 && y >= 42 && y < 44)
  for (let attempt = 0; attempt < 800 && out.sprites.length < 30; attempt++) {
    const edge = random() < 0.65, x = edge ? random() < 0.5 ? Math.floor(random() * 3) : 13 + Math.floor(random() * 3) : Math.floor(random() * 16)
    const y = 1 + Math.floor(random() * (REGION_ROWS - 1)), frame = props[Math.floor(random() * props.length)]!, h = frames[frame]!.h
    if (!free(x, y) || h > TILE && !free(x, y - 1)) continue
    sprite(out, frame, x * TILE, (y + 1) * TILE - h)
    taken.add(cellKey(x, y)); if (h > TILE) taken.add(cellKey(x, y - 1))
  }
  out.sprites.sort((a, b) => a.y + frames[a.frame]!.h - b.y - frames[b.frame]!.h || a.x - b.x)
  stages.forEach((s, i) => {
    const id = region.id + '-s' + (i + 1)
    const state = (progress.wins[id] ?? 0) > 0 ? 'cleared' : i === 0 || (progress.wins[region.id + '-s' + i] ?? 0) > 0 ? 'open' : 'locked'
    sprite(out, 'stage/' + region.biome + '/' + s.kind + '-' + state, s.x * TILE, s.y * TILE)
    out.spots.push({ id, kind: 'stage', x: s.x * TILE, y: s.y * TILE, w: STAGE_TILES * TILE, h: STAGE_TILES * TILE })
    if (state === 'open' && !out.frontier) { out.frontier = id; sprite(out, 'stage/frontier-0', s.x * TILE, s.y * TILE) }
  })
  if (springId) {
    sprite(out, progress.drySprings?.has(springId) ? 'marker/spring-dry' : 'marker/spring', 7 * TILE, 42 * TILE)
    out.spots.push({ id: springId, kind: 'spring', x: 7 * TILE, y: 42 * TILE, w: 16, h: 32 })
  }
  return out
}

export const continentBandY = (row: number): number => 4 + (9 - row) * 4
function commonBiomes(continent: WorldContinent) {
  const count = (biome: string) => continent.regions.filter((r) => r.biome === biome).length
  return BIOMES.map((b) => b.id).sort((a, b) => count(b) - count(a)).slice(0, 2)
}
export function continentLayout(continent: WorldContinent, progress: MapProgress): MapLayout {
  const out = empty(44), road = new Set<string>()
  const count = (material: string) => continent.regions.filter((r) => visuals[r.biome].road === material).length
  const material = [...ROADS].sort((a, b) => count(b) - count(a))[0]!
  const plaza = material === 'stone' ? 'ruins' : material === 'dirt' ? 'desert' : 'coast'
  const mark = (x: number, y: number) => { if (!closesBlock(road, x, y)) road.add(cellKey(x, y)) }
  for (let row = 0; row < 4; row++) for (let col = 0; col < 16; col++) out.cells.push({ col, row, frame: 'ground/' + plaza + '-' + worldVariantAt(continent.id, col, row) })
  for (let row = 0; row < 10; row++) {
    const y = continentBandY(row), roadY = y + 3, side = row % 2 === 0 ? 0 : 15
    for (let x = 0; x < 16; x++) mark(x, roadY)
    for (let yy = roadY - 4; yy <= roadY; yy++) mark(side, yy)
    for (const region of continent.regions.filter((r) => r.row === row).sort((a, b) => a.col - b.col)) {
      const x = region.col * 4
      for (let dy = 0; dy < 4; dy++) for (let dx = 0; dx < 4; dx++) out.cells.push({ col: x + dx, row: y + dy, frame: 'ground/' + region.biome + '-' + worldVariantAt(continent.id + ':' + region.id, x + dx, y + dy) })
      const prop = propsOf(region.biome)[0]!
      sprite(out, prop, (x + 1) * TILE, (y + 3) * TILE - frames[prop]!.h)
      const won = clearedIn(region.id, progress)
      sprite(out, won === 12 ? 'marker/flag-cleared' : 'marker/flag', (x + 2) * TILE, (y + 1) * TILE)
      out.spots.push({ id: region.id, kind: 'region', x: x * TILE, y: y * TILE, w: 64, h: 48 })
      if (won < 12 && !out.frontier) out.frontier = region.id
    }
  }
  for (let x = 0; x < 16; x++) mark(x, 3)
  for (const spring of [...continent.springs].sort((a, b) => a.row - b.row)) {
    const x = spring.row % 4 === 0 ? 0 : 15, y = continentBandY(spring.row) * TILE - 32
    sprite(out, progress.drySprings?.has(spring.id) ? 'marker/spring-dry' : 'marker/spring', x * TILE, y)
    out.spots.push({ id: spring.id, kind: 'spring', x: x * TILE, y, w: 16, h: 32 })
  }
  sprite(out, 'marker/capital', 104, 4)
  out.spots.push({ id: continent.id, kind: 'capital', x: 104, y: 4, w: 48, h: 48 })
  for (const k of road) {
    const [col, row] = k.split(',').map(Number) as [number, number]
    out.cells.push({ col, row, frame: 'road/' + material + '-' + edgeMaskAt((x, y) => hasCell(road, x, y), col, row) })
  }
  return out
}

export function worldLayout(continents: readonly WorldContinent[], progress: MapProgress): MapLayout {
  const out = empty(22)
  for (let row = 0; row < out.rows; row++) for (let col = 0; col < 16; col++) out.cells.push({ col, row, frame: 'ground/ocean-' + worldVariantAt('world', col, row) })
  ;[...continents].sort((a, b) => a.order - b.order).slice(0, 5).forEach((continent, i) => {
    const left = i % 2 === 0 ? 2 : 8, top = 17 - i * 4, biomes = commonBiomes(continent)
    const land = (x: number, y: number) => ((x - 3) / 3) ** 2 + ((y - 2) / 2) ** 2 <= 1
    for (let y = 0; y < 4; y++) for (let x = 0; x < 6; x++) {
      const mask = cornerMaskAt((cx, cy) => !land(cx, cy), x, y)
      if (mask === 15) continue
      const biome = biomes[(x + y + i) % 5 === 0 ? 1 : 0]!
      out.cells.push({ col: left + x, row: top + y, frame: 'ground/' + biome + '-' + worldVariantAt(continent.id, x, y) })
      if (mask) out.cells.push({ col: left + x, row: top + y, frame: 'liquid/water-' + mask })
    }
    const prop = propsOf(biomes[0]!)[0]!
    sprite(out, prop, (left + 2) * TILE, (top + 3) * TILE - frames[prop]!.h)
    sprite(out, continent.regions.every((r) => clearedIn(r.id, progress) === 12) ? 'marker/flag-cleared' : 'marker/flag', (left + 4) * TILE, (top + 3) * TILE - 32)
    out.spots.push({ id: continent.id, kind: 'continent', x: left * TILE, y: top * TILE, w: 96, h: 64 })
  })
  return out
}
