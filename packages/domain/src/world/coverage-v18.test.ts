// Weaknesses v2's checks (H115, D235; weaknesses-v2.md WK12): the default party, with a Cleric and with a Paladin, against
// every Tier 1 foe on engine v18, on the generator before any fight. They replace CP4's twin checks (coverage-v16.test.ts,
// which keeps proving v16–v17). Fast, so it runs on every build; it prints nothing.
import { describe, expect, it } from 'vitest'
import type { BattleEnemy, BattleWeaknesses, EnemyRank } from '../rpg/battle/types'
import type { RpgMapNode } from '../rpg/campaign/chapters'
import { rpgDefaultWeapons, rpgWeaponKind, type RpgClass, type RpgDamageKind } from '../rpg/rules'
import { capitalChapter } from './capital'
import { regionChapter, worldContinent } from './world'

const V18 = 18
const cast = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))
const TIER1 = [1, 2, 3, 4, 5].map((order) => worldContinent({ name: 'T', order }))
const stagesOf = (nodes: readonly RpgMapNode[]): RpgMapNode[] => nodes.filter((n) => n.kind !== 'camp')
const REGION_STAGES = TIER1.flatMap((c) => c.regions.flatMap((r) => stagesOf(regionChapter(r, cast, V18).nodes)))
const CAPITAL_STAGES = TIER1.flatMap((c) => stagesOf(capitalChapter(c, cast, V18).nodes))
const foesOf = (n: RpgMapNode): BattleEnemy[] => [n.enemies, ...(n.waves ?? [])].flat()
const kindsOf = (w: BattleWeaknesses): RpgDamageKind[] => [...w.weapons, ...w.elements]

type Healer = 'cleric' | 'paladin'
const partyOf = (healer: Healer) => (['brawler', 'mage', 'spellblade', healer, 'summoner'] as const)
  .map((c) => ({ c: c as RpgClass, kinds: rpgDefaultWeapons(c, V18).map(rpgWeaponKind) as RpgDamageKind[] }))
const answers = (party: ReturnType<typeof partyOf>, e: BattleEnemy) => party.filter((m) => kindsOf(e.weaknesses).some((k) => m.kinds.includes(k)))

describe('weaknesses v2’s checks on the default party (WK12)', () => {
  it.each(['cleric', 'paladin'] as const)('1. with a %s, every Tier 1 foe answers to both channels and two members or more', (healer) => {
    const party = partyOf(healer)
    for (const n of [...REGION_STAGES, ...CAPITAL_STAGES]) for (const e of foesOf(n)) {
      expect(e.weaknesses.weapons.length, `${n.id} ${e.id}`).toBeGreaterThan(0)
      expect(e.weaknesses.elements.length, `${n.id} ${e.id}`).toBeGreaterThan(0)
      expect(answers(party, e).length, `${n.id} ${e.id}`).toBeGreaterThanOrEqual(2)
    }
  })

  it('2. no stage of two foes or more gives every foe the same list', () => {
    for (const n of [...REGION_STAGES, ...CAPITAL_STAGES]) {
      const foes = foesOf(n)
      if (foes.length < 2) continue
      expect(new Set(foes.map((e) => kindsOf(e.weaknesses).sort().join())).size, n.id).toBeGreaterThan(1)
    }
  })

  it.each([
    ['cleric', { brawler: 89, mage: 100, spellblade: 80, cleric: 81, summoner: 89 }],
    ['paladin', { brawler: 89, mage: 100, spellblade: 80, paladin: 83, summoner: 89 }],
  ] as const)('3. with a %s, every member hits 75%% of Tier 1’s foes weak or more (%j)', (healer, table) => {
    const party = partyOf(healer)
    const foes = REGION_STAGES.flatMap(foesOf)
    const share = Object.fromEntries(party.map((m) => [m.c, Math.round(100 * foes.filter((e) => answers(party, e).includes(m)).length / foes.length)]))
    expect(share).toEqual(table)
    for (const pct of Object.values(share)) expect(pct).toBeGreaterThanOrEqual(75)
  })

  it.each([
    ['cleric', { regular: [4.4, 3], 'sub-boss': [3.73, 2], boss: [3.7, 2] }, 121],
    ['paladin', { regular: [4.43, 3], 'sub-boss': [3.62, 2], boss: [3.78, 2] }, 86],
  ] as const)('pins D235’s table with a %s: members answering by rank (mean, min), and stages leaving a member nothing', (healer, table, idle) => {
    const party = partyOf(healer)
    const by: Partial<Record<EnemyRank, { n: number; sum: number; min: number }>> = {}
    for (const e of REGION_STAGES.flatMap(foesOf)) {
      const r = (by[e.rank] ??= { n: 0, sum: 0, min: 9 })
      const a = answers(party, e).length
      r.n++; r.sum += a; r.min = Math.min(r.min, a)
    }
    expect(Object.fromEntries(Object.entries(by).map(([rank, r]) => [rank, [Math.round(100 * r.sum / r.n) / 100, r.min]]))).toEqual(table)
    expect(REGION_STAGES).toHaveLength(2400)
    const left = REGION_STAGES.filter((n) => party.some((m) => !foesOf(n).some((e) => answers(party, e).includes(m))))
    expect(left).toHaveLength(idle)
    // Only stages of one or two foes leave anyone out.
    for (const n of left) expect(foesOf(n).filter((e) => e.rank === 'regular').length, n.id).toBeLessThanOrEqual(2)
  })
})
