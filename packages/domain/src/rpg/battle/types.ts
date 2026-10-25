// Campaign battle vocabulary, engine v15 (W3, D91: up to eight foes, dual elements, waves; D86 classes; Limit Breaks D311;
// v8 ranks and gear, D102–D104; v9 Heroes and Learners, D106; v10 Limit Breaks only from the Halls of Heroes, D112;
// v11 two accessories and their defensive effects, D124; v12 the combat balance rework, D141: a ratio damage formula,
// Might as a share, heals and Barriers, Rally, charged moves with locks; docs/design/combat-balance.md; v13 Might as
// D142's flat table; v14 the Rift's foe traits, D169: the ward, a third act and mixed locks; docs/design/rift.md §5;
// v15 classes v2, D179, live since H61 (D188): the Paladin, one healer a party, no Orb kinds; docs/design/classes-v2.md;
// v16 the Tier rework's fight, D200, dark until H72: three weapons by channel, no side or legacy skills;
// docs/design/tier-rework/implementation.md). Older fights still replay unchanged.
import type { HeroLimitId } from '../hero-id'
import type { RpgClass, RpgCoreStats, RpgDamageKind, RpgElement, RpgNodeRef, RpgStatusKind, RpgWeapon, RpgWeaponKind } from '../rules'

export type BattleSide = 'ally' | 'enemy'
export type BattleChannel = 'physical' | 'magical'
export type EnemyRank = 'regular' | 'sub-boss' | 'boss'
/** Her template's Flourish, by her stride (uma-templates §3.3, UT6): 4% of her max HP a fight, as her calling. Named by
 * `roster/template.ts` (H67); engine v16 plays it from her input (H68). */
export type RpgFlourish = 'clean-break' | 'even-pace' | 'late-reserve'
export interface BattleStatus { kind: RpgStatusKind; stacks: number; turns: number }

export interface BattleAlly {
  id: string
  classId: RpgClass
  weapons: RpgWeapon[]
  tier: number
  level: number
  stats: RpgCoreStats
  /** Side skills learned in this tier, to v15; empty from v16 (the Tier rework's trees have no points, CP14). Open depths
   * give the core skills. */
  tree: RpgNodeRef[]
  /** Skills carried from an earlier tier (S8); retired from v16 (CP31): empty. */
  legacy: RpgNodeRef[]
  loadout: RpgNodeRef[]
  /** The kind her Orb adds to every hit, for weaknesses only (D86). Refused from v15 (D179). */
  orb?: RpgDamageKind
  /** MP carried into this fight from the run; HP always starts full. */
  mp: number
  /** Deepest skill depth her class rank opened (S5, v6–v7 fights); v8 sends `classRank` instead. */
  maxDepth?: number
  /** Her Class Rank (v8, D102): it opens her trees' depths and sets her Limit Break's depth. */
  classRank?: number
  /** Might by damage kind (v8, D104): added to the offense of hits made with that weapon (a grade × 4 to v11; D142's
   * table from v13). In v12 alone (D141) a percent: the hits made with that weapon deal this much more. From v15 it also
   * carries her Orb's offense on its kind (H57). */
  might?: Partial<Record<RpgDamageKind, number>>
  /** A Barrier she starts the fight with (v8: from physical armor, absorbing any damage; v11: a Bulwark Talisman's,
   * absorbing physical damage only). */
  barrier?: number
  /** HP she regains at the end of each round (v8: magical armor; v11: a Vital Talisman). */
  regen?: number
  /** v11 (D124): the kinds of the Orbs she wears, two at most; each makes her hits weak as `orb` did. Replaces `orb`.
   * Refused from v15 (D179): an Orb's flat offense arrives in `might`, and it no longer adds kinds. */
  orbs?: RpgDamageKind[]
  /** v11: a Veil absorbing magical damage, from the start of the fight (Veil Amulet). */
  veil?: number
  /** v11: MP restored at the end of each round (Spring Amulet). */
  mpRegen?: number
  /** v11, per mille: physical damage she deals healed back (Vampire Talisman); magical damage she deals restored as MP
   * (Siphon Amulet). */
  lifesteal?: number
  mpSteal?: number
  /** v11, per mille: physical (Iron Talisman) and magical (Ward Amulet) damage she doesn't take. */
  guard?: number
  resist?: number
  /** v11, per mille: physical (Thorn Talisman) and magical (Mirror Amulet) damage she takes, returned to its attacker. */
  thorns?: number
  mirror?: number
  /** Share of every hit she avoids, per mille, from Speed points (S6, S7). */
  evasion?: number
  /** Limit Break charge she starts the fight with, from Limit Break points (S6, S7). */
  limitStart?: number
  /** v9 (D106): she is the Hero of this seat, and her Limit Break is always its unique one, at full strength. */
  hero?: HeroLimitId
  /** v9: the Heroes she learns under (two at most): each seat's Limit Break, her Bond Level with it, and the Hero. */
  inherits?: BattleInherit[]
}
/** An inherited Limit Break (D106): it works at 50% plus 5% a Bond Level; `from` is the Hero's outfit, for the cut-in. */
export interface BattleInherit { limit: HeroLimitId; bond: number; from: string }
export interface BattleEnemyStats { hp: number; atk: number; matk: number; pdef: number; mdef: number; initiative: number }
export interface BattleEnemyMove {
  id: string
  kind: 'damage' | 'guard' | 'buff' | 'debuff'
  channel: BattleChannel
  element: RpgElement | null
  /** Percent of the enemy's offense; area moves hit every ally at this power. */
  power: number
  /** v12 (D141): a charged move, announced a round before it lands, with this many locks drawn from her weaknesses. Each
   * hit of a lock's kind breaks one and weakens the move; breaking all of them, or Breaking her, cancels it. */
  charge?: number
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
  /** A dual-element foe's second element (v7): her elemental moves split between the two. */
  element2?: RpgElement
  /** Acts twice a round (v7): solo elites, so they stay threatening alone. */
  twice?: boolean
  /** v14 (D169): the Rift's ward, the channel she wards (Iron and Arcane fronts). An ally's hit of that channel deals
   * `BATTLE_WARD_FACTOR` of its damage, Broken or not, `pierce` or not. A trait of the foe, not the "Ward" status
   * (`RpgStatusKind` 'ward', a foe's guard-up buff). */
  ward?: BattleChannel
  /** v14 (D169): the Rift's Duel champion acts three times a round; her third move comes after every foe's second, and
   * like a second it never starts a charge. Never with `twice`. */
  thrice?: boolean
  /** v14 (D169): the Rift's Duel lock sets. Weak to an Arms kind and an element, her charged moves' locks alternate, an
   * Arms kind first; weak to one channel only, she draws as any foe. */
  mixedLocks?: boolean
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
export interface BattleInput {
  version: 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16
  seed: number
  allies: BattleAlly[]
  /** The first wave. */
  enemies: BattleEnemy[]
  /** Later waves (v7): each enters when the one before falls, at the start of a fresh round. */
  waves?: BattleEnemy[][]
}

export interface BattleUnit {
  id: string
  side: BattleSide
  hp: number
  mp: number
  statuses: BattleStatus[]
  /** Damage a Barrier absorbs before HP (v11: physical damage only). */
  barrier: number
  /** v11: magical damage a Veil absorbs before HP. */
  veil?: number
  phase: 1 | 2
  guardingFor: string | null
  /** Remaining break shield (enemies). */
  shield: number
  /** Round the shield broke in: the foe loses that round's and the next round's action. 0 when standing. */
  brokenAt: number
  /** Inert pre-D86 Rebirth flag retained in the v6/v7 state hash shape. */
  revived: boolean
  /** Limit Break charge (allies, D311): attacks and skills fill it to BATTLE_LIMIT_MAX; it stays full until used. */
  limit: number
  /** v12 (D141): a Barrier from skills and summons, absorbing any damage before the accessories' shields and HP. It lasts
   * until the end of the round. */
  cover?: number
  /** v12: part of the last foe hit she took, won back if the party Breaks or defeats that foe before it moves again. */
  rally?: { from: string; amount: number }
  /** v12: a foe's charged move: announced in `round`, it lands the round after at its power × locks left ÷ `total`. */
  charging?: { moveId: string; locks: RpgDamageKind[]; total: number; round: number; targetId: string }
  /** v12: the round her last charged move landed or was cancelled; she doesn't charge again the next round. */
  charged?: number
  /** v12: back up from a Break, her shield can't be chipped until she has made a move, so she acts between Breaks. */
  steeled?: boolean
}
export interface BattleIntent { enemyId: string; moveId: string; targetId: string }
export interface BattleState {
  engineVersion: 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16
  input: BattleInput
  round: number
  /** The wave on the field, 0-based; only in fights with waves. */
  wave?: number
  units: BattleUnit[]
  /** Allies who have acted this round: once each (D86). */
  acted: string[]
  /** Each Summoner's lingering summon: it acts again at `scale` when she next summons (D86). */
  summons: BattleSummon[]
  intents: BattleIntent[]
  outcome: 'active' | 'victory' | 'loss'
  /** v15 (classes v2 §4): each Cleric's Regen, left by her last Light spell (her next one replaces it). Not a status: it
   * keeps its caster and her share. Set by the first Regen and absent before, so older states hash as they did. */
  regens?: BattleRegen[]
}
export interface BattleSummon { allyId: string; ref: RpgNodeRef; scale: number }
/** A Regen: at the end of each of `rounds` more round ends, a mend on the most hurt Uma (`hurt`) or every Uma (`all`)
 * at `share` of max HP (its spell's share × its strength × `BATTLE_REGEN_SHARE`), × her scaling then. It ends if she falls. */
export interface BattleRegen { allyId: string; mend: 'hurt' | 'all'; share: number; rounds: number }
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
   * a fixed one. A Learner may name an inherited one instead (`hero`, v9); a Hero has only her own. From v10 only the
   * Heroes' Limit Breaks exist: a Hero's own, a Learner's inherited ones (D112).
   */
  | { kind: 'limit'; actorId: string; targetId: string; skill?: RpgNodeRef; skills?: RpgNodeRef[]; weapon?: RpgWeapon; hero?: HeroLimitId }
export type BattleCue =
  | { kind: 'intent'; actorId: string; targetId: string; label: string }
  /** A foe makes her move, named as its intent was (D135: the cue a splash cuts in on). Presentation only. */
  | { kind: 'move'; actorId: string; targetId: string; label: string }
  | { kind: 'hit'; actorId: string; targetId: string; amount: number; channel: BattleChannel | 'status';
      element: RpgDamageKind | null; weak: boolean; label?: string }
  | { kind: 'shield' | 'break' | 'recover' | 'ko' | 'phase' | 'status' | 'guard' | 'skip' | 'mp' | 'summon' | 'wave';
      actorId: string; targetId: string; amount?: number; label?: string }
  /** v12 (D141): HP restored (a mend, a revive, a Rally, a breather between waves), a Barrier's new total, a lock broken
   * (`amount` locks left, `label` its kind) and a charged move cancelled. */
  | { kind: 'heal' | 'cover' | 'lock' | 'cancel'; actorId: string; targetId: string; amount?: number; label?: string }
  /** A Limit Break: its name, and for an inherited one the Hero it came from (D106). */
  | { kind: 'limit'; actorId: string; targetId: string; label: string; from?: string; amount?: undefined }
  | { kind: 'result'; label: 'victory' | 'loss' }
export type BattleError = 'terminal' | 'invalid-actor' | 'already-acted' | 'invalid-target' |
  'invalid-skill' | 'insufficient-mp' | 'invalid-state' | 'limit-not-ready'
export interface BattleStep { state: BattleState; cues: BattleCue[]; hash: string; error?: BattleError }
