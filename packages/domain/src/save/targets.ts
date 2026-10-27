// Targets (D100, D126, D144; docs/design/gear-and-targets.md §2): up to ten Umas the facilities plan for. For each,
// everything maxing her takes: every grade still to bind on each of her gear tracks, up to 10, and the Star Gem of every
// Extra Stats node she hasn't opened. The requirements engine nets that demand against the Warehouse and the jobs, top
// level first, and only what is still short flows down: pieces and gems to refined items, refined items to raw ones. From
// the economy stage (the farm by line since H112, D224) an Arms weapon asks for Arms Gems and a Tome for Tome Ink, every
// recipe is one line's, and a making place lists its made items, then its line's refined items (FL22).
import { planRequirements, type Requirement } from '@luismlorenzana/uma-work'
import { gemById, nodeGem, STAR_NODES } from '../economy/gems'
import { EQUIP_LABEL, gearById, gearId, gearTrackOf, isAccessory, type EquipType } from '../economy/gear'
import { facilitySpec } from '../economy/jobs'
import { gradeItemId, gradeOf, type GradeTarget } from '../economy/grades'
import { MAP_NODES, nodeJewel } from '../economy/planet'
import { isMakingPlaceV4, placeSpecV4 } from '../economy/places-v4'
import { ACCESSORY_SLOTS, ARMOR_SLOTS, GEAR_MAX_RANK } from '../economy/ranks'
import { itemById } from '../items/catalog'
import { madeIdentity } from '../items/made-id'
import { madeName } from '../items/made'
import { lineItem } from '../items/lines'
import { madeRecipeV4 } from '../items/made-v4'
import type { RpgClass } from '../rpg/rules'
import { classOf } from './battle'
import { boundGrade } from './forge'
import { SaveRuleError, TIER_ONE, worldOf } from './rules'
import { gearStock, gearV1, gemStock, isGrades, isStarMap, MAX_TARGETS, slotKind, starsV1, type OwnedUma, type Save, type TierWorld } from './save'

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
export interface TargetPlan { gear: TargetNeed[]; gems: TargetNeed[]; made: TargetNeed[]; refined: TargetNeed[]; raw: TargetNeed[] }

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
  if (isGrades(uma.gear)) {
    const targets: GradeTarget[] = [
      ...classOf(uma, classId).weapons.map((weapon): GradeTarget => ({ kind: 'weapon', weapon })),
      ...ARMOR_SLOTS.map((slot): GradeTarget => ({ kind: 'armor', slot })),
      ...uma.gear.accessories.map((_, slot): GradeTarget => ({ kind: 'accessory', slot })),
    ]
    for (const target of targets) for (let grade = gradeOf(uma.gear, target) + 1; grade <= GEAR_MAX_RANK; grade++) add(gradeItemId(target, grade))
    if (isStarMap(uma.stars)) for (const node of MAP_NODES) if (!uma.stars.open.includes(node)) add(nodeJewel(node))
    return demand
  }
  for (const type of gearTypes(uma, classId)) {
    for (let g = boundGrade(uma, gearTrackOf(type)) + 1; g <= GEAR_MAX_RANK; g++) add(gearId(type, g))
  }
  // A v1 map's Star Gems; a v3 map (R2, H76) needs jewels, which the targets planner reads from H79.
  const unlocked = starsV1(uma).unlocked
  if (!isStarMap(uma.stars)) for (const node of STAR_NODES) if (!unlocked.includes(node)) add(nodeGem(node))
  return demand
}

/** One item's recipe, per unit: a piece's or a gem's refined inputs, a refined item's raw one; a raw item has none. */
function recipeOf(id: string, _tier = 1, v3 = false): Readonly<Record<string, number>> | null {
  if (v3) {
    if (madeIdentity(id)) return madeRecipeV4(id)
    const m = lineItem(id)
    return m?.refined ? { [m.pair]: 1 } : null
  }
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
export function jobSupply(world: TierWorld, tier = 1, v3 = false): { coming: Map<string, number>; held: Map<string, number> } {
  const coming = new Map<string, number>()
  const held = new Map<string, number>()
  const add = (into: Map<string, number>, id: string, n: number) => into.set(id, (into.get(id) ?? 0) + n)
  const stock = (id: string) => (world.items[id] ?? 0) - (held.get(id) ?? 0)
  for (const outfitId of Object.keys(world.work).sort()) {
    const row = world.work[outfitId]!
    for (const entry of row.entries) add(coming, entry.request.item, entry.request.count - entry.collected)
    for (const q of row.queue) {
      const needs = Object.entries(recipeOf(q.item, tier, v3) ?? {}).map(([id, n]) => [id, n * q.count] as const)
      if (needs.some(([id, n]) => stock(id) < n)) continue
      for (const [id, n] of needs) add(held, id, n)
      add(coming, q.item, q.count)
    }
  }
  return { coming, held }
}

/** The plan for a world's targets. `activeClassOf` gives the class each target fights as. */
export function targetPlan(world: TierWorld, activeClassOf: (outfitId: string) => RpgClass, tier = 1): TargetPlan {
  const demand = new Map<string, number>()
  for (const id of world.targets) {
    const uma = world.umas[id]
    if (!uma) continue
    for (const [key, n] of targetDemand(uma, activeClassOf(id))) demand.set(key, (demand.get(key) ?? 0) + n)
  }
  const v3 = 'grant' in world || world.targets.some((id) => !!world.umas[id] && isGrades(world.umas[id]!.gear))
  const { coming, held } = jobSupply(world, tier, v3)
  const owned = (id: string) => v3 ? world.items[id] ?? 0 : (gearById(id) ? gearStock(world)[id] : gemById(id) ? gemStock(world)[id] : world.items[id]) ?? 0
  const plan = planRequirements({
    demand, recipe: (id) => recipeOf(id, tier, v3),
    supply: (id) => ({ onHand: Math.max(0, owned(id) - (held.get(id) ?? 0)), coming: coming.get(id) ?? 0 }),
  })
  const line = (r: Requirement): TargetNeed => {
    if (v3) {
      const made = madeIdentity(r.id), m = lineItem(r.id)
      return { key: r.id, icon: r.id, name: made ? madeName(r.id)! : m?.name ?? r.id, grade: made?.grade ?? m?.grade ?? 0,
        need: r.gross, have: r.onHand, coming: r.coming, short: r.net }
    }
    const piece = gearById(r.id), gem = gemById(r.id), item = itemById(r.id)
    const name = piece ? EQUIP_LABEL[piece.type] : gem?.name ?? item?.name ?? r.id
    return { key: r.id, icon: r.id, name, grade: piece?.grade ?? gem?.grade ?? item?.grade ?? 0,
      need: r.gross, have: r.onHand, coming: r.coming, short: r.net }
  }
  const lines = [...plan.values()].filter((r) => r.gross > 0).map(line)
  const byGrade = (a: TargetNeed, b: TargetNeed) => a.grade - b.grade || a.name.localeCompare(b.name)
  const pick = (test: (key: string) => boolean) => lines.filter((n) => test(n.key)).sort(byGrade)
  return {
    gear: v3 ? [] : pick((k) => !!gearById(k)),
    gems: v3 ? [] : pick((k) => !!gemById(k)),
    made: v3 ? pick((k) => !!madeIdentity(k)) : [],
    refined: pick((k) => v3 ? !!lineItem(k)?.refined : !!itemById(k)?.refined),
    raw: pick((k) => v3 ? lineItem(k)?.refined === false : (() => { const i = itemById(k); return !!i && !i.refined })()),
  }
}

/** The lines a facility makes: a site its family's raw items, the Workbench refined items, the Forge gear, the Lapidary
 * Star Gems. Each stays while the Warehouse holds fewer than the targets need. */
export function facilityTargets(plan: TargetPlan, placeId: string): TargetNeed[] {
  const v4 = plan.made.length > 0 ? placeSpecV4(placeId) : undefined
  if (v4) {
    // FL22: a gathering place its line's raw items; a making place its made items, then its line's refined items.
    const ofLine = (n: TargetNeed) => lineItem(n.key)?.line === v4.line
    const lines = isMakingPlaceV4(v4) ? [...plan.made.filter((n) => v4.made.includes(madeIdentity(n.key)!.line)), ...plan.refined.filter(ofLine)]
      : plan.raw.filter(ofLine)
    return lines.filter((n) => n.need > n.have)
  }
  const spec = facilitySpec(placeId)
  if (!spec) return []
  const lines = spec.kind === 'gather' ? plan.raw.filter((n) => itemById(n.key)?.family === spec.family)
    : spec.kind === 'refine' ? plan.refined : spec.kind === 'craft' ? plan.gear : spec.kind === 'cut' ? plan.gems : []
  return lines.filter((n) => n.need > n.have)
}
