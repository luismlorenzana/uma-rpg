// The Warehouse's shelves as data (S4–S7, D144, SD3; H80, H106, profession-progression.md §4.4, §7.5): every held
// material and made-item stack as a compact icon-grid entry. Materials stay line-ordered and ungraded; made items
// carry their domain grades. Under the farm by line (H111) materials carry their grades too.
import type { ShelfItem } from '@luismlorenzana/uma-kit/places'
import { farmByLine, LINE_ITEMS, lineItem, MADE_IDENTITIES, MATERIAL_LINES, MATERIAL_TYPES, materialIdentity, stockName, type Shelf, type TierWorld } from '@rpg/domain'
import { LINE_WORD, madeFacts, materialFacts } from '../../items/v3-words'

/** A stack on a shelf: `sell` is the save's shelf it sells from, `icon` its art id, `line` its row's second line. */
export interface Stock extends ShelfItem { sell: Shelf; icon: string; line: string | null }

export interface WarehouseView { shelves: readonly { key: string; label: string }[]; items: Stock[]; header: string }

/** Materials: line by line, raw then refined, tier by tier, low before high until grades replace the bands. */
export const MATERIAL_ORDER: readonly string[] = MATERIAL_LINES.flatMap((line) => [false, true].flatMap((refined) =>
  MATERIAL_TYPES.filter((t) => t.line === line).map((t) => (refined ? t.refined : t.raw))))

/** Made items: the three grade lines G1–G10, the Branch Gem, then Planet and Moon Jewels I–V. */
const MADE_ORDER: readonly string[] = (['weapon-gem', 'branch-gem', 'armor-fittings', 'accessory-setting', 'jewel-planet', 'jewel-moon'] as const)
  .flatMap((line) => MADE_IDENTITIES.filter((m) => m.line === line).map((m) => m.id))

/** The farm by line's order (FL23): each line raw G1–G10 then refined G1–G10; made items Arms Gems, Tome Ink, the Branch
 * Gem, Armor Fittings, Accessory Settings, Planet and Moon Jewels. */
const LINE_ORDER: readonly string[] = LINE_ITEMS.map((m) => m.id)
const MADE_ORDER_V4: readonly string[] = (['weapon-gem', 'tome-ink', 'branch-gem', 'armor-fittings', 'accessory-setting', 'jewel-planet', 'jewel-moon'] as const)
  .flatMap((line) => MADE_IDENTITIES.filter((m) => m.line === line).map((m) => m.id))
const MADE_GRADE = new Map(MADE_IDENTITIES.map((m) => [m.id, m]))

const n = (count: number) => count.toLocaleString('en-US')

/** The Warehouse's seven icon-grid facets, including the duplicate entry every held stack has on All. */
export function warehouseView(world: TierWorld): WarehouseView {
  const held = (ids: readonly string[]) => ids.filter((id) => (world.items[id] ?? 0) > 0)
  const byLine = farmByLine()
  const materials: Stock[] = held(byLine ? LINE_ORDER : MATERIAL_ORDER).map((id) => {
    // Under the farm by line a material has a grade, so the kit's grade chips filter its shelf too (FL23).
    const material = byLine ? lineItem(id)! : materialIdentity(id)!
    return {
      id, shelf: material.line, sell: 'items', name: stockName(id), icon: id, grade: byLine ? lineItem(id)!.grade : null, count: world.items[id]!,
      line: materialFacts(id), group: `${material.line}-${material.refined ? 'refined' : 'raw'}`,
    }
  })
  const made: Stock[] = held(byLine ? MADE_ORDER_V4 : MADE_ORDER).map((id) => ({
    id, shelf: 'made', sell: 'items', name: stockName(id), icon: id, grade: MADE_GRADE.get(id)!.grade, count: world.items[id]!,
    line: madeFacts(id), group: MADE_GRADE.get(id)!.line,
  }))
  const total = (rows: readonly Stock[]) => n(rows.reduce((a, i) => a + i.count, 0))
  const all = [...materials, ...made].map((item) => ({ ...item, shelf: 'all' }))
  return {
    shelves: [
      { key: 'all', label: 'All' }, ...MATERIAL_LINES.map((line) => ({ key: line, label: LINE_WORD[line] })),
      { key: 'made', label: 'Made items' },
    ],
    items: [...all, ...materials, ...made], header: `${total(materials)} materials · ${total(made)} made items`,
  }
}
