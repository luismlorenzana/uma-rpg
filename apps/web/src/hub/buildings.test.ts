// Every place the Hub draws has a building on the pinned uma-art sheet (`place.frame ?? place.id`, HubScreen), in every
// generation; from the switch the Healer Sanctum draws its own temple (uma-art 2.17.0, H135, D254; H133), not the Paladin
// Bastion's keep.
import atlas from '@luismlorenzana/uma-art/buildings/atlas.json'
import { learningPlaces, PLACES, placeById, townPlaces, wildsPlaces, type Place } from '@rpg/domain'
import { describe, expect, it } from 'vitest'

const frames: Readonly<Record<string, { page: string; w: number; h: number }>> = atlas.frames
const frameOf = (place: Place) => place.frame ?? place.id

describe('the Hub\'s buildings on the pinned sheet', () => {
  it('finds a frame for every drawn place of every generation', () => {
    const drawn = [...PLACES, ...learningPlaces(14), ...learningPlaces(15), ...learningPlaces(19), ...townPlaces(16), ...wildsPlaces(16)]
      .filter((p) => !p.hidden)
    for (const place of drawn) expect(frames[frameOf(place)], `${place.id} → ${frameOf(place)}`).toBeDefined()
  })

  it('draws the Healer Sanctum on its own temple from v19, and the Paladin Bastion on the keep before', () => {
    const sanctum = learningPlaces(19).find((p) => p.id === 'healer-sanctum')!
    expect(frameOf(sanctum)).toBe('healer-sanctum')
    expect(frames['healer-sanctum']?.page).toBe('learning')
    expect(frameOf(learningPlaces(18).find((p) => p.id === 'paladin-bastion')!)).toBe('knights-bastion')
  })

  it('draws the three collections places from their own native 48px frames (uma-art 2.20.0, H158)', () => {
    for (const [id, frame, page] of [['gallery', 'gallery', 'learning'], ['trials', 'trials', 'battle'], ['drills', 'drill-yard', 'battle']] as const) {
      const place = placeById(id)!
      expect(frameOf(place), id).toBe(frame)
      expect(frames[frame], id).toMatchObject({ page, w: 48, h: 48 })
    }
  })
})
