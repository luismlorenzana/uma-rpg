// The balance simulation's party (combat-balance.md §6.0): five average Umas built through the game's own rules, so the
// simulation measures the game as it is. "On curve" means what a player at her level would have: weapons, armor and
// accessories of the grade her ranks open, the Extra Stats nodes her level allows and an inherited Limit Break. Test
// support only: nothing in the game imports it.
import { BATTLE_ENGINE_VERSION, rpgRework, rpgV2 } from '../rpg/battle/caps'
import type { BattleAlly, BattleInput } from '../rpg/battle/types'
import type { RpgMapNode } from '../rpg/campaign/chapters'
import { rpgNode } from '../rpg/catalog'
import { isRpgTome, rpgIsTier0, rpgWeaponKind, type RpgDamageKind, type RpgV2Class } from '../rpg/kinds'
import { heroLimitHall, heroLimitIds, heroSeatHome, type HeroLimitId } from '../rpg/hero-id'
import { RPG_TIER0_MAX_RANK, RPG_TIER0_MODEL } from '../rpg/class-tree'
import type { RpgLines } from '../rpg/node-identity'
import {
  learnRpgNode, projectRpgStats, rpgActiveSlots, rpgDefaultWeapons, rpgExpToNext, rpgLearnBlock, rpgLearnedSkills, rpgProfileTrees,
  type RpgClass, type RpgNodeRef, type RpgProfile, type RpgWeapon,
} from '../rpg/rules'
import { applyPoints, addPoints, noPoints } from '../economy/bonus'
import { starPoints } from '../economy/stars'
import { CORE_NODES, mapNodeGate, mapPoints, moonChannel } from '../economy/planet'
import { armorHalf, gradeMight, gradePoints, newGrades, type GearTier, type UmaGrades } from '../economy/grades'
import { accessoryParts, signatureBonus, signatureWorn } from '../economy/accessories'
import { rpgPartyAllies, type RpgPartyMember } from '../rpg/campaign/run'
import { classPresetV3, presetAccessory, type PresetAccessory } from '../save/presets'
import { KNACK_FAMILY, STRIDE_FLOURISH, umaFlourishActive, type UmaCallingClass, type UmaKnack, type UmaStride } from '../roster/template'
import { equippedAccessories, equippedMight, equippedPoints } from '../economy/gear'
import { accessoryFightFields, type GearSlot } from '../economy/gear-id'
import { ARMOR_SLOT_KINDS, ARMOR_SLOTS, CLASS_EXP_SHARE, CLASS_MAX_RANK, classExpToNext } from '../economy/ranks'
import type { ItemEffect } from '../items/kinds'

export const BALANCE_PARTY: readonly RpgClass[] = ['brawler', 'mage', 'spellblade', 'cleric', 'summoner']

/** The grade her ranks open by her level: a rank is reached by Lv 5k − 4 (D102), and the Forge makes grade k from Craft
 * Level 5k − 4, so the two keep pace. */
export const onCurveGrade = (level: number): number => Math.min(10, Math.floor((level + 4) / 5))

/** Each class's armor halves (physical or magical) and its two accessories: what an average player would choose. */
export interface BalanceKit { magical: readonly boolean[]; accessories: readonly string[]; stats: readonly ItemEffect[] }
/** Classes v3's seven (H126) wear their mirror's kit: the Arms Summoner the Spell Blade's physical one, the Tome
 * Spellblade the Summoner's magical one, each Tier 0 her model's (`RPG_TIER0_MODEL`). H131 measures them. */
const mirrored = (kits: Readonly<Record<'brawler' | 'mage' | 'spellblade' | 'cleric' | 'summoner', BalanceKit>>) => ({
  recruit: kits.brawler, duelist: kits.spellblade, acolyte: kits.cleric, caller: kits.summoner, apprentice: kits.mage,
  armsummoner: kits.spellblade, tomeblade: kits.summoner,
})
const KIT_V1 = {
  brawler: { magical: [false, false, false, false, false], accessories: ['talisman-vampire', 'talisman-iron'], stats: ['atk', 'hp', 'def', 'mdef'] },
  mage: { magical: [true, true, true, true, true], accessories: ['amulet-siphon', 'amulet-ward'], stats: ['matk', 'hp', 'mdef', 'def'] },
  spellblade: { magical: [false, false, false, true, true], accessories: ['talisman-vampire', 'amulet-spring'], stats: ['atk', 'matk', 'hp', 'def'] },
  cleric: { magical: [true, true, true, true, true], accessories: ['amulet-spring', 'talisman-vital'], stats: ['matk', 'hp', 'mdef', 'def'] },
  summoner: { magical: [true, true, true, true, true], accessories: ['amulet-spring', 'amulet-veil'], stats: ['matk', 'hp', 'def', 'mdef'] },
} satisfies Record<string, BalanceKit>
const KIT: Readonly<Record<RpgClass, BalanceKit>> = {
  ...KIT_V1,
  // Classes v2's Paladin (D179): no v1 fight has her; her v2 kit is below.
  paladin: { magical: [false, false, false, false, false], accessories: ['talisman-thorn', 'talisman-vital'], stats: ['atk', 'hp', 'def', 'mdef'] },
  ...mirrored(KIT_V1),
}
const PHYSICAL: readonly boolean[] = [false, false, false, false, false]
const MAGICAL: readonly boolean[] = [true, true, true, true, true]
/**
 * Classes v2's kits (H60): her class's armor in all five slots (§3) and her standard preset's accessories (H57, D182), an
 * Orb in the Damage slot (her spread's first weapon's kind) and a support in the Support slot. Extra Stats as v1's (the
 * Paladin's ATK, HP, DEF and M.DEF). `classPreset(c, 15)` must agree: `rift/balance-v15.test.ts` checks it.
 */
const KIT_V2 = {
  brawler: { ...KIT.brawler, magical: PHYSICAL, accessories: ['orb-greatsword', 'talisman-vampire'] },
  mage: { ...KIT.mage, magical: MAGICAL, accessories: ['orb-fire', 'amulet-siphon'] },
  spellblade: { ...KIT.spellblade, magical: PHYSICAL, accessories: ['orb-greatsword', 'talisman-vampire'] },
  cleric: { ...KIT.cleric, magical: MAGICAL, accessories: ['orb-light', 'amulet-spring'] },
  summoner: { ...KIT.summoner, magical: MAGICAL, accessories: ['orb-fire', 'amulet-siphon'] },
} satisfies Record<string, BalanceKit>
export const BALANCE_KIT_V2: Readonly<Record<RpgClass, BalanceKit>> = {
  ...KIT_V2,
  paladin: { ...KIT.paladin, magical: PHYSICAL, accessories: ['orb-greatsword', 'talisman-thorn'] },
  ...mirrored(KIT_V2),
}
/**
 * The Tier rework's R1 kit (engine v16, H71; D199 point 2): today's gear, so v2's kit with her Orb on her **v16 first
 * slot's** kind (a hybrid's lead half, SB10's rule met by the slot order) and today's supports. `classPreset(c, 16)` must
 * agree: `world/balance-v16.test.ts` checks it. A member built on other weapons (a guided build's second copy) wears her
 * Orb on her own first slot's kind, the preset's rule (`balanceMember`).
 */
const KIT_V16 = {
  brawler: { ...BALANCE_KIT_V2.brawler, accessories: ['orb-greatsword', 'talisman-vampire'] },
  mage: { ...BALANCE_KIT_V2.mage, accessories: ['orb-fire', 'amulet-siphon'] },
  spellblade: { ...BALANCE_KIT_V2.spellblade, accessories: ['orb-katana', 'talisman-vampire'] },
  cleric: { ...BALANCE_KIT_V2.cleric, accessories: ['orb-light', 'amulet-spring'] },
  summoner: { ...BALANCE_KIT_V2.summoner, accessories: ['orb-dark', 'amulet-siphon'] },
} satisfies Record<string, BalanceKit>
export const BALANCE_KIT_V16: Readonly<Record<RpgClass, BalanceKit>> = {
  ...KIT_V16,
  paladin: { ...BALANCE_KIT_V2.paladin, accessories: ['orb-greatsword', 'talisman-thorn'] },
  ...mirrored(KIT_V16),
}
const kitOf = (classId: RpgClass, engine: number): BalanceKit =>
  (rpgRework('fight', engine) ? BALANCE_KIT_V16 : rpgV2(engine) ? BALANCE_KIT_V2 : KIT)[classId]

/**
 * The balance Uma's Class Rank on the real pace (SB16, CP32; H71): a win pays 2E Class EXP (`CLASS_EXP_SHARE`) on the Uma
 * Level's curve, so it is the highest rank whose total Class EXP from Rank 1 fits in twice her total Uma EXP to `level`:
 * Class Rank 20 at Lv 13, 30 at 20, 40 at 27, 50 at 34 (class-progression §7.1). From v16 the balance party reads it;
 * to v15 her Class Rank is her level, as H60 measured.
 * From v19 (Classes v3, CV5, CV8; H131) a Tier 1 class's: she fought her Tier 0 to Rank 10 at Lv 10 (its 3,600, where the old
 * Ranks 1–10 took 1,800) and opened her Tier 1 class at Rank 10, so it is Rank 10 until Lv 10, then the highest rank whose
 * total from Rank 1 fits in 2 × her Uma EXP − 1,800: depths 2–5 at Lv 10 · 16 · 22 · 29, Rank 50 at 36 (§2.6's table). A
 * Tier 0's is `balanceClassRankOf`'s.
 */
export function balanceClassRank(level: number, engine: number = BATTLE_ENGINE_VERSION): number {
  let uma = 0
  for (let l = 1; l < level; l++) uma += rpgExpToNext(l)
  let budget = CLASS_EXP_SHARE * uma
  if (rpgRework('classes', engine)) {
    let old = 0
    for (let r = 1; r < RPG_TIER0_MAX_RANK; r++) old += classExpToNext(r)
    budget = Math.max(old, budget - old)
  }
  let rank = 1, spent = 0
  while (rank < CLASS_MAX_RANK && spent + classExpToNext(rank) <= budget) { spent += classExpToNext(rank); rank++ }
  return rank
}
/** Her class's Class Rank at a level in an engine's generation (H131): from v19 a Tier 0's is her level up to 10 (CV5: Rank r
 * with Uma Lv r when she fights as it from Lv 1), anyone else's `balanceClassRank`. */
export const balanceClassRankOf = (classId: RpgClass, level: number, engine: number = BATTLE_ENGINE_VERSION): number =>
  (rpgRework('classes', engine) && rpgIsTier0(classId) ? Math.min(level, RPG_TIER0_MAX_RANK) : balanceClassRank(level, engine))
/** The hall whose seats a class learned under to v18 (H126; frozen with the six halls): her own for the six, her family
 * hall's for Classes v3's seven. */
const V18_HALL: Readonly<Record<RpgClass, RpgV2Class>> = {
  brawler: 'brawler', mage: 'mage', spellblade: 'spellblade', cleric: 'cleric', summoner: 'summoner', paladin: 'paladin',
  recruit: 'brawler', apprentice: 'mage', duelist: 'spellblade', tomeblade: 'spellblade', caller: 'summoner', armsummoner: 'summoner',
  acolyte: 'paladin',
}
/**
 * The seat she learns under (H131, decision 2): to v18 her class's hall's first, `${class}-1` (Classes v3's seven in their
 * family hall's, `V18_HALL`, H126). From v19 her class's first home seat in Halls v2 (`heroSeatHome`: the Brawler
 * `brawler-1`, the Sorcerer `mage-1`, the Arms Spellblade `spellblade-1`, the Tome Spellblade `spellblade-3`, the Arms
 * Summoner `summoner-1`, the Tome Summoner `summoner-3`, the Paladin `healer-1`, the Cleric `healer-3`); a Tier 0, who has
 * no home seat, her family hall's seat 1 (the hall of her model child's seats: the Recruit `brawler-1`, the Duelist
 * `spellblade-1`, the Acolyte `healer-1`, the Caller `summoner-1`, the Apprentice `mage-1`). HV3's order makes seat 1 of a
 * class's two her own, so v18 and v19 compare seat for seat (halls-v2 §3.5).
 */
export function balanceSeat(classId: RpgClass, engine: number = BATTLE_ENGINE_VERSION): HeroLimitId {
  if (!rpgRework('classes', engine)) return `${V18_HALL[classId]}-1`
  const home = (c: RpgClass): HeroLimitId => heroLimitIds(engine).find((id) => heroSeatHome(id, engine) === c)!
  return rpgIsTier0(classId) ? `${heroLimitHall(home(RPG_TIER0_MODEL[classId]))}-1` : home(classId)
}

/** Her active Extra Stats nodes: the moons her level and the gem grades allow, the best first, across her kit's stats.
 * From v17 (R2, EP16; H76, D213) the core's nodes her level opens, in map order: `planet:n` from Lv 10n − 9 and each
 * moon's `n` from Lv 10n − 4, the same 20 for every class (Prowess at her split, in `mapPoints`) and no template moon
 * (the average Uma has none, XR12). */
export function onCurveStars(classId: RpgClass, level: number, engine: number = BATTLE_ENGINE_VERSION): string[] {
  if (rpgRework('economy', engine)) return CORE_NODES.filter((id) => mapNodeGate(id) <= level)
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
 * accessory (v2: the Support slot) with that type, or empties it with null (H60's support-accessory rule). From v16 (H71)
 * `lines` puts her B trees on B (all A by default, the anchor, CP15), `weapons` gives her other weapons than her class's
 * defaults (a guided build's member), and her Class Rank reads the real pace (`balanceClassRank`) unless `classRank` says. */
export interface BalanceOptions {
  gear?: boolean; stars?: boolean; heroes?: boolean; classRank?: number; tier?: number; engine?: number; support?: string | null
  lines?: RpgLines; weapons?: readonly RpgWeapon[]
  /** From v17 (H81, README §9.5 item 8): a matched member's invented template (the balance party has none, XR12). */
  template?: BalanceTemplate
  /** From v17 (H81, item 7): her accessory slot's form instead of the preset's, or null for an empty slot. */
  accessory?: PresetAccessory | null
}

/** An invented template for a matched member (UT3's three readings, chosen rather than read from an outfit): her knack
 * names her signature family (UT7) and her moon's node I; her calling her moon's node II (its channel's defense) and, while
 * she fights as it, her Flourish by her stride (UT6; Even pace by default). */
export interface BalanceTemplate { knack: UmaKnack; calling: UmaCallingClass; stride?: UmaStride }

/** Her moon's nodes her level opens (UT10): node I at Lv 16, node II at Lv 36 (Moon Jewels II and IV). */
const templateNodes = (level: number): string[] => ['template:1', 'template:2'].filter((id) => mapNodeGate(id) <= level)

/**
 * The v17 member (R2, H81; D208 point 14): her grades on curve (`onCurveGrade`: her three weapons, her five armor slots
 * on her class's half, her one accessory slot), values × her tier; her slot in WP25's Tier 1 form (`classPresetV3`: the
 * Brawler's Bell on her Greatsword, a Pendant for the Mage, the Spell Blade and the Paladin, the Summoner's Orb on Light,
 * the Cleric's on Ice), or, matched, her family by UT8's swap (`presetAccessory`); the full core her level opens with
 * Prowess at her split, and, matched, her moon's two nodes and her signature while she wears her family and her Flourish
 * as her calling. Built by the game's own path (`rpgPartyAllies` at the engine), so her input is what a graded save's
 * fight would freeze; full MP, the base regen the engine's (SB18), no MP accessory.
 */
function v17Member(classId: RpgClass, profile: RpgProfile, loadout: RpgNodeRef[], inherits: RpgPartyMember['inherits'], options: BalanceOptions,
  engine: number): BattleAlly {
  const tier = Math.min(3, Math.max(1, profile.tier)) as GearTier
  const level = profile.level
  const grade = onCurveGrade(level)
  const template = options.template
  const family = template ? KNACK_FAMILY[template.knack] : null
  const form = options.accessory !== undefined ? options.accessory
    : template ? presetAccessory(classId, profile.weapons, family, engine) : classPresetV3(classId, engine).accessory
  const grades: UmaGrades = options.gear ? {
    weapons: Object.fromEntries(profile.weapons.map((w) => [w, { grade }])),
    armor: Object.fromEntries(ARMOR_SLOTS.map((slot) => [slot, { grade }])),
    accessories: [{ grade, family: form?.family ?? null, form: 'base', ...(form?.kind ? { kind: form.kind } : {}) }],
  } : newGrades(tier)
  const moon = template ? { knack: template.knack, channel: moonChannel(template.calling, engine) } : undefined
  const open = options.stars ? [...onCurveStars(classId, level, engine), ...(template ? templateNodes(level) : [])] : []
  // A Tier 0's armor offense and Prowess by her slots (CV7, H126).
  const thirds = rpgIsTier0(classId) ? profile.weapons.filter((w) => !isRpgTome(w)).length : undefined
  const points = addPoints(options.gear ? gradePoints(grades, armorHalf(classId), tier, thirds) : noPoints(),
    mapPoints(open, classId, tier, moon, profile.weapons))
  const signature = family && signatureWorn(grades, family) ? signatureBonus(level, tier) : 0
  const flourish = template && umaFlourishActive({ calling: template.calling }, classId, engine) ? STRIDE_FLOURISH[template.stride ?? 'middle'] : undefined
  const member: RpgPartyMember = {
    profile, loadout, points, might: options.gear ? gradeMight(grades, profile.weapons, tier) : {},
    accessory: accessoryParts(grades.accessories[0], profile.weapons, tier), ...(signature ? { signature } : {}),
    ...(inherits ? { inherits } : {}), ...(flourish ? { flourish } : {}),
  }
  return rpgPartyAllies([member], (p, pts) => applyPoints(projectRpgStats(p, engine), pts ?? noPoints()).stats.mp, engine)[0]!
}

/** An average outfit of a class at a level: side skills learned deepest first, the deepest skills equipped one weapon at a
 * time, and, on curve, her gear, Extra Stats and an inherited Limit Break. From v16 (H65) the Tier rework's Uma: her three
 * default weapons (or `weapons`), no side skills, every tree on line A (or `lines`), her held skills and v16's slots
 * (seven by Lv 40); her Class Rank on the real pace (`balanceClassRank`, H71) unless `classRank` says otherwise. From v17
 * (H81) R2's Uma, graded and built by the game's own path (`v17Member`). */
export function balanceMember(classId: RpgClass, i: number, level: number, options: BalanceOptions = {}): BattleAlly {
  const tier = options.tier ?? 1
  const engine = options.engine ?? BATTLE_ENGINE_VERSION
  const v2 = rpgV2(engine)
  const v16 = rpgRework('fight', engine)
  const weapons = v16 && options.weapons ? [...options.weapons] : rpgDefaultWeapons(classId, engine)
  // Her lines on the weapons she holds (a line on a tree she doesn't slot means nothing).
  const held = v16 ? Object.entries(options.lines ?? {}).filter(([w]) => weapons.includes(w as RpgWeapon)) : []
  const lines: RpgLines | undefined = held.length ? Object.fromEntries(held) : undefined
  let profile: RpgProfile = { outfitId: `${100 + i}`, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
    growthRates: { speed: 0.1, stamina: 0.1, power: 0.1, guts: 0, wit: 0 }, classId, weapons, tier, level, exp: 0,
    tree: [], legacy: [], classRank: options.classRank ?? (v16 ? balanceClassRankOf(classId, level, engine) : level), ...(lines ? { lines } : {}) }
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
  // From Lv 5 she learns under her class's first Hero, her Bond growing with her level (a Learner bonds fully by about Lv 23);
  // Classes v3's seven under their family hall's first (`V18_HALL`, H126); from v19 Halls v2's (`balanceSeat`, H131).
  const bond = Math.min(10, Math.floor(level / 2.3))
  const seat = balanceSeat(classId, engine)
  const inherits = options.heroes && level >= 5 ? [{ limit: seat, bond, from: `hero-${heroLimitHall(seat)}` }] : undefined
  if (rpgRework('economy', engine)) return v17Member(classId, profile, loadout, inherits, options, engine)
  const grade = onCurveGrade(level)
  const kit = kitOf(classId, engine)
  const equipped: Partial<Record<GearSlot, string>> = {}
  if (options.gear) {
    for (const w of profile.weapons) equipped[w] = `${w}-g${grade}`
    ARMOR_SLOTS.forEach((slot, k) => { equipped[slot] = `${ARMOR_SLOT_KINDS[slot][kit.magical[k] ? 1 : 0]}-g${grade}` })
    // From v16 her Orb is on her first slot's kind: the kit's on her defaults, her own first weapon's on a guided build.
    const orb = v16 && options.weapons ? `orb-${rpgWeaponKind(profile.weapons[0]!)}` : kit.accessories[0]!
    const accessories = options.support === undefined ? [orb, ...kit.accessories.slice(1)] : [orb, options.support]
    accessories.forEach((type, k) => { if (type) equipped[`accessory-${k + 1}` as GearSlot] = `${type}-g${grade}` })
  }
  const stars = options.stars ? starPoints(onCurveStars(classId, level, engine)) : noPoints()
  const points = addPoints(options.gear ? equippedPoints(equipped) : noPoints(), stars)
  const boosted = applyPoints(projectRpgStats(profile, engine), points)
  const a = equippedAccessories(equipped, engine)
  // v2 (C4): her Orb's offense joins her Might on its kind, as `rpgPartyAllies` adds it.
  const might: Partial<Record<RpgDamageKind, number>> = options.gear ? equippedMight(equipped, profile.weapons) : {}
  if (v2) for (const [k, n] of Object.entries(a.orbMight ?? {})) might[k as RpgDamageKind] = (might[k as RpgDamageKind] ?? 0) + n
  const effects = accessoryFightFields(a, boosted.stats.hp)
  return { id: profile.outfitId, classId, weapons: profile.weapons, tier, level, stats: boosted.stats, tree: profile.tree, legacy: [],
    ...(lines ? { lines } : {}), loadout, mp: boosted.stats.mp, classRank: profile.classRank, ...(Object.keys(might).length ? { might } : {}), ...effects,
    ...(!v2 && a.orbs.length ? { orbs: [...a.orbs] } : {}), ...(boosted.evasion > 0 ? { evasion: boosted.evasion } : {}),
    ...(boosted.limitStart > 0 ? { limitStart: boosted.limitStart } : {}), ...(inherits ? { inherits } : {}) }
}

export const balanceParty = (level: number, options: BalanceOptions = {}): BattleAlly[] =>
  BALANCE_PARTY.map((c, i) => balanceMember(c, i, level, options))

/** A stage's fight as the game starts it: the live engine (or `version`, H60), every wave. */
export const balanceStage = (node: RpgMapNode, seed: number, allies: BattleAlly[], version: BattleInput['version'] = BATTLE_ENGINE_VERSION): BattleInput =>
  ({ version, seed, allies, enemies: node.enemies, ...(node.waves?.length ? { waves: node.waves } : {}) })
