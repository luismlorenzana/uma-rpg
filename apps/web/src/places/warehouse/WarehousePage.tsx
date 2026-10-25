// The Warehouse (S4–S7, D144, SD3): the kit's shelves (uma-platform P56) with this game's three: every material, Star
// Gem and unbound piece of gear you own, by grade; anything can be sold for a few Laurels (far below its Exchange price).
import { ShelfView, type Price, type ShelfItem } from '@luismlorenzana/uma-kit/places'
import { UiMark } from '@luismlorenzana/uma-kit/ui'
import { EFFECT_LABEL, gearStock, gemById, gemStock, ITEM_FAMILIES, itemById, SaveRuleError, sellPrice, type Shelf } from '@rpg/domain'
import { ItemIcon } from '../../items/ItemIcon'
import { outputView } from '../../items/outputs'
import { sell, useWorld } from '../../save/game'
import { LaurelIcon } from '../../ui/icons'

const SHELVES: readonly { key: Shelf; label: string }[] = [{ key: 'items', label: 'Materials' }, { key: 'gems', label: 'Star Gems' }, { key: 'gear', label: 'Gear' }]
/** The order materials show in: family by family, raw then refined, grade by grade. */
const MATERIAL_ORDER = ITEM_FAMILIES.flatMap((f) => [...f.raw, ...f.refined].map((i) => i.id))

interface Stock extends ShelfItem { shelf: Shelf; icon: string }

const LAUREL = <UiMark mark="currency/laurel" fallback={<LaurelIcon size={14} />} />

export default function WarehousePage() {
  const world = useWorld()
  if (!world) return null
  const stock = (shelf: Shelf, id: string, n: number): Stock => {
    const view = outputView(id)
    const item = shelf === 'items' ? itemById(id) : undefined
    return { id, shelf, name: view.name, icon: view.icon, grade: view.grade, count: n,
      // "Highest" keeps the top grade of each family's raw and refined lines, each gem line and each gear type.
      group: item ? `${item.family}-${item.refined ? 'refined' : 'raw'}` : id.replace(/-\d+$|-g\d+$/, '') }
  }
  const items: Stock[] = [
    ...MATERIAL_ORDER.filter((id) => (world.items[id] ?? 0) > 0).map((id) => stock('items', id, world.items[id]!)),
    ...Object.entries(gemStock(world)).filter(([, n]) => n > 0).map(([id, n]) => stock('gems', id, n)),
    ...Object.entries(gearStock(world)).filter(([, n]) => n > 0).map(([id, n]) => stock('gear', id, n)),
  ]
  const total = (shelf: Shelf) => items.filter((i) => i.shelf === shelf).reduce((a, i) => a + i.count, 0)
  const price = (i: Stock): Price | null => { const amount = sellPrice(i.shelf, i.id); return amount > 0 ? { mark: LAUREL, amount } : null }
  return (
    <ShelfView<Stock>
      shelves={SHELVES}
      items={items}
      renderItem={(i, size) => <ItemIcon id={i.icon} size={size} />}
      header={<p className="text-[12px] text-ink-faint">{total('items')} items · {total('gems')} Star Gems · {total('gear')} unbound gear</p>}
      details={(i) => <StockDetails item={i} />}
      price={price}
      onSell={(i, qty) => sell(i.shelf, i.id, qty).then(() => undefined, (err: unknown) => {
        throw new Error(err instanceof SaveRuleError ? err.message : 'Couldn’t sell.')
      })}
    />
  )
}

/** What a stock sheet says about its item: grade and kind, and what it refines from or into. */
function StockDetails({ item: { shelf, id } }: { item: Stock }) {
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
