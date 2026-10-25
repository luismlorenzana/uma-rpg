// Targets (D100, D126, D144; docs/design/gear-and-targets.md §2): up to ten Umas the facilities plan for. For each,
// everything maxing her takes: every grade still to bind on each of her gear tracks, up to 10, and the Star Gem of every
// Extra Stats node she hasn't opened. The requirements engine nets that demand against the Warehouse and the jobs, top
// level first, and only what is still short flows down: pieces and gems to refined items, refined items to raw ones.
import { planRequirements, type Requirement } from '@luismlorenzana/uma-work'
import { gemById, nodeGem, STAR_NODES } from '../economy/gems'
import { EQUIP_LABEL, gearById, gearId, gearTrackOf, isAccessory, type EquipType } from '../economy/gear'
import { facilitySpec } from '../economy/jobs'
import { ACCESSORY_SLOTS, ARMOR_SLOTS, GEAR_MAX_RANK } from '../economy/ranks'
import { itemById } from '../items/catalog'
import type { RpgClass } from '../rpg/rules'
import { classOf } from './battle'
import { boundGrade } from './forge'
import { SaveRuleError, TIER_ONE, worldOf } from './rules'
import { gearV1, MAX_TARGETS, slotKind, type OwnedUma, type Save, type TierWorld } from './save'

/** Marks or unmarks an owned Uma as a target, ten at most. */
export function setTarget(save: Save, outfitId: string, on: boolean, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  if (!world.umas[outfitId]) throw new SaveRuleError('not-owned', 'only owned Umas can be targets')
  const rest = world.targets.filter((id) => id !== outfitId)
  if (on && rest.length >= MAX_TARGETS) throw new SaveRuleError('too-many', `${MAX_TARGETS} targets at most: unmark one first`)
  const targets = on ? [...rest, outfitId] : rest
  return { ...save, account: { ...save.account, updatedAt: now }, tierWorlds: { ...save.tierWorlds, [tier]: { ...world, targets } } }
}

/**
 * One line of a plan. `need`: what the targets need of it; `have`: in the Warehouse and free; `coming`: what jobs will
 * still make; `short`: what still has to be started. A facility lists a line while `need > have`.
 */
export interface TargetNeed {
  /** An item, gear piece or Star Gem id. */
  key: string
  /** An id to draw its icon with. */
  icon: string
  name: string
  grade: number
  need: number
  have: number
  coming: number
  short: number
}
export interface TargetPlan { gear: TargetNeed[]; gems: TargetNeed[]; refined: TargetNeed[]; raw: TargetNeed[] }

/** The gear types an Uma climbs (D124): her class's five weapons, each armor slot's kind, and the type in each accessory
 * slot (an empty one plans nothing: nothing says which she wants). */
function gearTypes(uma: OwnedUma, classId: RpgClass): EquipType[] {
  const gear = gearV1(uma)
  const types: EquipType[] = [...classOf(uma, classId).weapons, ...ARMOR_SLOTS.map((slot) => slotKind(gear, slot))]
  for (const slot of ACCESSORY_SLOTS) {
    const piece = gear.equipped[slot] ? gearById(gear.equipped[slot]!) : undefined
    if (piece && isAccessory(piece.type)) types.push(piece.type)
  }
  return types
}

/** Everything maxing one Uma still takes: every grade above the best she has bound on each track, up to 10, and a Star
 * Gem for every Extra Stats node she hasn't opened. */
export function targetDemand(uma: OwnedUma, classId: RpgClass): Map<string, number> {
  const demand = new Map<string, number>()
  const add = (id: string) => demand.set(id, (demand.get(id) ?? 0) + 1)
  for (const type of gearTypes(uma, classId)) {
    for (let g = boundGrade(uma, gearTrackOf(type)) + 1; g <= GEAR_MAX_RANK; g++) add(gearId(type, g))
  }
  for (const node of STAR_NODES) if (!uma.stars.unlocked.includes(node)) add(nodeGem(node))
  return demand
}

/** One item's recipe, per unit: a piece's or a gem's refined inputs, a refined item's raw one; a raw item has none. */
function recipeOf(id: string): Readonly<Record<string, number>> | null {
  const made = gearById(id) ?? gemById(id)
  if (made) return made.inputs
  const item = itemById(id)
  return item?.refined ? { [item.pair]: 1 } : null
}

/**
 * What the jobs will bring and hold (SC3). Started entries bring what they haven't handed over yet (their inputs left
 * the Warehouse when they started). A queued request takes its inputs from the Warehouse when it starts; it counts as
 * coming only if the Warehouse can cover them, since a job that can't start brings nothing.
 */
export function jobSupply(world: TierWorld): { coming: Map<string, number>; held: Map<string, number> } {
  const coming = new Map<string, number>()
  const held = new Map<string, number>()
  const add = (into: Map<string, number>, id: string, n: number) => into.set(id, (into.get(id) ?? 0) + n)
  const stock = (id: string) => (world.items[id] ?? 0) - (held.get(id) ?? 0)
  for (const outfitId of Object.keys(world.work).sort()) {
    const row = world.work[outfitId]!
    for (const entry of row.entries) add(coming, entry.request.item, entry.request.count - entry.collected)
    for (const q of row.queue) {
      const needs = Object.entries(recipeOf(q.item) ?? {}).map(([id, n]) => [id, n * q.count] as const)
      if (needs.some(([id, n]) => stock(id) < n)) continue
      for (const [id, n] of needs) add(held, id, n)
      add(coming, q.item, q.count)
    }
  }
  return { coming, held }
}

/** The plan for a world's targets. `activeClassOf` gives the class each target fights as. */
export function targetPlan(world: TierWorld, activeClassOf: (outfitId: string) => RpgClass): TargetPlan {
  const demand = new Map<string, number>()
  for (const id of world.targets) {
    const uma = world.umas[id]
    if (!uma) continue
    for (const [key, n] of targetDemand(uma, activeClassOf(id))) demand.set(key, (demand.get(key) ?? 0) + n)
  }
  const { coming, held } = jobSupply(world)
  const owned = (id: string) => (gearById(id) ? world.gear[id] : gemById(id) ? world.gems[id] : world.items[id]) ?? 0
  const plan = planRequirements({
    demand, recipe: recipeOf,
    supply: (id) => ({ onHand: Math.max(0, owned(id) - (held.get(id) ?? 0)), coming: coming.get(id) ?? 0 }),
  })
  const line = (r: Requirement): TargetNeed => {
    const piece = gearById(r.id), gem = gemById(r.id), item = itemById(r.id)
    const name = piece ? EQUIP_LABEL[piece.type] : gem?.name ?? item?.name ?? r.id
    return { key: r.id, icon: r.id, name, grade: piece?.grade ?? gem?.grade ?? item?.grade ?? 0, need: r.gross, have: r.onHand, coming: r.coming, short: r.net }
  }
  const lines = [...plan.values()].filter((r) => r.gross > 0).map(line)
  const byGrade = (a: TargetNeed, b: TargetNeed) => a.grade - b.grade || a.name.localeCompare(b.name)
  const pick = (test: (key: string) => boolean) => lines.filter((n) => test(n.key)).sort(byGrade)
  return {
    gear: pick((k) => !!gearById(k)),
    gems: pick((k) => !!gemById(k)),
    refined: pick((k) => !!itemById(k)?.refined),
    raw: pick((k) => { const i = itemById(k); return !!i && !i.refined }),
  }
}

/** The lines a facility makes: a site its family's raw items, the Workbench refined items, the Forge gear, the Lapidary
 * Star Gems. Each stays while the Warehouse holds fewer than the targets need. */
export function facilityTargets(plan: TargetPlan, placeId: string): TargetNeed[] {
  const spec = facilitySpec(placeId)
  if (!spec) return []
  const lines = spec.kind === 'gather' ? plan.raw.filter((n) => itemById(n.key)?.family === spec.family)
    : spec.kind === 'refine' ? plan.refined : spec.kind === 'craft' ? plan.gear : spec.kind === 'cut' ? plan.gems : []
  return lines.filter((n) => n.need > n.have)
}
