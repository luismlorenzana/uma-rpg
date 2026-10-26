// D220's master-data-aware compatibility repair. All outfits are synthetic.
import type { AptitudeGrade, Aptitudes } from '@luismlorenzana/uma-data'
import { describe, expect, it } from 'vitest'
import { repairCallingChoices, type CallingRepairOutfit } from './calling-repair'
import { newOwnedUma, newSave } from './save'

type Grades<K extends string> = Partial<Record<K, AptitudeGrade>>
const NOW = '2026-10-26T12:00:00.000Z'
const LATER = '2026-10-26T13:00:00.000Z'
const outfit = (outfitId: string, style: Grades<keyof Aptitudes['strategy']>, power: number, wit: number): CallingRepairOutfit => ({
  outfitId, baseStats: { power, wit },
  aptitudes: {
    strategy: { front: 'B', pace: 'B', late: 'B', end: 'B', ...style },
    distance: { sprint: 'B', mile: 'B', medium: 'A', long: 'B' },
  },
})

const PACE_LATE = outfit('101', { pace: 'A', late: 'A' }, 90, 100)
const LATE_END = outfit('102', { late: 'A', end: 'A' }, 110, 90)
const PURE_LATE = outfit('103', { late: 'A' }, 110, 90)

describe('the D220 save repair', () => {
  it('repairs changed choices in every owned tier without moving classes', () => {
    const save = newSave('Trainer', NOW)
    save.tierWorlds['1']!.umas = {
      '101': { ...newOwnedUma(NOW, 'summoner'), calling: { pick: null, confirmed: true } },
      '102': { ...newOwnedUma(NOW, 'paladin'), calling: { pick: 'cleric', confirmed: true } },
      '103': { ...newOwnedUma(NOW, 'paladin'), calling: { pick: 'cleric', confirmed: true } },
      '999': newOwnedUma(NOW, 'brawler'),
    }
    const repaired = repairCallingChoices(save, [PACE_LATE, LATE_END, PURE_LATE], LATER)
    expect(repaired.account.updatedAt).toBe(LATER)
    expect(repaired.tierWorlds['1']!.umas['101']).toMatchObject({ classId: 'summoner', calling: { pick: 'mage', confirmed: false } })
    expect(repaired.tierWorlds['1']!.umas['102']).toMatchObject({ classId: 'paladin', calling: { pick: null, confirmed: true } })
    expect(repaired.tierWorlds['1']!.umas['103']!.calling).toEqual({ pick: 'cleric', confirmed: true })
    expect(repaired.tierWorlds['1']!.umas['999']).toBe(save.tierWorlds['1']!.umas['999'])
    expect(repairCallingChoices(repaired, [PACE_LATE, LATE_END, PURE_LATE], LATER)).toBe(repaired)
  })

  it('leaves an already-open new choice and an unchanged save alone', () => {
    const save = newSave('Trainer', NOW)
    save.tierWorlds['1']!.umas = { '101': newOwnedUma(NOW, 'summoner') }
    expect(repairCallingChoices(save, [PACE_LATE], LATER)).toBe(save)
  })
})
