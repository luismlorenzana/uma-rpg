import {
  ACCESSORY_FAMILY_LABEL, accessoryFlatValue, ARMOR_LABEL, ARMOR_SLOT_LABEL, armorHalf, armorKindFor, armorValues, gradeItemId, gradeOf, madeName,
  isRpgElement, mightAt, raiseBlock, rpgTomeOf, rpgWeaponKind, signatureBonus, signatureWorn, WEAPON_LABEL,
  type AccessoryFamily, type AccessorySlotState, type ArmorSlot, type GearTier, type GradeTarget, type RpgClass, type RpgWeapon,
  type UmaGrades,
} from '@rpg/domain'
import { kindLabel } from '../../battle/labels'

export interface GradeUpgradeView {
  grade: number
  next: number | null
  item: string | null
  label: string
  block: string | null
  ready: boolean
}

export function gradeUpgradeView(grades: UmaGrades, target: GradeTarget, level: number,
  stock: Readonly<Record<string, number>>): GradeUpgradeView {
  const grade = gradeOf(grades, target)
  if (grade >= 10) return { grade, next: null, item: null, label: 'G10', block: 'Already G10', ready: false }
  const next = grade + 1
  const item = gradeItemId(target, next)
  const block = raiseBlock(grades, target, level, stock)
  return { grade, next, item, label: `G${grade} → G${next} · 1 ${madeName(item)}`, block, ready: block === null }
}

export function weaponGradeLine(grades: UmaGrades, weapon: RpgWeapon, tier: GearTier): string {
  const grade = gradeOf(grades, { kind: 'weapon', weapon })
  return `${WEAPON_LABEL[weapon]} · G${grade} · Might ${mightAt(grade, tier)} · weak ×1.3`
}

const statLabel = { hp: 'HP', def: 'DEF', mp: 'MP', mdef: 'M.DEF', speed: 'Evasion' } as const

export function armorGradeLine(grades: UmaGrades, slot: ArmorSlot, classId: RpgClass, tier: GearTier): string {
  const grade = gradeOf(grades, { kind: 'armor', slot })
  const values = armorValues(slot, grade, tier)
  const value = values.stat === 'speed' ? `${(values.value * 0.6).toFixed(1)}%` : `+${values.value}`
  return `${ARMOR_SLOT_LABEL[slot]} · ${ARMOR_LABEL[armorKindFor(slot, armorHalf(classId))]} · G${grade} · ${statLabel[values.stat]} ${value}`
}

export function accessoryGradeLine(slot: AccessorySlotState | undefined, weapons: readonly RpgWeapon[], tier: GearTier,
  family: AccessoryFamily, level: number): string {
  if (!slot || slot.grade < 1 || slot.family === null) return `Accessory · G${slot?.grade ?? 0} · Pick a form`
  const label = ACCESSORY_FAMILY_LABEL[slot.family]
  let effect: string
  if (slot.family === 'pendant') effect = `+${accessoryFlatValue('pendant', slot.grade, tier)} on her three kinds`
  else if (slot.family === 'orb') effect = `+${accessoryFlatValue('orb', slot.grade, tier)} ${slot.kind ? kindLabel(slot.kind) : ''} offense`
  else if (slot.family === 'bell') {
    const weapon = weapons.find((w) => rpgWeaponKind(w) === slot.kind)
    effect = weapon ? `after her Attack, her ${WEAPON_LABEL[weapon]} at ${(slot.grade / 10).toFixed(1)}`
      : `No ${slot.kind ? WEAPON_LABEL[isRpgElement(slot.kind) ? rpgTomeOf(slot.kind) : slot.kind] : 'weapon'} in her slots`
  } else effect = `+${(slot.grade * 1.5).toFixed(slot.grade % 2 ? 1 : 0)}% on sub-bosses and bosses`
  const star = signatureWorn({ accessories: [slot] }, family) ? ` · ★ +${signatureBonus(level, tier)}` : ''
  return `${label}${slot.kind ? ` · ${kindLabel(slot.kind)}` : ''} · G${slot.grade} · ${effect}${star}`
}
