// R2's place pages (profession-progression.md §4.3–§4.4, PP4, PP9, PP13, PP16, PP25; H80): the same shared work page as
// the facilities (`FacilityPage`'s provider, slot rows, job sheet and stopped queues), with a place's own header (its
// profession, four slots, ×1.25, no Upgrade, the open shop, "Finish all"), What steps by the world's tier, recipe cards
// from `madeRecipe`, and her trade first in the picker. Rendered only from the economy stage, on a v3 place. Under the
// farm by line (H111) its What step, sizes, (i) and quick look are `PlaceV4.tsx`'s.
import {
  activeClass, facilityTargets, farmByLine, finishAllCost, madeName, madeRecipe, openShop, placeById, placeSpecV3, placeSpecV4, PROFESSION_NAMES_V4,
  professionById, REFINE_BATCHES, SaveRuleError, stockName, targetPlan, TRADES, tradeProfessions, type JobKind, type MadeLine, type MaterialTier,
  type RpgWorkRequest, type TierWorld, type TradeOf,
} from '@rpg/domain'
import { workOrder } from '@luismlorenzana/uma-kit/roster'
import {
  JobSheet, jobQuery, PeekRow, readJobQuery, SlotRow, StoppedQueueCard, TargetsStrip, withoutJobQuery, useWorkView, type JobSelection,
} from '@luismlorenzana/uma-kit/work'
import { useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import { albumRows, lockedReason, type RpgUmaRow } from '../../album/rows'
import { ItemIcon } from '../../items/ItemIcon'
import { LINE_WORD, madeUse, materialFacts, materialPair } from '../../items/v3-words'
import type { MasterView } from '../../master/master'
import { collectEverything, finishAll, useAlbumScope } from '../../save/game'
import { TRADE_CLASS_WORDS, tradeOfWorld } from '../../save/trade'
import { BottomSheet } from '../../ui/BottomSheet'
import { HelpButton } from '../../ui/HelpButton'
import {
  gatherRows, gradeChips, jewelRows, peekTypes, whoAt, workbenchRows, type GradeChip, type TypeTile,
} from './place-view'
import { helpLinesV4, initialJobV4, jobKindAtV4, jobSizesV4 } from './place-view-v4'
import { PeekLineV4, WhatV4 } from './PlaceV4'

/** Tier 2's amber and Tier 3's violet: H36's dusk and night accents, fixed in every world so a chip says its material. */
export const TIER_TINT: Readonly<Record<MaterialTier, string | null>> = { 1: null, 2: '#e08a3c', 3: '#9d86e8' }

/** "Open shop: no Brawler in this world", or null when the place's trade has an Uma here. */
function openShopLine(world: TierWorld, placeId: string, tradeOf: TradeOf): string | null {
  if (!openShop(world, placeId, tradeOf)) return null
  const profession = placeSpecV3(placeId)!.profession
  const trade = TRADES.find((t) => tradeProfessions(t.id).includes(profession))!
  return `Open shop: no ${TRADE_CLASS_WORDS[trade.id]} in this world`
}

/** The header's line: "Mine · Mining · 4 slots · ×1.25". */
const statsLine = (placeId: string, slots: number, speed: number) => {
  const profession = placeSpecV3(placeId)!.profession
  const name = farmByLine() ? PROFESSION_NAMES_V4[profession] : professionById(profession)!.name
  return `${placeById(placeId)?.name ?? placeId} · ${name} · ${slots} slots · ×${speed}`
}

function helpLines(placeId: string): string[] {
  if (farmByLine()) return helpLinesV4(placeId)
  const spec = placeSpecV3(placeId)!
  const lines = ['Her trade’s Umas work here. In a world with none of them, anyone may: the open shop.']
  if (spec.kind === 'gather') return [`Gathers ${LINE_WORD[spec.line!].toLowerCase()}: each tier’s low type from Craft Lv 1, its high type from Craft Lv 26.`, ...lines]
  if (spec.kind === 'refine') return ['Processes a raw material into its refined form, one for one, in a quarter of a gather’s time.', ...lines]
  return ['Makes from refined materials. Grade g opens at Craft Lv 5g − 4; a chip’s colour is its material’s tier.', ...lines]
}

export function PlaceBodyV3({ view, world, now, tier, placeId }: { view: MasterView; world: TierWorld; now: string; tier: number; placeId: string }) {
  const work = useWorkView()
  const cards = work.cards(placeId)
  const spec = placeSpecV3(placeId)!
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
  // The farm by line (FL22): a making place processes and makes, so the sheet's sizes follow the picked job's kind. The
  // sheet opens on a make (or a gather), or on a deep link's own job.
  const farm = farmByLine()
  const queryKey = JSON.stringify(query)
  const [picked, setPicked] = useState<{ key: string; kind: JobKind } | null>(null)
  const pickedKind: JobKind = picked?.key === queryKey ? picked.kind
    : query?.job ? jobKindAtV4(placeId, query.job) : placeSpecV4(placeId)?.kinds.at(-1) ?? spec.kind
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
          <HelpButton title={placeById(placeId)?.name ?? placeId}>{helpLines(placeId).map((line) => <p key={line}>{line}</p>)}</HelpButton>
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
        request={(job, count): RpgWorkRequest => ({ kind: farm ? jobKindAtV4(placeId, job) : spec.kind, item: job, count })}
        initialJob={(outfitId) => (farm ? initialJobV4(placeId, levelOf(outfitId)) : initialJobV3(placeId))}
        sizeRule={farm ? sizeRuleOf(pickedKind) : spec.kind === 'refine' ? { mode: 'count', sizes: REFINE_BATCHES } : { mode: 'count' }}
        sizePlacement="before-what"
        preserveCountOnJobChange
        disabled={(row) => lockedReason(row) ?? who.reason(row.id)}
        picker={{
          order: (left, right) => Number(who.first(right.id)) - Number(who.first(left.id)) || workOrder(left, right),
          renderBadges: (row) => row.uma ? {
            bottomRight: <span aria-label={`Craft Level ${row.workLevel}`} className="rounded-tl-sm bg-black/75 px-1 font-display text-[9px] font-bold leading-3.5">C{row.workLevel}</span>,
          } : undefined,
        }}
        renderWhat={(selection) => farm
          ? <WhatV4 selection={selection} placeId={placeId} world={world} onPick={(job) => {
            setPicked({ key: queryKey, kind: jobKindAtV4(placeId, job) })
            selection.onChange(job)
          }} />
          : <WhatV3 selection={selection} placeId={placeId} world={world} tier={tier} />}
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

function initialJobV3(placeId: string): string {
  const spec = placeSpecV3(placeId)!
  if (spec.kind === 'gather') return peekTypes(spec.line!, 1)[0]!
  if (spec.kind === 'refine') return workbenchRows(1, 1)[0]!.cells[0]!.id
  if (spec.kind === 'cut') return jewelRows(1, 1)[0]!.chips[0]!.id
  return gradeChips(spec.made[0] as GradeLine, 1, 1)[0]!.id
}

type GradeLine = Extract<MadeLine, 'weapon-gem' | 'armor-fittings' | 'accessory-setting'>

function WhatV3({ selection, placeId, world, tier }: {
  selection: JobSelection & { onChange: (job: string) => void }; placeId: string; world: TierWorld; tier: number
}) {
  const spec = placeSpecV3(placeId)!
  const level = selection.outfitId ? world.umas[selection.outfitId]?.craft.level ?? 1 : 1
  if (spec.kind === 'gather') {
    const rows = gatherRows(spec.line!, tier, level)
    return <TypeRows rows={rows.map((row) => ({ key: String(row.tier), label: `Tier ${row.tier}`, tiles: row.tiles }))} cols={2}
      job={selection.job} world={world} onPick={selection.onChange} />
  }
  if (spec.kind === 'refine') {
    const rows = workbenchRows(tier, level)
    return <TypeRows rows={rows.map((row) => ({ key: `${row.tier}-${row.band}`, label: `T${row.tier} ${row.band}`, tiles: row.cells }))} cols={5}
      job={selection.job} world={world} onPick={selection.onChange} header />
  }
  const groups = spec.kind === 'cut'
    ? jewelRows(tier, level).map((row) => ({ key: row.body, label: row.label, chips: row.chips }))
    : [{ key: spec.made[0]!, label: null, chips: gradeChips(spec.made[0] as GradeLine, tier, level) }]
  return <MadePicker groups={groups} job={selection.job} world={world} tier={tier} onPick={selection.onChange} />
}

/** Type tiles in labelled rows: a gathering place's tiers (two a row) or the Workbench's five lines. */
function TypeRows({ rows, cols, job, world, onPick, header }: {
  rows: { key: string; label: string; tiles: TypeTile[] }[]; cols: 2 | 5; job: string | null; world: TierWorld
  onPick: (id: string) => void; header?: boolean
}) {
  const all = rows.flatMap((row) => row.tiles)
  const picked = all.find((t) => t.id === job) ?? all[0]!
  const grid = cols === 5 ? 'grid-cols-[2.25rem_repeat(5,minmax(0,1fr))]' : 'grid-cols-[2.25rem_repeat(2,minmax(0,1fr))]'
  return (
    <div className="space-y-2.5">
      <div className="space-y-1" role="group" aria-label="Material">
        {header && (
          <div className={`grid ${grid} gap-1 text-center text-[9.5px] font-semibold text-ink-faint`} aria-hidden>
            <span />
            {rows[0]!.tiles.map((t) => <span key={t.line} className="truncate">{LINE_WORD[t.line]}</span>)}
          </div>
        )}
        {rows.map((row) => (
          <div key={row.key} className={`grid ${grid} items-center gap-1`}>
            <span className="text-[10.5px] font-semibold leading-3 text-ink-soft">{row.label}</span>
            {row.tiles.map((t) => (
              <button key={t.id} type="button" disabled={t.locked !== null} onClick={() => onPick(t.id)} aria-pressed={t.id === picked.id}
                aria-label={`${stockName(t.id)}, ${materialFacts(t.id)}${t.locked ? `, ${t.locked}` : ''}`} data-type-tile={t.id}
                className={`relative flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-sm border px-0.5 py-1 ${t.id === picked.id ? 'border-accent bg-accent-wash ring-1 ring-accent' : 'border-transparent bg-raised'} disabled:opacity-40`}>
                <ItemIcon id={t.id} size={cols === 5 ? 26 : 30} />
                {cols === 2 && <span className="line-clamp-1 text-[10px] font-semibold">{stockName(t.id)}</span>}
                {t.locked && <span className="text-[9px] leading-3 text-ink-faint">{t.locked}</span>}
              </button>
            ))}
          </div>
        ))}
      </div>
      <MaterialSummary world={world} id={picked.id} />
    </div>
  )
}

function MaterialSummary({ world, id }: { world: TierWorld; id: string }) {
  const pair = materialPair(id)
  return (
    <div className="rounded-sm bg-raised p-2.5" data-selected-item={id}>
      <p className="flex items-center gap-2 text-[14px] font-semibold">
        <ItemIcon id={id} size={32} />
        <span className="min-w-0 flex-1 truncate">{stockName(id)}</span>
        <span className="text-[12px] font-normal text-ink-faint">Have {world.items[id] ?? 0}</span>
      </p>
      <p className="mt-0.5 text-[12px] text-ink-soft">{materialFacts(id)}{pair ? ` · ${pair}` : ''}</p>
    </div>
  )
}

/** Grade chips coloured by their material's tier, and the chosen item's recipe card. */
function MadePicker({ groups, job, world, tier, onPick }: {
  groups: { key: string; label: string | null; chips: GradeChip[] }[]; job: string | null; world: TierWorld; tier: number; onPick: (id: string) => void
}) {
  const all = groups.flatMap((g) => g.chips)
  const picked = all.find((c) => c.id === job) ?? all[0]!
  const tiers = [...new Set(all.map((c) => c.tier))].filter((t) => TIER_TINT[t])
  return (
    <div className="space-y-2.5">
      {groups.map((group) => (
        <div key={group.key} className="flex items-center gap-1.5">
          {group.label && <span className="w-12 shrink-0 text-[11px] font-semibold text-ink-soft">{group.label}</span>}
          <div className={`grid flex-1 gap-0.5 ${group.chips.length === 10 ? 'grid-cols-10' : 'grid-cols-5'}`} role="group" aria-label={group.label ?? 'Grade'}>
            {group.chips.map((c) => <TierChip key={c.id} chip={c} on={c.id === picked.id} onPick={() => onPick(c.id)} />)}
          </div>
        </div>
      ))}
      {tiers.length > 0 && (
        <p className="flex flex-wrap gap-x-3 text-[11px] text-ink-faint">
          {tiers.map((t) => <span key={t} className="inline-flex items-center gap-1"><span className="size-2 rounded-full" style={{ background: TIER_TINT[t]! }} />Tier {t}’s materials</span>)}
        </p>
      )}
      <RecipeCard world={world} id={picked.id} tier={tier} locked={picked.locked} />
    </div>
  )
}

function TierChip({ chip, on, onPick }: { chip: GradeChip; on: boolean; onPick: () => void }) {
  const tint = TIER_TINT[chip.tier]
  return (
    <button type="button" disabled={chip.locked !== null} onClick={onPick} aria-pressed={on} data-grade-chip={chip.grade} data-material-tier={chip.tier}
      aria-label={`${madeName(chip.id)}${chip.tier > 1 ? `, Tier ${chip.tier} materials` : ''}${chip.locked ? `, ${chip.locked}` : ''}`}
      style={tint ? { boxShadow: `inset 0 -3px 0 ${tint}` } : undefined}
      className={`min-h-9 rounded-sm text-[12px] font-semibold ${on ? 'bg-accent text-accent-ink' : 'bg-raised text-ink-soft'} disabled:opacity-35`}>
      {chip.label}
    </button>
  )
}

function RecipeCard({ world, id, tier, locked }: { world: TierWorld; id: string; tier: number; locked: string | null }) {
  const recipe = Object.entries(madeRecipe(id, tier))
  return (
    <div className="rounded-sm bg-raised p-2.5" data-recipe={id}>
      <p className="flex items-center gap-2 text-[14px] font-semibold">
        <ItemIcon id={id} size={28} />
        <span className="min-w-0 flex-1 truncate">{madeName(id)}</span>
        <span className="text-[12px] font-normal text-ink-faint">Have {world.items[id] ?? 0}</span>
      </p>
      <p className="mt-0.5 text-[12px] text-ink-soft">{madeUse(id)}{locked ? ` · ${locked}` : ''}</p>
      <ul className="mt-1.5 flex flex-wrap gap-1.5 text-[12px]">
        {recipe.map(([input, count]) => (
          <li key={input} className="flex items-center gap-1 rounded-sm bg-panel px-2 py-1">
            <ItemIcon id={input} size={18} />{stockName(input)} ×{count} <span className="text-ink-faint">({world.items[input] ?? 0})</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** A place's quick look (PP §4.2): its line, its types or grades, the open shop and its four slots' rows. */
export function PlacePeekV3({ view, world, tier, placeId }: { view: MasterView; world: TierWorld; tier: number; placeId: string }) {
  const work = useWorkView()
  const navigate = useNavigate()
  const cards = work.cards(placeId)
  const spec = placeSpecV3(placeId)!
  const facility = work.facility(placeId)
  const stopped = Object.values(work.settled.work).filter((row) => row.dropped?.slot.building === placeId)
  const shop = openShopLine(world, placeId, tradeOfWorld(world, view.roster))
  const page = `/${placeById(placeId)!.page}/${placeId}`
  return (
    <div className="space-y-2 p-4" data-place-peek-v3={placeId}>
      <p className="text-[12px] text-ink-soft">{statsLine(placeId, facility.slots, facility.speed)}</p>
      {shop && <p className="text-[12px] font-semibold text-accent">{shop}</p>}
      {farmByLine() ? <PeekLineV4 placeId={placeId} /> : <PeekLine placeId={placeId} tier={tier} kind={spec.kind} />}
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

/** A gathering place's type icons (2 · 4 · 6 by tier), a making place's line G1–G10 by material tier, the Workbench's
 * reach. */
function PeekLine({ placeId, tier, kind }: { placeId: string; tier: number; kind: RpgWorkRequest['kind'] }) {
  const spec = placeSpecV3(placeId)!
  if (kind === 'gather') {
    return (
      <p className="flex flex-wrap items-center gap-1" aria-label={peekTypes(spec.line!, tier).map(stockName).join(', ')}>
        {peekTypes(spec.line!, tier).map((id) => <ItemIcon key={id} id={id} size={24} />)}
      </p>
    )
  }
  if (kind === 'refine') return <p className="text-[12px] text-ink-faint">Every material, ×1 to ×40</p>
  const chips = kind === 'cut' ? jewelRows(tier, 50).flatMap((row) => row.chips) : gradeChips(spec.made[0] as GradeLine, tier, 50)
  return (
    <div className="flex items-center gap-1.5">
      <ItemIcon id={chips[0]!.id} size={24} />
      <span className="flex flex-wrap gap-0.5" aria-label={kind === 'cut' ? 'Planet and Moon Jewels I–V' : `${madeName(chips[0]!.id)!.replace(/ G1$/, '')} G1–G10`}>
        {chips.map((c) => (
          <span key={c.id} aria-hidden className="min-w-5 rounded-xs bg-sunken px-0.5 text-center text-[10px] font-semibold leading-4"
            style={TIER_TINT[c.tier] ? { boxShadow: `inset 0 -2px 0 ${TIER_TINT[c.tier]}` } : undefined}>{c.label}</span>
        ))}
      </span>
    </div>
  )
}
