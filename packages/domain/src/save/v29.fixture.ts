// Test-only (excluded from the build): a full-shaped v29 save for save v30's migration (H110, chained by H112;
// farm-by-line.md FL17–FL19). R2's catalog and env are gone since H112, so its R2 parts are literals here: R2's sixty
// ids (`R2_TYPES`, as H77's catalog held them) and the engine's work rows as R2 wrote them:
// - a Paladin (Craft Lv 26) processing Iron Ingot ×8 at the Workbench, two collected;
// - a Brawler (Craft Lv 12) making Weapon Gem G2 ×3 at the Forge (R2's recipe, 2 Copper Ingot and 2 Pine Plank), none
//   collected;
// - a Summoner (Craft Lv 30) gathering Sardine ×5 at the Fishery, a queued Sardine ×2 behind her;
// - a Mage (Craft Lv 1) at rest, graded on a Fire Tome and a Katana;
// - R2's twenty Tier 1 ids in stock, each at a count of its own (1 … 20, in R2's catalog order, so sums read back),
//   Weapon Gems G1 ×2, Armor Fittings G1 and Planet Jewel I, Laurels, tickets, a target and a grant;
// a Tier 2 world with a little stock, and a Tier 3 world holding all sixty ids at 1 … 60 (a v29 world held its own tier's
// types and every tier's below, so only Tier 3 held them all).
import type { Entry, WorkRow } from '@luismlorenzana/uma-work'
import type { MaterialLine } from '../items/lines'
import type { RpgWorkRequest } from '../work/request'
import { gradedUma, gradedWorld } from './economy-v3.fixture'
import type { Save, TierGrant, TierWorld } from './save'

export const V29_T0 = '2026-10-26T12:00:00.000Z'
const T0 = Date.parse(V29_T0)

/** R2's sixty ids by line: each tier's low then high type, raw then refined (H77's catalog). */
const R2_LINES: Readonly<Record<MaterialLine, readonly (readonly [string, string])[]>> = {
  metal: [['copper-ore', 'copper-ingot'], ['iron-ore', 'iron-ingot'], ['gold-ore', 'gold-ingot'], ['titanium-ore', 'titanium-ingot'],
    ['mythril-ore', 'mythril-ingot'], ['orichalcum-ore', 'orichalcum-ingot']],
  wood: [['pine-log', 'pine-plank'], ['cedar-log', 'cedar-plank'], ['cherry-log', 'cherry-plank'], ['ebony-log', 'ebony-plank'],
    ['elderwood-log', 'elderwood-plank'], ['yggdrasil-branch', 'yggdrasil-plank']],
  vegetables: [['carrot', 'chopped-carrot'], ['cabbage', 'shredded-cabbage'], ['bell-pepper', 'sliced-bell-pepper'], ['asparagus', 'trimmed-asparagus'],
    ['golden-carrot', 'golden-carrot-puree'], ['emperor-pumpkin', 'pumpkin-puree']],
  fish: [['carp', 'carp-fillet'], ['sardine', 'sardine-fillet'], ['sea-bream', 'sea-bream-fillet'], ['tuna', 'tuna-fillet'],
    ['silverfin', 'silverfin-fillet'], ['rainbow-koi', 'rainbow-koi-fillet']],
  stone: [['quartz', 'cut-quartz'], ['citrine', 'cut-citrine'], ['sapphire', 'cut-sapphire'], ['diamond', 'cut-diamond'],
    ['starstone', 'cut-starstone'], ['philosophers-stone', 'cut-philosophers-stone']],
}
export interface R2Type { id: string; line: MaterialLine; tier: 1 | 2 | 3; band: 'low' | 'high'; refined: boolean }
/** R2's sixty ids in its catalog's order: line by line, tier by tier, low before high, raw before refined. */
export const R2_TYPES: readonly R2Type[] = (Object.entries(R2_LINES) as [MaterialLine, typeof R2_LINES[MaterialLine]][]).flatMap(([line, pairs]) =>
  pairs.flatMap(([raw, refined], i): R2Type[] => {
    const tier = (Math.floor(i / 2) + 1) as 1 | 2 | 3, band = i % 2 === 0 ? 'low' as const : 'high' as const
    return [{ id: raw, line, tier, band, refined: false }, { id: refined, line, tier, band, refined: true }]
  }))

/** R2's twenty Tier 1 ids in stock, the i-th at i + 1. */
export const V29_MATERIAL_STOCK: Readonly<Record<string, number>> = Object.fromEntries(R2_TYPES.filter((m) => m.tier === 1).map((m, i) => [m.id, i + 1]))
/** R2's sixty ids in stock, the i-th of its catalog at i + 1: a Tier 3 world's. */
export const V29_ALL_STOCK: Readonly<Record<string, number>> = Object.fromEntries(R2_TYPES.map((m, i) => [m.id, i + 1]))
export const V29_MADE_STOCK: Readonly<Record<string, number>> = { 'weapon-gem-g1': 2, 'armor-fittings-g1': 1, 'jewel-planet-1': 1 }

const GRANT: TierGrant = {
  tickets: 1200, floor: 40, umas: { '201': { level: 30, exp: 10, tickets: 1200 } }, deleted: { gear: 3, gems: 1, upgrades: 0 },
  back: { laurels: 0, items: 0, stock: 0 }, seen: true,
}

/** One running entry as R2's engine wrote it: `count` items of `seconds` each, paying `exp` each, `collected` of them paid. */
function entry(request: RpgWorkRequest, seconds: number, exp: number, inputs: readonly { item: string; qty: number }[], collected: number): Entry<RpgWorkRequest> {
  const n = request.count
  return {
    request, seconds: Array(n).fill(seconds), inputs: Array(n).fill(inputs), outputs: Array(n).fill({ item: request.item }), exp: Array(n).fill(exp),
    startedAt: T0, acceleratedMs: 0, collected, speed: 1.25, fromQueue: false,
  }
}
function row(outfitId: string, building: string, running: Entry<RpgWorkRequest>, queue: readonly RpgWorkRequest[] = []): WorkRow<RpgWorkRequest> {
  return { outfitId, slot: { building, slot: 0 }, entries: [running], queue, last: null, dropped: null }
}

/** The Tier 1 world, as R2 left it at save v29. */
export function v29World(): TierWorld {
  const umas = {
    '201': gradedUma({ classId: 'paladin', craft: { level: 26, exp: 100 } }),
    '202': gradedUma({ classId: 'brawler', craft: { level: 12, exp: 0 } }),
    '203': gradedUma({ classId: 'summoner', craft: { level: 30, exp: 0 } }),
    '204': gradedUma({
      classId: 'mage', level: 20, craft: { level: 1, exp: 0 },
      gear: { weapons: { 'tome-fire': { grade: 2 }, katana: { grade: 3 } }, armor: { head: { grade: 1 } }, accessories: [{ grade: 1, family: 'orb', form: 'base', kind: 'fire' }] },
    }),
  }
  const world = gradedWorld({ umas, items: { ...V29_MATERIAL_STOCK, ...V29_MADE_STOCK }, targets: ['204'] })
  const work: TierWorld['work'] = {
    '201': row('201', 'workbench', entry({ kind: 'refine', item: 'iron-ingot', count: 8 }, 538, 22, [{ item: 'iron-ore', qty: 1 }], 2)),
    '202': row('202', 'forge', entry({ kind: 'craft', item: 'weapon-gem-g2', count: 3 }, 9590, 400,
      [{ item: 'copper-ingot', qty: 2 }, { item: 'pine-plank', qty: 2 }], 0)),
    '203': row('203', 'fishery', entry({ kind: 'gather', item: 'sardine', count: 5 }, 2081, 87, [], 0), [{ kind: 'gather', item: 'sardine', count: 2 }]),
  }
  return { ...world, work, wallet: { ...world.wallet, laurels: 4321, timeTickets: 1200 }, grant: GRANT }
}

/** A Tier 2 world's stock: R2's Tier 2 types beside a Tier 1 high type. */
export const V29_TIER2_STOCK: Readonly<Record<string, number>> = { 'gold-ore': 4, 'titanium-ingot': 3, 'iron-ore': 2, 'sea-bream-fillet': 5 }

/** The whole save at v29: the Tier 1 world, a Tier 2 world and a Tier 3 world. */
export function v29Save(): Save {
  return {
    schemaVersion: 29 as Save['schemaVersion'],
    account: { trainerName: 'Tester', createdAt: V29_T0, updatedAt: V29_T0, achievements: {}, history: {}, defeated: {} },
    tierWorlds: {
      '1': v29World(),
      '2': gradedWorld({ items: { ...V29_TIER2_STOCK }, umas: { '301': gradedUma() } }),
      '3': gradedWorld({ items: { ...V29_ALL_STOCK }, umas: { '401': gradedUma() } }),
    },
  }
}
