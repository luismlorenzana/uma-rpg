// Test-only (excluded from the build): a full-shaped v31 save for save v32's class reset and Healer Sanctum merge (H130;
// classes-v3.md §8.7, halls-v2.md §7.2). Built on engine v18's constructors whatever the switch says (a v31 Uma has her
// calling pick). Every outfit is invented; the trade test gives a few of them made-up racing profiles.
//
// **Tier 1's world** (31 Umas, 100–130):
// - §8.7's five, the only Umas with Class EXP: **A** 100 (Brawler R34 bar 300, Paladin R12 bar 100; a Brawler setup on line
//   B), **B** 102 (Spell Blade R26 picked, Mage R8 bar 50; a running Forest job and one queued request), **C** 103 (Cleric
//   R24 bar 200), **D** 105 (Lv 1, a Mage calling, no Class EXP, no work) and **E** 104 (Summoner R50, Mage R15): 78 Manuals;
// - 106, a Brawler with a running Mine job (her trade stays Metal); 5,000 banked Class Marks;
// - **the merge's cases** (HV19): `paladin-2`'s Hero 107 at Bond 4 with six Learners and `paladin-3`'s 108 at Bond 10 with
//   five, Learner 115 under both; `cleric-1`'s 109 and `cleric-3`'s 110, both at Bond 10, with eleven different Learners
//   between them; `paladin-1`'s Hero 103 with two Learners and `paladin-4` empty; `cleric-2` and `cleric-4` empty, with
//   Bonds on both for 122; Heroes and Learners in the four other halls (`brawler-1` 106, `mage-1` 101, `spellblade-1` 102,
//   `summoner-1` 104);
// - an open world fight and an open Rift fight (Horde stage 6), both engine v18, taken mid-fight from H126's frozen
//   replays (`rpg/battle/v18-replays.fixture.json`), whose allies 100–104 are this world's Brawler A, Mage 101, Spell Blade
//   B, Cleric C and Summoner E: the world fight's Brawler, A, learns under `paladin-2`.
// **Tier 2's world**: 200 a Brawler R34 bar 300, 201 with a null class (Mage R5), and `paladin-2`'s Hero 202 with 200 as
// her Learner.
import type { Entry, WorkRow } from '@luismlorenzana/uma-work'
import { newGrades } from '../economy/grades'
import type { RpgClass } from '../rpg/kinds'
import type { RpgLines, RpgWeapon } from '../rpg/rules'
import { loadV18Replays, type V18Replay } from '../rpg/battle/v18-replays.fixture'
import type { RpgCampaignChapter } from '../rpg/campaign/chapters'
import { regionChapter, worldContinent } from '../world/world'
import type { RpgWorkRequest } from '../work/request'
import { newOwnedUma, newSave, newTierWorld, type BondTrack, type HeroSeat, type OwnedUma, type Save, type TierWorld } from './save'

export const V31_T = ['2026-10-27T12:00:00.000Z', '2026-10-28T12:00:00.000Z', '2026-10-28T18:00:00.000Z'] as const
const [T0, T1, T2] = V31_T
/** The generation the fixture is built in: v18's, save v31 (the constructors follow the live stage otherwise). */
const V31_ENGINE = 18
const ids = (from: number, n: number): string[] => Array.from({ length: n }, (_, i) => `${from + i}`)

/** The open fights: the frozen v18 replays they come from, and how many of their actions were taken. */
export const V31_WORLD_FIGHT = { name: 'w1:', actions: 10 }
export const V31_RIFT_FIGHT = { name: 'what H128 and H129 change', actions: 12 }
export const v18Replay = (prefix: string): V18Replay => loadV18Replays().find((r) => r.name.startsWith(prefix))!
/** The world fight's region, as the frozen replay built it (continent 1, region 4, invented faces): its boss stage. */
export function v31WorldChapter(): RpgCampaignChapter {
  const cast = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))
  return regionChapter(worldContinent({ name: 'Sim', order: 1 }).regions[3]!, cast)
}

/** The Umas of §8.7 by letter, and the others' roles. */
export const UMA = { A: '100', G: '101', B: '102', C: '103', E: '104', D: '105', F: '106' } as const

type Ranks = Partial<Record<RpgClass, { rank: number; exp: number }>>
interface Spec { classId: RpgClass | null; level: number; ranks?: Ranks; pick?: RpgClass | null; confirmed?: boolean
  classes?: Partial<Record<RpgClass, { weapons: RpgWeapon[]; lines: RpgLines; loadout: string[] | null }>>; bonds?: Record<string, BondTrack> }

const bond = (level: number, exp = 0): BondTrack => ({ level, exp })

/** Tier 1's Umas: §8.7's five, the worker, the Heroes and the Learners. */
export const V31_TIER1: Readonly<Record<string, Spec>> = {
  // A: Front A. Her Brawler on Greatsword B; she learns under paladin-2 and brawler-1.
  100: { classId: 'brawler', level: 40, ranks: { brawler: { rank: 34, exp: 300 }, paladin: { rank: 12, exp: 100 } },
    classes: { brawler: { weapons: ['greatsword', 'axe', 'lance'], lines: { greatsword: 'B' }, loadout: null } },
    bonds: { 'paladin-2': bond(8), 'brawler-1': bond(3, 4) } },
  // G: Pace A and End A, Wit over Power: a Mage, the Hero of mage-1.
  101: { classId: 'mage', level: 30, bonds: { 'mage-1': bond(5) } },
  // B: Pace A, Late A, Power 96 > Wit 88, Medium: a Spell Blade she picked, the Hero of spellblade-1.
  102: { classId: 'spellblade', level: 35, ranks: { spellblade: { rank: 26, exp: 0 }, mage: { rank: 8, exp: 50 } }, pick: 'spellblade',
    bonds: { 'spellblade-1': bond(7) } },
  // C: Late A: a Cleric, the Hero of paladin-1.
  103: { classId: 'cleric', level: 32, ranks: { cleric: { rank: 24, exp: 200 } }, bonds: { 'paladin-1': bond(6) } },
  // E: Late A and End A: a Summoner, the Hero of summoner-1.
  104: { classId: 'summoner', level: 50, ranks: { summoner: { rank: 50, exp: 0 }, mage: { rank: 15, exp: 0 } }, bonds: { 'summoner-1': bond(10) } },
  // D: Pace A, Wit over Power, unlocked yesterday: her Mage start, her pick open.
  105: { classId: 'mage', level: 1, confirmed: false, bonds: { 'mage-1': bond(0, 4) } },
  // F: Front A, a Brawler at work in the Mine, the Hero of brawler-1.
  106: { classId: 'brawler', level: 20, bonds: { 'brawler-1': bond(2) } },
  // The Paladin Bastion's and the Cleric Chapel's Heroes.
  107: { classId: 'paladin', level: 30, bonds: { 'paladin-2': bond(4) } },
  108: { classId: 'paladin', level: 45, bonds: { 'paladin-3': bond(10) } },
  109: { classId: 'cleric', level: 45, bonds: { 'cleric-1': bond(10) } },
  110: { classId: 'cleric', level: 45, bonds: { 'cleric-3': bond(10) } },
  // paladin-2's Learners (with A) and paladin-3's; 115 under both, her two Bonds level and level; 113's higher by level.
  111: { classId: 'mage', level: 20, bonds: { 'paladin-2': bond(5) } },
  112: { classId: 'summoner', level: 20, bonds: { 'paladin-2': bond(3) } },
  113: { classId: 'brawler', level: 20, bonds: { 'paladin-2': bond(2), 'paladin-3': bond(1, 11) } },
  114: { classId: 'spellblade', level: 20, bonds: { 'paladin-2': bond(6) } },
  115: { classId: 'brawler', level: 20, bonds: { 'paladin-2': bond(7, 3), 'paladin-3': bond(7, 9) } },
  116: { classId: 'mage', level: 20, bonds: { 'paladin-3': bond(5) } },
  117: { classId: 'cleric', level: 20, bonds: { 'paladin-3': bond(9) } },
  118: { classId: 'summoner', level: 20, bonds: { 'paladin-3': bond(1) } },
  119: { classId: 'brawler', level: 20, bonds: { 'paladin-3': bond(2, 6) } },
  // cleric-1's Learners (120 and 121 also under paladin-1) and cleric-3's; 122 holds Bonds on cleric-2 and cleric-4; 127 on
  // paladin-1 and paladin-4 without a seat.
  120: { classId: null, level: 10, bonds: { 'cleric-1': bond(4), 'paladin-1': bond(2) } },
  121: { classId: null, level: 10, bonds: { 'cleric-1': bond(9), 'paladin-1': bond(5) } },
  122: { classId: null, level: 10, bonds: { 'cleric-1': bond(1), 'cleric-2': bond(3, 5), 'cleric-4': bond(3, 2) } },
  123: { classId: null, level: 10, bonds: { 'cleric-1': bond(6) } },
  124: { classId: null, level: 10, bonds: { 'cleric-1': bond(0, 3) } },
  125: { classId: null, level: 10 },
  126: { classId: null, level: 10, bonds: { 'cleric-3': bond(7) } },
  127: { classId: null, level: 10, bonds: { 'cleric-3': bond(3), 'paladin-1': bond(2), 'paladin-4': bond(4) } },
  128: { classId: null, level: 10, bonds: { 'cleric-3': bond(8) } },
  129: { classId: null, level: 10, bonds: { 'cleric-3': bond(5) } },
  130: { classId: null, level: 10, bonds: { 'cleric-3': bond(2) } },
}

/** Tier 1's seats. */
export const V31_SEATS: Readonly<Record<string, HeroSeat>> = {
  'brawler-1': { hero: '106', learners: ['100', '116'] },
  'mage-1': { hero: '101', learners: ['105', '117'] },
  'spellblade-1': { hero: '102', learners: ['111'] },
  'summoner-1': { hero: '104', learners: ['112', '126'] },
  'paladin-1': { hero: '103', learners: ['120', '121'] },
  'paladin-2': { hero: '107', learners: ['100', '111', '112', '113', '114', '115'] },
  'paladin-3': { hero: '108', learners: ['115', '116', '117', '118', '119'] },
  'cleric-1': { hero: '109', learners: ['120', '121', '122', '123', '124', '125'] },
  'cleric-3': { hero: '110', learners: ['126', '127', '128', '129', '130'] },
}

function uma(spec: Spec, tier: 1 | 2): OwnedUma {
  const fresh = newOwnedUma(T0, undefined, V31_ENGINE)
  return {
    ...fresh, classId: spec.classId, level: spec.level, exp: 10, craft: { level: 5, exp: 7 }, gear: newGrades(tier),
    ranks: { classes: { ...spec.ranks } }, classes: JSON.parse(JSON.stringify(spec.classes ?? {})) as OwnedUma['classes'],
    bonds: { ...(spec.bonds ?? {}) }, calling: { pick: spec.pick ?? null, confirmed: spec.confirmed ?? true },
  }
}

/** A running gather of `count`, `collected` of them paid, at a place's first slot, with requests queued behind it. */
function gathering(outfitId: string, building: string, item: string, count: number, collected: number, queue: readonly RpgWorkRequest[] = []): WorkRow<RpgWorkRequest> {
  const entry: Entry<RpgWorkRequest> = {
    request: { kind: 'gather', item, count }, seconds: Array(count).fill(1200), inputs: Array(count).fill([]), outputs: Array(count).fill({ item }),
    exp: Array(count).fill(30), startedAt: Date.parse(T1), acceleratedMs: 0, collected, speed: 1.25, fromQueue: false,
  }
  return { outfitId, slot: { building, slot: 0 }, entries: [entry], queue: [...queue], last: null, dropped: null }
}

/** Tier 1's world at v31. */
export function v31World(): TierWorld {
  const world = newTierWorld(T0, 3, V31_ENGINE)
  const umas = Object.fromEntries(Object.entries(V31_TIER1).map(([id, spec]) => [id, uma(spec, 1)]))
  const parties = world.parties.map((p, i) => (i === 0 ? { ...p, slots: ids(100, 5) } : i === 1 ? { ...p, slots: ids(105, 5), lead: '106' } : p))
  const map = v18Replay(V31_WORLD_FIGHT.name), rift = v18Replay(V31_RIFT_FIGHT.name)
  const chapter = v31WorldChapter()
  const boss = chapter.nodes.filter((n) => n.kind !== 'camp').at(-1)!
  return {
    ...world, umas, parties, targets: ['100', '102'],
    wallet: { ...world.wallet, unlockTickets: 3, shards: 2, laurels: 4321, timeTickets: 12, sweepTickets: 4, classMarks: 5000 },
    items: { 'pine-log': 4, 'copper-ore': 6 },
    work: {
      [UMA.B]: gathering(UMA.B, 'forest', 'pine-log', 3, 1, [{ kind: 'gather', item: 'pine-log', count: 2 }]),
      [UMA.F]: gathering(UMA.F, 'mine', 'copper-ore', 2, 0),
    },
    heroes: JSON.parse(JSON.stringify(V31_SEATS)) as TierWorld['heroes'],
    world: {
      ...world.world, springs: { 'w1-spring1': T1 },
      run: {
        ...world.world.run, party: 0, wins: { start: 1 }, battles: 3, updatedAt: T1,
        battle: { battleId: 'battle:0:world:3', nodeId: boss.id, startedAt: T1, input: map.input, actions: map.actions.slice(0, V31_WORLD_FIGHT.actions) },
      },
    },
    rift: {
      runs: [{ id: 't1-r1', roster: ids(100, 20), startedAt: T1, fronts: { iron: 0, arcane: 0, duel: 0, horde: 5 }, convergence: { attempts: 0, open: null },
        traces: {}, wonAt: null, ascendedAt: null }],
      echoes: {},
      battle: { battleId: 'rift:t1:6', ref: { kind: 'front', front: 'horde', stage: 6 }, startedAt: T2, input: rift.input, actions: rift.actions.slice(0, V31_RIFT_FIGHT.actions) },
      battles: 6,
    },
  }
}

/** Tier 2's world at v31. */
export function v31Tier2(): TierWorld {
  const world = newTierWorld(T0, 0, V31_ENGINE)
  return {
    ...world,
    umas: {
      200: uma({ classId: 'brawler', level: 40, ranks: { brawler: { rank: 34, exp: 300 } }, bonds: { 'paladin-2': bond(2) } }, 2),
      201: uma({ classId: null, level: 12, ranks: { mage: { rank: 5, exp: 0 } } }, 2),
      202: uma({ classId: 'paladin', level: 30, bonds: { 'paladin-2': bond(6) } }, 2),
    },
    heroes: { 'paladin-2': { hero: '202', learners: ['200'] } },
    wallet: { ...world.wallet, classMarks: 700 },
  }
}

/** The whole save at v31. */
export function v31Save(): Save {
  const fresh = newSave('Tester', T0, V31_ENGINE)
  return { ...fresh, schemaVersion: 31 as Save['schemaVersion'], account: { ...fresh.account, updatedAt: T2 }, tierWorlds: { '1': v31World(), '2': v31Tier2() } }
}
