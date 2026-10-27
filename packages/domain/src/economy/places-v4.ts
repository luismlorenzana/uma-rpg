// The Wilds' places (D224, D230; farm-by-line.md FL1–FL3, FL14, FL25–FL27): five rows of three, one line a row. The
// gathering place gathers its raw items, its workbench processes them, and its making place makes the items an Uma uses.
import { isLineItemId, lineItem, type MaterialLine } from '../items/lines'
import { madeIdentity, type MadeLine } from '../items/made-id'
import { BATTLE_ENGINE_VERSION, rpgRework } from '../rpg/battle/caps'
import { facilitySpec, type FacilitySpec, type JobKind } from './jobs'
import { PROFESSIONS, type PlaceIdV3, type ProfessionId } from './professions'

export interface PlaceSpecV4 {
  id: PlaceIdV3
  profession: ProfessionId
  /** The one line the place works (FL2). */
  line: MaterialLine
  /** Exactly one kind: `gather`, `refine`, `craft`, or `cut` at the Lapidary. */
  kinds: readonly JobKind[]
  made: readonly MadeLine[]
}

const gathering = (id: PlaceIdV3, profession: ProfessionId, line: MaterialLine): PlaceSpecV4 => ({ id, profession, line, kinds: ['gather'], made: [] })
const processing = (id: PlaceIdV3, profession: ProfessionId, line: MaterialLine): PlaceSpecV4 => ({ id, profession, line, kinds: ['refine'], made: [] })
const making = (id: PlaceIdV3, profession: ProfessionId, line: MaterialLine, make: 'craft' | 'cut', made: readonly MadeLine[]): PlaceSpecV4 =>
  ({ id, profession, line, kinds: [make], made })

/** The fifteen places, row by row: gathering, processing, making. */
export const PLACES_V4: readonly PlaceSpecV4[] = [
  gathering('mine', 'mining', 'metal'),
  processing('mine-workbench', 'smelting', 'metal'),
  making('weapon-forge', 'arms-crafting', 'metal', 'craft', ['weapon-gem', 'branch-gem']),
  gathering('fields', 'farming', 'vegetables'),
  processing('fields-workbench', 'prepping', 'vegetables'),
  making('tome-forge', 'tome-crafting', 'vegetables', 'craft', ['tome-ink']),
  gathering('forest', 'wood-chopping', 'wood'),
  processing('forest-workbench', 'sawing', 'wood'),
  making('armorer', 'armor-crafting', 'wood', 'craft', ['armor-fittings']),
  gathering('fishery', 'fishing', 'fish'),
  processing('fishery-workbench', 'filleting', 'fish'),
  making('charm-forge', 'accessory-crafting', 'fish', 'craft', ['accessory-setting']),
  gathering('monster-den', 'hunting', 'stone'),
  processing('den-workbench', 'stonecutting', 'stone'),
  making('lapidary', 'jewel-crafting', 'stone', 'cut', ['jewel-planet', 'jewel-moon']),
]
const BY_ID = new Map(PLACES_V4.map((p) => [p.id, p]))
export const placeSpecV4 = (placeId: string): PlaceSpecV4 | undefined => BY_ID.get(placeId as PlaceIdV3)

/** Whether a place processes its line's raw items. */
export const isProcessingPlaceV4 = (place: PlaceSpecV4): boolean => place.kinds.includes('refine')
/** Whether a place makes an Uma's item. */
export const isMakingPlaceV4 = (place: PlaceSpecV4): boolean => place.kinds.includes('craft') || place.kinds.includes('cut')

/** The professions' names (FL14): the Forge's Arms Crafting, the Workbench's Tome Crafting. */
export const PROFESSION_NAMES_V4: Readonly<Record<ProfessionId, string>> = Object.fromEntries(PROFESSIONS.map((p) => [p.id, p.name])) as Record<ProfessionId, string>

/** The place a job runs at, by generation: today's facility to engine v16, the Wilds' place from v17. */
export function workPlace(placeId: string, engine: number = BATTLE_ENGINE_VERSION): FacilitySpec | PlaceSpecV4 | undefined {
  return rpgRework('economy', engine) ? placeSpecV4(placeId) : facilitySpec(placeId)
}

/** The kind of job an item is at its one place; null for anything the place doesn't work (FL2, FL27). */
export function jobKindV4(placeId: string, item: string): JobKind | null {
  const place = placeSpecV4(placeId)
  if (!place) return null
  if (isLineItemId(item)) {
    const m = lineItem(item)!
    if (m.line !== place.line) return null
    if (!m.refined) return place.kinds.includes('gather') ? 'gather' : null
    return place.kinds.includes('refine') ? 'refine' : null
  }
  const made = madeIdentity(item)
  if (!made || !place.made.includes(made.line)) return null
  return place.kinds.find((k) => k === 'craft' || k === 'cut') ?? null
}
