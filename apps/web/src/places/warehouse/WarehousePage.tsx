// The Warehouse (S4): every raw and refined item you own, family by family, on both sides.
import { EFFECT_LABEL, ITEM_FAMILIES, itemById, type ItemSide } from '@rpg/domain'
import { useState } from 'react'
import { ItemIcon } from '../../items/ItemIcon'
import { useWorld } from '../../save/game'
import { BottomSheet } from '../../ui/BottomSheet'

export default function WarehousePage() {
  const world = useWorld()
  const [side, setSide] = useState<ItemSide>('farming')
  const [open, setOpen] = useState<string | null>(null)
  if (!world) return null
  const total = Object.values(world.items).reduce((a, b) => a + b, 0)
  const item = open ? itemById(open) : null
  return (
    <div>
      <div className="sticky top-0 z-10 space-y-2 border-b border-hairline bg-page/95 p-3 backdrop-blur">
        <div className="grid grid-cols-2 rounded-sm bg-sunken p-1" role="tablist" aria-label="Side">
          {(['farming', 'gathering'] as const).map((s) => (
            <button key={s} type="button" role="tab" aria-selected={side === s} onClick={() => setSide(s)}
              className={`min-h-10 rounded-xs text-[13px] font-semibold ${side === s ? 'bg-raised text-ink shadow-2' : 'text-ink-faint'}`}>
              {s === 'farming' ? 'Ingredients' : 'Materials'}
            </button>
          ))}
        </div>
        <p className="text-[12px] text-ink-faint">{total} items in stock</p>
      </div>
      <div className="space-y-3 p-3">
        {ITEM_FAMILIES.filter((f) => f.side === side).map((f) => {
          const owned = [...f.raw, ...f.refined].filter((i) => (world.items[i.id] ?? 0) > 0)
          return (
            <section key={f.id} className="rounded-md bg-panel p-2.5">
              <h3 className="mb-1.5 flex items-baseline justify-between text-[13px] font-semibold">
                <span>{f.name}</span>
                <span className="text-[11px] font-normal text-ink-faint">{EFFECT_LABEL[f.effect]}</span>
              </h3>
              {owned.length === 0 ? (
                <p className="text-[12px] text-ink-faint">None yet</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {owned.map((i) => (
                    <button key={i.id} type="button" onClick={() => setOpen(i.id)} className="relative rounded-sm bg-raised p-1" aria-label={`${i.name}: ${world.items[i.id]}`}>
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
      {item && (
        <BottomSheet title={item.name} onClose={() => setOpen(null)}>
          <div className="flex items-center gap-3">
            <ItemIcon id={item.id} size={64} />
            <div className="text-[14px]">
              <p>Grade {item.grade} · {item.refined ? 'refined' : 'raw'} · {EFFECT_LABEL[item.effect]}</p>
              <p className="text-ink-soft">{world.items[item.id] ?? 0} in stock</p>
              <p className="text-ink-soft">{item.refined ? `Refined from ${itemById(item.pair)?.name}` : `Refines into ${itemById(item.pair)?.name}`}</p>
            </div>
          </div>
        </BottomSheet>
      )}
    </div>
  )
}
