// The combat pass (engine v21, D282): healing, foe guards, the five statuses' paths, the pure damage classes and a
// Spellblade's bound familiar.
import { describe, expect, it } from 'vitest'
import { rpgFoe } from '../campaign/enemies'
import { RPG_ALL_NODES, RPG_HEALER_STATUS_WEAPONS, RPG_SECONDARY_WEAPONS, rpgNode, rpgNodeSkill, rpgStatusPath, type RpgSkillDef } from '../catalog'
import { rpgClassWeapons, rpgNodeLine } from '../node-identity'
import { RPG_WEAPONS, type RpgClass, type RpgTier1Class, type RpgWeapon } from '../rules'
import { BATTLE_FAMILIAR_LABEL, BATTLE_RESCUE_FLOOR } from './caps'
import { applyBattleAction, battleExtraHit, createBattle } from './engine'
import type { BattleAlly, BattleEnemy, BattleState } from './types'
import { balanceMember } from '../../world/balance-party'

const V21 = 21
const def = (id: string, engine = V21): RpgSkillDef => rpgNodeSkill(rpgNode(id)!, engine)
const foe = (id: string, role: 'striker' | 'guard' = 'striker', engine = V21): BattleEnemy =>
  rpgFoe({ id, castId: `cast-${id}`, element: 'fire', role, rank: 'regular', level: 40, shield: 3, weaknesses: { weapons: ['bow'], elements: ['ice'] } }, engine)
const PARTY: readonly RpgTier1Class[] = ['brawler', 'mage', 'spellblade', 'summoner', 'cleric']
const party = (level = 40, healer: RpgTier1Class = 'cleric', loadout?: string[]): BattleAlly[] => PARTY.map((c, i) => {
  const member = balanceMember(c === 'cleric' ? healer : c, i, level, { gear: true, stars: true, heroes: true, engine: V21 })
  return c === 'cleric' && loadout ? { ...member, loadout: loadout.map((id) => ({ tier: 1, id })) } : member
})
const fight = (allies: BattleAlly[], enemies = [foe('f1'), foe('f2')]): BattleState => createBattle({ version: V21, seed: 7, allies, enemies }).state
const hurt = (s: BattleState, id: string, share: number) => { const a = s.input.allies.find((x) => x.id === id)!; s.units.find((u) => u.id === id)!.hp = Math.round(a.stats.hp * share) }
const hpShare = (s: BattleState, id: string) => s.units.find((u) => u.id === id)!.hp / s.input.allies.find((x) => x.id === id)!.stats.hp
const line = (id: string) => rpgNodeLine(id)
const allNodes = (classId: RpgClass) => RPG_ALL_NODES.filter((n) => n.classId === classId && line(n.id) !== null)

describe('a mend rescues (H1, H2)', () => {
  const cast = (s: BattleState, healerId: string, id: string) => applyBattleAction(s, { kind: 'skill', actorId: healerId, targetId: 'f1', skill: { tier: 1, id } }).state

  it('lifts the most hurt to the floor, whatever the share would have healed', () => {
    const allies = party(40, 'cleric', ['cleric-tome-fire.1'])
    const s = fight(allies)
    hurt(s, allies[0]!.id, 0.1)
    expect(hpShare(cast(s, allies[4]!.id, 'cleric-tome-fire.1'), allies[0]!.id)).toBeGreaterThanOrEqual(BATTLE_RESCUE_FLOOR - 0.01)
  })

  it('keeps a larger mend when the share beats the floor', () => {
    const allies = party(40, 'cleric', ['cleric-tome-fire.4'])
    const s = fight(allies)
    hurt(s, allies[0]!.id, 0.5)
    expect(hpShare(cast(s, allies[4]!.id, 'cleric-tome-fire.4'), allies[0]!.id)).toBeGreaterThan(BATTLE_RESCUE_FLOOR + 0.3)
  })

  it('heals the most hurt at depth 5 at least as well as at depth 4, and the rest at ×0.4', () => {
    const at = (id: string) => {
      const allies = party(50, 'cleric', [id])
      const s = fight(allies)
      hurt(s, allies[0]!.id, 0.3)
      hurt(s, allies[1]!.id, 0.4)
      const after = cast(s, allies[4]!.id, id)
      return { hurt: hpShare(after, allies[0]!.id), other: hpShare(after, allies[1]!.id) }
    }
    const five = at('cleric-tome-fire.5'), four = at('cleric-tome-fire.4')
    expect(five.hurt).toBeGreaterThanOrEqual(four.hurt)
    expect(four.other).toBe(0.4)
    expect(five.other).toBeGreaterThan(0.4)
    expect(five.other).toBeLessThan(0.8)
  })

  it('leaves v20 fights as they were', () => {
    expect(def('cleric-tome-light.5', 20).status?.key).toBe('faith')
    expect(def('paladin-greatsword.1', 20).support15?.aegis).toBe(1)
  })
})

describe('both healers play one kit (H3)', () => {
  it('holds every node equal but its name', () => {
    for (const weapon of RPG_WEAPONS) for (const n of allNodes('cleric').filter((x) => x.weapon === weapon)) {
      expect(def(n.id.replace('cleric-', 'paladin-')), n.id).toEqual(def(n.id))
    }
  })

  it('moves each extra to its weapon', () => {
    expect(def('paladin-tome-light.1').support15?.regen).toBe(true)
    expect(def('paladin-tome-dark.1').support15?.drain).toBe(0.3)
    expect(def('cleric-tome-ice.1').support15).toMatchObject({ shield: 'all', shieldShare: 0.14 })
    expect(def('cleric-tome-light.3b').support15?.revive).toBe(true)
    expect(def('paladin-tome-light.3b').support15?.revive).toBe(true)
    expect(RPG_ALL_NODES.filter((n) => line(n.id) && (n.classId === 'paladin' || n.classId === 'cleric')).some((n) => def(n.id).support15?.aegis)).toBe(false)
  })

  it('gives line B a larger mend where no status can stack', () => {
    expect(def('cleric-axe.5b').support15!.share).toBeGreaterThan(def('cleric-axe.5').support15!.share)
    expect(def('cleric-greatsword.3b').support15!.share).toBe(def('cleric-greatsword.3').support15!.share)
    expect(def('cleric-greatsword.3b').status!.stacks).toBe(def('cleric-greatsword.3').status!.stacks + 1)
  })
})

describe('foes no longer guard (B1)', () => {
  it('leaves a guard her bash, on v21 only', () => {
    expect(foe('g', 'guard').moves.map((m) => m.kind)).toEqual(['damage'])
    expect(foe('g', 'guard', 20).moves.map((m) => m.kind)).toEqual(['damage', 'guard'])
  })
})

describe('where buffs and debuffs live (D1, D2, D3)', () => {
  const statusesOf = (d: RpgSkillDef) => [d.status?.key, d.also?.key, d.rider?.status].filter(Boolean)
  const damageTrees = (classId: RpgClass) => allNodes(classId).map((n) => [n, def(n.id)] as const)

  it('leaves the Brawler and the Sorcerer pure damage', () => {
    for (const classId of ['brawler', 'mage'] as const) for (const [n, d] of damageTrees(classId)) expect(statusesOf(d), n.id).toEqual([])
    for (const w of RPG_WEAPONS) expect(rpgStatusPath('brawler', w, V21)).toBeNull()
  })

  it('gives the Spellblades and the Summoners a path: line A of the secondary weapons, from depth 3', () => {
    for (const classId of ['spellblade', 'tomeblade', 'summoner', 'armsummoner'] as const) for (const [n, d] of damageTrees(classId)) {
      const carries = RPG_SECONDARY_WEAPONS.includes(n.weapon) && line(n.id) === 'A'
      expect(statusesOf(d).length > 0, n.id).toBe(carries)
    }
  })

  it('gives the healers Greatsword, Lance and Fire on every skill, and the path on top', () => {
    for (const classId of ['paladin', 'cleric'] as const) for (const [n, d] of damageTrees(classId)) {
      const every = RPG_HEALER_STATUS_WEAPONS.includes(n.weapon)
      const path = RPG_SECONDARY_WEAPONS.includes(n.weapon) && line(n.id) === 'A'
      expect(statusesOf(d).length > 0, n.id).toBe(every || path)
    }
  })

  it('names the same paths the skills carry', () => {
    const weapons = (classId: RpgClass) => rpgClassWeapons(classId).filter((w: RpgWeapon) => rpgStatusPath(classId, w, V21) !== null)
    expect(weapons('cleric').sort()).toEqual([...RPG_HEALER_STATUS_WEAPONS, ...RPG_SECONDARY_WEAPONS].sort())
    expect(weapons('summoner').sort()).toEqual([...RPG_SECONDARY_WEAPONS].sort())
    expect(rpgStatusPath('cleric', 'greatsword', V21)?.on).toBe('every')
    expect(rpgStatusPath('cleric', 'katana', V21)?.on).toBe('line-a')
    expect(rpgStatusPath('cleric', 'greatsword', 20)).toBeNull()
  })

  it('uses only the five statuses left (D3)', () => {
    const left = new Set(['armor-break', 'mind-break', 'enfeeble', 'brave', 'faith'])
    for (const n of RPG_ALL_NODES) if (line(n.id)) for (const key of statusesOf(def(n.id))) expect(left.has(key!), `${n.id} ${key}`).toBe(true)
  })

  it('lands Brave and Faith together on every ally', () => {
    const allies = party(40, 'cleric', ['cleric-tome-fire.3'])
    const after = applyBattleAction(fight(allies), { kind: 'skill', actorId: allies[4]!.id, targetId: 'f1', skill: { tier: 1, id: 'cleric-tome-fire.3' } }).state
    for (const u of after.units.filter((x) => x.side === 'ally')) expect(u.statuses.map((x) => x.kind).sort()).toEqual(['brave', 'faith'])
  })
})

describe('a Spellblade’s bound familiar (F1)', () => {
  it('lands her extra hit, and only that one, on v21', () => {
    const hits = battleExtraHit(def('spellblade-katana.1')).hits
    expect(hits.map((h) => h.familiar ?? false)).toEqual([false, false, true])
    expect(BATTLE_FAMILIAR_LABEL).toBe('Familiar')
  })
})
