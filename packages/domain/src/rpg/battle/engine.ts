// Deterministic campaign battle reducer, engine v18 (weaknesses v2 live since H116, D237; v17 from H82 to H116, D218; W3, D91; classes
// D86, docs/archive/design/class-rework.md; Limit Breaks D311).
// Octopath Traveler breaks: each weak hit removes one shield point, and unbroken foes take half damage. Every class acts
// once a round; a Spell Blade's act is an Arms half and a Tome half, a Summoner's summon lingers and acts again when she
// next summons, a Cleric's skills carry a debuff or a buff, and an Orb adds its kind to every hit for weaknesses.
// v7 adds up to eight foes, dual-element foes, solo elites that act twice and waves; v8 ranks, Might, Barrier and Regen
// (D102–D104); v9 Heroes and their Learners' inherited Limit Breaks (D106); v10 drops the classes' own Limit Breaks (D112);
// v11 two accessories (D124); v12 the combat balance rework (D141, docs/archive/design/combat-balance.md): a ratio damage formula,
// Might as a share, Cleric and Summoner heals, Barriers and revives, Rally, charged foe moves with locks, Breaks that
// strip foe buffs, and a breather between waves; v13 Might as D142's flat table again, on the v12 rules; v14 the Rift's
// foe traits (D169, docs/design/rift.md §5): the ward, a third act and mixed lock sets, which only Rift foes carry;
// v15 classes v2 (D179, live since H61, D188): the Paladin, the hybrids' hands, healers from ATK or M.ATK, flat Orbs;
// v16 the Tier rework's fight (D200, live since H72, D210): three weapons by channel, no side skills; a trunk and one
// fork into line A or B, Pierce, the Paladin's revive on her Light tree and Skill Ranks from her Class Rank (H65); the
// base MP regen for every Uma and the Flourish as her calling, Clean break, Even pace and Late reserve (H68, D204).
// v17 is R2's economy (D209, live since H82): gear grades arrive only as stats and Might, and support fields retire; her
// accessory's base form and her signature join the damage stack (H75, D212): `flat` and `signature` in a hit's offense,
// the Insignia a factor after the weak step, and the Bell's follow-up after an act with an Attack (`ring`).
// v18 changes generated world-foe weakness lists and the Summoner's Tome hand; the reducer otherwise keeps v17's rules.
// v19 classes v3 (D240, D241), live since H134: thirteen classes, Tier 0, hands' lead half from data; H128's shapes and
// twins, H129's Limit Breaks. A Tier 0 fights only in Tier 1's world at Class Rank 1–10, a Tier 1 class there only from
// Class Rank 10; her one skill's power is her Class Rank's (`rpgSkillFactor`), her open depth 1.
// Older fights replay unchanged: every class rule the engine reads takes the fight's own version (`battle/caps.ts`).
import { rpgNode, rpgNodeSkill, RPG_SUPPORT_ALL, type RpgHit, type RpgSkillDef, type RpgSupport } from '../catalog'
import { BOND_MAX_LEVEL, isHeroLimitId, LEARNER_MAX_PARENTS } from '../hero-id'
import {
  isRpgDamageKind, isRpgTome, isRpgWeapon, RPG_ELEMENTS, RPG_MAX_LEGACY_SLOTS, RPG_TIER0_MAX_RANK, RPG_WEAPON_KINDS, rpgActiveSlots, rpgBaseMpRegen,
  rpgClasses, rpgHand, rpgIsHealer, rpgIsTier0, rpgNodeKey, rpgWeaponKind, validRpgLines, validRpgTree, validRpgWeapons, type RpgDamageKind,
  type RpgNodeRef, type RpgStatusKind, type RpgWeapon,
} from '../rules'
import {
  BATTLE_BARRIER_CAP, BATTLE_BARRIER_PERCENT, BATTLE_BREAK_ROUNDS, BATTLE_BREATHER, BATTLE_BURN_PERCENT, BATTLE_CLARITY_PERCENT, BATTLE_COVER_CAP,
  BATTLE_COVER_CAP_V15, BATTLE_DEFENSE_SHARE, BATTLE_FOE_STATUS_STEP, BATTLE_GUARD_FACTOR, BATTLE_HEAL_OFFENSE_SCALE, BATTLE_HEAL_SCALE, BATTLE_MAX_ROUNDS,
  BATTLE_MIN_OFFENSE_SHARE, BATTLE_RALLY_SHARE, BATTLE_REGEN_ROUNDS, BATTLE_REGEN_SHARE, BATTLE_REVIVE_SHARE,
  BATTLE_STATUS_STACK_CAP, BATTLE_STATUS_STEP, BATTLE_STATUS_TURNS,
  BATTLE_UNBROKEN_FACTOR, BATTLE_WARD_FACTOR, BATTLE_WEAK, battleChannel, battleClassRank, battleNodeDef, battleSkillFor, type BattleSkill,
} from './skills'
import { RPG_MAX_TREE_NODES } from '../rules'
import { BATTLE_LIMIT_MAX, battleLimitGain, battleLimitPlan } from './limit'
import type { BattleAction, BattleAlly, BattleChannel, BattleCue, BattleEnemy, BattleEnemyMove, BattleError, BattleHalf,
  BattleInput, BattleIntent, BattleSide, BattleState, BattleStep, BattleUnit, RpgFlourish } from './types'
import {
  BATTLE_FLOURISH_FROM, BATTLE_FLOURISH_RATE, BATTLE_FLOURISH_SHARE, BATTLE_MAX_ACTIONS, BATTLE_MAX_EXTRA_WAVES as MAX_EXTRA_WAVES,
} from './caps'
export { BATTLE_MAX_ACTIONS } from './caps'
/** The engine new fights start on, the one switch (D179): it lives in `caps.ts`, so the profile's rules read it without
 * the engine. Older versions still replay; v16 is live since H72 (D210). The Tier rework's releases open at their engines
 * (`rpgRework`, D200). */
export { BATTLE_ENGINE_VERSION, RPG_REWORK_ENGINE, RPG_V2_ENGINE, rpgRework, rpgV2, type RpgReworkStage } from './caps'
// v15's hands (H55, D183): the hybrids' per-half power, the Spell Blade's extra hit, the Summoner's farewell.
import { BATTLE_FAREWELL_FACTOR } from './skills'
import { rpgRework, rpgV2 } from './caps'
const VERSIONS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] as const
/** v16 (UT6): the three Flourishes, one by stride. */
const FLOURISHES: readonly RpgFlourish[] = ['clean-break', 'even-pace', 'late-reserve']

const SAFE_ID = /^[A-Za-z0-9][A-Za-z0-9:_.-]{0,127}$/
const safeInt = (v: unknown, min: number, max: number): v is number => Number.isSafeInteger(v) && (v as number) >= min && (v as number) <= max
function hashNumber(text: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}
function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
      .map(([key, part]) => `${JSON.stringify(key)}:${stable(part)}`).join(',')}}`
  }
  return JSON.stringify(value)
}
/** The prefix stays v6: it names the hash's shape, and v7 states hash the same way. */
export function battleStateHash(state: BattleState): string {
  return `rpg-battle-v6:${hashNumber(stable(state)).toString(16).padStart(8, '0')}`
}

const unit = (s: BattleState, id: string) => s.units.find((u) => u.id === id)
const allyOf = (s: BattleState, id: string) => s.input.allies.find((a) => a.id === id)
/** A foe of the fight, whichever wave she's in. */
export function battleFoe(s: Pick<BattleState, 'input'>, id: string): BattleEnemy | undefined {
  for (const e of s.input.enemies) if (e.id === id) return e
  for (const wave of s.input.waves ?? []) for (const e of wave) if (e.id === id) return e
  return undefined
}
const enemyOf = battleFoe
/** How many waves the fight has: 1, or up to 3 in v7. */
export const battleWaveCount = (input: BattleInput): number => 1 + (input.waves?.length ?? 0)
/** The foes of the wave on the field, in their order. */
export function battleWaveFoes(s: Pick<BattleState, 'input' | 'wave'>): BattleEnemy[] {
  const wave = s.wave ?? 0
  return wave === 0 ? s.input.enemies : s.input.waves?.[wave - 1] ?? []
}
const wavesLeft = (s: BattleState): boolean => (s.wave ?? 0) < (s.input.waves?.length ?? 0)
const living = (s: BattleState, side: BattleSide) => s.units.filter((u) => u.side === side && u.hp > 0)
const maxHp = (s: BattleState, id: string) => allyOf(s, id)?.stats.hp ?? enemyOf(s, id)!.stats.hp
const stacks = (u: BattleUnit, kind: RpgStatusKind) => u.statuses.find((x) => x.kind === kind)?.stacks ?? 0
export const battleBroken = (u: BattleUnit): boolean => u.brokenAt > 0
/** Actions this Uma has spent this round, and how many she has left: one a round for every class (D86). */
export const battleActionsUsed = (s: BattleState, id: string): number => s.acted.filter((x) => x === id).length
export const battleActionsLeft = (s: BattleState, id: string): number => (allyOf(s, id) ? Math.max(0, 1 - battleActionsUsed(s, id)) : 0)

function addStatus(target: BattleUnit, kind: RpgStatusKind, count = 1, turns = BATTLE_STATUS_TURNS, cap = BATTLE_STATUS_STACK_CAP): void {
  const current = target.statuses.find((x) => x.kind === kind)
  if (current) {
    current.stacks = Math.min(Math.max(cap, current.stacks), current.stacks + count)
    current.turns = Math.max(current.turns, turns)
  } else target.statuses.push({ kind, stacks: Math.min(cap, count), turns })
  target.statuses.sort((a, b) => a.kind.localeCompare(b.kind))
}

function validStats(v: Record<string, unknown> | undefined, keys: readonly string[]): boolean {
  return !!v && typeof v === 'object' && keys.every((k) => safeInt(v[k], k === 'hp' ? 1 : 0, 10_000_000))
}
const ALLY_STATS = ['speed', 'stamina', 'power', 'guts', 'wit', 'atk', 'matk', 'initiative', 'pdef', 'mdef', 'dexterity', 'hp', 'mp']
const ENEMY_STATS = ['hp', 'atk', 'matk', 'pdef', 'mdef', 'initiative']
function validMove(m: BattleEnemyMove, version: BattleInput['version']): boolean {
  // v12 (D141): a charged move is a damage move with one to six locks.
  if (m.charge !== undefined && (version < 12 || m.kind !== 'damage' || !safeInt(m.charge, 1, 6))) return false
  return SAFE_ID.test(m.id) && ['damage', 'guard', 'buff', 'debuff'].includes(m.kind) &&
    ['physical', 'magical'].includes(m.channel) && (m.element === null || RPG_ELEMENTS.includes(m.element)) &&
    safeInt(m.power, 0, 1000) && typeof m.label === 'string' && m.label.length > 0 && m.label.length <= 80 &&
    (m.kind === 'damage' ? ['front', 'lowest-hp', 'seeded', 'all'].includes(m.target)
      : m.kind === 'debuff' ? ['front', 'lowest-hp', 'seeded'].includes(m.target) : ['self', 'ally'].includes(m.target)) &&
    (m.status === undefined || (m.kind === 'buff' ? ['ward', 'power-up'].includes(m.status)
      : ['burn', 'slow', 'mark', 'weaken'].includes(m.status)))
}

/** Learned, slotted and legal for her class; the same tree rules the profile enforces. v8 adds her Class Rank, her
 * weapons' Might, her armor's Barrier and Regen (D102, D104). Her class and weapons by the fight's generation (D179): a
 * Paladin only from v15. From v16 (the Tier rework's fight, D200) three weapons by channel and position, and no side
 * skills or legacy skills: `tree` and `legacy` are empty (CP14, CP31); her `lines` (H65) name only her weapons, each B,
 * and her loadout holds only her held skills, at most her generation's slots (seven by Lv 40, CP22); her `flourish` (H68)
 * is one of the three. From v17 her accessory and signature (H75, `validAccessory`). From v19 (Classes v3, H126) her class
 * of the thirteen: a Tier 0 only in Tier 1's world at Class Rank 1–10, with no lines; a Tier 1 class in Tier 1's world only
 * from Class Rank 10 (CV8, CV10). */
function validAlly(a: BattleAlly, version: BattleInput['version']): boolean {
  const v8 = version >= 8
  const v16 = rpgRework('fight', version)
  if (v16 && (!Array.isArray(a.tree) || a.tree.length > 0 || !Array.isArray(a.legacy) || a.legacy.length > 0)) return false
  if (a.lines !== undefined && (!v16 || !Array.isArray(a.weapons) || !validRpgLines(a.lines, a.weapons, a.classId))) return false
  if (rpgRework('classes', version) && !validTierOfClass(a)) return false
  if (a.flourish !== undefined && (!v16 || !FLOURISHES.includes(a.flourish))) return false
  if (version < 9 ? a.hero !== undefined || a.inherits !== undefined : !validHeroes(a, version)) return false
  if (!validCharms(a, version)) return false
  if (!v8 && (a.classRank !== undefined || a.might !== undefined || a.barrier !== undefined || a.regen !== undefined)) return false
  if (v8 && (!safeInt(a.classRank, 1, 50) || a.maxDepth !== undefined || (a.barrier !== undefined && !safeInt(a.barrier, 0, 100_000)) ||
    (a.regen !== undefined && !safeInt(a.regen, 0, 10_000)) || (a.might !== undefined && (typeof a.might !== 'object' || a.might === null ||
    !Object.entries(a.might).every(([k, n]) => isRpgDamageKind(k) && safeInt(n, 0, 1_000)))))) return false
  if (!SAFE_ID.test(a.id) || !rpgClasses(version).includes(a.classId) || !Array.isArray(a.weapons) || !validRpgWeapons(a.classId, a.weapons, version) ||
    !safeInt(a.tier, 1, 1_000_000) || !safeInt(a.level, 1, 50) || !validStats(a.stats as unknown as Record<string, unknown>, ALLY_STATS) ||
    !safeInt(a.mp, 0, a.stats.mp) || (a.orb !== undefined && !isRpgDamageKind(a.orb)) || (a.maxDepth !== undefined && !safeInt(a.maxDepth, 0, 5)) ||
    (a.evasion !== undefined && !safeInt(a.evasion, 0, 500)) || (a.limitStart !== undefined && !safeInt(a.limitStart, 0, BATTLE_LIMIT_MAX)) ||
    !Array.isArray(a.tree) || !Array.isArray(a.legacy) || !Array.isArray(a.loadout) ||
    a.loadout.length > rpgActiveSlots(a.level, version) || a.tree.length > RPG_MAX_TREE_NODES || a.legacy.length > RPG_MAX_LEGACY_SLOTS) return false
  if (!validAccessory(a, version)) return false
  if (!validRpgTree({ ...a, classRank: battleClassRank(a) }) || a.legacy.some((r) => r.tier >= a.tier || !rpgNode(r.id))) return false
  const keys = a.loadout.map(rpgNodeKey)
  return new Set(keys).size === keys.length && a.loadout.filter((r) => r.tier < a.tier).length <= RPG_MAX_LEGACY_SLOTS &&
    a.loadout.every((ref) => battleSkillFor(a, ref, version) !== null)
}
/** v19 (CV8, CV10): a Tier 0 fights only in Tier 1's world, at Class Rank 1–10; a Tier 1 class in Tier 1's world only from
 * Class Rank 10 (she opens it at 10); in later worlds every Tier 1 class from Class Rank 1. */
function validTierOfClass(a: BattleAlly): boolean {
  if (rpgIsTier0(a.classId)) return a.tier === 1 && safeInt(a.classRank, 1, RPG_TIER0_MAX_RANK)
  return a.tier !== 1 || safeInt(a.classRank, RPG_TIER0_MAX_RANK, 50)
}
/** v11 (D124): two Orbs' kinds instead of one, and the accessories' defensive effects, each within its bounds. From v15
 * (D179) no Orb kinds: an Orb's flat offense arrives in `might` (H57). */
function validCharms(a: BattleAlly, version: BattleInput['version']): boolean {
  const shares = [a.lifesteal, a.mpSteal, a.guard, a.resist, a.thorns, a.mirror]
  if (version >= 17 && [a.barrier, a.veil, a.regen, a.mpRegen, ...shares].some((v) => v !== undefined)) return false
  if (version < 11) return a.orbs === undefined && a.veil === undefined && a.mpRegen === undefined && shares.every((v) => v === undefined)
  if (version >= 15 && a.orbs !== undefined) return false
  return a.orb === undefined && (a.orbs === undefined || (Array.isArray(a.orbs) && a.orbs.length <= 2 && a.orbs.every(isRpgDamageKind) &&
    new Set(a.orbs).size === a.orbs.length)) && (a.veil === undefined || safeInt(a.veil, 0, 100_000)) &&
    (a.mpRegen === undefined || safeInt(a.mpRegen, 0, 10_000)) && shares.every((v) => v === undefined || safeInt(v, 0, 1000))
}
/** v17 (H75, D212): her accessory's base form and her signature, each refused before v17. `flat` 0–1,000 a kind; a Bell
 * of one of her weapons' kinds at 1–3,000 per mille; an Insignia 1–1,000 per mille; `signature` 0–1,000. One slot (WP19):
 * at most one of a non-empty `flat`, a `bell` and an `insignia` (R3 relaxes it with the slot count). */
function validAccessory(a: BattleAlly, version: BattleInput['version']): boolean {
  const { flat, bell, insignia, signature } = a
  if (flat === undefined && bell === undefined && insignia === undefined && signature === undefined) return true
  if (!rpgRework('economy', version)) return false
  const record = (v: unknown, keys: number) => !!v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === keys
  if (flat !== undefined && (!flat || typeof flat !== 'object' || Array.isArray(flat) ||
    !Object.entries(flat).every(([k, n]) => isRpgDamageKind(k) && safeInt(n, 0, 1_000)))) return false
  if (bell !== undefined && (!record(bell, 2) || !isRpgDamageKind(bell.kind) || !safeInt(bell.power, 1, 3_000) ||
    !a.weapons.some((w) => isRpgWeapon(w) && rpgWeaponKind(w) === bell.kind))) return false
  if (insignia !== undefined && (!record(insignia, 1) || !safeInt(insignia.value, 1, 1_000))) return false
  if (signature !== undefined && !safeInt(signature, 0, 1_000)) return false
  return [flat !== undefined && Object.keys(flat).length > 0, bell !== undefined, insignia !== undefined].filter(Boolean).length <= 1
}
/** The kinds her Orbs add to every hit: v11's two, or older fights' one. */
const orbsOf = (a: BattleAlly): readonly RpgDamageKind[] | undefined => a.orbs ?? (a.orb ? [a.orb] : undefined)
/** v9 (D106): a Hero has her seat and no Heroes of her own; a Learner at most two different seats, each with a Bond Level.
 * Seats of the fight's generation: a Paladin seat only from v15 (D179). */
function validHeroes(a: BattleAlly, version: BattleInput['version']): boolean {
  if (a.hero !== undefined && (!isHeroLimitId(a.hero, version) || a.inherits !== undefined)) return false
  if (a.inherits === undefined) return true
  return Array.isArray(a.inherits) && a.inherits.length >= 1 && a.inherits.length <= LEARNER_MAX_PARENTS &&
    new Set(a.inherits.map((i) => i?.limit)).size === a.inherits.length &&
    a.inherits.every((i) => !!i && typeof i === 'object' && Object.keys(i).length === 3 && isHeroLimitId(i.limit, version) &&
      safeInt(i.bond, 0, BOND_MAX_LEVEL) && typeof i.from === 'string' && SAFE_ID.test(i.from) && i.from !== a.id)
}
function validEnemy(e: BattleEnemy, version: BattleInput['version']): boolean {
  const w = e.weaknesses
  if (e.element2 !== undefined && (version < 7 || !RPG_ELEMENTS.includes(e.element2) || e.element2 === e.element)) return false
  if (e.twice !== undefined && (version < 7 || typeof e.twice !== 'boolean')) return false
  // v14 (D169): the Rift's traits. A ward names a channel; a foe acts twice or three times, never both.
  if (e.ward !== undefined && (version < 14 || (e.ward !== 'physical' && e.ward !== 'magical'))) return false
  if (e.thrice !== undefined && (version < 14 || typeof e.thrice !== 'boolean')) return false
  if (e.mixedLocks !== undefined && (version < 14 || typeof e.mixedLocks !== 'boolean')) return false
  if (e.twice && e.thrice) return false
  const set = <T>(list: unknown, all: readonly T[]) => Array.isArray(list) && list.length <= all.length &&
    list.every((k) => all.includes(k as T)) && new Set(list).size === list.length
  return SAFE_ID.test(e.id) && SAFE_ID.test(e.castId) && RPG_ELEMENTS.includes(e.element) &&
    ['regular', 'sub-boss', 'boss'].includes(e.rank) && safeInt(e.level, 1, 1_000_000) &&
    validStats(e.stats as unknown as Record<string, unknown>, ENEMY_STATS) && safeInt(e.shield, 1, 20) &&
    !!w && set(w.weapons, RPG_WEAPON_KINDS) && set(w.elements, RPG_ELEMENTS) && w.weapons.length + w.elements.length >= 1 &&
    Array.isArray(e.moves) && e.moves.length >= 1 && e.moves.length <= 8 && e.moves.every((m) => validMove(m, version)) &&
    new Set(e.moves.map((m) => m.id)).size === e.moves.length &&
    (e.phaseTwo === undefined || (safeInt(e.phaseTwo.thresholdPercent, 1, 99) && e.phaseTwo.moves.length >= 1 &&
      e.phaseTwo.moves.length <= 8 && e.phaseTwo.moves.every((m) => validMove(m, version))))
}
/** Foes on the field at once: five in v6, eight from v7 (W3). Waves: up to two after the first. */
const MAX_FOES = { 6: 5, 7: 8, 8: 8, 9: 8, 10: 8, 11: 8, 12: 8, 13: 8, 14: 8, 15: 8, 16: 8, 17: 8, 18: 8, 19: 8, 20: 8 } as const
function validateInput(input: BattleInput): void {
  if (!input || !(VERSIONS as readonly number[]).includes(input.version) || !safeInt(input.seed, 0, 0xffff_ffff) || !Array.isArray(input.allies) ||
    input.allies.length !== 5 || !Array.isArray(input.enemies)) {
    throw new RangeError('Invalid battle header')
  }
  const max = MAX_FOES[input.version]
  const sized = (wave: unknown) => Array.isArray(wave) && wave.length >= 1 && wave.length <= max
  if (!sized(input.enemies) || (input.waves !== undefined && (input.version < 7 || !Array.isArray(input.waves) ||
    input.waves.length < 1 || input.waves.length > MAX_EXTRA_WAVES || !input.waves.every(sized)))) {
    throw new RangeError('Invalid battle header')
  }
  const foes = [...input.enemies, ...(input.waves ?? []).flat()]
  const ids = [...input.allies.map((a) => a.id), ...foes.map((e) => e.id)]
  if (new Set(ids).size !== ids.length) throw new RangeError('Duplicate battle unit')
  if (!input.allies.every((a) => validAlly(a, input.version))) throw new RangeError('Invalid battle ally')
  // v15 (D179, C8): one healer a party, a Paladin or a Cleric. The game checks it where a party fights; this is the backstop.
  if (input.allies.filter((a) => rpgIsHealer(a.classId, input.version)).length > 1) throw new RangeError('Invalid battle party')
  if (!foes.every((e) => validEnemy(e, input.version))) throw new RangeError('Invalid battle enemy')
}

function clone(s: BattleState): BattleState {
  return { ...s, units: s.units.map((u) => ({ ...u, statuses: u.statuses.map((x) => ({ ...x })),
    ...(u.rally ? { rally: { ...u.rally } } : {}), ...(u.charging ? { charging: { ...u.charging, locks: [...u.charging.locks] } } : {}) })),
    acted: [...s.acted], summons: s.summons.map((x) => ({ ...x, ref: { ...x.ref } })), intents: s.intents.map((i) => ({ ...i })),
    ...(s.regens ? { regens: s.regens.map((r) => ({ ...r })) } : {}) }
}
const movesOf = (s: BattleState, u: BattleUnit): BattleEnemyMove[] => {
  const e = enemyOf(s, u.id)!
  return u.phase === 2 && e.phaseTwo ? e.phaseTwo.moves : e.moves
}
/** A move of hers by id: this phase's, or from v12 either phase's, since a charged move outlasts the change (D141). */
function moveById(s: BattleState, u: BattleUnit, id: string): BattleEnemyMove | undefined {
  const own = movesOf(s, u).find((m) => m.id === id)
  if (own || s.engineVersion < 12) return own
  const e = enemyOf(s, u.id)!
  return [...e.moves, ...(e.phaseTwo?.moves ?? [])].find((m) => m.id === id)
}
const byHpShare = (s: BattleState) => (a: BattleUnit, b: BattleUnit) => a.hp / maxHp(s, a.id) - b.hp / maxHp(s, b.id) || a.id.localeCompare(b.id)
function chooseTarget(s: BattleState, e: BattleEnemy, m: BattleEnemyMove, turn = 0): string {
  if (m.target === 'self') return e.id
  if (m.target === 'all') return 'all'
  if (m.target === 'ally') return [...living(s, 'enemy')].sort(byHpShare(s))[0]?.id ?? e.id
  const allies = living(s, 'ally')
  if (m.target === 'front') return allies[0]?.id ?? ''
  if (m.target === 'lowest-hp') return [...allies].sort(byHpShare(s))[0]?.id ?? ''
  return allies[hashNumber(`${s.input.seed}:${s.round}:${e.id}${turn ? `:turn${turn}` : ''}:target`) % allies.length]?.id ?? ''
}
/** A foe's move for this round; `turn` 1 is a twice-acting foe's second (v7), `turn` 2 a thrice-acting foe's third (v14).
 * From v12 (D141) a charged move announced last round lands now at the Uma it named, and a foe charges only on her first
 * move, never two rounds running. */
function intentFor(s: BattleState, u: BattleUnit, turn = 0): BattleIntent {
  const e = enemyOf(s, u.id)!
  if (s.engineVersion >= 12 && turn === 0 && u.charging && u.charging.round === s.round - 1) {
    const target = u.charging.targetId
    const named = target === 'all' || (unit(s, target)?.hp ?? 0) > 0
    return { enemyId: e.id, moveId: u.charging.moveId, targetId: named ? target : chooseTarget(s, e, moveById(s, u, u.charging.moveId)!, turn) }
  }
  const all = movesOf(s, u)
  const rested = s.engineVersion >= 12 && (turn > 0 || !!u.charging || u.charged === s.round - 1)
  const moves = rested && all.some((m) => !m.charge) ? all.filter((m) => !m.charge) : all
  const move = moves[hashNumber(`${s.input.seed}:${s.round}:${e.id}:phase${u.phase}${turn ? `:turn${turn}` : ''}:move`) % moves.length]!
  return { enemyId: e.id, moveId: move.id, targetId: chooseTarget(s, e, move, turn) }
}
/** v12: a charged move just shown arms its locks, drawn by the fight's seed from her weaknesses (D141). v14 (D169): a
 * foe with mixed locks, weak to both channels, draws lock k from her Arms kinds when k is even and her elements when odd. */
function armCharges(s: BattleState): void {
  if (s.engineVersion < 12) return
  for (const intent of s.intents) {
    const u = unit(s, intent.enemyId)
    const move = u ? moveById(s, u, intent.moveId) : undefined
    if (!u || !move?.charge || u.charging || u.charged === s.round) continue
    const e = enemyOf(s, u.id)!
    const w = e.weaknesses
    const kinds: RpgDamageKind[] = [...w.weapons, ...w.elements]
    const mixed = s.engineVersion >= 14 && !!e.mixedLocks && w.weapons.length > 0 && w.elements.length > 0
    const pool = (k: number): readonly RpgDamageKind[] => (!mixed ? kinds : k % 2 === 0 ? w.weapons : w.elements)
    const locks = Array.from({ length: move.charge }, (_, k) => {
      const from = pool(k)
      return from[hashNumber(`${s.input.seed}:${s.round}:${u.id}:lock${k}`) % from.length]!
    })
    u.charging = { moveId: move.id, locks, total: move.charge, round: s.round, targetId: intent.targetId }
  }
}
/** v12: whether this shown move is a charge being gathered this round (it lands next round). */
const gathering = (s: BattleState, u: BattleUnit, move: BattleEnemyMove): boolean =>
  !!move.charge && u.charging?.moveId === move.id && u.charging.round === s.round
/** Every living foe's move by initiative; foes that act twice add a second move after everyone's first, and from v14 a
 * foe that acts three times a second with them and a third after every second (D169). */
function intentsFor(s: BattleState): BattleIntent[] {
  const order = living(s, 'enemy').sort((a, b) => enemyOf(s, b.id)!.stats.initiative - enemyOf(s, a.id)!.stats.initiative ||
    a.id.localeCompare(b.id))
  const thrice = (u: BattleUnit) => s.engineVersion >= 14 && !!enemyOf(s, u.id)!.thrice
  return [...order.map((u) => intentFor(s, u)), ...order.filter((u) => enemyOf(s, u.id)!.twice || thrice(u)).map((u) => intentFor(s, u, 1)),
    ...order.filter(thrice).map((u) => intentFor(s, u, 2))]
}
function reveal(s: BattleState): BattleCue[] {
  return s.intents.map((i) => {
    const u = unit(s, i.enemyId)!
    const move = moveById(s, u, i.moveId)!
    return { kind: 'intent' as const, actorId: i.enemyId, targetId: i.targetId, label: gathering(s, u, move) ? `Charging: ${move.label}` : move.label }
  })
}

/** v16 (UT6): what her Flourish puts on her unit as the fight starts. Clean break a Barrier of 4% of her max HP, the
 * skill Barrier (`cover`), so it absorbs any damage first and lapses at round 1's end; Even pace and Late reserve the 4%
 * they can mend this fight. Nothing for anyone else, so older states hash as they did. */
function flourishStart(a: BattleAlly, version: BattleInput['version']): Pick<BattleUnit, 'cover' | 'flourish'> {
  if (!a.flourish || !rpgRework('fight', version)) return {}
  const share = Math.round(a.stats.hp * BATTLE_FLOURISH_SHARE)
  if (a.flourish !== 'clean-break') return { flourish: share }
  return share > 0 ? { cover: share } : {}
}

export function createBattle(source: BattleInput): BattleStep {
  validateInput(source)
  const input = JSON.parse(JSON.stringify(source)) as BattleInput
  const base = { statuses: [], barrier: 0, phase: 1 as const, guardingFor: null, brokenAt: 0, revived: false, limit: 0 }
  const units: BattleUnit[] = [
    ...input.allies.map((a) => ({ ...base, id: a.id, side: 'ally' as const, hp: a.stats.hp, mp: a.mp, shield: 0, limit: a.limitStart ?? 0, barrier: a.barrier ?? 0,
      ...(input.version >= 11 ? { veil: a.veil ?? 0 } : {}), ...flourishStart(a, input.version) })),
    ...input.enemies.map((e) => ({ ...base, id: e.id, side: 'enemy' as const, hp: e.stats.hp, mp: 0, shield: e.shield })),
  ]
  const state: BattleState = { engineVersion: input.version, input, round: 1, units, acted: [], summons: [], intents: [], outcome: 'active',
    ...(input.waves?.length ? { wave: 0 } : {}) }
  state.intents = intentsFor(state)
  armCharges(state)
  // v16: Clean break's Barrier, her own, shown before the foes' opening moves.
  const opening: BattleCue[] = units.filter((u) => u.side === 'ally' && u.cover)
    .map((u) => ({ kind: 'cover', actorId: u.id, targetId: u.id, amount: u.cover, label: 'Flourish' }))
  return { state, cues: [...opening, ...reveal(state)], hash: battleStateHash(state) }
}

/** A hit is weak when its kind is on the foe's lists, or it is Light or Dark against a Hexed foe. */
export function battleHitIsWeak(enemy: BattleEnemy, foe: BattleUnit | null, kind: RpgDamageKind | null): boolean {
  if (kind === null) return false
  return (enemy.weaknesses.weapons as string[]).includes(kind) || (enemy.weaknesses.elements as string[]).includes(kind) ||
    (!!foe && stacks(foe, 'hex') > 0 && (kind === 'light' || kind === 'dark'))
}

/** `orbs`: the attacker's Orb kinds, which make a hit weak too (D86, D124), with no damage of their own. `best` (v15, C3):
 * a Learner's inherited Limit Break hits with the higher of her ATK and M.ATK; its kinds still pick Might and weaknesses.
 * `label` (v17): the hit's cue label when no guard or ward names it (the Bell's, H75). */
interface HitOptions { special?: RpgSkillDef['special']; area?: boolean; orbs?: readonly RpgDamageKind[]; best?: boolean; label?: string }
/** One part's final amount; shared by live play, previews and the simulator. `warded`: the foe's ward cut it (v14). */
export function battleDamage(s: BattleState, attacker: BattleUnit, defender: BattleUnit, channel: BattleChannel,
  power: number, kind: RpgDamageKind | null, options: HitOptions = {}): { amount: number; weak: boolean; warded: boolean } {
  const atk = allyOf(s, attacker.id)?.stats ?? enemyOf(s, attacker.id)!.stats
  const def = allyOf(s, defender.id)?.stats ?? enemyOf(s, defender.id)!.stats
  // The weapon a hit is made with adds its Might to offense (v8, D104; from v13 by D142's table); v12 alone took Might as
  // a percent on the hit (D141).
  const ratio = s.engineVersion >= 12
  const percent = s.engineVersion === 12
  const ally = attacker.side === 'ally' ? allyOf(s, attacker.id) : undefined
  const might = ally && kind !== null ? ally.might?.[kind] ?? 0 : 0
  // v17, the damage stack's step 1 (WP31, H75): her signature joins her ATK and M.ATK, and her accessory's flat offense on
  // the hit's own kind joins its weapon's Might. Heals never come here, so neither reaches a mend or a Barrier.
  const v17 = rpgRework('economy', s.engineVersion)
  const added = v17 && ally ? (ally.signature ?? 0) + (kind !== null ? ally.flat?.[kind] ?? 0 : 0) : 0
  const offense = (options.best ? Math.max(atk.atk, atk.matk) : channel === 'physical' ? atk.atk : atk.matk) + (percent ? 0 : might) + added
  const defense = channel === 'physical' ? def.pdef : def.mdef
  // From v12: offense² ÷ (offense + defense), so the same ratio gives the same share at every level and never zero.
  let amount = ratio ? (offense > 0 ? (offense * offense) / (offense + defense) : 0) * power * (percent ? 1 + might / 100 : 1)
    : Math.max(offense * BATTLE_MIN_OFFENSE_SHARE, offense - defense * BATTLE_DEFENSE_SHARE) * power
  const foe = defender.side === 'enemy' ? enemyOf(s, defender.id)! : null
  const weak = !!foe && attacker.side === 'ally' && (battleHitIsWeak(foe, defender, kind) || !!options.orbs?.some((o) => battleHitIsWeak(foe, defender, o)))
  if (weak) amount *= BATTLE_WEAK
  // v17, step 4 (WP23, H75): her Insignia, a factor of its own, on a sub-boss or a boss (by rank).
  const insignia = v17 && ally && foe && foe.rank !== 'regular' ? ally.insignia?.value ?? 0 : 0
  if (insignia > 0) amount *= 1 + insignia / 1000
  const physical = channel === 'physical'
  amount *= 1 + stacks(attacker, physical ? 'brave' : 'faith') * BATTLE_STATUS_STEP
  amount *= 1 + stacks(attacker, 'power-up') * BATTLE_FOE_STATUS_STEP
  amount *= 1 - (stacks(attacker, 'weaken') + stacks(attacker, 'slow')) * BATTLE_FOE_STATUS_STEP
  amount *= 1 - stacks(attacker, 'enfeeble') * BATTLE_STATUS_STEP
  amount *= 1 + (stacks(defender, physical ? 'armor-break' : 'mind-break') + stacks(defender, 'shock') + stacks(defender, 'mark')) * BATTLE_STATUS_STEP
  amount *= 1 - stacks(defender, 'ward') * BATTLE_FOE_STATUS_STEP
  amount *= 1 - stacks(defender, 'aegis') * BATTLE_STATUS_STEP
  if (stacks(defender, 'hex') > 1) amount *= 1 + BATTLE_STATUS_STEP
  if (foe && options.special === 'vs-broken' && battleBroken(defender)) amount *= 1.3
  if (foe && options.special === 'vs-wounded' && defender.hp * 2 < foe.stats.hp) amount *= 1.3
  if (foe && !battleBroken(defender) && options.special !== 'pierce') amount *= BATTLE_UNBROKEN_FACTOR
  // v14 (D169): the Rift's ward halves an ally's hit of the channel she wards again, Broken or not, `pierce` or not.
  const warded = s.engineVersion >= 14 && !!foe && attacker.side === 'ally' && foe.ward === channel
  if (warded) amount *= BATTLE_WARD_FACTOR
  const evasion = defender.side === 'ally' ? allyOf(s, defender.id)?.evasion ?? 0 : 0
  if (evasion > 0) amount *= 1 - evasion / 1000
  // v11: an Iron Talisman or a Ward Amulet cuts the damage she takes of its channel (D124).
  const cut = defender.side === 'ally' ? (physical ? allyOf(s, defender.id)?.guard : allyOf(s, defender.id)?.resist) ?? 0 : 0
  if (cut > 0) amount *= 1 - cut / 1000
  return { amount: Math.max(1, Math.round(amount)), weak, warded }
}

/** What a foe's shown move would deal to each Uma it aims at, before Barriers and guards: one number per target, for
 * the intent line (combat-balance.md §6.0). Moves that deal no damage give none. */
export function battleIntentDamage(s: BattleState, intent: BattleIntent): { targetId: string; amount: number }[] {
  const actor = unit(s, intent.enemyId)
  const move = actor ? moveById(s, actor, intent.moveId) : undefined
  // A charge being gathered deals nothing this round; one landing now hits at the share of its locks left (v12).
  if (!actor || !move || move.kind !== 'damage' || gathering(s, actor, move)) return []
  const share = move.charge ? (actor.charging?.moveId === move.id ? actor.charging.locks.length / actor.charging.total : 0) : 1
  if (share <= 0) return []
  const targets = intent.targetId === 'all' ? living(s, 'ally') : [unit(s, intent.targetId)].filter((u): u is BattleUnit => !!u && u.hp > 0)
  return targets.map((t) => ({ targetId: t.id, amount: battleDamage(s, actor, t, move.channel, (move.power * share) / 100, move.element, { area: move.target === 'all' }).amount }))
}

// --- v12 support (D141): mends, Barriers, revives, Rally, locks; v15's one healer (classes v2 §3.3, §4) ---------------

/** What raises her mends, Barriers and revives: to v14 her Heal, ×(1 + Heal ÷ 300), Heal from Guts (`dexterity`). From
 * v15 (§3.3) her offense instead, ×(1 + it ÷ 300): the Paladin's ATK, the Cleric's M.ATK, anyone else's higher of the two
 * (a hall's healing Limit Break). Her fight stats hold her base, Extra Stats and armor; weapon Might is apart. */
function healOf(s: BattleState, actorId: string): number {
  const a = allyOf(s, actorId)
  if (s.engineVersion < 15) return 1 + (a?.stats.dexterity ?? 0) / BATTLE_HEAL_SCALE
  const offense = !a ? 0 : a.classId === 'paladin' ? a.stats.atk : a.classId === 'cleric' ? a.stats.matk : Math.max(a.stats.atk, a.stats.matk)
  return 1 + offense / BATTLE_HEAL_OFFENSE_SCALE
}
/** The Uma who most needs a mend: the lowest share of HP among the living. */
const mostHurt = (s: BattleState): BattleUnit | undefined => [...living(s, 'ally')].sort(byHpShare(s))[0]
/** What the shown moves would deal her this round, less the Barrier she has. */
function threatOn(s: BattleState, allyId: string): number {
  let total = 0
  for (const intent of s.intents) {
    const foe = unit(s, intent.enemyId)
    if (!foe || foe.hp <= 0 || battleBroken(foe)) continue
    for (const d of battleIntentDamage(s, intent)) if (d.targetId === allyId) total += d.amount
  }
  return Math.max(0, total - (unit(s, allyId)?.cover ?? 0))
}
/** The Uma the shown moves threaten most; with nothing aimed, the most hurt. */
function mostThreatened(s: BattleState): BattleUnit | undefined {
  const scored = living(s, 'ally').map((u) => ({ u, t: threatOn(s, u.id) })).filter((x) => x.t > 0)
    .sort((a, b) => b.t - a.t || byHpShare(s)(a.u, b.u))
  return scored[0]?.u ?? mostHurt(s)
}
type Reach = NonNullable<RpgSupport['mend'] | RpgSupport['shield']>
/** The Umas a mend or Barrier reaches: every Uma standing, the most hurt, or the one the shown moves threaten most. */
function reach(s: BattleState, how: Reach): BattleUnit[] {
  if (how === 'all') return living(s, 'ally')
  const u = how === 'hurt' ? mostHurt(s) : mostThreatened(s)
  return u ? [u] : []
}
/** One Uma's mend or Barrier: `share` of her max HP × `boost`, and ×0.4 when it reaches every Uma. */
const portion = (s: BattleState, u: BattleUnit, how: Reach, share: number, boost: number): number =>
  maxHp(s, u.id) * share * boost * (how === 'all' ? RPG_SUPPORT_ALL : 1)
function heal(s: BattleState, actorId: string, target: BattleUnit, amount: number, cues: BattleCue[], label?: string): void {
  const healed = Math.min(Math.round(amount), maxHp(s, target.id) - target.hp)
  if (healed <= 0 || target.hp <= 0) return
  target.hp += healed
  cues.push({ kind: 'heal', actorId, targetId: target.id, amount: healed, ...(label ? { label } : {}) })
}
/** A skill's Barrier: it absorbs any damage first, up to 40% of her max HP (60% from v15, C8), until the end of the round. */
function cover(s: BattleState, actorId: string, target: BattleUnit, amount: number, cues: BattleCue[]): void {
  const now = target.cover ?? 0
  const next = Math.min(Math.round(maxHp(s, target.id) * (s.engineVersion >= 15 ? BATTLE_COVER_CAP_V15 : BATTLE_COVER_CAP)), now + Math.round(amount))
  if (next > now) { target.cover = next; cues.push({ kind: 'cover', actorId, targetId: target.id, amount: next }) }
}
const FOE_AILMENTS: readonly RpgStatusKind[] = ['burn', 'mark', 'weaken', 'slow']
const bless = (s: BattleState, actor: BattleUnit, u: BattleUnit, status: 'aegis', stacks: number, cues: BattleCue[]): void => {
  addStatus(u, status, stacks)
  cues.push({ kind: 'status', actorId: actor.id, targetId: u.id, label: status, amount: stacks })
}
/** A skill's support after its hits (D141). To v14 a `scale` under 1 is a lingering summon (at a round's end, or its
 * farewell strike): it only mends, shields and drains, at that share. From v15 it is a Limit Break's strength (a Learner's
 * capacity), which scales the shares alone: its cleanse and revive still land. `dealt` is what the skill's hits took off foes. */
function support(s: BattleState, actor: BattleUnit, sup: RpgSupport, dealt: number, cues: BattleCue[], scale = 1): void {
  const boost = healOf(s, actor.id) * scale
  if (sup.mend) for (const u of reach(s, sup.mend)) heal(s, actor.id, u, portion(s, u, sup.mend, sup.share, boost), cues)
  if (sup.shield) {
    for (const u of reach(s, sup.shield)) {
      cover(s, actor.id, u, portion(s, u, sup.shield, sup.shieldShare ?? sup.share, boost), cues)
      // v15: the Paladin's Greatsword blows give Aegis to each Uma their Barrier reaches.
      if (sup.aegis) bless(s, actor, u, 'aegis', sup.aegis, cues)
    }
  }
  if (sup.drain && dealt > 0) { const u = mostHurt(s); if (u) heal(s, actor.id, u, dealt * sup.drain, cues, 'Drain') }
  if (scale < 1 && s.engineVersion < 15) return
  if (sup.cleanse) {
    for (const u of living(s, 'ally')) {
      const ailment = FOE_AILMENTS.find((k) => stacks(u, k) > 0)
      if (!ailment) continue
      u.statuses = u.statuses.filter((x) => x.kind !== ailment)
      cues.push({ kind: 'status', actorId: actor.id, targetId: u.id, label: `${ailment} cleansed` })
    }
  }
  if (sup.revive) {
    // The first fallen Uma in party order rises at a quarter of her HP, once a fight.
    const fallen = s.units.find((u) => u.side === 'ally' && u.hp <= 0 && !u.revived)
    if (fallen) {
      const top = maxHp(s, fallen.id)
      fallen.revived = true
      fallen.hp = Math.max(1, Math.min(top, Math.round(top * BATTLE_REVIVE_SHARE * healOf(s, actor.id))))
      fallen.statuses = []
      cues.push({ kind: 'heal', actorId: actor.id, targetId: fallen.id, amount: fallen.hp, label: 'Revived' })
    }
  }
  if (sup.bless) for (const u of living(s, 'ally')) bless(s, actor, u, sup.bless.status, sup.bless.stacks, cues)
  // v15: a Cleric's Light spell leaves Regen, replacing her last (§4).
  if (sup.regen && sup.mend) {
    s.regens = [...(s.regens ?? []).filter((r) => r.allyId !== actor.id),
      { allyId: actor.id, mend: sup.mend, share: sup.share * scale * BATTLE_REGEN_SHARE, rounds: BATTLE_REGEN_ROUNDS }]
  }
}
/** v15 (§4): at a round's end each Regen mends again, at its Cleric's scaling, for its round ends left; it ends if she has
 * fallen. Foes strike only between the Umas' turns and a round's end, so a fallen Cleric's Regen never outlives her. */
function regenerate(s: BattleState, cues: BattleCue[]): void {
  s.regens &&= s.regens.filter((r) => {
    if (!(unit(s, r.allyId)!.hp > 0)) return false
    const boost = healOf(s, r.allyId)
    for (const u of reach(s, r.mend)) heal(s, r.allyId, u, portion(s, u, r.mend, r.share, boost), cues, 'Regen')
    return --r.rounds > 0
  })
}
/** What a support would do now, in shares of max HP restored or shielded across the party, plus 1 for a revive and 0.3
 * for a status: for Auto and the simulator (D141). It follows the same targets the support would take. */
export function battleSupportValue(s: BattleState, actorId: string, sup: RpgSupport | undefined): number {
  if (!sup || s.engineVersion < 12) return 0
  const actor = unit(s, actorId)
  if (!actor) return 0
  const boost = healOf(s, actorId)
  const missing = (u: BattleUnit) => 1 - u.hp / maxHp(s, u.id)
  const threat = (u: BattleUnit) => threatOn(s, u.id) / maxHp(s, u.id)
  let value = 0
  if (sup.mend === 'all') for (const u of living(s, 'ally')) value += Math.min(missing(u), sup.share * boost * RPG_SUPPORT_ALL)
  else if (sup.mend === 'hurt') { const u = mostHurt(s); if (u) value += Math.min(missing(u), sup.share * boost) }
  // v15: Regen repeats that mend twice at 0.3, valued at half weight, since the hurt may not need it.
  if (sup.regen) value *= 1 + BATTLE_REGEN_SHARE * BATTLE_REGEN_ROUNDS / 2
  const shield = sup.shieldShare ?? sup.share
  if (sup.shield === 'all') for (const u of living(s, 'ally')) value += Math.min(threat(u), shield * boost * RPG_SUPPORT_ALL)
  else if (sup.shield === 'threatened') { const u = mostThreatened(s); if (u) value += Math.min(threat(u), shield * boost) }
  if (sup.revive && s.units.some((u) => u.side === 'ally' && u.hp <= 0 && !u.revived)) value += 1
  if (sup.cleanse && living(s, 'ally').some((u) => FOE_AILMENTS.some((k) => stacks(u, k) > 0))) value += 0.1
  if (sup.bless || sup.curse || sup.aegis) value += 0.05
  return value
}
/** v12: a foe Broken or defeated gives back every Rally she left (D141). */
function rallyBack(s: BattleState, foe: BattleUnit, cues: BattleCue[]): void {
  if (s.engineVersion < 12) return
  for (const u of living(s, 'ally')) {
    if (u.rally?.from !== foe.id) continue
    heal(s, u.id, u, u.rally.amount, cues, 'Rally')
    delete u.rally
  }
}
/** v12: a foe falls: her Rallies come back and her charge ends with her. */
function foeDown(s: BattleState, foe: BattleUnit, cues: BattleCue[]): void {
  if (s.engineVersion < 12) return
  rallyBack(s, foe, cues)
  delete foe.charging
}
/** v12: a hit of a lock's kind breaks it (each of her Orbs' kinds too). Breaking the last cancels the charge. */
function popLocks(s: BattleState, actor: BattleUnit, foe: BattleUnit, kinds: readonly RpgDamageKind[], cues: BattleCue[]): void {
  const c = foe.charging
  if (s.engineVersion < 12 || !c || foe.hp <= 0) return
  for (const kind of kinds) {
    const at = c.locks.indexOf(kind)
    if (at < 0) continue
    c.locks.splice(at, 1)
    cues.push({ kind: 'lock', actorId: actor.id, targetId: foe.id, amount: c.locks.length, label: kind })
    if (c.locks.length === 0) { cancelCharge(s, actor, foe, cues); return }
  }
}
function cancelCharge(s: BattleState, actor: BattleUnit, foe: BattleUnit, cues: BattleCue[]): void {
  const c = foe.charging
  if (!c) return
  delete foe.charging
  foe.charged = s.round
  cues.push({ kind: 'cancel', actorId: actor.id, targetId: foe.id, label: moveById(s, foe, c.moveId)?.label ?? 'Charge' })
}

function guardOf(s: BattleState, target: BattleUnit): BattleUnit {
  return s.units.find((u) => u.side === target.side && u.hp > 0 && u.guardingFor === target.id) ?? target
}
function terminal(s: BattleState, cues: BattleCue[]): boolean {
  const allies = living(s, 'ally').length, enemies = living(s, 'enemy').length
  if (allies && (enemies || wavesLeft(s))) return false
  // A party with nobody standing never clears, even if the last foe fell on the same tick.
  s.outcome = allies ? 'victory' : 'loss'
  s.intents = []
  cues.push({ kind: 'result', label: s.outcome })
  return true
}

/** Removes shield points; at zero the foe Breaks. */
function chip(s: BattleState, actor: BattleUnit, foe: BattleUnit, points: number, cues: BattleCue[]): void {
  if (battleBroken(foe) || foe.shield === 0 || foe.hp <= 0 || points <= 0 || foe.steeled) return
  foe.shield = Math.max(0, foe.shield - points)
  cues.push({ kind: 'shield', actorId: actor.id, targetId: foe.id, amount: foe.shield })
  if (foe.shield === 0) {
    foe.brokenAt = s.round
    cues.push({ kind: 'break', actorId: actor.id, targetId: foe.id })
    if (s.engineVersion >= 12) {
      // A Break strips her buffs and cancels her charge, and the party wins back what she took (D141).
      const buffs = foe.statuses.filter((x) => x.kind === 'power-up' || x.kind === 'ward')
      if (buffs.length) {
        foe.statuses = foe.statuses.filter((x) => !buffs.includes(x))
        cues.push({ kind: 'status', actorId: actor.id, targetId: foe.id, label: 'Buffs stripped' })
      }
      cancelCharge(s, actor, foe, cues)
      rallyBack(s, foe, cues)
    }
  }
}

/** Applies one hit's parts; a weak hit on a standing shield removes a point (two with a Breaker charge). */
function strike(s: BattleState, actor: BattleUnit, target: BattleUnit, hit: RpgHit, scale: number, cues: BattleCue[],
  intercept: boolean, options: HitOptions = {}): { receiver: BattleUnit; weak: boolean } {
  const receiver = intercept ? guardOf(s, target) : target
  let anyWeak = false
  for (const part of hit.parts) {
    if (receiver.hp <= 0) break
    const channel = battleChannel(part.kind)
    const result = battleDamage(s, actor, receiver, channel, hit.power * part.share * scale, part.kind, options)
    const amount = receiver !== target ? Math.max(1, Math.round(result.amount * BATTLE_GUARD_FACTOR)) : result.amount
    receiver.hp = Math.max(0, receiver.hp - amount)
    cues.push({ kind: 'hit', actorId: actor.id, targetId: receiver.id, amount, channel, element: part.kind, weak: result.weak,
      label: receiver !== target ? 'Intercepted' : result.warded ? 'Warded' : options.label })
    if (actor.side === 'ally') drain(s, actor, channel, amount, cues)
    if (receiver.side === 'enemy') popLocks(s, actor, receiver, [part.kind, ...(options.orbs ?? [])], cues)
    if (receiver.hp === 0) {
      cues.push({ kind: 'ko', actorId: actor.id, targetId: receiver.id })
      if (receiver.side === 'enemy') foeDown(s, receiver, cues)
      break
    }
    if (!result.weak || battleBroken(receiver) || receiver.shield === 0) continue
    anyWeak = true
    const charge = actor.side === 'ally' && stacks(actor, 'breaker') > 0
    if (charge) {
      const status = actor.statuses.find((x) => x.kind === 'breaker')!
      status.stacks -= 1
      if (!status.stacks) actor.statuses = actor.statuses.filter((x) => x !== status)
    }
    chip(s, actor, receiver, charge ? 2 : 1, cues)
  }
  return { receiver, weak: anyWeak }
}

/** v11: a Vampire Talisman heals her from the physical damage she deals, a Siphon Amulet restores MP from the magical. */
function drain(s: BattleState, actor: BattleUnit, channel: BattleChannel, amount: number, cues: BattleCue[]): void {
  const ally = allyOf(s, actor.id)
  if (!ally || actor.hp <= 0) return
  if (channel === 'physical' && ally.lifesteal) {
    const healed = Math.min(Math.floor(amount * ally.lifesteal / 1000), maxHp(s, actor.id) - actor.hp)
    if (healed > 0) { actor.hp += healed; cues.push({ kind: 'status', actorId: actor.id, targetId: actor.id, label: `Lifesteal +${healed}`, amount: healed }) }
  } else if (channel === 'magical' && ally.mpSteal) {
    const gained = Math.min(Math.floor(amount * ally.mpSteal / 1000), ally.stats.mp - actor.mp)
    if (gained > 0) { actor.mp += gained; cues.push({ kind: 'mp', actorId: actor.id, targetId: actor.id, amount: gained }) }
  }
}

/** Damage from a foe to an ally: a Barrier absorbs first (v11: a Barrier physical damage, a Veil magical damage), and a
 * Thorn Talisman or a Mirror Amulet returns a share of it to the foe (D124): of what she took, and from v15 (§6.3) a
 * guard's of the whole hit she intercepted, before her guard halved it. */
function harm(s: BattleState, actor: BattleUnit, target: BattleUnit, move: BattleEnemyMove, cues: BattleCue[], intercept: boolean): void {
  const receiver = intercept ? guardOf(s, target) : target
  const result = battleDamage(s, actor, receiver, move.channel, move.power / 100, move.element, { area: move.target === 'all' })
  let amount = receiver !== target ? Math.max(1, Math.round(result.amount * BATTLE_GUARD_FACTOR)) : result.amount
  const taken = s.engineVersion >= 15 ? result.amount : amount
  const v11 = s.input.version >= 11
  // v12 (D141): a skill's Barrier absorbs any damage first.
  const covered = Math.min(receiver.cover ?? 0, amount)
  if (covered > 0) { receiver.cover = (receiver.cover ?? 0) - covered; amount -= covered }
  const useVeil = v11 && move.channel === 'magical'
  const pool = useVeil ? receiver.veil ?? 0 : receiver.barrier
  const absorbed = Math.min(pool, amount)
  if (useVeil) receiver.veil = pool - absorbed
  else receiver.barrier -= absorbed
  amount -= absorbed
  receiver.hp = Math.max(0, receiver.hp - amount)
  const shields = [covered && `Barrier −${covered}`, absorbed && `${useVeil ? 'Veil' : s.engineVersion >= 12 ? 'Bulwark' : 'Barrier'} −${absorbed}`].filter(Boolean).join(' · ')
  cues.push({ kind: 'hit', actorId: actor.id, targetId: receiver.id, amount, channel: move.channel, element: move.element, weak: false,
    label: receiver !== target ? 'Intercepted' : shields || undefined })
  if (receiver.hp === 0) cues.push({ kind: 'ko', actorId: actor.id, targetId: receiver.id })
  if (s.engineVersion >= 12) {
    // Rally: part of the last foe hit she took, won back if that foe is Broken or defeated before she moves again.
    if (receiver.hp > 0 && amount > 0) receiver.rally = { from: actor.id, amount: Math.round(amount * BATTLE_RALLY_SHARE) }
    else if (receiver.hp === 0) delete receiver.rally
  }
  const ally = v11 ? allyOf(s, receiver.id) : undefined
  const share = ally ? (move.channel === 'physical' ? ally.thorns : ally.mirror) ?? 0 : 0
  const back = Math.floor(taken * share / 1000)
  if (back > 0 && actor.hp > 0) {
    actor.hp = Math.max(0, actor.hp - back)
    cues.push({ kind: 'hit', actorId: receiver.id, targetId: actor.id, amount: back, channel: move.channel, element: null, weak: false,
      label: move.channel === 'physical' ? 'Thorns' : 'Mirror' })
    if (actor.hp === 0) { cues.push({ kind: 'ko', actorId: receiver.id, targetId: actor.id }); foeDown(s, actor, cues) }
  }
}

/** When the wave on the field falls and another waits (v7), it enters at the start of a fresh round: the party keeps
 * its HP, MP, statuses, Limit charge and lingering summons, and everyone acts again. */
function nextWave(s: BattleState, cues: BattleCue[]): boolean {
  if (!wavesLeft(s) || living(s, 'enemy').length || !living(s, 'ally').length) return false
  const foes = s.input.waves![s.wave ?? 0]!
  s.wave = (s.wave ?? 0) + 1
  const base = { statuses: [], barrier: 0, phase: 1 as const, guardingFor: null, brokenAt: 0, revived: false, limit: 0, mp: 0 }
  s.units = [...s.units.filter((u) => u.side === 'ally'),
    ...foes.map((e) => ({ ...base, id: e.id, side: 'enemy' as const, hp: e.stats.hp, shield: e.shield }))]
  for (const u of s.units) u.guardingFor = null
  cues.push({ kind: 'wave', actorId: foes[0]!.id, targetId: foes[0]!.id, amount: s.wave + 1, label: `Wave ${s.wave + 1} of ${battleWaveCount(s.input)}` })
  if (s.engineVersion >= 12) {
    // A breather (D141): every Uma standing recovers a tenth of her HP as the next foes step in.
    for (const u of living(s, 'ally')) { delete u.rally; heal(s, u.id, u, maxHp(s, u.id) * BATTLE_BREATHER, cues, 'Breather') }
  }
  s.round += 1
  s.acted = []
  s.intents = intentsFor(s)
  armCharges(s)
  cues.push(...reveal(s))
  return true
}

function updatePhases(s: BattleState, cues: BattleCue[]): void {
  for (const u of living(s, 'enemy')) {
    const phase = enemyOf(s, u.id)!.phaseTwo
    if (!phase || u.phase === 2 || u.hp * 100 > maxHp(s, u.id) * phase.thresholdPercent) continue
    u.phase = 2
    cues.push({ kind: 'phase', actorId: u.id, targetId: u.id, label: 'Phase 2' })
    // Each of her moves this round changes to phase two's (two for a foe that acts twice).
    // v12: a charge she is gathering or landing stays as it is (D141).
    let turn = 0
    const nexts: BattleIntent[] = []
    s.intents = s.intents.map((i) => {
      if (i.enemyId !== u.id) return i
      if (s.engineVersion >= 12 && u.charging?.moveId === i.moveId) { turn++; return i }
      const next = intentFor(s, u, turn++)
      nexts.push(next)
      return next
    })
    if (!nexts.length && !s.intents.some((i) => i.enemyId === u.id)) nexts.push(intentFor(s, u))
    armCharges(s)
    for (const next of nexts) {
      const move = moveById(s, u, next.moveId)!
      cues.push({ kind: 'intent', actorId: u.id, targetId: next.targetId, label: gathering(s, u, move) ? `Charging: ${move.label}` : move.label })
    }
  }
}

function resolveEnemies(s: BattleState, cues: BattleCue[]): void {
  for (const u of s.units) if (u.side === 'enemy') u.guardingFor = null
  for (const intent of s.intents) {
    const actor = unit(s, intent.enemyId)
    if (!actor || actor.hp <= 0 || !living(s, 'ally').length) continue
    if (battleBroken(actor)) { cues.push({ kind: 'skip', actorId: actor.id, targetId: actor.id, label: 'Broken' }); continue }
    const source = enemyOf(s, actor.id)!
    let move = s.engineVersion >= 12 ? moveById(s, actor, intent.moveId) : movesOf(s, actor).find((m) => m.id === intent.moveId)
    if (!move) throw new RangeError('Frozen intent no longer matches phase')
    let label = move.label
    if (s.engineVersion >= 12) {
      // Her earlier hits can't be Rallied back once she moves again, and her move ends her Steel (D141).
      for (const u of s.units) if (u.side === 'ally' && u.rally?.from === actor.id) delete u.rally
      delete actor.steeled
      if (move.charge) {
        const c = actor.charging
        if (!c || c.moveId !== move.id) { cues.push({ kind: 'skip', actorId: actor.id, targetId: actor.id, label: 'Cancelled' }); continue }
        if (c.round === s.round) { cues.push({ kind: 'move', actorId: actor.id, targetId: intent.targetId, label: `Charging: ${move.label}` }); continue }
        // It lands at the share of its locks still standing.
        const share = c.locks.length / c.total
        delete actor.charging
        actor.charged = s.round
        if (share < 1) label = `${move.label} (${c.locks.length}/${c.total})`
        move = { ...move, power: Math.max(1, Math.round(move.power * share)) }
      }
    }
    cues.push({ kind: 'move', actorId: actor.id, targetId: intent.targetId, label })
    if (move.kind === 'damage' && move.target === 'all') {
      for (const target of living(s, 'ally')) {
        if (actor.hp <= 0) break
        harm(s, actor, target, move, cues, false)
        if (target.hp > 0 && move.status) { addStatus(target, move.status); cues.push({ kind: 'status', actorId: actor.id, targetId: target.id, label: move.status }) }
      }
    } else if (move.kind === 'damage' || move.kind === 'debuff') {
      const chosen = unit(s, intent.targetId)
      const target = chosen && chosen.hp > 0 ? chosen : unit(s, chooseTarget(s, source, move))
      if (!target) continue
      if (target.id !== intent.targetId) cues.push({ kind: 'intent', actorId: actor.id, targetId: target.id, label: 'Retarget' })
      if (move.kind === 'damage') harm(s, actor, target, move, cues, true)
      if (target.hp > 0 && move.status) { addStatus(target, move.status); cues.push({ kind: 'status', actorId: actor.id, targetId: target.id, label: move.status }) }
    } else if (move.kind === 'guard') {
      const ward = unit(s, chooseTarget(s, source, move))!
      actor.guardingFor = ward.id === actor.id ? null : ward.id
      cues.push({ kind: 'guard', actorId: actor.id, targetId: ward.id })
    } else if (move.status) {
      const target = unit(s, chooseTarget(s, source, move))!
      addStatus(target, move.status)
      cues.push({ kind: 'status', actorId: actor.id, targetId: target.id, label: move.status })
    }
    if (terminal(s, cues)) return
  }
  // A break ends after its second enemy phase; guards lapse; burn ticks before durations decay.
  for (const u of s.units) {
    if (u.side === 'ally') u.guardingFor = null
    if (u.hp <= 0) continue
    if (u.side === 'enemy' && battleBroken(u) && s.round >= u.brokenAt + BATTLE_BREAK_ROUNDS - 1) {
      u.brokenAt = 0
      u.shield = enemyOf(s, u.id)!.shield
      // v12 (D141): Steeled until she moves, so a party can't hold her down Break after Break.
      if (s.engineVersion >= 12) u.steeled = true
      cues.push({ kind: 'recover', actorId: u.id, targetId: u.id, amount: u.shield })
    }
    const burn = stacks(u, 'burn')
    if (burn) {
      const amount = Math.max(1, Math.round(maxHp(s, u.id) * BATTLE_BURN_PERCENT * burn))
      u.hp = Math.max(0, u.hp - amount)
      cues.push({ kind: 'hit', actorId: u.id, targetId: u.id, amount, channel: 'status', element: 'fire', weak: false, label: 'Burn' })
      if (u.hp === 0) {
        cues.push({ kind: 'ko', actorId: u.id, targetId: u.id })
        if (u.side === 'enemy') foeDown(s, u, cues)
        else delete u.rally
        continue
      }
    }
    u.statuses = u.statuses.map((x) => ({ ...x, turns: x.turns - 1 })).filter((x) => x.turns > 0)
    // v8: magical armor's Regen (D104); v11: a Vital Talisman's, and a Spring Amulet's MP (D124).
    const ally = u.side === 'ally' ? allyOf(s, u.id) : undefined
    const regen = ally?.regen ?? 0
    const healed = Math.min(regen, maxHp(s, u.id) - u.hp)
    if (healed > 0) { u.hp += healed; cues.push({ kind: 'status', actorId: u.id, targetId: u.id, label: `Regen +${healed}`, amount: healed }) }
    // v16 (UT6): her Even pace or Late reserve, after armor's Regen.
    if (ally && u.flourish) flourishMend(s, u, ally, cues)
    // v16 (SB18): the base MP regen joins the Spring's, one cue, never past her max MP. From v19 by her class's open depth.
    const mpRegen = ally ? (ally.mpRegen ?? 0) + rpgBaseMpRegen(ally.stats.mp, { classId: ally.classId, classRank: battleClassRank(ally) }, s.engineVersion) : 0
    const mp = Math.min(mpRegen, (ally?.stats.mp ?? 0) - u.mp)
    if (mp > 0) { u.mp += mp; cues.push({ kind: 'mp', actorId: u.id, targetId: u.id, amount: mp }) }
  }
  if (s.engineVersion >= 12) {
    // A skill's Barrier lasts the round it was raised in, against the moves shown (D141); then to v14 a lingering summon
    // that mends mends again, at its linger share, and from v15 each Cleric's Regen does instead (§4).
    for (const u of living(s, 'ally')) if (u.cover) u.cover = 0
    if (s.engineVersion >= 15) regenerate(s, cues)
    else for (const summon of s.summons) {
      const owner = unit(s, summon.allyId)
      const node = rpgNode(summon.ref.id)
      const sup = node && rpgNodeSkill(node, s.engineVersion).support
      if (owner && owner.hp > 0 && sup?.mend) support(s, owner, { share: sup.share, mend: sup.mend }, 0, cues, summon.scale)
    }
  }
  if (nextWave(s, cues) || terminal(s, cues)) return
  // Each wave gets the round cap, so a three-wave stage isn't rushed.
  if (s.round >= BATTLE_MAX_ROUNDS * battleWaveCount(s.input)) {
    s.outcome = 'loss'
    s.intents = []
    cues.push({ kind: 'result', label: 'loss' })
    return
  }
  s.round += 1
  s.acted = []
  s.intents = intentsFor(s)
  armCharges(s)
  cues.push(...reveal(s))
}

/** v16 (UT6): at a round's end, Even pace mends 1% of her max HP and Late reserve 2% from round 3's end, each within what
 * is left of her 4% this fight (`flourish`). Not a heal skill: no healing scale, never past her max HP; at full HP she
 * mends nothing and keeps it. Only an Uma standing reaches here. */
function flourishMend(s: BattleState, u: BattleUnit, ally: BattleAlly, cues: BattleCue[]): void {
  if (!ally.flourish || ally.flourish === 'clean-break' || (ally.flourish === 'late-reserve' && s.round < BATTLE_FLOURISH_FROM)) return
  const max = maxHp(s, u.id)
  const healed = Math.min(Math.round(max * BATTLE_FLOURISH_RATE[ally.flourish]), u.flourish ?? 0, max - u.hp)
  if (healed <= 0) return
  u.hp += healed
  u.flourish = (u.flourish ?? 0) - healed
  cues.push({ kind: 'heal', actorId: u.id, targetId: u.id, amount: healed, label: 'Flourish' })
}

function restoreMp(s: BattleState, u: BattleUnit, share: number, actorId: string, cues: BattleCue[]): void {
  const max = allyOf(s, u.id)!.stats.mp
  const gained = Math.min(max - u.mp, Math.round(max * share))
  if (gained > 0) { u.mp += gained; cues.push({ kind: 'mp', actorId, targetId: u.id, amount: gained }) }
}
function addBarrier(s: BattleState, u: BattleUnit, amount: number, actorId: string, cues: BattleCue[]): void {
  // v12: a skill's Barrier is the shield that absorbs any damage, apart from the Bulwark Talisman's (D141).
  if (s.engineVersion >= 12) { cover(s, actorId, u, amount, cues); return }
  const cap = Math.round(maxHp(s, u.id) * BATTLE_BARRIER_CAP)
  const next = Math.min(cap, u.barrier + Math.round(amount))
  if (next > u.barrier) { cues.push({ kind: 'status', actorId, targetId: u.id, label: `barrier ${next}`, amount: next }); u.barrier = next }
}

function invalid(s: BattleState, error: BattleError): BattleStep { return { state: s, cues: [], hash: battleStateHash(s), error } }

/** Skill the actor may use: learned, slotted and in her class trees. */
export function battleActorSkill(s: BattleState, actorId: string, ref: { tier: number; id: string }): BattleSkill | null {
  const a = allyOf(s, actorId)
  return a ? battleSkillFor(a, ref, s.engineVersion) : null
}

/** Random-target hits are seeded by the fight, round, actor, action and hit (and a Limit Break's cast), so a replay lands the same hits. */
function randomFoe(s: BattleState, actorId: string, hit: number, salt = 'random'): BattleUnit | undefined {
  const foes = living(s, 'enemy')
  return foes[hashNumber(`${s.input.seed}:${s.round}:${actorId}:${s.acted.length}:${hit}:${salt}`) % Math.max(1, foes.length)]
}

interface CastLog { tapped: BattleUnit; struck: BattleUnit[]; hitFoes: BattleUnit[]; weak: boolean }

/** Resolves a skill's hits, extras, riders and status, then its support at `supportScale`. `best`: C3's higher offense. */
function cast(s: BattleState, actor: BattleUnit, tapped: BattleUnit, def: RpgSkillDef, scale: number, cues: BattleCue[], salt = 'random',
  orbs?: readonly RpgDamageKind[], supportScale = 1, best = false): CastLog {
  const log: CastLog = { tapped, struck: [], hitFoes: [], weak: false }
  const options: HitOptions = { special: def.special, orbs, best }
  const from = cues.length
  const note = (foe: BattleUnit, _hit: RpgHit, weak: boolean) => {
    if (!log.struck.includes(foe)) log.struck.push(foe)
    log.hitFoes.push(foe)
    log.weak ||= weak
    if (def.rider?.per === 'hit' && foe.hp > 0) {
      addStatus(foe, def.rider.status)
      cues.push({ kind: 'status', actorId: actor.id, targetId: foe.id, label: def.rider.status })
    }
  }
  if (def.target === 'all') {
    for (const hit of def.hits) {
      for (const foe of living(s, 'enemy')) { const r = strike(s, actor, foe, hit, scale, cues, false, options); note(r.receiver, hit, r.weak) }
    }
  } else if (def.target === 'random') {
    // From v19 (Halls v2, HV-A; H129) a double's second hit (`follow`) aims at the foe the hit before it aimed at while she
    // stands; else it draws as any random hit, by its own index, so no other hit's draw moves.
    const follows = rpgRework('classes', s.engineVersion)
    let aimed: BattleUnit | undefined
    def.hits.forEach((hit, i) => {
      const foe = follows && hit.follow && aimed && aimed.hp > 0 ? aimed : randomFoe(s, actor.id, i, salt)
      aimed = foe
      if (!foe) return
      const r = strike(s, actor, foe, hit, scale, cues, false, options)
      note(r.receiver, hit, r.weak)
    })
  } else {
    for (const hit of def.hits) {
      if (tapped.hp <= 0) break
      const r = strike(s, actor, tapped, hit, scale, cues, true, options)
      note(r.receiver, hit, r.weak)
    }
  }
  for (const hit of def.focus ?? []) if (tapped.hp > 0) { const r = strike(s, actor, tapped, hit, scale, cues, false, options); note(r.receiver, hit, r.weak) }
  if (def.splash) {
    // From v19 (CV12, H128) the splash is plain: no special, and no rider lands on a foe only it struck (the volley's riders
    // and specials are the tapped foe's). A weak splash still chips a shield and breaks a lock, as any hit.
    const plain = rpgRework('classes', s.engineVersion)
    for (const foe of living(s, 'enemy')) if (foe !== tapped) {
      const r = strike(s, actor, foe, def.splash, scale, cues, false, plain ? { orbs, best } : options)
      if (!plain) note(r.receiver, def.splash, r.weak)
      else { log.hitFoes.push(r.receiver); log.weak ||= r.weak }
    }
  }
  if (def.other) {
    const others = living(s, 'enemy').filter((foe) => foe !== tapped)
    const foe = others[hashNumber(`${s.input.seed}:${s.round}:${actor.id}:${s.acted.length}:${salt}:other`) % Math.max(1, others.length)]
    if (foe) for (const hit of def.other) if (foe.hp > 0) { const r = strike(s, actor, foe, hit, scale, cues, false, options); note(r.receiver, hit, r.weak) }
  }
  if (def.rider?.per === 'foe') {
    for (const foe of log.struck) if (foe.hp > 0) {
      addStatus(foe, def.rider.status, def.rider.stacks)
      cues.push({ kind: 'status', actorId: actor.id, targetId: foe.id, label: def.rider.status })
    }
  }
  // From v15 the Summoner has no support (§3.2): her Light capstone raises no Barrier.
  if (def.allies && s.engineVersion < 15) {
    for (const friend of living(s, 'ally')) addBarrier(s, friend, maxHp(s, friend.id) * BATTLE_BARRIER_PERCENT * def.allies.stacks, actor.id, cues)
  }
  if (def.status) applyStatus(s, actor, def.status, log, cues)
  // The generation's support: v12–v14's `support`, or from v15 the healers' `support15` (§3.3).
  const sup = s.engineVersion >= 15 ? def.support15 : def.support
  if (sup && s.engineVersion >= 12 && actor.side === 'ally') {
    // v12 (D141): her support after the hits. A curse lands on every foe struck; a drain heals from what the hits dealt.
    const curse = sup.curse
    if (curse) for (const foe of log.struck) if (foe.hp > 0) {
      addStatus(foe, curse.status, curse.stacks)
      cues.push({ kind: 'status', actorId: actor.id, targetId: foe.id, label: curse.status, amount: curse.stacks })
    }
    const dealt = cues.slice(from).reduce((n, c) => n + (c.kind === 'hit' && c.actorId === actor.id && c.targetId !== actor.id &&
      unit(s, c.targetId)?.side === 'enemy' ? c.amount : 0), 0)
    support(s, actor, sup, dealt, cues, supportScale)
  }
  return log
}

/** A Cleric skill's status (D86): on the foe it hit (every foe at depth 5), or on every ally. */
function applyStatus(s: BattleState, actor: BattleUnit, status: NonNullable<RpgSkillDef['status']>, log: CastLog, cues: BattleCue[]): void {
  const targets = status.to === 'allies' ? living(s, 'ally') : status.to === 'foes' ? living(s, 'enemy') : log.tapped.hp > 0 ? [log.tapped] : []
  for (const target of targets) {
    const label = () => cues.push({ kind: 'status', actorId: actor.id, targetId: target.id, label: status.key, amount: status.stacks })
    switch (status.key) {
      case 'clarity': restoreMp(s, target, BATTLE_CLARITY_PERCENT * status.stacks, actor.id, cues); break
      case 'shatter': chip(s, actor, target, status.stacks, cues); break
      // Hex doesn't stack: the foe is weak to Light and Dark while it lasts.
      case 'hex': addStatus(target, 'hex', 1, status.turns, 1); label(); break
      default: addStatus(target, status.key, status.stacks, status.turns); label()
    }
  }
}

// --- Acting (D86) -------------------------------------------------------------------------------------------------

/** One part of an act: an Attack with a weapon, or a known, equipped skill. */
type Half = { kind: 'attack'; weapon: RpgWeapon } | { kind: 'skill'; skill: BattleSkill }
function halfOf(ally: BattleAlly, h: BattleHalf | undefined, version: number): Half | null {
  if (!h || typeof h !== 'object') return null
  if (h.skill) { const k = battleSkillFor(ally, h.skill, version); return k ? { kind: 'skill', skill: k } : null }
  return h.weapon && ally.weapons.includes(h.weapon) ? { kind: 'attack', weapon: h.weapon } : null
}
const halfIsTome = (h: Half): boolean => isRpgTome(h.kind === 'attack' ? h.weapon : h.skill.node.weapon)
/** An Attack as a skill: one hit of her weapon's kind at full power, on one foe (and for Auto's scoring). */
export const battleAttackDef = (weapon: RpgWeapon): RpgSkillDef =>
  ({ target: 'one', hits: [{ power: 1, parts: [{ kind: rpgWeaponKind(weapon), share: 1 }] }], mp: 0, primary: rpgWeaponKind(weapon) })

/**
 * v15 (D183, classes-v2 §3.1): a Spell Blade's Arms half gains one hit, the total unchanged: its hits and a copy of its
 * last, every one × P ÷ (P + last), P being the hits' total (an Attack lands as two hits at half its power; n equal hits
 * as n + 1 at n ÷ (n + 1)). A per-hit rider rides the extra hit too; `focus`, `splash` and `other` are untouched. For the
 * screens and the guard rail as well as the engine.
 */
export function battleExtraHit<T extends Pick<RpgSkillDef, 'hits'>>(def: T): T {
  const last = def.hits.at(-1)
  if (!last) return def
  const total = def.hits.reduce((sum, hit) => sum + hit.power, 0)
  const k = total / (total + last.power)
  return { ...def, hits: [...def.hits, last].map((hit) => ({ ...hit, power: hit.power * k })) }
}

/**
 * A Summoner's lingering summon acts again, then leaves (D86). v6–v14: before the half that summons, it re-casts its
 * skill at its linger share. v15, her farewell (D183, classes-v2 §3.2): at the start of her pair, before either half, it
 * strikes each living foe once: one hit of its kind at its linger share × its hits' power (an every-foe summon's per-foe
 * power) × `BATTLE_FAREWELL_FACTOR`. No riders, statuses or support, never intercepted; a weak hit chips as any hit.
 */
function linger(s: BattleState, actor: BattleUnit, ally: BattleAlly, target: BattleUnit, cues: BattleCue[]): void {
  const index = s.summons.findIndex((x) => x.allyId === actor.id)
  if (index < 0) return
  const [summon] = s.summons.splice(index, 1)
  const node = rpgNode(summon!.ref.id)
  const foes = living(s, 'enemy')
  if (!node || !foes.length) return
  cues.push({ kind: 'summon', actorId: actor.id, targetId: target.id, label: node.name })
  // Her summon as she cast it: its generation's def, from v16 at her Skill Rank (H65).
  const def = battleNodeDef(ally, node, s.engineVersion)
  if (rpgV2(s.engineVersion)) {
    const { hits, primary } = def
    const hit: RpgHit = { power: hits.reduce((sum, h) => sum + h.power, 0), parts: [{ kind: primary, share: 1 }] }
    for (const foe of foes) strike(s, actor, foe, hit, summon!.scale * BATTLE_FAREWELL_FACTOR, cues, false)
    return
  }
  // Its farewell strike mends or shields at its linger share too (v12); a revive or a blessing doesn't repeat.
  cast(s, actor, target.hp > 0 ? target : [...foes].sort(byHpShare(s))[0]!, def, summon!.scale, cues, 'linger', orbsOf(ally), summon!.scale)
}
function stay(s: BattleState, allyId: string, ref: RpgNodeRef, scale: number): void {
  s.summons = [...s.summons.filter((x) => x.allyId !== allyId), { allyId, ref: { tier: ref.tier, id: ref.id }, scale }]
}

/** Resolves one half of her act at its power: a skill, or an Attack as a one-hit cast of its weapon's kind. v6–v14: a
 * summon lingers its previous one first, then stays. From v15 (D183) no half lingers (her farewell came before the pair),
 * her lead half (`hand.lead`, H126: the Spell Blade's Arms, the Summoner's Tome) gains one hit where her hand says
 * (`hand.extra`, the Spellblades), and only a lead-half summon stays. */
function resolveHalf(s: BattleState, actor: BattleUnit, ally: BattleAlly, target: BattleUnit, half: Half, scale: number, cues: BattleCue[], salt: string): void {
  const foes = living(s, 'enemy')
  if (!foes.length || actor.hp <= 0) return
  const tapped = target.hp > 0 ? target : [...foes].sort(byHpShare(s))[0]!
  const v2 = rpgV2(s.engineVersion), hand = rpgHand(ally, s.engineVersion)
  const lead = hand.lead !== null && halfIsTome(half) === (hand.lead === 'tome')
  const base = half.kind === 'skill' ? half.skill.def : battleAttackDef(half.weapon)
  const def = v2 && lead && hand.extra ? battleExtraHit(base) : base
  if (def.summon && !v2) linger(s, actor, ally, tapped, cues)
  const now = tapped.hp > 0 ? tapped : living(s, 'enemy').sort(byHpShare(s))[0]
  if (!now) return
  cast(s, actor, now, def, scale, cues, salt, orbsOf(ally))
  if (half.kind === 'skill' && def.summon && (!v2 || lead)) stay(s, actor.id, half.skill.ref, def.summon.linger)
}

/**
 * v17 (WP21, H75): her Bell's follow-up. Her weapon of the Bell's kind strikes once at the Bell's power × her hand for that
 * weapon's channel: one hit of its kind, never split (no Spell Blade extra hit), on the act's target if it stands, else a
 * living foe drawn by the fight's seed. It is a hit of that weapon (its Might, her flat offense on its kind, her
 * signature, the weak multiplier, her Insignia) and strikes as an Attack's does: a guard intercepts it, a weak one chips a
 * shield and breaks a lock. Its cue is labelled 'Bell' unless a guard or a ward names it. It adds nothing to the Limit
 * gauge (that fills by the act).
 */
function ring(s: BattleState, actor: BattleUnit, ally: BattleAlly, hand: ReturnType<typeof rpgHand>, target: BattleUnit, cues: BattleCue[]): void {
  const bell = ally.bell
  const weapon = bell && ally.weapons.find((w) => rpgWeaponKind(w) === bell.kind)
  if (!bell || !weapon || actor.hp <= 0) return
  const foe = target.hp > 0 ? target : randomFoe(s, actor.id, 0, 'bell')
  if (!foe || foe.hp <= 0) return
  const hit: RpgHit = { power: 1, parts: [{ kind: bell.kind, share: 1 }] }
  strike(s, actor, foe, hit, (bell.power / 1000) * (isRpgTome(weapon) ? hand.tome : hand.arms), cues, true, { label: 'Bell' })
}

export function applyBattleAction(previous: BattleState, action: BattleAction): BattleStep {
  if (!(VERSIONS as readonly number[]).includes(previous.engineVersion) || !previous.input || !Array.isArray(previous.units)) return invalid(previous, 'invalid-state')
  if (previous.outcome !== 'active') return invalid(previous, 'terminal')
  if (!action || !['attack', 'guard', 'skill', 'limit'].includes(action.kind)) return invalid(previous, 'invalid-state')
  const actorUnit = unit(previous, action.actorId)
  if (!actorUnit || actorUnit.side !== 'ally' || actorUnit.hp <= 0) return invalid(previous, 'invalid-actor')
  if (battleActionsLeft(previous, actorUnit.id) <= 0) return invalid(previous, 'already-acted')
  const targetUnit = unit(previous, action.targetId)
  if (!targetUnit || targetUnit.hp <= 0) return invalid(previous, 'invalid-target')
  const s = clone(previous)
  const actor = unit(s, actorUnit.id)!
  const target = unit(s, targetUnit.id)!
  const ally = allyOf(s, actor.id)!
  const hand = rpgHand(ally, s.engineVersion)
  const cues: BattleCue[] = []
  // v15 (D183): a Summoner who falls takes her lingering summon with her, so a revive brings back no farewell. Swept as
  // each act begins, since a revive only ever comes from an act.
  const hands15 = rpgV2(s.engineVersion)
  if (hands15) s.summons = s.summons.filter((x) => unit(s, x.allyId)!.hp > 0)
  let charge: 'attack' | 'skill' | null = null
  if (action.kind === 'guard') {
    if (target.side !== 'ally' || target.id === actor.id) return invalid(previous, 'invalid-target')
    actor.guardingFor = target.id
    cues.push({ kind: 'guard', actorId: actor.id, targetId: target.id })
  } else if (action.kind === 'limit') {
    // A full charge and her turn, at 0 MP (D311).
    if (target.side !== 'enemy') return invalid(previous, 'invalid-target')
    if (actor.limit < BATTLE_LIMIT_MAX || battleActionsUsed(s, actor.id) > 0) return invalid(previous, 'limit-not-ready')
    const plan = battleLimitPlan(ally, { skill: action.skill, skills: action.skills, weapon: action.weapon, hero: action.hero }, s.engineVersion)
    if (!plan) return invalid(previous, 'invalid-skill')
    actor.limit = 0
    cues.push({ kind: 'limit', actorId: actor.id, targetId: target.id, label: plan.name, ...(plan.from ? { from: plan.from } : {}) })
    if (plan.linger) linger(s, actor, ally, target, cues)
    plan.casts.forEach((c, i) => {
      const foes = living(s, 'enemy')
      if (!foes.length || actor.hp <= 0) return
      // Its support works at its strength (only v15's halls have any), and from v15 a Learner's hits at her higher offense (C3).
      cast(s, actor, target.hp > 0 ? target : [...foes].sort(byHpShare(s))[0]!, c.def, c.scale, cues, i ? `limit${i}` : 'random', orbsOf(ally),
        c.scale, s.engineVersion >= 15 && !!plan.from)
    })
    if (plan.linger) stay(s, actor.id, plan.linger.ref, plan.linger.scale)
  } else {
    if (target.side !== 'enemy') return invalid(previous, 'invalid-target')
    let first: Half | null
    if (action.kind === 'attack') {
      const weapon = action.weapon ?? ally.weapons[0]!
      first = ally.weapons.includes(weapon) ? { kind: 'attack', weapon } : null
    } else {
      first = action.skill && typeof action.skill === 'object' ? halfOf(ally, { skill: action.skill }, s.engineVersion) : null
    }
    if (!first) return invalid(previous, 'invalid-skill')
    const halves: Half[] = [first]
    if (hand.pair) {
      // A Spell Blade's act is one Arms half and one Tome half (D86); from v15 a Summoner's too (D183).
      const second = halfOf(ally, action.pair, s.engineVersion)
      if (!second || halfIsTome(second) === halfIsTome(first)) return invalid(previous, 'invalid-skill')
      halves.push(second)
    } else if (action.pair !== undefined) return invalid(previous, 'invalid-skill')
    const mp = halves.reduce((sum, h) => sum + (h.kind === 'skill' ? h.skill.mp : 0), 0)
    if (actor.mp < mp) return invalid(previous, 'insufficient-mp')
    actor.mp -= mp
    if (hands15) {
      // v15 (D183): the leading half (her hand's `lead`, H126: a Spell Blade's Arms, a Summoner's Tome) resolves first,
      // whatever order the action names, after her lingering summon's farewell.
      if (halfIsTome(halves[0]!) !== (hand.lead === 'tome')) halves.reverse()
      linger(s, actor, ally, target, cues)
    }
    // Each half at its own power (D179): `arms` or `tome`, both her `power` before v15.
    halves.forEach((h, i) => resolveHalf(s, actor, ally, target, h, halfIsTome(h) ? hand.tome : hand.arms, cues, i ? 'pair' : 'random'))
    // v17 (WP21, H75): her Bell rings once after an act with an Attack in it, either half of a pair.
    if (rpgRework('economy', s.engineVersion) && ally.bell && halves.some((h) => h.kind === 'attack')) ring(s, actor, ally, hand, target, cues)
    charge = halves.some((h) => h.kind === 'skill') ? 'skill' : 'attack'
  }
  if (charge) actor.limit = Math.min(BATTLE_LIMIT_MAX, actor.limit + battleLimitGain(charge))
  s.acted.push(actor.id)
  if (!nextWave(s, cues) && !terminal(s, cues)) {
    updatePhases(s, cues)
    if (living(s, 'ally').every((u) => battleActionsLeft(s, u.id) <= 0)) resolveEnemies(s, cues)
  }
  return { state: s, cues, hash: battleStateHash(s) }
}

/** Rebuild a fight from its frozen input and bounded action log. */
export function replayBattle(input: BattleInput, actions: readonly BattleAction[]): BattleStep {
  if (actions.length > BATTLE_MAX_ACTIONS) throw new RangeError('Battle replay is too long')
  let result = createBattle(input)
  const cues = [...result.cues]
  for (const action of actions) {
    result = applyBattleAction(result.state, action)
    if (result.error) return { ...result, cues }
    cues.push(...result.cues)
  }
  return { ...result, cues }
}
