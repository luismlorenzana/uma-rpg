// The professions (R2, D195, D208; profession-progression.md §2, PP1–PP6, PP16; H77; the farm by line, D224, FL1–FL3):
// ten professions, five gathering and five making, each in one existing building of the Wilds, and one trade an Uma by her
// calling (her gathering and making pair on one Craft Level, never her active class; UT19). A making profession's place
// processes its own line too (`places-v4.ts`). The engine's job kinds stay four (`gather`, `refine`, `craft`, `cut`); the
// player reads gather, process, make. Ids only and short words, safe for the main bundle. Profession ids never reach a
// save, so two keep R2's ids under the farm by line's names: `weapon-crafting` (Arms Crafting) and `processing` (Tome
// Crafting).
import type { RpgClass } from '../rpg/kinds'
import { umaCalling, type CallingOutfit } from '../roster/template'

export const PROFESSION_IDS = ['mining', 'wood-chopping', 'farming', 'fishing', 'hunting', 'processing', 'weapon-crafting', 'armor-crafting',
  'accessory-crafting', 'jewel-crafting'] as const
export type ProfessionId = typeof PROFESSION_IDS[number]
/** What the work does (PP1): gathering brings material in; making processes its line and makes the items an Uma uses. */
export type ProfessionKind = 'gathering' | 'making'

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
  { id: 'processing', name: 'Tome Crafting', kind: 'making', place: 'workbench' },
  { id: 'weapon-crafting', name: 'Arms Crafting', kind: 'making', place: 'forge' },
  { id: 'armor-crafting', name: 'Armor Crafting', kind: 'making', place: 'armorer' },
  { id: 'accessory-crafting', name: 'Accessory Crafting', kind: 'making', place: 'charm-shop' },
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
