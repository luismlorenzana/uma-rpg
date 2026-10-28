// The place registry (D33, D144, D147): every place on the Hub's four pages, in the bottom bar's order (Town Hall ·
// Learning · Battle · Wilds, the sibling apps' Home · Grow · Play · Work), one source for the map, the hit targets, the
// global menu and the routes. Design: docs/archive/design/game-design.md §9; slice spec docs/archive/build-history/slices/S1-hub.md.
import { RIFT_OPEN_AT, RIFT_TIERS, riftOpen } from '../rift/state'
import { BATTLE_ENGINE_VERSION, rpgRework, rpgV2 } from '../rpg/battle/caps'

export const HUB_PAGES = ['town', 'learning', 'battle', 'wilds'] as const
export type HubPage = (typeof HUB_PAGES)[number]

export const HUB_PAGE_NAMES: Record<HubPage, string> = {
  town: 'Town Hall',
  learning: 'Learning',
  battle: 'Battle',
  wilds: 'Wilds',
}

export type PlaceKind = 'gather-site' | 'station' | 'class-hall' | 'battle' | 'town'

export const SLICES = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'] as const
export type SliceId = (typeof SLICES)[number]

/** One line per slice, for "Opens in S#" banners (docs/archive/build-history/plan.md). */
export const SLICE_GOALS: Record<SliceId, string> = {
  S1: 'The Hub and foundation',
  S2: 'Collection and parties: unlock Umas, build parties',
  S3: 'Battles and leveling: fight chapters, level Umas, earn Uma Shards and Laurels',
  S4: 'The Wilds: timed jobs, Craft Level, refining and the Exchange',
  S5: 'Learning District: class ranks, Weapon, Armor and Accessory Levels',
  S6: 'Extra Stats: Star Gems and the Sun-and-planets map',
  S7: 'Forge and equipment: crafting and bound gear',
  S8: 'The Rift and promotion into Tier 2',
}

export interface Place {
  id: string
  page: HubPage
  kind: PlaceKind
  name: string
  /** One or two lines from the design. */
  blurb: string
  /** What it will do once open: produces, trains, or the feature. */
  details: string[]
  /** Uma slot pips shown on the map (assigned Umas' icons later). */
  slots: number
  opensIn: SliceId
  /** Center on the page map, as fractions of its width and height. */
  at: { x: number; y: number }
  /** Reachable by URL and menu, but not drawn on the map (the Account). */
  hidden?: boolean
  /** A tap on the map opens its page at once, with no side panel (the Scenario Gate, D147). */
  direct?: boolean
  /** The uma-art building frame, when it isn't the id (the Rift's `rift`, H50). */
  frame?: string
}

/** The v1 Wilds' ten side spots. */
const WILDS_LAYOUT_V1: readonly { x: number; y: number }[] = [
  { x: 0.24, y: 0.1 }, { x: 0.74, y: 0.12 },
  { x: 0.2, y: 0.3 }, { x: 0.76, y: 0.32 },
  { x: 0.22, y: 0.51 }, { x: 0.78, y: 0.51 },
  { x: 0.22, y: 0.71 }, { x: 0.78, y: 0.7 },
  { x: 0.26, y: 0.9 }, { x: 0.74, y: 0.9 },
]

/** The Wilds' trios (FL32): five rows, gather left, workbench on the trunk, make right. Each row sits a hair below a
 * sixth of the map so it snaps to the same tile spacing on a short screen (24 rows at 375×667), leaving room for the
 * pips' arch (D233). */
const WILDS_LAYOUT: readonly { x: number; y: number }[] = [
  { x: 0.2, y: 0.155 }, { x: 0.5, y: 0.155 }, { x: 0.8, y: 0.155 },
  { x: 0.2, y: 0.315 }, { x: 0.5, y: 0.315 }, { x: 0.8, y: 0.315 },
  { x: 0.2, y: 0.475 }, { x: 0.5, y: 0.475 }, { x: 0.8, y: 0.475 },
  { x: 0.2, y: 0.635 }, { x: 0.5, y: 0.635 }, { x: 0.8, y: 0.635 },
  { x: 0.2, y: 0.795 }, { x: 0.5, y: 0.795 }, { x: 0.8, y: 0.795 },
]

interface SiteSpec {
  id: string
  name: string
  family: string
  effect: string
  firstItems: string
}

const GATHER_SITES: SiteSpec[] = [
  { id: 'monster-den', name: 'Monster Den', family: 'Hides & Scales', effect: 'HP', firstItems: 'Puffbun Pelt, Boarling Hide…' },
  { id: 'ley-spring', name: 'Ley Spring', family: 'Essences', effect: 'MP', firstItems: 'Mist Essence, Dew Essence…' },
  { id: 'mine', name: 'Mine', family: 'Ores', effect: 'ATK', firstItems: 'Copper Ore, Tin Ore, Iron Ore…' },
  { id: 'crystal-cavern', name: 'Crystal Cavern', family: 'Crystals', effect: 'M.ATK', firstItems: 'Quartz, Amethyst…' },
  { id: 'quarry', name: 'Quarry', family: 'Stones', effect: 'DEF', firstItems: 'Limestone, Sandstone…' },
  { id: 'meadow', name: 'Meadow', family: 'Fibers', effect: 'M.DEF', firstItems: 'Flax, Jute, Hemp…' },
  { id: 'forest', name: 'Forest', family: 'Woods', effect: 'Speed', firstItems: 'Pine Log, Birch Log…' },
  { id: 'fossil-dig', name: 'Fossil Dig', family: 'Bones & Horns', effect: 'Limit Break charge', firstItems: 'Seashell, Ammonite…' },
]

/** Map positions: sites take the outer slots, the Workbench and the Forge the middle row's ends. */
const SITE_SLOTS = [0, 1, 2, 3, 6, 7, 8, 9] as const
const STATION_SLOTS = [4, 5] as const
/** Uma slots at facility level 1 (pacing.ts `FACILITY_SLOTS`; this module stays free of the economy). */
const FIRST_SLOTS = 3

function sites(specs: SiteSpec[]): Place[] {
  return specs.map((s, i) => ({
    id: s.id,
    page: 'wilds',
    kind: 'gather-site',
    name: s.name,
    blurb: `Gathers ${s.family.toLowerCase()} while you're away, for the ${s.effect} stat.`,
    details: [`Produces ${s.family}: ${s.firstItems}`, `Effect family: ${s.effect}`, 'Three Uma slots; more with upgrades'],
    slots: FIRST_SLOTS,
    opensIn: 'S4',
    at: WILDS_LAYOUT_V1[SITE_SLOTS[i] ?? 0] ?? { x: 0.5, y: 0.5 },
  }))
}

const WILDS_V1: Place[] = [
  ...sites(GATHER_SITES),
  {
    id: 'workbench', page: 'wilds', kind: 'station', name: 'Workbench', opensIn: 'S4', slots: FIRST_SLOTS,
    blurb: 'Refines raw materials, one into one: ore into ingots, logs into planks.',
    details: ['Refines every Wilds family', 'Raises Craft Level'],
    at: WILDS_LAYOUT_V1[STATION_SLOTS[0]] ?? { x: 0.3, y: 0.5 },
  },
  {
    id: 'forge', page: 'wilds', kind: 'station', name: 'Forge', opensIn: 'S7', slots: FIRST_SLOTS,
    blurb: 'Crafts weapons, armor and accessories.',
    details: ['Two refined items of the grade; Craft Level sets the grades she can make', 'Weapons, armor and accessories in ten grades'],
    at: WILDS_LAYOUT_V1[STATION_SLOTS[1]] ?? { x: 0.7, y: 0.5 },
  },
  {
    id: 'lapidary', page: 'wilds', kind: 'station', name: 'Lapidary', opensIn: 'S6', slots: FIRST_SLOTS,
    blurb: 'Cuts Star Gems that open nodes on an Uma’s Extra Stats map.',
    details: ['Moon, bridge and Sun gems in ten grades, from refined Wilds items', 'Set them at the Observatory'],
    // On the trunk road between the Workbench and the Forge, a row below the upper sites' roads so it never cuts one.
    at: { x: 0.5, y: 0.5 },
  },
]

/** One Wilds place, at its trio's spot (`WILDS_LAYOUT`), the same in every tier. */
const placeV3 = (at: number, id: string, kind: PlaceKind, name: string, opensIn: SliceId, blurb: string, detail: string, frame?: string): Place => ({
  id, page: 'wilds', kind, name, blurb, details: [detail, 'Four slots, ×1.25'], slots: 4, opensIn, at: WILDS_LAYOUT[at]!, ...(frame ? { frame } : {}),
})

/** The Wilds' trios (D230, FL25–FL27): each line's gathering, processing and making places. */
const WILDS_V4: Place[] = [
  placeV3(0, 'mine', 'gather-site', 'Mine', 'S4', 'Mining: metal, G1–G10.', 'Ores G1–G10'),
  placeV3(1, 'mine-workbench', 'station', 'Mine Workbench', 'S4', 'Smelting: ores into ingots.', 'Processes Metal G1–G10'),
  placeV3(2, 'weapon-forge', 'station', 'Weapon Forge', 'S7', 'Arms Crafting: Arms Gems.', 'Makes Arms Gems G1–G10'),
  placeV3(3, 'fields', 'gather-site', 'Fields', 'S4', 'Farming: vegetables, G1–G10.', 'Vegetables G1–G10', 'vegetable-garden'),
  placeV3(4, 'fields-workbench', 'station', 'Fields Workbench', 'S4', 'Prepping: vegetables into cuts.', 'Processes Vegetables G1–G10'),
  placeV3(5, 'tome-forge', 'station', 'Tome Forge', 'S7', 'Tome Crafting: Tome Ink.', 'Makes Tome Ink G1–G10'),
  placeV3(6, 'forest', 'gather-site', 'Forest', 'S4', 'Wood Chopping: wood, G1–G10.', 'Logs G1–G10'),
  placeV3(7, 'forest-workbench', 'station', 'Forest Workbench', 'S4', 'Sawing: logs into planks.', 'Processes Wood G1–G10'),
  placeV3(8, 'armorer', 'station', 'Armorer', 'S7', 'Armor Crafting: Armor Fittings.', 'Makes Armor Fittings G1–G10', 'lancers-barracks'),
  placeV3(9, 'fishery', 'gather-site', 'Fishery', 'S4', 'Fishing: fish, G1–G10.', 'Fish G1–G10'),
  placeV3(10, 'fishery-workbench', 'station', 'Fishery Workbench', 'S4', 'Filleting: fish into fillets.', 'Processes Fish G1–G10'),
  placeV3(11, 'charm-forge', 'station', 'Charm Forge', 'S7', 'Accessory Crafting: Accessory Settings.', 'Makes Accessory Settings G1–G10'),
  placeV3(12, 'monster-den', 'gather-site', 'Monster Den', 'S4', 'Hunting: stone, G1–G10.', 'Stones G1–G10'),
  placeV3(13, 'den-workbench', 'station', 'Den Workbench', 'S4', 'Stonecutting: stones into cut stones.', 'Processes Stone G1–G10'),
  placeV3(14, 'lapidary', 'station', 'Lapidary', 'S6', 'Jewel Crafting: Planet and Moon Jewels.', 'Makes Planet and Moon Jewels I–V'),
]

/** The Wilds by generation (H77), as `learningPlaces`: today's eleven facilities to engine v16, the ten places from v17
 * (the Wilds' trios since H114). */
export function wildsPlaces(engine: number = BATTLE_ENGINE_VERSION): Place[] {
  return rpgRework('economy', engine) ? WILDS_V4 : WILDS_V1
}

/** The Learning District's class halls are its Halls of Heroes (D106): four Hero seats each, each seat's Hero with up to
 * ten Learners who inherit her unique Limit Break. */
function hall(id: string, name: string, cls: string, at: { x: number; y: number }): Place {
  return { id, page: 'learning', kind: 'class-hall', name, opensIn: 'S7', slots: 4, at,
    blurb: `The ${cls} Hall of Heroes: four Heroes, each with her own Limit Break, and their Learners.`,
    details: ['A Hero always uses her seat’s Limit Break, at full strength.', 'Learners inherit it at 50%, plus 5% a Bond Level.'] }
}

const OBSERVATORY: Place = {
  id: 'observatory', page: 'learning', kind: 'town', name: 'Observatory', opensIn: 'S6', slots: 0, at: { x: 0.5, y: 0.84 },
  blurb: "Each Uma's Extra Stats map: a Sun, eight planets and their moons.",
  details: ['100 nodes per Uma per tier', 'Star Gems open nodes; level sets how many are active'],
}

/** The Learning page by generation (D178, H59). Classes v1: the five halls as they stand. Classes v2 adds the Paladin
 * Bastion (uma-art's `knights-bastion` keep) and pairs the mirrors across the trunk road: physical-led halls on the left,
 * magic-led on the right (Brawler and Mage, Spell Blade and Summoner, Paladin and Cleric), the Observatory below. */
export function learningPlaces(engine: number = BATTLE_ENGINE_VERSION): Place[] {
  if (!rpgV2(engine)) {
    return [
      hall('brawler-dojo', 'Brawler Dojo', 'Brawler', { x: 0.24, y: 0.1 }),
      hall('mage-tower', 'Mage Tower', 'Mage', { x: 0.76, y: 0.11 }),
      hall('spell-blade-salle', 'Spell Blade Salle', 'Spell Blade', { x: 0.22, y: 0.33 }),
      hall('cleric-chapel', 'Cleric Chapel', 'Cleric', { x: 0.78, y: 0.33 }),
      hall('summoner-circle', 'Summoner Circle', 'Summoner', { x: 0.5, y: 0.56 }),
      OBSERVATORY,
    ]
  }
  return [
    hall('brawler-dojo', 'Brawler Dojo', 'Brawler', { x: 0.24, y: 0.1 }),
    hall('mage-tower', 'Mage Tower', 'Mage', { x: 0.76, y: 0.11 }),
    hall('spell-blade-salle', 'Spell Blade Salle', 'Spell Blade', { x: 0.22, y: 0.33 }),
    hall('summoner-circle', 'Summoner Circle', 'Summoner', { x: 0.78, y: 0.33 }),
    { ...hall('paladin-bastion', 'Paladin Bastion', 'Paladin', { x: 0.24, y: 0.56 }), frame: 'knights-bastion' },
    hall('cleric-chapel', 'Cleric Chapel', 'Cleric', { x: 0.76, y: 0.56 }),
    OBSERVATORY,
  ]
}

/** Town Hall (D147): the four corners as uma-racer's, and its plaza (`TOWN_PLAZA`) where the featured Uma stands. */
const TOWN_V1: Place[] = [
  {
    id: 'stable', page: 'town', kind: 'town', name: 'Stable', opensIn: 'S1', slots: 0, at: { x: 0.24, y: 0.18 },
    blurb: 'Every Uma outfit, locked or yours. Uma Tickets open new ones.',
    details: ['Browse all outfits and their profiles', 'Uma Tickets open outfits; five Uma Shards make a Ticket'],
  },
  {
    id: 'party-hall', page: 'town', kind: 'town', name: 'Party Hall', opensIn: 'S2', slots: 0, at: { x: 0.76, y: 0.18 },
    blurb: 'Twenty parties of five.',
    details: ['Build and name parties', 'Pick the party that fights'],
  },
  {
    id: 'warehouse', page: 'town', kind: 'town', name: 'Warehouse', opensIn: 'S4', slots: 0, at: { x: 0.24, y: 0.72 },
    blurb: 'Every item you own: materials, Star Gems and gear.',
    details: ['80 raw and 80 refined items across 8 families', 'Filled by the sites, the Workbench, the Forge, the Lapidary and the Exchange'],
  },
  {
    id: 'exchange', page: 'town', kind: 'town', name: 'Exchange', opensIn: 'S4', slots: 0, at: { x: 0.76, y: 0.72 },
    blurb: 'Laurels buy raw items and tickets here; Marks buy Manuals.',
    details: ['Raw items of every continent you have reached', 'Speed Ticket: 30 minutes off any job', 'Sweep: clear a beaten regular stage now'],
  },
  {
    id: 'account', page: 'town', kind: 'town', name: 'Account', opensIn: 'S1', slots: 0, at: { x: 0.5, y: 0.5 }, hidden: true,
    blurb: 'Your trainer, your wallet and the app.',
    details: [],
  },
]

/** R2's Warehouse and Exchange (H77): materials and made items, raw materials by pair. */
const TOWN_V3: Place[] = TOWN_V1.map((p): Place => {
  if (p.id === 'warehouse') {
    return { ...p, blurb: 'Every item you own: materials and made items.', details: ['Materials and made items', 'Filled by the Wilds and the Exchange'] }
  }
  if (p.id === 'exchange') {
    return { ...p, details: ['Raw materials by pair', 'Speed Ticket: 30 minutes off any job', 'Sweep: clear a beaten regular stage now'] }
  }
  return p
})

/** Town Hall by generation (H77): the Warehouse's and the Exchange's words follow the economy. */
export function townPlaces(engine: number = BATTLE_ENGINE_VERSION): Place[] {
  return rpgRework('economy', engine) ? TOWN_V3 : TOWN_V1
}

/** Where the featured Uma stands on Town Hall's road, kept clear of props (D147). */
export const TOWN_PLAZA = { x: 0.5, y: 0.45 } as const

/** Battle (D147), the raised centre tab: the world map, straight from the map, and the Rift (H50; the id is the Tier
 * Finale's, so saves, links and the menu don't move). */
const BATTLE: Place[] = [
  {
    id: 'scenario-gate', page: 'battle', kind: 'battle', name: 'Scenario Gate', opensIn: 'S1', slots: 0, at: { x: 0.5, y: 0.3 }, direct: true,
    blurb: 'The world map: five continents of regions to clear.',
    details: ['Tier 1: five continents of 40 regions', 'Fight rivals with a party of five: EXP, Uma Shards and Laurels'],
  },
  {
    id: 'tier-finale', page: 'battle', kind: 'battle', name: 'The Rift', opensIn: 'S8', slots: 0, at: { x: 0.5, y: 0.72 }, frame: 'rift',
    blurb: 'Twenty Lv 50 Umas seal four fronts, then ascend together.',
    details: ['Four fronts of twelve stages, then the Convergence', 'Echoes: repeatable fights for Class and gear ranks', 'Ascend: all twenty move up a tier'],
  },
]

/** Every place of the live generation: a place R2 removes has none (a stale link falls back to its page). */
export const PLACES: readonly Place[] = [...townPlaces(), ...learningPlaces(), ...BATTLE, ...wildsPlaces()]

const BY_ID = new Map(PLACES.map((p) => [p.id, p]))

export function isHubPage(value: string | undefined): value is HubPage {
  return (HUB_PAGES as readonly string[]).includes(value ?? '')
}

export function placeById(id: string | undefined): Place | undefined {
  return id === undefined ? undefined : BY_ID.get(id)
}

/** Places drawn on a page's map, in registry order. */
export function placesOn(page: HubPage): Place[] {
  return PLACES.filter((p) => p.page === page && !p.hidden)
}

/** The place a URL names, only when it lives on that page. */
export function placeOnPage(page: HubPage, id: string | undefined): Place | undefined {
  const place = placeById(id)
  return place && place.page === page ? place : undefined
}

export function isOpen(place: Place, current: SliceId): boolean {
  return SLICES.indexOf(place.opensIn) <= SLICES.indexOf(current)
}

/** The slice the deployed build implements. */
export const CURRENT_SLICE: SliceId = 'S8'

/** The Rift's place id (the Tier Finale's, kept). */
const RIFT_PLACE = 'tier-finale'
const COUNT_WORDS: readonly string[] = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']

/** Whether a place is open in this tier's world (H50): built in this slice, and the Rift only when the world has five Lv 50
 * Umas in a tier that runs one (`riftOpen`). No world (before boot) keeps the Rift shut. */
export function placeOpen(place: Place, world: { umas: Readonly<Record<string, { level: number }>> } | null, tier: number): boolean {
  if (!isOpen(place, CURRENT_SLICE)) return false
  return place.id !== RIFT_PLACE || (world !== null && riftOpen(world, tier))
}

/** Why a place is shut, in a few words, or null when it's open: the Rift waits on its world, the rest on their slice. */
export function placeLock(place: Place, world: { umas: Readonly<Record<string, { level: number }>> } | null, tier: number): string | null {
  if (placeOpen(place, world, tier)) return null
  if (place.id !== RIFT_PLACE || !isOpen(place, CURRENT_SLICE)) return 'Not open yet'
  return (RIFT_TIERS as readonly number[]).includes(tier) ? `Opens at ${COUNT_WORDS[RIFT_OPEN_AT] ?? RIFT_OPEN_AT} Lv 50 Umas` : 'No Rift in this tier yet'
}

