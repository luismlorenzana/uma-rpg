// Read-only projections of the engine for the fight screen: legal choices, previews and cue text. Ported from uma-racer,
// reworked for D86: every class acts once, picks which of her five weapons to attack with, and a Spell Blade's act pairs
// an Arms half with a Tome half.
import { BATTLE_LIMIT_MAX, BATTLE_LIMIT_NAMES, applyBattleAction, battleActionsLeft, battleActorSkill, battleBroken,
  battleLimitPlan, battleSkillFor, isRpgElement, isRpgTome, isRpgWeaponKind, rpgWeaponKind,
  type BattleAction, type BattleAlly, type BattleCue, type BattleEnemy, type BattleHalf, type BattleLimitChoice, type BattleSkill, type BattleState,
  type RpgDamageKind, type RpgNodeRef, type RpgWeapon } from '@rpg/domain'

import { WEAPON_LABEL } from './labels'

export type BattleMode = { kind: 'attack'; weapon?: RpgWeapon; pair?: BattleHalf } | { kind: 'guard' } | { kind: 'skill'; ref: RpgNodeRef; pair?: BattleHalf }
  | ({ kind: 'limit'; name: string } & BattleLimitChoice)

export interface SkillChoice { ref: RpgNodeRef; skill: BattleSkill; affordable: boolean }
export function skillChoices(state: BattleState, actorId: string): SkillChoice[] {
  const ally = state.input.allies.find((a) => a.id === actorId)
  const unit = state.units.find((u) => u.id === actorId)
  if (!ally || !unit) return []
  return ally.loadout.flatMap((ref) => {
    const skill = battleActorSkill(state, actorId, ref)
    return skill ? [{ ref, skill, affordable: unit.mp >= skill.mp }] : []
  })
}

/** A Spell Blade's act: an Arms half and a Tome half, each a skill or an Attack (D86). */
export interface Pair { arms: BattleHalf; tome: BattleHalf }
export const defaultPair = (ally: Pick<BattleAlly, 'weapons'>): Pair => ({
  arms: { weapon: ally.weapons.find((w) => !isRpgTome(w)) }, tome: { weapon: ally.weapons.find(isRpgTome) },
})
/** The pair a mode holds, so a pick can change one half. */
export function pairOf(mode: BattleMode, ally: Pick<BattleAlly, 'weapons'>): Pair {
  const base = defaultPair(ally)
  if (mode.kind === 'attack') return { arms: { weapon: mode.weapon ?? base.arms.weapon }, tome: mode.pair ?? base.tome }
  if (mode.kind === 'skill') return { arms: { skill: mode.ref }, tome: mode.pair ?? base.tome }
  return base
}
export const pairMode = (pair: Pair): BattleMode =>
  pair.arms.skill ? { kind: 'skill', ref: pair.arms.skill, pair: pair.tome } : { kind: 'attack', weapon: pair.arms.weapon, pair: pair.tome }
/** Whether a half is a Tome's: its weapon, or its skill's weapon. */
export const halfIsTome = (half: BattleHalf, choices: readonly SkillChoice[]): boolean =>
  half.weapon ? isRpgTome(half.weapon) : isRpgTome(choices.find((c) => c.ref.id === half.skill?.id)?.skill.node.weapon ?? 'greatsword')

export function actionFor(mode: BattleMode, actorId: string, targetId: string): BattleAction {
  if (mode.kind === 'limit') return { kind: 'limit', actorId, targetId, ...(mode.skill ? { skill: mode.skill } : {}),
    ...(mode.skills ? { skills: mode.skills } : {}), ...(mode.weapon ? { weapon: mode.weapon } : {}) }
  if (mode.kind === 'skill') return { kind: 'skill', actorId, targetId, skill: mode.ref, ...(mode.pair ? { pair: mode.pair } : {}) }
  if (mode.kind === 'attack') return { kind: 'attack', actorId, targetId, ...(mode.weapon ? { weapon: mode.weapon } : {}), ...(mode.pair ? { pair: mode.pair } : {}) }
  return { kind: 'guard', actorId, targetId }
}

export interface TargetPreview { amount: number; weak: boolean; chips: number; breaks: boolean; error?: string }
/** Runs the action on a copy and totals this action's hits on the target. */
export function previewTarget(state: BattleState, actorId: string, mode: BattleMode, targetId: string): TargetPreview | null {
  const step = applyBattleAction(state, actionFor(mode, actorId, targetId))
  if (step.error) return { amount: 0, weak: false, chips: 0, breaks: false, error: step.error }
  const own = step.cues.filter((c) => c.kind !== 'intent' && 'actorId' in c && c.actorId === actorId && 'targetId' in c && c.targetId === targetId)
  const hits = own.flatMap((c) => c.kind === 'hit' ? [c] : [])
  if (!hits.length) return mode.kind === 'guard' ? { amount: 0, weak: false, chips: 0, breaks: false } : null
  return { amount: hits.reduce((sum, c) => sum + c.amount, 0), weak: hits.some((c) => c.weak),
    chips: own.filter((c) => c.kind === 'shield').length, breaks: own.some((c) => c.kind === 'break') }
}

export const isBroken = battleBroken

/** Her bar is full (D311). */
export const limitReady = (state: BattleState, id: string): boolean => (state.units.find((u) => u.id === id)?.limit ?? 0) >= BATTLE_LIMIT_MAX
/** A Limit Break is her turn, so she can use it only before she acts this round. */
export const limitNow = (state: BattleState, id: string): boolean => {
  const unit = state.units.find((u) => u.id === id)
  return !!unit && unit.hp > 0 && limitReady(state, id) && battleActionsLeft(state, id) === 1
}
export interface LimitOption { key: string; name: string; detail: string; choice: BattleLimitChoice }
/** The Limit Break menu: her class's fixed one, or one per equipped skill. A Spell Blade picks an Arms and a Tome skill (`pick: 2`). */
export function limitOptions(state: BattleState, actorId: string): { pick: 1 | 2; options: LimitOption[] } {
  const ally = state.input.allies.find((a) => a.id === actorId)
  if (!ally) return { pick: 1, options: [] }
  const skills = ally.loadout.flatMap((ref) => { const skill = battleActorSkill(state, actorId, ref); return skill ? [skill] : [] })
  const key = (ref: RpgNodeRef) => `${ref.tier}:${ref.id}`
  if (ally.classId === 'mage') return { pick: 1, options: [{ key: 'nova', name: BATTLE_LIMIT_NAMES.mage, choice: {},
    detail: 'One foe: a hit of each element · about two and a half of her casts' }] }
  if (ally.classId === 'cleric') return { pick: 1, options: [{ key: 'patrons', name: BATTLE_LIMIT_NAMES.cleric, choice: {},
    detail: 'One foe: a hit with each weapon, every one’s status at three stacks' }] }
  if (ally.classId === 'summoner') return { pick: 1, options: skills.filter((s) => s.def.summon).map((s) => ({ key: key(s.ref), name: `${BATTLE_LIMIT_NAMES.grand} · ${s.label}`,
    choice: { skill: s.ref }, detail: 'Twice as strong, and it lingers twice as strong' })) }
  if (ally.classId === 'spellblade') return { pick: 2, options: skills.map((s) => ({ key: key(s.ref), name: s.label, choice: { skills: [s.ref] },
    detail: isRpgTome(s.node.weapon) ? 'The Tome half, at full strength' : 'The Arms half, at full strength' })) }
  return { pick: 1, options: skills.length
    ? skills.map((s) => ({ key: key(s.ref), name: s.label, choice: { skill: s.ref }, detail: 'Cast twice in a row' }))
    : ally.weapons.map((w) => ({ key: w, name: `${BATTLE_LIMIT_NAMES.twin} · ${WEAPON_LABEL[w]}`, choice: { weapon: w }, detail: 'Two full Attacks in a row' })) }
}
/** The mode a menu pick (or a Spell Blade's two picks) sets, or null if the engine would refuse it. */
export function limitMode(state: BattleState, actorId: string, choice: BattleLimitChoice): BattleMode | null {
  const ally = state.input.allies.find((a) => a.id === actorId)
  const plan = ally ? battleLimitPlan(ally, choice) : null
  return plan ? { kind: 'limit', name: plan.name, ...choice } : null
}

/** Kinds an Uma can land: her weapons' Attacks (and her Orb) and every hit of her equipped skills. */
export function allyKinds(ally: Pick<BattleAlly, 'classId' | 'weapons' | 'tier' | 'level' | 'tree' | 'legacy' | 'loadout' | 'maxDepth' | 'orb'>): { free: RpgDamageKind[]; skills: RpgDamageKind[] } {
  const free = [...new Set([...ally.weapons.map(rpgWeaponKind), ...(ally.orb ? [ally.orb] : [])])]
  const skills = new Set<RpgDamageKind>(ally.orb ? [ally.orb] : [])
  for (const ref of ally.loadout) {
    const skill = battleSkillFor(ally, ref)
    if (!skill) continue
    for (const hit of [...skill.def.hits, ...skill.def.focus ?? [], ...(skill.def.splash ? [skill.def.splash] : []), ...(skill.def.other ?? [])]) {
      for (const part of hit.parts) skills.add(part.kind)
    }
  }
  return { free, skills: [...skills] }
}

/** Whether this Uma can chip the foe: by a weapon kind or by an element, from an Attack, a skill or her Orb. */
export function canChip(state: BattleState, allyId: string, enemy: BattleEnemy): { weapon: boolean; element: boolean } {
  const ally = state.input.allies.find((a) => a.id === allyId)
  if (!ally) return { weapon: false, element: false }
  const { free, skills } = allyKinds(ally)
  const all = [...free, ...skills]
  return { weapon: all.some((k) => isRpgWeaponKind(k) && enemy.weaknesses.weapons.includes(k)),
    element: all.some((k) => isRpgElement(k) && enemy.weaknesses.elements.includes(k)) }
}

export function describeCue(cue: BattleCue, name: (id: string) => string): string {
  switch (cue.kind) {
    case 'hit': return cue.label === 'Burn' ? `${name(cue.targetId)} burns for ${cue.amount}`
      : `${name(cue.actorId)} → ${name(cue.targetId)}: ${cue.amount}${cue.weak ? ' · WEAK' : ''}${cue.label === 'Intercepted' ? ' · guarded' : cue.label?.startsWith('Barrier') ? ` · ${cue.label}` : ''}`
    case 'shield': return `${name(cue.targetId)} shield ${cue.amount}`
    case 'break': return `${name(cue.targetId)} BREAK!`
    case 'recover': return `${name(cue.targetId)} recovers its shield`
    case 'ko': return `${name(cue.targetId)} is knocked out`
    case 'phase': return `${name(cue.targetId)} changes tactics`
    case 'status': return `${name(cue.targetId)}: ${cue.label}`
    case 'guard': return `${name(cue.actorId)} guards ${name(cue.targetId)}`
    case 'skip': return `${name(cue.actorId)} is ${cue.label?.toLowerCase()} and loses its turn`
    case 'heal': return `${name(cue.targetId)} recovers ${cue.amount} HP`
    case 'mp': return `${name(cue.targetId)} +${cue.amount} MP`
    case 'revive': return `${name(cue.targetId)} gets back up!`
    case 'limit': return `${name(cue.actorId)}: LIMIT BREAK · ${cue.label}!`
    case 'summon': return `${name(cue.actorId)}’s ${cue.label} strikes again`
    case 'intent': return `${name(cue.actorId)}: ${cue.label}`
    case 'result': return cue.label === 'victory' ? 'Victory!' : 'Defeated'
  }
}

/**
 * What the DOM shows while cues play: the state before the action with each cue applied as it lands, so bars and
 * shields move with the effects. Playback ends by showing the engine's real state.
 */
export function followCue(shown: BattleState, cue: BattleCue): BattleState {
  if (cue.kind === 'intent' || cue.kind === 'result') return shown
  const target = shown.units.find((u) => u.id === cue.targetId)
  if (!target) return shown
  const maxHp = shown.input.allies.find((a) => a.id === target.id)?.stats.hp ?? shown.input.enemies.find((e) => e.id === target.id)?.stats.hp ?? target.hp
  const next = { ...target }
  if (cue.kind === 'hit') next.hp = Math.max(0, target.hp - cue.amount)
  else if (cue.kind === 'heal') next.hp = Math.min(maxHp, target.hp + (cue.amount ?? 0))
  else if (cue.kind === 'mp') next.mp = target.mp + (cue.amount ?? 0)
  else if (cue.kind === 'shield' || cue.kind === 'recover') next.shield = cue.amount ?? target.shield
  else if (cue.kind === 'break') next.brokenAt = Math.max(1, shown.round)
  else if (cue.kind === 'ko') next.hp = 0
  else if (cue.kind === 'revive') next.hp = cue.amount ?? 1
  else return shown
  if (cue.kind === 'recover') next.brokenAt = 0
  return { ...shown, units: shown.units.map((u) => (u.id === next.id ? next : u)) }
}
