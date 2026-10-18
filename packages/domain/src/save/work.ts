// Facility work over the save (S4, D55, D144, SC3): put an Uma in a slot to gather, refine, craft or cut, queue up to
// three more behind her, collect what she has made (with her Craft EXP), recall her, speed her up with tickets, repeat
// her last job, restart or dismiss a queue that stopped, and upgrade a facility. Every rule runs in the shared engine,
// `@luismlorenzana/uma-work`, through uma-rpg's kinds and hooks (`work/env.ts`); these are thin `Save` wrappers, plus a
// read-only view of each facility's slots for today's screens until SC4's.
import {
  chainTimes, collect, endsAt, finishedCount, isRefusal, kindRules, MAX_QUEUE, progress, queue, recall, remainingMs, settle, slotHolder, slotsOf,
  speedUp, start, statusOf, ticketsToFinish, upgrade, withRow, type Entry, type ItemQty, type OpResult, type Refusal, type SlotRef, type WorkRow,
} from '@luismlorenzana/uma-work'
import { facilitySpec, type JobKind } from '../economy/jobs'
import { FACILITY_SPEED, grantProfessionExp } from '../economy/pacing'
import { stockName } from '../economy/stock'
import { gearById } from '../economy/gear'
import { gemById } from '../economy/gems'
import { itemById, type ItemDef } from '../items/catalog'
import { RPG_BUILDINGS, RPG_WORK_ENV, type CraftGain } from '../work/env'
import type { RpgWorkRequest } from '../work/request'
import { SaveRuleError, TIER_ONE, worldOf, type SaveRuleReason } from './rules'
import type { OwnedUma, Save, TierWorld } from './save'

export { grantProfessionExp, MAX_QUEUE }
export type { RpgWorkRequest }

/** What work needs from an outfit's master data (a `RosterOutfit` fits). Aptitudes no longer set job speed (D139). */
export interface WorkOutfit {
  outfitId: string
}

const env = RPG_WORK_ENV
const msOf = (now: string): number => Date.parse(now)

function withWorld(save: Save, tier: string, world: TierWorld, now: string): Save {
  return { ...save, account: { ...save.account, updatedAt: now }, tierWorlds: { ...save.tierWorlds, [tier]: world } }
}

// --- Refusals, in the words the screens have always shown -------------------------------------------------------------

const REASON: Readonly<Record<string, SaveRuleReason>> = {
  'slot-taken': 'bad-slot', busy: 'busy', count: 'bad-count', short: 'no-items', 'queue-full': 'bad-count', tickets: 'no-ticket', money: 'no-laurels',
  'unknown-worker': 'not-owned',
}

const outputName = (id: string): string => itemById(id)?.name ?? gemById(id)?.name ?? gearById(id)?.name ?? stockName(id)

/** A refusal's sentence for a screen: names for ids, a duration for a time, uma-rpg's own words for the level gate. */
export function refusalText(refusal: Refusal, now: number): string {
  const data = refusal.data ?? {}
  if (refusal.code === 'grade') return `Needs Craft Lv${data.level}`
  if (refusal.code === 'money') return `Needs ${data.n} Laurels`
  if (refusal.code === 'tickets') return `Needs ${data.n} Speed Ticket${data.n === 1 ? '' : 's'}`
  return refusal.message.replace(/\{(\w+)\}/g, (_, key: string) => {
    if (key === 'uma') return 'She'
    if (key === 'item') return outputName(String(data.item))
    if (key === 'time') return `${Math.max(1, Math.ceil((Number(data.time) - now) / 60_000))} min`
    return String(data[key] ?? '')
  })
}

function done<R>(result: OpResult<R, TierWorld>, now: number): { state: TierWorld; receipt: R } {
  if (isRefusal(result)) throw new SaveRuleError(REASON[result.code] ?? 'bad-job', refusalText(result, now))
  return result
}

const slotRef = (placeId: string, slot: number): SlotRef => ({ building: placeId, slot })
const requestFor = (placeId: string, output: string, count: number): RpgWorkRequest => {
  const spec = facilitySpec(placeId)
  if (!spec) throw new SaveRuleError('bad-job', 'nothing to make here')
  return { kind: spec.kind, item: output, count }
}

/** Who holds a slot, or a refusal to act there. */
function holderOf(world: TierWorld, placeId: string, slot: number): string {
  const holder = slotHolder(world, slotRef(placeId, slot))
  if (!holder) throw new SaveRuleError('bad-slot', 'nothing working there')
  return holder
}

// --- Planning, for the pickers -----------------------------------------------------------------------------------

export interface JobPlan {
  /** What it makes: its name and grade. */
  output: { id: string; name: string; grade: number }
  /** The raw or refined item, when it makes one. */
  item: ItemDef | null
  /** Real milliseconds per item for this Uma here, at the facility's level now. */
  itemMs: number
  expEach: number
  /** Inputs per item. */
  inputs: Record<string, number>
  /** Why it can't start, or null. */
  block: string | null
}

/** A facility's level: 1 until upgraded. */
export const facilityLevel = (world: TierWorld, placeId: string): number => world.buildings[placeId]?.level ?? 1

/** What a gather, refine, craft or cut job would be: its time for this Uma, its EXP, inputs and anything stopping it.
 * `count` 0 plans a queued job, whose inputs are taken only when it starts. */
export function planJob(world: TierWorld, placeId: string, outfit: WorkOutfit, output: string, count = 1): JobPlan | null {
  const spec = facilitySpec(placeId)
  const made = itemById(output) ?? gearById(output) ?? gemById(output)
  if (!spec || !made || !world.umas[outfit.outfitId]) return null
  const request = requestFor(placeId, output, 1)
  const context = { slot: slotRef(placeId, 0), speed: FACILITY_SPEED[facilityLevel(world, placeId) - 1]!, earlier: [] }
  const kind = kindRules(env, spec.kind)!
  // Its time and EXP even behind the grade gate (a picker shows a locked grade's time); the gate becomes the block.
  const items = kind.plan(world, outfit.outfitId, request, 0, { ...context, env: { ...env, exp: { ...env.exp, gradeOpen: () => true } } })
  const gate = kind.plan(world, outfit.outfitId, request, 0, { ...context, env })
  const base = { output: { id: made.id, name: made.name, grade: made.grade }, item: itemById(output) ?? null }
  if (isRefusal(items)) return { ...base, itemMs: 0, expEach: 0, inputs: {}, block: refusalText(items, 0) }
  const first = items[0]!
  const inputs = Object.fromEntries(first.inputs.map((q) => [q.item, q.qty]))
  const block = isRefusal(gate) ? refusalText(gate, 0) : count > 0 ? inputsBlock(world, inputs, count) : null
  return { ...base, itemMs: first.seconds * 1000, expEach: first.exp, inputs, block }
}

/** Why the Warehouse can't cover `count` sets of these inputs, or null. */
export function inputsBlock(world: TierWorld, inputs: Record<string, number>, count: number): string | null {
  for (const [id, n] of Object.entries(inputs)) {
    if ((world.items[id] ?? 0) < n * count) return `Needs ${n * count} ${stockName(id)}`
  }
  return null
}

/** Free workers at this time. Settle once for the whole album; finished work frees its Uma (D119). */
export function availableWorkers(world: TierWorld, now: string): ReadonlySet<string> {
  const ms = msOf(now)
  const settled = settle(world, ms, env).state
  return new Set(Object.keys(world.umas).filter(id => statusOf(settled.work[id], ms) !== 'working'))
}

/** Why this Uma can't take a job now, or null: she works one job at a time; a finished one is collected as she starts.
 * Fighting doesn't stop her (D119). */
export function availabilityBlock(world: TierWorld, outfitId: string, now: string): string | null {
  if (!world.umas[outfitId]) return 'Not unlocked'
  const settled = settle(world, msOf(now), env).state
  return statusOf(settled.work[outfitId], msOf(now)) === 'working' ? 'Already working' : null
}

// --- Operations ----------------------------------------------------------------------------------------------------

/** Starts a job in a free slot: `count` items, made one after another; its inputs are reserved now. A Ready Uma's
 * finished work is collected first. */
export function startJob(save: Save, placeId: string, slot: number, outfit: WorkOutfit, output: string, count: number, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  if (!slotsOf(world, placeId, RPG_BUILDINGS).some((s) => s.slot === slot)) throw new SaveRuleError('bad-slot', `slot ${slot} doesn't exist`)
  const { state } = done(start(world, { outfitId: outfit.outfitId, slot: slotRef(placeId, slot), request: requestFor(placeId, output, count) }, msOf(now), env), msOf(now))
  return withWorld(save, tier, state, now)
}

export interface Collected { items: number; exp: number; levelsUp: number; done: boolean }

function collectFrom(world: TierWorld, outfitId: string, now: number): { world: TierWorld; got: Collected } {
  const { state, receipt } = collect(world, { outfitId }, now, env)
  const levelsUp = (receipt.expDetail as CraftGain | null)?.levelsUp ?? 0
  return { world: state, got: { items: receipt.outputs.length, exp: receipt.exp, levelsUp, done: receipt.freed } }
}

/** Collects everything the slot's Uma has finished, with her Craft EXP; when she's done, the slot frees. A queue keeps
 * going on its own: each entry started the moment the one before ended. */
export function collectJob(save: Save, placeId: string, slot: number, now: string, tier = TIER_ONE): { save: Save; got: Collected } {
  const world = settle(worldOf(save, tier), msOf(now), env).state
  const { world: next, got } = collectFrom(world, holderOf(world, placeId, slot), msOf(now))
  return { save: withWorld(save, tier, next, now), got }
}

/** Collects every Uma with something finished, on the given places (all by default). */
export function collectAll(save: Save, now: string, placeIds?: readonly string[], tier = TIER_ONE): { save: Save; items: number; levelsUp: number } {
  let world = settle(worldOf(save, tier), msOf(now), env).state
  let items = 0
  let levelsUp = 0
  for (const row of Object.values(world.work)) {
    if (!row.slot || (placeIds && !placeIds.includes(row.slot.building)) || readyItems(row, msOf(now)) === 0) continue
    const r = collectFrom(world, row.outfitId, msOf(now))
    world = r.world
    items += r.got.items
    levelsUp += r.got.levelsUp
  }
  return { save: withWorld(save, tier, world, now), items, levelsUp }
}

/** Queues another job behind the slot's running one, for the same Uma at the same place; it takes its inputs when it
 * starts, the moment the one before ends. */
export function queueJob(save: Save, placeId: string, slot: number, outfit: WorkOutfit, output: string, count: number, now: string, tier = TIER_ONE): Save {
  const world = settle(worldOf(save, tier), msOf(now), env).state
  if (holderOf(world, placeId, slot) !== outfit.outfitId) throw new SaveRuleError('bad-slot', 'queue behind her own job')
  const add = { request: requestFor(placeId, output, count), building: placeId }
  return withWorld(save, tier, done(queue(world, { outfitId: outfit.outfitId, add }, msOf(now), env), msOf(now)).state, now)
}

export function unqueueJob(save: Save, placeId: string, slot: number, index: number, now: string, tier = TIER_ONE): Save {
  const world = settle(worldOf(save, tier), msOf(now), env).state
  const outfitId = holderOf(world, placeId, slot)
  if (!world.work[outfitId]?.queue[index]) throw new SaveRuleError('bad-slot', 'nothing queued there')
  return withWorld(save, tier, done(queue(world, { outfitId, remove: index }, msOf(now), env), msOf(now)).state, now)
}

/** Ends her work early: collects what's made; inputs for items never made come back; the item in progress is lost; her
 * queue drops and Repeat forgets her last job. */
export function recallJob(save: Save, placeId: string, slot: number, now: string, tier = TIER_ONE): Save {
  const world = settle(worldOf(save, tier), msOf(now), env).state
  return withWorld(save, tier, recall(world, { outfitId: holderOf(world, placeId, slot) }, msOf(now), env).state, now)
}

/** Spends Speed Tickets on the slot's running job: each takes 30 minutes off (D74), never past done, and never more
 * than finish it. */
export function cutJobTime(save: Save, placeId: string, slot: number, tickets: number, now: string, tier = TIER_ONE): Save {
  const world = settle(worldOf(save, tier), msOf(now), env).state
  const outfitId = holderOf(world, placeId, slot)
  const running = world.work[outfitId]!.entries.at(-1)!
  if (!Number.isInteger(tickets) || tickets < 1) throw new SaveRuleError('bad-count', 'use at least one Speed Ticket')
  return withWorld(save, tier, done(speedUp(world, { outfitId, startedAt: running.startedAt, tickets }, msOf(now), env), msOf(now)).state, now)
}

/** The first free slot of a facility, or null. */
function freeSlot(world: TierWorld, placeId: string): number | null {
  return slotsOf(world, placeId, RPG_BUILDINGS).find((s) => slotHolder(world, s) === undefined)?.slot ?? null
}

/** Her slot again if it's free or hers, else another free one at the same place. */
function slotFor(world: TierWorld, outfitId: string, slot: SlotRef): number | null {
  const holder = slotHolder(world, slot)
  const exists = slotsOf(world, slot.building, RPG_BUILDINGS).some((s) => s.slot === slot.slot)
  return exists && (holder === undefined || holder === outfitId) ? slot.slot : freeSlot(world, slot.building)
}

/** Starts her last finished job again where she did it (another free slot there if hers is taken). A Ready Uma's own
 * finished entry counts as her last job: Collect and Repeat in one step. */
export function repeatJob(save: Save, outfitId: string, now: string, tier = TIER_ONE): Save {
  const world = settle(worldOf(save, tier), msOf(now), env).state
  const row = world.work[outfitId]
  const finished = row && statusOf(row, msOf(now)) === 'ready' ? row.entries.at(-1) : undefined
  const job = finished && row?.slot ? { slot: row.slot, request: finished.request } : row?.last
  if (!job) throw new SaveRuleError('bad-job', 'nothing to repeat')
  const slot = slotFor(world, outfitId, job.slot)
  if (slot === null) throw new SaveRuleError('bad-slot', 'no free slot there')
  return startJob(withWorld(save, tier, world, now), job.slot.building, slot, { outfitId }, job.request.item, job.request.count, now, tier)
}

/** Restarts a queue that stopped: its first job starts now where it would have (another free slot there if that one is
 * taken), and the rest queue behind it. */
export function restartStopped(save: Save, outfitId: string, now: string, tier = TIER_ONE): Save {
  const world = settle(worldOf(save, tier), msOf(now), env).state
  const dropped = world.work[outfitId]?.dropped
  if (!dropped) throw new SaveRuleError('bad-job', 'nothing stopped')
  const [first, ...rest] = dropped.requests
  const place = dropped.slot.building
  const slot = slotFor(world, outfitId, dropped.slot)
  if (slot === null) throw new SaveRuleError('bad-slot', 'no free slot there')
  let next = startJob(withWorld(save, tier, world, now), place, slot, { outfitId }, first!.item, first!.count, now, tier)
  for (const request of rest) next = queueJob(next, place, slot, { outfitId }, request.item, request.count, now, tier)
  return next
}

/** Forgets a queue that stopped. */
export function dismissStopped(save: Save, outfitId: string, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const row = world.work[outfitId]
  if (!row?.dropped) return save
  return withWorld(save, tier, withRow(world, { ...row, dropped: null }), now)
}

/** What the next level costs: Laurels plus refined items of the facility's two families, or null at the top. */
export function upgradeCost(world: TierWorld, placeId: string): { laurels: number; items: Record<string, number> } | null {
  const level = facilityLevel(world, placeId)
  if (!facilitySpec(placeId) || level >= RPG_BUILDINGS.maxLevel(placeId)) return null
  const cost = RPG_BUILDINGS.upgradeCost(placeId, level + 1)
  return { laurels: cost.money, items: Object.fromEntries(cost.items.map((q: ItemQty) => [q.item, q.qty])) }
}

export function upgradeFacility(save: Save, placeId: string, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  if (!upgradeCost(world, placeId)) throw new SaveRuleError('bad-job', 'already at the top level')
  return withWorld(save, tier, done(upgrade(world, { building: placeId }, msOf(now), env), msOf(now)).state, now)
}

// --- Reading a facility for today's screens (until SC4's) -------------------------------------------------------------

/** Finished items she hasn't collected, across her entries. */
export function readyItems(row: WorkRow<RpgWorkRequest> | undefined, now: number): number {
  return (row?.entries ?? []).reduce((n, e) => n + finishedCount(e, now) - e.collected, 0)
}

/** One slot's job as the cards read it: her running (or last) entry, what's ready across her entries, and her queue's
 * times. */
export interface SlotJob {
  outfitId: string
  kind: JobKind
  output: string
  count: number
  /** Items of that entry finished by now. */
  finished: number
  /** Finished items not yet collected, across her entries. */
  ready: number
  /** Everything finished: Collect frees her. */
  done: boolean
  startedAt: number
  endsAt: number
  progress: number
  /** Speed Tickets that would finish the running entry; 0 once done. */
  ticketsToFinish: number
  queue: { output: string; count: number; startsAt: number; endsAt: number }[]
}

/** A queue that couldn't start, waiting to be restarted or dismissed. */
export interface StoppedQueue {
  outfitId: string
  requests: readonly RpgWorkRequest[]
  /** What the Warehouse lacked for the first one, or the reason it was refused. */
  why: string
}

export interface FacilityView {
  level: number
  /** One per slot at its level: the job in it, or null. */
  jobs: (SlotJob | null)[]
  stopped: StoppedQueue[]
  /** Something here to collect. */
  ready: boolean
}

function slotJob(world: TierWorld, row: WorkRow<RpgWorkRequest>, now: number): SlotJob {
  const last: Entry<RpgWorkRequest> = row.entries.at(-1)!
  const status = statusOf(row, now)
  // A queued job's times, planned now: it will start when the one before it ends.
  const queuedSeconds = row.queue.map((request) => {
    const items = kindRules(env, request.kind)!.plan(world, row.outfitId, request, now, { slot: row.slot!, speed: last.speed, earlier: [], env })
    return isRefusal(items) ? [] : items.map((i) => i.seconds)
  })
  const times = chainTimes(row, queuedSeconds)
  return {
    outfitId: row.outfitId, kind: last.request.kind, output: last.request.item, count: last.request.count,
    finished: finishedCount(last, now), ready: readyItems(row, now), done: status === 'ready',
    startedAt: last.startedAt, endsAt: endsAt(last), progress: progress(last, now),
    ticketsToFinish: status === 'ready' ? 0 : ticketsToFinish(remainingMs(last, now)),
    queue: row.queue.map((q, i) => ({ output: q.item, count: q.count, startsAt: times.queued[i]?.startsAt ?? 0, endsAt: times.queued[i]?.endsAt ?? 0 })),
  }
}

/** Every slot of a facility at `now`, its queues settled first. */
export function facilityView(world: TierWorld, placeId: string, now: string): FacilityView {
  const t = msOf(now)
  const settled = settle(world, t, env).state
  const slots = slotsOf(settled, placeId, RPG_BUILDINGS)
  const jobs = slots.map((slot) => {
    const holder = slotHolder(settled, slot)
    return holder ? slotJob(settled, settled.work[holder]!, t) : null
  })
  const stopped = Object.values(settled.work).filter((row) => row.dropped?.slot.building === placeId).map((row) => ({
    outfitId: row.outfitId, requests: row.dropped!.requests,
    why: row.dropped!.refused ? refusalText(row.dropped!.refused, t) : row.dropped!.short.map((q) => `short ${q.qty} ${outputName(q.item)}`).join(', '),
  }))
  return { level: facilityLevel(settled, placeId), jobs, stopped, ready: jobs.some((j) => j && (j.ready > 0 || j.done)) }
}

/** Her job at `now`, wherever she works, or null. */
export function slotJobOf(world: TierWorld, outfitId: string, now: string): (SlotJob & { placeId: string; slot: number }) | null {
  const settled = settle(world, msOf(now), env).state
  const row = settled.work[outfitId]
  if (!row?.slot || row.entries.length === 0) return null
  return { ...slotJob(settled, row, msOf(now)), placeId: row.slot.building, slot: row.slot.slot }
}

/** Places with something to collect at `now`, and how many of their slots have it. */
export function readyWork(world: TierWorld, now: string): Map<string, number> {
  const settled = settle(world, msOf(now), env).state
  const out = new Map<string, number>()
  for (const row of Object.values(settled.work)) {
    if (!row.slot || row.entries.length === 0) continue
    if (readyItems(row, msOf(now)) > 0 || statusOf(row, msOf(now)) === 'ready') out.set(row.slot.building, (out.get(row.slot.building) ?? 0) + 1)
  }
  return out
}

export type { OwnedUma }
