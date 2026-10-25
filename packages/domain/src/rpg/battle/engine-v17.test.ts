// Engine v17 accepts R2's stat-and-Might projection and retires every legacy support input (H74, D209).
import { describe, expect, it } from 'vitest'
import { rpgFoe } from '../campaign/enemies'
import { projectRpgStats, rpgActiveSlots, rpgBaseMpRegen, rpgDefaultWeapons, type RpgClass, type RpgProfile } from '../rules'
import { autoAction } from './auto'
import { applyBattleAction, battleActionsLeft, createBattle } from './engine'
import type { BattleAlly, BattleEnemy, BattleInput } from './types'

type Version = 15 | 16 | 17
const LEVEL = 20

function member(id: string, classId: RpgClass, version: Version): BattleAlly {
  const weapons = rpgDefaultWeapons(classId, version)
  const profile: RpgProfile = {
    outfitId: id, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
    growthRates: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0 }, classId, weapons, tier: 1, level: LEVEL, exp: 0,
    tree: [], legacy: [], classRank: LEVEL,
  }
  const stats = projectRpgStats(profile, version)
  const loadout = [1, 2].flatMap((depth) => weapons.map((weapon) => ({ tier: 1, id: `${classId}-${weapon}.${depth}` })))
    .slice(0, rpgActiveSlots(LEVEL, version))
  return { id, classId, weapons, tier: 1, level: LEVEL, stats, tree: [], legacy: [], loadout, mp: stats.mp, classRank: LEVEL,
    might: Object.fromEntries(weapons.map((weapon) => [weapon.startsWith('tome-') ? weapon.slice(5) : weapon, 10])) }
}

const party = (version: Version): BattleAlly[] => (['brawler', 'mage', 'spellblade', 'summoner', 'paladin'] as const)
  .map((classId, index) => member(`a${index + 1}`, classId, version))
const FOE: BattleEnemy = (() => {
  const foe = rpgFoe({ id: 'f1', castId: 'cast-f1', element: 'ice', role: 'striker', rank: 'regular', level: LEVEL,
    shield: 5, weaknesses: { weapons: ['greatsword'], elements: ['fire'] } })
  return { ...foe, stats: { ...foe.stats, hp: 1_000_000 } }
})()
const input = (allies: BattleAlly[], version: Version): BattleInput => ({ version, seed: 1717, allies, enemies: [FOE] })

describe('battle engine v17: R2’s economy, dark', () => {
  it('plays two Auto rounds with one of every class but one healer', () => {
    let state = createBattle(input(party(17), 17)).state
    for (let n = 0; n < 40 && state.round < 3 && state.outcome === 'active'; n++) {
      const actor = state.units.find((unit) => unit.side === 'ally' && unit.hp > 0 && battleActionsLeft(state, unit.id) > 0)!
      const step = applyBattleAction(state, autoAction(state, actor.id))
      expect(step.error).toBeUndefined()
      state = step.state
    }
    expect(state.engineVersion).toBe(17)
    expect(state.round).toBe(3)
  })

  it.each([
    ['barrier', 1], ['veil', 1], ['regen', 1], ['mpRegen', 1], ['lifesteal', 1], ['mpSteal', 1],
    ['guard', 1], ['resist', 1], ['thorns', 1], ['mirror', 1], ['orbs', ['fire']],
  ] as const)('refuses %s from v17 while legacy support remains legal before it', (field, value) => {
    const changed = (version: Version) => party(version).map((ally, index) => index === 0 ? ({ ...ally, [field]: value }) as BattleAlly : ally)
    expect(() => createBattle(input(changed(17), 17))).toThrow('Invalid battle ally')
    if (field === 'orbs') {
      expect(() => createBattle(input(changed(15), 15))).toThrow('Invalid battle ally')
      expect(() => createBattle(input(changed(16), 16))).toThrow('Invalid battle ally')
    } else {
      expect(() => createBattle(input(changed(15), 15))).not.toThrow()
      expect(() => createBattle(input(changed(16), 16))).not.toThrow()
    }
  })

  it('runs an ordinary v16 input unchanged', () => {
    const state = createBattle(input(party(16), 16)).state
    const actor = state.units.find((unit) => unit.side === 'ally' && battleActionsLeft(state, unit.id) > 0)!
    const step = applyBattleAction(state, autoAction(state, actor.id))
    expect(step.error).toBeUndefined()
    expect(step.state.engineVersion).toBe(16)
  })

  it('keeps the fieldless base MP regen at round end', () => {
    const allies = party(17)
    const ally = { ...allies[0]!, mp: 1, classRank: 40 }
    allies[0] = ally
    let state = createBattle(input(allies, 17)).state
    for (let n = 0; n < 10 && state.round === 1; n++) {
      const actor = state.units.find((unit) => unit.side === 'ally' && unit.hp > 0 && battleActionsLeft(state, unit.id) > 0)!
      const step = applyBattleAction(state, autoAction(state, actor.id))
      expect(step.error).toBeUndefined()
      state = step.state
    }
    const unit = state.units.find((row) => row.id === ally.id)!
    expect(unit.mp).toBe(1 + rpgBaseMpRegen(ally.stats.mp, 40, 17))
    expect(state.input.allies[0]!.mpRegen).toBeUndefined()
  })
})
