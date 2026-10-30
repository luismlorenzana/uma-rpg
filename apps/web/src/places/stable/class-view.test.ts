// Classes v3's class-view (H137, D253; classes-v3.md §14.1–§14.2, CV32; live since H134). On engine v18, passed explicitly,
// nothing of Classes v3 shows: her six classes are each On or Held, in rows of three with no roots; the class button reads
// "R22"; no promotion waits anywhere; the words the sheets share (slots, hand, the healer note) read v18's classes. From v19:
// the promotion page's Uma C on the tree (every state, its word and its footer), the grid's roots, rows and columns, the
// selection's line, a later tier's tree, every Tier 0's promotion sheet (Suggested by Power and Wit, Held, the rows that
// differ, before → after with and without waiting EXP), the class button, the promotion line and which Tier 0 a promotion
// comes from. Made-up outfits only.
import { BATTLE_ENGINE_VERSION, newOwnedUma, newTierWorld, RPG_CLASSES, rpgClasses, type BattleOutfit, type OwnedUma, type RpgClass, type TierWorld } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import {
  classButton, classesSheet, classFooter, classGrid, classLine, classTiles, handWord, healerWarning, promotionFrom, promotionLine, promotionSheet, slotsWord,
  tier0Progress,
} from './class-view'

const NOW = '2026-10-29T12:00:00.000Z'
/** A made-up outfit, Front A; Power over Wit unless `wit`. */
const outfit = (outfitId: string, wit = false): BattleOutfit => ({
  outfitId, baseStats: { speed: 100, stamina: 100, power: wit ? 90 : 110, guts: 100, wit: wit ? 110 : 90 },
  growthRatePercents: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0 },
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

describe('class-view on v18', () => {
  it('draws her six classes On or Held with their ranks, in rows of three and no roots', () => {
    const tiles = classTiles(A, her(), 1, 18)
    expect(tiles.map((t) => t.classId)).toEqual([...rpgClasses(18)])
    expect(tiles.map((t) => `${t.name} ${t.state} ${t.word}`)).toEqual([
      'Brawler on R22', 'Mage available R8', 'Spell Blade available R1', 'Cleric available R1', 'Summoner available R1', 'Paladin available R1',
    ])
    const grid = classGrid(tiles, 18)
    expect(grid.roots).toBeNull()
    expect(grid.columns).toBe(3)
    expect(grid.rows.map((r) => [r.label, r.cells.map((c) => c?.classId ?? null)])).toEqual([
      [null, ['brawler', 'mage', 'spellblade']], [null, ['cleric', 'summoner', 'paladin']],
    ])
  })

  it('acts by the selection: her class is "Fights as", another "Fight as"', () => {
    const sheet = classesSheet(A, her(), world(), 1, null, undefined, 18)
    expect(sheet.selected.classId).toBe('brawler')
    expect(sheet.footer).toEqual({ label: 'Fights as Brawler', act: null })
    expect(classFooter(classTiles(A, her(), 1, 18)[1]!)).toEqual({ label: 'Fight as Mage', act: 'switch' })
    expect(classesSheet(A, her(), world(), 1, 'mage', undefined, 18).line).toMatchObject({ title: 'Mage · Held', facts: ['3 Tomes'], weapons: ['tome-fire', 'tome-ice', 'tome-lightning'] })
  })

  it('reads "R22" on the class button and finds no promotion', () => {
    expect(classButton(A, her(), 1, 18)).toEqual({ classId: 'brawler', name: 'Brawler', word: 'R22', promote: null })
    expect(promotionFrom(A, her(), 1, null, 18)).toBeNull()
    expect(promotionFrom(A, her(), 1, 'brawler', 18)).toBeNull()
  })

  it('words slots and hands', () => {
    expect(slotsWord(['arms', 'arms', 'arms'])).toBe('3 Arms')
    expect(slotsWord(['tome', 'tome', 'tome'])).toBe('3 Tomes')
    expect(slotsWord(['arms', 'arms', 'tome'])).toBe('2 Arms + 1 Tome')
    expect(slotsWord(['tome', 'tome', 'arms'])).toBe('2 Tomes + 1 Arm')
    expect(slotsWord(['any', 'any', 'any'])).toBe('Any 3 weapons')
    expect(handWord('brawler', 18)).toBe('Hand · Arms ×1')
    expect(handWord('spellblade', 18)).toBe('Hand · Arms ×0.72 · Tome ×0.44')
  })

  it('warns "Party 1: 2 healers" when she selects a healer beside the party\'s Paladin, and only then', () => {
    const outfits = new Map([A, B].map((o) => [o.outfitId, o]))
    expect(healerWarning(world(), A.outfitId, 'cleric', outfits, 1, 18)).toBe('Party 1: 2 healers')
    expect(healerWarning(world(), A.outfitId, 'mage', outfits, 1, 18)).toBeNull()
    expect(classesSheet(A, her(), world(), 1, 'cleric', outfits, 18).line.healer).toBe('Party 1: 2 healers')
    const alone = world()
    alone.parties[0] = { ...alone.parties[0]!, slots: [A.outfitId, null, null, null, null] }
    expect(healerWarning(alone, A.outfitId, 'cleric', outfits, 1, 18)).toBeNull()
  })
})

const C = outfit('81003')
type Tracks = Partial<Record<RpgClass, { rank: number; exp: number }>>
const uma = (classId: RpgClass, classes: Tracks): OwnedUma => ({ ...newOwnedUma(NOW), classId, ranks: { classes } })
/** The promotion page's Uma C: a Brawler R34 who holds Arms Spellblade R12, has her Warrior at Rank 10 and started a Healer. */
const UMA_C = uma('brawler', { brawler: { rank: 34, exp: 0 }, spellblade: { rank: 12, exp: 0 }, recruit: { rank: 10, exp: 0 }, acolyte: { rank: 4, exp: 0 } })
const worldC = (): TierWorld => ({ ...newTierWorld(NOW, 3), umas: { [C.outfitId]: UMA_C } })

describe('the Classes sheet from v19 (Uma C)', () => {
  it('runs on engine 19, the thirteen classes live', () => {
    expect(BATTLE_ENGINE_VERSION).toBe(20)
    expect(RPG_CLASSES).toHaveLength(13)
  })

  it('draws every class in the state language with its word', () => {
    expect(classTiles(C, UMA_C).map((t) => `${t.name} ${t.state} ${t.word}`)).toEqual([
      'Warrior available R10/10', 'Spellblade open R1 · free', 'Healer available R4/10', 'Summoner open R1 · free', 'Mage open R1 · free',
      'Brawler on R34', 'Arms Spellblade available R12', 'Arms Summoner ready Ready',
      'Paladin closed Closed', 'Cleric closed Closed', 'Tome Summoner closed Closed', 'Tome Spellblade closed Closed', 'Sorcerer closed Closed',
    ])
  })

  it('lays the tree in three roots over five columns: Tier 0 on top, the Arms child above the Tome one', () => {
    const grid = classGrid(classTiles(C, UMA_C))
    expect(grid.roots).toEqual([{ name: 'Warrior', span: 1 }, { name: 'All-Rounder', span: 3 }, { name: 'Mage', span: 1 }])
    expect(grid.columns).toBe(5)
    expect(grid.rows.map((r) => [r.label, r.cells.map((c) => c?.classId ?? null)])).toEqual([
      ['Tier 0', ['recruit', 'duelist', 'acolyte', 'caller', 'apprentice']],
      ['Tier 1', ['brawler', 'spellblade', 'paladin', 'armsummoner', 'mage']],
      [null, [null, 'tomeblade', 'cleric', 'summoner', null]],
    ])
  })

  it('gives each state its footer: Fights as, Fight as, Promote to, Start · R1, and the closed gate', () => {
    const footer = (id: RpgClass) => classFooter(classTiles(C, UMA_C).find((t) => t.classId === id)!)
    expect(footer('brawler')).toEqual({ label: 'Fights as Brawler', act: null })
    expect(footer('spellblade')).toEqual({ label: 'Fight as Arms Spellblade', act: 'switch' })
    expect(footer('acolyte')).toEqual({ label: 'Fight as Healer', act: 'switch' })
    expect(footer('armsummoner')).toEqual({ label: 'Promote to Arms Summoner', act: 'promote' })
    expect(footer('duelist')).toEqual({ label: 'Start Spellblade · R1', act: 'start' })
    expect(footer('tomeblade')).toEqual({ label: 'Opens with Spellblade R10 or Mage R10', act: null })
    expect(footer('paladin')).toEqual({ label: 'Opens with Healer R10', act: null })
  })

  it('writes the selection\'s line: name and state, slots and role, defaults and hand; a Tier 0 its skill and children', () => {
    const tile = (id: RpgClass) => classTiles(C, UMA_C).find((t) => t.classId === id)!
    expect(classLine(tile('armsummoner'))).toEqual({ title: 'Arms Summoner · Ready', facts: ['2 Arms + 1 Tome · Area · lingers'],
      weapons: ['bow', 'axe', 'tome-dark'], hand: 'Hand · Arms ×0.57 · Tome ×0.46' })
    expect(classLine(tile('brawler'))).toMatchObject({ title: 'Brawler · On', facts: ['3 Arms · One act ×1'], hand: 'Hand · Arms ×1' })
    expect(classLine(tile('recruit'))).toEqual({ title: 'Warrior · Held',
      facts: ['Any 3 weapons · Drill Strike', 'Promotes to Brawler, Arms Spellblade, Arms Summoner'], weapons: [], hand: 'Hand · Arms ×1 · Tome ×1' })
    expect(classLine(tile('cleric')).facts).toEqual(['2 Tomes + 1 Arm · Healer · M.ATK'])
    expect(classesSheet(C, UMA_C, worldC(), 1, 'duelist')).toMatchObject({ selected: { classId: 'duelist' }, footer: { label: 'Start Spellblade · R1' } })
  })

  it('in a later tier draws the eight Tier 1 classes, open from R1, with no Tier 0 row', () => {
    const later = uma('brawler', { brawler: { rank: 6, exp: 0 } })
    const tiles = classTiles(C, later, 2)
    expect(tiles.map((t) => `${t.classId} ${t.word}`)).toEqual(['brawler R6', 'spellblade R1 · free', 'armsummoner R1 · free', 'paladin R1 · free',
      'cleric R1 · free', 'summoner R1 · free', 'tomeblade R1 · free', 'mage R1 · free'])
    expect(classGrid(tiles).rows.map((r) => r.label)).toEqual(['Tier 1', null])
    expect(classFooter(tiles.find((t) => t.classId === 'mage')!)).toEqual({ label: 'Start Sorcerer · R1', act: 'start' })
    expect(promotionFrom(C, later, 2)).toBeNull()
  })
})

describe('the promotion sheet from v19', () => {
  const at10 = (tier0: RpgClass, exp = 0, held: Tracks = {}) => uma(tier0, { [tier0]: { rank: 10, exp }, ...held })

  it('lists each Tier 0\'s children in order, the Suggested one by Power and Wit, opening on it', () => {
    const rows = (tier0: 'recruit' | 'duelist' | 'acolyte' | 'caller' | 'apprentice', o: BattleOutfit) => {
      const sheet = promotionSheet(o, at10(tier0), 1, tier0)
      return [sheet.title, sheet.tiles.map((t) => `${t.name}${t.badge ? ` · ${t.badge}` : ''}`), sheet.selected.name]
    }
    const power = outfit('81004'), wit = outfit('81005', true)
    expect(rows('recruit', wit)).toEqual(['Promote · Warrior R10', ['Brawler · Suggested', 'Arms Spellblade', 'Arms Summoner'], 'Brawler'])
    expect(rows('apprentice', power)).toEqual(['Promote · Mage R10', ['Sorcerer · Suggested', 'Tome Spellblade', 'Tome Summoner'], 'Sorcerer'])
    expect(rows('duelist', power)).toEqual(['Promote · Spellblade R10', ['Arms Spellblade · Suggested', 'Tome Spellblade'], 'Arms Spellblade'])
    expect(rows('duelist', wit)).toEqual(['Promote · Spellblade R10', ['Arms Spellblade', 'Tome Spellblade · Suggested'], 'Tome Spellblade'])
    expect(rows('caller', power)[1]).toEqual(['Arms Summoner · Suggested', 'Tome Summoner'])
    expect(rows('caller', wit)[1]).toEqual(['Arms Summoner', 'Tome Summoner · Suggested'])
    expect(rows('acolyte', power)[1]).toEqual(['Paladin · Suggested', 'Cleric'])
    expect(rows('acolyte', wit)[1]).toEqual(['Paladin', 'Cleric · Suggested'])
  })

  it('leaves out a row the same on every tile: the Spellblade\'s and the Summoner\'s roles', () => {
    const tiles = (tier0: 'recruit' | 'duelist' | 'acolyte' | 'caller') => promotionSheet(C, at10(tier0), 1, tier0).tiles.map((t) => [t.slots, t.role])
    expect(tiles('recruit')).toEqual([['3 Arms', 'One act ×1'], ['2 Arms + 1 Tome', 'Multi-hit'], ['2 Arms + 1 Tome', 'Area · lingers']])
    expect(tiles('duelist')).toEqual([['2 Arms + 1 Tome', null], ['2 Tomes + 1 Arm', null]])
    expect(tiles('caller')).toEqual([['2 Arms + 1 Tome', null], ['2 Tomes + 1 Arm', null]])
    expect(tiles('acolyte')).toEqual([['2 Arms + 1 Tome', 'Healer · ATK'], ['2 Tomes + 1 Arm', 'Healer · M.ATK']])
    expect(promotionSheet(C, at10('recruit'), 1, 'recruit').tiles[2]!.weapons).toEqual(['bow', 'axe', 'tome-dark'])
    // D263: each tile shows the preset she lands on.
    expect(promotionSheet(C, at10('recruit'), 1, 'recruit').tiles[1]!.weapons).toEqual(['katana', 'axe', 'tome-lightning'])
  })

  it('says before → after: no waiting EXP, then 17,400 landing at R42 with every depth', () => {
    expect(promotionSheet(C, at10('recruit'), 1, 'recruit')).toMatchObject({
      caption: 'Free · the others stay open', before: 'Warrior R10 → Brawler R10', after: 'Depths 1–2 · 6 skills',
      footer: { label: 'Promote to Brawler', act: 'promote', block: null },
    })
    expect(promotionSheet(C, at10('recruit', 400), 1, 'recruit')).toMatchObject({ before: 'Warrior R10 → Brawler R11', after: 'Depths 1–2 · 6 skills · +400 EXP' })
    expect(promotionSheet(C, at10('recruit', 17_400), 1, 'recruit', 'armsummoner')).toMatchObject({
      before: 'Warrior R10 → Arms Summoner R42', after: 'Depths 1–5 · 15 skills · +17,400 EXP', footer: { label: 'Promote to Arms Summoner' },
    })
  })

  it('marks a held child Held and opens on the next one; on a held child the footer is "Fight as"', () => {
    const held = at10('recruit', 0, { brawler: { rank: 14, exp: 0 } })
    const sheet = promotionSheet(C, held, 1, 'recruit')
    expect(sheet.tiles.map((t) => t.badge)).toEqual(['Held', null, null])
    expect(sheet.selected.classId).toBe('spellblade')
    expect(promotionSheet(C, held, 1, 'recruit', 'brawler')).toMatchObject({ before: 'Brawler R14', after: null,
      footer: { label: 'Fight as Brawler', act: 'switch' } })
    // As the Brawler she fights as: nothing to do on her own tile.
    expect(promotionSheet(C, { ...held, classId: 'brawler' }, 1, 'recruit', 'brawler').footer).toEqual({ label: 'Fights as Brawler', act: null, block: null })
  })

  it('promotes from the Tier 0 she fights as, else the child\'s first parent at Rank 10', () => {
    expect(promotionFrom(C, at10('recruit', 400))).toBe('recruit')
    expect(promotionFrom(C, uma('recruit', { recruit: { rank: 9, exp: 0 } }))).toBeNull()
    expect(promotionFrom(C, UMA_C)).toBeNull()
    expect(promotionFrom(C, UMA_C, 1, 'armsummoner')).toBe('recruit')
    const both = uma('caller', { caller: { rank: 10, exp: 0 }, recruit: { rank: 10, exp: 0 } })
    expect(promotionFrom(C, both, 1, 'armsummoner')).toBe('caller')
    expect(promotionFrom(C, { ...both, classId: 'duelist' }, 1, 'armsummoner')).toBe('recruit')
  })
})

describe('the Skills tab\'s pieces from v19', () => {
  it('reads the class button: R34, a Tier 0\'s R7/10, and Promote while a promotion waits', () => {
    expect(classButton(C, UMA_C)).toEqual({ classId: 'brawler', name: 'Brawler', word: 'R34', promote: null })
    expect(classButton(C, uma('recruit', { recruit: { rank: 7, exp: 0 } }))).toEqual({ classId: 'recruit', name: 'Warrior', word: 'R7/10', promote: null })
    expect(classButton(C, uma('recruit', { recruit: { rank: 10, exp: 400 } }))).toMatchObject({ word: 'Promote', promote: 'recruit' })
  })

  it('draws the promotion line: to go with its bar, then the waiting EXP, then nothing once every child is held', () => {
    expect(promotionLine(uma('recruit', { recruit: { rank: 7, exp: 100 } }), 'recruit')).toEqual({ text: 'Promotion at R10 · 3 to go', value: 2_212, max: 3_600, opens: false })
    expect(promotionLine(uma('recruit', {}), 'recruit')).toMatchObject({ text: 'Promotion at R10 · 9 to go', value: 0 })
    expect(promotionLine(uma('recruit', { recruit: { rank: 10, exp: 400 } }), 'recruit')).toEqual({ text: 'Promotion · +400 EXP waiting', value: 1, max: 1, opens: true })
    expect(promotionLine(uma('recruit', { recruit: { rank: 10, exp: 0 } }), 'recruit')?.text).toBe('Promotion · Ready')
    const all: Tracks = { acolyte: { rank: 10, exp: 50 }, paladin: { rank: 10, exp: 0 }, cleric: { rank: 10, exp: 0 } }
    expect(promotionLine(uma('acolyte', all), 'acolyte')).toBeNull()
    expect(tier0Progress('recruit', { rank: 10, exp: 400 })).toEqual({ value: 3_600, max: 3_600 })
  })
})
