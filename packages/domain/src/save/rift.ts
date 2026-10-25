// The Rift's run rules and Ascend (docs/design/rift.md §4–§8, tiers.md §5; D161, D168; built in H48): sign-up, the
// roster, front fights and seals, the Convergence and its attempts, Echoes and their pay, Sweeps, the defeated faces and
// the achievement hook, and promotion to the next tier. Pure functions over the save that return a new save or throw
// SaveRuleError, like every rule file. Lazy: only `@rpg/domain/rift` loads it (its selectors live in `rift/state.ts`).
import { achievementsEarned, type AchievementGrant } from '../rift/achievements'
import { RIFT_FRONT_SPECS } from '../rift/fronts'
import { defeatedBefore, riftBattleInput, riftFight, riftSeed, type RiftContext } from '../rift/generate'
import {
  CONVERGENCE_FIGHTS, ECHO_LEVELS, openRiftRun, RIFT_FRONTS, RIFT_OPEN_AT, RIFT_ROSTER, RIFT_STAGES, RIFT_TIERS, RIFT_TRACES, riftBattleId, riftOpen,
  riftRunId, type EchoLevel, type RiftBattle, type RiftFightRef, type RiftFront, type RiftRun, type RiftState, type RiftTrace,
} from '../rift/state'
import { applyBattleAction, createBattle, replayBattle } from '../rpg/battle/engine'
import type { BattleAction, BattleInput, BattleState, BattleStep } from '../rpg/battle/types'
import { rpgBattleExp } from '../rpg/campaign/rewards'
import { RPG_MAX_BATTLE_ACTIONS, rpgCarriedMp, rpgMemberLevel, rpgPartyAllies, RPG_REFUSED } from '../rpg/campaign/run'
import { RPG_TIER_MAX_LEVEL } from '../rpg/rules'
import type { EnemyRoster } from '../world/roster'
import {
  activeClass, callingConfirmed, classOf, fillRanks, healerBlock, openFightOf, partyMembers, usedWeapons, type BattleOutfit, type Entrant, type MemberGain,
} from './battle'
import { MAX_PURCHASE, mergeGains } from './exchange'
import { ownGear } from './forge'
import { SaveRuleError, TIER_ONE, TIERS, tierKey, worldOf } from './rules'
import { gearV1, MAX_DEFEATED, newOwnedUma, newTierWorld, PARTY_SIZE, type Account, type Party, type Save, type TierWorld } from './save'
import { workOf } from './status'

/** Echoes pay this many times a stage's Class and gear rank EXP (R6). */
export const ECHO_RANK_PAY = 2
/** What each ascending Uma pays into the new world's wallet (T5): Laurels and Speed Tickets. */
export const ASCEND_PURSE = { laurels: 1000, speedTickets: 5 } as const
/** Her EXP banked past Lv 50 becomes Class Marks in the new world: one per this much, at most `BANKED_MARKS_CAP` (T3). */
export const BANKED_EXP_PER_MARK = 10
export const BANKED_MARKS_CAP = 2000

/** What a finished Rift fight (or a run of Echo Sweeps) did, for the result screen. */
export interface RiftFightResult {
  outcome: 'victory' | 'loss'
  ref: RiftFightRef
  /** 0 for a Sweep. */
  rounds: number
  /** Echoes: each member's rank bars (`exp` 0, level unchanged, no Bonds); empty for front and Convergence fights. */
  members: MemberGain[]
  gearMarks: number
  classMarks: number
  /** A front fight won: that front's stages cleared now (12 sealed it); else null. */
  cleared: number | null
  /** A Convergence fight won: its attempt's wins now (4 won the run); null after a loss or for other fights. */
  attempt: number | null
  runWon: boolean
  /** In `ACHIEVEMENT_IDS` order. */
  earned: AchievementGrant[]
  /** Sweeps only. */
  swept?: number
}

/** What an Ascend did: the tiers, the Umas in roster order, and what the new world's wallet gained. */
export interface AscendSummary { from: number; to: number; umas: string[]; laurels: number; speedTickets: number; classMarks: number }

// --- Helpers ---------------------------------------------------------------------------------------------------------

function withWorld(save: Save, tier: string, world: TierWorld, now: string): Save {
  return { ...save, account: { ...save.account, updatedAt: now }, tierWorlds: { ...save.tierWorlds, [tier]: world } }
}

/** The run fights can take: the current run until it's won. */
function fightingRun(world: TierWorld): RiftRun | null {
  const run = openRiftRun(world.rift)
  return run && run.wonAt === null ? run : null
}

/** The rift with its last run replaced. */
const withLastRun = (rift: RiftState, run: RiftRun): RiftState => ({ ...rift, runs: [...rift.runs.slice(0, -1), run] })

const isFront = (front: unknown): front is RiftFront => RIFT_FRONTS.includes(front as RiftFront)
const inRange = (n: unknown, lo: number, hi: number): boolean => Number.isInteger(n) && (n as number) >= lo && (n as number) <= hi

/** A fight ref with only its kind's keys (the save's parser is strict), or null when it names no fight. */
function cleanRef(ref: RiftFightRef): RiftFightRef | null {
  if (!ref) return null
  switch (ref.kind) {
    case 'front': return isFront(ref.front) && inRange(ref.stage, 1, RIFT_STAGES) ? { kind: 'front', front: ref.front, stage: ref.stage } : null
    case 'convergence': return inRange(ref.fight, 0, CONVERGENCE_FIGHTS - 1) ? { kind: 'convergence', fight: ref.fight } : null
    case 'echo': return isFront(ref.front) && ECHO_LEVELS.includes(ref.level) ? { kind: 'echo', front: ref.front, level: ref.level } : null
    default: return null
  }
}

const atTop = (world: TierWorld, id: string): boolean => (world.umas[id]?.level ?? 0) >= RPG_TIER_MAX_LEVEL
const openWords = (tier: number): string => ((RIFT_TIERS as readonly number[]).includes(tier) ? `Opens at ${RIFT_OPEN_AT} Lv 50 Umas` : 'No Rift in this tier yet')

/** Why this world party can't take the fight, or null: one of the twenty, full, and each Uma passing `each`. */
function partyBlock(world: TierWorld, party: number | null, each: (id: string) => string | null): string | null {
  if (party === null || !inRange(party, 0, world.parties.length - 1)) return 'Pick a party'
  const slots = world.parties[party]!.slots
  if (slots.length !== PARTY_SIZE || slots.some((s) => s === null)) return 'Needs a full party'
  for (const id of slots as string[]) {
    const block = world.umas[id] ? each(id) : 'Only this tier’s Umas'
    if (block) return block
  }
  return null
}

/** The level an Echo's foes stand at (rift.md §8, D173): the tier's Lv 45 or 50 as a lifetime level; Lv 55 is Lv 50's. */
export function echoFoeLevel(tier: number, level: EchoLevel): number {
  return RPG_TIER_MAX_LEVEL * (tier - 1) + Math.min(Number(level), RPG_TIER_MAX_LEVEL)
}

/** Class Marks her banked EXP past Lv 50 becomes on Ascend (T3). */
export const bankedMarks = (exp: number): number => Math.min(BANKED_MARKS_CAP, Math.floor(Math.max(0, exp) / BANKED_EXP_PER_MARK))

// --- Sign-up (rift.md §4, R2) ----------------------------------------------------------------------------------------

/** Why these twenty can't sign up for this tier's Rift, or null: exactly twenty distinct Lv 50 Umas of this world, the
 * Rift open, and no run on (the last ascended, or none). */
export function signUpBlock(save: Save, roster: readonly string[], tier = TIER_ONE): string | null {
  const world = save.tierWorlds[tier]
  if (!world) return 'No such tier'
  if (!riftOpen(world, Number(tier))) return openWords(Number(tier))
  const current = openRiftRun(world.rift)
  if (current) return current.wonAt === null ? 'A run is already on' : 'Ascend the won run first'
  if (roster.length !== RIFT_ROSTER) return `Pick ${RIFT_ROSTER} Umas`
  if (new Set(roster).size !== roster.length) return 'An Uma is picked twice'
  if (roster.some((id) => !world.umas[id])) return 'Only this tier’s Umas'
  if (roster.some((id) => !atTop(world, id))) return 'Only Lv 50 Umas'
  return null
}

/** Signs twenty Lv 50 Umas up as a new run's roster (R2): they fight its fronts and Convergence until it ends. */
export function signUpRift(save: Save, roster: readonly string[], now: string, tier = TIER_ONE): Save {
  const block = signUpBlock(save, roster, tier)
  if (block) throw new SaveRuleError('bad-party', block)
  const world = worldOf(save, tier)
  const run: RiftRun = {
    id: riftRunId(Number(tier), world.rift.runs.length + 1), roster: [...roster], startedAt: now,
    fronts: { iron: 0, arcane: 0, duel: 0, horde: 0 }, convergence: { attempts: 0, open: null }, traces: {}, wonAt: null, ascendedAt: null,
  }
  return withWorld(save, tier, { ...world, rift: { ...world.rift, runs: [...world.rift.runs, run] } }, now)
}

/** Why the current run can't be cancelled, or null: only an untouched one (no stage cleared, no attempt, no Rift fight). */
export function cancelRiftBlock(save: Save, tier = TIER_ONE): string | null {
  const world = save.tierWorlds[tier]
  const run = world ? fightingRun(world) : null
  if (!world || !run) return 'No run to cancel'
  if (RIFT_FRONTS.some((f) => run.fronts[f] > 0) || run.convergence.attempts > 0) return 'The run has started'
  if (world.rift.battle) return 'Finish the open Rift fight first'
  return null
}

/** Removes an untouched run, so a mis-tapped roster isn't locked for weeks. Nothing else changes. */
export function cancelRiftRun(save: Save, now: string, tier = TIER_ONE): Save {
  const block = cancelRiftBlock(save, tier)
  if (block) throw new SaveRuleError('cannot-fight', block)
  const world = worldOf(save, tier)
  return withWorld(save, tier, { ...world, rift: { ...world.rift, runs: world.rift.runs.slice(0, -1) } }, now)
}

// --- Fights (§4–§6, §8; R4) ------------------------------------------------------------------------------------------

/** What the generator needs for a fight: a front or Convergence fight takes the current run and the faces defeated
 * before it started; an Echo takes neither. */
export function riftContextFor(save: Save, ref: RiftFightRef, roster: EnemyRoster, tier = TIER_ONE): RiftContext {
  const world = worldOf(save, tier)
  if (ref.kind === 'echo') return { tier: Number(tier), runId: null, roster, defeated: new Set() }
  const run = openRiftRun(world.rift)
  if (!run) throw new SaveRuleError('cannot-fight', 'Sign up a run first')
  return { tier: Number(tier), runId: run.id, roster, defeated: defeatedBefore(save.account.defeated, run.startedAt) }
}

/**
 * Why this fight can't start, or null. One Rift fight a world at a time, beside the world map's. A front takes its next
 * stage only, by a full world party (`party` 0–19) of the run's roster; a Convergence fight is the open attempt's next,
 * by its frozen party (`party` is ignored); an Echo needs the Rift open and a full party of Lv 50 Umas. Given `outfits`,
 * the party also fields one healer at most (classes v2, `healerBlock`).
 */
export function riftFightBlock(save: Save, ref: RiftFightRef, party: number | null, tier = TIER_ONE, outfits?: ReadonlyMap<string, BattleOutfit>):
  string | null {
  const world = save.tierWorlds[tier]
  if (!world) return 'No such tier'
  const clean = cleanRef(ref)
  if (!clean) return 'No such fight'
  if (world.rift.battle) return 'Finish the open Rift fight first'
  const healers = (ids: readonly string[]) => (outfits ? healerBlock(world, ids, outfits) : null)
  const worldParty = (each: (id: string) => string | null) => partyBlock(world, party, each) ?? healers(world.parties[party!]!.slots as string[])
  if (clean.kind === 'echo') {
    if (!riftOpen(world, Number(tier))) return openWords(Number(tier))
    return worldParty((id) => (atTop(world, id) ? null : 'Needs five Lv 50 Umas'))
  }
  const run = fightingRun(world)
  if (!run) return 'Sign up a run first'
  if (clean.kind === 'front') {
    const cleared = run.fronts[clean.front]
    if (cleared >= RIFT_STAGES) return `${RIFT_FRONT_SPECS[clean.front].name} is sealed`
    if (clean.stage !== cleared + 1) return `Stage ${cleared + 1} is next`
    return worldParty((id) => (run.roster.includes(id) ? null : 'Only the run’s twenty fight here'))
  }
  const attempt = run.convergence.open
  if (!attempt) return 'Begin an attempt first'
  if (clean.fight !== attempt.rounds.length) return `Fight ${attempt.rounds.length + 1} is next`
  if (attempt.parties[clean.fight]!.some((id) => !world.umas[id])) return 'Only this tier’s Umas'
  return healers(attempt.parties[clean.fight]!)
}

/**
 * Starts a Rift fight (D171): the generator's foes for this run (`riftFight`), the members as `startFight` builds them,
 * HP and MP full (R4), as the world's next Rift fight (`riftBattleId`) with its own seed, so a retry draws a fresh seed
 * against the same foes.
 */
export function startRiftFight(save: Save, ref: RiftFightRef, party: number | null, outfits: ReadonlyMap<string, BattleOutfit>, roster: EnemyRoster,
  now: string, tier = TIER_ONE): Save {
  const block = riftFightBlock(save, ref, party, tier, outfits)
  if (block) throw new SaveRuleError('cannot-fight', block)
  const world = worldOf(save, tier)
  const clean = cleanRef(ref)!
  const ids = clean.kind === 'convergence' ? fightingRun(world)!.convergence.open!.parties[clean.fight]! : (world.parties[party!]!.slots as string[])
  // MP full every fight (R4): no carried MP, whatever the world map's run holds for her.
  const allies = rpgPartyAllies(partyMembers(world, ids, outfits, tier), (profile, points) => rpgCarriedMp({ mp: {} }, profile, points))
  const n = world.rift.battles + 1
  const battleId = riftBattleId(Number(tier), n)
  let input: BattleInput
  try {
    input = riftBattleInput(riftFight(riftContextFor(save, clean, roster, tier), clean), allies, riftSeed(battleId))
    createBattle(input)
  } catch (err) {
    throw new SaveRuleError('cannot-fight', err instanceof Error ? err.message : 'cannot start that fight')
  }
  const battle: RiftBattle = { battleId, ref: clean, startedAt: now, input, actions: [] }
  return withWorld(save, tier, { ...world, rift: { ...world.rift, battle, battles: n } }, now)
}

/** The open Rift fight's current step, replayed from its actions, or null. */
export function riftBattleStep(world: TierWorld): BattleStep | null {
  const battle = world.rift.battle
  return battle ? replayBattle(battle.input, battle.actions) : null
}

/** Takes one action in the open Rift fight; when it ends the fight, settles it in the same save. */
export function actInRiftFight(save: Save, action: BattleAction, roster: EnemyRoster, now: string, tier = TIER_ONE):
  { save: Save; step: BattleStep; result: RiftFightResult | null } {
  const world = worldOf(save, tier)
  const battle = world.rift.battle
  if (!battle) throw new SaveRuleError('cannot-fight', 'No open Rift fight')
  const current = replayBattle(battle.input, battle.actions)
  if (current.state.outcome !== 'active') throw new SaveRuleError('cannot-fight', 'The fight is over')
  if (battle.actions.length >= RPG_MAX_BATTLE_ACTIONS) throw new SaveRuleError('cannot-fight', 'Too many actions')
  const step = applyBattleAction(current.state, action)
  if (step.error) throw new SaveRuleError('cannot-fight', RPG_REFUSED[step.error])
  const acted: RiftBattle = { ...battle, actions: [...battle.actions, action] }
  if (step.state.outcome === 'active') return { save: withWorld(save, tier, { ...world, rift: { ...world.rift, battle: acted } }, now), step, result: null }
  return { ...settleRiftFight(save, acted, step.state, roster, now, tier), step }
}

/** Leaves the open Rift fight: nothing is paid or recorded, and a Convergence fight's attempt ends with it. */
export function leaveRiftFight(save: Save, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const battle = world.rift.battle
  if (!battle) throw new SaveRuleError('cannot-fight', 'No open Rift fight')
  return withWorld(save, tier, { ...world, rift: closeAttempt({ ...world.rift, battle: null }, battle.ref) }, now)
}

/** After a lost or abandoned Convergence fight, the attempt is over (§6): the next starts from the first fight. */
function closeAttempt(rift: RiftState, ref: RiftFightRef): RiftState {
  if (ref.kind !== 'convergence') return rift
  const run = openRiftRun(rift)
  return run?.convergence.open ? withLastRun(rift, { ...run, convergence: { ...run.convergence, open: null } }) : rift
}

/** The distinct traces a fight showed (§7), in `RIFT_TRACES` order: damage an Uma's hit dealt a foe in each channel (an
 * attack, skill, summon or Limit Break; not Thorns, Mirror or Burn, which return or tick), and an Uma knocked out. */
export function riftTraces(input: BattleInput, actions: readonly BattleAction[]): RiftTrace[] {
  const allies = new Set(input.allies.map((a) => a.id))
  const seen = new Set<RiftTrace>()
  for (const cue of replayBattle(input, actions).cues) {
    if (cue.kind === 'hit' && allies.has(cue.actorId) && !allies.has(cue.targetId) && cue.amount > 0 && cue.label !== 'Thorns' && cue.label !== 'Mirror'
      && (cue.channel === 'physical' || cue.channel === 'magical')) seen.add(cue.channel)
    if (cue.kind === 'ko' && allies.has(cue.targetId)) seen.add('ko')
  }
  return RIFT_TRACES.filter((t) => seen.has(t))
}

/** The account's defeated faces after a win (D171): each foe of every wave whose roster tier is boss or sub-boss, at
 * `now`, if absent (up to the save's `MAX_DEFEATED`). */
function recordDefeated(defeated: Account['defeated'], input: BattleInput, roster: EnemyRoster, now: string): Account['defeated'] {
  const tierOf = new Map(roster.map((m) => [m.id, m.tier]))
  const out = { ...defeated }
  let count = Object.keys(out).length
  for (const foe of [...input.enemies, ...(input.waves ?? []).flat()]) {
    const face = tierOf.get(foe.castId)
    if ((face === 'boss' || face === 'subboss') && out[foe.castId] === undefined && count < MAX_DEFEATED) { out[foe.castId] = now; count += 1 }
  }
  return out
}

/**
 * Closes a finished Rift fight. A loss pays and records nothing (and ends a Convergence attempt). A win clears a front's
 * stage and merges its traces, counts a Convergence fight (the fourth wins the run), or pays an Echo; then records the
 * faces defeated and stores what `achievementsEarned` grants. Front and Convergence fights pay nothing else (D168). From
 * v16 any win confirms each fighter's calling pick (CP29, H69).
 */
function settleRiftFight(save: Save, battle: RiftBattle, state: BattleState, roster: EnemyRoster, now: string, tier: string): { save: Save; result: RiftFightResult } {
  const world = worldOf(save, tier)
  const { ref } = battle
  const result: RiftFightResult = { outcome: state.outcome === 'victory' ? 'victory' : 'loss', ref, rounds: state.round, members: [], gearMarks: 0, classMarks: 0,
    cleared: null, attempt: null, runWon: false, earned: [] }
  let rift: RiftState = { ...world.rift, battle: null }
  if (state.outcome !== 'victory') return { save: withWorld(save, tier, { ...world, rift: closeAttempt(rift, ref) }, now), result }
  let next = world
  let run: RiftRun | null = null
  let attemptRounds: number[] | null = null
  if (ref.kind === 'front') {
    const current = fightingRun(world)!
    const fresh = riftTraces(battle.input, battle.actions)
    const had = current.traces[ref.front] ?? []
    run = { ...current, fronts: { ...current.fronts, [ref.front]: ref.stage },
      traces: { ...current.traces, [ref.front]: RIFT_TRACES.filter((t) => had.includes(t) || fresh.includes(t)) } }
    rift = withLastRun(rift, run)
    result.cleared = ref.stage
  } else if (ref.kind === 'convergence') {
    const current = fightingRun(world)!
    const attempt = current.convergence.open!
    attemptRounds = [...attempt.rounds, state.round]
    const won = attemptRounds.length === CONVERGENCE_FIGHTS
    run = { ...current, convergence: { attempts: current.convergence.attempts, open: won ? null : { parties: attempt.parties, rounds: attemptRounds } },
      wonAt: won ? now : null }
    rift = withLastRun(rift, run)
    Object.assign(result, { attempt: attemptRounds.length, runWon: won })
  } else {
    const used = usedWeapons(battle.input, battle.actions)
    const entrants: Entrant[] = battle.input.allies.map((a) => ({ outfitId: a.id, classId: a.classId, weapons: a.weapons, used: used.get(a.id) ?? new Set() }))
    const paid = payEcho(world, entrants, battle.input.enemies[0]?.level ?? echoFoeLevel(Number(tier), ref.level), tier)
    next = paid.world
    Object.assign(result, { members: paid.members, gearMarks: paid.gearMarks, classMarks: paid.classMarks })
    const won = rift.echoes[ref.front] ?? {}
    rift = { ...rift, echoes: { ...rift.echoes, [ref.front]: { ...won, [ref.level]: won[ref.level] ?? now } } }
  }
  next = winnersConfirmed(next, battle.input.allies.map((a) => a.id))
  const defeated = recordDefeated(save.account.defeated, battle.input, roster, now)
  result.earned = achievementsEarned({ tier: Number(tier), ref, run, attemptRounds, state, defeated, roster }, save.account.achievements)
  const achievements = { ...save.account.achievements }
  for (const grant of result.earned) achievements[grant.id] = { at: now, run: grant.run }
  return {
    save: { ...save, account: { ...save.account, updatedAt: now, defeated, achievements }, tierWorlds: { ...save.tierWorlds, [tier]: { ...next, rift } } },
    result,
  }
}

/** The world with each of these Umas' calling confirmed by a win (`callingConfirmed`); the same world when none moves. */
function winnersConfirmed(world: TierWorld, ids: readonly string[]): TierWorld {
  const moved = ids.filter((id) => world.umas[id] && callingConfirmed(world.umas[id]) !== world.umas[id])
  if (!moved.length) return world
  return { ...world, umas: { ...world.umas, ...Object.fromEntries(moved.map((id) => [id, callingConfirmed(world.umas[id]!)])) } }
}

// --- The Convergence (§6) --------------------------------------------------------------------------------------------

/** Why these four world parties (Iron's, Arcane's, Duel's and Horde's, in that order) can't begin an attempt, or null:
 * every front sealed, no attempt open, four different full parties whose twenty are exactly the run's roster, and, given
 * `outfits`, one healer at most in each (classes v2, `healerBlock`), so an attempt never begins with a party that can't
 * fight. */
export function convergenceBlock(save: Save, parties: readonly number[], tier = TIER_ONE, outfits?: ReadonlyMap<string, BattleOutfit>): string | null {
  const world = save.tierWorlds[tier]
  if (!world) return 'No such tier'
  const run = fightingRun(world)
  if (!run) return 'Sign up a run first'
  if (RIFT_FRONTS.some((f) => run.fronts[f] < RIFT_STAGES)) return 'Seal all four fronts first'
  if (run.convergence.open) return 'An attempt is on'
  if (parties.length !== CONVERGENCE_FIGHTS) return `Pick ${CONVERGENCE_FIGHTS} parties`
  if (new Set(parties).size !== parties.length) return `Pick ${CONVERGENCE_FIGHTS} different parties`
  for (const party of parties) {
    const block = partyBlock(world, party, () => null)
    if (block) return block
  }
  const members = parties.flatMap((p) => world.parties[p]!.slots as string[])
  if (members.some((id) => !run.roster.includes(id)) || run.roster.some((id) => !members.includes(id))) return 'The four parties must be the run’s twenty'
  const healers = outfits ? parties.map((p) => healerBlock(world, world.parties[p]!.slots as string[], outfits)) : []
  return healers.find((block) => block !== null) ?? null
}

/** Begins a Convergence attempt: the four parties' members are frozen for its four fights, and the attempt counts. The
 * game passes `outfits`, so each party's healers are checked (`convergenceBlock`). */
export function beginConvergence(save: Save, parties: readonly number[], now: string, tier = TIER_ONE, outfits?: ReadonlyMap<string, BattleOutfit>): Save {
  const block = convergenceBlock(save, parties, tier, outfits)
  if (block) throw new SaveRuleError('bad-party', block)
  const world = worldOf(save, tier)
  const run = fightingRun(world)!
  const frozen = parties.map((p) => [...(world.parties[p]!.slots as string[])])
  const next: RiftRun = { ...run, convergence: { attempts: run.convergence.attempts + 1, open: { parties: frozen, rounds: [] } } }
  return withWorld(save, tier, { ...world, rift: withLastRun(world.rift, next) }, now)
}

/** Ends the open attempt between fights (leaving a Convergence fight ends it too). */
export function abandonConvergence(save: Save, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const run = fightingRun(world)
  if (!run?.convergence.open) throw new SaveRuleError('cannot-fight', 'No attempt is on')
  if (world.rift.battle?.ref.kind === 'convergence') throw new SaveRuleError('cannot-fight', 'Leave the open fight first')
  return withWorld(save, tier, { ...world, rift: withLastRun(world.rift, { ...run, convergence: { ...run.convergence, open: null } }) }, now)
}

// --- Echoes and Sweeps (§8, R6) --------------------------------------------------------------------------------------

/**
 * Pays an Echo win to the five still owned here (R6): her E is a regular stage's EXP at the Echo's level for her
 * (`rpgBattleExp`, so Lv 45 pays less and Lv 55 no more than Lv 50), and `ECHO_RANK_PAY` × what a stage fills goes to her
 * class, weapons, armor and accessories, Marks past the caps. No Uma EXP, levels, Shards, Laurels or Bonds. From v16 it
 * confirms her calling pick, an Echo Sweep's too (CP29, H69).
 */
function payEcho(world: TierWorld, entrants: readonly Entrant[], foeLevel: number, tier: string): { world: TierWorld; members: MemberGain[]; gearMarks: number; classMarks: number } {
  const umas = { ...world.umas }
  const members: MemberGain[] = []
  let gearMarks = 0, classMarks = 0
  for (const e of entrants) {
    const uma = umas[e.outfitId]
    if (!uma) continue
    const exp = rpgBattleExp('fight', foeLevel, rpgMemberLevel({ tier: Number(tier), level: uma.level }))
    const filled = fillRanks(uma, e, exp, ECHO_RANK_PAY)
    umas[e.outfitId] = callingConfirmed({ ...uma, ranks: filled.ranks })
    gearMarks += filled.gearMarks
    classMarks += filled.classMarks
    members.push({ outfitId: e.outfitId, exp: 0, beforeLevel: uma.level, afterLevel: uma.level, afterExp: uma.exp, shards: 0, ranks: filled.gains, bonds: [] })
  }
  const wallet = { ...world.wallet, ...('gearMarks' in world.wallet ? { gearMarks: (world.wallet.gearMarks ?? 0) + gearMarks } : {}),
    classMarks: world.wallet.classMarks + classMarks }
  return { world: { ...world, umas, wallet }, members, gearMarks, classMarks }
}

/** Why this party can't sweep this Echo, or null: the Rift open, the Echo won before, a full party of Lv 50 Umas and a
 * Sweep Ticket. */
export function sweepEchoBlock(save: Save, front: RiftFront, level: EchoLevel, party: number, tier = TIER_ONE): string | null {
  const world = save.tierWorlds[tier]
  if (!world) return 'No such tier'
  if (!isFront(front) || !ECHO_LEVELS.includes(level)) return 'No such Echo'
  if (!riftOpen(world, Number(tier))) return openWords(Number(tier))
  if (!world.rift.echoes[front]?.[level]) return 'Win it first'
  const block = partyBlock(world, party, (id) => (atTop(world, id) ? null : 'Needs five Lv 50 Umas'))
  if (block) return block
  return world.wallet.sweepTickets < 1 ? 'No Sweep Tickets' : null
}

/**
 * Sweeps a won Echo up to `times` times (1–99), a Sweep Ticket each, stopping when tickets run out. Each pays exactly an
 * Echo win, her five weapons sharing evenly (nothing is "used"), as a stage Sweep does; the members' gains are merged.
 * No faces are recorded and no achievements earned. `outfits` gives each Uma's class when she hasn't picked one.
 */
export function sweepEcho(save: Save, front: RiftFront, level: EchoLevel, party: number, times: number, outfits: ReadonlyMap<string, BattleOutfit>,
  now: string, tier = TIER_ONE): { save: Save; result: RiftFightResult; swept: number } {
  if (!Number.isInteger(times) || times < 1 || times > MAX_PURCHASE) throw new SaveRuleError('bad-count', `sweep 1–${MAX_PURCHASE} times`)
  let current = save
  const paid: { members: MemberGain[]; gearMarks: number; classMarks: number }[] = []
  for (let i = 0; i < times; i++) {
    const block = sweepEchoBlock(current, front, level, party, tier)
    if (block && i > 0) break
    if (block) throw new SaveRuleError('cannot-fight', block)
    const world = worldOf(current, tier)
    const entrants: Entrant[] = (world.parties[party]!.slots as string[]).map((id) => {
      const outfit = outfits.get(id)
      if (!outfit) throw new SaveRuleError('cannot-fight', `outfit ${id} isn't in the game data`)
      const classId = activeClass(outfit, world.umas[id]!)
      return { outfitId: id, classId, weapons: classOf(world.umas[id]!, classId).weapons, used: new Set<never>() }
    })
    const one = payEcho(world, entrants, echoFoeLevel(Number(tier), level), tier)
    current = withWorld(current, tier, { ...one.world, wallet: { ...one.world.wallet, sweepTickets: one.world.wallet.sweepTickets - 1 } }, now)
    paid.push(one)
  }
  const last = paid[paid.length - 1]!
  const result: RiftFightResult = {
    outcome: 'victory', ref: { kind: 'echo', front, level }, rounds: 0,
    members: last.members.map((m) => mergeGains(paid.map((p) => p.members.find((x) => x.outfitId === m.outfitId)!))),
    gearMarks: paid.reduce((n, p) => n + p.gearMarks, 0), classMarks: paid.reduce((n, p) => n + p.classMarks, 0),
    cleared: null, attempt: null, runWon: false, earned: [], swept: paid.length,
  }
  return { save: current, result, swept: paid.length }
}

// --- Ascend (tiers.md §5, R7) ----------------------------------------------------------------------------------------

/** Why the won run's twenty can't ascend, or null: a won, unascended run; no open Rift or world-map fight; each of the
 * twenty here and free of work; a tier above. `name` names the working Umas (their outfit ids by default). */
export function ascendBlock(save: Save, tier = TIER_ONE, name: (outfitId: string) => string = (id) => id): string | null {
  const world = save.tierWorlds[tier]
  if (!world) return 'No such tier'
  const run = openRiftRun(world.rift)
  if (!run || run.wonAt === null) return 'Win the Rift first'
  if (world.rift.battle) return 'Finish the open Rift fight first'
  if (openFightOf(world)) return 'Finish the open fight first'
  if (run.roster.some((id) => !world.umas[id])) return 'Not all twenty are in this tier'
  const working = run.roster.filter((id) => workOf(world, id) !== null)
  if (working.length) return `Recall or collect: ${working.map(name).join(', ')}`
  if (!TIERS.some((t) => t.tier === Number(tier) + 1)) return 'No tier above this one yet'
  return null
}

/** Moves the old world's parties out with the twenty: a party whose five all leave empties (and takes back its default
 * name, as it moves with its own); others just lose them. */
function emptyParties(parties: readonly Party[], leaving: ReadonlySet<string>): { parties: Party[]; moved: Party[] } {
  const moved: Party[] = []
  const next = parties.map((p, i): Party => {
    if (p.slots.length === PARTY_SIZE && p.slots.every((s) => s !== null && leaving.has(s))) {
      moved.push({ name: p.name, slots: [...p.slots], lead: p.lead })
      return { name: `Party ${i + 1}`, slots: p.slots.map(() => null), lead: null }
    }
    const slots = p.slots.map((s) => (s !== null && leaving.has(s) ? null : s))
    return { ...p, slots, lead: p.lead !== null && slots.includes(p.lead) ? p.lead : null }
  })
  return { parties: next, moved }
}

/** Seats the twenty in the new world: whole parties first, with their names, into its first fully empty parties in
 * order; the rest five at a time, in roster order, into the next ones. Who finds no empty party stays unseated. */
function seatArrivals(parties: readonly Party[], moved: readonly Party[], roster: readonly string[]): Party[] {
  const next = parties.map((p) => ({ ...p, slots: [...p.slots] }))
  const free = () => next.findIndex((p) => p.slots.every((s) => s === null))
  const placed = new Set<string>()
  for (const party of moved) {
    const at = free()
    if (at < 0) break
    next[at] = { name: party.name, slots: [...party.slots], lead: party.lead }
    for (const id of party.slots) placed.add(id!)
  }
  const rest = roster.filter((id) => !placed.has(id))
  for (let i = 0; i < rest.length; i += PARTY_SIZE) {
    const at = free()
    if (at < 0) break
    next[at] = { ...next[at]!, slots: Array.from({ length: PARTY_SIZE }, (_, k) => rest[i + k] ?? null), lead: null }
  }
  return next
}

/**
 * Ascends a won run's twenty to Tier t+1 in one transaction (tiers.md §5, R7). In the old world each leaves its Umas,
 * parties, targets, carried MP and work rows; a Hero's seat empties (its Learners leave, T4) and she leaves every seat she
 * learns in; every piece she owns returns to its gear stock. The new world (created with no Uma Tickets, D5) gets each at
 * Lv 1 with her class and armor halves and her calling pick (save v27, H69), nothing else of hers; its wallet gains the
 * purse (T5) and her banked EXP as Class Marks (T3), and her parties move with her. The run is ascended and each Uma's
 * history records the climb.
 */
export function ascend(save: Save, now: string, tier = TIER_ONE): { save: Save; summary: AscendSummary } {
  const block = ascendBlock(save, tier)
  if (block) throw new SaveRuleError(block.startsWith('Recall') ? 'busy' : 'cannot-fight', block)
  const from = Number(tier), to = from + 1, toKey = tierKey(to)
  const world = worldOf(save, tier)
  const run = openRiftRun(world.rift)!
  const leaving = new Set(run.roster)
  // The old world: they leave, and their gear stays in its stock (D15).
  const umas = { ...world.umas }, gear = { ...world.gear }, mp = { ...world.world.run.mp }, work = { ...world.work }
  let classMarks = 0
  for (const id of run.roster) {
    const uma = world.umas[id]!
    for (const piece of ownGear(uma)) gear[piece] = (gear[piece] ?? 0) + 1
    classMarks += bankedMarks(uma.exp)
    delete umas[id]
    delete mp[id]
    delete work[id]
  }
  const heroes: TierWorld['heroes'] = {}
  for (const [seat, held] of Object.entries(world.heroes) as [keyof TierWorld['heroes'], NonNullable<TierWorld['heroes'][keyof TierWorld['heroes']]>][]) {
    if (leaving.has(held.hero)) continue
    heroes[seat] = { hero: held.hero, learners: held.learners.filter((l) => !leaving.has(l)) }
  }
  const { parties, moved } = emptyParties(world.parties, leaving)
  const old: TierWorld = {
    ...world, umas, gear, work, heroes, parties, targets: world.targets.filter((id) => !leaving.has(id)),
    world: { ...world.world, run: { ...world.world.run, mp } },
    rift: withLastRun(world.rift, { ...run, ascendedAt: now }),
  }
  // The new world: each at Lv 1 with her class, armor halves and calling pick; the purse and the banked EXP's Marks.
  const base = save.tierWorlds[toKey] ?? newTierWorld(now, 0)
  const arrivals = Object.fromEntries(run.roster.map((id) => {
    const uma = world.umas[id]!
    const fresh = newOwnedUma(uma.unlockedAt)
    return [id, { ...fresh, classId: uma.classId, gear: { ...gearV1(fresh), kinds: { ...gearV1(uma).kinds } }, ...(uma.calling ? { calling: { ...uma.calling } } : {}) }]
  }))
  const n = run.roster.length
  const laurels = ASCEND_PURSE.laurels * n, speedTickets = ASCEND_PURSE.speedTickets * n
  const up: TierWorld = {
    ...base, umas: { ...base.umas, ...arrivals }, parties: seatArrivals(base.parties, moved, run.roster),
    wallet: { ...base.wallet, laurels: base.wallet.laurels + laurels, timeTickets: base.wallet.timeTickets + speedTickets,
      classMarks: base.wallet.classMarks + classMarks },
  }
  const history = { ...save.account.history }
  for (const id of run.roster) history[id] = [...(history[id] ?? []), { tier: to, at: now, run: run.id }]
  return {
    save: { ...save, account: { ...save.account, updatedAt: now, history }, tierWorlds: { ...save.tierWorlds, [tier]: old, [toKey]: up } },
    summary: { from, to, umas: [...run.roster], laurels, speedTickets, classMarks },
  }
}
