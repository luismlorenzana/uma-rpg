// The place registry (D33, D144, D147): every place on the Hub's four pages, in the bottom bar's order (Town Hall ·
// Learning · Battle · Wilds, the sibling apps' Home · Grow · Play · Work), one source for the map, the hit targets, the
// global menu and the routes. Design: docs/design/game-design.md §9; slice spec docs/slices/S1-hub.md.

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

/** One line per slice, for "Opens in S#" banners (docs/plan.md). */
export const SLICE_GOALS: Record<SliceId, string> = {
  S1: 'The Hub and foundation',
  S2: 'Collection and parties: unlock Umas, build parties',
  S3: 'Battles and leveling: fight chapters, level Umas, earn Uma Shards and Laurels',
  S4: 'The Wilds: timed jobs, Craft Level, refining and the Exchange',
  S5: 'Learning District: class ranks, Weapon, Armor and Accessory Levels',
  S6: 'Extra Stats: Star Gems and the Sun-and-planets map',
  S7: 'Forge and equipment: crafting and bound gear',
  S8: 'Tier Finale and promotion into Tier 2',
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
}

/** The Wilds' layout: eight sites in two columns, the Workbench and the Forge in the middle row with the Lapidary between
 * them. Index = position. */
const WILDS_LAYOUT: readonly { x: number; y: number }[] = [
  { x: 0.24, y: 0.1 }, { x: 0.74, y: 0.12 },
  { x: 0.2, y: 0.3 }, { x: 0.76, y: 0.32 },
  { x: 0.22, y: 0.51 }, { x: 0.78, y: 0.51 },
  { x: 0.22, y: 0.71 }, { x: 0.78, y: 0.7 },
  { x: 0.26, y: 0.9 }, { x: 0.74, y: 0.9 },
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
    at: WILDS_LAYOUT[SITE_SLOTS[i] ?? 0] ?? { x: 0.5, y: 0.5 },
  }))
}

const WILDS: Place[] = [
  ...sites(GATHER_SITES),
  {
    id: 'workbench', page: 'wilds', kind: 'station', name: 'Workbench', opensIn: 'S4', slots: FIRST_SLOTS,
    blurb: 'Refines raw materials, one into one: ore into ingots, logs into planks.',
    details: ['Refines every Wilds family', 'Raises Craft Level'],
    at: WILDS_LAYOUT[STATION_SLOTS[0]] ?? { x: 0.3, y: 0.5 },
  },
  {
    id: 'forge', page: 'wilds', kind: 'station', name: 'Forge', opensIn: 'S7', slots: FIRST_SLOTS,
    blurb: 'Crafts weapons, armor and accessories.',
    details: ['Two refined items of the grade; Craft Level sets the grades she can make', 'Weapons, armor and accessories in ten grades'],
    at: WILDS_LAYOUT[STATION_SLOTS[1]] ?? { x: 0.7, y: 0.5 },
  },
  {
    id: 'lapidary', page: 'wilds', kind: 'station', name: 'Lapidary', opensIn: 'S6', slots: FIRST_SLOTS,
    blurb: 'Cuts Star Gems that open nodes on an Uma’s Extra Stats map.',
    details: ['Moon, bridge and Sun gems in ten grades, from refined Wilds items', 'Set them at the Observatory'],
    // On the trunk road between the Workbench and the Forge, a row below the upper sites' roads so it never cuts one.
    at: { x: 0.5, y: 0.5 },
  },
]

/** The Learning District's class halls are its Halls of Heroes (D106): four Hero seats each, each seat's Hero with up to
 * ten Learners who inherit her unique Limit Break. */
function hall(id: string, name: string, cls: string, at: { x: number; y: number }): Place {
  return { id, page: 'learning', kind: 'class-hall', name, opensIn: 'S7', slots: 4, at,
    blurb: `The ${cls} Hall of Heroes: four Heroes, each with her own Limit Break, and their Learners.`,
    details: ['A Hero always uses her seat’s Limit Break, at full strength.', 'Learners inherit it at 50%, plus 5% a Bond Level.'] }
}

const LEARNING: Place[] = [
  hall('brawler-dojo', 'Brawler Dojo', 'Brawler', { x: 0.24, y: 0.1 }),
  hall('mage-tower', 'Mage Tower', 'Mage', { x: 0.76, y: 0.11 }),
  hall('spell-blade-salle', 'Spell Blade Salle', 'Spell Blade', { x: 0.22, y: 0.33 }),
  hall('cleric-chapel', 'Cleric Chapel', 'Cleric', { x: 0.78, y: 0.33 }),
  hall('summoner-circle', 'Summoner Circle', 'Summoner', { x: 0.5, y: 0.56 }),
  {
    id: 'observatory', page: 'learning', kind: 'town', name: 'Observatory', opensIn: 'S6', slots: 0, at: { x: 0.5, y: 0.84 },
    blurb: "Each Uma's Extra Stats map: a Sun, eight planets and their moons.",
    details: ['100 nodes per Uma per tier', 'Star Gems open nodes; level sets how many are active'],
  },
]

/** Town Hall (D147): the four corners as uma-racer's, and its plaza (`TOWN_PLAZA`) where the featured Uma stands. */
const TOWN: Place[] = [
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

/** Where the featured Uma stands on Town Hall's road, kept clear of props (D147). */
export const TOWN_PLAZA = { x: 0.5, y: 0.45 } as const

/** Battle (D147), the raised centre tab: the world map, straight from the map, and the Tier Finale. */
const BATTLE: Place[] = [
  {
    id: 'scenario-gate', page: 'battle', kind: 'battle', name: 'Scenario Gate', opensIn: 'S1', slots: 0, at: { x: 0.5, y: 0.3 }, direct: true,
    blurb: 'The world map: five continents of regions to clear.',
    details: ['Tier 1: five continents of 40 regions', 'Fight rivals with a party of five: EXP, Uma Shards and Laurels'],
  },
  {
    id: 'tier-finale', page: 'battle', kind: 'battle', name: 'Tier Finale', opensIn: 'S8', slots: 0, at: { x: 0.5, y: 0.72 },
    blurb: "The tier's final event, and promotion to the next tier.",
    details: ['Harder fights or party switching', 'Promotion moves her to Tier 2 at Lv1'],
  },
]

export const PLACES: readonly Place[] = [...TOWN, ...LEARNING, ...BATTLE, ...WILDS]

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
export const CURRENT_SLICE: SliceId = 'S7'
