import { newOwnedUma, newSave } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { copyContents, dateWords, safetyRow } from './safety-view'

const NOW = '2026-10-30T13:15:00.000Z'

describe('a safety copy in words (D260)', () => {
  it('says what it held', () => {
    const save = newSave('Luis', NOW)
    save.tierWorlds['1']!.umas['101'] = { ...newOwnedUma(NOW), level: 20 }
    save.tierWorlds['1']!.umas['102'] = newOwnedUma(NOW)
    expect(copyContents(save)).toBe('2 Umas · best Lv 20')
  })

  it('trusts nothing about a copy\'s shape', () => {
    expect(copyContents(null)).toBe('')
    expect(copyContents({ nonsense: true })).toBe('')
    expect(copyContents({ tierWorlds: { 1: { umas: { 101: {} } } } })).toBe('1 Uma · best Lv 0')
  })

  it('titles a copy by when it was kept and says why', () => {
    expect(safetyRow({ uid: 'u', reason: 'replaced', at: NOW, revision: 3, save: {} })).toEqual({ title: dateWords(NOW), detail: 'Replaced by a newer save' })
    expect(safetyRow({ uid: 'u', reason: 'restore', at: NOW, revision: 3, save: {} }).detail).toBe('Before a restore')
  })
})
