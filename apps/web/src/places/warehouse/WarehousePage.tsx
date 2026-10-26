// The Warehouse (S4–S7, D144, SD3): the kit's shelves (uma-platform P56) with this game's: every material, Star Gem and
// unbound piece of gear you own, by grade; from R2's switch (H80) its materials and made items, each row with its tier
// and band or its grade and use. Anything can be sold for a few Laurels (far below its Exchange price).
import { ShelfView, type Price } from '@luismlorenzana/uma-kit/places'
import { UiMark } from '@luismlorenzana/uma-kit/ui'
import { EFFECT_LABEL, gemById, itemById, rpgRework, SaveRuleError, sellPrice } from '@rpg/domain'
import { ItemIcon } from '../../items/ItemIcon'
import { outputView } from '../../items/outputs'
import { materialPair } from '../../items/v3-words'
import { sell, useActiveTier, useWorld } from '../../save/game'
import { LaurelIcon } from '../../ui/icons'
import { warehouseView, type Stock } from './warehouse-shelves'

const LAUREL = <UiMark mark="currency/laurel" fallback={<LaurelIcon size={14} />} />

export default function WarehousePage() {
  const world = useWorld()
  const tier = useActiveTier()
  if (!world) return null
  const economy = rpgRework('economy')
  const { shelves, items, header } = warehouseView(world, economy)
  const price = (i: Stock): Price | null => { const amount = sellPrice(i.sell, i.id, tier); return amount > 0 ? { mark: LAUREL, amount } : null }
  return (
    <ShelfView<Stock>
      shelves={shelves}
      items={items}
      layout={economy ? 'rows' : 'grid'}
      rowDetail={(i) => i.line && <span className="block truncate text-[12px] text-ink-soft">{i.line}</span>}
      renderItem={(i, size) => <ItemIcon id={i.icon} size={size} />}
      header={<p className="text-[12px] text-ink-faint">{header}</p>}
      details={(i) => (economy ? <StockDetailsV3 item={i} /> : <StockDetails item={i} />)}
      price={price}
      onSell={(i, qty) => sell(i.sell, i.id, qty).then(() => undefined, (err: unknown) => {
        throw new Error(err instanceof SaveRuleError ? err.message : 'Couldn’t sell.')
      })}
    />
  )
}

/** What a stock sheet says about its item: grade and kind, and what it refines from or into. */
function StockDetails({ item: { sell: shelf, id } }: { item: Stock }) {
  const item = shelf === 'items' ? itemById(id) : null
  const gem = shelf === 'gems' ? gemById(id) : null
  return (
    <div className="text-[14px]">
      {item && <p>Grade {item.grade} · {item.refined ? 'refined' : 'raw'} · {EFFECT_LABEL[item.effect]}</p>}
      {item && <p className="text-ink-soft">{item.refined ? `Refined from ${itemById(item.pair)?.name}` : `Refines into ${itemById(item.pair)?.name}`}</p>}
      {gem && <p>Grade {gem.grade} Star Gem · feeds {gem.kind === 'sun' ? 'all eight' : gem.effects.map((e) => EFFECT_LABEL[e]).join(' + ')}</p>}
      {shelf === 'gear' && <p>Grade {outputView(id).grade} gear · unbound</p>}
    </div>
  )
}

/** R2's sheet lines: "Tier 1 · high · raw · Refines into Iron Ingot", "Grade 5 · Raises a weapon one grade", "Opens
 * Planet III". */
function StockDetailsV3({ item }: { item: Stock }) {
  const pair = materialPair(item.id)
  return <p className="text-[14px]">{item.line}{pair ? ` · ${pair}` : ''}</p>
}
