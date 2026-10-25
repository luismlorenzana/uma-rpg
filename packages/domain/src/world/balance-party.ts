// The balance simulation's party (combat-balance.md §6.0): five average Umas built through the game's own rules, so the
// simulation measures the game as it is. "On curve" means what a player at her level would have: weapons, armor and
// accessories of the grade her ranks open, the Extra Stats nodes her level allows and an inherited Limit Break. Test
// support only: nothing in the game imports it.
import { BATTLE_ENGINE_VERSION, rpgRework, rpgV2 } from '../rpg/battle/caps'
import type { BattleAlly, BattleInput } from '../rpg/battle/types'
import type { RpgMapNode } from '../rpg/campaign/chapters'
import { rpgNode } from '../rpg/catalog'
import type { RpgDamageKind } from '../rpg/kinds'
import {
  learnRpgNode, projectRpgStats, rpgActiveSlots, rpgDefaultWeapons, rpgLearnBlock, rpgLearnedSkills, rpgProfileTrees,
  type RpgClass, type RpgNodeRef, type RpgProfile,
} from '../rpg/rules'
import { applyPoints, addPoints, noPoints } from '../economy/bonus'
import { starPoints } from '../economy/stars'
import { equippedAccessories, equippedMight, equippedPoints } from '../economy/gear'
import { accessoryFightFields, type GearSlot } from '../economy/gear-id'
import { ARMOR_SLOT_KINDS, ARMOR_SLOTS } from '../economy/ranks'
import type { ItemEffect } from '../items/kinds'

export const BALANCE_PARTY: readonly RpgClass[] = ['brawler', 'mage', 'spellblade', 'cleric', 'summoner']

/** The grade her ranks open by her level: a rank is reached by Lv 5k − 4 (D102), and the Forge makes grade k from Craft
 * Level 5k − 4, so the two keep pace. */
export const onCurveGrade = (level: number): number => Math.min(10, Math.floor((level + 4) / 5))

/** Each class's armor halves (physical or magical) and its two accessories: what an average player would choose. */
export interface BalanceKit { magical: readonly boolean[]; accessories: readonly string[]; stats: readonly ItemEffect[] }
const KIT: Readonly<Record<RpgClass, BalanceKit>> = {
  brawler: { magical: [false, false, false, false, false], accessories: ['talisman-vampire', 'talisman-iron'], stats: ['atk', 'hp', 'def', 'mdef'] },
  mage: { magical: [true, true, true, true, true], accessories: ['amulet-siphon', 'amulet-ward'], stats: ['matk', 'hp', 'mdef', 'def'] },
  spellblade: { magical: [false, false, false, true, true], accessories: ['talisman-vampire', 'amulet-spring'], stats: ['atk', 'matk', 'hp', 'def'] },
  cleric: { magical: [true, true, true, true, true], accessories: ['amulet-spring', 'talisman-vital'], stats: ['matk', 'hp', 'mdef', 'def'] },
  summoner: { magical: [true, true, true, true, true], accessories: ['amulet-spring', 'amulet-veil'], stats: ['matk', 'hp', 'def', 'mdef'] },
  // Classes v2's Paladin (D179): no v1 fight has her; her v2 kit is below.
  paladin: { magical: [false, false, false, false, false], accessories: ['talisman-thorn', 'talisman-vital'], stats: ['atk', 'hp', 'def', 'mdef'] },
}
const PHYSICAL: readonly boolean[] = [false, false, false, false, false]
const MAGICAL: readonly boolean[] = [true, true, true, true, true]
/**
 * Classes v2's kits (H60): her class's armor in all five slots (§3) and her standard preset's accessories (H57, D182), an
 * Orb in the Damage slot (her spread's first weapon's kind) and a support in the Support slot. Extra Stats as v1's (the
 * Paladin's ATK, HP, DEF and M.DEF). `classPreset(c, 15)` must agree: `rift/balance-v15.test.ts` checks it.
 */
export const BALANCE_KIT_V2: Readonly<Record<RpgClass, BalanceKit>> = {
  brawler: { ...KIT.brawler, magical: PHYSICAL, accessories: ['orb-greatsword', 'talisman-vampire'] },
  mage: { ...KIT.mage, magical: MAGICAL, accessories: ['orb-fire', 'amulet-siphon'] },
  spellblade: { ...KIT.spellblade, magical: PHYSICAL, accessories: ['orb-greatsword', 'talisman-vampire'] },
  cleric: { ...KIT.cleric, magical: MAGICAL, accessories: ['orb-light', 'amulet-spring'] },
  summoner: { ...KIT.summoner, magical: MAGICAL, accessories: ['orb-fire', 'amulet-siphon'] },
  paladin: { ...KIT.paladin, magical: PHYSICAL, accessories: ['orb-greatsword', 'talisman-thorn'] },
}
const kitOf = (classId: RpgClass, engine: number): BalanceKit => (rpgV2(engine) ? BALANCE_KIT_V2 : KIT)[classId]

/** Her active Extra Stats nodes: the moons her level and the gem grades allow, the best first, across her kit's stats. */
export function onCurveStars(classId: RpgClass, level: number, engine: number = BATTLE_ENGINE_VERSION): string[] {
  const grade = onCurveGrade(level)
  const slots = 5 + Math.floor(level / 2)
  const stats = kitOf(classId, engine).stats
  const nodes: string[] = []
  for (let g = grade; g >= 1 && nodes.length < slots; g--) for (const stat of stats) if (nodes.length < slots) nodes.push(`moon:${stat}:${g}`)
  return nodes
}

/** `tier` (default 1) builds her in that tier at `level`, her tier level (H45): her stats are her lifetime level's, while her
 * grade, Extra Stats, slots and Bond read the tier level, as a player's restart at Ascend. `engine` (default the live one)
 * builds her in that engine's class generation (H60): from v15 her v2 spread, leans and HP, the v2 kit, her Orb's offense
 * on its kind's Might and no `orbs`, and her class's first seat in the v15 halls. `support` replaces her kit's second
 * accessory (v2: the Support slot) with that type, or empties it with null (H60's support-accessory rule). */
export interface BalanceOptions {
  gear?: boolean; stars?: boolean; heroes?: boolean; classRank?: number; tier?: number; engine?: number; support?: string | null
}

/** An average outfit of a class at a level: side skills learned deepest first, the deepest skills equipped one weapon at a
 * time, and, on curve, her gear, Extra Stats and an inherited Limit Break. From v16 (H65) the Tier rework's Uma: her three
 * default weapons, no side skills, every tree on line A, her held skills and v16's slots (seven by Lv 40); her Class Rank
 * is her level unless `classRank` says otherwise (the real pace is H71's). */
export function balanceMember(classId: RpgClass, i: number, level: number, options: BalanceOptions = {}): BattleAlly {
  const tier = options.tier ?? 1
  const engine = options.engine ?? BATTLE_ENGINE_VERSION
  const v2 = rpgV2(engine)
  let profile: RpgProfile = { outfitId: `${100 + i}`, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
    growthRates: { speed: 0.1, stamina: 0.1, power: 0.1, guts: 0, wit: 0 }, classId, weapons: rpgDefaultWeapons(classId, engine), tier, level, exp: 0,
    tree: [], legacy: [], classRank: options.classRank ?? level }
  // To v15 she learns the A side at every depth while her points last; from v16 nothing is learned (CP14).
  if (!rpgRework('fight', engine)) {
    for (let d = 5; d >= 1; d--) for (const tree of rpgProfileTrees(profile)) if (!rpgLearnBlock(profile, `${tree}.${d}a`)) profile = learnRpgNode(profile, `${tree}.${d}a`)
  }
  const known = rpgLearnedSkills(profile, engine).sort((a, b) => rpgNode(b.id)!.depth - rpgNode(a.id)!.depth)
  const slots = rpgActiveSlots(level, engine)
  const loadout: RpgNodeRef[] = []
  for (let pass = 0; pass < 5 && loadout.length < slots; pass++) {
    for (const w of profile.weapons) {
      const next = known.find((r) => rpgNode(r.id)!.weapon === w && !loadout.some((x) => x.id === r.id))
      if (next && loadout.length < slots) loadout.push(next)
    }
  }
  const grade = onCurveGrade(level)
  const kit = kitOf(classId, engine)
  const equipped: Partial<Record<GearSlot, string>> = {}
  if (options.gear) {
    for (const w of profile.weapons) equipped[w] = `${w}-g${grade}`
    ARMOR_SLOTS.forEach((slot, k) => { equipped[slot] = `${ARMOR_SLOT_KINDS[slot][kit.magical[k] ? 1 : 0]}-g${grade}` })
    const accessories = options.support === undefined ? kit.accessories : [kit.accessories[0]!, options.support]
    accessories.forEach((type, k) => { if (type) equipped[`accessory-${k + 1}` as GearSlot] = `${type}-g${grade}` })
  }
  const points = addPoints(options.gear ? equippedPoints(equipped) : noPoints(), options.stars ? starPoints(onCurveStars(classId, level, engine)) : noPoints())
  const boosted = applyPoints(projectRpgStats(profile, engine), points)
  const a = equippedAccessories(equipped, engine)
  // v2 (C4): her Orb's offense joins her Might on its kind, as `rpgPartyAllies` adds it.
  const might: Partial<Record<RpgDamageKind, number>> = options.gear ? equippedMight(equipped, profile.weapons) : {}
  if (v2) for (const [k, n] of Object.entries(a.orbMight ?? {})) might[k as RpgDamageKind] = (might[k as RpgDamageKind] ?? 0) + n
  const effects = accessoryFightFields(a, boosted.stats.hp)
  // From Lv 5 she learns under her class's first Hero, her Bond growing with her level (a Learner bonds fully by about Lv 23).
  const bond = Math.min(10, Math.floor(level / 2.3))
  const inherits = options.heroes && level >= 5 ? [{ limit: `${classId}-1` as const, bond, from: `hero-${classId}` }] : undefined
  return { id: profile.outfitId, classId, weapons: profile.weapons, tier, level, stats: boosted.stats, tree: profile.tree, legacy: [],
    loadout, mp: boosted.stats.mp, classRank: profile.classRank, ...(Object.keys(might).length ? { might } : {}), ...effects,
    ...(!v2 && a.orbs.length ? { orbs: [...a.orbs] } : {}), ...(boosted.evasion > 0 ? { evasion: boosted.evasion } : {}),
    ...(boosted.limitStart > 0 ? { limitStart: boosted.limitStart } : {}), ...(inherits ? { inherits } : {}) }
}

export const balanceParty = (level: number, options: BalanceOptions = {}): BattleAlly[] =>
  BALANCE_PARTY.map((c, i) => balanceMember(c, i, level, options))

/** A stage's fight as the game starts it: the live engine (or `version`, H60), every wave. */
export const balanceStage = (node: RpgMapNode, seed: number, allies: BattleAlly[], version: BattleInput['version'] = BATTLE_ENGINE_VERSION): BattleInput =>
  ({ version, seed, allies, enemies: node.enemies, ...(node.waves?.length ? { waves: node.waves } : {}) })
