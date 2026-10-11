// The Exchange (S4, design §11): Laurels from battles buy raw items of the continents you've reached, Time Tickets
// (30 minutes off any job or training, D74), Sweep Tickets (replay a beaten regular stage at once, for a quarter of its
// first clear, D79) and any token; tokens sell back for half what they cost, so two buy one of another kind (D80).
import {
  ITEM_FAMILIES, rawItemPrice, SaveRuleError, TIME_TICKET_PRICE, stockedGrades, SWEEP_TICKET_PRICE, TOKEN_BANDS, TOKEN_LAURELS_PER_BAND, TOKENS, tokenBuyPrice,
  tokenById, tokenSellPrice, type ItemSide, type TokenKind,
} from '@rpg/domain'
import { useState } from 'react'
import { ItemIcon } from '../../items/ItemIcon'
import { buyItem, buyTicket, buyToken, sell, useWorld } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { LaurelIcon } from '../../ui/icons'
import { MasterGate } from '../MasterGate'

export default function ExchangePage() {
  return <MasterGate>{(view) => <Exchange chapters={view.chapters.filter((c) => c.tier === 1).map((c) => ({ id: String(c.scenarioId), order: c.order, name: c.name }))} />}</MasterGate>
}

function Exchange({ chapters }: { chapters: { id: string; order: number; name: string }[] }) {
  const world = useWorld()
  const [side, setSide] = useState<ItemSide>('farming')
  const [trading, setTrading] = useState<string | null>(null)
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
            <p className="text-[12px] text-ink-soft">30 minutes off any job or training</p>
            <p className="mt-1 flex items-center gap-1 text-[13px] font-semibold text-laurel"><LaurelIcon size={16} /> {TIME_TICKET_PRICE}</p>
          </button>
          <button type="button" onClick={() => setBuying({ kind: 'sweep', price: SWEEP_TICKET_PRICE, name: 'Sweep Ticket' })} className="rounded-md bg-raised p-3 text-left">
            <p className="font-semibold">Sweep Ticket</p>
            <p className="text-[12px] text-ink-soft">Replays a beaten regular stage: a quarter of its first clear</p>
            <p className="mt-1 flex items-center gap-1 text-[13px] font-semibold text-laurel"><LaurelIcon size={16} /> {SWEEP_TICKET_PRICE}</p>
          </button>
        </div>
      </section>
      <section>
        <h3 className="text-micro mb-1.5">Raw items</h3>
        {stocked.length === 0 ? (
          <p className="text-[13px] text-ink-soft">Win a stage on a continent to stock its grades: {chapters.map((c) => `${c.name} ${2 * c.order - 1}–${2 * c.order}`).join(', ')}.</p>
        ) : (
          <>
            <div className="mb-2 grid grid-cols-2 rounded-sm bg-sunken p-1" role="tablist" aria-label="Side">
              {(['farming', 'gathering'] as const).map((s) => (
                <button key={s} type="button" role="tab" aria-selected={side === s} onClick={() => setSide(s)}
                  className={`min-h-10 rounded-xs text-[13px] font-semibold ${side === s ? 'bg-raised text-ink shadow-2' : 'text-ink-faint'}`}>{s === 'farming' ? 'Ingredients' : 'Materials'}</button>
              ))}
            </div>
            <p className="mb-2 text-[12px] text-ink-faint">Grades {stocked.join(', ')} in stock.</p>
            <div className="grid grid-cols-2 gap-1.5">
              {ITEM_FAMILIES.filter((f) => f.side === side).flatMap((f) => f.raw.filter((i) => stocked.includes(i.grade))).map((i) => (
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
      <TokenTrade items={world.items} onOpen={setTrading} />
      {trading && <TokenSheet id={trading} have={world.items[trading] ?? 0} laurels={world.wallet.laurels} onClose={() => setTrading(null)} />}
      {buying && <BuySheet laurels={world.wallet.laurels} {...buying} onClose={() => setBuying(null)}
        onBuy={(n) => (buying.kind === 'item' ? buyItem(buying.id, n, stocked) : buyTicket(buying.kind, n)).then(() => setBuying(null))} />}
    </div>
  )
}

const KIND_NAME: Record<TokenKind, string> = { class: 'Promotion', mastery: 'Mastery', cook: 'Cooking' }

const KINDS: readonly TokenKind[] = ['class', 'mastery', 'cook']
/** "Brawler", "ATK", "Level 4–5": the token's class, stat or levels, under its kind's heading. */
const shortName = (name: string) => name.startsWith('Mastery Token') ? name.replace(/^Mastery Token \(to (.*)\)$/, '$1') : name.replace(/ (Promotion|Cooking) Token.*$/, '')

/** Every token by band (D80): tap one to sell yours or buy more. */
function TokenTrade({ items, onOpen }: { items: Record<string, number>; onOpen: (id: string) => void }) {
  const [band, setBand] = useState(1)
  return (
    <section>
      <h3 className="text-micro mb-1.5">Tokens</h3>
      <p className="mb-2 text-[12px] text-ink-soft">Sell any token for {TOKEN_LAURELS_PER_BAND} Laurels × its band and buy any for twice that, so two tokens buy one of another kind.</p>
      <div className="mb-2 grid grid-cols-5 rounded-sm bg-sunken p-1" role="tablist" aria-label="Band">
        {Array.from({ length: TOKEN_BANDS }, (_, i) => i + 1).map((b) => (
          <button key={b} type="button" role="tab" aria-selected={band === b} onClick={() => setBand(b)}
            className={`min-h-10 rounded-xs text-[12.5px] font-semibold ${band === b ? 'bg-raised text-ink shadow-2' : 'text-ink-faint'}`}>Band {b}</button>
        ))}
      </div>
      <p className="mb-2 flex items-center gap-1 text-[12px] text-ink-faint">
        Lv{10 * band - 9}–{10 * band} fights drop these · sell <LaurelIcon size={12} /> {TOKEN_LAURELS_PER_BAND * band} · buy <LaurelIcon size={12} /> {2 * TOKEN_LAURELS_PER_BAND * band}
      </p>
      {KINDS.map((kind) => {
        const list = TOKENS.filter((t) => t.band === band && t.kind === kind)
        if (list.length === 0) return null
        return (
          <div key={kind} className="mb-2">
            <h4 className="mb-1 text-[12px] font-semibold text-ink-soft">{KIND_NAME[kind]}</h4>
            <div className="grid grid-cols-2 gap-1.5">
              {list.map((t) => (
                <button key={t.id} type="button" onClick={() => onOpen(t.id)} className="flex items-center gap-2 rounded-sm bg-raised p-2 text-left">
                  <ItemIcon id={t.id} size={28} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12px] font-semibold">{shortName(t.name)}</span>
                    <span className={`text-[11px] ${(items[t.id] ?? 0) > 0 ? 'text-ink-soft' : 'text-ink-faint'}`}>have {items[t.id] ?? 0}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}

function TokenSheet({ id, have, laurels, onClose }: { id: string; have: number; laurels: number; onClose: () => void }) {
  const [error, setError] = useState<string | null>(null)
  const token = tokenById(id)
  if (!token) return null
  const sellEach = tokenSellPrice(id)
  const buyEach = tokenBuyPrice(id)
  const affordable = Math.min(99, Math.floor(laurels / buyEach))
  const run = (op: Promise<void>) => void op.then(() => setError(null), (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'That didn’t work.'))
  return (
    <BottomSheet title={token.name} onClose={onClose}>
      <div className="flex items-center gap-3">
        <ItemIcon id={id} size={48} />
        <p className="flex items-center gap-1 text-[14px] text-ink-soft">{have} held · <LaurelIcon size={14} /> {laurels}</p>
      </div>
      <p className="mb-1.5 mt-4 flex items-center gap-1 text-[12px] text-ink-soft">Sell for <LaurelIcon size={14} /> {sellEach} each</p>
      {have === 0 ? <p className="text-[12px] text-ink-faint">None to sell.</p> : (
        <div className="grid grid-cols-3 gap-2">
          {[1, 10, have].filter((n, i, a) => n <= have && a.indexOf(n) === i).map((n) => (
            <button key={n} type="button" onClick={() => run(sell('items', id, n))} className="min-h-11 rounded-sm bg-raised text-[13px] font-semibold">
              {n === have && n > 1 ? `All ${n}` : `×${n}`} · {sellEach * n}
            </button>
          ))}
        </div>
      )}
      <p className="mb-1.5 mt-4 flex items-center gap-1 text-[12px] text-ink-soft">Buy for <LaurelIcon size={14} /> {buyEach} each{affordable < 1 ? ': not enough Laurels' : ''}</p>
      <div className="grid grid-cols-3 gap-2">
        {[1, 5, 10].map((n) => (
          <button key={n} type="button" disabled={n > affordable} onClick={() => run(buyToken(id, n))} className="min-h-11 rounded-sm bg-accent/15 text-[13px] font-semibold text-accent disabled:opacity-40">
            ×{n} · {buyEach * n}
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-[13px] text-danger">{error}</p>}
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
