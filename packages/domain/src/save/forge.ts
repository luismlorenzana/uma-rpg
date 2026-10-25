// Equipping over the save (S7, design §7, D59, D103, D124): a piece from the gear stock binds to the Uma who equips it and
// stays in her locker for good; she swaps freely among her own pieces. Her Weapon, Armor or Accessory Rank lets her wear
// its grade (D102). An empty weapon or armor slot holds the Training piece of its kind; an empty accessory slot holds
// nothing, and her two accessories are of different types (classes v2: an Orb in the Damage slot, a Talisman or an Amulet
// in the Support slot, H57). She binds each track's grades in order, one above the best she has (D119), so a sheet offers
// her best pieces and the stock above them.
import { BATTLE_ENGINE_VERSION } from '../rpg/battle/caps'
import { GRADE_MAX, gradeItemId, gradeOf, raiseBlock, type GradeTarget, type UmaGrades } from '../economy/grades'
import { ACCESSORY_SLOTS, ARMOR_SLOT_KINDS, type AccessorySlot, type ArmorKind, type ArmorSlot } from '../economy/ranks'
import {
  accessorySlotFor, gearById, gearLevel, gearLevelName, gearTrackOf, isAccessory, isArmor, isWeapon, slotOf, type GearPiece, type GearSlot,
} from '../economy/gear'
import { SaveRuleError, TIER_ONE, worldOf } from './rules'
import { gearV1, isGrades, type OwnedUma, type Save, type TierWorld } from './save'

function withWorld(save: Save, tier: string, world: TierWorld, now: string): Save {
  return { ...save, account: { ...save.account, updatedAt: now }, tierWorlds: { ...save.tierWorlds, [tier]: world } }
}

/** Every piece bound to her: her locker and what she wears. */
export const ownGear = (uma: OwnedUma): string[] => {
  const gear = gearV1(uma)
  return [...new Set([...gear.locker, ...Object.values(gear.equipped)])]
}

/** The highest grade she has bound on a track (D119): 0, her Training piece, when none. */
export function boundGrade(uma: OwnedUma, track: string): number {
  let best = 0
  for (const id of ownGear(uma)) {
    const piece = gearById(id)
    if (piece && gearTrackOf(piece.type) === track) best = Math.max(best, piece.grade)
  }
  return best
}

/** Why she can't wear this piece, or null: grade k needs her matching rank k, and a piece from the stock must be the next
 * grade on its track (D119). Her own pieces swap freely. */
export function equipBlock(uma: OwnedUma, gearId: string): string | null {
  const piece = gearById(gearId)
  if (!piece) return 'Unknown gear'
  if (gearLevel(uma.ranks, piece.type) < piece.grade) return `Needs ${gearLevelName(piece.type)} ${piece.grade}`
  if (!ownGear(uma).includes(gearId)) {
    const best = boundGrade(uma, gearTrackOf(piece.type))
    if (piece.grade <= best) return `Has G${best} already`
    if (piece.grade > best + 1) return `Needs G${best + 1} first`
  }
  return null
}

/**
 * What a slot's sheet offers (D119), on each track `match` takes: her own pieces of the top grade she has bound (and the
 * one she wears, if lower), best first, then stock pieces above that grade, the next one first. Lower grades are spent.
 */
export function gearChoices(uma: OwnedUma, stock: Readonly<Record<string, number>>, match: (piece: GearPiece) => boolean): { id: string; bound: boolean }[] {
  const own = ownGear(uma)
  const worn = new Set(Object.values(gearV1(uma).equipped))
  const pieceOf = (id: string) => { const p = gearById(id); return p && match(p) ? p : null }
  const top = (p: GearPiece) => boundGrade(uma, gearTrackOf(p.type))
  const grade = (id: string) => gearById(id)!.grade
  const bound = own.filter((id) => { const p = pieceOf(id); return !!p && (worn.has(id) || p.grade >= top(p)) }).sort((a, b) => grade(b) - grade(a))
  const fromStock = Object.keys(stock).filter((id) => (stock[id] ?? 0) > 0 && !own.includes(id))
    .filter((id) => { const p = pieceOf(id); return !!p && p.grade > top(p) }).sort((a, b) => grade(a) - grade(b))
  return [...bound.map((id) => ({ id, bound: true })), ...fromStock.map((id) => ({ id, bound: false }))]
}

/** The accessory slot a new accessory goes in when none is named: the first empty one, else the first. */
const freeAccessorySlot = (uma: OwnedUma): AccessorySlot => {
  const gear = gearV1(uma)
  return ACCESSORY_SLOTS.find((s) => !gear.equipped[s]) ?? ACCESSORY_SLOTS[0]
}

/** Puts a piece on her: from her locker, or from the stock (binding it to her for good). An armor piece also sets its
 * slot's kind; an accessory goes in `accessorySlot` (D124), never beside another of its type. Classes v2 (C10, H57): an
 * accessory goes in its type's slot, and naming the other one is refused. */
export function equipGear(save: Save, outfitId: string, gearId: string, now: string, tier = TIER_ONE, accessorySlot?: AccessorySlot,
  engine: number = BATTLE_ENGINE_VERSION): Save {
  const world = worldOf(save, tier)
  const uma = world.umas[outfitId]
  const piece = gearById(gearId)
  if (!uma || !piece) throw new SaveRuleError('bad-job', 'nothing to equip')
  const block = equipBlock(uma, gearId)
  if (block) throw new SaveRuleError('bad-job', block)
  const typed = isAccessory(piece.type) && accessorySlotFor(piece.type, engine)
  if (typed && accessorySlot && accessorySlot !== typed) {
    throw new SaveRuleError('bad-loadout', typed === 'accessory-1' ? 'The Support slot takes a Talisman or an Amulet' : 'The Damage slot takes an Orb')
  }
  const slot: GearSlot = isAccessory(piece.type) ? typed || accessorySlot || freeAccessorySlot(uma) : slotOf(piece.type)
  const current = gearV1(uma)
  if (isAccessory(piece.type)) {
    const other = ACCESSORY_SLOTS.find((s) => s !== slot)!
    const there = current.equipped[other] ? gearById(current.equipped[other]!) : undefined
    if (there?.type === piece.type) throw new SaveRuleError('bad-loadout', 'she already wears one of these')
  }
  let gear = world.gear
  let locker = current.locker
  if (!locker.includes(gearId)) {
    if ((gear[gearId] ?? 0) < 1) throw new SaveRuleError('no-items', 'none in stock')
    gear = { ...gear, [gearId]: gear[gearId]! - 1 }
    if (gear[gearId] === 0) delete gear[gearId]
    locker = [...locker, gearId]
  }
  const equipped = { ...current.equipped, [slot]: gearId }
  const kinds = isArmor(piece.type) ? { ...current.kinds, [slot]: piece.type } : current.kinds
  return withWorld(save, tier, { ...world, gear, umas: { ...world.umas, [outfitId]: { ...uma, gear: { locker, equipped, kinds } } } }, now)
}

/** Takes a piece off; it stays in her locker, and the slot holds its Training piece. */
export function unequipGear(save: Save, outfitId: string, slot: GearSlot, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const uma = world.umas[outfitId]
  if (!uma) throw new SaveRuleError('not-owned', 'not unlocked')
  const gear = gearV1(uma)
  const equipped = { ...gear.equipped }
  delete equipped[slot]
  return withWorld(save, tier, { ...world, umas: { ...world.umas, [outfitId]: { ...uma, gear: { ...gear, equipped } } } }, now)
}

/**
 * Puts an armor kind in one of her five armor slots (D103): its Training piece (null) or a crafted piece of that kind.
 * Changing the kind takes off a piece of the other kind; it stays in her locker.
 */
export function wearArmor(save: Save, outfitId: string, slot: ArmorSlot, kind: ArmorKind, gearId: string | null, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const uma = world.umas[outfitId]
  if (!uma) throw new SaveRuleError('not-owned', 'not unlocked')
  if (!(ARMOR_SLOT_KINDS[slot] as readonly string[]).includes(kind)) throw new SaveRuleError('bad-loadout', 'that armor doesn’t go in this slot')
  if (gearId !== null) {
    const piece = gearById(gearId)
    if (!piece || piece.type !== kind) throw new SaveRuleError('bad-loadout', 'that piece isn’t this armor')
    return equipGear(save, outfitId, gearId, now, tier)
  }
  const gear = gearV1(uma)
  const equipped = { ...gear.equipped }
  delete equipped[slot]
  return withWorld(save, tier, { ...world, umas: { ...world.umas, [outfitId]: { ...uma, gear: { ...gear, equipped, kinds: { ...gear.kinds, [slot]: kind } } } } }, now)
}

/** Puts an accessory in one of her two accessory slots (D124), or empties the slot (null); a removed one stays hers.
 * Classes v2 (H57): only into its type's slot. */
export function wearAccessory(save: Save, outfitId: string, slot: AccessorySlot, gearId: string | null, now: string, tier = TIER_ONE,
  engine: number = BATTLE_ENGINE_VERSION): Save {
  const world = worldOf(save, tier)
  const uma = world.umas[outfitId]
  if (!uma) throw new SaveRuleError('not-owned', 'not unlocked')
  if (gearId !== null) {
    const piece = gearById(gearId)
    if (!piece || !isAccessory(piece.type)) throw new SaveRuleError('bad-loadout', 'that isn’t an accessory')
    return equipGear(save, outfitId, gearId, now, tier, slot, engine)
  }
  return unequipGear(save, outfitId, slot, now, tier)
}

const withGrade = (grades: UmaGrades, target: GradeTarget, grade: number): UmaGrades => {
  if (target.kind === 'weapon') return { ...grades, weapons: { ...grades.weapons, [target.weapon]: { grade } } }
  if (target.kind === 'armor') return { ...grades, armor: { ...grades.armor, [target.slot]: { grade } } }
  const accessories = grades.accessories.map((slot, index) => index === target.slot ? { ...slot, grade } : slot)
  return { ...grades, accessories }
}

/** The complete material plan for raising one graded track, before the mutation is committed (R2, D209). */
export function raisePlan(world: TierWorld, outfitId: string, target: GradeTarget, to: number): { items: string[]; block: string | null } {
  const uma = world.umas[outfitId]
  if (!uma) return { items: [], block: 'Not unlocked' }
  if (!isGrades(uma.gear)) return { items: [], block: 'Not graded' }
  const current = gradeOf(uma.gear, target)
  const highest = Math.min(GRADE_MAX, Math.max(current + 1, to))
  const items = Array.from({ length: highest - current }, (_, index) => gradeItemId(target, current + index + 1))
  return { items, block: raiseBlock(uma.gear, target, uma.level, world.items, highest) }
}

/** Raises a graded weapon, armor slot or accessory slot one grade, consuming its one made item. */
export function raiseGrade(save: Save, outfitId: string, target: GradeTarget, now: string, tier = TIER_ONE): Save {
  const uma = worldOf(save, tier).umas[outfitId]
  if (!uma || !isGrades(uma.gear)) {
    if (!uma) throw new SaveRuleError('not-owned', 'Not unlocked')
    throw new SaveRuleError('bad-job', 'Not graded')
  }
  return raiseGradeTo(save, outfitId, target, gradeOf(uma.gear, target) + 1, now, tier)
}

/** Raises through every grade up to `to`, consuming all required items atomically. */
export function raiseGradeTo(save: Save, outfitId: string, target: GradeTarget, to: number, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const uma = world.umas[outfitId]
  if (!uma) throw new SaveRuleError('not-owned', 'Not unlocked')
  if (!isGrades(uma.gear)) throw new SaveRuleError('bad-job', 'Not graded')
  const plan = raisePlan(world, outfitId, target, to)
  if (plan.block) throw new SaveRuleError(plan.block.startsWith('Needs 1 ') || plan.block.startsWith('Needs Weapon') ||
    plan.block.startsWith('Needs Armor') || plan.block.startsWith('Needs Accessory') ? 'no-items' : 'bad-job', plan.block)
  const items = { ...world.items }
  for (const id of plan.items) {
    items[id] = (items[id] ?? 0) - 1
    if (items[id] === 0) delete items[id]
  }
  const grade = Math.min(GRADE_MAX, Math.max(gradeOf(uma.gear, target) + 1, to))
  const gear = withGrade(uma.gear, target, grade)
  return withWorld(save, tier, { ...world, items, umas: { ...world.umas, [outfitId]: { ...uma, gear } } }, now)
}
