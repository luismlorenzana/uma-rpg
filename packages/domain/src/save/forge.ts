// Equipping over the save (S7, design §7, D59, D103): a piece from the gear stock binds to the Uma who equips it and stays
// in her locker for good; she swaps freely among her own pieces. Her Weapon Rank for a weapon, her Armor Rank for an
// armor kind, lets her wear its grade (D102). An empty slot holds the Training piece of its kind.
import { ARMOR_SLOT_KINDS, type ArmorKind, type ArmorSlot } from '../economy/ranks'
import { armorKindOf, gearById, gearLevel, gearLevelName, isWeapon, slotOf, type GearSlot } from '../economy/gear'
import { SaveRuleError, TIER_ONE, worldOf } from './rules'
import type { OwnedUma, Save, TierWorld } from './save'

function withWorld(save: Save, tier: string, world: TierWorld, now: string): Save {
  return { ...save, account: { ...save.account, updatedAt: now }, tierWorlds: { ...save.tierWorlds, [tier]: world } }
}

/** Why she can't wear this piece, or null: grade k needs her matching rank k. */
export function equipBlock(uma: OwnedUma, gearId: string): string | null {
  const piece = gearById(gearId)
  if (!piece) return 'Unknown gear'
  if (gearLevel(uma.ranks, piece.type) < piece.grade) return `Needs ${gearLevelName(piece.type)} ${piece.grade}`
  return null
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
