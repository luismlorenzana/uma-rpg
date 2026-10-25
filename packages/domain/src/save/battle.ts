// Battle rules over the save (S3, D86, D102): classes, their weapons and skills, the world's fights and their rewards. A
// win fills four bars: Uma Level, the Class Rank she fought as, her three weapons' and her five armor kinds' ranks, and her
// accessories' kinds (D124). Pure
// functions that return a new save or throw SaveRuleError, like the collection rules. Design: docs/design/battles.md,
// docs/design/class-rework.md, docs/design/progression.md.
import type { BattleAction, BattleInput, BattleState, BattleStep, RpgFlourish } from '../rpg/battle/types'
import { rpgTierLevel, type RpgCampaignChapter, type RpgMapNode } from '../rpg/campaign/chapters'
import { rpgBattleExp, rpgBattleLaurels, rpgRewardKind, rpgShardsBetween } from '../rpg/campaign/rewards'
import { FIRST_CLEAR_LAURELS, LATE_LAURELS, REPLAY_SHARE } from '../economy/pacing'
import { SPRING_RECHARGE_MS, stageExpPay, stagePay } from '../world/world'
import {
  rpgAbandonRunBattle, rpgActInRun, rpgBeginRunBattle, rpgCloseRunBattle, rpgMemberLevel,
  type RpgPartyMember, type RpgRun,
} from '../rpg/campaign/run'
import { rpgNode } from '../rpg/catalog'
import { isRpgTome, rpgWeaponKind } from '../rpg/kinds'
import {
  grantRpgExp, RPG_CLASS_SLOTS, RPG_CLASSES, rpgActiveSlots, rpgAutoLoadout, rpgClassWeapons, rpgLineOf,
  rpgPicksWeapons, rpgSwapBranchLoadout, rpgUsableLoadout, validRpgWeapons, type RpgBranch, type RpgClass, type RpgLines, type RpgNodeRef,
  type RpgProfile, type RpgWeapon,
} from '../rpg/rules'
import {
  ACCESSORY_EXP_SHARE, ACCESSORY_SLOTS, ARMOR_EXP_SHARE, ARMOR_SLOTS, CLASS_EXP_SHARE, classRankOf, grantTrack, MARKS_SHARE, trackOf, weaponExpShares,
  withTrack, type RankRef, type RankTrack, type Ranks,
} from '../economy/ranks'
import { starPoints } from '../economy/stars'
import { addPoints, type Points } from '../economy/bonus'
import { armorHalf, gradeMight, gradePoints, type GearTier } from '../economy/grades'
import { mapPoints, moonTemplate, type MoonTemplate } from '../economy/planet'
import { accessoryKindOf, equippedAccessories, equippedMight, equippedPoints, gearById, isAccessory } from '../economy/gear'
import { equipGear, unequipGear } from './forge'
import {
  gearV1, gradesOf, isGrades, isStarMap, PARTY_SIZE, SHARDS_PER_TICKET, slotKind, startingArmorKinds, starsV1, type ClassLoadout, type OwnedUma, type Save,
  type TierWorld,
} from './save'
import { SaveRuleError, TIER_ONE, worldOf } from './rules'
import { heroFields, payBonds, type BondGain } from './heroes'
import { callingPickBlock } from './status'
import { BATTLE_ENGINE_VERSION, rpgRework } from '../rpg/battle/caps'
import { STRIDE_FLOURISH, umaCalling, umaCallingPick, umaCallingPickBlock, umaFlourishActive, umaStride } from '../roster/template'
import { activeClass, classOf, healerBlock, withClassWeapons, type BattleOutfit } from './class'

// An Uma's class (H62) and one healer a party (H59): in `save/class.ts`, so the main bundle and the party screens read them
// without this module and the engine.
export {
  activeClass, classOf, healerBlock, ONE_HEALER, startingClass, styleClass, withClassWeapons, type BattleOutfit, type StartingOutfit,
} from './class'

function withWorld(save: Save, tier: string, world: TierWorld, now: string): Save {
  return { ...save, account: { ...save.account, updatedAt: now }, tierWorlds: { ...save.tierWorlds, [tier]: world } }
}

function ownedOf(world: TierWorld, outfitId: string): OwnedUma {
  const uma = world.umas[outfitId]
  if (!uma) throw new SaveRuleError('not-owned', 'only owned Umas can fight')
  return uma
}

// --- Classes (D86) ---------------------------------------------------------------------------------------------------

/** Her battle profile as a class (the active one by default); its Class Rank opens the depths and ranks her skills (D102,
 * CP25). No side skills (engine v16): her line on each of her class's trees (save v27's `lines`, H69). */
export function umaProfile(outfit: BattleOutfit, uma: OwnedUma, tier: number, classId: RpgClass = activeClass(outfit, uma)): RpgProfile {
  const growth = (key: keyof BattleOutfit['growthRatePercents']) => Math.min(1, Math.max(0, outfit.growthRatePercents[key] / 100))
  const setup = classOf(uma, classId)
  return {
    outfitId: outfit.outfitId,
    baseStats: { ...outfit.baseStats },
    growthRates: { speed: growth('speed'), stamina: growth('stamina'), power: growth('power'), guts: growth('guts'), wit: growth('wit') },
    classId, weapons: [...setup.weapons], tier, level: uma.level, exp: uma.exp, tree: [], legacy: [],
    classRank: classRankOf(uma.ranks, classId), lines: { ...setup.lines },
  }
}

/** Her equipped skills as a class: the ones she picked that she can use, or, until she picks, chosen for her. */
export function umaLoadout(outfit: BattleOutfit, uma: OwnedUma, tier: number, classId: RpgClass = activeClass(outfit, uma)): RpgNodeRef[] {
  const profile = umaProfile(outfit, uma, tier, classId)
  const picked = classOf(uma, classId).loadout
  return picked === null ? rpgAutoLoadout(profile) : rpgUsableLoadout(profile, picked.map((id) => ({ tier, id })))
}

function withClass(save: Save, outfitId: string, classId: RpgClass, next: ClassLoadout, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const uma = ownedOf(world, outfitId)
  return withWorld(save, tier, { ...world, umas: { ...world.umas, [outfitId]: { ...uma, classes: { ...uma.classes, [classId]: next } } } }, now)
}

/** Switches the class she fights as. Free at any time; each class keeps its own weapons and skills. */
export function chooseClass(save: Save, outfitId: string, classId: RpgClass, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const uma = ownedOf(world, outfitId)
  if (!RPG_CLASSES.includes(classId)) throw new SaveRuleError('bad-class', `no class ${classId}`)
  return withWorld(save, tier, { ...world, umas: { ...world.umas, [outfitId]: { ...uma, classId } } }, now)
}

/** Sets the weapons a class wields, as the live generation's slots allow (`validRpgWeapons`). From v16 her equipped skills
 * of a tree she no longer slots leave her loadout (`withClassWeapons`, H69). */
export function setClassWeapons(save: Save, outfitId: string, classId: RpgClass, weapons: readonly RpgWeapon[], now: string, tier = TIER_ONE): Save {
  const uma = ownedOf(worldOf(save, tier), outfitId)
  if (!validRpgWeapons(classId, weapons)) throw new SaveRuleError('bad-loadout', 'those weapons don’t fit this class’s slots')
  return withClass(save, outfitId, classId, withClassWeapons(classOf(uma, classId), weapons), now, tier)
}

/**
 * Puts a weapon in one of a class's slots (D98), by the live generation's slots (`RPG_CLASS_SLOTS`, five to v15, three
 * from v16); the weapons in her slots are the trees she fights with. Every Uma holds a Training weapon of all ten kinds
 * (grade 0, no stats), so a null `gearId` means the Training one, and a crafted piece of that kind is worn instead (from
 * her locker, or from the stock, binding it). A class that picks (`rpgPicksWeapons`: to v15 all but the Brawler and the
 * Mage, from v16 every class) can change a slot's weapon within the slot's kind (one already in another slot swaps
 * places); the others keep theirs. A crafted piece serves every class that holds its weapon.
 */
export function holdWeapon(save: Save, outfitId: string, classId: RpgClass, slot: number, weapon: RpgWeapon, gearId: string | null, now: string,
  tier = TIER_ONE): Save {
  const uma = ownedOf(worldOf(save, tier), outfitId)
  const weapons = [...classOf(uma, classId).weapons]
  const kind = RPG_CLASS_SLOTS[classId][slot]
  if (!kind || weapons[slot] === undefined) throw new SaveRuleError('bad-loadout', 'no such weapon slot')
  let next = save
  if (weapons[slot] !== weapon) {
    if (!rpgPicksWeapons(classId)) throw new SaveRuleError('bad-loadout', 'this class’s weapons are fixed')
    if (kind !== 'any' && (kind === 'tome') !== isRpgTome(weapon)) throw new SaveRuleError('bad-loadout', 'that weapon doesn’t fit this slot')
    const other = weapons.indexOf(weapon)
    if (other >= 0) weapons[other] = weapons[slot]!
    weapons[slot] = weapon
    next = setClassWeapons(next, outfitId, classId, weapons, now, tier)
  }
  if (gearId !== null) {
    if (gearById(gearId)?.type !== weapon) throw new SaveRuleError('bad-loadout', 'that piece isn’t this weapon')
    if (gearV1(uma).equipped[weapon] !== gearId) next = equipGear(next, outfitId, gearId, now, tier)
  } else if (gearV1(uma).equipped[weapon]) next = unequipGear(next, outfitId, weapon, now, tier)
  return next
}

/** Sets a class's equipped skills, in order, or null to have them chosen for her. Every id must be a skill she knows. */
export function equipSkills(save: Save, outfit: BattleOutfit, classId: RpgClass, loadout: readonly string[] | null, now: string, tier = TIER_ONE): Save {
  const uma = ownedOf(worldOf(save, tier), outfit.outfitId)
  if (loadout !== null) {
    const profile = umaProfile(outfit, uma, Number(tier), classId)
    const usable = rpgUsableLoadout(profile, loadout.map((id) => ({ tier: Number(tier), id })))
    if (usable.length !== loadout.length) throw new SaveRuleError('bad-loadout', `equip up to ${rpgActiveSlots(uma.level)} skills she knows, once each`)
  }
  return withClass(save, outfit.outfitId, classId, { ...classOf(uma, classId), loadout: loadout === null ? null : [...loadout] }, now, tier)
}

// --- Lines and the calling (save v27, H69: from v16, the Tier rework's fight) -----------------------------------------

/**
 * Takes line `branch` on one of her class's trees (CP14, CP18; save v27's `lines`): any kind of her class, slotted or
 * not, B listed and A absent. Free and at any time (an open fight's input is frozen). Her equipped skills of that tree
 * follow in place (`rpgSwapBranchLoadout`, CP23: with Rend equipped, Combo puts Rending Combo in its slot); a pick she
 * already has changes nothing.
 */
export function pickBranch(save: Save, outfit: BattleOutfit, classId: RpgClass, weapon: RpgWeapon, branch: RpgBranch, now: string, tier = TIER_ONE): Save {
  const uma = ownedOf(worldOf(save, tier), outfit.outfitId)
  if (!RPG_CLASSES.includes(classId)) throw new SaveRuleError('bad-class', `no class ${classId}`)
  if (!rpgClassWeapons(classId).includes(weapon)) throw new SaveRuleError('cannot-learn', 'Not in this class’s trees')
  if (branch !== 'A' && branch !== 'B') throw new SaveRuleError('cannot-learn', 'No such line')
  const current = classOf(uma, classId)
  if (rpgLineOf(current.lines, weapon) === branch) return save
  const lines: RpgLines = { ...current.lines }
  if (branch === 'B') lines[weapon] = 'B'
  else delete lines[weapon]
  const loadout = current.loadout === null ? null : rpgSwapBranchLoadout(current.loadout, classId, weapon, branch)
  return withClass(save, outfit.outfitId, classId, { ...current, lines, loadout }, now, tier)
}

/** What `pickCalling` says for a class outside her two. */
export const NOT_HER_PICK = 'Not one of her two'
/**
 * Picks her calling (CP29, CP30; save v27's `calling`): one of her row's two classes (`umaCallingPick`), refused for an
 * Uma with no pick or a confirmed one (`umaCallingPickBlock`). Stored unconfirmed: she can change it until she confirms
 * it or wins a fight. At Uma Lv 1, her start, it also moves her class to the pick while she still fights as her start
 * (her previous calling's class, or no class chosen yet), and her five armor kinds to the pick's half when she wears no
 * armor piece. Above Lv 1 only her calling moves; she switches class freely as ever. From R2 the pick moves her trade
 * (PP2), so it is refused while she works (`callingPickBlock`, H77).
 */
export function pickCalling(save: Save, outfit: BattleOutfit, pick: RpgClass, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const uma = ownedOf(world, outfit.outfitId)
  const block = umaCallingPickBlock(outfit, uma.calling)
  if (block) throw new SaveRuleError('bad-class', block)
  if (!umaCallingPick(outfit)!.options.includes(pick)) throw new SaveRuleError('bad-class', NOT_HER_PICK)
  const working = rpgRework('economy') ? callingPickBlock(world, outfit.outfitId, now) : null
  if (working) throw new SaveRuleError('busy', working)
  let next: OwnedUma = { ...uma, calling: { pick, confirmed: false } }
  if (uma.level === 1) {
    if (uma.classId === null || activeClass(outfit, uma) === umaCalling(outfit, uma.calling.pick)) next = { ...next, classId: pick }
    const gear = gearV1(uma)
    if (!isGrades(uma.gear) && !ARMOR_SLOTS.some((slot) => gear.equipped[slot])) next = { ...next, gear: { ...gear, kinds: startingArmorKinds(pick) } }
  }
  return withWorld(save, tier, { ...world, umas: { ...world.umas, [outfit.outfitId]: next } }, now)
}

/** Confirms her calling, the card's Confirm (CP29): her pick, or her pre-selection when she has none, is final. Nothing
 * changes when it already is. */
export function confirmCalling(save: Save, outfitId: string, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const uma = ownedOf(world, outfitId)
  if (uma.calling.confirmed) return save
  return withWorld(save, tier, { ...world, umas: { ...world.umas, [outfitId]: callingConfirmed(uma) } }, now)
}

/** She after a won fight (CP29: her first win confirms her calling): her calling confirmed, the pick (or none) kept, on
 * every Uma (a fixed row's confirmed calling changes nothing). */
export function callingConfirmed(uma: OwnedUma): OwnedUma {
  if (uma.calling.confirmed) return uma
  return { ...uma, calling: { pick: uma.calling.pick, confirmed: true } }
}

/** Every stat point she brings to a fight: her Extra Stats (S6; R2's map with her moon from `template`) and her armor
 * (S7, D104). */
export function umaPoints(uma: OwnedUma, classId: RpgClass, tier: GearTier = 1, template?: MoonTemplate): Points {
  const { gear, extra } = umaPointParts(uma, classId, tier, template)
  return addPoints(extra, gear)
}
/** Her points apart: what her armor gives, and her Extra Stats: a v1 map's active nodes, or a v3 map's open nodes
 * (`mapPoints`: Prowess split by `classId`, her moon by `template`, values × `tier`; H76, D213). (Weapons add Might to
 * their hits instead.) */
export function umaPointParts(uma: OwnedUma, classId: RpgClass = 'brawler', tier: GearTier = 1, template?: MoonTemplate): { gear: Points; extra: Points } {
  const gear = isGrades(uma.gear)
    ? gradePoints(gradesOf(uma), armorHalf(classId), tier)
    : equippedPoints(gearV1(uma).equipped)
  const extra = isStarMap(uma.stars) ? mapPoints(uma.stars.open, classId, tier, template) : starPoints(starsV1(uma).active)
  return { gear, extra }
}

/** What her weapons add to each offense on her profile (D119): the average Might of the weapons in her class's five
 * slots that hit with it, Arms with ATK and Tomes with M.ATK, a Training weapon counting 0. In a fight each hit adds its
 * own weapon's Might. */
export function umaWeaponMight(uma: OwnedUma, classId: RpgClass, tier: GearTier = 1): { atk: number; matk: number } {
  const weapons = classOf(uma, classId).weapons
  const might = isGrades(uma.gear) ? gradeMight(gradesOf(uma), weapons, tier) : equippedMight(gearV1(uma).equipped, weapons)
  const average = (ws: readonly RpgWeapon[]) =>
    ws.length ? Math.round(ws.reduce((n, w) => n + (might[rpgWeaponKind(w)] ?? 0), 0) / ws.length) : 0
  return { atk: average(weapons.filter((w) => !isRpgTome(w))), matk: average(weapons.filter(isRpgTome)) }
}

// --- The world's fights (D66): one world-wide run, the active party, Springs ------------------------------------------

/** The world's run: wins per stage, MP per Uma (absent is full) and the open fight, whichever party fights it. */
export const worldRun = (world: TierWorld): RpgRun => world.world.run
/** The open fight, or null. One at a time, world-wide. */
export const openFightOf = (world: TierWorld): RpgRun | null => (world.world.run.battle ? world.world.run : null)

function withRun(save: Save, run: RpgRun, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  return withWorld(save, tier, { ...world, world: { ...world.world, run } }, now)
}

/** Makes another of the twenty parties the one that fights; not while a fight is open. */
export function setActiveParty(save: Save, party: number, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  if (!Number.isInteger(party) || party < 0 || party >= world.parties.length) throw new SaveRuleError('bad-party', `party ${party} doesn't exist`)
  if (openFightOf(world)) throw new SaveRuleError('in-fight', 'finish the open fight first')
  return withWorld(save, tier, { ...world, world: { ...world.world, activeParty: party } }, now)
}

/** When a Spring is ready again, or null when it is ready now. */
export function springReadyAt(world: TierWorld, springId: string, now: string): string | null {
  const last = world.world.springs[springId]
  if (!last) return null
  const ready = Date.parse(last) + SPRING_RECHARGE_MS
  return ready > Date.parse(now) ? new Date(ready).toISOString() : null
}

/** A Spring refills the active party's MP, then recharges for two hours (D66). */
export function useSpring(save: Save, springId: string, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  if (!/^w\d+-spring\d+$/.test(springId)) throw new SaveRuleError('bad-job', 'no such Spring')
  if (openFightOf(world)) throw new SaveRuleError('in-fight', 'finish the open fight first')
  if (springReadyAt(world, springId, now)) throw new SaveRuleError('bad-job', 'the Spring is still recharging')
  const members = (world.parties[world.world.activeParty]?.slots ?? []).filter((s): s is string => s !== null)
  if (members.length === 0) throw new SaveRuleError('bad-party', 'the active party is empty')
  const mp = { ...world.world.run.mp }
  for (const id of members) delete mp[id]
  return withWorld(save, tier, { ...world, world: { ...world.world, run: { ...world.world.run, mp, updatedAt: now }, springs: { ...world.world.springs, [springId]: now } } }, now)
}

/** Her Flourish as she fights (UT6, UT12): her template's, by her stride, while she fights as her calling's class (her
 * active one unless named), else null. `pick` is her calling pick, her stored one (save v27, H69) unless named; null is her
 * row's calling. Read from the template's two parts (`umaTemplate(outfit, pick)`'s `calling` and `flourish`), so its name
 * tables stay out of the main bundle. */
export function umaFlourish(outfit: BattleOutfit, uma: Pick<OwnedUma, 'classId' | 'calling'>, classId: RpgClass = activeClass(outfit, uma),
  pick: RpgClass | null = uma.calling.pick): RpgFlourish | null {
  return umaFlourishActive({ calling: umaCalling(outfit, pick) }, classId) ? STRIDE_FLOURISH[umaStride(outfit)] : null
}

/** These Umas as they enter a fight, each as her active class: profile, equipped skills, stat points, her weapons' Might,
 * her accessories (the fight's generation's, H57), her Hero seat or inherited Limit Breaks, and from v16 her Flourish as
 * her calling (H68). A v3 map's points read her active class (Prowess's split) and her moon's template, her knack and her
 * calling's channel by her stored pick (H76). Working Umas fight too (D119). The world map and the Rift both build their
 * allies here. */
export function partyMembers(world: TierWorld, ids: readonly string[], outfits: ReadonlyMap<string, BattleOutfit>, tier = TIER_ONE,
  engine: number = BATTLE_ENGINE_VERSION): RpgPartyMember[] {
  return ids.map((id) => {
    const outfit = outfits.get(id)
    if (!outfit) throw new SaveRuleError('cannot-fight', `outfit ${id} isn't in the game data`)
    const uma = ownedOf(world, id)
    const classId = activeClass(outfit, uma)
    // Her Flourish by her stored calling pick (save v27, H69): a Pace Uma who picked the Spell Blade has it as one.
    const flourish = rpgRework('fight', engine) ? umaFlourish(outfit, uma, classId, uma.calling.pick) : null
    const gearTier = Number(tier) as GearTier
    const weapons = classOf(uma, classId).weapons
    const common = { profile: umaProfile(outfit, uma, Number(tier), classId), loadout: umaLoadout(outfit, uma, Number(tier), classId),
      points: umaPoints(uma, classId, gearTier, moonTemplate(outfit, uma.calling.pick)), might: isGrades(uma.gear) ? gradeMight(gradesOf(uma), weapons, gearTier) : equippedMight(gearV1(uma).equipped, weapons),
      ...heroFields(world, id), ...(flourish ? { flourish } : {}) }
    return isGrades(uma.gear) ? common : { ...common, accessories: equippedAccessories(gearV1(uma).equipped, engine) }
  })
}

/** Starts a fight on a region's stage with the active party's five members as their active classes. */
export function startFight(save: Save, region: RpgCampaignChapter, nodeId: string, outfits: ReadonlyMap<string, BattleOutfit>,
  now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const party = world.world.activeParty
  const slots = world.parties[party]?.slots
  if (!slots) throw new SaveRuleError('bad-party', `party ${party} doesn't exist`)
  if (slots.some((s) => s === null) || slots.length !== PARTY_SIZE) throw new SaveRuleError('cannot-fight', 'a fight needs a full party of five')
  if (openFightOf(world)) throw new SaveRuleError('cannot-fight', 'a fight is already open')
  const healers = healerBlock(world, slots as string[], outfits)
  if (healers) throw new SaveRuleError('cannot-fight', healers)
  const members = partyMembers(world, slots as string[], outfits, tier)
  try {
    return withRun(save, rpgBeginRunBattle(region, { ...worldRun(world), party }, nodeId, members, now), now, tier)
  } catch (err) {
    throw new SaveRuleError('cannot-fight', err instanceof Error ? err.message : 'cannot start that fight')
  }
}

/** What a finished fight paid, for the result screen. */
export interface FightResult {
  outcome: 'victory' | 'loss'
  chapterId: string
  nodeId: string
  rounds: number
  members: MemberGain[]
  laurels: number
  shards: number
  /** Uma Tickets the Uma Shards completed. */
  tickets: number
  /** Marks banked from EXP past max ranks (D102). */
  gearMarks: number
  classMarks: number
  /** The stage's first clear: its Laurels pay triple (D66); later wins pay a quarter of it (D79). */
  firstClear?: boolean
}

/** One bar a member filled: which, how much EXP, and the track before and after. */
export interface RankGain { ref: RankRef; exp: number; before: RankTrack; after: RankTrack }
/** What a won fight paid one member: Uma EXP and levels, Uma Shards, her Class, Weapon and Armor bars (D102), and her Bonds
 * with the Heroes she learns under (D106). */
export interface MemberGain {
  outfitId: string; exp: number; beforeLevel: number; afterLevel: number; afterExp: number; shards: number
  ranks: RankGain[]
  bonds: BondGain[]
}
/** Who fought, as what, with which weapons, and which of them she used. */
export interface Entrant { outfitId: string; classId: RpgClass; weapons: readonly RpgWeapon[]; used: ReadonlySet<RpgWeapon> }

/** The weapons each ally used in a fight: every attack, skill, Spell Blade half and Limit Break names one. */
export function usedWeapons(input: BattleInput, actions: readonly BattleAction[]): Map<string, Set<RpgWeapon>> {
  const out = new Map<string, Set<RpgWeapon>>(input.allies.map((a) => [a.id, new Set<RpgWeapon>()]))
  for (const a of actions) {
    const used = out.get(a.actorId)
    if (!used || a.kind === 'guard') continue
    const ally = input.allies.find((x) => x.id === a.actorId)!
    const add = (w: RpgWeapon | undefined) => { if (w && ally.weapons.includes(w)) used.add(w) }
    const skill = (ref: { id: string } | undefined) => add(ref ? rpgNode(ref.id)?.weapon : undefined)
    if (a.kind === 'attack') add(a.weapon ?? ally.weapons[0])
    if (a.kind === 'skill') skill(a.skill)
    if ((a.kind === 'attack' || a.kind === 'skill') && a.pair) { add(a.pair.weapon); skill(a.pair.skill) }
    if (a.kind === 'limit') { add(a.weapon); skill(a.skill); for (const r of a.skills ?? []) skill(r) }
  }
  return out
}

/** Laurels a stage win pays: triple on its first clear (D66), a quarter of that on a replay or Sweep (D79), four times
 * as much at Lv41–50 (D82). */
export function stageLaurels(kind: ReturnType<typeof rpgRewardKind>, tier: number, firstClear: boolean, foeLevel: number): number {
  const late = rpgTierLevel(foeLevel).level >= LATE_LAURELS.fromLevel ? LATE_LAURELS.factor : 1
  const full = rpgBattleLaurels(kind, tier) * FIRST_CLEAR_LAURELS * late
  return firstClear ? full : Math.round(full * REPLAY_SHARE)
}

/**
 * Closes a finished fight. A win pays every entrant (KO'd included) EXP, an Uma Shard at Lv10/20/30/40/50 in Tier 1, the
 * world Laurels (triple on a stage's first clear) and tokens; a stage already cleared pays a quarter of all of it (D79).
 * MP carries. A loss leaves the run as it was before.
 */
export function settleFight(save: Save, chapter: RpgCampaignChapter, run: RpgRun, state: BattleState, now: string, tier = TIER_ONE): { save: Save; result: FightResult } {
  const world = worldOf(save, tier)
  const battle = run.battle
  if (!battle) throw new SaveRuleError('cannot-fight', 'no open fight')
  const node: Pick<RpgMapNode, 'id' | 'kind' | 'level' | 'stage' | 'waves'> = chapter.nodes.find((n) => n.id === battle.nodeId) ??
    // A node a rebalance removed still settles, as a regular fight at its foes' level.
    { id: battle.nodeId, kind: 'fight', level: battle.input.enemies[0]?.level ?? chapter.levelStart, stage: 0 }
  const closed = rpgCloseRunBattle(run, state, { id: node.id, kind: node.kind }, now)
  const result: FightResult = { outcome: state.outcome === 'victory' ? 'victory' : 'loss', chapterId: chapter.id, nodeId: node.id,
    rounds: state.round, members: [], laurels: 0, shards: 0, tickets: 0, gearMarks: 0, classMarks: 0 }
  if (state.outcome !== 'victory') return { save: withRun(save, closed, now, tier), result }
  const kind = rpgRewardKind(node)
  const firstClear = (run.wins[node.id] ?? 0) === 0
  const share = firstClear ? 1 : REPLAY_SHARE
  // A stage in waves pays 1.5× its EXP and Laurels (W3).
  const pay = stagePay(node)
  const used = usedWeapons(battle.input, battle.actions)
  const entrants: Entrant[] = battle.input.allies.map((a) => ({ outfitId: a.id, classId: a.classId, weapons: a.weapons, used: used.get(a.id) ?? new Set() }))
  const paid = payEntrants(world, entrants, kind, node.level, Math.round(stageLaurels(kind, chapter.tier, firstClear, node.level) * pay), tier, share * stageExpPay(node))
  Object.assign(result, { members: paid.members, shards: paid.shards, tickets: paid.tickets, laurels: paid.laurels, gearMarks: paid.gearMarks,
    classMarks: paid.classMarks, firstClear })
  const next: TierWorld = { ...paid.world, world: { ...world.world, run: closed } }
  return { save: withWorld(save, tier, next, now), result }
}

/** Her bars after a win worth `exp` Uma EXP, and the Marks that passed their caps. */
export interface RankFill { ranks: Ranks; gains: RankGain[]; gearMarks: number; classMarks: number }

/**
 * Fills her bars for a win worth `exp` Uma EXP (D102, D124), each times `scale` (an Echo pays 2×, R6): 2E to the class she
 * fought as, 5E over her five weapons (double for each she used), E to each of her five armor kinds and E to the kind of
 * each accessory she wears. EXP past a max rank banks at half rate as Marks: Class Marks from her class, Gear Marks from
 * the rest. Her level, EXP and Bonds are the caller's.
 */
export function fillRanks(uma: OwnedUma, entrant: Pick<Entrant, 'classId' | 'weapons' | 'used'>, exp: number, scale = 1): RankFill {
  let ranks: Ranks = uma.ranks
  let gearMarks = 0, classMarks = 0
  const gains: RankGain[] = []
  const fill = (ref: RankRef, stage: number) => {
    const amount = stage * scale
    if (amount <= 0) return
    const before = trackOf(ranks, ref)
    const r = grantTrack(before, ref.kind, amount)
    ranks = withTrack(ranks, ref, r.track)
    const marks = Math.floor(r.overflow * MARKS_SHARE)
    if (ref.kind === 'class') classMarks += marks
    else gearMarks += marks
    gains.push({ ref, exp: amount, before, after: r.track })
  }
  fill({ kind: 'class', id: entrant.classId }, CLASS_EXP_SHARE * exp)
  if (isGrades(uma.gear)) return { ranks, gains, gearMarks: 0, classMarks }
  for (const [w, n] of Object.entries(weaponExpShares(entrant.weapons, entrant.used, exp))) fill({ kind: 'weapon', id: w as RpgWeapon }, n ?? 0)
  const gear = gearV1(uma)
  for (const slot of ARMOR_SLOTS) fill({ kind: 'armor', id: slotKind(gear, slot) }, ARMOR_EXP_SHARE * exp)
  // Each accessory she wears fills its kind's Accessory Rank (D124).
  for (const slot of ACCESSORY_SLOTS) {
    const piece = gear.equipped[slot] ? gearById(gear.equipped[slot]!) : undefined
    if (piece && isAccessory(piece.type)) fill({ kind: 'accessory', id: accessoryKindOf(piece.type) }, ACCESSORY_EXP_SHARE * exp)
  }
  return { ranks, gains, gearMarks, classMarks }
}

/**
 * Pays a won fight to its entrants (D102). Each earns her Uma EXP `E` (a share of her own level, less when the foes are
 * below her, times `share` on a replay, D79) and with it fills her bars: 2E to the class she fought as, 5E over her five
 * weapons (double for each she used), E to each of her five armor kinds and E to the kind of each accessory she wears
 * (D124). EXP past a max rank banks at half rate as
 * Marks. A Learner's Bonds fill too (D106). An Uma Shard at Lv10/20/30/40/50 in Tier 1 (five make a Ticket), and the world's Laurels. Shared by fights and Sweeps.
 * From v16 the win confirms each one's calling pick (CP29, H69).
 */
export function payEntrants(world: TierWorld, entrants: readonly Entrant[], kind: ReturnType<typeof rpgRewardKind>, foeLevel: number, laurels: number,
  tier = TIER_ONE, share = 1): { world: TierWorld; members: MemberGain[]; shards: number; tickets: number; laurels: number; gearMarks: number; classMarks: number } {
  const umas = { ...world.umas }
  const members: MemberGain[] = []
  let shards = 0, gearMarks = 0, classMarks = 0
  for (const e of entrants) {
    const uma = umas[e.outfitId]
    if (!uma) continue // released from the world since: nothing to pay
    const exp = Math.max(1, Math.round(rpgBattleExp(kind, foeLevel, rpgMemberLevel({ tier: Number(tier), level: uma.level })) * share))
    const gained = grantRpgExp({ tier: Number(tier), level: uma.level, exp: uma.exp }, exp)
    const got = tier === TIER_ONE ? rpgShardsBetween(uma.level, gained.level) : 0
    const filled = fillRanks(uma, e, exp)
    gearMarks += filled.gearMarks
    classMarks += filled.classMarks
    // Bonds (D106) pay by the stage alone: every won fight counts, replays and Sweeps too.
    const bonded = payBonds(world, e.outfitId, { ...uma, level: gained.level, exp: gained.exp, ranks: filled.ranks }, kind)
    // A win confirms her calling (CP29, H69), a Sweep's too.
    umas[e.outfitId] = callingConfirmed(bonded.uma)
    members.push({ outfitId: e.outfitId, exp, beforeLevel: uma.level, afterLevel: gained.level, afterExp: gained.exp, shards: got, ranks: filled.gains,
      bonds: bonded.gains })
    shards += got
  }
  const pooled = world.wallet.shards + shards
  const tickets = Math.floor(pooled / SHARDS_PER_TICKET)
  const wallet = { ...world.wallet, unlockTickets: world.wallet.unlockTickets + tickets, shards: pooled % SHARDS_PER_TICKET, laurels: world.wallet.laurels + laurels,
    ...('gearMarks' in world.wallet ? { gearMarks: (world.wallet.gearMarks ?? 0) + gearMarks } : {}), classMarks: world.wallet.classMarks + classMarks }
  return { world: { ...world, umas, wallet }, members, shards, tickets, laurels, gearMarks, classMarks }
}

/** Takes one action in the open fight; when it ends the fight, settles it in the same save. */
export function actInFight(save: Save, chapter: RpgCampaignChapter, action: BattleAction, now: string, tier = TIER_ONE):
  { save: Save; step: BattleStep; result: FightResult | null } {
  const run = openFightOf(worldOf(save, tier))
  if (!run?.battle) throw new SaveRuleError('cannot-fight', 'no open fight')
  let acted: { run: RpgRun; step: BattleStep }
  try {
    acted = rpgActInRun(run, action, now)
  } catch (err) {
    throw new SaveRuleError('cannot-fight', err instanceof Error ? err.message : 'action refused')
  }
  if (acted.step.state.outcome === 'active') return { save: withRun(save, acted.run, now, tier), step: acted.step, result: null }
  const settled = settleFight(save, chapter, acted.run, acted.step.state, now, tier)
  return { ...settled, step: acted.step }
}

/** Gives up the open fight: nothing is paid and the run is as it was before it. */
export function retreat(save: Save, now: string, tier = TIER_ONE): Save {
  const run = openFightOf(worldOf(save, tier))
  if (!run?.battle) throw new SaveRuleError('cannot-fight', 'no open fight')
  return withRun(save, rpgAbandonRunBattle(run, now), now, tier)
}
