import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { loadAlbumPrefs, saveAlbumPrefs } from '@luismlorenzana/uma-kit/roster'
import { configureKit } from '@luismlorenzana/uma-kit/ui'
import { prepareStablePrefs, seeStableOutfit } from './preferences'
import { STABLE_SCHEMA } from './rows'

beforeEach(() => {
  const rows = new Map<string, string>()
  vi.stubGlobal('localStorage', { getItem: (key: string) => rows.get(key) ?? null,
    setItem: (key: string, value: string) => rows.set(key, value), removeItem: (key: string) => rows.delete(key) })
  configureKit({ storagePrefix: 'rpg.' })
})
afterEach(() => vi.unstubAllGlobals())

describe('SB4 one-time Stable preferences', () => {
  it('carries list and custom sort over, seeds seen and deletes v2 only after successful persistence', () => {
    localStorage.setItem('rpg.stable.v2', JSON.stringify({ view: 'list', query: { sort: { key: 'name', direction: 'asc' } } }))
    localStorage.setItem('rpg.stable.v1', 'historical')
    prepareStablePrefs(['one', 'two'])
    expect(loadAlbumPrefs('stable', STABLE_SCHEMA)).toMatchObject({ query: { view: 'list', sort: 'name', direction: 'asc' }, seen: ['one', 'two'], fresh: false })
    expect(localStorage.getItem('rpg.stable.v2')).toBeNull()
    expect(localStorage.getItem('rpg.stable.v1')).toBe('historical')
  })

  it('defaults to five-column icons and Uma Level, rejecting malformed and retired values', () => {
    localStorage.setItem('rpg.stable.v2', '{broken')
    prepareStablePrefs(['existing'])
    expect(loadAlbumPrefs('stable', STABLE_SCHEMA)).toMatchObject({ query: { view: 'icons', sort: 'level', direction: 'desc' }, seen: ['existing'] })
  })

  it('never overwrites kit views, choices or seen ids on subsequent opens', () => {
    const query = { ...STABLE_SCHEMA.fallback, view: 'cards' as const, sort: 'craft' }
    saveAlbumPrefs('stable', { query, seen: ['old'], views: [{ name: 'Workers', query }] })
    localStorage.setItem('rpg.stable.v2', JSON.stringify({ view: 'list' }))
    prepareStablePrefs(['old', 'arrival'])
    expect(loadAlbumPrefs('stable', STABLE_SCHEMA)).toMatchObject({ query, views: [{ name: 'Workers', query }], seen: ['old'] })
    expect(localStorage.getItem('rpg.stable.v2')).toBeNull()
  })

  it('does not delete recoverable preferences when storage writes are blocked', () => {
    const old = JSON.stringify({ view: 'list' })
    vi.stubGlobal('localStorage', { getItem: (key: string) => key === 'rpg.stable.v2' ? old : null,
      setItem: () => { throw Error('Blocked') }, removeItem: vi.fn() })
    expect(() => prepareStablePrefs(['old'])).not.toThrow()
    expect(localStorage.removeItem).not.toHaveBeenCalled()
  })

  it('marks profiles opened outside the grid seen without changing saved views or the current query', () => {
    const query = { ...STABLE_SCHEMA.fallback, view: 'list' as const, sort: 'craft' }
    saveAlbumPrefs('stable', { query, views: [{ name: 'Workers', query }], seen: ['old'] })
    seeStableOutfit(['old', 'arrival', 'unseen'], 'arrival')
    expect(loadAlbumPrefs('stable', STABLE_SCHEMA)).toMatchObject({ query, views: [{ name: 'Workers', query }], seen: ['old', 'arrival'] })
    seeStableOutfit(['old', 'arrival', 'unseen'], 'missing')
    expect(loadAlbumPrefs('stable', STABLE_SCHEMA).seen).toEqual(['old', 'arrival'])
  })
})
