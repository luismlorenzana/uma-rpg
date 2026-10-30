// "Can upgrade"'s Promote reason, live since H134 (H137, D253; classes-v3.md §14.1's dot): a Tier 0 she fights as at Class
// Rank 10 with a child she doesn't hold counts, so the Stable's mark and filter find her. Nothing else moves; at engine 18
// (v18's six classes, no promotion) the reason is never there. `upgrades.test.ts` is the v1 economy's record (mocked to
// 16), so this file stays apart. Invented Umas only.
import { describe, expect, it } from 'vitest'
import type { RpgClass } from '../rpg/rules'
import { gradedUma, gradedWorld } from './economy-v3.fixture'
import { umaPromotionWaits, upgradesFor } from './upgrades'

type Tracks = Partial<Record<RpgClass, { rank: number; exp: number }>>
/** Uma '101' fighting as `classId` with these Class Ranks, nothing else to raise. */
const world = (classId: RpgClass, classes: Tracks) => {
  const uma = gradedUma({ classId })
  return gradedWorld({ umas: { '101': { ...uma, ranks: { ...uma.ranks, classes } } } })
}
const up = (classId: RpgClass, classes: Tracks, tier = 1, engine?: number) => upgradesFor(world(classId, classes), '101', classId, tier, engine)!

describe('Promote: a waiting promotion counts as an upgrade (H137)', () => {
  it('counts a Warrior at R10 with a child she doesn\'t hold, as the one reason', () => {
    expect(up('recruit', { recruit: { rank: 10, exp: 400 } })).toMatchObject({ promote: true, gear: 0, stars: 0, any: true })
    // One sibling held is still a promotion waiting: the other two are hers to take.
    expect(up('recruit', { recruit: { rank: 10, exp: 0 }, brawler: { rank: 12, exp: 0 } }).promote).toBe(true)
  })

  it('doesn\'t count below R10, with every child held, as a Tier 1 class, in a later tier, or on engine 18', () => {
    expect(up('recruit', { recruit: { rank: 9, exp: 527 } })).toMatchObject({ promote: false, any: false })
    const all: Tracks = { recruit: { rank: 10, exp: 0 }, brawler: { rank: 10, exp: 0 }, spellblade: { rank: 10, exp: 0 }, armsummoner: { rank: 10, exp: 0 } }
    expect(up('recruit', all).promote).toBe(false)
    expect(up('brawler', { recruit: { rank: 10, exp: 0 }, brawler: { rank: 14, exp: 0 } }).promote).toBe(false)
    expect(up('recruit', { recruit: { rank: 10, exp: 0 } }, 2).promote).toBe(false)
    expect(up('recruit', { recruit: { rank: 10, exp: 0 } }, 1, 18).promote).toBe(false)
  })

  it('reads the rule from the class tree: the Healer\'s two, the Mage\'s three', () => {
    expect(umaPromotionWaits({ classes: { acolyte: { rank: 10 }, paladin: { rank: 10 } } }, 'acolyte')).toBe(true)
    expect(umaPromotionWaits({ classes: { acolyte: { rank: 10 }, paladin: { rank: 10 }, cleric: { rank: 11 } } }, 'acolyte')).toBe(false)
    expect(umaPromotionWaits({ classes: { apprentice: { rank: 10 }, mage: { rank: 30 }, tomeblade: { rank: 10 } } }, 'apprentice')).toBe(true)
    expect(umaPromotionWaits({ classes: {} }, 'apprentice')).toBe(false)
  })
})
