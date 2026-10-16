// The Observatory over the save (S6, design §10, D58, D144): setting a Star Gem opens the node of its own grade on her
// map, once every lower node of its track is open (D119), and uses the gem up; her active nodes (5 + level/2 at once) add
// points to her stats in every fight.
import { gemIdentity, gemNodes, nodeGrade, starPoints } from '../economy/stars'
import { activeNodeSlots } from '../economy/pacing'
import type { Points } from '../economy/bonus'
import { SaveRuleError, TIER_ONE, worldOf } from './rules'
import type { OwnedUma, Save, TierWorld } from './save'

function withWorld(save: Save, tier: string, world: TierWorld, now: string): Save {
  return { ...save, account: { ...save.account, updatedAt: now }, tierWorlds: { ...save.tierWorlds, [tier]: world } }
}

/** Why she can't set this gem now, or null: its node is open already, or a lower node of its track is still locked. */
export function gemBlock(uma: OwnedUma, gemId: string): string | null {
  const gem = gemIdentity(gemId)
  if (!gem) return 'Unknown gem'
  const next = gemNodes(gem).find((n) => !uma.stars.unlocked.includes(n))
  if (!next) return 'Already set'
  return nodeGrade(next) < gem.grade ? `Set the grade ${nodeGrade(next)} gem first` : null
}

/** The node this gem would open for her (its own grade's, D119), or null when she can't set it now. */
export function nodeFromGem(uma: OwnedUma, gemId: string): string | null {
  const gem = gemIdentity(gemId)
  if (!gem || gemBlock(uma, gemId)) return null
  return gemNodes(gem).find((n) => !uma.stars.unlocked.includes(n)) ?? null
}

/** She sets one gem: its node opens and, while she has a free active slot, switches on. */
export function setGem(save: Save, outfitId: string, gemId: string, now: string, tier = TIER_ONE): { save: Save; node: string } {
  const world = worldOf(save, tier)
  const uma = world.umas[outfitId]
  if (!uma) throw new SaveRuleError('not-owned', 'only owned Umas set gems')
  if ((world.gems[gemId] ?? 0) < 1) throw new SaveRuleError('no-items', 'none of that gem left')
  const block = gemBlock(uma, gemId)
  if (block) throw new SaveRuleError('bad-job', block)
  const node = nodeFromGem(uma, gemId)!
  const unlocked = [...uma.stars.unlocked, node]
  const active = uma.stars.active.length < activeNodeSlots(uma.level) ? [...uma.stars.active, node] : uma.stars.active
  const gems = { ...world.gems, [gemId]: world.gems[gemId]! - 1 }
  if (gems[gemId] === 0) delete gems[gemId]
  const next: TierWorld = { ...world, gems, umas: { ...world.umas, [outfitId]: { ...uma, stars: { unlocked, active } } } }
  return { save: withWorld(save, tier, next, now), node }
}

/** Sets her active nodes: unlocked ones only, at most 5 + ⌊level / 2⌋. Free to change outside a fight. */
export function setActiveNodes(save: Save, outfitId: string, active: readonly string[], now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const uma = world.umas[outfitId]
  if (!uma) throw new SaveRuleError('not-owned', 'not unlocked')
  if (new Set(active).size !== active.length || active.some((n) => !uma.stars.unlocked.includes(n))) throw new SaveRuleError('bad-job', 'only unlocked nodes can be active')
  if (active.length > activeNodeSlots(uma.level)) throw new SaveRuleError('bad-count', `at most ${activeNodeSlots(uma.level)} active at Lv${uma.level}`)
  return withWorld(save, tier, { ...world, umas: { ...world.umas, [outfitId]: { ...uma, stars: { ...uma.stars, active: [...active] } } } }, now)
}

/** Her Extra Stats points from active nodes. */
export const extraStatPoints = (uma: OwnedUma): Points => starPoints(uma.stars.active)
