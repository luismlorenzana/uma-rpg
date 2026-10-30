// Accessories v3 (R2, Tier 1's economy; H75, D212): damage only, four families, one untyped slot, base forms. The design
// is weapon-progression §5 (WP17–WP25), §2.4 (WP31, the damage stack) and §5.10 (WP33, the signature); uma-templates §3.4
// (UT7, UT8); stat-balance SB9, SB10, SB15.
// - The ten supports retire in every tier (WP17): engine v17 refuses their fields (D209), and nothing here makes one.
// - Four families from Tier 1 (WP18), each a base form in R2's one slot (WP19): its family, form and kind are a setting
//   changed freely outside fights, the grade is the slot's, and G0 does nothing. R3 adds the second slot and the
//   branches (H84) beside these.
// - The Pendant (WP20): flat offense on each of her three slotted weapons' own kinds. The Orb (WP22): flat offense on one
//   kind she sets, any of the ten. Both Tier 1's rows × tier (`tierScaled`, SB1).
// - The Bell (WP21): when her act includes an Attack, her weapon of its kind strikes once at 0.1 a grade × her hand, only
//   on a kind she slots. The Insignia (WP23): her hits on sub-bosses and bosses +1.5% a grade. Shares: every tier alike.
// - Her signature (WP33, UT7, SB15): while she wears her knack's family, her ATK and M.ATK + 0.2 a level × tier, a stat
//   frozen into the fight's input (UT18), outside the kind cap. Any class (UT12).
// The engine's rules (v17) are in `rpg/battle/engine.ts`; the presets (WP25, UT8, SB10) in `save/presets.ts`. Data and
// pure rules, safe for the main bundle.
// D264, save v34: three slots in every tier, each with its own family and grade, repeats allowed. The Pendant is +ATK, the
// Bell's id is now the Charm, +M.ATK, the Orb one kind and the Insignia bosses (`accessorySlotValue`, `accessorySlotsParts`,
// `accessoryOffense`). Below them R2's one-slot rows stay for the balance harness until the combat balance pass.
import type { BattleBell, BattleInsignia } from '../rpg/battle/types'
import { rpgWeaponKind, type RpgDamageKind, type RpgWeapon } from '../rpg/kinds'
import { GRADE_MAX, TIER_SCALE_TENTHS, tierScaled, type AccessoryFamily, type AccessorySlotState, type GearTier, type UmaGrades } from './grades'

/** WP20: a Pendant's flat offense on each of her three kinds, Tier 1, G1–G10 (Tier 2 and 3 by `tierScaled`). */
export const PENDANT_T1: readonly number[] = [1, 1, 2, 2, 4, 5, 7, 9, 12, 14]
/** WP22: an Orb's flat offense on its kind, Tier 1, G1–G10: v2's Orb (`ORB_OFFENSE_BY_GRADE` from G1), half a weapon's
 * Might, **a step down** (×0.8, rounded; R2's balance, H81, D215): measured on region runs at Lv 50 the Orb was the best
 * form in 19 of WP §5.7's 24 class-and-context cells (Auto spends most of an Uma's damage on her lead kind), over the
 * half the rule allows, so its values step down as the docs' knob says (v2's row was 1, 2, 4, 6, 10, 13, 18, 23, 29, 34). */
export const ORB_T1: readonly number[] = [1, 2, 3, 5, 8, 10, 14, 18, 23, 27]
/** WP21: a Bell's follow-up, per mille of an Attack a grade: 0.1 a grade, 1.0 at G10, the same in every tier. */
export const BELL_PERMILLE_PER_GRADE = 100
/** WP23: an Insignia's factor, per mille a grade: +1.5% a grade, +15% at G10, the same in every tier. */
export const INSIGNIA_PERMILLE_PER_GRADE = 15

/** The families' names on the screens. The id `bell` stays and reads Charm (D264). */
export const ACCESSORY_FAMILY_LABEL: Readonly<Record<AccessoryFamily, string>> = { pendant: 'Pendant', orb: 'Orb', bell: 'Charm', insignia: 'Insignia' }

/** D264: a Pendant's ATK or a Charm's M.ATK, one slot, Tier 1, G1–G10: a third of the old Pendant's and a little over, since
 * a hybrid now splits her slots between ATK and M.ATK. */
export const OFFENSE_SLOT_T1: readonly number[] = [1, 1, 2, 2, 3, 3, 4, 5, 5, 6]
/** D264: an Orb's flat offense on its kind, one slot, Tier 1, G1–G10: three at G10 are today's one Orb. */
export const ORB_SLOT_T1: readonly number[] = [1, 1, 2, 3, 4, 5, 6, 7, 8, 9]
/** D264: an Insignia's factor, per mille a grade: three at G10 are today's one, +15%. */
export const INSIGNIA_SLOT_PERMILLE = 5

/** What one slot's family gives at a grade and tier: a Pendant's ATK, a Charm's M.ATK or an Orb's offense on its kind. 0 at
 * G0 and for the Insignia, which is a factor. */
export function accessorySlotValue(family: AccessoryFamily, grade: number, tier: GearTier): number {
  const row = family === 'orb' ? ORB_SLOT_T1 : family === 'insignia' ? null : OFFENSE_SLOT_T1
  return row && grade >= 1 ? tierScaled(row[Math.min(GRADE_MAX, grade) - 1]!, tier) : 0
}
/** What her Orbs and Insignias put into a fight, slot by slot and summed: flat offense by kind, and one Insignia's value. */
export function accessorySlotsParts(slots: readonly AccessorySlotState[], tier: GearTier): AccessoryParts {
  const parts: AccessoryParts = { flat: {} }
  let insignia = 0
  for (const slot of slots) {
    if (slot.family === null || slot.grade < 1) continue
    const grade = Math.min(GRADE_MAX, slot.grade)
    if (slot.family === 'orb' && slot.kind) parts.flat[slot.kind] = (parts.flat[slot.kind] ?? 0) + accessorySlotValue('orb', grade, tier)
    else if (slot.family === 'insignia') insignia += INSIGNIA_SLOT_PERMILLE * grade
  }
  return insignia ? { ...parts, insignia: { value: insignia } } : parts
}
/** What her Pendants and Charms add to ATK and M.ATK: real stats, so a healer's mends and an inherited Limit Break read them. */
export function accessoryOffense(slots: readonly AccessorySlotState[], tier: GearTier): { atk: number; matk: number } {
  const total = (family: AccessoryFamily) => slots.reduce((n, s) => n + (s.family === family ? accessorySlotValue(family, s.grade, tier) : 0), 0)
  return { atk: total('pendant'), matk: total('bell') }
}

const FLAT_T1: Readonly<Partial<Record<AccessoryFamily, readonly number[]>>> = { pendant: PENDANT_T1, orb: ORB_T1 }

/** A flat form's offense at a grade and tier: a Pendant's on each of her kinds, an Orb's on its kind. 0 at G0, and for
 * the Bell and the Insignia (no flat offense). */
export function accessoryFlatValue(family: AccessoryFamily, grade: number, tier: GearTier): number {
  const row = FLAT_T1[family]
  return row && grade >= 1 ? tierScaled(row[Math.min(GRADE_MAX, grade) - 1]!, tier) : 0
}

/** What one accessory slot puts into a fight: flat offense by kind (a Pendant's or an Orb's), a Bell or an Insignia. */
export interface AccessoryParts {
  flat: Partial<Record<RpgDamageKind, number>>
  bell?: BattleBell
  insignia?: BattleInsignia
}

/**
 * What her slot does with her class's three weapons, at its grade and tier. A Pendant adds its value to each of her
 * weapons' kinds; an Orb to its kind, held or not; a Bell its follow-up (`100 × grade` per mille of an Attack) only when
 * its kind is one of her weapons' kinds (otherwise nothing: "No Fire Tome in her slots", WP21); an Insignia `15 × grade`
 * per mille. A G0 slot, an empty one (no family) or an Orb or a Bell without a kind gives nothing.
 */
export function accessoryParts(slot: AccessorySlotState | undefined, weapons: readonly RpgWeapon[], tier: GearTier): AccessoryParts {
  const parts: AccessoryParts = { flat: {} }
  if (!slot || slot.family === null || slot.grade < 1) return parts
  const grade = Math.min(GRADE_MAX, slot.grade)
  const kinds = weapons.map(rpgWeaponKind)
  if (slot.family === 'pendant') for (const kind of kinds) parts.flat[kind] = accessoryFlatValue('pendant', grade, tier)
  else if (slot.family === 'orb') { if (slot.kind) parts.flat[slot.kind] = accessoryFlatValue('orb', grade, tier) }
  else if (slot.family === 'bell') { if (slot.kind && kinds.includes(slot.kind)) parts.bell = { kind: slot.kind, power: BELL_PERMILLE_PER_GRADE * grade } }
  else parts.insignia = { value: INSIGNIA_PERMILLE_PER_GRADE * grade }
  return parts
}

/** Her signature's bonus to ATK and M.ATK (WP33, SB15): 0.2 a level × tier, whole: Tier 1 +2 · +6 · +10 at Lv 10 · 30 ·
 * 50, Tier 2 +18 and Tier 3 +26 at Lv 50. `level` is her level in the tier (1–50). */
export const signatureBonus = (level: number, tier: GearTier): number => Math.round((2 * level * TIER_SCALE_TENTHS[tier]) / 100)

/** Whether she wears her signature family (WP33, UT7): some slot holds it at G1 or above. A G0 slot is an empty setting
 * that does nothing (WP19), and her signature is "while she wears" one, so the first Accessory Setting makes it (D212). */
export function signatureWorn(grades: Pick<UmaGrades, 'accessories'>, family: AccessoryFamily | null | undefined): boolean {
  return !!family && grades.accessories.some((slot) => slot.family === family && slot.grade >= 1)
}
