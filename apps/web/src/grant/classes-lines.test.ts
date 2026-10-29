// "The classes are rebuilt" as words (H132; classes-v3.md §8.6–§8.7, halls-v2.md §7.2): CV §8.7's five made-up Umas
// A–E on a hand-written save v32 record, the Healer Sanctum's merge lines, a later tier's world and the Account's row.
import type { ClassesV3Line, ClassesV3Record, RpgClass } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { classesLines, classesRow, rebuiltClass, type ClassesWho } from './classes-lines'

const line = (classId: string | null, ranks: ClassesV3Line['ranks'], manuals: number, trade?: ClassesV3Line['trade']): ClassesV3Line =>
  ({ classId, ranks, pick: null, manuals, left: manuals, ...(trade ? { trade } : {}) })

/** §8.7's five: A 21, B 13 (her trade Wood → Stone), C 10, D none (Stone → Wood), E 34; 78 in all. */
function record(over: Partial<ClassesV3Record> = {}): ClassesV3Record {
  return {
    manuals: 78, marks: 78_000, traded: true, seen: false,
    umas: {
      a: line('brawler', { brawler: { rank: 34, exp: 300 }, paladin: { rank: 12, exp: 100 } }, 21),
      b: line('spellblade', { mage: { rank: 8, exp: 50 }, spellblade: { rank: 26, exp: 0 } }, 13, { from: 'physical-hybrid', to: 'magical' }),
      c: line('cleric', { cleric: { rank: 24, exp: 200 } }, 10),
      d: line('mage', {}, 0, { from: 'magical', to: 'physical-hybrid' }),
      e: line('summoner', { mage: { rank: 15, exp: 0 }, summoner: { rank: 50, exp: 0 } }, 34),
      f: line(null, {}, 0),
    },
    halls: [
      { outfitId: 'a', from: 'paladin-2', to: 'healer-2', was: 'hero', now: 'learner', bond: 7 },
      { outfitId: 'f', from: 'cleric-3', to: 'healer-3', was: 'learner', now: 'unseated', bond: 3 },
    ],
    ...over,
  }
}
const AFTER: Readonly<Record<string, RpgClass>> = { a: 'recruit', b: 'apprentice', c: 'acolyte', d: 'duelist', e: 'caller', f: 'recruit' }
const who = (id: string): ClassesWho | undefined => (id === 'gone' ? undefined : { name: `Uma ${id.toUpperCase()}`, after: AFTER[id] ?? null })

describe('classesLines (CV §8.6)', () => {
  it('heads with the grant: +78 Class Manuals, 78,000 Class Marks at the Exchange', () => {
    const lines = classesLines(record(), who, 1)
    expect(lines.title).toBe('The classes are rebuilt')
    expect(lines.grant).toBe('+78 Class Manuals')
    expect(lines.marks).toBe('78,000 Class Marks · Exchange')
    expect(lines.lead).toBe('Every Uma starts her class tree at Rank 1 of her Tier 0.')
  })

  it('draws the tree small: three roots over the five Tier 0s, by v19\'s names', () => {
    expect(classesLines(record(), who, 1).tree).toEqual([
      { root: 'Warrior', classes: [{ classId: 'recruit', name: 'Recruit' }] },
      { root: 'All-Rounder', classes: [{ classId: 'duelist', name: 'Duelist' }, { classId: 'acolyte', name: 'Acolyte' }, { classId: 'caller', name: 'Caller' }] },
      { root: 'Mage', classes: [{ classId: 'apprentice', name: 'Initiate' }] },
    ])
  })

  it('says how to rebuild an Uma in two steps, and what reset, stayed and happened to weapons', () => {
    const lines = classesLines(record(), who, 1)
    expect(lines.steps).toEqual([
      { text: 'Exchange → Read a Class Manual → her Tier 0 → Her share', note: null },
      { text: 'Her profile → Class → Promote (Rank 10)', note: 'EXP past Rank 10 goes with her into the new class' },
    ])
    expect(lines.reset).toBe('Class Ranks · weapons per class · lines · equipped skills · callings')
    expect(lines.stays).toBe('Uma Levels · weapon, armor and accessory grades · Extra Stats · Craft Levels · Bonds · Hall seats · Laurels · items')
    expect(lines.weapons).toBe('No Weapon Rank since R2: grades stay')
  })

  it('lists each Uma by Manuals: E 34, A 21, B 13, C 10, then D with no Manuals and a moved trade; F (nothing to say) left out', () => {
    const umas = classesLines(record(), who, 1).umas
    expect(umas.map((u) => [u.name, u.manuals])).toEqual([['Uma E', 34], ['Uma A', 21], ['Uma B', 13], ['Uma C', 10], ['Uma D', 0]])
    const of = (id: string) => umas.find((u) => u.outfitId === id)!.line
    expect(of('e')).toBe('Summoner R50 · Mage R15 → Caller R1')
    expect(of('a')).toBe('Brawler R34 · Paladin R12 → Recruit R1')
    expect(of('b')).toBe('Spell Blade R26 · Mage R8 → Initiate R1 · trade Wood → Stone')
    expect(of('c')).toBe('Cleric R24 → Acolyte R1')
    expect(of('d')).toBe('No Class EXP → Duelist R1 · trade Stone → Wood')
  })

  it('counts the moved trades, one Uma or many, and leaves the part out when none moved', () => {
    expect(classesLines(record(), who, 1).trades).toBe('2 Umas moved trade · their running work finished into the Warehouse')
    const one = record()
    delete one.umas.d!.trade
    expect(classesLines(one, who, 1).trades).toBe('1 Uma moved trade · her running work finished into the Warehouse')
    const none = record()
    delete none.umas.b!.trade
    delete none.umas.d!.trade
    expect(classesLines(none, who, 1).trades).toBeNull()
  })

  it('names every Uma the Healer Sanctum\'s merge moved: a displaced Hero and a Learner past the tenth place', () => {
    expect(classesLines(record(), who, 1).halls).toEqual({
      head: 'Paladin Bastion · Cleric Chapel → Healer Sanctum',
      moves: [
        { outfitId: 'a', label: 'Uma A', value: 'Hero → Learner · Archdemon’s Toll · Bond 7' },
        { outfitId: 'f', label: 'Uma F', value: 'Learner → no seat · Seraph’s Pyre · Bond 3' },
      ],
      foot: 'Each Uma keeps her higher Bond',
    })
  })

  it('keeps the head and the foot when seats merged with no Uma moved, and drops the part when the halls were empty', () => {
    expect(classesLines(record({ halls: [] }), who, 1, true).halls).toEqual({
      head: 'Paladin Bastion · Cleric Chapel → Healer Sanctum', moves: [], foot: 'Each Uma keeps her higher Bond',
    })
    expect(classesLines(record({ halls: [] }), who, 1).halls).toBeNull()
    expect(classesLines(record({ halls: [] }), who, 1, false).halls).toBeNull()
  })

  it('names an Uma master data lacks "An Uma", with no arrow', () => {
    const r = record({ umas: { gone: line('brawler', { brawler: { rank: 3, exp: 0 } }, 1) }, manuals: 1, marks: 1000, halls: [] })
    expect(classesLines(r, who, 1).umas).toEqual([{ outfitId: 'gone', name: 'An Uma', manuals: 1, line: 'Brawler R3' }])
  })

  it('reads a later tier\'s world without Tier 0: its lead, one step, no tree, and her Tier 1 class at Rank 1', () => {
    const r = record({ umas: { a: line('brawler', { brawler: { rank: 34, exp: 300 } }, 14) }, manuals: 14, marks: 14_000, halls: [] })
    const lines = classesLines(r, (id) => ({ name: `Uma ${id.toUpperCase()}`, after: 'brawler' }), 2)
    expect(lines.lead).toBe('Every Uma starts again at Rank 1 of her class.')
    expect(lines.steps).toEqual([{ text: 'Exchange → Read a Class Manual → her class → Her share', note: null }])
    expect(lines.tree).toBeNull()
    expect(lines.umas[0]!.line).toBe('Brawler R34 → Brawler R1')
  })
})

describe('the Account\'s row and the class after the reset', () => {
  it('reads "The classes are rebuilt · 78 Class Manuals"', () => {
    expect(classesRow(record())).toEqual({ label: 'The classes are rebuilt', value: '78 Class Manuals' })
  })

  it('starts her again in her calling\'s Tier 0 in Tier 1\'s world, her v31 class in a later one', () => {
    const front = { aptitudes: { strategy: { front: 'A', pace: 'B', late: 'B', end: 'B' }, distance: { sprint: 'B', mile: 'B', medium: 'A', long: 'B' } }, baseStats: { power: 110, wit: 90 } } as const
    expect(rebuiltClass(front, { classId: 'paladin' }, 1)).toBe('recruit')
    expect(rebuiltClass(front, { classId: 'mage' }, 2)).toBe('mage')
    expect(rebuiltClass(front, { classId: null }, 2)).toBe('brawler')
  })
})
