// Save v22: one snapshot document per account (D32, D45), shared by the web app (Dexie + store) and the API. v22 (SC3):
// work runs on the shared engine, `@luismlorenzana/uma-work`: each Uma's work is her own row, and facilities keep only
// their levels. v21 (D144): one profession, Craft Level, and Star Gems for Extra Stats; more facility slots. v20 (D124):
// armor without accents, a feet slot, two accessory slots and Accessory Ranks. v19 (D106): the Halls of Heroes, their
// Learners and Bonds. v18 (D102–D105): ranks earned by fighting, five armor slots, Marks, no tokens, and a progress reset
// for every older save.
// Design: docs/design/game-design.md §2.2 (tier worlds), §3 (collection: 20 starting Uma Tickets, D40),
// §6 (parties: 20, D41; one party per Uma, D46); docs/design/class-rework.md (per-class loadouts, D86);
// docs/design/pacing.md (Craft Level, the Warehouse, facilities and their jobs, tickets: D55); class ranks and gear
// mastery (S5, D57); Star Gems and each Uma's Sun-and-planets map (S6, D58, D144); gear, lockers and what's equipped (S7,
// D59).
import type { DroppedQueue, Entry, ItemQty, LastWork, Refusal, SlotRef, WorkOutput, WorkRow, WorkState } from '@luismlorenzana/uma-work'
import { FACILITY_MAX_LEVEL, FACILITY_SLOTS, maxJobCount, PROFESSION_MAX_LEVEL } from '../economy/pacing'
import { facilitySpec, JOB_KINDS, type JobKind } from '../economy/jobs'
import type { RpgWorkRequest } from '../work/request'
import {
  ACCESSORY_KINDS, ARMOR_KINDS, ARMOR_SLOT_KINDS, ARMOR_SLOTS, armorKindFor, CLASS_MAX_RANK, classExpToNext, GEAR_MAX_RANK, gearExpToNext, isArmorKind, newRanks,
  WEAPON_TYPES, type AccessoryKind, type ArmorKind, type ArmorSlot, type RankTrack, type Ranks,
} from '../economy/ranks'
import { RPG_CLASSES } from '../rpg/kinds'
import { BOND_EXP_TO_NEXT, BOND_MAX_LEVEL, HERO_MAX_LEARNERS, isHeroLimitId, LEARNER_MAX_PARENTS, type HeroLimitId } from '../rpg/hero-id'
import { isGemId, isStarNode } from '../economy/stars'
import {
  GEAR_SLOTS, gearIdentity as gearById, gearLevel, gearLevelName, isAccessory, isAccessorySlot, isArmor, slotOf, type GearSlot,
} from '../economy/gear-id'
import { activeNodeSlots } from '../economy/pacing'
import { isItemId } from '../items/identity'
import { replayBattle } from '../rpg/battle/engine'
import type { BattleAction, BattleInput } from '../rpg/battle/types'
import { createRpgRun, RPG_MAX_BATTLE_ACTIONS, type RpgRun, type RpgRunBattle } from '../rpg/campaign/run-state'
import { rpgNodeIdentity as rpgNode } from '../rpg/node-identity'
import {
  isRpgWeapon, RPG_CLASS_ARMOR, rpgActiveSlots, rpgClassTrees, rpgDefaultWeapons, validRpgTree, validRpgWeapons, type RpgClass, type RpgTreeId,
  type RpgWeapon,
} from '../rpg/rules'
import { migrateWorld } from './migrations'

export const SAVE_SCHEMA_VERSION = 22
/** Umas marked as targets, whose gear and gems the facilities plan for (D100). */
export const MAX_TARGETS = 10
export const STARTING_UNLOCK_TICKETS = 20
export const TRAINER_NAME_MAX = 24
export const DEFAULT_TRAINER_NAME = 'Trainer'
export const PARTY_COUNT = 20
export const PARTY_SIZE = 5
export const PARTY_NAME_MAX = 24
export const MAX_UMA_LEVEL = 50
/** Five Uma Shards make one Uma Ticket (D5, converted automatically: D47). */
export const SHARDS_PER_TICKET = 5

export interface Wallet {
  unlockTickets: number
  shards: number
  laurels: number
  /** Each takes 30 minutes off a job or training (D74; Rush Tickets before v12, worth two each). */
  timeTickets: number
  /** Each completes one beaten regular fight at once (§11). */
  sweepTickets: number
  /** EXP past a max Weapon or Armor Rank, banked at half rate; spent on Manuals (D102). */
  gearMarks: number
  /** EXP past a max Class Rank, banked at half rate. */
  classMarks: number
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
  /** Her Craft Level, 1–50 (D144): gathering, refining, crafting and cutting. */
  craft: ProfessionLevel
  /** Class Ranks (1–50), Weapon and Armor Ranks (1–10), earned by fighting (D102). */
  ranks: Ranks
  /** Her Sun-and-planets map: nodes opened by setting Star Gems, and the ones active now (S6, design §10). */
  stars: Stars
  /** Gear bound to her (her locker) and what she wears: one piece per weapon type and one per armor slot (S7, D103). */
  gear: UmaGear
  /** Her Bond with each Hero seat she has learned under (D106), kept when she leaves it. */
  bonds: Partial<Record<HeroLimitId, BondTrack>>
}

/** Bond Level 0–10 and the EXP toward the next (D106). */
export interface BondTrack { level: number; exp: number }
/** A Hall of Heroes seat (D106): its Hero and up to ten Learners, keyed by the seat's Limit Break. An empty seat is absent. */
export interface HeroSeat { hero: string; learners: string[] }

/** `kinds`: which armor kind each armor slot holds (absent: the physical one). A new Uma of a magical starting class has
 * all five set to the magical kind; a physical one has none (D160 §7). An empty armor slot holds the kind's Training
 * piece, grade 0, as an empty weapon slot holds a Training weapon (D98, D103); an empty accessory slot holds nothing.
 * `equipped` keys: her weapons, her five armor slots and her two accessory slots (D124). */
export interface UmaGear { locker: string[]; equipped: Partial<Record<GearSlot, string>>; kinds: Partial<Record<ArmorSlot, ArmorKind>> }
/** The armor kind a slot holds now: absent means physical (a new Mage, Cleric or Summoner has all five set magical). */
export const slotKind = (gear: Pick<UmaGear, 'kinds'>, slot: ArmorSlot): ArmorKind => gear.kinds[slot] ?? ARMOR_SLOT_KINDS[slot][0]

export interface Stars { unlocked: string[]; active: string[] }

export interface Party {
  name: string
  /** Five slots of owned outfit ids (`RosterOutfit.outfitId`), or null. */
  slots: (string | null)[]
}

export interface TierWorld extends WorkState<RpgWorkRequest> {
  createdAt: string
  wallet: Wallet
  /** Owned outfits by outfit id. */
  umas: Record<string, OwnedUma>
  /** Always PARTY_COUNT parties. An Uma is in at most one slot of one party (D46). */
  parties: Party[]
  /** The world map's progress (D66): the active party, wins per stage, MP per Uma, the open fight, Spring uses. */
  world: WorldState
  /** The Warehouse: raw and refined items by id, free to use (a job's inputs leave it when the job starts). */
  items: Record<string, number>
  /** Facilities above level 1, by place id (SC3). */
  buildings: Record<string, { level: number }>
  /** Each Uma's work, by outfit id (SC3): her started entries, up to three queued, her last job for Repeat and a queue
   * that couldn't start. Absent when she has none of these. */
  work: Record<string, WorkRow<RpgWorkRequest>>
  /** Cut Star Gems waiting to be set, by gem id (D144). */
  gems: Record<string, number>
  /** Crafted gear nobody wears yet, by piece id (S7). Equipping binds a piece to an Uma for good. */
  gear: Record<string, number>
  /** Up to five owned Umas whose gear and gems the facilities plan for (D100). */
  targets: string[]
  /** The Halls of Heroes' seats (D106): an Uma is a Hero in one seat at most, or a Learner in two at most, never both. */
  heroes: Partial<Record<HeroLimitId, HeroSeat>>
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

export const newWallet = (unlockTickets: number): Wallet => ({ unlockTickets, shards: 0, laurels: 0, timeTickets: 0, sweepTickets: 0, gearMarks: 0, classMarks: 0 })
/** A new Uma's armor kinds (D160 §7): all five magical for a magical starting class, none set (physical) otherwise. */
export function startingArmorKinds(classId?: RpgClass): UmaGear['kinds'] {
  if (!classId || RPG_CLASS_ARMOR[classId] !== 'magical') return {}
  return Object.fromEntries(ARMOR_SLOTS.map((s) => [s, armorKindFor(s, 'magical')]))
}
/** A just-unlocked Uma; `startClass` (her starting class) sets her armor kinds, and without it she starts all-physical. */
export const newOwnedUma = (now: string, startClass?: RpgClass): OwnedUma => ({ unlockedAt: now, level: 1, exp: 0, classId: null, classes: {}, craft: { level: 1, exp: 0 }, ranks: newRanks(),
  stars: { unlocked: [], active: [] }, gear: { locker: [], equipped: {}, kinds: startingArmorKinds(startClass) }, bonds: {} })

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
  return { createdAt: now, wallet: newWallet(unlockTickets), umas: {}, parties: defaultParties(), world: newWorldState(now), items: {}, buildings: {}, work: {}, gems: {}, gear: {}, targets: [], heroes: {} }
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
  const o = object(value, path, ['unlockTickets', 'shards', 'laurels', 'timeTickets', 'sweepTickets', 'gearMarks', 'classMarks'])
  return {
    unlockTickets: count(o.unlockTickets, `${path}.unlockTickets`), shards: count(o.shards, `${path}.shards`), laurels: count(o.laurels, `${path}.laurels`),
    timeTickets: count(o.timeTickets, `${path}.timeTickets`), sweepTickets: count(o.sweepTickets, `${path}.sweepTickets`),
    gearMarks: count(o.gearMarks, `${path}.gearMarks`), classMarks: count(o.classMarks, `${path}.classMarks`),
  }
}

function parseCraft(value: unknown, path: string): ProfessionLevel {
  const v = object(value, path, ['level', 'exp'])
  const level = count(v.level, `${path}.level`)
  if (level < 1 || level > PROFESSION_MAX_LEVEL) throw new SaveParseError(`${path}.level`, `expected 1–${PROFESSION_MAX_LEVEL}`)
  return { level, exp: count(v.exp, `${path}.exp`) }
}

function parseItems(value: unknown, path: string): Record<string, number> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new SaveParseError(path, 'expected an object')
  const items: Record<string, number> = {}
  for (const [id, n] of Object.entries(value)) {
    if (!isItemId(id)) throw new SaveParseError(`${path}.${id}`, 'unknown item')
    const c = count(n, `${path}.${id}`)
    if (c > 0) items[id] = c
  }
  return items
}

// --- Work (SC3): the shared engine's rows, parsed strictly ----------------------------------------------------------

/** A whole number of milliseconds since the epoch. */
function ms(value: unknown, path: string): number {
  return count(value, path)
}

function positive(value: unknown, path: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) throw new SaveParseError(path, 'expected a positive number')
  return value
}

function list(value: unknown, path: string, min: number, max: number): unknown[] {
  if (!Array.isArray(value) || value.length < min || value.length > max) throw new SaveParseError(path, `expected ${min}–${max} entries`)
  return value
}

/** Whether `id` is something a kind makes: an item at a site or the Workbench, gear at the Forge, a gem at the Lapidary. */
const madeBy = (kind: JobKind, id: string): boolean => (kind === 'craft' ? !!gearById(id) : kind === 'cut' ? isGemId(id) : isItemId(id))

function parseRequest(value: unknown, path: string, kind?: JobKind): RpgWorkRequest {
  const r = object(value, path, ['kind', 'item', 'count'])
  if (!JOB_KINDS.includes(r.kind as JobKind) || (kind && r.kind !== kind)) throw new SaveParseError(`${path}.kind`, kind ? `expected ${kind}` : 'unknown kind')
  const k = r.kind as JobKind
  if (typeof r.item !== 'string' || !madeBy(k, r.item)) throw new SaveParseError(`${path}.item`, 'not made by this kind')
  const n = count(r.count, `${path}.count`)
  if (n < 1 || n > maxJobCount(k)) throw new SaveParseError(`${path}.count`, `expected 1–${maxJobCount(k)}`)
  return { kind: k, item: r.item, count: n }
}

function parseSlot(value: unknown, path: string): SlotRef {
  const o = object(value, path, ['building', 'slot'])
  if (typeof o.building !== 'string' || !facilitySpec(o.building)) throw new SaveParseError(`${path}.building`, 'not a facility')
  const slot = count(o.slot, `${path}.slot`)
  if (slot >= FACILITY_SLOTS[FACILITY_SLOTS.length - 1]!) throw new SaveParseError(`${path}.slot`, 'no such slot')
  return { building: o.building, slot }
}

const kindAt = (slot: SlotRef): JobKind => facilitySpec(slot.building)!.kind

function parseQty(value: unknown, path: string): ItemQty {
  const o = object(value, path, ['item', 'qty'])
  if (typeof o.item !== 'string' || !isItemId(o.item)) throw new SaveParseError(`${path}.item`, 'unknown item')
  const qty = count(o.qty, `${path}.qty`)
  if (qty < 1) throw new SaveParseError(`${path}.qty`, 'expected at least 1')
  return { item: o.item, qty }
}

const ENTRY_KEYS = ['request', 'seconds', 'inputs', 'outputs', 'exp', 'startedAt', 'acceleratedMs', 'collected', 'speed', 'fromQueue'] as const

function parseEntry(value: unknown, path: string, kind: JobKind): Entry<RpgWorkRequest> {
  const e = object(value, path, ENTRY_KEYS)
  const request = parseRequest(e.request, `${path}.request`, kind)
  const n = request.count
  const each = <T>(raw: unknown, key: string, parse: (v: unknown, at: string) => T): T[] => list(raw, `${path}.${key}`, n, n).map((v, i) => parse(v, `${path}.${key}.${i}`))
  const seconds = each(e.seconds, 'seconds', positive)
  const inputs = each(e.inputs, 'inputs', (v, at) => list(v, at, 0, 8).map((q, j) => parseQty(q, `${at}.${j}`)))
  const outputs = each(e.outputs, 'outputs', (v, at): WorkOutput => {
    const o = object(v, at, ['item'])
    if (o.item !== request.item) throw new SaveParseError(`${at}.item`, 'expected the request\'s item')
    return { item: request.item }
  })
  const exp = each(e.exp, 'exp', count)
  const collected = count(e.collected, `${path}.collected`)
  if (collected > n) throw new SaveParseError(`${path}.collected`, 'more than the entry makes')
  if (typeof e.fromQueue !== 'boolean') throw new SaveParseError(`${path}.fromQueue`, 'expected true or false')
  return { request, seconds, inputs, outputs, exp, startedAt: ms(e.startedAt, `${path}.startedAt`), acceleratedMs: count(e.acceleratedMs, `${path}.acceleratedMs`),
    collected, speed: positive(e.speed, `${path}.speed`), fromQueue: e.fromQueue }
}

function parseRefusal(value: unknown, path: string): Refusal | null {
  if (value === null) return null
  const o = object(value, path, ['refused', 'code', 'message', 'data'])
  if (o.refused !== true || typeof o.code !== 'string' || typeof o.message !== 'string') throw new SaveParseError(path, 'expected a refusal')
  if (o.data === undefined) return { refused: true, code: o.code, message: o.message }
  const data = object(o.data, `${path}.data`, Object.keys((o.data as Obj | null) ?? {}))
  if (Object.values(data).some((v) => typeof v !== 'string' && typeof v !== 'number')) throw new SaveParseError(`${path}.data`, 'expected strings and numbers')
  return { refused: true, code: o.code, message: o.message, data: data as Record<string, string | number> }
}

function parseDropped(value: unknown, path: string): DroppedQueue<RpgWorkRequest> | null {
  if (value === null) return null
  const d = object(value, path, ['at', 'slot', 'requests', 'short', 'refused'])
  const slot = parseSlot(d.slot, `${path}.slot`)
  return {
    at: ms(d.at, `${path}.at`), slot,
    requests: list(d.requests, `${path}.requests`, 1, MAX_QUEUED + 1).map((r, i) => parseRequest(r, `${path}.requests.${i}`, kindAt(slot))),
    short: list(d.short, `${path}.short`, 0, 8).map((q, i) => parseQty(q, `${path}.short.${i}`)),
    refused: parseRefusal(d.refused, `${path}.refused`),
  }
}

function parseLast(value: unknown, path: string): LastWork<RpgWorkRequest> | null {
  if (value === null) return null
  const l = object(value, path, ['slot', 'request'])
  const slot = parseSlot(l.slot, `${path}.slot`)
  return { slot, request: parseRequest(l.request, `${path}.request`, kindAt(slot)) }
}

/** Up to three requests wait behind the running one (the engine's MAX_QUEUE). */
const MAX_QUEUED = 3
/** The most started entries a row can hold: one running and its queue's finished ones waiting for Collect. */
const MAX_ENTRIES = MAX_QUEUED + 1

function parseBuildings(value: unknown, path: string): Record<string, { level: number }> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new SaveParseError(path, 'expected an object')
  const out: Record<string, { level: number }> = {}
  for (const [id, raw] of Object.entries(value)) {
    if (!facilitySpec(id)) throw new SaveParseError(`${path}.${id}`, 'not a facility')
    const level = count(object(raw, `${path}.${id}`, ['level']).level, `${path}.${id}.level`)
    if (level < 1 || level > FACILITY_MAX_LEVEL) throw new SaveParseError(`${path}.${id}.level`, `expected 1–${FACILITY_MAX_LEVEL}`)
    out[id] = { level }
  }
  return out
}

function parseWork(value: unknown, path: string, umas: Record<string, OwnedUma>, buildings: Record<string, { level: number }>): Record<string, WorkRow<RpgWorkRequest>> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new SaveParseError(path, 'expected an object')
  const out: Record<string, WorkRow<RpgWorkRequest>> = {}
  const held = new Set<string>()
  for (const [id, raw] of Object.entries(value)) {
    const at = `${path}.${id}`
    if (!umas[id]) throw new SaveParseError(at, 'expected an owned outfit')
    const r = object(raw, at, ['outfitId', 'slot', 'entries', 'queue', 'last', 'dropped'])
    if (r.outfitId !== id) throw new SaveParseError(`${at}.outfitId`, 'expected its own key')
    const slot = r.slot === null ? null : parseSlot(r.slot, `${at}.slot`)
    const entries = list(r.entries, `${at}.entries`, 0, MAX_ENTRIES)
    const queue = list(r.queue, `${at}.queue`, 0, MAX_QUEUED)
    if (!slot && (entries.length > 0 || queue.length > 0)) throw new SaveParseError(`${at}.slot`, 'work needs a slot')
    if (slot && entries.length > 0) {
      const key = `${slot.building}:${slot.slot}`
      if (held.has(key)) throw new SaveParseError(`${at}.slot`, 'already held')
      if (slot.slot >= FACILITY_SLOTS[(buildings[slot.building]?.level ?? 1) - 1]!) throw new SaveParseError(`${at}.slot`, 'no such slot at its level')
      held.add(key)
    }
    out[id] = {
      outfitId: id, slot,
      entries: entries.map((e, i) => parseEntry(e, `${at}.entries.${i}`, kindAt(slot!))),
      queue: queue.map((q, i) => parseRequest(q, `${at}.queue.${i}`, kindAt(slot!))),
      last: parseLast(r.last, `${at}.last`), dropped: parseDropped(r.dropped, `${at}.dropped`),
    }
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
  const o = object(value, path, ['locker', 'equipped', 'kinds'])
  const locker = ids(o.locker, `${path}.locker`, 300)
  if (locker.some((g) => !gearById(g))) throw new SaveParseError(`${path}.locker`, 'unknown gear')
  const k = object(o.kinds, `${path}.kinds`, ARMOR_SLOTS)
  const kinds: Partial<Record<ArmorSlot, ArmorKind>> = {}
  for (const [slot, kind] of Object.entries(k)) {
    if (!isArmorKind(kind) || !(ARMOR_SLOT_KINDS[slot as ArmorSlot] as readonly string[]).includes(kind)) throw new SaveParseError(`${path}.kinds.${slot}`, 'not a kind for this slot')
    kinds[slot as ArmorSlot] = kind
  }
  const slots = object(o.equipped, `${path}.equipped`, GEAR_SLOTS)
  const equipped: Partial<Record<GearSlot, string>> = {}
  for (const [slot, id] of Object.entries(slots)) {
    const piece = typeof id === 'string' ? gearById(id) : undefined
    const fits = !!piece && (isAccessorySlot(slot as GearSlot) ? isAccessory(piece.type) : !isAccessory(piece.type) && slotOf(piece.type) === slot)
    if (!piece || !locker.includes(id as string) || !fits) throw new SaveParseError(`${path}.equipped.${slot}`, 'expected a piece from her locker for this slot')
    if (isArmor(piece.type) && piece.type !== slotKind({ kinds }, slot as ArmorSlot)) throw new SaveParseError(`${path}.equipped.${slot}`, 'not the kind this slot holds')
    if (gearLevel(ranks, piece.type) < piece.grade) throw new SaveParseError(`${path}.equipped.${slot}`, `needs ${gearLevelName(piece.type)} ${piece.grade}`)
    equipped[slot as GearSlot] = id as string
  }
  const a1 = equipped['accessory-1'] && gearById(equipped['accessory-1'])!.type, a2 = equipped['accessory-2'] && gearById(equipped['accessory-2'])!.type
  if (a1 && a1 === a2) throw new SaveParseError(`${path}.equipped`, 'two accessories of the same type')
  return { locker, equipped, kinds }
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

function parseGems(value: unknown, path: string): Record<string, number> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new SaveParseError(path, 'expected an object')
  const gems: Record<string, number> = {}
  for (const [id, n] of Object.entries(value)) {
    if (!isGemId(id)) throw new SaveParseError(`${path}.${id}`, 'unknown gem')
    const c = count(n, `${path}.${id}`)
    if (c > 0) gems[id] = c
  }
  return gems
}

function parseTrack(value: unknown, path: string, max: number, toNext: (rank: number) => number): RankTrack {
  const o = object(value, path, ['rank', 'exp'])
  const rank = count(o.rank, `${path}.rank`)
  if (rank < 1 || rank > max) throw new SaveParseError(`${path}.rank`, `expected 1–${max}`)
  const exp = count(o.exp, `${path}.exp`)
  if (rank < max ? exp >= toNext(rank) : exp !== 0) throw new SaveParseError(`${path}.exp`, rank < max ? 'more than the rank needs' : 'expected 0 at the top rank')
  return { rank, exp }
}

function parseRanks(value: unknown, path: string): Ranks {
  const o = object(value, path, ['classes', 'weapons', 'armors', 'accessories'])
  const ranks = newRanks()
  for (const [c, t] of Object.entries(object(o.classes, `${path}.classes`, RPG_CLASSES))) {
    ranks.classes[c as RpgClass] = parseTrack(t, `${path}.classes.${c}`, CLASS_MAX_RANK, classExpToNext)
  }
  for (const [w, t] of Object.entries(object(o.weapons, `${path}.weapons`, WEAPON_TYPES))) {
    ranks.weapons[w as RpgWeapon] = parseTrack(t, `${path}.weapons.${w}`, GEAR_MAX_RANK, gearExpToNext)
  }
  for (const [a, t] of Object.entries(object(o.armors, `${path}.armors`, ARMOR_KINDS))) {
    ranks.armors[a as ArmorKind] = parseTrack(t, `${path}.armors.${a}`, GEAR_MAX_RANK, gearExpToNext)
  }
  for (const [a, t] of Object.entries(object(o.accessories, `${path}.accessories`, ACCESSORY_KINDS))) {
    ranks.accessories[a as AccessoryKind] = parseTrack(t, `${path}.accessories.${a}`, GEAR_MAX_RANK, gearExpToNext)
  }
  return ranks
}

function parseBonds(value: unknown, path: string): Partial<Record<HeroLimitId, BondTrack>> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new SaveParseError(path, 'expected an object')
  const bonds: Partial<Record<HeroLimitId, BondTrack>> = {}
  for (const [id, raw] of Object.entries(value)) {
    if (!isHeroLimitId(id)) throw new SaveParseError(`${path}.${id}`, 'not a Hero seat')
    const b = object(raw, `${path}.${id}`, ['level', 'exp'])
    const level = count(b.level, `${path}.${id}.level`)
    if (level > BOND_MAX_LEVEL) throw new SaveParseError(`${path}.${id}.level`, `expected 0–${BOND_MAX_LEVEL}`)
    const exp = count(b.exp, `${path}.${id}.exp`)
    if (level < BOND_MAX_LEVEL ? exp >= BOND_EXP_TO_NEXT : exp !== 0) throw new SaveParseError(`${path}.${id}.exp`, level < BOND_MAX_LEVEL ? 'more than the level needs' : 'expected 0 at the top level')
    bonds[id] = { level, exp }
  }
  return bonds
}

/** Hero seats (D106): owned Umas only, a Hero in one seat, ten Learners a seat, two seats a Learner, never a Hero. */
function parseHeroes(value: unknown, path: string, umas: Record<string, OwnedUma>): Partial<Record<HeroLimitId, HeroSeat>> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new SaveParseError(path, 'expected an object')
  const out: Partial<Record<HeroLimitId, HeroSeat>> = {}
  const heroes = new Set<string>()
  const parents = new Map<string, number>()
  for (const [id, raw] of Object.entries(value)) {
    const at = `${path}.${id}`
    if (!isHeroLimitId(id)) throw new SaveParseError(at, 'not a Hero seat')
    const seat = object(raw, at, ['hero', 'learners'])
    if (typeof seat.hero !== 'string' || !umas[seat.hero]) throw new SaveParseError(`${at}.hero`, 'expected an owned outfit')
    if (heroes.has(seat.hero)) throw new SaveParseError(`${at}.hero`, 'already a Hero in another seat')
    heroes.add(seat.hero)
    const learners = ids(seat.learners, `${at}.learners`, HERO_MAX_LEARNERS)
    if (learners.some((l) => !umas[l])) throw new SaveParseError(`${at}.learners`, 'learners must be owned')
    for (const l of learners) parents.set(l, (parents.get(l) ?? 0) + 1)
    out[id] = { hero: seat.hero, learners: [...learners] }
  }
  for (const [l, n] of parents) {
    if (heroes.has(l)) throw new SaveParseError(path, `outfit ${l} is a Hero and can't be a Learner`)
    if (n > LEARNER_MAX_PARENTS) throw new SaveParseError(path, `outfit ${l} learns under more than ${LEARNER_MAX_PARENTS} Heroes`)
  }
  return out
}

/** A class's weapons fit its slots, its side skills obey every learning rule at its Class Rank, and its equipped skills
 * are its trees' nodes within her slots (whether a core is open yet is checked when she fights). */
function parseLoadout(value: unknown, path: string, classId: RpgClass, tier: number, level: number, classRank: number): ClassLoadout {
  const b = object(value, path, ['weapons', 'tree', 'loadout'])
  const weapons = ids(b.weapons, `${path}.weapons`, 5) as RpgWeapon[]
  if (!weapons.every(isRpgWeapon) || !validRpgWeapons(classId, weapons)) throw new SaveParseError(`${path}.weapons`, `not five weapons a ${classId} can wield`)
  const tree = ids(b.tree, `${path}.tree`, 64)
  if (!validRpgTree({ classId, tier, classRank, tree: tree.map((n) => ({ tier, id: n })) })) {
    throw new SaveParseError(`${path}.tree`, `not a valid ${classId} tree at Class Rank ${classRank}`)
  }
  if (b.loadout === null) return { weapons, tree, loadout: null }
  const loadout = ids(b.loadout, `${path}.loadout`, rpgActiveSlots(level))
  const trees: RpgTreeId[] = rpgClassTrees(classId)
  if (loadout.some((n) => { const node = rpgNode(n); return !node || !trees.includes(node.tree) || (node.variant !== null && !tree.includes(n)) })) {
    throw new SaveParseError(`${path}.loadout`, 'only skills of her trees can be equipped')
  }
  return { weapons, tree, loadout }
}

function parseUmas(value: unknown, path: string, tier: number): Record<string, OwnedUma> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new SaveParseError(path, 'expected an object')
  const umas: Record<string, OwnedUma> = {}
  for (const [id, raw] of Object.entries(value)) {
    const at = `${path}.${id}`
    if (!OUTFIT_ID.test(id)) throw new SaveParseError(at, 'outfit ids are positive integers')
    const u = object(raw, at, ['unlockedAt', 'level', 'exp', 'classId', 'classes', 'craft', 'ranks', 'stars', 'gear', 'bonds'])
    const level = count(u.level, `${at}.level`)
    if (level < 1 || level > MAX_UMA_LEVEL) throw new SaveParseError(`${at}.level`, `expected 1–${MAX_UMA_LEVEL}`)
    const ranks = parseRanks(u.ranks, `${at}.ranks`)
    const owned: OwnedUma = { unlockedAt: timestamp(u.unlockedAt, `${at}.unlockedAt`), level, exp: count(u.exp, `${at}.exp`), classId: null, classes: {},
      craft: parseCraft(u.craft, `${at}.craft`), ranks, stars: parseStars(u.stars, `${at}.stars`, level),
      gear: parseUmaGear(u.gear, `${at}.gear`, ranks), bonds: parseBonds(u.bonds, `${at}.bonds`) }
    if (u.classId !== null && !RPG_CLASSES.includes(u.classId as RpgClass)) throw new SaveParseError(`${at}.classId`, 'expected null or a class')
    owned.classId = u.classId as RpgClass | null
    const classes = object(u.classes, `${at}.classes`, RPG_CLASSES)
    for (const [key, loadout] of Object.entries(classes)) {
      const classId = key as RpgClass
      owned.classes[classId] = parseLoadout(loadout, `${at}.classes.${key}`, classId, tier, level, (ranks.classes[classId] ?? { rank: 1 }).rank)
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
  limit: ['kind', 'actorId', 'targetId', 'skill', 'skills', 'weapon', 'hero'],
}

type CheckBattle = (input: BattleInput, actions: BattleAction[], path: string) => void

function checkReplay(replay: typeof replayBattle, input: BattleInput, actions: BattleAction[], path: string): void {
  let step
  try { step = replay(input, actions) }
  catch (err) { throw new SaveParseError(`${path}.input`, err instanceof Error ? err.message : 'invalid fight') }
  if (step.error) throw new SaveParseError(`${path}.actions`, `an action was refused: ${step.error}`)
}

function parseBattle(value: unknown, path: string, check: CheckBattle): RpgRunBattle {
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
  check(b.input as BattleInput, b.actions as BattleAction[], path)
  return { battleId: b.battleId, nodeId: b.nodeId, startedAt: timestamp(b.startedAt, `${path}.startedAt`), input: b.input as BattleInput, actions: b.actions as BattleAction[] }
}

const SPRING_ID = /^w\d{1,2}-spring\d{1,2}$/

/** The world's state (D66): its one run (chapter id `world`, party the open fight's), the active party, Spring uses. */
function parseWorldState(value: unknown, path: string, check: CheckBattle): WorldState {
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
    battle: r.battle === null ? null : parseBattle(r.battle, `${at}.battle`, check), battles: count(r.battles, `${at}.battles`),
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


function parseTierWorld(raw: unknown, path: string, version: number, tier: number, check: CheckBattle, migrate: typeof migrateWorld): TierWorld {
  if (version < 10) return resetTierWorld(raw, path)
  // v10–v21 are migrated to v22's shape first (migrations.ts), so the parse below reads only v22.
  const value = migrate(raw, version)
  const w = object(value, path, ['createdAt', 'wallet', 'umas', 'parties', 'world', 'items', 'buildings', 'work', 'gems', 'gear', 'targets', 'heroes'])
  const umas = parseUmas(w.umas, `${path}.umas`, tier)
  const buildings = parseBuildings(w.buildings, `${path}.buildings`)
  return {
    createdAt: timestamp(w.createdAt, `${path}.createdAt`), wallet: parseWallet(w.wallet, `${path}.wallet`), umas,
    parties: parseParties(w.parties, `${path}.parties`, umas), world: parseWorldState(w.world, `${path}.world`, check),
    items: parseItems(w.items, `${path}.items`), buildings, work: parseWork(w.work, `${path}.work`, umas, buildings),
    gems: parseGems(w.gems, `${path}.gems`), gear: parseGearStock(w.gear, `${path}.gear`),
    targets: parseTargets(w.targets, `${path}.targets`, umas), heroes: parseHeroes(w.heroes, `${path}.heroes`, umas),
  }
}

function parseTargets(value: unknown, path: string, umas: Record<string, OwnedUma>): string[] {
  const list = ids(value, path, MAX_TARGETS)
  if (list.some((id) => !umas[id])) throw new SaveParseError(path, 'targets must be owned')
  return [...list]
}

/** The raw `schemaVersion` of a stored or sent save, or 0 when it has none. */
export function schemaVersionOf(value: unknown): number {
  const v = (value as { schemaVersion?: unknown } | null)?.schemaVersion
  return typeof v === 'number' && Number.isSafeInteger(v) ? v : 0
}

/** Parses a v1–v22 save and always returns v22. v10–v17 reset their progress (D105), v18 gains the Halls of Heroes
 * (D106), v20 moves to one profession and Star Gems (D144), v21 to per-Uma work rows (SC3) and anything older than v10
 * starts over (D69). */
export function parseSave(value: unknown, path = 'save'): Save {
  return parseSaveChecked(value, path, (input, actions, at) => checkReplay(replayBattle, input, actions, at), migrateWorld)
}

/** Browser boot: all the same strict parsing and migrations, loading the engine only if a surviving fight needs replay.
 * No unchecked save escapes: every pending replay is validated before this promise resolves. The API stays synchronous. */
export async function parseSaveAsync(value: unknown, path = 'save'): Promise<Save> {
  const pending: { input: BattleInput; actions: BattleAction[]; path: string }[] = []
  const version = schemaVersionOf(value)
  const migrate = version >= 10 && version < SAVE_SCHEMA_VERSION ? (await import('./migrations')).migrateWorld : (raw: unknown) => raw
  const parsed = parseSaveChecked(value, path, (input, actions, at) => { pending.push({ input, actions, path: at }) }, migrate)
  if (pending.length) {
    const engine = await import('../rpg/battle/engine')
    for (const fight of pending) checkReplay(engine.replayBattle, fight.input, fight.actions, fight.path)
  }
  return parsed
}

function parseSaveChecked(value: unknown, path: string, check: CheckBattle, migrate: typeof migrateWorld): Save {
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
    tierWorlds[key] = parseTierWorld(world, at, version, Number(key), check, migrate)
  }
  if (!tierWorlds['1']) throw new SaveParseError(`${path}.tierWorlds`, 'tier 1 is required')
  return { schemaVersion: SAVE_SCHEMA_VERSION, account, tierWorlds }
}

export function parseSavePut(value: unknown): SavePut {
  const o = object(value, 'body', ['baseRevision', 'save'])
  return { baseRevision: count(o.baseRevision, 'body.baseRevision'), save: parseSave(o.save, 'body.save'), sentSchemaVersion: schemaVersionOf(o.save) }
}
