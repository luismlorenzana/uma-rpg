// Read-only projections of the engine for the fight screen: legal choices, previews and cue text. Ported from uma-racer,
// reworked for D86: every class acts once, picks which of her five weapons to attack with, and a Spell Blade's act pairs
// an Arms half with a Tome half.
import { BATTLE_LIMIT_MAX, BATTLE_LIMIT_NAMES, applyBattleAction, battleActionsLeft, battleActorSkill,
  battleHasLimit, battleLimitPlan, bondCapacity, heroLimit, heroLimitKinds, isRpgTome, RPG_ELEMENTS, rpgWeaponKind,
  type BattleAction, type BattleAlly, type BattleCue, type BattleHalf, type BattleLimitChoice, type BattleSkill, type BattleState,
  type HeroLimitId, type RpgDamageKind, type RpgNodeRef, type RpgWeapon } from '@rpg/domain'

import { skillKinds, WEAPON_LABEL } from './labels'

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
const defaultPair = (ally: Pick<BattleAlly, 'weapons'>): Pair => ({
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
    ...(mode.skills ? { skills: mode.skills } : {}), ...(mode.weapon ? { weapon: mode.weapon } : {}), ...(mode.hero ? { hero: mode.hero } : {}) }
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

/** Her bar is full (D311) and she has a Limit Break to spend it on: from v10, only a Hero or a Learner does (D112). */
export const limitReady = (state: BattleState, id: string): boolean => {
  const ally = state.input.allies.find((a) => a.id === id)
  return !!ally && battleHasLimit(ally, state.engineVersion) && (state.units.find((u) => u.id === id)?.limit ?? 0) >= BATTLE_LIMIT_MAX
}
/** A Limit Break is her turn, so she can use it only before she acts this round. */
export const limitNow = (state: BattleState, id: string): boolean => {
  const unit = state.units.find((u) => u.id === id)
  return !!unit && unit.hp > 0 && limitReady(state, id) && battleActionsLeft(state, id) === 1
}
/**
 * One row of the Limit Break menu, with the kinds it deals. A Hero's own or an inherited one shows its Hero (`face`, an
 * outfit id) and its strength, and is chosen at once even in a Spell Blade's two-pick menu (`instant`, D106).
 */
export interface LimitOption {
  key: string; name: string; detail: string; choice: BattleLimitChoice; kinds: RpgDamageKind[]
  face?: string; strength?: number; instant?: boolean
}
const heroOption = (limit: HeroLimitId, face: string, strength: number): LimitOption => {
  const def = heroLimit(limit)
  return { key: `hero:${limit}`, name: def.name, detail: def.blurb, choice: { hero: limit }, kinds: heroLimitKinds(def), face, strength, instant: true }
}
/** The Limit Break menu. From v10 (D112) only the Halls of Heroes give them: a Hero has her seat's, a Learner her Heroes'.
 * Older fights replay with their class's: a fixed one, or one per equipped skill, a Spell Blade picking an Arms and a Tome
 * skill (`pick: 2`), plus a Learner's inherited ones (D106). */
export function limitOptions(state: BattleState, actorId: string): { pick: 1 | 2; options: LimitOption[] } {
  const ally = state.input.allies.find((a) => a.id === actorId)
  if (!ally) return { pick: 1, options: [] }
  if (ally.hero) return { pick: 1, options: [heroOption(ally.hero, ally.id, 1)] }
  const inherited = (ally.inherits ?? []).map((i) => heroOption(i.limit, i.from, bondCapacity(i.bond)))
  if (state.engineVersion >= 10) return { pick: 1, options: inherited }
  const own = classOptions(state, ally)
  return { pick: own.pick, options: [...own.options, ...inherited] }
}
function classOptions(state: BattleState, ally: BattleAlly): { pick: 1 | 2; options: LimitOption[] } {
  const skills = ally.loadout.flatMap((ref) => { const skill = battleActorSkill(state, ally.id, ref); return skill ? [skill] : [] })
  const key = (ref: RpgNodeRef) => `${ref.tier}:${ref.id}`
  if (ally.classId === 'mage') return { pick: 1, options: [{ key: 'nova', name: BATTLE_LIMIT_NAMES.mage, choice: {},
    detail: 'A hit of each element', kinds: [...RPG_ELEMENTS] }] }
  if (ally.classId === 'cleric') return { pick: 1, options: [{ key: 'patrons', name: BATTLE_LIMIT_NAMES.cleric, choice: {},
    detail: 'A hit with each weapon, statuses ×3', kinds: ally.weapons.map(rpgWeaponKind) }] }
  if (ally.classId === 'summoner') return { pick: 1, options: skills.filter((s) => s.def.summon).map((s) => ({ key: key(s.ref), name: `${BATTLE_LIMIT_NAMES.grand} · ${s.label}`,
    choice: { skill: s.ref }, detail: '×2, lingers ×2', kinds: skillKinds(s.def) })) }
  if (ally.classId === 'spellblade') return { pick: 2, options: skills.map((s) => ({ key: key(s.ref), name: s.label, choice: { skills: [s.ref] },
    detail: isRpgTome(s.node.weapon) ? 'Tome half, full strength' : 'Arms half, full strength', kinds: skillKinds(s.def) })) }
  return { pick: 1, options: skills.length
    ? skills.map((s) => ({ key: key(s.ref), name: s.label, choice: { skill: s.ref }, detail: 'Cast twice', kinds: skillKinds(s.def) }))
    : ally.weapons.map((w) => ({ key: w, name: `${BATTLE_LIMIT_NAMES.twin} · ${WEAPON_LABEL[w]}`, choice: { weapon: w }, detail: 'Two Attacks', kinds: [rpgWeaponKind(w)] })) }
}
/** The mode a menu pick (or a Spell Blade's two picks) sets, or null if the engine would refuse it. */
export function limitMode(state: BattleState, actorId: string, choice: BattleLimitChoice): BattleMode | null {
  const ally = state.input.allies.find((a) => a.id === actorId)
  const plan = ally ? battleLimitPlan(ally, choice, state.engineVersion) : null
  return plan ? { kind: 'limit', name: plan.name, ...choice } : null
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
    case 'mp': return `${name(cue.targetId)} +${cue.amount} MP`
    case 'limit': return `${name(cue.actorId)}: LIMIT BREAK · ${cue.label}${cue.from ? `, from ${name(cue.from)}` : ''}!`
    case 'summon': return `${name(cue.actorId)}’s ${cue.label} strikes again`
    case 'wave': return `${cue.label}: the next foes arrive`
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
  const next = { ...target }
  if (cue.kind === 'hit') next.hp = Math.max(0, target.hp - cue.amount)
  else if (cue.kind === 'mp') next.mp = target.mp + (cue.amount ?? 0)
  else if (cue.kind === 'shield' || cue.kind === 'recover') next.shield = cue.amount ?? target.shield
  else if (cue.kind === 'break') next.brokenAt = Math.max(1, shown.round)
  else if (cue.kind === 'ko') next.hp = 0
  else return shown
  if (cue.kind === 'recover') next.brokenAt = 0
  return { ...shown, units: shown.units.map((u) => (u.id === next.id ? next : u)) }
}
