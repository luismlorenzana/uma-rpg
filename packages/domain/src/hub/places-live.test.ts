// The Hub from save v35 (D283, H155): the Gallery stands where the Observatory stood, and the Observatory's links land
// on it. The switch is mocked here, as H157 will set it.
import { describe, expect, it, vi } from 'vitest'

vi.mock('../save/version', async (orig) => ({ ...(await orig<typeof import('../save/version')>()), SAVE_SCHEMA_VERSION: 35 }))

import { learningPlaces, movedPlace, placeById, placesOn } from './places'

describe('the Learning page from save v35', () => {
  it('has the Gallery at the Observatory\'s spot, and no Observatory', () => {
    const learning = learningPlaces()
    expect(learning.map((p) => p.id)).toContain('gallery')
    expect(learning.map((p) => p.id)).not.toContain('observatory')
    expect(placeById('gallery')).toMatchObject({ page: 'learning', kind: 'town', name: 'Gallery', at: { x: 0.5, y: 0.84 }, frame: 'cleric-chapel', slots: 0 })
    expect(placesOn('learning').map((p) => p.id)).toContain('gallery')
  })

  it('sends the Observatory\'s old links to the Gallery', () => {
    expect(movedPlace('observatory')?.id).toBe('gallery')
    expect(movedPlace('gallery')).toBeUndefined()
  })

  it('shows the Drills on the Battle page', () => {
    expect(placesOn('battle').map((p) => p.id)).toContain('drills')
  })
})
