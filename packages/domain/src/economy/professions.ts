// The professions (R2, D195, D208; profession-progression.md §2, PP1–PP6, PP16; H77; the farm by line, D224, FL1–FL3):
// fifteen professions, five each for gathering, processing and making. One trade is a row of three Wilds places chosen
// by an Uma's calling (one Craft Level across all three, never her active class; UT19). The engine's job kinds stay four
// (`gather`, `refine`, `craft`, `cut`); the player reads gather, process, make. Profession ids never reach a save.
import type { RpgClass } from '../rpg/kinds'
import { umaCalling, type CallingOutfit } from '../roster/template'

export const PROFESSION_IDS = [
  'mining', 'smelting', 'arms-crafting',
  'farming', 'prepping', 'tome-crafting',
  'wood-chopping', 'sawing', 'armor-crafting',
  'fishing', 'filleting', 'accessory-crafting',
  'hunting', 'stonecutting', 'jewel-crafting',
] as const
export type ProfessionId = typeof PROFESSION_IDS[number]
/** What the work does (FL25): gathering brings raw material in, processing refines it, making makes an Uma's items. */
export type ProfessionKind = 'gathering' | 'processing' | 'making'

/** The fifteen places, row by row: gathering, processing, making (FL25). */
export const PLACE_IDS_V3 = [
  'mine', 'mine-workbench', 'weapon-forge',
  'fields', 'fields-workbench', 'tome-forge',
  'forest', 'forest-workbench', 'armorer',
  'fishery', 'fishery-workbench', 'charm-forge',
  'monster-den', 'den-workbench', 'lapidary',
] as const
export type PlaceIdV3 = typeof PLACE_IDS_V3[number]

export interface Profession { id: ProfessionId; name: string; kind: ProfessionKind; place: PlaceIdV3 }
export const PROFESSIONS: readonly Profession[] = [
  { id: 'mining', name: 'Mining', kind: 'gathering', place: 'mine' },
  { id: 'smelting', name: 'Smelting', kind: 'processing', place: 'mine-workbench' },
  { id: 'arms-crafting', name: 'Arms Crafting', kind: 'making', place: 'weapon-forge' },
  { id: 'farming', name: 'Farming', kind: 'gathering', place: 'fields' },
  { id: 'prepping', name: 'Prepping', kind: 'processing', place: 'fields-workbench' },
  { id: 'tome-crafting', name: 'Tome Crafting', kind: 'making', place: 'tome-forge' },
  { id: 'wood-chopping', name: 'Wood Chopping', kind: 'gathering', place: 'forest' },
  { id: 'sawing', name: 'Sawing', kind: 'processing', place: 'forest-workbench' },
  { id: 'armor-crafting', name: 'Armor Crafting', kind: 'making', place: 'armorer' },
  { id: 'fishing', name: 'Fishing', kind: 'gathering', place: 'fishery' },
  { id: 'filleting', name: 'Filleting', kind: 'processing', place: 'fishery-workbench' },
  { id: 'accessory-crafting', name: 'Accessory Crafting', kind: 'making', place: 'charm-forge' },
  { id: 'hunting', name: 'Hunting', kind: 'gathering', place: 'monster-den' },
  { id: 'stonecutting', name: 'Stonecutting', kind: 'processing', place: 'den-workbench' },
  { id: 'jewel-crafting', name: 'Jewel Crafting', kind: 'making', place: 'lapidary' },
]
const PROFESSION_BY_ID = new Map(PROFESSIONS.map((p) => [p.id, p]))
export const professionById = (id: string): Profession | undefined => PROFESSION_BY_ID.get(id as ProfessionId)

/** Every place's slots and speed from day 1 (PP4): one level, nothing to upgrade. */
export const PLACE_SLOTS_V3 = 4
export const PLACE_SPEED_V3 = 1.25

// --- The trade (PP2, PP3) ------------------------------------------------------------------------------------------------

export const TRADE_IDS = ['physical', 'physical-hybrid', 'healer', 'magical-hybrid', 'magical'] as const
/** Her calling's fight type, which names her trade (UT19). */
export type TradeId = typeof TRADE_IDS[number]
export interface Trade { id: TradeId; gathering: ProfessionId; processing: ProfessionId; crafting: ProfessionId }
/** One row a trade, physical on top as on the Learning page (PP3). */
export const TRADES: readonly Trade[] = [
  { id: 'physical', gathering: 'mining', processing: 'smelting', crafting: 'arms-crafting' },
  { id: 'physical-hybrid', gathering: 'wood-chopping', processing: 'sawing', crafting: 'armor-crafting' },
  { id: 'healer', gathering: 'farming', processing: 'prepping', crafting: 'tome-crafting' },
  { id: 'magical-hybrid', gathering: 'fishing', processing: 'filleting', crafting: 'accessory-crafting' },
  { id: 'magical', gathering: 'hunting', processing: 'stonecutting', crafting: 'jewel-crafting' },
]
const TRADE_BY_ID = new Map(TRADES.map((t) => [t.id, t]))

const CALLING_TRADE: Readonly<Record<RpgClass, TradeId>> = {
  brawler: 'physical', spellblade: 'physical-hybrid', paladin: 'healer', cleric: 'healer', summoner: 'magical-hybrid', mage: 'magical',
}
/** Her trade by her calling's class (PP2): the calling pick (CP29) moves a Pace Uma between the physical hybrid and the
 * magical trades; a class switch moves no job. */
export const tradeOfCalling = (calling: RpgClass): TradeId => CALLING_TRADE[calling]
/** A trade's gathering, processing and crafting professions. */
export const tradeProfessions = (trade: TradeId): readonly [ProfessionId, ProfessionId, ProfessionId] => {
  const t = TRADE_BY_ID.get(trade)!
  return [t.gathering, t.processing, t.crafting]
}
/** A trade's three places: gathering, processing, then crafting. */
export const tradePlaces = (trade: TradeId): readonly [PlaceIdV3, PlaceIdV3, PlaceIdV3] => {
  const [gathering, processing, crafting] = tradeProfessions(trade)
  return [PROFESSION_BY_ID.get(gathering)!.place, PROFESSION_BY_ID.get(processing)!.place, PROFESSION_BY_ID.get(crafting)!.place]
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
