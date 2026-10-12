import { describe, expect, it } from 'vitest'
import { BIOMES, biomeFranchise, signatureWeaknesses } from './biomes'
import { grantRpgExp } from '../rpg/rules'
import { rpgBattleExp, rpgRewardKind } from '../rpg/campaign/rewards'
import { poolOf, regionChapter, stageBand, stagePay, stagePlan, worldContinent } from './world'

const cast = Array.from({ length: 12 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))

describe('the world map (D66, D71)', () => {
  it('lays out five continents of 40 regions, half climbing the first five levels and half the last five, every biome at least twice, and five Springs (D97)', () => {
    for (let order = 1; order <= 5; order++) {
      const c = worldContinent({ name: `Continent ${order}`, order })
      expect(c.regions).toHaveLength(40)
      expect(c.levelStart).toBe((order - 1) * 10 + 1)
      for (let row = 0; row < 10; row++) {
        const level = c.levelStart + (row < 5 ? 0 : 5)
        expect(c.regions.filter((r) => r.row === row).every((r) => r.level === level && r.levelTop === level + 4)).toBe(true)
      }
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
      // W3: up to eight foes a wave; stages 8 and 9 in two waves, the boss in three; ids unique across a stage's waves.
      const waves = (n: (typeof stages)[number]) => [n.enemies, ...(n.waves ?? [])]
      expect(stages.every((n) => waves(n).every((w) => w.length >= 1 && w.length <= 8))).toBe(true)
      // D97: the regular stages climb the region's five levels two at a time; the elite and the boss wait at the top.
      const L = region.level
      expect(stages.map((n) => n.level)).toEqual([L, L, L + 1, L + 1, L + 2, L + 2, L + 3, L + 3, L + 4, L + 4, L + 4, L + 4])
      expect(waves(stages[0]!).flat().every((foe) => foe.level === L) && waves(stages[11]!).flat().every((foe) => foe.level === region.levelTop)).toBe(true)
      expect(stages.map((n) => waves(n).length)).toEqual([1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 3])
      for (const n of stages) expect(new Set(waves(n).flat().map((e) => e.id)).size).toBe(waves(n).flat().length)
      expect(waves(stages[11]!).at(-1)![0]!.rank).toBe('boss')
      expect(stages[10]!.enemies[0]!.twice).toBe(true)
      expect(stageBand(stages[0]!.id)).toBe(1)
      // Variety: a region's regular stages use at least four formation-and-signature combinations.
      const plan = stagePlan(BIOMES.find((b) => b.id === region.biome)!, region.id).slice(0, 10)
      expect(new Set(plan.map((p) => `${p.formation}:${p.signature.join('+')}`)).size, region.id).toBeGreaterThanOrEqual(region.biome === 'rift' ? 2 : 4)
    }
  })

  it('carries a fresh party across a region in its twelve first clears, a little short rather than over (D97)', () => {
    // A party that walks into each region at its first level, clears it once and moves on: two regions a continent.
    let me = { tier: 1, level: 1, exp: 0 }
    const at = (p: typeof me) => p.level + p.exp / (120 + 16 * p.level)
    const reached: { beforeElite: number; end: number }[] = []
    for (let order = 1; order <= 5; order++) {
      const c = worldContinent({ name: 'URA', order })
      for (const region of [c.regions[0]!, c.regions[20]!]) {
        let beforeElite = 0
        for (const node of regionChapter(region, cast).nodes.filter((n) => n.kind !== 'camp')) {
          if (node.kind === 'sub-boss') beforeElite = at(me)
          const gained = grantRpgExp(me, Math.round(rpgBattleExp(rpgRewardKind(node), node.level, me.level) * stagePay(node)))
          me = { ...me, level: gained.level, exp: gained.exp }
        }
        reached.push({ beforeElite, end: at(me) })
      }
    }
    // She reaches the region's top level for its elite and boss, and leaves within a fifth of a level of the next
    // region's first level; at Lv50 the cap holds.
    reached.forEach((r, i) => {
      const top = 5 * i + 5
      expect(r.beforeElite, `region ${i + 1}`).toBeGreaterThan(top - 0.2)
      expect(r.beforeElite, `region ${i + 1}`).toBeLessThan(top + 0.3)
      if (i < 9) expect(Math.abs(r.end - (top + 1)), `region ${i + 1}`).toBeLessThan(0.2)
    })
    expect(me.level).toBe(50)
  })

  it('makes a pair signature into foes carrying both elements, and fields swarms of six to eight (W3)', () => {
    const regions = [1, 2, 3, 4, 5].flatMap((order) => worldContinent({ name: 'URA', order }).regions)
    const foes = regions.flatMap((r) => regionChapter(r, cast).nodes.flatMap((n) => [n.enemies, ...(n.waves ?? [])].flat()))
    const volcano = regions.find((r) => r.biome === 'volcano')!
    const duals = regionChapter(volcano, cast).nodes.filter((n) => n.note).flatMap((n) => n.enemies)
    expect(duals.length).toBeGreaterThan(0)
    expect(duals.every((f) => f.element2 !== undefined && f.element2 !== f.element)).toBe(true)
    expect(foes.every((f) => f.element2 === undefined || f.element2 !== f.element)).toBe(true)
    const swarms = regions.flatMap((r) => regionChapter(r, cast).nodes.filter((n) => n.name === 'Swarm'))
    expect(swarms.length).toBeGreaterThan(0)
    expect(swarms.every((n) => n.enemies.length >= 6 && n.enemies.length <= 8)).toBe(true)
    expect(new Set(swarms.map((n) => n.enemies.length)).size).toBeGreaterThan(1)
  })

  it('answers a pair with what beats either half, minus its own: light and dark answer to weapons alone', () => {
    expect(signatureWeaknesses(['fire', 'dark'])).toEqual(['lightning', 'light'])
    expect(signatureWeaknesses(['ice', 'lightning'])).toEqual(['fire'])
    expect(signatureWeaknesses(['light', 'dark'])).toEqual([])
    const rift = worldContinent({ name: 'URA', order: 1 }).regions.find((r) => r.biome === 'rift')!
    const foes = regionChapter(rift, cast).nodes.flatMap((n) => [n.enemies, ...(n.waves ?? [])].flat())
    expect(foes.every((f) => f.weaknesses.elements.length === 0 && f.weaknesses.weapons.length >= 1)).toBe(true)
  })

  it('dresses each biome in its franchise, and the rest in a mixed pool of five faces a pack (D76, D81)', () => {
    const pack = (prefix: string) => Array.from({ length: 12 }, (_, n) => ({ id: `${prefix}-${n}`, name: `${prefix} ${n}` }))
    const packs = { priconne: pack('pc'), azurlane: pack('al'), nikke: pack('nk'), girlsfrontline: pack('gf') }
    const regions = [1, 2, 3, 4, 5].flatMap((order) => worldContinent({ name: 'URA', order }).regions)
    const faces = (biome: string) => regions.filter((r) => r.biome === biome).flatMap((r) => regionChapter(r, packs).nodes.flatMap((n) => n.enemies))
    expect(faces('sky').every((f) => f.castId.startsWith('pc-'))).toBe(true)
    expect(faces('underworld').every((f) => f.castId.startsWith('al-'))).toBe(true)
    expect(faces('desert').every((f) => f.castId.startsWith('nk-'))).toBe(true)
    // Forest has no franchise and Last Origin's ruins have no pack yet: both draw from the pool, five per pack.
    const pool = new Set([...poolOf(packs.priconne), ...poolOf(packs.azurlane), ...poolOf(packs.nikke), ...poolOf(packs.girlsfrontline)].map((m) => m.id))
    expect(pool.size).toBe(20)
    for (const biome of ['forest', 'ruins']) expect(faces(biome).every((f) => pool.has(f.castId))).toBe(true)
    expect(new Set(faces('forest').map((f) => f.castId.slice(0, 2))).size).toBeGreaterThan(1)
    expect(faces('meadow').every((f) => f.castId.startsWith('pc-'))).toBe(true)
    expect(faces('coast').every((f) => f.castId.startsWith('al-'))).toBe(true)
    expect(faces('jungle').every((f) => f.castId.startsWith('gf-'))).toBe(true)
    // Forest is the one biome without a franchise (D84, D85).
    expect(BIOMES.filter((b) => biomeFranchise(b.id) === null).map((b) => b.id)).toEqual(['forest'])
  })
})
