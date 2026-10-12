// Equipment identity and wear gates for strict saves; names and crafting recipes remain lazy in gear.ts (H16).
// D103: thirty types. Ten weapons and ten Orbs go by grade only (`lance-g3`, `orb-fire-g3`); the eight armor pieces also
// carry an accent stat (`helm-g3-atk`). A weapon is worn up to its Weapon Rank, armor and Orbs up to their Armor Rank.
import { ITEM_EFFECTS, type ItemEffect } from '../items/kinds'
import { RPG_DAMAGE_KINDS, type RpgDamageKind } from '../rpg/kinds'
import {
  ARMOR_LABEL, ARMOR_PIECES, ARMOR_SLOTS, armorSlotOf, armorTrack, orbArmorKind, WEAPON_LABEL, WEAPON_TYPES, weaponTrack,
  type ArmorKind, type ArmorPiece, type ArmorSlot, type Ranks, type WeaponType,
} from './ranks'

/** Orbs (D86): the accessory slot's piece, adding its kind to every hit for weaknesses only. */
export type OrbType = `orb-${RpgDamageKind}`
export const ORB_TYPES: readonly OrbType[] = RPG_DAMAGE_KINDS.map((k) => `orb-${k}` as OrbType)
export type EquipType = WeaponType | ArmorPiece | OrbType
export const EQUIP_TYPES: readonly EquipType[] = [...WEAPON_TYPES, ...ARMOR_PIECES, ...ORB_TYPES]
/** Where a piece goes: a weapon's own slot, or one of the five armor slots. */
export type GearSlot = WeaponType | ArmorSlot
export const GEAR_SLOTS: readonly GearSlot[] = [...WEAPON_TYPES, ...ARMOR_SLOTS]
const KIND_NAME: Readonly<Record<RpgDamageKind, string>> = {
  greatsword: 'Greatsword', axe: 'Axe', lance: 'Lance', bow: 'Bow', katana: 'Katana', fire: 'Fire', ice: 'Ice', lightning: 'Lightning', light: 'Light', dark: 'Dark',
}
export const EQUIP_LABEL: Readonly<Record<EquipType, string>> = {
  ...WEAPON_LABEL, ...Object.fromEntries(ARMOR_PIECES.map((p) => [p, ARMOR_LABEL[p]])) as Record<ArmorPiece, string>,
  ...Object.fromEntries(RPG_DAMAGE_KINDS.map((k) => [`orb-${k}`, `${KIND_NAME[k]} Orb`])) as Record<OrbType, string>,
}
export const isOrb = (t: EquipType): t is OrbType => t.startsWith('orb-')
export const orbKind = (t: OrbType): RpgDamageKind => t.slice('orb-'.length) as RpgDamageKind
export const isArmor = (t: EquipType): t is ArmorPiece => (ARMOR_PIECES as readonly string[]).includes(t)
export const isWeapon = (t: EquipType): t is WeaponType => (WEAPON_TYPES as readonly string[]).includes(t)
/** Only armor pieces carry an accent. */
export const hasAccent = (t: EquipType): boolean => isArmor(t)
/** The armor kind a piece counts as: the piece itself, or an Orb's Arms or Elemental kind. */
export const armorKindOf = (t: ArmorPiece | OrbType): ArmorKind => (isOrb(t) ? orbArmorKind(orbKind(t)) : t)
export const slotOf = (t: EquipType): GearSlot => (isWeapon(t) ? t : armorSlotOf(armorKindOf(t)))

/** The grade of this type she may wear: her Weapon Rank for a weapon, her Armor Rank for its kind otherwise (D102). */
export function gearLevel(ranks: Ranks, type: EquipType): number {
  return isWeapon(type) ? weaponTrack(ranks, type).rank : armorTrack(ranks, armorKindOf(type)).rank
}
/** What raises that level, for messages: "Lance Rank", "Robe Rank". */
export function gearLevelName(type: EquipType): string {
  return isWeapon(type) ? `${WEAPON_LABEL[type]} Rank` : `${ARMOR_LABEL[armorKindOf(type)]} Rank`
}

export function gearId(type: EquipType, grade: number, accent?: ItemEffect | null): string {
  return hasAccent(type) ? `${type}-g${grade}-${accent ?? 'hp'}` : `${type}-g${grade}`
}
export interface GearIdentity { id: string; type: EquipType; grade: number; accent: ItemEffect | null }
export function gearIdentity(id: string): GearIdentity | undefined {
  const m = /^([a-z-]+?)-g(\d{1,2})(?:-([a-z]+))?$/.exec(id)
  if (!m) return undefined
  const type = m[1] as EquipType, grade = Number(m[2]), accent = (m[3] ?? null) as ItemEffect | null
  if (!EQUIP_TYPES.includes(type) || grade < 1 || grade > 10) return undefined
  if (hasAccent(type) ? accent === null || !ITEM_EFFECTS.includes(accent) : accent !== null) return undefined
  return { id, type, grade, accent }
}
