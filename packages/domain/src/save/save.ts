// Save v7: one snapshot document per account (D32, D45), shared by the web app (Dexie + store) and the API.
// Design: docs/design/game-design.md §2.2 (tier worlds), §3 (collection: 20 starting Unlock Tickets, D40),
// §6 (parties: 20, D41; one party per Uma, D46); docs/design/battles.md (class builds and chapter runs, D52);
// docs/design/pacing.md (professions, the Warehouse, facilities and their jobs, tickets: D55); class ranks and gear
// mastery (S5, D57); dishes and each Uma's Sun-and-planets map (S6, D58); gear, lockers and what's equipped (S7, D59).
import { FACILITY_MAX_LEVEL, FACILITY_SLOTS, MAX_JOB_COUNT, PROFESSION_MAX_LEVEL, PROFESSIONS, type Profession } from '../economy/pacing'
import { facilitySpec, JOB_KINDS, type Facility, type Job } from '../economy/jobs'
import { depthsOpen, GEAR_TYPES, newRanks, parseTrack, tracksAt, trackId, type Ranks } from '../economy/training'
import { CLASS_MAX_RANK, MASTERY_MAX_RANK } from '../economy/pacing'
import { RPG_CLASSES } from '../rpg/kinds'
import { dishById, isStarNode } from '../economy/dishes'
import { gearById, slotOf, type GearSlot } from '../economy/gear'
import { WEAPON_TYPES } from '../economy/training'
import { activeNodeSlots } from '../economy/pacing'
import { itemById } from '../items/catalog'
import { replayBattle } from '../rpg/battle/engine'
import type { BattleAction, BattleInput } from '../rpg/battle/types'
import { RPG_MAX_BATTLE_ACTIONS, type RpgRun, type RpgRunBattle } from '../rpg/campaign/run'
import { rpgNode } from '../rpg/catalog'
import {
  isRpgBuildId, RPG_BUILD, RPG_BUILDS, RPG_WEAPON_KINDS, rpgActiveSlots, validRpgTree, type RpgBuildId, type RpgWeaponKind,
} from '../rpg/rules'

export const SAVE_SCHEMA_VERSION = 7
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
  /** Each finishes up to an hour of a running farm job (§11). */
  rushTickets: number
  /** Each completes one beaten regular fight at once (§11). */
  sweepTickets: number
}

export interface ProfessionLevel { level: number; exp: number }

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
  /** Farming & Cooking and Gathering & Crafting, 1–50 each (design §4). */
  professions: Record<Profession, ProfessionLevel>
  /** Class proficiency (1–6) and gear mastery (1–10) ranks (S5, design §4). */
  ranks: Ranks
  /** Her Sun-and-planets map: nodes unlocked by eating, and the ones active now (S6, design §10). */
  stars: Stars
  /** Gear bound to her (her locker) and what she wears: one piece per weapon type, an armor, an accessory (S7). */
  gear: UmaGear
}

export interface UmaGear { locker: string[]; equipped: Partial<Record<GearSlot, string>> }
export const GEAR_SLOTS: readonly GearSlot[] = [...WEAPON_TYPES, 'armor', 'accessory']

export interface Stars { unlocked: string[]; active: string[] }

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
  /** The Warehouse: raw and refined items by id. */
  items: Record<string, number>
  /** Facilities that have been used or upgraded, by place id; absent ones are level 1 and idle. */
  facilities: Record<string, Facility>
  /** Cooked dishes waiting to be eaten, by dish id (S6). */
  dishes: Record<string, number>
  /** Crafted gear nobody wears yet, by piece id (S7). Equipping binds a piece to an Uma for good. */
  gear: Record<string, number>
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

export const newWallet = (unlockTickets: number): Wallet => ({ unlockTickets, shards: 0, laurels: 0, rushTickets: 0, sweepTickets: 0 })
export const newProfessions = (): Record<Profession, ProfessionLevel> => ({ farming: { level: 1, exp: 0 }, gathering: { level: 1, exp: 0 } })
export const newOwnedUma = (now: string): OwnedUma => ({ unlockedAt: now, level: 1, exp: 0, build: null, builds: {}, professions: newProfessions(), ranks: newRanks(),
  stars: { unlocked: [], active: [] }, gear: { locker: [], equipped: {} } })

export function newTierWorld(now: string, unlockTickets: number): TierWorld {
  return { createdAt: now, wallet: newWallet(unlockTickets), umas: {}, parties: defaultParties(), runs: {}, items: {}, facilities: {}, dishes: {}, gear: {} }
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

function parseWallet(value: unknown, path: string, version: number): Wallet {
  const o = object(value, path, version < 4 ? ['unlockTickets', 'shards', 'laurels'] : ['unlockTickets', 'shards', 'laurels', 'rushTickets', 'sweepTickets'])
  return {
    unlockTickets: count(o.unlockTickets, `${path}.unlockTickets`), shards: count(o.shards, `${path}.shards`), laurels: count(o.laurels, `${path}.laurels`),
    rushTickets: version < 4 ? 0 : count(o.rushTickets, `${path}.rushTickets`), sweepTickets: version < 4 ? 0 : count(o.sweepTickets, `${path}.sweepTickets`),
  }
}

function parseProfessions(value: unknown, path: string): Record<Profession, ProfessionLevel> {
  const o = object(value, path, PROFESSIONS)
  const out = newProfessions()
  for (const p of PROFESSIONS) {
    const v = object(o[p], `${path}.${p}`, ['level', 'exp'])
    const level = count(v.level, `${path}.${p}.level`)
    if (level < 1 || level > PROFESSION_MAX_LEVEL) throw new SaveParseError(`${path}.${p}.level`, `expected 1–${PROFESSION_MAX_LEVEL}`)
    out[p] = { level, exp: count(v.exp, `${path}.${p}.exp`) }
  }
  return out
}

function parseItems(value: unknown, path: string): Record<string, number> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new SaveParseError(path, 'expected an object')
  const items: Record<string, number> = {}
  for (const [id, n] of Object.entries(value)) {
    if (!itemById(id)) throw new SaveParseError(`${path}.${id}`, 'unknown item')
    const c = count(n, `${path}.${id}`)
    if (c > 0) items[id] = c
  }
  return items
}

const JOB_KEYS = ['kind', 'outfitId', 'output', 'count', 'collected', 'startedAt', 'msEach', 'expEach', 'inputs'] as const

function parseJob(value: unknown, path: string, kind: Job['kind'], umas: Record<string, OwnedUma>): Job {
  const j = object(value, path, JOB_KEYS)
  if (j.kind !== kind || !JOB_KINDS.includes(j.kind as Job['kind'])) throw new SaveParseError(`${path}.kind`, `expected ${kind}`)
  if (typeof j.outfitId !== 'string' || !umas[j.outfitId]) throw new SaveParseError(`${path}.outfitId`, 'expected an owned outfit')
  if (typeof j.output !== 'string' || j.output.length < 1 || j.output.length > 80) throw new SaveParseError(`${path}.output`, 'expected an id')
  if ((kind === 'gather' || kind === 'refine') && !itemById(j.output)) throw new SaveParseError(`${path}.output`, 'unknown item')
  if (kind === 'train' && !parseTrack(j.output)) throw new SaveParseError(`${path}.output`, 'unknown training track')
  if (kind === 'cook' && !dishById(j.output)) throw new SaveParseError(`${path}.output`, 'unknown dish')
  if (kind === 'craft' && !gearById(j.output)) throw new SaveParseError(`${path}.output`, 'unknown gear')
  const n = count(j.count, `${path}.count`)
  if (n < 1 || n > MAX_JOB_COUNT) throw new SaveParseError(`${path}.count`, `expected 1–${MAX_JOB_COUNT}`)
  const collected = count(j.collected, `${path}.collected`)
  if (collected > n) throw new SaveParseError(`${path}.collected`, 'more than the job makes')
  const msEach = count(j.msEach, `${path}.msEach`)
  if (msEach < 1) throw new SaveParseError(`${path}.msEach`, 'expected a positive duration')
  const inputs = parseItems(j.inputs, `${path}.inputs`)
  return { kind, outfitId: j.outfitId, output: j.output, count: n, collected, startedAt: timestamp(j.startedAt, `${path}.startedAt`), msEach,
    expEach: count(j.expEach, `${path}.expEach`), inputs }
}

function parseFacilities(value: unknown, path: string, umas: Record<string, OwnedUma>): Record<string, Facility> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new SaveParseError(path, 'expected an object')
  const out: Record<string, Facility> = {}
  const working = new Set<string>()
  for (const [id, raw] of Object.entries(value)) {
    const at = `${path}.${id}`
    const spec = facilitySpec(id)
    if (!spec) throw new SaveParseError(at, 'not a facility')
    const f = object(raw, at, ['level', 'jobs'])
    const level = count(f.level, `${at}.level`)
    if (level < 1 || level > FACILITY_MAX_LEVEL) throw new SaveParseError(`${at}.level`, `expected 1–${FACILITY_MAX_LEVEL}`)
    const slots = FACILITY_SLOTS[level - 1]!
    if (!Array.isArray(f.jobs) || f.jobs.length !== slots) throw new SaveParseError(`${at}.jobs`, `expected ${slots} slots`)
    const jobs = f.jobs.map((job: unknown, i: number) => {
      if (job === null) return null
      const parsed = parseJob(job, `${at}.jobs.${i}`, spec.kind, umas)
      if (spec.kind === 'train' && (parsed.count !== 1 || !tracksAt(id).some((t) => trackId(t) === parsed.output))) {
        throw new SaveParseError(`${at}.jobs.${i}.output`, 'not trained here')
      }
      if (working.has(parsed.outfitId)) throw new SaveParseError(`${at}.jobs.${i}.outfitId`, 'already working elsewhere')
      working.add(parsed.outfitId)
      return parsed
    })
    out[id] = { level, jobs }
  }
  return out
}

function ids(value: unknown, path: string, max: number): string[] {
  if (!Array.isArray(value) || value.length > max) throw new SaveParseError(path, `expected at most ${max} ids`)
  if (value.some((v) => typeof v !== 'string')) throw new SaveParseError(path, 'expected strings')
  if (new Set(value).size !== value.length) throw new SaveParseError(path, 'duplicate ids')
  return value as string[]
}

function parseStars(value: unknown, path: string, level: number): Stars {
  const o = object(value, path, ['unlocked', 'active'])
  const unlocked = ids(o.unlocked, `${path}.unlocked`, 100)
  if (unlocked.some((n) => !isStarNode(n))) throw new SaveParseError(`${path}.unlocked`, 'unknown node')
  const active = ids(o.active, `${path}.active`, activeNodeSlots(level))
  if (active.some((n) => !unlocked.includes(n))) throw new SaveParseError(`${path}.active`, 'only unlocked nodes can be active')
  return { unlocked, active }
}

function parseUmaGear(value: unknown, path: string, ranks: Ranks): UmaGear {
  const o = object(value, path, ['locker', 'equipped'])
  const locker = ids(o.locker, `${path}.locker`, 200)
  if (locker.some((g) => !gearById(g))) throw new SaveParseError(`${path}.locker`, 'unknown gear')
  const slots = object(o.equipped, `${path}.equipped`, GEAR_SLOTS)
  const equipped: Partial<Record<GearSlot, string>> = {}
  for (const [slot, id] of Object.entries(slots)) {
    const piece = typeof id === 'string' ? gearById(id) : undefined
    if (!piece || !locker.includes(id as string) || slotOf(piece.type) !== slot) throw new SaveParseError(`${path}.equipped.${slot}`, 'expected a piece from her locker for this slot')
    if (piece.type !== 'ring' && piece.type !== 'charm' && ranks.mastery[piece.type] < piece.grade) {
      throw new SaveParseError(`${path}.equipped.${slot}`, `needs ${piece.type} mastery rank ${piece.grade}`)
    }
    equipped[slot as GearSlot] = id as string
  }
  return { locker, equipped }
}

function parseGearStock(value: unknown, path: string): Record<string, number> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new SaveParseError(path, 'expected an object')
  const gear: Record<string, number> = {}
  for (const [id, n] of Object.entries(value)) {
    if (!gearById(id)) throw new SaveParseError(`${path}.${id}`, 'unknown gear')
    const c = count(n, `${path}.${id}`)
    if (c > 0) gear[id] = c
  }
  return gear
}

function parseDishes(value: unknown, path: string): Record<string, number> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new SaveParseError(path, 'expected an object')
  const dishes: Record<string, number> = {}
  for (const [id, n] of Object.entries(value)) {
    if (!dishById(id)) throw new SaveParseError(`${path}.${id}`, 'unknown dish')
    const c = count(n, `${path}.${id}`)
    if (c > 0) dishes[id] = c
  }
  return dishes
}

function parseRanks(value: unknown, path: string): Ranks {
  const o = object(value, path, ['classes', 'mastery'])
  const ranks = newRanks()
  const classes = object(o.classes, `${path}.classes`, RPG_CLASSES)
  for (const c of RPG_CLASSES) {
    const r = count(classes[c], `${path}.classes.${c}`)
    if (r < 1 || r > CLASS_MAX_RANK) throw new SaveParseError(`${path}.classes.${c}`, `expected 1–${CLASS_MAX_RANK}`)
    ranks.classes[c] = r
  }
  const mastery = object(o.mastery, `${path}.mastery`, GEAR_TYPES)
  for (const t of GEAR_TYPES) {
    const r = count(mastery[t], `${path}.mastery.${t}`)
    if (r < 1 || r > MASTERY_MAX_RANK) throw new SaveParseError(`${path}.mastery.${t}`, `expected 1–${MASTERY_MAX_RANK}`)
    ranks.mastery[t] = r
  }
  return ranks
}

/** A build's tree obeys every learning rule (depths by class rank from v5, by level before); its loadout is learned
 * skills within her slots. */
function parseBuild(value: unknown, path: string, id: RpgBuildId, tier: number, level: number, maxDepth: number | undefined): ClassBuild {
  const b = object(value, path, ['tree', 'loadout', 'familiar'])
  const tree = ids(b.tree, `${path}.tree`, 64)
  const { classId, weapons } = RPG_BUILD[id]
  if (!validRpgTree({ classId, weapons: [...weapons], tier, level, tree: tree.map((n) => ({ tier, id: n })), ...(maxDepth !== undefined ? { maxDepth } : {}) })) {
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
    const u = object(raw, at, version < 3 ? ['unlockedAt', 'level', 'exp'] : version < 4 ? ['unlockedAt', 'level', 'exp', 'build', 'builds']
      : version < 5 ? ['unlockedAt', 'level', 'exp', 'build', 'builds', 'professions'] : version < 6 ? ['unlockedAt', 'level', 'exp', 'build', 'builds', 'professions', 'ranks']
        : version < 7 ? ['unlockedAt', 'level', 'exp', 'build', 'builds', 'professions', 'ranks', 'stars']
          : ['unlockedAt', 'level', 'exp', 'build', 'builds', 'professions', 'ranks', 'stars', 'gear'])
    const level = count(u.level, `${at}.level`)
    if (level < 1 || level > MAX_UMA_LEVEL) throw new SaveParseError(`${at}.level`, `expected 1–${MAX_UMA_LEVEL}`)
    const owned: OwnedUma = { unlockedAt: timestamp(u.unlockedAt, `${at}.unlockedAt`), level, exp: count(u.exp, `${at}.exp`), build: null, builds: {},
      professions: version < 4 ? newProfessions() : parseProfessions(u.professions, `${at}.professions`),
      ranks: version < 5 ? newRanks() : parseRanks(u.ranks, `${at}.ranks`),
      stars: version < 6 ? { unlocked: [], active: [] } : parseStars(u.stars, `${at}.stars`, level),
      gear: { locker: [], equipped: {} } }
    if (version >= 7) owned.gear = parseUmaGear(u.gear, `${at}.gear`, owned.ranks)
    if (version >= 3) {
      // v2 → v3 (D52): no build chosen and nothing learned.
      if (u.build !== null && !isRpgBuildId(u.build)) throw new SaveParseError(`${at}.build`, 'expected null or a class build')
      owned.build = u.build as RpgBuildId | null
      const builds = object(u.builds, `${at}.builds`, RPG_BUILDS)
      for (const [key, build] of Object.entries(builds)) {
        const classId = RPG_BUILD[key as RpgBuildId].classId
        owned.builds[key as RpgBuildId] = parseBuild(build, `${at}.builds.${key}`, key as RpgBuildId, tier, level,
          version < 5 ? undefined : depthsOpen(owned.ranks.classes[classId]))
      }
      // v4 → v5 (D57): skills learned under the level gates keep their depths: each class starts at the rank they need.
      if (version < 5) {
        for (const [key, build] of Object.entries(owned.builds)) {
          const classId = RPG_BUILD[key as RpgBuildId].classId
          const deepest = Math.max(0, ...build!.tree.map((n) => rpgNode(n)?.depth ?? 0))
          owned.ranks.classes[classId] = Math.max(owned.ranks.classes[classId], deepest + 1)
        }
      }
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
    return { createdAt: timestamp(w.createdAt, `${path}.createdAt`), wallet: parseWallet(w.wallet, `${path}.wallet`, version), umas: {}, parties: defaultParties(),
      runs: {}, items: {}, facilities: {}, dishes: {}, gear: {} }
  }
  const keys = version === 2 ? ['createdAt', 'wallet', 'umas', 'parties'] : version === 3 ? ['createdAt', 'wallet', 'umas', 'parties', 'runs']
    : version < 6 ? ['createdAt', 'wallet', 'umas', 'parties', 'runs', 'items', 'facilities']
      : version < 7 ? ['createdAt', 'wallet', 'umas', 'parties', 'runs', 'items', 'facilities', 'dishes']
        : ['createdAt', 'wallet', 'umas', 'parties', 'runs', 'items', 'facilities', 'dishes', 'gear']
  const w = object(value, path, keys)
  const umas = parseUmas(w.umas, `${path}.umas`, tier, version)
  return {
    createdAt: timestamp(w.createdAt, `${path}.createdAt`), wallet: parseWallet(w.wallet, `${path}.wallet`, version), umas,
    parties: parseParties(w.parties, `${path}.parties`, umas), runs: version === 2 ? {} : parseRuns(w.runs, `${path}.runs`),
    items: version < 4 ? {} : parseItems(w.items, `${path}.items`),
    facilities: version < 4 ? {} : parseFacilities(w.facilities, `${path}.facilities`, umas),
    dishes: version < 6 ? {} : parseDishes(w.dishes, `${path}.dishes`),
    gear: version < 7 ? {} : parseGearStock(w.gear, `${path}.gear`),
  }
}

/** The raw `schemaVersion` of a stored or sent save, or 0 when it has none. */
export function schemaVersionOf(value: unknown): number {
  const v = (value as { schemaVersion?: unknown } | null)?.schemaVersion
  return typeof v === 'number' && Number.isSafeInteger(v) ? v : 0
}

/** Parses a v1–v7 save and always returns v7. */
export function parseSave(value: unknown, path = 'save'): Save {
  const o = object(value, path, ['schemaVersion', 'account', 'tierWorlds'])
  const version = o.schemaVersion
  if (typeof version !== 'number' || !Number.isInteger(version) || version < 1 || version > SAVE_SCHEMA_VERSION) {
    throw new SaveParseError(`${path}.schemaVersion`, `expected 1–${SAVE_SCHEMA_VERSION}`)
  }
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
