// The Exchange (S4, design §11): Laurels from battles buy raw items of the continents you've reached, Speed Tickets
// (30 minutes off any job, D74) and Sweep Tickets (replay a beaten regular stage at once, for a quarter of its first
// clear, D79). Marks banked past max ranks buy Manuals: EXP for one bar of one Uma (D102). Buying runs in the kit's
// rows and sheet (uma-platform P56, SD3); the Manuals stay this game's. From R2's switch (H80, PP17): raw materials by
// line and pair, priced × the tier, the rest locked with the win that stocks them; Class Manuals only. The Class Manual
// sheet is a route (H132, shared with H120's door): `manual` opens it on the picker, `manual/:outfitId` on her bars; a tap
// selects a bar and a count, and the footer reads them with before → after (`manual-view.ts`). From v19 (H134): her held
// classes and the five Tier 0s, "To Rank 10", "Her share", and a Tier 0 at Rank 10 banking for her promotion.
import { ExchangeRows, type ExchangeRow } from '@luismlorenzana/uma-kit/places'
import { Tabs, UiMark } from '@luismlorenzana/uma-kit/ui'
import {
  ITEM_FAMILIES, itemNameV1, MANUAL_EXP, MANUAL_PRICE, rawItemPrice, SaveRuleError, TIME_TICKET_PRICE, MATERIAL_LINES, rpgRework, stockedGrades,
  stockedTypes, SWEEP_TICKET_PRICE, type BattleOutfit, type MaterialLine, type OwnedUma, type RpgClass, type TierWorld,
} from '@rpg/domain'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Bar } from '../../battle/labels'
import { ClassEmblem } from '../../battle/pixel-icons'
import { ItemIcon } from '../../items/ItemIcon'
import { LINE_WORD } from '../../items/v3-words'
import { formatLevel } from '@luismlorenzana/uma-kit/roster'
import { albumRows, lockedReason } from '../../album/rows'
import { PickerStep } from '../../album/PickerStep'
import type { MasterView } from '../../master/master'
import { buyItem, buyTicket, readManual, useActiveTier, useAlbumScope, useWorld } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { HelpButton } from '../../ui/HelpButton'
import { LaurelIcon, TicketIcon } from '../../ui/icons'
import { MasterGate } from '../MasterGate'
import type { PageProps } from '../registry'
import { rawRowsV4 } from './exchange-rows'
import { firstBar, firstCount, manualBars, manualCounts, manualFooter, manualHead, type CountKey } from './manual-view'

export default function ExchangePage({ place, rest }: PageProps) {
  return <MasterGate>{(view) => <Exchange view={view} base={`/${place.page}/${place.id}`} rest={rest} />}</MasterGate>
}

/** The Manual sheet's route under the Exchange (H132, H120's door): `manual` the picker, `manual/:outfitId` her bars. */
export function manualRoute(rest: string): { open: boolean; outfitId: string | null } {
  const [head, id] = rest.split('/').filter(Boolean)
  return head === 'manual' ? { open: true, outfitId: id ? decodeURIComponent(id) : null } : { open: false, outfitId: null }
}

const LAUREL = <UiMark mark="currency/laurel" fallback={<LaurelIcon size={14} />} />
const laurels = (amount: number) => ({ mark: LAUREL, amount })

function Exchange({ view, base, rest }: { view: MasterView; base: string; rest: string }) {
  const world = useWorld()
  const tier = useActiveTier()
  const navigate = useNavigate()
  const location = useLocation()
  // The sheet's steps replace the entry, keeping its navigation state: the place header's Back still returns to the door.
  const go = (to: string) => navigate(to, { replace: true, state: location.state })
  const manual = manualRoute(rest)
  if (!world) return null
  const economy = rpgRework('economy')
  const stocked = stockedGrades(world)
  const tickets: ExchangeRow[] = [
    { key: 'ticket:time', icon: <UiMark mark="currency/speed-ticket" scale={2} fallback={<TicketIcon size={22} />} />, name: 'Speed Ticket', detail: '30 minutes off any job', price: laurels(TIME_TICKET_PRICE) },
    { key: 'ticket:sweep', icon: <TicketIcon size={22} />, name: 'Sweep Ticket', detail: 'Instant replay of a cleared stage', price: laurels(SWEEP_TICKET_PRICE) },
  ]
  const raw: ExchangeRow[] = ITEM_FAMILIES.flatMap((f) => f.raw.filter((i) => stocked.includes(i.grade))).map((i) => ({
    key: `item:${i.id}`, icon: <ItemIcon id={i.id} size={32} />, name: itemNameV1(i.id)!, price: laurels(rawItemPrice(i.grade)),
    detail: (world.items[i.id] ?? 0) > 0 ? `have ${world.items[i.id]}` : undefined,
  }))
  const buy = (row: ExchangeRow, qty: number) => {
    const [kind, id] = row.key.split(':') as [string, string]
    const done = kind === 'item' ? buyItem(id, qty, economy ? stockedTypes(world, tier) : stocked) : buyTicket(id as 'time' | 'sweep', qty)
    return done.then(() => undefined, (err: unknown) => { throw new Error(err instanceof SaveRuleError ? err.message : 'Couldn’t buy.') })
  }
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between rounded-md bg-raised p-3">
        <span className="flex items-center gap-2 font-display text-xl font-bold text-laurel"><LaurelIcon size={24} /> {world.wallet.laurels}</span>
        <span className="text-right text-[12px] text-ink-soft">Speed {world.wallet.timeTickets} · Sweep {world.wallet.sweepTickets}</span>
      </div>
      <section>
        <h3 className="text-micro mb-1.5">Tickets</h3>
        <ExchangeRows rows={tickets} balance={world.wallet.laurels} onBuy={buy} />
      </section>
      {economy ? <RawMaterials world={world} tier={tier} buy={buy} /> : <section>
        <h3 className="text-micro mb-1.5">Raw items</h3>
        {stocked.length === 0 ? (
          <p className="text-[13px] text-ink-soft">Nothing in stock yet: win a stage on a continent to stock its grades.</p>
        ) : (
          <>
            <p className="mb-2 text-[12px] text-ink-faint">Grades {stocked.join(', ')} in stock.</p>
            <ExchangeRows rows={raw} balance={world.wallet.laurels} onBuy={buy} />
          </>
        )}
      </section>}
      <section>
        <div className="-my-2 flex items-center justify-between">
          <h3 className="text-micro">Manuals</h3>
          <HelpButton title="Manuals">
            <p>{economy ? 'Past a max Class Rank, EXP banks at half rate as Class Marks.'
              : 'Past a max rank, EXP banks at half rate as Marks: Gear Marks from Weapon and Armor Ranks, Class Marks from Class Ranks.'}</p>
            <p>A Manual costs {MANUAL_PRICE.toLocaleString('en-US')} Marks and gives {MANUAL_EXP.toLocaleString('en-US')} EXP to one bar of one Uma.</p>
            {rpgRework('classes') && <>
              <p>A Tier 0 reads to Rank 10; past it the EXP waits for her promotion.</p>
              <p>Her share: her Manuals from the classes’ reset.</p>
            </>}
          </HelpButton>
        </div>
        <button type="button" onClick={() => go(`${base}/manual`)} className="mt-1 flex w-full items-center justify-between rounded-md bg-raised p-3 text-left">
          <span>
            <span className="block font-semibold">{economy ? 'Read a Class Manual' : 'Read a Manual'}</span>
            <span className="block text-[12px] text-ink-soft">{marksLine(world, economy)}</span>
          </span>
          <span className="text-ink-faint">›</span>
        </button>
      </section>
      {manual.open && <ManualSheet world={world} view={view} outfitId={manual.outfitId} tier={tier}
        onPick={(id) => go(`${base}/manual/${encodeURIComponent(id)}`)} onAnother={() => go(`${base}/manual`)} onClose={() => go(base)} />}
    </div>
  )
}

/** The Marks a Manual spends: Class Marks only from R2 (its migration joins Gear Marks to them). */
const marksLine = (world: TierWorld, economy: boolean) => economy ? `Class Marks ${world.wallet.classMarks.toLocaleString('en-US')}`
  : `Gear Marks ${(world.wallet.gearMarks ?? 0).toLocaleString('en-US')} · Class Marks ${world.wallet.classMarks.toLocaleString('en-US')}`

const RAW_LINE_KEY = 'rpg.exchange.rawLine'
function storedRawLine(): MaterialLine {
  try {
    const v = sessionStorage.getItem(RAW_LINE_KEY)
    return (MATERIAL_LINES as readonly string[]).includes(v ?? '') ? (v as MaterialLine) : 'metal'
  } catch {
    return 'metal'
  }
}

/** The raw materials (FL12, FL23): one tab a line, its ten grades, locked until stocked. */
function RawMaterials({ world, tier, buy }: { world: TierWorld; tier: number; buy: (row: ExchangeRow, qty: number) => Promise<void> }) {
  const [line, setLineState] = useState<MaterialLine>(storedRawLine)
  const setLine = (v: MaterialLine) => {
    setLineState(v)
    try {
      sessionStorage.setItem(RAW_LINE_KEY, v)
    } catch {
      // this session's convenience only
    }
  }
  const rows = rawRowsV4(world, tier).find((g) => g.line === line)!.rows
  return (
    <section className="space-y-2" data-raw-v4>
      <h3 className="text-micro">Raw materials</h3>
      <Tabs<MaterialLine> label="Line" value={line} onChange={setLine} options={MATERIAL_LINES.map((l) => ({ value: l, label: LINE_WORD[l] }))} />
      <ExchangeRows balance={world.wallet.laurels} onBuy={buy} rows={rows.map((row): ExchangeRow => ({
        key: `item:${row.id}`, icon: <ItemIcon id={row.id} size={32} />, name: row.name, price: laurels(row.price),
        detail: `G${row.grade}${row.have > 0 ? ` · have ${row.have.toLocaleString('en-US')}` : ''}`,
        ...(row.locked ? { disabled: row.locked } : {}),
      }))} />
    </section>
  )
}

const SHEET_TITLE = 'Read a Class Manual'

/** Reads Class Manuals (D102; CV §14.3): the shared picker, or the Uma the route names; then her bars, a count, and the
 * footer's Read with before → after. The sheet stays open on the new state after a read (G5). */
function ManualSheet({ world, view, outfitId, tier, onPick, onAnother, onClose }: {
  world: TierWorld; view: MasterView; outfitId: string | null; tier: number
  onPick: (outfitId: string) => void; onAnother: () => void; onClose: () => void
}) {
  const scope = useAlbumScope()
  const uma = outfitId ? world.umas[outfitId] : undefined
  const outfit = outfitId ? view.roster.find((o) => o.outfitId === outfitId) : undefined
  if (!uma || !outfit) return <PickerStep title={SHEET_TITLE} rows={albumRows(view, world, [], undefined, scope)} disabled={lockedReason}
    describe={row => `${formatLevel(row.level)} · ${row.base.title ?? ''}`} onPick={onPick} onClose={onClose} />
  return <ManualReader key={outfit.outfitId} world={world} outfit={outfit} name={outfit.name} uma={uma} tier={tier} onAnother={onAnother} onClose={onClose} />
}

/** One Uma's bars: a tap selects a bar (Selected ring) and a count; the footer reads them. */
function ManualReader({ world, outfit, name, uma, tier, onAnother, onClose }: {
  world: TierWorld; outfit: BattleOutfit; name: string; uma: OwnedUma; tier: number; onAnother: () => void; onClose: () => void
}) {
  const id = outfit.outfitId
  const bars = manualBars(outfit, uma, tier)
  const [picked, setPicked] = useState<RpgClass | null>(() => firstBar(bars, outfit, uma, tier))
  const selected = bars.find((bar) => bar.ref.id === picked) ?? bars[0]
  const [countKey, setCountKey] = useState<CountKey>(() => (selected ? firstCount(manualCounts(world, id, selected.ref, tier)) : '1'))
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const head = manualHead(name, world, id)
  if (!selected) return null
  const counts = manualCounts(world, id, selected.ref, tier)
  const count = counts.find((c) => c.key === countKey) ?? counts[0]!
  const footer = manualFooter(world, id, selected.ref, count.count, tier)
  const read = () => {
    setBusy(true)
    readManual(id, selected.ref, count.count)
      .then(() => setError(null), (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'Couldn’t read it.'))
      .finally(() => setBusy(false))
  }
  return (
    <BottomSheet title={SHEET_TITLE} onClose={onClose} footer={
      <div className="space-y-1.5" data-manual-footer>
        {footer.step && <p className="text-center leading-tight" data-manual-step={footer.step.text}>
          <span className="block font-display text-[22px] font-extrabold">{footer.step.head}</span>
          {footer.step.tail.length > 0 && <span className="block text-[13px] font-semibold text-accent-strong">{footer.step.tail.join(' · ')}</span>}
        </p>}
        <button type="button" disabled={!!footer.block || busy} onClick={read} data-manual-read
          className="min-h-11 w-full rounded-sm bg-accent font-display font-bold text-accent-ink disabled:bg-sunken disabled:text-ink-soft">{footer.label}</button>
      </div>
    }>
      <div className="space-y-2.5" data-manual-sheet>
        <div className="flex items-start justify-between gap-2">
          <p className="min-w-0 text-[13px]">
            <span data-manual-head>{name} · <span className="whitespace-nowrap">{head.marks}</span></span>
            {head.share && <span className="block font-semibold text-accent-strong" data-manual-share>{head.share}</span>}
          </p>
          {/* 44 pt tall, drawn in the head's line height so the sheet fits one screen at 375×667 (B3). */}
          <button type="button" onClick={onAnother} className="-my-3 min-h-11 shrink-0 text-[13px] text-ink-soft underline">Choose another Uma</button>
        </div>
        <ul className="space-y-1" aria-label="Classes">
          {bars.map((bar) => {
            const on = bar.ref.id === selected.ref.id
            return (
              <li key={bar.ref.id}>
                <button type="button" aria-pressed={on} onClick={() => setPicked(bar.ref.id)} data-manual-bar={bar.ref.id}
                  className={`flex min-h-11 w-full items-center gap-2 rounded-sm bg-raised px-2 py-1 text-left ${on ? 'ring-2 ring-accent' : ''}`}>
                  <ClassEmblem classId={bar.ref.id} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[14px] font-semibold">{bar.name}</span>
                      <span className="shrink-0 text-[12px] tabular-nums text-ink-soft" data-manual-caption>{bar.caption}</span>
                    </span>
                    <Bar className="mt-1 h-1" value={bar.fill.value} max={bar.fill.max} tone="exp" />
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="How many">
          {counts.map((c) => (
            <button key={c.key} type="button" aria-pressed={c.key === count.key} disabled={!!c.block} title={c.block ?? undefined}
              onClick={() => setCountKey(c.key)} data-manual-count={c.key}
              className={`min-h-11 min-w-11 rounded-full bg-raised px-3 text-[13px] font-semibold tabular-nums disabled:opacity-40 ${c.key === count.key ? 'ring-2 ring-accent' : ''}`}>
              {c.label}
            </button>
          ))}
        </div>
        {error && <p className="text-[13px] text-danger">{error}</p>}
      </div>
    </BottomSheet>
  )
}
