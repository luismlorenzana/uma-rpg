// The Wilds' places (D224; farm-by-line.md FL1–FL3, FL14; H109, live since H112): R2's ten places, rows and trades, every
// place one line's. A gathering place gathers its line; a making place processes its own line's raw items and makes its
// one item from its own refined ones: the Forge Arms Gems, the Armorer Armor Fittings, the Workbench Tome Ink, the Charm
// Shop Accessory Settings, the Lapidary Planet and Moon Jewels.
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
  /** `gather` at a gathering place; `refine` and its making kind (`craft`, or `cut` at the Lapidary) at a making place. */
  kinds: readonly JobKind[]
  made: readonly MadeLine[]
}

const gathering = (id: PlaceIdV3, profession: ProfessionId, line: MaterialLine): PlaceSpecV4 => ({ id, profession, line, kinds: ['gather'], made: [] })
const making = (id: PlaceIdV3, profession: ProfessionId, line: MaterialLine, make: 'craft' | 'cut', made: readonly MadeLine[]): PlaceSpecV4 =>
  ({ id, profession, line, kinds: ['refine', make], made })

/** The ten places, in the Wilds' order: one row a trade, gathering left and making right. */
export const PLACES_V4: readonly PlaceSpecV4[] = [
  gathering('mine', 'mining', 'metal'),
  making('forge', 'weapon-crafting', 'metal', 'craft', ['weapon-gem', 'branch-gem']),
  gathering('forest', 'wood-chopping', 'wood'),
  making('armorer', 'armor-crafting', 'wood', 'craft', ['armor-fittings']),
  gathering('fields', 'farming', 'vegetables'),
  making('workbench', 'processing', 'vegetables', 'craft', ['tome-ink']),
  gathering('fishery', 'fishing', 'fish'),
  making('charm-shop', 'accessory-crafting', 'fish', 'craft', ['accessory-setting']),
  gathering('monster-den', 'hunting', 'stone'),
  making('lapidary', 'jewel-crafting', 'stone', 'cut', ['jewel-planet', 'jewel-moon']),
]
const BY_ID = new Map(PLACES_V4.map((p) => [p.id, p]))
export const placeSpecV4 = (placeId: string): PlaceSpecV4 | undefined => BY_ID.get(placeId as PlaceIdV3)

/** Whether a place makes (and so processes) rather than gathers. */
export const isMakingPlaceV4 = (place: PlaceSpecV4): boolean => place.kinds.includes('refine')

/** The professions' names (FL14): the Forge's Arms Crafting, the Workbench's Tome Crafting. */
export const PROFESSION_NAMES_V4: Readonly<Record<ProfessionId, string>> = Object.fromEntries(PROFESSIONS.map((p) => [p.id, p.name])) as Record<ProfessionId, string>

/** The place a job runs at, by generation: today's facility to engine v16, the Wilds' place from v17. */
export function workPlace(placeId: string, engine: number = BATTLE_ENGINE_VERSION): FacilitySpec | PlaceSpecV4 | undefined {
  return rpgRework('economy', engine) ? placeSpecV4(placeId) : facilitySpec(placeId)
}

/** The kind of job an item is at a place: a gathering place's raw item `gather`; a making place's refined item `refine`
 * and its made item its making kind; null for anything the place doesn't work (FL2). */
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
