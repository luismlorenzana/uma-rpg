// The world map's biomes (D66, docs/design/world/regions.md): each sets the element signatures its foes carry, the
// formations and roles it leans to, and its color on the map.
import type { RpgElement } from '../rpg/kinds'
import type { RpgFoeRole } from '../rpg/campaign/enemies'

export type Formation = 'solo' | 'duo' | 'trio' | 'squad' | 'swarm' | 'escort'
export type Biome = 'meadow' | 'forest' | 'coast' | 'swamp' | 'jungle' | 'desert' | 'canyon' | 'volcano' | 'geyser' | 'tundra' | 'glacier'
  | 'peaks' | 'highlands' | 'sky' | 'underworld' | 'moor' | 'crystal' | 'ruins' | 'rift'
export interface BiomeDef {
  id: Biome
  name: string
  /** Element signatures, the main one first and the rarest last: one element, or a pair a foe carries both of. */
  signatures: readonly (readonly RpgElement[])[]
  /** Formation lean, the signature one first. */
  formations: readonly Formation[]
  roles: readonly RpgFoeRole[]
  color: string
}

export const BIOMES: readonly BiomeDef[] = [
  { id: 'meadow', name: 'Meadow', signatures: [['fire'], ['ice'], ['lightning']], formations: ['squad', 'duo', 'trio'], roles: ['striker', 'caster', 'skirmisher', 'guard'], color: '#7fbf5a' },
  { id: 'forest', name: 'Forest', signatures: [['lightning'], ['light'], ['dark']], formations: ['squad', 'trio', 'swarm'], roles: ['skirmisher', 'striker'], color: '#2f7d3b' },
  { id: 'coast', name: 'Coast', signatures: [['ice', 'lightning'], ['ice'], ['lightning']], formations: ['trio', 'squad'], roles: ['caster', 'skirmisher'], color: '#4bb3b0' },
  { id: 'swamp', name: 'Swamp', signatures: [['lightning', 'dark'], ['dark']], formations: ['squad', 'trio'], roles: ['caster', 'skirmisher'], color: '#6b7340' },
  { id: 'jungle', name: 'Jungle', signatures: [['fire', 'lightning'], ['lightning']], formations: ['swarm', 'squad'], roles: ['skirmisher', 'striker'], color: '#3fa34d' },
  { id: 'desert', name: 'Desert', signatures: [['fire', 'light'], ['fire'], ['light']], formations: ['trio', 'duo'], roles: ['guard', 'striker'], color: '#d9b24c' },
  { id: 'canyon', name: 'Canyon', signatures: [['fire'], ['lightning'], ['fire', 'lightning']], formations: ['duo', 'solo', 'trio'], roles: ['striker'], color: '#b5583a' },
  { id: 'volcano', name: 'Volcano', signatures: [['fire', 'dark'], ['fire', 'light'], ['fire']], formations: ['solo', 'duo'], roles: ['striker', 'caster'], color: '#c43b2b' },
  { id: 'geyser', name: 'Geyser Basin', signatures: [['fire', 'ice'], ['ice'], ['fire']], formations: ['trio', 'squad'], roles: ['caster'], color: '#e0b98f' },
  { id: 'tundra', name: 'Tundra', signatures: [['ice'], ['ice', 'dark']], formations: ['squad', 'trio'], roles: ['guard', 'striker'], color: '#a9c7d9' },
  { id: 'glacier', name: 'Glacier', signatures: [['ice', 'light'], ['ice']], formations: ['solo', 'duo'], roles: ['guard'], color: '#dcecf5' },
  { id: 'peaks', name: 'Storm Peaks', signatures: [['ice', 'lightning'], ['lightning']], formations: ['trio', 'squad'], roles: ['skirmisher'], color: '#6f7a8c' },
  { id: 'highlands', name: 'Highlands', signatures: [['lightning', 'light'], ['light']], formations: ['duo', 'trio'], roles: ['caster'], color: '#9a86b5' },
  { id: 'sky', name: 'Sky Isles', signatures: [['fire', 'light'], ['ice', 'light'], ['lightning', 'light']], formations: ['trio', 'duo'], roles: ['caster'], color: '#efe0a8' },
  { id: 'underworld', name: 'Underworld', signatures: [['fire', 'dark'], ['ice', 'dark'], ['lightning', 'dark']], formations: ['swarm', 'squad'], roles: ['striker', 'caster', 'skirmisher'], color: '#4a3366' },
  { id: 'moor', name: 'Haunted Moor', signatures: [['dark'], ['ice', 'dark']], formations: ['swarm', 'squad'], roles: ['skirmisher', 'caster'], color: '#6d6880' },
  { id: 'crystal', name: 'Crystal Caverns', signatures: [['ice', 'light'], ['light']], formations: ['squad', 'trio'], roles: ['guard', 'caster'], color: '#59c9d9' },
  { id: 'ruins', name: 'Ancient Ruins', signatures: [['light', 'dark'], ['fire'], ['ice'], ['lightning']], formations: ['escort', 'trio'], roles: ['guard'], color: '#a39a86' },
  { id: 'rift', name: 'Twilight Rift', signatures: [['light', 'dark']], formations: ['solo'], roles: ['striker', 'caster'], color: '#3d3f8f' },
]
/** Whose faces a biome's foes wear (D76, D81): three biomes a franchise. PriConne the bright fantasy lands, Azur Lane
 * the Underworld and the seas, Last Origin the war-torn ones, NIKKE the surface wastes, Destiny Child the occult ones.
 * The other four draw from a mixed pool of a few faces from each pack. Packs are private content; a missing one falls
 * back to the pool. */
export type Franchise = 'priconne' | 'azurlane' | 'lastorigin' | 'destinychild' | 'nikke'
export const FRANCHISES: readonly Franchise[] = ['priconne', 'azurlane', 'lastorigin', 'destinychild', 'nikke']
const BIOME_FRANCHISE: Readonly<Partial<Record<Biome, Franchise>>> = {
  sky: 'priconne', highlands: 'priconne', meadow: 'priconne',
  underworld: 'azurlane', coast: 'azurlane', glacier: 'azurlane',
  ruins: 'lastorigin', canyon: 'lastorigin', volcano: 'lastorigin',
  desert: 'nikke', tundra: 'nikke', peaks: 'nikke',
  moor: 'destinychild', swamp: 'destinychild', rift: 'destinychild',
}
/** A biome's own franchise, or null when it draws from the mixed pool. */
export const biomeFranchise = (biome: Biome): Franchise | null => BIOME_FRANCHISE[biome] ?? null

const BY_ID = new Map(BIOMES.map((b) => [b.id, b]))
export const biomeById = (id: Biome): BiomeDef => BY_ID.get(id)!

/** The elements that beat a signature, minus its own (D66): a pair's answers differ from either half's. */
export function signatureWeaknesses(signature: readonly RpgElement[]): RpgElement[] {
  const beats: Record<RpgElement, RpgElement> = { fire: 'lightning', ice: 'fire', lightning: 'ice', light: 'dark', dark: 'light' }
  return [...new Set(signature.map((e) => beats[e]))].filter((e) => !signature.includes(e))
}
