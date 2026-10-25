// The Tier rework's professions (R2, D195, D208; profession-progression.md §2, §4, PP1–PP6, PP16; H77): ten professions in
// three kinds of work (five gathering, one processing, four making), each in one existing building of the Wilds, and one
// trade an Uma by her calling (her gathering and crafting pair on one Craft Level, never her active class; UT19). The
// engine's job kinds stay four (`gather`, `refine`, `craft`, `cut`); the player reads gather, process, make. Ids only and
// short words, safe for the main bundle. `workPlace` answers by generation: legacy facilities to engine v16, these places
// from v17 (`rpgRework('economy')`), so the deployed game keeps today's eleven facilities until R2's switch.
import type { MadeLine } from '../items/made-id'
import type { MaterialLine } from '../items/materials-id'
import { BATTLE_ENGINE_VERSION, rpgRework } from '../rpg/battle/caps'
import type { RpgClass } from '../rpg/kinds'
import { umaCalling, type CallingOutfit } from '../roster/template'
import { facilitySpec, type FacilitySpec, type JobKind } from './jobs'

export const PROFESSION_IDS = ['mining', 'wood-chopping', 'farming', 'fishing', 'hunting', 'processing', 'weapon-crafting', 'armor-crafting',
  'accessory-crafting', 'jewel-crafting'] as const
export type ProfessionId = typeof PROFESSION_IDS[number]
/** What the work does (PP1): gathering brings material in, processing turns raw into refined, making turns refined into
 * the items an Uma uses. */
export type ProfessionKind = 'gathering' | 'processing' | 'making'

/** The ten places, in the Wilds' order: one row a trade, gathering left and making right (PP5). */
export const PLACE_IDS_V3 = ['mine', 'forge', 'forest', 'armorer', 'fields', 'workbench', 'fishery', 'charm-shop', 'monster-den', 'lapidary'] as const
export type PlaceIdV3 = typeof PLACE_IDS_V3[number]

export interface Profession { id: ProfessionId; name: string; kind: ProfessionKind; place: PlaceIdV3 }
export const PROFESSIONS: readonly Profession[] = [
  { id: 'mining', name: 'Mining', kind: 'gathering', place: 'mine' },
  { id: 'wood-chopping', name: 'Wood Chopping', kind: 'gathering', place: 'forest' },
  { id: 'farming', name: 'Farming', kind: 'gathering', place: 'fields' },
  { id: 'fishing', name: 'Fishing', kind: 'gathering', place: 'fishery' },
  { id: 'hunting', name: 'Hunting', kind: 'gathering', place: 'monster-den' },
  { id: 'processing', name: 'Material Processing', kind: 'processing', place: 'workbench' },
  { id: 'weapon-crafting', name: 'Weapon Crafting', kind: 'making', place: 'forge' },
  { id: 'armor-crafting', name: 'Armor Crafting', kind: 'making', place: 'armorer' },
  { id: 'accessory-crafting', name: 'Accessory Crafting', kind: 'making', place: 'charm-shop' },
  { id: 'jewel-crafting', name: 'Jewel Crafting', kind: 'making', place: 'lapidary' },
]
const PROFESSION_BY_ID = new Map(PROFESSIONS.map((p) => [p.id, p]))
export const professionById = (id: string): Profession | undefined => PROFESSION_BY_ID.get(id as ProfessionId)

/** A place of R2's Wilds (PP4): its profession, its job kind (as `FacilitySpec.kind`), the line it gathers (gathering
 * places) and the made lines it makes (making places). The Workbench processes every line. Four slots, ×1.25, no levels. */
export interface PlaceSpecV3 { id: PlaceIdV3; profession: ProfessionId; kind: JobKind; line: MaterialLine | null; made: readonly MadeLine[] }
export const PLACES_V3: readonly PlaceSpecV3[] = [
  { id: 'mine', profession: 'mining', kind: 'gather', line: 'metal', made: [] },
  { id: 'forge', profession: 'weapon-crafting', kind: 'craft', line: null, made: ['weapon-gem', 'branch-gem'] },
  { id: 'forest', profession: 'wood-chopping', kind: 'gather', line: 'wood', made: [] },
  { id: 'armorer', profession: 'armor-crafting', kind: 'craft', line: null, made: ['armor-fittings'] },
  { id: 'fields', profession: 'farming', kind: 'gather', line: 'vegetables', made: [] },
  { id: 'workbench', profession: 'processing', kind: 'refine', line: null, made: [] },
  { id: 'fishery', profession: 'fishing', kind: 'gather', line: 'fish', made: [] },
  { id: 'charm-shop', profession: 'accessory-crafting', kind: 'craft', line: null, made: ['accessory-setting'] },
  { id: 'monster-den', profession: 'hunting', kind: 'gather', line: 'stone', made: [] },
  { id: 'lapidary', profession: 'jewel-crafting', kind: 'cut', line: null, made: ['jewel-planet', 'jewel-moon'] },
]
/** Every place's slots and speed from day 1 (PP4): one level, nothing to upgrade. */
export const PLACE_SLOTS_V3 = 4
export const PLACE_SPEED_V3 = 1.25
const PLACE_BY_ID = new Map(PLACES_V3.map((p) => [p.id, p]))
export const placeSpecV3 = (placeId: string): PlaceSpecV3 | undefined => PLACE_BY_ID.get(placeId as PlaceIdV3)

/** The place a job runs at, by generation: today's facility to engine v16, R2's place from v17. */
export function workPlace(placeId: string, engine: number = BATTLE_ENGINE_VERSION): FacilitySpec | PlaceSpecV3 | undefined {
  return rpgRework('economy', engine) ? placeSpecV3(placeId) : facilitySpec(placeId)
}

// --- The trade (PP2, PP3) ------------------------------------------------------------------------------------------------

export const TRADE_IDS = ['physical', 'physical-hybrid', 'healer', 'magical-hybrid', 'magical'] as const
/** Her calling's fight type, which names her trade (UT19). */
export type TradeId = typeof TRADE_IDS[number]
export interface Trade { id: TradeId; gathering: ProfessionId; crafting: ProfessionId }
/** One row a trade, physical on top as on the Learning page (PP3). */
export const TRADES: readonly Trade[] = [
  { id: 'physical', gathering: 'mining', crafting: 'weapon-crafting' },
  { id: 'physical-hybrid', gathering: 'wood-chopping', crafting: 'armor-crafting' },
  { id: 'healer', gathering: 'farming', crafting: 'processing' },
  { id: 'magical-hybrid', gathering: 'fishing', crafting: 'accessory-crafting' },
  { id: 'magical', gathering: 'hunting', crafting: 'jewel-crafting' },
]
const TRADE_BY_ID = new Map(TRADES.map((t) => [t.id, t]))

const CALLING_TRADE: Readonly<Record<RpgClass, TradeId>> = {
  brawler: 'physical', spellblade: 'physical-hybrid', paladin: 'healer', cleric: 'healer', summoner: 'magical-hybrid', mage: 'magical',
}
/** Her trade by her calling's class (PP2): the calling pick (CP29) moves a Pace Uma between the physical hybrid and the
 * magical trades; a class switch moves no job. */
export const tradeOfCalling = (calling: RpgClass): TradeId => CALLING_TRADE[calling]
/** A trade's gathering and crafting professions. */
export const tradeProfessions = (trade: TradeId): readonly [ProfessionId, ProfessionId] => {
  const t = TRADE_BY_ID.get(trade)!
  return [t.gathering, t.crafting]
}
/** A trade's two places: gathering, then crafting. */
export const tradePlaces = (trade: TradeId): readonly [PlaceIdV3, PlaceIdV3] => {
  const [gathering, crafting] = tradeProfessions(trade)
  return [PROFESSION_BY_ID.get(gathering)!.place, PROFESSION_BY_ID.get(crafting)!.place]
}

/** Her trade from her outfit and her stored calling pick (`OwnedUma.calling.pick`). */
export const umaTrade = (outfit: CallingOutfit, pick?: RpgClass | null): TradeId => tradeOfCalling(umaCalling(outfit, pick))

/** What the work rules ask of the caller (D208: template-dependent rules take their template from the caller): each
 * owned Uma's trade, or null when it can't say. */
export type TradeOf = (outfitId: string) => TradeId | null
/** A `TradeOf` over a world's Umas and the outfits the caller holds (the web's master data): an outfit it doesn't hold,
 * or an Uma the world doesn't own, is null. */
export function tradeResolver(world: { umas: Readonly<Record<string, { calling: { pick: RpgClass | null } }>> },
  outfitOf: (outfitId: string) => CallingOutfit | undefined): TradeOf {
  return (outfitId) => {
    const uma = world.umas[outfitId]
    const outfit = outfitOf(outfitId)
    return uma && outfit ? umaTrade(outfit, uma.calling.pick) : null
  }
}
