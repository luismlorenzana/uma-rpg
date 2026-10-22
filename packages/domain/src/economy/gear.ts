// Equipment (S7, design §7, D59, D86, D124; docs/design/gear-and-targets.md): forty types in ten grades. A recipe is two
// refined items of its grade (D125), one from each half of the Wilds, the pair rotating with the grade so every Uma
// uses all eight families alike (D139). Craft Level gates the grade made (5g − 4), and the matching rank the grade worn.
// What a piece does, all flat (D104, D124): a weapon's Might (+4 a grade) adds to the offense of hits made with it; an
// armor piece adds ATK (physical) or M.ATK (magical), ⌈g/2⌉, and its slot's defensive stat, 2g; an Orb adds its kind to
// every hit for weaknesses only (classes v2: flat offense on its kind's hits, H57); a Talisman or an Amulet gives one small
// defensive effect.
import { ITEM_FAMILIES, type ItemFamily } from '../items/catalog'
import { BATTLE_ENGINE_VERSION, rpgV2 } from '../rpg/battle/caps'
import { isRpgTome, rpgWeaponKind, type RpgDamageKind, type RpgWeapon } from '../rpg/kinds'
import { addPoints, noPoints, type Points } from './bonus'
import { ACCESSORY_SLOTS, ARMOR_SLOT_STAT, ARMOR_SLOTS, armorSlotOf, isMagicalAccessory, isMagicalArmor } from './ranks'
import {
  accessoryKindOf, charmEffect, EQUIP_LABEL, EQUIP_TYPES, gearIdentity, isAccessory, isArmor, isOrb, isWeapon, noAccessoryEffects, orbKind,
  type AccessoryEffects, type AccessoryType, type AmuletEffect, type EquipType, type GearSlot, type TalismanEffect,
} from './gear-id'
export * from './gear-id'

/** Whether a type is magical: Tomes, magical armor, Elemental Orbs and Amulets. */
export function isMagicalGear(type: EquipType): boolean {
  if (isWeapon(type)) return isRpgTome(type)
  if (isArmor(type)) return isMagicalArmor(type)
  return isMagicalAccessory(accessoryKindOf(type))
}
/** The two families each group takes, one refined item of each (D125): weapons, armor, accessories; physical, magical. */
/**
 * A piece takes two refined items of its grade (D125): one from each half of the Wilds, as these four pairs. A type's
 * grades walk through the pairs in turn, starting at its own place in the list of types, so every Uma's gear uses all
 * eight families about equally, whatever her class and her armor's half (D139). Before D139 a type kept one pair, and
 * an Uma of one class never used half the Wilds.
 */
const PAIRS = [['ores', 'crystals'], ['woods', 'essences'], ['hides-scales', 'bones-horns'], ['stones', 'fibers']] as const
export const recipeFamilies = (type: EquipType, grade: number): readonly string[] => PAIRS[(EQUIP_TYPES.indexOf(type) + grade) % PAIRS.length]!
const familyOf = (id: string): ItemFamily => ITEM_FAMILIES.find((f) => f.id === id)!

export interface GearPiece {
  /** `<type>-g<grade>`, e.g. `lance-g3`, `helm-g3`, `talisman-vital-g3`. */
  id: string
  type: EquipType
  grade: number
  name: string
  /** Refined materials, per piece. */
  inputs: Record<string, number>
}
/** A grade's prefix from its half's first family: "Copper", "Quartz". */
const gradeWord = (type: EquipType, grade: number): string =>
  familyOf(isMagicalGear(type) ? 'crystals' : 'ores').raw[grade - 1]!.name.replace(/ (Ore|Log|Pelt|Hide|Scale|Bundle|Crystal|Shard|Fiber|Essence|Bone|Horn|Stone)$/, '')
/** The piece an id names, or undefined. Pieces aren't stored as a list: any type × grade exists. */
export function gearById(id: string): GearPiece | undefined {
  const piece = gearIdentity(id)
  if (!piece) return undefined
  const { type, grade } = piece
  const inputs: Record<string, number> = {}
  for (const family of recipeFamilies(type, grade)) inputs[familyOf(family).refined[grade - 1]!.id] = 1
  return { id, type, grade, name: `${gradeWord(type, grade)} ${EQUIP_LABEL[type]}`, inputs }
}

// --- What a piece does (D104, D124) -------------------------------------------------------------------------------------

/**
 * A weapon's Might by grade (D142), added to the offense of the hits made with it. Each value is set so that at the level
 * its grade opens (Lv 5g − 4) the weapon adds about 6% × g to an on-curve Uma's hits on a regular foe of that level:
 * +6% at grade 1 on Lv 1, +60% at grade 10 on Lv 46. Being flat, a grade worn ahead of its level is worth much more, and
 * one kept long after less. Index 0 is the Training weapon.
 */
export const MIGHT_BY_GRADE = [0, 1, 4, 8, 12, 19, 26, 35, 45, 57, 68] as const
export const mightOf = (grade: number): number => MIGHT_BY_GRADE[Math.max(0, Math.min(10, grade))]!
/** An armor piece's offense, ⌈g/2⌉ ATK or M.ATK, from grade 1 (D143 restores it after D142 started it at grade 2); its
 * slot's defensive stat is +2 a grade (D141). */
export const armorOffense = (grade: number): number => Math.ceil(grade / 2)
export const ARMOR_DEFENSE_PER_GRADE = 2

/** Classes v2 (C4, H57): an Orb adds this to the offense of its kind's hits, half its grade's Might rounded up (+34 at
 * grade 10: 1, 2, 4, 6, 10, 13, 18, 23, 29, 34). Flat like Might, so it scales by grade and level and never multiplies
 * with other bonuses. */
export const orbOffense = (grade: number): number => Math.ceil(mightOf(grade) / 2)
export const ORB_OFFENSE_BY_GRADE: readonly number[] = MIGHT_BY_GRADE.map((_, g) => orbOffense(g))

/**
 * The defensive effects of Talismans and Amulets (D124, D141), per grade, per mille, by effect: Vital heals a share of
 * her max HP each round (5% at grade 10), Spring restores 1 MP a grade each round; Vampire heals a share of the physical
 * damage she deals, Siphon restores MP as a share of the magical; Bulwark and Veil shield a share of her max HP against
 * physical or magical damage at the start of each fight; Iron and Ward cut physical or magical damage taken; Thorn and
 * Mirror return a share of it to its attacker. Regen and the shields are made into HP when a fight starts, so they keep
 * their worth at every level.
 */
export type CharmPerGrade = Readonly<Record<TalismanEffect | AmuletEffect, number>>
const CHARM_V1: CharmPerGrade = { vital: 5, vampire: 20, bulwark: 20, iron: 15, thorn: 30, spring: 1, siphon: 5, veil: 20, ward: 15, mirror: 30 }
/** Classes v2 (§6.3, H57): the Vital Talisman 0.6% a grade and the Siphon Amulet 0.8%, so every support is a real pick.
 * H60 may retune any of them. */
const CHARM_V2: CharmPerGrade = { ...CHARM_V1, vital: 6, siphon: 8 }
export const charmPerGrade = (engine: number = BATTLE_ENGINE_VERSION): CharmPerGrade => (rpgV2(engine) ? CHARM_V2 : CHARM_V1)
/** The live generation's values. */
export const CHARM_PER_GRADE = charmPerGrade()
/** The fight field each effect adds to. */
const CHARM_FIELD = {
  vital: 'regen', vampire: 'lifesteal', bulwark: 'barrier', iron: 'guard', thorn: 'thorns', spring: 'mpRegen', siphon: 'mpSteal', veil: 'veil', ward: 'resist', mirror: 'mirror',
} as const satisfies Record<TalismanEffect | AmuletEffect, keyof AccessoryEffects>

/** One accessory's effect, added into `into`: an Orb's kind (v1) or its flat offense on that kind (v2, `orbMight`; she
 * never wears two Orbs of one kind). */
function addAccessory(into: AccessoryEffects, type: AccessoryType, g: number, engine: number): void {
  if (!isOrb(type)) into[CHARM_FIELD[charmEffect(type)]] += charmPerGrade(engine)[charmEffect(type)] * g
  else if (rpgV2(engine)) into.orbMight = { ...into.orbMight, [orbKind(type)]: orbOffense(g) }
  else into.orbs.push(orbKind(type))
}

/** A piece's stat points: armor gives its offense and its slot's defensive stat; weapons and accessories give none. */
export function gearPoints(piece: GearPiece): Points {
  const p = noPoints()
  if (!isArmor(piece.type)) return p
  p[isMagicalArmor(piece.type) ? 'matk' : 'atk'] += armorOffense(piece.grade)
  p[ARMOR_SLOT_STAT[armorSlotOf(piece.type)]] += ARMOR_DEFENSE_PER_GRADE * piece.grade
  return p
}
export const pieceOf = (equipped: Partial<Record<GearSlot, string>>, slot: GearSlot): GearPiece | undefined =>
  equipped[slot] ? gearById(equipped[slot]!) : undefined

/** The points of what she wears: her five armor slots (weapons add Might, accessories effects). */
export function equippedPoints(equipped: Partial<Record<GearSlot, string>>): Points {
  return addPoints(noPoints(), ...ARMOR_SLOTS.map((s) => pieceOf(equipped, s)).filter((p) => p !== undefined).map(gearPoints))
}
/** Might by damage kind for a class's five weapons: what each weapon's piece adds to hits made with it. */
export function equippedMight(equipped: Partial<Record<GearSlot, string>>, weapons: readonly RpgWeapon[]): Partial<Record<RpgDamageKind, number>> {
  const out: Partial<Record<RpgDamageKind, number>> = {}
  for (const w of weapons) {
    const piece = pieceOf(equipped, w)
    if (piece) out[rpgWeaponKind(w)] = mightOf(piece.grade)
  }
  return out
}
/** What her two accessories do (D124), in an engine's generation: v1 her Orbs' kinds, v2 their offense (H57). */
export function equippedAccessories(equipped: Partial<Record<GearSlot, string>>, engine: number = BATTLE_ENGINE_VERSION): AccessoryEffects {
  const out = noAccessoryEffects()
  for (const slot of ACCESSORY_SLOTS) {
    const piece = pieceOf(equipped, slot)
    if (piece && isAccessory(piece.type)) addAccessory(out, piece.type, piece.grade, engine)
  }
  return out
}
/** One accessory's effects alone, for its line on a sheet. */
export function accessoryEffects(piece: GearPiece, engine: number = BATTLE_ENGINE_VERSION): AccessoryEffects {
  const out = noAccessoryEffects()
  if (isAccessory(piece.type)) addAccessory(out, piece.type, piece.grade, engine)
  return out
}

/** A piece's track, the line an Uma climbs one grade at a time (D119): since D124 every type is its own track. */
export const gearTrackOf = (type: EquipType): string => type

