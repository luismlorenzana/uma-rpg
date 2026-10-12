// Battle rules over the save (S3, D86, D102): classes, their weapons and skills, the world's fights and their rewards. A
// win fills four bars: Uma Level, the Class Rank she fought as, her five weapons' and her five armor kinds' ranks. Pure
// functions that return a new save or throw SaveRuleError, like the collection rules. Design: docs/design/battles.md,
// docs/design/class-rework.md, docs/design/progression.md.
import type { Aptitudes } from '@luismlorenzana/uma-data'
import { best } from '../roster/aptitudes'
import type { BattleAction, BattleInput, BattleState, BattleStep } from '../rpg/battle/types'
import { rpgTierLevel, type RpgCampaignChapter, type RpgMapNode } from '../rpg/campaign/chapters'
import { rpgBattleExp, rpgBattleLaurels, rpgRewardKind, rpgShardsBetween } from '../rpg/campaign/rewards'
import { FIRST_CLEAR_LAURELS, LATE_LAURELS, REPLAY_SHARE } from '../economy/pacing'
import { SPRING_RECHARGE_MS, stagePay } from '../world/world'
import {
  rpgAbandonRunBattle, rpgActInRun, rpgBeginRunBattle, rpgCloseRunBattle, rpgMemberLevel,
  type RpgPartyMember, type RpgRun,
} from '../rpg/campaign/run'
import { rpgNode } from '../rpg/catalog'
import { isRpgTome } from '../rpg/kinds'
import {
  forgetRpgVariant, grantRpgExp, learnRpgNode, RPG_CLASS_SLOTS, RPG_CLASSES, rpgActiveSlots, rpgAutoLoadout, rpgDefaultClass, rpgDefaultWeapons,
  rpgPicksWeapons, rpgUsableLoadout, validRpgWeapons, type RpgClass, type RpgNodeRef, type RpgProfile, type RpgWeapon,
} from '../rpg/rules'
import {
  ARMOR_EXP_SHARE, ARMOR_SLOTS, CLASS_EXP_SHARE, classRankOf, grantTrack, MARKS_SHARE, trackOf, weaponExpShares, withTrack,
  type RankRef, type RankTrack, type Ranks,
} from '../economy/ranks'
import { starPoints } from '../economy/dishes'
import { addPoints, type Points } from '../economy/bonus'
import { equippedGuard, equippedMight, equippedOrb, equippedPoints, gearById } from '../economy/gear'
import { equipGear, unequipGear } from './forge'
import { PARTY_SIZE, SHARDS_PER_TICKET, slotKind, type ClassLoadout, type OwnedUma, type Save, type TierWorld } from './save'
import { SaveRuleError, TIER_ONE, worldOf } from './rules'
import { workOf } from './status'
import { heroFields, payBonds, type BondGain } from './heroes'

/** What the battle rules need from an outfit's master data (a `RosterOutfit` fits). */
export interface BattleOutfit {
  outfitId: string
  baseStats: Record<'speed' | 'stamina' | 'power' | 'guts' | 'wit', number>
  growthRatePercents: Record<'speed' | 'stamina' | 'power' | 'guts' | 'wit', number>
  aptitudes: Pick<Aptitudes, 'strategy'>
}

function withWorld(save: Save, tier: string, world: TierWorld, now: string): Save {
  return { ...save, account: { ...save.account, updatedAt: now }, tierWorlds: { ...save.tierWorlds, [tier]: world } }
}

function ownedOf(world: TierWorld, outfitId: string): OwnedUma {
  const uma = world.umas[outfitId]
  if (!uma) throw new SaveRuleError('not-owned', 'only owned Umas can fight')
  return uma
}

// --- Classes (D86) ---------------------------------------------------------------------------------------------------

/** The class she fights as: the chosen one, or her best running style's. */
export function activeClass(outfit: BattleOutfit, uma: Pick<OwnedUma, 'classId'>): RpgClass {
  return uma.classId ?? rpgDefaultClass(best(outfit.aptitudes.strategy)[0])
}

/** Her setup for a class: what she saved, or its default five weapons with nothing learned and skills chosen for her. */
export const classOf = (uma: Pick<OwnedUma, 'classes'>, classId: RpgClass): ClassLoadout =>
  uma.classes[classId] ?? { weapons: rpgDefaultWeapons(classId), tree: [], loadout: null }

/** Her battle profile as a class (the active one by default); its Class Rank opens the depths (D102). */
export function umaProfile(outfit: BattleOutfit, uma: OwnedUma, tier: number, classId: RpgClass = activeClass(outfit, uma)): RpgProfile {
  const growth = (key: keyof BattleOutfit['growthRatePercents']) => Math.min(1, Math.max(0, outfit.growthRatePercents[key] / 100))
  const setup = classOf(uma, classId)
  return {
    outfitId: outfit.outfitId,
    baseStats: { ...outfit.baseStats },
    growthRates: { speed: growth('speed'), stamina: growth('stamina'), power: growth('power'), guts: growth('guts'), wit: growth('wit') },
    classId, weapons: [...setup.weapons], tier, level: uma.level, exp: uma.exp,
    tree: setup.tree.map((id) => ({ tier, id })), legacy: [],
    classRank: classRankOf(uma.ranks, classId),
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

/** Sets the five weapons a Summoner, Spell Blade or Cleric wields (a Brawler's and a Mage's are fixed). */
export function setClassWeapons(save: Save, outfitId: string, classId: RpgClass, weapons: readonly RpgWeapon[], now: string, tier = TIER_ONE): Save {
  const uma = ownedOf(worldOf(save, tier), outfitId)
  if (!validRpgWeapons(classId, weapons)) throw new SaveRuleError('bad-loadout', 'those weapons don’t fit this class’s slots')
  return withClass(save, outfitId, classId, { ...classOf(uma, classId), weapons: [...weapons] }, now, tier)
}

/**
 * Puts a weapon in one of a class's five slots (D98); the weapons in her slots are the trees she fights with. Every Uma
 * holds a Training weapon of all ten kinds (grade 0, no stats), so a null `gearId` means the Training one, and a crafted
 * piece of that kind is worn instead (from her locker, or from the stock, binding it). A Summoner, Spell Blade or Cleric
 * can change a slot's weapon within the slot's kind (one already in another slot swaps places); a Brawler's and a
 * Mage's slots keep theirs. A crafted piece serves every class that holds its weapon.
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
    if (uma.gear.equipped[weapon] !== gearId) next = equipGear(next, outfitId, gearId, now, tier)
  } else if (uma.gear.equipped[weapon]) next = unequipGear(next, outfitId, weapon, now, tier)
  return next
}

/** Learns a side skill. With skills she picked herself, a new one goes straight into a free slot. */
export function learnSkill(save: Save, outfit: BattleOutfit, classId: RpgClass, nodeId: string, now: string, tier = TIER_ONE): Save {
  const uma = ownedOf(worldOf(save, tier), outfit.outfitId)
  let profile: RpgProfile
  try {
    profile = learnRpgNode(umaProfile(outfit, uma, Number(tier), classId), nodeId)
  } catch (err) {
    throw new SaveRuleError('cannot-learn', err instanceof Error ? err.message : 'cannot learn that')
  }
  const current = classOf(uma, classId)
  const loadout = current.loadout !== null && current.loadout.length < rpgActiveSlots(uma.level) ? [...current.loadout, nodeId] : current.loadout
  return withClass(save, outfit.outfitId, classId, { ...current, tree: profile.tree.map((r) => r.id), loadout }, now, tier)
}

/** Swaps out a learned side skill: its points come back and it leaves the loadout. */
export function forgetSkill(save: Save, outfit: BattleOutfit, classId: RpgClass, nodeId: string, now: string, tier = TIER_ONE): Save {
  const uma = ownedOf(worldOf(save, tier), outfit.outfitId)
  let profile: RpgProfile
  try {
    profile = forgetRpgVariant(umaProfile(outfit, uma, Number(tier), classId), nodeId)
  } catch (err) {
    throw new SaveRuleError('cannot-learn', err instanceof Error ? err.message : 'cannot swap that out')
  }
  const current = classOf(uma, classId)
  return withClass(save, outfit.outfitId, classId, { ...current, tree: profile.tree.map((r) => r.id), loadout: current.loadout?.filter((id) => id !== nodeId) ?? null }, now, tier)
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

/** Every stat point she brings to a fight: her active Extra Stats nodes (S6) and her armor (S7, D104). */
export function umaPoints(uma: OwnedUma, classId: RpgClass): Points {
  const { gear, extra } = umaPointParts(uma, classId)
  return addPoints(extra, gear)
}
/** Her points apart: what her armor gives, and her active Extra Stats nodes. (Weapons add Might to their hits instead.) */
export function umaPointParts(uma: OwnedUma, _classId?: RpgClass): { gear: Points; extra: Points } {
  return { gear: equippedPoints(uma.gear.equipped), extra: starPoints(uma.stars.active) }
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

/** Starts a fight on a region's stage with the active party's five members as their active classes. */
export function startFight(save: Save, region: RpgCampaignChapter, nodeId: string, outfits: ReadonlyMap<string, BattleOutfit>,
  now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const party = world.world.activeParty
  const slots = world.parties[party]?.slots
  if (!slots) throw new SaveRuleError('bad-party', `party ${party} doesn't exist`)
  if (slots.some((s) => s === null) || slots.length !== PARTY_SIZE) throw new SaveRuleError('cannot-fight', 'a fight needs a full party of five')
  if (openFightOf(world)) throw new SaveRuleError('cannot-fight', 'a fight is already open')
  const busy = (slots as string[]).filter((id) => workOf(world, id))
  if (busy.length) throw new SaveRuleError('busy', `${busy.length === 1 ? 'one member is' : `${busy.length} members are`} working: recall them first`)
  const members: RpgPartyMember[] = (slots as string[]).map((id) => {
    const outfit = outfits.get(id)
    if (!outfit) throw new SaveRuleError('cannot-fight', `outfit ${id} isn't in the game data`)
    const uma = ownedOf(world, id)
    const classId = activeClass(outfit, uma)
    const orb = equippedOrb(uma.gear.equipped)
    const { barrier, regen } = equippedGuard(uma.gear.equipped)
    return { profile: umaProfile(outfit, uma, Number(tier), classId), loadout: umaLoadout(outfit, uma, Number(tier), classId),
      ...(orb ? { orb } : {}), points: umaPoints(uma, classId), might: equippedMight(uma.gear.equipped, classOf(uma, classId).weapons), barrier, regen,
      ...heroFields(world, id) }
  })
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
  /** Unlock Tickets the Shards completed. */
  tickets: number
  /** Marks banked from EXP past max ranks (D102). */
  gearMarks: number
  classMarks: number
  /** The stage's first clear: its Laurels pay triple (D66); later wins pay a quarter of it (D79). */
  firstClear?: boolean
}

/** One bar a member filled: which, how much EXP, and the track before and after. */
export interface RankGain { ref: RankRef; exp: number; before: RankTrack; after: RankTrack }
/** What a won fight paid one member: Uma EXP and levels, Shards, her Class, Weapon and Armor bars (D102), and her Bonds
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
 * Closes a finished fight. A win pays every entrant (KO'd included) EXP, a Shard at Lv10/20/30/40/50 in Tier 1, the
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
  const paid = payEntrants(world, entrants, kind, node.level, Math.round(stageLaurels(kind, chapter.tier, firstClear, node.level) * pay), tier, share * pay)
  Object.assign(result, { members: paid.members, shards: paid.shards, tickets: paid.tickets, laurels: paid.laurels, gearMarks: paid.gearMarks,
    classMarks: paid.classMarks, firstClear })
  const next: TierWorld = { ...paid.world, world: { ...world.world, run: closed } }
  return { save: withWorld(save, tier, next, now), result }
}

/**
 * Pays a won fight to its entrants (D102). Each earns her Uma EXP `E` (a share of her own level, less when the foes are
 * below her, times `share` on a replay, D79) and with it fills her bars: 2E to the class she fought as, 5E over her five
 * weapons (double for each she used), E to each of her five armor kinds. EXP past a max rank banks at half rate as
 * Marks. A Learner's Bonds fill too (D106). A Shard at Lv10/20/30/40/50 in Tier 1 (five make a Ticket), and the world's Laurels. Shared by fights and Sweeps.
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
    let ranks: Ranks = uma.ranks
    const gains: RankGain[] = []
    const fill = (ref: RankRef, amount: number) => {
      if (amount <= 0) return
      const before = trackOf(ranks, ref)
      const r = grantTrack(before, ref.kind, amount)
      ranks = withTrack(ranks, ref, r.track)
      const marks = Math.floor(r.overflow * MARKS_SHARE)
      if (ref.kind === 'class') classMarks += marks
      else gearMarks += marks
      gains.push({ ref, exp: amount, before, after: r.track })
    }
    fill({ kind: 'class', id: e.classId }, CLASS_EXP_SHARE * exp)
    for (const [w, n] of Object.entries(weaponExpShares(e.weapons, e.used, exp))) fill({ kind: 'weapon', id: w as RpgWeapon }, n ?? 0)
    for (const slot of ARMOR_SLOTS) fill({ kind: 'armor', id: slotKind(uma.gear, slot) }, ARMOR_EXP_SHARE * exp)
    // Bonds (D106) pay by the stage alone: every won fight counts, replays and Sweeps too.
    const bonded = payBonds(world, e.outfitId, { ...uma, level: gained.level, exp: gained.exp, ranks }, kind)
    umas[e.outfitId] = bonded.uma
    members.push({ outfitId: e.outfitId, exp, beforeLevel: uma.level, afterLevel: gained.level, afterExp: gained.exp, shards: got, ranks: gains,
      bonds: bonded.gains })
    shards += got
  }
  const pooled = world.wallet.shards + shards
  const tickets = Math.floor(pooled / SHARDS_PER_TICKET)
  const wallet = { ...world.wallet, unlockTickets: world.wallet.unlockTickets + tickets, shards: pooled % SHARDS_PER_TICKET, laurels: world.wallet.laurels + laurels,
    gearMarks: world.wallet.gearMarks + gearMarks, classMarks: world.wallet.classMarks + classMarks }
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
