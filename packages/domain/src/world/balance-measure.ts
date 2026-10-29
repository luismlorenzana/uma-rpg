// What a fight did, read from its cues (R1's balance, H71): each Uma's damage by channel and turn, each skill half's casts,
// a healer's mends and absorbed Barriers, the party's damage taken, rounds to each foe's first Break from her arrival,
// and the foes' charged moves (armed, cancelled); from H81 each Uma's Attacks and Flourish mends; from H131 each Uma's Limit
// Break casts (the foes standing at each, their hits, weak and in her own kinds, and the damage on a Broken foe) and the damage
// by tree. Shared by `world/balance-v16.test.ts`, `rift/balance-v16.test.ts`, their v17 files and the v19 ones
// (H60's and H63's own tallies stay in `rift/balance-v15.test.ts`). Test support only: nothing in the game imports it.
import type { BattleAction, BattleAlly, BattleCue, BattleState, BattleStep, EnemyRank } from '../rpg/battle/types'
import { rpgNode } from '../rpg/catalog'
import { isRpgTome, rpgWeaponKind, type RpgClass, type RpgDamageKind, type RpgWeapon } from '../rpg/rules'
import type { Played, PlayObserver } from './balance-play'

/** One Uma's share of the fights she played. */
export interface UmaLog {
  classId: RpgClass; physical: number; magical: number; limitPhysical: number; limitMagical: number; farewell: number; turns: number
  heal: number
  /** Her damage on sub-boss and boss rank foes, and her turns while one stands (a one-foe line's context). */
  big: number; bigTurns: number
  /** Her acts that were an Attack (an accessory Bell's trigger, H81), and the HP her Flourish mended her (UT6). */
  attacks: number; flourish: number
  /** Her Limit Break acts, and how many foes stood at each: `limitFoes[n]` casts with n standing (Halls v2's H1, H131); its
   * hits, those that landed weak, and the damage of those that landed on a Broken foe. */
  limits: number; limitFoes: number[]; limitHits: number; limitWeak: number; limitBroken: number
  /** Her Limit Break hits in a kind she wields (her weapons' Might and her accessory's flat offense ride them). */
  limitOwn: number
}
/** A skill half's casts: how many, and the damage its kind's hits dealt (her farewell apart). */
export interface CastLog { n: number; dmg: number }
/** Rounds to a foe's first Break, counted from the round she came on: those who broke and their rounds, and every foe's
 * rounds with a foe who never broke counted to the round she fell or the fight ended (H60's "none: the fight's last"). */
export interface BreakLog { foes: number; broke: number; rounds: number; roundsAll: number }
export interface FightLog {
  fights: number; wins: number; rounds: number
  umas: Record<string, UmaLog>
  casts: Record<string, CastLog>
  /** Barrier damage absorbed on the party's hits (one healer a party: hers). */
  absorbed: number
  /** Damage the party took. */
  taken: number
  breaks: Record<EnemyRank, BreakLog>
  /** Charged moves armed, and cancelled (every lock broken, or a Break). */
  charges: { armed: number; cancelled: number }
}
const umaLog = (classId: RpgClass): UmaLog => ({ classId, physical: 0, magical: 0, limitPhysical: 0, limitMagical: 0, farewell: 0, turns: 0, heal: 0,
  big: 0, bigTurns: 0, attacks: 0, flourish: 0, limits: 0, limitFoes: [], limitHits: 0, limitWeak: 0, limitBroken: 0, limitOwn: 0 })
const breakLog = (): BreakLog => ({ foes: 0, broke: 0, rounds: 0, roundsAll: 0 })
export const fightLog = (): FightLog => ({ fights: 0, wins: 0, rounds: 0, umas: {}, casts: {}, absorbed: 0, taken: 0,
  breaks: { regular: breakLog(), 'sub-boss': breakLog(), boss: breakLog() }, charges: { armed: 0, cancelled: 0 } })

const BARRIER = /Barrier −(\d+)/

/**
 * Reads one fight into `into`. Her hits on foes during her own act (not the foes' phase) count by channel; a Limit
 * Break's apart; a Summoner's farewell strikes (one per standing foe after her `summon` cue) apart and inside her total.
 * A skill half's hits are its kind's (a pair's other half hits another kind). Call `done` with the fight's result.
 */
export function logFight(allies: readonly BattleAlly[], into: FightLog): { observe: PlayObserver; done: (r: Played) => void } {
  const byId = new Map(allies.map((a) => [a.id, a]))
  for (const a of allies) into.umas[a.id] ??= umaLog(a.classId)
  const rankOf = new Map<string, EnemyRank>()
  const arrived = new Map<string, number>()
  const broke = new Map<string, number>()
  const fell = new Map<string, number>()
  const brokenNow = new Set<string>()
  const armed = new Set<string>()
  let last = 0
  const kindOf = (w: RpgWeapon | undefined): RpgDamageKind | null => (w ? rpgWeaponKind(w) : null)
  const observe: PlayObserver = (before: BattleState, action: BattleAction, step: BattleStep) => {
    if (rankOf.size === 0) for (const e of [...before.input.enemies, ...(before.input.waves ?? []).flat()]) rankOf.set(e.id, e.rank)
    for (const u of before.units) if (u.side === 'enemy' && !arrived.has(u.id)) arrived.set(u.id, before.round)
    last = before.round
    const ally = byId.get(action.actorId)
    if (!ally) return
    const uma = into.umas[ally.id]!
    uma.turns++
    if (action.kind === 'attack') uma.attacks++
    if (action.kind === 'limit') {
      const n = before.units.filter((u) => u.side === 'enemy' && u.hp > 0).length
      uma.limits++
      uma.limitFoes[n] = (uma.limitFoes[n] ?? 0) + 1
    }
    const bigFoes = new Set(before.units.filter((u) => u.side === 'enemy' && u.hp > 0 && (rankOf.get(u.id) ?? 'regular') !== 'regular').map((u) => u.id))
    if (bigFoes.size) uma.bigTurns++
    // The halves of her act and their kinds: a skill's primary kind, or an Attack's weapon's.
    const halves: { id: string | null; kind: RpgDamageKind | null }[] = []
    if (action.kind === 'skill') {
      const node = rpgNode(action.skill.id)
      halves.push({ id: action.skill.id, kind: node ? rpgWeaponKind(node.weapon) : null })
    } else if (action.kind === 'attack') halves.push({ id: null, kind: kindOf(action.weapon ?? ally.weapons[0]) })
    if ((action.kind === 'skill' || action.kind === 'attack') && action.pair) {
      const p = action.pair
      const node = p.skill ? rpgNode(p.skill.id) : undefined
      halves.push({ id: p.skill?.id ?? null, kind: node ? rpgWeaponKind(node.weapon) : kindOf(p.weapon ?? ally.weapons.find((w) => isRpgTome(w) !== isRpgTome(ally.weapons[0]!))) })
    }
    for (const h of halves) if (h.id) (into.casts[h.id] ??= { n: 0, dmg: 0 }).n++
    const foes = new Set(before.units.filter((u) => u.side === 'enemy').map((u) => u.id))
    let foePhase = false, farewells = 0
    for (const c of step.cues as BattleCue[]) {
      if (c.kind === 'move') foePhase = true
      if (c.kind === 'heal' && byId.get(c.actorId) && c.label !== 'Rally' && c.label !== 'Breather' && c.label !== 'Flourish') into.umas[c.actorId]!.heal += c.amount ?? 0
      if (c.kind === 'heal' && c.label === 'Flourish' && into.umas[c.targetId]) into.umas[c.targetId]!.flourish += c.amount ?? 0
      if (c.kind === 'hit' && byId.has(c.targetId) && c.actorId !== c.targetId && c.channel !== 'status') {
        into.taken += c.amount
        const m = c.label ? BARRIER.exec(c.label) : null
        if (m) into.absorbed += Number(m[1])
      }
      if (c.kind === 'break' && !broke.has(c.targetId)) broke.set(c.targetId, before.round)
      if (c.kind === 'break') brokenNow.add(c.targetId)
      if (c.kind === 'recover') brokenNow.delete(c.targetId)
      if (c.kind === 'ko' && foes.has(c.targetId) && !fell.has(c.targetId)) fell.set(c.targetId, before.round)
      if (c.kind === 'cancel') into.charges.cancelled++
      if (c.kind === 'summon' && c.actorId === action.actorId) farewells = before.units.filter((u) => u.side === 'enemy' && u.hp > 0).length
      if (foePhase || c.kind !== 'hit' || c.actorId !== action.actorId || !foes.has(c.targetId) || c.channel === 'status') continue
      if (bigFoes.has(c.targetId)) uma.big += c.amount
      if (farewells > 0) { uma.farewell += c.amount; farewells--; uma[c.channel] += c.amount; continue }
      if (action.kind === 'limit') {
        uma[c.channel === 'physical' ? 'limitPhysical' : 'limitMagical'] += c.amount
        uma.limitHits++
        if (c.weak) uma.limitWeak++
        if (c.element && ally.weapons.some((w) => rpgWeaponKind(w) === c.element)) uma.limitOwn++
        if (brokenNow.has(c.targetId)) uma.limitBroken += c.amount
        continue
      }
      uma[c.channel] += c.amount
      const half = halves.length === 1 ? halves[0] : halves.find((h) => h.kind === c.element)
      if (half?.id) into.casts[half.id]!.dmg += c.amount
    }
    // Charged moves: a foe's `charging` appears when it is armed; a landing one leaves with no cancel cue.
    for (const u of step.state.units) {
      if (u.side !== 'enemy' || !u.charging) continue
      const key = `${u.id}:${u.charging.round}`
      if (!armed.has(key)) { armed.add(key); into.charges.armed++ }
    }
  }
  const done = (r: Played) => {
    into.fights++; into.wins += r.won ? 1 : 0; into.rounds += r.rounds
    for (const [id, from] of arrived) {
      const b = into.breaks[rankOf.get(id) ?? 'regular']
      b.foes++
      const at = broke.get(id)
      if (at !== undefined) { b.broke++; b.rounds += at - from + 1; b.roundsAll += at - from + 1 } else b.roundsAll += (fell.get(id) ?? last) - from + 1
    }
  }
  return { observe, done }
}

export const damageOf = (u: UmaLog): number => u.physical + u.magical + u.limitPhysical + u.limitMagical
export const perTurn = (u: UmaLog | undefined): number => (u && u.turns ? damageOf(u) / u.turns : 0)
/** Her damage a turn on sub-boss and boss rank foes, while one stands. */
export const bigPerTurn = (u: UmaLog | undefined): number => (u && u.bigTurns ? u.big / u.bigTurns : 0)
/** Every Uma of a class in a log, merged. */
const addUma = (m: UmaLog, u: UmaLog): void => {
  m.physical += u.physical; m.magical += u.magical; m.limitPhysical += u.limitPhysical; m.limitMagical += u.limitMagical
  m.farewell += u.farewell; m.turns += u.turns; m.heal += u.heal; m.big += u.big; m.bigTurns += u.bigTurns
  m.attacks += u.attacks; m.flourish += u.flourish
  m.limits += u.limits; m.limitHits += u.limitHits; m.limitWeak += u.limitWeak; m.limitBroken += u.limitBroken; m.limitOwn += u.limitOwn
  u.limitFoes.forEach((k, n) => { if (k) m.limitFoes[n] = (m.limitFoes[n] ?? 0) + k })
}
export function byClass(log: FightLog, classId: RpgClass): UmaLog | undefined {
  const list = Object.values(log.umas).filter((u) => u.classId === classId)
  if (!list.length) return undefined
  const m = umaLog(classId)
  for (const u of list) addUma(m, u)
  return m
}
/** Her damage a turn without her Limit Breaks (H131's S6: Halls v2 raises them by design): her own acts' damage, farewells
 * included, over her turns that were not a Limit Break. */
export const actPerTurn = (u: UmaLog | undefined): number => (u && u.turns > u.limits ? (u.physical + u.magical) / (u.turns - u.limits) : 0)
/** Her Limit Breaks' damage. */
export const limitDamage = (u: UmaLog): number => u.limitPhysical + u.limitMagical
/** The damage her casts of a tree's nodes dealt (H131's S6 shares: the Bow's and Dark's trees), farewells apart. */
export const treeDamage = (log: FightLog, tree: string): number =>
  Object.entries(log.casts).reduce((m, [id, c]) => (rpgNode(id)?.tree === tree ? m + c.dmg : m), 0)
/** Her physical share of all her damage (H63's: farewells and Limit Breaks by their channel included). */
export const physicalShare = (u: UmaLog): number => (u.physical + u.limitPhysical) / Math.max(1, damageOf(u))
/** The casts of some nodes, merged. */
export const castsOf = (log: FightLog, ids: readonly string[]): CastLog =>
  ids.reduce((m, id) => ({ n: m.n + (log.casts[id]?.n ?? 0), dmg: m.dmg + (log.casts[id]?.dmg ?? 0) }), { n: 0, dmg: 0 })
export const merged = (logs: readonly FightLog[]): FightLog => {
  const out = fightLog()
  for (const l of logs) {
    out.fights += l.fights; out.wins += l.wins; out.rounds += l.rounds; out.absorbed += l.absorbed; out.taken += l.taken
    for (const [id, u] of Object.entries(l.umas)) addUma((out.umas[id] ??= umaLog(u.classId)), u)
    for (const [id, c] of Object.entries(l.casts)) { const m = (out.casts[id] ??= { n: 0, dmg: 0 }); m.n += c.n; m.dmg += c.dmg }
    for (const k of ['regular', 'sub-boss', 'boss'] as const) {
      const a = out.breaks[k], b = l.breaks[k]
      a.foes += b.foes; a.broke += b.broke; a.rounds += b.rounds; a.roundsAll += b.roundsAll
    }
    out.charges.armed += l.charges.armed; out.charges.cancelled += l.charges.cancelled
  }
  return out
}
