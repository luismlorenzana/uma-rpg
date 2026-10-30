// The Rift's guidance by held classes (Classes v3, CV §10.1; H134), with the switch mocked to 19 until the flip merges this
// into rift-view.test.ts: a rebuilt party counts the classes its members hold, not only the ones they fight as; each guided
// class the party leaves empty names who could fill it, Ready to promote first. Invented outfits only.
import { newOwnedUma, newSave, type BattleOutfit, type OwnedUma, type RpgClass, type TierWorld } from '@rpg/domain'
import { describe, expect, it, vi } from 'vitest'
import {
  bestParty, guidanceFit, guidanceMatch, guidanceNeeds, guidedPlan, needLine, partyClassesOf, partyFit, partyGuidance, partyHeldOf,
  suggestConvergence,
} from './rift-view'

vi.mock('../../../../../packages/domain/src/rpg/battle/caps', async (orig) =>
  (await import('../../../../../packages/domain/src/rpg/battle/caps-at.fixture')).capsAt(19, await orig()))

const NOW = '2026-10-29T12:00:00.000Z'
const ids = (from: number, n: number) => Array.from({ length: n }, (_, i) => `${from + i}`)
/** Invented outfits, every one a Front runner (her Tier 0 is the Recruit). */
const outfit = (id: string): BattleOutfit => ({
  outfitId: id, baseStats: { speed: 110, stamina: 110, power: 120, guts: 110, wit: 90 },
  growthRatePercents: { speed: 10, stamina: 10, power: 10, guts: 10, wit: 10 },
  aptitudes: { strategy: { front: 'A', pace: 'G', late: 'G', end: 'G' }, distance: { sprint: 'G', mile: 'G', medium: 'A', long: 'G' } },
})
const OUTFITS: ReadonlyMap<string, BattleOutfit> = new Map(ids(101, 40).map((id) => [id, outfit(id)]))
type Ranks = Partial<Record<RpgClass, number>>
const rebuilt = (classId: RpgClass | null, ranks: Ranks): OwnedUma => ({
  ...newOwnedUma(NOW), level: 50, classId,
  ranks: { classes: Object.fromEntries(Object.entries(ranks).map(([c, rank]) => [c, { rank, exp: 0 }])) },
})

/**
 * Tier 1 after the reset, rebuilt: party 0 (101–105) fights as Tier 0s: 101 holds the Brawler, 102 the Brawler and the
 * Arms Spellblade, 104 the Paladin; 103 and 105 hold no Tier 1 class. Party 1 (106–110) are five Recruits at Rank 1. The
 * roster's others: 111 holds the Arms Summoner, 112 a Recruit at R10 and 113 a Caller at R10 (both Ready for it), 114 a
 * Recruit at R9.
 */
function fixture(): { world: TierWorld; roster: string[] } {
  const world = newSave('Rift v19', NOW).tierWorlds['1']!
  const umas: Record<string, OwnedUma> = {
    101: rebuilt('recruit', { recruit: 10, brawler: 12 }),
    102: rebuilt(null, { recruit: 10, brawler: 10, spellblade: 10 }),
    103: rebuilt('duelist', { duelist: 4 }),
    104: rebuilt('acolyte', { acolyte: 10, paladin: 10 }),
    105: rebuilt('recruit', {}),
    111: rebuilt('caller', { caller: 10, armsummoner: 11 }),
    112: rebuilt('recruit', { recruit: 10 }),
    113: rebuilt('caller', { caller: 10 }),
    114: rebuilt('recruit', { recruit: 9 }),
  }
  for (const id of ids(106, 5)) umas[id] = rebuilt(null, {})
  world.umas = umas
  world.parties[0]!.slots = ids(101, 5)
  world.parties[1]!.slots = ids(106, 5)
  return { world, roster: [...ids(101, 10), '111', '114', '112', '113'] }
}

describe('the Rift’s guidance by held classes (CV §10.1, H134)', () => {
  it('reads Classes v3’s builds by family', () => {
    expect(partyGuidance('iron')).toBe('2 Brawler · Arms Spellblade · Arms Summoner · Paladin')
    expect(partyGuidance('horde')).toBe('2 Arms Summoner · 2 Tome Summoner · Cleric')
  })

  it('counts the classes a rebuilt party holds, where its active classes count none', () => {
    const { world } = fixture()
    const party = ids(101, 5)
    expect(guidanceMatch(partyClassesOf(world, party, OUTFITS), 'iron')).toBe(0)
    const held = partyHeldOf(world, party, OUTFITS)
    expect(held[0]).toEqual(['recruit', 'duelist', 'acolyte', 'caller', 'apprentice', 'brawler'])
    expect(held[1]![0]).toBe('recruit')
    expect(held[1]).toEqual(expect.arrayContaining(['brawler', 'spellblade']))
    // Iron: Brawler, Brawler (Bow, Katana, Axe), Arms Spellblade, Arms Summoner, Paladin. 101 and 102 take two of the three
    // Arms slots between them, 104 the Paladin.
    const fit = guidanceFit(held, 'iron')
    expect(fit.filter((m) => m !== null)).toHaveLength(3)
    expect(fit[4]).toBe(3)
    expect(partyFit(world, party, 'iron', OUTFITS)).toBe(3)
    expect(partyFit(world, ids(106, 5), 'iron', OUTFITS)).toBe(0)
  })

  it('seats a member on the class she fights as before one she only holds', () => {
    const { world } = fixture()
    world.umas['104'] = { ...world.umas['104']!, classId: 'paladin' }
    const plan = guidedPlan(partyHeldOf(world, ids(101, 5), OUTFITS), 'iron')
    expect(plan[3]).toEqual({ classId: 'paladin', weapons: ['greatsword', 'axe', 'tome-light'], switch: false })
    // The others switch with the tap: their Tier 0 isn't in the build.
    expect(plan[0]).toMatchObject({ classId: 'brawler', switch: true })
    expect(plan[1]).toMatchObject({ switch: true })
    expect([plan[2], plan[4]]).toEqual([null, null])
  })

  it('suggests the party that holds the most of a front’s classes', () => {
    const { world, roster } = fixture()
    const block = (i: number) => (i <= 1 ? null : 'Needs five')
    expect(bestParty(world, 'iron', OUTFITS, block)).toBe(0)
    expect(suggestConvergence(world, { roster }, OUTFITS)[0]).toBe(0)
  })

  it('names each guided class the party leaves empty, with who could fill it: Ready to promote first, then Holds it', () => {
    const { world, roster } = fixture()
    const needs = guidanceNeeds(world, ids(101, 5), 'iron', roster, OUTFITS)
    const summoner = needs.find((n) => n.classId === 'armsummoner')!
    expect(needLine(summoner, (c) => ({ armsummoner: 'Arms Summoner' } as Record<string, string>)[c]!)).toBe('Needs an Arms Summoner')
    expect(summoner.umas).toEqual([{ outfitId: '112', ready: true }, { outfitId: '113', ready: true }, { outfitId: '111', ready: false }])
    expect(needs.map((n) => [n.classId, n.count])).toHaveLength(2)
    // The party's empty Arms slot (a Brawler or the Arms Spellblade): 112 is Ready for both, 111 holds neither.
    const arms = needs.find((n) => n.classId !== 'armsummoner')!
    expect(['brawler', 'spellblade']).toContain(arms.classId)
    expect(arms.umas[0]).toEqual({ outfitId: '112', ready: true })
    // A party of five Recruits at Rank 1 needs all five, a Brawler twice.
    const fresh = guidanceNeeds(world, ids(106, 5), 'iron', roster, OUTFITS)
    expect(fresh.map((n) => [n.classId, n.count])).toEqual([['brawler', 2], ['spellblade', 1], ['armsummoner', 1], ['paladin', 1]])
    expect(needLine(fresh[0]!, () => 'Brawler')).toBe('Needs 2 Brawlers')
    expect(needLine(fresh[3]!, () => 'Paladin')).toBe('Needs a Paladin')
    // Ready first (112, a Recruit at R10), then the roster's Brawlers in its order (101, 102: party 0, not this one).
    expect(fresh[0]!.umas.map((u) => u.outfitId)).toEqual(['112', '101', '102'])
  })

  it('needs nothing before v19', () => {
    const { world, roster } = fixture()
    expect(guidanceNeeds(world, ids(101, 5), 'iron', roster, OUTFITS, 1, 18)).toEqual([])
  })
})
