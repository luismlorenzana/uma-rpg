// Presets on the twins re-paired (H128; classes-v3.md §3, §3.8, §4.3; CV13), live since H134: a hybrid's Orb or Bell sits
// on her lead half's kind that twins her lone weapon in v19's pairs, and each hybrid's defaults hold one twin set in both
// halves, four different sets; v18's pairs stay for v18's fights, engine 18 explicit.
import { describe, expect, it } from 'vitest'
import { BATTLE_ENGINE_VERSION } from '../rpg/battle/caps'
import { isRpgTome, rpgAnsweredTwinSets, rpgDefaultWeapons, rpgHand, type RpgClass, type RpgTwinSet, type RpgWeapon } from '../rpg/rules'
import { presetAccessory, presetKind } from './presets'

const HYBRIDS = ['spellblade', 'tomeblade', 'armsummoner', 'summoner'] as const
/** Her lead half's and her other half's weapons, by her hand's `lead`. */
function halves(classId: RpgClass, weapons: readonly RpgWeapon[]): [RpgWeapon[], RpgWeapon[]] {
  const tome = rpgHand({ classId }).lead === 'tome'
  return [weapons.filter((w) => isRpgTome(w) === tome), weapons.filter((w) => isRpgTome(w) !== tome)]
}
/** The twin sets both halves answer, Twilight aside (it holds no element). */
function heldInBoth(classId: RpgClass, weapons: readonly RpgWeapon[], engine?: number): RpgTwinSet[] {
  const [lead, other] = halves(classId, weapons).map((h) => rpgAnsweredTwinSets(h, engine))
  return lead!.filter((set) => set !== 'twilight' && other!.includes(set))
}

describe('presets on v19\'s twins (CV13), the live game', () => {
  it('runs with Classes v3 live', () => {
    expect(BATTLE_ENGINE_VERSION).toBe(20)
  })

  it('puts an Orb or a Bell on the Arms Spellblade\'s Lance, the Tome Spellblade\'s Light, the Arms Summoner\'s Bow, the Tome Summoner\'s Blizzard', () => {
    const kinds = HYBRIDS.map((c) => presetKind(c, rpgDefaultWeapons(c)))
    expect(HYBRIDS.map((c) => rpgDefaultWeapons(c))).toEqual([['katana', 'lance', 'tome-lightning'], ['tome-light', 'tome-lightning', 'katana'],
      ['bow', 'axe', 'tome-dark'], ['tome-dark', 'tome-ice', 'axe']])
    expect(kinds).toEqual(['lance', 'light', 'bow', 'ice'])
    for (const family of ['orb', 'bell'] as const) {
      expect(HYBRIDS.map((c) => presetAccessory(c, rpgDefaultWeapons(c), family)), family)
        .toEqual(kinds.map((kind) => ({ family, kind })))
    }
  })

  it('follows the fight\'s engine: v18\'s pairs put the Tome Summoner\'s on her Light for v18\'s Bow, v19\'s on her Dark', () => {
    const v18 = rpgDefaultWeapons('summoner', 18)
    expect(v18).toEqual(['tome-dark', 'tome-light', 'bow'])
    expect([presetKind('summoner', v18, 18), presetKind('summoner', v18, 19)]).toEqual(['light', 'dark'])
    // The Tome Spellblade's Katana twins her Light only from v19; at 18 her lead half's first stands in.
    expect([presetKind('tomeblade', ['tome-lightning', 'tome-light', 'katana'], 18), presetKind('tomeblade', ['tome-lightning', 'tome-light', 'katana'])])
      .toEqual(['lightning', 'light'])
  })

  it('holds one twin set in both halves of each hybrid\'s defaults, four different sets', () => {
    const sets = HYBRIDS.map((c) => heldInBoth(c, rpgDefaultWeapons(c)))
    expect(sets).toEqual([['lightning'], ['light'], ['dark'], ['ice']])
    expect(new Set(sets.flat()).size).toBe(4)
    // On v18's pairs the Tome Spellblade and the Arms Summoner would hold none.
    expect(HYBRIDS.map((c) => heldInBoth(c, rpgDefaultWeapons(c), 18))).toEqual([['lightning'], [], [], ['ice']])
  })
})
