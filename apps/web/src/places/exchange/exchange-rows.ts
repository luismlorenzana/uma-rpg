// R2's raw materials at the Exchange as data (profession-progression.md §10, PP17; H80): every type of the world's tier
// and below, line by line, low before high; a stocked type at `rawPriceV3` (30 and 80 Laurels × the tier), and the rest
// locked with the win that stocks it.
import {
  MATERIAL_LINES, materialTypes, rawPriceV3, stockedAfter, stockedTypes, stockName, worldMaterialTier, type MaterialBand, type MaterialLine,
  type MaterialTier, type TierWorld,
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
