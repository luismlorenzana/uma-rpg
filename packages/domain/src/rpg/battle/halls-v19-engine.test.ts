// Halls v2's Limit Breaks in a fight (H129; halls-v2.md §3–§4, HV5, HV14, HV-A), built dark: every input here is
// `version: 19` unless it says otherwise, with fixed seeds. The power is the Limit Break's own × her class's scale × her
// open power; a random double's second hit follows its first; a volley strikes her foe, then every other; the healers'
// four carry one stack and no support; each generation's seats are its own.
import { describe, expect, it } from 'vitest'
import { rpgFoe } from '../campaign/enemies'
import { heroLimitFor, heroLimitIds, heroLimitScale, type HeroLimitId } from '../heroes'
import { projectRpgStats, rpgDefaultWeapons, rpgOpenPower, type RpgClass, type RpgProfile } from '../rules'
import { applyBattleAction, createBattle } from './engine'
import { battleLimitPlan } from './limit'
import type { BattleAlly, BattleCue, BattleEnemy, BattleInherit, BattleInput, BattleState, BattleStep } from './types'

const V19 = 19
/** An invented Uma of a class at engine v19 (Tier 1, Lv 20, Class Rank 20 unless given), her defaults equipped. */
function member(id: string, classId: RpgClass, o: { classRank?: number } & Partial<BattleAlly> = {}): BattleAlly {
  const { classRank = 20, ...extra } = o
  const weapons = rpgDefaultWeapons(classId, V19)
  const p: RpgProfile = { outfitId: id, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
    growthRates: { speed: 0.05, stamina: 0.05, power: 0.05, guts: 0.05, wit: 0.05 }, classId, weapons, tier: 1, level: 20, exp: 0,
    tree: [], legacy: [], classRank }
  const stats = projectRpgStats(p, V19)
  return { id, classId, weapons, tier: 1, level: 20, stats, tree: [], legacy: [], loadout: [{ tier: 1, id: `${classId}-${weapons[0]}.1` }],
    mp: stats.mp, classRank, ...extra }
}
/** A sturdy foe that barely hurts. */
function foe(id: string, hp = 1_000_000): BattleEnemy {
  const f = rpgFoe({ id, castId: `cast-${id}`, element: 'dark', role: 'striker', rank: 'regular', level: 20, shield: 10,
    weaknesses: { weapons: ['greatsword'], elements: ['fire'] } })
  return { ...f, stats: { ...f.stats, hp, atk: 1, matk: 1 }, phaseTwo: undefined,
    moves: [{ id: 'poke', kind: 'damage', channel: 'physical', element: null, power: 1, label: 'Poke', target: 'front' }] }
}
const FOES = [foe('f1'), foe('f2'), foe('f3')]
const hero = (seat: HeroLimitId, classId: RpgClass = 'brawler', o: { classRank?: number } = {}) => member('a1', classId, { ...o, hero: seat })
const learner = (seat: HeroLimitId, bond: number, classId: RpgClass = 'brawler') =>
  member('a1', classId, { inherits: [{ limit: seat, bond, from: 'x9' } satisfies BattleInherit] })
/** `caster` as a1 with a full gauge, beside four Brawlers. */
function fight(caster: BattleAlly, foes = FOES, seed = 1929, version: BattleInput['version'] = V19): BattleState {
  const allies = [caster, member('a2', 'brawler'), member('a3', 'brawler'), member('a4', 'brawler'), member('a5', 'brawler')]
  const s = createBattle({ version, seed, allies, enemies: foes }).state
  s.units.find((u) => u.id === 'a1')!.limit = 12
  return s
}
function fire(s: BattleState, seat: HeroLimitId): BattleStep {
  const ally = s.input.allies[0]!
  const step = applyBattleAction(s, { kind: 'limit', actorId: 'a1', targetId: 'f1', ...(ally.inherits ? { hero: seat } : {}) })
  expect(step.error, seat).toBeUndefined()
  return step
}
type Hit = Extract<BattleCue, { kind: 'hit' }>
const hits = (cues: readonly BattleCue[]): Hit[] => cues.filter((c): c is Hit => c.kind === 'hit' && c.actorId === 'a1' && c.targetId.startsWith('f'))
type Status = { kind: 'status'; actorId: string; targetId: string; amount?: number; label?: string }
const statuses = (cues: readonly BattleCue[], label: string): Status[] => cues.filter((c) => c.kind === 'status' && c.label === label) as Status[]
const total = (a: BattleAlly, seat: HeroLimitId) =>
  battleLimitPlan(a, a.inherits ? { hero: seat } : {}, V19)!.casts.reduce((n, c) => n + c.def.hits.reduce((m, h) => m + h.power, 0), 0)
const refused = (i: BattleInput) => () => createBattle(i)

describe('engine v19: a Limit Break’s own power × her class’s scale × her open power (HV5)', () => {
  it('lands a Hero’s Ten Thousand Swings as one hit worth 2.9 × her open power', () => {
    const a = hero('brawler-2')
    const open = rpgOpenPower({ classId: 'brawler', classRank: 20 }, V19)
    const plan = battleLimitPlan(a, {}, V19)!
    expect([plan.name, plan.casts.length, plan.casts[0]!.def.hits.length, plan.casts[0]!.scale]).toEqual(['Ten Thousand Swings', 1, 1, 1])
    expect(plan.casts[0]!.def.hits[0]!.power).toBeCloseTo(2.9 * open, 2)
    const struck = hits(fire(fight(a), 'brawler-2').cues)
    expect(struck.map((c) => `${c.targetId}:${c.element}`)).toEqual(['f1:greatsword'])
  })

  it('scales the same Limit Break ×0.75 from a Paladin Hero', () => {
    const open = rpgOpenPower({ classId: 'paladin', classRank: 20 }, V19)
    expect(heroLimitScale('paladin', V19)).toBe(0.75)
    expect(total(hero('brawler-2', 'paladin'), 'brawler-2')).toBeCloseTo(2.9 * 0.75 * open, 2)
    expect(total(hero('brawler-2', 'paladin'), 'brawler-2') / total(hero('brawler-2', 'brawler'), 'brawler-2'))
      .toBeCloseTo(0.75 * open / rpgOpenPower({ classId: 'brawler', classRank: 20 }, V19), 3)
    // A Cleric's too; an Acolyte is no healer (CV22), so hers is whole.
    expect(total(hero('brawler-2', 'cleric'), 'brawler-2')).toBeCloseTo(2.9 * 0.75 * rpgOpenPower({ classId: 'cleric', classRank: 20 }, V19), 2)
    expect(total(hero('brawler-2', 'acolyte', { classRank: 10 }), 'brawler-2')).toBeCloseTo(2.9 * 2.2, 2)
  })

  it('casts a Recruit Hero’s at her skill’s power at Class Rank 4: 1.75', () => {
    expect(rpgOpenPower({ classId: 'recruit', classRank: 4 }, V19)).toBe(1.75)
    expect(total(hero('brawler-2', 'recruit', { classRank: 4 }), 'brawler-2')).toBeCloseTo(2.9 * 1.75, 2)
    expect(total(hero('summoner-3', 'recruit', { classRank: 4 }), 'summoner-3')).toBeCloseTo(2.2 * 1.75 * 0.55, 2)
  })

  it('casts a Learner’s at 50% at Bond 0, and lands its whole stack', () => {
    const a = learner('healer-1', 0)
    const plan = battleLimitPlan(a, { hero: 'healer-1' }, V19)!
    expect([plan.capacity, plan.from, plan.casts.map((c) => c.scale)]).toEqual([0.5, 'x9', [0.5]])
    const cues = fire(fight(a), 'healer-1').cues
    const braves = statuses(cues, 'brave')
    expect(braves.map((c) => [c.targetId, c.amount])).toEqual(['a1', 'a2', 'a3', 'a4', 'a5'].map((id) => [id, 1]))
  })
})

describe('engine v19: the twenty’s shapes in a fight (§4, HV-A)', () => {
  it('lands Firefly Pact’s ten hits in five pairs, each pair on one foe; on a lone foe all ten on her', () => {
    const struck = hits(fire(fight(hero('spellblade-2')), 'spellblade-2').cues)
    expect(struck.map((c) => c.element)).toEqual(['katana', 'katana', 'light', 'light', 'katana', 'katana', 'light', 'light', 'katana', 'katana'])
    const pairs = [0, 1, 2, 3, 4].map((k) => [struck[2 * k]!.targetId, struck[2 * k + 1]!.targetId])
    for (const [a, b] of pairs) expect(a).toBe(b)
    // The pairs' foes are drawn: this seed spreads them over the field.
    expect(new Set(pairs.map(([a]) => a)).size).toBeGreaterThan(1)
    const lone = hits(fire(fight(hero('spellblade-2'), [foe('f1')]), 'spellblade-2').cues)
    expect(lone.map((c) => c.targetId)).toEqual(Array(10).fill('f1'))
  })

  it('draws a double’s second hit again when the first felled its foe, by its own index', () => {
    // f2 falls to any hit; the hit after the one that fells her draws among the living, as any random hit.
    const foes = [foe('f1'), foe('f2', 1), foe('f3')]
    const struck = hits(fire(fight(hero('spellblade-2'), foes), 'spellblade-2').cues)
    const felled = struck.findIndex((c) => c.targetId === 'f2')
    expect(felled, 'this seed strikes f2').toBeGreaterThanOrEqual(0)
    expect(felled % 2, 'a pair’s first hit fells her').toBe(0)
    expect(struck[felled + 1]!.targetId).not.toBe('f2')
    expect(struck.filter((c) => c.targetId === 'f2')).toHaveLength(1)
    expect(struck).toHaveLength(10)
    // Every pair whose first hit landed on a standing foe stays on her.
    for (let k = 0; k < 5; k++) if (struck[2 * k]!.targetId !== 'f2') expect(struck[2 * k + 1]!.targetId).toBe(struck[2 * k]!.targetId)
  })

  it('lands Echo Draw’s six cuts on her foe: `follow` changes nothing on one foe', () => {
    const struck = hits(fire(fight(hero('brawler-3')), 'brawler-3').cues)
    expect(struck.map((c) => `${c.targetId}:${c.element}`)).toEqual(Array(6).fill('f1:katana'))
  })

  it('lands Hundred-Arrow Rain’s four hits on the tapped foe and two splash hits on each other', () => {
    const struck = hits(fire(fight(hero('brawler-4')), 'brawler-4').cues)
    expect(struck.map((c) => c.targetId)).toEqual(['f1', 'f1', 'f2', 'f3', 'f1', 'f1', 'f2', 'f3'])
    expect(new Set(struck.map((c) => c.element))).toEqual(new Set(['bow']))
    // The splash hits at 0.35 of its share against the tapped foe's 0.8 (two hits at a quarter, a splash at a half).
    const [onHer, splash] = [struck[0]!.amount, struck[2]!.amount]
    expect(splash / onHer).toBeCloseTo((0.5 * 0.35) / (0.25 * 0.8), 1)
  })

  it('sweeps every foe three times with the Summoner Circle’s', () => {
    const struck = hits(fire(fight(hero('summoner-1')), 'summoner-1').cues)
    expect(struck.map((c) => `${c.targetId}:${c.element}`)).toEqual(
      ['axe', 'bow', 'axe'].flatMap((k) => ['f1', 'f2', 'f3'].map((f) => `${f}:${k}`)))
  })

  it('lands Archdemon’s Toll’s Armor Break before its first hit, and Archangel’s Judgment’s Brave after its last, on every ally', () => {
    const toll = fire(fight(hero('healer-2')), 'healer-2').cues
    const curse = toll.findIndex((c) => c.kind === 'status' && c.label === 'armor-break')
    const first = toll.findIndex((c) => c.kind === 'hit' && c.actorId === 'a1')
    expect(curse).toBeGreaterThanOrEqual(0)
    expect(curse).toBeLessThan(first)
    expect(statuses(toll, 'armor-break').map((c) => [c.targetId, c.amount])).toEqual([['f1', 1]])
    expect(hits(toll).map((c) => `${c.targetId}:${c.element}`)).toEqual(['f1:axe', 'f1:axe', 'f1:dark', 'f1:dark'])
    const judgment = fire(fight(hero('healer-1')), 'healer-1').cues
    const last = judgment.map((c) => c.kind === 'hit' && c.actorId === 'a1').lastIndexOf(true)
    const braves = judgment.flatMap((c, i) => (c.kind === 'status' && c.label === 'brave' ? [{ i, targetId: c.targetId, amount: c.amount }] : []))
    expect(braves.map((b) => [b.targetId, b.amount])).toEqual(['a1', 'a2', 'a3', 'a4', 'a5'].map((id) => [id, 1]))
    expect(braves.every((b) => b.i > last)).toBe(true)
    expect(hits(judgment).map((c) => `${c.targetId}:${c.element}`)).toEqual(['f1:lance', 'f1:lance', 'f1:light', 'f1:light'])
  })

  it('mends, shields, cleanses and revives nothing from any v19 seat', () => {
    for (const seat of heroLimitIds(V19)) {
      const s = fight(hero(seat))
      for (const u of s.units) if (u.side === 'ally' && u.id !== 'a1') { u.hp = u.id === 'a2' ? 0 : 1; u.statuses.push({ kind: 'burn', stacks: 1, turns: 2 }) }
      const cues = fire(s, seat).cues
      const support = cues.filter((c) => 'actorId' in c && c.actorId === 'a1' &&
        (c.kind === 'heal' || c.kind === 'cover' || (c.kind === 'status' && !!c.label?.includes('cleansed'))))
      expect(support, seat).toEqual([])
      expect(heroLimitFor(seat, V19)!.casts.every((c) => !c.support), seat).toBe(true)
    }
  })
})

describe('engine v19: each generation’s seats (HV20)', () => {
  it('refuses `paladin-1` in a v19 input and `healer-1` in a v18 one, as a Hero or a Learner', () => {
    const allies = (a1: BattleAlly) => [a1, member('a2', 'brawler'), member('a3', 'brawler'), member('a4', 'brawler'), member('a5', 'brawler')]
    const input = (a1: BattleAlly, version: BattleInput['version']): BattleInput => ({ version, seed: 1, allies: allies(a1), enemies: [foe('f1')] })
    expect(refused(input(hero('paladin-1'), V19))).toThrow('Invalid battle ally')
    expect(refused(input(learner('cleric-2', 3), V19))).toThrow('Invalid battle ally')
    expect(refused(input(hero('healer-1'), 18))).toThrow('Invalid battle ally')
    expect(refused(input(learner('healer-4', 3), 18))).toThrow('Invalid battle ally')
    expect(() => createBattle(input(hero('healer-1'), V19))).not.toThrow()
    expect(() => createBattle(input(learner('summoner-4', 3), V19))).not.toThrow()
  })
})
