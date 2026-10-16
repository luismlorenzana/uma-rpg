import { DEFAULT_ROSTER_QUERY, EMPTY_FACETS } from '@rpg/domain'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { loadPrefs, savePrefs, type StablePrefs } from './stable-prefs'

beforeEach(() => {
  const storage = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
  })
})
afterEach(() => vi.unstubAllGlobals())

describe('H30 Stable preference reset', () => {
  it('ignores the old key once, opening on Uma Level descending without deleting the old record', () => {
    const old = JSON.stringify({ query: { ...DEFAULT_ROSTER_QUERY, sort: { key: 'release', direction: 'desc' } }, view: 'list' })
    localStorage.setItem('rpg.stable.v1', old)
    expect(loadPrefs()).toMatchObject({ query: { sort: { key: 'level', direction: 'desc' } }, view: 'grid' })
    expect(localStorage.getItem('rpg.stable.v1')).toBe(old)
  })

  it('remembers choices made after the reset under v2, including a custom sort', () => {
    const prefs: StablePrefs = { query: { ownership: 'owned', facets: EMPTY_FACETS, sort: { key: 'name', direction: 'asc' } }, view: 'list' }
    savePrefs(prefs)
    expect(JSON.parse(localStorage.getItem('rpg.stable.v2')!)).toEqual(prefs)
    expect(loadPrefs()).toEqual(prefs)
  })
})
