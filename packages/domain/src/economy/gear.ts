// Equipment (S7, design §7, D59, D86, D94): every piece is generated from the catalog as type × grade × accent. A recipe
// is four refined items of its grade, one from each of four gathering families, and Craft Level gates the grade (no
// token since D94): the Arms half (Ores, Stones, Woods, Hides & Scales) makes Arms and Arms Orbs, the Arcana half (Crystals,
// Fibers, Essences, Bones & Horns) Tomes and Elemental Orbs, and every armor and stat accessory takes two of each, so
// all eight families are consumed alike. Gear binds to the Uma who equips it; her Weapon, Armor or Accessory Level k lets
// her equip grade k (D70).
import { ITEM_FAMILIES, type ItemEffect, type ItemFamily } from '../items/catalog'
import { isRpgTome, type RpgDamageKind, type RpgWeapon } from '../rpg/kinds'
import { addPoints, noPoints, type Points } from './bonus'
import { WEAPON_TYPES } from './training'
import { EQUIP_LABEL, gearIdentity, isOrb, isWeapon, orbKind, type EquipType, type GearSlot } from './gear-id'
export * from './gear-id'

/** The two halves of the gathering families (D86), by flavor: blade, whetstone, haft, grip; focus, pages, ink, binding. */
const ARMS = ['ores', 'stones', 'woods', 'hides-scales'] as const
const ARCANA = ['crystals', 'fibers', 'essences', 'bones-horns'] as const
/** The four families each type takes, one refined item of each. */
export function recipeFamilies(type: EquipType): readonly string[] {
  if (isOrb(type)) return isRpgTome(`tome-${orbKind(type)}` as RpgWeapon) ? ARCANA : ARMS
  if ((WEAPON_TYPES as readonly string[]).includes(type)) return isRpgTome(type as RpgWeapon) ? ARCANA : ARMS
  return ({
    plate: ['ores', 'stones', 'essences', 'bones-horns'], mail: ['ores', 'hides-scales', 'crystals', 'essences'],
    leather: ['hides-scales', 'woods', 'fibers', 'bones-horns'], garb: ['woods', 'stones', 'fibers', 'crystals'],
    ring: ['crystals', 'essences', 'ores', 'stones'], charm: ['bones-horns', 'fibers', 'hides-scales', 'woods'],
  } as Record<string, readonly string[]>)[type]!
}
const familyOf = (id: string): ItemFamily => ITEM_FAMILIES.find((f) => f.id === id)!

export interface GearPiece {
  /** `<type>-g<grade>-<accent>`, e.g. `greatsword-g3-atk`. */
  id: string
  type: EquipType
  grade: number
  accent: ItemEffect
  name: string
  /** Refined materials, per piece. */
  inputs: Record<string, number>
}
const ACCENT_NAME: Readonly<Record<ItemEffect, string>> = {
  hp: 'Stalwart', mp: 'Wellspring', atk: 'Fierce', matk: 'Arcane', def: 'Bulwark', mdef: 'Warded', speed: 'Swift', limit: 'Valiant',
}
/** A grade's prefix from the first family's raw item: "Copper", "Oak". */
const gradeWord = (type: EquipType, grade: number): string =>
  familyOf(recipeFamilies(type)[0]!).raw[grade - 1]!.name.replace(/ (Ore|Log|Pelt|Hide|Scale|Bundle|Crystal|Shard|Fiber|Essence|Bone|Horn|Stone)$/, '')
/** The piece an id names, or undefined. Pieces aren't stored as a list: any type × grade × accent exists. */
export function gearById(id: string): GearPiece | undefined {
  const piece = gearIdentity(id)
  if (!piece) return undefined
  const { type, grade, accent } = piece
  const inputs: Record<string, number> = {}
  for (const family of recipeFamilies(type)) inputs[familyOf(family).refined[grade - 1]!.id] = 1
  return { id, type, grade, accent, name: `${ACCENT_NAME[accent]} ${gradeWord(type, grade)} ${EQUIP_LABEL[type]}`, inputs }
}

/**
 * A piece's stat points (§7.3): a weapon gives offense by grade, split across her five weapons (ATK for Arms, M.ATK for
 * Tomes); armor gives defense (heavier sturdier, lighter faster); a Ring or Charm only its accent, at double weight, and
 * an Orb its accent at normal weight (its kind is the rest of its worth). Every accent adds ⌈g/2⌉.
 */
export function gearPoints(piece: GearPiece, weaponsInBuild = 1): Points {
  const p = noPoints()
  const g = piece.grade
  p[piece.accent] += piece.type === 'ring' || piece.type === 'charm' ? g : Math.ceil(g / 2)
  if (isWeapon(piece.type)) {
    const share = g / Math.max(1, weaponsInBuild)
    if (isRpgTome(piece.type)) p.matk += share
    else p.atk += share
  } else if (piece.type === 'garb') { p.def += g * 0.5; p.mdef += g * 0.5; p.speed += g * 0.5 }
  else if (piece.type === 'leather') { p.def += g * 0.75; p.mdef += g * 0.5; p.speed += g * 0.25 }
  else if (piece.type === 'mail') { p.def += g * 0.75; p.mdef += g * 0.75 }
  else if (piece.type === 'plate') { p.def += g * 1.25; p.mdef += g * 0.5; p.hp += g * 0.5 }
  return p
}
/** The points of what she wears for a class: its five weapons' pieces, her armor and her accessory. */
export function equippedPoints(equipped: Partial<Record<GearSlot, string>>, weapons: readonly RpgWeapon[]): Points {
  const pieces: Points[] = []
  for (const w of weapons) {
    const piece = equipped[w] ? gearById(equipped[w]!) : undefined
    if (piece) pieces.push(gearPoints(piece, weapons.length))
  }
  for (const slot of ['armor', 'accessory'] as const) {
    const piece = equipped[slot] ? gearById(equipped[slot]!) : undefined
    if (piece) pieces.push(gearPoints(piece))
  }
  return addPoints(...pieces)
}
/** The kind her equipped Orb adds to every hit, if she wears one. */
export function equippedOrb(equipped: Partial<Record<GearSlot, string>>): RpgDamageKind | undefined {
  const piece = equipped.accessory ? gearById(equipped.accessory) : undefined
  return piece && isOrb(piece.type) ? orbKind(piece.type) : undefined
}

/** A recipe's first family: every recipe family is a gathering family, so crafting raises Gathering & Crafting (§8.4). */
export const mainFamily = (type: EquipType): string => recipeFamilies(type)[0]!
