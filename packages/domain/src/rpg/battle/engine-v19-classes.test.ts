// Engine v19's classes (H126; classes-v3.md §2, §3.4, §3.5, §13; CV5–CV10, CV15, CV22), built dark: every input here is
// `version: 19`. A Tier 0 fights only in Tier 1's world at Class Rank 1–10, a Tier 1 class there only from Class Rank 10;
// her skill's power is her Class Rank's; the new hybrids' lead half (the Tome Spellblade's Tome, the Arms Summoner's Arms)
// comes from her hand's data; a Tier 0 is no healer, regains depth 1's MP and casts a Hall's Limit Break at her skill's power.
import { describe, expect, it } from 'vitest'
import { rpgFoe } from '../campaign/enemies'
import { rpgNode } from '../catalog'
import { heroLimitPower } from '../heroes'
import {
  projectRpgStats, rpgBaseMpRegen, rpgDefaultWeapons, rpgHand, rpgOpenPower, RPG_TIER0_POWER, type RpgClass, type RpgProfile, type RpgWeapon,
} from '../rules'
import { applyBattleAction, battleActionsLeft, battleDamage, createBattle } from './engine'
import { battleLimitPlan } from './limit'
import type { HeroLimitId } from '../hero-id'
import type { BattleAction, BattleAlly, BattleCue, BattleEnemy, BattleInput, BattleState, BattleStep } from './types'

const V19 = 19
/** An invented Uma of a class at engine v19: her defaults (or `weapons`), stats, held skills equipped (or `loadout`). */
function member(id: string, classId: RpgClass, o: { weapons?: RpgWeapon[]; loadout?: string[]; level?: number; classRank?: number; tier?: number } = {}): BattleAlly {
  const level = o.level ?? 20, tier = o.tier ?? 1
  const weapons = o.weapons ?? rpgDefaultWeapons(classId, V19)
  const classRank = o.classRank ?? 20
  const p: RpgProfile = { outfitId: id, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
    growthRates: { speed: 0.05, stamina: 0.05, power: 0.05, guts: 0.05, wit: 0.05 }, classId, weapons, tier, level, exp: 0,
    tree: [], legacy: [], classRank }
  const stats = projectRpgStats(p, V19)
  const loadout = o.loadout ?? weapons.map((w) => `${classId}-${w}.1`)
  return { id, classId, weapons, tier, level, stats, tree: [], legacy: [], loadout: loadout.map((n) => ({ tier, id: n })), mp: stats.mp, classRank }
}
/** A sturdy foe that barely hurts: one weak poke, no second phase. */
function foe(id: string, weaknesses: BattleEnemy['weaknesses'] = { weapons: ['greatsword'], elements: ['fire'] }, hp = 1_000_000): BattleEnemy {
  const f = rpgFoe({ id, castId: `cast-${id}`, element: 'dark', role: 'striker', rank: 'regular', level: 20, shield: 10, weaknesses })
  return { ...f, stats: { ...f.stats, hp }, phaseTwo: undefined,
    moves: [{ id: 'poke', kind: 'damage', channel: 'physical', element: null, power: 1, label: 'Poke', target: 'front' }] }
}
/** Four Brawlers at Class Rank 20 around `a3`. */
const party = (a3: BattleAlly, a5 = member('a5', 'brawler')): BattleAlly[] =>
  [member('a1', 'brawler'), member('a2', 'brawler'), a3, member('a4', 'brawler'), a5]
const input = (allies: BattleAlly[], enemies: BattleEnemy[] = [foe('f1')], version: BattleInput['version'] = V19): BattleInput =>
  ({ version, seed: 1919, allies, enemies })
const start = (i: BattleInput): BattleState => createBattle(i).state
const ok = (s: BattleState, action: BattleAction): BattleStep => {
  const step = applyBattleAction(s, action)
  expect(step.error, JSON.stringify(action)).toBeUndefined()
  return step
}
/** Her act, then everyone else guards so the foes move and the next round opens. */
function round(s: BattleState, action: BattleAction): { step: BattleStep; next: BattleState } {
  const step = ok(s, action)
  let next = step.state
  for (const u of next.units) {
    if (next.round !== s.round || next.outcome !== 'active') break
    if (u.side !== 'ally' || u.hp <= 0 || battleActionsLeft(next, u.id) <= 0) continue
    next = ok(next, { kind: 'guard', actorId: u.id, targetId: u.id === 'a1' ? 'a2' : 'a1' }).state
  }
  return { step, next }
}
type Hit = Extract<BattleCue, { kind: 'hit' }>
const hitsOf = (cues: readonly BattleCue[], actorId: string): Hit[] => cues.filter((c): c is Hit => c.kind === 'hit' && c.actorId === actorId)
const unitOf = (s: BattleState, id: string) => s.units.find((u) => u.id === id)!
const ref = (id: string) => ({ tier: 1, id })
const refused = (i: BattleInput) => () => createBattle(i)

describe('engine v19: who may fight as what (CV8, CV10)', () => {
  it('accepts v19 and refuses a Tier 0 in a v18 fight', () => {
    expect(() => createBattle(input(party(member('a3', 'recruit', { classRank: 5 }))))).not.toThrow()
    expect(refused(input(party(member('a3', 'recruit', { classRank: 5 })), [foe('f1')], 18))).toThrow('Invalid battle ally')
    // The six fight on v19 as they did.
    expect(() => createBattle(input([member('a1', 'brawler'), member('a2', 'mage'), member('a3', 'spellblade'), member('a4', 'cleric'), member('a5', 'summoner')])))
      .not.toThrow()
  })

  it('refuses a Tier 0 past Class Rank 10 or outside Tier 1, and a Tier 1 class below Rank 10 in Tier 1 (not in Tier 2)', () => {
    expect(refused(input(party(member('a3', 'recruit', { classRank: 11 }))))).toThrow('Invalid battle ally')
    expect(refused(input(party(member('a3', 'recruit', { classRank: 5, tier: 2 }))))).toThrow('Invalid battle ally')
    expect(refused(input(party(member('a3', 'brawler', { classRank: 9 }))))).toThrow('Invalid battle ally')
    expect(() => createBattle(input(party(member('a3', 'brawler', { classRank: 10 }))))).not.toThrow()
    const tier2 = ['a1', 'a2', 'a3', 'a4', 'a5'].map((id) => member(id, 'brawler', { classRank: 9, tier: 2 }))
    expect(() => createBattle(input(tier2))).not.toThrow()
  })

  it('refuses a Tier 0 with lines; she has no fork', () => {
    expect(refused(input(party({ ...member('a3', 'recruit', { classRank: 5 }), lines: { greatsword: 'B' } })))).toThrow('Invalid battle ally')
    expect(() => createBattle(input(party({ ...member('a3', 'recruit', { classRank: 5 }), lines: {} })))).not.toThrow()
  })

  it('counts an Acolyte as no healer: an Acolyte with a Cleric is a party, a Paladin with a Cleric isn\'t (CV22)', () => {
    const cleric = member('a5', 'cleric')
    expect(() => createBattle(input(party(member('a3', 'acolyte', { classRank: 10 }), cleric)))).not.toThrow()
    expect(refused(input(party(member('a3', 'paladin'), cleric)))).toThrow('Invalid battle party')
  })
})

describe('engine v19: a Tier 0\'s one skill (CV6)', () => {
  it('lands a Recruit\'s Drill Strike at her Attack\'s damage × 1.52 at Rank 1 and × 2.20 at Rank 10, for 10 MP', () => {
    const strike = (classRank: number) => {
      const a3 = member('a3', 'recruit', { classRank, level: 30 })
      const s = start(input(party({ ...a3, stats: { ...a3.stats, atk: 3000 } })))
      const step = ok(s, { kind: 'skill', actorId: 'a3', targetId: 'f1', skill: ref('recruit-greatsword.1') })
      const hits = hitsOf(step.cues, 'a3')
      const attack = battleDamage(s, unitOf(s, 'a3'), unitOf(s, 'f1'), 'physical', 1, 'greatsword').amount
      const own = battleDamage(s, unitOf(s, 'a3'), unitOf(s, 'f1'), 'physical', RPG_TIER0_POWER[classRank - 1]!, 'greatsword').amount
      return { hits, attack, own, mp: unitOf(s, 'a3').mp - unitOf(step.state, 'a3').mp }
    }
    for (const [rank, power] of [[1, 1.52], [10, 2.2]] as const) {
      const r = strike(rank)
      expect(r.hits.map((h) => [h.element, h.weak]), `R${rank}`).toEqual([['greatsword', true]])
      expect(r.hits[0]!.amount, `R${rank}`).toBe(r.own)
      expect(Math.abs(r.hits[0]!.amount - r.attack * power), `R${rank}`).toBeLessThanOrEqual(power + 1)
      expect(r.mp, `R${rank}`).toBe(10)
    }
    // A Tome slot casts it as magic of her Tome's element.
    const a3 = member('a3', 'apprentice', { classRank: 4 })
    const step = ok(start(input(party(a3))), { kind: 'skill', actorId: 'a3', targetId: 'f1', skill: ref('apprentice-tome-fire.1') })
    expect(hitsOf(step.cues, 'a3').map((h) => [h.element, h.channel])).toEqual([['fire', 'magical']])
  })

  it('regains 1% of her max MP a round at Class Rank 10, as at Rank 1', () => {
    const a3 = member('a3', 'caller', { classRank: 10, level: 30 })
    const s = start(input(party({ ...a3, mp: 0 })))
    const { step, next } = round(s, { kind: 'guard', actorId: 'a3', targetId: 'a1' })
    const regen = rpgBaseMpRegen(a3.stats.mp, { classId: 'caller', classRank: 10 }, V19)
    expect(regen).toBe(Math.max(1, Math.round(a3.stats.mp * 0.01)))
    expect(unitOf(next, 'a3').mp).toBe(regen)
    expect(step.error).toBeUndefined()
  })

  it('casts a Hero\'s Limit Break at her skill\'s power at her Class Rank (`rpgOpenPower`), × the interim class power', () => {
    const total = (a: BattleAlly) => battleLimitPlan(a, { hero: 'brawler-1' as HeroLimitId }, V19)!.casts.reduce((n, c) => n + c.def.hits.reduce((m, h) => m + h.power, 0), 0)
    const recruit = { ...member('a3', 'recruit', { classRank: 7 }), hero: 'brawler-1' as HeroLimitId }
    expect(rpgOpenPower({ classId: 'recruit', classRank: 7 }, V19)).toBe(1.97)
    expect(total(recruit)).toBeCloseTo(heroLimitPower('recruit', V19) * 1.97, 2)
    const brawler = { ...member('a3', 'brawler', { classRank: 10 }), hero: 'brawler-1' as HeroLimitId }
    expect(total(brawler)).toBeCloseTo(heroLimitPower('brawler', V19) * 2.2, 2)
    // It fires in a fight.
    const s = start(input(party(recruit)))
    unitOf(s, 'a3').limit = 12
    expect(ok(s, { kind: 'limit', actorId: 'a3', targetId: 'f1' }).cues.some((c) => c.kind === 'limit')).toBe(true)
  })
})

describe('engine v19: the new hybrids\' lead half from data (CV15)', () => {
  it('resolves a Tome Spellblade\'s Tome half first, whatever order the action names, and lands it one hit more', () => {
    const tb = member('a3', 'tomeblade', { loadout: ['tomeblade-tome-light.1', 'tomeblade-tome-lightning.1', 'tomeblade-katana.1'] })
    const s = start(input(party(tb), [foe('f1', { weapons: ['katana'], elements: ['light'] })]))
    const armsFirst: BattleAction = { kind: 'skill', actorId: 'a3', targetId: 'f1', skill: ref('tomeblade-katana.1'), pair: { skill: ref('tomeblade-tome-light.1') } }
    const tomeFirst: BattleAction = { kind: 'skill', actorId: 'a3', targetId: 'f1', skill: ref('tomeblade-tome-light.1'), pair: { skill: ref('tomeblade-katana.1') } }
    const a = ok(s, armsFirst), b = ok(s, tomeFirst)
    expect(a.cues).toEqual(b.cues)
    const light = rpgNode('tomeblade-tome-light.1')!.skill.hits.length, katana = rpgNode('tomeblade-katana.1')!.skill.hits.length
    expect(hitsOf(a.cues, 'a3').map((h) => h.element)).toEqual([...Array(light + 1).fill('light'), ...Array(katana).fill('katana')])
    // Each half at her hand: Tome 0.72, Arms 0.44.
    const hand = rpgHand({ classId: 'tomeblade' }, V19)
    const whole = (power: number, kind: 'light' | 'katana', channel: 'magical' | 'physical') =>
      battleDamage(s, unitOf(s, 'a3'), unitOf(s, 'f1'), channel, power, kind).amount
    const sum = (kind: string) => hitsOf(a.cues, 'a3').filter((h) => h.element === kind).reduce((n, h) => n + h.amount, 0)
    const power = (id: string) => rpgNode(id)!.skill.hits.reduce((n, h) => n + h.power, 0)
    expect(Math.abs(sum('light') - whole(power('tomeblade-tome-light.1') * hand.tome, 'light', 'magical'))).toBeLessThanOrEqual(light + 1)
    expect(Math.abs(sum('katana') - whole(power('tomeblade-katana.1') * hand.arms, 'katana', 'physical'))).toBeLessThanOrEqual(katana)
  })

  it('keeps an Arms Summoner\'s Arms summon on the field; it bids farewell on every foe as her next pair comes', () => {
    const as = member('a3', 'armsummoner', { loadout: ['armsummoner-bow.1', 'armsummoner-axe.1', 'armsummoner-tome-dark.1'] })
    const s = start(input(party(as), [foe('f1'), foe('f2')]))
    // Named Tome first: her Arms half still leads.
    const pair: BattleAction = { kind: 'skill', actorId: 'a3', targetId: 'f1', skill: ref('armsummoner-tome-dark.1'), pair: { skill: ref('armsummoner-axe.1') } }
    const { step, next } = round(s, pair)
    expect(hitsOf(step.cues, 'a3')[0]!.element).toBe('axe')
    expect(step.state.summons).toEqual([{ allyId: 'a3', ref: ref('armsummoner-axe.1'), scale: 0.3 }])
    const again = ok(next, { kind: 'skill', actorId: 'a3', targetId: 'f2', skill: ref('armsummoner-bow.1'), pair: { skill: ref('armsummoner-tome-dark.1') } })
    expect(again.cues[0]).toMatchObject({ kind: 'summon', actorId: 'a3' })
    const farewell = again.cues.slice(1, 3)
    expect(farewell.map((c) => [c.kind, (c as Hit).element, (c as Hit).targetId])).toEqual([['hit', 'axe', 'f1'], ['hit', 'axe', 'f2']])
    expect(again.state.summons).toEqual([{ allyId: 'a3', ref: ref('armsummoner-bow.1'), scale: 0.3 }])
  })
})
