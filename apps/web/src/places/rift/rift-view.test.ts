import { newOwnedUma, newSave, type BattleOutfit, type RiftRun, type RpgClass, type TierWorld } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import {
  ascendLines, ascendNumbers, bestParty, convergenceMissing, frontPartyBlock, guidanceMatch, levelPartyBlock, partyGuidance, partyHolding, riftHome,
  riftRefLabel, riftRefTitle, suggestConvergence,
} from './rift-view'

const NOW = '2026-10-22T12:00:00.000Z'
const ids = (from: number, n: number) => Array.from({ length: n }, (_, i) => `${from + i}`)
const TWENTY = ids(101, 20)
/** Invented outfits. */
const outfit = (id: string): BattleOutfit => ({
  outfitId: id, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
  growthRatePercents: { speed: 10, stamina: 10, power: 10, guts: 10, wit: 10 },
  aptitudes: { strategy: { front: 'A', pace: 'G', late: 'G', end: 'G' } },
})
const OUTFITS: ReadonlyMap<string, BattleOutfit> = new Map(ids(101, 40).map((id) => [id, outfit(id)]))
/** The guided parties, Iron's to Horde's (D168): parties 0–3 hold the twenty in those classes. */
const GUIDED: RpgClass[][] = [
  ['brawler', 'brawler', 'spellblade', 'spellblade', 'cleric'],
  ['mage', 'mage', 'summoner', 'summoner', 'cleric'],
  ['brawler', 'brawler', 'mage', 'mage', 'cleric'],
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

  it('reads each front’s party guidance', () => {
    expect(partyGuidance('iron')).toBe('2 Brawler · 2 Spell Blade · Cleric')
    expect(partyGuidance('arcane')).toBe('2 Mage · 2 Summoner · Cleric')
    expect(partyGuidance('duel')).toBe('2 Brawler · 2 Mage · Cleric')
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
    expect(guidanceMatch(GUIDED[1]!, 'iron')).toBe(1)
    expect(bestParty(world, 'iron', OUTFITS, (i) => frontPartyBlock(world, run, i))).toBe(1)
    expect(bestParty(world, 'horde', OUTFITS, (i) => frontPartyBlock(world, run, i))).toBe(0)
    expect(bestParty(world, 'iron', OUTFITS, () => 'No')).toBeNull()
    expect(suggestConvergence(world, run, OUTFITS)).toEqual([1, 2, 3, 0])
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
