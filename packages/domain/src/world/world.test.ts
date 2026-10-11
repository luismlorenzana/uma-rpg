import { describe, expect, it } from 'vitest'
import { BIOMES, signatureWeaknesses } from './biomes'
import { regionChapter, stageBand, stagePlan, worldContinent } from './world'

const cast = Array.from({ length: 12 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))

describe('the world map (D66, D71)', () => {
  it('lays out five continents of 40 regions, four per level, every biome at least twice, and five Springs', () => {
    for (let order = 1; order <= 5; order++) {
      const c = worldContinent({ name: `Continent ${order}`, order })
      expect(c.regions).toHaveLength(40)
      expect(c.levelStart).toBe((order - 1) * 10 + 1)
      for (let row = 0; row < 10; row++) expect(c.regions.filter((r) => r.row === row).every((r) => r.level === c.levelStart + row)).toBe(true)
      for (const b of BIOMES) expect(c.regions.filter((r) => r.biome === b.id).length, b.id).toBeGreaterThanOrEqual(2)
      expect(c.regions[0]!.biome).toBe('meadow')
      expect(new Set(c.regions.map((r) => r.id)).size).toBe(40)
      expect(c.springs.map((s) => s.id)).toEqual([1, 2, 3, 4, 5].map((k) => `w${order}-spring${k}`))
    }
    expect(worldContinent({ name: 'A', order: 3 })).toEqual(worldContinent({ name: 'A', order: 3 }))
  })

  it('makes each region a path of twelve stages: ten regular, an elite, the boss', () => {
    const c = worldContinent({ name: 'URA', order: 1 })
    for (const region of c.regions) {
      const chapter = regionChapter(region, cast)
      const stages = chapter.nodes.filter((n) => n.kind !== 'camp')
      expect(stages).toHaveLength(12)
      expect(stages.map((n) => n.kind)).toEqual([...Array(10).fill('fight'), 'sub-boss', 'boss'])
      expect(stages.every((n) => n.level === region.level && n.enemies.length >= 1 && n.enemies.length <= 5)).toBe(true)
      expect(stageBand(stages[0]!.id)).toBe(1)
      // Variety: a region's regular stages use at least four formation-and-signature combinations.
      const plan = stagePlan(BIOMES.find((b) => b.id === region.biome)!, region.id).slice(0, 10)
      expect(new Set(plan.map((p) => `${p.formation}:${p.signature.join('+')}`)).size, region.id).toBeGreaterThanOrEqual(region.biome === 'rift' ? 2 : 4)
    }
  })

  it('answers a pair with what beats either half, minus its own: light and dark answer to weapons alone', () => {
    expect(signatureWeaknesses(['fire', 'dark'])).toEqual(['lightning', 'light'])
    expect(signatureWeaknesses(['ice', 'lightning'])).toEqual(['fire'])
    expect(signatureWeaknesses(['light', 'dark'])).toEqual([])
    const rift = worldContinent({ name: 'URA', order: 1 }).regions.find((r) => r.biome === 'rift')!
    const foes = regionChapter(rift, cast).nodes.flatMap((n) => n.enemies)
    expect(foes.every((f) => f.weaknesses.elements.length === 0 && f.weaknesses.weapons.length >= 1)).toBe(true)
  })

  it('dresses each biome in its franchise: Sky Isles PriConne, Underworld Azur Lane, the rest P&D by element (D76)', () => {
    const packs = {
      priconne: [{ id: 'pc1', name: 'P1' }, { id: 'pc2', name: 'P2' }, { id: 'pc3', name: 'P3' }],
      pad: (['fire', 'ice', 'lightning', 'light', 'dark'] as const).flatMap((element) => [1, 2, 3].map((n) => ({ id: `pad-${element}-${n}`, name: `${element} ${n}`, element }))),
    }
    const c = worldContinent({ name: 'URA', order: 1 })
    const faces = (biome: string) => regionChapter(c.regions.find((r) => r.biome === biome)!, packs).nodes.flatMap((n) => n.enemies)
    expect(faces('sky').every((f) => f.castId.startsWith('pc'))).toBe(true)
    expect(faces('underworld').every((f) => f.castId.startsWith('pc'))).toBe(true)
    expect(faces('meadow').every((f) => f.castId === `pad-${f.element}-${f.castId.split('-').pop()}`)).toBe(true)
  })
})
