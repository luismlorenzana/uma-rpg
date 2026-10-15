// A party's run through one chapter: cleared nodes, carried MP and the open fight with its actions
// (docs/design/battles.md). Ported from uma-racer; uma-rpg keeps runs inside the tier world and replays a fight from its
// actions, so a fight survives a reload and continues on another device (D52).
import { applyBattleAction, BATTLE_ENGINE_VERSION, createBattle, replayBattle } from '../battle/engine'
import type { BattleAction, BattleInput, BattleState, BattleStep } from '../battle/types'
import { applyPoints, noPoints, type Points } from '../../economy/bonus'
import { accessoryFightFields, noAccessoryEffects, type AccessoryEffects } from '../../economy/gear-id'
import { projectRpgStats, rpgLifetimeLevels, type RpgProfile } from '../rules'
import { rpgNodeParents, type RpgCampaignChapter, type RpgMapNode } from './chapters'
import { RPG_MAX_BATTLE_ACTIONS, type RpgRun } from './run-state'
export { createRpgRun, RPG_MAX_BATTLE_ACTIONS, type RpgRun, type RpgRunBattle } from './run-state'
export type RpgNodeStatus = 'locked' | 'available' | 'cleared'

export const rpgRunKey = (party: number, chapterId: string): string => `${party}:${chapterId}`
const battleIdOf = (run: Pick<RpgRun, 'party' | 'chapterId' | 'battles'>): string => `battle:${run.party}:${run.chapterId}:${run.battles + 1}`

export function rpgNodeStatus(chapter: RpgCampaignChapter, run: RpgRun | null, nodeId: string): RpgNodeStatus {
  if ((run?.wins[nodeId] ?? 0) > 0 || nodeId === 'start') return 'cleared'
  return rpgNodeParents(chapter, nodeId).some((p) => p === 'start' || (run?.wins[p] ?? 0) > 0) ? 'available' : 'locked'
}

export const rpgChapterCleared = (chapter: RpgCampaignChapter, run: RpgRun | null): boolean =>
  chapter.nodes.some((n) => n.kind === 'boss' && (run?.wins[n.id] ?? 0) > 0)

/** Resting at a reached or reachable camp refills every party member's MP. */
export function rpgRestAtCamp(chapter: RpgCampaignChapter, run: RpgRun, campId: string, now: string): RpgRun {
  const node = chapter.nodes.find((n) => n.id === campId)
  if (!node || node.kind !== 'camp' || rpgNodeStatus(chapter, run, campId) === 'locked') throw new Error('Camp is not reachable')
  if (run.battle) throw new Error('Finish the open fight first')
  return { ...run, wins: { ...run.wins, [campId]: Math.max(1, run.wins[campId] ?? 0) }, mp: {}, updatedAt: now }
}

/** A party member as she enters a fight: her profile, her class's equipped skills, her stat points, her weapons' Might
 * (D104), what her two accessories do (D124), and her Hero seat or inherited Limit Breaks (D106). */
export interface RpgPartyMember {
  profile: RpgProfile; loadout: RpgProfile['tree']; points?: Points
  might?: BattleInput['allies'][number]['might']; accessories?: AccessoryEffects
  hero?: BattleInput['allies'][number]['hero']; inherits?: BattleInput['allies'][number]['inherits']
}

export const rpgMemberLevel = (profile: Pick<RpgProfile, 'tier' | 'level'>): number => rpgLifetimeLevels(profile.tier, profile.level) + 1

export function rpgCarriedMp(run: Pick<RpgRun, 'mp'>, profile: RpgProfile, points?: Points): number {
  const max = applyPoints(projectRpgStats(profile), points ?? noPoints()).stats.mp
  return Math.min(max, run.mp[profile.outfitId] ?? max)
}

function seedOf(text: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i += 1) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) }
  return h >>> 0
}

/** Freezes the party (with its carried MP) and the node's foes, every wave, into a new fight (engine v11: two accessories
 * and their effects, D124; v10 Limit Breaks only from the Halls of Heroes, D112; v9 Heroes and Learners, D106; v8 Class Ranks, Might, Barrier and Regen, D102–D104; up to eight foes a wave since v7, W3). */
export function rpgBeginRunBattle(chapter: RpgCampaignChapter, run: RpgRun, nodeId: string,
  party: readonly RpgPartyMember[], now: string): RpgRun {
  const node = chapter.nodes.find((n) => n.id === nodeId)
  if (!node || node.kind === 'camp') throw new Error('That node has no fight')
  if (run.battle) throw new Error('Finish the open fight first')
  if (rpgNodeStatus(chapter, run, nodeId) === 'locked') throw new Error('Clear the stage before it')
  if (party.length !== 5) throw new Error('A fight needs five party members')
  const battleId = battleIdOf(run)
  const input: BattleInput = {
    version: BATTLE_ENGINE_VERSION, seed: seedOf(battleId),
    allies: party.map(({ profile, loadout, points, might, accessories, hero, inherits }) => {
      const boosted = applyPoints(projectRpgStats(profile), points ?? noPoints())
      const a = accessories ?? noAccessoryEffects()
      // Only what's there goes in the frozen fight: an absent effect is 0. Shares of max HP become HP here (D141).
      const effects = accessoryFightFields(a, boosted.stats.hp)
      return { id: profile.outfitId, classId: profile.classId, weapons: [...profile.weapons], tier: profile.tier, level: profile.level, stats: boosted.stats,
        tree: profile.tree, legacy: profile.legacy, loadout, ...(a.orbs.length ? { orbs: [...a.orbs] } : {}), mp: rpgCarriedMp(run, profile, points),
        classRank: profile.classRank,
        ...(might && Object.keys(might).length ? { might } : {}), ...effects,
        ...(boosted.evasion > 0 ? { evasion: boosted.evasion } : {}), ...(boosted.limitStart > 0 ? { limitStart: boosted.limitStart } : {}),
        ...(hero ? { hero } : {}), ...(inherits?.length ? { inherits: inherits.map((i) => ({ ...i })) } : {}) }
    }),
    enemies: node.enemies,
    ...(node.waves?.length ? { waves: node.waves } : {}),
  }
  createBattle(input)
  return { ...run, battle: { battleId, nodeId, startedAt: now, input, actions: [] }, battles: run.battles + 1, updatedAt: now }
}

/** The open fight's current step, replayed from its actions. */
export function rpgRunBattleStep(run: RpgRun): BattleStep | null {
  return run.battle ? replayBattle(run.battle.input, run.battle.actions) : null
}

/** What the player reads when the engine refuses an action. */
const REFUSED: Readonly<Record<NonNullable<BattleStep['error']>, string>> = {
  terminal: 'The fight is over', 'invalid-actor': 'She can’t act now', 'already-acted': 'She has already acted this round',
  'invalid-target': 'Pick another target', 'invalid-skill': 'She can’t use that now', 'insufficient-mp': 'Not enough MP',
  'invalid-state': 'That didn’t work', 'limit-not-ready': 'Her Limit Break isn’t ready',
}

/** Takes one action in the open fight. Throws when the engine refuses it, so a bad action never reaches the save. */
export function rpgActInRun(run: RpgRun, action: BattleAction, now: string): { run: RpgRun; step: BattleStep } {
  const battle = run.battle
  if (!battle) throw new Error('No open fight')
  const current = replayBattle(battle.input, battle.actions)
  if (current.state.outcome !== 'active') throw new Error('The fight is over')
  if (battle.actions.length >= RPG_MAX_BATTLE_ACTIONS) throw new Error('Too many actions')
  const step = applyBattleAction(current.state, action)
  if (step.error) throw new Error(REFUSED[step.error])
  return { run: { ...run, battle: { ...battle, actions: [...battle.actions, action] }, updatedAt: now }, step }
}

/** Gives up the open fight: nothing is paid and MP stays as it was before the fight. */
export function rpgAbandonRunBattle(run: RpgRun, now: string): RpgRun {
  if (!run.battle) throw new Error('No open fight')
  return { ...run, battle: null, updatedAt: now }
}

/** The node an open fight was started on, or null when a rebalance removed it. */
export function rpgBattleNode(chapter: RpgCampaignChapter, run: RpgRun): RpgMapNode | null {
  return run.battle ? chapter.nodes.find((n) => n.id === run.battle!.nodeId) ?? null : null
}

/** Closes a finished fight: a win records the node and carries the party's MP; a loss leaves the run as it was. */
export function rpgCloseRunBattle(run: RpgRun, state: BattleState, node: Pick<RpgMapNode, 'id' | 'kind'>, now: string): RpgRun {
  const battle = run.battle
  if (!battle) throw new Error('No open fight')
  if (state.input.seed !== battle.input.seed) throw new Error('Battle does not belong to this run')
  if (state.outcome === 'active') throw new Error('The fight is still on')
  if (state.outcome === 'loss') return { ...run, battle: null, updatedAt: now }
  const mp = { ...run.mp }
  for (const unit of state.units) if (unit.side === 'ally') mp[unit.id] = unit.mp
  const wins = { ...run.wins, [node.id]: (run.wins[node.id] ?? 0) + 1 }
  return { ...run, wins, mp, battle: null, clearedAt: run.clearedAt ?? (node.kind === 'boss' ? now : null), updatedAt: now }
}
