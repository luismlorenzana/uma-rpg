// Halls v2 in the domain (H129; halls-v2.md §0, §2–§5, HV1–HV17, HV20), built dark at engine v19: five halls, their seat
// ids by generation, the twenty Limit Breaks with their own power, kinds, shapes and statuses, the class scale and the hit
// cap, checked against the design's tables. The numbers are §3.3's at 100%, scale 1 and an open power of 1, before stats.
import { describe, expect, it } from 'vitest'
import { RPG_AOE_SHARE, RPG_RANDOM_BONUS, RPG_VOLLEY, type RpgSkillDef } from './catalog'
import { RPG_TIER1_CLASSES } from './class-tree'
import {
  ALL_HERO_LIMIT_IDS, HERO_HALL_PLACES, HERO_LIMIT_IDS, HERO_LIMIT_MAX_HITS, HERO_LIMIT_SCALE, HERO_LIMITS, hallOfPlace, heroHalls,
  heroLimitClass, heroLimitFor, heroLimitHall, heroLimitIds, heroLimitKinds, heroLimitsOfHall, heroLimitScale, heroLimitSkills, heroSeatHome,
  isHeroLimitId, type HeroHall, type HeroLimit, type HeroLimitId,
} from './heroes'
import {
  RPG_ALL_CLASSES, RPG_DAMAGE_KINDS, rpgAnsweredTwinSets, rpgDefaultWeapons, rpgPhysical, type RpgClass, type RpgDamageKind, type RpgTwinSet,
} from './rules'
import { BATTLE_STATUS_STEP } from './battle/skills'

const V19 = 19
const twenty = heroLimitIds(V19).map((id) => heroLimitFor(id, V19)!)
const byName = (name: string): HeroLimit => twenty.find((l) => l.name === name)!

// --- The design's table (the packet's, from halls-v2.md §0 and §4) --------------------------------------------------------

type Shape = 'one' | 'random' | 'all' | 'volley'
/** A hit as the table writes it: its kind, its share of the Limit Break's power, and whether it is a double. */
type Hit = readonly [RpgDamageKind, number, 'd'?]
interface Row {
  id: HeroLimitId; name: string; home: RpgClass; shape: Shape; hits: readonly Hit[]; power: number
  /** The volleys: each of the two casts' splash share. */
  splash?: number
  status?: { key: string; to: 'allies' | 'foe'; when: 'before' | 'after' }
}
const T = 1 / 3
const ROWS: readonly Row[] = [
  { id: 'brawler-1', name: 'Triad Onslaught', home: 'brawler', shape: 'one', hits: [['greatsword', T], ['axe', T], ['lance', T]], power: 2.5 },
  { id: 'brawler-2', name: 'Ten Thousand Swings', home: 'brawler', shape: 'one', hits: [['greatsword', 1]], power: 2.9 },
  { id: 'brawler-3', name: 'Echo Draw', home: 'brawler', shape: 'one', hits: [['katana', T, 'd'], ['katana', T, 'd'], ['katana', T, 'd']], power: 2.2 },
  { id: 'brawler-4', name: 'Hundred-Arrow Rain', home: 'brawler', shape: 'volley', hits: [['bow', 0.25], ['bow', 0.25]], splash: 0.5, power: 2.2 },
  { id: 'mage-1', name: 'Triad Tempest', home: 'mage', shape: 'one', hits: [['fire', T], ['ice', T], ['lightning', T]], power: 2.5 },
  { id: 'mage-2', name: 'Ten Thousand Candles', home: 'mage', shape: 'one', hits: [['fire', 1]], power: 2.9 },
  { id: 'mage-3', name: 'Echo Ray', home: 'mage', shape: 'one', hits: [['light', T, 'd'], ['light', T, 'd'], ['light', T, 'd']], power: 2.2 },
  { id: 'mage-4', name: 'Hundred-Shadow Rain', home: 'mage', shape: 'volley', hits: [['dark', 0.25], ['dark', 0.25]], splash: 0.5, power: 2.2 },
  { id: 'spellblade-1', name: 'Shrike Pact', home: 'spellblade', shape: 'random', power: 1.9,
    hits: [['katana', 0.2, 'd'], ['lance', 0.2], ['katana', 0.2, 'd'], ['lance', 0.2], ['katana', 0.2, 'd']] },
  { id: 'spellblade-2', name: 'Firefly Pact', home: 'spellblade', shape: 'random', power: 1.9,
    hits: [['katana', 0.2, 'd'], ['light', 0.2, 'd'], ['katana', 0.2, 'd'], ['light', 0.2, 'd'], ['katana', 0.2, 'd']] },
  { id: 'spellblade-3', name: 'Storm Heron Pact', home: 'tomeblade', shape: 'random', power: 1.9,
    hits: [['light', 0.2, 'd'], ['lightning', 0.2], ['light', 0.2, 'd'], ['lightning', 0.2], ['light', 0.2, 'd']] },
  { id: 'spellblade-4', name: 'Wisp Pact', home: 'tomeblade', shape: 'random', power: 1.9,
    hits: [['light', 0.2, 'd'], ['katana', 0.2, 'd'], ['light', 0.2, 'd'], ['katana', 0.2, 'd'], ['light', 0.2, 'd']] },
  { id: 'summoner-1', name: 'Centaur Warband', home: 'armsummoner', shape: 'all', hits: [['axe', T], ['bow', T], ['axe', T]], power: 2.2 },
  { id: 'summoner-2', name: 'Gargoyle Flock', home: 'armsummoner', shape: 'all', hits: [['axe', T], ['dark', T], ['axe', T]], power: 2.2 },
  { id: 'summoner-3', name: 'Frostshade Wyrm', home: 'summoner', shape: 'all', hits: [['dark', T], ['ice', T], ['dark', T]], power: 2.2 },
  { id: 'summoner-4', name: 'Night Colossus', home: 'summoner', shape: 'all', hits: [['dark', T], ['axe', T], ['dark', T]], power: 2.2 },
  { id: 'healer-1', name: 'Archangel’s Judgment', home: 'paladin', shape: 'one', hits: [['lance', 0.3], ['lance', 0.3], ['light', 0.4, 'd']], power: 2,
    status: { key: 'brave', to: 'allies', when: 'after' } },
  { id: 'healer-2', name: 'Archdemon’s Toll', home: 'paladin', shape: 'one', hits: [['axe', 0.3], ['axe', 0.3], ['dark', 0.2], ['dark', 0.2]], power: 2,
    status: { key: 'armor-break', to: 'foe', when: 'before' } },
  { id: 'healer-3', name: 'Seraph’s Pyre', home: 'cleric', shape: 'one', hits: [['fire', 0.3], ['fire', 0.3], ['greatsword', 0.2], ['greatsword', 0.2]], power: 2,
    status: { key: 'faith', to: 'allies', when: 'after' } },
  { id: 'healer-4', name: 'Thunder Fiend’s Barrage', home: 'cleric', shape: 'one', hits: [['lightning', 0.3], ['lightning', 0.3], ['bow', 0.2], ['bow', 0.2]], power: 2,
    status: { key: 'mind-break', to: 'foe', when: 'before' } },
]

// --- Damage at 100%, scale 1, open power 1 (§3.3), from the skill defs -----------------------------------------------------

const WEAK = 1.3
/** Her casts as the engine gets them, at the Limit Break's own power (scale 1, open power 1): built at ×1000 and read back,
 * so the defs' rounding to 0.001 stays out of the comparisons. */
const defsOf = (l: HeroLimit): RpgSkillDef[] => heroLimitSkills(l, l.power! * 1000).map((d) => ({
  ...d, hits: d.hits.map((h) => ({ ...h, power: h.power / 1000 })), ...(d.splash ? { splash: { ...d.splash, power: d.splash.power / 1000 } } : {}),
}))
const kindOf = (h: RpgSkillDef['hits'][number]): RpgDamageKind => h.parts[0]!.kind
/**
 * The damage a Limit Break deals on `n` foes alike (every foe weak to `weak`), summed over the foes: a `one` cast's hits
 * on the tapped foe and its splash on each other, an `all` cast's hits on each, a random cast's hits wherever they land
 * (the total is the same). `curse`: the stack a cast before the hits leaves on the tapped foe (+10% to its channel).
 */
function dealt(l: HeroLimit, n: number, weak: readonly RpgDamageKind[] = [], curse = false): number {
  let total = 0, cursed: 'physical' | 'magical' | null = null
  const hit = (h: RpgSkillDef['hits'][number], onTapped: boolean) => {
    const k = kindOf(h)
    const channel = rpgPhysical(k) ? 'physical' : 'magical'
    return h.power * (weak.includes(k) ? WEAK : 1) * (onTapped && cursed === channel ? 1 + BATTLE_STATUS_STEP : 1)
  }
  for (const d of defsOf(l)) {
    if (d.target === 'all') total += n * d.hits.reduce((m, h) => m + hit(h, false), 0)
    else if (d.target === 'random') total += d.hits.reduce((m, h) => m + hit(h, n === 1), 0)
    else total += d.hits.reduce((m, h) => m + hit(h, true), 0) + (d.splash ? (n - 1) * hit(d.splash, false) : 0)
    if (curse && d.status && (d.status.key === 'armor-break' || d.status.key === 'mind-break')) cursed = d.status.key === 'armor-break' ? 'physical' : 'magical'
  }
  return total
}
/** Her best on one foe in Tier 1: every kind weak, but at most two Arms and two elements (a Tier 1 foe's most). */
function best(l: HeroLimit, curse = false): number {
  const kinds = heroLimitKinds(l)
  const subsets = kinds.reduce<RpgDamageKind[][]>((all, k) => [...all, ...all.map((s) => [...s, k])], [[]])
    .filter((s) => s.filter(rpgPhysical).length <= 2 && s.filter((k) => !rpgPhysical(k)).length <= 2)
  return Math.max(...subsets.map((s) => dealt(l, 1, s, curse)))
}
/** Hits on one foe in one cast of the whole Limit Break: the tapped foe's (a volley's too), a lone foe's for random casts,
 * a foe's for `all` casts. */
const hitsOnOneFoe = (l: HeroLimit): number => defsOf(l).reduce((n, d) => n + d.hits.length, 0)

describe('Halls v2’s halls and seats by generation (HV1, HV3, HV20)', () => {
  it('gives v14 classes v1’s five halls (20 seats), v15–v18 six (24), v19 Halls v2’s five (20), and 28 of every generation', () => {
    expect(heroHalls(14)).toEqual(['brawler', 'mage', 'spellblade', 'cleric', 'summoner'])
    expect(heroHalls(18)).toEqual(['brawler', 'mage', 'spellblade', 'cleric', 'summoner', 'paladin'])
    expect(heroHalls(V19)).toEqual(['brawler', 'mage', 'spellblade', 'summoner', 'healer'])
    expect(heroLimitIds(14)).toHaveLength(20)
    expect(heroLimitIds(15)).toEqual(heroLimitIds(18))
    expect(heroLimitIds(18)).toHaveLength(24)
    expect(heroLimitIds(V19)).toEqual(ROWS.map((r) => r.id))
    expect(ALL_HERO_LIMIT_IDS).toHaveLength(28)
    expect(new Set(ALL_HERO_LIMIT_IDS).size).toBe(28)
    expect(new Set([...heroLimitIds(14), ...heroLimitIds(18), ...heroLimitIds(V19)])).toEqual(new Set(ALL_HERO_LIMIT_IDS))
    // The live game keeps v18's 24 until H134.
    expect(HERO_LIMIT_IDS).toEqual(heroLimitIds(18))
    expect(HERO_LIMITS.map((l) => l.id)).toEqual(heroLimitIds(18))
  })

  it('reads a seat by generation: `healer-*` only from v19, `paladin-*` and `cleric-*` only before it', () => {
    expect([isHeroLimitId('healer-1', 18), isHeroLimitId('healer-1', V19), isHeroLimitId('healer-1')]).toEqual([false, true, false])
    expect([isHeroLimitId('paladin-1', 18), isHeroLimitId('paladin-1', V19), isHeroLimitId('cleric-4', V19)]).toEqual([true, false, false])
    expect([isHeroLimitId('paladin-1', 14), isHeroLimitId('cleric-1', 14), isHeroLimitId('brawler-4', V19)]).toEqual([false, true, true])
    expect(['healer-5', 'warrior-1', 'brawler', 7].some((id) => isHeroLimitId(id, V19))).toBe(false)
    expect(heroLimitFor('healer-1', 18)).toBeUndefined()
    expect(heroLimitFor('paladin-1', V19)).toBeUndefined()
    expect(heroLimitFor('cleric-1', V19)).toBeUndefined()
  })

  it('places each hall and finds it back; the Healer Sanctum’s place is new', () => {
    expect(HERO_HALL_PLACES).toEqual({
      brawler: 'brawler-dojo', mage: 'mage-tower', spellblade: 'spell-blade-salle', cleric: 'cleric-chapel', summoner: 'summoner-circle',
      paladin: 'paladin-bastion', healer: 'healer-sanctum',
    })
    for (const [hall, place] of Object.entries(HERO_HALL_PLACES)) expect(hallOfPlace(place)).toBe(hall)
    expect(hallOfPlace('workbench')).toBeNull()
  })

  it('names each seat’s hall and home class: Halls v2’s table from v19, the hall’s class before', () => {
    for (const r of ROWS) expect([heroLimitHall(r.id), heroSeatHome(r.id, V19)], r.id).toEqual([r.id.slice(0, r.id.lastIndexOf('-')), r.home])
    // Before v19 every seat is its hall's class's (the live web's `heroLimitClass`).
    for (const id of heroLimitIds(18)) expect([heroSeatHome(id, 18), heroLimitClass(id)], id).toEqual([heroLimitHall(id), heroLimitHall(id)])
    expect([heroSeatHome('spellblade-3', 18), heroSeatHome('spellblade-3', V19)]).toEqual(['spellblade', 'tomeblade'])
    expect([heroSeatHome('summoner-1', 18), heroSeatHome('summoner-1', V19)]).toEqual(['summoner', 'armsummoner'])
    // A hall's seats in order, by generation.
    const halls: HeroHall[] = ['brawler', 'mage', 'spellblade', 'summoner', 'healer']
    for (const hall of halls) expect(heroLimitsOfHall(hall, V19).map((l) => l.id)).toEqual([1, 2, 3, 4].map((n) => `${hall}-${n}`))
    expect(heroLimitsOfHall('healer', 18)).toEqual([])
    expect(heroLimitsOfHall('paladin', V19)).toEqual([])
    expect(heroLimitsOfHall('paladin', 18).map((l) => l.name)).toEqual(['Archangel’s Verdict', 'Archdemon’s Pact', 'Rampart Charge', 'Valkyrie Lances'])
  })
})

describe('the twenty Limit Breaks (HV5–HV16, §4)', () => {
  it.each(ROWS.map((r) => [r.id, r] as const))('%s: its name, hall, home, power, kinds, shape, hits and status', (_, r) => {
    const l = heroLimitFor(r.id, V19)!
    expect([l.name, l.hall, l.classId, l.power]).toEqual([r.name, heroLimitHall(r.id), r.home, r.power])
    expect(l.blurb.length).toBeGreaterThan(10)
    expect(l.lore!.length).toBeGreaterThan(10)
    // Kinds in lead order: the first-dealt kind leads.
    expect(heroLimitKinds(l)).toEqual([...new Set(r.hits.map(([k]) => k))])
    const struck = l.casts.filter((c) => c.hits.length)
    // A volley seat: two casts, each its two hits and its splash, half the power each.
    const casts = r.shape === 'volley' ? 2 : 1
    expect(struck, r.id).toHaveLength(casts)
    for (const c of struck) {
      expect(c.target).toBe(r.shape === 'volley' || r.shape === 'one' ? 'one' : r.shape)
      expect(!!c.volley).toBe(r.shape === 'volley')
      expect(c.hits.map((h) => [h.kinds, h.double ?? false])).toEqual(r.hits.map(([k, , d]) => [[k], d === 'd']))
      c.hits.forEach((h, i) => expect(h.share, `${r.id} hit ${i}`).toBeCloseTo(r.hits[i]![1], 10))
      if (r.splash !== undefined) expect([c.splash!.kinds, c.splash!.share]).toEqual([[r.hits[0]![0]], r.splash])
      else expect(c.splash).toBeUndefined()
      // No support of any kind (HV14).
      expect(c.support).toBeUndefined()
    }
    // The shares add up to the whole power (the volleys' two casts half each).
    expect(struck.reduce((n, c) => n + c.hits.reduce((m, h) => m + h.share, 0), 0)).toBeCloseTo(1, 10)
    // A status: one stack, two rounds, a blessing on every ally after the hits or a curse on the foe in a cast before them.
    const statuses = l.casts.flatMap((c, i) => (c.status ? [{ ...c.status, i, hits: c.hits.length }] : []))
    if (!r.status) expect(statuses).toEqual([])
    else {
      expect(statuses).toHaveLength(1)
      const [s] = statuses
      expect([s!.key, s!.stacks, s!.turns, s!.to]).toEqual([r.status.key, 1, 2, r.status.to])
      if (r.status.when === 'before') expect([s!.i, s!.hits, l.casts.length]).toEqual([0, 0, 2])
      else expect([s!.i, s!.hits > 0, l.casts.length]).toEqual([0, true, 1])
    }
  })

  it('expands a double into two hits at half its share, the second following; a volley at 0.8 with its splash at 0.35', () => {
    const [draw] = heroLimitSkills(byName('Echo Draw'), 6)
    expect(draw!.hits.map((h) => [h.power, h.follow ?? false])).toEqual([[1, false], [1, true], [1, false], [1, true], [1, false], [1, true]])
    const [pact] = heroLimitSkills(byName('Shrike Pact'), 1)
    expect(pact!.target).toBe('random')
    expect(pact!.hits.map((h) => `${kindOf(h)}${h.follow ? '+' : ''}`)).toEqual(['katana', 'katana+', 'lance', 'katana', 'katana+', 'lance', 'katana', 'katana+'])
    expect(pact!.hits[0]!.power).toBeCloseTo(0.1 * RPG_RANDOM_BONUS, 3)
    const rain = heroLimitSkills(byName('Hundred-Arrow Rain'), 1)
    expect(rain).toHaveLength(2)
    for (const c of rain) {
      expect([c.target, c.hits.map((h) => h.power), c.splash!.power]).toEqual(['one', [0.25 * RPG_VOLLEY.target, 0.25 * RPG_VOLLEY.target], 0.5 * RPG_VOLLEY.splash])
    }
    const [band] = heroLimitSkills(byName('Centaur Warband'), 3)
    expect(band!.hits.map((h) => h.power)).toEqual([RPG_AOE_SHARE, RPG_AOE_SHARE, RPG_AOE_SHARE])
    // Older Limit Breaks build as they did: no `follow`, no volley.
    for (const v of [14, 15, 16, 18]) for (const id of heroLimitIds(v)) {
      for (const d of heroLimitSkills(heroLimitFor(id, v)!, 1)) expect(d.hits.some((h) => 'follow' in h), `${id} v${v}`).toBe(false)
    }
  })

  it('scales by class from v19: 1 for every class but the Paladin and the Cleric, 0.75 for those two', () => {
    expect(Object.entries(HERO_LIMIT_SCALE).filter(([, s]) => s !== 1)).toEqual([['cleric', 0.75], ['paladin', 0.75]])
    for (const c of RPG_ALL_CLASSES) {
      expect(heroLimitScale(c, V19), c).toBe(c === 'paladin' || c === 'cleric' ? 0.75 : 1)
      expect(heroLimitScale(c, 18), c).toBe(1)
    }
  })

  it(`lands at most ${HERO_LIMIT_MAX_HITS} hits on one foe a cast (HV15): Firefly and Wisp Pact reach it`, () => {
    expect(HERO_LIMIT_MAX_HITS).toBe(10)
    expect(Object.fromEntries(twenty.map((l) => [l.id, hitsOnOneFoe(l)]))).toEqual({
      'brawler-1': 3, 'brawler-2': 1, 'brawler-3': 6, 'brawler-4': 4, 'mage-1': 3, 'mage-2': 1, 'mage-3': 6, 'mage-4': 4,
      'spellblade-1': 8, 'spellblade-2': 10, 'spellblade-3': 8, 'spellblade-4': 10,
      'summoner-1': 3, 'summoner-2': 3, 'summoner-3': 3, 'summoner-4': 3, 'healer-1': 4, 'healer-2': 4, 'healer-3': 4, 'healer-4': 4,
    })
    for (const l of twenty) expect(hitsOnOneFoe(l), l.id).toBeLessThanOrEqual(HERO_LIMIT_MAX_HITS)
    // Today's most was twelve (Chaos Rain).
    expect(Math.max(...heroLimitIds(18).map((id) => hitsOnOneFoe({ ...heroLimitFor(id, 18)!, power: 1 })))).toBe(12)
  })
})

describe('§3.3’s damage order, from the skill defs (100%, scale 1, × her open power)', () => {
  const near = (actual: number, expected: number, what: string) => expect(Math.abs(actual - expected), `${what}: ${actual}`).toBeLessThanOrEqual(0.01)

  it('gives every row’s one foe, weak, three and five foes', () => {
    for (const name of ['Ten Thousand Swings', 'Ten Thousand Candles']) {
      const l = byName(name), k = heroLimitKinds(l)
      near(dealt(l, 1), 2.9, name); near(dealt(l, 1, k), 3.77, `${name} weak`); near(dealt(l, 3), 2.9, `${name} ×3`); near(dealt(l, 5), 2.9, `${name} ×5`)
    }
    for (const name of ['Triad Onslaught', 'Triad Tempest']) {
      const l = byName(name), k = heroLimitKinds(l)
      near(dealt(l, 1), 2.5, name); near(dealt(l, 1, k.slice(0, 1)), 2.75, `${name} one weak`); near(dealt(l, 1, k.slice(0, 2)), 3, `${name} two weak`)
    }
    for (const name of ['Echo Draw', 'Echo Ray']) {
      const l = byName(name)
      near(dealt(l, 1), 2.2, name); near(dealt(l, 1, heroLimitKinds(l)), 2.86, `${name} weak`); near(dealt(l, 3), 2.2, `${name} ×3`)
    }
    for (const name of ['Archangel’s Judgment', 'Seraph’s Pyre']) {
      const l = byName(name)
      near(dealt(l, 1), 2, name); near(dealt(l, 1, heroLimitKinds(l)), 2.6, `${name} weak`)
    }
    for (const name of ['Archdemon’s Toll', 'Thunder Fiend’s Barrage']) {
      const l = byName(name)
      near(dealt(l, 1), 2, name); near(dealt(l, 1, [], true), 2.12, `${name} with its curse`); near(dealt(l, 1, heroLimitKinds(l), true), 2.76, `${name} weak`)
    }
    for (const name of ['Shrike Pact', 'Firefly Pact', 'Storm Heron Pact', 'Wisp Pact']) {
      const l = byName(name)
      for (const n of [1, 3, 5]) near(dealt(l, n), 1.995, `${name} ×${n}`)
      near(dealt(l, 1, heroLimitKinds(l)), 2.59, `${name} weak`)
    }
    for (const name of ['Hundred-Arrow Rain', 'Hundred-Shadow Rain']) {
      const l = byName(name)
      near(dealt(l, 1), 1.76, name); near(dealt(l, 1, heroLimitKinds(l)), 2.29, `${name} weak`)
      near(dealt(l, 2), 2.53, `${name} ×2`); near(dealt(l, 3), 3.3, `${name} ×3`); near(dealt(l, 5), 4.84, `${name} ×5`)
    }
    for (const name of ['Centaur Warband', 'Gargoyle Flock', 'Frostshade Wyrm', 'Night Colossus']) {
      const l = byName(name)
      near(dealt(l, 1), 1.21, name); near(dealt(l, 1, heroLimitKinds(l)), 1.57, `${name} weak`)
      near(dealt(l, 3), 3.63, `${name} ×3`); near(dealt(l, 5), 6.05, `${name} ×5`)
    }
  })

  it('holds the owner’s order (§3.4)', () => {
    const ultimate = byName('Ten Thousand Swings'), others = twenty.filter((l) => l.power !== 2.9)
    // The Ultimate first on one foe unweak.
    for (const l of others) expect(dealt(l, 1), l.name).toBeLessThan(dealt(ultimate, 1))
    // A tri on two weaknesses the Ultimate's foe lacks passes it, a bit: 3.00 > 2.90.
    const tri = byName('Triad Onslaught')
    expect(dealt(tri, 1, ['axe', 'lance'])).toBeGreaterThan(dealt(ultimate, 1, ['axe', 'lance']))
    expect(dealt(tri, 1, ['axe', 'lance']) / dealt(ultimate, 1)).toBeLessThan(1.05)
    // On its own weakness the Ultimate's 3.77 is above every other Limit Break's best on one foe (the tri's 3.00).
    for (const l of others) expect(best(l, true), l.name).toBeLessThan(dealt(ultimate, 1, ['greatsword']))
    // A pact's best on one foe (2.59) is under every single-target seat's best; Archangel's and Seraph's 2.60 the next.
    const single = twenty.filter((l) => l.casts.every((c) => c.target === 'one' && !c.volley))
    expect(single.map((l) => l.name).sort()).toEqual(['Archangel’s Judgment', 'Archdemon’s Toll', 'Echo Draw', 'Echo Ray', 'Seraph’s Pyre',
      'Ten Thousand Candles', 'Ten Thousand Swings', 'Thunder Fiend’s Barrage', 'Triad Onslaught', 'Triad Tempest'])
    const pacts = twenty.filter((l) => l.hall === 'spellblade')
    const lowest = Math.min(...single.map((l) => best(l, true)))
    for (const p of pacts) expect(best(p), p.name).toBeLessThan(lowest)
    expect(single.filter((l) => best(l, true) === lowest).map((l) => l.name)).toEqual(['Archangel’s Judgment', 'Seraph’s Pyre'])
    expect(lowest).toBeCloseTo(2.6, 2)
    // The volleys lead on two foes; the Circle leads from three.
    const circle = twenty.filter((l) => l.hall === 'summoner'), rest = twenty.filter((l) => l.hall !== 'summoner')
    expect(dealt(byName('Hundred-Arrow Rain'), 2)).toBeGreaterThan(dealt(circle[0]!, 2))
    for (const n of [3, 4, 5]) for (const c of circle) for (const l of rest) expect(dealt(c, n), `${c.name} > ${l.name} on ${n}`).toBeGreaterThan(dealt(l, n))
    // The mean power over the twenty, the pacts' random bonus and the healers' own curses counted, is 2.23× (HV6).
    const nominal = (l: HeroLimit) => l.power! * (l.casts.some((c) => c.target === 'random') ? RPG_RANDOM_BONUS : 1) * (dealt(l, 1, [], true) / dealt(l, 1))
    expect(twenty.reduce((n, l) => n + nominal(l), 0) / 20).toBeCloseTo(2.23, 2)
  })
})

describe('coverage on v19’s twins (HV17, §5)', () => {
  const holds = (l: HeroLimit, k: RpgDamageKind) => heroLimitKinds(l).includes(k)

  it('holds each kind in two halls or more: 36 kind slots (§5.1)', () => {
    const seats = RPG_DAMAGE_KINDS.map((k) => twenty.filter((l) => holds(l, k)).length)
    expect(RPG_DAMAGE_KINDS).toEqual(['greatsword', 'axe', 'lance', 'bow', 'katana', 'fire', 'ice', 'lightning', 'light', 'dark'])
    expect(seats).toEqual([3, 5, 3, 3, 4, 3, 2, 3, 5, 5])
    expect(seats.reduce((a, b) => a + b, 0)).toBe(36)
    for (const k of RPG_DAMAGE_KINDS) expect(new Set(twenty.filter((l) => holds(l, k)).map((l) => l.hall)).size, k).toBeGreaterThanOrEqual(2)
    // Kinds a seat: one to three.
    for (const l of twenty) expect(heroLimitKinds(l).length, l.id).toBeLessThanOrEqual(3)
  })

  it('answers each twin set from these seats (§5.2): Fire 5, Ice 7, Lightning 6, Light 7, Dark 8, Twilight 7', () => {
    const count = (set: RpgTwinSet) => twenty.filter((l) => rpgAnsweredTwinSets(heroLimitKinds(l), V19).includes(set)).length
    expect(Object.fromEntries((['fire', 'ice', 'lightning', 'light', 'dark', 'twilight'] as const).map((s) => [s, count(s)])))
      .toEqual({ fire: 5, ice: 7, lightning: 6, light: 7, dark: 8, twilight: 7 })
  })

  it('closes every set each Tier 1 class’s defaults miss with two Heroes (§5.3): 23 to 56 of the 190 pairs', () => {
    const SETS = ['fire', 'ice', 'lightning', 'light', 'dark'] as const
    const pairs = (c: RpgClass) => {
      const missing = SETS.filter((s) => !rpgAnsweredTwinSets(rpgDefaultWeapons(c, V19), V19).includes(s))
      let n = 0, all = 0
      for (let i = 0; i < twenty.length; i++) for (let j = i + 1; j < twenty.length; j++) {
        all++
        const answered = rpgAnsweredTwinSets([...heroLimitKinds(twenty[i]!), ...heroLimitKinds(twenty[j]!)], V19)
        if (missing.every((s) => answered.includes(s))) n++
      }
      expect(all).toBe(190)
      return n
    }
    expect(Object.fromEntries(RPG_TIER1_CLASSES.map((c) => [c, pairs(c)]))).toEqual({
      brawler: 56, mage: 56, spellblade: 31, tomeblade: 31, armsummoner: 23, summoner: 23, paladin: 54, cleric: 49,
    })
  })
})
