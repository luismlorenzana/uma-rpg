// The game store and its sync engine (D32): the save lives on the device (Dexie) and in a Zustand store; every change
// writes both at once and schedules a background sync. Gameplay never waits on the network. One tier world is on screen at
// a time (H35): `activeTier` picks it, every screen reads it and every action writes to it.
import {
  type AccessoryFamily, type AccessorySlot, type ArmorKind, type ArmorSlot, type GradeTarget, type RankRef, type RpgQueueInput, type Shelf, type WorkOutfit, type GearSlot,
  BATTLE_ENGINE_VERSION, markGrantSeen, newSave, ownerTier, renameParty, renameTrainer, repairCallingChoices, savedTiers, setPartyLead, setPartySlot, startingClass, tierKey, type StartingOutfit, unlockUma, wearClassPreset, type BattleAction, type BattleOutfit, type BattleStep, type CallingRepairOutfit, type FightResult, type RpgBranch, type RpgClass,
  type RpgCampaignChapter, type RpgDamageKind, type RpgWeapon, type Save, type TierWorld, type EchoLevel, type EnemyRoster, type RiftFightRef, type RiftFront,
  type WorkContext,
} from '@rpg/domain'
import type { AscendSummary, RiftFightResult } from '@rpg/domain/rift'
import { useMemo } from 'react'
import { create } from 'zustand'
import type { AlbumScope } from '../album/rows'
import { conflictEnvelope, saveApi } from '../api/client'
import { masterRoster } from '../master/master'
import { readSaveRow, writeSaveRow } from './db'
import { reconcile } from './reconcile'
import { rememberedTier, rememberTier, startTier } from './tier'
import { tradeOfWorld } from './trade'

export type GameStatus = 'idle' | 'booting' | 'first-launch' | 'ready'
export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'offline' | 'error'

export interface GameState {
  uid: string | null
  status: GameStatus
  save: Save | null
  /** The server revision the save is based on (0 = never synced). */
  revision: number
  dirty: boolean
  sync: SyncStatus
  lastSyncedAt: string | null
  /** The tier world on screen (H35). The save always has its world once loaded. */
  activeTier: number
}

const INITIAL: GameState = { uid: null, status: 'idle', save: null, revision: 0, dirty: false, sync: 'idle', lastSyncedAt: null, activeTier: 1 }

export const useGame = create<GameState>(() => INITIAL)

const nowIso = () => new Date().toISOString()

function persist(): Promise<void> {
  const { uid, save, revision, dirty } = useGame.getState()
  if (!uid || !save) return Promise.resolve()
  return writeSaveRow({ id: 'main', uid, revision, save, dirty })
}

/** The tier a loaded save opens on (`asked` first, from a `?tier=` link), remembered on the device. */
function openTier(save: Save, asked: string | null): number {
  const tier = startTier(save, asked, rememberedTier())
  rememberTier(tier)
  return tier
}

/**
 * Loads the device save, or the server's, or asks for a trainer name. Safe to call again for the same uid. `askedTier` is
 * the `?tier=` the app was opened with, so the first screen is already on that world.
 */
export async function boot(uid: string, askedTier: string | null = null): Promise<void> {
  const state = useGame.getState()
  if (state.uid === uid && state.status !== 'idle') return
  useGame.setState({ ...INITIAL, uid, status: 'booting' })
  const row = await readSaveRow(uid)
  if (row) {
    useGame.setState({ status: 'ready', save: row.save, revision: row.revision, dirty: row.dirty, activeTier: openTier(row.save, askedTier) })
    void syncNow()
    return
  }
  try {
    const remote = await saveApi.load()
    if (remote.save) {
      useGame.setState({ status: 'ready', save: remote.save, revision: remote.revision, dirty: false, sync: 'synced', lastSyncedAt: nowIso(),
        activeTier: openTier(remote.save, askedTier) })
      await persist()
      return
    }
  } catch {
    // Offline on a fresh device: create the account locally; sync adopts or merges it later.
  }
  useGame.setState({ status: 'first-launch' })
}

/**
 * Puts another tier world on screen and remembers it. False, changing nothing, when the save has no world for that tier.
 * It never navigates: the shell remounts on the new world where it is (H35), and the Tier shifter picks the page (H36).
 */
export function setActiveTier(tier: number): boolean {
  const { save } = useGame.getState()
  if (!save || !Number.isInteger(tier) || !save.tierWorlds[tierKey(tier)]) return false
  useGame.setState({ activeTier: tier })
  rememberTier(tier)
  return true
}

/** The tier world on screen. */
export function useActiveTier(): number {
  return useGame((s) => s.activeTier)
}

/** The active tier's key, read when an action is called: a switch afterwards never moves its write to another world. */
const activeKey = (): string => tierKey(useGame.getState().activeTier)

export function resetGame(): void {
  useGame.setState(INITIAL)
}

async function commit(save: Save): Promise<void> {
  useGame.setState({ save, dirty: true })
  await persist()
  scheduleSync()
}

export async function createAccount(trainerName: string): Promise<void> {
  useGame.setState({ status: 'ready', activeTier: 1 })
  rememberTier(1)
  await commit(newSave(trainerName, nowIso()))
}

/** D220: master-data-aware repair for the calling rows whose eligibility changed. Idempotent on every app boot. */
export async function repairCallingRule(roster: readonly CallingRepairOutfit[]): Promise<void> {
  const { save } = useGame.getState()
  if (!save) return
  const next = repairCallingChoices(save, roster, nowIso())
  if (next !== save) await commit(next)
}

/** Save v32's class reset (H130, live from H134): the trades the new calling moved settle once the roster has loaded
 * (`settleClassesV3Trades`, CV28). Its rules load only while a world's record waits for them; until H134 no save has one. */
export async function settleClassResetTrades(roster: readonly CallingRepairOutfit[]): Promise<void> {
  const waiting = (save: Save | null) => !!save && Object.values(save.tierWorlds).some((world) => world.classesV3 && !world.classesV3.traded)
  if (!waiting(useGame.getState().save)) return
  const { settleClassesV3Trades } = await import('@rpg/domain/battle')
  const { save } = useGame.getState()
  if (!save) return
  const next = settleClassesV3Trades(save, roster, nowIso())
  if (next !== save) await commit(next)
}

/** Throws SaveParseError when the name isn't 1–24 characters. The account is shared by every tier. */
export async function renameAccount(trainerName: string): Promise<void> {
  const { save } = useGame.getState()
  if (!save) return
  await commit(renameTrainer(save, trainerName, nowIso()))
}

/** The world's first-launch sheet was seen (R2, PP25): it shows once per world; the Account reopens it. */
export async function seeGrant(): Promise<void> {
  const { save } = useGame.getState()
  if (!save) return
  const next = markGrantSeen(save, activeKey(), nowIso())
  if (next !== save) await commit(next)
}

/** Spends one Uma Ticket (final, D44); she starts in her starting class's armor (D160 §7). Throws SaveRuleError when it can't. */
export async function unlock(outfit: Pick<BattleOutfit, 'outfitId'> & StartingOutfit): Promise<void> {
  const { save } = useGame.getState()
  if (save) await commit(unlockUma(save, outfit.outfitId, nowIso(), activeKey(), startingClass(outfit, BATTLE_ENGINE_VERSION, activeKey())))
}

/** Puts an owned Uma in a party slot, moving her from any other (D46); null empties the slot. */
export async function setSlot(party: number, slot: number, outfitId: string | null): Promise<void> {
  const { save } = useGame.getState()
  if (save) await commit(setPartySlot(save, party, slot, outfitId, nowIso(), activeKey()))
}

/** Makes an existing party member its lead without changing slot order; she represents it in fight pickers. */
export async function leadParty(party: number, outfitId: string): Promise<void> {
  const { save } = useGame.getState()
  if (save) await commit(setPartyLead(save, party, outfitId, nowIso(), activeKey()))
}

export async function nameParty(party: number, name: string): Promise<void> {
  const { save } = useGame.getState()
  if (save) await commit(renameParty(save, party, name, nowIso(), activeKey()))
}

// --- Battles (S3) ---------------------------------------------------------------------------------------------

const edit = async <Rules,>(rules: Promise<Rules>, change: (rules: Rules, save: Save, now: string, tier: string) => Save): Promise<void> => {
  // The tier is the one on screen when the action was called, even if the player switches before the import resolves.
  const tier = activeKey()
  const loaded = await rules
  // Read after the lazy import: overlapping cold actions must never commit a stale captured save.
  const { save } = useGame.getState()
  if (save) await commit(change(loaded, save, nowIso(), tier))
}

/** Switches her active class for free (D86). */
export const pickClass = (outfitId: string, classId: RpgClass) => edit(import('@rpg/domain/battle'), (d, s, now, t) => d.chooseClass(s, outfitId, classId, now, t))
/** Takes line A or B on one of her class's trees (CP18, H69's `pickBranch`): free, her equipped skills follow. */
export const takeBranch = (outfit: BattleOutfit, classId: RpgClass, weapon: RpgWeapon, branch: RpgBranch) =>
  edit(import('@rpg/domain/battle'), (d, s, now, t) => d.pickBranch(s, outfit, classId, weapon, branch, now, t))
/** Picks her calling, one of her row's two (CP29, H69's `pickCalling`); at Uma Lv 1 her class follows. */
export const chooseCalling = (outfit: BattleOutfit, pick: RpgClass) =>
  edit(import('@rpg/domain/battle'), (d, s, now, t) => d.pickCalling(s, outfit, pick, now, t))
/** Makes her calling final (CP29, H69's `confirmCalling`). */
export const confirmCallingPick = (outfitId: string) => edit(import('@rpg/domain/battle'), (d, s, now, t) => d.confirmCalling(s, outfitId, now, t))
/** Sets several Umas' class weapons in one save (the Rift's guided build, v16, CP7): weapons are owned per kind, so it
 * costs nothing; her equipped skills of a tree she stops slotting leave her loadout (H69). */
export const wieldWeapons = (members: readonly { outfitId: string; classId: RpgClass; weapons: readonly RpgWeapon[] }[]) =>
  edit(import('@rpg/domain/battle'), (d, s, now, t) => members.reduce((next, m) => d.setClassWeapons(next, m.outfitId, m.classId, m.weapons, now, t), s))
/** Equips skills in order, or null to have them chosen for her (D86). */
export const equip = (outfit: BattleOutfit, classId: RpgClass, loadout: string[] | null) => edit(import('@rpg/domain/battle'), (d, s, now, t) => d.equipSkills(s, outfit, classId, loadout, now, t))
export const beginFight = (region: RpgCampaignChapter, nodeId: string, outfits: ReadonlyMap<string, BattleOutfit>) =>
  edit(import('@rpg/domain/battle'), (d, s, now, t) => d.startFight(s, region, nodeId, outfits, now, t))
export const leaveFight = () => edit(import('@rpg/domain/battle'), (d, s, now, t) => d.retreat(s, now, t))
/** Refills the active party's MP at a Spring (D66). */
export const drinkAtSpring = (springId: string) => edit(import('@rpg/domain/battle'), (d, s, now, t) => d.useSpring(s, springId, now, t))
export const chooseActiveParty = (party: number) => edit(import('@rpg/domain/battle'), (d, s, now, t) => d.setActiveParty(s, party, now, t))

/** One action in the party's open fight. Saved at once; when it ends the fight, the rewards land in the same save. */
export async function fightAction(region: RpgCampaignChapter, action: BattleAction): Promise<{ step: BattleStep; result: FightResult | null }> {
  const tier = activeKey()
  const { actInFight } = await import('@rpg/domain/battle')
  const { save } = useGame.getState()
  if (!save) throw new Error('No save loaded')
  const acted = actInFight(save, region, action, nowIso(), tier)
  await commit(acted.save)
  return { step: acted.step, result: acted.result }
}

// --- The Rift (H50) -----------------------------------------------------------------------------------------------
// Every rule is lazy (`@rpg/domain/rift`); `roster` is the enemy cast (`campaign.cast.members`), which the generator draws
// faces from.

/** Signs twenty Lv 50 Umas up as a run's roster. */
export const signUpForRift = (roster: readonly string[]) => edit(import('@rpg/domain/rift'), (d, s, now, t) => d.signUpRift(s, roster, now, t))
/** Cancels an untouched run. */
export const cancelRiftSignUp = () => edit(import('@rpg/domain/rift'), (d, s, now, t) => d.cancelRiftRun(s, now, t))
/** Opens a Rift fight: a front stage or an Echo by world party `party`, a Convergence fight by its attempt's party (null). */
export const beginRiftFight = (ref: RiftFightRef, party: number | null, outfits: ReadonlyMap<string, BattleOutfit>, roster: EnemyRoster) =>
  edit(import('@rpg/domain/rift'), (d, s, now, t) => d.startRiftFight(s, ref, party, outfits, roster, now, t))
/** Begins a Convergence attempt with four world parties: Iron's, Arcane's, Duel's and Horde's. */
export const startConvergence = (parties: readonly number[], outfits: ReadonlyMap<string, BattleOutfit>) =>
  edit(import('@rpg/domain/rift'), (d, s, now, t) => d.beginConvergence(s, parties, now, t, outfits))
/** Ends the open attempt between fights. */
export const endConvergence = () => edit(import('@rpg/domain/rift'), (d, s, now, t) => d.abandonConvergence(s, now, t))
/** Leaves the open Rift fight (a Convergence fight's attempt ends with it). */
export const retreatRift = () => edit(import('@rpg/domain/rift'), (d, s, now, t) => d.leaveRiftFight(s, now, t))

/** One action in the open Rift fight; when it ends the fight, it's settled in the same save. */
export async function riftFightAction(action: BattleAction, roster: EnemyRoster): Promise<{ step: BattleStep; result: RiftFightResult | null }> {
  const tier = activeKey()
  const { actInRiftFight } = await import('@rpg/domain/rift')
  const { save } = useGame.getState()
  if (!save) throw new Error('No save loaded')
  const acted = actInRiftFight(save, action, roster, nowIso(), tier)
  await commit(acted.save)
  return { step: acted.step, result: acted.result }
}

/** Sweeps a won Echo up to `times` times with world party `party`; returns the summed result. */
export async function sweepEchoes(front: RiftFront, level: EchoLevel, party: number, times: number, outfits: ReadonlyMap<string, BattleOutfit>): Promise<RiftFightResult> {
  const tier = activeKey()
  const { sweepEcho } = await import('@rpg/domain/rift')
  const { save } = useGame.getState()
  if (!save) throw new Error('No save loaded')
  const r = sweepEcho(save, front, level, party, times, outfits, nowIso(), tier)
  await commit(r.save)
  return r.result
}

/** Ascends the won run's twenty to the next tier. It doesn't switch tiers: the caller does, behind the veil. */
export async function ascendRun(): Promise<AscendSummary> {
  const tier = activeKey()
  const { ascend } = await import('@rpg/domain/rift')
  const { save } = useGame.getState()
  if (!save) throw new Error('No save loaded')
  const r = ascend(save, nowIso(), tier)
  await commit(r.save)
  return r.summary
}

// --- Work and the Exchange (S4) ----------------------------------------------------------------------------------

/** What R2's work rules ask of the caller (R2's build decision 8): each Uma's trade, from the master roster. Before the
 * switch the live env ignores it. */
function workContext(save: Save, tier: string): WorkContext {
  const roster = masterRoster()
  const world = save.tierWorlds[tier]
  return roster && world ? { tradeOf: tradeOfWorld(world, roster) } : {}
}

export const startWork = (placeId: string, slot: number, outfit: WorkOutfit, output: string, count: number) =>
  edit(import('@rpg/domain/work'), (d, s, now, t) => d.startJob(s, placeId, slot, outfit, output, count, now, t, workContext(s, t)))
export const recall = (placeId: string, slot: number) => edit(import('@rpg/domain/work'), (d, s, now, t) => d.recallJob(s, placeId, slot, now, t))
/** Spends Speed Tickets on a job, 30 minutes each (D74). */
export const cutTime = (placeId: string, slot: number, tickets: number) => edit(import('@rpg/domain/work'), (d, s, now, t) => d.cutJobTime(s, placeId, slot, tickets, now, t))
/** Queues another job after the slot's current one, same Uma (QoL, D62). */
export const queueWork = (placeId: string, slot: number, outfit: WorkOutfit, output: string, count: number) =>
  edit(import('@rpg/domain/work'), (d, s, now, t) => d.queueJob(s, placeId, slot, outfit, output, count, now, t, workContext(s, t)))
export const unqueueWork = (placeId: string, slot: number, index: number) => edit(import('@rpg/domain/work'), (d, s, now, t) => d.unqueueJob(s, placeId, slot, index, now, t))
export const editWorkQueue = (input: RpgQueueInput) =>
  edit(import('@rpg/domain/work'), (d, s, now, t) => d.editWorkerQueue(s, input, now, t, workContext(s, t)))
export const upgrade = (placeId: string) => edit(import('@rpg/domain/work'), (d, s, now, t) => d.upgradeFacility(s, placeId, now, t))
/** Finishes every running job of a place at once (R2, PP25): each one's remaining time in Speed Tickets. */
export const finishAll = (placeId: string) => edit(import('@rpg/domain/work'), (d, s, now, t) => d.finishAllAt(s, placeId, now, t))
/** Buys raw items: by grade to engine v16 (`stockedGrades`), by type from R2 (`stockedTypes`). */
export const buyItem = (itemId: string, quantity: number, stocked: readonly number[] | readonly string[]) => edit(import('@rpg/domain/exchange'), (d, s, now, t) => d.buyRawItem(s, itemId, quantity, stocked, now, t))
export const buyTicket = (kind: 'time' | 'sweep', quantity: number) => edit(import('@rpg/domain/exchange'), (d, s, now, t) => d.buyTickets(s, kind, quantity, now, t))
export const sell = (shelf: Shelf, id: string, quantity: number) => edit(import('@rpg/domain/exchange'), (d, s, now, t) => d.sellStock(s, shelf, id, quantity, now, t))
/** Reads Manuals for one Uma's bar: 1,000 Marks for 1,000 EXP each (D102). */
export const readManual = (outfitId: string, ref: RankRef, count: number) => edit(import('@rpg/domain/exchange'), (d, s, now, t) => d.readManuals(s, outfitId, ref, count, now, t))

/** She sets a Star Gem: one node opens on her map (D144). Returns the node. */
export async function setStarGem(outfitId: string, gemId: string): Promise<string> {
  const tier = activeKey()
  const { setGem } = await import('@rpg/domain/observatory')
  const { save } = useGame.getState()
  if (!save) throw new Error('No save loaded')
  const r = setGem(save, outfitId, gemId, nowIso(), tier)
  await commit(r.save)
  return r.node
}
export const activate = (outfitId: string, nodes: string[]) => edit(import('@rpg/domain/observatory'), (d, s, now, t) => d.setActiveNodes(s, outfitId, nodes, now, t))
/** Opens one v3 Extra Stats node with a jewel from the Warehouse. */
export const setMapJewel = (outfitId: string, jewelId: string, node: string) =>
  edit(import('@rpg/domain/observatory'), (d, s, now, t) => d.setJewel(s, outfitId, jewelId, node, now, t))
export const wear = (outfitId: string, gearId: string) => edit(import('@rpg/domain/forge'), (d, s, now, t) => d.equipGear(s, outfitId, gearId, now, t))
export const takeOff = (outfitId: string, slot: GearSlot) => edit(import('@rpg/domain/forge'), (d, s, now, t) => d.unequipGear(s, outfitId, slot, now, t))
/** Puts an armor kind in one of her five armor slots: its Training piece (null) or a crafted one (D103). */
export const wearArmorPiece = (outfitId: string, slot: ArmorSlot, kind: ArmorKind, gearId: string | null) =>
  edit(import('@rpg/domain/forge'), (d, s, now, t) => d.wearArmor(s, outfitId, slot, kind, gearId, now, t))
/** Puts an accessory in one of her two accessory slots, or empties it (null) (D124). */
export const wearAccessoryPiece = (outfitId: string, slot: AccessorySlot, gearId: string | null) =>
  edit(import('@rpg/domain/forge'), (d, s, now, t) => d.wearAccessory(s, outfitId, slot, gearId, now, t))
/** Puts on a class's standard preset (H33, D164): weapons, armor and accessories, binding what it takes from the stock. */
export async function wearPreset(outfitId: string, classId: RpgClass, family?: AccessoryFamily | null): Promise<void> {
  const { save } = useGame.getState()
  if (!save) return
  const next = wearClassPreset(save, outfitId, classId, nowIso(), activeKey(), undefined, family)
  if (next !== save) await commit(next)
}
/** Raises one R2 gear slot, or several grades after the sheet's confirmation. */
export const raiseGear = (outfitId: string, target: GradeTarget, to?: number) => edit(import('@rpg/domain/forge'), (d, s, now, t) =>
  to === undefined ? d.raiseGrade(s, outfitId, target, now, t) : d.raiseGradeTo(s, outfitId, target, to, now, t))
/** Changes an R2 accessory's form without changing its grade. */
export const chooseAccessoryForm = (outfitId: string, classId: RpgClass, slot: number, family: AccessoryFamily | null, kind?: RpgDamageKind) =>
  edit(import('@rpg/domain/forge'), (d, s, now, t) => d.setAccessoryForm(s, outfitId, classId, slot, family, kind, now, t))
/** Marks or unmarks an Uma as a target (D100). */
export const markTarget = (outfitId: string, on: boolean) => edit(import('@rpg/domain/targets'), (d, s, now, t) => d.setTarget(s, outfitId, on, now, t))
/** The Halls of Heroes (D106): seat or swap a Hero (null empties the seat), and add or remove a Learner. */
export const appointHero = (seat: string, outfitId: string | null) => edit(import('@rpg/domain/heroes'), (d, s, now, t) => d.setHero(s, seat, outfitId, now, t))
export const addLearner = (seat: string, outfitId: string) => edit(import('@rpg/domain/heroes'), (d, s, now, t) => d.addLearner(s, seat, outfitId, now, t))
export const removeLearner = (seat: string, outfitId: string) => edit(import('@rpg/domain/heroes'), (d, s, now, t) => d.removeLearner(s, seat, outfitId, now, t))
/** Puts a weapon in a class's slot: its Training one (null) or a crafted piece (D98). */
export const hold = (outfitId: string, classId: RpgClass, slot: number, weapon: RpgWeapon, gearId: string | null) =>
  edit(import('@rpg/domain/battle'), (d, s, now, t) => d.holdWeapon(s, outfitId, classId, slot, weapon, gearId, now, t))

/** Collects one job; returns what it gave. */
export async function collect(placeId: string, slot: number): Promise<{ items: number; levelsUp: number }> {
  const tier = activeKey()
  const { collectJob } = await import('@rpg/domain/work')
  const { save } = useGame.getState()
  if (!save) return { items: 0, levelsUp: 0 }
  const r = collectJob(save, placeId, slot, nowIso(), tier)
  await commit(r.save)
  return r.got
}

/** Collects every ready job of the active world (on these places, or everywhere). */
export async function collectEverything(placeIds?: readonly string[]): Promise<{ items: number; levelsUp: number }> {
  const tier = activeKey()
  const { collectAll } = await import('@rpg/domain/work')
  const { save } = useGame.getState()
  if (!save) return { items: 0, levelsUp: 0 }
  const r = collectAll(save, nowIso(), placeIds, tier)
  if (r.items > 0 || r.save.tierWorlds[tier] !== save.tierWorlds[tier]) await commit(r.save)
  return { items: r.items, levelsUp: r.levelsUp }
}

/** Starts her last job again where she did it, collecting first when she's ready (SC3). */
export const repeatWork = (outfitId: string) => edit(import('@rpg/domain/work'), (d, s, now, t) => d.repeatJob(s, outfitId, now, t, workContext(s, t)))
/** A queue that couldn't start (SC3): start it again now, or forget it. */
export const restartWork = (outfitId: string) => edit(import('@rpg/domain/work'), (d, s, now, t) => d.restartStopped(s, outfitId, now, t, workContext(s, t)))
export const dismissWork = (outfitId: string) => edit(import('@rpg/domain/work'), (d, s, now, t) => d.dismissStopped(s, outfitId, now, t))
/** Shared work screens address an Uma and preserve the exact entry identity for late speed-up taps. */
export const collectWorker = async (outfitId: string): Promise<{ items: number; levelsUp: number }> => {
  const tier = activeKey()
  const { collectWorker: collectOne } = await import('@rpg/domain/work')
  const { save } = useGame.getState()
  if (!save) return { items: 0, levelsUp: 0 }
  const r = collectOne(save, outfitId, nowIso(), tier)
  await commit(r.save)
  return r.got
}
export const recallWorker = (outfitId: string) => edit(import('@rpg/domain/work'), (d, s, now, t) => d.recallWorker(s, outfitId, now, t))
export const speedWorker = (outfitId: string, startedAt: number, tickets: number) =>
  edit(import('@rpg/domain/work'), (d, s, now, t) => d.speedWorker(s, outfitId, startedAt, tickets, now, t))
export const finishWorker = (outfitId: string, startedAt: number) =>
  edit(import('@rpg/domain/work'), (d, s, now, t) => d.finishWorker(s, outfitId, startedAt, now, t))

/** Sweeps a beaten fight up to `times` times; returns the summed result and how many it did. */
export async function sweep(region: RpgCampaignChapter, nodeId: string, outfits: ReadonlyMap<string, BattleOutfit>, times = 1): Promise<FightResult & { swept: number }> {
  const tier = activeKey()
  const { sweepMany } = await import('@rpg/domain/exchange')
  const { save } = useGame.getState()
  if (!save) throw new Error('No save loaded')
  const r = sweepMany(save, region, nodeId, times, outfits, nowIso(), tier)
  await commit(r.save)
  return { ...r.result, swept: r.swept }
}

/** The active tier's world, or null before boot. */
export function useWorld(): TierWorld | null {
  return useGame((s) => s.save?.tierWorlds[tierKey(s.activeTier)] ?? null)
}

/** Who the album lists in a tier (H35): the world's own Umas, and in Tier 1 the outfits no world owns (D5). */
export function albumScope(save: Pick<Save, 'tierWorlds'> | null | undefined, tier: number): AlbumScope {
  const elsewhere = new Set<string>()
  if (save) for (const t of savedTiers(save)) if (t !== tier) for (const id of Object.keys(save.tierWorlds[tierKey(t)]!.umas)) elsewhere.add(id)
  return { tier, elsewhere }
}

/** The active tier's album scope, for every `albumRows` caller. */
export function useAlbumScope(): AlbumScope {
  const tier = useActiveTier()
  const worlds = useGame((s) => s.save?.tierWorlds)
  // Keyed by who lives elsewhere, so the scope keeps its identity while only the active world changes.
  const others = useMemo(() => [...albumScope(worlds && { tierWorlds: worlds }, tier).elsewhere].sort().join(','), [worlds, tier])
  return useMemo(() => ({ tier, elsewhere: new Set(others ? others.split(',') : []) }), [tier, others])
}

/** The tier whose world owns an outfit, or null (H35: an Uma lives in one world). */
export function useOwnerTier(outfitId: string): number | null {
  return useGame((s) => (s.save ? ownerTier(s.save, outfitId) : null))
}

// --- Sync -------------------------------------------------------------------------------------------------------

let timer: ReturnType<typeof setTimeout> | null = null
let running: Promise<void> | null = null
let again = false

function scheduleSync(delayMs = 1500): void {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    timer = null
    void syncNow()
  }, delayMs)
}

/** One sync pass: read the server, then adopt, push, or do nothing (reconcile.ts). Concurrent calls coalesce. */
export function syncNow(): Promise<void> {
  if (running) {
    again = true
    return running
  }
  running = (async () => {
    do {
      again = false
      await syncPass()
    } while (again)
  })().finally(() => {
    running = null
  })
  return running
}

async function syncPass(): Promise<void> {
  const start = useGame.getState()
  if (!start.uid || !start.save) return
  useGame.setState({ sync: 'syncing' })
  try {
    let remote = await saveApi.load()
    for (let attempt = 0; attempt < 3; attempt++) {
      const local = useGame.getState()
      const step = reconcile(local, remote)
      if (step.kind === 'none') break
      if (step.kind === 'adopt') {
        if (useGame.getState().save !== local.save) {
          again = true // edited meanwhile: decide again next pass
          break
        }
        // An adopted save keeps the tier on screen when it has its world; otherwise the start rule picks one (H35).
        const adopted = step.envelope.save
        const { activeTier } = useGame.getState()
        useGame.setState({ save: adopted, revision: step.envelope.revision, dirty: false,
          ...(adopted.tierWorlds[tierKey(activeTier)] ? {} : { activeTier: openTier(adopted, null) }) })
        await persist()
        break
      }
      try {
        const stored = await saveApi.put(step.baseRevision, step.save)
        const changedSince = useGame.getState().save !== step.save
        useGame.setState({ revision: stored.revision, dirty: changedSince })
        await persist()
        if (changedSince) again = true
        break
      } catch (err) {
        const current = conflictEnvelope(err)
        if (!current) throw err
        remote = current // someone else wrote first: reconcile against what's stored now
      }
    }
    useGame.setState({ sync: 'synced', lastSyncedAt: nowIso() })
  } catch {
    useGame.setState({ sync: typeof navigator !== 'undefined' && navigator.onLine === false ? 'offline' : 'error' })
  }
}

/** Syncs when the app comes back to the foreground or the network returns. Returns a stop function. */
export function startSyncTriggers(): () => void {
  const onVisible = () => {
    if (document.visibilityState === 'visible') void syncNow()
  }
  const onOnline = () => void syncNow()
  document.addEventListener('visibilitychange', onVisible)
  window.addEventListener('online', onOnline)
  return () => {
    document.removeEventListener('visibilitychange', onVisible)
    window.removeEventListener('online', onOnline)
  }
}
