// The Halls' twin-set lines (H70, live since H72; class-progression.md §8.2, CP28): a seat's Limit Break answers its kinds'
// twin sets, and a Learner adds the ones her weapons miss.
import { heroLimitFor, heroLimitKinds, HERO_LIMIT_IDS, rpgAnsweredTwinSets, rpgDefaultWeapons } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { learnerAdds, seatTwinSets } from './hall-view'

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
