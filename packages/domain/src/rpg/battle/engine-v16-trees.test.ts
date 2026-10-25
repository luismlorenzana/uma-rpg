// Engine v16's trees, dark (H65, D201; class-progression.md §6.1, §6.2, §8.3; CP14, CP18, CP22, CP28, CP32, CP35, CP37,
// CP42): explicit v16 inputs against v15's on the live switch. Her `lines` pick each tree's line, her loadout holds only
// her held skills within seven slots, her Class Rank ranks every tree skill, the Spell Blade's B pierces, the Paladin's
// revive sits on her Light tree, and two halls' Limit Breaks change kind. Limit Breaks never rank.
import { describe, expect, it } from 'vitest'
import { balanceParty } from '../../world/balance-party'
import type { HeroLimitId } from '../hero-id'
import {
  learnRpgNode, projectRpgStats, rpgAutoLoadout, rpgDefaultWeapons, rpgHeldSkills, type RpgClass, type RpgLines, type RpgProfile, type RpgWeapon,
} from '../rules'
import { autoAction } from './auto'
import { applyBattleAction, battleActionsLeft, battleActorSkill, battleDamage, battleExtraHit, createBattle } from './engine'
import type { BattleAction, BattleAlly, BattleCue, BattleEnemy, BattleInput, BattleState, BattleStep } from './types'

type Version = 15 | 16
interface Spec {
  classId: RpgClass; level?: number; classRank?: number; weapons?: RpgWeapon[]; lines?: RpgLines; sides?: string[]; equip?: string[]
  hero?: HeroLimitId; inherits?: HeroLimitId[]; limitStart?: number
  /** Her ATK and M.ATK, set high so one hit's rounding is negligible. */
  offense?: number
  hp?: number
}
/** An invented Uma at Lv 40 (Class Rank 40 unless named) in a fight's generation: her default weapons, the named side skills
 * (v15), the named skills equipped or her auto loadout, and the Heroes she is or learns under. */
function member(id: string, version: Version, spec: Spec): BattleAlly {
  const level = spec.level ?? 40
  const weapons = spec.weapons ?? rpgDefaultWeapons(spec.classId, version)
  let p: RpgProfile = { outfitId: id, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
    growthRates: { speed: 0.05, stamina: 0.05, power: 0.05, guts: 0.05, wit: 0.05 }, classId: spec.classId, weapons, tier: 1, level, exp: 0,
    tree: [], legacy: [], classRank: spec.classRank ?? level, ...(spec.lines ? { lines: spec.lines } : {}) }
  p = (spec.sides ?? []).reduce(learnRpgNode, p)
  const base = projectRpgStats(p, version)
  const stats = { ...base, ...(spec.offense ? { atk: spec.offense, matk: spec.offense } : {}), ...(spec.hp ? { hp: spec.hp } : {}) }
  const loadout = spec.equip ? spec.equip.map((ref) => ({ tier: 1, id: ref })) : rpgAutoLoadout(p, version)
  return { id, classId: spec.classId, weapons, tier: 1, level, stats, tree: p.tree, legacy: [], loadout, mp: stats.mp, classRank: p.classRank,
    ...(spec.lines ? { lines: spec.lines } : {}), ...(spec.hero ? { hero: spec.hero } : {}),
    ...(spec.inherits ? { inherits: spec.inherits.map((limit) => ({ limit, bond: 10, from: `hero-${limit}` })) } : {}),
    ...(spec.limitStart !== undefined ? { limitStart: spec.limitStart } : {}) }
}
const CLASSES: readonly RpgClass[] = ['brawler', 'mage', 'spellblade', 'summoner', 'paladin']
/** One Uma of each class but one healer, `a1`–`a5`, with some re-specced. */
const party = (version: Version, changes: Partial<Record<number, Partial<Spec>>> = {}): BattleAlly[] =>
  CLASSES.map((classId, i) => member(`a${i + 1}`, version, { classId, ...changes[i] }))
/** A foe that never falls in one act and moves only when every Uma has acted: weak to Greatsword and Fire. */
const FOE: BattleEnemy = { id: 'f1', castId: 'cast-f1', element: 'ice', rank: 'regular', level: 40, shield: 6,
  stats: { hp: 1_000_000, atk: 60, matk: 60, pdef: 80, mdef: 80, initiative: 10 }, weaknesses: { weapons: ['greatsword'], elements: ['fire'] },
  moves: [{ id: 'm1', kind: 'damage', channel: 'physical', element: null, power: 100, target: 'front', label: 'Strike' }] }
const input = (allies: BattleAlly[], version: Version): BattleInput => ({ version, seed: 1665, allies, enemies: [FOE] })
const start = (allies: BattleAlly[], version: Version): BattleState => createBattle(input(allies, version)).state
function act(s: BattleState, action: BattleAction): BattleStep {
  const step = applyBattleAction(s, action)
  expect(step.error).toBeUndefined()
  return step
}
const skill = (actorId: string, id: string, pair?: string): BattleAction =>
  ({ kind: 'skill', actorId, targetId: 'f1', skill: { tier: 1, id }, ...(pair ? { pair: { skill: { tier: 1, id: pair } } } : {}) })
type Hit = Extract<BattleCue, { kind: 'hit' }>
const hitsBy = (cues: readonly BattleCue[], actorId: string): Hit[] =>
  cues.filter((c): c is Hit => c.kind === 'hit' && c.actorId === actorId && c.targetId === 'f1')
const sum = (cues: readonly BattleCue[]) => cues.reduce((n, c) => n + ('amount' in c ? c.amount ?? 0 : 0), 0)
/** The state with one Uma down, before anyone acts. */
const down = (s: BattleState, id: string): BattleState => ({ ...s, units: s.units.map((u) => (u.id === id ? { ...u, hp: 0 } : u)) })

describe('engine v16’s trees, dark (H65)', () => {
  it('refuses a B skill equipped without its line, and plays it with the line', () => {
    const b = { classId: 'brawler' as const, equip: ['brawler-greatsword.3b'] }
    expect(() => start(party(16, { 0: b }), 16)).toThrow(/Invalid battle ally/)
    const step = act(start(party(16, { 0: { ...b, lines: { greatsword: 'B' } } }), 16), skill('a1', 'brawler-greatsword.3b'))
    // Triple Sunder: one hit more than Sunder's two.
    expect(hitsBy(step.cues, 'a1')).toHaveLength(3)
    // On B her A node is no longer hers.
    expect(() => start(party(16, { 0: { classId: 'brawler', lines: { greatsword: 'B' }, equip: ['brawler-greatsword.3'] } }), 16)).toThrow(/Invalid battle ally/)
  })

  it('takes lines only from v16, naming only her weapons, each B', () => {
    expect(() => start(party(16, { 0: { lines: { bow: 'B' } } }), 16)).toThrow(/Invalid battle ally/)
    expect(() => start(party(16, { 0: { lines: { greatsword: 'A' } as unknown as RpgLines } }), 16)).toThrow(/Invalid battle ally/)
    expect(() => start(party(16, { 0: { lines: {} } }), 16)).not.toThrow()
    expect(() => start(party(15, { 0: { lines: { greatsword: 'B' } } }), 15)).toThrow(/Invalid battle ally/)
    expect(() => start(party(15), 15)).not.toThrow()
  })

  it('equips seven skills at most at Lv 40 (ten to v15)', () => {
    const held = rpgHeldSkills({ classId: 'brawler', weapons: rpgDefaultWeapons('brawler', 16), tier: 1, classRank: 40, tree: [], legacy: [] }, 16).map((r) => r.id)
    expect(held).toHaveLength(15)
    expect(() => start(party(16, { 0: { equip: held.slice(0, 8) } }), 16)).toThrow(/Invalid battle ally/)
    expect(() => start(party(16, { 0: { equip: held.slice(0, 7) } }), 16)).not.toThrow()
    expect(party(15)[0]!.loadout).toHaveLength(10)
  })

  it('ranks a skill by her Class Rank: ×1.05 ÷ ×0.95 more at Class Rank 48 than at 40, today’s power at Rank 3', () => {
    const dealt = (version: Version, classRank: number) => hitsBy(act(start(party(version, { 0: { classRank, equip: ['brawler-greatsword.5'], offense: 5000 } }), version),
      skill('a1', 'brawler-greatsword.5')).cues, 'a1')
    const [low, high] = [dealt(16, 40), dealt(16, 48)]
    expect(low).toHaveLength(3)
    expect(sum(high) / sum(low)).toBeCloseTo(1.05 / 0.95, 3)
    // Rank 3 (×1.00, Class Rank 44) is engine v15's skill exactly.
    expect(dealt(16, 44)).toEqual(dealt(15, 44))
  })

  it('ranks a healer’s mend and Barrier the same', () => {
    // A Cleric's Devotion (depth 3) mends the most hurt: Rank 1 at Class Rank 20, Rank 5 at 28.
    const mend = (classRank: number) => {
      const allies = party(16, { 0: { hp: 100_000 }, 4: { classId: 'cleric', classRank, equip: ['cleric-tome-light.3'] } })
      const s = start(allies, 16)
      const share = battleActorSkill(s, 'a5', { tier: 1, id: 'cleric-tome-light.3' })!.def.support15!.share
      const hurt = { ...s, units: s.units.map((u) => (u.id === 'a1' ? { ...u, hp: 1 } : u)) }
      const heal = act(hurt, skill('a5', 'cleric-tome-light.3')).cues.filter((c) => c.kind === 'heal' && c.targetId === 'a1')
      return { share, healed: sum(heal) }
    }
    const [r1, r5] = [mend(20), mend(28)]
    expect([r1.share, r5.share].map((n) => Math.round(n * 1e6) / 1e6)).toEqual([0.342, 0.378])
    expect(r5.healed / r1.healed).toBeCloseTo(1.05 / 0.95, 3)
    // A Paladin's Ruin (depth 5) raises a Barrier on every Uma.
    const barrier = (classRank: number) => sum(act(start(party(16, { 0: { hp: 100_000 }, 4: { classRank, equip: ['paladin-greatsword.5'] } }), 16),
      skill('a5', 'paladin-greatsword.5')).cues.filter((c) => c.kind === 'cover' && c.targetId === 'a1'))
    expect(barrier(48) / barrier(40)).toBeCloseTo(1.05 / 0.95, 3)
  })

  it('makes the Spell Blade’s B Pierce: one hit that ignores the unbroken halving, two on an Arms tree; v15’s Flurry adds a hit', () => {
    const lines: RpgLines = { katana: 'B', 'tome-lightning': 'B' }
    const s = start(party(16, { 2: { level: 20, lines, equip: ['spellblade-katana.3b', 'spellblade-tome-lightning.3b'], offense: 5000 } }), 16)
    const step = act(s, skill('a3', 'spellblade-katana.3b', 'spellblade-tome-lightning.3b'))
    const hits = hitsBy(step.cues, 'a3')
    expect(hits.map((h) => h.element)).toEqual(['katana', 'katana', 'lightning'])
    const actor = s.units.find((u) => u.id === 'a3')!, foe = s.units.find((u) => u.id === 'f1')!
    const arms = battleExtraHit(battleActorSkill(s, 'a3', { tier: 1, id: 'spellblade-katana.3b' })!.def)
    const tome = battleActorSkill(s, 'a3', { tier: 1, id: 'spellblade-tome-lightning.3b' })!.def
    const powers = [...arms.hits.map((h) => h.power * 0.72), tome.hits[0]!.power * 0.44]
    hits.forEach((hit, i) => {
      const channel = hit.element === 'katana' ? 'physical' : 'magical'
      const plain = battleDamage(s, actor, foe, channel, powers[i]!, hit.element)
      expect(hit.amount, `hit ${i}`).toBe(battleDamage(s, actor, foe, channel, powers[i]!, hit.element, { special: 'pierce' }).amount)
      expect(hit.amount / plain.amount, `hit ${i}`).toBeCloseTo(2, 2)
    })
    // Rank 1 at Class Rank 20: 3.335 × 0.95, the Arms half's extra hit sharing it.
    expect(tome.hits[0]!.power).toBeCloseTo(3.335 * 0.95, 6)
    expect(arms.hits.reduce((n, h) => n + h.power, 0)).toBeCloseTo(3.335 * 0.95, 6)
    // The same ids in v15 are the Flurry line: one more hit, the Arms half's extra one besides, every one halved.
    const v15 = party(15, { 2: { classRank: 25, weapons: ['greatsword', 'lance', 'katana', 'tome-fire', 'tome-lightning'],
      sides: ['spellblade-katana.3b', 'spellblade-tome-lightning.3b'], equip: ['spellblade-katana.3b', 'spellblade-tome-lightning.3b'] } })
    expect(hitsBy(act(start(v15, 15), skill('a3', 'spellblade-katana.3b', 'spellblade-tome-lightning.3b')).cues, 'a3').map((h) => h.element))
      .toEqual(['katana', 'katana', 'katana', 'katana', 'lightning', 'lightning', 'lightning'])
  })

  it('moves Valkyrie’s Oath: in v16 her Light 3B revives and her Lance 4B doesn’t; in v15 the reverse (CP37)', () => {
    const revives = (version: Version, id: string): boolean => {
      const paladin: Partial<Spec> = version === 16
        ? { weapons: ['lance', 'axe', 'tome-light'], lines: { lance: 'B', 'tome-light': 'B' }, equip: ['paladin-tome-light.3b', 'paladin-lance.4b'] }
        : { weapons: ['greatsword', 'axe', 'lance', 'tome-light', 'tome-ice'], sides: ['paladin-lance.4b', 'paladin-tome-light.3b'],
          equip: ['paladin-tome-light.3b', 'paladin-lance.4b'] }
      const s = down(start(party(version, { 4: paladin }), version), 'a1')
      return act(s, skill('a5', id)).cues.some((c) => c.kind === 'heal' && c.label === 'Revived' && c.targetId === 'a1')
    }
    expect([revives(16, 'paladin-tome-light.3b'), revives(16, 'paladin-lance.4b')]).toEqual([true, false])
    expect([revives(15, 'paladin-tome-light.3b'), revives(15, 'paladin-lance.4b')]).toEqual([false, true])
  })

  it('charges Rampart Charge with an Axe in v16 (a Greatsword in v15), its Barrier on every Uma still (CP35)', () => {
    const charge = (version: Version) => act(start(party(version, { 0: { inherits: ['paladin-3'], limitStart: 12 } }), version),
      { kind: 'limit', actorId: 'a1', targetId: 'f1', hero: 'paladin-3' }).cues
    expect(hitsBy(charge(16), 'a1').map((h) => h.element)).toEqual(['axe'])
    expect(hitsBy(charge(15), 'a1').map((h) => h.element)).toEqual(['greatsword'])
    expect(charge(16).filter((c) => c.kind === 'cover')).toHaveLength(5)
  })

  it('sings Choir of Angels as Light, then Lightning, on every foe in v16 (Light twice in v15), then Aegis 2 (CP35)', () => {
    const choir = (version: Version) => act(start(party(version, { 1: { inherits: ['cleric-1'], limitStart: 12 } }), version),
      { kind: 'limit', actorId: 'a2', targetId: 'f1', hero: 'cleric-1' }).cues
    expect(hitsBy(choir(16), 'a2').map((h) => h.element)).toEqual(['light', 'lightning'])
    expect(hitsBy(choir(15), 'a2').map((h) => h.element)).toEqual(['light', 'light'])
    expect(sum(hitsBy(choir(16), 'a2'))).toBe(sum(hitsBy(choir(15), 'a2')))
    expect(choir(16).filter((c) => c.kind === 'status' && c.label === 'aegis')).toHaveLength(5)
  })

  it('never ranks a Limit Break: a Hero’s deals the same at Class Rank 41 and 49 (CP28)', () => {
    const limit = (classRank: number) => hitsBy(act(start(party(16, { 0: { classRank, hero: 'brawler-1', limitStart: 12, offense: 5000 } }), 16),
      { kind: 'limit', actorId: 'a1', targetId: 'f1', hero: 'brawler-1' }).cues, 'a1').map((h) => h.amount)
    expect(limit(41)).toHaveLength(5)
    expect(limit(49)).toEqual(limit(41))
  })

  it('builds the balance party as v16 Umas: three weapons, no sides, line A, seven skills, and plays them on Auto', () => {
    const allies = balanceParty(40, { gear: true, stars: true, heroes: true, engine: 16 })
    for (const a of allies) {
      expect(a.weapons, a.classId).toEqual(rpgDefaultWeapons(a.classId, 16))
      expect(a.tree).toEqual([])
      expect(a.loadout).toHaveLength(7)
      expect(a.loadout.every((r) => /\.\d$/.test(r.id)), a.classId).toBe(true)
    }
    let s = start(allies, 16)
    for (let n = 0; n < 40 && s.round < 4 && s.outcome === 'active'; n++) {
      const actor = s.units.find((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(s, u.id) > 0)!
      s = act(s, autoAction(s, actor.id)).state
    }
    expect(s.round).toBe(4)
    // To v15 it is today's: the A side learned at every depth, ten skills.
    expect(balanceParty(40, { engine: 15 }).every((a) => a.tree.length > 0 && a.loadout.length === 10)).toBe(true)
  })
})
