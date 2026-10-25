// Her template on the Uma sheet (H70; uma-templates.md §5, UT14; class-progression.md §10.2, CP29), asked with an explicit
// engine: nothing before v16; from it the chip, the card's readings with their sources, the Racing tab's rows, the root
// plate's ★ line, and the calling pick card for a Pace or a Late Uma until her calling is confirmed. Invented outfits.
import type { AptitudeGrade, Aptitudes } from '@luismlorenzana/uma-data'
import type { TemplateOutfit } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { callingCard, flourishLine, racingTemplate, rootFlourish, templateCard, templateChip } from './template-view'

type Grades<K extends string> = Partial<Record<K, AptitudeGrade>>
const outfit = (style: Grades<keyof Aptitudes['strategy']>, distance: Grades<keyof Aptitudes['distance']>, power: number, wit: number,
  growth: Partial<TemplateOutfit['growthRatePercents']>): TemplateOutfit => ({
  baseStats: { speed: 100, stamina: 100, power, guts: 100, wit },
  growthRatePercents: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0, ...growth },
  aptitudes: { strategy: { front: 'C', pace: 'C', late: 'C', end: 'C', ...style }, distance: { sprint: 'C', mile: 'C', medium: 'C', long: 'C', ...distance } },
})
/** uma-templates §6.2's made-up Umas: C a Pace Uma with Wit over Power (Mage, or Spell Blade), F a Late one (Cleric, or
 * Paladin), A a front runner (no pick). */
const C = outfit({ pace: 'A' }, { medium: 'A' }, 90, 102, { wit: 20 })
const F = outfit({ late: 'A', pace: 'B' }, { mile: 'A' }, 92, 98, { stamina: 20 })
const E = outfit({ late: 'A' }, { medium: 'A' }, 104, 88, { power: 20 })
const A = outfit({ front: 'A' }, { medium: 'A', long: 'A' }, 88, 86, { stamina: 20 })
const open = { calling: { pick: null, confirmed: false } }

describe('her template on the sheet (H70)', () => {
  it('shows nothing before v16', () => {
    expect(templateChip(C, open, 15)).toBeNull()
    expect(templateCard(C, open, 'mage', 15)).toBeNull()
    expect(racingTemplate(C, open, 'mage', 15)).toBeNull()
    expect(rootFlourish(C, open, 'mage', 15)).toBeNull()
    expect(callingCard(C, open.calling, 15)).toBeNull()
  })

  it('names her on the chip, with a dot while an owned Uma\'s calling is open; locked outfits show it too', () => {
    expect(templateChip(C, open, 16)).toEqual({ name: '★ Clever Spellwright', dot: true })
    expect(templateChip(C, { calling: { pick: 'spellblade', confirmed: true } }, 16)).toEqual({ name: '★ Clever Spellfencer', dot: false })
    expect(templateChip(C, null, 16)).toEqual({ name: '★ Clever Spellwright', dot: false })
    expect(templateChip(A, open, 16)).toEqual({ name: '★ Tireless Ironhide', dot: false })
  })

  it('reads the card: the three readings and their sources, then her Flourish and its state', () => {
    expect(templateCard(C, open, 'mage', 16)).toEqual({
      name: 'Clever Spellwright',
      readings: [
        { label: 'Calling', value: 'Mage', source: 'Pace A, Wit 102 ≥ Power 90' },
        { label: 'Stride', value: 'Middle', source: 'Medium A' },
        { label: 'Knack', value: 'Clever', source: 'Wit +20%' },
      ],
      flourish: '★ Even pace · as a Mage · on',
    })
    expect(templateCard(C, open, 'brawler', 16)!.flourish).toBe('★ Even pace · as a Mage · no effect as Brawler')
    expect(templateCard(C, null, null, 16)!.flourish).toBe('★ Even pace · as a Mage')
    const picked = templateCard(C, { calling: { pick: 'spellblade', confirmed: false } }, 'spellblade', 16)!
    expect(picked.readings[0]).toEqual({ label: 'Calling', value: 'Spell Blade', source: 'picked' })
    expect(picked.flourish).toBe('★ Even pace · as a Spell Blade · on')
    // A front runner's calling reads her style; the longest distance at her best grade is her stride.
    expect(templateCard(A, open, 'brawler', 16)!.readings).toEqual([
      { label: 'Calling', value: 'Brawler', source: 'Front A' },
      { label: 'Stride', value: 'Stayer', source: 'Long A' },
      { label: 'Knack', value: 'Tireless', source: 'Stamina +20%' },
    ])
  })

  it('fills the Racing tab\'s "Her template", Active or no effect', () => {
    expect(racingTemplate(C, open, 'mage', 16)).toEqual([
      { label: 'Calling', value: 'Mage', note: 'Pace A · Wit 102 ≥ Power 90' },
      { label: 'Stride', value: 'Middle', note: 'Medium A' },
      { label: 'Knack', value: 'Clever', note: 'Wit +20%' },
      { label: 'Flourish', value: 'Even pace', note: 'Active' },
    ])
    expect(racingTemplate(C, open, 'brawler', 16)![3]!.note).toBe('No effect as Brawler')
    expect(racingTemplate(C, { calling: { pick: 'spellblade', confirmed: true } }, 'spellblade', 16)![0]).toEqual({ label: 'Calling', value: 'Spell Blade', note: 'Picked' })
    expect(racingTemplate(C, null, null, 16)![3]!.note).toBe('As a Mage')
  })

  it('draws the root plate\'s ★ line, dimmed outside her calling\'s class', () => {
    expect(rootFlourish(C, open, 'mage', 16)).toEqual({ line: '★ Even pace · 1% of her max HP a round, up to 4%', off: null })
    expect(rootFlourish(C, open, 'cleric', 16)).toEqual({ line: '★ Even pace · 1% of her max HP a round, up to 4%', off: 'No effect as Cleric' })
    expect(flourishLine('late-reserve')).toBe('★ Late reserve · from round 3, 2% of her max HP a round, up to 4%')
    expect(flourishLine('clean-break')).toBe('★ Clean break · a Barrier of 4% of her max HP at the start')
  })

  it('offers the calling pick to Pace and Late Umas, the suggested one first and marked, until it is confirmed', () => {
    expect(callingCard(C, open.calling, 16)).toEqual({
      tiles: [
        { classId: 'mage', name: 'Clever Spellwright', flourish: '★ Even pace as a Mage', suggested: true, selected: true },
        { classId: 'spellblade', name: 'Clever Spellfencer', flourish: '★ Even pace as a Spell Blade', suggested: false, selected: false },
      ],
      suggested: 'Suggested · Wit 102 over Power 90',
    })
    // Her stored pick is the one selected; the suggestion stays marked.
    const picked = callingCard(C, { pick: 'spellblade', confirmed: false }, 16)!
    expect(picked.tiles.map((t) => [t.classId, t.suggested, t.selected])).toEqual([['mage', true, false], ['spellblade', false, true]])
    // A Late Uma with Power over Wit: Paladin suggested, or Cleric; one with Wit, Cleric first.
    const late = callingCard(E, undefined, 16)!
    expect(late.tiles.map((t) => [t.classId, t.name, t.suggested])).toEqual([['paladin', 'Mighty Warden', true], ['cleric', 'Mighty Mender', false]])
    expect(late.suggested).toBe('Suggested · Power 104 over Wit 88')
    expect(callingCard(F, open.calling, 16)!.tiles.map((t) => [t.classId, t.flourish])).toEqual([
      ['cleric', '★ Clean break as a Cleric'], ['paladin', '★ Clean break as a Paladin']])
    // Confirmed: the card is gone. A front runner has no pick.
    expect(callingCard(C, { pick: 'spellblade', confirmed: true }, 16)).toBeNull()
    expect(callingCard(C, { pick: null, confirmed: true }, 16)).toBeNull()
    expect(callingCard(A, open.calling, 16)).toBeNull()
  })
})
