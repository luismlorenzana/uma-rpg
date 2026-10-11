// Save v3: one snapshot document per account (D32, D45), shared by the web app (Dexie + store) and the API.
// Design: docs/design/game-design.md §2.2 (tier worlds), §3 (collection: 20 starting Unlock Tickets, D40),
// §6 (parties: 20, D41; one party per Uma, D46); docs/design/battles.md (class builds and chapter runs, D52).
import { replayBattle } from '../rpg/battle/engine'
import type { BattleAction, BattleInput } from '../rpg/battle/types'
import { RPG_MAX_BATTLE_ACTIONS, type RpgRun, type RpgRunBattle } from '../rpg/campaign/run'
import { rpgNode } from '../rpg/catalog'
import {
  isRpgBuildId, RPG_BUILD, RPG_BUILDS, RPG_WEAPON_KINDS, rpgActiveSlots, validRpgTree, type RpgBuildId, type RpgWeaponKind,
} from '../rpg/rules'

export const SAVE_SCHEMA_VERSION = 3
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

/** One class build of an Uma: its learned nodes, equipped skills and (Summoner) Familiar form, by node id. */
export interface ClassBuild {
  tree: string[]
  loadout: string[]
  familiar: RpgWeaponKind
}

/** An outfit the trainer owns in a tier world. */
export interface OwnedUma {
  unlockedAt: string
  level: number
  /** EXP toward the next level (banked at Lv50). */
  exp: number
  /** The build she fights with; null until chosen, which means her best running style's class. */
  build: RpgBuildId | null
  /** Every build she has learned anything in. */
  builds: Partial<Record<RpgBuildId, ClassBuild>>
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
  /** Chapter runs by `rpgRunKey(party, chapterId)`. */
  runs: Record<string, RpgRun>
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
  return { createdAt: now, wallet: { unlockTickets, shards: 0, laurels: 0 }, umas: {}, parties: defaultParties(), runs: {} }
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

function ids(value: unknown, path: string, max: number): string[] {
  if (!Array.isArray(value) || value.length > max) throw new SaveParseError(path, `expected at most ${max} ids`)
  if (value.some((v) => typeof v !== 'string')) throw new SaveParseError(path, 'expected strings')
  if (new Set(value).size !== value.length) throw new SaveParseError(path, 'duplicate ids')
  return value as string[]
}

/** A build's tree obeys every learning rule at her level; its loadout is learned skills within her slots. */
function parseBuild(value: unknown, path: string, id: RpgBuildId, tier: number, level: number): ClassBuild {
  const b = object(value, path, ['tree', 'loadout', 'familiar'])
  const tree = ids(b.tree, `${path}.tree`, 64)
  const { classId, weapons } = RPG_BUILD[id]
  if (!validRpgTree({ classId, weapons: [...weapons], tier, level, tree: tree.map((n) => ({ tier, id: n })) })) {
    throw new SaveParseError(`${path}.tree`, `not a valid ${id} tree at Lv${level}`)
  }
  const loadout = ids(b.loadout, `${path}.loadout`, rpgActiveSlots(level))
  if (loadout.some((n) => !tree.includes(n) || !rpgNode(n)?.skill)) throw new SaveParseError(`${path}.loadout`, 'only learned skills can be equipped')
  if (!RPG_WEAPON_KINDS.includes(b.familiar as RpgWeaponKind)) throw new SaveParseError(`${path}.familiar`, 'expected a weapon kind')
  return { tree, loadout, familiar: b.familiar as RpgWeaponKind }
}

function parseUmas(value: unknown, path: string, tier: number, version: number): Record<string, OwnedUma> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new SaveParseError(path, 'expected an object')
  const umas: Record<string, OwnedUma> = {}
  for (const [id, raw] of Object.entries(value)) {
    const at = `${path}.${id}`
    if (!OUTFIT_ID.test(id)) throw new SaveParseError(at, 'outfit ids are positive integers')
    const u = object(raw, at, version < 3 ? ['unlockedAt', 'level', 'exp'] : ['unlockedAt', 'level', 'exp', 'build', 'builds'])
    const level = count(u.level, `${at}.level`)
    if (level < 1 || level > MAX_UMA_LEVEL) throw new SaveParseError(`${at}.level`, `expected 1–${MAX_UMA_LEVEL}`)
    const owned: OwnedUma = { unlockedAt: timestamp(u.unlockedAt, `${at}.unlockedAt`), level, exp: count(u.exp, `${at}.exp`), build: null, builds: {} }
    if (version >= 3) {
      // v2 → v3 (D52): no build chosen and nothing learned.
      if (u.build !== null && !isRpgBuildId(u.build)) throw new SaveParseError(`${at}.build`, 'expected null or a class build')
      owned.build = u.build as RpgBuildId | null
      const builds = object(u.builds, `${at}.builds`, RPG_BUILDS)
      for (const [key, build] of Object.entries(builds)) owned.builds[key as RpgBuildId] = parseBuild(build, `${at}.builds.${key}`, key as RpgBuildId, tier, level)
    }
    umas[id] = owned
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

const NODE_ID = /^[A-Za-z0-9_.:-]{1,120}$/
const CHAPTER_ID = /^[1-9]\d{0,11}$/

function counts(value: unknown, path: string, min: number): Record<string, number> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new SaveParseError(path, 'expected an object')
  const entries = Object.entries(value)
  if (entries.length > 200) throw new SaveParseError(path, 'too many entries')
  for (const [key, n] of entries) {
    if (!NODE_ID.test(key)) throw new SaveParseError(`${path}.${key}`, 'bad key')
    if (count(n, `${path}.${key}`) < min) throw new SaveParseError(`${path}.${key}`, `expected at least ${min}`)
  }
  return value as Record<string, number>
}

const ACTION_KEYS: Record<BattleAction['kind'], readonly string[]> = {
  attack: ['kind', 'actorId', 'targetId', 'weapon'],
  guard: ['kind', 'actorId', 'targetId'],
  skill: ['kind', 'actorId', 'targetId', 'skill', 'blessing'],
  limit: ['kind', 'actorId', 'targetId', 'skill', 'skills', 'weapon'],
}

function parseBattle(value: unknown, path: string): RpgRunBattle {
  const b = object(value, path, ['battleId', 'nodeId', 'startedAt', 'input', 'actions'])
  if (typeof b.battleId !== 'string' || !NODE_ID.test(b.battleId)) throw new SaveParseError(`${path}.battleId`, 'bad id')
  if (typeof b.nodeId !== 'string' || !NODE_ID.test(b.nodeId)) throw new SaveParseError(`${path}.nodeId`, 'bad id')
  if (!Array.isArray(b.actions) || b.actions.length > RPG_MAX_BATTLE_ACTIONS) throw new SaveParseError(`${path}.actions`, 'expected a list of actions')
  b.actions.forEach((a: unknown, i: number) => {
    const kind = (a as { kind?: unknown } | null)?.kind
    if (typeof kind !== 'string' || !(kind in ACTION_KEYS)) throw new SaveParseError(`${path}.actions.${i}`, 'unknown action')
    object(a, `${path}.actions.${i}`, ACTION_KEYS[kind as BattleAction['kind']])
  })
  // The fight must replay cleanly: the engine validates the input and every action (D52).
  let step
  try {
    step = replayBattle(b.input as BattleInput, b.actions as BattleAction[])
  } catch (err) {
    throw new SaveParseError(`${path}.input`, err instanceof Error ? err.message : 'invalid fight')
  }
  if (step.error) throw new SaveParseError(`${path}.actions`, `an action was refused: ${step.error}`)
  return { battleId: b.battleId, nodeId: b.nodeId, startedAt: timestamp(b.startedAt, `${path}.startedAt`), input: b.input as BattleInput, actions: b.actions as BattleAction[] }
}

function parseRuns(value: unknown, path: string): Record<string, RpgRun> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new SaveParseError(path, 'expected an object')
  const runs: Record<string, RpgRun> = {}
  const fighting = new Set<number>()
  for (const [key, raw] of Object.entries(value)) {
    const at = `${path}.${key}`
    const r = object(raw, at, ['party', 'chapterId', 'wins', 'mp', 'battle', 'battles', 'clearedAt', 'updatedAt'])
    const party = count(r.party, `${at}.party`)
    if (party >= PARTY_COUNT) throw new SaveParseError(`${at}.party`, `expected 0–${PARTY_COUNT - 1}`)
    if (typeof r.chapterId !== 'string' || !CHAPTER_ID.test(r.chapterId)) throw new SaveParseError(`${at}.chapterId`, 'expected a scenario id')
    if (key !== `${party}:${r.chapterId}`) throw new SaveParseError(at, 'key must be party:chapterId')
    const battle = r.battle === null ? null : parseBattle(r.battle, `${at}.battle`)
    if (battle) {
      if (fighting.has(party)) throw new SaveParseError(`${at}.battle`, 'a party fights one fight at a time')
      fighting.add(party)
    }
    runs[key] = {
      party, chapterId: r.chapterId, wins: counts(r.wins, `${at}.wins`, 1), mp: counts(r.mp, `${at}.mp`, 0), battle,
      battles: count(r.battles, `${at}.battles`), clearedAt: r.clearedAt === null ? null : timestamp(r.clearedAt, `${at}.clearedAt`),
      updatedAt: timestamp(r.updatedAt, `${at}.updatedAt`),
    }
  }
  return runs
}

function parseTierWorld(value: unknown, path: string, version: number, tier: number): TierWorld {
  if (version === 1) {
    // v1 → v3 (D45, D52): no Umas yet, twenty empty parties, no runs.
    const w = object(value, path, ['createdAt', 'wallet'])
    return { createdAt: timestamp(w.createdAt, `${path}.createdAt`), wallet: parseWallet(w.wallet, `${path}.wallet`), umas: {}, parties: defaultParties(), runs: {} }
  }
  const w = object(value, path, version === 2 ? ['createdAt', 'wallet', 'umas', 'parties'] : ['createdAt', 'wallet', 'umas', 'parties', 'runs'])
  const umas = parseUmas(w.umas, `${path}.umas`, tier, version)
  return {
    createdAt: timestamp(w.createdAt, `${path}.createdAt`), wallet: parseWallet(w.wallet, `${path}.wallet`), umas,
    parties: parseParties(w.parties, `${path}.parties`, umas), runs: version === 2 ? {} : parseRuns(w.runs, `${path}.runs`),
  }
}

/** The raw `schemaVersion` of a stored or sent save, or 0 when it has none. */
export function schemaVersionOf(value: unknown): number {
  const v = (value as { schemaVersion?: unknown } | null)?.schemaVersion
  return typeof v === 'number' && Number.isSafeInteger(v) ? v : 0
}

/** Parses a v1, v2 or v3 save and always returns v3. */
export function parseSave(value: unknown, path = 'save'): Save {
  const o = object(value, path, ['schemaVersion', 'account', 'tierWorlds'])
  const version = o.schemaVersion
  if (version !== 1 && version !== 2 && version !== SAVE_SCHEMA_VERSION) throw new SaveParseError(`${path}.schemaVersion`, `expected 1–${SAVE_SCHEMA_VERSION}`)
  const a = object(o.account, `${path}.account`, ['trainerName', 'createdAt', 'updatedAt'])
  const trainerName = typeof a.trainerName === 'string' ? normalizeTrainerName(a.trainerName) : null
  if (!trainerName || trainerName !== a.trainerName) throw new SaveParseError(`${path}.account.trainerName`, `must be 1–${TRAINER_NAME_MAX} trimmed characters`)
  const account: Account = { trainerName, createdAt: timestamp(a.createdAt, `${path}.account.createdAt`), updatedAt: timestamp(a.updatedAt, `${path}.account.updatedAt`) }
  const worlds = object(o.tierWorlds, `${path}.tierWorlds`, Object.keys((o.tierWorlds as Obj | null) ?? {}))
  const tierWorlds: Record<string, TierWorld> = {}
  for (const [key, world] of Object.entries(worlds)) {
    const at = `${path}.tierWorlds.${key}`
    if (!/^[1-9]\d*$/.test(key)) throw new SaveParseError(at, 'tier keys are positive integers')
    tierWorlds[key] = parseTierWorld(world, at, version, Number(key))
  }
  if (!tierWorlds['1']) throw new SaveParseError(`${path}.tierWorlds`, 'tier 1 is required')
  return { schemaVersion: SAVE_SCHEMA_VERSION, account, tierWorlds }
}

export function parseSavePut(value: unknown): SavePut {
  const o = object(value, 'body', ['baseRevision', 'save'])
  return { baseRevision: count(o.baseRevision, 'body.baseRevision'), save: parseSave(o.save, 'body.save'), sentSchemaVersion: schemaVersionOf(o.save) }
}
