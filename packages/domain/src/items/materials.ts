// The Tier rework's materials with their names and art (R2, PP7, PP8; H77): uma-art's own names ("Copper Ore", "Golden
// Carrot Purée", "Philosopher's Stone") and where each icon sits in its `items` atlas, by art family and grade, so the web
// finds every icon without a second table (H79, H80). Both follow from the id, which is uma-art's: its words capitalized
// (two keep their marks), and PP8's grades (Tier 1 the family's grades 1 and 3, Tier 2 6 and 8, Tier 3 9 and 10). Kept
// small for the main bundle, which holds the work rules; `materials.test.ts` checks every name and icon against uma-art's.
import { itemNameOf, LINE_ART_FAMILY, type MaterialArtFamily } from './lines'
import { MATERIAL_IDENTITIES, type MaterialIdentity } from './materials-id'

export interface MaterialDef extends MaterialIdentity {
  name: string
  /** Its icon: uma-art's family and grade. */
  art: { family: MaterialArtFamily; grade: number }
}

/** PP8: a tier's low and high types are its family's grades 1 and 3, 6 and 8, 9 and 10. */
const ART_GRADE = [[1, 3], [6, 8], [9, 10]] as const

/** Every material, in `MATERIAL_IDENTITIES`' order. */
export const MATERIALS: readonly MaterialDef[] = MATERIAL_IDENTITIES.map((m) => ({
  ...m, name: itemNameOf(m.id), art: { family: LINE_ART_FAMILY[m.line], grade: ART_GRADE[m.tier - 1]![m.band === 'low' ? 0 : 1] },
}))

const BY_ID = new Map(MATERIALS.map((m) => [m.id, m]))
export const materialById = (id: string): MaterialDef | undefined => BY_ID.get(id)
export const materialName = (id: string): string | undefined => BY_ID.get(id)?.name
