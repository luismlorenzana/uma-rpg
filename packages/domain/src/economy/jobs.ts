// Timed jobs (design §8.6, D55): an Uma in a facility slot makes `count` items one after another, each taking `msEach`
// of real time, while the app is closed. Everything is computed from the start time; nothing ticks in the save.
import { ITEM_FAMILIES, type ItemFamily } from '../items/catalog'
import type { Profession } from './pacing'

export type JobKind = 'gather' | 'refine' | 'cook' | 'craft' | 'train'
export const JOB_KINDS: readonly JobKind[] = ['gather', 'refine', 'cook', 'craft', 'train']

export interface Job {
  kind: JobKind
  outfitId: string
  /** What it makes: an item id, a dish id, a gear recipe, or a training track (S5). */
  output: string
  count: number
  /** Outputs already moved to the Warehouse (or ranks already granted). */
  collected: number
  startedAt: string
  /** Real milliseconds per output, fixed when the job starts (aptitude and facility speed included). */
  msEach: number
  /** Profession EXP per output. */
  expEach: number
  /** Inputs reserved for each output (refining, cooking, crafting). They come back for outputs never made. */
  inputs: Record<string, number>
}

export interface Facility {
  level: number
  /** One entry per Uma slot. */
  jobs: (Job | null)[]
}

const at = (iso: string): number => Date.parse(iso)

/** Outputs finished by `now`, collected or not. */
export function jobFinished(job: Job, now: string): number {
  const elapsed = at(now) - at(job.startedAt)
  return Math.max(0, Math.min(job.count, Math.floor(elapsed / job.msEach)))
}
export const jobReady = (job: Job, now: string): number => jobFinished(job, now) - job.collected
export const jobEndsAt = (job: Job): number => at(job.startedAt) + job.count * job.msEach
export const jobComplete = (job: Job, now: string): boolean => jobFinished(job, now) >= job.count
/** Progress through the whole job, 0–1. */
export const jobProgress = (job: Job, now: string): number =>
  Math.max(0, Math.min(1, (at(now) - at(job.startedAt)) / (job.count * job.msEach)))

// --- Which places are facilities -------------------------------------------------------------------------------

export interface FacilitySpec {
  id: string
  kind: JobKind
  /** The profession its jobs raise (none for training). */
  profession: Profession | null
  /** The site's item family (gathering sites only). */
  family: string | null
  /** The two families whose refined items upgrade it. */
  upgradeFamilies: readonly [string, string]
}

const mirrorOf = (family: ItemFamily): ItemFamily => ITEM_FAMILIES.find((f) => f.effect === family.effect && f.side !== family.side)!
/** Buildings take blocks and planks; sites take their own family and its mirror on the other side. */
const BUILDING: readonly [string, string] = ['stones', 'woods']

const SPECS: FacilitySpec[] = [
  ...ITEM_FAMILIES.map((f): FacilitySpec => ({
    id: f.site, kind: 'gather', profession: f.side === 'farming' ? 'farming' : 'gathering', family: f.id, upgradeFamilies: [f.id, mirrorOf(f).id],
  })),
  { id: 'pantry', kind: 'refine', profession: 'farming', family: null, upgradeFamilies: BUILDING },
  { id: 'workbench', kind: 'refine', profession: 'gathering', family: null, upgradeFamilies: BUILDING },
  { id: 'kitchen', kind: 'cook', profession: 'farming', family: null, upgradeFamilies: BUILDING },
  { id: 'forge', kind: 'craft', profession: 'gathering', family: null, upgradeFamilies: BUILDING },
  ...['brawler-dojo', 'mage-tower', 'spell-blade-salle', 'cleric-chapel', 'summoner-circle', 'rangers-lodge', 'lancers-barracks', 'arcane-armory',
    'knights-bastion'].map((id): FacilitySpec => ({ id, kind: 'train', profession: null, family: null, upgradeFamilies: BUILDING })),
]
const SPEC_BY_ID = new Map(SPECS.map((s) => [s.id, s]))
export const FACILITIES: readonly FacilitySpec[] = SPECS
export const facilitySpec = (placeId: string): FacilitySpec | undefined => SPEC_BY_ID.get(placeId)
/** The profession side a refining or making station serves. */
export const stationSide = (placeId: string): 'farming' | 'gathering' | null => facilitySpec(placeId)?.profession ?? null

