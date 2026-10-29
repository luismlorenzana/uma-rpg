import { expect, it } from 'vitest'
import { EQUIP_TYPES } from '../economy/gear-id'
import { GEM_IDENTITIES } from '../economy/stars'
import { stockName } from '../economy/stock'
import { ITEMS } from './catalog'
import { FAMILY_SPECS } from './families'
import { familyNameV1, gearNameV1, gemNameV1, itemNameV1, stockNameV1 } from './names-v1'

it('names every v1 item and family as authored', () => {
  for (const f of FAMILY_SPECS) {
    expect(familyNameV1(f.id)).toBe(f.name)
    for (const [id, name] of [...f.raw, ...f.refined]) expect(itemNameV1(id), id).toBe(name)
  }
  expect(itemNameV1('copper-ore')).toBe('Copper Ore')
  expect(itemNameV1('cut-philosophers-stone')).toBe("Cut Philosopher's Stone")
  expect(familyNameV1('hides-scales')).toBe('Hides & Scales')
  for (const id of ['', 'copper-ore-g1', 'greatsword-g1', 'gem-hp-1']) expect(itemNameV1(id), id).toBeUndefined()
})

it('names v1 gear by its grade\'s ore or crystal and its type, and Star Gems by stone and virtue', () => {
  expect(gearNameV1('greatsword-g1')).toBe('Copper Greatsword')
  expect(gearNameV1('lance-g10')).toBe('Orichalcum Lance')
  expect(gearNameV1('tome-fire-g4')).toBe('Garnet Fire Tome')
  expect(gearNameV1('robe-g3')).toBe('Citrine Robe')
  expect(gearNameV1('talisman-vital-g1')).toBe('Copper Vital Talisman')
  for (const type of EQUIP_TYPES) for (let g = 1; g <= 10; g++) expect(gearNameV1(`${type}-g${g}`), `${type}-g${g}`).toMatch(/^\S.* \S/)
  expect(gearNameV1('greatsword-g11')).toBeUndefined()
  expect(gemNameV1('gem-mp-1')).toBe('Quartz of Spirit')
  expect(gemNameV1('gem-atk-4')).toBe('Garnet of Strength')
  expect(gemNameV1('gem-hp-def-3')).toBe('Citrine of Vigor & Fortitude')
  expect(gemNameV1('gem-sun-10')).toBe("Philosopher's Stone of the Sun")
  for (const gem of GEM_IDENTITIES) expect(gemNameV1(gem.id), gem.id).toMatch(/ of /)
  expect(gemNameV1('gem-hp-11')).toBeUndefined()
})

it('reads a Warehouse id across both economies; the main bundle\'s `stockName` keeps the live ones only', () => {
  // Line and made items read the same through both; a v1 item, gem or piece only through `stockNameV1`.
  for (const id of ['iron-ore', 'trout-fillet', 'weapon-gem-g2', 'tome-ink-g2', 'jewel-moon-5']) expect(stockNameV1(id), id).toBe(stockName(id))
  expect(stockName('iron-ore')).toBe('Iron Ore')
  expect(stockNameV1('puffbun-pelt')).toBe('Puffbun Pelt')
  expect(stockName('puffbun-pelt')).toBe('puffbun-pelt')
  expect(stockNameV1('gem-atk-4')).toBe('Garnet of Strength')
  expect(stockNameV1('helm-g1')).toBe('Copper Helm')
  expect(stockNameV1('nope')).toBe('nope')
  for (const item of ITEMS) expect(stockNameV1(item.id), item.id).not.toBe(item.id)
})
