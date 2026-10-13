// Equipment (S7, design §7, D59, D86, D103; docs/design/progression.md): thirty types in ten grades. A recipe is four
// refined items of its grade, one from each family of its half: the Arms half (Ores, Stones, Woods, Hides & Scales) makes
// Arms, physical armor and Arms Orbs; the Arcana half (Crystals, Fibers, Essences, Bones & Horns) makes Tomes, magical
// armor and Elemental Orbs. Craft Level gates the grade made (5g − 4), and the matching rank the grade worn.
// What a piece does, all flat (D104): a weapon's Might (+4 a grade) adds to the offense of hits made with it; physical
// armor adds DEF and a Barrier at the start of each fight, magical armor M.DEF and Regen each round; an armor piece's
// accent adds ⌈g/2⌉ to its stat; an Orb adds its kind to every hit for weaknesses only.
import { ITEM_FAMILIES, type ItemEffect, type ItemFamily } from '../items/catalog'
import { isRpgTome, rpgWeaponKind, type RpgDamageKind, type RpgWeapon } from '../rpg/kinds'
import { addPoints, noPoints, type Points } from './bonus'
import { ARMOR_SLOTS, isMagicalArmor } from './ranks'
import { armorKindOf, EQUIP_LABEL, gearIdentity, isOrb, isWeapon, orbKind, type EquipType, type GearSlot } from './gear-id'
export * from './gear-id'

/** The two halves of the gathering families (D86), by flavor: blade, whetstone, haft, grip; focus, pages, ink, binding. */
const ARMS = ['ores', 'stones', 'woods', 'hides-scales'] as const
const ARCANA = ['crystals', 'fibers', 'essences', 'bones-horns'] as const
/** Whether a type is magical: Tomes, magical armor and Elemental Orbs. */
export function isMagicalGear(type: EquipType): boolean {
  if (isWeapon(type)) return isRpgTome(type)
  return isMagicalArmor(armorKindOf(type))
}
/** The four families each type takes, one refined item of each. */
export const recipeFamilies = (type: EquipType): readonly string[] => (isMagicalGear(type) ? ARCANA : ARMS)
const familyOf = (id: string): ItemFamily => ITEM_FAMILIES.find((f) => f.id === id)!

export interface GearPiece {
  /** `<type>-g<grade>`, or `<type>-g<grade>-<accent>` for armor, e.g. `lance-g3`, `helm-g3-atk`. */
  id: string
  type: EquipType
  grade: number
  /** An armor piece's accent stat; null for weapons and Orbs. */
  accent: ItemEffect | null
  name: string
  /** Refined materials, per piece. */
  inputs: Record<string, number>
}
const ACCENT_NAME: Readonly<Record<ItemEffect, string>> = {
  hp: 'Stalwart', mp: 'Wellspring', atk: 'Fierce', matk: 'Arcane', def: 'Bulwark', mdef: 'Warded', speed: 'Swift', limit: 'Valiant',
}
/** A grade's prefix from the first family's raw item: "Copper", "Quartz". */
const gradeWord = (type: EquipType, grade: number): string =>
  familyOf(recipeFamilies(type)[0]!).raw[grade - 1]!.name.replace(/ (Ore|Log|Pelt|Hide|Scale|Bundle|Crystal|Shard|Fiber|Essence|Bone|Horn|Stone)$/, '')
/** The piece an id names, or undefined. Pieces aren't stored as a list: any type × grade (× accent) exists. */
export function gearById(id: string): GearPiece | undefined {
  const piece = gearIdentity(id)
  if (!piece) return undefined
  const { type, grade, accent } = piece
  const inputs: Record<string, number> = {}
  for (const family of recipeFamilies(type)) inputs[familyOf(family).refined[grade - 1]!.id] = 1
  const name = `${accent ? `${ACCENT_NAME[accent]} ` : ''}${gradeWord(type, grade)} ${EQUIP_LABEL[type]}`
  return { id, type, grade, accent, name, inputs }
}

// --- What a piece does (D104) -------------------------------------------------------------------------------------------

/** A weapon's Might per grade, added to the offense of hits made with that weapon. */
export const MIGHT_PER_GRADE = 4
/** Physical armor's Barrier per grade at the start of each fight; magical armor's Regen per grade each round. */
export const BARRIER_PER_GRADE = 5
export const REGEN_PER_GRADE = 1
export const accentPoints = (grade: number): number => Math.ceil(grade / 2)

/** An armor piece's stat points: its defense (DEF physical, M.DEF magical) and its accent. Weapons and Orbs give none. */
export function gearPoints(piece: GearPiece): Points {
  const p = noPoints()
  if (isWeapon(piece.type) || isOrb(piece.type)) return p
  if (isMagicalGear(piece.type)) p.mdef += piece.grade
  else p.def += piece.grade
  if (piece.accent) p[piece.accent] += accentPoints(piece.grade)
  return p
}
export const pieceOf = (equipped: Partial<Record<GearSlot, string>>, slot: GearSlot): GearPiece | undefined =>
  equipped[slot] ? gearById(equipped[slot]!) : undefined

/** The points of what she wears: her five armor slots (weapons add Might instead). */
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
/** Her Barrier at the start of a fight (physical armor) and Regen each round (magical armor). */
export function equippedGuard(equipped: Partial<Record<GearSlot, string>>): { barrier: number; regen: number } {
  let barrier = 0, regen = 0
  for (const slot of ARMOR_SLOTS) {
    const piece = pieceOf(equipped, slot)
    if (!piece || isOrb(piece.type)) continue
    if (isMagicalGear(piece.type)) regen += piece.grade * REGEN_PER_GRADE
    else barrier += piece.grade * BARRIER_PER_GRADE
  }
  return { barrier, regen }
}
/** The kind her equipped Orb adds to every hit, if she wears one. */
export function equippedOrb(equipped: Partial<Record<GearSlot, string>>): RpgDamageKind | undefined {
  const piece = pieceOf(equipped, 'accessory')
  return piece && isOrb(piece.type) ? orbKind(piece.type) : undefined
}

/** A piece's track, the line an Uma climbs one grade at a time (D119): its weapon, its armor kind, or for an Orb its own
 * type, so each of the ten Orbs climbs on its own. */
export const gearTrackOf = (type: EquipType): string => (isWeapon(type) || isOrb(type) ? type : armorKindOf(type))

/** A recipe's first family: every recipe family is a gathering family, so crafting raises Gathering & Crafting (§8.4). */
export const mainFamily = (type: EquipType): string => recipeFamilies(type)[0]!
