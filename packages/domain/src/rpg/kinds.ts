// RPG vocabulary (D86, docs/archive/design/class-rework.md): ten weapons, ten damage kinds, five classes (six from classes v2,
// D179; thirteen from Classes v3, engine v19, D240). Arms deal their own kind; a Tome deals its element. Every kind has one
// shape in every class: Greatsword and Fire hit one foe hard, Axe and Ice every foe, Lance and Lightning random foes, Bow
// and Light one foe many times, Katana and Dark twice. From engine v19 (CV12, CV13; H128) Katana and Light are a double
// and Bow and Dark a volley, so the twins re-pair to Katana–Light and Bow–Dark.
import { BATTLE_ENGINE_VERSION, RPG_REWORK_ENGINE, rpgRework, rpgV2 } from './battle/caps'
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
/** Classes v2's six (engine v15–v18, D179): the halls' classes, whose seats are the Limit Breaks' ids until Halls v2. */
export const RPG_V2_CLASSES = ['brawler', 'mage', 'spellblade', 'cleric', 'summoner', 'paladin'] as const
export type RpgV2Class = typeof RPG_V2_CLASSES[number]
/** Classes v3's Tier 0 (CV3, CV5–CV7; engine v19): five introductory classes, in the tree's order (Warrior's Recruit, the
 * All-Rounder's Duelist, Acolyte and Caller, the Mage's Initiate). Each promotes at Class Rank 10. */
export const RPG_TIER0_CLASSES = ['recruit', 'duelist', 'acolyte', 'caller', 'apprentice'] as const
export type RpgTier0Class = typeof RPG_TIER0_CLASSES[number]
/** Every class of every generation (D179): classes v2 (engine v15) adds the Paladin, last, and Classes v3 (engine v19, D240)
 * the five Tier 0 and its two new hybrids, the Arms Summoner and the Tome Spellblade, after her, so no list's order moves.
 * Ids, trees and nodes cover all thirteen; what the game shows reads the live `RPG_CLASSES`. */
export const RPG_ALL_CLASSES = [...RPG_V2_CLASSES, ...RPG_TIER0_CLASSES, 'armsummoner', 'tomeblade'] as const
export type RpgClass = typeof RPG_ALL_CLASSES[number]
/** Classes v3's Tier 1: the eight classes a Tier 0 promotes into (and every class of a Tier 2 or 3 world). */
export type RpgTier1Class = Exclude<RpgClass, RpgTier0Class>
const RPG_V1_CLASSES: readonly RpgClass[] = RPG_V2_CLASSES.filter((c) => c !== 'paladin')
/** Classes v3's thirteen in the tree's order (§1): the Tier 0 left to right, then the Tier 1 left to right (Brawler, Arms
 * Spellblade, Arms Summoner, Paladin, Cleric, Tome Summoner, Tome Spellblade, Sorcerer). */
const RPG_V3_CLASSES: readonly RpgClass[] = [...RPG_TIER0_CLASSES, 'brawler', 'spellblade', 'armsummoner', 'paladin', 'cleric', 'summoner', 'tomeblade', 'mage']
/** The classes of an engine's generation: classes v1's five to v14, classes v2's six v15–v18 (D179), Classes v3's thirteen
 * from v19 (D240). */
export function rpgClasses(engine: number = BATTLE_ENGINE_VERSION): readonly RpgClass[] {
  return rpgRework('classes', engine) ? RPG_V3_CLASSES : rpgV2(engine) ? RPG_V2_CLASSES : RPG_V1_CLASSES
}
/** The live classes: the five until the switch (H61), the six after; thirteen from H134. Every list, picker and parser
 * reads this. */
export const RPG_CLASSES: readonly RpgClass[] = rpgClasses()
/** A Tier 0 class (Classes v3, CV5): the ids exist in every generation's tables, the class only from engine v19. */
export const rpgIsTier0 = (classId: RpgClass): classId is RpgTier0Class => (RPG_TIER0_CLASSES as readonly RpgClass[]).includes(classId)
/** Classes v2's healers (C7, C8): at most one fights in a party. Classes v3 keeps them (CV22): a Tier 0 is no healer. */
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
/** An Arm and the element that shares its shape. */
export type RpgKindPair = readonly [RpgWeaponKind, RpgElement]
/** Each Arm and the element that shares its shape (D86), engines v6–v18: the Bow with Light, the Katana with Dark. */
export const RPG_KIND_PAIRS: readonly RpgKindPair[] = [
  ['greatsword', 'fire'], ['axe', 'ice'], ['lance', 'lightning'], ['bow', 'light'], ['katana', 'dark'],
]
/** Classes v3's pairs (CV12, CV13; engine v19, H128), in the elements' order: Katana and Light double, Bow and Dark volley. */
export const RPG_KIND_PAIRS_V19: readonly RpgKindPair[] = [
  ['greatsword', 'fire'], ['axe', 'ice'], ['lance', 'lightning'], ['katana', 'light'], ['bow', 'dark'],
]
/** The pairs of an engine's generation: v6–v18's, Classes v3's from v19. */
export const rpgKindPairs = (engine: number = BATTLE_ENGINE_VERSION): readonly RpgKindPair[] =>
  (rpgRework('classes', engine) ? RPG_KIND_PAIRS_V19 : RPG_KIND_PAIRS)

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
/** An engine's pairs as twin sets, the elements' in order, then Twilight (the Bow and the Katana either way). */
function twinSetsOf(pairs: readonly RpgKindPair[]): Readonly<Record<RpgTwinSet, readonly RpgDamageKind[]>> {
  const set = (e: RpgElement): readonly RpgDamageKind[] => [pairs.find(([, el]) => el === e)![0], e]
  return { fire: set('fire'), ice: set('ice'), lightning: set('lightning'), light: set('light'), dark: set('dark'), twilight: ['bow', 'katana'] }
}
const RPG_TWIN_SETS_V16 = twinSetsOf(RPG_KIND_PAIRS)
const RPG_TWIN_SETS_V19 = twinSetsOf(RPG_KIND_PAIRS_V19)
/** The six twin sets' kinds in an engine's generation, Arm first: v16–v18's Bow with Light and Katana with Dark, from v19
 * (CV13) the Katana with Light and the Bow with Dark. */
export const rpgTwinSets = (engine: number = BATTLE_ENGINE_VERSION): Readonly<Record<RpgTwinSet, readonly RpgDamageKind[]>> =>
  (rpgRework('classes', engine) ? RPG_TWIN_SETS_V19 : RPG_TWIN_SETS_V16)
/** The live generation's six twin sets' kinds, Arm first. */
export const RPG_TWIN_SETS: Readonly<Record<RpgTwinSet, readonly RpgDamageKind[]>> = rpgTwinSets()
/** The twin sets in order: the five elements' (the Rift's draws), then Twilight. */
export const RPG_TWIN_SET_IDS = Object.keys(RPG_TWIN_SETS) as readonly RpgTwinSet[]
/** An element's twin Arm, its partner in an engine's pairs: Fire's the Greatsword; Dark's the Katana to v18, the Bow from v19. */
export const rpgTwinArm = (element: RpgElement, engine: number = BATTLE_ENGINE_VERSION): RpgWeaponKind =>
  rpgKindPairs(engine).find(([, e]) => e === element)![0]
/** A kind's twin, its partner in an engine's pairs either way: the Greatsword's Fire, Lightning's Lance (R2's presets, SB10). */
export function rpgTwinKind(kind: RpgDamageKind, engine: number = BATTLE_ENGINE_VERSION): RpgDamageKind {
  const [arm, element] = rpgKindPairs(engine).find((pair) => pair.includes(kind as never))!
  return arm === kind ? element : arm
}
/** A twin set as a foe's weaknesses in an engine's generation: its Arms and its element. */
export function rpgTwinWeaknesses(set: RpgTwinSet, engine: number = BATTLE_ENGINE_VERSION): BattleWeaknesses {
  const kinds = rpgTwinSets(engine)[set]
  return { weapons: kinds.filter(isRpgWeaponKind), elements: kinds.filter(isRpgElement) }
}
/** A foe's twins (v16, CP5): what beats her lead element (by slot, W3, as her `element`), or her second's when that is her
 * own, and its twin Arm; Light + Dark answer to no element, so Twilight. Never her own element. Only engines v16–v17's
 * world and chapter foes read it (v18's dealer comes first), so it keeps v16's sets whatever the switch (H128). */
export function rpgTwinsOf(signature: readonly RpgElement[], slot: number): BattleWeaknesses {
  const n = signature.length
  const reads = n ? [signature[slot % n]!, ...(n > 1 ? [signature[(slot + 1) % n]!] : [])] : []
  const answer = reads.map(rpgElementWeakness).find((e) => !signature.includes(e))
  return rpgTwinWeaknesses(answer ?? 'twilight', RPG_REWORK_ENGINE.fight)
}
/** The twin sets a list of kinds answers (holds either kind of) in an engine's generation, in order; an Uma's `weapons`
 * pass as they are. */
export function rpgAnsweredTwinSets(kinds: readonly (RpgDamageKind | RpgWeapon)[], engine: number = BATTLE_ENGINE_VERSION): RpgTwinSet[] {
  const held = new Set<RpgDamageKind>(kinds.map((k) => (isRpgTome(k) ? rpgWeaponKind(k) : k)))
  const sets = rpgTwinSets(engine)
  return RPG_TWIN_SET_IDS.filter((set) => sets[set].some((k) => held.has(k)))
}

/** Statuses on foes (from allies) and on allies (from the Cleric and summons), plus the foes' own D265 statuses. */
export type RpgStatusKind =
  | 'burn' | 'enfeeble' | 'shock' | 'armor-break' | 'mind-break' | 'hex'
  | 'brave' | 'faith' | 'breaker' | 'aegis'
  | 'slow' | 'mark' | 'weaken' | 'ward' | 'power-up'
