// Classes v3's class-view on the live engine (v18; H137, D253): nothing of Classes v3 shows. Her six classes are each On or
// Held, in rows of three with no roots; the class button reads "R22"; no promotion waits anywhere; the words the sheets share
// (slots, hand, the healer note) read today's classes. Made-up outfits only.
import { BATTLE_ENGINE_VERSION, newOwnedUma, newTierWorld, RPG_CLASSES, type BattleOutfit, type TierWorld } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { classButton, classesSheet, classFooter, classGrid, classTiles, handWord, healerWarning, promotionFrom, slotsWord } from './class-view'

const NOW = '2026-10-29T12:00:00.000Z'
const outfit = (outfitId: string): BattleOutfit => ({
  outfitId, baseStats: { speed: 100, stamina: 100, power: 110, guts: 100, wit: 90 }, growthRatePercents: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0 },
  aptitudes: { strategy: { front: 'A', pace: 'B', late: 'B', end: 'B' }, distance: { sprint: 'B', mile: 'B', medium: 'A', long: 'B' } },
})
const A = outfit('81001'), B = outfit('81002')
/** Tier 1 with Uma A a Brawler R22 who also holds a Mage R8, and Uma B a Paladin, both in Party 1. */
function world(): TierWorld {
  const w = newTierWorld(NOW, 3)
  w.umas[A.outfitId] = { ...newOwnedUma(NOW), classId: 'brawler', ranks: { classes: { brawler: { rank: 22, exp: 0 }, mage: { rank: 8, exp: 0 } } } }
  w.umas[B.outfitId] = { ...newOwnedUma(NOW), classId: 'paladin' }
  w.parties[0] = { ...w.parties[0]!, slots: [A.outfitId, B.outfitId, null, null, null] }
  return w
}
const her = (w = world()) => w.umas[A.outfitId]!

describe('class-view on v18 (live)', () => {
  it('runs on engine 18', () => expect(BATTLE_ENGINE_VERSION).toBe(18))

  it('draws her six classes On or Held with their ranks, in rows of three and no roots', () => {
    const tiles = classTiles(A, her())
    expect(tiles.map((t) => t.classId)).toEqual([...RPG_CLASSES])
    expect(tiles.map((t) => `${t.name} ${t.state} ${t.word}`)).toEqual([
      'Brawler on R22', 'Mage available R8', 'Spell Blade available R1', 'Cleric available R1', 'Summoner available R1', 'Paladin available R1',
    ])
    const grid = classGrid(tiles)
    expect(grid.roots).toBeNull()
    expect(grid.columns).toBe(3)
    expect(grid.rows.map((r) => [r.label, r.cells.map((c) => c?.classId ?? null)])).toEqual([
      [null, ['brawler', 'mage', 'spellblade']], [null, ['cleric', 'summoner', 'paladin']],
    ])
  })

  it('acts by the selection: her class is "Fights as", another "Fight as"', () => {
    const sheet = classesSheet(A, her(), world(), 1, null)
    expect(sheet.selected.classId).toBe('brawler')
    expect(sheet.footer).toEqual({ label: 'Fights as Brawler', act: null })
    expect(classFooter(classTiles(A, her())[1]!)).toEqual({ label: 'Fight as Mage', act: 'switch' })
    expect(classesSheet(A, her(), world(), 1, 'mage').line).toMatchObject({ title: 'Mage · Held', facts: ['3 Tomes'], weapons: ['tome-fire', 'tome-ice', 'tome-lightning'] })
  })

  it('reads "R22" on the class button and finds no promotion', () => {
    expect(classButton(A, her())).toEqual({ classId: 'brawler', name: 'Brawler', word: 'R22', promote: null })
    expect(promotionFrom(A, her())).toBeNull()
    expect(promotionFrom(A, her(), 1, 'brawler')).toBeNull()
  })

  it('words slots and hands', () => {
    expect(slotsWord(['arms', 'arms', 'arms'])).toBe('3 Arms')
    expect(slotsWord(['tome', 'tome', 'tome'])).toBe('3 Tomes')
    expect(slotsWord(['arms', 'arms', 'tome'])).toBe('2 Arms + 1 Tome')
    expect(slotsWord(['tome', 'tome', 'arms'])).toBe('2 Tomes + 1 Arm')
    expect(slotsWord(['any', 'any', 'any'])).toBe('Any 3 weapons')
    expect(handWord('brawler')).toBe('Hand · Arms ×1')
    expect(handWord('spellblade')).toBe('Hand · Arms ×0.72 · Tome ×0.44')
  })

  it('warns "Party 1: 2 healers" when she selects a healer beside the party\'s Paladin, and only then', () => {
    const outfits = new Map([A, B].map((o) => [o.outfitId, o]))
    expect(healerWarning(world(), A.outfitId, 'cleric', outfits)).toBe('Party 1: 2 healers')
    expect(healerWarning(world(), A.outfitId, 'mage', outfits)).toBeNull()
    expect(classesSheet(A, her(), world(), 1, 'cleric', outfits).line.healer).toBe('Party 1: 2 healers')
    const alone = world()
    alone.parties[0] = { ...alone.parties[0]!, slots: [A.outfitId, null, null, null, null] }
    expect(healerWarning(alone, A.outfitId, 'cleric', outfits)).toBeNull()
  })
})
