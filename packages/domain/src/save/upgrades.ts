// "Can upgrade" (H34, classes v2 §7, D160): what one tap can make an Uma stronger with right now. A piece or a gem in the
// stock, or points or a slot she already has; what could be crafted doesn't count (targets plan that, D100). Gear counts
// on the tracks a target climbs: her active class's five weapons, each armor slot's kind and each filled accessory
// slot's type, plus an empty accessory slot she could fill. "Better" is the sheets' D119 rule (`gearChoices` +
// `equipBlock`): her own piece above the one she wears, or the stock's next grade her rank allows. Points: her active
// class's unspent side points, while a side skill of her five trees can be learned. Extra Stats: gem kinds she can set
// (the Observatory's rule, `nodeFromGem`) and free active slots she could fill. Pure and cheap: lookups by id, no scan
// of the stock per slot, so the Stable can ask it for every Uma.
import { ACCESSORY_TYPES, gearId, gearIdentity, gearLevel, isAccessory, type EquipType, type GearSlot } from '../economy/gear-id'
import { activeNodeSlots } from '../economy/pacing'
import { ACCESSORY_SLOTS, ARMOR_SLOTS, classRankOf } from '../economy/ranks'
import { GEM_IDENTITIES, gemNodes, nodeGrade } from '../economy/stars'
import { rpgLearnBlock, rpgProfileTrees, rpgTreePointsEarned, rpgTreePointsSpent, type RpgClass } from '../rpg/rules'
import { rpgSideNodeLevel } from '../rpg/node-identity'
import { classOf } from './battle'
import { slotKind, type OwnedUma, type TierWorld } from './save'

export interface UmaUpgrades {
  /** Slots that can take a better piece now: a weapon type of her five, an armor slot or an accessory slot. */
  gearSlots: GearSlot[]
  gear: number
  /** Her active class's unspent side points, or 0 when no side skill can be learned now. */
  points: number
  /** Star Gem kinds in stock she can set now. */
  gems: number
  /** Open nodes she could switch on now. */
  freeNodes: number
  /** gems + freeNodes. */
  stars: number
  any: boolean
}

/** Each gem's nodes as `[node, grade]`, lowest first, built once. */
const GEM_TRACKS = new Map(GEM_IDENTITIES.map((g) => [g.id, { grade: g.grade, nodes: gemNodes(g).map((n) => [n, nodeGrade(n)] as const) }]))
/** Piece ids parsed once: the same few hundred ids recur in every locker. */
const IDENTITIES = new Map<string, { type: EquipType; grade: number } | null>()
function pieceOf(id: string | undefined): { type: EquipType; grade: number } | null {
  if (!id) return null
  let piece = IDENTITIES.get(id)
  if (piece === undefined) {
    const known = gearIdentity(id)
    piece = known ? { type: known.type, grade: known.grade } : null
    IDENTITIES.set(id, piece)
  }
  return piece
}

/** Her best bound grade per track (`boundGrade` for every track at once): her locker and what she wears. */
function boundGrades(uma: OwnedUma): Map<EquipType, number> {
  const best = new Map<EquipType, number>()
  const see = (id: string) => {
    const piece = pieceOf(id)
    if (piece && piece.grade > (best.get(piece.type) ?? 0)) best.set(piece.type, piece.grade)
  }
  for (const id of uma.gear.locker) see(id)
  for (const id of Object.values(uma.gear.equipped)) if (id) see(id)
  return best
}

/** Whether a track holds a better piece than grade `worn` that she can put on now (D119). */
function better(uma: OwnedUma, stock: Readonly<Record<string, number>>, bound: Map<EquipType, number>, type: EquipType, worn: number): boolean {
  const best = bound.get(type) ?? 0
  const rank = gearLevel(uma.ranks, type)
  if (best > worn && best <= rank) return true
  return best + 1 <= rank && (stock[gearId(type, best + 1)] ?? 0) > 0
}

/** Whether she can learn any side skill of her five trees now (`rpgLearnBlock` is null for one). */
function canLearnSide(uma: OwnedUma, classId: RpgClass, tier: number, unspent: number): boolean {
  const setup = classOf(uma, classId)
  const learner = { classId, tier, classRank: classRankOf(uma.ranks, classId), tree: setup.tree.map((id) => ({ tier, id })) }
  for (const tree of rpgProfileTrees({ classId, weapons: setup.weapons })) {
    for (let depth = 1; depth <= Math.min(5, unspent); depth++) {
      if (learner.classRank < rpgSideNodeLevel(depth)) break
      for (const side of ['a', 'b']) if (rpgLearnBlock(learner, `${tree}.${depth}${side}`) === null) return true
    }
  }
  return false
}

/**
 * What she can upgrade now, as the class `classId` (the caller passes her active class, as for `targetPlan`, since the
 * domain has no master data). Null for an Uma this world doesn't own.
 */
export function upgradesFor(world: TierWorld, outfitId: string, classId: RpgClass, tier = 1): UmaUpgrades | null {
  const uma = world.umas[outfitId]
  if (!uma) return null
  const bound = boundGrades(uma)
  const { equipped } = uma.gear
  const gearSlots: GearSlot[] = []

  for (const w of new Set(classOf(uma, classId).weapons)) {
    if (better(uma, world.gear, bound, w, pieceOf(equipped[w])?.grade ?? 0)) gearSlots.push(w)
  }
  for (const slot of ARMOR_SLOTS) {
    const kind = slotKind(uma.gear, slot)
    const piece = pieceOf(equipped[slot])
    if (better(uma, world.gear, bound, kind, piece?.type === kind ? piece.grade : 0)) gearSlots.push(slot)
  }
  const accessories = ACCESSORY_SLOTS.map((slot) => {
    const piece = pieceOf(equipped[slot])
    return { slot, piece: piece && isAccessory(piece.type) ? piece : null }
  })
  const empty = accessories.filter((a) => !a.piece)
  // An empty slot takes any accessory type ready now except the other slot's: two empty slots count at most once a type.
  const taken = accessories.find((a) => a.piece)?.piece?.type
  let ready = 0
  for (const type of ACCESSORY_TYPES) {
    if (ready >= empty.length) break
    if (type !== taken && better(uma, world.gear, bound, type, 0)) ready++
  }
  const fillable = new Set(empty.slice(0, ready).map((a) => a.slot))
  for (const { slot, piece } of accessories) {
    if (piece ? better(uma, world.gear, bound, piece.type, piece.grade) : fillable.has(slot)) gearSlots.push(slot)
  }

  const rank = classRankOf(uma.ranks, classId)
  const unspent = rpgTreePointsEarned(rank) - rpgTreePointsSpent(classOf(uma, classId).tree.map((id) => ({ tier, id })))
  const points = unspent > 0 && canLearnSide(uma, classId, tier, unspent) ? unspent : 0

  const open = new Set(uma.stars.unlocked)
  let gems = 0
  for (const [gem, count] of Object.entries(world.gems)) {
    const track = GEM_TRACKS.get(gem)
    if (!track || count < 1) continue
    const next = track.nodes.find(([node]) => !open.has(node))
    if (next && next[1] === track.grade) gems++
  }
  const active = uma.stars.active.length
  const freeNodes = Math.max(0, Math.min(activeNodeSlots(uma.level) - active, uma.stars.unlocked.length - active))
  const stars = gems + freeNodes
  return { gearSlots, gear: gearSlots.length, points, gems, freeNodes, stars, any: gearSlots.length > 0 || points > 0 || stars > 0 }
}

