// The Halls' twin-set lines (H70, live since H72; class-progression.md §8.2, CP28): a seat's Limit Break answers its kinds'
// twin sets, and a Learner adds the ones her weapons miss. Halls v2's seat cards (H133; halls-v2.md §2.1, §4, §5.2, HV21,
// HV25; live since H134): each shape's words from the Limit Break's casts (a double two hits), the seat's own power, the
// healers' stacks, the home class, the lore in place of the blurb; "Answers" and "Adds" on Classes v3's pairs; the (i)'s
// rules. The trim (D261): the Dojo and the Tower seat two.
import {
  BOND_EXP_PER_WIN, BOND_EXP_TO_NEXT, HERO_LIMIT_IDS, HERO_LIMIT_SCALE, heroLimit, heroLimitFor, heroLimitIds, heroLimitKinds, rpgAnsweredTwinSets,
  rpgDefaultWeapons, type HeroLimitId,
} from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { hallHelp, learnerAdds, seatCard, seatTwinSets, shapeLine } from './hall-view'

describe('the Halls\' twin sets (H70)', () => {
  it('names the sets each seat answers', () => {
    for (const id of heroLimitIds(16)) {
      const limit = heroLimitFor(id, 16)
      if (!limit) continue
      expect(seatTwinSets(limit), id).toEqual(rpgAnsweredTwinSets(heroLimitKinds(limit)))
    }
  })

  it('adds only the sets her weapons miss', () => {
    // §8.2: a Brawler's defaults answer Fire, Ice and Lightning; a seat answering every set adds the other three.
    const brawler = rpgDefaultWeapons('brawler', 16)
    expect(rpgAnsweredTwinSets(brawler)).toEqual(['fire', 'ice', 'lightning'])
    const rainbow = heroLimitIds(16).map((id) => heroLimitFor(id, 16)).find((l) => l && rpgAnsweredTwinSets(heroLimitKinds(l)).length === 6)!
    expect(learnerAdds(rainbow, brawler)).toEqual(['light', 'dark', 'twilight'])
  })
})

const card = (id: HeroLimitId) => seatCard(heroLimit(id))
const line = (id: HeroLimitId) => shapeLine(card(id))

describe('the seat card (HV25)', () => {
  it('has a card for each of the sixteen live seats', () => {
    expect(HERO_LIMIT_IDS.map((id) => card(id).seat.split(' · ')[1])).toHaveLength(16)
  })

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
    expect(line('spellblade-1')).toBe('Random · 8 hits · ×1.9')
    expect(line('spellblade-2')).toBe('Random · 10 hits · ×1.9')
    expect(line('spellblade-3')).toBe('Random · 8 hits · ×1.9')
    expect(line('summoner-1')).toBe('Every foe · 3 hits · ×2.2')
    // A Light double in Seraph's Storm counts as two hits.
    expect(line('healer-3')).toContain('One foe · 4 hits')
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
    // Wisp Pact (Light, Katana) and Centaur Warband (Axe, Bow).
    expect(seatTwinSets(heroLimit('spellblade-4'))).toEqual(['light', 'twilight'])
    expect(seatTwinSets(heroLimit('summoner-1'))).toEqual(['ice', 'dark', 'twilight'])
  })

  it('adds what a Brawler\'s defaults miss under Wisp Pact', () => {
    expect(learnerAdds(heroLimit('spellblade-4'), rpgDefaultWeapons('brawler'))).toEqual(['light', 'twilight'])
  })
})

describe('the hall page', () => {
  it('writes the (i) one rule a line, on the domain\'s numbers', () => {
    // H131's class scales, not the design's drafts (1 and 0.75).
    expect([HERO_LIMIT_SCALE.brawler, HERO_LIMIT_SCALE.paladin, HERO_LIMIT_SCALE.cleric, HERO_LIMIT_SCALE.recruit]).toEqual([0.95, 0.8, 0.8, 1])
    expect([BOND_EXP_PER_WIN.fight, BOND_EXP_PER_WIN.boss, BOND_EXP_TO_NEXT]).toEqual([2, 3, 12])
    expect(hallHelp()).toEqual([
      'Five halls, one per family; any Uma sits in any seat.',
      'A Hero casts her seat’s Limit Break at full strength.',
      'Its power is the seat’s (×1.9 to ×2.9), × her class’s scale (×0.95; a Paladin’s or a Cleric’s ×0.8; a Tier 0’s ×1), × her deepest skill.',
      'Up to 10 Learners a Hero, 2 Heroes a Learner, at 50% + 5% a Bond Level.',
      'A won fight raises each Bond: a stage 2, an elite or a boss 3, 12 a level.',
      'A Bond stays when she leaves.',
    ])
  })
})
