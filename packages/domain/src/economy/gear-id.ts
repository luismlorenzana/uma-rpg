// Equipment identity and wear gates for strict saves; names and crafting recipes remain lazy in gear.ts (H16).
// D124: forty types, every one by grade only (`lance-g3`, `helm-g3`, `talisman-vital-g3`): ten weapons, ten armor pieces
// (five slots, physical or magical) and twenty accessories (five Arms Orbs, five Elemental Orbs, five Talismans, five
// Amulets). A weapon is worn up to its Weapon Rank, armor up to its Armor Rank, an accessory up to its kind's Accessory Rank.
import { RPG_DAMAGE_KINDS, type RpgDamageKind } from '../rpg/kinds'
import {
  accessoryTrack, ACCESSORY_LABEL, ACCESSORY_SLOTS, ARMOR_LABEL, ARMOR_PIECES, ARMOR_SLOTS, armorSlotOf, armorTrack, WEAPON_LABEL, WEAPON_TYPES,
  weaponTrack, type AccessoryKind, type AccessorySlot, type ArmorPiece, type ArmorSlot, type Ranks, type WeaponType,
} from './ranks'

/** Orbs (D86): offensive accessories, adding their kind to every hit for weaknesses only. */
export type OrbType = `orb-${RpgDamageKind}`
export const ORB_TYPES: readonly OrbType[] = RPG_DAMAGE_KINDS.map((k) => `orb-${k}` as OrbType)
/** Talismans and Amulets (D124): defensive accessories, physical and magical. */
export const TALISMAN_EFFECTS = ['vital', 'vampire', 'bulwark', 'iron', 'thorn'] as const
export const AMULET_EFFECTS = ['spring', 'siphon', 'veil', 'ward', 'mirror'] as const
export type TalismanEffect = typeof TALISMAN_EFFECTS[number]
export type AmuletEffect = typeof AMULET_EFFECTS[number]
export type TalismanType = `talisman-${TalismanEffect}`
export type AmuletType = `amulet-${AmuletEffect}`
export const TALISMAN_TYPES: readonly TalismanType[] = TALISMAN_EFFECTS.map((e) => `talisman-${e}` as TalismanType)
export const AMULET_TYPES: readonly AmuletType[] = AMULET_EFFECTS.map((e) => `amulet-${e}` as AmuletType)
export type AccessoryType = OrbType | TalismanType | AmuletType
export const ACCESSORY_TYPES: readonly AccessoryType[] = [...ORB_TYPES, ...TALISMAN_TYPES, ...AMULET_TYPES]

export type EquipType = WeaponType | ArmorPiece | AccessoryType
export const EQUIP_TYPES: readonly EquipType[] = [...WEAPON_TYPES, ...ARMOR_PIECES, ...ACCESSORY_TYPES]
/** Where a piece goes: a weapon's own slot, one of the five armor slots, or one of the two accessory slots. */
export type GearSlot = WeaponType | ArmorSlot | AccessorySlot
export const GEAR_SLOTS: readonly GearSlot[] = [...WEAPON_TYPES, ...ARMOR_SLOTS, ...ACCESSORY_SLOTS]
const KIND_NAME: Readonly<Record<RpgDamageKind, string>> = {
  greatsword: 'Greatsword', axe: 'Axe', lance: 'Lance', bow: 'Bow', katana: 'Katana', fire: 'Fire', ice: 'Ice', lightning: 'Lightning', light: 'Light', dark: 'Dark',
}
const cap = (w: string) => w[0]!.toUpperCase() + w.slice(1)
export const EQUIP_LABEL: Readonly<Record<EquipType, string>> = {
  ...WEAPON_LABEL, ...Object.fromEntries(ARMOR_PIECES.map((p) => [p, ARMOR_LABEL[p]])) as Record<ArmorPiece, string>,
  ...Object.fromEntries(RPG_DAMAGE_KINDS.map((k) => [`orb-${k}`, `${KIND_NAME[k]} Orb`])) as Record<OrbType, string>,
  ...Object.fromEntries(TALISMAN_EFFECTS.map((e) => [`talisman-${e}`, `${cap(e)} Talisman`])) as Record<TalismanType, string>,
  ...Object.fromEntries(AMULET_EFFECTS.map((e) => [`amulet-${e}`, `${cap(e)} Amulet`])) as Record<AmuletType, string>,
}
export const isOrb = (t: EquipType): t is OrbType => t.startsWith('orb-')
export const orbKind = (t: OrbType): RpgDamageKind => t.slice('orb-'.length) as RpgDamageKind
export const isTalisman = (t: EquipType): t is TalismanType => t.startsWith('talisman-')
export const isAmulet = (t: EquipType): t is AmuletType => t.startsWith('amulet-')
export const isAccessory = (t: EquipType): t is AccessoryType => isOrb(t) || isTalisman(t) || isAmulet(t)
export const isArmor = (t: EquipType): t is ArmorPiece => (ARMOR_PIECES as readonly string[]).includes(t)
export const isWeapon = (t: EquipType): t is WeaponType => (WEAPON_TYPES as readonly string[]).includes(t)
export const isAccessorySlot = (s: GearSlot): s is AccessorySlot => (ACCESSORY_SLOTS as readonly string[]).includes(s)
/** A Talisman's or Amulet's effect: `talisman-vital` → `vital`. */
export const charmEffect = (t: TalismanType | AmuletType): TalismanEffect | AmuletEffect =>
  t.slice(t.indexOf('-') + 1) as TalismanEffect | AmuletEffect
/** An accessory's kind: an element's Orb is Elemental, a weapon kind's an Arms Orb; Talismans and Amulets are their own. */
export function accessoryKindOf(t: AccessoryType): AccessoryKind {
  if (isTalisman(t)) return 'talisman'
  if (isAmulet(t)) return 'amulet'
  return (['fire', 'ice', 'lightning', 'light', 'dark'] as readonly string[]).includes(orbKind(t)) ? 'elemental-orb' : 'arms-orb'
}
/** Where a weapon or armor piece goes; accessories go in either accessory slot, so they have none of their own. */
export const slotOf = (t: WeaponType | ArmorPiece): WeaponType | ArmorSlot => (isWeapon(t) ? t : armorSlotOf(t))

/** The grade of this type she may wear: her Weapon Rank, Armor Rank or Accessory Rank for it (D102, D124). */
export function gearLevel(ranks: Ranks, type: EquipType): number {
  if (isWeapon(type)) return weaponTrack(ranks, type).rank
  if (isArmor(type)) return armorTrack(ranks, type).rank
  return accessoryTrack(ranks, accessoryKindOf(type)).rank
}
/** What raises that level, for messages: "Lance Rank", "Robe Rank", "Talisman Rank". */
export function gearLevelName(type: EquipType): string {
  if (isWeapon(type)) return `${WEAPON_LABEL[type]} Rank`
  if (isArmor(type)) return `${ARMOR_LABEL[type]} Rank`
  return `${ACCESSORY_LABEL[accessoryKindOf(type)]} Rank`
}

export const gearId = (type: EquipType, grade: number): string => `${type}-g${grade}`
export interface GearIdentity { id: string; type: EquipType; grade: number }
export function gearIdentity(id: string): GearIdentity | undefined {
  const m = /^([a-z-]+?)-g(\d{1,2})$/.exec(id)
  if (!m) return undefined
  const type = m[1] as EquipType, grade = Number(m[2])
  if (!EQUIP_TYPES.includes(type) || grade < 1 || grade > 10) return undefined
  return { id, type, grade }
}

/** What her accessories do in a fight (D124): Orb kinds, and every defensive effect summed; absent effects are 0. Here,
 * not in gear.ts, so a fight can be built without the recipes. Every effect is per mille except `mpRegen` (MP a round);
 * `regen`, `barrier` and `veil` are shares of her max HP (D141), made into HP by `accessoryFightFields`. */
export interface AccessoryEffects {
  orbs: RpgDamageKind[]
  barrier: number; veil: number; regen: number; mpRegen: number; lifesteal: number; mpSteal: number
  guard: number; resist: number; thorns: number; mirror: number
}
export const noAccessoryEffects = (): AccessoryEffects =>
  ({ orbs: [], barrier: 0, veil: 0, regen: 0, mpRegen: 0, lifesteal: 0, mpSteal: 0, guard: 0, resist: 0, thorns: 0, mirror: 0 })
const OF_HP = ['barrier', 'veil', 'regen'] as const
const AS_IS = ['mpRegen', 'lifesteal', 'mpSteal', 'guard', 'resist', 'thorns', 'mirror'] as const
/** Her accessories' effects as a fight takes them, for her max HP: Barrier, Veil and Regen in HP, the rest as they are.
 * Only what's there: an absent effect is left out. */
export function accessoryFightFields(a: AccessoryEffects, maxHp: number): Partial<Record<typeof OF_HP[number] | typeof AS_IS[number], number>> {
  const out: Partial<Record<typeof OF_HP[number] | typeof AS_IS[number], number>> = {}
  for (const k of OF_HP) if (a[k] > 0) out[k] = Math.max(1, Math.round((maxHp * a[k]) / 1000))
  for (const k of AS_IS) if (a[k] > 0) out[k] = a[k]
  return out
}
