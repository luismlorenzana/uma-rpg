import { describe, expect, it } from 'vitest'
import { BIOMES, signatureWeaknesses } from './biomes'
import { bandFranchise, capitalFranchise, ENEMY_TIERS, FRANCHISES, stageFaces, type RosterMember } from './roster'
import { grantRpgExp } from '../rpg/rules'
import { rpgBattleExp, rpgRewardKind } from '../rpg/campaign/rewards'
import { rpgFoe } from '../rpg/campaign/enemies'
import { stageLaurels } from '../save/battle'
import { regionChapter, stageBand, stagePay, stagePlan, TWIN_BOSS_ROW, WORLD_BOSS_TWICE_FROM, WORLD_FORMATIONS, WORLD_TUNING, worldContinent } from './world'

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
      // D135: the elite brings two assistants; D141: her sub-boss acts twice from Lv 10, and a lone boss too.
      const twice = stages[10]!.level >= WORLD_BOSS_TWICE_FROM
      expect(stages[10]!.enemies.map((e) => [e.rank, e.twice ?? false])).toEqual([['sub-boss', twice], ['regular', false], ['regular', false]])
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

  it('gives PriConne the first continent and Azur Lane and NIKKE the rest by level band (D135)', () => {
    const regions = [1, 2, 3, 4, 5].flatMap((order) => worldContinent({ name: 'URA', order }).regions)
    const count = Object.fromEntries(FRANCHISES.map((f) => [f, regions.filter((r) => bandFranchise(Number(r.continentId.slice(1)), r.row) === f).length]))
    expect(count).toEqual({ priconne: 40, azurlane: 100, nikke: 60 })
    expect([1, 2, 3, 4, 5].map((o) => [bandFranchise(o, 0), bandFranchise(o, 9)])).toEqual([['priconne', 'priconne'], ['azurlane', 'nikke'],
      ['azurlane', 'nikke'], ['azurlane', 'nikke'], ['azurlane', 'azurlane']])
    expect([1, 2, 3, 4, 5].map(capitalFranchise)).toEqual(['priconne', 'azurlane', 'nikke', 'azurlane', 'nikke'])
  })

  it('dresses each stage by tier: regulars, an elite and her Key assistants, a boss among sub-bosses (D135)', () => {
    const roster: RosterMember[] = FRANCHISES.flatMap((franchise) => ENEMY_TIERS.flatMap((tier) =>
      Array.from({ length: 16 }, (_, n) => ({ id: `${franchise}-${tier}-${n}`, name: `${tier} ${n}`, franchise, tier }))))
    const tierOf = (castId: string) => castId.split('-')[1]
    const continent = worldContinent({ name: 'URA', order: 2 })
    for (const region of [continent.regions.find((r) => r.row === 0)!, continent.regions.find((r) => r.row === TWIN_BOSS_ROW)!]) {
      const franchise = region.row < 5 ? 'azurlane' : 'nikke'
      const stages = regionChapter(region, roster).nodes.filter((n) => n.kind !== 'camp')
      const waves = (n: (typeof stages)[number]) => [n.enemies, ...(n.waves ?? [])]
      for (const n of stages) expect(waves(n).flat().every((f) => f.castId.startsWith(`${franchise}-`)), n.id).toBe(true)
      for (const n of stages.slice(0, 10)) expect(waves(n).flat().every((f) => tierOf(f.castId) === 'regular'), n.id).toBe(true)
      const elite = stages[10]!.enemies
      expect(elite.map((f) => [f.rank, tierOf(f.castId)])).toEqual([['sub-boss', 'subboss'], ['regular', 'key'], ['regular', 'key']])
      const boss = waves(stages[11]!)
      expect(boss.slice(0, 2).flat().every((f) => tierOf(f.castId) === 'subboss')).toBe(true)
      expect(boss[2]!.map((f) => [f.rank, tierOf(f.castId)])).toEqual(region.row === TWIN_BOSS_ROW
        ? [['boss', 'boss'], ['boss', 'boss'], ['regular', 'subboss']] : [['boss', 'boss'], ['regular', 'subboss'], ['regular', 'subboss']])
      // Faces never repeat within a stage.
      for (const n of stages) expect(new Set(waves(n).flat().map((f) => f.castId)).size, n.id).toBe(waves(n).flat().length)
    }
  })

  it('picks the same faces whatever the list order, borrows across empty tiers, and leaves a face blank only without a roster', () => {
    const roster: RosterMember[] = [
      ...Array.from({ length: 5 }, (_, n) => ({ id: `pc-r${n}`, name: 'r', franchise: 'priconne' as const, tier: 'regular' as const })),
      ...Array.from({ length: 3 }, (_, n) => ({ id: `al-b${n}`, name: 'b', franchise: 'azurlane' as const, tier: 'boss' as const })),
    ]
    const picks = (list: RosterMember[]) => { const face = stageFaces(list, 'priconne', 'w1-1-1-s12'); return ['regular', 'boss', 'key', 'regular'].map((t, i) => face(t as never, i)?.id) }
    expect(picks([...roster].reverse())).toEqual(picks(roster))
    const [regular, boss, key] = picks(roster)
    expect(regular).toMatch(/^pc-r/)
    // No PriConne boss: another franchise's; no Key enemy anywhere: one of her own franchise's.
    expect(boss).toMatch(/^al-b/)
    expect(key).toMatch(/^pc-r/)
    expect(stageFaces([], 'priconne', 'x')('boss', 0)).toBeNull()
    const blank = regionChapter(worldContinent({ name: 'URA', order: 1 }).regions[0]!, []).nodes[1]!.enemies
    expect(blank.every((f) => f.castId === '')).toBe(true)
  })
})

describe('Tier 2 regions (tier2-world Z3, Z8; H45)', () => {
  const w1 = worldContinent({ name: 'T1', order: 1 })
  const w6 = worldContinent({ name: 'T2', order: 6 })

  it('take their tier from the continent, so a w6 first clear pays twice a w1 one', () => {
    const t1 = regionChapter(w1.regions[0]!, cast), t2 = regionChapter(w6.regions[0]!, cast)
    expect([t1.tier, t2.tier]).toEqual([1, 2])
    const first = (chapter: typeof t1) => { const node = chapter.nodes[1]!; return stageLaurels(rpgRewardKind(node), chapter.tier, true, node.level) }
    expect(first(t2)).toBe(2 * first(t1))
    expect(first(t1)).toBeGreaterThan(0)
  })

  it('make an elite and a lone boss act twice from tier Lv 10, not lifetime 10', () => {
    for (const [region, top, twice] of [[w6.regions.find((r) => r.row === 0)!, 55, false], [w6.regions.find((r) => r.row === 5)!, 60, true]] as const) {
      const stages = regionChapter(region, cast).nodes.filter((n) => n.kind !== 'camp')
      const elite = stages[10]!, boss = stages[11]!
      expect([elite.level, boss.level]).toEqual([top, top])
      expect(elite.enemies[0]!.rank).toBe('sub-boss')
      expect(elite.enemies[0]!.twice ?? false, `${region.id} elite`).toBe(twice)
      const champion = [boss.enemies, ...(boss.waves ?? [])].flat().find((f) => f.rank === 'boss')!
      expect(champion.twice ?? false, `${region.id} boss`).toBe(twice)
    }
  })

  it('step a regular foe’s HP from her tier level: ×1 at Tier 2 Lv 1, ×1.175 at Lv 6', () => {
    // A foe's role shows in her first move.
    const roleOf = { strike: 'striker', bolt: 'caster', bash: 'guard', cut: 'skirmisher' } as const
    for (const [region, tough] of [[w6.regions.find((r) => r.row === 0)!, 1], [w6.regions.find((r) => r.row === 5)!, 1 + WORLD_TUNING.regularHpPerLevel * 5]] as const) {
      const pair = regionChapter(region, cast).nodes[1]!
      expect(pair.name).toBe('Pair')
      for (const foe of pair.enemies) {
        const base = rpgFoe({ id: 'f', castId: '', element: foe.element, role: roleOf[foe.moves[0]!.id as keyof typeof roleOf], rank: 'regular',
          level: pair.level, shield: 4, weaknesses: { weapons: [], elements: [] } })
        expect(foe.stats.hp, foe.id).toBe(Math.round(base.stats.hp * (WORLD_FORMATIONS.duo.budget / 2) * tough))
      }
    }
  })
})
