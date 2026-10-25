// The Tier rework's grant (H78; profession-progression.md §14.3–§14.5, PP20, PP24): `toV28` on §14.5's worked examples.
// Every number below is the design's, except the floors of the four examples that don't bind: §14.5 prices a Star Gem at
// the 221-minute average, while `toV28` sums each gem's own recipe, so each test's name says the exact floor it measures.
import { describe, expect, it } from 'vitest'
import { GEMS } from '../economy/gems'
import { itemMinutes } from '../economy/pacing'
import { STAR_NODES } from '../economy/stars'
import { toV28, type TierGrant } from './migrations'
import { floorWorld, freshPlayer, fullRoster, fullRosterTier2, midPlayer, v27Uma, v27World } from './v28.fixture'

type World = Record<string, unknown> & { grant: TierGrant | null; wallet: Record<string, number>; items: Record<string, number> }
const migrate = (world: Record<string, unknown>): World => toV28(world, 1) as World
const grantOf = (world: Record<string, unknown>): TierGrant => migrate(world).grant!
const ticketsBy = (grant: TierGrant): number[] => Object.values(grant.umas).map((u) => u.tickets)

describe('the grant: one Speed Ticket per 30 minutes of work (PP24)', () => {
  it('pays each Craft Level its table (§14.3): ⌈E(L) ÷ 60⌉, 1,470 at Lv 50', () => {
    const table: readonly [number, number][] = [[1, 0], [6, 123], [11, 252], [16, 387], [21, 528], [26, 675], [31, 829], [36, 989], [41, 1155],
      [46, 1328], [50, 1470]]
    const umas = Object.fromEntries(table.map(([level], i) => [`${100 + i}`, v27Uma({ level, exp: 0 })]))
    const grant = grantOf(v27World(umas))
    expect(table.map(([level], i) => grant.umas[`${100 + i}`])).toEqual(table.map(([level, tickets]) => ({ level, exp: 0, tickets })))
    expect(grant.tickets).toBe(table.reduce((n, [, t]) => n + t, 0))
  })

  it('counts her bank past Lv 50, and rounds each Uma up on her own line', () => {
    const grant = grantOf(v27World({ 1: v27Uma({ level: 50, exp: 30_000 }), 2: v27Uma({ level: 1, exp: 1 }), 3: v27Uma({ level: 1, exp: 61 }) }))
    expect(grant.umas).toEqual({ 1: { level: 50, exp: 30_000, tickets: 1970 }, 2: { level: 1, exp: 1, tickets: 1 }, 3: { level: 1, exp: 61, tickets: 2 } })
    expect(grant.tickets).toBe(1973)
  })

  it('a fresh player: five Umas at Craft Lv 6 with 8,640 EXP each, 144 each, 720 (the floor 212 doesn\'t bind)', () => {
    const world = migrate(freshPlayer())
    expect(ticketsBy(world.grant!)).toEqual([144, 144, 144, 144, 144])
    expect(world.grant).toMatchObject({ tickets: 720, floor: 212, deleted: { gear: 24, gems: 10, upgrades: 0 }, back: { laurels: 0, items: 0, stock: 45 } })
    expect(world.wallet.timeTickets).toBe(720)
  })

  it('a mid player: 990 · 675 · 252, 13,482; seven facilities at level 2 and four at level 3 give 3,650 Laurels and 38 items (the floor 6,073 doesn\'t bind)', () => {
    const world = migrate(midPlayer())
    const by = ticketsBy(world.grant!)
    expect(by.filter((t) => t === 990)).toHaveLength(8)
    expect(by.filter((t) => t === 675)).toHaveLength(6)
    expect(by.filter((t) => t === 252)).toHaveLength(6)
    // Each of the eight's running gathers settles first: +50 EXP over Lv 36's 59,325 is 59,375, 990 tickets.
    expect(world.grant!.umas['2000']).toEqual({ level: 36, exp: 50, tickets: 990 })
    expect(world.grant).toMatchObject({ tickets: 13_482, floor: 6073, deleted: { gear: 576, gems: 320, upgrades: 15 }, back: { laurels: 3650, items: 38 } })
    // 600 in stock, the eight settled items and the 38 refined items, converted.
    expect(world.grant!.back.stock).toBe(646)
    expect(world.wallet).toMatchObject({ timeTickets: 13_482, laurels: 3650 })
  })

  it('a fully built roster\'s Tier 1 world: 1,470 (30) · 1,970 (10), 63,800; 7,150 Laurels and 66 items (the floor 55,049 doesn\'t bind)', () => {
    const world = migrate(fullRoster())
    expect(ticketsBy(world.grant!).filter((t) => t === 1470)).toHaveLength(30)
    expect(ticketsBy(world.grant!).filter((t) => t === 1970)).toHaveLength(10)
    expect(world.grant).toMatchObject({ tickets: 63_800, floor: 55_049, deleted: { gear: 5400, gems: 2500, upgrades: 22 }, back: { laurels: 7150, items: 66, stock: 2066 } })
    expect(world.wallet).toMatchObject({ timeTickets: 63_800, laurels: 7150 })
  })

  it('its Tier 2 world: 829 each, 16,580; six facilities at level 2 give 900 Laurels and 12 items (the floor 12,200 doesn\'t bind)', () => {
    const world = toV28(fullRosterTier2(), 2) as World
    expect(ticketsBy(world.grant!)).toEqual(Array.from({ length: 20 }, () => 829))
    expect(world.grant).toMatchObject({ tickets: 16_580, floor: 12_200, deleted: { gear: 1200, gems: 600, upgrades: 6 }, back: { laurels: 900, items: 12, stock: 312 } })
    // Tier 2's old Gold Ore is Ores grade 6: Iron Ore, like any ore of grades 6–10 (§14.7).
    expect(world.items['iron-ore']).toBe(300)
  })

  it('the floor at work: 20 Umas at Craft Lv 20 (499 each, 9,980) and 4,800 pieces in stock: 32,533 is paid, +22,553 for pieces whose makers left', () => {
    const world = migrate(floorWorld())
    const grant = world.grant!
    expect(ticketsBy(grant)).toEqual(Array.from({ length: 20 }, () => 499))
    expect(grant).toMatchObject({ tickets: 32_533, floor: 32_533, deleted: { gear: 4800, gems: 0, upgrades: 22 }, back: { laurels: 7150, items: 66 } })
    expect(grant.tickets - ticketsBy(grant).reduce((n, t) => n + t, 0)).toBe(22_553)
    expect(world.wallet).toMatchObject({ timeTickets: 32_533, laurels: 7150 })
  })

  it('prices a piece 203 minutes and each Star Gem by its own recipe at Craft Lv 25: 221 a gem on the whole map (§14.4)', () => {
    const floorOf = (extra: Record<string, unknown>, umas: Record<string, Record<string, unknown>> = {}) => grantOf(v27World(umas, extra)).floor
    // A piece: two gathers, two refines and a craft of two gathers, 4.5 × 45.18 = 203.3 minutes, 7 tickets.
    expect(itemMinutes(25) * 4.5).toBeCloseTo(203.3, 1)
    expect(floorOf({ gear: { 'greatsword-g1': 1 } })).toBe(7)
    // Each gem as the frozen catalog makes it: its cut (2) and a gather and a refine (1.25) a refined item in it.
    for (const gem of GEMS) {
      const refined = Object.values(gem.inputs).reduce((a, b) => a + b, 0)
      expect(floorOf({ gems: { [gem.id]: 1 } }), gem.id).toBe(Math.ceil((itemMinutes(25) * (2 + 1.25 * refined)) / 30 - 1e-9))
    }
    // One Uma's whole map: 100 gems of 232 refined items, 22,140 minutes (221.4 a gem), 738 tickets.
    expect(GEMS.reduce((n, g) => n + Object.values(g.inputs).reduce((a, b) => a + b, 0), 0)).toBe(232)
    expect(floorOf({}, { 1: v27Uma({ level: 1, exp: 0 }, [], STAR_NODES) })).toBe(738)
  })

  it('a world with no Craft EXP, nothing deleted and no upgrade gets no grant', () => {
    expect(migrate(v27World({ 1: v27Uma({ level: 1, exp: 0 }) }, { items: { flax: 3 } })).grant).toBeNull()
  })
})
