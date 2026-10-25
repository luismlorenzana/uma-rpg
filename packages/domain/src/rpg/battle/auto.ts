// Deterministic ally auto-battle policy (H02): prefer a ready Limit Break, otherwise choose the strongest affordable
// skill or Attack for the living foes. This is intentionally a small policy, not another battle engine. From v17 an
// Attack counts her Bell's follow-up (H75).
import { rpgNode, rpgNodeSkill, RPG_SKILL_POWER, type RpgSkillDef } from '../catalog'
import { isRpgTome, rpgHand, rpgWeaponKind, type RpgHand, type RpgNodeRef, type RpgWeapon } from '../rules'
import { rpgRework } from './caps'
import { applyBattleAction, battleActorSkill, battleAttackDef, battleFoe, battleHitIsWeak, battleSupportValue } from './engine'
import { BATTLE_LIMIT_MAX, battleLimitPlan, type BattleLimitChoice } from './limit'
import { BATTLE_WARD_FACTOR, battleChannel } from './skills'
import type { BattleAction, BattleAlly, BattleChannel, BattleHalf, BattleState, BattleUnit } from './types'

/** How good a skill or Attack is against a foe now: power, weakness, every-foe reach and a small status premium. From
 * v14 (D169) a foe's ward discounts it by the share of its power in the channel she wards, so a party prefers the other
 * channel and still acts when it has only the warded one. */
function score(state: BattleState, def: RpgSkillDef, foe: BattleUnit, foes: readonly BattleUnit[]): number {
  const enemy = battleFoe(state, foe.id)!
  const weak = def.hits.some((hit) => hit.parts.some((part) => battleHitIsWeak(enemy, foe, part.kind)))
  const total = def.hits.reduce((sum, hit) => sum + hit.power, 0)
  const raw = total * (weak ? 1.6 : 1) * (def.target === 'all' ? foes.length * 0.55 : 1) /
    (foe.shield > 0 ? 1 : 0.6) + (def.status ? 0.5 : 0)
  if (state.engineVersion < 14 || !enemy.ward) return raw
  return raw * (1 - wardedShare(def, enemy.ward) * (1 - BATTLE_WARD_FACTOR))
}
/** The share of a skill's hit power, part by part, in a channel. */
function wardedShare(def: RpgSkillDef, channel: BattleChannel): number {
  let all = 0, warded = 0
  for (const hit of def.hits) for (const part of hit.parts) {
    const power = hit.power * part.share
    all += power
    if (battleChannel(part.kind) === channel) warded += power
  }
  return all > 0 ? warded / all : 0
}
/** v12 (D141): what a skill's support is worth beside its hits. A support that restores or shields its whole share is
 * worth 1.5 casts of its depth's damage, so a Cleric or Summoner mends the hurt and shields the threatened. From v15 the
 * healers' `support15` (classes v2 §3.3), its Barrier on every Uma, Aegis and Regen valued by `battleSupportValue`. */
function supportScore(state: BattleState, actorId: string, def: RpgSkillDef, depth: number): number {
  const sup = state.engineVersion >= 15 ? def.support15 : def.support
  const value = battleSupportValue(state, actorId, sup)
  if (!value || !sup) return 0
  const full = sup.share > 0 ? sup.share : 0.2
  return (value / full) * 1.5 * RPG_SKILL_POWER[Math.max(0, Math.min(4, depth - 1))]!
}

/** The Limit Break to fire: a Hero's own (D106); from v10 a Learner's strongest Bond (D112); before, her class's first,
 * else her first Hero's. */
function firstLimitChoice(state: BattleState, actor: BattleAlly): BattleLimitChoice | null {
  if (actor.hero) return { hero: actor.hero }
  if (state.engineVersion >= 10) {
    const best = [...(actor.inherits ?? [])].sort((a, b) => b.bond - a.bond)[0]
    return best ? { hero: best.limit } : null
  }
  const own = classLimitChoice(state, actor)
  return own ?? (actor.inherits?.[0] ? { hero: actor.inherits[0].limit } : null)
}
function classLimitChoice(state: BattleState, actor: BattleAlly): BattleLimitChoice | null {
  const skills = actor.loadout.flatMap((ref) => battleActorSkill(state, actor.id, ref) ? [ref] : [])
  if (actor.classId === 'mage' || actor.classId === 'cleric') return {}
  if (actor.classId === 'brawler') return skills[0] ? { skill: skills[0] } : actor.weapons[0] ? { weapon: actor.weapons[0] } : null
  if (actor.classId === 'summoner') {
    const skill = skills.find((ref) => { const node = rpgNode(ref.id); return node && rpgNodeSkill(node, state.engineVersion).summon })
    return skill ? { skill } : null
  }
  const arms = skills.find((ref) => !isRpgTome(rpgNode(ref.id)?.weapon ?? 'greatsword'))
  const tome = skills.find((ref) => isRpgTome(rpgNode(ref.id)?.weapon ?? 'greatsword'))
  return arms && tome ? { skills: [arms, tome] } : null
}

function limitAction(state: BattleState, actor: BattleAlly, unit: BattleUnit, foes: readonly BattleUnit[]): BattleAction | null {
  if (unit.limit < BATTLE_LIMIT_MAX) return null
  const choice = firstLimitChoice(state, actor)
  const plan = choice ? battleLimitPlan(actor, choice, state.engineVersion) : null
  if (!choice || !plan) return null
  const target = [...foes].sort((a, b) => {
    const value = (foe: BattleUnit) => plan.casts.reduce((sum, cast) => sum + score(state, cast.def, foe, foes) * cast.scale, 0)
    return value(b) - value(a) || a.id.localeCompare(b.id)
  })[0]
  return target ? { kind: 'limit', actorId: actor.id, targetId: target.id, ...choice } : null
}

/**
 * v17 (WP21, H75): what her Bell's follow-up adds to an Attack with `weapon` on this foe, in that Attack's terms: the
 * follow-up scored as a one-hit skill of the Bell's kind at its power (weak when its kind is on the foe's lists), × its
 * weapon's hand over the Attack's. Nothing before v17 or without a Bell. Her Insignia needs no term: it multiplies every
 * hit of hers on a foe alike.
 */
function bellScore(state: BattleState, actor: BattleAlly, weapon: RpgWeapon, foe: BattleUnit, foes: readonly BattleUnit[]): number {
  const bell = actor.bell
  const own = bell && actor.weapons.find((candidate) => rpgWeaponKind(candidate) === bell.kind)
  if (!bell || !own || !rpgRework('economy', state.engineVersion)) return 0
  const hand = rpgHand(actor, state.engineVersion)
  const handOf = (w: RpgWeapon) => (isRpgTome(w) ? hand.tome : hand.arms)
  const def: RpgSkillDef = { target: 'one', hits: [{ power: bell.power / 1000, parts: [{ kind: bell.kind, share: 1 }] }], mp: 0, primary: bell.kind }
  return (score(state, def, foe, foes) * handOf(own)) / handOf(weapon)
}

interface Pick { half: BattleHalf; mp: number; foe: BattleUnit; score: number }
/** Her best half of one channel (`tome`), or of any. `bell`: an Attack here would ring her Bell (false once the act's
 * leading half is already an Attack: it rings once an act). */
function bestHalf(state: BattleState, actor: BattleAlly, unit: BattleUnit, foes: readonly BattleUnit[], tome: boolean | null, budget: number,
  bell = true): Pick | null {
  let pick: Pick | null = null
  const consider = (candidate: Pick) => {
    if (!pick || candidate.score > pick.score) pick = candidate
  }
  for (const foe of foes) {
    for (const weapon of actor.weapons.filter((candidate) => tome === null || isRpgTome(candidate) === tome)) {
      const follow = bell ? bellScore(state, actor, weapon, foe, foes) : 0
      consider({ half: { weapon }, mp: 0, foe, score: score(state, battleAttackDef(weapon), foe, foes) + follow })
    }
    for (const ref of actor.loadout) {
      const skill = battleActorSkill(state, unit.id, ref)
      if (!skill || skill.mp > budget || (tome !== null && isRpgTome(skill.node.weapon) !== tome)) continue
      consider({ half: { skill: ref }, mp: skill.mp, foe, score: score(state, skill.def, foe, foes) + supportScore(state, unit.id, skill.def, skill.node.depth) })
    }
  }
  return pick
}

/** A pair class's leading half: the stronger hand (a Spell Blade's Arms; from v15 a Summoner's Tome, D183). */
const tomeLeads = (hand: RpgHand): boolean => hand.pair && hand.tome > hand.arms

/** Her best act: one half, or for a pair class (her hand's `pair`) her best leading half, then her best other half
 * within the MP left, named lead first (D86; from v15 the Summoner too, D183). */
function bestAction(state: BattleState, actor: BattleAlly, unit: BattleUnit, foes: readonly BattleUnit[]): BattleAction | null {
  const hand = rpgHand(actor, state.engineVersion)
  if (!hand.pair) {
    const pick = bestHalf(state, actor, unit, foes, null, unit.mp)
    if (!pick) return null
    return pick.half.skill
      ? { kind: 'skill', actorId: unit.id, targetId: pick.foe.id, skill: pick.half.skill }
      : { kind: 'attack', actorId: unit.id, targetId: pick.foe.id, weapon: pick.half.weapon }
  }
  const tome = tomeLeads(hand)
  const lead = bestHalf(state, actor, unit, foes, tome, unit.mp)
  const other = lead ? bestHalf(state, actor, unit, foes, !tome, unit.mp - lead.mp, !!lead.half.skill) : null
  if (!lead || !other) return null
  return lead.half.skill
    ? { kind: 'skill', actorId: unit.id, targetId: lead.foe.id, skill: lead.half.skill, pair: other.half }
    : { kind: 'attack', actorId: unit.id, targetId: lead.foe.id, weapon: lead.half.weapon, pair: other.half }
}

/** An Attack with her first weapon; a pair class (from v15 the Summoner too, D183) pairs it with her first weapon of the
 * other kind, and the engine resolves the leading one first. */
function firstAttack(state: BattleState, actor: BattleAlly, targetId: string): BattleAction {
  const weapon = actor.weapons[0]
  const action: BattleAction = { kind: 'attack', actorId: actor.id, targetId, ...(weapon ? { weapon } : {}) }
  if (!rpgHand(actor, state.engineVersion).pair || !weapon) return action
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

  const attack = firstAttack(state, actor, foes[0]!.id)
  if (accepted(state, attack)) return attack

  const friend = state.units.find((candidate) => candidate.side === 'ally' && candidate.hp > 0 && candidate.id !== actorId)
  const guard: BattleAction = { kind: 'guard', actorId, targetId: friend?.id ?? actorId }
  return accepted(state, guard) ? guard : attack
}
