// Capital runs (D293, H160; capitals.md CA1–CA15), dark until save v37. Rules live only on this lazy subpath; types,
// ids and the switch stay in the main bundle. A lane keeps its signed five; its fights share the map's one open slot.
import type { BattleState } from '../rpg/battle/types'
import type { RpgCampaignChapter } from '../rpg/campaign/chapters'
import { rpgRewardKind } from '../rpg/campaign/rewards'
import { rpgBeginRunBattle, rpgCloseRunBattle, type RpgRun } from '../rpg/campaign/run'
import { BATTLE_ENGINE_VERSION } from '../rpg/battle/caps'
import { REPLAY_SHARE } from '../economy/pacing'
import { capitalRunId, capitalRunNodeId, capitalRunNodeOf, capitalRunOf, isCapitalRunChapter } from '../world/capital-run-id'
import { stageExpPay, stagePay } from '../world/world'
import { healerBlock, openFightOf, partyMembers, payEntrants, stageLaurels, usedWeapons, type BattleOutfit, type Entrant, type FightResult } from './battle'
import { capitalRunsLive } from './collections'
import { SaveRuleError, TIER_ONE, worldOf } from './rules'
import { CAPITAL_RECENT_MAX, CAPITAL_RUNS_MAX, PARTY_SIZE, type CapitalLanes, type CapitalRecord, type CapitalRun, type Save, type TierWorld } from './save'
import { emptyWindow, stepCode, WINDOW_DARK } from './window-record'
import { recordCapitalWin } from './windows'
import type { WindowNumeral } from '../rpg/windows'

const DARK = 'Capital runs come with save v37'
const emptyCapital = (): CapitalRecord => ({ started: 0, won: 0, recent: [] })
const here = (continent: string, tier: string): boolean => {
  const run = capitalRunOf(`${continent}-run1`)
  return run !== null && Math.ceil(Number(continent.slice(1)) / 5) === Number(tier)
}
const withWorld = (save: Save, tier: string, world: TierWorld, now: string): Save =>
  ({ ...save, account: { ...save.account, updatedAt: now }, tierWorlds: { ...save.tierWorlds, [tier]: world } })

/** Why these four Party Hall rows can't sign up, or null. `name` is the UI's outfit label, as on Ascend. */
export function capitalRunBlock(save: Save, continent: string, parties: readonly number[], tier = TIER_ONE,
  name: (id: string) => string = (id) => id): string | null {
  if (!capitalRunsLive()) return DARK
  const world = save.tierWorlds[tier]
  if (!world) return 'No such tier'
  if (!here(continent, tier)) return 'Not a continent of this tier'
  if (parties.length !== 4 || new Set(parties).size !== 4) return 'Pick four different parties'
  const seen = new Set<string>()
  for (const i of parties) {
    const party = Number.isInteger(i) ? world.parties[i] : undefined
    if (!party) return 'No such party'
    if (party.slots.length !== PARTY_SIZE || party.slots.some((id) => id === null)) return `Party ${i + 1} isn't full`
    for (const id of party.slots as string[]) {
      if (!world.umas[id]) return 'Only this tier’s Umas'
      if (seen.has(id)) return 'An Uma is in two parties'
      seen.add(id)
      const run = world.capitalRuns?.find((r) => r.lanes.some((l) => l.umas.includes(id)))
      if (run) return `${name(id)} is in Run ${capitalRunOf(run.id)!.n}`
    }
  }
  if ((world.capitalRuns?.length ?? 0) >= CAPITAL_RUNS_MAX) return 'Five runs are open'
  if ((world.capitals?.[continent]?.started ?? 0) >= 999_999_999) return 'No more run numbers'
  return null
}

/** Copy four full parties into a new run, without a level gate or a cost. */
export function startCapitalRun(save: Save, continent: string, parties: readonly number[], now: string, tier = TIER_ONE): Save {
  const block = capitalRunBlock(save, continent, parties, tier)
  if (block) throw new SaveRuleError('cannot-fight', block)
  const world = worldOf(save, tier), record = world.capitals?.[continent] ?? emptyCapital()
  const started = record.started + 1
  const run: CapitalRun = { id: capitalRunId(continent, started), continent, startedAt: now,
    lanes: parties.map((party) => ({ party, umas: [...world.parties[party]!.slots], generals: 0, finalAt: null })) as CapitalLanes }
  return withWorld(save, tier, { ...world, capitalRuns: [...(world.capitalRuns ?? []), run],
    capitals: { ...world.capitals, [continent]: { ...record, started } } }, now)
}

/** Abandoning loses progress and frees the twenty; a fight belonging to this run must close first. */
export function abandonCapitalRun(save: Save, runId: string, now: string, tier = TIER_ONE): Save {
  if (!capitalRunsLive()) throw new SaveRuleError('cannot-fight', DARK)
  const world = worldOf(save, tier)
  if (!world.capitalRuns?.some((r) => r.id === runId)) throw new SaveRuleError('cannot-fight', 'No such run')
  if (capitalRunNodeOf(openFightOf(world)?.battle?.nodeId ?? '')?.runId === runId) throw new SaveRuleError('cannot-fight', 'Finish the open fight first')
  return withWorld(save, tier, { ...world, capitalRuns: world.capitalRuns.filter((r) => r.id !== runId) }, now)
}

/** The lane's own progression, independent of any open fight. */
function laneBlock(run: CapitalRun, lane: number, kind: 'general' | 'final'): string | null {
  const row = Number.isInteger(lane) ? run.lanes[lane - 1] : undefined
  if (!row) return 'No such lane'
  if (kind === 'general') return row.generals === 3 ? 'This lane’s generals are beaten' : null
  if (kind !== 'final') return 'No such fight'
  if (run.lanes.some((l) => l.generals !== 3)) return 'Beat every lane’s generals'
  return row.finalAt === null ? null : 'This final is won'
}

/** The lane's next general, or its final after all twelve generals; always the signed five with one healer at most. */
export function capitalFightBlock(save: Save, runId: string, lane: number, kind: 'general' | 'final', outfits: ReadonlyMap<string, BattleOutfit>,
  tier = TIER_ONE): string | null {
  if (!capitalRunsLive()) return DARK
  const world = save.tierWorlds[tier]
  if (!world) return 'No such tier'
  const run = world.capitalRuns?.find((r) => r.id === runId)
  if (!run) return 'No such run'
  if (openFightOf(world)) return 'Finish the open fight first'
  const blocked = laneBlock(run, lane, kind)
  if (blocked) return blocked
  const ids = run.lanes[lane - 1]!.umas
  if (ids.some((id) => !world.umas[id])) return 'Only this tier’s Umas'
  return healerBlock(world, ids, outfits, BATTLE_ENGINE_VERSION, tier)
}

/** A run fight starts with full HP/MP, without spending the world's carried MP. */
export function startCapitalFight(save: Save, chapter: RpgCampaignChapter, runId: string, lane: number, kind: 'general' | 'final',
  outfits: ReadonlyMap<string, BattleOutfit>, now: string, tier = TIER_ONE): Save {
  const block = capitalFightBlock(save, runId, lane, kind, outfits, tier)
  if (block) throw new SaveRuleError('cannot-fight', block)
  if (chapter.id !== runId || !isCapitalRunChapter(chapter) || chapter.tier !== Number(tier)) throw new SaveRuleError('cannot-fight', 'Not this capital run')
  const world = worldOf(save, tier), run = world.capitalRuns!.find((r) => r.id === runId)!, row = run.lanes[lane - 1]!
  const nodeId = capitalRunNodeId(runId, lane, kind === 'final' ? 'final' : (row.generals + 1) as 1 | 2 | 3)
  const members = partyMembers(world, row.umas, outfits, tier)
  let begun: RpgRun
  try { begun = rpgBeginRunBattle(chapter, { ...world.world.run, party: row.party, mp: {} }, nodeId, members, now) }
  catch (err) { throw new SaveRuleError('cannot-fight', err instanceof Error ? err.message : 'Cannot start this fight') }
  return withWorld(save, tier, { ...world, world: { ...world.world, run: { ...begun, mp: world.world.run.mp } } }, now)
}

/** Close a run fight. No stage win or carried MP escapes into the map, and a loss advances or pays nothing. */
export function settleCapitalFight(save: Save, chapter: RpgCampaignChapter, fight: RpgRun, state: BattleState, now: string,
  tier = TIER_ONE): { save: Save; result: FightResult } {
  if (!capitalRunsLive()) throw new SaveRuleError('cannot-fight', DARK)
  const world = worldOf(save, tier), battle = fight.battle
  const ref = capitalRunNodeOf(battle?.nodeId ?? ''), run = world.capitalRuns?.find((r) => r.id === ref?.runId)
  if (!battle || !ref || !run || chapter.id !== run.id) throw new SaveRuleError('cannot-fight', 'No open capital fight')
  const block = laneBlock(run, ref.lane, ref.final ? 'final' : 'general')
  if (block || (!ref.final && ref.general !== run.lanes[ref.lane - 1]!.generals + 1)) throw new SaveRuleError('cannot-fight', block ?? 'Not the next general')
  const node = chapter.nodes.find((n) => n.id === battle.nodeId)
  if (!node) throw new SaveRuleError('cannot-fight', 'No such capital fight')
  const closed = { ...rpgCloseRunBattle(fight, state, node, now), wins: fight.wins, mp: fight.mp, clearedAt: fight.clearedAt }
  const finals = run.lanes.filter((l) => l.finalAt !== null).length
  const result: FightResult = { outcome: state.outcome === 'victory' ? 'victory' : 'loss', chapterId: chapter.id, nodeId: node.id, rounds: state.round,
    members: [], laurels: 0, shards: 0, tickets: 0, gearMarks: 0, classMarks: 0,
    capital: { runId: run.id, lane: ref.lane, ...(ref.final ? { final: finals } : { general: ref.general! }), won: false } }
  if (state.outcome !== 'victory') return { save: withWorld(save, tier, { ...world, world: { ...world.world, run: closed } }, now), result }
  const n = (Number(run.continent.slice(1)) - 5 * (Number(tier) - 1)) as WindowNumeral
  const first = (id: string) => stepCode(save.account.windows?.[id]?.[tier] ?? emptyWindow(), `world-${n}`) === WINDOW_DARK
  const used = usedWeapons(battle.input, battle.actions)
  const entrants: Entrant[] = battle.input.allies.map((a) => ({ outfitId: a.id, classId: a.classId, weapons: a.weapons, used: used.get(a.id) ?? new Set() }))
  const firstClear = entrants.some((e) => first(e.outfitId)), kind = rpgRewardKind(node)
  const expFactor = ref.final ? stageExpPay(node) : 0.5
  const paid = payEntrants(world, entrants, kind, node.level, Math.round(stageLaurels(kind, chapter.tier, firstClear, node.level) * stagePay(node)), tier,
    (id) => (first(id) ? 1 : REPLAY_SHARE) * expFactor)
  Object.assign(result, { members: paid.members, shards: paid.shards, tickets: paid.tickets, laurels: paid.laurels, gearMarks: paid.gearMarks,
    classMarks: paid.classMarks, firstClear })
  const lanes = run.lanes.map((l, i) => i !== ref.lane - 1 ? l : { ...l,
    ...(ref.final ? { finalAt: now } : { generals: (l.generals + 1) as 1 | 2 | 3 }) }) as CapitalLanes
  const won = lanes.every((l) => l.finalAt !== null)
  const record = world.capitals![run.continent]!
  const capitals = won ? { ...world.capitals, [run.continent]: { ...record, won: record.won + 1,
    recent: [{ id: run.id, wonAt: now, lanes: lanes.map((l) => [...l.umas] as typeof l.umas) }, ...record.recent].slice(0, CAPITAL_RECENT_MAX) } } : world.capitals
  const next: TierWorld = { ...paid.world, world: { ...world.world, run: closed }, capitals,
    capitalRuns: world.capitalRuns!.flatMap((r) => r.id !== run.id ? [r] : won ? [] : [{ ...run, lanes }]) }
  result.capital = { ...result.capital!, ...(ref.final ? { final: finals + 1 } : {}), won }
  const updated = withWorld(save, tier, next, now)
  return { save: won ? recordCapitalWin(updated, tier, run.continent, lanes.flatMap((l) => l.umas), now) : updated, result }
}
