// Equipment (S7, design §7, D59, D86): every piece is generated from the catalog as type × grade × accent. A recipe is
// four refined items of its grade, one from each of four gathering families, plus a Crafting Token of its accent's stat
// (D86): the Arms half (Ores, Stones, Woods, Hides & Scales) makes Arms and Arms Orbs, the Arcana half (Crystals,
// Fibers, Essences, Bones & Horns) Tomes and Elemental Orbs, and every armor and stat accessory takes two of each, so
// all eight families are consumed alike. Gear binds to the Uma who equips it; her Weapon, Armor or Accessory Level k lets
// her equip grade k (D70).
import { ITEM_EFFECTS, ITEM_FAMILIES, type ItemEffect, type ItemFamily } from '../items/catalog'
import { isRpgTome, RPG_DAMAGE_KINDS, type RpgDamageKind, type RpgWeapon } from '../rpg/kinds'
import { addPoints, noPoints, type Points } from './bonus'
import { craftTokenId, gradeBand, TOKEN_CLASS_NAME } from './tokens'
import { ARMOR_TYPES, GEAR_TYPE_LABEL, WEAPON_TYPES, weaponClasses, type ArmorType, type GearType, type Ranks, type WeaponType } from './training'

/** Orbs (D86): an accessory that adds its kind to every hit, for weaknesses only. */
export type OrbType = `orb-${RpgDamageKind}`
export const ORB_TYPES: readonly OrbType[] = RPG_DAMAGE_KINDS.map((k) => `orb-${k}` as OrbType)
export const ACCESSORY_TYPES = ['ring', 'charm', ...ORB_TYPES] as const
export type AccessoryType = 'ring' | 'charm' | OrbType
export type EquipType = GearType | AccessoryType
export const EQUIP_TYPES: readonly EquipType[] = [...WEAPON_TYPES, ...ARMOR_TYPES, ...ACCESSORY_TYPES]
export type GearSlot = WeaponType | 'armor' | 'accessory'
const KIND_NAME: Readonly<Record<RpgDamageKind, string>> = {
  greatsword: 'Greatsword', axe: 'Axe', lance: 'Lance', bow: 'Bow', katana: 'Katana', fire: 'Fire', ice: 'Ice', lightning: 'Lightning', light: 'Light', dark: 'Dark',
}
export const EQUIP_LABEL: Readonly<Record<EquipType, string>> = {
  ...GEAR_TYPE_LABEL, ring: 'Ring', charm: 'Charm',
  ...Object.fromEntries(RPG_DAMAGE_KINDS.map((k) => [`orb-${k}`, `${KIND_NAME[k]} Orb`])) as Record<OrbType, string>,
}
export const isOrb = (t: EquipType): t is OrbType => t.startsWith('orb-')
/** The kind an Orb adds to every hit. */
export const orbKind = (t: OrbType): RpgDamageKind => t.slice('orb-'.length) as RpgDamageKind

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
export const isArmor = (t: EquipType): t is ArmorType => (ARMOR_TYPES as readonly string[]).includes(t)
export const isAccessory = (t: EquipType): t is AccessoryType => (ACCESSORY_TYPES as readonly string[]).includes(t)
/** The grade of this type she may wear (D70): a weapon, the best Weapon Level among classes that wield it; armor,
 * her Armor Level; an accessory, her Accessory Level. */
export function gearLevel(ranks: Ranks, type: EquipType): number {
  if (isAccessory(type)) return ranks.accessory
  if (isArmor(type)) return ranks.armor
  return Math.max(...weaponClasses(type as WeaponType).map((c) => ranks.weapons[c]))
}
/** What raises that level, for messages: "Brawler Weapon Level", "Armor Level". */
export function gearLevelName(type: EquipType): string {
  if (isAccessory(type)) return 'Accessory Level'
  if (isArmor(type)) return 'Armor Level'
  return `${weaponClasses(type as WeaponType).map((c) => TOKEN_CLASS_NAME[c]).join(' or ')} Weapon Level`
}
export const isWeapon = (t: EquipType): t is WeaponType => (WEAPON_TYPES as readonly string[]).includes(t)
export const slotOf = (t: EquipType): GearSlot => (isArmor(t) ? 'armor' : isAccessory(t) ? 'accessory' : t)

export interface GearPiece {
  /** `<type>-g<grade>-<accent>`, e.g. `greatsword-g3-atk`. */
  id: string
  type: EquipType
  grade: number
  accent: ItemEffect
  name: string
  /** Refined materials and the Crafting Token, per piece. */
  inputs: Record<string, number>
}
const ACCENT_NAME: Readonly<Record<ItemEffect, string>> = {
  hp: 'Stalwart', mp: 'Wellspring', atk: 'Fierce', matk: 'Arcane', def: 'Bulwark', mdef: 'Warded', speed: 'Swift', limit: 'Valiant',
}
/** A grade's prefix from the first family's raw item: "Copper", "Oak". */
const gradeWord = (type: EquipType, grade: number): string =>
  familyOf(recipeFamilies(type)[0]!).raw[grade - 1]!.name.replace(/ (Ore|Log|Pelt|Hide|Scale|Bundle|Crystal|Shard|Fiber|Essence|Bone|Horn|Stone)$/, '')
export const gearId = (type: EquipType, grade: number, accent: ItemEffect): string => `${type}-g${grade}-${accent}`
/** The piece an id names, or undefined. Pieces aren't stored as a list: any type × grade × accent exists. */
export function gearById(id: string): GearPiece | undefined {
  const m = /^([a-z-]+)-g(\d{1,2})-([a-z]+)$/.exec(id)
  if (!m) return undefined
  const type = m[1] as EquipType, grade = Number(m[2]), accent = m[3] as ItemEffect
  if (!EQUIP_TYPES.includes(type) || grade < 1 || grade > 10 || !ITEM_EFFECTS.includes(accent)) return undefined
  const inputs: Record<string, number> = {}
  for (const family of recipeFamilies(type)) inputs[familyOf(family).refined[grade - 1]!.id] = 1
  // A Crafting Token of its accent's stat and its band, dropped by fights (D67).
  inputs[craftTokenId(accent, gradeBand(grade))] = 1
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
