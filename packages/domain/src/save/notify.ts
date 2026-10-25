// What finished in a time window, for push notifications (QoL, D63, SC3): every entry that ended in it, read from the
// work rows settled to the window's end, so a queue that stopped on short inputs never announces jobs that didn't start.
// Every tier world announces its own news, and each link carries `?tier=` to open that world (H35).
import { endsAt, settle } from '@luismlorenzana/uma-work'
import type { JobKind } from '../economy/jobs'
import { stockName } from '../economy/stock'
import { placeById } from '../hub/places'
import { liveWorkEnv } from '../work/env-v3'
import { savedTiers, tierKey, TIER_ONE, worldOf } from './rules'
import type { Save } from './save'
import { readyWork } from './work'

export interface Finish {
  at: number
  placeId: string
  slot: number
  kind: JobKind
  output: string
  count: number
  /** Nothing runs in the slot after it: she needs new work. */
  idle: boolean
}

/** Every job that ends in (from, to], oldest first. */
export function finishesBetween(save: Save, from: number, to: number, tier = TIER_ONE): Finish[] {
  const out: Finish[] = []
  // Settled to `to`, each row holds every entry started by then: a queued one started the moment the one before ended.
  const world = settle(worldOf(save, tier), to, liveWorkEnv(Number(tier))).state
  for (const row of Object.values(world.work)) {
    if (!row.slot) continue
    row.entries.forEach((entry, i) => {
      const at = endsAt(entry)
      if (at <= from || at > to) return
      const idle = i === row.entries.length - 1 && row.queue.length === 0
      out.push({ at, placeId: row.slot!.building, slot: row.slot!.slot, kind: entry.request.kind, output: entry.request.item, count: entry.request.count, idle })
    })
  }
  return out.sort((a, b) => a.at - b.at)
}

/** Slots with something to collect at `now` in one tier world. */
export function readySlots(save: Save, now: string, tier = TIER_ONE): number {
  return [...readyWork(worldOf(save, tier), now, tier).values()].reduce((a, b) => a + b, 0)
}

/** Slots with something to collect at `now` in every tier world: the app badge. */
export function readyEverywhere(save: Save, now: string): number {
  return savedTiers(save).reduce((n, tier) => n + readySlots(save, now, tierKey(tier)), 0)
}

export interface Notice { title: string; body: string; tag: string; url: string }

/** One notification for the slots of a tier world that went idle (a queue moving on to its next job needs nothing from
 * you, D65): one names itself; several are listed. Its link opens that tier (`?tier=n`), and `named` puts the tier in the
 * title when the save has several worlds. */
export function finishNotice(all: readonly Finish[], tier = 1, named = false): Notice | null {
  const finishes = all.filter((f) => f.idle)
  if (finishes.length === 0) return null
  const line = (f: Finish) => `${placeById(f.placeId)?.name ?? f.placeId}: ${stockName(f.output)} ×${f.count}`
  const title = (text: string) => (named ? `Tier ${tier} · ${text}` : text)
  const tag = (text: string) => (tier > 1 ? `t${tier}-${text}` : text)
  const link = (path: string) => `${path}?tier=${tier}`
  if (finishes.length === 1) {
    const f = finishes[0]!
    const place = placeById(f.placeId)
    return { title: title('Work done'), body: line(f), tag: tag(`slot-${f.placeId}-${f.slot}`), url: link(place ? `/${place.page}/${place.id}` : '/') }
  }
  const shown = finishes.slice(-4).map(line)
  return { title: title(`${finishes.length} jobs done`), body: [...shown, ...(finishes.length > 4 ? [`and ${finishes.length - 4} more`] : [])].join('\n'),
    tag: tag('work'), url: link('/') }
}

/** One notice per tier world with news in (from, to], lowest tier first, each titled with its tier when there are several. */
export function tierNotices(save: Save, from: number, to: number): Notice[] {
  const tiers = savedTiers(save)
  return tiers.flatMap((tier) => finishNotice(finishesBetween(save, from, to, tierKey(tier)), tier, tiers.length > 1) ?? [])
}
