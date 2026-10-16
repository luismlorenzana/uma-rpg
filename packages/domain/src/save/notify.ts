// What finished in a time window, for push notifications (QoL, D63): every job end in each slot's chain, judged by the
// real collect rules, so a queue that stopped on short inputs never announces jobs that didn't start.
import { gearById } from '../economy/gear'
import { gemById } from '../economy/gems'
import { jobEndsAt, jobFinished, queueTimeline, type Job } from '../economy/jobs'
import { placeById } from '../hub/places'
import { itemById } from '../items/catalog'
import { TIER_ONE, worldOf } from './rules'
import type { Save } from './save'
import { collectJob, facilityOf } from './work'

export interface Finish {
  at: number
  placeId: string
  slot: number
  kind: Job['kind']
  output: string
  count: number
  /** Nothing runs in the slot after it: she needs new work. */
  idle: boolean
}

const iso = (ms: number) => new Date(ms).toISOString()

/** Every job that ends in (from, to], oldest first. */
export function finishesBetween(save: Save, from: number, to: number, tier = TIER_ONE): Finish[] {
  const out: Finish[] = []
  for (const [placeId, facility] of Object.entries(worldOf(save, tier).facilities)) {
    facility.jobs.forEach((job, slot) => {
      if (!job) return
      const times = queueTimeline(job)
      const starts = [Date.parse(job.startedAt), ...times.map((t) => t.startsAt)]
      const ends = [jobEndsAt(job), ...times.map((t) => t.endsAt)]
      const slotAt = (ms: number) => facilityOf(worldOf(collectJob(save, placeId, slot, iso(ms), tier).save, tier), placeId).jobs[slot]
      ends.forEach((end, i) => {
        if (end <= from || end > to) return
        // A queued job ran only if the chain reached it: just before it ends, the slot holds it.
        if (i > 0 && slotAt(end - 1)?.startedAt !== iso(starts[i]!)) return
        const entry = i === 0 ? job : job.queue[i - 1]!
        out.push({ at: end, placeId, slot, kind: job.kind, output: entry.output, count: entry.count, idle: !slotAt(end) })
      })
    })
  }
  return out.sort((a, b) => a.at - b.at)
}

/** Slots with something to collect at `now`: the app badge. */
export function readySlots(save: Save, now: string, tier = TIER_ONE): number {
  let n = 0
  for (const facility of Object.values(worldOf(save, tier).facilities)) {
    for (const job of facility.jobs) if (job && (jobFinished(job, now) > job.collected || jobFinished(job, now) >= job.count)) n++
  }
  return n
}

function outputName(output: string): string {
  return itemById(output)?.name ?? gemById(output)?.name ?? gearById(output)?.name ?? output
}

export interface Notice { title: string; body: string; tag: string; url: string }

/** One notification for the slots that went idle (a queue moving on to its next job needs nothing from you, D65):
 * one names itself; several are listed. */
export function finishNotice(all: readonly Finish[]): Notice | null {
  const finishes = all.filter((f) => f.idle)
  if (finishes.length === 0) return null
  const line = (f: Finish) => `${placeById(f.placeId)?.name ?? f.placeId}: ${outputName(f.output)} ×${f.count}`
  if (finishes.length === 1) {
    const f = finishes[0]!
    const place = placeById(f.placeId)
    return { title: 'Work done', body: line(f), tag: `slot-${f.placeId}-${f.slot}`, url: place ? `/${place.page}/${place.id}` : '/' }
  }
  const shown = finishes.slice(-4).map(line)
  return { title: `${finishes.length} jobs done`, body: [...shown, ...(finishes.length > 4 ? [`and ${finishes.length - 4} more`] : [])].join('\n'), tag: 'work', url: '/' }
}
