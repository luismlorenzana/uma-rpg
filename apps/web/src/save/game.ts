// The game store and its sync engine (D32): the save lives on the device (Dexie) and in a Zustand store; every change
// writes both at once and schedules a background sync. Gameplay never waits on the network.
import {
  type AccessorySlot, type ArmorKind, type ArmorSlot, type RankRef, type RpgQueueInput, type Shelf, type WorkOutfit, type GearSlot,
  newSave, renameParty, renameTrainer, setPartySlot, startingClass, TIER_ONE, unlockUma, wearClassPreset, type BattleAction, type BattleOutfit, type BattleStep, type FightResult, type RpgClass,
  type RpgCampaignChapter, type RpgWeapon, type Save, type TierWorld,
} from '@rpg/domain'
import { create } from 'zustand'
import { conflictEnvelope, saveApi } from '../api/client'
import { readSaveRow, writeSaveRow } from './db'
import { reconcile } from './reconcile'

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
}

const INITIAL: GameState = { uid: null, status: 'idle', save: null, revision: 0, dirty: false, sync: 'idle', lastSyncedAt: null }

export const useGame = create<GameState>(() => INITIAL)

const nowIso = () => new Date().toISOString()

function persist(): Promise<void> {
  const { uid, save, revision, dirty } = useGame.getState()
  if (!uid || !save) return Promise.resolve()
  return writeSaveRow({ id: 'main', uid, revision, save, dirty })
}

/** Loads the device save, or the server's, or asks for a trainer name. Safe to call again for the same uid. */
export async function boot(uid: string): Promise<void> {
  const state = useGame.getState()
  if (state.uid === uid && state.status !== 'idle') return
  useGame.setState({ ...INITIAL, uid, status: 'booting' })
  const row = await readSaveRow(uid)
  if (row) {
    useGame.setState({ status: 'ready', save: row.save, revision: row.revision, dirty: row.dirty })
    void syncNow()
    return
  }
  try {
    const remote = await saveApi.load()
    if (remote.save) {
      useGame.setState({ status: 'ready', save: remote.save, revision: remote.revision, dirty: false, sync: 'synced', lastSyncedAt: nowIso() })
      await persist()
      return
    }
  } catch {
    // Offline on a fresh device: create the account locally; sync adopts or merges it later.
  }
  useGame.setState({ status: 'first-launch' })
}

export function resetGame(): void {
  useGame.setState(INITIAL)
}

async function commit(save: Save): Promise<void> {
  useGame.setState({ save, dirty: true })
  await persist()
  scheduleSync()
}

export async function createAccount(trainerName: string): Promise<void> {
  useGame.setState({ status: 'ready' })
  await commit(newSave(trainerName, nowIso()))
}

/** Throws SaveParseError when the name isn't 1–24 characters. */
export async function renameAccount(trainerName: string): Promise<void> {
  const { save } = useGame.getState()
  if (!save) return
  await commit(renameTrainer(save, trainerName, nowIso()))
}

/** Spends one Uma Ticket (final, D44); she starts in her starting class's armor (D160 §7). Throws SaveRuleError when it can't. */
export async function unlock(outfit: Pick<BattleOutfit, 'outfitId' | 'aptitudes'>): Promise<void> {
  const { save } = useGame.getState()
  if (save) await commit(unlockUma(save, outfit.outfitId, nowIso(), TIER_ONE, startingClass(outfit)))
}

/** Puts an owned Uma in a party slot, moving her from any other (D46); null empties the slot. */
export async function setSlot(party: number, slot: number, outfitId: string | null): Promise<void> {
  const { save } = useGame.getState()
  if (save) await commit(setPartySlot(save, party, slot, outfitId, nowIso()))
}

export async function nameParty(party: number, name: string): Promise<void> {
  const { save } = useGame.getState()
  if (save) await commit(renameParty(save, party, name, nowIso()))
}

// --- Battles (S3) ---------------------------------------------------------------------------------------------

const edit = async <Rules,>(rules: Promise<Rules>, change: (rules: Rules, save: Save, now: string) => Save): Promise<void> => {
  const loaded = await rules
  // Read after the lazy import: overlapping cold actions must never commit a stale captured save.
  const { save } = useGame.getState()
  if (save) await commit(change(loaded, save, nowIso()))
}

/** Switches her active class for free (D86). */
export const pickClass = (outfitId: string, classId: RpgClass) => edit(import('@rpg/domain/battle'), (d, s, now) => d.chooseClass(s, outfitId, classId, now))
/** Learns a side skill in a class; throws SaveRuleError with the reason when she can't. */
export const learn = (outfit: BattleOutfit, classId: RpgClass, nodeId: string) => edit(import('@rpg/domain/battle'), (d, s, now) => d.learnSkill(s, outfit, classId, nodeId, now))
export const unlearn = (outfit: BattleOutfit, classId: RpgClass, nodeId: string) => edit(import('@rpg/domain/battle'), (d, s, now) => d.forgetSkill(s, outfit, classId, nodeId, now))
/** Equips skills in order, or null to have them chosen for her (D86). */
export const equip = (outfit: BattleOutfit, classId: RpgClass, loadout: string[] | null) => edit(import('@rpg/domain/battle'), (d, s, now) => d.equipSkills(s, outfit, classId, loadout, now))
export const beginFight = (region: RpgCampaignChapter, nodeId: string, outfits: ReadonlyMap<string, BattleOutfit>) =>
  edit(import('@rpg/domain/battle'), (d, s, now) => d.startFight(s, region, nodeId, outfits, now))
export const leaveFight = () => edit(import('@rpg/domain/battle'), (d, s, now) => d.retreat(s, now))
/** Refills the active party's MP at a Spring (D66). */
export const drinkAtSpring = (springId: string) => edit(import('@rpg/domain/battle'), (d, s, now) => d.useSpring(s, springId, now))
export const chooseActiveParty = (party: number) => edit(import('@rpg/domain/battle'), (d, s, now) => d.setActiveParty(s, party, now))

/** One action in the party's open fight. Saved at once; when it ends the fight, the rewards land in the same save. */
export async function fightAction(region: RpgCampaignChapter, action: BattleAction): Promise<{ step: BattleStep; result: FightResult | null }> {
  const { actInFight } = await import('@rpg/domain/battle')
  const { save } = useGame.getState()
  if (!save) throw new Error('No save loaded')
  const acted = actInFight(save, region, action, nowIso())
  await commit(acted.save)
  return { step: acted.step, result: acted.result }
}

// --- Work and the Exchange (S4) ----------------------------------------------------------------------------------

export const startWork = (placeId: string, slot: number, outfit: WorkOutfit, output: string, count: number) =>
  edit(import('@rpg/domain/work'), (d, s, now) => d.startJob(s, placeId, slot, outfit, output, count, now))
export const recall = (placeId: string, slot: number) => edit(import('@rpg/domain/work'), (d, s, now) => d.recallJob(s, placeId, slot, now))
/** Spends Speed Tickets on a job, 30 minutes each (D74). */
export const cutTime = (placeId: string, slot: number, tickets: number) => edit(import('@rpg/domain/work'), (d, s, now) => d.cutJobTime(s, placeId, slot, tickets, now))
/** Queues another job after the slot's current one, same Uma (QoL, D62). */
export const queueWork = (placeId: string, slot: number, outfit: WorkOutfit, output: string, count: number) =>
  edit(import('@rpg/domain/work'), (d, s, now) => d.queueJob(s, placeId, slot, outfit, output, count, now))
export const unqueueWork = (placeId: string, slot: number, index: number) => edit(import('@rpg/domain/work'), (d, s, now) => d.unqueueJob(s, placeId, slot, index, now))
export const editWorkQueue = (input: RpgQueueInput) =>
  edit(import('@rpg/domain/work'), (d, s, now) => d.editWorkerQueue(s, input, now))
export const upgrade = (placeId: string) => edit(import('@rpg/domain/work'), (d, s, now) => d.upgradeFacility(s, placeId, now))
export const buyItem = (itemId: string, quantity: number, stocked: readonly number[]) => edit(import('@rpg/domain/exchange'), (d, s, now) => d.buyRawItem(s, itemId, quantity, stocked, now))
export const buyTicket = (kind: 'time' | 'sweep', quantity: number) => edit(import('@rpg/domain/exchange'), (d, s, now) => d.buyTickets(s, kind, quantity, now))
export const sell = (shelf: Shelf, id: string, quantity: number) => edit(import('@rpg/domain/exchange'), (d, s, now) => d.sellStock(s, shelf, id, quantity, now))
/** Reads Manuals for one Uma's bar: 1,000 Marks for 1,000 EXP each (D102). */
export const readManual = (outfitId: string, ref: RankRef, count: number) => edit(import('@rpg/domain/exchange'), (d, s, now) => d.readManuals(s, outfitId, ref, count, now))

/** She sets a Star Gem: one node opens on her map (D144). Returns the node. */
export async function setStarGem(outfitId: string, gemId: string): Promise<string> {
  const { setGem } = await import('@rpg/domain/observatory')
  const { save } = useGame.getState()
  if (!save) throw new Error('No save loaded')
  const r = setGem(save, outfitId, gemId, nowIso())
  await commit(r.save)
  return r.node
}
export const activate = (outfitId: string, nodes: string[]) => edit(import('@rpg/domain/observatory'), (d, s, now) => d.setActiveNodes(s, outfitId, nodes, now))
export const wear = (outfitId: string, gearId: string) => edit(import('@rpg/domain/forge'), (d, s, now) => d.equipGear(s, outfitId, gearId, now))
export const takeOff = (outfitId: string, slot: GearSlot) => edit(import('@rpg/domain/forge'), (d, s, now) => d.unequipGear(s, outfitId, slot, now))
/** Puts an armor kind in one of her five armor slots: its Training piece (null) or a crafted one (D103). */
export const wearArmorPiece = (outfitId: string, slot: ArmorSlot, kind: ArmorKind, gearId: string | null) =>
  edit(import('@rpg/domain/forge'), (d, s, now) => d.wearArmor(s, outfitId, slot, kind, gearId, now))
/** Puts an accessory in one of her two accessory slots, or empties it (null) (D124). */
export const wearAccessoryPiece = (outfitId: string, slot: AccessorySlot, gearId: string | null) =>
  edit(import('@rpg/domain/forge'), (d, s, now) => d.wearAccessory(s, outfitId, slot, gearId, now))
/** Puts on a class's standard preset (H33, D164): weapons, armor and accessories, binding what it takes from the stock. */
export async function wearPreset(outfitId: string, classId: RpgClass): Promise<void> {
  const { save } = useGame.getState()
  if (!save) return
  const next = wearClassPreset(save, outfitId, classId, nowIso())
  if (next !== save) await commit(next)
}
/** Marks or unmarks an Uma as a target (D100). */
export const markTarget = (outfitId: string, on: boolean) => edit(import('@rpg/domain/targets'), (d, s, now) => d.setTarget(s, outfitId, on, now))
/** The Halls of Heroes (D106): seat or swap a Hero (null empties the seat), and add or remove a Learner. */
export const appointHero = (seat: string, outfitId: string | null) => edit(import('@rpg/domain/heroes'), (d, s, now) => d.setHero(s, seat, outfitId, now))
export const addLearner = (seat: string, outfitId: string) => edit(import('@rpg/domain/heroes'), (d, s, now) => d.addLearner(s, seat, outfitId, now))
export const removeLearner = (seat: string, outfitId: string) => edit(import('@rpg/domain/heroes'), (d, s, now) => d.removeLearner(s, seat, outfitId, now))
/** Puts a weapon in a class's slot: its Training one (null) or a crafted piece (D98). */
export const hold = (outfitId: string, classId: RpgClass, slot: number, weapon: RpgWeapon, gearId: string | null) =>
  edit(import('@rpg/domain/battle'), (d, s, now) => d.holdWeapon(s, outfitId, classId, slot, weapon, gearId, now))

/** Collects one job; returns what it gave. */
export async function collect(placeId: string, slot: number): Promise<{ items: number; levelsUp: number }> {
  const { collectJob } = await import('@rpg/domain/work')
  const { save } = useGame.getState()
  if (!save) return { items: 0, levelsUp: 0 }
  const r = collectJob(save, placeId, slot, nowIso())
  await commit(r.save)
  return r.got
}

/** Collects every ready job (on these places, or everywhere). */
export async function collectEverything(placeIds?: readonly string[]): Promise<{ items: number; levelsUp: number }> {
  const { collectAll } = await import('@rpg/domain/work')
  const { save } = useGame.getState()
  if (!save) return { items: 0, levelsUp: 0 }
  const r = collectAll(save, nowIso(), placeIds)
  if (r.items > 0 || r.save.tierWorlds['1'] !== save.tierWorlds['1']) await commit(r.save)
  return { items: r.items, levelsUp: r.levelsUp }
}

/** Starts her last job again where she did it, collecting first when she's ready (SC3). */
export const repeatWork = (outfitId: string) => edit(import('@rpg/domain/work'), (d, s, now) => d.repeatJob(s, outfitId, now))
/** A queue that couldn't start (SC3): start it again now, or forget it. */
export const restartWork = (outfitId: string) => edit(import('@rpg/domain/work'), (d, s, now) => d.restartStopped(s, outfitId, now))
export const dismissWork = (outfitId: string) => edit(import('@rpg/domain/work'), (d, s, now) => d.dismissStopped(s, outfitId, now))
/** Shared work screens address an Uma and preserve the exact entry identity for late speed-up taps. */
export const collectWorker = async (outfitId: string): Promise<{ items: number; levelsUp: number }> => {
  const { collectWorker: collectOne } = await import('@rpg/domain/work')
  const { save } = useGame.getState()
  if (!save) return { items: 0, levelsUp: 0 }
  const r = collectOne(save, outfitId, nowIso())
  await commit(r.save)
  return r.got
}
export const recallWorker = (outfitId: string) => edit(import('@rpg/domain/work'), (d, s, now) => d.recallWorker(s, outfitId, now))
export const speedWorker = (outfitId: string, startedAt: number, tickets: number) =>
  edit(import('@rpg/domain/work'), (d, s, now) => d.speedWorker(s, outfitId, startedAt, tickets, now))
export const finishWorker = (outfitId: string, startedAt: number) =>
  edit(import('@rpg/domain/work'), (d, s, now) => d.finishWorker(s, outfitId, startedAt, now))

/** Sweeps a beaten fight up to `times` times; returns the summed result and how many it did. */
export async function sweep(region: RpgCampaignChapter, nodeId: string, outfits: ReadonlyMap<string, BattleOutfit>, times = 1): Promise<FightResult & { swept: number }> {
  const { sweepMany } = await import('@rpg/domain/exchange')
  const { save } = useGame.getState()
  if (!save) throw new Error('No save loaded')
  const r = sweepMany(save, region, nodeId, times, outfits, nowIso())
  await commit(r.save)
  return { ...r.result, swept: r.swept }
}

/** The Tier 1 world, or null before boot. */
export function useWorld(): TierWorld | null {
  return useGame((s) => s.save?.tierWorlds['1'] ?? null)
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
        useGame.setState({ save: step.envelope.save, revision: step.envelope.revision, dirty: false })
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
