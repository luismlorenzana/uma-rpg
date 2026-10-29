// Classes v3's class tree (D240; docs/design/classes-v3/classes-v3.md §1, §2, §7; engine v19, built dark in H126): three
// roots, five Tier 0 classes that promote at Class Rank 10 into eight Tier 1 classes, and the hybrids' two parents. Its
// tables are data the rules, the save and the screens share: parents and children, families, the suggested promotion,
// the Tier 0 ladder and skill, the display names by generation and the gates. In the main bundle (the save's rules and
// the profile read it); the trees themselves are the lazy catalog's.
import { BATTLE_ENGINE_VERSION, rpgRework } from './battle/caps'
import { rpgClasses, rpgIsTier0, type RpgClass, type RpgTier0Class, type RpgTier1Class } from './kinds'

// --- The tree (CV1, CV2, CV4) -------------------------------------------------------------------------------------------

/** The tree's three roots, left to right: labels with no id, rank or rules (CV2: the owner's Fighter root reads Warrior). */
export type RpgClassRoot = 'warrior' | 'all-rounder' | 'mage'
export const RPG_CLASS_ROOTS: readonly RpgClassRoot[] = ['warrior', 'all-rounder', 'mage']
export const RPG_ROOT_NAME: Readonly<Record<RpgClassRoot, string>> = { warrior: 'Warrior', 'all-rounder': 'All-Rounder', mage: 'Mage' }
/** Each Tier 0's root (its column). */
export const RPG_TIER0_ROOT: Readonly<Record<RpgTier0Class, RpgClassRoot>> = {
  recruit: 'warrior', duelist: 'all-rounder', acolyte: 'all-rounder', caller: 'all-rounder', apprentice: 'mage',
}
/** The eight Tier 1 classes in the tree's order, left to right (§1). */
export const RPG_TIER1_CLASSES: readonly RpgTier1Class[] = ['brawler', 'spellblade', 'armsummoner', 'paladin', 'cleric', 'summoner', 'tomeblade', 'mage']
/** Each Tier 0's children, in the promotion sheet's order (§2.6). */
export const RPG_CLASS_CHILDREN: Readonly<Record<RpgTier0Class, readonly RpgTier1Class[]>> = {
  recruit: ['brawler', 'spellblade', 'armsummoner'],
  duelist: ['spellblade', 'tomeblade'],
  acolyte: ['paladin', 'cleric'],
  caller: ['armsummoner', 'summoner'],
  apprentice: ['mage', 'tomeblade', 'summoner'],
}
/** Each Tier 1 class's parents, in its gate text's order ("Opens with Recruit R10 or Caller R10"): a hybrid has two, its
 * All-Rounder Tier 0 and its channel's root class (CV1). */
export const RPG_CLASS_PARENTS: Readonly<Record<RpgTier1Class, readonly RpgTier0Class[]>> = {
  brawler: ['recruit'],
  spellblade: ['recruit', 'duelist'],
  armsummoner: ['recruit', 'caller'],
  paladin: ['acolyte'],
  cleric: ['acolyte'],
  summoner: ['caller', 'apprentice'],
  tomeblade: ['duelist', 'apprentice'],
  mage: ['apprentice'],
}
/** A Tier 0's family: itself and its children (CV21: her Flourish works as any of them). */
export const rpgClassFamily = (tier0: RpgTier0Class): readonly RpgClass[] => [tier0, ...RPG_CLASS_CHILDREN[tier0]]
/** The child carrying the Suggested badge (CV11): Recruit the Brawler, Initiate the Sorcerer; for a two-way choice the
 * Arms child (or the Paladin) when her base Power beats her base Wit, else the Tome child (or the Cleric). */
export function rpgSuggestedPromotion(tier0: RpgTier0Class, stats: { power: number; wit: number }): RpgTier1Class {
  const arms = stats.power > stats.wit
  switch (tier0) {
    case 'recruit': return 'brawler'
    case 'apprentice': return 'mage'
    case 'duelist': return arms ? 'spellblade' : 'tomeblade'
    case 'caller': return arms ? 'armsummoner' : 'summoner'
    case 'acolyte': return arms ? 'paladin' : 'cleric'
  }
}

// --- Tier 0 (CV5–CV7) ---------------------------------------------------------------------------------------------------

/** The child whose defaults and preset form each Tier 0 takes (§2.4, §3.8): the Brawler's, the Sorcerer's, the Arms
 * Spellblade's, the Tome Summoner's, the Cleric's. Her armor's piece half is that child's too (the piece shown). */
export const RPG_TIER0_MODEL: Readonly<Record<RpgTier0Class, RpgTier1Class>> = {
  recruit: 'brawler', apprentice: 'mage', duelist: 'spellblade', caller: 'summoner', acolyte: 'cleric',
}
/** Each Tier 0's one skill (CV6): the same numbers for all five; a screen adds the weapon ("Drill Strike · Greatsword"). */
export const RPG_TIER0_SKILL: Readonly<Record<RpgTier0Class, string>> = {
  recruit: 'Drill Strike', apprentice: 'Primer', duelist: 'Feint', caller: 'Beckon', acolyte: 'Vigil',
}
/** §2.2's draft power by Class Rank 1–10: depth 1's first rank to depth 2's middle. */
const TIER0_POWER_DRAFT = [1.52, 1.6, 1.67, 1.75, 1.82, 1.9, 1.97, 2.05, 2.12, 2.2] as const
/** The one factor on the draft (classes-v3 §12's S1 knob, inside ×0.9–1.1): H131 (D249) set ×1 → ×1.05. At ×1 the five Tier
 * 0s on defaults took 1.07 rounds longer than v18's balance party on continent 1's boss stages (9.58 against 8.51, 32 seeds;
 * the target ±1); at ×1.05 0.83 longer (its fights 0.57, its sub-bosses −0.05, the capital's Finals 0.38), every win 100%. */
export const RPG_TIER0_POWER_FACTOR = 1.05
/** Her skill's power by Class Rank 1–10 (§2.2 × `RPG_TIER0_POWER_FACTOR`), in single-target units; no Skill Rank on top. */
export const RPG_TIER0_POWER: readonly number[] = TIER0_POWER_DRAFT.map((p) => Math.round(p * RPG_TIER0_POWER_FACTOR * 1000) / 1000)
/** Her skill's MP at every rank, before her hand (×1): depth 1's. */
export const RPG_TIER0_MP = 10
/** A Tier 0's top Class Rank: she promotes there (CV8). */
export const RPG_TIER0_MAX_RANK = 10
/** The EXP that waits on a Tier 0 past Rank 10 for her next promotion (CV8): what Class Ranks 10–50 take. Past it, Class
 * Marks at half rate. */
export const RPG_TIER0_BANK = 23_680
/** A Tier 0's EXP to her next Class Rank (CV5): twice today's curve, 2 × (120 + 16 × rank), so Rank r lands with Uma Lv r
 * (3,600 to Rank 10); none past Rank 10. */
export const rpgTier0ExpToNext = (rank: number): number => (rank >= 1 && rank < RPG_TIER0_MAX_RANK ? 2 * (120 + 16 * rank) : Infinity)
/** Her skill's power at a Class Rank (§2.2), Ranks past 10 at 10's. */
export const rpgTier0Power = (classRank: number): number => RPG_TIER0_POWER[Math.min(RPG_TIER0_MAX_RANK, Math.max(1, classRank)) - 1]!
/** A Tier 0's Prowess and armor's offense (CV7, CV18): a third a slot to its channel, in whole points, half up to ATK
 * (3 Arms all ATK, 2 Arms + 1 Tome two thirds, …). */
export function rpgThirdsSplit(points: number, armsSlots: number): { atk: number; matk: number } {
  const atk = Math.floor((2 * points * armsSlots + 3) / 6)
  return { atk, matk: points - atk }
}

// --- Names (CV3, CV4) ---------------------------------------------------------------------------------------------------

const NAME_V2: Readonly<Record<RpgClass, string>> = {
  brawler: 'Brawler', mage: 'Mage', spellblade: 'Spell Blade', cleric: 'Cleric', summoner: 'Summoner', paladin: 'Paladin',
  recruit: 'Recruit', duelist: 'Duelist', acolyte: 'Acolyte', caller: 'Caller', apprentice: 'Initiate',
  armsummoner: 'Arms Summoner', tomeblade: 'Tome Spellblade',
}
/** Classes v3's names (§0): today's Mage is the Sorcerer, the Spell Blade the Arms Spellblade, the Summoner the Tome
 * Summoner; ids stay. */
const NAME_V3: Readonly<Record<RpgClass, string>> = { ...NAME_V2, mage: 'Sorcerer', spellblade: 'Arms Spellblade', summoner: 'Tome Summoner' }
/** A class's player-facing name in an engine's generation: v3's from v19, today's before (a new class's row holds its v3
 * name, unreachable before v19). Every screen reads this; no screen shows a v3 name before H134. */
export const rpgClassName = (classId: RpgClass, engine: number = BATTLE_ENGINE_VERSION): string =>
  (rpgRework('classes', engine) ? NAME_V3 : NAME_V2)[classId]

// --- Gates (CV8–CV10) ---------------------------------------------------------------------------------------------------

/** What the gates read: her Class Ranks (`OwnedUma.ranks`; a class she has no EXP in is absent, at Rank 1). */
export interface RpgClassRanks { readonly classes: Readonly<Partial<Record<RpgClass, { readonly rank: number }>>> }
/** What the gates say. */
export const CLASS_NOT_HERE = 'No such class'
export const TIER0_TIER1_ONLY = 'Tier 0 is Tier 1’s'
const rankIn = (ranks: RpgClassRanks, classId: RpgClass): number => ranks.classes[classId]?.rank ?? 1
/** A Tier 1 class she holds in Tier 1's world (CV9 R5): one with a Class Rank track, always Rank 10 or more. */
export const rpgHoldsTier1 = (ranks: RpgClassRanks, classId: RpgTier1Class): boolean => (ranks.classes[classId]?.rank ?? 0) >= RPG_TIER0_MAX_RANK
/** A Tier 1 class's closed gate (CV9 R4): "Opens with Recruit R10 or Caller R10", her parents in the table's order. */
export const rpgClassClosedText = (classId: RpgTier1Class): string =>
  `Opens with ${RPG_CLASS_PARENTS[classId].map((p) => `${NAME_V3[p]} R${RPG_TIER0_MAX_RANK}`).join(' or ')}`
/** Her parent Tier 0 at Class Rank 10 she can promote into this Tier 1 class from, the first in the table's order, or null. */
export const rpgReadyParent = (ranks: RpgClassRanks, classId: RpgTier1Class): RpgTier0Class | null =>
  RPG_CLASS_PARENTS[classId].find((p) => rankIn(ranks, p) >= RPG_TIER0_MAX_RANK) ?? null

/**
 * Why she can't fight as a class now, or null (CV8–CV10). Before v19 every class of the generation is open. From v19, in
 * Tier 1's world every Tier 0 is open to every Uma and a Tier 1 class only once she holds it (promoted into, Rank 10 or
 * more): a child she can promote into now says "Promote from Recruit", any other its gate, "Opens with Recruit R10 or
 * Caller R10". In a Tier 2 or 3 world every Tier 1 class is open from Rank 1 and no Tier 0 exists.
 */
export function rpgClassGate(ranks: RpgClassRanks, classId: RpgClass, tier: number | string = 1,
  engine: number = BATTLE_ENGINE_VERSION): string | null {
  if (!rpgClasses(engine).includes(classId)) return CLASS_NOT_HERE
  if (!rpgRework('classes', engine)) return null
  const tierOne = Number(tier) === 1
  if (rpgIsTier0(classId)) return tierOne ? null : TIER0_TIER1_ONLY
  if (!tierOne || rpgHoldsTier1(ranks, classId)) return null
  const ready = rpgReadyParent(ranks, classId)
  return ready ? `Promote from ${NAME_V3[ready]}` : rpgClassClosedText(classId)
}
/** Whether she may fight as a class now (`rpgClassGate` is null). */
export const rpgClassOpen = (ranks: RpgClassRanks, classId: RpgClass, tier: number | string = 1, engine: number = BATTLE_ENGINE_VERSION): boolean =>
  rpgClassGate(ranks, classId, tier, engine) === null
