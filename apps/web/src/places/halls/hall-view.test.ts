// The Halls' twin-set lines (H70, live since H72; class-progression.md §8.2, CP28): a seat's Limit Break answers its kinds'
// twin sets, and a Learner adds the ones her weapons miss. On the live engine (v18) Halls v2's card adds nothing (H133).
import { HERO_HALL_PLACES, heroHalls, heroLimit, heroLimitFor, heroLimitKinds, HERO_LIMIT_IDS, placeById, rpgAnsweredTwinSets, rpgDefaultWeapons } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { hallTitle, learnerAdds, seatCard, seatTwinSets, shapeLine } from './hall-view'

describe('the Halls\' twin sets (H70)', () => {
  it('names the sets each seat answers', () => {
    for (const id of HERO_LIMIT_IDS) {
      const limit = heroLimitFor(id, 16)
      if (!limit) continue
      expect(seatTwinSets(limit), id).toEqual(rpgAnsweredTwinSets(heroLimitKinds(limit)))
    }
  })

  it('adds only the sets her weapons miss', () => {
    // §8.2: a Brawler's defaults answer Fire, Ice and Lightning; a seat answering every set adds the other three.
    const brawler = rpgDefaultWeapons('brawler', 16)
    expect(rpgAnsweredTwinSets(brawler)).toEqual(['fire', 'ice', 'lightning'])
    const rainbow = HERO_LIMIT_IDS.map((id) => heroLimitFor(id, 16)).find((l) => l && rpgAnsweredTwinSets(heroLimitKinds(l)).length === 6)!
    expect(learnerAdds(rainbow, brawler)).toEqual(['light', 'dark', 'twilight'])
  })
})

describe('Halls v2\'s card before the switch (H133)', () => {
  it('is today\'s card on every live seat: "Seat n · Limit Break" and the blurb, no shape line', () => {
    for (const id of HERO_LIMIT_IDS) {
      const limit = heroLimit(id)
      const card = seatCard(limit)
      expect(card, id).toEqual({ seat: `Seat ${id.slice(-1)} · Limit Break`, shape: null, power: null, effect: null, line: limit.blurb })
      expect(shapeLine(card), id).toBeNull()
    }
  })

  it('keeps today\'s titles: "Brawler Hall of Heroes" for each of the six halls', () => {
    expect(heroHalls().map((h) => hallTitle(placeById(HERO_HALL_PLACES[h])!, h))).toEqual([
      'Brawler Hall of Heroes', 'Mage Hall of Heroes', 'Spell Blade Hall of Heroes', 'Cleric Hall of Heroes', 'Summoner Hall of Heroes',
      'Paladin Hall of Heroes',
    ])
  })
})
