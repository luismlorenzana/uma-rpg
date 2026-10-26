// The Gear tab's two views as data (H107, D219): Equip, what she wears, with one card of one shape for each accessory
// family; and Upgrade, every slot's grade row and the made item that raises it. Pure, so both views test without React.
import {
  ACCESSORY_FAMILY_LABEL, accessoryFlatValue, ARMOR_SLOTS, isRpgElement, rpgTomeOf, signatureBonus, WEAPON_LABEL,
  type AccessoryFamily, type AccessorySlotState, type GearTier, type GradeTarget, type RpgClass, type RpgDamageKind, type RpgWeapon,
  type UmaGrades,
} from '@rpg/domain'
import { accessoryGradeLine, armorGradeLine, gradeUpgradeView, weaponGradeLine, type GradeUpgradeView } from './gear-v3'

/** A kind a Bell or an Orb can sit on, labelled by her weapon ("Thunder Tome"). */
export interface KindChoice { kind: RpgDamageKind; label: string }

export interface AccessoryCard {
  family: AccessoryFamily
  label: string
  /** Her signature family's line ("★ Her signature: ATK and M.ATK +10"), null on the others. */
  signature: string | null
  /** Its effect at the slot's grade; at G0, what G1 gives. */
  effect: string
  /** A Bell's or an Orb's kinds: the ones she can hit with. A Pendant or an Insignia has none. */
  kinds: readonly KindChoice[]
  /** She wears this family in the slot. */
  wearing: boolean
  /** The kind she wears it on, when it takes one. */
  wornKind: RpgDamageKind | null
  /** A Bell or an Orb left on a kind she no longer holds ("No Greatsword in her slots"). */
  stale: string | null
}

/** The card order: her signature family first, then Bell, Pendant, Orb, Insignia. */
const ORDER: readonly AccessoryFamily[] = ['bell', 'pendant', 'orb', 'insignia']

/** A kind's weapon name: an element reads as its Tome. */
export const kindWeaponLabel = (kind: RpgDamageKind): string => WEAPON_LABEL[isRpgElement(kind) ? rpgTomeOf(kind) : kind]

/** What a family does at a grade (WP20–WP23). */
export function familyEffect(family: AccessoryFamily, grade: number, tier: GearTier): string {
  if (family === 'pendant') return `+${accessoryFlatValue('pendant', grade, tier)} on her three kinds`
  if (family === 'orb') return `+${accessoryFlatValue('orb', grade, tier)} offense on one kind`
  if (family === 'bell') return `After her Attack, one more hit of that kind at ${(grade / 10).toFixed(1)}`
  return `+${(grade * 1.5).toFixed(grade % 2 ? 1 : 0)}% on sub-bosses and bosses`
}

/** The four cards for one accessory slot. `kinds` are `accessoryKinds(uma, classId)`, in her weapons' order. */
export function accessoryCards(slot: AccessorySlotState | undefined, kinds: readonly RpgDamageKind[], signature: AccessoryFamily,
  level: number, tier: GearTier): AccessoryCard[] {
  const grade = slot?.grade ?? 0
  const choices = kinds.map((kind) => ({ kind, label: kindWeaponLabel(kind) }))
  return [signature, ...ORDER.filter((family) => family !== signature)].map((family) => {
    const wearing = slot?.family === family
    const wornKind = wearing && slot?.kind ? slot.kind : null
    return {
      family,
      label: ACCESSORY_FAMILY_LABEL[family],
      signature: family === signature ? `★ Her signature: ATK and M.ATK +${signatureBonus(level, tier)}` : null,
      effect: grade < 1 ? `From G1: ${familyEffect(family, 1, tier)}` : familyEffect(family, grade, tier),
      kinds: family === 'bell' || family === 'orb' ? choices : [],
      wearing,
      wornKind,
      stale: wornKind && !kinds.includes(wornKind) ? `No ${kindWeaponLabel(wornKind)} in her slots` : null,
    }
  })
}

/** The kind a card's chips start on: the one she wears it on if she still holds it, else her first. */
export function cardKind(card: AccessoryCard): RpgDamageKind | null {
  if (!card.kinds.length) return null
  return card.wornKind && card.kinds.some((k) => k.kind === card.wornKind) ? card.wornKind : card.kinds[0]!.kind
}

/** A card's one button for the kind picked on it: Equip, Equipped, or "Switch to Lance" on the family she wears. */
export function cardButton(card: AccessoryCard, picked: RpgDamageKind | null): { label: string; disabled: boolean } {
  if (!card.kinds.length) return card.wearing ? { label: 'Equipped', disabled: true } : { label: 'Equip', disabled: false }
  if (!picked) return { label: 'Equip', disabled: true }
  if (card.wearing && card.wornKind === picked) return { label: 'Equipped', disabled: true }
  if (card.wearing) return { label: `Switch to ${kindWeaponLabel(picked)}`, disabled: false }
  return { label: 'Equip', disabled: false }
}

export interface UpgradeRow { key: string; target: GradeTarget; text: string; upgrade: GradeUpgradeView }

/** Every slot's grade row, in the tab's order: her three weapons, the five armor slots, then each accessory slot. */
export function upgradeRows(grades: UmaGrades, weapons: readonly RpgWeapon[], classId: RpgClass, level: number,
  stock: Readonly<Record<string, number>>, tier: GearTier, signature: AccessoryFamily): UpgradeRow[] {
  const row = (key: string, target: GradeTarget, text: string): UpgradeRow => ({ key, target, text, upgrade: gradeUpgradeView(grades, target, level, stock) })
  return [
    ...weapons.map((weapon) => row(weapon, { kind: 'weapon', weapon }, weaponGradeLine(grades, weapon, tier))),
    ...ARMOR_SLOTS.map((slot) => row(slot, { kind: 'armor', slot }, armorGradeLine(grades, slot, classId, tier))),
    ...grades.accessories.map((slot, i) => row(`accessory-${i}`, { kind: 'accessory', slot: i }, accessoryGradeLine(slot, weapons, tier, signature, level))),
  ]
}

/** How many rows can raise now: the Upgrade view's count. */
export const readyCount = (rows: readonly UpgradeRow[]): number => rows.filter((row) => row.upgrade.ready).length
