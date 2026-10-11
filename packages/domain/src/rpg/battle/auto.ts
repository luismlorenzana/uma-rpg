// Deterministic ally auto-battle policy (H02): prefer a ready Limit Break, otherwise choose the strongest affordable
// skill or Attack for the living foes. This is intentionally a small policy, not another battle engine.
import { rpgNode, type RpgSkillDef } from '../catalog'
import { isRpgTome, rpgWeaponKind, type RpgNodeRef, type RpgWeapon } from '../rules'
import { applyBattleAction, battleActorSkill, battleHitIsWeak } from './engine'
import { BATTLE_LIMIT_MAX, battleLimitPlan, type BattleLimitChoice } from './limit'
import type { BattleAction, BattleAlly, BattleHalf, BattleState, BattleUnit } from './types'

/** How good a skill or Attack is against a foe now: power, weakness, every-foe reach and a small status premium. */
function score(state: BattleState, def: RpgSkillDef, foe: BattleUnit, foes: readonly BattleUnit[]): number {
  const enemy = state.input.enemies.find((candidate) => candidate.id === foe.id)!
  const weak = def.hits.some((hit) => hit.parts.some((part) => battleHitIsWeak(enemy, foe, part.kind)))
  const total = def.hits.reduce((sum, hit) => sum + hit.power, 0)
  return total * (weak ? 1.6 : 1) * (def.target === 'all' ? foes.length * 0.55 : 1) /
    (foe.shield > 0 ? 1 : 0.6) + (def.status ? 0.5 : 0)
}

const attackDef = (weapon: RpgWeapon): RpgSkillDef => ({
  target: 'one', hits: [{ power: 1, parts: [{ kind: rpgWeaponKind(weapon), share: 1 }] }], mp: 0, primary: rpgWeaponKind(weapon),
})

function firstLimitChoice(state: BattleState, actor: BattleAlly): BattleLimitChoice | null {
  const skills = actor.loadout.flatMap((ref) => battleActorSkill(state, actor.id, ref) ? [ref] : [])
  if (actor.classId === 'mage' || actor.classId === 'cleric') return {}
  if (actor.classId === 'brawler') return skills[0] ? { skill: skills[0] } : actor.weapons[0] ? { weapon: actor.weapons[0] } : null
  if (actor.classId === 'summoner') {
    const skill = skills.find((ref) => rpgNode(ref.id)?.skill?.summon)
    return skill ? { skill } : null
  }
  const arms = skills.find((ref) => !isRpgTome(rpgNode(ref.id)?.weapon ?? 'greatsword'))
  const tome = skills.find((ref) => isRpgTome(rpgNode(ref.id)?.weapon ?? 'greatsword'))
  return arms && tome ? { skills: [arms, tome] } : null
}

function limitAction(state: BattleState, actor: BattleAlly, unit: BattleUnit, foes: readonly BattleUnit[]): BattleAction | null {
  if (unit.limit < BATTLE_LIMIT_MAX) return null
  const choice = firstLimitChoice(state, actor)
  const plan = choice ? battleLimitPlan(actor, choice) : null
  if (!choice || !plan) return null
  const target = [...foes].sort((a, b) => {
    const value = (foe: BattleUnit) => plan.casts.reduce((sum, cast) => sum + score(state, cast.def, foe, foes) * cast.scale, 0)
    return value(b) - value(a) || a.id.localeCompare(b.id)
  })[0]
  return target ? { kind: 'limit', actorId: actor.id, targetId: target.id, ...choice } : null
}

interface Pick { half: BattleHalf; mp: number; foe: BattleUnit; score: number }
function bestHalf(state: BattleState, actor: BattleAlly, unit: BattleUnit, foes: readonly BattleUnit[], tome: boolean | null, budget: number): Pick | null {
  let pick: Pick | null = null
  const consider = (candidate: Pick) => {
    if (!pick || candidate.score > pick.score) pick = candidate
  }
  for (const foe of foes) {
    for (const weapon of actor.weapons.filter((candidate) => tome === null || isRpgTome(candidate) === tome)) {
      consider({ half: { weapon }, mp: 0, foe, score: score(state, attackDef(weapon), foe, foes) })
    }
    for (const ref of actor.loadout) {
      const skill = battleActorSkill(state, unit.id, ref)
      if (!skill || skill.mp > budget || (tome !== null && isRpgTome(skill.node.weapon) !== tome)) continue
      consider({ half: { skill: ref }, mp: skill.mp, foe, score: score(state, skill.def, foe, foes) })
    }
  }
  return pick
}

function bestAction(state: BattleState, actor: BattleAlly, unit: BattleUnit, foes: readonly BattleUnit[]): BattleAction | null {
  if (actor.classId !== 'spellblade') {
    const pick = bestHalf(state, actor, unit, foes, null, unit.mp)
    if (!pick) return null
    return pick.half.skill
      ? { kind: 'skill', actorId: unit.id, targetId: pick.foe.id, skill: pick.half.skill }
      : { kind: 'attack', actorId: unit.id, targetId: pick.foe.id, weapon: pick.half.weapon }
  }
  const arms = bestHalf(state, actor, unit, foes, false, unit.mp)
  const tome = arms ? bestHalf(state, actor, unit, foes, true, unit.mp - arms.mp) : null
  if (!arms || !tome) return null
  return arms.half.skill
    ? { kind: 'skill', actorId: unit.id, targetId: arms.foe.id, skill: arms.half.skill, pair: tome.half }
    : { kind: 'attack', actorId: unit.id, targetId: arms.foe.id, weapon: arms.half.weapon, pair: tome.half }
}

function firstAttack(actor: BattleAlly, targetId: string): BattleAction {
  const weapon = actor.weapons[0]
  const action: BattleAction = { kind: 'attack', actorId: actor.id, targetId, ...(weapon ? { weapon } : {}) }
  if (actor.classId !== 'spellblade' || !weapon) return action
  const pair = actor.weapons.find((candidate) => isRpgTome(candidate) !== isRpgTome(weapon))
  return pair ? { ...action, pair: { weapon: pair } } : action
}

const accepted = (state: BattleState, action: BattleAction): boolean => !applyBattleAction(state, action).error

/**
 * Picks one legal action for a ready living ally in an active battle. Callers own turn order and playback. If the best
 * choice is rejected by the engine, the policy falls back to an Attack with her first weapon, then Guard.
 */
export function autoAction(state: BattleState, actorId: string): BattleAction {
  const actor = state.input.allies.find((candidate) => candidate.id === actorId)
  const unit = state.units.find((candidate) => candidate.id === actorId)
  const foes = state.units.filter((candidate) => candidate.side === 'enemy' && candidate.hp > 0)
  if (!actor || !unit || foes.length === 0) return { kind: 'guard', actorId, targetId: actorId }

  const chosen = limitAction(state, actor, unit, foes) ?? bestAction(state, actor, unit, foes)
  if (chosen && accepted(state, chosen)) return chosen

  const attack = firstAttack(actor, foes[0]!.id)
  if (accepted(state, attack)) return attack

  const friend = state.units.find((candidate) => candidate.side === 'ally' && candidate.hp > 0 && candidate.id !== actorId)
  const guard: BattleAction = { kind: 'guard', actorId, targetId: friend?.id ?? actorId }
  return accepted(state, guard) ? guard : attack
}
