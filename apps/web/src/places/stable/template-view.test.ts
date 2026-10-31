// The Template tab's rules (H123; uma-templates.md §5, UT14; CV19, CV21): the readings with what they read, her calling and trade,
// every ★ row's number and state, the racing rings, the Flourish sheet and the slot the Signature row opens. Nothing here carries
// a dot (D274). Her calling comes from her running styles, with nothing to pick. Invented outfits.
import type { AptitudeGrade, Aptitudes } from '@luismlorenzana/uma-data'
import { newGrades, newOwnedUma, type AccessorySlotState, type OwnedUma, type RosterOutfit, type RpgClass } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { flourishLine, flourishSheet, signatureSlot, templateTab } from './template-view'

const NOW = '2026-10-31T12:00:00.000Z'
type Grades<K extends string> = Partial<Record<K, AptitudeGrade>>
const outfit = (style: Grades<keyof Aptitudes['strategy']>, distance: Grades<keyof Aptitudes['distance']>, power: number, wit: number,
  growth: Partial<RosterOutfit['growthRatePercents']>): RosterOutfit => ({
  outfitId: '81001', baseStats: { speed: 100, stamina: 100, power, guts: 100, wit },
  growthRatePercents: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0, ...growth },
  aptitudes: { surface: { turf: 'A', dirt: 'G' }, strategy: { front: 'C', pace: 'C', late: 'C', end: 'C', ...style }, distance: { sprint: 'C', mile: 'C', medium: 'C', long: 'C', ...distance } },
} as unknown as RosterOutfit)
/** C a Pace Uma (a Spellblade, Clever, so a Charm), D a Late and End one (a Summoner), A a front runner (a Warrior, Tireless),
 * I a Pace and Late one (a Mage), F a Fleet Warrior. */
const C = outfit({ pace: 'A' }, { medium: 'A' }, 90, 102, { wit: 20 })
const D = outfit({ late: 'A', end: 'A' }, { long: 'A' }, 104, 88, { power: 20 })
const A = outfit({ front: 'A' }, { medium: 'A', long: 'A' }, 88, 86, { stamina: 20 })
const I = outfit({ pace: 'A', late: 'A' }, { medium: 'A' }, 90, 102, { wit: 20, power: 10 })

function uma(classId: RpgClass, slots: AccessorySlotState[] = [], extra: Partial<OwnedUma> = {}): OwnedUma {
  const gear = newGrades(1)
  slots.forEach((slot, i) => { gear.accessories[i] = slot })
  return { ...newOwnedUma(NOW), classId, level: 40, gear, ranks: { classes: { [classId]: { rank: 34, exp: 0 } } }, ...extra }
}
const slot = (grade: number, family: AccessorySlotState['family'] = null): AccessorySlotState => ({ grade, family, form: 'base' })
const row = (view: ReturnType<typeof templateTab>, key: string) => view.rows.find((r) => r.key === key)!

describe('the Template tab (H123)', () => {
  it('reads her name, the three readings and what each read, her calling and trade', () => {
    const view = templateTab(C, uma('duelist'), 'duelist', 1)
    expect(view.name).toBe('Clever Spellfencer')
    expect(view.readings).toEqual([
      { label: 'Calling', value: 'Spellblade', source: 'Pace A' },
      { label: 'Stride', value: 'Middle', source: 'Medium A' },
      { label: 'Knack', value: 'Clever', source: `Wit +20% · ${view.readings[2]!.source.split(' · ')[1]}` },
    ])
    expect(view.calling).toBe('Calling · Spellblade · fixed')
    expect(view.trade).toMatch(/^.+ · .+$/)
    // Every style at her top grade, with no Power or Wit.
    expect(templateTab(I, uma('apprentice'), 'apprentice', 1).readings[0]).toMatchObject({ value: 'Mage', source: 'Pace A · Late A' })
  })

  it('rings the three sources: her styles, her stride\'s distance, her knack\'s growth', () => {
    const { racing } = templateTab(I, uma('apprentice'), 'apprentice', 1)
    const ringed = (name: string) => racing.groups.find((g) => g.name === name)!.chips.filter((c) => c.ring).map((c) => c.key)
    expect(ringed('Style')).toEqual(['pace', 'late'])
    expect(ringed('Distance')).toEqual(['medium'])
    expect(ringed('Surface')).toEqual([])
    expect(racing.growth).toBe('Power +10% · Wit +20%')
    expect(racing.growthRing).toBe('Wit')
    expect(templateTab(A, uma('recruit'), 'recruit', 1).racing.groups[1]!.chips.filter((c) => c.ring).map((c) => c.key)).toEqual(['long'])
  })

  it('reads the Flourish On as any class of her family, and Off · as her class, never a dot', () => {
    expect(row(templateTab(C, uma('tomeblade'), 'tomeblade', 1), 'flourish')).toMatchObject({ number: 'Even pace · 1%/round · max 4%', state: 'On', tone: 'on' })
    expect(row(templateTab(C, uma('brawler'), 'brawler', 1), 'flourish')).toMatchObject({ state: 'Off · as Brawler', tone: 'off' })
  })

  it('reads the signature Worn, Not worn and G1 first', () => {
    const family = templateTab(C, uma('duelist'), 'duelist', 1).family
    const other = family === 'pendant' ? 'orb' : 'pendant'
    expect(row(templateTab(C, uma('duelist', [slot(3, family)]), 'duelist', 1), 'signature')).toMatchObject({ number: 'ATK/M.ATK +4', state: 'Worn', tone: 'on' })
    expect(row(templateTab(C, uma('duelist', [slot(3, other)]), 'duelist', 1), 'signature')).toMatchObject({ state: 'Not worn', tone: null })
    expect(row(templateTab(C, uma('duelist', [slot(0, family)]), 'duelist', 1), 'signature')).toMatchObject({ state: 'G1 first' })
  })

  it('reads her moon: Open, its level, or waiting on the moons it opens with', () => {
    const open = { stars: { open: ['template:1'], moons: [] as [] } }
    expect(row(templateTab(A, uma('recruit', [], open), 'recruit', 1), 'moon-1')).toMatchObject({ number: 'HP +20', state: 'Open' })
    expect(row(templateTab(A, uma('recruit', [], { level: 10 }), 'recruit', 1), 'moon-1').state).toBe('Lv 16')
    expect(row(templateTab(A, uma('recruit'), 'recruit', 1), 'moon-1').state).toBe('With its moons')
  })

  it('reads moon II by her calling\'s root', () => {
    expect(row(templateTab(A, uma('recruit'), 'recruit', 1), 'moon-2').number).toBe('DEF +8')
    expect(row(templateTab(I, uma('apprentice'), 'apprentice', 1), 'moon-2').number).toBe('M.DEF +8')
    expect(row(templateTab(C, uma('duelist'), 'duelist', 1), 'moon-2').number).toBe('DEF/M.DEF +4')
    expect(row(templateTab(D, uma('caller'), 'caller', 1), 'moon-2').number).toBe('DEF/M.DEF +4')
  })

  it('shows a locked outfit the same rows with numbers and no states', () => {
    const view = templateTab(C, null, null, 1)
    expect(view.calling).toBe('Calling on unlock · Spellblade')
    expect(view.rows.map((r) => r.state)).toEqual([null, null, null, null])
    expect(row(view, 'signature').number).toBe('ATK/M.ATK +5 · Lv 50')
  })

  it('words a Flourish in one line', () => {
    expect(flourishLine('late-reserve')).toBe('★ Flourish · Late reserve · round 3+ · 2%/round · max 4% · On')
    expect(flourishLine('clean-break')).toBe('★ Flourish · Clean break · Barrier 4% · start · On')
  })
})

describe('the slot the Signature row opens (H123)', () => {
  const family = (o: RosterOutfit) => templateTab(o, null, null, 1).family

  it('is the one wearing her ★, else an empty one at G1, else her highest', () => {
    const f = family(C)
    const other = f === 'pendant' ? 'orb' : 'pendant'
    expect(signatureSlot(uma('duelist', [slot(2, other), slot(1, f)]), f)).toBe(1)
    expect(signatureSlot(uma('duelist', [slot(5, other), slot(0, f), slot(1)]), f)).toBe(2)
    expect(signatureSlot(uma('duelist', [slot(2, other), slot(6, other)]), f)).toBe(1)
    expect(signatureSlot(uma('duelist'), f)).toBe(0)
  })
})

describe('the Flourish sheet (H123)', () => {
  it('reads On with what it works as, and no action', () => {
    const view = flourishSheet(A, uma('brawler'), 'brawler', 1, null)
    expect(view).toMatchObject({ shape: flourishSheet(A, uma('brawler'), 'brawler', 1, null).shape, now: 'Now · On', chips: [], footer: null })
    expect(view.works).toBe('Works as · Warrior, Brawler, Arms Spellblade, Arms Summoner')
  })

  it('offers her family while it\'s off: the highest she holds first, a Tier 1 class before its Tier 0 at a tie', () => {
    const her = uma('apprentice', [], { ranks: { classes: { apprentice: { rank: 10, exp: 0 }, recruit: { rank: 10, exp: 0 }, brawler: { rank: 10, exp: 0 } } } })
    const view = flourishSheet(A, her, 'apprentice', 1, null)
    expect(view.now).toBe('Now · Off · as Mage')
    expect(view.chips.map((c) => [c.name, c.tappable, c.selected])).toEqual([
      ['Warrior', true, false], ['Brawler', true, true], ['Arms Spellblade', false, false], ['Arms Summoner', false, false],
    ])
    expect(view.footer).toEqual({ label: 'Fight as Brawler', classId: 'brawler' })
    expect(flourishSheet(A, her, 'apprentice', 1, 'recruit').footer).toEqual({ label: 'Fight as Warrior', classId: 'recruit' })
  })

  it('reads Start … · R1 on a Tier 0 she hasn\'t started', () => {
    const her = uma('apprentice', [], { ranks: { classes: { apprentice: { rank: 3, exp: 0 } } } })
    expect(flourishSheet(A, her, 'apprentice', 1, null).footer).toEqual({ label: 'Start Warrior · R1', classId: 'recruit' })
  })

  it('has no Tier 0 in a later tier\'s world', () => {
    const her = uma('mage', [], { ranks: { classes: { mage: { rank: 3, exp: 0 }, brawler: { rank: 5, exp: 0 } } } })
    const view = flourishSheet(A, her, 'mage', 2, null)
    expect(view.chips.map((c) => c.name)).toEqual(['Brawler', 'Arms Spellblade', 'Arms Summoner'])
    expect(view.footer).toEqual({ label: 'Fight as Brawler', classId: 'brawler' })
  })
})
