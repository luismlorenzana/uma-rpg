// Farming targets (D100): up to five Umas the facilities plan for. For each, what maxing her takes: a dish for every
// Extra Stats node she hasn't opened, and the best piece she can wear now in each of her ten gear slots (D103). The needs
// cascade down the chain: pieces and dishes still to make need refined items, refined items still to make need raw
// ones. At every step what the Warehouse holds and what running or queued jobs will bring counts first.
import { DISHES, dishById, nodeGrade, nodesFor, STAR_NODES } from '../economy/dishes'
import { armorKindOf, EQUIP_LABEL, gearById, gearId, isWeapon, type EquipType } from '../economy/gear'
import { ARMOR_LABEL, ARMOR_SLOTS, armorTrack, isArmorKind, weaponTrack, type ArmorKind } from '../economy/ranks'
import { facilitySpec } from '../economy/jobs'
import { itemById } from '../items/catalog'
import type { RpgClass } from '../rpg/rules'
import { classOf } from './battle'
import { SaveRuleError, TIER_ONE, worldOf } from './rules'
import { MAX_TARGETS, slotKind, type OwnedUma, type Save, type TierWorld } from './save'

/** Marks or unmarks an owned Uma as a target, five at most. */
export function setTarget(save: Save, outfitId: string, on: boolean, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  if (!world.umas[outfitId]) throw new SaveRuleError('not-owned', 'only owned Umas can be targets')
  const rest = world.targets.filter((id) => id !== outfitId)
  if (on && rest.length >= MAX_TARGETS) throw new SaveRuleError('too-many', `${MAX_TARGETS} targets at most: unmark one first`)
  const targets = on ? [...rest, outfitId] : rest
  return { ...save, account: { ...save.account, updatedAt: now }, tierWorlds: { ...save.tierWorlds, [tier]: { ...world, targets } } }
}

/** One line of a plan: what to make, how many the targets need in all, what's here or on the way, and what's short. */
export interface TargetNeed {
  /** An item or dish id, or a gear key `<weapon or armor kind>-g<grade>` (any accent, any Orb of the kind will do). */
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
export interface TargetPlan { gear: TargetNeed[]; dishes: TargetNeed[]; refined: TargetNeed[]; raw: TargetNeed[] }

/** The dish that opens each node at exactly its grade: a planet dish its moon, a Duo its bridge, a Feast its Sun node. */
const NODE_DISH = new Map<string, string>()
for (const dish of DISHES) for (const node of nodesFor(dish)) if (nodeGrade(node) === dish.grade) NODE_DISH.set(node, dish.id)

/** A piece's planning kind: its weapon, or its armor kind (any Orb of a kind is that kind). */
const kindOf = (type: EquipType): string => (isWeapon(type) ? type : armorKindOf(type))
const keyOf = (pieceId: string): string | null => {
  const piece = gearById(pieceId)
  return piece ? `${kindOf(piece.type)}-g${piece.grade}` : null
}
/** A representative type to draw and cost a kind with: the kind itself, or its group's first Orb. */
const typeOfKind = (kind: string): EquipType => (kind === 'arms-orb' ? 'orb-greatsword' : kind === 'elemental-orb' ? 'orb-fire' : kind as EquipType)

/** The pieces one Uma still needs: per slot (her class's five weapons, her five armor slots' kinds), the best grade her
 * rank lets her wear, unless she owns one that good. */
function gearNeeds(uma: OwnedUma, classId: RpgClass): string[] {
  const owned = [...uma.gear.locker, ...Object.values(uma.gear.equipped)].map(gearById).filter((p) => p !== undefined)
  const out: string[] = []
  const need = (kind: string, grade: number) => {
    if (!owned.some((p) => p.grade >= grade && kindOf(p.type) === kind)) out.push(`${kind}-g${grade}`)
  }
  for (const w of classOf(uma, classId).weapons) need(w, weaponTrack(uma.ranks, w).rank)
  for (const slot of ARMOR_SLOTS) { const kind = slotKind(uma.gear, slot); need(kind, armorTrack(uma.ranks, kind).rank) }
  return out
}

/** The plan for a world's targets. `classOf` gives the class each target fights as. */
export function targetPlan(world: TierWorld, activeClassOf: (outfitId: string) => RpgClass): TargetPlan {
  const count = (into: Map<string, number>, key: string, n = 1) => into.set(key, (into.get(key) ?? 0) + n)
  // What running and queued jobs will still bring, by output (gear by its key).
  const coming = new Map<string, number>()
  for (const f of Object.values(world.facilities)) {
    for (const job of f.jobs) {
      if (!job) continue
      count(coming, keyOf(job.output) ?? job.output, job.count - job.collected)
      for (const q of job.queue) count(coming, keyOf(q.output) ?? q.output, q.count)
    }
  }
  const gearNeed = new Map<string, number>()
  const dishNeed = new Map<string, number>()
  for (const id of world.targets) {
    const uma = world.umas[id]
    if (!uma) continue
    for (const key of gearNeeds(uma, activeClassOf(id))) count(gearNeed, key)
    for (const node of STAR_NODES) if (!uma.stars.unlocked.includes(node)) count(dishNeed, NODE_DISH.get(node)!)
  }
  const gearStock = new Map<string, number>()
  for (const [id, n] of Object.entries(world.gear)) { const key = keyOf(id); if (key) count(gearStock, key, n) }
  const line = (key: string, need: number, have: number, icon: string, name: string, grade: number): TargetNeed => {
    const on = coming.get(key) ?? 0
    return { key, icon, name, grade, need, have, coming: on, short: Math.max(0, need - have - on) }
  }
  const byGrade = (a: TargetNeed, b: TargetNeed) => a.grade - b.grade || a.name.localeCompare(b.name)
  const gear = [...gearNeed].map(([key, need]) => {
    const kind = key.replace(/-g\d+$/, ''), grade = Number(/-g(\d+)$/.exec(key)![1])
    const type = typeOfKind(kind)
    return line(key, need, gearStock.get(key) ?? 0, gearId(type, grade, 'atk'), isArmorKind(kind) ? ARMOR_LABEL[kind as ArmorKind] : EQUIP_LABEL[type], grade)
  }).sort(byGrade)
  const dishes = [...dishNeed].map(([id, need]) => line(id, need, world.dishes[id] ?? 0, id, dishById(id)!.name, dishById(id)!.grade)).sort(byGrade)
  // Refined items: what the pieces and dishes still short need. Tokens aren't farmed, so they're left out.
  const refinedNeed = new Map<string, number>()
  for (const g of gear) for (const [id, n] of Object.entries(gearById(g.icon)!.inputs)) count(refinedNeed, id, n * g.short)
  for (const d of dishes) for (const [id, n] of Object.entries(dishById(d.key)!.inputs)) if (itemById(id)) count(refinedNeed, id, n * d.short)
  const item = (id: string, need: number) => line(id, need, world.items[id] ?? 0, id, itemById(id)!.name, itemById(id)!.grade)
  const refined = [...refinedNeed].filter(([, n]) => n > 0).map(([id, n]) => item(id, n)).sort(byGrade)
  // Raw items: one for each refined item still short.
  const rawNeed = new Map<string, number>()
  for (const r of refined) if (r.short > 0) count(rawNeed, itemById(r.key)!.pair, r.short)
  const raw = [...rawNeed].map(([id, n]) => item(id, n)).sort(byGrade)
  return { gear, dishes, refined, raw }
}

/** The lines a facility makes: a site its family's raw items, the Pantry or Workbench its side's refined items, the
 * Kitchen dishes, the Forge gear. Only what's still short. */
export function facilityTargets(plan: TargetPlan, placeId: string): TargetNeed[] {
  const spec = facilitySpec(placeId)
  if (!spec) return []
  const lines = spec.kind === 'gather' ? plan.raw.filter((n) => itemById(n.key)?.family === spec.family)
    : spec.kind === 'refine' ? plan.refined.filter((n) => itemById(n.key)?.side === spec.profession)
      : spec.kind === 'cook' ? plan.dishes : spec.kind === 'craft' ? plan.gear : []
  return lines.filter((n) => n.short > 0)
}
