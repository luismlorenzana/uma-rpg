// Engine v15's healers, built dark (H56, classes-v2.md §3.3, §4, §6.3; C8): one Paladin or Cleric heals and shields from
// her ATK or M.ATK at doubled shares, Barriers reach 60%, the Summoner's old supports move to the healers, and a Thorn
// guard returns her share of the whole hit she intercepts. v14 fights keep today's rules (the v14 fixture's tests).
import { describe, expect, it } from 'vitest'
import { rpgFoe } from '../campaign/enemies'
import { regionChapter, worldContinent } from '../../world/world'
import { RPG_SUPPORT_ALL, RPG_SUPPORT_SHARE, RPG_SUPPORT_SHARE_V15 } from '../catalog'
import { learnRpgNode, projectRpgStats, rpgDefaultWeapons, type RpgClass, type RpgProfile, type RpgWeapon } from '../rules'
import { autoAction } from './auto'
import { applyBattleAction, battleActionsLeft, battleDamage, createBattle } from './engine'
import {
  BATTLE_COVER_CAP, BATTLE_COVER_CAP_V15, BATTLE_HEAL_OFFENSE_SCALE, BATTLE_HEAL_SCALE, BATTLE_REGEN_ROUNDS, BATTLE_REGEN_SHARE, BATTLE_REVIVE_SHARE,
} from './skills'
import type { BattleAction, BattleAlly, BattleCue, BattleEnemy, BattleState, BattleStep } from './types'

type V = 14 | 15
interface Build { level?: number; sides?: string[]; loadout?: string[]; weapons?: RpgWeapon[] }
/** An invented Uma of a class, built by the fight's generation: her spread, her stats, her learned and slotted skills. */
function member(id: string, classId: RpgClass, version: V, b: Build = {}): BattleAlly {
  const level = b.level ?? 20
  const weapons = b.weapons ?? rpgDefaultWeapons(classId, version)
  let p: RpgProfile = { outfitId: id, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
    growthRates: { speed: 0.05, stamina: 0.05, power: 0.05, guts: 0.05, wit: 0.05 }, classId, weapons, tier: 1, level, exp: 0,
    tree: [], legacy: [], classRank: level }
  p = (b.sides ?? []).reduce(learnRpgNode, p)
  const stats = projectRpgStats(p, version)
  const loadout = b.loadout ?? weapons.slice(0, 3).map((w) => `${classId}-${w}.1`)
  return { id, classId, weapons, tier: 1, level, stats, tree: p.tree, legacy: [], loadout: loadout.map((n) => ({ tier: 1, id: n })),
    mp: stats.mp, classRank: level }
}
/** A foe with a huge HP pool; `soft` makes her hits 1 HP, so the party's HP is ours to set. */
function foe(id: string, soft = true, extra: Partial<BattleEnemy> = {}): BattleEnemy {
  const f = rpgFoe({ id, castId: `cast-${id}`, element: 'ice', role: 'striker', rank: 'regular', level: 20, shield: 6,
    weaknesses: { weapons: ['greatsword'], elements: ['fire'] } })
  return { ...f, stats: { ...f.stats, hp: 100_000, ...(soft ? { atk: 1, matk: 1 } : {}) }, ...extra }
}
/** Four Brawlers and Mages around `healer` in seat 4 (any class). */
const party = (healer: BattleAlly, version: V, level = 20): BattleAlly[] =>
  [member('a1', 'brawler', version, { level }), member('a2', 'mage', version, { level }), member('a3', 'brawler', version, { level }), healer,
    member('a5', 'mage', version, { level })]
const fight = (allies: BattleAlly[], version: V, foes: BattleEnemy[] = [foe('f1')]): BattleState =>
  createBattle({ version, seed: 1556, allies, enemies: foes }).state
const unitOf = (s: BattleState, id: string) => s.units.find((u) => u.id === id)!
const maxHpOf = (s: BattleState, id: string) => s.input.allies.find((a) => a.id === id)!.stats.hp
/** Leaves an Uma at 1 HP. */
function hurt(s: BattleState, ...ids: string[]): BattleState {
  for (const id of ids) unitOf(s, id).hp = 1
  return s
}
function act(s: BattleState, action: BattleAction): BattleStep {
  const step = applyBattleAction(s, action)
  expect(step.error, JSON.stringify(action)).toBeUndefined()
  return step
}
const skill = (actorId: string, id: string, targetId = 'f1'): BattleAction => ({ kind: 'skill', actorId, targetId, skill: { tier: 1, id } })
/** Everyone left this round guards someone standing (never `a1`), so the round ends; returns the rest of the round's cues. */
function endRound(s: BattleState): { state: BattleState; cues: BattleCue[] } {
  const cues: BattleCue[] = []
  for (const u of s.units.filter((x) => x.side === 'ally')) {
    if (u.hp <= 0 || battleActionsLeft(s, u.id) <= 0) continue
    const ward = s.units.find((x) => x.side === 'ally' && x.hp > 0 && x.id !== u.id && x.id !== 'a1')!
    const step = act(s, { kind: 'guard', actorId: u.id, targetId: ward.id })
    cues.push(...step.cues)
    s = step.state
  }
  return { state: s, cues }
}
/** An Uma's cues of one kind (heals, Barriers, statuses), with the fields those carry. */
type Cue = { kind: BattleCue['kind']; actorId: string; targetId: string; amount?: number; label?: string }
const ofKind = (cues: readonly BattleCue[], kind: BattleCue['kind'], actorId: string): Cue[] =>
  cues.filter((c) => c.kind === kind && 'actorId' in c && c.actorId === actorId) as Cue[]
/** v15's scaling (§3.3): ×(1 + ATK or M.ATK ÷ 300). */
const scaling = (a: BattleAlly, stat: 'atk' | 'matk') => 1 + a.stats[stat] / BATTLE_HEAL_OFFENSE_SCALE

describe('engine v15: the healers scale from ATK or M.ATK at doubled shares (H56)', () => {
  it('raises a depth-1 Paladin Barrier and mends with a depth-1 Cleric spell at 28% × (1 + ATK or M.ATK ÷ 300), never her Heal', () => {
    const paladin = member('a4', 'paladin', 15, { loadout: ['paladin-lance.1'] })
    let s = fight(party(paladin, 15), 15)
    const cover = ofKind(act(s, skill('a4', 'paladin-lance.1')).cues, 'cover', 'a4')
    expect(cover).toHaveLength(1)
    const shielded = cover[0]!.targetId
    expect(cover[0]!.amount).toBe(Math.round(maxHpOf(s, shielded) * RPG_SUPPORT_SHARE_V15[0] * scaling(paladin, 'atk')))
    // Her Heal (Guts, `dexterity`) is never read from v15; it is 0 there anyway.
    expect(paladin.stats.dexterity).toBe(0)
    const healed = { ...paladin, stats: { ...paladin.stats, dexterity: 900 } }
    expect(ofKind(act(fight(party(healed, 15), 15), skill('a4', 'paladin-lance.1')).cues, 'cover', 'a4')).toEqual(cover)

    const cleric = member('a4', 'cleric', 15, { weapons: ['tome-fire', 'tome-light', 'tome-dark', 'katana', 'bow'], loadout: ['cleric-tome-fire.1'] })
    s = hurt(fight(party(cleric, 15), 15), 'a1')
    const mend = ofKind(act(s, skill('a4', 'cleric-tome-fire.1')).cues, 'heal', 'a4')
    expect(mend).toEqual([{ kind: 'heal', actorId: 'a4', targetId: 'a1', amount: Math.round(maxHpOf(s, 'a1') * RPG_SUPPORT_SHARE_V15[0] * scaling(cleric, 'matk')) }])
  })

  it('reaches every Uma at depth 5 at 44% × 0.4 × her scaling', () => {
    const paladin = member('a4', 'paladin', 15, { level: 40, loadout: ['paladin-lance.5'] })
    let s = fight(party(paladin, 15, 40), 15)
    const covers = ofKind(act(s, skill('a4', 'paladin-lance.5')).cues, 'cover', 'a4')
    expect(covers.map((c) => c.targetId)).toEqual(['a1', 'a2', 'a3', 'a4', 'a5'])
    for (const c of covers) expect(c.amount, c.targetId).toBe(Math.round(maxHpOf(s, c.targetId) * 0.44 * scaling(paladin, 'atk') * RPG_SUPPORT_ALL))

    const cleric = member('a4', 'cleric', 15, { level: 40, weapons: ['tome-fire', 'tome-light', 'tome-dark', 'katana', 'bow'], loadout: ['cleric-tome-fire.5'] })
    s = hurt(fight(party(cleric, 15, 40), 15), 'a1', 'a2', 'a3', 'a5')
    const mends = ofKind(act(s, skill('a4', 'cleric-tome-fire.5')).cues, 'heal', 'a4')
    expect(mends.map((c) => c.targetId)).toEqual(['a1', 'a2', 'a3', 'a5'])
    for (const c of mends) expect(c.amount, c.targetId).toBe(Math.round(maxHpOf(s, c.targetId) * 0.44 * scaling(cleric, 'matk') * RPG_SUPPORT_ALL))
  })

  it('stops a Barrier at 60% of max HP from v15, 40% in v14', () => {
    const strong = (a: BattleAlly): BattleAlly => ({ ...a, stats: { ...a.stats, atk: 5000, dexterity: 5000 } })
    const s15 = fight(party(strong(member('a4', 'paladin', 15, { loadout: ['paladin-lance.1'] })), 15), 15)
    const [c15] = ofKind(act(s15, skill('a4', 'paladin-lance.1')).cues, 'cover', 'a4')
    expect(c15!.amount).toBe(Math.round(maxHpOf(s15, c15!.targetId) * BATTLE_COVER_CAP_V15))
    const s14 = fight(party(strong(member('a4', 'cleric', 14, { loadout: ['cleric-greatsword.1'] })), 14), 14)
    const [c14] = ofKind(act(s14, skill('a4', 'cleric-greatsword.1')).cues, 'cover', 'a4')
    expect(c14!.amount).toBe(Math.round(maxHpOf(s14, c14!.targetId) * BATTLE_COVER_CAP))
  })

  it('keeps a v14 Cleric’s mend on her Heal at today’s share', () => {
    const cleric = member('a4', 'cleric', 14, { loadout: ['cleric-tome-fire.1'] })
    expect(cleric.stats.dexterity).toBeGreaterThan(0)
    const mendOf = (a: BattleAlly) => {
      const s = hurt(fight(party(a, 14), 14), 'a1')
      return ofKind(act(s, skill('a4', 'cleric-tome-fire.1')).cues, 'heal', 'a4')
    }
    const s = fight(party(cleric, 14), 14)
    expect(mendOf(cleric)).toEqual([{ kind: 'heal', actorId: 'a4', targetId: 'a1',
      amount: Math.round(maxHpOf(s, 'a1') * RPG_SUPPORT_SHARE[0] * (1 + cleric.stats.dexterity / BATTLE_HEAL_SCALE)) }])
    // Her ATK and M.ATK don't move it in v14.
    expect(mendOf({ ...cleric, stats: { ...cleric.stats, atk: 900, matk: 900 } })).toEqual(mendOf(cleric))
  })
})

describe('engine v15: the Summoner keeps no support (H56, §3.2)', () => {
  const LEVEL = 40
  const summoner = (version: V, weapons: RpgWeapon[], loadout: string[]) => member('a4', 'summoner', version, { level: LEVEL, weapons, loadout })
  /** Her act: a Tome summon paired with an Arms summon in v15, the summon alone in v14. */
  const summon = (version: V, tome: string, arms: string): BattleAction =>
    version === 15 ? { kind: 'skill', actorId: 'a4', targetId: 'f1', skill: { tier: 1, id: tome }, pair: { skill: { tier: 1, id: arms } } } : skill('a4', tome)
  /** Her support's traces in a round: mends, Barriers, Aegis, Enfeeble and revives by her, and Drain. */
  const supportCues = (cues: readonly BattleCue[]) => cues.filter((c) => 'actorId' in c && c.actorId === 'a4' &&
    (c.kind === 'heal' || c.kind === 'cover' || (c.kind === 'status' && (c.label === 'aegis' || c.label === 'enfeeble'))))

  it('mends, shields, drains, blesses, curses and revives nothing from her summons, at once or at the round’s end', () => {
    const pairs: [RpgWeapon[], string, string][] = [
      [['tome-light', 'tome-ice', 'tome-dark', 'greatsword', 'axe'], 'summoner-tome-light.4', 'summoner-greatsword.4'],
      [['tome-light', 'tome-ice', 'tome-dark', 'greatsword', 'axe'], 'summoner-tome-ice.4', 'summoner-axe.4'],
      [['tome-light', 'tome-ice', 'tome-dark', 'lance', 'bow'], 'summoner-tome-dark.4', 'summoner-lance.4'],
    ]
    for (const [weapons, tome, arms] of pairs) {
      let s = hurt(fight(party(summoner(15, weapons, [tome, arms]), 15, LEVEL), 15), 'a1', 'a2')
      unitOf(s, 'a3').hp = 0
      const first = act(s, summon(15, tome, arms))
      const rest = endRound(first.state)
      expect(supportCues([...first.cues, ...rest.cues]), tome).toEqual([])
      // The next round her summon lingers and strikes again: still no support.
      s = rest.state
      const again = act(s, summon(15, tome, arms))
      expect(supportCues([...again.cues, ...endRound(again.state).cues]), tome).toEqual([])
      expect(unitOf(again.state, 'a3').hp, tome).toBe(0)
    }
    // The same Light summon in v14 mends, so the check above would see it.
    const v14 = hurt(fight(party(summoner(14, ['tome-light', 'tome-ice', 'tome-dark', 'greatsword', 'lance'], ['summoner-tome-light.4']), 14, LEVEL), 14), 'a1')
    expect(supportCues(act(v14, summon(14, 'summoner-tome-light.4', '')).cues).length).toBeGreaterThan(0)
  })

  it('raises no Barrier with her Light capstone from v15', () => {
    const weapons: RpgWeapon[] = ['tome-light', 'tome-ice', 'tome-dark', 'greatsword', 'lance']
    const s15 = fight(party(summoner(15, weapons, ['summoner-tome-light.5', 'summoner-greatsword.1']), 15, LEVEL), 15)
    expect(ofKind(act(s15, summon(15, 'summoner-tome-light.5', 'summoner-greatsword.1')).cues, 'cover', 'a4')).toEqual([])
    const s14 = fight(party(summoner(14, weapons, ['summoner-tome-light.5']), 14, LEVEL), 14)
    expect(ofKind(act(s14, summon(14, 'summoner-tome-light.5', '')).cues, 'cover', 'a4')).toHaveLength(5)
  })
})

describe('engine v15: the Paladin’s half of the old support (H56, §4)', () => {
  it('mends the most hurt with a Blizzard spell and Barriers every Uma at 0.35 of its share', () => {
    const paladin = member('a4', 'paladin', 15, { loadout: ['paladin-tome-ice.1'] })
    const s = hurt(fight(party(paladin, 15), 15), 'a1')
    const cues = act(s, skill('a4', 'paladin-tome-ice.1')).cues
    const b = scaling(paladin, 'atk')
    expect(ofKind(cues, 'heal', 'a4')).toEqual([{ kind: 'heal', actorId: 'a4', targetId: 'a1', amount: Math.round(maxHpOf(s, 'a1') * 0.28 * b) }])
    const covers = ofKind(cues, 'cover', 'a4')
    expect(covers.map((c) => c.targetId)).toEqual(['a1', 'a2', 'a3', 'a4', 'a5'])
    for (const c of covers) expect(c.amount, c.targetId).toBe(Math.round(maxHpOf(s, c.targetId) * 0.098 * b * RPG_SUPPORT_ALL))
  })

  it('gives Aegis 1 with a Greatsword blow to the Uma it shields, and Aegis 2 to every Uma at depth 5', () => {
    const one = member('a4', 'paladin', 15, { loadout: ['paladin-greatsword.1'] })
    const step = act(fight(party(one, 15), 15), skill('a4', 'paladin-greatsword.1'))
    const [cover] = ofKind(step.cues, 'cover', 'a4')
    const aegis = (s: BattleState, id: string) => unitOf(s, id).statuses.find((x) => x.kind === 'aegis')?.stacks ?? 0
    expect(step.state.units.filter((u) => u.side === 'ally').map((u) => [u.id, aegis(step.state, u.id)]))
      .toEqual(['a1', 'a2', 'a3', 'a4', 'a5'].map((id) => [id, id === cover!.targetId ? 1 : 0]))
    const five = member('a4', 'paladin', 15, { level: 40, loadout: ['paladin-greatsword.5'] })
    const deep = act(fight(party(five, 15, 40), 15), skill('a4', 'paladin-greatsword.5'))
    for (const id of ['a1', 'a2', 'a3', 'a4', 'a5']) expect(aegis(deep.state, id), id).toBe(2)
    // A Cleric's Greatsword only shields.
    const cleric = member('a4', 'cleric', 15, { weapons: ['tome-light', 'tome-dark', 'tome-fire', 'greatsword', 'bow'], loadout: ['cleric-greatsword.1'] })
    const plain = act(fight(party(cleric, 15), 15), skill('a4', 'cleric-greatsword.1'))
    expect(ofKind(plain.cues, 'cover', 'a4')).toHaveLength(1)
    expect(plain.state.units.some((u) => aegis(plain.state, u.id) > 0)).toBe(false)
  })

  it('Enfeebles every foe with a depth-4 Axe blow; a Cleric’s depth-4 Axe, the one she hits', () => {
    const foes = [foe('f1'), foe('f2'), foe('f3')]
    const enfeebled = (s: BattleState) => s.units.filter((u) => u.side === 'enemy' && u.statuses.some((x) => x.kind === 'enfeeble')).map((u) => u.id)
    const paladin = member('a4', 'paladin', 15, { level: 40, loadout: ['paladin-axe.4'] })
    expect(enfeebled(act(fight(party(paladin, 15, 40), 15, foes), skill('a4', 'paladin-axe.4')).state)).toEqual(['f1', 'f2', 'f3'])
    const cleric = member('a4', 'cleric', 15, { level: 40, weapons: ['tome-light', 'tome-dark', 'tome-fire', 'axe', 'bow'], loadout: ['cleric-axe.4'] })
    expect(enfeebled(act(fight(party(cleric, 15, 40), 15, foes), skill('a4', 'cleric-axe.4')).state)).toEqual(['f1'])
  })

  it('raises the first fallen once a fight with Valkyrie’s Oath, at 25% × her scaling', () => {
    const paladin = member('a4', 'paladin', 15, { level: 40, sides: ['paladin-lance.4b'], loadout: ['paladin-lance.4b'] })
    let s = fight(party(paladin, 15, 40), 15)
    unitOf(s, 'a2').hp = 0
    const first = act(s, skill('a4', 'paladin-lance.4b'))
    const top = maxHpOf(s, 'a2')
    expect(ofKind(first.cues, 'heal', 'a4').filter((c) => c.label === 'Revived'))
      .toEqual([{ kind: 'heal', actorId: 'a4', targetId: 'a2', amount: Math.round(top * BATTLE_REVIVE_SHARE * scaling(paladin, 'atk')), label: 'Revived' }])
    // She falls again: no second revive for her.
    s = endRound(first.state).state
    unitOf(s, 'a2').hp = 0
    const again = act(s, skill('a4', 'paladin-lance.4b'))
    expect(again.cues.some((c) => c.kind === 'heal' && c.label === 'Revived')).toBe(false)
    expect(unitOf(again.state, 'a2').hp).toBe(0)
  })
})

describe('engine v15: the Cleric’s half of the old support (H56, §4)', () => {
  const cleric = member('a4', 'cleric', 15, { loadout: ['cleric-tome-light.1', 'cleric-tome-dark.1'] })
  const regenOf = (cues: readonly BattleCue[]) => ofKind(cues, 'heal', 'a4').filter((c) => c.label === 'Regen')
  /** A round: her action (or a Katana Attack), then everyone else guards; the round's cues. */
  function round(s: BattleState, action: BattleAction = { kind: 'attack', actorId: 'a4', targetId: 'f1', weapon: 'katana' }) {
    const mine = act(s, action)
    const rest = endRound(mine.state)
    return { state: rest.state, mine: mine.cues, rest: rest.cues }
  }

  it('leaves Regen with a Light spell: two round-end heals at 0.3 of its mend on the most hurt, then none', () => {
    const s = hurt(fight(party(cleric, 15), 15), 'a1')
    const share = RPG_SUPPORT_SHARE_V15[0] * 1 * BATTLE_REGEN_SHARE
    const expected = (state: BattleState) => Math.round(maxHpOf(state, 'a1') * share * scaling(cleric, 'matk'))
    const r1 = round(s, skill('a4', 'cleric-tome-light.1'))
    expect(regenOf(r1.mine)).toEqual([])
    expect(regenOf(r1.rest)).toEqual([{ kind: 'heal', actorId: 'a4', targetId: 'a1', amount: expected(s), label: 'Regen' }])
    const r2 = round(r1.state)
    expect(regenOf(r2.rest)).toEqual([{ kind: 'heal', actorId: 'a4', targetId: 'a1', amount: expected(s), label: 'Regen' }])
    const r3 = round(r2.state)
    expect(regenOf(r3.rest)).toEqual([])
    expect(r3.state.regens).toEqual([])
    expect(BATTLE_REGEN_ROUNDS).toBe(2)
  })

  it('replaces her Regen with her next Light spell, and ends it when she falls', () => {
    const s = hurt(fight(party(cleric, 15), 15), 'a1')
    const r1 = round(s, skill('a4', 'cleric-tome-light.1'))
    expect(r1.state.regens).toEqual([{ allyId: 'a4', mend: 'hurt', share: 0.28 * 1 * BATTLE_REGEN_SHARE, rounds: 1 }])
    const cast = act(r1.state, skill('a4', 'cleric-tome-light.1'))
    expect(cast.state.regens).toEqual([{ allyId: 'a4', mend: 'hurt', share: 0.28 * 1 * BATTLE_REGEN_SHARE, rounds: 2 }])
    // Round 2's end and round 3's: without the second spell, only round 2's.
    const second = endRound(cast.state)
    expect(regenOf(second.cues)).toHaveLength(1)
    let state = second.state
    for (const n of [1, 0]) {
      const r = round(state)
      expect(regenOf(r.rest).length, `then ${n}`).toBe(n)
      state = r.state
    }
    // She casts it, then falls before the round ends: no Regen, and it is gone.
    const fell = act(hurt(fight(party(cleric, 15), 15), 'a1'), skill('a4', 'cleric-tome-light.1'))
    unitOf(fell.state, 'a4').hp = 0
    const after = endRound(fell.state)
    expect(regenOf(after.cues)).toEqual([])
    expect(after.state.regens).toEqual([])
  })

  it('drains 30% of a Dark spell’s damage to the most hurt', () => {
    const s = hurt(fight(party(cleric, 15), 15), 'a1')
    const cues = act(s, skill('a4', 'cleric-tome-dark.1')).cues
    const dealt = cues.reduce((n, c) => n + (c.kind === 'hit' && c.actorId === 'a4' && c.targetId === 'f1' ? c.amount : 0), 0)
    expect(dealt).toBeGreaterThan(0)
    expect(ofKind(cues, 'heal', 'a4').filter((c) => c.label === 'Drain')).toEqual([{ kind: 'heal', actorId: 'a4', targetId: 'a1', amount: Math.round(dealt * 0.3), label: 'Drain' }])
    // The Paladin's Dark spell only mends.
    const paladin = member('a4', 'paladin', 15, { weapons: ['greatsword', 'axe', 'lance', 'tome-dark', 'tome-fire'], loadout: ['paladin-tome-dark.1'] })
    const plain = act(hurt(fight(party(paladin, 15), 15), 'a1'), skill('a4', 'paladin-tome-dark.1')).cues
    expect(ofKind(plain, 'heal', 'a4').map((c) => c.label)).toEqual([undefined])
  })
})

describe('engine v15: a Thorn guard returns the whole hit she intercepts (H56, §6.3)', () => {
  it('returns her share of the whole hit from v15, and of the half she took in v14', () => {
    const smash = { id: 'smash', kind: 'damage' as const, channel: 'physical' as const, element: null, power: 100, target: 'front' as const, label: 'Smash' }
    const back = (version: V) => {
      const allies = ['a1', 'a2', 'a3', 'a4', 'a5'].map((id) => ({ ...member(id, 'brawler', version), ...(id === 'a2' ? { thorns: 300 } : {}) }))
      let s = createBattle({ version, seed: 1557, allies, enemies: [foe('f1', false, { moves: [smash], phaseTwo: undefined })] }).state
      const guards: [string, string][] = [['a1', 'a3'], ['a2', 'a1'], ['a3', 'a4'], ['a4', 'a3']]
      for (const [actorId, targetId] of guards) s = act(s, { kind: 'guard', actorId, targetId }).state
      const whole = battleDamage(s, unitOf(s, 'f1'), unitOf(s, 'a2'), 'physical', 1, null, { area: false }).amount
      const cues = act(s, { kind: 'guard', actorId: 'a5', targetId: 'a3' }).cues
      const intercepted = cues.find((c) => c.kind === 'hit' && c.label === 'Intercepted')!
      expect(intercepted).toMatchObject({ actorId: 'f1', targetId: 'a2', amount: Math.max(1, Math.round(whole * 0.5)) })
      const thorns = cues.find((c) => c.kind === 'hit' && c.label === 'Thorns')!
      return { whole, taken: (intercepted as { amount: number }).amount, back: (thorns as { amount: number }).amount }
    }
    const v15 = back(15), v14 = back(14)
    expect(v15.back).toBe(Math.floor(v15.whole * 300 / 1000))
    expect(v14.back).toBe(Math.floor(v14.taken * 300 / 1000))
    expect(v15.back).toBeGreaterThan(v14.back)
  })
})

describe('engine v15: Auto with one healer (H56)', () => {
  /** A Tier 1 region boss stage, a party of Brawlers and Mages with one healer, played on Auto. */
  function play(healer: RpgClass): { healerCues: BattleCue[]; hurtMended: number } {
    const CAST = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))
    const node = regionChapter(worldContinent({ name: 'Sim', order: 3 }).regions[0]!, CAST).nodes.filter((n) => n.kind !== 'camp').at(-1)!
    const level = Math.min(50, node.level)
    const allies = ['brawler', 'mage', 'brawler', healer, 'mage'].map((c, i) => {
      const classId = c as RpgClass
      const weapons = rpgDefaultWeapons(classId, 15)
      const depth = Math.max(1, [1, 10, 20, 30, 40].filter((g) => level >= g).length)
      return member(`a${i + 1}`, classId, 15, { level, weapons, loadout: weapons.map((w) => `${classId}-${w}.${depth}`).slice(0, 5) })
    })
    let s = createBattle({ version: 15, seed: 1558, allies, enemies: node.enemies, ...(node.waves?.length ? { waves: node.waves } : {}) }).state
    const healerCues: BattleCue[] = []
    let hurtMended = 0
    for (let n = 0; n < 400 && s.outcome === 'active'; n++) {
      const actor = s.units.find((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(s, u.id) > 0)
      if (!actor) break
      const step = act(s, autoAction(s, actor.id))
      for (const c of step.cues) {
        if (!('actorId' in c) || c.actorId !== 'a4' || (c.kind !== 'heal' && c.kind !== 'cover')) continue
        healerCues.push(c)
        const before = s.units.find((u) => u.id === c.targetId)!
        if (c.kind === 'heal' && before.hp < maxHpOf(s, c.targetId)) hurtMended++
      }
      s = step.state
    }
    return { healerCues, hurtMended }
  }

  it('keeps hurt Umas mended or shielded with a Paladin, then with a Cleric', () => {
    const paladin = play('paladin')
    expect(paladin.healerCues.filter((c) => c.kind === 'cover').length).toBeGreaterThan(2)
    const cleric = play('cleric')
    expect(cleric.hurtMended).toBeGreaterThan(2)
  })
})
