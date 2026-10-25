// Test-only (excluded from the build): v27 worlds for save v28's migration and grant (H78; chained by H82). Raw JSON in
// v27's shapes, written as literals (not `newTierWorld`, which answers by the economy stage), outfit ids invented:
// - `richV27Save()`: R1's real-shaped save (`v27.fixture.ts`, run through `toV27`, labelled v27) with an economy on top:
//   Craft Levels (one banked past Lv 50), the legacy Warehouse across families and bands, gear in stock and in a locker,
//   Star Gems in stock and on a map, a facility at level 3 and one at level 2, Gear Marks, and three running entries (a
//   gather with one item collected and a queued request, a craft of two pieces, a cut of one gem), beside its open
//   world-map and Rift fights (engine v15);
// - the worked examples of profession-progression.md §14.5, one world each: `freshPlayer()`, `midPlayer()`,
//   `fullRoster()` (its Tier 1 world), `fullRosterTier2()` and `floorWorld()` (the floor at work).
import { FACILITIES } from '../economy/jobs'
import { EQUIP_TYPES } from '../economy/gear-id'
import { STAR_NODES } from '../economy/stars'
import { toV27 } from './migrations'
import { defaultParties, newWorldState } from './save'
import { migrated, V27_T, v26Save } from './v27.fixture'

type Raw = Record<string, unknown>
const [T0, T1] = V27_T

/** The first `n` gear ids of these grades, every type of a grade before the next grade: unique, as a locker holds them. */
export const pieceIds = (n: number, grades: readonly number[]): string[] => grades.flatMap((g) => EQUIP_TYPES.map((t) => `${t}-g${g}`)).slice(0, n)

/** A v27 Uma: a Brawler at Uma Lv 50 with this Craft Level, these pieces in her locker (none worn) and these nodes open. */
export function v27Uma(craft: { level: number; exp: number }, locker: readonly string[] = [], unlocked: readonly string[] = []): Raw {
  return {
    unlockedAt: T0, level: 50, exp: 0, classId: 'brawler', classes: {}, craft: { ...craft },
    ranks: { classes: {}, weapons: {}, armors: {}, accessories: {} }, stars: { unlocked: [...unlocked], active: [] },
    gear: { locker: [...locker], equipped: {}, kinds: {} }, bonds: {}, calling: { pick: null, confirmed: false },
  }
}

/** A v27 world with these Umas, everything else empty, and `extra` on top. */
export function v27World(umas: Record<string, Raw>, extra: Raw = {}): Raw {
  return {
    createdAt: T0, wallet: { unlockTickets: 0, shards: 0, laurels: 0, timeTickets: 0, sweepTickets: 0, gearMarks: 0, classMarks: 0 },
    umas, parties: defaultParties(), world: newWorldState(T0), items: {}, buildings: {}, work: {}, gems: {}, gear: {}, targets: [], heroes: {},
    rift: { runs: [], echoes: {}, battle: null, battles: 0 }, ...extra,
  }
}

/** The eleven legacy facilities, the first `n` at `level` (in the frozen catalog's order: the eight sites, then the
 * Workbench, the Forge and the Lapidary). */
export const facilitiesAt = (level: number, n = FACILITIES.length, from = 0): Record<string, { level: number }> =>
  Object.fromEntries(FACILITIES.slice(from, from + n).map((f) => [f.id, { level }]))

/** One started v27 entry making `count` of `item`, `collected` handed over, each paying `exp`. */
export function v27Entry(kind: 'gather' | 'refine' | 'craft' | 'cut', item: string, count: number, exp: number, collected = 0, inputs: readonly { item: string; qty: number }[] = []): Raw {
  return {
    request: { kind, item, count }, seconds: Array.from({ length: count }, () => 3000), inputs: Array.from({ length: count }, () => inputs.map((q) => ({ ...q }))),
    outputs: Array.from({ length: count }, () => ({ item })), exp: Array.from({ length: count }, () => exp), startedAt: Date.parse(T1), acceleratedMs: 0,
    collected, speed: 1, fromQueue: false,
  }
}
/** Her work row at `building` slot `slot`. */
export const v27Row = (outfitId: string, building: string, slot: number, entries: readonly Raw[], queue: readonly Raw[] = []): Raw =>
  ({ outfitId, slot: { building, slot }, entries: [...entries], queue: [...queue], last: null, dropped: null })

const ids = (from: number, n: number): string[] => Array.from({ length: n }, (_, i) => `${from + i}`)
const umasOf = (list: readonly [string, Raw][]): Record<string, Raw> => Object.fromEntries(list)

// --- The rich save ----------------------------------------------------------------------------------------------------

/** The rich world's legacy Warehouse: every family, both bands, raw and refined, and a collision (Ores G1 and G3 both
 * become Copper Ore). */
export const RICH_V27_ITEMS: Readonly<Record<string, number>> = {
  'copper-ore': 5, 'iron-ore': 3, 'gold-ore': 2, 'limestone-block': 4, 'cedar-log': 1, flax: 2, cloudweave: 1, 'mist-essence': 3,
  'unicorn-carving': 1, quartz: 2, 'dragon-scale': 1, 'puffbun-leather': 2,
}

/** R1's save as v27 with an economy on top, labelled v27: it parses today, and `toV28` turns it into v28's shape. */
export function richV27Save(): Raw & { tierWorlds: Record<string, Raw> } {
  const raw = migrated(v26Save(), toV27) as Raw & { tierWorlds: Record<string, Raw & { umas: Record<string, Raw> }> }
  raw.schemaVersion = 27
  const w = raw.tierWorlds['1']!
  const uma = (id: string) => w.umas[id] as Raw & { gear: Raw }
  uma('100').craft = { level: 50, exp: 30_000 }
  uma('100').gear = { ...uma('100').gear, locker: ['greatsword-g1', 'axe-g2'] }
  uma('101').craft = { level: 36, exp: 0 }
  uma('101').stars = { unlocked: ['moon:hp:1', 'moon:hp:2', 'sun:1'], active: ['moon:hp:1'] }
  uma('102').craft = { level: 26, exp: 100 }
  uma('103').craft = { level: 11, exp: 0 }
  w.items = { ...RICH_V27_ITEMS }
  w.gear = { 'greatsword-g1': 2, 'helm-g3': 1 }
  w.gems = { 'gem-hp-1': 2, 'gem-sun-4': 1 }
  w.buildings = { mine: { level: 3 }, forge: { level: 2 } }
  w.wallet = { ...(w.wallet as Raw), laurels: 1000, timeTickets: 7, gearMarks: 40, classMarks: 10 }
  w.work = {
    101: v27Row('101', 'mine', 0, [v27Entry('gather', 'copper-ore', 3, 82, 1)], [{ kind: 'gather', item: 'tin-ore', count: 2 }]),
    102: v27Row('102', 'forge', 0, [v27Entry('craft', 'greatsword-g2', 2, 180, 0, [{ item: 'limestone-block', qty: 1 }, { item: 'pine-plank', qty: 1 }])]),
    103: v27Row('103', 'lapidary', 0, [v27Entry('cut', 'gem-hp-1', 1, 200, 0, [{ item: 'puffbun-leather', qty: 1 }])]),
  }
  return raw
}

// --- §14.5's worked examples ------------------------------------------------------------------------------------------

/** A fresh player (day 3): five Umas worked nonstop at level-1 places, 8,640 Craft EXP each (Craft Lv 6, 1,290 toward
 * Lv 7); 24 gear pieces of G1–G2 in their lockers; 10 Star Gems in stock; 45 items. The grant: 144 each, 720. */
export function freshPlayer(): Raw {
  const lockers = [5, 5, 5, 5, 4]
  const all = pieceIds(24, [1, 2])
  let at = 0
  const umas = umasOf(ids(1000, 5).map((id, i) => {
    const locker = all.slice(at, at += lockers[i]!)
    return [id, v27Uma({ level: 6, exp: 1290 }, locker)]
  }))
  return v27World(umas, { gems: { 'gem-hp-1': 5, 'gem-def-1': 5 }, items: { 'copper-ore': 20, 'tin-ore': 10, 'copper-ingot': 15 } })
}

/** A mid player (day 20): 8 Umas at Craft Lv 36, each mid-job (one gather whose settle pays +50 EXP), 6 at Lv 26 and 6 at
 * Lv 11; the eight's 576 pieces (72 each) and 320 open nodes (40 each); 600 items; eleven facilities, seven at level 2
 * (the first seven, the Mine and the Forest among them) and four at level 3. The grant: 990 · 675 · 252, 13,482; back
 * 3,650 Laurels and 38 refined items. (§14.5 says "8 at level 2, 4 at level 3: 3,800 Laurels, 40 items", which needs
 * twelve facilities of eleven.) */
export function midPlayer(): Raw {
  const busy = ids(2000, 8)
  const umas = umasOf([
    ...busy.map((id): [string, Raw] => [id, v27Uma({ level: 36, exp: 0 }, pieceIds(72, [1, 2, 3, 4, 5, 6]), STAR_NODES.slice(0, 40))]),
    ...ids(2008, 6).map((id): [string, Raw] => [id, v27Uma({ level: 26, exp: 0 })]),
    ...ids(2014, 6).map((id): [string, Raw] => [id, v27Uma({ level: 11, exp: 0 })]),
  ])
  const work = Object.fromEntries(busy.map((id, i) => {
    const [building, item] = i < 4 ? ['mine', 'copper-ore'] : ['forest', 'pine-log']
    return [id, v27Row(id, building, i % 4, [v27Entry('gather', item, 1, 50)])]
  }))
  return v27World(umas, {
    items: { 'copper-ore': 300, 'pine-plank': 300 }, work, buildings: { ...facilitiesAt(2, 7), ...facilitiesAt(3, 4, 7) },
  })
}

/** A fully built roster's Tier 1 world: 40 Umas at Craft Lv 50, ten of them with 30,000 EXP banked; 25 fully built, each
 * with 120 bound pieces and the whole map's 100 nodes open; 2,400 pieces in stock left by an earlier run's twenty; 2,000
 * items; eleven facilities at level 3. The grant: 1,470 (30 Umas) · 1,970 (10), 63,800; back 7,150 Laurels and 66 refined
 * items. */
export function fullRoster(): Raw {
  const umas = umasOf(ids(3000, 40).map((id, i) => [id, v27Uma({ level: 50, exp: i >= 30 ? 30_000 : 0 },
    i < 25 ? pieceIds(120, [1, 2, 3]) : [], i < 25 ? STAR_NODES : [])]))
  return v27World(umas, {
    gear: { 'greatsword-g10': 1200, 'helm-g10': 1200 }, items: { 'mythril-ore': 1000, 'orichalcum-ingot': 1000 }, buildings: facilitiesAt(3),
  })
}

/** Its Tier 2 world: one run's twenty at Craft Lv 31, each with 60 pieces (G4–G5) and 30 open nodes (1,200 and 600); 300
 * items; six facilities at level 2. The grant: 829 each, 16,580; back 900 Laurels and 12 items. */
export function fullRosterTier2(): Raw {
  const umas = umasOf(ids(4000, 20).map((id) => [id, v27Uma({ level: 31, exp: 0 }, pieceIds(60, [4, 5]), STAR_NODES.slice(0, 30))]))
  return v27World(umas, { items: { 'gold-ore': 300 }, buildings: facilitiesAt(2, 6) })
}

/** The floor at work: a Tier 1 world two Rift runs on, its forty best ascended: 20 Umas at Craft Lv 20 (499 each, 9,980),
 * the ascended forty's 4,800 pieces in stock and no open nodes, eleven facilities at level 3. The floor, 32,533, is paid:
 * +22,553 for pieces whose makers have left. */
export function floorWorld(): Raw {
  const umas = umasOf(ids(5000, 20).map((id) => [id, v27Uma({ level: 20, exp: 0 })]))
  return v27World(umas, { gear: { 'greatsword-g8': 2400, 'helm-g8': 2400 }, buildings: facilitiesAt(3) })
}
