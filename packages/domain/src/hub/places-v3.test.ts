// R2's Wilds on the Hub (H77; profession-progression.md §4.1, PP4–PP6), on engine v17 (live since H82): the ten
// places at today's side spots, and v1's eleven facilities and Town Hall byte for byte when asked for.
import { describe, expect, it } from 'vitest'
import { HUB_PAGES, learningPlaces, PLACES, placeById, placesOn, townPlaces, wildsPlaces, type Place } from './places'


/** FNV-1a, as `world.ts` hashes: the lists' JSON on `main` before H77 (engine 16). */
const fnv = (text: string): string => {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 0x01000193) >>> 0
  return h.toString(16).padStart(8, '0')
}
const spots = (list: readonly Place[]) => list.map((p) => [p.id, p.kind, p.at.x, p.at.y, p.frame ?? null, p.slots])

describe('the Wilds by generation (H77)', () => {
  it('keeps today\'s eleven facilities and Town Hall byte for byte to engine v16', () => {
    expect(fnv(JSON.stringify(wildsPlaces(16)))).toBe('6ba761ce')
    expect(fnv(JSON.stringify(townPlaces(16).filter((p) => !p.hidden)))).toBe('f70204f1')
    expect(wildsPlaces(16).map((p) => p.id)).toEqual(['monster-den', 'ley-spring', 'mine', 'crystal-cavern', 'quarry', 'meadow', 'forest', 'fossil-dig',
      'workbench', 'forge', 'lapidary'])
  })

  it('draws R2\'s ten places at the table\'s spots and frames, four slots each, from v17', () => {
    expect(spots(wildsPlaces())).toEqual([
      ['mine', 'gather-site', 0.24, 0.1, null, 4], ['forge', 'station', 0.74, 0.12, null, 4],
      ['forest', 'gather-site', 0.2, 0.3, null, 4], ['armorer', 'station', 0.76, 0.32, 'lancers-barracks', 4],
      ['fields', 'gather-site', 0.22, 0.51, 'vegetable-garden', 4], ['workbench', 'station', 0.78, 0.51, null, 4],
      ['fishery', 'gather-site', 0.22, 0.71, null, 4], ['charm-shop', 'station', 0.78, 0.7, 'arcane-armory', 4],
      ['monster-den', 'gather-site', 0.26, 0.9, null, 4], ['lapidary', 'station', 0.74, 0.9, null, 4],
    ])
    expect(placesOn('wilds')).toEqual(wildsPlaces(17))
    expect(wildsPlaces().every((p) => p.page === 'wilds' && !p.hidden && p.blurb.length > 0 && p.details.length > 0)).toBe(true)
    expect(placeById('mine')?.blurb).toBe('Mining: ores into ingots.')
    expect(placeById('charm-shop')?.blurb).toBe('Accessory Crafting: Accessory Settings.')
  })

  it('has no place for the five removed ids, and the other pages as they were', () => {
    for (const id of ['ley-spring', 'crystal-cavern', 'quarry', 'meadow', 'fossil-dig']) expect(placeById(id), id).toBeUndefined()
    expect(HUB_PAGES.map((page) => placesOn(page).length)).toEqual([4, 7, 2, 10])
    expect(placesOn('learning')).toEqual(learningPlaces(16))
    expect(placesOn('battle').map((p) => p.id)).toEqual(['scenario-gate', 'tier-finale'])
    expect(new Set(PLACES.map((p) => p.id)).size).toBe(PLACES.length)
  })

  it('words the Warehouse and the Exchange for R2\'s stock, the rest of Town Hall unchanged', () => {
    expect(placeById('warehouse')).toMatchObject({ blurb: 'Every item you own: materials and made items.', details: ['Materials and made items', 'Filled by the Wilds and the Exchange'] })
    expect(placeById('exchange')?.details[0]).toBe('Raw materials by pair')
    expect(townPlaces().map((p) => p.id)).toEqual(townPlaces(16).map((p) => p.id))
    expect(townPlaces().filter((p) => p.id !== 'warehouse' && p.id !== 'exchange')).toEqual(townPlaces(16).filter((p) => p.id !== 'warehouse' && p.id !== 'exchange'))
  })

  it('keeps the ten 44 pt apart on the smallest phone', () => {
    const list = wildsPlaces()
    for (const a of list) for (const b of list) {
      if (a !== b) expect(Math.hypot((a.at.x - b.at.x) * 375, (a.at.y - b.at.y) * 500), `${a.id} ↔ ${b.id}`).toBeGreaterThanOrEqual(66)
    }
  })
})
