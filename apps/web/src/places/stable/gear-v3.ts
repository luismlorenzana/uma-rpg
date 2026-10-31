import {
  ACCESSORY_FAMILY_LABEL, gradeOf, mightAt, signatureBonus, signatureWorn, WEAPON_LABEL,
  type AccessoryFamily, type AccessorySlotState, type GearTier, type RpgWeapon, type UmaGrades,
} from '@rpg/domain'
import { accessoryEffect, grade as gradeCopy, might } from './copy'

export function weaponGradeLine(grades: UmaGrades, weapon: RpgWeapon, tier: GearTier): string {
  const grade = gradeOf(grades, { kind: 'weapon', weapon })
  return `${WEAPON_LABEL[weapon]} · ${gradeCopy(grade)} · ${might(mightAt(grade, tier))}`
}

export function accessoryGradeLine(slot: AccessorySlotState | undefined, weapons: readonly RpgWeapon[], tier: GearTier,
  family: AccessoryFamily, level: number): string {
  if (!slot || slot.family === null) return `None · ${gradeCopy(slot?.grade ?? 0)}`
  const label = ACCESSORY_FAMILY_LABEL[slot.family]
  // A form picked at G0 waits for G1, where every accessory starts counting (H82).
  if (slot.grade < 1) return `${label} · G0 · Off`
  const effect = accessoryEffect(slot.family, slot.grade, tier, slot.kind ?? undefined)
  const star = signatureWorn({ accessories: [slot] }, family) ? ` · ★ +${signatureBonus(level, tier)}` : ''
  return `${label} · ${gradeCopy(slot.grade)} · ${effect}${star}`
}
