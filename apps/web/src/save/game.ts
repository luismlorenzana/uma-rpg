// The game store and its sync engine (D32): the save lives on the device (Dexie) and in a Zustand store; every change
// writes both at once and schedules a background sync. Gameplay never waits on the network.
import {
  parseTrack, sweepMany, sellStock, buyTokens, type Shelf, buyRawItem, buyTickets, collectAll, collectJob, queueJob, recallJob, cutJobTime, startJob, startTraining, unqueueJob, upgradeFacility, type Track, type WorkOutfit,
  eatDish, setActiveNodes, equipGear, unequipGear, holdWeapon, type GearSlot,
  actInFight, chooseClass, equipSkills, forgetSkill, learnSkill, newSave, renameParty, renameTrainer, setActiveParty, useSpring, retreat,
  setPartySlot, startFight, unlockUma, type BattleAction, type BattleOutfit, type BattleStep, type FightResult, type RpgClass,
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

/** Spends one Unlock Ticket (final, D44). Throws SaveRuleError when it can't. */
export async function unlock(outfitId: string): Promise<void> {
  const { save } = useGame.getState()
  if (save) await commit(unlockUma(save, outfitId, nowIso()))
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

const edit = async (change: (save: Save, now: string) => Save): Promise<void> => {
  const { save } = useGame.getState()
  if (save) await commit(change(save, nowIso()))
}

/** Switches her active class for free (D86). */
export const pickClass = (outfitId: string, classId: RpgClass) => edit((s, now) => chooseClass(s, outfitId, classId, now))
/** Learns a side skill in a class; throws SaveRuleError with the reason when she can't. */
export const learn = (outfit: BattleOutfit, classId: RpgClass, nodeId: string) => edit((s, now) => learnSkill(s, outfit, classId, nodeId, now))
export const unlearn = (outfit: BattleOutfit, classId: RpgClass, nodeId: string) => edit((s, now) => forgetSkill(s, outfit, classId, nodeId, now))
/** Equips skills in order, or null to have them chosen for her (D86). */
export const equip = (outfit: BattleOutfit, classId: RpgClass, loadout: string[] | null) => edit((s, now) => equipSkills(s, outfit, classId, loadout, now))
export const beginFight = (region: RpgCampaignChapter, nodeId: string, outfits: ReadonlyMap<string, BattleOutfit>) =>
  edit((s, now) => startFight(s, region, nodeId, outfits, now))
export const leaveFight = () => edit((s, now) => retreat(s, now))
/** Refills the active party's MP at a Spring (D66). */
export const drinkAtSpring = (springId: string) => edit((s, now) => useSpring(s, springId, now))
export const chooseActiveParty = (party: number) => edit((s, now) => setActiveParty(s, party, now))

/** One action in the party's open fight. Saved at once; when it ends the fight, the rewards land in the same save. */
export async function fightAction(region: RpgCampaignChapter, action: BattleAction): Promise<{ step: BattleStep; result: FightResult | null }> {
  const { save } = useGame.getState()
  if (!save) throw new Error('No save loaded')
  const acted = actInFight(save, region, action, nowIso())
  await commit(acted.save)
  return { step: acted.step, result: acted.result }
}

// --- Work and the Exchange (S4) ----------------------------------------------------------------------------------

export const startWork = (placeId: string, slot: number, outfit: WorkOutfit, output: string, count: number) =>
  edit((s, now) => startJob(s, placeId, slot, outfit, output, count, now))
export const recall = (placeId: string, slot: number) => edit((s, now) => recallJob(s, placeId, slot, now))
export const train = (placeId: string, slot: number, outfit: Parameters<typeof startTraining>[3], track: Track) =>
  edit((s, now) => startTraining(s, placeId, slot, outfit, track, now))
/** Spends Time Tickets on a job or training, 30 minutes each (D74). */
export const cutTime = (placeId: string, slot: number, tickets: number) => edit((s, now) => cutJobTime(s, placeId, slot, tickets, now))
/** Queues another job after the slot's current one, same Uma (QoL, D62). */
export const queueWork = (placeId: string, slot: number, outfit: WorkOutfit, output: string, count: number) =>
  edit((s, now) => queueJob(s, placeId, slot, outfit, output, count, now))
export const unqueueWork = (placeId: string, slot: number, index: number) => edit((s, now) => unqueueJob(s, placeId, slot, index, now))
export const upgrade = (placeId: string) => edit((s, now) => upgradeFacility(s, placeId, now))
export const buyItem = (itemId: string, quantity: number, stocked: readonly number[]) => edit((s, now) => buyRawItem(s, itemId, quantity, stocked, now))
export const buyTicket = (kind: 'time' | 'sweep', quantity: number) => edit((s, now) => buyTickets(s, kind, quantity, now))
export const sell = (shelf: Shelf, id: string, quantity: number) => edit((s, now) => sellStock(s, shelf, id, quantity, now))
/** Three tokens of a kind and band for one of your choice (D67). */
export const buyToken = (tokenId: string, quantity: number) => edit((s, now) => buyTokens(s, tokenId, quantity, now))

/** She eats a dish: one node unlocks on her map (S6). Returns the node. */
export async function eat(outfitId: string, dishId: string): Promise<string> {
  const { save } = useGame.getState()
  if (!save) throw new Error('No save loaded')
  const r = eatDish(save, outfitId, dishId, nowIso())
  await commit(r.save)
  return r.node
}
export const activate = (outfitId: string, nodes: string[]) => edit((s, now) => setActiveNodes(s, outfitId, nodes, now))
export const wear = (outfitId: string, gearId: string) => edit((s, now) => equipGear(s, outfitId, gearId, now))
export const takeOff = (outfitId: string, slot: GearSlot) => edit((s, now) => unequipGear(s, outfitId, slot, now))
/** Puts a weapon in a class's slot: its Training one (null) or a crafted piece (D98). */
export const hold = (outfitId: string, classId: RpgClass, slot: number, weapon: RpgWeapon, gearId: string | null) =>
  edit((s, now) => holdWeapon(s, outfitId, classId, slot, weapon, gearId, now))

/** Collects one job; returns what it gave. */
export async function collect(placeId: string, slot: number): Promise<{ items: number; levelsUp: number }> {
  const { save } = useGame.getState()
  if (!save) return { items: 0, levelsUp: 0 }
  const r = collectJob(save, placeId, slot, nowIso())
  await commit(r.save)
  return r.got
}

/** Collects every ready job (on these places, or everywhere). */
export async function collectEverything(placeIds?: readonly string[]): Promise<{ items: number; levelsUp: number }> {
  const { save } = useGame.getState()
  if (!save) return { items: 0, levelsUp: 0 }
  const r = collectAll(save, nowIso(), placeIds)
  if (r.items > 0 || r.save.tierWorlds['1'] !== save.tierWorlds['1']) await commit(r.save)
  return { items: r.items, levelsUp: r.levelsUp }
}

/** Collects a finished job and starts the same one again with the same Uma (if the Warehouse covers its inputs). */
export async function collectAndRepeat(placeId: string, slot: number, outfit: WorkOutfit): Promise<void> {
  const { save } = useGame.getState()
  const job = save?.tierWorlds['1']?.facilities[placeId]?.jobs[slot]
  if (!save || !job) return
  const now = nowIso()
  const collected = collectJob(save, placeId, slot, now).save
  await commit(startJob(collected, placeId, slot, outfit, job.output, job.count, now))
}

/** Ranks up a finished training and starts the next rank with the same Uma. */
export async function rankUpAndContinue(placeId: string, slot: number, outfit: Parameters<typeof startTraining>[3]): Promise<void> {
  const { save } = useGame.getState()
  const job = save?.tierWorlds['1']?.facilities[placeId]?.jobs[slot]
  const track = job ? parseTrack(job.output) : null
  if (!save || !job || !track) return
  const now = nowIso()
  await commit(startTraining(collectJob(save, placeId, slot, now).save, placeId, slot, outfit, track, now))
}

/** Sweeps a beaten fight up to `times` times; returns the summed result and how many it did. */
export async function sweep(region: RpgCampaignChapter, nodeId: string, times = 1): Promise<FightResult & { swept: number }> {
  const { save } = useGame.getState()
  if (!save) throw new Error('No save loaded')
  const r = sweepMany(save, region, nodeId, times, nowIso())
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
