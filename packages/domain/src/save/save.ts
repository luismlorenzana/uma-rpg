// Save v1: one snapshot document per account (D32), shared by the web app (Dexie + store) and the API (validation).
// Design: docs/design/game-design.md §2.2 (tier worlds), §3 (collection: 15 starting Unlock Tickets).

export const SAVE_SCHEMA_VERSION = 1
export const STARTING_UNLOCK_TICKETS = 15
export const TRAINER_NAME_MAX = 24
export const DEFAULT_TRAINER_NAME = 'Trainer'

export interface Wallet {
  unlockTickets: number
  shards: number
  laurels: number
}

export interface TierWorld {
  createdAt: string
  wallet: Wallet
}

export interface Account {
  trainerName: string
  createdAt: string
  /** Bumped on every change; the newer one wins a sync conflict (D32). */
  updatedAt: string
}

export interface Save {
  schemaVersion: typeof SAVE_SCHEMA_VERSION
  account: Account
  /** Keyed by tier number as a string: "1", "2"… Tier 1 always exists. */
  tierWorlds: Record<string, TierWorld>
}

/** What the API stores and returns: the save plus its revision (0 = nothing stored yet). */
export interface SaveEnvelope {
  revision: number
  save: Save | null
}

export interface SavePut {
  baseRevision: number
  save: Save
}

export class SaveParseError extends Error {
  readonly path: string
  constructor(path: string, message: string) {
    super(`${path}: ${message}`)
    this.name = 'SaveParseError'
    this.path = path
  }
}

/** Trims and collapses spaces; null when the result is empty or too long. */
export function normalizeTrainerName(raw: string): string | null {
  const name = raw.trim().replace(/\s+/g, ' ')
  return name.length >= 1 && name.length <= TRAINER_NAME_MAX ? name : null
}

export function newSave(trainerName: string, now: string): Save {
  return {
    schemaVersion: SAVE_SCHEMA_VERSION,
    account: { trainerName: normalizeTrainerName(trainerName) ?? DEFAULT_TRAINER_NAME, createdAt: now, updatedAt: now },
    tierWorlds: { '1': { createdAt: now, wallet: { unlockTickets: STARTING_UNLOCK_TICKETS, shards: 0, laurels: 0 } } },
  }
}

export function renameTrainer(save: Save, name: string, now: string): Save {
  const trainerName = normalizeTrainerName(name)
  if (!trainerName) throw new SaveParseError('account.trainerName', `must be 1–${TRAINER_NAME_MAX} characters`)
  return { ...save, account: { ...save.account, trainerName, updatedAt: now } }
}

/** A sync conflict between two edited saves: the one changed most recently wins whole (single owner, D32). */
export function resolveConflict(local: Save, remote: Save): Save {
  return Date.parse(local.account.updatedAt) >= Date.parse(remote.account.updatedAt) ? local : remote
}

// --- Parsing: explicit, path-reporting, strict on unknown keys so an older client can't half-write a newer schema ---

type Obj = Record<string, unknown>

function object(value: unknown, path: string, keys: readonly string[]): Obj {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new SaveParseError(path, 'expected an object')
  const extra = Object.keys(value).filter((k) => !keys.includes(k))
  if (extra.length > 0) throw new SaveParseError(path, `unknown keys ${extra.join(', ')}`)
  return value as Obj
}

function count(value: unknown, path: string): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) throw new SaveParseError(path, 'expected a non-negative integer')
  return value
}

function timestamp(value: unknown, path: string): string {
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) throw new SaveParseError(path, 'expected an ISO timestamp')
  return value
}

function parseWallet(value: unknown, path: string): Wallet {
  const o = object(value, path, ['unlockTickets', 'shards', 'laurels'])
  return { unlockTickets: count(o.unlockTickets, `${path}.unlockTickets`), shards: count(o.shards, `${path}.shards`), laurels: count(o.laurels, `${path}.laurels`) }
}

export function parseSave(value: unknown, path = 'save'): Save {
  const o = object(value, path, ['schemaVersion', 'account', 'tierWorlds'])
  if (o.schemaVersion !== SAVE_SCHEMA_VERSION) throw new SaveParseError(`${path}.schemaVersion`, `expected ${SAVE_SCHEMA_VERSION}`)
  const a = object(o.account, `${path}.account`, ['trainerName', 'createdAt', 'updatedAt'])
  const trainerName = typeof a.trainerName === 'string' ? normalizeTrainerName(a.trainerName) : null
  if (!trainerName || trainerName !== a.trainerName) throw new SaveParseError(`${path}.account.trainerName`, `must be 1–${TRAINER_NAME_MAX} trimmed characters`)
  const account: Account = { trainerName, createdAt: timestamp(a.createdAt, `${path}.account.createdAt`), updatedAt: timestamp(a.updatedAt, `${path}.account.updatedAt`) }
  const worlds = object(o.tierWorlds, `${path}.tierWorlds`, Object.keys((o.tierWorlds as Obj | null) ?? {}))
  const tierWorlds: Record<string, TierWorld> = {}
  for (const [key, world] of Object.entries(worlds)) {
    const at = `${path}.tierWorlds.${key}`
    if (!/^[1-9]\d*$/.test(key)) throw new SaveParseError(at, 'tier keys are positive integers')
    const w = object(world, at, ['createdAt', 'wallet'])
    tierWorlds[key] = { createdAt: timestamp(w.createdAt, `${at}.createdAt`), wallet: parseWallet(w.wallet, `${at}.wallet`) }
  }
  if (!tierWorlds['1']) throw new SaveParseError(`${path}.tierWorlds`, 'tier 1 is required')
  return { schemaVersion: SAVE_SCHEMA_VERSION, account, tierWorlds }
}

export function parseSavePut(value: unknown): SavePut {
  const o = object(value, 'body', ['baseRevision', 'save'])
  return { baseRevision: count(o.baseRevision, 'body.baseRevision'), save: parseSave(o.save, 'body.save') }
}
