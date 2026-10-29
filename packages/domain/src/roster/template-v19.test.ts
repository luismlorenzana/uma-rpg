// Classes v3's calling and templates at engine v19 (H126; classes-v3.md §5, §9; CV19, CV21): her Tier 0 from her best
// running styles alone, no pick; 5 callings × 3 strides; the Flourish as any class of her Tier 0's family; her moon's node
// II by her calling's root. Invented outfits only: every name, id and profile here is made up.
import type { AptitudeGrade, Aptitudes, Stats } from '@luismlorenzana/uma-data'
import { describe, expect, it } from 'vitest'
import { mapPoints, moonChannel, moonTemplate } from '../economy/planet'
import type { RosterOutfit } from '../master/roster'
import { RPG_TIER0_CLASSES, rpgClasses, type RpgTier0Class } from '../rpg/kinds'
import {
  CALLING_NO_PICK, KNACK_FAMILY, STRIDE_FLOURISH, UMA_ROW_CALLING_V3, UMA_STRIDES, UMA_TYPE_NAMES, umaCalling, umaCallingPick, umaCallingPickBlock,
  umaCallingRowV3, umaFlourishActive, umaTemplate, umaTemplateFacets,
} from './template'

const V18 = 18, V19 = 19
type Style = keyof Aptitudes['strategy']
type Grades<K extends string> = Partial<Record<K, AptitudeGrade>>
/** An invented outfit; every grade not given is B (below A), every base stat 100, every growth 0. */
function uma(style: Grades<Style>, base: Partial<Stats> = {}, distance: Grades<keyof Aptitudes['distance']> = {}): RosterOutfit {
  return {
    outfitId: '900001', masterId: 900001, characterId: 9001, name: 'Uma Testa', title: 'Made Up', rarity: 3,
    aptitudes: {
      surface: { turf: 'A', dirt: 'G' },
      strategy: { front: 'B', pace: 'B', late: 'B', end: 'B', ...style },
      distance: { sprint: 'B', mile: 'B', medium: 'B', long: 'B', ...distance },
    },
    baseStats: { speed: 100, stamina: 100, power: 100, guts: 100, wit: 100, ...base },
    growthRatePercents: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0 },
    uniqueSkillId: 1, releasedJp: '2026-01-01', realHorseSex: null,
  }
}
const best = (styles: readonly Style[]) => uma(Object.fromEntries(styles.map((s) => [s, 'A'])))

describe('the calling by running style (CV19, §5)', () => {
  it('reads §5.1\'s five rows, the first that fits', () => {
    expect([best(['front']), best(['pace']), best(['pace', 'late']), best(['end']), best(['late'])].map(umaCallingRowV3)).toEqual([1, 2, 3, 4, 5])
    expect(UMA_ROW_CALLING_V3).toEqual({ 1: 'recruit', 2: 'duelist', 3: 'apprentice', 4: 'caller', 5: 'acolyte' })
  })

  it('gives every combination of best styles §5.2\'s Tier 0', () => {
    const styles: readonly Style[] = ['front', 'pace', 'late', 'end']
    const subsets = Array.from({ length: 15 }, (_, i) => styles.filter((_, k) => (i + 1) & (1 << k)))
    const want = (set: readonly Style[]): RpgTier0Class => set.includes('front') ? 'recruit' : set.includes('pace') ? (set.length === 1 ? 'duelist' : 'apprentice')
      : set.includes('end') ? 'caller' : 'acolyte'
    for (const set of subsets) expect(umaCalling(best(set), null, V19), set.join(' + ')).toBe(want(set))
    // §5.2's rows by name.
    const table: [Style[], RpgTier0Class][] = [
      [['front'], 'recruit'], [['front', 'pace'], 'recruit'], [['front', 'late'], 'recruit'], [['front', 'end'], 'recruit'],
      [['front', 'pace', 'late', 'end'], 'recruit'], [['pace'], 'duelist'], [['pace', 'late'], 'apprentice'], [['pace', 'late', 'end'], 'apprentice'],
      [['pace', 'end'], 'apprentice'], [['late', 'end'], 'caller'], [['end'], 'caller'], [['late'], 'acolyte'],
    ]
    for (const [set, t0] of table) expect(umaCalling(best(set), null, V19), set.join(' + ')).toBe(t0)
    // A better grade wins: Late S over Front A is a pure Late.
    expect(umaCalling(uma({ front: 'A', late: 'S' }), null, V19)).toBe('acolyte')
  })

  it('reads no Power, Wit or distance, and ignores any stored pick; no Uma has a pick from v19', () => {
    const pace = best(['pace'])
    for (const base of [{ power: 120, wit: 80 }, { power: 80, wit: 120 }]) {
      expect(umaCalling(uma({ pace: 'A' }, base, { sprint: 'A' }), null, V19)).toBe('duelist')
    }
    expect([umaCalling(pace, 'mage', V19), umaCalling(pace, 'spellblade', V19)]).toEqual(['duelist', 'duelist'])
    expect(umaCallingPick(pace, V19)).toBeNull()
    expect(umaCallingPickBlock(pace, { pick: null, confirmed: false }, V19)).toBe(CALLING_NO_PICK)
    // Before v19 the pick still reads.
    expect(umaCallingPick(pace, V18)).not.toBeNull()
    expect(umaCalling(pace, 'spellblade', V18)).toBe('spellblade')
    expect(umaCalling(pace)).toBe('mage')
  })
})

describe('templates 5 × 3 (CV21, §9)', () => {
  it('names fifteen types, each Tier 0 her model\'s three and the Acolyte the Cleric\'s', () => {
    expect(Object.fromEntries(RPG_TIER0_CLASSES.map((c) => [c, UMA_STRIDES.map((s) => UMA_TYPE_NAMES[c][s])]))).toEqual({
      recruit: ['Charger', 'Bruiser', 'Ironhide'], duelist: ['Flashblade', 'Spellfencer', 'Longblade'], acolyte: ['Lamplighter', 'Mender', 'Pilgrim'],
      caller: ['Beckoner', 'Binder', 'Shepherd'], apprentice: ['Flarecaster', 'Spellwright', 'Starkeeper'],
    })
    expect(new Set(RPG_TIER0_CLASSES.flatMap((c) => UMA_STRIDES.map((s) => UMA_TYPE_NAMES[c][s]))).size).toBe(15)
  })

  it('builds her template on her Tier 0 and Classes v3\'s row', () => {
    const t = umaTemplate(uma({ pace: 'A', late: 'A' }, {}, { long: 'A' }), 'spellblade', V19)
    expect([t.calling, t.row, t.stride, t.type, t.flourish]).toEqual(['apprentice', 3, 'stayer', 'Starkeeper', STRIDE_FLOURISH.stayer])
    expect(t.family).toBe(KNACK_FAMILY[t.knack])
    expect(umaTemplateFacets(best(['late']), null, V19).calling).toBe('acolyte')
    expect(umaTemplate(uma({ late: 'A' }, {}, { medium: 'A' }), null, V19).type).toBe('Mender')
  })

  it('works her Flourish as any class of her Tier 0\'s family, and off as another family\'s', () => {
    const on = (calling: RpgTier0Class) => rpgClasses(V19).filter((c) => umaFlourishActive({ calling }, c, V19))
    expect(on('recruit')).toEqual(['recruit', 'brawler', 'spellblade', 'armsummoner'])
    expect(on('duelist')).toEqual(['duelist', 'spellblade', 'tomeblade'])
    expect(on('acolyte')).toEqual(['acolyte', 'paladin', 'cleric'])
    expect(on('caller')).toEqual(['caller', 'armsummoner', 'summoner'])
    expect(on('apprentice')).toEqual(['apprentice', 'summoner', 'tomeblade', 'mage'])
    // Before v19 only as her calling's class.
    expect(rpgClasses(V18).filter((c) => umaFlourishActive({ calling: 'spellblade' }, c, V18))).toEqual(['spellblade'])
  })

  it('puts her moon\'s node II on her calling\'s root: Recruit DEF +8, Apprentice M.DEF +8, the All-Rounders +4 and +4 a tier', () => {
    const node2 = (calling: RpgTier0Class, tier: 1 | 2 | 3) => {
      const p = mapPoints(['template:2'], 'brawler', tier, { knack: 'fleet', channel: moonChannel(calling, V19) })
      return [p.def, p.mdef]
    }
    expect(RPG_TIER0_CLASSES.map((c) => node2(c, 1))).toEqual([[8, 0], [4, 4], [4, 4], [4, 4], [0, 8]])
    expect(node2('caller', 2)).toEqual([7, 7])
    expect(node2('acolyte', 3)).toEqual([10, 11])
    expect(RPG_TIER0_CLASSES.map((c) => moonChannel(c, V19))).toEqual(['physical', 'both', 'both', 'both', 'magical'])
    expect(moonTemplate(best(['pace']), null, V19).channel).toBe('both')
    // Before v19 her calling's armor half.
    expect([moonChannel('spellblade', V18), moonChannel('summoner', V18), moonTemplate(best(['pace'])).channel]).toEqual(['physical', 'magical', 'magical'])
  })
})
