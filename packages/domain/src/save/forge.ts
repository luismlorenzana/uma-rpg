// Equipping over the save (S7, design §7, D59, D103): a piece from the gear stock binds to the Uma who equips it and stays
// in her locker for good; she swaps freely among her own pieces. Her Weapon Rank for a weapon, her Armor Rank for an
// armor kind, lets her wear its grade (D102). An empty slot holds the Training piece of its kind. She binds each track's
// grades in order, one above the best she has (D119), so a sheet offers her best pieces and the stock above them.
import { ARMOR_SLOT_KINDS, type ArmorKind, type ArmorSlot } from '../economy/ranks'
import { armorKindOf, gearById, gearLevel, gearLevelName, gearTrackOf, isWeapon, slotOf, type GearPiece, type GearSlot } from '../economy/gear'
import { SaveRuleError, TIER_ONE, worldOf } from './rules'
import type { OwnedUma, Save, TierWorld } from './save'

function withWorld(save: Save, tier: string, world: TierWorld, now: string): Save {
  return { ...save, account: { ...save.account, updatedAt: now }, tierWorlds: { ...save.tierWorlds, [tier]: world } }
}

/** Every piece bound to her: her locker and what she wears. */
const ownGear = (uma: OwnedUma): string[] => [...new Set([...uma.gear.locker, ...Object.values(uma.gear.equipped)])]

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
  const worn = new Set(Object.values(uma.gear.equipped))
  const pieceOf = (id: string) => { const p = gearById(id); return p && match(p) ? p : null }
  const top = (p: GearPiece) => boundGrade(uma, gearTrackOf(p.type))
  const grade = (id: string) => gearById(id)!.grade
  const bound = own.filter((id) => { const p = pieceOf(id); return !!p && (worn.has(id) || p.grade >= top(p)) }).sort((a, b) => grade(b) - grade(a))
  const fromStock = Object.keys(stock).filter((id) => (stock[id] ?? 0) > 0 && !own.includes(id))
    .filter((id) => { const p = pieceOf(id); return !!p && p.grade > top(p) }).sort((a, b) => grade(a) - grade(b))
  return [...bound.map((id) => ({ id, bound: true })), ...fromStock.map((id) => ({ id, bound: false }))]
}

/** Puts a piece on her: from her locker, or from the stock (binding it to her for good). An armor piece also sets its
 * slot's kind. */
export function equipGear(save: Save, outfitId: string, gearId: string, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const uma = world.umas[outfitId]
  const piece = gearById(gearId)
  if (!uma || !piece) throw new SaveRuleError('bad-job', 'nothing to equip')
  const block = equipBlock(uma, gearId)
  if (block) throw new SaveRuleError('bad-job', block)
  let gear = world.gear
  let locker = uma.gear.locker
  if (!locker.includes(gearId)) {
    if ((gear[gearId] ?? 0) < 1) throw new SaveRuleError('no-items', 'none in stock')
    gear = { ...gear, [gearId]: gear[gearId]! - 1 }
    if (gear[gearId] === 0) delete gear[gearId]
    locker = [...locker, gearId]
  }
  const slot = slotOf(piece.type)
  const equipped = { ...uma.gear.equipped, [slot]: gearId }
  const kinds = isWeapon(piece.type) ? uma.gear.kinds : { ...uma.gear.kinds, [slot]: armorKindOf(piece.type) }
  return withWorld(save, tier, { ...world, gear, umas: { ...world.umas, [outfitId]: { ...uma, gear: { locker, equipped, kinds } } } }, now)
}

/** Takes a piece off; it stays in her locker, and the slot holds its Training piece. */
export function unequipGear(save: Save, outfitId: string, slot: GearSlot, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const uma = world.umas[outfitId]
  if (!uma) throw new SaveRuleError('not-owned', 'not unlocked')
  const equipped = { ...uma.gear.equipped }
  delete equipped[slot]
  return withWorld(save, tier, { ...world, umas: { ...world.umas, [outfitId]: { ...uma, gear: { ...uma.gear, equipped } } } }, now)
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
    if (!piece || isWeapon(piece.type) || armorKindOf(piece.type) !== kind) throw new SaveRuleError('bad-loadout', 'that piece isn’t this armor')
    return equipGear(save, outfitId, gearId, now, tier)
  }
  const equipped = { ...uma.gear.equipped }
  delete equipped[slot]
  return withWorld(save, tier, { ...world, umas: { ...world.umas, [outfitId]: { ...uma, gear: { ...uma.gear, equipped, kinds: { ...uma.gear.kinds, [slot]: kind } } } } }, now)
}
