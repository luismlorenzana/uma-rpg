// The Exchange (S4, design §11): Laurels from battles buy raw items of the continents you've reached, Time Tickets
// (30 minutes off any job or training, D74) and Sweep Tickets (clear a beaten regular stage at once, without Laurels). Tokens swap three
// for one of your choice, same kind and band (D67).
import { ITEM_FAMILIES, rawItemPrice, SaveRuleError, TIME_TICKET_PRICE, stockedGrades, SWEEP_TICKET_PRICE, TOKEN_SWAP_COST, TOKENS, tokenById, type ItemSide, type TokenKind } from '@rpg/domain'
import { useState } from 'react'
import { ItemIcon } from '../../items/ItemIcon'
import { buyItem, buyTicket, swap, useWorld } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { LaurelIcon } from '../../ui/icons'
import { MasterGate } from '../MasterGate'

export default function ExchangePage() {
  return <MasterGate>{(view) => <Exchange chapters={view.chapters.filter((c) => c.tier === 1).map((c) => ({ id: String(c.scenarioId), order: c.order, name: c.name }))} />}</MasterGate>
}

function Exchange({ chapters }: { chapters: { id: string; order: number; name: string }[] }) {
  const world = useWorld()
  const [side, setSide] = useState<ItemSide>('farming')
  const [swapping, setSwapping] = useState<{ kind: TokenKind; band: number } | null>(null)
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
            <p className="text-[12px] text-ink-soft">Clears a beaten regular fight: EXP, no Laurels</p>
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
      <TokenSwaps items={world.items} onOpen={setSwapping} />
      {swapping && <SwapSheet {...swapping} items={world.items} onClose={() => setSwapping(null)} />}
      {buying && <BuySheet laurels={world.wallet.laurels} {...buying} onClose={() => setBuying(null)}
        onBuy={(n) => (buying.kind === 'item' ? buyItem(buying.id, n, stocked) : buyTicket(buying.kind, n)).then(() => setBuying(null))} />}
    </div>
  )
}

const KIND_NAME: Record<TokenKind, string> = { class: 'Promotion', craft: 'Crafting', cook: 'Cooking' }

/** Groups of owned tokens with at least three of a kind and band. */
function TokenSwaps({ items, onOpen }: { items: Record<string, number>; onOpen: (g: { kind: TokenKind; band: number }) => void }) {
  const groups = new Map<string, { kind: TokenKind; band: number; n: number }>()
  for (const [id, n] of Object.entries(items)) {
    const t = tokenById(id)
    if (!t) continue
    const key = `${t.kind}:${t.band}`
    groups.set(key, { kind: t.kind, band: t.band, n: (groups.get(key)?.n ?? 0) + n })
  }
  const ready = [...groups.values()].filter((g) => g.n >= TOKEN_SWAP_COST).sort((a, b) => a.band - b.band || a.kind.localeCompare(b.kind))
  return (
    <section>
      <h3 className="text-micro mb-1.5">Token swaps</h3>
      {ready.length === 0 ? (
        <p className="text-[13px] text-ink-soft">Hold {TOKEN_SWAP_COST} tokens of one kind and band (say, three band-1 Cooking Tokens) to swap them for the one you want.</p>
      ) : (
        <div className="grid grid-cols-2 gap-1.5">
          {ready.map((g) => (
            <button key={`${g.kind}:${g.band}`} type="button" onClick={() => onOpen(g)} className="rounded-sm bg-raised p-2 text-left text-[13px]">
              <span className="block font-semibold">{KIND_NAME[g.kind]} · band {g.band}</span>
              <span className="text-[12px] text-ink-soft">{g.n} held · {TOKEN_SWAP_COST} for 1</span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

/** Pick the token you want; the three you give are your most plentiful others of that kind and band. */
function SwapSheet({ kind, band, items, onClose }: { kind: TokenKind; band: number; items: Record<string, number>; onClose: () => void }) {
  const [wanted, setWanted] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const choices = TOKENS.filter((t) => t.kind === kind && t.band === band)
  const offered: Record<string, number> = {}
  if (wanted) {
    let left = TOKEN_SWAP_COST
    for (const t of choices.filter((c) => c.id !== wanted).sort((a, b) => (items[b.id] ?? 0) - (items[a.id] ?? 0))) {
      const take = Math.min(left, items[t.id] ?? 0)
      if (take > 0) offered[t.id] = take
      left -= take
    }
  }
  const enough = Object.values(offered).reduce((a, b) => a + b, 0) === TOKEN_SWAP_COST
  return (
    <BottomSheet title={`Swap ${KIND_NAME[kind]} Tokens · band ${band}`} onClose={onClose} footer={
      <button type="button" disabled={!wanted || !enough} onClick={() => swap(offered, wanted!).then(onClose, (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'Couldn’t swap.'))}
        className="min-h-12 w-full rounded-sm bg-accent font-display font-bold text-accent-ink disabled:opacity-40">
        {!wanted ? 'Pick the one you want' : enough ? `Swap ${TOKEN_SWAP_COST} for 1` : `Needs ${TOKEN_SWAP_COST} others`}
      </button>
    }>
      <div className="grid grid-cols-2 gap-1.5">
        {choices.map((t) => (
          <button key={t.id} type="button" onClick={() => setWanted(t.id)}
            className={`flex items-center gap-2 rounded-sm p-2 text-left text-[12px] ${wanted === t.id ? 'bg-accent/25 ring-1 ring-accent' : 'bg-raised'}`}>
            <ItemIcon id={t.id} size={28} />
            <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{t.name}</span><span className="text-ink-faint">have {items[t.id] ?? 0}</span></span>
          </button>
        ))}
      </div>
      {wanted && enough && <p className="mt-3 text-[12px] text-ink-soft">You give {Object.entries(offered).map(([id, n]) => `${n}× ${tokenById(id)!.name}`).join(', ')}.</p>}
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
