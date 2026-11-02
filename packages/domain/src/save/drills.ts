// Drills and Training Logs (collections.md §6.4, D283, H154), dark until save v35 (`collectionsLive`). The day's runs:
// ten a day on the phone's clock, banked up to thirty; a won Drill sweeps for runs, no Sweep Ticket. A Log holds one
// fight's EXP for whoever reads it: a third of her next level, and twice that to the class she fights as, as a win pays
// her. The fight itself is the world map's open fight; `settleFight` closes it (`settleDrill`). Lazy: `@rpg/domain/drills`.
import { BATTLE_ENGINE_VERSION } from '../rpg/battle/caps'
import type { RpgCampaignChapter } from '../rpg/campaign/chapters'
import { rpgShardsBetween } from '../rpg/campaign/rewards'
import { rpgBeginRunBattle } from '../rpg/campaign/run'
import { daysBetween, DRILL_COUNT, DRILL_LOGS, drillId, drillNodeId, isDrillChapter, logExp } from '../rpg/drills'

// The Drills' fights and ids, for the page that loads this.
export { drillChapter, logExp } from '../rpg/drills'
import { grantRpgExp, RPG_TIER_MAX_LEVEL } from '../rpg/rules'
import { activeClass, classOf, fillRanks, healerBlock, openFightOf, partyMembers, type BattleOutfit } from './battle'
import { collectionsLive } from './collections'
import { SaveRuleError, TIER_ONE, worldOf } from './rules'
import { DRILL_RUNS_A_DAY, DRILL_RUNS_MAX, newDrills, PARTY_SIZE, SHARDS_PER_TICKET, type DrillsState, type Save, type TierWorld } from './save'

const DARK = 'Drills open with the collections'

/** The world's Drills on `today`: a day's runs for each day turned since, banked up to thirty. */
export function drillsOn(drills: DrillsState | undefined, today: string): DrillsState {
  const d = drills ?? newDrills()
  if (d.day === null) return { ...d, day: today }
  const days = daysBetween(d.day, today)
  return days === 0 ? d : { ...d, day: today, runs: Math.min(DRILL_RUNS_MAX, d.runs + DRILL_RUNS_A_DAY * days) }
}

/** Whether the world's Drills are open: once it has won a map stage. */
export const drillsOpen = (world: Pick<TierWorld, 'world'>): boolean =>
  Object.entries(world.world.run.wins).some(([id, n]) => n > 0 && id !== 'start' && !id.startsWith('drill-'))

function withWorld(save: Save, tier: string, world: TierWorld, now: string): Save {
  return { ...save, account: { ...save.account, updatedAt: now }, tierWorlds: { ...save.tierWorlds, [tier]: world } }
}

/** Why Drill `n` can't be fought now by the active party, or null. */
export function drillFightBlock(save: Save, n: number, outfits: ReadonlyMap<string, BattleOutfit>, today: string, tier = TIER_ONE): string | null {
  if (!collectionsLive()) return DARK
  if (!Number.isInteger(n) || n < 1 || n > DRILL_COUNT) return 'No such Drill'
  const world = worldOf(save, tier)
  if (!drillsOpen(world)) return 'Win a stage first'
  if (drillsOn(world.drills, today).runs < 1) return 'No runs left'
  if (openFightOf(world)) return 'Finish the open fight first'
  const slots = world.parties[world.world.activeParty]?.slots ?? []
  if (slots.length !== PARTY_SIZE || slots.some((s) => s === null)) return 'A fight needs a full party of five'
  return healerBlock(world, slots as string[], outfits, BATTLE_ENGINE_VERSION, tier)
}

/** Starts Drill `n` with the active party at full HP and MP; the world's carried MP stays as it was. */
export function startDrill(save: Save, chapter: RpgCampaignChapter, n: number, outfits: ReadonlyMap<string, BattleOutfit>, today: string, now: string,
  tier = TIER_ONE): Save {
  const block = drillFightBlock(save, n, outfits, today, tier)
  if (block) throw new SaveRuleError('cannot-fight', block)
  if (!isDrillChapter(chapter)) throw new SaveRuleError('cannot-fight', 'Not a Drill')
  const world = worldOf(save, tier)
  const run = world.world.run
  const party = world.world.activeParty
  const members = partyMembers(world, world.parties[party]!.slots as string[], outfits, tier)
  let begun
  try {
    begun = rpgBeginRunBattle(chapter, { ...run, mp: {}, party }, drillNodeId(Number(tier), n), members, now)
  } catch (err) {
    throw new SaveRuleError('cannot-fight', err instanceof Error ? err.message : 'cannot start that Drill')
  }
  return withWorld(save, tier, { ...world, drills: drillsOn(world.drills, today), world: { ...world.world, run: { ...begun, mp: run.mp } } }, now)
}

/** Why Drill `n` can't be swept `times` times, or null: a won Drill and the runs for it. */
export function sweepDrillBlock(save: Save, n: number, times: number, today: string, tier = TIER_ONE): string | null {
  if (!collectionsLive()) return DARK
  if (!Number.isInteger(times) || times < 1) return 'Sweep at least once'
  const world = worldOf(save, tier)
  if (!world.drills?.won[drillId(n)]) return 'Win it first'
  const runs = drillsOn(world.drills, today).runs
  if (runs < times) return runs === 0 ? 'No runs left' : `${runs} runs left`
  return null
}

/** Sweeps a won Drill: its Logs `times` over, one run each. */
export function sweepDrill(save: Save, n: number, times: number, today: string, now: string, tier = TIER_ONE): { save: Save; logs: number } {
  const block = sweepDrillBlock(save, n, times, today, tier)
  if (block) throw new SaveRuleError('cannot-fight', block)
  const world = worldOf(save, tier)
  const drills = drillsOn(world.drills, today)
  const logs = DRILL_LOGS[n - 1]! * times
  const wallet = { ...world.wallet, trainingLogs: (world.wallet.trainingLogs ?? 0) + logs }
  return { save: withWorld(save, tier, { ...world, wallet, drills: { ...drills, runs: drills.runs - times } }, now), logs }
}

/** Logs that take her from her level to `target` (at most Lv 50), from what she has banked toward the next. */
export function logsToLevel(level: number, exp: number, target: number): number {
  let n = 0
  let at = { level, exp }
  while (at.level < Math.min(target, RPG_TIER_MAX_LEVEL)) {
    const next = grantRpgExp({ tier: 1, level: at.level, exp: at.exp }, logExp(at.level))
    at = { level: next.level, exp: next.exp }
    n += 1
  }
  return n
}

export interface LogsResult {
  read: number
  before: { level: number; rank: number }
  after: { level: number; rank: number }
  shards: number
  tickets: number
  classMarks: number
}

/** Why `count` Logs can't go onto her now, or null. */
export function readLogsBlock(save: Save, outfitId: string, count: number, tier = TIER_ONE): string | null {
  if (!collectionsLive()) return DARK
  const world = worldOf(save, tier)
  const uma = world.umas[outfitId]
  if (!uma) return 'Only this tier’s Umas'
  if (uma.level >= RPG_TIER_MAX_LEVEL) return 'Lv 50 · Trials pay ranks'
  if (!Number.isInteger(count) || count < 1) return 'Read at least one'
  if ((world.wallet.trainingLogs ?? 0) < count) return 'Not enough Logs'
  return null
}

/**
 * Reads `count` Logs onto her, one at a time so a level reprices the next: each her next level's third in Uma EXP, with
 * Shards by level in Tier 1, and that twice to the class she fights as by a win's rules (a Tier 0 at Rank 10 keeps it
 * waiting; past Rank 50 it banks as Class Marks at half). She stops at Lv 50 and the Logs left stay in the wallet.
 */
export function readLogs(save: Save, outfitId: string, count: number, outfits: ReadonlyMap<string, BattleOutfit>, now: string, tier = TIER_ONE):
  { save: Save; result: LogsResult } {
  const block = readLogsBlock(save, outfitId, count, tier)
  if (block) throw new SaveRuleError('cannot-fight', block)
  const outfit = outfits.get(outfitId)
  if (!outfit) throw new SaveRuleError('cannot-fight', 'Her outfit isn’t loaded')
  const world = worldOf(save, tier)
  let uma = world.umas[outfitId]!
  const classId = activeClass(outfit, uma, tier)
  const entrant = { classId, weapons: classOf(uma, classId).weapons, used: new Set<never>() }
  const rankOf = () => uma.ranks.classes[classId]?.rank ?? 1
  const before = { level: uma.level, rank: rankOf() }
  let read = 0, shards = 0, classMarks = 0
  while (read < count && uma.level < RPG_TIER_MAX_LEVEL) {
    const exp = logExp(uma.level)
    const gained = grantRpgExp({ tier: Number(tier), level: uma.level, exp: uma.exp }, exp)
    if (tier === TIER_ONE) shards += rpgShardsBetween(uma.level, gained.level)
    const filled = fillRanks(uma, entrant, exp, 1, BATTLE_ENGINE_VERSION, tier)
    classMarks += filled.classMarks
    uma = { ...uma, level: gained.level, exp: gained.exp, ranks: filled.ranks }
    read += 1
  }
  const pooled = world.wallet.shards + shards
  const tickets = Math.floor(pooled / SHARDS_PER_TICKET)
  const wallet = { ...world.wallet, trainingLogs: (world.wallet.trainingLogs ?? 0) - read, unlockTickets: world.wallet.unlockTickets + tickets,
    shards: pooled % SHARDS_PER_TICKET, classMarks: world.wallet.classMarks + classMarks }
  const next = withWorld(save, tier, { ...world, wallet, umas: { ...world.umas, [outfitId]: uma } }, now)
  return { save: next, result: { read, before, after: { level: uma.level, rank: rankOf() }, shards, tickets, classMarks } }
}
