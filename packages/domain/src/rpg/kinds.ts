// RPG vocabulary (D86, docs/design/class-rework.md): ten weapons, ten damage kinds, five classes (six from classes v2,
// D179). Arms deal their own kind; a Tome deals its element. Every kind has one shape in every class: Greatsword and Fire
// hit one foe hard, Axe and Ice every foe, Lance and Lightning random foes, Bow and Light one foe many times, Katana and
// Dark twice.
import { BATTLE_ENGINE_VERSION, rpgV2 } from './battle/caps'
import type { BattleWeaknesses } from './battle/types'

/** Elements that can be weaknesses. Fire > Ice > Lightning > Fire; Light ↔ Dark. */
export const RPG_ELEMENTS = ['fire', 'ice', 'lightning', 'light', 'dark'] as const
export type RpgElement = typeof RPG_ELEMENTS[number]
/** Arms: the physical weapons, each its own weakness kind. */
export const RPG_WEAPON_KINDS = ['greatsword', 'axe', 'lance', 'bow', 'katana'] as const
export type RpgWeaponKind = typeof RPG_WEAPON_KINDS[number]
/** Tomes: the magic weapons, one per element. */
export const RPG_TOMES = ['tome-fire', 'tome-ice', 'tome-lightning', 'tome-light', 'tome-dark'] as const
export type RpgTome = typeof RPG_TOMES[number]
export const RPG_WEAPONS = [...RPG_WEAPON_KINDS, ...RPG_TOMES] as const
export type RpgWeapon = typeof RPG_WEAPONS[number]
/** The ten kinds a hit can carry and a foe can be weak to. */
export type RpgDamageKind = RpgWeaponKind | RpgElement
export const RPG_DAMAGE_KINDS: readonly RpgDamageKind[] = [...RPG_WEAPON_KINDS, ...RPG_ELEMENTS]
/** Every class of every generation (D179): classes v2 (engine v15) adds the Paladin, last, so no list's order moves. Ids,
 * trees, nodes and hero seats cover all six; what the game shows reads the live `RPG_CLASSES`. */
export const RPG_ALL_CLASSES = ['brawler', 'mage', 'spellblade', 'cleric', 'summoner', 'paladin'] as const
export type RpgClass = typeof RPG_ALL_CLASSES[number]
const RPG_V1_CLASSES: readonly RpgClass[] = RPG_ALL_CLASSES.filter((c) => c !== 'paladin')
/** The classes of an engine's generation: classes v1's five to v14, all six from v15 (D179). */
export function rpgClasses(engine: number = BATTLE_ENGINE_VERSION): readonly RpgClass[] {
  return rpgV2(engine) ? RPG_ALL_CLASSES : RPG_V1_CLASSES
}
/** The live classes: the five until the switch (H61), the six after. Every list, picker and parser reads this. */
export const RPG_CLASSES: readonly RpgClass[] = rpgClasses()
/** Classes v2's healers (C7, C8): at most one fights in a party. */
export const RPG_HEALERS: readonly RpgClass[] = ['paladin', 'cleric']
/** A healer of this generation: only from v15, since a v1 Cleric shares the support with the Summoner (D179). */
export const rpgIsHealer = (classId: RpgClass, engine: number = BATTLE_ENGINE_VERSION): boolean => rpgV2(engine) && RPG_HEALERS.includes(classId)
/** A class's tree for one weapon: `brawler-greatsword`, `mage-tome-fire`. */
export type RpgTreeId = `${RpgClass}-${RpgWeapon}`

export const isRpgWeaponKind = (kind: unknown): kind is RpgWeaponKind => RPG_WEAPON_KINDS.includes(kind as RpgWeaponKind)
export const isRpgElement = (kind: unknown): kind is RpgElement => RPG_ELEMENTS.includes(kind as RpgElement)
export const isRpgTome = (w: unknown): w is RpgTome => RPG_TOMES.includes(w as RpgTome)
export const isRpgWeapon = (w: unknown): w is RpgWeapon => RPG_WEAPONS.includes(w as RpgWeapon)
export const isRpgDamageKind = (k: unknown): k is RpgDamageKind => isRpgWeaponKind(k) || isRpgElement(k)
export const rpgPhysical = (kind: RpgDamageKind): boolean => isRpgWeaponKind(kind)
/** The kind a weapon deals: an Arm its own, a Tome its element. */
export const rpgWeaponKind = (w: RpgWeapon): RpgDamageKind => (isRpgTome(w) ? (w.slice('tome-'.length) as RpgElement) : w)
/** The Tome of an element. */
export const rpgTomeOf = (element: RpgElement): RpgTome => `tome-${element}` as RpgTome
/** Each Arm and the element that shares its shape (D86). */
export const RPG_KIND_PAIRS: readonly (readonly [RpgWeaponKind, RpgElement])[] = [
  ['greatsword', 'fire'], ['axe', 'ice'], ['lance', 'lightning'], ['bow', 'light'], ['katana', 'dark'],
]

/** The element a foe of this element is weak to. */
export function rpgElementWeakness(element: RpgElement): RpgElement {
  return ({ fire: 'lightning', ice: 'fire', lightning: 'ice', light: 'dark', dark: 'light' } as const)[element]
}
/** The element this one beats: Fire beats Ice, Ice beats Lightning, Lightning beats Fire. */
export function rpgElementBeats(element: 'fire' | 'ice' | 'lightning'): 'fire' | 'ice' | 'lightning' {
  return ({ fire: 'ice', ice: 'lightning', lightning: 'fire' } as const)[element]
}

// --- Twins (the Tier rework, CP5, D202; class-progression.md §4.1) ------------------------------------------------------

/** A twin set: an element and its twin Arm, named by the element, or Twilight (the Bow and the Katana, Light + Dark's). */
export type RpgTwinSet = RpgElement | 'twilight'
/** The six twin sets' kinds, Arm first. */
export const RPG_TWIN_SETS: Readonly<Record<RpgTwinSet, readonly RpgDamageKind[]>> = {
  fire: ['greatsword', 'fire'], ice: ['axe', 'ice'], lightning: ['lance', 'lightning'], light: ['bow', 'light'], dark: ['katana', 'dark'],
  twilight: ['bow', 'katana'],
}
/** The twin sets in order: the five elements' (the Rift's draws), then Twilight. */
export const RPG_TWIN_SET_IDS = Object.keys(RPG_TWIN_SETS) as readonly RpgTwinSet[]
/** An element's twin Arm, its partner in `RPG_KIND_PAIRS`: Fire's the Greatsword, Dark's the Katana. */
export const rpgTwinArm = (element: RpgElement): RpgWeaponKind => RPG_KIND_PAIRS.find(([, e]) => e === element)![0]
/** A kind's twin, its partner in `RPG_KIND_PAIRS` either way: the Greatsword's Fire, Lightning's Lance (R2's presets, SB10). */
export function rpgTwinKind(kind: RpgDamageKind): RpgDamageKind {
  const [arm, element] = RPG_KIND_PAIRS.find((pair) => pair.includes(kind as never))!
  return arm === kind ? element : arm
}
/** A twin set as a foe's weaknesses: its Arms and its element. */
export function rpgTwinWeaknesses(set: RpgTwinSet): BattleWeaknesses {
  return { weapons: RPG_TWIN_SETS[set].filter(isRpgWeaponKind), elements: RPG_TWIN_SETS[set].filter(isRpgElement) }
}
/** A foe's twins (v16, CP5): what beats her lead element (by slot, W3, as her `element`), or her second's when that is her
 * own, and its twin Arm; Light + Dark answer to no element, so Twilight. Never her own element. */
export function rpgTwinsOf(signature: readonly RpgElement[], slot: number): BattleWeaknesses {
  const n = signature.length
  const reads = n ? [signature[slot % n]!, ...(n > 1 ? [signature[(slot + 1) % n]!] : [])] : []
  const answer = reads.map(rpgElementWeakness).find((e) => !signature.includes(e))
  return rpgTwinWeaknesses(answer ?? 'twilight')
}
/** The twin sets a list of kinds answers (holds either kind of), in order; an Uma's `weapons` pass as they are. */
export function rpgAnsweredTwinSets(kinds: readonly (RpgDamageKind | RpgWeapon)[]): RpgTwinSet[] {
  const held = new Set<RpgDamageKind>(kinds.map((k) => (isRpgTome(k) ? rpgWeaponKind(k) : k)))
  return RPG_TWIN_SET_IDS.filter((set) => RPG_TWIN_SETS[set].some((k) => held.has(k)))
}

/** Statuses on foes (from allies) and on allies (from the Cleric and summons), plus the foes' own D265 statuses. */
export type RpgStatusKind =
  | 'burn' | 'enfeeble' | 'shock' | 'armor-break' | 'mind-break' | 'hex'
  | 'brave' | 'faith' | 'breaker' | 'aegis'
  | 'slow' | 'mark' | 'weaken' | 'ward' | 'power-up'
