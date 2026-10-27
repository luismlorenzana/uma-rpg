// The Wilds' trios on the Hub (H114, FL32): fifteen places in five rows, and v1's eleven facilities byte for byte.
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

  it('draws fifteen places in five rows of three, workbenches on the trunk, four slots each', () => {
    expect(spots(wildsPlaces())).toEqual([
      ['mine', 'gather-site', 0.2, 0.155, null, 4], ['mine-workbench', 'station', 0.5, 0.155, null, 4], ['weapon-forge', 'station', 0.8, 0.155, null, 4],
      ['fields', 'gather-site', 0.2, 0.315, 'vegetable-garden', 4], ['fields-workbench', 'station', 0.5, 0.315, null, 4], ['tome-forge', 'station', 0.8, 0.315, null, 4],
      ['forest', 'gather-site', 0.2, 0.475, null, 4], ['forest-workbench', 'station', 0.5, 0.475, null, 4], ['armorer', 'station', 0.8, 0.475, 'lancers-barracks', 4],
      ['fishery', 'gather-site', 0.2, 0.635, null, 4], ['fishery-workbench', 'station', 0.5, 0.635, null, 4], ['charm-forge', 'station', 0.8, 0.635, null, 4],
      ['monster-den', 'gather-site', 0.2, 0.795, null, 4], ['den-workbench', 'station', 0.5, 0.795, null, 4], ['lapidary', 'station', 0.8, 0.795, null, 4],
    ])
    expect(placesOn('wilds')).toEqual(wildsPlaces(17))
    expect(wildsPlaces().every((p) => p.page === 'wilds' && !p.hidden && p.blurb.length > 0 && p.details.length > 0)).toBe(true)
    expect(placeById('mine')?.blurb).toBe('Mining: metal, G1–G10.')
    expect(placeById('mine-workbench')?.blurb).toBe('Smelting: ores into ingots.')
    expect(placeById('tome-forge')?.blurb).toBe('Tome Crafting: Tome Ink.')
    expect(placeById('charm-forge')?.blurb).toBe('Accessory Crafting: Accessory Settings.')
  })

  it('has no place for the five removed ids, and the other pages as they were', () => {
    for (const id of ['ley-spring', 'crystal-cavern', 'quarry', 'meadow', 'fossil-dig']) expect(placeById(id), id).toBeUndefined()
    expect(HUB_PAGES.map((page) => placesOn(page).length)).toEqual([4, 7, 2, 15])
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

  it('keeps the fifteen 44 pt apart on the smallest phone', () => {
    const list = wildsPlaces()
    for (const a of list) for (const b of list) {
      if (a !== b) expect(Math.hypot((a.at.x - b.at.x) * 375, (a.at.y - b.at.y) * 500), `${a.id} ↔ ${b.id}`).toBeGreaterThanOrEqual(66)
    }
  })
})
