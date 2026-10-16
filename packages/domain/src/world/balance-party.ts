// The balance simulation's party (combat-balance.md §6.0): five average Umas built through the game's own rules, so the
// simulation measures the game as it is. "On curve" means what a player at her level would have: weapons, armor and
// accessories of the grade her ranks open, the Extra Stats nodes her level allows and an inherited Limit Break. Test
// support only: nothing in the game imports it.
import { BATTLE_ENGINE_VERSION } from '../rpg/battle/engine'
import type { BattleAlly, BattleInput } from '../rpg/battle/types'
import type { RpgMapNode } from '../rpg/campaign/chapters'
import { rpgNode } from '../rpg/catalog'
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
const KIT: Readonly<Record<RpgClass, { magical: readonly boolean[]; accessories: readonly string[]; stats: readonly ItemEffect[] }>> = {
  brawler: { magical: [false, false, false, false, false], accessories: ['talisman-vampire', 'talisman-iron'], stats: ['atk', 'hp', 'def', 'mdef'] },
  mage: { magical: [true, true, true, true, true], accessories: ['amulet-siphon', 'amulet-ward'], stats: ['matk', 'hp', 'mdef', 'def'] },
  spellblade: { magical: [false, false, false, true, true], accessories: ['talisman-vampire', 'amulet-spring'], stats: ['atk', 'matk', 'hp', 'def'] },
  cleric: { magical: [true, true, true, true, true], accessories: ['amulet-spring', 'talisman-vital'], stats: ['matk', 'hp', 'mdef', 'def'] },
  summoner: { magical: [true, true, true, true, true], accessories: ['amulet-spring', 'amulet-veil'], stats: ['matk', 'hp', 'def', 'mdef'] },
}

/** Her active Extra Stats nodes: the moons her level and the gem grades allow, the best first, across her kit's stats. */
export function onCurveStars(classId: RpgClass, level: number): string[] {
  const grade = onCurveGrade(level)
  const slots = 5 + Math.floor(level / 2)
  const stats = KIT[classId].stats
  const nodes: string[] = []
  for (let g = grade; g >= 1 && nodes.length < slots; g--) for (const stat of stats) if (nodes.length < slots) nodes.push(`moon:${stat}:${g}`)
  return nodes
}

export interface BalanceOptions { gear?: boolean; stars?: boolean; heroes?: boolean; classRank?: number }

/** An average outfit of a class at a level: side skills learned deepest first, the deepest skills equipped one weapon at a
 * time, and, on curve, her gear, Extra Stats and an inherited Limit Break. */
export function balanceMember(classId: RpgClass, i: number, level: number, options: BalanceOptions = {}): BattleAlly {
  let profile: RpgProfile = { outfitId: `${100 + i}`, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
    growthRates: { speed: 0.1, stamina: 0.1, power: 0.1, guts: 0, wit: 0 }, classId, weapons: rpgDefaultWeapons(classId), tier: 1, level, exp: 0,
    tree: [], legacy: [], classRank: options.classRank ?? level }
  for (let d = 5; d >= 1; d--) for (const tree of rpgProfileTrees(profile)) if (!rpgLearnBlock(profile, `${tree}.${d}a`)) profile = learnRpgNode(profile, `${tree}.${d}a`)
  const known = rpgLearnedSkills(profile).sort((a, b) => rpgNode(b.id)!.depth - rpgNode(a.id)!.depth)
  const loadout: RpgNodeRef[] = []
  for (let pass = 0; pass < 5 && loadout.length < rpgActiveSlots(level); pass++) {
    for (const w of profile.weapons) {
      const next = known.find((r) => rpgNode(r.id)!.weapon === w && !loadout.some((x) => x.id === r.id))
      if (next && loadout.length < rpgActiveSlots(level)) loadout.push(next)
    }
  }
  const grade = onCurveGrade(level)
  const kit = KIT[classId]
  const equipped: Partial<Record<GearSlot, string>> = {}
  if (options.gear) {
    for (const w of profile.weapons) equipped[w] = `${w}-g${grade}`
    ARMOR_SLOTS.forEach((slot, k) => { equipped[slot] = `${ARMOR_SLOT_KINDS[slot][kit.magical[k] ? 1 : 0]}-g${grade}` })
    kit.accessories.forEach((type, k) => { equipped[`accessory-${k + 1}` as GearSlot] = `${type}-g${grade}` })
  }
  const points = addPoints(options.gear ? equippedPoints(equipped) : noPoints(), options.stars ? starPoints(onCurveStars(classId, level)) : noPoints())
  const boosted = applyPoints(projectRpgStats(profile), points)
  const might = options.gear ? equippedMight(equipped, profile.weapons) : {}
  const a = equippedAccessories(equipped)
  const effects = accessoryFightFields(a, boosted.stats.hp)
  // From Lv 5 she learns under her class's first Hero, her Bond growing with her level (a Learner bonds fully by about Lv 23).
  const bond = Math.min(10, Math.floor(level / 2.3))
  const inherits = options.heroes && level >= 5 ? [{ limit: `${classId}-1` as const, bond, from: `hero-${classId}` }] : undefined
  return { id: profile.outfitId, classId, weapons: profile.weapons, tier: 1, level, stats: boosted.stats, tree: profile.tree, legacy: [],
    loadout, mp: boosted.stats.mp, classRank: profile.classRank, ...(Object.keys(might).length ? { might } : {}), ...effects,
    ...(a.orbs.length ? { orbs: [...a.orbs] } : {}), ...(boosted.evasion > 0 ? { evasion: boosted.evasion } : {}),
    ...(boosted.limitStart > 0 ? { limitStart: boosted.limitStart } : {}), ...(inherits ? { inherits } : {}) }
}

export const balanceParty = (level: number, options: BalanceOptions = {}): BattleAlly[] =>
  BALANCE_PARTY.map((c, i) => balanceMember(c, i, level, options))

/** A stage's fight as the game starts it: the current engine, every wave. */
export const balanceStage = (node: RpgMapNode, seed: number, allies: BattleAlly[]): BattleInput =>
  ({ version: BATTLE_ENGINE_VERSION, seed, allies, enemies: node.enemies, ...(node.waves?.length ? { waves: node.waves } : {}) })
