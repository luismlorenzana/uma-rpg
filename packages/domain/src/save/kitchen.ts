// Eating and the Sun-and-planets map over the save (S6, design §10, D58): a dish unlocks the lowest locked node it
// can on her map and is eaten; her active nodes (5 + level/2 at once) add points to her stats in every fight.
import { dishById, nodesFor, starPoints } from '../economy/dishes'
import { activeNodeSlots } from '../economy/pacing'
import type { Points } from '../economy/bonus'
import { SaveRuleError, TIER_ONE, worldOf } from './rules'
import type { OwnedUma, Save, TierWorld } from './save'

function withWorld(save: Save, tier: string, world: TierWorld, now: string): Save {
  return { ...save, account: { ...save.account, updatedAt: now }, tierWorlds: { ...save.tierWorlds, [tier]: world } }
}

/** The node this dish would unlock for her, or null when it has nothing new for her. */
export function nodeFromDish(uma: OwnedUma, dishId: string): string | null {
  const dish = dishById(dishId)
  return dish ? nodesFor(dish).find((n) => !uma.stars.unlocked.includes(n)) ?? null : null
}

/** She eats one dish: its node unlocks and, while she has a free active slot, switches on. */
export function eatDish(save: Save, outfitId: string, dishId: string, now: string, tier = TIER_ONE): { save: Save; node: string } {
  const world = worldOf(save, tier)
  const uma = world.umas[outfitId]
  if (!uma) throw new SaveRuleError('not-owned', 'only owned Umas eat')
  if ((world.dishes[dishId] ?? 0) < 1) throw new SaveRuleError('no-items', 'none of that dish left')
  const node = nodeFromDish(uma, dishId)
  if (!node) throw new SaveRuleError('bad-job', 'nothing new for her in that dish')
  const unlocked = [...uma.stars.unlocked, node]
  const active = uma.stars.active.length < activeNodeSlots(uma.level) ? [...uma.stars.active, node] : uma.stars.active
  const dishes = { ...world.dishes, [dishId]: world.dishes[dishId]! - 1 }
  if (dishes[dishId] === 0) delete dishes[dishId]
  const next: TierWorld = { ...world, dishes, umas: { ...world.umas, [outfitId]: { ...uma, stars: { unlocked, active } } } }
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
