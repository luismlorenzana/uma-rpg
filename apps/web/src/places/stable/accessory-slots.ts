// What an accessory slot's sheet offers (D124; classes v2's typed slots, C10, D182, H59). Pure, for the sheet and its test.
import {
  ACCESSORY_KINDS, ACCESSORY_TYPES, accessoryFits, accessoryKindOf, BATTLE_ENGINE_VERSION, rpgV2, type AccessoryKind, type AccessorySlot,
  type AccessoryType, type EquipType,
} from '@rpg/domain'

/** The types an accessory slot's sheet offers, by kind: those the slot takes (`accessoryFits`: classes v1 any, v2 an Orb in
 * the Damage slot, a Talisman or an Amulet in the Support slot), except the type she wears in the other slot. */
export function accessorySheetTypes(slot: AccessorySlot, otherType: EquipType | undefined, engine: number = BATTLE_ENGINE_VERSION):
  { kind: AccessoryKind; types: AccessoryType[] }[] {
  return ACCESSORY_KINDS.map((kind) => ({
    kind, types: ACCESSORY_TYPES.filter((t) => accessoryKindOf(t) === kind && t !== otherType && accessoryFits(slot, t, engine)),
  })).filter((g) => g.types.length > 0)
}
/** An empty accessory sheet's line: v2 names what its slot takes. */
export const noAccessories = (slot: AccessorySlot, engine: number = BATTLE_ENGINE_VERSION): string =>
  !rpgV2(engine) ? 'No accessories yet: the Forge makes them.' : slot === 'accessory-1' ? 'No Orbs yet: the Forge makes them.' : 'No Talismans or Amulets yet: the Forge makes them.'

