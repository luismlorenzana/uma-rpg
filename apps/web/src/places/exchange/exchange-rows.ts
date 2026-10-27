// R2's raw materials at the Exchange as data (profession-progression.md §10, PP17; H80): every type of the world's tier
// and below, line by line, low before high; a stocked type at `rawPriceV3` (30 and 80 Laurels × the tier), and the rest
// locked with the win that stocks it.
import {
  lineItems, MATERIAL_LINES, materialTypes, rawPriceV3, rawPriceV4, stockedAfter, stockedTypes, stockName, worldMaterialTier, type MaterialBand,
  type MaterialLine, type MaterialTier, type TierWorld,
} from '@rpg/domain'

export interface RawRowV3 { id: string; name: string; tier: MaterialTier; band: MaterialBand; price: number; have: number; locked: string | null }

/** "After the tier’s first win" or "After a win on continent 3". */
export const stockLock = (continent: number): string => (continent <= 1 ? 'After the tier’s first win' : `After a win on continent ${continent}`)

/** The Exchange's raw rows for a world of `tier`, grouped by line. */
export function rawRowsV3(world: TierWorld, tier: number): { line: MaterialLine; rows: RawRowV3[] }[] {
  const stocked = new Set(stockedTypes(world, tier))
  const top = worldMaterialTier(tier)
  return MATERIAL_LINES.map((line) => ({
    line,
    rows: materialTypes(line).filter((t) => t.tier <= top).map((t): RawRowV3 => ({
      id: t.raw, name: stockName(t.raw), tier: t.tier, band: t.band, price: rawPriceV3(t.raw, tier), have: world.items[t.raw] ?? 0,
      locked: stocked.has(t.raw) ? null : stockLock(stockedAfter(t.tier, t.band)),
    })),
  }))
}

/** A farm-by-line raw row (FL12): its grade instead of a tier and band. */
export interface RawRowV4 { id: string; name: string; grade: number; price: number; have: number; locked: string | null }

/** The farm by line's raw rows for a world of `tier` (H111): each line's ten grades, G1–G5 stocked after the tier's first
 * win and G6–G10 after continent 3, at 30 and 80 Laurels × the tier. */
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
