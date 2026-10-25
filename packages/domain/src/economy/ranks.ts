// The ranks (docs/design/progression.md, D102): beside her Uma Level, each Uma has a Class Rank for every class (1–50), a
// Weapon Rank for each of the ten weapons, an Armor Rank for each of the ten armor kinds and an Accessory Rank for each of
// the four accessory kinds (1–10, D124). Winning fights fills them; past a max rank, EXP banks at half rate as Marks for
// the whole world. Nothing is trained and no token is spent.
import { rpgV2 } from '../rpg/battle/caps'
import { RPG_CLASSES, RPG_DAMAGE_KINDS, RPG_TOMES, RPG_WEAPONS, type RpgClass, type RpgDamageKind, type RpgWeapon } from '../rpg/kinds'
import { RPG_WEAPON_SLOTS } from '../rpg/rules'

export const CLASS_MAX_RANK = 50
export const GEAR_MAX_RANK = 10

/** The ten weapons are the ten gear weapon types (D86). */
export const WEAPON_TYPES = RPG_WEAPONS
export type WeaponType = RpgWeapon

/** The five armor slots, each holding its physical or its magical piece (D103, D124: feet replace the accessory). */
export const ARMOR_SLOTS = ['head', 'body', 'legs', 'arms', 'feet'] as const
export type ArmorSlot = typeof ARMOR_SLOTS[number]
export const ARMOR_SLOT_KINDS = {
  head: ['helm', 'circlet'], body: ['cuirass', 'robe'], legs: ['greaves', 'leggings'], arms: ['gauntlets', 'bracers'], feet: ['boots', 'slippers'],
} as const satisfies Record<ArmorSlot, readonly [string, string]>
export type ArmorKind = typeof ARMOR_SLOT_KINDS[ArmorSlot][number]
/** The ten armor kinds, each a wearable piece: physical first, then magical, slot by slot. */
export const ARMOR_KINDS: readonly ArmorKind[] = [
  ...ARMOR_SLOTS.map((s) => ARMOR_SLOT_KINDS[s][0]), ...ARMOR_SLOTS.map((s) => ARMOR_SLOT_KINDS[s][1]),
]
export const ARMOR_PIECES = ARMOR_KINDS
export type ArmorPiece = ArmorKind
export const isArmorKind = (v: unknown): v is ArmorKind => (ARMOR_KINDS as readonly unknown[]).includes(v)
export const armorSlotOf = (kind: ArmorKind): ArmorSlot => ARMOR_SLOTS.find((s) => (ARMOR_SLOT_KINDS[s] as readonly string[]).includes(kind))!
export const isMagicalArmor = (kind: ArmorKind): boolean => ARMOR_SLOT_KINDS[armorSlotOf(kind)][1] === kind
/** A slot's physical or magical piece. */
export const armorKindFor = (slot: ArmorSlot, half: 'physical' | 'magical'): ArmorKind => ARMOR_SLOT_KINDS[slot][half === 'magical' ? 1 : 0]
/** Each slot's defensive stat, +1 a grade on either of its pieces (D124). */
export const ARMOR_SLOT_STAT = { head: 'def', body: 'hp', legs: 'mp', arms: 'mdef', feet: 'speed' } as const satisfies Record<ArmorSlot, string>

/** Her two accessory slots (D124): any two different accessory types. Classes v2 (C10, H57) types them by the same keys,
 * so no save renames: `accessory-1` is the Damage slot (an Orb), `accessory-2` the Support slot (a Talisman or an Amulet). */
export const ACCESSORY_SLOTS = ['accessory-1', 'accessory-2'] as const
export type AccessorySlot = typeof ACCESSORY_SLOTS[number]
/** The four accessory kinds: offense (Orbs) and defense (Talismans, Amulets), physical and magical. */
export const ACCESSORY_KINDS = ['arms-orb', 'elemental-orb', 'talisman', 'amulet'] as const
export type AccessoryKind = typeof ACCESSORY_KINDS[number]
export const isAccessoryKind = (v: unknown): v is AccessoryKind => (ACCESSORY_KINDS as readonly unknown[]).includes(v)
export const isMagicalAccessory = (kind: AccessoryKind): boolean => kind === 'elemental-orb' || kind === 'amulet'
export { RPG_DAMAGE_KINDS }

export const WEAPON_LABEL: Readonly<Record<WeaponType, string>> = {
  greatsword: 'Greatsword', axe: 'Axe', lance: 'Lance', bow: 'Bow', katana: 'Katana',
  'tome-fire': 'Fire Tome', 'tome-ice': 'Blizzard Tome', 'tome-lightning': 'Thunder Tome', 'tome-light': 'Light Tome', 'tome-dark': 'Dark Tome',
}
export const ARMOR_LABEL: Readonly<Record<ArmorKind, string>> = {
  helm: 'Helm', cuirass: 'Cuirass', greaves: 'Greaves', gauntlets: 'Gauntlets', boots: 'Boots',
  circlet: 'Circlet', robe: 'Robe', leggings: 'Leggings', bracers: 'Bracers', slippers: 'Slippers',
}
export const ARMOR_SLOT_LABEL: Readonly<Record<ArmorSlot, string>> = { head: 'Head', body: 'Body', legs: 'Legs', arms: 'Arms', feet: 'Feet' }
export const ACCESSORY_LABEL: Readonly<Record<AccessoryKind, string>> = {
  'arms-orb': 'Arms Orb', 'elemental-orb': 'Elemental Orb', talisman: 'Talisman', amulet: 'Amulet',
}
/** The live generation's slot names: "Accessory 1" and "Accessory 2", or classes v2's "Damage" and "Support" (H57). */
export const ACCESSORY_SLOT_LABEL: Readonly<Record<AccessorySlot, string>> = rpgV2()
  ? { 'accessory-1': 'Damage', 'accessory-2': 'Support' } : { 'accessory-1': 'Accessory 1', 'accessory-2': 'Accessory 2' }

// --- Tracks and curves ------------------------------------------------------------------------------------------------

export interface RankTrack { rank: number; exp: number }
/** Her ranks, sparse: a class, weapon, armor or accessory kind she hasn't earned EXP in yet is absent and stands at rank 1. */
export interface Ranks {
  classes: Partial<Record<RpgClass, RankTrack>>
  weapons?: Partial<Record<WeaponType, RankTrack>>
  armors?: Partial<Record<ArmorKind, RankTrack>>
  accessories?: Partial<Record<AccessoryKind, RankTrack>>
}
export const newRanks = (): Ranks => ({ classes: {}, weapons: {}, armors: {}, accessories: {} })
const FRESH: RankTrack = { rank: 1, exp: 0 }

export type RankKind = 'class' | 'weapon' | 'armor' | 'accessory'
/** What a track is: a class, a weapon, an armor kind or an accessory kind. */
export type RankRef = { kind: 'class'; id: RpgClass } | { kind: 'weapon'; id: WeaponType } | { kind: 'armor'; id: ArmorKind }
  | { kind: 'accessory'; id: AccessoryKind }

export const classTrack = (ranks: Ranks, id: RpgClass): RankTrack => ranks.classes[id] ?? FRESH
export const weaponTrack = (ranks: Ranks, id: WeaponType): RankTrack => ranks.weapons?.[id] ?? FRESH
export const armorTrack = (ranks: Ranks, id: ArmorKind): RankTrack => ranks.armors?.[id] ?? FRESH
export const accessoryTrack = (ranks: Ranks, id: AccessoryKind): RankTrack => ranks.accessories?.[id] ?? FRESH
export function trackOf(ranks: Ranks, ref: RankRef): RankTrack {
  return ref.kind === 'class' ? classTrack(ranks, ref.id) : ref.kind === 'weapon' ? weaponTrack(ranks, ref.id)
    : ref.kind === 'armor' ? armorTrack(ranks, ref.id) : accessoryTrack(ranks, ref.id)
}
export const classRankOf = (ranks: Ranks, id: RpgClass): number => classTrack(ranks, id).rank

/** The Uma's EXP curve (120 + 16 × level), which every rank curve is cut from. */
const umaToNext = (level: number): number => 120 + 16 * level
/** Class rank r → r + 1 takes what Uma Lv r takes: a class played all the way maxes with two classes' worth of a campaign. */
export const classExpToNext = (rank: number): number => (rank >= 1 && rank < CLASS_MAX_RANK ? umaToNext(rank) : Infinity)
/** Weapon or Armor Rank k → k + 1 takes what Uma Lv 5k − 4 to 5k + 1 takes: a weapon used every fight reaches rank k when
 * she reaches Lv 5k − 4, and rank 10 at Lv 46. 840 EXP from rank 1 to 2, 21,960 to rank 10. */
export function gearExpToNext(rank: number): number {
  if (rank < 1 || rank >= GEAR_MAX_RANK) return Infinity
  let total = 0
  for (let l = 5 * rank - 4; l <= 5 * rank; l++) total += umaToNext(l)
  return total
}
export const maxRankOf = (kind: RankKind): number => (kind === 'class' ? CLASS_MAX_RANK : GEAR_MAX_RANK)
export const expToNextOf = (kind: RankKind, rank: number): number => (kind === 'class' ? classExpToNext(rank) : gearExpToNext(rank))

/** Adds EXP to a track: ranks up, and returns what passed the max rank (it becomes Marks). */
export function grantTrack(track: RankTrack, kind: RankKind, amount: number): { track: RankTrack; ranksUp: number; overflow: number } {
  const max = maxRankOf(kind)
  let { rank } = track
  let exp = track.exp + Math.max(0, Math.floor(amount))
  if (rank >= max) return { track: { rank, exp: 0 }, ranksUp: 0, overflow: exp }
  let ranksUp = 0
  while (rank < max && exp >= expToNextOf(kind, rank)) {
    exp -= expToNextOf(kind, rank)
    rank += 1
    ranksUp += 1
  }
  const overflow = rank >= max ? exp : 0
  return { track: { rank, exp: rank >= max ? 0 : exp }, ranksUp, overflow }
}

/** Sets a track in her ranks (a fresh rank-1 track is dropped, keeping the save small). */
export function withTrack(ranks: Ranks, ref: RankRef, track: RankTrack): Ranks {
  const fresh = track.rank === 1 && track.exp === 0
  const set = <K extends string>(map: Partial<Record<K, RankTrack>>, id: K): Partial<Record<K, RankTrack>> => {
    const next = { ...map }
    if (fresh) delete next[id]
    else next[id] = track
    return next
  }
  if (ref.kind === 'class') return { ...ranks, classes: set(ranks.classes, ref.id) }
  if (ref.kind === 'weapon') return { ...ranks, weapons: set(ranks.weapons ?? {}, ref.id) }
  if (ref.kind === 'armor') return { ...ranks, armors: set(ranks.armors ?? {}, ref.id) }
  return { ...ranks, accessories: set(ranks.accessories ?? {}, ref.id) }
}

// --- EXP per win and Marks (D102) ---------------------------------------------------------------------------------------

/** For each win worth `E` Uma EXP: her class earns 2E, her weapons share E a weapon (a weapon she used counts double), each
 * of her five armor kinds earns E, and each accessory she wears earns E for its kind (D124). */
export const CLASS_EXP_SHARE = 2
/** E a weapon she fights with (H64, D200): five weapons share today's 5E, three from v16 share 3E, so each weapon's rank
 * keeps today's pace. */
export const WEAPON_EXP_PER_WEAPON = 1
/** Her weapons' total in the live generation, E a weapon: 5E until H72 turns on three weapons. The manual prints it. */
export const WEAPON_EXP_SHARE = WEAPON_EXP_PER_WEAPON * RPG_WEAPON_SLOTS
export const ARMOR_EXP_SHARE = 1
export const ACCESSORY_EXP_SHARE = 1
/** EXP past a max rank banks at half rate as Marks. */
export const MARKS_SHARE = 0.5
/** A Manual: Marks spent for EXP on one track of one Uma, one for one. */
export const MANUAL_EXP = 1000
export const MANUAL_PRICE = 1000

/** Weapon EXP for one win: E a weapon she fights with, shared over her weapons, two parts for each one she used and one for
 * the rest (H64, D200): five weapons share today's 5E exactly, three share 3E. */
export function weaponExpShares(weapons: readonly WeaponType[], used: ReadonlySet<WeaponType>, exp: number): Partial<Record<WeaponType, number>> {
  const parts = weapons.reduce((n, w) => n + (used.has(w) ? 2 : 1), 0)
  const out: Partial<Record<WeaponType, number>> = {}
  if (!parts) return out
  const total = WEAPON_EXP_PER_WEAPON * weapons.length
  for (const w of weapons) out[w] = Math.round((total * exp * (used.has(w) ? 2 : 1)) / parts)
  return out
}

export const RANK_LABEL: Readonly<Record<RankKind, string>> = { class: 'Class Rank', weapon: 'Weapon Rank', armor: 'Armor Rank', accessory: 'Accessory Rank' }
export const isRankClass = (v: unknown): v is RpgClass => (RPG_CLASSES as readonly unknown[]).includes(v)
