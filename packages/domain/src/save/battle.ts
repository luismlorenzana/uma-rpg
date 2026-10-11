// Battle rules over the save (S3): class builds and skills, chapter runs, fights and their rewards. Pure functions that
// return a new save or throw SaveRuleError, like the collection rules. Design: docs/design/battles.md, D48–D52.
import type { Aptitudes } from '@luismlorenzana/uma-data'
import { best } from '../roster/aptitudes'
import type { BattleAction, BattleState, BattleStep } from '../rpg/battle/types'
import type { RpgCampaignChapter, RpgMapNode } from '../rpg/campaign/chapters'
import { rpgBattleExp, rpgBattleLaurels, rpgRewardKind, rpgShardsBetween } from '../rpg/campaign/rewards'
import { levelBand, rollTokens } from '../economy/tokens'
import { SPRING_RECHARGE_MS } from '../world/world'
import {
  rpgAbandonRunBattle, rpgActInRun, rpgBeginRunBattle, rpgCloseRunBattle, rpgMemberLevel,
  type RpgPartyMember, type RpgRun,
} from '../rpg/campaign/run'
import { rpgNode } from '../rpg/catalog'
import {
  forgetRpgVariant, grantRpgExp, learnRpgNode, RPG_BUILD, RPG_DEFAULT_FAMILIAR, RPG_WEAPON_KINDS, rpgActiveSlots, rpgDefaultBuild,
  rpgUsableLoadout, type RpgBuildId, type RpgProfile, type RpgWeaponKind,
} from '../rpg/rules'
import { depthsOpen } from '../economy/training'
import { starPoints } from '../economy/dishes'
import { addPoints, type Points } from '../economy/bonus'
import { equippedPoints } from '../economy/gear'
import { PARTY_SIZE, SHARDS_PER_TICKET, type ClassBuild, type OwnedUma, type Save, type TierWorld } from './save'
import { SaveRuleError, TIER_ONE, worldOf } from './rules'
import { workOf } from './status'

/** What the battle rules need from an outfit's master data (a `RosterOutfit` fits). */
export interface BattleOutfit {
  outfitId: string
  baseStats: Record<'speed' | 'stamina' | 'power' | 'guts' | 'wit', number>
  growthRatePercents: Record<'speed' | 'stamina' | 'power' | 'guts' | 'wit', number>
  aptitudes: Pick<Aptitudes, 'strategy'>
}

function withWorld(save: Save, tier: string, world: TierWorld, now: string): Save {
  return { ...save, account: { ...save.account, updatedAt: now }, tierWorlds: { ...save.tierWorlds, [tier]: world } }
}

function ownedOf(world: TierWorld, outfitId: string): OwnedUma {
  const uma = world.umas[outfitId]
  if (!uma) throw new SaveRuleError('not-owned', 'only owned Umas can fight')
  return uma
}

// --- Builds --------------------------------------------------------------------------------------------------------

/** The build she fights with: the chosen one, or her best running style's class. */
export function activeBuild(outfit: BattleOutfit, uma: Pick<OwnedUma, 'build'>): RpgBuildId {
  return uma.build ?? rpgDefaultBuild(best(outfit.aptitudes.strategy)[0])
}

export const EMPTY_BUILD: ClassBuild = { tree: [], loadout: [], familiar: RPG_DEFAULT_FAMILIAR }
export const buildOf = (uma: Pick<OwnedUma, 'builds'>, build: RpgBuildId): ClassBuild => uma.builds[build] ?? EMPTY_BUILD

/** Her battle profile in a build (the active one by default), with depths gated by her level (D49). */
export function umaProfile(outfit: BattleOutfit, uma: OwnedUma, tier: number, build: RpgBuildId = activeBuild(outfit, uma)): RpgProfile {
  const growth = (key: keyof BattleOutfit['growthRatePercents']) => Math.min(1, Math.max(0, outfit.growthRatePercents[key] / 100))
  return {
    outfitId: outfit.outfitId,
    baseStats: { ...outfit.baseStats },
    growthRates: { speed: growth('speed'), stamina: growth('stamina'), power: growth('power'), guts: growth('guts'), wit: growth('wit') },
    classId: RPG_BUILD[build].classId, weapons: [...RPG_BUILD[build].weapons], tier, level: uma.level, exp: uma.exp,
    tree: buildOf(uma, build).tree.map((id) => ({ tier, id })), legacy: [],
    // S5 (D57): her class rank opens the depths, not her level.
    maxDepth: depthsOpen(uma.ranks.classes[RPG_BUILD[build].classId]),
  }
}

function withBuild(save: Save, outfitId: string, build: RpgBuildId, next: ClassBuild, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const uma = ownedOf(world, outfitId)
  return withWorld(save, tier, { ...world, umas: { ...world.umas, [outfitId]: { ...uma, builds: { ...uma.builds, [build]: next } } } }, now)
}

/** Switches the build she fights with. Free at any time; each build keeps its own tree (design §5). */
export function chooseBuild(save: Save, outfitId: string, build: RpgBuildId, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const uma = ownedOf(world, outfitId)
  if (!(build in RPG_BUILD)) throw new SaveRuleError('bad-build', `no build ${build}`)
  return withWorld(save, tier, { ...world, umas: { ...world.umas, [outfitId]: { ...uma, build } } }, now)
}

/** Learns a node in a build. A new skill goes straight into a free slot. Throws with the reason it can't be learned. */
export function learnSkill(save: Save, outfit: BattleOutfit, build: RpgBuildId, nodeId: string, now: string, tier = TIER_ONE): Save {
  const uma = ownedOf(worldOf(save, tier), outfit.outfitId)
  let profile: RpgProfile
  try {
    profile = learnRpgNode(umaProfile(outfit, uma, Number(tier), build), nodeId)
  } catch (err) {
    throw new SaveRuleError('cannot-learn', err instanceof Error ? err.message : 'cannot learn that')
  }
  const current = buildOf(uma, build)
  const equip = rpgNode(nodeId)?.skill && current.loadout.length < rpgActiveSlots(uma.level)
  return withBuild(save, outfit.outfitId, build, {
    ...current, tree: profile.tree.map((r) => r.id), loadout: equip ? [...current.loadout, nodeId] : current.loadout,
  }, now, tier)
}

/** Swaps out a learned variant: its points come back and it leaves the loadout. Core skills are permanent. */
export function forgetSkill(save: Save, outfit: BattleOutfit, build: RpgBuildId, nodeId: string, now: string, tier = TIER_ONE): Save {
  const uma = ownedOf(worldOf(save, tier), outfit.outfitId)
  let profile: RpgProfile
  try {
    profile = forgetRpgVariant(umaProfile(outfit, uma, Number(tier), build), nodeId)
  } catch (err) {
    throw new SaveRuleError('cannot-learn', err instanceof Error ? err.message : 'cannot swap that out')
  }
  const current = buildOf(uma, build)
  return withBuild(save, outfit.outfitId, build, { ...current, tree: profile.tree.map((r) => r.id), loadout: current.loadout.filter((id) => id !== nodeId) }, now, tier)
}

/** Sets a build's equipped skills, in order. Every id must be a learned skill, within her slots. */
export function equipSkills(save: Save, outfit: BattleOutfit, build: RpgBuildId, loadout: readonly string[], now: string, tier = TIER_ONE): Save {
  const uma = ownedOf(worldOf(save, tier), outfit.outfitId)
  const profile = umaProfile(outfit, uma, Number(tier), build)
  const refs = loadout.map((id) => ({ tier: Number(tier), id }))
  const usable = rpgUsableLoadout(profile, refs)
  if (usable.length !== loadout.length) throw new SaveRuleError('bad-loadout', `equip up to ${rpgActiveSlots(uma.level)} learned skills, once each`)
  return withBuild(save, outfit.outfitId, build, { ...buildOf(uma, build), loadout: [...loadout] }, now, tier)
}

export function setFamiliar(save: Save, outfitId: string, familiar: RpgWeaponKind, now: string, tier = TIER_ONE): Save {
  if (!RPG_WEAPON_KINDS.includes(familiar)) throw new SaveRuleError('bad-build', 'no such Familiar form')
  const uma = ownedOf(worldOf(save, tier), outfitId)
  return withBuild(save, outfitId, 'summoner', { ...buildOf(uma, 'summoner'), familiar }, now, tier)
}

/** Every stat point she brings to a fight as this build: her active Extra Stats nodes (S6) and what she wears (S7). */
export function umaPoints(uma: OwnedUma, build: RpgBuildId): Points {
  return addPoints(starPoints(uma.stars.active), equippedPoints(uma.gear.equipped, RPG_BUILD[build].weapons))
}

// --- The world's fights (D66): one world-wide run, the active party, Springs ------------------------------------------

/** The world's run: wins per stage, MP per Uma (absent is full) and the open fight, whichever party fights it. */
export const worldRun = (world: TierWorld): RpgRun => world.world.run
/** The open fight, or null. One at a time, world-wide. */
export const openFightOf = (world: TierWorld): RpgRun | null => (world.world.run.battle ? world.world.run : null)

function withRun(save: Save, run: RpgRun, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  return withWorld(save, tier, { ...world, world: { ...world.world, run } }, now)
}

/** Makes another of the twenty parties the one that fights; not while a fight is open. */
export function setActiveParty(save: Save, party: number, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  if (!Number.isInteger(party) || party < 0 || party >= world.parties.length) throw new SaveRuleError('bad-party', `party ${party} doesn't exist`)
  if (openFightOf(world)) throw new SaveRuleError('in-fight', 'finish the open fight first')
  return withWorld(save, tier, { ...world, world: { ...world.world, activeParty: party } }, now)
}

/** When a Spring is ready again, or null when it is ready now. */
export function springReadyAt(world: TierWorld, springId: string, now: string): string | null {
  const last = world.world.springs[springId]
  if (!last) return null
  const ready = Date.parse(last) + SPRING_RECHARGE_MS
  return ready > Date.parse(now) ? new Date(ready).toISOString() : null
}

/** A Spring refills the active party's MP, then recharges for two hours (D66). */
export function useSpring(save: Save, springId: string, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  if (!/^w\d+-spring\d+$/.test(springId)) throw new SaveRuleError('bad-job', 'no such Spring')
  if (openFightOf(world)) throw new SaveRuleError('in-fight', 'finish the open fight first')
  if (springReadyAt(world, springId, now)) throw new SaveRuleError('bad-job', 'the Spring is still recharging')
  const members = (world.parties[world.world.activeParty]?.slots ?? []).filter((s): s is string => s !== null)
  if (members.length === 0) throw new SaveRuleError('bad-party', 'the active party is empty')
  const mp = { ...world.world.run.mp }
  for (const id of members) delete mp[id]
  return withWorld(save, tier, { ...world, world: { ...world.world, run: { ...world.world.run, mp, updatedAt: now }, springs: { ...world.world.springs, [springId]: now } } }, now)
}

/** Starts a fight on a region's stage with the active party's five members in their active builds. */
export function startFight(save: Save, region: RpgCampaignChapter, nodeId: string, outfits: ReadonlyMap<string, BattleOutfit>,
  now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const party = world.world.activeParty
  const slots = world.parties[party]?.slots
  if (!slots) throw new SaveRuleError('bad-party', `party ${party} doesn't exist`)
  if (slots.some((s) => s === null) || slots.length !== PARTY_SIZE) throw new SaveRuleError('cannot-fight', 'a fight needs a full party of five')
  if (openFightOf(world)) throw new SaveRuleError('cannot-fight', 'a fight is already open')
  const busy = (slots as string[]).filter((id) => workOf(world, id))
  if (busy.length) throw new SaveRuleError('busy', `${busy.length === 1 ? 'one member is' : `${busy.length} members are`} working: recall them first`)
  const members: RpgPartyMember[] = (slots as string[]).map((id) => {
    const outfit = outfits.get(id)
    if (!outfit) throw new SaveRuleError('cannot-fight', `outfit ${id} isn't in the game data`)
    const uma = ownedOf(world, id)
    const build = activeBuild(outfit, uma)
    const profile = umaProfile(outfit, uma, Number(tier), build)
    const loadout = rpgUsableLoadout(profile, buildOf(uma, build).loadout.map((n) => ({ tier: Number(tier), id: n })))
    return { profile, loadout, familiar: buildOf(uma, 'summoner').familiar, points: umaPoints(uma, build) }
  })
  try {
    return withRun(save, rpgBeginRunBattle(region, { ...worldRun(world), party }, nodeId, members, now), now, tier)
  } catch (err) {
    throw new SaveRuleError('cannot-fight', err instanceof Error ? err.message : 'cannot start that fight')
  }
}

/** What a finished fight paid, for the result screen. */
export interface FightResult {
  outcome: 'victory' | 'loss'
  chapterId: string
  nodeId: string
  rounds: number
  members: { outfitId: string; exp: number; beforeLevel: number; afterLevel: number; afterExp: number; shards: number }[]
  laurels: number
  shards: number
  /** Unlock Tickets the Shards completed. */
  tickets: number
  /** Tokens the win dropped into the Warehouse (D67); Sweeps drop none. */
  tokens: Record<string, number>
  /** The stage's first clear: its Laurels pay triple (D66). */
  firstClear?: boolean
}

/**
 * Closes a finished fight. A win pays every entrant (KO'd included) EXP, a Shard at Lv10/20/30/40/50 in Tier 1, the
 * world Laurels (triple on a stage's first clear) and tokens; MP carries. A loss leaves the run as it was before.
 */
export function settleFight(save: Save, chapter: RpgCampaignChapter, run: RpgRun, state: BattleState, now: string, tier = TIER_ONE): { save: Save; result: FightResult } {
  const world = worldOf(save, tier)
  const battle = run.battle
  if (!battle) throw new SaveRuleError('cannot-fight', 'no open fight')
  const node: Pick<RpgMapNode, 'id' | 'kind' | 'level' | 'stage'> = chapter.nodes.find((n) => n.id === battle.nodeId) ??
    // A node a rebalance removed still settles, as a regular fight at its foes' level.
    { id: battle.nodeId, kind: 'fight', level: battle.input.enemies[0]?.level ?? chapter.levelStart, stage: 0 }
  const closed = rpgCloseRunBattle(run, state, { id: node.id, kind: node.kind }, now)
  const result: FightResult = { outcome: state.outcome === 'victory' ? 'victory' : 'loss', chapterId: chapter.id, nodeId: node.id,
    rounds: state.round, members: [], laurels: 0, shards: 0, tickets: 0, tokens: {} }
  if (state.outcome !== 'victory') return { save: withRun(save, closed, now, tier), result }
  const kind = rpgRewardKind(node)
  const firstClear = (run.wins[node.id] ?? 0) === 0
  const paid = payEntrants(world, battle.input.allies.map((a) => a.id), kind, node.level, rpgBattleLaurels(kind, chapter.tier) * (firstClear ? 3 : 1), tier)
  // Tokens of the fight's band, decided by its seed so the same fight always drops the same ones (D67).
  const tokens = rollTokens(`${battle.input.seed}:${node.id}`, kind, levelBand(node.level))
  const items = { ...paid.world.items }
  for (const [id, n] of Object.entries(tokens)) items[id] = (items[id] ?? 0) + n
  Object.assign(result, { members: paid.members, shards: paid.shards, tickets: paid.tickets, laurels: paid.laurels, tokens, firstClear })
  const next: TierWorld = { ...paid.world, items, world: { ...world.world, run: closed } }
  return { save: withWorld(save, tier, next, now), result }
}

/**
 * Pays a won fight to its entrants: EXP by the level gap, a Shard at Lv10/20/30/40/50 in Tier 1 (five make a Ticket),
 * and the world's Laurels. Shared by fights and Sweeps (which pay no Laurels).
 */
export function payEntrants(world: TierWorld, outfitIds: readonly string[], kind: ReturnType<typeof rpgRewardKind>, foeLevel: number, laurels: number,
  tier = TIER_ONE): { world: TierWorld; members: FightResult['members']; shards: number; tickets: number; laurels: number } {
  const umas = { ...world.umas }
  const members: FightResult['members'] = []
  let shards = 0
  for (const id of outfitIds) {
    const uma = umas[id]
    if (!uma) continue // released from the world since: nothing to pay
    const exp = rpgBattleExp(kind, foeLevel, rpgMemberLevel({ tier: Number(tier), level: uma.level }))
    const gained = grantRpgExp({ tier: Number(tier), level: uma.level, exp: uma.exp }, exp)
    const got = tier === TIER_ONE ? rpgShardsBetween(uma.level, gained.level) : 0
    umas[id] = { ...uma, level: gained.level, exp: gained.exp }
    members.push({ outfitId: id, exp, beforeLevel: uma.level, afterLevel: gained.level, afterExp: gained.exp, shards: got })
    shards += got
  }
  const pooled = world.wallet.shards + shards
  const tickets = Math.floor(pooled / SHARDS_PER_TICKET)
  const wallet = { ...world.wallet, unlockTickets: world.wallet.unlockTickets + tickets, shards: pooled % SHARDS_PER_TICKET, laurels: world.wallet.laurels + laurels }
  return { world: { ...world, umas, wallet }, members, shards, tickets, laurels }
}

/** Takes one action in the open fight; when it ends the fight, settles it in the same save. */
export function actInFight(save: Save, chapter: RpgCampaignChapter, action: BattleAction, now: string, tier = TIER_ONE):
  { save: Save; step: BattleStep; result: FightResult | null } {
  const run = openFightOf(worldOf(save, tier))
  if (!run?.battle) throw new SaveRuleError('cannot-fight', 'no open fight')
  let acted: { run: RpgRun; step: BattleStep }
  try {
    acted = rpgActInRun(run, action, now)
  } catch (err) {
    throw new SaveRuleError('cannot-fight', err instanceof Error ? err.message : 'action refused')
  }
  if (acted.step.state.outcome === 'active') return { save: withRun(save, acted.run, now, tier), step: acted.step, result: null }
  const settled = settleFight(save, chapter, acted.run, acted.step.state, now, tier)
  return { ...settled, step: acted.step }
}

/** Gives up the open fight: nothing is paid and the run is as it was before it. */
export function retreat(save: Save, now: string, tier = TIER_ONE): Save {
  const run = openFightOf(worldOf(save, tier))
  if (!run?.battle) throw new SaveRuleError('cannot-fight', 'no open fight')
  return withRun(save, rpgAbandonRunBattle(run, now), now, tier)
}
