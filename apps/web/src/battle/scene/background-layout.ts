import type { Biome } from '@rpg/domain'
import { artScale } from '@luismlorenzana/uma-kit/hub'
/** Native art-pixel stamps; the render texture scales once at the Hub's pixel ratio. */
export function backgroundLayout(w: number, h: number, dpr: number, biome: Biome) {
  const scale = artScale(dpr), width = Math.ceil(w / scale), height = Math.ceil(h / scale), floor = Math.round(h / 2 / scale)
  const cells: { x: number; y: number; frame: string }[] = []
  const seed = [...biome].reduce((s, c) => s + c.charCodeAt(0), 0)
  for (let y = floor, row = 0; y < height; y += 16, row++) for (let x = 0, col = 0; x < width; x += 16, col++)
    cells.push({ x, y, frame: 'ground/' + biome + '-' + ((Math.imul(col + 1, 73) ^ Math.imul(row + 1, 31) ^ seed) >>> 0) % 4 })
  for (let x = 0; x < width; x += 128) cells.push({ x, y: floor - 48, frame: 'backdrop/' + biome })
  return { width, height, scale, floor, cells, partyBand: Math.round(h * 0.62 / scale) }
}
