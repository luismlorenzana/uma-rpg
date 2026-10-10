// The game store and its sync engine (D32): the save lives on the device (Dexie) and in a Zustand store; every change
// writes both at once and schedules a background sync. Gameplay never waits on the network.
import { newSave, renameTrainer, type Save } from '@rpg/domain'
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
