// Engine v16's Flourish, dark (H68, D204; uma-templates.md §3.3, UT6, UT18): explicit inputs. 4% of her max HP a fight,
// in her stride's shape: Clean break a Barrier at the start that lapses at round 1's end, Even pace 1% at each round's
// end, Late reserve 2% from round 3's end. Not a heal skill: no healing scale, never past her max HP, nothing once she has
// fallen; once a fight, whatever its waves.
import { describe, expect, it } from 'vitest'
import { rpgDefaultWeapons, type RpgClass } from '../rules'
import { BATTLE_FLOURISH_FROM, BATTLE_FLOURISH_RATE, BATTLE_FLOURISH_SHARE } from './caps'
import { applyBattleAction, battleActionsLeft, createBattle } from './engine'
import type { BattleAlly, BattleCue, BattleEnemy, BattleInput, BattleState, BattleStep, RpgFlourish } from './types'

type Version = 15 | 16
interface Spec { classId?: RpgClass; flourish?: RpgFlourish; matk?: number; regen?: number; mp?: number }
/** An invented Lv 50 Uma with 1000 max HP (her 4% is 40) and nothing equipped: she only Attacks. */
function uma(id: string, version: Version, spec: Spec = {}): BattleAlly {
  const classId = spec.classId ?? 'brawler'
  return { id, classId, weapons: rpgDefaultWeapons(classId, version), tier: 1, level: 50, tree: [], legacy: [], loadout: [],
    stats: { speed: 100, stamina: 100, power: 100, guts: 100, wit: 100, atk: 100, matk: spec.matk ?? 100, initiative: 50, pdef: 100, mdef: 100,
      dexterity: 0, hp: 1000, mp: 200 },
    mp: spec.mp ?? 200, classRank: 40, ...(spec.flourish ? { flourish: spec.flourish } : {}), ...(spec.regen ? { regen: spec.regen } : {}) }
}
const foe = (id: string, striker = false): BattleEnemy => ({ id, castId: `cast-${id}`, element: 'ice', rank: 'regular', level: 50, shield: 6,
  stats: { hp: 1_000_000, atk: striker ? 400 : 50, matk: 50, pdef: 100, mdef: 100, initiative: 1 },
  // Weak to what nobody here wields, so she never Breaks.
  weaknesses: { weapons: ['katana'], elements: ['dark'] },
  moves: [striker
    ? { id: 'm1', kind: 'damage', channel: 'physical', element: null, power: 100, target: 'front', label: 'Strike' }
    : { id: 'm1', kind: 'guard', channel: 'physical', element: null, power: 0, target: 'self', label: 'Brace' }] })
/** `a1`–`a5`, the named one with her spec, against a foe who guards herself (or strikes the front Uma), and its waves. */
function input(version: Version, specs: Partial<Record<number, Spec>>, o: { striker?: boolean; waves?: number } = {}): BattleInput {
  return { version, seed: 1668, allies: [0, 1, 2, 3, 4].map((i) => uma(`a${i + 1}`, version, specs[i])), enemies: [foe('f1', o.striker)],
    ...(o.waves ? { waves: Array.from({ length: o.waves }, (_, w) => [foe(`f${w + 2}`)]) } : {}) }
}
/** Every Uma standing Attacks the first foe standing until the round ends or a wave falls. */
function round(s: BattleState): { state: BattleState; cues: BattleCue[] } {
  const cues: BattleCue[] = []
  let state = s
  while (state.round === s.round && state.outcome === 'active') {
    const actor = state.units.find((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(state, u.id) > 0)!
    const target = state.units.find((u) => u.side === 'enemy' && u.hp > 0)!
    const step: BattleStep = applyBattleAction(state, { kind: 'attack', actorId: actor.id, targetId: target.id })
    expect(step.error).toBeUndefined()
    cues.push(...step.cues)
    state = step.state
  }
  return { state, cues }
}
const unitOf = (s: BattleState, id: string) => s.units.find((u) => u.id === id)!
/** The state with one unit's HP set, before anyone acts. */
const withHp = (s: BattleState, id: string, hp: number): BattleState => ({ ...s, units: s.units.map((u) => (u.id === id ? { ...u, hp } : u)) })
/** A cue about an Uma or a foe: every kind but the result. */
type UnitCue = Exclude<BattleCue, { kind: 'result' }>
const onUnit = (c: BattleCue): c is UnitCue => c.kind !== 'result'
/** What a cue's `amount` says, if it has one. */
const amountOf = (c: BattleCue): number | undefined => ('amount' in c ? c.amount : undefined)
/** The HP these mends (`heal` cues of a label) gave her. */
const healed = (cues: readonly BattleCue[], label: string, id = 'a2') =>
  cues.filter((c) => c.kind === 'heal' && c.label === label && c.targetId === id).map(amountOf)
/** What her Flourish mended in these cues. */
const mends = (cues: readonly BattleCue[], id = 'a2') => healed(cues, 'Flourish', id)
/** Her Flourish's mends over `n` round ends, each round's list. */
function rounds(s: BattleState, n: number, id = 'a2'): { state: BattleState; each: (number | undefined)[][] } {
  const each: (number | undefined)[][] = []
  let state = s
  for (let r = 0; r < n; r++) {
    const next = round(state)
    each.push(mends(next.cues, id))
    state = next.state
  }
  return { state, each }
}

describe('the Flourish, engine v16, dark (H68)', () => {
  it('is 4% of her max HP a fight: Even pace 1% a round, Late reserve 2% from round 3', () => {
    expect([BATTLE_FLOURISH_SHARE, BATTLE_FLOURISH_RATE, BATTLE_FLOURISH_FROM]).toEqual([0.04, { 'even-pace': 0.01, 'late-reserve': 0.02 }, 3])
  })

  it('takes a Flourish only from v16, and only one of the three', () => {
    expect(() => createBattle(input(15, { 1: { flourish: 'even-pace' } }))).toThrow('Invalid battle ally')
    expect(() => createBattle(input(15, { 1: { flourish: 'clean-break' } }))).toThrow('Invalid battle ally')
    expect(() => createBattle(input(16, { 1: { flourish: 'second-wind' as RpgFlourish } }))).toThrow('Invalid battle ally')
    for (const flourish of ['clean-break', 'even-pace', 'late-reserve'] as const) expect(() => createBattle(input(16, { 1: { flourish } }))).not.toThrow()
  })

  it('Clean break: a Barrier of 4% of her max HP as the fight starts, its cue before the foes’ opening moves', () => {
    const step = createBattle(input(16, { 0: { flourish: 'clean-break' } }))
    expect(unitOf(step.state, 'a1').cover).toBe(40)
    expect(step.cues[0]).toEqual({ kind: 'cover', actorId: 'a1', targetId: 'a1', amount: 40, label: 'Flourish' })
    expect(step.cues.slice(1).every((c) => c.kind === 'intent')).toBe(true)
    // No budget for her: the Barrier is her 4%. Nobody else starts with anything.
    expect(step.state.units.filter((u) => u.cover || u.flourish !== undefined).map((u) => u.id)).toEqual(['a1'])
    expect(unitOf(step.state, 'a1').flourish).toBeUndefined()
    const none = createBattle(input(16, {}))
    expect(none.cues.every((c) => c.kind === 'intent')).toBe(true)
    expect(none.state.units.some((u) => 'cover' in u || 'flourish' in u)).toBe(false)
  })

  it('Clean break absorbs a foe’s hit first, then lapses at round 1’s end', () => {
    type Hit = Extract<BattleCue, { kind: 'hit' }>
    const hitOn = (cues: readonly BattleCue[]) => cues.find((c): c is Hit => c.kind === 'hit' && c.targetId === 'a1')
    const bare = round(createBattle(input(16, {}, { striker: true })).state)
    const shielded = round(createBattle(input(16, { 0: { flourish: 'clean-break' } }, { striker: true })).state)
    const taken = hitOn(bare.cues)!.amount
    expect(taken).toBeGreaterThan(40)
    expect(hitOn(shielded.cues)).toMatchObject({ amount: taken - 40, label: 'Barrier −40' })
    expect(unitOf(shielded.state, 'a1').hp - unitOf(bare.state, 'a1').hp).toBe(40)
    // Unhit, it still lapses at round 1's end, as every skill Barrier does.
    const quiet = round(createBattle(input(16, { 0: { flourish: 'clean-break' } })).state)
    expect(unitOf(quiet.state, 'a1').cover ?? 0).toBe(0)
    // Round 2's hit lands whole, as it does without her Flourish.
    expect(hitOn(round(shielded.state).cues)!.amount).toBe(hitOn(round(bare.state).cues)!.amount)
  })

  it('Even pace: 1% of her max HP at each round’s end while she is hurt, 4% at most, with no healing scale', () => {
    // A Cleric with a high M.ATK: her skills' mends would scale, her Flourish doesn't.
    const s = withHp(createBattle(input(16, { 1: { classId: 'cleric', matk: 3000, flourish: 'even-pace' } })).state, 'a2', 900)
    expect(unitOf(s, 'a2').flourish).toBe(40)
    const { state, each } = rounds(s, 6)
    expect(each).toEqual([[10], [10], [10], [10], [], []])
    expect([unitOf(state, 'a2').hp, unitOf(state, 'a2').flourish]).toEqual([940, 0])
  })

  it('Even pace mends nothing at full HP and keeps it, never past her max, and nothing once she has fallen', () => {
    const full = rounds(createBattle(input(16, { 1: { flourish: 'even-pace' } })).state, 2)
    expect([full.each, unitOf(full.state, 'a2').flourish]).toEqual([[[], []], 40])
    const near = rounds(withHp(full.state, 'a2', 995), 1)
    expect([near.each, unitOf(near.state, 'a2').hp, unitOf(near.state, 'a2').flourish]).toEqual([[[5]], 1000, 35])
    const fallen = rounds(withHp(createBattle(input(16, { 1: { flourish: 'even-pace' } })).state, 'a2', 0), 2)
    expect([fallen.each, unitOf(fallen.state, 'a2').hp, unitOf(fallen.state, 'a2').flourish]).toEqual([[[], []], 0, 40])
  })

  it('Late reserve: nothing at the end of rounds 1 and 2, then 2% a round, 4% at most', () => {
    const s = withHp(createBattle(input(16, { 1: { flourish: 'late-reserve' } })).state, 'a2', 900)
    const { state, each } = rounds(s, 6)
    expect(each).toEqual([[], [], [20], [20], [], []])
    expect([unitOf(state, 'a2').hp, unitOf(state, 'a2').flourish]).toEqual([940, 0])
  })

  it('mends after armor’s Regen and before her MP comes back', () => {
    const s = withHp(createBattle(input(16, { 1: { flourish: 'even-pace', regen: 5, mp: 100 } })).state, 'a2', 500)
    const end = round(s).cues.filter(onUnit).filter((c) => c.targetId === 'a2' && ['status', 'heal', 'mp'].includes(c.kind))
    expect(end.map((c) => [c.kind, amountOf(c)])).toEqual([['status', 5], ['heal', 10], ['mp', 8]])
  })

  it('gives at most 4% over a three-wave stage, and the breather between waves stays as it is', () => {
    let s = withHp(createBattle(input(16, { 1: { flourish: 'even-pace' } }, { waves: 2 })).state, 'a2', 300)
    const cues: BattleCue[] = []
    const play = (n: number) => { for (let r = 0; r < n; r++) { const next = round(s); cues.push(...next.cues); s = next.state } }
    /** The wave on the field falls to the next Uma's Attack. */
    const fell = (id: string) => { s = withHp(s, id, 1); play(1) }
    play(2)
    fell('f1')
    play(2)
    fell('f2')
    play(2)
    expect(s.wave).toBe(2)
    expect(mends(cues)).toEqual([10, 10, 10, 10])
    expect(healed(cues, 'Breather')).toEqual([100, 100])
    expect([unitOf(s, 'a2').hp, unitOf(s, 'a2').flourish]).toEqual([540, 0])
  })
})
