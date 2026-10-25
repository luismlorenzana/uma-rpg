// Tier-rework gear grades (R2, D193–D198, D209): pure identities, scaling and projections shared by save and battle rules.
import { gradeItem } from '../items/made-id'
import { BATTLE_ENGINE_VERSION } from '../rpg/battle/caps'
import type { RpgDamageKind } from '../rpg/kinds'
import { RPG_CLASS_ARMOR, rpgWeaponKind, type RpgClass, type RpgWeapon } from '../rpg/rules'
import type { UmaFamily } from '../roster/template'
import { MIGHT_BY_GRADE } from './gear'
import type { ArmorSlot } from './ranks'
import { noPoints, type Points } from './bonus'
import { POINT_HP } from './pacing'

export interface UmaGrades {
  weapons: Partial<Record<RpgWeapon, { grade: number }>>
  armor: Partial<Record<ArmorSlot, { grade: number }>>
  accessories: AccessorySlotState[]
}

export const ACCESSORY_FAMILIES = ['pendant', 'orb', 'bell', 'insignia'] as const satisfies readonly UmaFamily[]
export type AccessoryFamily = UmaFamily
export interface AccessorySlotState { grade: number; family: AccessoryFamily | null; form: 'base'; kind?: RpgDamageKind }
export type GradeTarget = { kind: 'weapon'; weapon: RpgWeapon } | { kind: 'armor'; slot: ArmorSlot } | { kind: 'accessory'; slot: number }

export const GRADE_MAX = 10
export const TIER_SCALE_TENTHS = { 1: 10, 2: 18, 3: 26 } as const
export type GearTier = keyof typeof TIER_SCALE_TENTHS

export const gradeGateLevel = (grade: number): number => 5 * grade - 4

export function accessorySlotCount(_tier: GearTier, _engine = BATTLE_ENGINE_VERSION): number {
  return 1
}

export function newGrades(tier: GearTier): UmaGrades {
  return {
    weapons: {}, armor: {},
    accessories: Array.from({ length: accessorySlotCount(tier) }, () => ({ grade: 0, family: null, form: 'base' })),
  }
}

export function gradeOf(grades: UmaGrades, target: GradeTarget): number {
  if (target.kind === 'weapon') return grades.weapons[target.weapon]?.grade ?? 0
  if (target.kind === 'armor') return grades.armor[target.slot]?.grade ?? 0
  return grades.accessories[target.slot]?.grade ?? 0
}

export const tierScaled = (tierOne: number, tier: GearTier): number => Math.round((tierOne * TIER_SCALE_TENTHS[tier]) / 10)

export function mightAt(grade: number, tier: GearTier): number {
  return tierScaled(MIGHT_BY_GRADE[grade] ?? 0, tier)
}

export function gradeMight(grades: UmaGrades, weapons: readonly RpgWeapon[], tier: GearTier): Partial<Record<RpgDamageKind, number>> {
  const might: Partial<Record<RpgDamageKind, number>> = {}
  for (const weapon of weapons) {
    const value = mightAt(grades.weapons[weapon]?.grade ?? 0, tier)
    if (value > 0) might[rpgWeaponKind(weapon)] = value
  }
  return might
}

export interface ArmorValues {
  stat: 'hp' | 'def' | 'mp' | 'mdef' | 'speed'
  /** HP is raw HP; feet are Speed points (two points = 1.2% evasion). The other values are direct stat points. */
  value: number
  offense: number
}

export function armorValues(slot: ArmorSlot, grade: number, tier: GearTier): ArmorValues {
  const offense = tierScaled(Math.ceil(grade / 2), tier)
  if (slot === 'head') return { stat: 'def', value: tierScaled(4 * grade, tier), offense }
  if (slot === 'body') return { stat: 'hp', value: tierScaled(15 * grade, tier), offense }
  if (slot === 'legs') return { stat: 'mp', value: tierScaled(3 * grade, tier), offense }
  if (slot === 'arms') return { stat: 'mdef', value: tierScaled(4 * grade, tier), offense }
  return { stat: 'speed', value: 2 * grade, offense }
}

export type ArmorHalf = 'physical' | 'magical'

export function gradePoints(grades: UmaGrades, half: ArmorHalf, tier: GearTier): Points {
  const points = noPoints()
  for (const slot of Object.keys(grades.armor) as ArmorSlot[]) {
    const grade = grades.armor[slot]?.grade ?? 0
    const piece = armorValues(slot, grade, tier)
    points[piece.stat] += piece.stat === 'hp' ? piece.value / POINT_HP : piece.value
    points[half === 'physical' ? 'atk' : 'matk'] += piece.offense
  }
  return points
}

export const armorHalf = (classId: RpgClass): ArmorHalf => RPG_CLASS_ARMOR[classId]

export function gradeItemId(target: GradeTarget, grade: number): string {
  if (target.kind === 'weapon') return gradeItem('weapon-gem', grade)
  if (target.kind === 'armor') return gradeItem('armor-fittings', grade)
  return gradeItem('accessory-setting', grade)
}

const itemWords = (target: GradeTarget): { one: string; many: string } => {
  if (target.kind === 'weapon') return { one: 'Weapon Gem', many: 'Weapon Gems' }
  if (target.kind === 'armor') return { one: 'Armor Fittings', many: 'Armor Fittings' }
  return { one: 'Accessory Setting', many: 'Accessory Settings' }
}

const listGrades = (grades: readonly number[]): string => grades.length <= 2
  ? grades.map((grade) => `G${grade}`).join(' and ')
  : `${grades.slice(0, -1).map((grade) => `G${grade}`).join(', ')} and G${grades.at(-1)}`

export function raiseBlock(
  grades: UmaGrades,
  target: GradeTarget,
  umaLevel: number,
  stock: Readonly<Record<string, number>>,
  to = gradeOf(grades, target) + 1,
): string | null {
  const current = gradeOf(grades, target)
  if (current >= GRADE_MAX) return 'Already G10'
  const highest = Math.min(GRADE_MAX, Math.max(current + 1, to))
  const gate = gradeGateLevel(highest)
  if (umaLevel < gate) return `Needs Lv ${gate}`
  const missing = Array.from({ length: highest - current }, (_, index) => current + index + 1)
    .filter((grade) => (stock[gradeItemId(target, grade)] ?? 0) < 1)
  if (missing.length === 0) return null
  const words = itemWords(target)
  return highest - current === 1
    ? `Needs 1 ${words.one} G${missing[0]}`
    : `Needs ${words.many} ${listGrades(missing)}`
}
