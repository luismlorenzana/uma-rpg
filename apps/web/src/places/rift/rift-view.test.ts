import {
  newOwnedUma, newSave, type BattleEnemy, type BattleOutfit, type EnemyTier, type Franchise, type RiftRun, type RosterMember, type RpgClass,
  type TierWorld,
} from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import {
  ascendLines, ascendNumbers, bestParty, convergenceMissing, frontPartyBlock, guidanceMatch, guidedWeapons, levelPartyBlock, partyGuidance, partyHolding,
  riftFinaleFaces, riftFinalePlans, riftHome, riftRefLabel, riftRefTitle, suggestConvergence,
} from './rift-view'

const NOW = '2026-10-22T12:00:00.000Z'
const ids = (from: number, n: number) => Array.from({ length: n }, (_, i) => `${from + i}`)
const TWENTY = ids(101, 20)
/** Invented outfits. */
const outfit = (id: string): BattleOutfit => ({
  outfitId: id, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
  growthRatePercents: { speed: 10, stamina: 10, power: 10, guts: 10, wit: 10 },
  aptitudes: { strategy: { front: 'A', pace: 'G', late: 'G', end: 'G' }, distance: { sprint: 'G', mile: 'G', medium: 'A', long: 'G' } },
})
const OUTFITS: ReadonlyMap<string, BattleOutfit> = new Map(ids(101, 40).map((id) => [id, outfit(id)]))
/** The guided parties, Iron's to Horde's (classes v2's, D178 point 5): parties 0–3 hold the twenty in those classes. */
const GUIDED: RpgClass[][] = [
  ['brawler', 'brawler', 'spellblade', 'spellblade', 'paladin'],
  ['mage', 'mage', 'summoner', 'summoner', 'cleric'],
  ['brawler', 'brawler', 'mage', 'mage', 'paladin'],
  ['spellblade', 'spellblade', 'summoner', 'summoner', 'cleric'],
]

/**
 * Tier 1: the run's twenty in parties 0–3 (Iron's, Arcane's, Duel's and Horde's classes, but listed Horde first so the
 * suggestion has to sort them), party 4 with a Lv 49, party 5 with an Uma off the roster, party 6 with an empty slot.
 */
function fixture(): { world: TierWorld; run: Pick<RiftRun, 'roster'> } {
  const world = newSave('Rift view', NOW).tierWorlds['1']!
  const order = [3, 0, 1, 2]
  order.forEach((guided, p) => GUIDED[guided]!.forEach((classId, k) => {
    const id = TWENTY[p * 5 + k]!
    world.umas[id] = { ...newOwnedUma(NOW), level: 50, classId }
    world.parties[p]!.slots[k] = id
  }))
  ids(121, 15).forEach((id) => { world.umas[id] = { ...newOwnedUma(NOW), level: 50, classId: 'brawler' } })
  world.umas['125'] = { ...world.umas['125']!, level: 49 }
  world.parties[4]!.slots = ids(121, 5)
  world.parties[5]!.slots = ids(126, 5)
  world.parties[6]!.slots = [...ids(131, 4), null]
  return { world, run: { roster: TWENTY } }
}

describe('the Rift’s labels (H50)', () => {
  it('names each fight on its screen', () => {
    expect(riftRefLabel({ kind: 'front', front: 'iron', stage: 5 })).toBe('Stage 5')
    expect(riftRefLabel({ kind: 'front', front: 'duel', stage: 12 })).toBe('Champion')
    expect(riftRefLabel({ kind: 'convergence', fight: 1 })).toBe('Fight 2 of 4')
    expect(riftRefLabel({ kind: 'echo', front: 'horde', level: '55' })).toBe('Lv 55')
    expect(riftRefTitle({ kind: 'front', front: 'iron', stage: 5 })).toBe('Iron front')
    expect(riftRefTitle({ kind: 'convergence', fight: 3 })).toBe('Convergence')
    expect(riftRefTitle({ kind: 'echo', front: 'arcane', level: '45' })).toBe('Echo · Arcane')
    expect(riftHome({ kind: 'front', front: 'arcane', stage: 2 })).toBe('front/arcane')
    expect(riftHome({ kind: 'convergence', fight: 0 })).toBe('convergence')
    expect(riftHome({ kind: 'echo', front: 'iron', level: '50' })).toBe('')
  })

  it('reads each front’s party guidance: classes v2’s, live since H61', () => {
    expect(partyGuidance('iron')).toBe('2 Brawler · 2 Spell Blade · Paladin')
    expect(partyGuidance('arcane')).toBe('2 Mage · 2 Summoner · Cleric')
    expect(partyGuidance('duel')).toBe('2 Brawler · 2 Mage · Paladin')
    expect(partyGuidance('horde')).toBe('2 Spell Blade · 2 Summoner · Cleric')
  })
})

describe('which parties can fight', () => {
  it('takes front fights only by a full party of the roster', () => {
    const { world, run } = fixture()
    expect([0, 1, 2, 3].map((i) => frontPartyBlock(world, run, i))).toEqual([null, null, null, null])
    expect(frontPartyBlock(world, run, 5)).toBe('Not all on the roster')
    expect(frontPartyBlock(world, run, 6)).toBe('Needs five')
    expect(frontPartyBlock(world, run, 7)).toBe('Needs five')
  })

  it('takes Echoes and sign-ups only by five Lv 50 Umas, on the roster or not', () => {
    const { world } = fixture()
    expect(levelPartyBlock(world, 0)).toBeNull()
    expect(levelPartyBlock(world, 4)).toBe('Needs five Lv 50 Umas')
    expect(levelPartyBlock(world, 5)).toBeNull()
    expect(levelPartyBlock(world, 6)).toBe('Needs five')
  })

  it('suggests the party that fits a front’s guidance, and one each for the Convergence', () => {
    const { world, run } = fixture()
    expect(guidanceMatch(GUIDED[0]!, 'iron')).toBe(5)
    expect(guidanceMatch(GUIDED[1]!, 'iron')).toBe(0)
    expect(guidanceMatch(GUIDED[3]!, 'arcane')).toBe(3)
    expect(bestParty(world, 'iron', OUTFITS, (i) => frontPartyBlock(world, run, i))).toBe(1)
    expect(bestParty(world, 'horde', OUTFITS, (i) => frontPartyBlock(world, run, i))).toBe(0)
    expect(bestParty(world, 'iron', OUTFITS, () => 'No')).toBeNull()
    expect(suggestConvergence(world, run, OUTFITS)).toEqual([1, 2, 3, 0])
  })

  it('never suggests a party with two healers in classes v2 (H59)', () => {
    const world = newSave('Rift view', NOW).tierWorlds['1']!
    const parties: RpgClass[][] = [['brawler', 'brawler', 'spellblade', 'cleric', 'cleric'], ['brawler', 'mage', 'mage', 'mage', 'cleric']]
    parties.forEach((classes, p) => classes.forEach((classId, k) => {
      const id = `${201 + p * 5 + k}`
      world.umas[id] = { ...newOwnedUma(NOW), level: 50, classId }
      world.parties[p]!.slots[k] = id
    }))
    const outfits = new Map(ids(201, 10).map((id) => [id, outfit(id)]))
    const open = (i: number) => (world.parties[i]!.slots.every((s) => s !== null) ? null : 'Needs five')
    expect(bestParty(world, 'iron', outfits, open, new Set(), 14)).toBe(0)
    expect(bestParty(world, 'iron', outfits, open, new Set(), 15)).toBe(1)
    const run = { roster: ids(201, 10) }
    expect(suggestConvergence(world, run, outfits, 14)).toContain(0)
    expect(suggestConvergence(world, run, outfits, 15)).not.toContain(0)
  })

  it('names the roster’s Umas the Convergence’s four parties leave out', () => {
    const { world, run } = fixture()
    expect(convergenceMissing(world, run, [0, 1, 2, 3])).toEqual([])
    expect(convergenceMissing(world, run, [0, 1, 2, null])).toEqual(ids(116, 5))
    expect(convergenceMissing(world, run, [0, 1, 2, 5])).toEqual(ids(116, 5))
  })

  it('finds the party still holding a fight’s five, in any order', () => {
    const { world } = fixture()
    expect(partyHolding(world, [...ids(106, 5)].reverse())).toBe(1)
    expect(partyHolding(world, ids(105, 5))).toBeNull()
  })
})

describe('the guided weapons (CP7, H70)', () => {
  it('pairs a party\'s members to the front\'s build by class, in party order, from v16 only', () => {
    // Iron's build: the first Brawler and Spell Blade on their defaults, the second ones on the Bow and the Katana.
    expect(guidedWeapons(GUIDED[0]!, 'iron', 16)).toEqual([
      ['greatsword', 'axe', 'lance'], ['bow', 'katana', 'axe'],
      ['katana', 'lance', 'tome-lightning'], ['bow', 'greatsword', 'tome-fire'],
      ['greatsword', 'axe', 'tome-light'],
    ])
    // Any order: the first Brawler met takes the build's first; a class the build lacks, or a third Brawler, gets none.
    expect(guidedWeapons(['paladin', 'brawler', 'mage', 'brawler', 'brawler'], 'iron', 16)).toEqual([
      ['greatsword', 'axe', 'tome-light'], ['greatsword', 'axe', 'lance'], null, ['bow', 'katana', 'axe'], null,
    ])
    expect(guidedWeapons([null, 'cleric'], 'arcane', 16)).toEqual([null, ['tome-light', 'tome-ice', 'bow']])
    // Before v16 the guidance is classes only.
    expect(guidedWeapons(GUIDED[0]!, 'iron', 15)).toBeNull()
  })
})

describe('the Ascend sheet', () => {
  it('pays the purse for each of the twenty and their banked EXP as Class Marks', () => {
    const { world, run } = fixture()
    world.umas['101'] = { ...world.umas['101']!, exp: 25_000 } // capped at 2,000 Marks
    world.umas['102'] = { ...world.umas['102']!, exp: 14_509 } // 1,450
    const numbers = ascendNumbers(world, run, 1)
    expect(numbers).toEqual({ to: 2, umas: 20, laurels: 20_000, speedTickets: 100, classMarks: 3_450 })
    expect(ascendLines(numbers, 1)).toEqual([
      '20 Umas move to Tier 2 at Lv 1',
      'Ranks, skills and Extra Stats start over',
      'Their gear returns to Tier 1’s stock',
      'Tier 2 gets 20,000 Laurels, 100 Speed Tickets and 3,450 Class Marks',
    ])
  })
})

describe('the finale’s faces (H52)', () => {
  const foe = (castId: string) => ({ castId }) as BattleEnemy
  const tiers = (pairs: [string, EnemyTier][]) => new Map(pairs.map(([id, tier]) => [id, { tier }]))

  it('takes every boss face in order, each once, skipping faces the roster lacks', () => {
    const roster = tiers([['b1', 'boss'], ['b2', 'boss'], ['b3', 'boss'], ['b4', 'boss'], ['s1', 'subboss'], ['k1', 'key'], ['r1', 'regular']])
    const plans = [
      { enemies: [foe('b2'), foe('b1')] },
      { enemies: [foe('r1'), foe('k1')], waves: [[foe('s1')], [foe('b3'), foe('b1')]] },
      { enemies: [foe('gone'), foe('b2'), foe('b4')] },
    ]
    expect(riftFinaleFaces(plans, roster)).toEqual(['b2', 'b1', 'b3', 'b4'])
    expect(riftFinaleFaces(plans, tiers([['b3', 'boss'], ['b1', 'subboss']]))).toEqual(['b3'])
    expect(riftFinaleFaces([], roster)).toEqual([])
  })

  it('shows the run’s four champions, then its Convergence, as the fights draw them', () => {
    /** An invented roster: twenty bosses, sub-bosses, keys and regulars a pack (a run draws 46 boss faces). */
    const roster: RosterMember[] = (['azurlane', 'nikke', 'priconne'] as Franchise[]).flatMap((franchise) =>
      (['boss', 'subboss', 'key', 'regular'] as EnemyTier[]).flatMap((tier) =>
        Array.from({ length: 20 }, (_, i) => ({ id: `${franchise}-${tier}-${i + 1}`, name: `${franchise} ${tier} ${i + 1}`, franchise, tier }))))
    const plans = riftFinalePlans({ tier: 1, runId: 't1-r1', roster, defeated: new Set() })
    expect(plans.map((p) => p.ref)).toEqual([
      { kind: 'front', front: 'iron', stage: 12 }, { kind: 'front', front: 'arcane', stage: 12 },
      { kind: 'front', front: 'duel', stage: 12 }, { kind: 'front', front: 'horde', stage: 12 },
      { kind: 'convergence', fight: 0 }, { kind: 'convergence', fight: 1 }, { kind: 'convergence', fight: 2 }, { kind: 'convergence', fight: 3 },
    ])
    const byId = new Map(roster.map((m) => [m.id, m]))
    const faces = riftFinaleFaces(plans, byId)
    const bosses = plans.flatMap((p) => [p.enemies, ...(p.waves ?? [])].flat()).map((e) => e.castId).filter((id) => byId.get(id)?.tier === 'boss')
    expect(faces).toEqual([...new Set(bosses)])
    // Two champions on Iron, Arcane and the Horde, one on the Duel, twice over: no face repeats while unused ones remain.
    expect(faces).toHaveLength(14)
  })
})
