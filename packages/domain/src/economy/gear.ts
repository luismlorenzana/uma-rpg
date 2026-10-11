// Equipment (S7, design §7, D59): every piece is generated from the catalog as type × grade × accent. The main
// material sets what can be made, the accent material adds its family's effect, and the grade comes from the main
// material. Gear binds to the Uma who equips it; mastery rank k in its type lets her equip grade k.
import { ITEM_EFFECTS, ITEM_FAMILIES, type ItemEffect, type ItemFamily } from '../items/catalog'
import type { RpgWeapon } from '../rpg/kinds'
import { addPoints, noPoints, type Points } from './bonus'
import { ARMOR_TYPES, WEAPON_TYPES, type ArmorType, type GearType, type WeaponType } from './training'

export const ACCESSORY_TYPES = ['ring', 'charm'] as const
export type AccessoryType = typeof ACCESSORY_TYPES[number]
export type EquipType = GearType | AccessoryType
export const EQUIP_TYPES: readonly EquipType[] = [...WEAPON_TYPES, ...ARMOR_TYPES, ...ACCESSORY_TYPES]
export type GearSlot = WeaponType | 'armor' | 'accessory'

export const EQUIP_LABEL: Readonly<Record<EquipType, string>> = {
  'short-sword': 'Short Sword', bow: 'Bow', spear: 'Spear', axe: 'Axe', 'mage-staff': 'Mage Staff', 'arcane-staff': 'Arcane Staff', greatsword: 'Greatsword',
  'cleric-staff': 'Cleric Staff', 'summoner-tome': 'Summoner Tome', garb: 'Garb', leather: 'Leather Armor', mail: 'Mail', plate: 'Plate', ring: 'Ring', charm: 'Charm',
}

/** The main material's family for each type (§7.1). */
const MAIN: Readonly<Record<EquipType, string>> = {
  greatsword: 'ores', spear: 'ores', axe: 'ores', 'short-sword': 'ores', mail: 'ores', plate: 'ores',
  bow: 'woods', 'mage-staff': 'woods', 'arcane-staff': 'woods', 'cleric-staff': 'woods',
  garb: 'fibers', 'summoner-tome': 'fibers', leather: 'hides-scales', ring: 'crystals', charm: 'bones-horns',
}
const GATHER = ITEM_FAMILIES.filter((f) => f.side === 'gathering')
const familyOf = (id: string): ItemFamily => ITEM_FAMILIES.find((f) => f.id === id)!
const accentFamily = (effect: ItemEffect): ItemFamily => GATHER.find((f) => f.effect === effect)!

export const isArmor = (t: EquipType): t is ArmorType => (ARMOR_TYPES as readonly string[]).includes(t)
export const isAccessory = (t: EquipType): t is AccessoryType => (ACCESSORY_TYPES as readonly string[]).includes(t)
export const isWeapon = (t: EquipType): t is WeaponType => (WEAPON_TYPES as readonly string[]).includes(t)
export const slotOf = (t: EquipType): GearSlot => (isArmor(t) ? 'armor' : isAccessory(t) ? 'accessory' : t)

export interface GearPiece {
  /** `<type>-g<grade>-<accent>`, e.g. `greatsword-g3-atk`. */
  id: string
  type: EquipType
  grade: number
  accent: ItemEffect
  name: string
  /** Refined materials per piece. */
  inputs: Record<string, number>
}

const ACCENT_NAME: Readonly<Record<ItemEffect, string>> = {
  hp: 'Stalwart', mp: 'Wellspring', atk: 'Fierce', matk: 'Arcane', def: 'Bulwark', mdef: 'Warded', speed: 'Swift', limit: 'Valiant',
}

export const gearId = (type: EquipType, grade: number, accent: ItemEffect): string => `${type}-g${grade}-${accent}`

/** The piece an id names, or undefined. Pieces aren't stored as a list: any type × grade × accent exists. */
export function gearById(id: string): GearPiece | undefined {
  const m = /^([a-z-]+)-g(\d{1,2})-([a-z]+)$/.exec(id)
  if (!m) return undefined
  const type = m[1] as EquipType, grade = Number(m[2]), accent = m[3] as ItemEffect
  if (!EQUIP_TYPES.includes(type) || grade < 1 || grade > 10 || !ITEM_EFFECTS.includes(accent)) return undefined
  const main = familyOf(MAIN[type])
  const acc = accentFamily(accent)
  const inputs: Record<string, number> = {}
  const put = (id: string, n: number) => { inputs[id] = (inputs[id] ?? 0) + n }
  put(main.refined[grade - 1]!.id, 1)
  put(acc.refined[grade - 1]!.id, 1)
  // Extras, like a dish's sides: grade ⌈g/2⌉ of other gathering families, more at higher grades (parity, §8.5).
  const extras = grade <= 3 ? 0 : grade <= 7 ? 1 : 2
  const others = GATHER.filter((f) => f.id !== main.id && f.id !== acc.id)
  const start = (EQUIP_TYPES.indexOf(type) + ITEM_EFFECTS.indexOf(accent)) % others.length
  for (let k = 0; k < extras; k++) put(others[(start + 2 * k) % others.length]!.refined[Math.ceil(grade / 2) - 1]!.id, 1)
  return { id, type, grade, accent, name: `${ACCENT_NAME[accent]} ${main.raw[grade - 1]!.name.replace(/ (Ore|Log|Pelt|Hide|Bundle)$/, '')} ${EQUIP_LABEL[type]}`, inputs }
}

/**
 * A piece's stat points (§7.3): weapons give offense by grade (split across her build's weapons), armor gives defense
 * (heavier sturdier, lighter faster), accessories give only their accent, at double weight. Every accent adds ⌈g/2⌉.
 */
export function gearPoints(piece: GearPiece, weaponsInBuild = 1): Points {
  const p = noPoints()
  const g = piece.grade
  const accent = isAccessory(piece.type) ? g : Math.ceil(g / 2)
  p[piece.accent] += accent
  if (isWeapon(piece.type)) {
    const share = g / Math.max(1, weaponsInBuild)
    if (piece.type === 'short-sword') { p.atk += share / 2; p.matk += share / 2 }
    else if (['mage-staff', 'arcane-staff', 'cleric-staff', 'summoner-tome'].includes(piece.type)) p.matk += share
    else p.atk += share
  } else if (piece.type === 'garb') { p.def += g * 0.5; p.mdef += g * 0.5; p.speed += g * 0.5 }
  else if (piece.type === 'leather') { p.def += g * 0.75; p.mdef += g * 0.5; p.speed += g * 0.25 }
  else if (piece.type === 'mail') { p.def += g * 0.75; p.mdef += g * 0.75 }
  else if (piece.type === 'plate') { p.def += g * 1.25; p.mdef += g * 0.5; p.hp += g * 0.5 }
  return p
}

/** The points of what she wears for a build: its weapons' pieces, her armor and her accessory. */
export function equippedPoints(equipped: Partial<Record<GearSlot, string>>, buildWeapons: readonly RpgWeapon[]): Points {
  const pieces: Points[] = []
  for (const w of buildWeapons) {
    const piece = equipped[w as WeaponType] ? gearById(equipped[w as WeaponType]!) : undefined
    if (piece) pieces.push(gearPoints(piece, buildWeapons.length))
  }
  for (const slot of ['armor', 'accessory'] as const) {
    const piece = equipped[slot] ? gearById(equipped[slot]!) : undefined
    if (piece) pieces.push(gearPoints(piece))
  }
  return addPoints(...pieces)
}

/** Every main-material family is a gathering family, so crafting raises Gathering & Crafting (§8.4). */
export const mainFamily = (type: EquipType): string => MAIN[type]
