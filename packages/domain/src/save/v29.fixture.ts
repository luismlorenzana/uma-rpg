// Test-only (excluded from the build): a full-shaped v29 save for save v30's migration (H110; farm-by-line.md FL17–FL19),
// which H112's scratch migration copies. Its work runs on R2's own env (`rpgWorkEnv`, never the live one), so the rows
// are the engine's real shape whatever the switch says:
// - a Paladin (Craft Lv 26) processing Iron Ingot ×8 at the Workbench, two collected;
// - a Brawler (Craft Lv 12) making Weapon Gem G2 ×3 at the Forge, none collected;
// - a Summoner (Craft Lv 30) gathering Sardine ×5 at the Fishery, a queued Sardine ×2 behind her;
// - a Mage (Craft Lv 1) at rest, graded on a Fire Tome and a Katana;
// - R2's twenty Tier 1 ids in stock, each at a count of its own (1 … 20, in R2's catalog order, so sums read back),
//   Weapon Gems G1 ×2, Armor Fittings G1 and Planet Jewel I, Laurels, tickets, a target and a grant;
// a Tier 2 world with a little stock, and a Tier 3 world holding all sixty ids at 1 … 60 (a world holds its own tier's
// types and every tier's below, so only Tier 3 holds them all).
import { collect, isRefusal, queue, start, type OpResult } from '@luismlorenzana/uma-work'
import { MATERIAL_IDENTITIES } from '../items/materials-id'
import { rpgWorkEnv } from '../work/env-v3'
import { gradedUma, gradedWorld } from './economy-v3.fixture'
import type { Save, TierWorld, TierGrant } from './save'

export const V29_T0 = '2026-10-26T12:00:00.000Z'
const T0 = Date.parse(V29_T0)

const done = <R>(result: OpResult<R, TierWorld>): TierWorld => {
  if (isRefusal(result)) throw new Error(`v29 fixture: ${result.code}`)
  return result.state
}

/** R2's twenty Tier 1 ids in stock, the i-th at i + 1. */
export const V29_MATERIAL_STOCK: Readonly<Record<string, number>> = Object.fromEntries(MATERIAL_IDENTITIES.filter((m) => m.tier === 1).map((m, i) => [m.id, i + 1]))
/** R2's sixty ids in stock, the i-th of its catalog at i + 1: a Tier 3 world's. */
export const V29_ALL_STOCK: Readonly<Record<string, number>> = Object.fromEntries(MATERIAL_IDENTITIES.map((m, i) => [m.id, i + 1]))
export const V29_MADE_STOCK: Readonly<Record<string, number>> = { 'weapon-gem-g1': 2, 'armor-fittings-g1': 1, 'jewel-planet-1': 1 }

const GRANT: TierGrant = {
  tickets: 1200, floor: 40, umas: { '201': { level: 30, exp: 10, tickets: 1200 } }, deleted: { gear: 3, gems: 1, upgrades: 0 },
  back: { laurels: 0, items: 0, stock: 0 }, seen: true,
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
  const env = rpgWorkEnv(1)
  let world = gradedWorld({ umas, items: { 'iron-ore': 8, 'copper-ingot': 6, 'pine-plank': 6 }, targets: ['204'] })
  world = done(start(world, { outfitId: '201', slot: { building: 'workbench', slot: 0 }, request: { kind: 'refine', item: 'iron-ingot', count: 8 } }, T0, env))
  world = done(start(world, { outfitId: '202', slot: { building: 'forge', slot: 0 }, request: { kind: 'craft', item: 'weapon-gem-g2', count: 3 } }, T0, env))
  world = done(start(world, { outfitId: '203', slot: { building: 'fishery', slot: 0 }, request: { kind: 'gather', item: 'sardine', count: 5 } }, T0, env))
  world = done(queue(world, { outfitId: '203', add: { request: { kind: 'gather', item: 'sardine', count: 2 }, building: 'fishery' } }, T0, env))
  const each = world.work['201']!.entries[0]!.seconds[0]! * 1000
  world = done(collect(world, { outfitId: '201' }, T0 + 2 * each, env))
  return {
    ...world, items: { ...V29_MATERIAL_STOCK, ...V29_MADE_STOCK },
    wallet: { ...world.wallet, laurels: 4321, timeTickets: 1200 }, grant: GRANT,
  }
}

/** A Tier 2 world's stock: R2's Tier 2 types beside a Tier 1 high type. */
export const V29_TIER2_STOCK: Readonly<Record<string, number>> = { 'gold-ore': 4, 'titanium-ingot': 3, 'iron-ore': 2, 'sea-bream-fillet': 5 }

/** The whole save: the Tier 1 world, a Tier 2 world and a Tier 3 world. */
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
