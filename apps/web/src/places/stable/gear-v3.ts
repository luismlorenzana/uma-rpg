import {
  ACCESSORY_FAMILY_LABEL, ARMOR_SLOT_LABEL, armorHalf, armorValues, gradeItemId, gradeOf, madeName,
  mightAt, raiseBlock, signatureBonus, signatureWorn, WEAPON_LABEL,
  type AccessoryFamily, type AccessorySlotState, type ArmorSlot, type GearTier, type GradeTarget, type RpgClass, type RpgWeapon,
  type UmaGrades,
} from '@rpg/domain'
import { accessoryEffect, armorHalf as armorHalfCopy, armorStat, grade as gradeCopy, gradeStep, itemCount, might } from './copy'

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
  if (grade >= 10) return { grade, next: null, item: null, label: 'G10 · Max', block: 'Already G10', ready: false }
  const next = grade + 1
  const item = gradeItemId(target, next)
  const block = raiseBlock(grades, target, level, stock)
  return { grade, next, item, label: `${gradeStep(grade, next)} · ${itemCount(madeName(item) ?? item, 1)}`, block, ready: block === null }
}

export function weaponGradeLine(grades: UmaGrades, weapon: RpgWeapon, tier: GearTier): string {
  const grade = gradeOf(grades, { kind: 'weapon', weapon })
  return `${WEAPON_LABEL[weapon]} · ${gradeCopy(grade)} · ${might(mightAt(grade, tier))}`
}

const statLabel = { hp: 'HP', def: 'DEF', mp: 'MP', mdef: 'M.DEF', speed: 'Evasion' } as const

export function armorGradeLine(grades: UmaGrades, slot: ArmorSlot, classId: RpgClass, tier: GearTier): string {
  const grade = gradeOf(grades, { kind: 'armor', slot })
  const values = armorValues(slot, grade, tier)
  const value = values.stat === 'speed' ? `${(values.value * 0.6).toFixed(1)}%` : values.value
  const offense = armorHalf(classId) === 'physical' ? 'ATK' : 'M.ATK'
  return `${ARMOR_SLOT_LABEL[slot]} · ${armorHalfCopy(armorHalf(classId))} · ${gradeCopy(grade)} · ${armorStat(statLabel[values.stat], value)} · ${armorStat(offense, values.offense)}`
}

export function accessoryGradeLine(slot: AccessorySlotState | undefined, weapons: readonly RpgWeapon[], tier: GearTier,
  family: AccessoryFamily, level: number): string {
  if (!slot || slot.family === null) return 'None · G0'
  const label = ACCESSORY_FAMILY_LABEL[slot.family]
  // A form picked at G0 waits for G1, where every accessory starts counting (H82).
  if (slot.grade < 1) return `${label} · G0 · Off`
  const effect = accessoryEffect(slot.family, slot.grade, tier, slot.kind ?? undefined)
  const star = signatureWorn({ accessories: [slot] }, family) ? ` · ★ +${signatureBonus(level, tier)}` : ''
  return `${label} · ${gradeCopy(slot.grade)} · ${effect}${star}`
}
