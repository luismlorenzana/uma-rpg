// Her template on the Uma sheet (H70, live since H72; uma-templates.md §5, UT14): the chip, the card's readings with their
// sources, the Racing tab's rows, the root plate's ★ line and the moon's line. From Classes v3 (live since H134; CV19, CV21)
// her calling is her Tier 0 by running style, with no pick (the calling pick card retired with H134), and her Flourish
// works as any class of that Tier 0's family. Invented outfits.
import type { AptitudeGrade, Aptitudes } from '@luismlorenzana/uma-data'
import { newOwnedUma, nodePoints, type TemplateOutfit } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { flourishLine, racingTemplate, rootFlourish, templateCard, templateChip } from './template-view'

type Grades<K extends string> = Partial<Record<K, AptitudeGrade>>
const outfit = (style: Grades<keyof Aptitudes['strategy']>, distance: Grades<keyof Aptitudes['distance']>, power: number, wit: number,
  growth: Partial<TemplateOutfit['growthRatePercents']>): TemplateOutfit => ({
  baseStats: { speed: 100, stamina: 100, power, guts: 100, wit },
  growthRatePercents: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0, ...growth },
  aptitudes: { strategy: { front: 'C', pace: 'C', late: 'C', end: 'C', ...style }, distance: { sprint: 'C', mile: 'C', medium: 'C', long: 'C', ...distance } },
})
/** uma-templates §6.2's made-up Umas, by Classes v3's calling: C a Pace Uma (a Spellblade; Wit over Power, which no longer
 * counts), D a Late and End one (a Summoner), A a front runner (a Warrior), I a Pace and Late one (a Mage). */
const C = outfit({ pace: 'A' }, { medium: 'A' }, 90, 102, { wit: 20 })
const D = outfit({ late: 'A', end: 'A' }, { long: 'A' }, 104, 88, { power: 20 })
const A = outfit({ front: 'A' }, { medium: 'A', long: 'A' }, 88, 86, { stamina: 20 })
const I = outfit({ pace: 'A', late: 'A' }, { medium: 'A' }, 90, 102, { wit: 20 })
const open = { calling: { pick: null, confirmed: false } }

describe('her template on the sheet (H70; Classes v3 from H134)', () => {
  it('names her on the chip by her Tier 0, owned or locked, with no dot: there is no calling to pick', () => {
    expect(templateChip(C, open)).toEqual({ name: '★ Clever Spellfencer', dot: false })
    // A stored pick from before the switch changes nothing.
    expect(templateChip(C, { calling: { pick: 'mage', confirmed: false } })).toEqual({ name: '★ Clever Spellfencer', dot: false })
    expect(templateChip(C, null)).toEqual({ name: '★ Clever Spellfencer', dot: false })
    expect(templateChip(A, open)).toEqual({ name: '★ Tireless Ironhide', dot: false })
  })

  it('reads the card: the three readings and their sources, then her Flourish and its state', () => {
    expect(templateCard(C, open, 'duelist')).toEqual({
      name: 'Clever Spellfencer',
      readings: [
        { label: 'Calling', value: 'Spellblade', source: 'Pace A' },
        { label: 'Stride', value: 'Middle', source: 'Medium A' },
        { label: 'Knack', value: 'Clever', source: 'Wit +20%' },
      ],
      flourish: '★ Flourish · Even pace · 1%/round · max 4% · On',
    })
    // On as any class of her Tier 0's family; off outside it.
    expect(templateCard(C, open, 'tomeblade')!.flourish).toBe('★ Flourish · Even pace · 1%/round · max 4% · On')
    expect(templateCard(C, open, 'brawler')!.flourish).toBe('★ Flourish · Even pace · 1%/round · max 4% · Off')
    expect(templateCard(C, null, null)!.flourish).toBe('★ Flourish · Even pace · 1%/round · max 4% · Off')
    // A stored pick isn't read: her calling still comes from her style.
    const picked = templateCard(C, { calling: { pick: 'spellblade', confirmed: false } }, 'spellblade')!
    expect(picked.readings[0]).toEqual({ label: 'Calling', value: 'Spellblade', source: 'Pace A' })
    // A front runner's calling reads her style; the longest distance at her best grade is her stride.
    expect(templateCard(A, open, 'recruit')!.readings).toEqual([
      { label: 'Calling', value: 'Warrior', source: 'Front A' },
      { label: 'Stride', value: 'Stayer', source: 'Long A' },
      { label: 'Knack', value: 'Tireless', source: 'Stamina +20%' },
    ])
    expect(templateCard(D, open, 'caller')!.readings[0]).toEqual({ label: 'Calling', value: 'Summoner', source: 'Late A, End A' })
    expect(templateCard(I, open, 'apprentice')!.readings[0]).toEqual({ label: 'Calling', value: 'Mage', source: 'Pace A, Late A' })
  })

  it('fills the Racing tab\'s "Her template", Active or no effect', () => {
    expect(racingTemplate(C, open, 'duelist')).toEqual([
      { label: 'Calling', value: 'Spellblade', note: 'Pace A' },
      { label: 'Stride', value: 'Middle', note: 'Medium A' },
      { label: 'Knack', value: 'Clever', note: 'Wit +20%' },
      { label: 'Flourish', value: 'Even pace', note: 'Active' },
    ])
    expect(racingTemplate(C, open, 'spellblade')![3]!.note).toBe('Active')
    expect(racingTemplate(C, open, 'brawler')![3]!.note).toBe('No effect as Brawler')
    expect(racingTemplate(C, { calling: { pick: 'spellblade', confirmed: true } }, 'spellblade')![0]).toEqual({ label: 'Calling', value: 'Spellblade', note: 'Pace A' })
    expect(racingTemplate(C, null, null)![3]!.note).toBe('As a Spellblade')
  })

  it('draws the root plate\'s ★ line, dimmed outside her Tier 0\'s family', () => {
    expect(rootFlourish(C, open, 'duelist')).toEqual({ line: '★ Even pace · On', off: null })
    expect(rootFlourish(C, open, 'tomeblade').off).toBeNull()
    expect(rootFlourish(C, open, 'cleric')).toEqual({ line: '★ Even pace · Off', off: null })
    expect(flourishLine('late-reserve')).toBe('★ Flourish · Late reserve · round 3+ · 2%/round · max 4% · On')
    expect(flourishLine('clean-break')).toBe('★ Flourish · Clean break · Barrier 4% · start · On')
  })

  it('reads the moon\'s node II by her Tier 0\'s root: a Warrior DEF, a Mage M.DEF, the All-Rounders both', () => {
    const owned = newOwnedUma('2026-10-29T12:00:00.000Z')
    const two = nodePoints('template:2', 1), half = Math.floor(two / 2)
    expect(templateCard(A, owned, 'recruit')!.moon?.[1]).toContain(`★ Moon II · DEF +${two} · `)
    expect(templateCard(I, owned, 'apprentice')!.moon?.[1]).toContain(`★ Moon II · M.DEF +${two} · `)
    expect(templateCard(C, owned, 'duelist')!.moon?.[1]).toContain(`★ Moon II · DEF +${half} · M.DEF +${two - half} · `)
  })
})
