import { expect, it, vi } from 'vitest'

vi.mock('../save/version', () => ({ SAVE_SCHEMA_VERSION: 38 }))

import { HONEYCOMB_SAVE, honeycombLive } from '../save/collections'
import { WORLD_SPRINGS, worldContinent } from './world'

it('switches the default generator and Spring count together at save v38 (H163)', () => {
  expect(HONEYCOMB_SAVE).toBe(38)
  expect(honeycombLive()).toBe(true)
  expect(WORLD_SPRINGS).toBe(6)
  const source = { name: 'Synthetic continent', order: 1 }
  const c = worldContinent(source)
  expect(c.regions).toHaveLength(48)
  expect(c.springs).toHaveLength(6)
  expect(c).toEqual(worldContinent(source, 38))
  expect(worldContinent(source, 37).regions).toHaveLength(40)
  expect(worldContinent(source, 37).springs).toHaveLength(5)
})
