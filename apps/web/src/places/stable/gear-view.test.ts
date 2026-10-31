// The Gear tab's rules (H121): tiles in the tab's order with one stat each, Ready from `upgrades.grades`; a raise sheet's
// before → after, cost, target grades and footer; and Raise all against a simulated stock. Invented outfits.
import { armorValues, mightAt, newGrades, newOwnedUma, newTierWorld, upgradesFor, type GradeTarget, type OwnedUma, type TierWorld, type UmaGrades } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { gearTargets, gearTiles, raiseAllPlan, raiseSheet } from './gear-view'

const NOW = '2026-10-31T12:00:00.000Z'
const WEAPONS = ['greatsword', 'axe', 'lance'] as const
const axe: GradeTarget = { kind: 'weapon', weapon: 'axe' }

function world(edit: (g: UmaGrades) => void, items: Record<string, number>, level = 40): TierWorld {
  const gear = newGrades(1)
  edit(gear)
  const uma: OwnedUma = { ...newOwnedUma(NOW, 'brawler'), level, classId: 'brawler', gear,
    ranks: { classes: { brawler: { rank: 34, exp: 0 } } }, classes: { brawler: { weapons: [...WEAPONS], lines: {}, loadout: null } } }
  return { ...newTierWorld(NOW, 3), items, umas: { a: uma } }
}
const her = (w: TierWorld) => w.umas.a!.gear as UmaGrades

describe('the Gear tab\'s tiles (H121)', () => {
  it('draws eleven in the tab\'s order, each with one stat, Ready from the same list the tab dot counts', () => {
    const w = world((g) => { g.weapons.axe = { grade: 6 }; g.armor.feet = { grade: 4 }; g.accessories[0] = { grade: 3, family: 'pendant', form: 'base' } }, { 'weapon-gem-g7': 1 })
    const upgrades = upgradesFor(w, 'a', 'brawler', 1)
    const tiles = gearTiles(her(w), WEAPONS, WEAPONS, 1, upgrades)
    expect(tiles.weapons.map((t) => `${t.name} ${t.stat}`)).toEqual(['Greatsword Might 0', `Axe Might ${mightAt(6, 1)}`, 'Lance Might 0'])
    expect(tiles.armor.map((t) => t.stat)).toEqual(['DEF 0', 'HP 0', 'MP 0', 'M.DEF 0', 'Evasion 4.8%'])
    expect(tiles.accessories.map((t) => t.text)).toEqual(['ATK +3', 'Empty', 'Empty'])
    expect([...tiles.weapons, ...tiles.armor, ...tiles.accessories].filter((t) => t.ready)).toHaveLength(upgrades!.gear)
    expect(tiles.weapons[1]!.ready).toBe(true)
    expect(gearTargets(her(w), WEAPONS)).toHaveLength(11)
  })

  it('flags an Orb on a kind she no longer holds', () => {
    const w = world((g) => { g.accessories[1] = { grade: 2, family: 'orb', form: 'base', kind: 'dark' } }, {})
    expect(gearTiles(her(w), WEAPONS, WEAPONS, 1, null).accessories[1]!.stale).toBe('Dark Tome not held')
  })
})

describe('a raise sheet (H121)', () => {
  const six = (g: UmaGrades) => { g.weapons.axe = { grade: 6 } }

  it('starts on the highest grade the Warehouse covers, with each cost and what\'s held, and closes grades above her level', () => {
    const view = raiseSheet(world(six, { 'weapon-gem-g7': 2, 'weapon-gem-g8': 1 }), 'a', axe, 'brawler', 1)
    expect(view.to).toBe(8)
    expect(view.step).toBe('G6 → G8')
    expect(view.value).toBe(`Might ${mightAt(6, 1)} → ${mightAt(8, 1)}`)
    expect(view.costs).toEqual(['Arms Gem G7 ×1 · 2 held', 'Arms Gem G8 ×1 · 1 held'])
    expect(view.chips.map((c) => [c.grade, c.gate, c.selected])).toEqual([[7, null, false], [8, null, true], [9, 'Lv 41', false], [10, 'Lv 46', false]])
    expect(view.footer).toEqual({ to: 8, label: 'Raise to G8', ready: true })
  })

  it('takes a tapped grade, and a grade above the stock names the first item missing, disabled', () => {
    const w = world(six, { 'weapon-gem-g7': 1 })
    expect(raiseSheet(w, 'a', axe, 'brawler', 1, 8).footer).toEqual({ to: 8, label: 'Arms Gem G8 ×0', ready: false })
    expect(raiseSheet(world(six, {}), 'a', axe, 'brawler', 1).footer).toEqual({ to: 7, label: 'Arms Gem G7 ×0', ready: false })
    expect(raiseSheet(world(six, { 'weapon-gem-g7': 1, 'weapon-gem-g8': 1 }), 'a', axe, 'brawler', 1, 7).footer).toEqual({ to: 7, label: 'Raise to G7', ready: true })
  })

  it('says the level gate when the next grade is above her, and G10 · Max with no button', () => {
    const low = world(six, { 'weapon-gem-g7': 1 }, 20)
    expect(raiseSheet(low, 'a', axe, 'brawler', 1).footer).toEqual({ to: 7, label: 'Lv 31', ready: false })
    const max = raiseSheet(world((g) => { g.weapons.axe = { grade: 10 } }, {}), 'a', axe, 'brawler', 1)
    expect(max).toMatchObject({ to: null, step: 'G10 · Max', value: `Might ${mightAt(10, 1)}`, footer: null, chips: [], costs: [] })
  })

  it('reads armor\'s stat and offense pairs from the rules, by her class\'s half', () => {
    const w = world((g) => { g.armor.head = { grade: 8 } }, { 'armor-fittings-g9': 1 }, 45)
    const a = armorValues('head', 8, 1), b = armorValues('head', 9, 1)
    expect(raiseSheet(w, 'a', { kind: 'armor', slot: 'head' }, 'brawler', 1).value).toBe(`DEF ${a.value} → ${b.value} · ATK ${a.offense} → ${b.offense}`)
    expect(raiseSheet(world((g) => { g.armor.feet = { grade: 2 } }, {}), 'a', { kind: 'armor', slot: 'feet' }, 'mage', 1).value).toBe('Evasion 2.4% → 3.6% · M.ATK 1 → 2')
  })

  it('reads an accessory\'s effect before and after, Off at G0', () => {
    const slot: GradeTarget = { kind: 'accessory', slot: 0 }
    const worn = world((g) => { g.accessories[0] = { grade: 7, family: 'pendant', form: 'base' } }, { 'accessory-setting-g8': 1 })
    expect(raiseSheet(worn, 'a', slot, 'brawler', 1).value).toBe('ATK +7 → +8')
    const off = world((g) => { g.accessories[0] = { grade: 0, family: 'orb', form: 'base', kind: 'lance' } }, { 'accessory-setting-g1': 1 })
    expect(raiseSheet(off, 'a', slot, 'brawler', 1).value).toBe('Off → Lance +2')
    expect(raiseSheet(world(() => {}, {}), 'a', slot, 'brawler', 1).value).toBe('')
  })
})

describe('Raise all (H121)', () => {
  it('spends the stock in the tab\'s order: a slot the stock no longer covers stops lower or drops out', () => {
    const w = world((g) => { g.weapons.greatsword = { grade: 7 }; g.weapons.axe = { grade: 6 }; g.weapons.lance = { grade: 7 }; g.armor.feet = { grade: 5 } },
      { 'weapon-gem-g7': 1, 'weapon-gem-g8': 1, 'armor-fittings-g6': 1 })
    const plan = raiseAllPlan(w, 'a', WEAPONS)
    expect(plan.steps).toEqual([{ target: { kind: 'weapon', weapon: 'greatsword' }, to: 8 }, { target: axe, to: 7 }, { target: { kind: 'armor', slot: 'feet' }, to: 6 }])
    expect(plan.lines).toEqual(['Greatsword G7 → G8 · Arms Gem G8 ×1', 'Axe G6 → G7 · Arms Gem G7 ×1', 'Feet G5 → G6 · Armor Fittings G6 ×1'])
    expect(plan.items).toBe(3)
  })

  it('lists several grades on one slot, and nothing with nothing to raise', () => {
    const w = world((g) => { g.weapons.axe = { grade: 6 } }, { 'weapon-gem-g7': 1, 'weapon-gem-g8': 1 })
    expect(raiseAllPlan(w, 'a', WEAPONS).lines).toEqual(['Axe G6 → G8 · Arms Gem G7 ×1 · G8 ×1'])
    expect(raiseAllPlan(world(() => {}, {}), 'a', WEAPONS)).toEqual({ steps: [], lines: [], items: 0 })
  })
})
