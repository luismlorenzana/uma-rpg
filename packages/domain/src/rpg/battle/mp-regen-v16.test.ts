// Engine v16's base MP regen, dark (H68, D204; stat-balance.md §7.2, SB18): explicit inputs against v15's on the live
// switch. At each round's end every Uma standing regains 0.9% of her max MP for each skill depth her Class Rank opens, five
// at most (4.5% from Class Rank 40), rounded, at least 1, never past her max; a Spring Amulet's adds to it in one cue.
// SB18 drafted 0.8%; R1's balance (H71, D207) set 0.9%.
import { describe, expect, it } from 'vitest'
import { rpgBaseMpRegen, rpgDefaultWeapons, type RpgClass } from '../rules'
import { RPG_BASE_MP_REGEN, RPG_BASE_MP_REGEN_DEPTHS } from './caps'
import { applyBattleAction, battleActionsLeft, createBattle } from './engine'
import type { BattleAlly, BattleCue, BattleEnemy, BattleState } from './types'

type Version = 15 | 16
interface Spec { maxMp?: number; mp?: number; classRank?: number; mpRegen?: number }
/** An invented Uma at Lv 50 with her class's default weapons and nothing equipped: she only Attacks. */
function uma(id: string, classId: RpgClass, version: Version, spec: Spec = {}): BattleAlly {
  const maxMp = spec.maxMp ?? 296
  return { id, classId, weapons: rpgDefaultWeapons(classId, version), tier: 1, level: 50, tree: [], legacy: [], loadout: [],
    stats: { speed: 100, stamina: 100, power: 100, guts: 100, wit: 100, atk: 100, matk: 100, initiative: 50, pdef: 100, mdef: 100, dexterity: 0, hp: 1000, mp: maxMp },
    mp: spec.mp ?? Math.floor(maxMp / 2), classRank: spec.classRank ?? 40, ...(spec.mpRegen !== undefined ? { mpRegen: spec.mpRegen } : {}) }
}
/** A foe who only guards herself, weak to what nobody here wields: nobody is hurt, nothing falls or Breaks. */
const FOE: BattleEnemy = { id: 'f1', castId: 'cast-f1', element: 'ice', rank: 'regular', level: 50, shield: 6,
  stats: { hp: 1_000_000, atk: 50, matk: 50, pdef: 100, mdef: 100, initiative: 1 }, weaknesses: { weapons: ['katana'], elements: ['dark'] },
  moves: [{ id: 'm1', kind: 'guard', channel: 'physical', element: null, power: 0, target: 'self', label: 'Brace' }] }
/** The Mage `m1` with four Brawlers. */
const start = (version: Version, spec: Spec = {}): BattleState => createBattle({ version, seed: 1668, enemies: [FOE],
  allies: [uma('m1', 'mage', version, spec), ...[1, 2, 3, 4].map((i) => uma(`b${i}`, 'brawler', version, { mp: 0 }))] }).state
/** Every Uma standing Attacks until the round ends. */
function round(s: BattleState): { state: BattleState; cues: BattleCue[] } {
  const cues: BattleCue[] = []
  let state = s
  while (state.round === s.round) {
    const actor = state.units.find((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(state, u.id) > 0)!
    const step = applyBattleAction(state, { kind: 'attack', actorId: actor.id, targetId: 'f1' })
    expect(step.error).toBeUndefined()
    cues.push(...step.cues)
    state = step.state
  }
  return { state, cues }
}
const mpOf = (s: BattleState, id = 'm1') => s.units.find((u) => u.id === id)!.mp
/** The MP cues a round's end gave her. */
const gains = (cues: readonly BattleCue[], id = 'm1') => cues.flatMap((c) => (c.kind === 'mp' && c.targetId === id ? [c.amount] : []))
/** Her MP back at one round's end. */
function regained(version: Version, spec: Spec = {}): number {
  const s = start(version, spec)
  return mpOf(round(s).state) - mpOf(s)
}

describe('the base MP regen (SB18), engine v16 (H68, live since H72)', () => {
  it('is 0.9% of her max MP a depth open, five at most, rounded, at least 1, and nothing before v16', () => {
    expect([RPG_BASE_MP_REGEN, RPG_BASE_MP_REGEN_DEPTHS]).toEqual([0.009, 5])
    // 0.9 · 1.8 · 2.7 · 3.6 · 4.5% at Class Rank 1 · 10 · 20 · 30 · 40, and Class Rank 50 the same as 40.
    expect([1, 9, 10, 19, 20, 30, 40, 50].map((rank) => rpgBaseMpRegen(1000, rank, 16))).toEqual([9, 9, 18, 18, 27, 36, 45, 45])
    // stat-balance §7.2's Tier 1 Mage at Lv 10 · 20 · 30 · 40 · 50 on Class Rank = level: bar 107 · 148 · 194 · 243 · 296.
    expect([[107, 10], [148, 20], [194, 30], [243, 40], [296, 50]].map(([mp, rank]) => rpgBaseMpRegen(mp!, rank!, 16))).toEqual([2, 4, 7, 11, 13])
    expect([rpgBaseMpRegen(296, 1, 16), rpgBaseMpRegen(296, 10, 16), rpgBaseMpRegen(50, 1, 16)]).toEqual([3, 5, 1])
    // The live default is v17's since H82 (D218): 1.0% a depth (H81, D215).
    expect([rpgBaseMpRegen(296, 40, 15), rpgBaseMpRegen(296, 40, 14), rpgBaseMpRegen(296, 40, 16), rpgBaseMpRegen(296, 40)]).toEqual([0, 0, 13, 15])
  })

  it('gives a Mage with 296 max MP 13 at a round’s end at Class Rank 40, in one MP cue, round after round', () => {
    const s = start(16, { mp: 200 })
    const one = round(s)
    expect(mpOf(one.state)).toBe(213)
    expect(one.cues.filter((c) => c.kind === 'mp' && c.targetId === 'm1')).toEqual([{ kind: 'mp', actorId: 'm1', targetId: 'm1', amount: 13 }])
    const two = round(one.state)
    expect(gains(two.cues)).toEqual([13])
    expect(mpOf(two.state)).toBe(226)
  })

  it('steps up with her depths: 3 at Class Rank 1 and 9, 5 at 10, 13 at 40 and the same 13 at 50', () => {
    expect([1, 9, 10, 20, 30, 40, 50].map((classRank) => regained(16, { classRank }))).toEqual([3, 3, 5, 8, 11, 13, 13])
    // 50 max MP at Class Rank 1: 0.4 rounds to 0, so at least 1.
    expect(regained(16, { maxMp: 50, classRank: 1 })).toBe(1)
  })

  it('stacks with a Spring Amulet: a G10 Spring’s 10 and her 13, one cue of 23', () => {
    const one = round(start(16, { mp: 100, mpRegen: 10 }))
    expect(gains(one.cues)).toEqual([23])
    expect(mpOf(one.state)).toBe(123)
  })

  it('never fills her past her max MP, and gives nothing at her max', () => {
    const near = round(start(16, { mp: 290 }))
    expect([gains(near.cues), mpOf(near.state)]).toEqual([[6], 296])
    const full = round(start(16, { mp: 296, mpRegen: 10 }))
    expect([gains(full.cues), mpOf(full.state)]).toEqual([[], 296])
  })

  it('gives a fallen Uma nothing', () => {
    const s = start(16, { mp: 100 })
    const fallen: BattleState = { ...s, units: s.units.map((u) => (u.id === 'm1' ? { ...u, hp: 0 } : u)) }
    const after = round(fallen)
    expect([gains(after.cues), mpOf(after.state)]).toEqual([[], 100])
    // The Brawlers standing beside her still regain theirs (296 max MP from 0: 13).
    expect(gains(after.cues, 'b1')).toEqual([13])
  })

  it('leaves a v15 fight as it was: the Spring’s alone', () => {
    expect(regained(15, { mp: 100, mpRegen: 10 })).toBe(10)
    expect(regained(15, { mp: 100 })).toBe(0)
    expect(gains(round(start(15, { mp: 100 })).cues)).toEqual([])
    expect(regained(16, { mp: 100 })).toBe(13)
  })
})
