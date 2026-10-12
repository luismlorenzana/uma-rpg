// Deterministic campaign battle reducer, engine v7 (W3, D91; classes D86, docs/design/class-rework.md; Limit Breaks D311).
// Octopath Traveler breaks: each weak hit removes one shield point, and unbroken foes take half damage. Every class acts
// once a round; a Spell Blade's act is an Arms half and a Tome half, a Summoner's summon lingers and acts again when she
// next summons, a Cleric's skills carry a debuff or a buff, and an Orb adds its kind to every hit for weaknesses.
// v7 adds up to eight foes, dual-element foes, solo elites that act twice and waves; v8 ranks, Might, Barrier and Regen
// (D102–D104); v9 Heroes and their Learners' inherited Limit Breaks (D106); v10 drops the classes' own Limit Breaks (D112).
// Older fights replay unchanged.
import { rpgNode, type RpgHit, type RpgSkillDef } from '../catalog'
import { BOND_MAX_LEVEL, isHeroLimitId, LEARNER_MAX_PARENTS } from '../hero-id'
import {
  isRpgDamageKind, isRpgTome, RPG_CLASSES, RPG_ELEMENTS, RPG_MAX_LEGACY_SLOTS, RPG_WEAPON_KINDS, rpgActiveSlots, rpgHand, rpgNodeKey,
  rpgWeaponKind, validRpgTree, validRpgWeapons, type RpgDamageKind, type RpgNodeRef, type RpgStatusKind, type RpgWeapon,
} from '../rules'
import {
  BATTLE_BARRIER_CAP, BATTLE_BARRIER_PERCENT, BATTLE_BREAK_ROUNDS, BATTLE_BURN_PERCENT, BATTLE_CLARITY_PERCENT,
  BATTLE_DEFENSE_SHARE, BATTLE_FOE_STATUS_STEP, BATTLE_GUARD_FACTOR, BATTLE_MAX_ROUNDS, BATTLE_MIN_OFFENSE_SHARE,
  BATTLE_STATUS_STACK_CAP, BATTLE_STATUS_STEP, BATTLE_STATUS_TURNS,
  BATTLE_UNBROKEN_FACTOR, BATTLE_WEAK, battleChannel, battleClassRank, battleSkillFor, type BattleSkill,
} from './skills'
import { RPG_MAX_TREE_NODES } from '../rules'
import { BATTLE_LIMIT_MAX, battleLimitGain, battleLimitPlan } from './limit'
import type { BattleAction, BattleAlly, BattleChannel, BattleCue, BattleEnemy, BattleEnemyMove, BattleError, BattleHalf,
  BattleInput, BattleIntent, BattleSide, BattleState, BattleStep, BattleUnit } from './types'
import { BATTLE_MAX_ACTIONS, BATTLE_MAX_EXTRA_WAVES as MAX_EXTRA_WAVES } from './caps'
export { BATTLE_MAX_ACTIONS } from './caps'

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
function validMove(m: BattleEnemyMove): boolean {
  return SAFE_ID.test(m.id) && ['damage', 'guard', 'buff', 'debuff'].includes(m.kind) &&
    ['physical', 'magical'].includes(m.channel) && (m.element === null || RPG_ELEMENTS.includes(m.element)) &&
    safeInt(m.power, 0, 1000) && typeof m.label === 'string' && m.label.length > 0 && m.label.length <= 80 &&
    (m.kind === 'damage' ? ['front', 'lowest-hp', 'seeded', 'all'].includes(m.target)
      : m.kind === 'debuff' ? ['front', 'lowest-hp', 'seeded'].includes(m.target) : ['self', 'ally'].includes(m.target)) &&
    (m.status === undefined || (m.kind === 'buff' ? ['ward', 'power-up'].includes(m.status)
      : ['burn', 'slow', 'mark', 'weaken'].includes(m.status)))
}

/** Learned, slotted and legal for her class; the same tree rules the profile enforces. v8 adds her Class Rank, her
 * weapons' Might, her armor's Barrier and Regen (D102, D104). */
function validAlly(a: BattleAlly, version: BattleInput['version']): boolean {
  const v8 = version >= 8
  if (version < 9 ? a.hero !== undefined || a.inherits !== undefined : !validHeroes(a)) return false
  if (!v8 && (a.classRank !== undefined || a.might !== undefined || a.barrier !== undefined || a.regen !== undefined)) return false
  if (v8 && (!safeInt(a.classRank, 1, 50) || a.maxDepth !== undefined || (a.barrier !== undefined && !safeInt(a.barrier, 0, 100_000)) ||
    (a.regen !== undefined && !safeInt(a.regen, 0, 10_000)) || (a.might !== undefined && (typeof a.might !== 'object' || a.might === null ||
    !Object.entries(a.might).every(([k, n]) => isRpgDamageKind(k) && safeInt(n, 0, 1_000)))))) return false
  if (!SAFE_ID.test(a.id) || !RPG_CLASSES.includes(a.classId) || !Array.isArray(a.weapons) || !validRpgWeapons(a.classId, a.weapons) ||
    !safeInt(a.tier, 1, 1_000_000) || !safeInt(a.level, 1, 50) || !validStats(a.stats as unknown as Record<string, unknown>, ALLY_STATS) ||
    !safeInt(a.mp, 0, a.stats.mp) || (a.orb !== undefined && !isRpgDamageKind(a.orb)) || (a.maxDepth !== undefined && !safeInt(a.maxDepth, 0, 5)) ||
    (a.evasion !== undefined && !safeInt(a.evasion, 0, 500)) || (a.limitStart !== undefined && !safeInt(a.limitStart, 0, BATTLE_LIMIT_MAX)) ||
    !Array.isArray(a.tree) || !Array.isArray(a.legacy) || !Array.isArray(a.loadout) ||
    a.loadout.length > rpgActiveSlots(a.level) || a.tree.length > RPG_MAX_TREE_NODES || a.legacy.length > RPG_MAX_LEGACY_SLOTS) return false
  if (!validRpgTree({ ...a, classRank: battleClassRank(a) }) || a.legacy.some((r) => r.tier >= a.tier || !rpgNode(r.id))) return false
  const keys = a.loadout.map(rpgNodeKey)
  return new Set(keys).size === keys.length && a.loadout.filter((r) => r.tier < a.tier).length <= RPG_MAX_LEGACY_SLOTS &&
    a.loadout.every((ref) => battleSkillFor(a, ref) !== null)
}
/** v9 (D106): a Hero has her seat and no Heroes of her own; a Learner at most two different seats, each with a Bond Level. */
function validHeroes(a: BattleAlly): boolean {
  if (a.hero !== undefined && (!isHeroLimitId(a.hero) || a.inherits !== undefined)) return false
  if (a.inherits === undefined) return true
  return Array.isArray(a.inherits) && a.inherits.length >= 1 && a.inherits.length <= LEARNER_MAX_PARENTS &&
    new Set(a.inherits.map((i) => i?.limit)).size === a.inherits.length &&
    a.inherits.every((i) => !!i && typeof i === 'object' && Object.keys(i).length === 3 && isHeroLimitId(i.limit) &&
      safeInt(i.bond, 0, BOND_MAX_LEVEL) && typeof i.from === 'string' && SAFE_ID.test(i.from) && i.from !== a.id)
}
function validEnemy(e: BattleEnemy, version: BattleInput['version']): boolean {
  const w = e.weaknesses
  if (e.element2 !== undefined && (version < 7 || !RPG_ELEMENTS.includes(e.element2) || e.element2 === e.element)) return false
  if (e.twice !== undefined && (version < 7 || typeof e.twice !== 'boolean')) return false
  const set = <T>(list: unknown, all: readonly T[]) => Array.isArray(list) && list.length <= all.length &&
    list.every((k) => all.includes(k as T)) && new Set(list).size === list.length
  return SAFE_ID.test(e.id) && SAFE_ID.test(e.castId) && RPG_ELEMENTS.includes(e.element) &&
    ['regular', 'sub-boss', 'boss'].includes(e.rank) && safeInt(e.level, 1, 1_000_000) &&
    validStats(e.stats as unknown as Record<string, unknown>, ENEMY_STATS) && safeInt(e.shield, 1, 20) &&
    !!w && set(w.weapons, RPG_WEAPON_KINDS) && set(w.elements, RPG_ELEMENTS) && w.weapons.length + w.elements.length >= 1 &&
    Array.isArray(e.moves) && e.moves.length >= 1 && e.moves.length <= 8 && e.moves.every(validMove) &&
    new Set(e.moves.map((m) => m.id)).size === e.moves.length &&
    (e.phaseTwo === undefined || (safeInt(e.phaseTwo.thresholdPercent, 1, 99) && e.phaseTwo.moves.length >= 1 &&
      e.phaseTwo.moves.length <= 8 && e.phaseTwo.moves.every(validMove)))
}
/** Foes on the field at once: five in v6, eight from v7 (W3). Waves: up to two after the first. */
const MAX_FOES = { 6: 5, 7: 8, 8: 8, 9: 8, 10: 8 } as const
function validateInput(input: BattleInput): void {
  if (!input || ![6, 7, 8, 9, 10].includes(input.version) || !safeInt(input.seed, 0, 0xffff_ffff) || !Array.isArray(input.allies) ||
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
  if (!foes.every((e) => validEnemy(e, input.version))) throw new RangeError('Invalid battle enemy')
}

function clone(s: BattleState): BattleState {
  return { ...s, units: s.units.map((u) => ({ ...u, statuses: u.statuses.map((x) => ({ ...x })) })),
    acted: [...s.acted], summons: s.summons.map((x) => ({ ...x, ref: { ...x.ref } })), intents: s.intents.map((i) => ({ ...i })) }
}
const movesOf = (s: BattleState, u: BattleUnit): BattleEnemyMove[] => {
  const e = enemyOf(s, u.id)!
  return u.phase === 2 && e.phaseTwo ? e.phaseTwo.moves : e.moves
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
/** A foe's move for this round; `turn` 1 is a twice-acting foe's second (v7). */
function intentFor(s: BattleState, u: BattleUnit, turn = 0): BattleIntent {
  const e = enemyOf(s, u.id)!
  const moves = movesOf(s, u)
  const move = moves[hashNumber(`${s.input.seed}:${s.round}:${e.id}:phase${u.phase}${turn ? `:turn${turn}` : ''}:move`) % moves.length]!
  return { enemyId: e.id, moveId: move.id, targetId: chooseTarget(s, e, move, turn) }
}
/** Every living foe's move by initiative; foes that act twice add a second move after everyone's first. */
function intentsFor(s: BattleState): BattleIntent[] {
  const order = living(s, 'enemy').sort((a, b) => enemyOf(s, b.id)!.stats.initiative - enemyOf(s, a.id)!.stats.initiative ||
    a.id.localeCompare(b.id))
  return [...order.map((u) => intentFor(s, u)), ...order.filter((u) => enemyOf(s, u.id)!.twice).map((u) => intentFor(s, u, 1))]
}
function reveal(s: BattleState): BattleCue[] {
  return s.intents.map((i) => {
    const move = movesOf(s, unit(s, i.enemyId)!).find((m) => m.id === i.moveId)!
    return { kind: 'intent' as const, actorId: i.enemyId, targetId: i.targetId, label: move.label }
  })
}

export function createBattle(source: BattleInput): BattleStep {
  validateInput(source)
  const input = JSON.parse(JSON.stringify(source)) as BattleInput
  const base = { statuses: [], barrier: 0, phase: 1 as const, guardingFor: null, brokenAt: 0, revived: false, limit: 0 }
  const units: BattleUnit[] = [
    ...input.allies.map((a) => ({ ...base, id: a.id, side: 'ally' as const, hp: a.stats.hp, mp: a.mp, shield: 0, limit: a.limitStart ?? 0, barrier: a.barrier ?? 0 })),
    ...input.enemies.map((e) => ({ ...base, id: e.id, side: 'enemy' as const, hp: e.stats.hp, mp: 0, shield: e.shield })),
  ]
  const state: BattleState = { engineVersion: input.version, input, round: 1, units, acted: [], summons: [], intents: [], outcome: 'active',
    ...(input.waves?.length ? { wave: 0 } : {}) }
  state.intents = intentsFor(state)
  return { state, cues: reveal(state), hash: battleStateHash(state) }
}

/** A hit is weak when its kind is on the foe's lists, or it is Light or Dark against a Hexed foe. */
export function battleHitIsWeak(enemy: BattleEnemy, foe: BattleUnit | null, kind: RpgDamageKind | null): boolean {
  if (kind === null) return false
  return (enemy.weaknesses.weapons as string[]).includes(kind) || (enemy.weaknesses.elements as string[]).includes(kind) ||
    (!!foe && stacks(foe, 'hex') > 0 && (kind === 'light' || kind === 'dark'))
}

/** `orb`: the attacker's Orb kind, which makes a hit weak too (D86), with no damage of its own. */
interface HitOptions { special?: RpgSkillDef['special']; area?: boolean; orb?: RpgDamageKind }
/** One part's final amount; shared by live play, previews and the simulator. */
export function battleDamage(s: BattleState, attacker: BattleUnit, defender: BattleUnit, channel: BattleChannel,
  power: number, kind: RpgDamageKind | null, options: HitOptions = {}): { amount: number; weak: boolean } {
  const atk = allyOf(s, attacker.id)?.stats ?? enemyOf(s, attacker.id)!.stats
  const def = allyOf(s, defender.id)?.stats ?? enemyOf(s, defender.id)!.stats
  // v8: the weapon a hit is made with adds its Might (D104).
  const might = attacker.side === 'ally' && kind !== null ? allyOf(s, attacker.id)?.might?.[kind] ?? 0 : 0
  const offense = (channel === 'physical' ? atk.atk : atk.matk) + might
  const defense = channel === 'physical' ? def.pdef : def.mdef
  let amount = Math.max(offense * BATTLE_MIN_OFFENSE_SHARE, offense - defense * BATTLE_DEFENSE_SHARE) * power
  const foe = defender.side === 'enemy' ? enemyOf(s, defender.id)! : null
  const weak = !!foe && attacker.side === 'ally' && (battleHitIsWeak(foe, defender, kind) || battleHitIsWeak(foe, defender, options.orb ?? null))
  if (weak) amount *= BATTLE_WEAK
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
  const evasion = defender.side === 'ally' ? allyOf(s, defender.id)?.evasion ?? 0 : 0
  if (evasion > 0) amount *= 1 - evasion / 1000
  return { amount: Math.max(1, Math.round(amount)), weak }
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
  if (battleBroken(foe) || foe.shield === 0 || foe.hp <= 0 || points <= 0) return
  foe.shield = Math.max(0, foe.shield - points)
  cues.push({ kind: 'shield', actorId: actor.id, targetId: foe.id, amount: foe.shield })
  if (foe.shield === 0) {
    foe.brokenAt = s.round
    cues.push({ kind: 'break', actorId: actor.id, targetId: foe.id })
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
      label: receiver !== target ? 'Intercepted' : undefined })
    if (receiver.hp === 0) { cues.push({ kind: 'ko', actorId: actor.id, targetId: receiver.id }); break }
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

/** Damage from a foe to an ally: a Barrier absorbs first. */
function harm(s: BattleState, actor: BattleUnit, target: BattleUnit, move: BattleEnemyMove, cues: BattleCue[], intercept: boolean): void {
  const receiver = intercept ? guardOf(s, target) : target
  const result = battleDamage(s, actor, receiver, move.channel, move.power / 100, move.element, { area: move.target === 'all' })
  let amount = receiver !== target ? Math.max(1, Math.round(result.amount * BATTLE_GUARD_FACTOR)) : result.amount
  const absorbed = Math.min(receiver.barrier, amount)
  receiver.barrier -= absorbed
  amount -= absorbed
  receiver.hp = Math.max(0, receiver.hp - amount)
  cues.push({ kind: 'hit', actorId: actor.id, targetId: receiver.id, amount, channel: move.channel, element: move.element, weak: false,
    label: receiver !== target ? 'Intercepted' : absorbed ? `Barrier −${absorbed}` : undefined })
  if (receiver.hp === 0) cues.push({ kind: 'ko', actorId: actor.id, targetId: receiver.id })
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
  s.round += 1
  s.acted = []
  s.intents = intentsFor(s)
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
    let turn = 0
    const nexts: BattleIntent[] = []
    s.intents = s.intents.map((i) => {
      if (i.enemyId !== u.id) return i
      const next = intentFor(s, u, turn++)
      nexts.push(next)
      return next
    })
    if (!nexts.length) nexts.push(intentFor(s, u))
    for (const next of nexts) {
      const move = movesOf(s, u).find((m) => m.id === next.moveId)!
      cues.push({ kind: 'intent', actorId: u.id, targetId: next.targetId, label: move.label })
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
    const move = movesOf(s, actor).find((m) => m.id === intent.moveId)
    if (!move) throw new RangeError('Frozen intent no longer matches phase')
    if (move.kind === 'damage' && move.target === 'all') {
      for (const target of living(s, 'ally')) {
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
      cues.push({ kind: 'recover', actorId: u.id, targetId: u.id, amount: u.shield })
    }
    const burn = stacks(u, 'burn')
    if (burn) {
      const amount = Math.max(1, Math.round(maxHp(s, u.id) * BATTLE_BURN_PERCENT * burn))
      u.hp = Math.max(0, u.hp - amount)
      cues.push({ kind: 'hit', actorId: u.id, targetId: u.id, amount, channel: 'status', element: 'fire', weak: false, label: 'Burn' })
      if (u.hp === 0) { cues.push({ kind: 'ko', actorId: u.id, targetId: u.id }); continue }
    }
    u.statuses = u.statuses.map((x) => ({ ...x, turns: x.turns - 1 })).filter((x) => x.turns > 0)
    // v8: magical armor's Regen (D104).
    const regen = u.side === 'ally' ? allyOf(s, u.id)?.regen ?? 0 : 0
    const healed = Math.min(regen, maxHp(s, u.id) - u.hp)
    if (healed > 0) { u.hp += healed; cues.push({ kind: 'status', actorId: u.id, targetId: u.id, label: `Regen +${healed}`, amount: healed }) }
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
  cues.push(...reveal(s))
}

function restoreMp(s: BattleState, u: BattleUnit, share: number, actorId: string, cues: BattleCue[]): void {
  const max = allyOf(s, u.id)!.stats.mp
  const gained = Math.min(max - u.mp, Math.round(max * share))
  if (gained > 0) { u.mp += gained; cues.push({ kind: 'mp', actorId, targetId: u.id, amount: gained }) }
}
function addBarrier(s: BattleState, u: BattleUnit, amount: number, actorId: string, cues: BattleCue[]): void {
  const cap = Math.round(maxHp(s, u.id) * BATTLE_BARRIER_CAP)
  const next = Math.min(cap, u.barrier + Math.round(amount))
  if (next > u.barrier) { cues.push({ kind: 'status', actorId, targetId: u.id, label: `barrier ${next}`, amount: next }); u.barrier = next }
}

function invalid(s: BattleState, error: BattleError): BattleStep { return { state: s, cues: [], hash: battleStateHash(s), error } }

/** Skill the actor may use: learned, slotted and in her class trees. */
export function battleActorSkill(s: BattleState, actorId: string, ref: { tier: number; id: string }): BattleSkill | null {
  const a = allyOf(s, actorId)
  return a ? battleSkillFor(a, ref) : null
}

/** Random-target hits are seeded by the fight, round, actor, action and hit (and a Limit Break's cast), so a replay lands the same hits. */
function randomFoe(s: BattleState, actorId: string, hit: number, salt = 'random'): BattleUnit | undefined {
  const foes = living(s, 'enemy')
  return foes[hashNumber(`${s.input.seed}:${s.round}:${actorId}:${s.acted.length}:${hit}:${salt}`) % Math.max(1, foes.length)]
}

interface CastLog { tapped: BattleUnit; struck: BattleUnit[]; hitFoes: BattleUnit[]; weak: boolean }

/** Resolves a skill's hits, extras, riders and status. */
function cast(s: BattleState, actor: BattleUnit, tapped: BattleUnit, def: RpgSkillDef, scale: number, cues: BattleCue[], salt = 'random', orb?: RpgDamageKind): CastLog {
  const log: CastLog = { tapped, struck: [], hitFoes: [], weak: false }
  const options: HitOptions = { special: def.special, orb }
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
    def.hits.forEach((hit, i) => {
      const foe = randomFoe(s, actor.id, i, salt)
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
  if (def.splash) for (const foe of living(s, 'enemy')) if (foe !== tapped) { const r = strike(s, actor, foe, def.splash, scale, cues, false, options); note(r.receiver, def.splash, r.weak) }
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
  if (def.allies) for (const friend of living(s, 'ally')) addBarrier(s, friend, maxHp(s, friend.id) * BATTLE_BARRIER_PERCENT * def.allies.stacks, actor.id, cues)
  if (def.status) applyStatus(s, actor, def.status, log, cues)
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
function halfOf(ally: BattleAlly, h: BattleHalf | undefined): Half | null {
  if (!h || typeof h !== 'object') return null
  if (h.skill) { const k = battleSkillFor(ally, h.skill); return k ? { kind: 'skill', skill: k } : null }
  return h.weapon && ally.weapons.includes(h.weapon) ? { kind: 'attack', weapon: h.weapon } : null
}
const halfIsTome = (h: Half): boolean => isRpgTome(h.kind === 'attack' ? h.weapon : h.skill.node.weapon)

/** A Summoner's lingering summon acts again, then leaves (D86). */
function linger(s: BattleState, actor: BattleUnit, ally: BattleAlly, target: BattleUnit, cues: BattleCue[]): void {
  const index = s.summons.findIndex((x) => x.allyId === actor.id)
  if (index < 0) return
  const [summon] = s.summons.splice(index, 1)
  const node = rpgNode(summon!.ref.id)
  const foes = living(s, 'enemy')
  if (!node || !foes.length) return
  cues.push({ kind: 'summon', actorId: actor.id, targetId: target.id, label: node.name })
  cast(s, actor, target.hp > 0 ? target : [...foes].sort(byHpShare(s))[0]!, node.skill, summon!.scale, cues, 'linger', ally.orb)
}
function stay(s: BattleState, allyId: string, ref: RpgNodeRef, scale: number): void {
  s.summons = [...s.summons.filter((x) => x.allyId !== allyId), { allyId, ref: { tier: ref.tier, id: ref.id }, scale }]
}

/** Resolves one half of her act at her hand's power. */
function resolveHalf(s: BattleState, actor: BattleUnit, ally: BattleAlly, target: BattleUnit, half: Half, scale: number, cues: BattleCue[], salt: string): void {
  const foes = living(s, 'enemy')
  if (!foes.length || actor.hp <= 0) return
  const tapped = target.hp > 0 ? target : [...foes].sort(byHpShare(s))[0]!
  if (half.kind === 'attack') {
    strike(s, actor, tapped, { power: 1, parts: [{ kind: rpgWeaponKind(half.weapon), share: 1 }] }, scale, cues, true, { orb: ally.orb })
    return
  }
  const def = half.skill.def
  if (def.summon) linger(s, actor, ally, tapped, cues)
  const now = tapped.hp > 0 ? tapped : living(s, 'enemy').sort(byHpShare(s))[0]
  if (!now) return
  cast(s, actor, now, def, scale, cues, salt, ally.orb)
  if (def.summon) stay(s, actor.id, half.skill.ref, def.summon.linger)
}

export function applyBattleAction(previous: BattleState, action: BattleAction): BattleStep {
  if (![6, 7, 8, 9, 10].includes(previous.engineVersion) || !previous.input || !Array.isArray(previous.units)) return invalid(previous, 'invalid-state')
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
  const hand = rpgHand(ally)
  const cues: BattleCue[] = []
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
      cast(s, actor, target.hp > 0 ? target : [...foes].sort(byHpShare(s))[0]!, c.def, c.scale, cues, i ? `limit${i}` : 'random', ally.orb)
    })
    if (plan.linger) stay(s, actor.id, plan.linger.ref, plan.linger.scale)
  } else {
    if (target.side !== 'enemy') return invalid(previous, 'invalid-target')
    let first: Half | null
    if (action.kind === 'attack') {
      const weapon = action.weapon ?? ally.weapons[0]!
      first = ally.weapons.includes(weapon) ? { kind: 'attack', weapon } : null
    } else {
      first = action.skill && typeof action.skill === 'object' ? halfOf(ally, { skill: action.skill }) : null
    }
    if (!first) return invalid(previous, 'invalid-skill')
    const halves: Half[] = [first]
    if (hand.pair) {
      // A Spell Blade's act is one Arms half and one Tome half (D86).
      const second = halfOf(ally, action.pair)
      if (!second || halfIsTome(second) === halfIsTome(first)) return invalid(previous, 'invalid-skill')
      halves.push(second)
    } else if (action.pair !== undefined) return invalid(previous, 'invalid-skill')
    const mp = halves.reduce((sum, h) => sum + (h.kind === 'skill' ? h.skill.mp : 0), 0)
    if (actor.mp < mp) return invalid(previous, 'insufficient-mp')
    actor.mp -= mp
    halves.forEach((h, i) => resolveHalf(s, actor, ally, target, h, hand.power, cues, i ? 'pair' : 'random'))
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
