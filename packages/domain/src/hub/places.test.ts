import { describe, expect, it } from 'vitest'
import { CURRENT_SLICE, HUB_PAGES, PLACES, SLICES, isOpen, placeById, placeLock, placeOnPage, placeOpen, placesOn } from './places'

// Smallest supported phone (375×667): the map area is about 375 × 500 pt after the bars.
const MAP_W = 375
const MAP_H = 500
const MIN_GAP = 44

describe('place registry', () => {
  it('has 23 visible places on four pages in the bar\'s order (D147) plus the hidden Account', () => {
    expect(PLACES.filter((p) => !p.hidden)).toHaveLength(23)
    expect(new Set(PLACES.map((p) => p.id)).size).toBe(PLACES.length)
    expect(HUB_PAGES).toEqual(['town', 'learning', 'battle', 'wilds'])
    expect(HUB_PAGES.map((page) => placesOn(page).length)).toEqual([4, 6, 2, 11])
    expect(PLACES.filter((p) => p.direct).map((p) => p.id)).toEqual(['scenario-gate'])
  })

  it('keeps every place on a page at least 44 pt apart on the smallest phone', () => {
    for (const page of HUB_PAGES) {
      const places = placesOn(page)
      for (const a of places)
        for (const b of places) {
          if (a === b) continue
          const dx = (a.at.x - b.at.x) * MAP_W
          const dy = (a.at.y - b.at.y) * MAP_H
          expect(Math.hypot(dx, dy), `${a.id} ↔ ${b.id}`).toBeGreaterThanOrEqual(MIN_GAP * 1.5)
        }
      for (const p of places) {
        expect(p.at.x).toBeGreaterThan(0.1)
        expect(p.at.x).toBeLessThan(0.9)
        expect(p.at.y).toBeGreaterThan(0.05)
        expect(p.at.y).toBeLessThan(0.95)
      }
    }
  })

  it('opens every place in a known slice, with S1 live only for the Stable, Scenario Gate and Account', () => {
    for (const p of PLACES) expect(SLICES).toContain(p.opensIn)
    expect(PLACES.filter((p) => isOpen(p, 'S1')).map((p) => p.id).sort()).toEqual(['account', 'scenario-gate', 'stable'])
  })

  it('resolves a place only on its own page', () => {
    expect(placeOnPage('wilds', 'mine')?.name).toBe('Mine')
    expect(placeOnPage('learning', 'mine')).toBeUndefined()
    expect(placeOnPage('battle', 'scenario-gate')?.name).toBe('Scenario Gate')
    expect(placeOnPage('town', 'nowhere')).toBeUndefined()
  })
})

describe('the Rift (H50)', () => {
  const rift = placeById('tier-finale')!
  /** A world with `n` Umas at Lv 50 and one at Lv 49. */
  const world = (n: number) => ({ umas: Object.fromEntries([...Array.from({ length: n }, (_, i) => [`${100 + i}`, { level: 50 }]), ['99', { level: 49 }]]) })

  it('keeps the Tier Finale id under its new name and building frame', () => {
    expect(rift).toMatchObject({ page: 'battle', name: 'The Rift', frame: 'rift', opensIn: 'S8' })
    expect(rift.blurb).toBe('Twenty Lv 50 Umas seal four fronts, then ascend together.')
    expect(CURRENT_SLICE).toBe('S8')
    expect(PLACES.filter((p) => p.frame).map((p) => p.id)).toEqual(['tier-finale'])
  })

  it('opens only with five Lv 50 Umas, in Tiers 1 and 2', () => {
    for (const tier of [1, 2]) {
      expect(placeOpen(rift, world(4), tier)).toBe(false)
      expect(placeLock(rift, world(4), tier)).toBe('Opens at five Lv 50 Umas')
      expect(placeOpen(rift, world(5), tier)).toBe(true)
      expect(placeLock(rift, world(5), tier)).toBeNull()
    }
    expect(placeOpen(rift, null, 1)).toBe(false)
    expect(placeLock(rift, null, 1)).toBe('Opens at five Lv 50 Umas')
  })

  it('stays locked in Tier 3, which has no Rift yet', () => {
    expect(placeOpen(rift, world(25), 3)).toBe(false)
    expect(placeLock(rift, world(25), 3)).toBe('No Rift in this tier yet')
  })

  it('leaves every other place as its slice says, whatever the world', () => {
    for (const place of PLACES.filter((p) => p.id !== 'tier-finale')) {
      for (const [w, tier] of [[null, 1], [world(0), 1], [world(25), 2], [world(25), 3]] as const) {
        expect(placeOpen(place, w, tier), place.id).toBe(isOpen(place, CURRENT_SLICE))
        expect(placeLock(place, w, tier), place.id).toBe(isOpen(place, CURRENT_SLICE) ? null : 'Not open yet')
      }
    }
  })
})
