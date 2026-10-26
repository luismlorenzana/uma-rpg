// Facility work over the save (S4, D55, D144, SC3): put an Uma in a slot to gather, refine, craft or cut, queue up to
// three more behind her, collect what she has made (with her Craft EXP), recall her, speed her up with tickets, repeat
// her last job, restart or dismiss a queue that stopped, and upgrade a facility. Every rule runs in the shared engine,
// `@luismlorenzana/uma-work`, through uma-rpg's kinds and hooks; these are thin `Save` wrappers plus the small derived
// readings still used outside the shared SC4 facility screens.
//
// The env is the live generation's for the world's tier (`liveWorkEnv`, H77): today's facilities (`work/env.ts`) until
// R2's switch, then R2's ten places (`work/env-v3.ts`), with no levels to upgrade. The player's operations take an
// optional `context` (each Uma's trade, for R2's trade gate); collects, recalls, speed-ups and settles need none.
import {
  chainTimes, collect, endsAt, finish as finishNow, finishedCount, isRefusal, kindRules, MAX_QUEUE, progress, queue, recall, remainingMs, settle, slotHolder, slotsOf,
  speedUp, start, statusOf, ticketsToFinish, upgrade, withRow, workRefusal, type Entry, type ItemQty, type OpResult, type QueueInput, type Refusal, type SlotRef, type WorkEnv,
  type WorkRow,
} from '@luismlorenzana/uma-work'
import { facilitySpec, type JobKind } from '../economy/jobs'
import { grantProfessionExp } from '../economy/pacing'
import { workPlace } from '../economy/professions'
import { stockName } from '../economy/stock'
import { gearById } from '../economy/gear'
import { gemById } from '../economy/gems'
import { itemById, type ItemDef } from '../items/catalog'
import { madeName } from '../items/made'
import { madeIdentity } from '../items/made-id'
import { materialById } from '../items/materials'
import { materialGateGrade } from '../items/materials-id'
import { rpgRework } from '../rpg/battle/caps'
import { RPG_BUILDINGS, RPG_WORK_ENV, type CraftGain } from '../work/env'
import { ANOTHER_TRADE, liveWorkEnv, TRADE_REFUSAL, type WorkContext } from '../work/env-v3'
import type { RpgWorkRequest } from '../work/request'
import { SaveRuleError, TIER_ONE, worldOf, type SaveRuleReason } from './rules'
import type { OwnedUma, Save, TierWorld } from './save'

export { grantProfessionExp, MAX_QUEUE }
export type { RpgWorkRequest, WorkContext }
export type RpgQueueInput = QueueInput<RpgWorkRequest>

/** What work needs from an outfit's master data (a `RosterOutfit` fits). Aptitudes no longer set job speed (D139). */
export interface WorkOutfit {
  outfitId: string
}

/** The live env for a world of this tier (a save's key or a number), with the caller's context. */
const envOf = (tier: string | number, context?: WorkContext): WorkEnv<TierWorld> => liveWorkEnv(Number(tier), context)
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
  if (refusal.code === TRADE_REFUSAL) return ANOTHER_TRADE
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
  const spec = workPlace(placeId)
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

/** What a job makes, by generation: a legacy item, gear piece or Star Gem to engine v16; from v17 a material (its grade
 * is the one its type opens at: 1 low, 6 high) or a made item. */
function outputOf(id: string): { id: string; name: string; grade: number } | undefined {
  if (rpgRework('economy')) {
    const material = materialById(id)
    if (material) return { id, name: material.name, grade: materialGateGrade(id) }
    const made = madeIdentity(id)
    return made ? { id, name: madeName(id)!, grade: made.grade } : undefined
  }
  const made = itemById(id) ?? gearById(id) ?? gemById(id)
  return made ? { id: made.id, name: made.name, grade: made.grade } : undefined
}

/** What a gather, refine, craft or cut job would be: its time for this Uma, its EXP, inputs and anything stopping it.
 * `count` 0 plans a queued job, whose inputs are taken only when it starts. `tier` is the world's (R2 plans by it), and
 * `context` her trade for R2's gate. */
export function planJob(world: TierWorld, placeId: string, outfit: WorkOutfit, output: string, count = 1, tier: string | number = TIER_ONE,
  context?: WorkContext): JobPlan | null {
  const spec = workPlace(placeId)
  const made = outputOf(output)
  if (!spec || !made || !world.umas[outfit.outfitId]) return null
  const env = envOf(tier, context)
  const request = requestFor(placeId, output, 1)
  const plan = { slot: slotRef(placeId, 0), speed: env.buildings.speed(placeId, facilityLevel(world, placeId)), earlier: [] }
  const kind = kindRules(env, spec.kind)!
  // Its time and EXP even behind the grade gate (a picker shows a locked grade's time); the gate becomes the block.
  const items = kind.plan(world, outfit.outfitId, request, 0, { ...plan, env: { ...env, exp: { ...env.exp, gradeOpen: () => true } } })
  const gate = kind.plan(world, outfit.outfitId, request, 0, { ...plan, env })
  const base = { output: made, item: rpgRework('economy') ? null : itemById(output) ?? null }
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
export function availableWorkers(world: TierWorld, now: string, tier: string | number = TIER_ONE): ReadonlySet<string> {
  const ms = msOf(now)
  const settled = settle(world, ms, envOf(tier)).state
  return new Set(Object.keys(world.umas).filter(id => statusOf(settled.work[id], ms) !== 'working'))
}

/** Why this Uma can't take a job now, or null: she works one job at a time; a finished one is collected as she starts.
 * Fighting doesn't stop her (D119). */
export function availabilityBlock(world: TierWorld, outfitId: string, now: string, tier: string | number = TIER_ONE): string | null {
  if (!world.umas[outfitId]) return 'Not unlocked'
  const settled = settle(world, msOf(now), envOf(tier)).state
  return statusOf(settled.work[outfitId], msOf(now)) === 'working' ? 'Already working' : null
}

// --- Operations ----------------------------------------------------------------------------------------------------

/** Starts a job in a free slot: `count` items, made one after another; its inputs are reserved now. A Ready Uma's
 * finished work is collected first. */
export function startJob(save: Save, placeId: string, slot: number, outfit: WorkOutfit, output: string, count: number, now: string, tier = TIER_ONE,
  context?: WorkContext): Save {
  const world = worldOf(save, tier)
  const env = envOf(tier, context)
  if (!slotsOf(world, placeId, env.buildings).some((s) => s.slot === slot)) throw new SaveRuleError('bad-slot', `slot ${slot} doesn't exist`)
  const { state } = done(start(world, { outfitId: outfit.outfitId, slot: slotRef(placeId, slot), request: requestFor(placeId, output, count) }, msOf(now), env), msOf(now))
  return withWorld(save, tier, state, now)
}

export interface Collected { items: number; exp: number; levelsUp: number; done: boolean }

function collectFrom(world: TierWorld, outfitId: string, now: number, env: WorkEnv<TierWorld>): { world: TierWorld; got: Collected } {
  const { state, receipt } = collect(world, { outfitId }, now, env)
  const levelsUp = (receipt.expDetail as CraftGain | null)?.levelsUp ?? 0
  return { world: state, got: { items: receipt.outputs.length, exp: receipt.exp, levelsUp, done: receipt.freed } }
}

/** Collects everything the slot's Uma has finished, with her Craft EXP; when she's done, the slot frees. A queue keeps
 * going on its own: each entry started the moment the one before ended. */
export function collectJob(save: Save, placeId: string, slot: number, now: string, tier = TIER_ONE): { save: Save; got: Collected } {
  const env = envOf(tier)
  const world = settle(worldOf(save, tier), msOf(now), env).state
  const { world: next, got } = collectFrom(world, holderOf(world, placeId, slot), msOf(now), env)
  return { save: withWorld(save, tier, next, now), got }
}

/** Collects one Uma's ready work. The shared work screen addresses rows by Uma, not by a duplicated slot view. */
export function collectWorker(save: Save, outfitId: string, now: string, tier = TIER_ONE): { save: Save; got: Collected } {
  const env = envOf(tier)
  const world = settle(worldOf(save, tier), msOf(now), env).state
  const { world: next, got } = collectFrom(world, outfitId, msOf(now), env)
  return { save: withWorld(save, tier, next, now), got }
}

/** Collects every Uma with something finished, on the given places (all by default). */
export function collectAll(save: Save, now: string, placeIds?: readonly string[], tier = TIER_ONE): { save: Save; items: number; levelsUp: number } {
  const env = envOf(tier)
  let world = settle(worldOf(save, tier), msOf(now), env).state
  let items = 0
  let levelsUp = 0
  for (const row of Object.values(world.work)) {
    if (!row.slot || (placeIds && !placeIds.includes(row.slot.building)) || readyItems(row, msOf(now)) === 0) continue
    const r = collectFrom(world, row.outfitId, msOf(now), env)
    world = r.world
    items += r.got.items
    levelsUp += r.got.levelsUp
  }
  return { save: withWorld(save, tier, world, now), items, levelsUp }
}

/** Queues another job behind the slot's running one, for the same Uma at the same place; it takes its inputs when it
 * starts, the moment the one before ends. */
export function queueJob(save: Save, placeId: string, slot: number, outfit: WorkOutfit, output: string, count: number, now: string, tier = TIER_ONE,
  context?: WorkContext): Save {
  const env = envOf(tier, context)
  const world = settle(worldOf(save, tier), msOf(now), env).state
  if (holderOf(world, placeId, slot) !== outfit.outfitId) throw new SaveRuleError('bad-slot', 'queue behind her own job')
  const add = { request: requestFor(placeId, output, count), building: placeId }
  return withWorld(save, tier, done(queue(world, { outfitId: outfit.outfitId, add }, msOf(now), env), msOf(now)).state, now)
}

export function unqueueJob(save: Save, placeId: string, slot: number, index: number, now: string, tier = TIER_ONE): Save {
  const env = envOf(tier)
  const world = settle(worldOf(save, tier), msOf(now), env).state
  const outfitId = holderOf(world, placeId, slot)
  if (!world.work[outfitId]?.queue[index]) throw new SaveRuleError('bad-slot', 'nothing queued there')
  return withWorld(save, tier, done(queue(world, { outfitId, remove: index }, msOf(now), env), msOf(now)).state, now)
}

/** Applies the kit's add, remove or move queue edit without translating it through a screen-specific card model. */
export function editWorkerQueue(save: Save, input: QueueInput<RpgWorkRequest>, now: string, tier = TIER_ONE, context?: WorkContext): Save {
  const env = envOf(tier, context)
  const world = settle(worldOf(save, tier), msOf(now), env).state
  return withWorld(save, tier, done(queue(world, input, msOf(now), env), msOf(now)).state, now)
}

/** Ends her work early: collects what's made; inputs for items never made come back; the item in progress is lost; her
 * queue drops and Repeat forgets her last job. */
export function recallJob(save: Save, placeId: string, slot: number, now: string, tier = TIER_ONE): Save {
  const env = envOf(tier)
  const world = settle(worldOf(save, tier), msOf(now), env).state
  return withWorld(save, tier, recall(world, { outfitId: holderOf(world, placeId, slot) }, msOf(now), env).state, now)
}

/** Recalls one Uma's work. */
export function recallWorker(save: Save, outfitId: string, now: string, tier = TIER_ONE): Save {
  const env = envOf(tier)
  const world = settle(worldOf(save, tier), msOf(now), env).state
  return withWorld(save, tier, recall(world, { outfitId }, msOf(now), env).state, now)
}

/** Spends Speed Tickets on the slot's running job: each takes 30 minutes off (D74), never past done, and never more
 * than finish it. */
export function cutJobTime(save: Save, placeId: string, slot: number, tickets: number, now: string, tier = TIER_ONE): Save {
  const env = envOf(tier)
  const world = settle(worldOf(save, tier), msOf(now), env).state
  const outfitId = holderOf(world, placeId, slot)
  const running = world.work[outfitId]!.entries.at(-1)!
  if (!Number.isInteger(tickets) || tickets < 1) throw new SaveRuleError('bad-count', 'use at least one Speed Ticket')
  return withWorld(save, tier, done(speedUp(world, { outfitId, startedAt: running.startedAt, tickets }, msOf(now), env), msOf(now)).state, now)
}

/** Speeds the exact entry the screen showed, so a late tap cannot spend tickets on its successor. */
export function speedWorker(save: Save, outfitId: string, startedAt: number, tickets: number, now: string, tier = TIER_ONE): Save {
  const env = envOf(tier)
  const world = settle(worldOf(save, tier), msOf(now), env).state
  return withWorld(save, tier, done(speedUp(world, { outfitId, startedAt, tickets }, msOf(now), env), msOf(now)).state, now)
}

/** Finishes the exact entry the screen showed with the engine's calculated Speed Ticket cost. */
export function finishWorker(save: Save, outfitId: string, startedAt: number, now: string, tier = TIER_ONE): Save {
  const env = envOf(tier)
  const world = settle(worldOf(save, tier), msOf(now), env).state
  return withWorld(save, tier, done(finishNow(world, { outfitId, startedAt }, msOf(now), env), msOf(now)).state, now)
}

// --- Finish all (R2, PP25; H80) ---------------------------------------------------------------------------------------

/** Each running entry of a place on a settled world: her id, the entry's start and the tickets that finish it. */
function runningAt(world: TierWorld, placeId: string, now: number): { outfitId: string; startedAt: number; tickets: number }[] {
  return Object.values(world.work).flatMap((row) => {
    const last = row.entries.at(-1)
    if (row.slot?.building !== placeId || !last || statusOf(row, now) !== 'working') return []
    return [{ outfitId: row.outfitId, startedAt: last.startedAt, tickets: ticketsToFinish(remainingMs(last, now)) }]
  })
}

/** What "Finish all" on a place costs now (PP25): its running jobs and the sum of each one's ⌈remaining ÷ 30 minutes⌉,
 * or null when fewer than two are running (a single job has its own Finish). */
export function finishAllCost(world: TierWorld, placeId: string, now: string, tier: string | number = TIER_ONE): { jobs: number; tickets: number } | null {
  const running = runningAt(settle(world, msOf(now), envOf(tier)).state, placeId, msOf(now))
  if (running.length < 2) return null
  return { jobs: running.length, tickets: running.reduce((n, job) => n + job.tickets, 0) }
}

/** Finishes every running job of a place at once (uma-work's `finish` on each, so each queue starts at once), or refuses
 * with the total it needs when the world's Speed Tickets fall short. */
export function finishAllAt(save: Save, placeId: string, now: string, tier = TIER_ONE): Save {
  const env = envOf(tier)
  let world = settle(worldOf(save, tier), msOf(now), env).state
  const running = runningAt(world, placeId, msOf(now))
  if (running.length < 2) throw new SaveRuleError('bad-job', 'nothing to finish together')
  const total = running.reduce((n, job) => n + job.tickets, 0)
  if (world.wallet.timeTickets < total) throw new SaveRuleError('no-ticket', `Needs ${total} Speed Ticket${total === 1 ? '' : 's'}`)
  for (const job of running) world = done(finishNow(world, { outfitId: job.outfitId, startedAt: job.startedAt }, msOf(now), env), msOf(now)).state
  return withWorld(save, tier, world, now)
}

/** The first free slot of a facility, or null. */
function freeSlot(world: TierWorld, placeId: string, env: WorkEnv<TierWorld>): number | null {
  return slotsOf(world, placeId, env.buildings).find((s) => slotHolder(world, s) === undefined)?.slot ?? null
}

/** Her slot again if it's free or hers, else another free one at the same place. */
function slotFor(world: TierWorld, outfitId: string, slot: SlotRef, env: WorkEnv<TierWorld>): number | null {
  const holder = slotHolder(world, slot)
  const exists = slotsOf(world, slot.building, env.buildings).some((s) => s.slot === slot.slot)
  return exists && (holder === undefined || holder === outfitId) ? slot.slot : freeSlot(world, slot.building, env)
}

/** Pure preview of the game's complete stopped-queue restart, including its alternate-slot rule and all queued jobs.
 * `tier` is the world's (R2 plans by it), and `context` her trade for R2's gate. */
export function checkRestartStopped(world: TierWorld, outfitId: string, now: number, tier: string | number = TIER_ONE, context?: WorkContext): Refusal | null {
  const env = envOf(tier, context)
  let settled = settle(world, now, env).state
  const dropped = settled.work[outfitId]?.dropped
  if (!dropped?.requests[0]) return null
  const slot = slotFor(settled, outfitId, dropped.slot, env)
  if (slot === null) return workRefusal('slot-taken')
  const place = dropped.slot.building
  const first = start(settled, { outfitId, slot: slotRef(place, slot), request: dropped.requests[0] }, now, env)
  if (isRefusal(first)) return first
  settled = first.state
  for (const request of dropped.requests.slice(1)) {
    const next = queue(settled, { outfitId, add: { request, building: place } }, now, env)
    if (isRefusal(next)) return next
    settled = next.state
  }
  return null
}

/** Starts her last finished job again where she did it (another free slot there if hers is taken). A Ready Uma's own
 * finished entry counts as her last job: Collect and Repeat in one step. */
export function repeatJob(save: Save, outfitId: string, now: string, tier = TIER_ONE, context?: WorkContext): Save {
  const env = envOf(tier, context)
  const world = settle(worldOf(save, tier), msOf(now), env).state
  const row = world.work[outfitId]
  const finished = row && statusOf(row, msOf(now)) === 'ready' ? row.entries.at(-1) : undefined
  const job = finished && row?.slot ? { slot: row.slot, request: finished.request } : row?.last
  if (!job) throw new SaveRuleError('bad-job', 'nothing to repeat')
  const slot = slotFor(world, outfitId, job.slot, env)
  if (slot === null) throw new SaveRuleError('bad-slot', 'no free slot there')
  return startJob(withWorld(save, tier, world, now), job.slot.building, slot, { outfitId }, job.request.item, job.request.count, now, tier, context)
}

/** Restarts a queue that stopped: its first job starts now where it would have (another free slot there if that one is
 * taken), and the rest queue behind it. */
export function restartStopped(save: Save, outfitId: string, now: string, tier = TIER_ONE, context?: WorkContext): Save {
  const env = envOf(tier, context)
  const world = settle(worldOf(save, tier), msOf(now), env).state
  const dropped = world.work[outfitId]?.dropped
  if (!dropped) throw new SaveRuleError('bad-job', 'nothing stopped')
  const [first, ...rest] = dropped.requests
  const place = dropped.slot.building
  const slot = slotFor(world, outfitId, dropped.slot, env)
  if (slot === null) throw new SaveRuleError('bad-slot', 'no free slot there')
  let next = startJob(withWorld(save, tier, world, now), place, slot, { outfitId }, first!.item, first!.count, now, tier, context)
  for (const request of rest) next = queueJob(next, place, slot, { outfitId }, request.item, request.count, now, tier, context)
  return next
}

/** Forgets a queue that stopped. */
export function dismissStopped(save: Save, outfitId: string, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const row = world.work[outfitId]
  if (!row?.dropped) return save
  return withWorld(save, tier, withRow(world, { ...row, dropped: null }), now)
}

/** What the next level costs: Laurels plus refined items of the facility's two families, or null at the top. R2's places
 * have no levels (PP4): null from the economy stage. */
export function upgradeCost(world: TierWorld, placeId: string): { laurels: number; items: Record<string, number> } | null {
  if (rpgRework('economy')) return null
  const level = facilityLevel(world, placeId)
  if (!facilitySpec(placeId) || level >= RPG_BUILDINGS.maxLevel(placeId)) return null
  const cost = RPG_BUILDINGS.upgradeCost(placeId, level + 1)
  return { laurels: cost.money, items: Object.fromEntries(cost.items.map((q: ItemQty) => [q.item, q.qty])) }
}

/** R2's refusal of an upgrade (PP4: every place has its four slots and its speed from day one). */
export const NO_PLACE_LEVELS = 'Places have no levels'

export function upgradeFacility(save: Save, placeId: string, now: string, tier = TIER_ONE): Save {
  if (rpgRework('economy')) throw new SaveRuleError('bad-job', NO_PLACE_LEVELS)
  const world = worldOf(save, tier)
  if (!upgradeCost(world, placeId)) throw new SaveRuleError('bad-job', 'already at the top level')
  return withWorld(save, tier, done(upgrade(world, { building: placeId }, msOf(now), RPG_WORK_ENV), msOf(now)).state, now)
}

// --- Small derived readings used outside the shared facility screens --------------------------------------------------

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
function slotJob(world: TierWorld, row: WorkRow<RpgWorkRequest>, now: number, env: WorkEnv<TierWorld>): SlotJob {
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

/** Her job at `now`, wherever she works, or null. */
export function slotJobOf(world: TierWorld, outfitId: string, now: string, tier: string | number = TIER_ONE): (SlotJob & { placeId: string; slot: number }) | null {
  const env = envOf(tier)
  const settled = settle(world, msOf(now), env).state
  const row = settled.work[outfitId]
  if (!row?.slot || row.entries.length === 0) return null
  return { ...slotJob(settled, row, msOf(now), env), placeId: row.slot.building, slot: row.slot.slot }
}

/** Places with something to collect at `now`, and how many of their slots have it. */
export function readyWork(world: TierWorld, now: string, tier: string | number = TIER_ONE): Map<string, number> {
  const settled = settle(world, msOf(now), envOf(tier)).state
  const out = new Map<string, number>()
  for (const row of Object.values(settled.work)) {
    if (!row.slot || row.entries.length === 0) continue
    if (readyItems(row, msOf(now)) > 0 || statusOf(row, msOf(now)) === 'ready') out.set(row.slot.building, (out.get(row.slot.building) ?? 0) + 1)
  }
  return out
}

export type { OwnedUma }
