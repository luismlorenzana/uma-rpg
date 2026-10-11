// Equipping over the save (S7, design §7, D59): a piece from the gear stock binds to the Uma who equips it and stays
// in her locker for good; she swaps freely among her own pieces. Her Weapon, Armor or Accessory Level k wears grade k.
import { gearById, gearLevel, gearLevelName, slotOf, type GearSlot } from '../economy/gear'
import { SaveRuleError, TIER_ONE, worldOf } from './rules'
import type { OwnedUma, Save, TierWorld } from './save'

function withWorld(save: Save, tier: string, world: TierWorld, now: string): Save {
  return { ...save, account: { ...save.account, updatedAt: now }, tierWorlds: { ...save.tierWorlds, [tier]: world } }
}

/** Why she can't wear this piece, or null: grade k needs her matching Weapon, Armor or Accessory Level k (D70). */
export function equipBlock(uma: OwnedUma, gearId: string): string | null {
  const piece = gearById(gearId)
  if (!piece) return 'Unknown gear'
  if (gearLevel(uma.ranks, piece.type) < piece.grade) return `Needs ${gearLevelName(piece.type)} ${piece.grade}`
  return null
}

/** Puts a piece on her: from her locker, or from the stock (binding it to her for good). */
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
  const equipped = { ...uma.gear.equipped, [slotOf(piece.type)]: gearId }
  return withWorld(save, tier, { ...world, gear, umas: { ...world.umas, [outfitId]: { ...uma, gear: { locker, equipped } } } }, now)
}

/** Takes a piece off; it stays in her locker. */
export function unequipGear(save: Save, outfitId: string, slot: GearSlot, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const uma = world.umas[outfitId]
  if (!uma) throw new SaveRuleError('not-owned', 'not unlocked')
  const equipped = { ...uma.gear.equipped }
  delete equipped[slot]
  return withWorld(save, tier, { ...world, umas: { ...world.umas, [outfitId]: { ...uma, gear: { ...uma.gear, equipped } } } }, now)
}
