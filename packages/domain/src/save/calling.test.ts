// The calling pick over the save (H69, D205; class-progression.md §10, CP29–CP30; uma-templates UT17), live from H72
// (D210) until H134. From v19 (Classes v3, CV19) there is no pick: her calling is her best running style's Tier 0,
// `pickCalling` is refused and save v32's Uma stores no `calling`. v18's pick stays for v18's fights and for the migration
// chain, which reads the old rows: those rules are here with engine 18 explicit. The live pick's save tests (the pick
// moving her start and armor half, its confirmation by a win, a Sweep, the Rift, and Ascend carrying it) retired with it.
// Invented outfits.
import type { AptitudeGrade, Aptitudes } from '@luismlorenzana/uma-data'
import { describe, expect, it } from 'vitest'
import { CALLING_NO_PICK, CALLING_SET, umaCalling, umaCallingPick, umaCallingPickBlock } from '../roster/template'
import { callingConfirmed, confirmCalling, pickCalling, startingClass, type BattleOutfit } from './battle'
import { unlockUma, worldOf } from './rules'
import { newOwnedUma, newSave, parseSave, type Save } from './save'

const T = (n: number) => new Date(Date.UTC(2026, 9, 25, 12) + n * 60_000).toISOString()
type Grades<K extends string> = Partial<Record<K, AptitudeGrade>>
const outfit = (outfitId: string, style: Grades<keyof Aptitudes['strategy']>, distance: Grades<keyof Aptitudes['distance']>, power: number,
  wit: number): BattleOutfit => ({
  outfitId, baseStats: { speed: 110, stamina: 110, power, guts: 110, wit },
  growthRatePercents: { speed: 10, stamina: 0, power: 0, guts: 0, wit: 0 },
  aptitudes: { strategy: { front: 'B', pace: 'B', late: 'B', end: 'B', ...style }, distance: { sprint: 'B', mile: 'B', medium: 'B', long: 'B', ...distance } },
})
/** v18's rows: a front runner (row 1, no pick), a Pace Uma with Power (row 5: Spell Blade, or Mage), a Wit-led Pace Uma
 * (row 6), an end closer (row 3) and a Late Uma with Power (row 7: Paladin, or Cleric). */
const FRONT = outfit('301', { front: 'A' }, { long: 'A' }, 104, 90)
const PACE = outfit('305', { pace: 'A' }, { mile: 'A' }, 104, 90)
const PACE_WIT = outfit('306', { pace: 'A' }, { medium: 'A' }, 90, 104)
const END = outfit('303', { end: 'A' }, { long: 'A' }, 104, 90)
const LATE = outfit('307', { late: 'A' }, { medium: 'A' }, 104, 90)
const PARTY = [FRONT, PACE, PACE_WIT, END, LATE]

/** The five unlocked in their starts (H67). */
const unlocked = (): Save => PARTY.reduce((s, o) => unlockUma(s, o.outfitId, T(0), '1', startingClass(o)), newSave('Trainer', T(0)))

describe('the calling pick, retired from v19 (CV19)', () => {
  it('is refused for every Uma, reads her style\'s Tier 0 whatever the pick, and is stored on no new Uma', () => {
    const save = unlocked()
    for (const [o, pick] of [[FRONT, 'mage'], [PACE, 'mage'], [PACE, 'spellblade'], [LATE, 'cleric']] as const) {
      expect(() => pickCalling(save, o, pick, T(1))).toThrow(CALLING_NO_PICK)
    }
    expect(PARTY.map((o) => umaCallingPick(o))).toEqual(PARTY.map(() => null))
    expect(PARTY.map((o) => umaCalling(o, 'mage'))).toEqual(['recruit', 'duelist', 'duelist', 'caller', 'acolyte'])
    expect('calling' in newOwnedUma(T(0))).toBe(false)
    expect(PARTY.filter((o) => 'calling' in worldOf(save).umas[o.outfitId]!)).toEqual([])
    // Nothing to confirm: the card's Confirm changes nothing (an Uma not owned is still refused).
    expect(confirmCalling(save, '305', T(1))).toBe(save)
    expect(() => confirmCalling(save, '999', T(2))).toThrow('only owned Umas can fight')
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
  })
})

describe('v18\'s calling pick, engine 18 explicit (v18\'s fights and the migration chain read it)', () => {
  it('stores it open on every new v18 Uma', () => {
    expect(newOwnedUma(T(0), undefined, 18).calling).toEqual({ pick: null, confirmed: false })
    expect(newOwnedUma(T(0), 'brawler', 18).calling).toEqual({ pick: null, confirmed: false })
  })

  it('offers a Pace or Late Uma her row\'s two; refuses a front runner, an end closer and a confirmed pick', () => {
    expect([FRONT, END].map((o) => umaCallingPick(o, 18))).toEqual([null, null])
    expect([PACE, PACE_WIT, LATE].map((o) => umaCallingPick(o, 18)!.options)).toEqual([['spellblade', 'mage'], ['mage', 'spellblade'], ['paladin', 'cleric']])
    expect([FRONT, END].map((o) => umaCallingPickBlock(o, { pick: null, confirmed: false }, 18))).toEqual([CALLING_NO_PICK, CALLING_NO_PICK])
    expect(umaCallingPickBlock(PACE, { pick: null, confirmed: false }, 18)).toBeNull()
    expect(umaCallingPickBlock(PACE, { pick: 'mage', confirmed: true }, 18)).toBe(CALLING_SET)
  })

  it('reads her pick only when it is one of her two, and her first win confirms it, the pick (or none) kept', () => {
    expect([umaCalling(PACE, null, 18), umaCalling(PACE, 'mage', 18), umaCalling(PACE, 'paladin', 18)]).toEqual(['spellblade', 'mage', 'spellblade'])
    expect([umaCalling(LATE, 'cleric', 18), umaCalling(LATE, 'mage', 18)]).toEqual(['cleric', 'paladin'])
    const picked = { ...newOwnedUma(T(0), 'spellblade', 18), calling: { pick: 'mage' as const, confirmed: false } }
    const confirmed = callingConfirmed(picked, 18)
    expect(confirmed.calling).toEqual({ pick: 'mage', confirmed: true })
    expect(callingConfirmed(confirmed, 18)).toBe(confirmed)
    expect(callingConfirmed(newOwnedUma(T(0), 'brawler', 18), 18).calling).toEqual({ pick: null, confirmed: true })
  })
})
