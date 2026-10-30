// Save v32's migration (H130; classes-v3.md §8, CV25–CV30; halls-v2.md §7, HV18–HV19), unmocked: `toV32` on raw v31
// worlds. The refund of §8.7's worked examples, the reset by world, what stays, the record, and the Healer Sanctum's
// merge. `toV32` is chained after `toV31` since H134: a v31 save parses to v32.
import { describe, expect, it } from 'vitest'
import { migrateWorld, toV32 } from './migrations'
import { parseSave, SAVE_SCHEMA_VERSION, type ClassesV3Record, type HeroSeat, type OwnedUma, type Save, type TierWorld } from './save'
import { UMA, v31Save, v31Tier2, v31World } from './v31.fixture'

type Raw = Record<string, unknown>
const raw = (world: TierWorld): Raw => JSON.parse(JSON.stringify(world)) as Raw
/** A world through `toV32`, read back with v32's shape (`calling` absent, seats by v19 id). */
type V32World = Omit<TierWorld, 'heroes' | 'umas' | 'classesV3'> & { heroes: Record<string, HeroSeat>; umas: Record<string, OwnedUma & { bonds: Record<string, unknown> }>
  classesV3: ClassesV3Record }
const v32 = (world: TierWorld, tier = 1): V32World => toV32(raw(world), tier) as unknown as V32World
const share = (world: V32World, id: string) => world.classesV3.umas[id]!.manuals

describe('toV32: the refund (CV26, §8.7)', () => {
  it('pays §8.7\'s five their 21, 13, 10, 0 and 34 Manuals: 78 for the world, 78,000 Class Marks on top of the 5,000 banked', () => {
    const after = v32(v31World())
    expect([UMA.A, UMA.B, UMA.C, UMA.D, UMA.E].map((id) => share(after, id))).toEqual([21, 13, 10, 0, 34])
    expect(Object.values(after.classesV3.umas).reduce((n, l) => n + l.manuals, 0)).toBe(78)
    expect(after.classesV3).toMatchObject({ manuals: 78, marks: 78_000 })
    expect(after.wallet.classMarks).toBe(5000 + 78_000)
  })

  it('rounds up class by class: C\'s 7,376 EXP is 9,176 → 10, and two classes of 100 EXP each give a Manual each', () => {
    const world = raw(v31World())
    const umas = world.umas as Record<string, Raw>
    umas['125'] = { ...umas['125'], ranks: { classes: { brawler: { rank: 1, exp: 100 }, mage: { rank: 1, exp: 100 } } } }
    const after = toV32(world) as unknown as V32World
    expect(share(after, UMA.C)).toBe(10)
    expect(share(after, '125')).toBe(2)
    expect(after.classesV3.manuals).toBe(80)
  })

  it('pays a Tier 2 world 1:1: a Brawler R34 bar 300 is ⌈13.236⌉ = 14, a Mage R5 one', () => {
    const after = v32(v31Tier2(), 2)
    expect([share(after, '200'), share(after, '201'), share(after, '202')]).toEqual([14, 1, 0])
    expect(after.wallet.classMarks).toBe(700 + 15_000)
  })
})

describe('toV32: the reset (CV25, CV29)', () => {
  it('sends every Uma of Tier 1\'s world to her Tier 0: no class, no setups, no Class Ranks, no calling pick', () => {
    const after = v32(v31World())
    for (const uma of Object.values(after.umas)) {
      expect(uma).toMatchObject({ classId: null, classes: {}, ranks: { classes: {} } })
      expect('calling' in uma).toBe(false)
    }
  })

  it('keeps a Tier 2 world\'s classes, a null one null, and resets the rest', () => {
    const after = v32(v31Tier2(), 2)
    expect([after.umas['200']!.classId, after.umas['201']!.classId, after.umas['202']!.classId]).toEqual(['brawler', null, 'paladin'])
    for (const uma of Object.values(after.umas)) {
      expect(uma).toMatchObject({ classes: {}, ranks: { classes: {} } })
      expect('calling' in uma).toBe(false)
    }
  })

  it('leaves everything else as it was: levels, EXP, Craft, maps, grades, items, work, parties, targets, the world map and its open fight, the Rift, the grant', () => {
    for (const [before, tier] of [[v31World(), 1], [v31Tier2(), 2]] as const) {
      const after = v32(before, tier)
      for (const [id, uma] of Object.entries(before.umas)) {
        const { level, exp, craft, stars, gear, unlockedAt } = after.umas[id]!
        expect({ level, exp, craft, stars, gear, unlockedAt }).toEqual({ level: uma.level, exp: uma.exp, craft: uma.craft, stars: uma.stars, gear: uma.gear, unlockedAt: uma.unlockedAt })
      }
      for (const key of ['createdAt', 'items', 'buildings', 'work', 'parties', 'targets', 'world', 'rift', 'grant'] as const) expect(after[key]).toEqual(before[key])
      const { classMarks: _a, ...wallet } = after.wallet, { classMarks: _b, ...was } = before.wallet
      expect(wallet).toEqual(was)
    }
  })

  it('leaves the four other halls\' seats and every Bond on them alone', () => {
    const before = v31World(), after = v32(before)
    const others = (id: string) => /^(brawler|mage|spellblade|summoner)-/.test(id)
    for (const [id, seat] of Object.entries(before.heroes)) if (others(id)) expect(after.heroes[id]).toEqual(seat)
    for (const [id, uma] of Object.entries(before.umas)) {
      const kept = Object.fromEntries(Object.entries(uma.bonds).filter(([seat]) => others(seat)))
      expect(Object.fromEntries(Object.entries(after.umas[id]!.bonds).filter(([seat]) => others(seat)))).toEqual(kept)
    }
  })
})

describe('toV32: the record (CV26, CV30)', () => {
  it('writes every Uma\'s line: her v31 class, ranks and pick, her share, all of it left, no trade yet; traded and seen false', () => {
    const after = v32(v31World())
    expect(Object.keys(after.classesV3.umas)).toEqual(Object.keys(v31World().umas))
    expect(after.classesV3.umas[UMA.A]).toEqual({ classId: 'brawler', ranks: { brawler: { rank: 34, exp: 300 }, paladin: { rank: 12, exp: 100 } }, pick: null,
      manuals: 21, left: 21 })
    expect(after.classesV3.umas[UMA.B]).toEqual({ classId: 'spellblade', ranks: { spellblade: { rank: 26, exp: 0 }, mage: { rank: 8, exp: 50 } },
      pick: 'spellblade', manuals: 13, left: 13 })
    expect(after.classesV3.umas[UMA.C]).toEqual({ classId: 'cleric', ranks: { cleric: { rank: 24, exp: 200 } }, pick: null, manuals: 10, left: 10 })
    expect(after.classesV3.umas[UMA.D]).toEqual({ classId: 'mage', ranks: {}, pick: null, manuals: 0, left: 0 })
    expect(after.classesV3.umas[UMA.E]).toEqual({ classId: 'summoner', ranks: { summoner: { rank: 50, exp: 0 }, mage: { rank: 15, exp: 0 } }, pick: null,
      manuals: 34, left: 34 })
    expect(after.classesV3.umas['120']).toEqual({ classId: null, ranks: {}, pick: null, manuals: 0, left: 0 })
    expect(after.classesV3).toMatchObject({ traded: false, seen: false })
  })

  it('runs once: a second toV32 returns the world as it is', () => {
    const once = toV32(raw(v31World()))
    expect(toV32(once)).toBe(once)
  })

  it('is chained once after toV31: migrateWorld runs it on a v31 world, not on a v33 one, and the schema is 33', () => {
    const world = raw(v31World())
    const chained = migrateWorld(world, 31)
    expect(chained).toEqual(toV32(raw(v31World())))
    expect(migrateWorld(chained, 33)).toBe(chained)
    expect(toV32(chained as Raw)).toBe(chained)
    expect(SAVE_SCHEMA_VERSION).toBe(33)
  })

  it('parses a v31 save to v33 with the reset applied, which round-trips', () => {
    // The fixture's constructor stamps the live schema; a stored v31 save says 31.
    const save = JSON.parse(JSON.stringify({ ...v31Save(), schemaVersion: 31 })) as Save
    const parsed = parseSave(save)
    expect(parsed.schemaVersion).toBe(33)
    const one = parsed.tierWorlds['1']!
    expect(one.classesV3).toEqual(toV32(raw(save.tierWorlds['1']!)).classesV3)
    expect(one.classesV3!.umas[UMA.B]!.pick).toBe('spellblade')
    expect(one.wallet.classMarks).toBe(5000 + 78_000)
    for (const uma of Object.values(one.umas)) {
      expect(uma).toMatchObject({ classId: null, classes: {}, ranks: { classes: {} } })
      expect('calling' in uma).toBe(false)
    }
    expect(Object.keys(one.heroes).filter((id) => /^(paladin|cleric)-/.test(id))).toEqual([])
    expect(parsed.tierWorlds['2']!.umas['200']!.classId).toBe('brawler')
    expect(parseSave(JSON.parse(JSON.stringify(parsed)))).toEqual(parsed)
  })
})

describe('toV32: the Healer Sanctum\'s merge (HV18, HV19)', () => {
  it('merges HV19\'s example: the Bond 4 Hero stays, the Bond 10 Hero is the first Learner, ten places by Bond, the eleventh unseated', () => {
    const after = v32(v31World())
    // Learners by Bond with healer-2: 117 (9), A (8), 115 (7, 9 EXP), 114 (6), 111 and 116 (5, the first seat's first),
    // 112 (3), 119 (2, 6 EXP), 113 (2), 118 (1).
    expect(after.heroes['healer-2']).toEqual({ hero: '107', learners: ['108', '117', UMA.A, '115', '114', '111', '116', '112', '119', '113'] })
    expect(after.umas['108']!.bonds['healer-2']).toEqual({ level: 10, exp: 0 })
    // The eleventh keeps her Bond with healer-2.
    expect(after.umas['118']!.bonds).toEqual({ 'healer-2': { level: 1, exp: 0 } })
  })

  it('seats a Learner of both old seats once, her second place free', () => {
    const after = v32(v31World())
    const under = (id: string) => Object.keys(after.heroes).filter((seat) => after.heroes[seat]!.learners.includes(id))
    expect(under('115')).toEqual(['healer-2'])
    expect(under(UMA.A)).toEqual(['brawler-1', 'healer-2'])
  })

  it('keeps the first seat\'s Hero of two at Bond 10; the other is the first Learner at Bond 10', () => {
    const after = v32(v31World())
    // 121 (9), 128 (8), 126 (7), 123 (6), 129 (5), 120 (4), 127 (3), 130 (2), 122 (1); 124 and 125 past the tenth place.
    expect(after.heroes['healer-3']).toEqual({ hero: '109', learners: ['110', '121', '128', '126', '123', '129', '120', '127', '130', '122'] })
    expect(after.umas['110']!.bonds['healer-3']).toEqual({ level: 10, exp: 0 })
  })

  it('keeps the second seat\'s Hero when her own Bond is the lower', () => {
    const world = raw(v31World())
    const umas = world.umas as Record<string, { bonds: Record<string, unknown> }>
    umas['107']!.bonds['paladin-2'] = { level: 10, exp: 0 }
    umas['108']!.bonds['paladin-3'] = { level: 9, exp: 11 }
    const after = toV32(world) as unknown as V32World
    expect(after.heroes['healer-2']!.hero).toBe('108')
    expect(after.heroes['healer-2']!.learners[0]).toBe('107')
    expect(after.classesV3.halls[0]).toEqual({ outfitId: '107', from: 'paladin-2', to: 'healer-2', was: 'hero', now: 'learner', bond: 10 })
  })

  it('moves a lone seat whole: paladin-1\'s Hero holds healer-1, her Learners in their order', () => {
    const after = v32(v31World())
    expect(after.heroes['healer-1']).toEqual({ hero: UMA.C, learners: ['120', '121'] })
    expect(after.umas['121']!.bonds['healer-1']).toEqual({ level: 5, exp: 0 })
  })

  it('makes no seat of a pair with no Hero, and still merges its Bonds', () => {
    const after = v32(v31World())
    expect(after.heroes['healer-4']).toBeUndefined()
    expect(after.umas['122']!.bonds).toEqual({ 'healer-3': { level: 1, exp: 0 }, 'healer-4': { level: 3, exp: 5 } })
  })

  it('keeps each Uma\'s higher Bond of the two, by level, then EXP', () => {
    const after = v32(v31World())
    expect(after.umas['115']!.bonds).toEqual({ 'healer-2': { level: 7, exp: 9 } })
    expect(after.umas['113']!.bonds).toEqual({ 'healer-2': { level: 2, exp: 0 } })
    expect(after.umas['127']!.bonds).toEqual({ 'healer-1': { level: 4, exp: 0 }, 'healer-3': { level: 3, exp: 0 } })
  })

  it('records only the displaced Heroes and the unseated Learners, in seat order', () => {
    expect(v32(v31World()).classesV3.halls).toEqual([
      { outfitId: '108', from: 'paladin-3', to: 'healer-2', was: 'hero', now: 'learner', bond: 10 },
      { outfitId: '118', from: 'paladin-3', to: 'healer-2', was: 'learner', now: 'unseated', bond: 1 },
      { outfitId: '110', from: 'cleric-3', to: 'healer-3', was: 'hero', now: 'learner', bond: 10 },
      { outfitId: '124', from: 'cleric-1', to: 'healer-3', was: 'learner', now: 'unseated', bond: 0 },
      { outfitId: '125', from: 'cleric-1', to: 'healer-3', was: 'learner', now: 'unseated', bond: 0 },
    ])
  })

  it('merges a Tier 2 world too, and leaves no Paladin or Cleric seat id on any seat or Bond', () => {
    const tier2 = v32(v31Tier2(), 2)
    expect(tier2.heroes).toEqual({ 'healer-2': { hero: '202', learners: ['200'] } })
    expect(tier2.umas['202']!.bonds).toEqual({ 'healer-2': { level: 6, exp: 0 } })
    expect(tier2.classesV3.halls).toEqual([])
    for (const world of [v32(v31World()), tier2]) {
      const ids = [...Object.keys(world.heroes), ...Object.values(world.umas).flatMap((u) => Object.keys(u.bonds))]
      expect(ids.filter((id) => /^(paladin|cleric)-/.test(id))).toEqual([])
    }
  })
})
