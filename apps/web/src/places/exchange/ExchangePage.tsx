// The Exchange (S4, design §11): Laurels from battles buy raw items of the continents you've reached, Speed Tickets
// (30 minutes off any job, D74) and Sweep Tickets (replay a beaten regular stage at once, for a quarter of its first
// clear, D79). Marks banked past max ranks buy Manuals: EXP for one bar of one Uma (D102). Buying runs in the kit's
// rows and sheet (uma-platform P56, SD3); the Manuals stay this game's. From R2's switch (H80, PP17): raw materials by
// line and pair, priced × the tier, the rest locked with the win that stocks them; Class Manuals only.
import { ExchangeRows, type ExchangeRow } from '@luismlorenzana/uma-kit/places'
import { Tabs, UiMark } from '@luismlorenzana/uma-kit/ui'
import {
  ACCESSORY_KINDS, ACCESSORY_LABEL, ARMOR_KINDS, ARMOR_LABEL, trackOf, ITEM_FAMILIES, itemNameV1, MANUAL_EXP, MANUAL_PRICE, manualBlock, rawItemPrice, RPG_CLASSES, SaveRuleError,
  TIME_TICKET_PRICE, MATERIAL_LINES, rpgRework, stockedGrades, stockedTypes, SWEEP_TICKET_PRICE, WEAPON_TYPES, type MaterialLine, type RankRef,
  type TierWorld,
} from '@rpg/domain'
import { useState } from 'react'
import { CLASS_LABEL, WEAPON_LABEL } from '../../battle/labels'
import { ItemIcon } from '../../items/ItemIcon'
import { LINE_WORD } from '../../items/v3-words'
import { formatLevel } from '@luismlorenzana/uma-kit/roster'
import { albumRows, lockedReason } from '../../album/rows'
import { PickerStep } from '../../album/PickerStep'
import type { MasterView } from '../../master/master'
import { buyItem, buyTicket, readManual, useActiveTier, useAlbumScope, useWorld } from '../../save/game'
import { RankRow } from '../../ui/RankBars'
import { BottomSheet } from '../../ui/BottomSheet'
import { HelpButton } from '../../ui/HelpButton'
import { LaurelIcon, TicketIcon } from '../../ui/icons'
import { MasterGate } from '../MasterGate'
import { rawRowsV4 } from './exchange-rows'

export default function ExchangePage() {
  return <MasterGate>{(view) => <Exchange view={view} />}</MasterGate>
}

const LAUREL = <UiMark mark="currency/laurel" fallback={<LaurelIcon size={14} />} />
const laurels = (amount: number) => ({ mark: LAUREL, amount })

function Exchange({ view }: { view: MasterView }) {
  const world = useWorld()
  const tier = useActiveTier()
  const [reading, setReading] = useState(false)
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
          </HelpButton>
        </div>
        <button type="button" onClick={() => setReading(true)} className="mt-1 flex w-full items-center justify-between rounded-md bg-raised p-3 text-left">
          <span>
            <span className="block font-semibold">{economy ? 'Read a Class Manual' : 'Read a Manual'}</span>
            <span className="block text-[12px] text-ink-soft">{marksLine(world, economy)}</span>
          </span>
          <span className="text-ink-faint">›</span>
        </button>
      </section>
      {reading && <ManualSheet world={world} view={view} onClose={() => setReading(false)} />}
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

/** Reads Manuals: pick an Uma, one of her bars, how many (D102). */
function ManualSheet({ world, view, onClose }: { world: TierWorld; view: MasterView; onClose: () => void }) {
  const scope = useAlbumScope()
  const [outfitId, setOutfitId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const uma = outfitId ? world.umas[outfitId] : null
  const read = (ref: RankRef, n: number) => readManual(outfitId!, ref, n).then(() => setError(null), (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'Couldn’t read it.'))
  const bar = (ref: RankRef, label: string) => {
    const track = trackOf(uma!.ranks, ref)
    const marks = ref.kind === 'class' ? world.wallet.classMarks : world.wallet.gearMarks ?? 0
    const most = Math.floor(marks / MANUAL_PRICE)
    return (
      <li key={`${ref.kind}:${ref.id}`} className="flex items-center gap-2 rounded-sm bg-raised p-2">
        <div className="min-w-0 flex-1"><RankRow label={label} kind={ref.kind} track={track} /></div>
        {[1, 5].map((n) => (
          <button key={n} type="button" disabled={!!manualBlock(world, outfitId!, ref, n, scope.tier) || n > most} onClick={() => void read(ref, n)}
            className="min-h-9 shrink-0 rounded-sm bg-accent/15 px-2 text-[12px] font-semibold text-accent disabled:opacity-35">×{n}</button>
        ))}
      </li>
    )
  }
  const economy = rpgRework('economy')
  if (!uma) return <PickerStep title={economy ? 'Read a Class Manual' : 'Read a Manual'} rows={albumRows(view, world, [], undefined, scope)} disabled={lockedReason}
    describe={row => `${formatLevel(row.level)} · ${row.base.title ?? ''}`} onPick={setOutfitId} onClose={onClose} />
  return (
    <BottomSheet title="Which bar?" onClose={onClose}>
        <div className="space-y-3">
          <p className="text-[12px] text-ink-soft">{marksLine(world, economy)}</p>
          <section><h4 className="text-micro mb-1">Classes</h4><ul className="space-y-1">{RPG_CLASSES.map((c) => bar({ kind: 'class', id: c }, CLASS_LABEL[c]))}</ul></section>
          {!economy && <>
            <section><h4 className="text-micro mb-1">Weapons</h4><ul className="space-y-1">{WEAPON_TYPES.map((w) => bar({ kind: 'weapon', id: w }, WEAPON_LABEL[w]))}</ul></section>
            <section><h4 className="text-micro mb-1">Armor</h4><ul className="space-y-1">{ARMOR_KINDS.map((k) => bar({ kind: 'armor', id: k }, ARMOR_LABEL[k]))}</ul></section>
            <section><h4 className="text-micro mb-1">Accessories</h4><ul className="space-y-1">{ACCESSORY_KINDS.map((k) => bar({ kind: 'accessory', id: k }, ACCESSORY_LABEL[k]))}</ul></section>
          </>}
          <button type="button" onClick={() => setOutfitId(null)} className="text-[13px] text-ink-soft underline">Choose another Uma</button>
          {error && <p className="text-[13px] text-danger">{error}</p>}
        </div>
    </BottomSheet>
  )
}
