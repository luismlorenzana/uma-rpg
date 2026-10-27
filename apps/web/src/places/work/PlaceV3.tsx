// The Wilds' place pages (profession-progression.md §4.3–§4.4, PP4, PP16, PP25; H80; the farm by line since H112, D224):
// the same shared work page as the facilities (`FacilityPage`'s provider, slot rows, job sheet and stopped queues), with a
// place's own header (its profession, four slots, ×1.25, no Upgrade, the open shop, "Finish all") and her trade first in
// the picker. Its What step, sizes, (i) and quick look are `PlaceV4.tsx`'s. Rendered from the economy stage.
import {
  activeClass, facilityTargets, finishAllCost, openShop, placeById, placeSpecV4, PROFESSION_NAMES_V4, SaveRuleError, targetPlan, TRADES,
  tradeProfessions, type JobKind, type RpgWorkRequest, type TierWorld, type TradeOf,
} from '@rpg/domain'
import { workOrder } from '@luismlorenzana/uma-kit/roster'
import {
  JobSheet, jobQuery, PeekRow, readJobQuery, SlotRow, StoppedQueueCard, TargetsStrip, withoutJobQuery, useWorkView, type JobSelection,
} from '@luismlorenzana/uma-kit/work'
import { useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import { albumRows, lockedReason, type RpgUmaRow } from '../../album/rows'
import type { MasterView } from '../../master/master'
import { collectEverything, finishAll, useAlbumScope } from '../../save/game'
import { TRADE_CLASS_WORDS, tradeOfWorld } from '../../save/trade'
import { BottomSheet } from '../../ui/BottomSheet'
import { HelpButton } from '../../ui/HelpButton'
import { whoAt } from './place-view'
import { helpLinesV4, initialJobV4, jobKindAtV4, jobSizesV4 } from './place-view-v4'
import { PeekLineV4, WhatV4 } from './PlaceV4'

/** "Open shop: no Brawler in this world", or null when the place's trade has an Uma here. */
function openShopLine(world: TierWorld, placeId: string, tradeOf: TradeOf): string | null {
  if (!openShop(world, placeId, tradeOf)) return null
  const profession = placeSpecV4(placeId)!.profession
  const trade = TRADES.find((t) => tradeProfessions(t.id).includes(profession))!
  return `Open shop: no ${TRADE_CLASS_WORDS[trade.id]} in this world`
}

/** The header's line: "Mine · Mining · 4 slots · ×1.25". */
const statsLine = (placeId: string, slots: number, speed: number) =>
  `${placeById(placeId)?.name ?? placeId} · ${PROFESSION_NAMES_V4[placeSpecV4(placeId)!.profession]} · ${slots} slots · ×${speed}`

export function PlaceBodyV3({ view, world, now, tier, placeId }: { view: MasterView; world: TierWorld; now: string; tier: number; placeId: string }) {
  const work = useWorkView()
  const cards = work.cards(placeId)
  const spec = placeSpecV4(placeId)!
  const facility = work.facility(placeId)
  const location = useLocation()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const query = readJobQuery(params)
  const rows = albumRows(view, world, [], now, useAlbumScope())
  const tradeOf = tradeOfWorld(world, view.roster)
  const shop = openShopLine(world, placeId, tradeOf)
  const who = whoAt(placeId, tradeOf, shop !== null)
  const classOf = (id: string) => {
    const outfit = view.roster.find((row) => row.outfitId === id)
    return outfit && world.umas[id] ? activeClass(outfit, world.umas[id]) : 'brawler'
  }
  // H79 makes the target plan R2's; until then its lines name no v3 place and the strip stays empty.
  const targets = world.targets.length === 0 ? [] : facilityTargets(targetPlan(world, classOf), placeId)
  const free = cards.find((card) => card.kind === 'free')
  const ready = cards.some((card) => card.kind === 'held' && card.waiting > 0)
  const stopped = Object.values(work.settled.work).filter((row) => row.dropped?.slot.building === placeId)
  const finish = finishAllCost(world, placeId, now, tier)
  const [finishing, setFinishing] = useState(false)
  // FL22: a making place processes and makes, so the sheet's sizes follow the picked job's kind. The sheet opens on a make
  // (or a gather), or on a deep link's own job.
  const queryKey = JSON.stringify(query)
  const [picked, setPicked] = useState<{ key: string; kind: JobKind } | null>(null)
  const pickedKind: JobKind = picked?.key === queryKey ? picked.kind : query?.job ? jobKindAtV4(placeId, query.job) : spec.kinds.at(-1)!
  const levelOf = (outfitId: string | null) => (outfitId ? world.umas[outfitId]?.craft.level ?? 1 : 1)
  const closeJob = () => {
    if (query?.back) navigate(query.back, { replace: true })
    else navigate({ pathname: location.pathname, search: withoutJobQuery(location.search) }, { replace: true })
  }
  const openJob = (search: string) => navigate({ pathname: location.pathname, search })
  return (
    <div className="space-y-3 p-4" data-place-v3={placeId}>
      <section className="rounded-md bg-raised px-3">
        <div className="flex min-h-11 items-center justify-between gap-2">
          <h2 className="min-w-0 text-[14px] font-semibold">{statsLine(placeId, facility.slots, facility.speed)}</h2>
          <HelpButton title={placeById(placeId)?.name ?? placeId}>{helpLinesV4(placeId).map((line) => <p key={line}>{line}</p>)}</HelpButton>
        </div>
        {shop && <p className="-mt-1 pb-2 text-[13px] font-semibold text-accent" data-open-shop>{shop}</p>}
        {(ready || finish) && (
          <div className="flex min-h-12 flex-wrap items-center justify-end gap-2 border-t border-hairline py-1.5">
            {finish && (
              <button type="button" onClick={() => setFinishing(true)} data-action="finish-all"
                className="min-h-9 shrink-0 rounded-full bg-sunken px-3 text-[13px] font-semibold">
                Finish all · {finish.tickets.toLocaleString('en-US')} Speed Tickets
              </button>
            )}
            {ready && (
              <button type="button" onClick={() => void collectEverything([placeId])}
                className="min-h-9 shrink-0 rounded-full bg-accent px-3 text-[13px] font-semibold text-accent-ink">
                Collect here
              </button>
            )}
          </div>
        )}
      </section>

      <ul className="space-y-2">
        {cards.map((card) => (
          <li key={card.slot.slot}>
            <SlotRow
              slot={card.slot}
              onStart={() => openJob(jobQuery({ slot: card.slot.slot }))}
              onQueue={card.kind === 'held' ? (outfitId) => openJob(jobQuery({ uma: outfitId, queue: true })) : undefined}
              repeat
            />
          </li>
        ))}
      </ul>

      <TargetsStrip targets={targets.map((target) => ({
        id: target.key,
        item: target.icon,
        grade: target.grade,
        short: target.short,
        label: `${target.name}, grade ${target.grade}. Need ${target.need}, have ${target.have}${target.coming ? `, ${target.coming} coming` : ''}`,
        onPick: free && target.short > 0 ? () => openJob(jobQuery({ job: target.key, count: target.short, slot: free.slot.slot })) : undefined,
      }))} />

      {stopped.map((row) => <StoppedQueueCard key={row.outfitId} outfitId={row.outfitId} />)}

      <JobSheet<RpgUmaRow>
        query={query}
        building={placeId}
        title={placeById(placeId)?.name ?? placeId}
        rows={rows}
        request={(job, count): RpgWorkRequest => ({ kind: jobKindAtV4(placeId, job), item: job, count })}
        initialJob={(outfitId) => initialJobV4(placeId, levelOf(outfitId))}
        sizeRule={sizeRuleOf(pickedKind)}
        sizePlacement="before-what"
        preserveCountOnJobChange
        disabled={(row) => lockedReason(row) ?? who.reason(row.id)}
        picker={{
          order: (left, right) => Number(who.first(right.id)) - Number(who.first(left.id)) || workOrder(left, right),
          renderBadges: (row) => row.uma ? {
            bottomRight: <span aria-label={`Craft Level ${row.workLevel}`} className="rounded-tl-sm bg-black/75 px-1 font-display text-[9px] font-bold leading-3.5">C{row.workLevel}</span>,
          } : undefined,
        }}
        renderWhat={(selection) => <WhatV4 selection={selection} placeId={placeId} world={world} onPick={(job) => {
          setPicked({ key: queryKey, kind: jobKindAtV4(placeId, job) })
          selection.onChange(job)
        }} />}
        onClose={closeJob}
        onDone={closeJob}
      />

      {finishing && finish && <FinishAllSheet placeId={placeId} world={world} cost={finish} onClose={() => setFinishing(false)} />}
    </div>
  )
}

/** "Finish 3 jobs for 14 Speed Tickets?", or "Needs 14 Speed Tickets" when the wallet falls short (PP25). */
function FinishAllSheet({ placeId, world, cost, onClose }: {
  placeId: string; world: TierWorld; cost: { jobs: number; tickets: number }; onClose: () => void
}) {
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const tickets = cost.tickets.toLocaleString('en-US')
  const short = world.wallet.timeTickets < cost.tickets
  const run = () => {
    setPending(true)
    finishAll(placeId).then(onClose, (err: unknown) => {
      setPending(false)
      setError(err instanceof SaveRuleError ? err.message : 'That didn’t work. Try again.')
    })
  }
  return (
    <BottomSheet title="Finish all" onClose={onClose}>
      <div className="space-y-3" data-finish-all>
        <p className="text-[14px] font-semibold">
          {short ? `Needs ${tickets} Speed Tickets` : `Finish ${cost.jobs} jobs for ${tickets} Speed Tickets?`}
        </p>
        <p className="text-[13px] text-ink-soft">You have {world.wallet.timeTickets.toLocaleString('en-US')}. Each queue starts at once.</p>
        {error && <p className="text-[13px] text-danger">{error}</p>}
        <div className="flex gap-2">
          <button type="button" disabled={short || pending} onClick={run}
            className="min-h-11 flex-1 rounded-sm bg-accent font-semibold text-accent-ink disabled:opacity-40">Yes</button>
          <button type="button" onClick={onClose} className="min-h-11 flex-1 rounded-sm bg-sunken font-semibold">Not now</button>
        </div>
      </div>
    </BottomSheet>
  )
}

/** The sizes a kind offers (FL10): ×1 … ×40 to process, 1–10 otherwise. */
function sizeRuleOf(kind: JobKind): { mode: 'count'; sizes?: readonly number[] } {
  const sizes = jobSizesV4(kind)
  return sizes ? { mode: 'count', sizes } : { mode: 'count' }
}

/** A place's quick look (PP §4.2): its line, its types or grades, the open shop and its four slots' rows. */
export function PlacePeekV3({ view, world, tier, placeId }: { view: MasterView; world: TierWorld; tier: number; placeId: string }) {
  const work = useWorkView()
  const navigate = useNavigate()
  const cards = work.cards(placeId)
  const facility = work.facility(placeId)
  const stopped = Object.values(work.settled.work).filter((row) => row.dropped?.slot.building === placeId)
  const shop = openShopLine(world, placeId, tradeOfWorld(world, view.roster))
  const page = `/${placeById(placeId)!.page}/${placeId}`
  return (
    <div className="space-y-2 p-4" data-place-peek-v3={placeId}>
      <p className="text-[12px] text-ink-soft">{statsLine(placeId, facility.slots, facility.speed)}</p>
      {shop && <p className="text-[12px] font-semibold text-accent">{shop}</p>}
      <PeekLineV4 placeId={placeId} />
      <ul className="space-y-1.5">
        {cards.map((card) => (
          <li key={card.slot.slot}>
            <PeekRow
              slot={card.slot}
              onStart={() => navigate(`${page}${jobQuery({ slot: card.slot.slot })}`, { state: { fromHub: true } })}
              onQueue={card.kind === 'held' ? (outfitId) => navigate(`${page}${jobQuery({ uma: outfitId, queue: true })}`, { state: { fromHub: true } }) : undefined}
              repeat
            />
          </li>
        ))}
      </ul>
      {stopped.map((row) => <StoppedQueueCard key={row.outfitId} outfitId={row.outfitId} />)}
    </div>
  )
}
