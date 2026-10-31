// The Gear tab's rules (H121; D239 UP13, UP14, UP22, proposal §4.2): the tiles in the tab's order, each slot's raise sheet
// with before → after, its cost and its target grades, and Raise all's plan against a simulated stock. Pure, on the domain's
// rules (`raisePlan`, `mightAt`, `armorValues`, `accessoryEffect`), so a balance change shows here and both tests without
// React.
import {
  ARMOR_SLOT_LABEL, ARMOR_SLOTS, armorHalf, armorValues, GRADE_MAX, gradeGateLevel, gradeItemId, gradeOf, madeName, mightAt, raisePlan,
  WEAPON_LABEL, type ArmorSlot, type GearTier, type GradeTarget, type RpgClass, type RpgDamageKind, type RpgWeapon, type TierWorld, type UmaGrades,
  type UmaUpgrades,
} from '@rpg/domain'
import { accessoryEffect, actions, armorStat, effectStep, gate, gradeStep, itemCount, maxGrade, might, raiseLine, valueStep } from './copy'
import { accessoryTile, type AccessoryTile } from './gear-equip'

const sameTarget = (a: GradeTarget, b: GradeTarget) => JSON.stringify(a) === JSON.stringify(b)
const itemName = (id: string) => madeName(id) ?? id
type Stock = Readonly<Record<string, number>>

/** Every slot, in the tab's order: her weapons, the five armor slots, each accessory slot. */
export function gearTargets(grades: UmaGrades, weapons: readonly RpgWeapon[]): GradeTarget[] {
  return [
    ...[...new Set(weapons)].map((weapon): GradeTarget => ({ kind: 'weapon', weapon })),
    ...ARMOR_SLOTS.map((slot): GradeTarget => ({ kind: 'armor', slot })),
    ...grades.accessories.map((_, slot): GradeTarget => ({ kind: 'accessory', slot })),
  ]
}

const STAT_LABEL = { hp: 'HP', def: 'DEF', mp: 'MP', mdef: 'M.DEF', speed: 'Evasion' } as const
/** An armor slot's own stat at a grade, as its label and value: Feet's is the evasion it adds. */
function armorStatAt(slot: ArmorSlot, grade: number, tier: GearTier): { label: string; value: string | number } {
  const values = armorValues(slot, grade, tier)
  return { label: STAT_LABEL[values.stat], value: values.stat === 'speed' ? `${(values.value * 0.6).toFixed(1)}%` : values.value }
}

const offenseOf = (classId: RpgClass) => (armorHalf(classId) === 'physical' ? 'ATK' : 'M.ATK')

/** One weapon or armor tile: its slot, grade, one stat, and the Ready dot from `upgrades.grades`. */
export interface GearTile { target: GradeTarget; name: string; grade: number; stat: string; ready: boolean }
/** One accessory tile: `accessoryTile`'s words, its grade and its Ready dot. */
export interface AccessoryGearTile extends AccessoryTile { target: GradeTarget; slot: number; grade: number; ready: boolean }

export function gearTiles(grades: UmaGrades, weapons: readonly RpgWeapon[], kinds: readonly RpgDamageKind[], tier: GearTier, upgrades: UmaUpgrades | null):
  { weapons: GearTile[]; armor: GearTile[]; accessories: AccessoryGearTile[] } {
  const ready = (target: GradeTarget) => (upgrades?.grades ?? []).some((other) => sameTarget(other, target))
  return {
    weapons: [...new Set(weapons)].map((weapon) => {
      const target: GradeTarget = { kind: 'weapon', weapon }
      const grade = gradeOf(grades, target)
      return { target, name: WEAPON_LABEL[weapon], grade, stat: might(mightAt(grade, tier)), ready: ready(target) }
    }),
    armor: ARMOR_SLOTS.map((slot) => {
      const target: GradeTarget = { kind: 'armor', slot }
      const grade = gradeOf(grades, target)
      const stat = armorStatAt(slot, grade, tier)
      return { target, name: ARMOR_SLOT_LABEL[slot], grade, stat: armorStat(stat.label, stat.value), ready: ready(target) }
    }),
    accessories: grades.accessories.map((state, slot) => {
      const target: GradeTarget = { kind: 'accessory', slot }
      return { ...accessoryTile(state, kinds, tier), target, slot, grade: state.grade, ready: ready(target) }
    }),
  }
}

/** A target grade's chip: Closed above her level's gate. */
export interface RaiseChip { grade: number; gate: string | null; selected: boolean }
/** A slot's raise sheet: before → after, each grade's cost with what's held, the target grades, the footer. At G10 `to` is
 * null, `step` reads "G10 · Max" and there is no footer. */
export interface RaiseView {
  current: number
  to: number | null
  step: string
  value: string
  costs: string[]
  chips: RaiseChip[]
  footer: { to: number; label: string; ready: boolean } | null
}

/** What a slot does at a grade. */
function valueAt(grades: UmaGrades, target: GradeTarget, classId: RpgClass, tier: GearTier, grade: number): string {
  if (target.kind === 'weapon') return might(mightAt(grade, tier))
  if (target.kind === 'armor') {
    const stat = armorStatAt(target.slot, grade, tier)
    return `${armorStat(stat.label, stat.value)} · ${armorStat(offenseOf(classId), armorValues(target.slot, grade, tier).offense)}`
  }
  const slot = grades.accessories[target.slot]
  return slot?.family ? accessoryEffect(slot.family, grade, tier, slot.kind) : ''
}
/** What a raise does to it. */
function valueLine(grades: UmaGrades, target: GradeTarget, classId: RpgClass, tier: GearTier, from: number, to: number): string {
  if (target.kind === 'weapon') return valueStep('Might', mightAt(from, tier), mightAt(to, tier))
  if (target.kind === 'armor') {
    const a = armorStatAt(target.slot, from, tier), b = armorStatAt(target.slot, to, tier)
    const before = armorValues(target.slot, from, tier).offense, after = armorValues(target.slot, to, tier).offense
    return [valueStep(a.label, a.value, b.value), ...(before === after ? [] : [valueStep(offenseOf(classId), before, after)])].join(' · ')
  }
  const slot = grades.accessories[target.slot]
  return slot?.family ? effectStep(accessoryEffect(slot.family, from, tier, slot.kind), accessoryEffect(slot.family, to, tier, slot.kind)) : ''
}

/** The highest grade the Warehouse and her level allow, or null. */
function highestCovered(world: TierWorld, outfitId: string, target: GradeTarget, current: number): number | null {
  let highest: number | null = null
  for (let to = current + 1; to <= GRADE_MAX; to++) if (raisePlan(world, outfitId, target, to).block === null) highest = to
  return highest
}

/**
 * The raise sheet for a slot (H121 decisions 5–6): chips from current + 1 to G10, one above her level's gate Closed with its
 * "Lv n"; the target `to` when it's open, else the highest grade the Warehouse covers, else current + 1. A grade the Warehouse
 * doesn't cover stays tappable, and the footer then reads the first missing item, disabled.
 */
export function raiseSheet(world: TierWorld, outfitId: string, target: GradeTarget, classId: RpgClass, tier: GearTier, to: number | null = null): RaiseView {
  const uma = world.umas[outfitId]!
  const grades = uma.gear as UmaGrades
  const current = gradeOf(grades, target)
  if (current >= GRADE_MAX) return { current, to: null, step: maxGrade(), value: valueAt(grades, target, classId, tier, current), costs: [], chips: [], footer: null }
  const open = (grade: number) => uma.level >= gradeGateLevel(grade)
  const pick = to !== null && to > current && to <= GRADE_MAX && open(to) ? to : highestCovered(world, outfitId, target, current) ?? current + 1
  const chips = Array.from({ length: GRADE_MAX - current }, (_, i): RaiseChip => {
    const grade = current + i + 1
    return { grade, gate: open(grade) ? null : gate('level', gradeGateLevel(grade)), selected: grade === pick }
  })
  const held = (id: string) => world.items[id] ?? 0
  const items = Array.from({ length: pick - current }, (_, i) => gradeItemId(target, current + i + 1))
  const missing = items.find((id) => held(id) < 1)
  const label = !open(pick) ? gate('level', gradeGateLevel(pick)) : missing ? itemCount(itemName(missing), 0) : actions.raiseTo(pick)
  return { current, to: pick, step: gradeStep(current, pick), value: valueLine(grades, target, classId, tier, current, pick),
    costs: items.map((id) => itemCount(itemName(id), 1, held(id))), chips, footer: { to: pick, label, ready: open(pick) && !missing } }
}

/** A slot's name in a Raise all line. */
const targetName = (target: GradeTarget) => (target.kind === 'weapon' ? WEAPON_LABEL[target.weapon] : target.kind === 'armor' ? ARMOR_SLOT_LABEL[target.slot] : `Accessory ${target.slot + 1}`)

/** One write of Raise all. */
export interface RaiseStep { target: GradeTarget; to: number }
/** What Raise all does: the steps, one line each, and the items they use. */
export interface RaiseAllPlan { steps: RaiseStep[]; lines: string[]; items: number }
/**
 * Every slot as far as items and level allow, in the tab's order (H121 decision 5): each takes the highest grade `raisePlan`
 * allows against the Warehouse minus what earlier slots take, and a slot the stock no longer covers drops out.
 */
export function raiseAllPlan(world: TierWorld, outfitId: string, weapons: readonly RpgWeapon[]): RaiseAllPlan {
  const uma = world.umas[outfitId]
  const plan: RaiseAllPlan = { steps: [], lines: [], items: 0 }
  if (!uma) return plan
  const grades = uma.gear as UmaGrades
  const stock: Record<string, number> = { ...world.items }
  for (const target of gearTargets(grades, weapons)) {
    const left = { ...world, items: stock as Stock }
    const current = gradeOf(grades, target)
    const to = highestCovered(left, outfitId, target, current)
    if (to === null) continue
    const items = raisePlan(left, outfitId, target, to).items
    for (const id of items) stock[id] = (stock[id] ?? 0) - 1
    plan.steps.push({ target, to })
    plan.lines.push(raiseLine(targetName(target), current, to, items.map(itemName)))
    plan.items += items.length
  }
  return plan
}

