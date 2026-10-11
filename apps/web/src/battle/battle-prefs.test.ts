import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loadBattlePreferences, nextBattleSpeed, saveBattlePreferences } from './battle-prefs'

// Node 25 exposes an empty `localStorage` global in the test worker, so provide the tiny browser surface we use.
const values = new Map<string, string>()
const storage: Storage = {
  get length() { return values.size },
  clear: () => values.clear(),
  getItem: (key) => values.get(key) ?? null,
  key: (index) => [...values.keys()][index] ?? null,
  removeItem: (key) => { values.delete(key) },
  setItem: (key, value) => { values.set(key, value) },
}
Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage })

beforeEach(() => localStorage.clear())

describe('battle preferences', () => {
  it('starts safe, persists Auto and speed, and cycles speed', () => {
    expect(loadBattlePreferences()).toEqual({ auto: false, speed: 1 })
    saveBattlePreferences({ auto: true, speed: 4 })
    expect(loadBattlePreferences()).toEqual({ auto: true, speed: 4 })
    expect([nextBattleSpeed(1), nextBattleSpeed(2), nextBattleSpeed(4)]).toEqual([2, 4, 1])
  })

  it('ignores malformed data and unavailable storage', () => {
    localStorage.setItem('uma-rpg:battle-preferences', '{broken')
    expect(loadBattlePreferences()).toEqual({ auto: false, speed: 1 })
    const read = vi.spyOn(storage, 'getItem').mockImplementation(() => { throw new Error('blocked') })
    expect(loadBattlePreferences()).toEqual({ auto: false, speed: 1 })
    read.mockRestore()
    const write = vi.spyOn(storage, 'setItem').mockImplementation(() => { throw new Error('full') })
    expect(() => saveBattlePreferences({ auto: true, speed: 2 })).not.toThrow()
    write.mockRestore()
  })
})
