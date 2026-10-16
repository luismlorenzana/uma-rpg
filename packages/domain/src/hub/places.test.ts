import { describe, expect, it } from 'vitest'
import { HUB_PAGES, PLACES, SLICES, isOpen, placeOnPage, placesOn } from './places'

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
