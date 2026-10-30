// Halls v2's seat cards from the switch (H133; halls-v2.md §2.1, §4, §5.2, HV21, HV25; inert until H134), with the switch
// mocked to 19: each shape's words from the Limit Break's casts (a double two hits, a volley's hits on her foe + its splash
// a foe), the seat's own power, the healers' stacks, the home class, the lore in place of the blurb; "Answers" and "Adds"
// on Classes v3's pairs; the title and the (i)'s rules.
import { BOND_EXP_PER_WIN, BOND_EXP_TO_NEXT, HERO_LIMIT_SCALE, heroLimit, placeById, rpgDefaultWeapons, type HeroLimitId } from '@rpg/domain'
import { describe, expect, it, vi } from 'vitest'
import { hallHelpV19, hallTitle, learnerAdds, seatCard, seatTwinSets, shapeLine } from './hall-view'

vi.mock('../../../../../packages/domain/src/rpg/battle/caps', async (orig) =>
  (await import('../../../../../packages/domain/src/rpg/battle/caps-at.fixture')).capsAt(19, await orig()))

const card = (id: HeroLimitId) => seatCard(heroLimit(id))
const line = (id: HeroLimitId) => shapeLine(card(id))

describe('the seat card from v19 (HV25)', () => {
  it('names the seat and its home class', () => {
    expect(card('brawler-2').seat).toBe('Seat 2 · Brawler')
    expect(card('spellblade-3').seat).toBe('Seat 3 · Tome Spellblade')
    expect(card('summoner-1').seat).toBe('Seat 1 · Arms Summoner')
    expect(card('healer-1').seat).toBe('Seat 1 · Paladin')
    expect(card('healer-4').seat).toBe('Seat 4 · Cleric')
    expect(card('mage-1').seat).toBe('Seat 1 · Sorcerer')
  })

  it('says each shape and the seat\'s own power, from the casts', () => {
    expect(line('brawler-1')).toBe('One foe · 3 hits · ×2.5')
    expect(line('brawler-2')).toBe('One foe · 1 hit · ×2.9')
    // Echo Draw: three draws, each a double.
    expect(line('brawler-3')).toBe('One foe · 6 hits · ×2.2')
    // Hundred-Shadow Rain: two volleys of 2 + 1.
    expect(line('mage-4')).toBe('Volley · 4 + 2 a foe · ×2.2')
    expect(line('brawler-4')).toBe('Volley · 4 + 2 a foe · ×2.2')
    expect(line('spellblade-1')).toBe('Random · 8 hits · ×1.9')
    expect(line('spellblade-2')).toBe('Random · 10 hits · ×1.9')
    expect(line('spellblade-3')).toBe('Random · 8 hits · ×1.9')
    expect(line('summoner-1')).toBe('Every foe · 3 hits · ×2.2')
  })

  it('adds a healer seat\'s one stack, curse or blessing', () => {
    expect(line('healer-1')).toBe('One foe · 4 hits · ×2.0 · Brave 1')
    expect(line('healer-2')).toBe('One foe · 4 hits · ×2.0 · Armor Break 1')
    expect(line('healer-3')).toBe('One foe · 4 hits · ×2.0 · Faith 1')
    expect(line('healer-4')).toBe('One foe · 4 hits · ×2.0 · Mind Break 1')
    expect(card('brawler-2').effect).toBeNull()
  })

  it('shows its lore in place of the blurb', () => {
    const limit = heroLimit('brawler-2')
    expect(limit.lore).toBeDefined()
    expect(card('brawler-2').line).toBe(limit.lore)
    expect(card('brawler-2').line).not.toBe(limit.blurb)
  })
})

describe('"Answers" and "Adds" on Classes v3\'s pairs (§5.2)', () => {
  it('reads the new twins: the Katana with Light, the Bow with Dark; Twilight stays Bow and Katana', () => {
    // Echo Draw (Katana) and Hundred-Arrow Rain (Bow).
    expect(seatTwinSets(heroLimit('brawler-3'))).toEqual(['light', 'twilight'])
    expect(seatTwinSets(heroLimit('brawler-4'))).toEqual(['dark', 'twilight'])
  })

  it('adds what a Brawler\'s defaults miss under Wisp Pact', () => {
    expect(learnerAdds(heroLimit('spellblade-4'), rpgDefaultWeapons('brawler'))).toEqual(['light', 'twilight'])
  })
})

describe('the hall page from v19', () => {
  it('takes the place\'s name for its title', () => {
    expect(hallTitle(placeById('brawler-dojo')!, 'brawler')).toBe('Warrior Dojo')
    expect(hallTitle(placeById('healer-sanctum')!, 'healer')).toBe('Healer Sanctum')
  })

  it('writes the (i) one rule a line, on the domain\'s numbers', () => {
    // H131's class scales, not the design's drafts (1 and 0.75).
    expect([HERO_LIMIT_SCALE.brawler, HERO_LIMIT_SCALE.paladin, HERO_LIMIT_SCALE.cleric, HERO_LIMIT_SCALE.recruit]).toEqual([0.95, 0.8, 0.8, 1])
    expect([BOND_EXP_PER_WIN.fight, BOND_EXP_PER_WIN.boss, BOND_EXP_TO_NEXT]).toEqual([2, 3, 12])
    expect(hallHelpV19()).toEqual([
      'Five halls, one per family; any Uma sits in any seat.',
      'A Hero casts her seat’s Limit Break at full strength.',
      'Its power is the seat’s (×1.9 to ×2.9), × her class’s scale (×0.95; a Paladin’s or a Cleric’s ×0.8; a Tier 0’s ×1), × her deepest skill.',
      'Up to 10 Learners a Hero, 2 Heroes a Learner, at 50% + 5% a Bond Level.',
      'A won fight raises each Bond: a stage 2, an elite or a boss 3, 12 a level.',
      'A Bond stays when she leaves.',
    ])
  })
})
