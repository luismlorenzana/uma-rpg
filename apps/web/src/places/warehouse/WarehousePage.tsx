// The Warehouse (S4–S7): every item, dish and unbound piece of gear you own. Ingredients and materials filter by grade;
// anything can be sold for a few Laurels (far below its Exchange price).
import { dishById, EFFECT_LABEL, ITEM_FAMILIES, itemById, SaveRuleError, sellPrice, type ItemSide, type Shelf } from '@rpg/domain'
import { useState } from 'react'
import { ItemIcon } from '../../items/ItemIcon'
import { outputView } from '../../items/outputs'
import { sell, useWorld } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'
import { LaurelIcon } from '../../ui/icons'

type Tab = ItemSide | 'dishes' | 'gear'

export default function WarehousePage() {
  const world = useWorld()
  const [side, setSide] = useState<Tab>('farming')
  const [grade, setGrade] = useState<number | null>(null)
  const [open, setOpen] = useState<{ shelf: Shelf; id: string } | null>(null)
  if (!world) return null
  const total = Object.values(world.items).reduce((a, n) => a + n, 0)
  const list = (shelf: 'dishes' | 'gear') => {
    const stock = world[shelf]
    return (
      <ul className="space-y-1.5 p-3">
        {Object.keys(stock).length === 0 && (
          <li className="text-[13px] text-ink-faint">{shelf === 'gear' ? 'No gear yet' : 'No dishes yet'}</li>
        )}
        {Object.entries(stock).filter(([id]) => grade === null || outputView(id).grade === grade).map(([id, n]) => (
          <li key={id}>
            <button type="button" onClick={() => setOpen({ shelf, id })} className="flex w-full items-center gap-2 rounded-sm bg-panel p-2 text-left text-[13px]">
              <ItemIcon id={outputView(id).icon} size={32} />
              <span className="min-w-0 flex-1 truncate font-semibold">{outputView(id).name} · G{outputView(id).grade}</span>
              <span className="text-ink-soft">×{n}</span>
            </button>
          </li>
        ))}
      </ul>
    )
  }
  return (
    <div>
      <div className="sticky top-0 z-10 space-y-2 border-b border-hairline bg-page/95 p-3 backdrop-blur">
        <div className="grid grid-cols-5 rounded-sm bg-sunken p-1" role="tablist" aria-label="Shelf">
          {(['farming', 'gathering', 'dishes', 'gear'] as const).map((s) => (
            <button key={s} type="button" role="tab" aria-selected={side === s} onClick={() => setSide(s)} aria-label={s === 'farming' ? 'Farm items: ingredients' : s === 'gathering' ? 'Craft items: materials' : undefined}
              className={`min-h-10 rounded-xs text-[13px] font-semibold ${side === s ? 'bg-raised text-ink shadow-2' : 'text-ink-faint'}`}>
              {s === 'farming' ? 'Farm' : s === 'gathering' ? 'Craft' : s === 'dishes' ? 'Dishes' : 'Gear'}
            </button>
          ))}
        </div>
        <div className="-mx-3 flex gap-1 overflow-x-auto px-3" role="tablist" aria-label="Grade">
          {[null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((g) => (
            <button key={g ?? 'all'} type="button" role="tab" aria-selected={grade === g} onClick={() => setGrade(g)}
              className={`min-h-8 shrink-0 rounded-full px-2.5 text-[12px] font-semibold ${grade === g ? 'bg-accent text-accent-ink' : 'bg-raised text-ink-soft'}`}>
              {g === null ? 'All grades' : `G${g}`}
            </button>
          ))}
        </div>
        <p className="text-[12px] text-ink-faint">{total} items · {Object.values(world.dishes).reduce((a, b) => a + b, 0)} dishes · {Object.values(world.gear).reduce((a, b) => a + b, 0)} unbound gear</p>
      </div>
      {side === 'gear' && list('gear')}
      {side === 'dishes' && list('dishes')}
      {(side === 'farming' || side === 'gathering') && (
        <div className="space-y-3 p-3">
          {ITEM_FAMILIES.filter((f) => f.side === side).map((f) => {
            const owned = [...f.raw, ...f.refined].filter((i) => (world.items[i.id] ?? 0) > 0 && (grade === null || i.grade === grade))
            return (
              <section key={f.id} className="rounded-md bg-panel p-2.5">
                <h3 className="mb-1.5 flex items-baseline justify-between text-[13px] font-semibold">
                  <span>{f.name}</span>
                  <span className="text-[11px] font-normal text-ink-faint">{EFFECT_LABEL[f.effect]}</span>
                </h3>
                {owned.length === 0 ? (
                  <p className="text-[12px] text-ink-faint">None{grade ? ` at grade ${grade}` : ' yet'}</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {owned.map((i) => (
                      <button key={i.id} type="button" onClick={() => setOpen({ shelf: 'items', id: i.id })} className="relative rounded-sm bg-raised p-1" aria-label={`${i.name}: ${world.items[i.id]}`}>
                        <ItemIcon id={i.id} size={40} />
                        <span className="absolute bottom-0 right-0.5 font-display text-[11px] font-bold [text-shadow:0_1px_2px_#000]">{world.items[i.id]}</span>
                      </button>
                    ))}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      )}
      {open && <StockSheet shelf={open.shelf} id={open.id} have={world[open.shelf][open.id] ?? 0} onClose={() => setOpen(null)} />}
    </div>
  )
}

function StockSheet({ shelf, id, have, onClose }: { shelf: Shelf; id: string; have: number; onClose: () => void }) {
  const [error, setError] = useState<string | null>(null)
  const item = shelf === 'items' ? itemById(id) : null
  const dish = shelf === 'dishes' ? dishById(id) : null
  const view = outputView(id)
  const price = sellPrice(shelf, id)
  const sellN = (n: number) => sell(shelf, id, n).then(() => (n >= have ? onClose() : setError(null)), (err: unknown) => setError(err instanceof SaveRuleError ? err.message : 'Couldn’t sell.'))
  return (
    <BottomSheet title={view.name} onClose={onClose}>
      <div className="flex items-center gap-3">
        <ItemIcon id={view.icon} size={64} />
        <div className="text-[14px]">
          {item && <p>Grade {item.grade} · {item.refined ? 'refined' : 'raw'} · {EFFECT_LABEL[item.effect]}</p>}
          {dish && <p>Grade {dish.grade} dish · feeds {dish.effects.length === 8 ? 'all eight' : dish.effects.map((e) => EFFECT_LABEL[e]).join(' + ')}</p>}
          {shelf === 'gear' && <p>Grade {view.grade} gear · unbound</p>}
          <p className="text-ink-soft">{have} in stock</p>
          {item && <p className="text-ink-soft">{item.refined ? `Refined from ${itemById(item.pair)?.name}` : `Refines into ${itemById(item.pair)?.name}`}</p>}
        </div>
      </div>
      {have > 0 && price > 0 && (
        <div className="mt-4">
          <p className="mb-1.5 flex items-center gap-1 text-[12px] text-ink-soft">Sell for <LaurelIcon size={14} /> {price} each</p>
          <div className="grid grid-cols-3 gap-2">
            {[1, 10, have].filter((n, i, a) => n <= have && a.indexOf(n) === i).map((n) => (
              <button key={n} type="button" onClick={() => void sellN(n)} className="min-h-11 rounded-sm bg-raised text-[13px] font-semibold">
                {n === have && n > 1 ? `All ${n}` : `×${n}`} · {price * n}
              </button>
            ))}
          </div>
        </div>
      )}
      {error && <p className="mt-2 text-[13px] text-danger">{error}</p>}
    </BottomSheet>
  )
}
