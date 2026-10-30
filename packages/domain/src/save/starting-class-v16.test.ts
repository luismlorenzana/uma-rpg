// The start by calling with the Tier rework's fight (H67; CP29, uma-templates §2.3; live from H72, D210). A new unlock
// starts in her calling, and the save writes that start as her class, so `activeClass`'s style fallback is left to Umas
// unlocked before the switch. v16–v18's calling is one class, the pick's pre-selection (engine 18 explicit); from v19
// (Classes v3, live since H134) her calling's Tier 0 (CV10, CV19). v15's starts, which `startingClass(…, 15)` still
// answers: `starting-class-v2.test.ts`. Invented outfits only.
import type { AptitudeGrade, Aptitudes } from '@luismlorenzana/uma-data'
import { describe, expect, it } from 'vitest'
import { BATTLE_ENGINE_VERSION, rpgRework } from '../rpg/battle/caps'
import { activeClass, startingClass, type BattleOutfit } from './class'
import { unlockUma, worldOf } from './rules'
import { armorHalf } from '../economy/grades'
import { newOwnedUma, newSave } from './save'


const T0 = '2026-10-25T12:00:00.000Z'
type Grades<K extends string> = Partial<Record<K, AptitudeGrade>>
const outfit = (outfitId: string, style: Grades<keyof Aptitudes['strategy']>, distance: Grades<keyof Aptitudes['distance']>, power: number,
  wit: number): BattleOutfit => ({
  outfitId, baseStats: { speed: 100, stamina: 100, power, guts: 100, wit },
  growthRatePercents: { speed: 10, stamina: 0, power: 0, guts: 0, wit: 0 },
  aptitudes: { strategy: { front: 'B', pace: 'B', late: 'B', end: 'B', ...style }, distance: { sprint: 'B', mile: 'B', medium: 'B', long: 'B', ...distance } },
})

// One per calling row, in row order.
const ROWS = [
  outfit('301', { front: 'A' }, { long: 'A' }, 100, 90),
  outfit('302', { late: 'A', end: 'A' }, { medium: 'A' }, 104, 90),
  outfit('303', { end: 'A' }, { long: 'A' }, 104, 90),
  outfit('304', { pace: 'A' }, { sprint: 'A', mile: 'A' }, 104, 90),
  outfit('305', { pace: 'A' }, { mile: 'A' }, 104, 90),
  outfit('306', { pace: 'A' }, { medium: 'A' }, 90, 104),
  outfit('307', { late: 'A' }, { medium: 'A' }, 104, 90),
  outfit('308', { late: 'A' }, { mile: 'A' }, 90, 104),
]

describe('the start by calling, engine v16 (H67)', () => {
  it('runs with the Tier rework’s fight live, and Classes v3 since H134', () => {
    expect([BATTLE_ENGINE_VERSION, rpgRework('fight'), rpgRework('classes')]).toEqual([19, true, true])
  })

  it('starts her in her calling, where v15 started her in her style’s class', () => {
    expect(ROWS.map((o) => startingClass(o, 18))).toEqual(['brawler', 'summoner', 'summoner', 'brawler', 'spellblade', 'mage', 'paladin', 'cleric'])
    expect(ROWS.map((o) => startingClass(o, 15))).toEqual(['brawler', 'paladin', 'summoner', 'mage', 'mage', 'mage', 'paladin', 'cleric'])
    // A Late + End closer, a Pace sprinter with Power, a Late Uma with Power over Wit.
    expect([ROWS[1]!, ROWS[3]!, ROWS[6]!].map((o) => startingClass(o, 18))).toEqual(['summoner', 'brawler', 'paladin'])
    // Without base stats (never from master data) she reads Power = Wit: magical.
    expect(startingClass({ aptitudes: ROWS[4]!.aptitudes }, 18)).toBe('mage')
    // From v19 her calling is her Tier 0, by her best running styles alone (`classes-v19.test.ts`).
    expect(ROWS.map((o) => startingClass(o))).toEqual(['recruit', 'caller', 'caller', 'duelist', 'duelist', 'duelist', 'acolyte', 'acolyte'])
  })

  it('writes every start as her class, with its armor', () => {
    let save = newSave('Trainer', T0)
    for (const o of ROWS) save = unlockUma(save, o.outfitId, T0, '1', startingClass(o))
    const { umas } = worldOf(save)
    expect(ROWS.map((o) => umas[o.outfitId]!.classId)).toEqual(['recruit', 'caller', 'caller', 'duelist', 'duelist', 'duelist', 'acolyte', 'acolyte'])
    expect(ROWS.map((o) => activeClass(o, umas[o.outfitId]!))).toEqual(ROWS.map((o) => startingClass(o)))
    // v28 (H82): every grade G0, and her armor's half her class's.
    for (const o of ROWS) expect(umas[o.outfitId]!.gear).toEqual({ weapons: {}, armor: {}, accessories: [{ grade: 0, family: null, form: 'base' }] })
    expect(ROWS.map((o) => armorHalf(umas[o.outfitId]!.classId!))).toEqual(['physical', 'magical', 'magical', 'physical', 'physical', 'physical', 'magical', 'magical'])
  })

  it('writes her start as her class, and no start writes no class', () => {
    expect(newOwnedUma(T0).classId).toBeNull()
    expect(newOwnedUma(T0, 'mage').classId).toBe('mage')
    expect(newOwnedUma(T0, 'paladin').classId).toBe('paladin')
  })
})
