// The Warehouse's shelves as data (S4–S7, D144, SD3; R2's from its switch, H80, profession-progression.md §4.4, §7.5).
// v1: Materials, Star Gems and Gear, by grade. R2: **Materials** (by profession, raw then refined, a tier at a time, each
// row saying its tier and band, never a grade) and **Made items** (Weapon Gems, Armor Fittings and Accessory Settings by
// grade, then Planet and Moon Jewels I–V), both sold from the world's `items`.
import type { ShelfItem } from '@luismlorenzana/uma-kit/places'
import {
  gearStock, gemStock, ITEM_FAMILIES, itemById, MADE_IDENTITIES, MATERIAL_LINES, MATERIAL_TYPES, rpgRework, stockName, type Shelf, type TierWorld,
} from '@rpg/domain'
import { outputView } from '../../items/outputs'
import { madeFacts, materialFacts } from '../../items/v3-words'

/** A stack on a shelf: `sell` is the save's shelf it sells from, `icon` its art id, `line` its row's second line. */
export interface Stock extends ShelfItem { sell: Shelf; icon: string; line: string | null }

export interface WarehouseView { shelves: readonly { key: string; label: string }[]; items: Stock[]; header: string }

/** v1's order: family by family, raw then refined, grade by grade. */
const MATERIAL_ORDER_V1 = ITEM_FAMILIES.flatMap((f) => [...f.raw, ...f.refined].map((i) => i.id))

/** R2's materials: line by line (the professions' order), raw then refined, tier by tier, low before high. */
export const MATERIAL_ORDER_V3: readonly string[] = MATERIAL_LINES.flatMap((line) => [false, true].flatMap((refined) =>
  MATERIAL_TYPES.filter((t) => t.line === line).map((t) => (refined ? t.refined : t.raw))))

/** R2's made items: the three grade lines G1–G10, the Branch Gem, then Planet and Moon Jewels I–V. */
const MADE_ORDER: readonly string[] = (['weapon-gem', 'branch-gem', 'armor-fittings', 'accessory-setting', 'jewel-planet', 'jewel-moon'] as const)
  .flatMap((line) => MADE_IDENTITIES.filter((m) => m.line === line).map((m) => m.id))
const MADE_GRADE = new Map(MADE_IDENTITIES.map((m) => [m.id, m]))

const n = (count: number) => count.toLocaleString('en-US')

function v1(world: TierWorld): WarehouseView {
  const stock = (shelf: Shelf, id: string, count: number): Stock => {
    const view = outputView(id)
    const item = shelf === 'items' ? itemById(id) : undefined
    return { id, shelf, sell: shelf, name: view.name, icon: view.icon, grade: view.grade, count, line: null,
      // "Highest" keeps the top grade of each family's raw and refined lines, each gem line and each gear type.
      group: item ? `${item.family}-${item.refined ? 'refined' : 'raw'}` : id.replace(/-\d+$|-g\d+$/, '') }
  }
  const items: Stock[] = [
    ...MATERIAL_ORDER_V1.filter((id) => (world.items[id] ?? 0) > 0).map((id) => stock('items', id, world.items[id]!)),
    ...Object.entries(gemStock(world)).filter(([, count]) => count > 0).map(([id, count]) => stock('gems', id, count)),
    ...Object.entries(gearStock(world)).filter(([, count]) => count > 0).map(([id, count]) => stock('gear', id, count)),
  ]
  const total = (shelf: string) => items.filter((i) => i.shelf === shelf).reduce((a, i) => a + i.count, 0)
  return {
    shelves: [{ key: 'items', label: 'Materials' }, { key: 'gems', label: 'Star Gems' }, { key: 'gear', label: 'Gear' }],
    items, header: `${total('items')} items · ${total('gems')} Star Gems · ${total('gear')} unbound gear`,
  }
}

function v3(world: TierWorld): WarehouseView {
  const held = (ids: readonly string[]) => ids.filter((id) => (world.items[id] ?? 0) > 0)
  const materials: Stock[] = held(MATERIAL_ORDER_V3).map((id) => ({
    id, shelf: 'materials', sell: 'items', name: stockName(id), icon: id, grade: null, count: world.items[id]!, line: materialFacts(id),
  }))
  const made: Stock[] = held(MADE_ORDER).map((id) => ({
    id, shelf: 'made', sell: 'items', name: stockName(id), icon: id, grade: MADE_GRADE.get(id)!.grade, count: world.items[id]!,
    line: madeFacts(id), group: MADE_GRADE.get(id)!.line,
  }))
  const total = (rows: readonly Stock[]) => n(rows.reduce((a, i) => a + i.count, 0))
  return {
    shelves: [{ key: 'materials', label: 'Materials' }, { key: 'made', label: 'Made items' }],
    items: [...materials, ...made], header: `${total(materials)} materials · ${total(made)} made items`,
  }
}

/** The Warehouse of a world: R2's two shelves from the economy stage, else v1's three. */
export function warehouseView(world: TierWorld, economy: boolean = rpgRework('economy')): WarehouseView {
  return economy ? v3(world) : v1(world)
}
