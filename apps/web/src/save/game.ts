// The game store and its sync engine (D32): the save lives on the device (Dexie) and in a Zustand store; every change
// writes both at once and schedules a background sync. Gameplay never waits on the network.
import {
  buyRawItem, buyTickets, collectAll, collectJob, recallJob, rushJob, startJob, sweepFight, upgradeFacility, type WorkOutfit,
  actInFight, chooseBuild, equipSkills, forgetSkill, learnSkill, newSave, renameParty, renameTrainer, restAtCamp, retreat, setFamiliar,
  setPartySlot, startFight, unlockUma, type BattleAction, type BattleOutfit, type BattleStep, type FightResult, type RpgBuildId,
  type RpgCampaignChapter, type RpgWeaponKind, type Save, type TierWorld,
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

/** Switches the build she fights with (free, design §5). */
export const pickBuild = (outfitId: string, build: RpgBuildId) => edit((s, now) => chooseBuild(s, outfitId, build, now))
/** Learns a node in a build; throws SaveRuleError with the reason when she can't. */
export const learn = (outfit: BattleOutfit, build: RpgBuildId, nodeId: string) => edit((s, now) => learnSkill(s, outfit, build, nodeId, now))
export const unlearn = (outfit: BattleOutfit, build: RpgBuildId, nodeId: string) => edit((s, now) => forgetSkill(s, outfit, build, nodeId, now))
export const equip = (outfit: BattleOutfit, build: RpgBuildId, loadout: string[]) => edit((s, now) => equipSkills(s, outfit, build, loadout, now))
export const chooseFamiliar = (outfitId: string, kind: RpgWeaponKind) => edit((s, now) => setFamiliar(s, outfitId, kind, now))
export const beginFight = (chapter: RpgCampaignChapter, party: number, nodeId: string, outfits: ReadonlyMap<string, BattleOutfit>) =>
  edit((s, now) => startFight(s, chapter, party, nodeId, outfits, now))
export const leaveFight = (chapter: RpgCampaignChapter, party: number) => edit((s, now) => retreat(s, chapter, party, now))
export const rest = (chapter: RpgCampaignChapter, party: number, campId: string) => edit((s, now) => restAtCamp(s, chapter, party, campId, now))

/** One action in the party's open fight. Saved at once; when it ends the fight, the rewards land in the same save. */
export async function fightAction(chapter: RpgCampaignChapter, party: number, action: BattleAction): Promise<{ step: BattleStep; result: FightResult | null }> {
  const { save } = useGame.getState()
  if (!save) throw new Error('No save loaded')
  const acted = actInFight(save, chapter, party, action, nowIso())
  await commit(acted.save)
  return { step: acted.step, result: acted.result }
}

// --- Work and the Exchange (S4) ----------------------------------------------------------------------------------

export const startWork = (placeId: string, slot: number, outfit: WorkOutfit, output: string, count: number) =>
  edit((s, now) => startJob(s, placeId, slot, outfit, output, count, now))
export const recall = (placeId: string, slot: number) => edit((s, now) => recallJob(s, placeId, slot, now))
export const rush = (placeId: string, slot: number) => edit((s, now) => rushJob(s, placeId, slot, now))
export const upgrade = (placeId: string) => edit((s, now) => upgradeFacility(s, placeId, now))
export const buyItem = (itemId: string, quantity: number, stocked: readonly number[]) => edit((s, now) => buyRawItem(s, itemId, quantity, stocked, now))
export const buyTicket = (kind: 'rush' | 'sweep', quantity: number) => edit((s, now) => buyTickets(s, kind, quantity, now))

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

export async function sweep(chapter: RpgCampaignChapter, party: number, nodeId: string): Promise<FightResult> {
  const { save } = useGame.getState()
  if (!save) throw new Error('No save loaded')
  const r = sweepFight(save, chapter, party, nodeId, nowIso())
  await commit(r.save)
  return r.result
}

/** The Tier 1 world, or null before boot. */
export function useWorld(): TierWorld | null {
  return useGame((s) => s.save?.tierWorlds['1'] ?? null)
}

// --- Sync -------------------------------------------------------------------------------------------------------

let timer: ReturnType<typeof setTimeout> | null = null
let running: Promise<void> | null = null
let again = false

export function scheduleSync(delayMs = 1500): void {
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
