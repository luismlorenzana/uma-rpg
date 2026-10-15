// Equipment (S7, design §7, D59, D86, D124; docs/design/gear-and-targets.md): forty types in ten grades. A recipe is two
// refined items of its grade (D125), one from each half of the Wilds, the pair rotating with the grade so every Uma
// uses all eight families alike (D139). Craft Level gates the grade made (5g − 4), and the matching rank the grade worn.
// What a piece does, all flat (D104, D124): a weapon's Might (+4 a grade) adds to the offense of hits made with it; an
// armor piece adds ATK (physical) or M.ATK (magical), ⌈g/2⌉, and its slot's defensive stat, g; an Orb adds its kind to
// every hit for weaknesses only; a Talisman or an Amulet gives one small defensive effect.
import { ITEM_FAMILIES, type ItemFamily } from '../items/catalog'
import { isRpgTome, rpgWeaponKind, type RpgDamageKind, type RpgWeapon } from '../rpg/kinds'
import { addPoints, noPoints, type Points } from './bonus'
import { ACCESSORY_SLOTS, ARMOR_SLOT_STAT, ARMOR_SLOTS, armorSlotOf, isMagicalAccessory, isMagicalArmor } from './ranks'
import {
  accessoryKindOf, charmEffect, EQUIP_LABEL, EQUIP_TYPES, gearIdentity, isAccessory, isArmor, isOrb, isWeapon, noAccessoryEffects, orbKind,
  type AccessoryEffects, type AccessoryType, type EquipType, type GearSlot,
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

/** A weapon's Might per grade, added to the offense of hits made with that weapon. */
export const MIGHT_PER_GRADE = 4
/** An armor piece's offense, ⌈g/2⌉ ATK or M.ATK; its slot's defensive stat is +1 a grade. */
export const armorOffense = (grade: number): number => Math.ceil(grade / 2)

/** The defensive effects of Talismans and Amulets (D124), per grade. Shares are per mille. */
export const CHARM_PER_GRADE = {
  /** HP healed each round (Vital); MP restored each round is ⌈g/2⌉ (Spring). */
  regen: 1,
  /** Share of physical damage she deals healed back (Vampire), of magical damage restored as MP (Siphon). */
  lifesteal: 5, mpSteal: 2,
  /** A shield against physical damage (Bulwark) or magical damage (Veil), at the start of each fight. */
  shield: 5,
  /** Share of physical (Iron) or magical (Ward) damage she doesn't take. */
  guard: 5,
  /** Share of physical (Thorn) or magical (Mirror) damage she takes that's returned to its attacker. */
  thorns: 10,
} as const

/** One accessory's effect, added into `into`. */
function addAccessory(into: AccessoryEffects, type: AccessoryType, g: number): void {
  if (isOrb(type)) { into.orbs.push(orbKind(type)); return }
  const c = CHARM_PER_GRADE
  switch (charmEffect(type)) {
    case 'vital': into.regen += c.regen * g; break
    case 'vampire': into.lifesteal += c.lifesteal * g; break
    case 'bulwark': into.barrier += c.shield * g; break
    case 'iron': into.guard += c.guard * g; break
    case 'thorn': into.thorns += c.thorns * g; break
    case 'spring': into.mpRegen += Math.ceil(g / 2); break
    case 'siphon': into.mpSteal += c.mpSteal * g; break
    case 'veil': into.veil += c.shield * g; break
    case 'ward': into.resist += c.guard * g; break
    case 'mirror': into.mirror += c.thorns * g; break
  }
}

/** A piece's stat points: armor gives its offense and its slot's defensive stat; weapons and accessories give none. */
export function gearPoints(piece: GearPiece): Points {
  const p = noPoints()
  if (!isArmor(piece.type)) return p
  p[isMagicalArmor(piece.type) ? 'matk' : 'atk'] += armorOffense(piece.grade)
  p[ARMOR_SLOT_STAT[armorSlotOf(piece.type)]] += piece.grade
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
    if (piece) out[rpgWeaponKind(w)] = piece.grade * MIGHT_PER_GRADE
  }
  return out
}
/** What her two accessories do (D124). */
export function equippedAccessories(equipped: Partial<Record<GearSlot, string>>): AccessoryEffects {
  const out = noAccessoryEffects()
  for (const slot of ACCESSORY_SLOTS) {
    const piece = pieceOf(equipped, slot)
    if (piece && isAccessory(piece.type)) addAccessory(out, piece.type, piece.grade)
  }
  return out
}
/** One accessory's effects alone, for its line on a sheet. */
export function accessoryEffects(piece: GearPiece): AccessoryEffects {
  const out = noAccessoryEffects()
  if (isAccessory(piece.type)) addAccessory(out, piece.type, piece.grade)
  return out
}

/** A piece's track, the line an Uma climbs one grade at a time (D119): since D124 every type is its own track. */
export const gearTrackOf = (type: EquipType): string => type

