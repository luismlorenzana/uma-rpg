// Equipment identity and wear gates for strict saves; names and crafting recipes remain lazy in gear.ts (H16).
import { ITEM_EFFECTS, type ItemEffect } from '../items/kinds'
import { RPG_DAMAGE_KINDS, type RpgDamageKind } from '../rpg/kinds'
import { TOKEN_CLASS_NAME } from './tokens'
import { ARMOR_TYPES, GEAR_TYPE_LABEL, WEAPON_TYPES, weaponClasses, type ArmorType, type GearType, type Ranks, type WeaponType } from './training'

/** Orbs (D86): an accessory that adds its kind to every hit, for weaknesses only. */
export type OrbType = `orb-${RpgDamageKind}`
export const ORB_TYPES: readonly OrbType[] = RPG_DAMAGE_KINDS.map((k) => `orb-${k}` as OrbType)
export const ACCESSORY_TYPES = ['ring', 'charm', ...ORB_TYPES] as const
export type AccessoryType = 'ring' | 'charm' | OrbType
export type EquipType = GearType | AccessoryType
export const EQUIP_TYPES: readonly EquipType[] = [...WEAPON_TYPES, ...ARMOR_TYPES, ...ACCESSORY_TYPES]
export type GearSlot = WeaponType | 'armor' | 'accessory'
const KIND_NAME: Readonly<Record<RpgDamageKind, string>> = {
  greatsword: 'Greatsword', axe: 'Axe', lance: 'Lance', bow: 'Bow', katana: 'Katana', fire: 'Fire', ice: 'Ice', lightning: 'Lightning', light: 'Light', dark: 'Dark',
}
export const EQUIP_LABEL: Readonly<Record<EquipType, string>> = {
  ...GEAR_TYPE_LABEL, ring: 'Ring', charm: 'Charm',
  ...Object.fromEntries(RPG_DAMAGE_KINDS.map((k) => [`orb-${k}`, `${KIND_NAME[k]} Orb`])) as Record<OrbType, string>,
}
export const isOrb = (t: EquipType): t is OrbType => t.startsWith('orb-')
export const orbKind = (t: OrbType): RpgDamageKind => t.slice('orb-'.length) as RpgDamageKind
export const isArmor = (t: EquipType): t is ArmorType => (ARMOR_TYPES as readonly string[]).includes(t)
export const isAccessory = (t: EquipType): t is AccessoryType => (ACCESSORY_TYPES as readonly string[]).includes(t)
/** A weapon takes the best Weapon Level of its classes; armor/accessories use their own levels (D70). */
export function gearLevel(ranks: Ranks, type: EquipType): number {
  if (isAccessory(type)) return ranks.accessory
  if (isArmor(type)) return ranks.armor
  return Math.max(...weaponClasses(type as WeaponType).map((c) => ranks.weapons[c]))
}
export function gearLevelName(type: EquipType): string {
  if (isAccessory(type)) return 'Accessory Level'
  if (isArmor(type)) return 'Armor Level'
  return `${weaponClasses(type as WeaponType).map((c) => TOKEN_CLASS_NAME[c]).join(' or ')} Weapon Level`
}
export const isWeapon = (t: EquipType): t is WeaponType => (WEAPON_TYPES as readonly string[]).includes(t)
export const slotOf = (t: EquipType): GearSlot => (isArmor(t) ? 'armor' : isAccessory(t) ? 'accessory' : t)
export const gearId = (type: EquipType, grade: number, accent: ItemEffect): string => `${type}-g${grade}-${accent}`
export function gearIdentity(id: string): { id: string; type: EquipType; grade: number; accent: ItemEffect } | undefined {
  const m = /^([a-z-]+)-g(\d{1,2})-([a-z]+)$/.exec(id)
  if (!m) return undefined
  const type = m[1] as EquipType, grade = Number(m[2]), accent = m[3] as ItemEffect
  if (!EQUIP_TYPES.includes(type) || grade < 1 || grade > 10 || !ITEM_EFFECTS.includes(accent)) return undefined
  return { id, type, grade, accent }
}
