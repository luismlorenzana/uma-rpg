// Save v2: one snapshot document per account (D32, D45), shared by the web app (Dexie + store) and the API.
// Design: docs/design/game-design.md §2.2 (tier worlds), §3 (collection: 20 starting Unlock Tickets, D40),
// §6 (parties: 20, D41; one party per Uma, D46).

export const SAVE_SCHEMA_VERSION = 2
export const STARTING_UNLOCK_TICKETS = 20
export const TRAINER_NAME_MAX = 24
export const DEFAULT_TRAINER_NAME = 'Trainer'
export const PARTY_COUNT = 20
export const PARTY_SIZE = 5
export const PARTY_NAME_MAX = 24
export const MAX_UMA_LEVEL = 50
/** Five Shards make one Unlock Ticket (D5, converted automatically: D47). */
export const SHARDS_PER_TICKET = 5

export interface Wallet {
  unlockTickets: number
  shards: number
  laurels: number
}

/** An outfit the trainer owns in a tier world. */
export interface OwnedUma {
  unlockedAt: string
  level: number
  exp: number
}

export interface Party {
  name: string
  /** Five slots of owned outfit ids (`RosterOutfit.outfitId`), or null. */
  slots: (string | null)[]
}

export interface TierWorld {
  createdAt: string
  wallet: Wallet
  /** Owned outfits by outfit id. */
  umas: Record<string, OwnedUma>
  /** Always PARTY_COUNT parties. An Uma is in at most one slot of one party (D46). */
  parties: Party[]
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
  /** The version the client sent, before migration: the API refuses one older than what it stores (D45). */
  sentSchemaVersion: number
}

export class SaveParseError extends Error {
  readonly path: string
  constructor(path: string, message: string) {
    super(`${path}: ${message}`)
    this.name = 'SaveParseError'
    this.path = path
  }
}

/** Trims and collapses spaces; null when the result is empty or longer than `max`. */
export function normalizeName(raw: string, max = TRAINER_NAME_MAX): string | null {
  const name = raw.trim().replace(/\s+/g, ' ')
  return name.length >= 1 && name.length <= max ? name : null
}

export function normalizeTrainerName(raw: string): string | null {
  return normalizeName(raw, TRAINER_NAME_MAX)
}

export function defaultParties(): Party[] {
  return Array.from({ length: PARTY_COUNT }, (_, i) => ({ name: `Party ${i + 1}`, slots: Array.from({ length: PARTY_SIZE }, () => null) }))
}

export function newTierWorld(now: string, unlockTickets: number): TierWorld {
  return { createdAt: now, wallet: { unlockTickets, shards: 0, laurels: 0 }, umas: {}, parties: defaultParties() }
}

export function newSave(trainerName: string, now: string): Save {
  return {
    schemaVersion: SAVE_SCHEMA_VERSION,
    account: { trainerName: normalizeTrainerName(trainerName) ?? DEFAULT_TRAINER_NAME, createdAt: now, updatedAt: now },
    tierWorlds: { '1': newTierWorld(now, STARTING_UNLOCK_TICKETS) },
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

const OUTFIT_ID = /^[1-9]\d{0,11}$/

function parseWallet(value: unknown, path: string): Wallet {
  const o = object(value, path, ['unlockTickets', 'shards', 'laurels'])
  return { unlockTickets: count(o.unlockTickets, `${path}.unlockTickets`), shards: count(o.shards, `${path}.shards`), laurels: count(o.laurels, `${path}.laurels`) }
}

function parseUmas(value: unknown, path: string): Record<string, OwnedUma> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new SaveParseError(path, 'expected an object')
  const umas: Record<string, OwnedUma> = {}
  for (const [id, raw] of Object.entries(value)) {
    const at = `${path}.${id}`
    if (!OUTFIT_ID.test(id)) throw new SaveParseError(at, 'outfit ids are positive integers')
    const u = object(raw, at, ['unlockedAt', 'level', 'exp'])
    const level = count(u.level, `${at}.level`)
    if (level < 1 || level > MAX_UMA_LEVEL) throw new SaveParseError(`${at}.level`, `expected 1–${MAX_UMA_LEVEL}`)
    umas[id] = { unlockedAt: timestamp(u.unlockedAt, `${at}.unlockedAt`), level, exp: count(u.exp, `${at}.exp`) }
  }
  return umas
}

function parseParties(value: unknown, path: string, umas: Record<string, OwnedUma>): Party[] {
  if (!Array.isArray(value) || value.length !== PARTY_COUNT) throw new SaveParseError(path, `expected ${PARTY_COUNT} parties`)
  const seen = new Set<string>()
  return value.map((raw, i) => {
    const at = `${path}.${i}`
    const p = object(raw, at, ['name', 'slots'])
    const name = typeof p.name === 'string' ? normalizeName(p.name, PARTY_NAME_MAX) : null
    if (!name || name !== p.name) throw new SaveParseError(`${at}.name`, `must be 1–${PARTY_NAME_MAX} trimmed characters`)
    if (!Array.isArray(p.slots) || p.slots.length !== PARTY_SIZE) throw new SaveParseError(`${at}.slots`, `expected ${PARTY_SIZE} slots`)
    const slots = p.slots.map((slot: unknown, s: number) => {
      if (slot === null) return null
      if (typeof slot !== 'string' || !umas[slot]) throw new SaveParseError(`${at}.slots.${s}`, 'expected null or an owned outfit id')
      if (seen.has(slot)) throw new SaveParseError(`${at}.slots.${s}`, `outfit ${slot} is already in a party`)
      seen.add(slot)
      return slot
    })
    return { name, slots }
  })
}

function parseTierWorld(value: unknown, path: string, version: number): TierWorld {
  if (version === 1) {
    // v1 → v2 (D45): no Umas yet, twenty empty parties.
    const w = object(value, path, ['createdAt', 'wallet'])
    return { createdAt: timestamp(w.createdAt, `${path}.createdAt`), wallet: parseWallet(w.wallet, `${path}.wallet`), umas: {}, parties: defaultParties() }
  }
  const w = object(value, path, ['createdAt', 'wallet', 'umas', 'parties'])
  const umas = parseUmas(w.umas, `${path}.umas`)
  return { createdAt: timestamp(w.createdAt, `${path}.createdAt`), wallet: parseWallet(w.wallet, `${path}.wallet`), umas, parties: parseParties(w.parties, `${path}.parties`, umas) }
}

/** The raw `schemaVersion` of a stored or sent save, or 0 when it has none. */
export function schemaVersionOf(value: unknown): number {
  const v = (value as { schemaVersion?: unknown } | null)?.schemaVersion
  return typeof v === 'number' && Number.isSafeInteger(v) ? v : 0
}

/** Parses a v1 or v2 save and always returns v2. */
export function parseSave(value: unknown, path = 'save'): Save {
  const o = object(value, path, ['schemaVersion', 'account', 'tierWorlds'])
  const version = o.schemaVersion
  if (version !== 1 && version !== SAVE_SCHEMA_VERSION) throw new SaveParseError(`${path}.schemaVersion`, `expected 1 or ${SAVE_SCHEMA_VERSION}`)
  const a = object(o.account, `${path}.account`, ['trainerName', 'createdAt', 'updatedAt'])
  const trainerName = typeof a.trainerName === 'string' ? normalizeTrainerName(a.trainerName) : null
  if (!trainerName || trainerName !== a.trainerName) throw new SaveParseError(`${path}.account.trainerName`, `must be 1–${TRAINER_NAME_MAX} trimmed characters`)
  const account: Account = { trainerName, createdAt: timestamp(a.createdAt, `${path}.account.createdAt`), updatedAt: timestamp(a.updatedAt, `${path}.account.updatedAt`) }
  const worlds = object(o.tierWorlds, `${path}.tierWorlds`, Object.keys((o.tierWorlds as Obj | null) ?? {}))
  const tierWorlds: Record<string, TierWorld> = {}
  for (const [key, world] of Object.entries(worlds)) {
    const at = `${path}.tierWorlds.${key}`
    if (!/^[1-9]\d*$/.test(key)) throw new SaveParseError(at, 'tier keys are positive integers')
    tierWorlds[key] = parseTierWorld(world, at, version)
  }
  if (!tierWorlds['1']) throw new SaveParseError(`${path}.tierWorlds`, 'tier 1 is required')
  return { schemaVersion: SAVE_SCHEMA_VERSION, account, tierWorlds }
}

export function parseSavePut(value: unknown): SavePut {
  const o = object(value, 'body', ['baseRevision', 'save'])
  return { baseRevision: count(o.baseRevision, 'body.baseRevision'), save: parseSave(o.save, 'body.save'), sentSchemaVersion: schemaVersionOf(o.save) }
}
