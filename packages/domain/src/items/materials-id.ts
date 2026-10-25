// The Tier rework's materials (R2, D195, D208; profession-progression.md §3, PP7–PP9, PP13; H77): five lines, one a
// gathering profession, a low and a high type a tier, each a raw item and its refined form. The ids are uma-art's own
// (its `items` atlas: ores, woods, the old farm's vegetables and fish, crystals), unprefixed as today's items are; one
// rule picks every line's pairs (PP8): Tier 1 takes its family's grades 1 and 3, Tier 2 grades 6 and 8, Tier 3 grades 9
// and 10. Ids only, safe for the main bundle and the save's parse; names and art are `materials.ts`'s.
//
// 36 of these ids are also legacy ids (`identity.ts`) with another meaning: legacy `iron-ore` is Ores grade 3, here it is
// Mining's Tier 1 high type. The two catalogs never answer for the same save (the economy stage decides, D208), and
// save v28's migration converts by the legacy meaning (H78).

export const MATERIAL_LINES = ['metal', 'wood', 'vegetables', 'fish', 'stone'] as const
/** A gathering profession's material: Mining metal, Wood Chopping wood, Farming vegetables, Fishing fish, Hunting stone. */
export type MaterialLine = typeof MATERIAL_LINES[number]
export const MATERIAL_TIERS = [1, 2, 3] as const
/** The tier whose pair a type is: a world holds every tier's types up to its own. */
export type MaterialTier = typeof MATERIAL_TIERS[number]
/** A pair's two types: the low one feeds grades 1–5, the high one grades 6–10 (the ladder, PP9). */
export type MaterialBand = 'low' | 'high'

export interface MaterialIdentity {
  id: string
  line: MaterialLine
  tier: MaterialTier
  band: MaterialBand
  refined: boolean
  /** The other form: a raw item's refined id, a refined item's raw id. */
  pair: string
}
/** One type: a raw item and its refined form. */
export interface MaterialType { line: MaterialLine; tier: MaterialTier; band: MaterialBand; raw: string; refined: string }

/** Each line's six types in order (Tier 1 low, Tier 1 high, Tier 2 low … Tier 3 high), raw then refined (PP §3.3). */
const LINE_TYPES: Readonly<Record<MaterialLine, readonly (readonly [string, string])[]>> = {
  metal: [['copper-ore', 'copper-ingot'], ['iron-ore', 'iron-ingot'], ['gold-ore', 'gold-ingot'], ['titanium-ore', 'titanium-ingot'],
    ['mythril-ore', 'mythril-ingot'], ['orichalcum-ore', 'orichalcum-ingot']],
  wood: [['pine-log', 'pine-plank'], ['cedar-log', 'cedar-plank'], ['cherry-log', 'cherry-plank'], ['ebony-log', 'ebony-plank'],
    ['elderwood-log', 'elderwood-plank'], ['yggdrasil-branch', 'yggdrasil-plank']],
  vegetables: [['carrot', 'chopped-carrot'], ['cabbage', 'shredded-cabbage'], ['bell-pepper', 'sliced-bell-pepper'], ['asparagus', 'trimmed-asparagus'],
    ['golden-carrot', 'golden-carrot-puree'], ['emperor-pumpkin', 'pumpkin-puree']],
  fish: [['carp', 'carp-fillet'], ['sardine', 'sardine-fillet'], ['sea-bream', 'sea-bream-fillet'], ['tuna', 'tuna-fillet'],
    ['silverfin', 'silverfin-fillet'], ['rainbow-koi', 'rainbow-koi-fillet']],
  stone: [['quartz', 'cut-quartz'], ['citrine', 'cut-citrine'], ['sapphire', 'cut-sapphire'], ['diamond', 'cut-diamond'],
    ['starstone', 'cut-starstone'], ['philosophers-stone', 'cut-philosophers-stone']],
}

/** Every type, by line, then tier, low before high. */
export const MATERIAL_TYPES: readonly MaterialType[] = MATERIAL_LINES.flatMap((line) => LINE_TYPES[line].map(([raw, refined], i): MaterialType => ({
  line, tier: (Math.floor(i / 2) + 1) as MaterialTier, band: i % 2 === 0 ? 'low' : 'high', raw, refined,
})))

/** The sixty ids (20 a tier): by line, then tier, low before high, raw before refined. */
export const MATERIAL_IDENTITIES: readonly MaterialIdentity[] = MATERIAL_TYPES.flatMap((t): MaterialIdentity[] => [
  { id: t.raw, line: t.line, tier: t.tier, band: t.band, refined: false, pair: t.refined },
  { id: t.refined, line: t.line, tier: t.tier, band: t.band, refined: true, pair: t.raw },
])

const BY_ID = new Map(MATERIAL_IDENTITIES.map((m) => [m.id, m]))
export const materialIdentity = (id: string): MaterialIdentity | undefined => BY_ID.get(id)
export const isMaterialId = (id: string): boolean => BY_ID.has(id)

/** The grade a type opens at (PP13): a low type grade 1 (Craft Lv 1), a high type grade 6 (Craft Lv 26, by
 * `gradeUnlockLevel`), in every pair and tier. 0 for an id that isn't a material. */
export const materialGateGrade = (id: string): number => {
  const m = BY_ID.get(id)
  return m ? (m.band === 'low' ? 1 : 6) : 0
}

/** The types of a line, a tier or a band, in catalog order: any argument left out matches every value. */
export function materialTypes(line?: MaterialLine, tier?: MaterialTier, band?: MaterialBand): MaterialType[] {
  return MATERIAL_TYPES.filter((t) => (line === undefined || t.line === line) && (tier === undefined || t.tier === tier) && (band === undefined || t.band === band))
}

/** The one type of a line's pair in a tier and band. */
export function materialType(line: MaterialLine, tier: MaterialTier, band: MaterialBand): MaterialType {
  const type = MATERIAL_TYPES.find((t) => t.line === line && t.tier === tier && t.band === band)
  if (!type) throw new RangeError(`No ${band} ${line} type in Tier ${tier}`)
  return type
}
