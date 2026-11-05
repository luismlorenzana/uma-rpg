import { expect, it } from 'vitest'
import { HONEYCOMB_SAVE } from '../save/collections'
import { SAVE_SCHEMA_VERSION } from '../save/version'
import { WORLD_SPRINGS, worldContinent } from './world'

it('switches the default generator and Spring count together at save v38 (H163)', () => {
  expect(HONEYCOMB_SAVE).toBe(38)
  expect(SAVE_SCHEMA_VERSION).toBe(38)
  expect(WORLD_SPRINGS).toBe(6)
  const source = { name: 'Synthetic continent', order: 1 }
  const c = worldContinent(source)
  expect(c.regions).toHaveLength(48)
  expect(c.springs).toHaveLength(6)
  expect(c.springs.every((s) => !('row' in s))).toBe(true)
})
