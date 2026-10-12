// Save v16: one snapshot document per account (D32, D45), shared by the web app (Dexie + store) and the API.
// Design: docs/design/game-design.md §2.2 (tier worlds), §3 (collection: 20 starting Unlock Tickets, D40),
// §6 (parties: 20, D41; one party per Uma, D46); docs/design/class-rework.md (per-class loadouts, D86);
// docs/design/pacing.md (professions, the Warehouse, facilities and their jobs, tickets: D55); class ranks and gear
// mastery (S5, D57); dishes and each Uma's Sun-and-planets map (S6, D58); gear, lockers and what's equipped (S7, D59).
import { FACILITY_MAX_LEVEL, FACILITY_SLOTS, MAX_SAVED_JOB_COUNT, PROFESSION_MAX_LEVEL, professionExpToNext, PROFESSIONS, type Profession } from '../economy/pacing'
import { facilitySpec, JOB_KINDS, MAX_QUEUE, type Facility, type Job, type QueuedJob } from '../economy/jobs'
import { depthsOpen, GEAR_TYPES, newRanks, parseTrack, tracksAt, trackId, type Ranks } from '../economy/training'
import { CLASS_MAX_RANK, MASTERY_MAX_RANK } from '../economy/pacing'
import { RPG_CLASSES } from '../rpg/kinds'
import { dishById, isStarNode } from '../economy/dishes'
import { gearById, gearLevel, gearLevelName, slotOf, type GearSlot } from '../economy/gear'
import { WEAPON_TYPES } from '../economy/training'
import { activeNodeSlots } from '../economy/pacing'
import { ITEM_FAMILIES, itemById, type ItemEffect } from '../items/catalog'
import { gradeBand, isToken, masteryTokenId } from '../economy/tokens'
import { replayBattle } from '../rpg/battle/engine'
import type { BattleAction, BattleInput } from '../rpg/battle/types'
import { createRpgRun, RPG_MAX_BATTLE_ACTIONS, type RpgRun, type RpgRunBattle } from '../rpg/campaign/run'
import { rpgNode } from '../rpg/catalog'
import {
  isRpgWeapon, rpgActiveSlots, rpgClassTrees, rpgDefaultWeapons, validRpgTree, validRpgWeapons, type RpgClass, type RpgTreeId,
  type RpgWeapon,
} from '../rpg/rules'

export const SAVE_SCHEMA_VERSION = 16
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
  /** Each takes 30 minutes off a job or training (D74; Rush Tickets before v12, worth two each). */
  timeTickets: number
  /** Each completes one beaten regular fight at once (§11). */
  sweepTickets: number
}

export interface ProfessionLevel { level: number; exp: number }

/** One class of an Uma (D86): the five weapons it wields, the side skills learned in its trees and the skills it has
 * equipped (null: chosen for her, each weapon's deepest core first), by node id. */
export interface ClassLoadout {
  weapons: RpgWeapon[]
  tree: string[]
  loadout: string[] | null
}

/** An outfit the trainer owns in a tier world. */
export interface OwnedUma {
  unlockedAt: string
  level: number
  /** EXP toward the next level (banked at Lv50). */
  exp: number
  /** The class she fights as; null until chosen, which means her best running style's class. */
  classId: RpgClass | null
  /** Every class she has set up: weapons, side skills, equipped skills (D86). */
  classes: Partial<Record<RpgClass, ClassLoadout>>
  /** Farming & Cooking and Gathering & Crafting, 1–50 each (design §4). */
  professions: Record<Profession, ProfessionLevel>
  /** Class ranks (1–5, D77) and Weapon, Armor and Accessory Levels (1–10, D70). */
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
  /** The world map's progress (D66): the active party, wins per stage, MP per Uma, the open fight, Spring uses. */
  world: WorldState
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

export const newWallet = (unlockTickets: number): Wallet => ({ unlockTickets, shards: 0, laurels: 0, timeTickets: 0, sweepTickets: 0 })
export const newProfessions = (): Record<Profession, ProfessionLevel> => ({ farming: { level: 1, exp: 0 }, gathering: { level: 1, exp: 0 } })
export const newOwnedUma = (now: string): OwnedUma => ({ unlockedAt: now, level: 1, exp: 0, classId: null, classes: {}, professions: newProfessions(), ranks: newRanks(),
  stars: { unlocked: [], active: [] }, gear: { locker: [], equipped: {} } })

/** The world's state (D66). */
export interface WorldState {
  /** The party that fights: any of the twenty, swapped any time outside a fight. */
  activeParty: number
  /** World-wide progress as one run: wins per stage, MP per Uma (absent is full), the open fight and its party. */
  run: RpgRun
  /** When each Spring was last used (they recharge in two hours). */
  springs: Record<string, string>
}
export const newWorldState = (now: string): WorldState => ({ activeParty: 0, run: createRpgRun(0, 'world', now), springs: {} })

export function newTierWorld(now: string, unlockTickets: number): TierWorld {
  return { createdAt: now, wallet: newWallet(unlockTickets), umas: {}, parties: defaultParties(), world: newWorldState(now), items: {}, facilities: {}, dishes: {}, gear: {} }
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
  // v11 → v12 (D74): an hour's Rush Ticket becomes two 30-minute Time Tickets.
  const o = object(value, path, ['unlockTickets', 'shards', 'laurels', version < 12 ? 'rushTickets' : 'timeTickets', 'sweepTickets'])
  return {
    unlockTickets: count(o.unlockTickets, `${path}.unlockTickets`), shards: count(o.shards, `${path}.shards`), laurels: count(o.laurels, `${path}.laurels`),
    timeTickets: version < 12 ? 2 * count(o.rushTickets, `${path}.rushTickets`) : count(o.timeTickets, `${path}.timeTickets`),
    sweepTickets: count(o.sweepTickets, `${path}.sweepTickets`),
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
    if (!itemById(id) && !isToken(id)) throw new SaveParseError(`${path}.${id}`, 'unknown item')
    const c = count(n, `${path}.${id}`)
    if (c > 0) items[id] = c
  }
  return items
}

const JOB_KEYS = ['kind', 'outfitId', 'output', 'count', 'collected', 'startedAt', 'msEach', 'expEach', 'inputs'] as const

function parseQueue(value: unknown, path: string): QueuedJob[] {
  if (!Array.isArray(value) || value.length > MAX_QUEUE) throw new SaveParseError(path, `expected at most ${MAX_QUEUE} queued jobs`)
  return value.map((raw: unknown, i: number) => {
    const at = `${path}.${i}`
    const q = object(raw, at, ['output', 'count', 'msEach', 'expEach', 'inputs'])
    if (typeof q.output !== 'string' || q.output.length < 1 || q.output.length > 80) throw new SaveParseError(`${at}.output`, 'expected an id')
    const n = count(q.count, `${at}.count`)
    if (n < 1 || n > MAX_SAVED_JOB_COUNT) throw new SaveParseError(`${at}.count`, `expected 1–${MAX_SAVED_JOB_COUNT}`)
    const msEach = count(q.msEach, `${at}.msEach`)
    if (msEach < 1) throw new SaveParseError(`${at}.msEach`, 'expected a positive duration')
    return { output: q.output, count: n, msEach, expEach: count(q.expEach, `${at}.expEach`), inputs: parseItems(q.inputs, `${at}.inputs`) }
  })
}

function parseJob(value: unknown, path: string, kind: Job['kind'], umas: Record<string, OwnedUma>): Job {
  const j = object(value, path, [...JOB_KEYS, 'queue'])
  if (j.kind !== kind || !JOB_KINDS.includes(j.kind as Job['kind'])) throw new SaveParseError(`${path}.kind`, `expected ${kind}`)
  if (typeof j.outfitId !== 'string' || !umas[j.outfitId]) throw new SaveParseError(`${path}.outfitId`, 'expected an owned outfit')
  if (typeof j.output !== 'string' || j.output.length < 1 || j.output.length > 80) throw new SaveParseError(`${path}.output`, 'expected an id')
  if ((kind === 'gather' || kind === 'refine') && !itemById(j.output)) throw new SaveParseError(`${path}.output`, 'unknown item')
  if (kind === 'train' && !parseTrack(j.output)) throw new SaveParseError(`${path}.output`, 'unknown training track')
  if (kind === 'cook' && !dishById(j.output)) throw new SaveParseError(`${path}.output`, 'unknown dish')
  if (kind === 'craft' && !gearById(j.output)) throw new SaveParseError(`${path}.output`, 'unknown gear')
  const n = count(j.count, `${path}.count`)
  if (n < 1 || n > MAX_SAVED_JOB_COUNT) throw new SaveParseError(`${path}.count`, `expected 1–${MAX_SAVED_JOB_COUNT}`)
  const collected = count(j.collected, `${path}.collected`)
  if (collected > n) throw new SaveParseError(`${path}.collected`, 'more than the job makes')
  const msEach = count(j.msEach, `${path}.msEach`)
  if (msEach < 1) throw new SaveParseError(`${path}.msEach`, 'expected a positive duration')
  const inputs = parseItems(j.inputs, `${path}.inputs`)
  return { kind, outfitId: j.outfitId, output: j.output, count: n, collected, startedAt: timestamp(j.startedAt, `${path}.startedAt`), msEach,
    expEach: count(j.expEach, `${path}.expEach`), inputs, queue: parseQueue(j.queue, `${path}.queue`) }
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
    if (gearLevel(ranks, piece.type) < piece.grade) throw new SaveParseError(`${path}.equipped.${slot}`, `needs ${gearLevelName(piece.type)} ${piece.grade}`)
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
  const o = object(value, path, ['classes', 'weapons', 'armor', 'accessory'])
  const level = (v: unknown, at: string, max: number) => {
    const r = count(v, at)
    if (r < 1 || r > max) throw new SaveParseError(at, `expected 1–${max}`)
    return r
  }
  const ranks = newRanks()
  const classes = object(o.classes, `${path}.classes`, RPG_CLASSES)
  const weapons = object(o.weapons, `${path}.weapons`, RPG_CLASSES)
  for (const c of RPG_CLASSES) {
    ranks.classes[c] = level(classes[c], `${path}.classes.${c}`, CLASS_MAX_RANK)
    ranks.weapons[c] = level(weapons[c], `${path}.weapons.${c}`, MASTERY_MAX_RANK)
  }
  return { ...ranks, armor: level(o.armor, `${path}.armor`, MASTERY_MAX_RANK), accessory: level(o.accessory, `${path}.accessory`, MASTERY_MAX_RANK) }
}

/** A class's weapons fit its slots, its side skills obey every learning rule at her level and rank, and its equipped
 * skills are its trees' nodes within her slots (whether a core is open yet is checked when she fights). */
function parseLoadout(value: unknown, path: string, classId: RpgClass, tier: number, level: number, maxDepth: number): ClassLoadout {
  const b = object(value, path, ['weapons', 'tree', 'loadout'])
  const weapons = ids(b.weapons, `${path}.weapons`, 5) as RpgWeapon[]
  if (!weapons.every(isRpgWeapon) || !validRpgWeapons(classId, weapons)) throw new SaveParseError(`${path}.weapons`, `not five weapons a ${classId} can wield`)
  const tree = ids(b.tree, `${path}.tree`, 64)
  if (!validRpgTree({ classId, tier, level, tree: tree.map((n) => ({ tier, id: n })), maxDepth })) {
    throw new SaveParseError(`${path}.tree`, `not a valid ${classId} tree at Lv${level}`)
  }
  if (b.loadout === null) return { weapons, tree, loadout: null }
  const loadout = ids(b.loadout, `${path}.loadout`, rpgActiveSlots(level))
  const trees: RpgTreeId[] = rpgClassTrees(classId)
  if (loadout.some((n) => { const node = rpgNode(n); return !node || !trees.includes(node.tree) || (node.variant !== null && !tree.includes(n)) })) {
    throw new SaveParseError(`${path}.loadout`, 'only skills of her trees can be equipped')
  }
  return { weapons, tree, loadout }
}

/** v13 and older: the six builds of the old classes, by the class each belonged to (D86 replaced them). */
const OLD_BUILD_CLASS: Readonly<Record<string, RpgClass>> = {
  'greatsword-spear': 'brawler', 'axe-bow': 'brawler', mage: 'mage', spellblade: 'spellblade', cleric: 'cleric', summoner: 'summoner',
}

function parseUmas(value: unknown, path: string, tier: number, version: number): Record<string, OwnedUma> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new SaveParseError(path, 'expected an object')
  const umas: Record<string, OwnedUma> = {}
  for (const [id, raw] of Object.entries(value)) {
    const at = `${path}.${id}`
    if (!OUTFIT_ID.test(id)) throw new SaveParseError(at, 'outfit ids are positive integers')
    const old = version < 14
    const u = object(raw, at, ['unlockedAt', 'level', 'exp', old ? 'build' : 'classId', old ? 'builds' : 'classes', 'professions', 'ranks', 'stars', 'gear'])
    const level = count(u.level, `${at}.level`)
    if (level < 1 || level > MAX_UMA_LEVEL) throw new SaveParseError(`${at}.level`, `expected 1–${MAX_UMA_LEVEL}`)
    const ranks = parseRanks(u.ranks, `${at}.ranks`)
    const owned: OwnedUma = { unlockedAt: timestamp(u.unlockedAt, `${at}.unlockedAt`), level, exp: count(u.exp, `${at}.exp`), classId: null, classes: {},
      professions: parseProfessions(u.professions, `${at}.professions`), ranks, stars: parseStars(u.stars, `${at}.stars`, level),
      gear: parseUmaGear(u.gear, `${at}.gear`, ranks) }
    if (old) {
      // v13 → v14 (D86): the build's class carries over; learned skills reset (cores now come free, points come back).
      if (u.build !== null && !(typeof u.build === 'string' && u.build in OLD_BUILD_CLASS)) throw new SaveParseError(`${at}.build`, 'expected null or a class build')
      owned.classId = u.build === null ? null : OLD_BUILD_CLASS[u.build as string]!
    } else {
      if (u.classId !== null && !RPG_CLASSES.includes(u.classId as RpgClass)) throw new SaveParseError(`${at}.classId`, 'expected null or a class')
      owned.classId = u.classId as RpgClass | null
      const classes = object(u.classes, `${at}.classes`, RPG_CLASSES)
      for (const [key, loadout] of Object.entries(classes)) {
        const classId = key as RpgClass
        owned.classes[classId] = parseLoadout(loadout, `${at}.classes.${key}`, classId, tier, level, depthsOpen(owned.ranks.classes[classId]))
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

// A Spell Blade's act carries its other half as `pair` (D86); `blessing` stays readable for fights saved before it.
const ACTION_KEYS: Record<BattleAction['kind'], readonly string[]> = {
  attack: ['kind', 'actorId', 'targetId', 'weapon', 'pair'],
  guard: ['kind', 'actorId', 'targetId'],
  skill: ['kind', 'actorId', 'targetId', 'skill', 'pair', 'blessing'],
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

const SPRING_ID = /^w\d{1,2}-spring\d{1,2}$/

/** The world's state (D66): its one run (chapter id `world`, party the open fight's), the active party, Spring uses. */
function parseWorldState(value: unknown, path: string): WorldState {
  const w = object(value, path, ['activeParty', 'run', 'springs'])
  const activeParty = count(w.activeParty, `${path}.activeParty`)
  if (activeParty >= PARTY_COUNT) throw new SaveParseError(`${path}.activeParty`, `expected 0–${PARTY_COUNT - 1}`)
  const at = `${path}.run`
  const r = object(w.run, at, ['party', 'chapterId', 'wins', 'mp', 'battle', 'battles', 'clearedAt', 'updatedAt'])
  const party = count(r.party, `${at}.party`)
  if (party >= PARTY_COUNT) throw new SaveParseError(`${at}.party`, `expected 0–${PARTY_COUNT - 1}`)
  if (r.chapterId !== 'world') throw new SaveParseError(`${at}.chapterId`, 'expected world')
  const run: RpgRun = {
    party, chapterId: 'world', wins: counts(r.wins, `${at}.wins`, 1), mp: counts(r.mp, `${at}.mp`, 0),
    battle: r.battle === null ? null : parseBattle(r.battle, `${at}.battle`), battles: count(r.battles, `${at}.battles`),
    clearedAt: r.clearedAt === null ? null : timestamp(r.clearedAt, `${at}.clearedAt`), updatedAt: timestamp(r.updatedAt, `${at}.updatedAt`),
  }
  if (typeof w.springs !== 'object' || w.springs === null || Array.isArray(w.springs)) throw new SaveParseError(`${path}.springs`, 'expected an object')
  const springs: Record<string, string> = {}
  for (const [id, used] of Object.entries(w.springs)) {
    if (!SPRING_ID.test(id)) throw new SaveParseError(`${path}.springs.${id}`, 'unknown Spring')
    springs[id] = timestamp(used, `${path}.springs.${id}`)
  }
  return { activeParty, run, springs }
}

/**
 * Saves before v10 start their progress over (D69, for the D65–D70 rebalance): the collection, parties and Unlock
 * Tickets stay; every level, rank, skill, Extra Stat, item, piece of gear, job, run and Laurel goes.
 */
function resetTierWorld(value: unknown, path: string): TierWorld {
  const w = (typeof value === 'object' && value !== null && !Array.isArray(value) ? value : {}) as Obj
  const createdAt = timestamp(w.createdAt, `${path}.createdAt`)
  const rawUmas = (typeof w.umas === 'object' && w.umas !== null && !Array.isArray(w.umas) ? w.umas : {}) as Obj
  const umas: Record<string, OwnedUma> = {}
  for (const [id, raw] of Object.entries(rawUmas)) {
    if (!OUTFIT_ID.test(id)) throw new SaveParseError(`${path}.umas.${id}`, 'outfit ids are positive integers')
    umas[id] = newOwnedUma(timestamp((raw as Obj | null)?.unlockedAt, `${path}.umas.${id}.unlockedAt`))
  }
  const tickets = ((typeof w.wallet === 'object' && w.wallet !== null ? w.wallet : {}) as Obj).unlockTickets
  return {
    ...newTierWorld(createdAt, typeof tickets === 'number' && Number.isSafeInteger(tickets) && tickets >= 0 ? tickets : 0),
    umas, parties: w.parties === undefined ? defaultParties() : parseParties(w.parties, `${path}.parties`, umas),
  }
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)
const RETIRED_TOKEN = /^token-class-[a-z]+-5$/
const dropRetired = (items: unknown) => {
  if (isRecord(items)) for (const id of Object.keys(items)) if (RETIRED_TOKEN.test(id)) delete items[id]
}

/**
 * v12 → v13 (D77): class ranks top out at 5, rank r opens depths 1–r behind the Uma-level gates, and band 5 drops no
 * Promotion Tokens. Clamps ranks, forgets skills the gates now close (their points come back) and drops band-5
 * Promotion Tokens. Anything malformed is left for the strict parse to reject.
 */
function toV13(world: Record<string, unknown>): Record<string, unknown> {
  const w = JSON.parse(JSON.stringify(world)) as Record<string, unknown>
  dropRetired(w.items)
  if (isRecord(w.facilities)) {
    for (const f of Object.values(w.facilities)) {
      if (!isRecord(f) || !Array.isArray(f.jobs)) continue
      for (const job of f.jobs) {
        if (!isRecord(job)) continue
        dropRetired(job.inputs)
        if (Array.isArray(job.queue)) for (const q of job.queue) if (isRecord(q)) dropRetired(q.inputs)
      }
    }
  }
  if (isRecord(w.umas)) {
    for (const uma of Object.values(w.umas)) {
      if (!isRecord(uma) || !isRecord(uma.ranks) || !isRecord(uma.ranks.classes) || !isRecord(uma.builds) || typeof uma.level !== 'number') continue
      const classes = uma.ranks.classes
      const level = uma.level
      for (const c of Object.keys(classes)) {
        const r = classes[c]
        if (typeof r === 'number' && r > CLASS_MAX_RANK) classes[c] = CLASS_MAX_RANK
      }
    }
  }
  return w
}

/** Gear types D86 renamed, and the ones it retired with the families their old recipes took (main, then the accent's). */
const RENAMED_GEAR: Readonly<Record<string, string>> = { spear: 'lance', 'short-sword': 'katana' }
const RETIRED_GEAR: Readonly<Record<string, string>> = { 'mage-staff': 'woods', 'arcane-staff': 'woods', 'cleric-staff': 'woods', 'summoner-tome': 'fibers' }
const ACCENT_FAMILY: Readonly<Record<string, string>> = {
  hp: 'hides-scales', mp: 'essences', atk: 'ores', matk: 'crystals', def: 'stones', mdef: 'fibers', speed: 'woods', limit: 'bones-horns',
}
const OLD_GEAR = /^([a-z-]+)-g(\d{1,2})-([a-z]+)$/
/** A v13 gear id as v14 reads it: renamed, or null when retired. */
function v14Gear(id: unknown): string | null | undefined {
  const m = typeof id === 'string' ? OLD_GEAR.exec(id) : null
  if (!m) return undefined
  if (m[1]! in RETIRED_GEAR) return null
  return RENAMED_GEAR[m[1]!] ? `${RENAMED_GEAR[m[1]!]}-g${m[2]}-${m[3]}` : (id as string)
}
/** What a retired piece gives back: its old recipe's main and accent refined items and its Crafting Token. */
function refundOf(id: string): Record<string, number> {
  const [, type, g, accent] = OLD_GEAR.exec(id)!
  const grade = Number(g)
  const refined = (family: string) => ITEM_FAMILIES.find((f) => f.id === family)?.refined[grade - 1]?.id
  const out: Record<string, number> = {}
  for (const family of [RETIRED_GEAR[type!]!, ACCENT_FAMILY[accent!]]) { const r = family ? refined(family) : undefined; if (r) out[r] = (out[r] ?? 0) + 1 }
  // The Crafting Token as it was; v15 turns it into a Mastery Token like every other.
  const token = `token-craft-${accent}-${gradeBand(grade)}`
  out[token] = (out[token] ?? 0) + 1
  return out
}

/**
 * v13 → v14 (D86): Spear pieces become Lance pieces and Short Swords Katanas; Mage, Arcane and Cleric Staves and
 * Summoner Tomes are taken back and their materials and Crafting Token returned (a Forge job making one is cancelled the
 * same way); an open fight closes with no loss. Builds become classes in parseUmas.
 */
function toV14(world: Record<string, unknown>): Record<string, unknown> {
  const w = JSON.parse(JSON.stringify(world)) as Record<string, unknown>
  const items = (isRecord(w.items) ? w.items : (w.items = {})) as Record<string, number>
  const refund = (id: string, times = 1) => { for (const [k, n] of Object.entries(refundOf(id))) items[k] = (items[k] ?? 0) + n * times }
  if (isRecord(w.gear)) {
    const next: Record<string, unknown> = {}
    for (const [id, n] of Object.entries(w.gear)) {
      const to = v14Gear(id)
      if (to === null) { refund(id, typeof n === 'number' ? n : 0); continue }
      next[to ?? id] = n
    }
    w.gear = next
  }
  if (isRecord(w.umas)) {
    for (const uma of Object.values(w.umas)) {
      if (!isRecord(uma) || !isRecord(uma.gear)) continue
      const gear = uma.gear
      if (Array.isArray(gear.locker)) {
        gear.locker = gear.locker.flatMap((id: unknown) => {
          const to = v14Gear(id)
          if (to === null) { refund(id as string); return [] }
          return [to ?? id]
        })
      }
      if (isRecord(gear.equipped)) {
        const next: Record<string, unknown> = {}
        for (const [slot, id] of Object.entries(gear.equipped)) {
          const to = v14Gear(id)
          if (to === null || slot in RETIRED_GEAR) continue
          next[RENAMED_GEAR[slot] ?? slot] = to ?? id
        }
        gear.equipped = next
      }
    }
  }
  if (isRecord(w.facilities)) {
    for (const f of Object.values(w.facilities)) {
      if (!isRecord(f) || !Array.isArray(f.jobs)) continue
      f.jobs = f.jobs.map((job: unknown) => {
        if (!isRecord(job) || job.kind !== 'craft') return job
        if (Array.isArray(job.queue)) job.queue = job.queue.filter((q: unknown) => !(isRecord(q) && v14Gear(q.output) === null))
          .map((q: unknown) => (isRecord(q) && v14Gear(q.output) ? { ...q, output: v14Gear(q.output) } : q))
        const to = v14Gear(job.output)
        if (to === null) {
          // The pieces still to make give their inputs back.
          const left = Math.max(0, Number(job.count) - Number(job.collected))
          if (isRecord(job.inputs)) for (const [k, n] of Object.entries(job.inputs)) if (typeof n === 'number') items[k] = (items[k] ?? 0) + n * left
          return null
        }
        return to ? { ...job, output: to } : job
      })
    }
  }
  if (isRecord(w.world) && isRecord(w.world.run)) w.world.run = { ...w.world.run, battle: null }
  return w
}

/** A Crafting Token's id before v15 (`token-craft-<stat>-<band>`), or null. */
const OLD_CRAFT_TOKEN = /^token-craft-[a-z]+-(\d)$/
/**
 * v14 → v15 (D94): Crafting Tokens become Mastery Tokens of the same band, one for one; gear recipes take no token now.
 * A Forge job's reserved tokens come back as Mastery Tokens and leave its inputs, and queued Forge jobs drop theirs.
 */
function toV15(world: Record<string, unknown>): Record<string, unknown> {
  const w = JSON.parse(JSON.stringify(world)) as Record<string, unknown>
  const items = (isRecord(w.items) ? w.items : (w.items = {})) as Record<string, number>
  const add = (id: string, n: number) => { if (n > 0) items[id] = (items[id] ?? 0) + n }
  for (const [id, n] of Object.entries(items)) {
    const m = OLD_CRAFT_TOKEN.exec(id)
    if (!m) continue
    delete items[id]
    add(masteryTokenId(Number(m[1])), typeof n === 'number' ? n : 0)
  }
  const strip = (inputs: unknown, times: number): Record<string, unknown> => {
    const out: Record<string, unknown> = {}
    if (!isRecord(inputs)) return out
    for (const [id, n] of Object.entries(inputs)) {
      const m = OLD_CRAFT_TOKEN.exec(id)
      if (m) add(masteryTokenId(Number(m[1])), typeof n === 'number' ? n * times : 0)
      else out[id] = n
    }
    return out
  }
  if (isRecord(w.facilities)) {
    for (const f of Object.values(w.facilities)) {
      if (!isRecord(f) || !Array.isArray(f.jobs)) continue
      for (const job of f.jobs) {
        if (!isRecord(job)) continue
        job.inputs = strip(job.inputs, Math.max(0, Number(job.count) - Number(job.collected)))
        if (Array.isArray(job.queue)) for (const q of job.queue) if (isRecord(q)) q.inputs = strip(q.inputs, 0)
      }
    }
  }
  return w
}

/** EXP from level L to L+1 before D96, kept to carry levels over. */
const OLD_PROFESSION_EXP = (level: number): number => 20 + 6 * level
/**
 * v15 → v16 (D96): the profession curve is ten times longer. Jobs still pay the same EXP per minute of work, so every Farm
 * and Craft Level carries its EXP over whole and lands at the level that work earns on the new curve.
 */
function toV16(world: Record<string, unknown>): Record<string, unknown> {
  const w = JSON.parse(JSON.stringify(world)) as Record<string, unknown>
  if (!isRecord(w.umas)) return w
  for (const uma of Object.values(w.umas)) {
    if (!isRecord(uma) || !isRecord(uma.professions)) continue
    for (const p of Object.values(uma.professions)) {
      if (!isRecord(p) || !Number.isInteger(p.level) || !Number.isInteger(p.exp)) continue
      let bank = Number(p.exp)
      for (let l = 1; l < Math.min(Number(p.level), PROFESSION_MAX_LEVEL); l++) bank += OLD_PROFESSION_EXP(l)
      let level = 1
      while (level < PROFESSION_MAX_LEVEL && bank >= professionExpToNext(level)) bank -= professionExpToNext(level++)
      p.level = level
      p.exp = bank
    }
  }
  return w
}

function parseTierWorld(raw: unknown, path: string, version: number, tier: number): TierWorld {
  if (version < 10) return resetTierWorld(raw, path)
  const v13 = version < 13 && isRecord(raw) ? toV13(raw) : raw
  const v14 = version < 14 && isRecord(v13) ? toV14(v13) : v13
  const v15 = version < 15 && isRecord(v14) ? toV15(v14) : v14
  const value = version < 16 && isRecord(v15) ? toV16(v15) : v15
  // v10 → v11 (D66): chapter runs give way to the world map; their wins and MP don't carry.
  const w = object(value, path, ['createdAt', 'wallet', 'umas', 'parties', version < 11 ? 'runs' : 'world', 'items', 'facilities', 'dishes', 'gear'])
  const umas = parseUmas(w.umas, `${path}.umas`, tier, version)
  const createdAt = timestamp(w.createdAt, `${path}.createdAt`)
  return {
    createdAt, wallet: parseWallet(w.wallet, `${path}.wallet`, version), umas,
    parties: parseParties(w.parties, `${path}.parties`, umas), world: version < 11 ? newWorldState(createdAt) : parseWorldState(w.world, `${path}.world`),
    items: parseItems(w.items, `${path}.items`), facilities: parseFacilities(w.facilities, `${path}.facilities`, umas),
    dishes: parseDishes(w.dishes, `${path}.dishes`), gear: parseGearStock(w.gear, `${path}.gear`),
  }
}

/** The raw `schemaVersion` of a stored or sent save, or 0 when it has none. */
export function schemaVersionOf(value: unknown): number {
  const v = (value as { schemaVersion?: unknown } | null)?.schemaVersion
  return typeof v === 'number' && Number.isSafeInteger(v) ? v : 0
}

/** Parses a v1–v16 save and always returns v16; anything older than v10 starts its progress over (D69). */
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
