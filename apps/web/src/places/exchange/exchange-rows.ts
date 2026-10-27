// The raw materials at the Exchange as data (H80; the farm by line since H112, D224, FL12, FL23): each line's ten grades,
// G1–G5 stocked after the tier's first win and G6–G10 after continent 3, at 30 and 80 Laurels × the tier, the rest locked
// with the win that stocks them.
import { lineItems, MATERIAL_LINES, rawPriceV4, stockedTypes, type MaterialLine, type TierWorld } from '@rpg/domain'

/** "After the tier’s first win" or "After a win on continent 3". */
export const stockLock = (continent: number): string => (continent <= 1 ? 'After the tier’s first win' : `After a win on continent ${continent}`)

/** A raw row (FL12): its grade, price, what's held and why it's locked. */
export interface RawRowV4 { id: string; name: string; grade: number; price: number; have: number; locked: string | null }

/** The raw rows for a world of `tier` (H111): each line's ten grades. */
export function rawRowsV4(world: TierWorld, tier: number): { line: MaterialLine; rows: RawRowV4[] }[] {
  const stocked = new Set(stockedTypes(world, tier))
  return MATERIAL_LINES.map((line) => ({
    line,
    rows: lineItems(line, false).map((m): RawRowV4 => ({
      id: m.id, name: m.name, grade: m.grade, price: rawPriceV4(m.id, tier), have: world.items[m.id] ?? 0,
      locked: stocked.has(m.id) ? null : stockLock(m.grade <= 5 ? 1 : 3),
    })),
  }))
}
