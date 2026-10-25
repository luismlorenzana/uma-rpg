// "Can upgrade" (H34, classes v2 §7, D160): what one tap can make an Uma stronger with right now. A piece or a gem in the
// stock, or a slot she already has; what could be crafted doesn't count (targets plan that, D100). Gear counts on the
// tracks a target climbs: her active class's three weapons, each armor slot's kind and each filled accessory slot's
// type, plus an empty accessory slot she could fill. "Better" is the sheets' D119 rule (`gearChoices` + `equipBlock`):
// her own piece above the one she wears, or the stock's next grade her rank allows. No skill costs points (engine v16,
// CP14), so skills never count. Extra Stats: gem kinds she can set (the Observatory's rule, `nodeFromGem`) and free active
// slots she could fill. Pure and cheap: lookups by id, no scan of the stock per slot, so the Stable can ask it for every
// Uma.
import { BATTLE_ENGINE_VERSION } from '../rpg/battle/caps'
import { accessoryFits, ACCESSORY_TYPES, gearId, gearIdentity, gearLevel, isAccessory, type EquipType, type GearSlot } from '../economy/gear-id'
import { activeNodeSlots } from '../economy/pacing'
import { ACCESSORY_SLOTS, ARMOR_SLOTS } from '../economy/ranks'
import { GEM_IDENTITIES, gemNodes, nodeGrade } from '../economy/stars'
import type { RpgClass } from '../rpg/rules'
import { classOf } from './battle'
import { gearStock, gearV1, gemStock, isStarMap, slotKind, starsV1, type OwnedUma, type TierWorld } from './save'

export interface UmaUpgrades {
  /** Slots that can take a better piece now: a weapon type of her three, an armor slot or an accessory slot. */
  gearSlots: GearSlot[]
  gear: number
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
  const gear = gearV1(uma)
  for (const id of gear.locker) see(id)
  for (const id of Object.values(gear.equipped)) if (id) see(id)
  return best
}

/** Whether a track holds a better piece than grade `worn` that she can put on now (D119). */
function better(uma: OwnedUma, stock: Readonly<Record<string, number>>, bound: Map<EquipType, number>, type: EquipType, worn: number): boolean {
  const best = bound.get(type) ?? 0
  const rank = gearLevel(uma.ranks, type)
  if (best > worn && best <= rank) return true
  return best + 1 <= rank && (stock[gearId(type, best + 1)] ?? 0) > 0
}

/**
 * What she can upgrade now, as the class `classId` (the caller passes her active class, as for `targetPlan`, since the
 * domain has no master data). Null for an Uma this world doesn't own. Accessory slots follow the engine's generation (H57).
 */
export function upgradesFor(world: TierWorld, outfitId: string, classId: RpgClass, _tier = 1, engine: number = BATTLE_ENGINE_VERSION): UmaUpgrades | null {
  const uma = world.umas[outfitId]
  if (!uma) return null
  const bound = boundGrades(uma)
  const gear = gearV1(uma)
  const { equipped } = gear
  const stock = gearStock(world)
  const gearSlots: GearSlot[] = []

  for (const w of new Set(classOf(uma, classId).weapons)) {
    if (better(uma, stock, bound, w, pieceOf(equipped[w])?.grade ?? 0)) gearSlots.push(w)
  }
  for (const slot of ARMOR_SLOTS) {
    const kind = slotKind(gear, slot)
    const piece = pieceOf(equipped[slot])
    if (better(uma, stock, bound, kind, piece?.type === kind ? piece.grade : 0)) gearSlots.push(slot)
  }
  const accessories = ACCESSORY_SLOTS.map((slot) => {
    const piece = pieceOf(equipped[slot])
    return { slot, piece: piece && isAccessory(piece.type) ? piece : null }
  })
  // An empty slot takes a type ready now that fits it (v1 any; classes v2 an Orb in the Damage slot, a Talisman or an Amulet
  // in the Support slot, H57) other than the other slot's: two empty slots count at most once a type.
  const taken = accessories.find((a) => a.piece)?.piece?.type
  const counted = new Set<EquipType>()
  for (const { slot, piece } of accessories) {
    const fill = piece ? undefined
      : ACCESSORY_TYPES.find((t) => t !== taken && !counted.has(t) && accessoryFits(slot, t, engine) && better(uma, stock, bound, t, 0))
    if (fill) counted.add(fill)
    if (piece ? better(uma, stock, bound, piece.type, piece.grade) : fill) gearSlots.push(slot)
  }

  // A v1 map's Star Gems and active slots; a v3 map (R2, H76) reads neither: its "can upgrade" is H79's.
  const map = starsV1(uma)
  const open = new Set(map.unlocked)
  let gems = 0
  for (const [gem, count] of Object.entries(isStarMap(uma.stars) ? {} : gemStock(world))) {
    const track = GEM_TRACKS.get(gem)
    if (!track || count < 1) continue
    const next = track.nodes.find(([node]) => !open.has(node))
    if (next && next[1] === track.grade) gems++
  }
  const active = map.active.length
  const freeNodes = Math.max(0, Math.min(activeNodeSlots(uma.level) - active, map.unlocked.length - active))
  const stars = gems + freeNodes
  return { gearSlots, gear: gearSlots.length, gems, freeNodes, stars, any: gearSlots.length > 0 || stars > 0 }
}

