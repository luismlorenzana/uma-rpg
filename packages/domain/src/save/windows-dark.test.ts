// Windows while the collections are dark (save v34, before H157): nothing is written and an old save parses as before.
import { describe, expect, it } from 'vitest'
import { collectionsLive } from './collections'
import { OUTFITS, riftWorldSave, T, TWENTY } from './rift-rules.fixture'
import { newSave, parseSave } from './save'
import { latchWindows, recordChampion, recordRiftWin } from './windows'

describe('the collections, dark', () => {
  it('stay off until save v35', () => {
    expect(collectionsLive()).toBe(false)
    expect(collectionsLive(35)).toBe(true)
  })

  it('write nothing', () => {
    const save = riftWorldSave()
    expect(save.account.windows).toBeUndefined()
    expect(save.tierWorlds['1']!.drills).toBeUndefined()
    expect(latchWindows(save, OUTFITS, T(10))).toBe(save)
    expect(recordChampion(save, '1', 'w1-capital-r1-s2', TWENTY)).toBe(save)
    expect(recordRiftWin(save, '1', TWENTY, T(10))).toBe(save)
  })

  it('refuse a v35 field in a v34 save, so an old client cannot half-write one', () => {
    const save = JSON.parse(JSON.stringify(newSave('W', T(0))))
    save.account.windows = {}
    expect(() => parseSave(save)).toThrow(/unknown keys windows/)
  })
})
