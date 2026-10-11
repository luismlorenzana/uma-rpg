// Facility work over the save (S4, D55): put an Uma in a slot to gather or refine, collect what she has made (with her
// profession EXP), recall her, rush a job with tickets, and upgrade a facility. Pure, like every rule.
import type { Aptitudes } from '@luismlorenzana/uma-data'
import { facilitySpec, jobEndsAt, jobFinished, type Facility, type Job } from '../economy/jobs'
import {
  aptitudeTime, EXP_PER_MINUTE, makeMinutes, FACILITY_MAX_LEVEL, FACILITY_SLOTS, FACILITY_SPEED, FACILITY_UPGRADE, itemMinutes, MAX_JOB_COUNT, MINUTE,
  PROFESSION_MAX_LEVEL, professionExpToNext, TIME_TICKET_SPAN, timeTicketsToFinish, type Profession,
} from '../economy/pacing'
import { familyById, gradeUnlockLevel, itemById, type ItemDef } from '../items/catalog'
import { dishById } from '../economy/dishes'
import { gearById } from '../economy/gear'
import { maxRankOf, parseTrack, rankOf, trackAptitude, trackHours, tracksAt, trackId, type Track, withRank } from '../economy/training'
import { MAX_QUEUE, type QueuedJob } from '../economy/jobs'
import { stockName } from '../economy/stock'
import { promotionTokenId } from '../economy/tokens'
import { HOUR } from '../economy/pacing'
import { isInFight, workOf } from './status'
import { SaveRuleError, TIER_ONE, worldOf } from './rules'
import type { OwnedUma, ProfessionLevel, Save, TierWorld } from './save'

/** What work needs from an outfit's master data (a `RosterOutfit` fits). */
export interface WorkOutfit {
  outfitId: string
  aptitudes: Pick<Aptitudes, 'surface'> & Partial<Pick<Aptitudes, 'strategy' | 'distance'>>
}

function withWorld(save: Save, tier: string, world: TierWorld, now: string): Save {
  return { ...save, account: { ...save.account, updatedAt: now }, tierWorlds: { ...save.tierWorlds, [tier]: world } }
}

/** A facility's state: level 1 and idle until first used. */
export function facilityOf(world: TierWorld, placeId: string): Facility {
  return world.facilities[placeId] ?? { level: 1, jobs: Array.from({ length: FACILITY_SLOTS[0] }, () => null) }
}


/** Profession EXP in: levels up, banking EXP at Lv50. */
export function grantProfessionExp(p: ProfessionLevel, exp: number): ProfessionLevel {
  let { level } = p
  let bank = p.exp + Math.max(0, Math.floor(exp))
  while (level < PROFESSION_MAX_LEVEL && bank >= professionExpToNext(level)) {
    bank -= professionExpToNext(level)
    level += 1
  }
  return { level, exp: bank }
}

/** Surface aptitude sets profession speed: Turf for Farming & Cooking, Dirt for Gathering & Crafting (§4.1). */
export const professionAptitude = (outfit: WorkOutfit, profession: Profession) => (profession === 'farming' ? outfit.aptitudes.surface.turf : outfit.aptitudes.surface.dirt)

export interface JobPlan {
  /** What it makes: its name and grade. */
  output: { id: string; name: string; grade: number }
  /** The raw or refined item, when it makes one. */
  item: ItemDef | null
  profession: Profession
  /** Real milliseconds per item for this Uma here. */
  msEach: number
  expEach: number
  /** Inputs per item. */
  inputs: Record<string, number>
  /** Why it can't start, or null. */
  block: string | null
}

/** What a gather, refine or cook job would be: its speed for this Uma, its EXP, inputs and anything stopping it. */
export function planJob(world: TierWorld, placeId: string, outfit: WorkOutfit, output: string, count = 1): JobPlan | null {
  const spec = facilitySpec(placeId)
  if (spec?.kind === 'cook') return planCooking(world, placeId, outfit, output, count)
  if (spec?.kind === 'craft') return planCrafting(world, placeId, outfit, output, count)
  const item = itemById(output)
  const uma = world.umas[outfit.outfitId]
  if (!spec || !item || !uma || !spec.profession || (spec.kind !== 'gather' && spec.kind !== 'refine')) return null
  const profession = spec.profession
  const facility = facilityOf(world, placeId)
  const msEach = Math.max(1000, Math.round((itemMinutes(item.grade) * MINUTE * aptitudeTime(professionAptitude(outfit, profession))) / FACILITY_SPEED[facility.level - 1]!))
  const inputs: Record<string, number> = spec.kind === 'refine' ? { [item.pair]: 1 } : {}
  let block: string | null = null
  if (spec.kind === 'gather' && (item.refined || item.family !== spec.family)) block = 'Not made here'
  else if (spec.kind === 'refine' && (!item.refined || item.side !== profession)) block = 'Not refined here'
  else if (uma.professions[profession].level < gradeUnlockLevel(item.grade)) block = `Needs ${profession === 'farming' ? 'Farm' : 'Craft'} Lv${gradeUnlockLevel(item.grade)}`
  else if (spec.kind === 'refine' && (world.items[item.pair] ?? 0) < count) block = `Needs ${count} ${itemById(item.pair)?.name ?? item.pair}`
  return { output: { id: item.id, name: item.name, grade: item.grade }, item, profession, msEach, expEach: itemMinutes(item.grade) * EXP_PER_MINUTE, inputs, block }
}

/** Why the Warehouse can't cover `count` sets of these inputs, or null. */
export function inputsBlock(world: TierWorld, inputs: Record<string, number>, count: number): string | null {
  for (const [id, n] of Object.entries(inputs)) {
    if ((world.items[id] ?? 0) < n * count) return `Needs ${n * count} ${stockName(id)}`
  }
  return null
}

/** A piece of gear at the Forge (S7): Gathering & Crafting, three items' time, its materials. */
function planCrafting(world: TierWorld, placeId: string, outfit: WorkOutfit, output: string, count: number): JobPlan | null {
  const piece = gearById(output)
  const uma = world.umas[outfit.outfitId]
  if (!piece || !uma) return null
  const facility = facilityOf(world, placeId)
  const minutes = makeMinutes(piece.grade)
  const msEach = Math.max(1000, Math.round((minutes * MINUTE * aptitudeTime(professionAptitude(outfit, 'gathering'))) / FACILITY_SPEED[facility.level - 1]!))
  const block = uma.professions.gathering.level < gradeUnlockLevel(piece.grade) ? `Needs Craft Lv${gradeUnlockLevel(piece.grade)}` : inputsBlock(world, piece.inputs, count)
  return { output: { id: piece.id, name: piece.name, grade: piece.grade }, item: null, profession: 'gathering', msEach, expEach: minutes * EXP_PER_MINUTE, inputs: piece.inputs, block }
}

/** A dish at the Kitchen (S6): Farming & Cooking, three items' time, its recipe's refined ingredients. */
function planCooking(world: TierWorld, placeId: string, outfit: WorkOutfit, output: string, count: number): JobPlan | null {
  const dish = dishById(output)
  const uma = world.umas[outfit.outfitId]
  if (!dish || !uma) return null
  const facility = facilityOf(world, placeId)
  const minutes = makeMinutes(dish.grade)
  const msEach = Math.max(1000, Math.round((minutes * MINUTE * aptitudeTime(professionAptitude(outfit, 'farming'))) / FACILITY_SPEED[facility.level - 1]!))
  const block = uma.professions.farming.level < gradeUnlockLevel(dish.grade) ? `Needs Farm Lv${gradeUnlockLevel(dish.grade)}` : inputsBlock(world, dish.inputs, count)
  return { output: { id: dish.id, name: dish.name, grade: dish.grade }, item: null, profession: 'farming', msEach, expEach: minutes * EXP_PER_MINUTE, inputs: dish.inputs, block }
}

/** Why this Uma can't take a job now, or null: she works one job at a time and never mid-fight. */
export function availabilityBlock(world: TierWorld, outfitId: string): string | null {
  if (!world.umas[outfitId]) return 'Not unlocked'
  if (workOf(world, outfitId)) return 'Already working'
  if (isInFight(world, outfitId)) return 'In a fight'
  return null
}

function setJob(world: TierWorld, placeId: string, slot: number, job: Job | null): TierWorld {
  const facility = facilityOf(world, placeId)
  const jobs = facility.jobs.map((j, i) => (i === slot ? job : j))
  return { ...world, facilities: { ...world.facilities, [placeId]: { ...facility, jobs } } }
}

function take(items: Record<string, number>, id: string, n: number): Record<string, number> {
  const have = items[id] ?? 0
  if (have < n) throw new SaveRuleError('no-items', `needs ${n} ${itemById(id)?.name ?? id}`)
  const next = { ...items }
  if (have === n) delete next[id]
  else next[id] = have - n
  return next
}
const give = (items: Record<string, number>, id: string, n: number): Record<string, number> => (n > 0 ? { ...items, [id]: (items[id] ?? 0) + n } : items)

/** Starts a gather or refine job: `count` items, made one after another; a refine job reserves its inputs now. */
export function startJob(save: Save, placeId: string, slot: number, outfit: WorkOutfit, output: string, count: number, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const facility = facilityOf(world, placeId)
  if (!Number.isInteger(slot) || slot < 0 || slot >= facility.jobs.length) throw new SaveRuleError('bad-slot', `slot ${slot} doesn't exist`)
  if (facility.jobs[slot]) throw new SaveRuleError('bad-slot', 'that slot is busy')
  if (!Number.isInteger(count) || count < 1 || count > MAX_JOB_COUNT) throw new SaveRuleError('bad-count', `make 1–${MAX_JOB_COUNT} at a time`)
  const busy = availabilityBlock(world, outfit.outfitId)
  if (busy) throw new SaveRuleError('busy', busy)
  const plan = planJob(world, placeId, outfit, output, count)
  if (!plan) throw new SaveRuleError('bad-job', 'nothing to make here')
  if (plan.block) throw new SaveRuleError('bad-job', plan.block)
  let items = world.items
  for (const [id, n] of Object.entries(plan.inputs)) items = take(items, id, n * count)
  const job: Job = { kind: facilitySpec(placeId)!.kind, outfitId: outfit.outfitId, output, count, collected: 0, startedAt: now, msEach: plan.msEach,
    expEach: plan.expEach, inputs: plan.inputs, queue: [] }
  return withWorld(save, tier, setJob({ ...world, items }, placeId, slot, job), now)
}

export interface Collected { items: number; exp: number; levelsUp: number; done: boolean; rankUp?: boolean }

/**
 * Collects a job; when it's finished and has a queue, its next job starts at the moment it finished (inputs taken
 * then), and so on down the queue as far as `now` reaches, so a chain catches up however late it's collected.
 */
function collectIn(world: TierWorld, placeId: string, slot: number, now: string): { world: TierWorld; got: Collected } {
  const job = facilityOf(world, placeId).jobs[slot]
  if (!job) throw new SaveRuleError('bad-slot', 'nothing working there')
  if (job.queue.length > 0 && jobFinished(job, now) >= job.count) {
    const endedAt = new Date(jobEndsAt(job)).toISOString()
    const first = collectOne(world, placeId, slot, job, endedAt)
    const [next, ...rest] = job.queue
    const started = startQueued(first.world, placeId, slot, job, next!, rest, endedAt)
    if (!started) return { world: first.world, got: first.got }
    const more = collectIn(started, placeId, slot, now)
    return { world: more.world, got: { items: first.got.items + more.got.items, exp: first.got.exp + more.got.exp, levelsUp: first.got.levelsUp + more.got.levelsUp,
      done: more.got.done, rankUp: first.got.rankUp || more.got.rankUp } }
  }
  return collectOne(world, placeId, slot, job, now)
}

/** Starts a queued job in a freed slot, or returns null (and drops the queue) when the Warehouse can't cover it. */
function startQueued(world: TierWorld, placeId: string, slot: number, prev: Job, next: QueuedJob, rest: QueuedJob[], at: string): TierWorld | null {
  let items = world.items
  for (const [id, n] of Object.entries(next.inputs)) {
    if ((items[id] ?? 0) < n * next.count) return null
    items = take(items, id, n * next.count)
  }
  if (prev.kind === 'train') {
    const track = parseTrack(next.output)
    const uma = world.umas[prev.outfitId]
    if (!track || !uma || rankOf(uma.ranks, track) >= maxRankOf(track)) return null
  }
  const job: Job = { kind: prev.kind, outfitId: prev.outfitId, output: next.output, count: next.count, collected: 0, startedAt: at, msEach: next.msEach,
    expEach: next.expEach, inputs: next.inputs, queue: rest }
  return setJob({ ...world, items }, placeId, slot, job)
}

function collectOne(world: TierWorld, placeId: string, slot: number, job: Job, now: string): { world: TierWorld; got: Collected } {
  if (job.kind === 'train') return collectTraining(world, placeId, slot, job, now)
  const finished = jobFinished(job, now)
  const ready = finished - job.collected
  const spec = facilitySpec(placeId)!
  const done = finished >= job.count
  if (ready <= 0) return { world: done ? setJob(world, placeId, slot, null) : world, got: { items: 0, exp: 0, levelsUp: 0, done } }
  let next: TierWorld = job.kind === 'cook' ? { ...world, dishes: give(world.dishes, job.output, ready) }
    : job.kind === 'craft' ? { ...world, gear: give(world.gear, job.output, ready) } : { ...world, items: give(world.items, job.output, ready) }
  let levelsUp = 0
  const exp = ready * job.expEach
  const uma = next.umas[job.outfitId]
  if (uma && spec.profession) {
    const before = uma.professions[spec.profession]
    const after = grantProfessionExp(before, exp)
    levelsUp = after.level - before.level
    next = { ...next, umas: { ...next.umas, [job.outfitId]: { ...uma, professions: { ...uma.professions, [spec.profession]: after } } } }
  }
  next = setJob(next, placeId, slot, done ? null : { ...job, collected: finished })
  return { world: next, got: { items: ready, exp, levelsUp, done } }
}

/** Moves what a job has made to the Warehouse and pays her EXP; a finished job frees the slot. */
export function collectJob(save: Save, placeId: string, slot: number, now: string, tier = TIER_ONE): { save: Save; got: Collected } {
  const { world, got } = collectIn(worldOf(save, tier), placeId, slot, now)
  return { save: withWorld(save, tier, world, now), got }
}

/** Collects every job with something ready, on the given places (all by default). */
export function collectAll(save: Save, now: string, placeIds?: readonly string[], tier = TIER_ONE): { save: Save; items: number; levelsUp: number } {
  let world = worldOf(save, tier)
  let items = 0
  let levelsUp = 0
  for (const [placeId, f] of Object.entries(world.facilities)) {
    if (placeIds && !placeIds.includes(placeId)) continue
    f.jobs.forEach((job, slot) => {
      if (!job || (jobFinished(job, now) - job.collected <= 0 && jobFinished(job, now) < job.count)) return
      const r = collectIn(world, placeId, slot, now)
      world = r.world
      items += r.got.items
      levelsUp += r.got.levelsUp
    })
  }
  return { save: withWorld(save, tier, world, now), items, levelsUp }
}

// --- Training (S5, D57) -------------------------------------------------------------------------------------------

/** What training a track here would take for this Uma, and anything stopping it. */
export function planTraining(world: TierWorld, placeId: string, outfit: WorkOutfit & { aptitudes: Pick<Aptitudes, 'strategy' | 'distance'> }, track: Track):
  { rank: number; msEach: number; inputs: Record<string, number>; block: string | null } | null {
  const uma = world.umas[outfit.outfitId]
  if (!uma || !tracksAt(placeId).some((t) => trackId(t) === trackId(track))) return null
  const rank = rankOf(uma.ranks, track)
  const msEach = trainingMs(world, placeId, outfit, track, rank)
  const inputs = trainingInputs(track, rank)
  return { rank, msEach, inputs, block: rank >= maxRankOf(track) ? 'Already at the top rank' : inputsBlock(world, inputs, 1) }
}

function trainingMs(world: TierWorld, placeId: string, outfit: WorkOutfit, track: Track, rank: number): number {
  const aptitudes = outfit.aptitudes as Pick<Aptitudes, 'strategy' | 'distance'>
  return Math.max(1000, Math.round((trackHours(track, rank) * HOUR * aptitudeTime(trackAptitude(track, aptitudes))) / FACILITY_SPEED[facilityOf(world, placeId).level - 1]!))
}
/** A class promotion from rank r spends a Promotion Token of band r (D67); mastery is time alone. */
function trainingInputs(track: Track, rank: number): Record<string, number> {
  return track.kind === 'class' && rank < maxRankOf(track) ? { [promotionTokenId(track.classId, rank)]: 1 } : {}
}

/** Starts training one rank: a class promotion takes its token now. Time Tickets cut it like any job (D74). */
export function startTraining(save: Save, placeId: string, slot: number, outfit: WorkOutfit & { aptitudes: Pick<Aptitudes, 'strategy' | 'distance'> }, track: Track,
  now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const facility = facilityOf(world, placeId)
  if (!Number.isInteger(slot) || slot < 0 || slot >= facility.jobs.length) throw new SaveRuleError('bad-slot', `slot ${slot} doesn't exist`)
  if (facility.jobs[slot]) throw new SaveRuleError('bad-slot', 'that slot is busy')
  const busy = availabilityBlock(world, outfit.outfitId)
  if (busy) throw new SaveRuleError('busy', busy)
  const plan = planTraining(world, placeId, outfit, track)
  if (!plan) throw new SaveRuleError('bad-job', 'not trained here')
  if (plan.block) throw new SaveRuleError('bad-job', plan.block)
  let items = world.items
  for (const [id, n] of Object.entries(plan.inputs)) items = take(items, id, n)
  const job: Job = { kind: 'train', outfitId: outfit.outfitId, output: trackId(track), count: 1, collected: 0, startedAt: now, msEach: plan.msEach, expEach: 0,
    inputs: plan.inputs, queue: [] }
  return withWorld(save, tier, setJob({ ...world, items }, placeId, slot, job), now)
}

function collectTraining(world: TierWorld, placeId: string, slot: number, job: Job, now: string): { world: TierWorld; got: Collected } {
  if (jobFinished(job, now) < job.count) return { world, got: { items: 0, exp: 0, levelsUp: 0, done: false } }
  const track = parseTrack(job.output)
  const uma = world.umas[job.outfitId]
  let next = setJob(world, placeId, slot, null)
  if (track && uma) {
    const ranks = withRank(uma.ranks, track, Math.min(maxRankOf(track), rankOf(uma.ranks, track) + 1))
    next = { ...next, umas: { ...next.umas, [job.outfitId]: { ...uma, ranks } } }
  }
  return { world: next, got: { items: 0, exp: 0, levelsUp: 0, done: true, rankUp: true } }
}

/**
 * Queues another job after the slot's current one, for the same Uma: same kind of work, planned now (speed fixed with
 * her aptitude and today's facility level), inputs taken when it starts. Training queues the next rank.
 */
export function queueJob(save: Save, placeId: string, slot: number, outfit: WorkOutfit, output: string, count: number, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const job = facilityOf(world, placeId).jobs[slot]
  if (!job || job.outfitId !== outfit.outfitId) throw new SaveRuleError('bad-slot', 'queue behind her own job')
  if (job.queue.length >= MAX_QUEUE) throw new SaveRuleError('bad-count', `at most ${MAX_QUEUE} queued`)
  let entry: QueuedJob
  if (job.kind === 'train') {
    const track = parseTrack(output)
    const uma = world.umas[outfit.outfitId]
    if (!track || !uma || !outfit.aptitudes.strategy || !outfit.aptitudes.distance || !tracksAt(placeId).some((t) => trackId(t) === output)) throw new SaveRuleError('bad-job', 'not trained here')
    // The rank it will train from: today's, plus the current job and each queued one of the same track.
    const rank = rankOf(uma.ranks, track) + [job, ...job.queue].filter((j) => j.output === output).length
    if (rank >= maxRankOf(track)) throw new SaveRuleError('bad-job', 'that would pass the top rank')
    entry = { output, count: 1, msEach: trainingMs(world, placeId, outfit, track, rank), expEach: 0, inputs: trainingInputs(track, rank) }
  } else {
    if (!Number.isInteger(count) || count < 1 || count > MAX_JOB_COUNT) throw new SaveRuleError('bad-count', `make 1–${MAX_JOB_COUNT} at a time`)
    const plan = planJob(world, placeId, outfit, output, 0)
    if (!plan) throw new SaveRuleError('bad-job', 'nothing to make here')
    // Planned for zero items, only a grade gate can block it; inputs are checked when it starts.
    if (plan.block) throw new SaveRuleError('bad-job', plan.block)
    entry = { output, count, msEach: plan.msEach, expEach: plan.expEach, inputs: plan.inputs }
  }
  return withWorld(save, tier, setJob(world, placeId, slot, { ...job, queue: [...job.queue, entry] }), now)
}

export function unqueueJob(save: Save, placeId: string, slot: number, index: number, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const job = facilityOf(world, placeId).jobs[slot]
  if (!job || !job.queue[index]) throw new SaveRuleError('bad-slot', 'nothing queued there')
  return withWorld(save, tier, setJob(world, placeId, slot, { ...job, queue: job.queue.filter((_, i) => i !== index) }), now)
}

/** Ends a job early: collects what's made; inputs for items never made come back; the item in progress is lost. */
export function recallJob(save: Save, placeId: string, slot: number, now: string, tier = TIER_ONE): Save {
  const job = facilityOf(worldOf(save, tier), placeId).jobs[slot]
  if (!job) throw new SaveRuleError('bad-slot', 'nothing working there')
  // A recall drops the queue first, so nothing queued starts (or takes inputs) on the way out.
  const collected = collectIn(setJob(worldOf(save, tier), placeId, slot, { ...job, queue: [] }), placeId, slot, now)
  let world = collected.world
  const unmade = job.count - jobFinished(job, now)
  for (const [id, n] of Object.entries(job.inputs)) world = { ...world, items: give(world.items, id, n * unmade) }
  if (facilityOf(world, placeId).jobs[slot]) world = setJob(world, placeId, slot, null)
  return withWorld(save, tier, world, now)
}

/** Time Tickets that would finish a running job now: one per started 30 minutes left (D74). */
export function ticketsToFinish(job: Job, now: string): number {
  return timeTicketsToFinish(Math.max(0, jobEndsAt(job) - Date.parse(now)))
}

/**
 * Spends Time Tickets on a running job or training: each takes 30 minutes off (D74), never past done. The items it
 * finishes are collected as usual.
 */
export function cutJobTime(save: Save, placeId: string, slot: number, tickets: number, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const job = facilityOf(world, placeId).jobs[slot]
  if (!job) throw new SaveRuleError('bad-slot', 'nothing working there')
  if (jobFinished(job, now) >= job.count) throw new SaveRuleError('bad-job', 'already finished')
  const needed = ticketsToFinish(job, now)
  if (!Number.isInteger(tickets) || tickets < 1 || tickets > needed) throw new SaveRuleError('bad-count', `use 1–${needed} Time Tickets here`)
  if (world.wallet.timeTickets < tickets) throw new SaveRuleError('no-ticket', `needs ${tickets} Time Ticket${tickets > 1 ? 's' : ''}`)
  const left = jobEndsAt(job) - Date.parse(now)
  const startedAt = new Date(Date.parse(job.startedAt) - Math.min(left, tickets * TIME_TICKET_SPAN)).toISOString()
  const next = setJob({ ...world, wallet: { ...world.wallet, timeTickets: world.wallet.timeTickets - tickets } }, placeId, slot, { ...job, startedAt })
  return withWorld(save, tier, next, now)
}

/** What the next level costs: Laurels plus refined items of the facility's two families, or null at the top. */
export function upgradeCost(world: TierWorld, placeId: string): { laurels: number; items: Record<string, number> } | null {
  const spec = facilitySpec(placeId)
  const facility = facilityOf(world, placeId)
  const step = FACILITY_UPGRADE[facility.level - 1]
  if (!spec || !step || facility.level >= FACILITY_MAX_LEVEL) return null
  const items: Record<string, number> = {}
  for (const familyId of spec.upgradeFamilies) {
    const refined = familyById(familyId)?.refined[step.grade - 1]
    if (refined) items[refined.id] = step.count
  }
  return { laurels: step.laurels, items }
}

export function upgradeFacility(save: Save, placeId: string, now: string, tier = TIER_ONE): Save {
  const world = worldOf(save, tier)
  const cost = upgradeCost(world, placeId)
  if (!cost) throw new SaveRuleError('bad-job', 'already at the top level')
  if (world.wallet.laurels < cost.laurels) throw new SaveRuleError('no-laurels', `needs ${cost.laurels} Laurels`)
  let items = world.items
  for (const [id, n] of Object.entries(cost.items)) items = take(items, id, n)
  const facility = facilityOf(world, placeId)
  const level = facility.level + 1
  const jobs = Array.from({ length: FACILITY_SLOTS[level - 1]! }, (_, i) => facility.jobs[i] ?? null)
  const next: TierWorld = { ...world, items, wallet: { ...world.wallet, laurels: world.wallet.laurels - cost.laurels }, facilities: { ...world.facilities, [placeId]: { level, jobs } } }
  return withWorld(save, tier, next, now)
}

export type { OwnedUma }
