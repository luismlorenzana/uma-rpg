// The place registry (D33): every place on the Hub's four pages, one source for the map, the hit targets, the global
// menu and the routes. Design: docs/design/game-design.md §9; slice spec docs/slices/S1-hub.md.

export const HUB_PAGES = ['farmlands', 'wilds', 'learning', 'town'] as const
export type HubPage = (typeof HUB_PAGES)[number]

export const HUB_PAGE_NAMES: Record<HubPage, string> = {
  farmlands: 'Farmlands',
  wilds: 'Wilds',
  learning: 'Learning',
  town: 'Town',
}

export type PlaceKind = 'farm-site' | 'gather-site' | 'station' | 'class-hall' | 'armory' | 'town'

export const SLICES = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'] as const
export type SliceId = (typeof SLICES)[number]

/** One line per slice, for "Opens in S#" banners (docs/plan.md). */
export const SLICE_GOALS: Record<SliceId, string> = {
  S1: 'The Hub and foundation',
  S2: 'Collection and parties: unlock Umas, build parties',
  S3: 'Battles and leveling: fight chapters, level Umas, earn Shards and Laurels',
  S4: 'Farmlands and Wilds: timed jobs, professions, refining and the Exchange',
  S5: 'Learning District: class ranks and gear mastery',
  S6: 'Kitchen and Extra Stats: cooking and the Sun-and-planets map',
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
  /** The place's twin on the mirrored page (Farmlands ↔ Wilds, D-design §9). */
  mirrorOf?: string
  /** Reachable by URL and menu, but not drawn on the map (the Account). */
  hidden?: boolean
}

/** Farmlands and Wilds share one layout, site for site. Index = position. */
const MIRROR_LAYOUT: readonly { x: number; y: number }[] = [
  { x: 0.24, y: 0.1 }, { x: 0.74, y: 0.12 },
  { x: 0.2, y: 0.3 }, { x: 0.76, y: 0.32 },
  { x: 0.3, y: 0.51 }, { x: 0.7, y: 0.51 },
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

const FARM_SITES: SiteSpec[] = [
  { id: 'fields', name: 'Fields', family: 'Grains', effect: 'HP', firstItems: 'Wheat, Oats, Barley…' },
  { id: 'orchard', name: 'Orchard', family: 'Fruits', effect: 'MP', firstItems: 'Apple, Pear, Peach…' },
  { id: 'fishery', name: 'Fishery', family: 'Fish', effect: 'ATK', firstItems: 'Carp, Trout, Sardine…' },
  { id: 'herb-garden', name: 'Herb Garden', family: 'Herbs & Spices', effect: 'M.ATK', firstItems: 'Basil, Mint, Rosemary…' },
  { id: 'vegetable-garden', name: 'Vegetable Garden', family: 'Vegetables', effect: 'DEF', firstItems: 'Carrot, Potato, Cabbage…' },
  { id: 'mushroom-cave', name: 'Mushroom Cave', family: 'Mushrooms', effect: 'M.DEF', firstItems: 'Button Mushroom, Shiitake…' },
  { id: 'sugar-grove', name: 'Sugar Grove', family: 'Sweets', effect: 'Speed', firstItems: 'Honeycomb, Sugarcane…' },
  { id: 'nut-grove', name: 'Nut Grove', family: 'Nuts & Seeds', effect: 'Limit Break charge', firstItems: 'Peanut, Sunflower Seed…' },
]

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

/** Map positions for each side: sites take the outer slots, the two stations the middle row. */
const SITE_SLOTS = [0, 1, 2, 3, 6, 7, 8, 9] as const
const STATION_SLOTS = [4, 5] as const

function sites(page: HubPage, kind: PlaceKind, specs: SiteSpec[], mirrors: SiteSpec[], verb: string): Place[] {
  return specs.map((s, i) => ({
    id: s.id,
    page,
    kind,
    name: s.name,
    blurb: `${verb} ${s.family.toLowerCase()} while you're away. ${s.family} feed the ${s.effect} effect.`,
    details: [`Produces ${s.family}: ${s.firstItems}`, `Effect family: ${s.effect}`, 'Two Uma slots; more with upgrades'],
    slots: 2,
    opensIn: 'S4',
    at: MIRROR_LAYOUT[SITE_SLOTS[i] ?? 0] ?? { x: 0.5, y: 0.5 },
    mirrorOf: mirrors[i]?.id,
  }))
}

const FARMLANDS: Place[] = [
  ...sites('farmlands', 'farm-site', FARM_SITES, GATHER_SITES, 'Grows'),
  {
    id: 'pantry', page: 'farmlands', kind: 'station', name: 'Pantry', opensIn: 'S4', slots: 2, mirrorOf: 'workbench',
    blurb: 'Refines raw ingredients, one into one: wheat into flour, fruit into preserves.',
    details: ['Refines every farming family', 'Raises Farming & Cooking'],
    at: MIRROR_LAYOUT[STATION_SLOTS[0]] ?? { x: 0.3, y: 0.5 },
  },
  {
    id: 'kitchen', page: 'farmlands', kind: 'station', name: 'Kitchen', opensIn: 'S6', slots: 2, mirrorOf: 'forge',
    blurb: 'Cooks dishes from refined ingredients. Each new dish an Uma eats unlocks an Extra Stats node.',
    details: ['Dishes, Duo dishes and Feasts', 'Feeds the Observatory’s Sun-and-planets map'],
    at: MIRROR_LAYOUT[STATION_SLOTS[1]] ?? { x: 0.7, y: 0.5 },
  },
]

const WILDS: Place[] = [
  ...sites('wilds', 'gather-site', GATHER_SITES, FARM_SITES, 'Gathers'),
  {
    id: 'workbench', page: 'wilds', kind: 'station', name: 'Workbench', opensIn: 'S4', slots: 2, mirrorOf: 'pantry',
    blurb: 'Refines raw materials, one into one: ore into ingots, logs into planks.',
    details: ['Refines every gathering family', 'Raises Gathering & Crafting'],
    at: MIRROR_LAYOUT[STATION_SLOTS[0]] ?? { x: 0.3, y: 0.5 },
  },
  {
    id: 'forge', page: 'wilds', kind: 'station', name: 'Forge', opensIn: 'S7', slots: 2, mirrorOf: 'kitchen',
    blurb: 'Crafts weapons, armor and accessories. Gear binds to the Uma who equips it.',
    details: ['Main material sets the type; accent sets the effect', 'Ten grades per tier world'],
    at: MIRROR_LAYOUT[STATION_SLOTS[1]] ?? { x: 0.7, y: 0.5 },
  },
]

function hall(id: string, name: string, cls: string, style: string, at: { x: number; y: number }): Place {
  return {
    id, page: 'learning', kind: 'class-hall', name, opensIn: 'S5', slots: 2, at,
    blurb: `Trains ${cls} proficiency. Each rank opens a deeper tier of ${cls} skills.`,
    details: [`Ranks 1–6 (rank 1 learns no skills)`, `${style} aptitude sets the training speed`],
  }
}

function armory(id: string, name: string, distance: string, gear: string, at: { x: number; y: number }): Place {
  return {
    id, page: 'learning', kind: 'armory', name, opensIn: 'S5', slots: 2, at,
    blurb: `Trains mastery of ${gear}. Mastery rank k lets an Uma equip grade-k gear of that type.`,
    details: [`Ranks 1–10 per gear type`, `${distance} aptitude sets the training speed`],
  }
}

const LEARNING: Place[] = [
  hall('brawler-dojo', 'Brawler Dojo', 'Brawler', 'Front Runner', { x: 0.24, y: 0.1 }),
  hall('mage-tower', 'Mage Tower', 'Mage', 'Pace Chaser', { x: 0.76, y: 0.11 }),
  hall('spell-blade-salle', 'Spell Blade Salle', 'Spell Blade', 'Pace Chaser', { x: 0.22, y: 0.31 }),
  hall('cleric-chapel', 'Cleric Chapel', 'Cleric', 'Late Surger', { x: 0.78, y: 0.31 }),
  hall('summoner-circle', 'Summoner Circle', 'Summoner', 'End Closer', { x: 0.5, y: 0.5 }),
  armory('rangers-lodge', "Ranger's Lodge", 'Sprint', 'Short Swords, Bows and Garb', { x: 0.24, y: 0.7 }),
  armory('lancers-barracks', "Lancer's Barracks", 'Mile', 'Spears, Axes and Leather', { x: 0.76, y: 0.7 }),
  armory('arcane-armory', 'Arcane Armory', 'Medium', 'Mage Staves, Arcane Staves and Mail', { x: 0.26, y: 0.9 }),
  armory('knights-bastion', "Knight's Bastion", 'Long', 'Greatswords, Cleric Staves, Summoner Tomes and Plate', { x: 0.74, y: 0.9 }),
]

const TOWN: Place[] = [
  {
    id: 'stable', page: 'town', kind: 'town', name: 'Stable', opensIn: 'S1', slots: 0, at: { x: 0.26, y: 0.12 },
    blurb: 'Every Uma outfit, locked or yours. Unlock Tickets open new ones.',
    details: ['Browse all outfits and their profiles', 'Unlocking opens in S2'],
  },
  {
    id: 'party-hall', page: 'town', kind: 'town', name: 'Party Hall', opensIn: 'S2', slots: 0, at: { x: 0.75, y: 0.13 },
    blurb: 'Twenty parties of five. Members stay in their party; busy ones show greyed out.',
    details: ['Build and name parties', 'Busy members must be recalled before a fight'],
  },
  {
    id: 'scenario-gate', page: 'town', kind: 'town', name: 'Scenario Gate', opensIn: 'S1', slots: 0, at: { x: 0.5, y: 0.36 },
    blurb: 'The chapters of your tier: one scenario each, ten levels each.',
    details: ['Tier 1: URA Finale → Grand Masters', 'Fight PriConne rivals with a party of five: EXP, Shards and Laurels'],
  },
  {
    id: 'warehouse', page: 'town', kind: 'town', name: 'Warehouse', opensIn: 'S4', slots: 0, at: { x: 0.24, y: 0.6 },
    blurb: 'Every item you own: ingredients, materials, dishes and gear.',
    details: ['160 raw and 160 refined items across 16 families', 'Fills up once jobs open in S4'],
  },
  {
    id: 'exchange', page: 'town', kind: 'town', name: 'Exchange', opensIn: 'S4', slots: 0, at: { x: 0.76, y: 0.6 },
    blurb: 'Spend Laurels from battles on raw items, Rush Tickets and Sweep Tickets.',
    details: ['Raw items of every chapter you have reached', 'Rush: finish a farm job now', 'Sweep: clear a beaten regular fight now'],
  },
  {
    id: 'observatory', page: 'town', kind: 'town', name: 'Observatory', opensIn: 'S6', slots: 0, at: { x: 0.25, y: 0.86 },
    blurb: "Each Uma's Extra Stats map: a Sun, eight planets and their moons.",
    details: ['100 nodes per Uma per tier', 'Dishes unlock nodes; level sets how many are active'],
  },
  {
    id: 'tier-finale', page: 'town', kind: 'town', name: 'Tier Finale', opensIn: 'S8', slots: 0, at: { x: 0.75, y: 0.86 },
    blurb: "The tier's great final event. Win it with an Uma at Lv50 to promote her to the next tier.",
    details: ['Harder fights or party switching', 'Promotion moves her to Tier 2 at Lv1'],
  },
  {
    id: 'account', page: 'town', kind: 'town', name: 'Account', opensIn: 'S1', slots: 0, at: { x: 0.5, y: 0.5 }, hidden: true,
    blurb: 'Your trainer, your wallet and the app.',
    details: [],
  },
]

export const PLACES: readonly Place[] = [...FARMLANDS, ...WILDS, ...LEARNING, ...TOWN]

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
export const CURRENT_SLICE: SliceId = 'S3'
