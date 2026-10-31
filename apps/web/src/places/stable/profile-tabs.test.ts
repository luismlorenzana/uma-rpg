import type { UmaUpgrades } from '@rpg/domain'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { firstDotTab, PROFILE_TABS, profileDoor, storedTab, tabDots, tabFromRoute } from './profile-tabs'

let rows: Map<string, string>
beforeEach(() => {
  rows = new Map()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => rows.get(key) ?? null,
    setItem: (key: string, value: string) => rows.set(key, value),
    removeItem: (key: string) => rows.delete(key),
  })
})

describe('the profile v2 tab contract', () => {
  it('keeps the four fixed keys and labels in order', () => {
    expect(PROFILE_TABS).toEqual([
      { key: 'class', label: 'Class' },
      { key: 'gear', label: 'Gear' },
      { key: 'stars', label: 'Stars' },
      { key: 'template', label: 'Template' },
    ])
    expect(tabFromRoute('gear')).toBe('gear')
    expect(tabFromRoute('skills')).toBeNull()
    expect(tabFromRoute(undefined)).toBeNull()
  })

  it.each([
    ['skills', 'class'], ['battle', 'class'], ['gear', 'gear'], ['work', 'class'], ['racing', 'template'],
  ] as const)('migrates v2 %s to %s and removes the old key', (old, next) => {
    rows.set('rpg.profile.tab.v2', old)
    expect(storedTab()).toBe(next)
    expect(rows.has('rpg.profile.tab.v2')).toBe(false)
    expect(rows.get('rpg.profile.tab.v3')).toBe(next)
  })

  it('defaults unknown and missing values to Class', () => {
    expect(storedTab()).toBe('class')
    rows.set('rpg.profile.tab.v3', 'unknown')
    expect(storedTab()).toBe('class')
  })

  it('marks Gear, Stars and Template independently and chooses the first ready tab', () => {
    const upgrades = { gear: 2, stars: 1 } as UmaUpgrades
    expect(tabDots(upgrades, true)).toEqual({ class: false, gear: true, stars: true, template: true })
    expect(firstDotTab(tabDots(upgrades, true))).toBe('gear')
    expect(firstDotTab(tabDots({ gear: 0, stars: 1 } as UmaUpgrades, true))).toBe('stars')
    expect(firstDotTab(tabDots({ gear: 0, stars: 0 } as UmaUpgrades, true))).toBe('template')
    expect(firstDotTab(tabDots(null, false))).toBeNull()
  })

  it('builds one Back-aware profile door shape', () => {
    expect(profileDoor('81001', { tab: 'stars', list: ['81001', '81002'] })).toEqual({
      to: '/town/stable/outfit/81001/stars',
      state: { back: true, list: ['81001', '81002'] },
    })
  })
})
