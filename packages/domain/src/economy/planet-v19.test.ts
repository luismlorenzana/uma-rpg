// Classes v3's Prowess and armor's offense (H126; classes-v3.md §2.4, §3; CV7, CV18): a Tier 0's split by her slots, a third
// a slot to its channel, half up to ATK (3 Arms all ATK, 2 + 1 two thirds, 1 + 2 one third, 3 Tomes none); the new hybrids
// mirror their pair; every Tier 1 percentage as today.
import { describe, expect, it } from 'vitest'
import { gradePoints, newGrades, type UmaGrades } from './grades'
import { mapPoints, PROWESS_SPLIT, prowessSplit } from './planet'
import { ARMOR_SLOTS } from './ranks'
import type { RpgWeapon } from '../rpg/kinds'

const ARMS3: RpgWeapon[] = ['greatsword', 'axe', 'lance']
const ARMS2: RpgWeapon[] = ['katana', 'lance', 'tome-lightning']
const ARMS1: RpgWeapon[] = ['tome-dark', 'tome-ice', 'axe']
const ARMS0: RpgWeapon[] = ['tome-fire', 'tome-ice', 'tome-lightning']

describe('Prowess by her slots (CV7)', () => {
  it('splits a Tier 0\'s node a third a slot, half up to ATK', () => {
    for (const c of ['recruit', 'duelist', 'acolyte', 'caller', 'apprentice'] as const) {
      expect([ARMS3, ARMS2, ARMS1, ARMS0].map((w) => prowessSplit(10, c, w)), c).toEqual([
        { atk: 10, matk: 0 }, { atk: 7, matk: 3 }, { atk: 3, matk: 7 }, { atk: 0, matk: 10 },
      ])
    }
    // Half up: 5 points, 2 Arms → 3.33 → 3; 1 Arm → 1.67 → 2; 4 points, 1 Arm → 1.33 → 1; 2 Arms → 2.67 → 3.
    expect([prowessSplit(5, 'recruit', ARMS2), prowessSplit(5, 'recruit', ARMS1), prowessSplit(4, 'recruit', ARMS1), prowessSplit(4, 'recruit', ARMS2)])
      .toEqual([{ atk: 3, matk: 2 }, { atk: 2, matk: 3 }, { atk: 1, matk: 3 }, { atk: 3, matk: 1 }])
    // Without her weapons, her class's defaults (the Warrior's three Arms, the Summoner's one).
    expect([prowessSplit(9, 'recruit'), prowessSplit(9, 'caller')]).toEqual([{ atk: 9, matk: 0 }, { atk: 3, matk: 6 }])
  })

  it('keeps every Tier 1 percentage, the new hybrids their pair\'s mirror', () => {
    expect(PROWESS_SPLIT).toEqual({ brawler: 100, mage: 0, spellblade: 70, summoner: 30, paladin: 80, cleric: 20, armsummoner: 70, tomeblade: 30 })
    expect([prowessSplit(10, 'armsummoner'), prowessSplit(10, 'tomeblade'), prowessSplit(10, 'spellblade', ARMS0)]).toEqual([
      { atk: 7, matk: 3 }, { atk: 3, matk: 7 }, { atk: 7, matk: 3 },
    ])
  })

  it('reads her slots on the whole map', () => {
    const open = ['prowess:1', 'prowess:2', 'prowess:3']
    const at = (w: RpgWeapon[]) => { const p = mapPoints(open, 'duelist', 1, undefined, w); return [p.atk, p.matk] }
    // Prowess I–III: 2 + 4 + 6 points, each node split on its own.
    expect([at(ARMS3), at(ARMS2), at(ARMS1), at(ARMS0)]).toEqual([[12, 0], [8, 4], [4, 8], [0, 12]])
  })
})

describe('armor\'s offense by her slots (CV7, CV18)', () => {
  const graded = (grade: number): UmaGrades => ({ ...newGrades(1), armor: Object.fromEntries(ARMOR_SLOTS.map((s) => [s, { grade }])) })
  it('splits the five pieces\' offense a third a slot, half up to ATK; a Tier 1 class\'s all to her channel', () => {
    const g = graded(9)
    const whole = gradePoints(g, 'physical', 1)
    const offense = whole.atk
    expect(offense).toBe(25)
    expect([3, 2, 1, 0].map((arms) => { const p = gradePoints(g, 'physical', 1, arms); return [p.atk, p.matk] })).toEqual([[25, 0], [17, 8], [8, 17], [0, 25]])
    // Every other stat as her class's half gives it.
    const { atk: _a, matk: _m, ...rest } = gradePoints(g, 'magical', 1, 2)
    const { atk: _b, matk: _n, ...same } = whole
    expect(rest).toEqual(same)
    expect([gradePoints(g, 'magical', 1).matk, gradePoints(g, 'magical', 1).atk]).toEqual([25, 0])
  })
})
