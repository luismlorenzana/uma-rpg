// The facilities (design §8.6, D55, D144): which places hold work, what kind each does and what upgrades it. The jobs
// themselves run in the shared engine (SC3, `save/work.ts`).
import { ITEM_IDENTITIES as ITEM_FAMILIES } from '../items/identity'

/** Gathering at a site, refining at the Workbench, crafting gear at the Forge, cutting Star Gems at the Lapidary. */
export type JobKind = 'gather' | 'refine' | 'craft' | 'cut'
export const JOB_KINDS: readonly JobKind[] = ['gather', 'refine', 'craft', 'cut']

// --- Which places are facilities -------------------------------------------------------------------------------

export interface FacilitySpec {
  id: string
  kind: JobKind
  /** The site's item family (gathering sites only). */
  family: string | null
  /** The two families whose refined items upgrade it. */
  upgradeFamilies: readonly [string, string]
}

/** A site's partner: the family its own is paired with in gear recipes (D125, D144). */
const PARTNER: Readonly<Record<string, string>> = {
  ores: 'crystals', crystals: 'ores', woods: 'essences', essences: 'woods', 'hides-scales': 'bones-horns', 'bones-horns': 'hides-scales',
  stones: 'fibers', fibers: 'stones',
}
/** Buildings take blocks and planks; sites take their own family and its partner. */
const BUILDING: readonly [string, string] = ['stones', 'woods']

const SPECS: FacilitySpec[] = [
  ...ITEM_FAMILIES.map((f): FacilitySpec => ({ id: f.site, kind: 'gather', family: f.id, upgradeFamilies: [f.id, PARTNER[f.id]!] })),
  { id: 'workbench', kind: 'refine', family: null, upgradeFamilies: BUILDING },
  { id: 'forge', kind: 'craft', family: null, upgradeFamilies: BUILDING },
  { id: 'lapidary', kind: 'cut', family: null, upgradeFamilies: BUILDING },
]
const SPEC_BY_ID = new Map(SPECS.map((s) => [s.id, s]))
export const FACILITIES: readonly FacilitySpec[] = SPECS
export const facilitySpec = (placeId: string): FacilitySpec | undefined => SPEC_BY_ID.get(placeId)

