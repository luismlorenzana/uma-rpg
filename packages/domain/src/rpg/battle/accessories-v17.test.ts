// Engine v17's accessories (H75, D212; weapon-progression §2.4 WP31, §5.4–§5.5 WP20–WP23, §5.10 WP33): `flat` and
// `signature` in a hit's offense (step 1), the Insignia after the weak step (step 4), and the Bell's follow-up after an act
// with an Attack. Fixed seeds, v17 inputs built directly; no switch mock (the engine reads the fight's version).
import { describe, expect, it } from 'vitest'
import { rpgFoe } from '../campaign/enemies'
import { projectRpgStats, rpgActiveSlots, rpgDefaultWeapons, type RpgClass, type RpgDamageKind, type RpgProfile } from '../rules'
import { autoAction } from './auto'
import { BATTLE_LIMIT_MAX } from './caps'
import { applyBattleAction, battleDamage, createBattle, replayBattle } from './engine'
import { rpgHand } from '../rules'
import type { BattleAction, BattleAlly, BattleCue, BattleEnemy, BattleInput, BattleState, EnemyRank } from './types'

type Version = 16 | 17
const LEVEL = 20
const SEED = 1775

function member(id: string, classId: RpgClass, extra: Partial<BattleAlly> = {}): BattleAlly {
  const weapons = rpgDefaultWeapons(classId, 17)
  const profile: RpgProfile = {
    outfitId: id, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
    growthRates: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0 }, classId, weapons, tier: 1, level: LEVEL, exp: 0,
    tree: [], legacy: [], classRank: LEVEL,
  }
  const stats = projectRpgStats(profile, 17)
  const loadout = [1, 2].flatMap((depth) => weapons.map((weapon) => ({ tier: 1, id: `${classId}-${weapon}.${depth}` })))
    .slice(0, rpgActiveSlots(LEVEL, 17))
  return { id, classId, weapons, tier: 1, level: LEVEL, stats, tree: [], legacy: [], loadout, mp: stats.mp, classRank: LEVEL,
    might: Object.fromEntries(weapons.map((weapon) => [weapon.startsWith('tome-') ? weapon.slice(5) : weapon, 10])), ...extra }
}
/** A Brawler (a1), a Mage, a Spell Blade (a3), a Summoner and a healer (a5); `a1` takes `extra`, or each by id. */
function party(extra: Partial<Record<string, Partial<BattleAlly>>> = {}, healer: 'paladin' | 'cleric' = 'paladin'): BattleAlly[] {
  return (['brawler', 'mage', 'spellblade', 'summoner', healer] as const).map((classId, index) => member(`a${index + 1}`, classId, extra[`a${index + 1}`]))
}
function foe(id: string, rank: EnemyRank, weak: RpgDamageKind[], options: { hp?: number; shield?: number } = {}): BattleEnemy {
  const kinds = { weapons: weak.filter((k) => ['greatsword', 'axe', 'lance', 'bow', 'katana'].includes(k)), elements: weak.filter((k) => ['fire', 'ice', 'lightning', 'light', 'dark'].includes(k)) }
  const made = rpgFoe({ id, castId: `cast-${id}`, element: 'ice', role: 'striker', rank, level: LEVEL, shield: options.shield ?? 5,
    weaknesses: kinds as BattleEnemy['weaknesses'] })
  return { ...made, stats: { ...made.stats, hp: options.hp ?? 1_000_000 } }
}
const input = (allies: BattleAlly[], enemies: BattleEnemy[], version: Version = 17): BattleInput => ({ version, seed: SEED, allies, enemies })
const start = (allies: BattleAlly[], enemies: BattleEnemy[], version: Version = 17): BattleState => createBattle(input(allies, enemies, version)).state
const unitOf = (s: BattleState, id: string) => s.units.find((u) => u.id === id)!
type HitCue = Extract<BattleCue, { kind: 'hit' }>
const hitsBy = (cues: readonly BattleCue[], actorId: string) => cues.filter((c): c is HitCue => c.kind === 'hit' && c.actorId === actorId)
const bells = (cues: readonly BattleCue[]) => cues.filter((c): c is HitCue => c.kind === 'hit' && c.label === 'Bell')
/** The engine's hit, step by step (WP31): offense² ÷ (offense + defense) × power, then each factor in order. */
const hit = (offense: number, defense: number, ...factors: number[]) =>
  Math.max(1, Math.round(factors.reduce((amount, f) => amount * f, ((offense * offense) / (offense + defense)) * 1)))

describe('engine v17: flat offense and the signature (step 1)', () => {
  const f1 = foe('f1', 'regular', ['fire'])

  it('adds an Orb’s 34 to a Greatsword hit’s offense, and nothing to an Axe hit', () => {
    const plain = start(party(), [f1])
    const orb = start(party({ a1: { flat: { greatsword: 34 } } }), [f1])
    const a1 = member('a1', 'brawler')
    const def = f1.stats.pdef
    const greatsword = (s: BattleState) => battleDamage(s, unitOf(s, 'a1'), unitOf(s, 'f1'), 'physical', 1, 'greatsword').amount
    const axe = (s: BattleState) => battleDamage(s, unitOf(s, 'a1'), unitOf(s, 'f1'), 'physical', 1, 'axe').amount
    expect(greatsword(plain)).toBe(hit(a1.stats.atk + 10, def, 0.5))
    expect(greatsword(orb)).toBe(hit(a1.stats.atk + 10 + 34, def, 0.5))
    expect(greatsword(orb)).toBeGreaterThan(greatsword(plain))
    expect(axe(orb)).toBe(axe(plain))
  })

  it('gives a Brawler’s hit with signature 10 what ATK + 10 gives', () => {
    const a1 = member('a1', 'brawler')
    const signed = start(party({ a1: { signature: 10 } }), [f1])
    const stronger = start(party({ a1: { stats: { ...a1.stats, atk: a1.stats.atk + 10 } } }), [f1])
    for (const kind of ['greatsword', 'axe', 'lance'] as const) {
      const at = (s: BattleState) => battleDamage(s, unitOf(s, 'a1'), unitOf(s, 'f1'), 'physical', 1.3, kind).amount
      expect(at(signed)).toBe(at(stronger))
    }
    // On both channels: a Mage's M.ATK too.
    const a2 = member('a2', 'mage')
    const mage = (extra: Partial<BattleAlly>) => {
      const s = start(party({ a2: extra }), [f1])
      return battleDamage(s, unitOf(s, 'a2'), unitOf(s, 'f1'), 'magical', 1, 'ice').amount
    }
    expect(mage({ signature: 10 })).toBe(mage({ stats: { ...a2.stats, matk: a2.stats.matk + 10 } }))
  })

  it('never reaches a Cleric’s mend or a Paladin’s Barrier', () => {
    const support = (healer: 'paladin' | 'cleric', skill: string, signature?: number) => {
      const s = start(party({ a5: signature ? { signature } : {} }, healer), [foe('f1', 'regular', ['fire'])])
      const hurt = unitOf(s, 'a2')
      hurt.hp = Math.round(hurt.hp / 3)
      const step = applyBattleAction(s, { kind: 'skill', actorId: 'a5', targetId: 'f1', skill: { tier: 1, id: skill } })
      expect(step.error).toBeUndefined()
      return { support: step.cues.flatMap((c) => (c.kind === 'heal' || c.kind === 'cover' ? [[c.kind, c.targetId, c.amount]] : [])),
        dealt: hitsBy(step.cues, 'a5').reduce((n, c) => n + c.amount, 0) }
    }
    const mend = [support('cleric', 'cleric-tome-light.1'), support('cleric', 'cleric-tome-light.1', 26)]
    expect(mend[0]!.support.length).toBeGreaterThan(0)
    expect(mend[1]!.support).toEqual(mend[0]!.support)
    expect(mend[1]!.dealt).toBeGreaterThan(mend[0]!.dealt)
    const barrier = [support('paladin', 'paladin-greatsword.1'), support('paladin', 'paladin-greatsword.1', 26)]
    expect(barrier[0]!.support.some(([kind]) => kind === 'cover')).toBe(true)
    expect(barrier[1]!.support).toEqual(barrier[0]!.support)
    expect(barrier[1]!.dealt).toBeGreaterThan(barrier[0]!.dealt)
  })
})

describe('engine v17: the Insignia (step 4)', () => {
  const foes = [foe('f1', 'regular', ['greatsword']), foe('f2', 'sub-boss', ['greatsword']), foe('f3', 'boss', ['greatsword'])]
  const plain = start(party(), foes)
  const worn = start(party({ a1: { insignia: { value: 150 } } }), foes)
  const at = (s: BattleState, id: string) => battleDamage(s, unitOf(s, 'a1'), unitOf(s, id), 'physical', 1, 'greatsword')
  const offense = member('a1', 'brawler').stats.atk + 10

  it('multiplies a weak hit on a boss and on a sub-boss ×1.3 × 1.15, in that order', () => {
    for (const id of ['f2', 'f3']) {
      const def = foes.find((f) => f.id === id)!.stats.pdef
      expect(at(plain, id)).toEqual({ amount: hit(offense, def, 1.3, 0.5), weak: true, warded: false })
      expect(at(worn, id)).toEqual({ amount: hit(offense, def, 1.3, 1 + 150 / 1000, 0.5), weak: true, warded: false })
      expect(at(worn, id).amount).toBeGreaterThan(at(plain, id).amount)
    }
  })

  it('leaves a regular’s hit unchanged', () => {
    expect(at(worn, 'f1')).toEqual(at(plain, 'f1'))
  })
})

describe('engine v17: the Bell (WP21)', () => {
  const bell = { kind: 'greatsword' as const, power: 1000 }

  it('follows a Brawler’s Attack with one Greatsword hit on the same foe at 1.0 × her hand', () => {
    const s = start(party({ a1: { bell } }), [foe('f1', 'regular', ['fire'])])
    const step = applyBattleAction(s, { kind: 'attack', actorId: 'a1', targetId: 'f1', weapon: 'greatsword' })
    const hits = hitsBy(step.cues, 'a1')
    expect(rpgHand({ classId: 'brawler' }, 17).arms).toBe(1)
    expect(hits).toHaveLength(2)
    expect(hits[1]).toMatchObject({ targetId: 'f1', element: 'greatsword', channel: 'physical', label: 'Bell' })
    expect(hits[1]!.amount).toBe(hits[0]!.amount)
    expect(hits[1]!.amount).toBe(battleDamage(s, unitOf(s, 'a1'), unitOf(s, 'f1'), 'physical', 1, 'greatsword').amount)
    // Without the Bell, the same Attack is one hit.
    const none = applyBattleAction(start(party(), [foe('f1', 'regular', ['fire'])]), { kind: 'attack', actorId: 'a1', targetId: 'f1', weapon: 'greatsword' })
    expect(hitsBy(none.cues, 'a1')).toHaveLength(1)
    expect(bells(none.cues)).toHaveLength(0)
  })

  it('weak, removes a shield point and breaks a lock', () => {
    const s = start(party({ a1: { bell } }), [foe('f1', 'regular', ['greatsword'])])
    const f1 = unitOf(s, 'f1')
    f1.charging = { moveId: s.input.enemies[0]!.moves[0]!.id, locks: ['greatsword', 'fire'], total: 2, round: s.round, targetId: 'a2' }
    const step = applyBattleAction(s, { kind: 'attack', actorId: 'a1', targetId: 'f1', weapon: 'axe' })
    const at = step.cues.findIndex((c) => c.kind === 'hit' && c.label === 'Bell')
    expect(at).toBeGreaterThan(0)
    expect(step.cues[at]).toMatchObject({ weak: true, element: 'greatsword' })
    expect(step.cues.slice(at + 1)).toEqual(expect.arrayContaining([
      expect.objectContaining({ kind: 'lock', actorId: 'a1', targetId: 'f1', amount: 1, label: 'greatsword' }),
      expect.objectContaining({ kind: 'shield', actorId: 'a1', targetId: 'f1', amount: 4 }),
    ]))
    expect(unitOf(step.state, 'f1')).toMatchObject({ shield: 4, charging: expect.objectContaining({ locks: ['fire'] }) })
  })

  it('never rings on a skill act, a Guard or a Limit Break', () => {
    const f1 = foe('f1', 'regular', ['fire'])
    const skill = applyBattleAction(start(party({ a1: { bell } }), [f1]), { kind: 'skill', actorId: 'a1', targetId: 'f1', skill: { tier: 1, id: 'brawler-greatsword.1' } })
    expect(skill.error).toBeUndefined()
    expect(bells(skill.cues)).toHaveLength(0)
    const guard = applyBattleAction(start(party({ a1: { bell } }), [f1]), { kind: 'guard', actorId: 'a1', targetId: 'a2' })
    expect(guard.error).toBeUndefined()
    expect(guard.cues.filter((c) => c.kind === 'hit')).toHaveLength(0)
    const ready = { bell, limitStart: BATTLE_LIMIT_MAX, inherits: [{ limit: 'paladin-3' as const, bond: 10, from: 'hero-paladin-3' }] }
    const limit = applyBattleAction(start(party({ a1: ready }), [f1]), { kind: 'limit', actorId: 'a1', targetId: 'f1', hero: 'paladin-3' })
    expect(limit.error).toBeUndefined()
    expect(hitsBy(limit.cues, 'a1').length).toBeGreaterThan(0)
    expect(bells(limit.cues)).toHaveLength(0)
  })

  it('rings once, as one hit, after a Spell Blade’s pair with an Attack half, at her Lance’s hand', () => {
    const f1 = foe('f1', 'regular', ['fire'])
    const lance = { kind: 'lance' as const, power: 1000 }
    const s = start(party({ a3: { bell: lance } }), [f1])
    const pair = (action: BattleAction) => applyBattleAction(s, action)
    const attackAndSkill = pair({ kind: 'attack', actorId: 'a3', targetId: 'f1', weapon: 'katana', pair: { skill: { tier: 1, id: 'spellblade-tome-lightning.1' } } })
    const skillAndAttack = pair({ kind: 'skill', actorId: 'a3', targetId: 'f1', skill: { tier: 1, id: 'spellblade-tome-lightning.1' }, pair: { weapon: 'lance' } })
    const bothAttacks = pair({ kind: 'attack', actorId: 'a3', targetId: 'f1', weapon: 'lance', pair: { weapon: 'tome-lightning' } })
    const skills = pair({ kind: 'skill', actorId: 'a3', targetId: 'f1', skill: { tier: 1, id: 'spellblade-katana.1' }, pair: { skill: { tier: 1, id: 'spellblade-tome-lightning.1' } } })
    const expected = battleDamage(s, unitOf(s, 'a3'), unitOf(s, 'f1'), 'physical', rpgHand({ classId: 'spellblade' }, 17).arms, 'lance').amount
    for (const step of [attackAndSkill, skillAndAttack, bothAttacks]) {
      expect(step.error).toBeUndefined()
      expect(bells(step.cues)).toEqual([expect.objectContaining({ actorId: 'a3', targetId: 'f1', element: 'lance', amount: expected })])
      // The Bell is the act's last hit.
      expect(hitsBy(step.cues, 'a3').at(-1)!.label).toBe('Bell')
    }
    expect(skills.error).toBeUndefined()
    expect(bells(skills.cues)).toHaveLength(0)
  })

  it('strikes a living foe, drawn by the seed, when the Attack fells its own', () => {
    const foes = [foe('f1', 'regular', ['fire'], { hp: 1 }), foe('f2', 'regular', ['fire']), foe('f3', 'regular', ['fire'])]
    const allies = party({ a1: { bell } })
    const action: BattleAction = { kind: 'attack', actorId: 'a1', targetId: 'f1', weapon: 'axe' }
    const step = applyBattleAction(start(allies, foes), action)
    expect(step.cues).toContainEqual(expect.objectContaining({ kind: 'ko', targetId: 'f1' }))
    const [ring] = bells(step.cues)
    expect(ring).toBeDefined()
    expect(['f2', 'f3']).toContain(ring!.targetId)
    const again = replayBattle(input(allies, foes), [action])
    expect(bells(again.cues)).toEqual([ring])
    expect(again.hash).toBe(step.hash)
  })

  it('adds nothing to the Limit gauge', () => {
    const f1 = foe('f1', 'regular', ['fire'])
    const gauge = (extra: Partial<BattleAlly>) =>
      unitOf(applyBattleAction(start(party({ a1: extra }), [f1]), { kind: 'attack', actorId: 'a1', targetId: 'f1', weapon: 'greatsword' }).state, 'a1').limit
    expect(gauge({ bell })).toBe(gauge({}))
    expect(gauge({})).toBeGreaterThan(0)
  })

  it('makes Auto take a free Attack when it pays', () => {
    const f1 = foe('f1', 'regular', ['greatsword'])
    const pick = (extra: Partial<BattleAlly>) => {
      const s = start(party({ a1: extra }), [f1])
      return autoAction(s, 'a1').kind
    }
    expect(pick({})).toBe('skill')
    expect(pick({ bell: { kind: 'greatsword', power: 3000 } })).toBe('attack')
  })
})

describe('engine v17: the accessory fields’ validation', () => {
  const f1 = foe('f1', 'regular', ['fire'])
  const accepts = (extra: Partial<BattleAlly>, version: Version = 17) => () => createBattle(input(party({ a1: extra }), [f1], version))

  it.each([
    ['flat', { flat: { greatsword: 34 } }], ['bell', { bell: { kind: 'greatsword', power: 1000 } }],
    ['insignia', { insignia: { value: 150 } }], ['signature', { signature: 10 }],
  ] as const)('takes %s at v17 and refuses it at v16', (_, extra) => {
    expect(accepts(extra)).not.toThrow()
    expect(accepts(extra, 16)).toThrow('Invalid battle ally')
  })

  it('refuses a Bell of a kind she doesn’t slot, two forms in one slot, and out-of-range values', () => {
    expect(accepts({ bell: { kind: 'fire', power: 1000 } })).toThrow('Invalid battle ally')
    expect(accepts({ bell: { kind: 'greatsword', power: 1000 }, insignia: { value: 150 } })).toThrow('Invalid battle ally')
    expect(accepts({ bell: { kind: 'greatsword', power: 1000 }, flat: { axe: 14 } })).toThrow('Invalid battle ally')
    expect(accepts({ flat: { greatsword: 14 }, insignia: { value: 15 } })).toThrow('Invalid battle ally')
    expect(accepts({ flat: { greatsword: 1001 } })).toThrow('Invalid battle ally')
    expect(accepts({ flat: { shield: 1 } as never })).toThrow('Invalid battle ally')
    expect(accepts({ bell: { kind: 'greatsword', power: 0 } })).toThrow('Invalid battle ally')
    expect(accepts({ bell: { kind: 'greatsword', power: 3001 } })).toThrow('Invalid battle ally')
    expect(accepts({ bell: { kind: 'greatsword', power: 100, step: 50 } as never })).toThrow('Invalid battle ally')
    expect(accepts({ insignia: { value: 1001 } })).toThrow('Invalid battle ally')
    expect(accepts({ signature: 1001 })).toThrow('Invalid battle ally')
    expect(accepts({ signature: 1.5 })).toThrow('Invalid battle ally')
    // A Pendant's three kinds are one slot, and the signature rides beside any form.
    expect(accepts({ flat: { greatsword: 14, axe: 14, lance: 14 }, signature: 10 })).not.toThrow()
    expect(accepts({ bell: { kind: 'lance', power: 3000 }, signature: 1000 })).not.toThrow()
  })
})
