// The Warehouse (S4–S7, D144, SD3, H106): the kit's compact icon grid for every held material and made item, grouped for
// highest-grade filtering and sold for a few Laurels (far below its Exchange price).
import { ShelfView, type Price } from '@luismlorenzana/uma-kit/places'
import { UiMark } from '@luismlorenzana/uma-kit/ui'
import { SaveRuleError, sellPrice } from '@rpg/domain'
import { ItemIcon } from '../../items/ItemIcon'
import { materialPair } from '../../items/v3-words'
import { sell, useActiveTier, useWorld } from '../../save/game'
import { LaurelIcon } from '../../ui/icons'
import { warehouseView, type Stock } from './warehouse-shelves'

const LAUREL = <UiMark mark="currency/laurel" fallback={<LaurelIcon size={14} />} />

export default function WarehousePage() {
  const world = useWorld()
  const tier = useActiveTier()
  if (!world) return null
  const { shelves, items, header } = warehouseView(world)
  const price = (i: Stock): Price | null => { const amount = sellPrice(i.sell, i.id, tier); return amount > 0 ? { mark: LAUREL, amount } : null }
  return (
    <ShelfView<Stock>
      shelves={shelves}
      items={items}
      layout="grid"
      grades
      words={{ empty: 'Nothing here yet.' }}
      renderItem={(i, size) => <ItemIcon id={i.icon} size={size} />}
      header={<p className="text-[12px] text-ink-faint">{header}</p>}
      details={(i) => <StockDetails item={i} />}
      price={price}
      onSell={(i, qty) => sell(i.sell, i.id, qty).then(() => undefined, (err: unknown) => {
        throw new Error(err instanceof SaveRuleError ? err.message : 'Couldn’t sell.')
      })}
    />
  )
}

/** Sheet lines: "Tier 1 · high · raw · Refines into Iron Ingot", "Grade 5 · Raises a weapon one grade", "Opens
 * Planet III". */
function StockDetails({ item }: { item: Stock }) {
  const pair = materialPair(item.id)
  return <p className="text-[14px]">{item.line}{pair ? ` · ${pair}` : ''}</p>
}
