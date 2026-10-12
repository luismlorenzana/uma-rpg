import { expect, it } from 'vitest'
import { ITEM_FAMILIES, ITEMS } from './catalog'
import { ITEM_IDENTITIES, isItemId } from './identity'

it('keeps all 320 light item ids and family/site data exactly in step with the authored catalog', () => {
  expect(ITEM_IDENTITIES).toEqual(ITEM_FAMILIES.map((f) => ({ id: f.id, side: f.side, effect: f.effect, site: f.site,
    raw: f.raw.map((i) => i.id), refined: f.refined.map((i) => i.id) })))
  expect(ITEMS).toHaveLength(320)
  for (const item of ITEMS) expect(isItemId(item.id), item.id).toBe(true)
  for (const id of ['', 'wheat-1', 'unknown', 'Wheat', 'token-mastery-1']) expect(isItemId(id), id).toBe(false)
})
