import { expect, it } from 'vitest'
import { familyById, ITEM_FAMILIES, itemById, ITEMS } from './catalog'
import { FAMILY_SPECS } from './families'
import { ITEM_IDENTITIES, isItemId } from './identity'

it('keeps all 160 light item ids and family/site data exactly in step with the authored catalog', () => {
  expect(ITEM_IDENTITIES).toEqual(FAMILY_SPECS.map((f) => ({ id: f.id, effect: f.effect, site: f.site,
    raw: f.raw.map(([id]) => id), refined: f.refined.map(([id]) => id) })))
  expect(ITEMS).toHaveLength(160)
  for (const item of ITEMS) expect(isItemId(item.id), item.id).toBe(true)
  for (const id of ['', 'copper-ore-1', 'unknown', 'Copper Ore', 'token-mastery-1']) expect(isItemId(id), id).toBe(false)
})

it('builds the rules\' catalog from the ids alone: family, effect, grade, form and pair (H136)', () => {
  expect(ITEM_FAMILIES.map((f) => f.id)).toEqual(FAMILY_SPECS.map((f) => f.id))
  expect(itemById('copper-ore')).toEqual({ id: 'copper-ore', family: 'ores', effect: 'atk', grade: 1, refined: false, pair: 'copper-ingot' })
  expect(itemById('dragonhide')).toEqual({ id: 'dragonhide', family: 'hides-scales', effect: 'hp', grade: 10, refined: true, pair: 'dragon-scale' })
  expect(familyById('bones-horns')).toMatchObject({ effect: 'limit', site: 'fossil-dig' })
  expect(Object.keys(ITEMS[0]!)).not.toContain('name')
})
