// The Gear tab's two views as data (H107, D219): Equip, what she wears, with a tile for each accessory slot and the list a
// tile opens (D266); and Upgrade, every slot's grade row and the made item that raises it. Pure, so both views test without
// React.
import {
  ACCESSORY_FAMILY_LABEL, ARMOR_SLOTS, classPresetPlan, isRpgElement, rpgClassName, rpgPresetClasses, rpgTomeOf, WEAPON_LABEL,
  type AccessoryFamily, type AccessorySlotState, type GearTier, type GradeTarget, type RpgClass, type RpgDamageKind, type RpgTier1Class,
  type RpgWeapon, type TierWorld, type UmaGrades,
} from '@rpg/domain'
import { accessoryGradeLine, armorGradeLine, gradeUpgradeView, weaponGradeLine, type GradeUpgradeView } from './gear-v3'
import { accessoryEffect, classPresetName, standardPreset, staleKind } from './copy'

/** One standard preset (D263): the class it's for, its name, its weapons and accessories, and whether she wears it. */
export interface PresetRow { pick: RpgTier1Class; title: string; detail: string; accessories: string; on: boolean }
/** The presets her class offers: a Tier 1 class its one, named "Standard preset", and a Tier 0 one for each class it promotes
 * into, named after that class. */
export function presetRows(world: TierWorld, outfitId: string, classId: RpgClass, family: AccessoryFamily): PresetRow[] {
  const picks = rpgPresetClasses(classId)
  return picks.map((pick) => {
    const plan = classPresetPlan(world, outfitId, classId, undefined, family, pick)
    const on = plan.changes === 0
    return { pick, on, title: picks.length > 1 ? classPresetName(rpgClassName(pick), on) : standardPreset(on),
      detail: plan.weapons.map((w) => WEAPON_LABEL[w]).join(' · '),
      accessories: (plan.accessories ?? []).map((form) => ACCESSORY_FAMILY_LABEL[form.family]).join(' · ') }
  })
}

/** What a slot shows on its tile: its effect at the slot's grade, or why it does nothing. */
export interface AccessoryTile {
  /** "ATK +6", "Greatsword +20"; "Pendant · Off" at G0, where a form waits for G1; "Empty" without a family. */
  text: string
  /** An Orb left on a kind she no longer holds ("Greatsword not held"). */
  stale: string | null
}
export function accessoryTile(slot: AccessorySlotState | undefined, kinds: readonly RpgDamageKind[], tier: GearTier): AccessoryTile {
  if (!slot?.family) return { text: 'Empty', stale: null }
  const stale = slot.kind && !kinds.includes(slot.kind) ? staleKind(kindWeaponLabel(slot.kind)) : null
  if (slot.grade < 1) return { text: `${ACCESSORY_FAMILY_LABEL[slot.family]} · Off`, stale }
  return { text: accessoryEffect(slot.family, slot.grade, tier, slot.kind), stale }
}

/** One row of a slot's list: a family, or for an Orb one kind. One tap wears it. */
export interface AccessoryChoice {
  family: AccessoryFamily
  kind: RpgDamageKind | null
  label: string
  /** Its effect at the slot's grade; at G0, what G1 gives. */
  effect: string
  signature: boolean
  worn: boolean
}

/** The row order: her signature family first, then Pendant, Charm (id `bell`), Orb, Insignia. */
const ORDER: readonly AccessoryFamily[] = ['pendant', 'bell', 'orb', 'insignia']

/** A kind's weapon name: an element reads as its Tome. */
export const kindWeaponLabel = (kind: RpgDamageKind): string => WEAPON_LABEL[isRpgElement(kind) ? rpgTomeOf(kind) : kind]

/** Everything a slot can wear, an Orb once for each of `kinds` (`accessoryKinds(uma, classId)`, in her weapons' order). */
export function accessoryChoices(slot: AccessorySlotState | undefined, kinds: readonly RpgDamageKind[], signature: AccessoryFamily, tier: GearTier): AccessoryChoice[] {
  const grade = slot?.grade ?? 0
  return [signature, ...ORDER.filter((family) => family !== signature)].flatMap((family) => (family === 'orb' ? kinds : [null]).map((kind) => ({
    family,
    kind,
    label: ACCESSORY_FAMILY_LABEL[family],
    effect: grade < 1 ? `G1: ${accessoryEffect(family, 1, tier, kind)}` : accessoryEffect(family, grade, tier, kind),
    signature: family === signature,
    worn: slot?.family === family && (kind === null || slot.kind === kind),
  })))
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
