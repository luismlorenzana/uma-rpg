import { BIOMES } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { backgroundLayout } from './background-layout'
describe('battle backdrop composition', () => {
  it('covers the floor and width with deterministic native stamps and puts the strip on the foe floor', () => {
    for (const { id } of BIOMES) for (const dpr of [1, 2]) for (const [w, h] of [[390, 430], [375, 320]]) {
      const out = backgroundLayout(w!, h!, dpr, id), horizons = out.cells.filter((c) => c.frame.startsWith('backdrop/')), ground = out.cells.filter((c) => c.frame.startsWith('ground/'))
      expect(out).toEqual(backgroundLayout(w!, h!, dpr, id)); expect(out.scale * dpr % 1).toBe(0)
      expect(horizons[0]!.x).toBe(0); expect(horizons.at(-1)!.x + 128).toBeGreaterThanOrEqual(out.width)
      expect(horizons.every((c) => c.y + 48 === out.floor)).toBe(true)
      expect(ground.every((c) => c.y >= out.floor && c.frame.startsWith('ground/' + id + '-'))).toBe(true)
      expect(Math.max(...ground.map((c) => c.y)) + 16).toBeGreaterThanOrEqual(out.height)
      expect(out.partyBand).toBeGreaterThan(out.floor)
    }
  })
})
