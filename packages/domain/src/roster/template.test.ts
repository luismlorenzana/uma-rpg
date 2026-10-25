// The Uma Template rule (uma-templates §2, UT3–UT5; H67). Invented outfits only, as `RosterOutfit` literals: every name,
// id and profile here is made up, including the worked Umas of uma-templates §6.
import type { AptitudeGrade, Aptitudes, Stats } from '@luismlorenzana/uma-data'
import { describe, expect, it } from 'vitest'
import type { RosterOutfit } from '../master/roster'
import { RPG_ALL_CLASSES } from '../rpg/kinds'
import {
  CALLING_NO_PICK, CALLING_SET, FLOURISH_NAMES, KNACK_FAMILY, KNACK_LABEL, KNACK_STAT, STRIDE_FLOURISH, STRIDE_LABEL, UMA_FAMILIES, UMA_KNACK_WORDS,
  UMA_KNACKS, UMA_STRIDES, UMA_TYPE_NAMES, umaCalling, umaCallingPick, umaCallingPickBlock, umaCallingRow, umaFlourishActive, umaKnack, umaStride,
  umaTemplate, umaTemplateFacets,
} from './template'

type Grades<K extends string> = Partial<Record<K, AptitudeGrade>>
interface Profile {
  style?: Grades<keyof Aptitudes['strategy']>
  distance?: Grades<keyof Aptitudes['distance']>
  base?: Partial<Stats>
  growth?: Partial<Stats>
}

/** An invented outfit; every grade not given is B (below A), every base stat 100, every growth 0. */
function uma({ style = {}, distance = {}, base = {}, growth = {} }: Profile, id = '900001'): RosterOutfit {
  return {
    outfitId: id, masterId: Number(id), characterId: 9001, name: 'Uma Testa', title: 'Made Up', rarity: 3,
    aptitudes: {
      surface: { turf: 'A', dirt: 'G' },
      strategy: { front: 'B', pace: 'B', late: 'B', end: 'B', ...style },
      distance: { sprint: 'B', mile: 'B', medium: 'B', long: 'B', ...distance },
    },
    baseStats: { speed: 100, stamina: 100, power: 100, guts: 100, wit: 100, ...base },
    growthRatePercents: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0, ...growth },
    uniqueSkillId: 1, releasedJp: '2026-01-01', realHorseSex: null,
  }
}
const pw = (power: number, wit: number) => ({ power, wit })

describe('the calling (UT3, the first row that fits)', () => {
  it('reads each of the eight rows', () => {
    const rows = [
      uma({ style: { front: 'A' } }),
      uma({ style: { pace: 'A', late: 'A' }, base: pw(90, 100) }),
      uma({ style: { end: 'A' }, base: pw(110, 90) }),
      uma({ style: { pace: 'A' }, distance: { sprint: 'A' }, base: pw(110, 90) }),
      uma({ style: { pace: 'A' }, distance: { mile: 'A' }, base: pw(110, 90) }),
      uma({ style: { pace: 'A' }, base: pw(90, 110) }),
      uma({ style: { late: 'A' }, base: pw(110, 90) }),
      uma({ style: { late: 'A' }, base: pw(90, 110) }),
    ]
    expect(rows.map(umaCallingRow)).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    expect(rows.map((o) => umaCalling(o))).toEqual(['brawler', 'summoner', 'summoner', 'brawler', 'spellblade', 'mage', 'paladin', 'cleric'])
  })

  it('ties styles Front, Pace, Late, End, and Front comes first', () => {
    expect(umaCallingRow(uma({ style: { front: 'A', pace: 'A' }, base: pw(90, 110) }))).toBe(1)
    expect(umaCallingRow(uma({ style: { pace: 'A', end: 'A' }, distance: { medium: 'A' }, base: pw(110, 90) }))).toBe(5)
    expect(umaCallingRow(uma({ style: { late: 'A', end: 'A' }, base: pw(110, 90) }))).toBe(7)
    // A better grade beats the order.
    expect(umaCallingRow(uma({ style: { front: 'A', pace: 'S' }, distance: { medium: 'A' }, base: pw(110, 90) }))).toBe(5)
  })

  it('counts an S as an A for row 2, and needs Wit ≥ Power there', () => {
    expect(umaCallingRow(uma({ style: { pace: 'A', late: 'S' }, base: pw(90, 100) }))).toBe(2)
    expect(umaCallingRow(uma({ style: { pace: 'S', end: 'A' }, base: pw(100, 100) }))).toBe(2)
    expect(umaCallingRow(uma({ style: { pace: 'A', late: 'S' }, base: pw(100, 90) }))).toBe(7)
    // One A of the three isn't two.
    expect(umaCallingRow(uma({ style: { end: 'A', late: 'B' }, base: pw(90, 100) }))).toBe(3)
  })

  it('goes magical when Power equals Wit', () => {
    expect(umaCalling(uma({ style: { pace: 'A' }, base: pw(100, 100) }))).toBe('mage')
    expect(umaCallingRow(uma({ style: { pace: 'A' }, base: pw(100, 100) }))).toBe(6)
    expect(umaCalling(uma({ style: { late: 'A' }, base: pw(100, 100) }))).toBe('cleric')
    expect(umaCallingRow(uma({ style: { late: 'A' }, base: pw(100, 100) }))).toBe(8)
  })

  it('makes a Pace sprinter a Brawler only when Sprint is the shortest distance at her best grade', () => {
    expect(umaCalling(uma({ style: { pace: 'A' }, distance: { sprint: 'A', mile: 'A' }, base: pw(110, 90) }))).toBe('brawler')
    expect(umaCalling(uma({ style: { pace: 'A' }, distance: { mile: 'A' }, base: pw(110, 90) }))).toBe('spellblade')
    expect(umaCalling(uma({ style: { pace: 'A' }, distance: { sprint: 'A', mile: 'S' }, base: pw(110, 90) }))).toBe('spellblade')
    // Wit over Power: a Mage whatever her distance.
    expect(umaCalling(uma({ style: { pace: 'A' }, distance: { sprint: 'A' }, base: pw(90, 110) }))).toBe('mage')
  })
})

describe('the stride and the knack (UT3)', () => {
  it('reads the longest distance at her best grade', () => {
    expect(umaStride(uma({ distance: { medium: 'A', long: 'A' } }))).toBe('stayer')
    expect(umaStride(uma({ distance: { sprint: 'A' } }))).toBe('dash')
    expect(umaStride(uma({ distance: { mile: 'A' } }))).toBe('dash')
    expect(umaStride(uma({ distance: { medium: 'A' } }))).toBe('middle')
    expect(umaStride(uma({ distance: { sprint: 'A', medium: 'A' } }))).toBe('middle')
    // The best grade first: an S beats a longer A.
    expect(umaStride(uma({ distance: { medium: 'S', long: 'A' } }))).toBe('middle')
  })

  it('reads her top growth, ties broken by the higher base stat, then Speed, Stamina, Power, Guts, Wit', () => {
    expect(umaKnack(uma({ growth: { stamina: 20, guts: 10 } }))).toBe('tireless')
    expect(umaKnack(uma({ growth: { power: 10, wit: 10 }, base: { power: 90, wit: 102 } }))).toBe('clever')
    expect(umaKnack(uma({ growth: { power: 10, wit: 10 }, base: { power: 102, wit: 90 } }))).toBe('mighty')
    expect(umaKnack(uma({ growth: { power: 10, wit: 10 } }))).toBe('mighty')
    expect(umaKnack(uma({ growth: { stamina: 15, guts: 15 } }))).toBe('tireless')
    expect(umaKnack(uma({ growth: { guts: 15, wit: 15 } }))).toBe('gritty')
    expect(umaKnack(uma({ growth: { speed: 10, wit: 10 } }))).toBe('fleet')
    // No growth: the higher base stat, then the order.
    expect(umaKnack(uma({ base: { guts: 120 } }))).toBe('gritty')
    expect(umaKnack(uma({}))).toBe('fleet')
  })

  it('never reads her name, id, surface or skills', () => {
    const profile: Profile = { style: { late: 'A' }, distance: { medium: 'A' }, base: pw(104, 88), growth: { power: 20 } }
    const one = uma(profile, '900001'), other = { ...uma(profile, '900777'), name: 'Someone Else', title: null, uniqueSkillId: 42,
      aptitudes: { ...one.aptitudes, surface: { turf: 'G', dirt: 'A' } } }
    expect(umaTemplate(other)).toEqual(umaTemplate(one))
  })
})

describe('the catalog (UT5)', () => {
  it('names 18 types and 90 templates, all different', () => {
    const types = Object.values(UMA_TYPE_NAMES).flatMap((t) => UMA_STRIDES.map((s) => t[s]))
    const names = types.flatMap((t) => UMA_KNACKS.map((k) => `${UMA_KNACK_WORDS[k]} ${t}`))
    expect(new Set(types).size).toBe(18)
    expect(new Set(names).size).toBe(90)
    expect(Object.keys(UMA_TYPE_NAMES).sort()).toEqual(['brawler', 'cleric', 'mage', 'paladin', 'spellblade', 'summoner'])
  })

  it('keeps the tables the screens read', () => {
    expect(UMA_STRIDES.map((s) => [STRIDE_LABEL[s], FLOURISH_NAMES[STRIDE_FLOURISH[s]]])).toEqual([['Dash', 'Clean break'], ['Middle', 'Even pace'], ['Stayer', 'Late reserve']])
    expect(UMA_KNACKS.map((k) => [KNACK_LABEL[k], KNACK_STAT[k], KNACK_FAMILY[k]])).toEqual([
      ['Fleet', 'speed', 'bell'], ['Mighty', 'power', 'orb'], ['Tireless', 'stamina', 'pendant'], ['Gritty', 'guts', 'insignia'], ['Clever', 'wit', 'insignia'],
    ])
    expect([...new Set(Object.values(KNACK_FAMILY))].sort()).toEqual([...UMA_FAMILIES].sort())
  })
})

// uma-templates §6, every grade not given there below A.
const WORKED = {
  '6.1 A': uma({ style: { front: 'A', pace: 'C' }, distance: { medium: 'A', long: 'A' }, base: { speed: 92, stamina: 104, power: 88, guts: 80, wit: 86 },
    growth: { stamina: 20, guts: 10 } }),
  '6.1 G': uma({ style: { front: 'A', pace: 'A' }, distance: { medium: 'B', long: 'A' }, base: { speed: 106, stamina: 84, power: 90, guts: 82, wit: 88 },
    growth: { speed: 10, power: 10, wit: 10 } }),
  A: uma({ style: { front: 'A' }, distance: { medium: 'A', long: 'A' }, growth: { stamina: 20 } }),
  B: uma({ style: { pace: 'A' }, distance: { mile: 'A' }, base: pw(96, 84), growth: { speed: 20 } }),
  C: uma({ style: { pace: 'A' }, distance: { medium: 'A' }, base: pw(90, 102), growth: { wit: 20 } }),
  D: uma({ style: { end: 'A' }, distance: { long: 'A' }, growth: { guts: 20 } }),
  E: uma({ style: { late: 'A' }, distance: { medium: 'A' }, base: pw(104, 88), growth: { power: 20 } }),
  F: uma({ style: { late: 'A', pace: 'B', end: 'C' }, distance: { mile: 'A' }, base: pw(92, 98), growth: { stamina: 20 } }),
}

describe('the worked Umas (uma-templates §6)', () => {
  it('names §6.1’s two front runners: the knack splits them', () => {
    expect(umaTemplate(WORKED['6.1 A'])).toMatchObject({ calling: 'brawler', stride: 'stayer', knack: 'tireless', name: 'Tireless Ironhide',
      flourish: 'late-reserve', family: 'pendant', row: 1 })
    expect(umaTemplate(WORKED['6.1 G'])).toMatchObject({ calling: 'brawler', stride: 'stayer', knack: 'fleet', name: 'Fleet Ironhide',
      flourish: 'late-reserve', family: 'bell', row: 1 })
  })

  it('names §6.2’s one Uma per calling, with their Flourishes and families', () => {
    const view = (o: RosterOutfit) => { const t = umaTemplate(o); return [t.calling, t.stride, t.name, FLOURISH_NAMES[t.flourish], t.family] }
    expect((['A', 'B', 'C', 'D', 'E', 'F'] as const).map((k) => view(WORKED[k]))).toEqual([
      ['brawler', 'stayer', 'Tireless Ironhide', 'Late reserve', 'pendant'],
      ['spellblade', 'dash', 'Fleet Flashblade', 'Clean break', 'bell'],
      ['mage', 'middle', 'Clever Spellwright', 'Even pace', 'insignia'],
      ['summoner', 'stayer', 'Gritty Shepherd', 'Late reserve', 'insignia'],
      ['paladin', 'middle', 'Mighty Warden', 'Even pace', 'orb'],
      ['cleric', 'dash', 'Tireless Lamplighter', 'Clean break', 'pendant'],
    ])
  })

  it('moves Uma C to a Clever Spellfencer and Uma E to a Mighty Mender by their pick', () => {
    const c = umaTemplate(WORKED.C, 'spellblade'), e = umaTemplate(WORKED.E, 'cleric')
    expect(c).toMatchObject({ calling: 'spellblade', type: 'Spellfencer', name: 'Clever Spellfencer', flourish: 'even-pace', family: 'insignia', row: 6 })
    expect(e).toMatchObject({ calling: 'cleric', type: 'Mender', name: 'Mighty Mender', flourish: 'even-pace', family: 'orb', row: 7 })
  })
})

describe('the calling pick (UT4, CP29)', () => {
  it('offers rows 5–8 their two classes, the suggested one first, and nothing to rows 1–4', () => {
    expect((['B', 'C', 'E', 'F'] as const).map((k) => umaCallingPick(WORKED[k]))).toEqual([
      { options: ['spellblade', 'mage'], suggested: 'spellblade', power: 96, wit: 84 },
      { options: ['mage', 'spellblade'], suggested: 'mage', power: 90, wit: 102 },
      { options: ['paladin', 'cleric'], suggested: 'paladin', power: 104, wit: 88 },
      { options: ['cleric', 'paladin'], suggested: 'cleric', power: 92, wit: 98 },
    ])
    const fixed = [WORKED.A, WORKED.D, uma({ style: { pace: 'A', late: 'A' }, base: pw(90, 100) }),
      uma({ style: { pace: 'A' }, distance: { sprint: 'A' }, base: pw(110, 90) })]
    expect(fixed.map(umaCallingRow)).toEqual([1, 3, 2, 4])
    expect(fixed.map(umaCallingPick)).toEqual([null, null, null, null])
  })

  it('ignores a pick outside her two', () => {
    expect(umaCalling(WORKED.B, 'paladin')).toBe('spellblade')
    expect(umaCalling(WORKED.F, 'mage')).toBe('cleric')
    expect(umaCalling(WORKED.A, 'mage')).toBe('brawler')
    expect(umaTemplate(WORKED.D, 'summoner').calling).toBe('summoner')
    expect(umaCalling(WORKED.B, null)).toBe('spellblade')
  })

  it('moves her calling, type, name and the Flourish’s class, never her stride, knack or family', () => {
    for (const k of ['B', 'C', 'E', 'F'] as const) {
      const pick = umaCallingPick(WORKED[k])!, base = umaTemplate(WORKED[k]), moved = umaTemplate(WORKED[k], pick.options[1])
      expect(moved.calling).toBe(pick.options[1])
      expect(moved.type).not.toBe(base.type)
      expect(moved.name).not.toBe(base.name)
      expect([moved.stride, moved.knack, moved.family, moved.flourish, moved.row]).toEqual([base.stride, base.knack, base.family, base.flourish, base.row])
      expect([umaFlourishActive(base, pick.options[0]), umaFlourishActive(moved, pick.options[0]), umaFlourishActive(moved, pick.options[1])])
        .toEqual([true, false, true])
    }
  })

  it('says why the pick can’t change: no pick for rows 1–4, and a confirmed pick is set', () => {
    expect(umaCallingPickBlock(WORKED.A)).toBe(CALLING_NO_PICK)
    expect(umaCallingPickBlock(WORKED.D, { pick: null, confirmed: true })).toBe(CALLING_NO_PICK)
    expect(umaCallingPickBlock(WORKED.C)).toBeNull()
    expect(umaCallingPickBlock(WORKED.C, { pick: 'spellblade', confirmed: false })).toBeNull()
    expect(umaCallingPickBlock(WORKED.C, { pick: 'mage', confirmed: true })).toBe(CALLING_SET)
    expect([CALLING_NO_PICK, CALLING_SET]).toEqual(['No pick for her', 'Her calling is set'])
  })
})

describe('what her class gates and what the Stable reads (UT12, UT15)', () => {
  it('works her Flourish only as her calling’s class', () => {
    const a = umaTemplate(WORKED.A)
    expect(RPG_ALL_CLASSES.filter((c) => umaFlourishActive(a, c))).toEqual(['brawler'])
  })

  it('gives the facets her calling, stride, knack and name', () => {
    expect(umaTemplateFacets(WORKED.C)).toEqual({ calling: 'mage', stride: 'middle', knack: 'clever', name: 'Clever Spellwright' })
    expect(umaTemplateFacets(WORKED.C, 'spellblade')).toEqual({ calling: 'spellblade', stride: 'middle', knack: 'clever', name: 'Clever Spellfencer' })
  })
})
