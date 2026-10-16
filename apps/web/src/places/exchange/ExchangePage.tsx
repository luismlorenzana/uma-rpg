// The Exchange (S4, design §11): Laurels from battles buy raw items of the continents you've reached, Time Tickets
// (30 minutes off any job, D74) and Sweep Tickets (replay a beaten regular stage at once, for a quarter of its first
// clear, D79). Marks banked past max ranks buy Manuals: EXP for one bar of one Uma (D102).
import {
  ACCESSORY_KINDS, ACCESSORY_LABEL, ARMOR_KINDS, ARMOR_LABEL, trackOf, ITEM_FAMILIES, MANUAL_EXP, MANUAL_PRICE, manualBlock, rawItemPrice, RPG_CLASSES, SaveRuleError,
  TIME_TICKET_PRICE, stockedGrades, SWEEP_TICKET_PRICE, WEAPON_TYPES, type RankRef, type RosterOutfit, type TierWorld,
} from '@rpg/domain'
import { useState } from 'react'
import { CLASS_LABEL, WEAPON_LABEL } from '../../battle/labels'
import { ItemIcon } from '../../items/ItemIcon'
import { AtlasSprite } from '../../master/art'
import type { MasterView } from '../../master/master'
import { buyItem, buyTicket, readManual, useWorld } from '../../save/game'
import { RankRow } from '../../ui/RankBars'
import { BottomSheet } from '../../ui/BottomSheet'
import { HelpButton } from '../../ui/HelpButton'
import { LaurelIcon } from '../../ui/icons'
import { MasterGate } from '../MasterGate'

export default function ExchangePage() {
  return <MasterGate>{(view) => <Exchange view={view} />}</MasterGate>
}

function Exchange({ view }: { view: MasterView }) {
  const world = useWorld()
  const [reading, setReading] = useState(false)
  const [buying, setBuying] = useState<{ kind: 'item'; id: string; price: number; name: string } | { kind: 'time' | 'sweep'; price: number; name: string } | null>(null)
  if (!world) return null
  const stocked = stockedGrades(world)
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between rounded-md bg-raised p-3">
        <span className="flex items-center gap-2 font-display text-xl font-bold text-laurel"><LaurelIcon size={24} /> {world.wallet.laurels}</span>
        <span className="text-right text-[12px] text-ink-soft">Time {world.wallet.timeTickets} · Sweep {world.wallet.sweepTickets}</span>
      </div>
      <section>
        <h3 className="text-micro mb-1.5">Tickets</h3>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setBuying({ kind: 'time', price: TIME_TICKET_PRICE, name: 'Time Ticket' })} className="rounded-md bg-raised p-3 text-left">
            <p className="font-semibold">Time Ticket</p>
            <p className="text-[12px] text-ink-soft">30 minutes off any job</p>
            <p className="mt-1 flex items-center gap-1 text-[13px] font-semibold text-laurel"><LaurelIcon size={16} /> {TIME_TICKET_PRICE}</p>
          </button>
          <button type="button" onClick={() => setBuying({ kind: 'sweep', price: SWEEP_TICKET_PRICE, name: 'Sweep Ticket' })} className="rounded-md bg-raised p-3 text-left">
            <p className="font-semibold">Sweep Ticket</p>
            <p className="text-[12px] text-ink-soft">Instant replay of a cleared stage</p>
            <p className="mt-1 flex items-center gap-1 text-[13px] font-semibold text-laurel"><LaurelIcon size={16} /> {SWEEP_TICKET_PRICE}</p>
          </button>
        </div>
      </section>
      <section>
        <h3 className="text-micro mb-1.5">Raw items</h3>
        {stocked.length === 0 ? (
          <p className="text-[13px] text-ink-soft">Nothing in stock yet: win a stage on a continent to stock its grades.</p>
        ) : (
          <>
            <p className="mb-2 text-[12px] text-ink-faint">Grades {stocked.join(', ')} in stock.</p>
            <div className="grid grid-cols-2 gap-1.5">
              {ITEM_FAMILIES.flatMap((f) => f.raw.filter((i) => stocked.includes(i.grade))).map((i) => (
                <button key={i.id} type="button" onClick={() => setBuying({ kind: 'item', id: i.id, price: rawItemPrice(i.grade), name: i.name })}
                  className="flex items-center gap-2 rounded-sm bg-raised p-2 text-left">
                  <ItemIcon id={i.id} size={32} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12px] font-semibold">{i.name}</span>
                    <span className="flex items-center gap-0.5 text-[11px] text-laurel"><LaurelIcon size={12} /> {rawItemPrice(i.grade)}{(world.items[i.id] ?? 0) > 0 && <span className="ml-1 text-ink-faint">· have {world.items[i.id]}</span>}</span>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </section>
      <section>
        <div className="-my-2 flex items-center justify-between">
          <h3 className="text-micro">Manuals</h3>
          <HelpButton title="Manuals">
            <p>Past a max rank, EXP banks at half rate as Marks: Gear Marks from Weapon and Armor Ranks, Class Marks from Class Ranks.</p>
            <p>A Manual costs {MANUAL_PRICE.toLocaleString('en-US')} Marks and gives {MANUAL_EXP.toLocaleString('en-US')} EXP to one bar of one Uma.</p>
          </HelpButton>
        </div>
        <button type="button" onClick={() => setReading(true)} className="mt-1 flex w-full items-center justify-between rounded-md bg-raised p-3 text-left">
          <span>
            <span className="block font-semibold">Read a Manual</span>
            <span className="block text-[12px] text-ink-soft">Gear Marks {world.wallet.gearMarks.toLocaleString('en-US')} · Class Marks {world.wallet.classMarks.toLocaleString('en-US')}</span>
          </span>
          <span className="text-ink-faint">›</span>
        </button>
      </section>
      {reading && <ManualSheet world={world} roster={view.roster} art={view.art} onClose={() => setReading(false)} />}
      {buying && <BuySheet laurels={world.wallet.laurels} {...buying} onClose={() => setBuying(null)}
        onBuy={(n) => (buying.kind === 'item' ? buyItem(buying.id, n, stocked) : buyTicket(buying.kind, n)).then(() => setBuying(null))} />}
    </div>
  )
}

/** Reads Manuals: pick an Uma, one of her bars, how many (D102). */
function ManualSheet({ world, roster, art, onClose }: { world: TierWorld; roster: readonly RosterOutfit[]; art: MasterView['art']; onClose: () => void }) {
  const [outfitId, setOutfitId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const owned = roster.filter((o) => world.umas[o.outfitId])
  const uma = outfitId ? world.umas[outfitId] : null
  const read = (ref: RankRef, n: number) => readManual(outfitId!, ref, n).then(() => setError(null), (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'Couldn’t read it.'))
  const bar = (ref: RankRef, label: string) => {
    const track = trackOf(uma!.ranks, ref)
    const marks = ref.kind === 'class' ? world.wallet.classMarks : world.wallet.gearMarks
    const most = Math.floor(marks / MANUAL_PRICE)
    return (
      <li key={`${ref.kind}:${ref.id}`} className="flex items-center gap-2 rounded-sm bg-raised p-2">
        <div className="min-w-0 flex-1"><RankRow label={label} kind={ref.kind} track={track} /></div>
        {[1, 5].map((n) => (
          <button key={n} type="button" disabled={!!manualBlock(world, outfitId!, ref, n) || n > most} onClick={() => void read(ref, n)}
            className="min-h-9 shrink-0 rounded-sm bg-accent/15 px-2 text-[12px] font-semibold text-accent disabled:opacity-35">×{n}</button>
        ))}
      </li>
    )
  }
  return (
    <BottomSheet title={uma ? 'Which bar?' : 'Read a Manual'} onClose={onClose}>
      {!uma ? (
        <ul className="space-y-1.5">
          {owned.length === 0 && <li className="text-[14px] text-ink-soft">No Umas yet</li>}
          {owned.map((o) => (
            <li key={o.outfitId}>
              <button type="button" onClick={() => setOutfitId(o.outfitId)} className="flex w-full items-center gap-3 rounded-sm bg-raised p-2 text-left">
                <AtlasSprite art={art} family="outfit-icons" frameKey={o.outfitId} size={36} />
                <span className="min-w-0 flex-1 truncate text-[14px] font-semibold">{o.name}</span>
                <span className="text-[12px] text-ink-faint">Lv {world.umas[o.outfitId]!.level}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="space-y-3">
          <p className="text-[12px] text-ink-soft">Gear Marks {world.wallet.gearMarks.toLocaleString('en-US')} · Class Marks {world.wallet.classMarks.toLocaleString('en-US')}</p>
          <section><h4 className="text-micro mb-1">Classes</h4><ul className="space-y-1">{RPG_CLASSES.map((c) => bar({ kind: 'class', id: c }, CLASS_LABEL[c]))}</ul></section>
          <section><h4 className="text-micro mb-1">Weapons</h4><ul className="space-y-1">{WEAPON_TYPES.map((w) => bar({ kind: 'weapon', id: w }, WEAPON_LABEL[w]))}</ul></section>
          <section><h4 className="text-micro mb-1">Armor</h4><ul className="space-y-1">{ARMOR_KINDS.map((k) => bar({ kind: 'armor', id: k }, ARMOR_LABEL[k]))}</ul></section>
          <section><h4 className="text-micro mb-1">Accessories</h4><ul className="space-y-1">{ACCESSORY_KINDS.map((k) => bar({ kind: 'accessory', id: k }, ACCESSORY_LABEL[k]))}</ul></section>
          <button type="button" onClick={() => setOutfitId(null)} className="text-[13px] text-ink-soft underline">Choose another Uma</button>
          {error && <p className="text-[13px] text-danger">{error}</p>}
        </div>
      )}
    </BottomSheet>
  )
}

function BuySheet({ name, price, laurels, onClose, onBuy, ...rest }: { name: string; price: number; laurels: number; onClose: () => void; onBuy: (n: number) => Promise<void>; kind: string; id?: string }) {
  const [n, setN] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const affordable = Math.max(0, Math.min(99, Math.floor(laurels / price)))
  return (
    <BottomSheet title={`Buy ${name}`} onClose={onClose} footer={
      <button type="button" disabled={affordable < n} onClick={() => onBuy(n).catch((err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'Couldn’t buy.'))}
        className="flex min-h-12 w-full items-center justify-center gap-1 rounded-sm bg-accent font-display font-bold text-accent-ink disabled:opacity-40">
        Buy {n} · <LaurelIcon size={16} /> {price * n}
      </button>
    }>
      <div className="flex items-center gap-3">
        {rest.kind === 'item' && rest.id && <ItemIcon id={rest.id} size={48} />}
        <p className="text-[14px] text-ink-soft">You have {laurels} Laurels: enough for {affordable}.</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {[1, 5, 10, 25].map((q) => (
          <button key={q} type="button" onClick={() => setN(q)} className={`min-h-10 min-w-12 rounded-sm px-3 font-semibold ${n === q ? 'bg-accent text-accent-ink' : 'bg-raised'}`}>×{q}</button>
        ))}
      </div>
      {error && <p className="mt-2 text-[13px] text-danger">{error}</p>}
    </BottomSheet>
  )
}
