// Campaign battle vocabulary, engine v6 (D86, docs/design/class-rework.md; Limit Breaks D311).
import type { RpgClass, RpgCoreStats, RpgDamageKind, RpgElement, RpgNodeRef, RpgStatusKind, RpgWeapon, RpgWeaponKind } from '../rules'

export type BattleSide = 'ally' | 'enemy'
export type BattleChannel = 'physical' | 'magical'
export type EnemyRank = 'regular' | 'sub-boss' | 'boss'
export interface BattleStatus { kind: RpgStatusKind; stacks: number; turns: number }

export interface BattleAlly {
  id: string
  classId: RpgClass
  weapons: RpgWeapon[]
  tier: number
  level: number
  stats: RpgCoreStats
  /** Side skills learned in this tier; open depths give the core skills. */
  tree: RpgNodeRef[]
  legacy: RpgNodeRef[]
  loadout: RpgNodeRef[]
  /** The kind her Orb adds to every hit, for weaknesses only (D86). */
  orb?: RpgDamageKind
  /** MP carried into this fight from the run; HP always starts full. */
  mp: number
  /** Deepest skill depth her class rank opens (S5); absent in older fights, which gate depths by level. */
  maxDepth?: number
  /** Share of every hit she avoids, per mille, from Speed points (S6, S7). */
  evasion?: number
  /** Limit Break charge she starts the fight with, from Limit Break points (S6, S7). */
  limitStart?: number
}
export interface BattleEnemyStats { hp: number; atk: number; matk: number; pdef: number; mdef: number; initiative: number }
export interface BattleEnemyMove {
  id: string
  kind: 'damage' | 'guard' | 'buff' | 'debuff'
  channel: BattleChannel
  element: RpgElement | null
  /** Percent of the enemy's offense; area moves hit every ally at this power. */
  power: number
  target: 'front' | 'lowest-hp' | 'seeded' | 'all' | 'self' | 'ally'
  status?: 'burn' | 'slow' | 'mark' | 'weaken' | 'ward' | 'power-up'
  label: string
}
/** Weapon and element weaknesses (D279); each weak hit removes one shield point. */
export interface BattleWeaknesses { weapons: RpgWeaponKind[]; elements: RpgElement[] }
export interface BattleEnemy {
  id: string
  /** Cast member shown for this foe; presentation only. */
  castId: string
  element: RpgElement
  rank: EnemyRank
  /** Lifetime level (Tier 1 Lv1 is 1, Tier 2 Lv1 is 51). */
  level: number
  stats: BattleEnemyStats
  /** Break shield points; every enemy has one. */
  shield: number
  weaknesses: BattleWeaknesses
  moves: BattleEnemyMove[]
  phaseTwo?: { thresholdPercent: number; moves: BattleEnemyMove[] }
}
export interface BattleInput { version: 6; seed: number; allies: BattleAlly[]; enemies: BattleEnemy[] }

export interface BattleUnit {
  id: string
  side: BattleSide
  hp: number
  mp: number
  statuses: BattleStatus[]
  /** Damage a Barrier absorbs before HP. */
  barrier: number
  phase: 1 | 2
  guardingFor: string | null
  /** Remaining break shield (enemies). */
  shield: number
  /** Round the shield broke in: the foe loses that round's and the next round's action. 0 when standing. */
  brokenAt: number
  /** Rebirth works once per Uma per fight. */
  revived: boolean
  /** Limit Break charge (allies, D311): attacks and skills fill it to BATTLE_LIMIT_MAX; it stays full until used. */
  limit: number
}
export interface BattleIntent { enemyId: string; moveId: string; targetId: string }
export interface BattleState {
  engineVersion: 6
  input: BattleInput
  round: number
  units: BattleUnit[]
  /** Allies who have acted this round: once each (D86). */
  acted: string[]
  /** Each Summoner's lingering summon: it acts again at `scale` when she next summons (D86). */
  summons: BattleSummon[]
  intents: BattleIntent[]
  outcome: 'active' | 'victory' | 'loss'
}
export interface BattleSummon { allyId: string; ref: RpgNodeRef; scale: number }
/** One half of a Spell Blade's act: a skill, or an Attack with a weapon. */
export interface BattleHalf { skill?: RpgNodeRef; weapon?: RpgWeapon }
export type BattleAction =
  /** An Attack with one of her weapons (the first if none is named). A Spell Blade adds the other half as `pair`. */
  | { kind: 'attack'; actorId: string; targetId: string; weapon?: RpgWeapon; pair?: BattleHalf }
  | { kind: 'guard'; actorId: string; targetId: string }
  | { kind: 'skill'; actorId: string; targetId: string; skill: RpgNodeRef; pair?: BattleHalf }
  /**
   * A Limit Break spends a full charge and her turn (D311). A Brawler names a skill to cast twice (or a weapon to
   * strike twice), a Summoner a summon, a Spell Blade an Arms skill and a Tome skill (`skills`); Mages and Clerics have
   * a fixed one.
   */
  | { kind: 'limit'; actorId: string; targetId: string; skill?: RpgNodeRef; skills?: RpgNodeRef[]; weapon?: RpgWeapon }
export type BattleCue =
  | { kind: 'intent'; actorId: string; targetId: string; label: string }
  | { kind: 'hit'; actorId: string; targetId: string; amount: number; channel: BattleChannel | 'status';
      element: RpgDamageKind | null; weak: boolean; label?: string }
  | { kind: 'shield' | 'break' | 'recover' | 'ko' | 'phase' | 'status' | 'guard' | 'skip' | 'heal' | 'mp' | 'revive' | 'limit' | 'summon';
      actorId: string; targetId: string; amount?: number; label?: string }
  | { kind: 'result'; label: 'victory' | 'loss' }
export type BattleError = 'terminal' | 'invalid-actor' | 'already-acted' | 'invalid-target' |
  'invalid-skill' | 'insufficient-mp' | 'invalid-state' | 'limit-not-ready'
export interface BattleStep { state: BattleState; cues: BattleCue[]; hash: string; error?: BattleError }
