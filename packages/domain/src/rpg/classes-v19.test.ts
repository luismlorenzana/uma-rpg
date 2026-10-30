// Classes v3's class rules at engine v19 (H126; classes-v3.md §2.4, §3, §3.8, §13; CV4, CV7, CV15–CV18), every engine passed
// explicitly: the thirteen in order, each table's v19 row, the hands' lead half from v15, Tier 0's any-kind slots, the
// default parties' coverage and a Tier 0's depth, power, regen and held skills. v18's rows stay as they are.
import { describe, expect, it } from 'vitest'
import { PROWESS_SPLIT } from '../economy/planet'
import { classPresetAccessory, classPresetV3 } from '../save/presets'
import {
  isRpgTome, RPG_CLASS_ARMOR, RPG_DAMAGE_KINDS, RPG_HEALERS, RPG_TIER0_CLASSES, RPG_V2_CLASSES, RPG_WEAPONS, rpgBaseMpRegen, rpgClasses,
  rpgClassExpToNext, rpgClassMaxRank, rpgClassSlots, rpgClassStats, rpgDefaultWeapons, rpgHand, rpgHeldSkills, rpgIsHealer, rpgIsTier0,
  rpgOpenDepthOf, rpgOpenPower, rpgSkillFactor, rpgWeaponKind, validRpgWeapons, type RpgClass, type RpgProfile, type RpgWeapon,
} from './rules'

const V15 = 15, V16 = 16, V17 = 17, V18 = 18, V19 = 19
const A = 'arms', T = 'tome'

describe('the thirteen classes (CV4, §13)', () => {
  it('lists six to v18 and thirteen from v19, in the tree\'s order; the live list is thirteen since H134', () => {
    expect(rpgClasses(V18)).toEqual(['brawler', 'mage', 'spellblade', 'cleric', 'summoner', 'paladin'])
    expect(rpgClasses(V19)).toEqual(['recruit', 'duelist', 'acolyte', 'caller', 'apprentice', 'brawler', 'spellblade', 'armsummoner', 'paladin',
      'cleric', 'summoner', 'tomeblade', 'mage'])
    expect(rpgClasses()).toEqual(rpgClasses(V19))
    expect(rpgClasses(V18)).toEqual(RPG_V2_CLASSES)
    expect(rpgClasses(V19).filter(rpgIsTier0)).toEqual(RPG_TIER0_CLASSES)
    // One healer a party: the Paladin and the Cleric; a Tier 0 is none (CV22).
    expect(RPG_HEALERS).toEqual(['paladin', 'cleric'])
    expect(rpgClasses(V19).filter((c) => rpgIsHealer(c, V19))).toEqual(['paladin', 'cleric'])
  })
})

describe('each class\'s v19 row (§2.4, §3, §3.8)', () => {
  const V19_ROWS: Readonly<Record<RpgClass, { slots: string[]; weapons: RpgWeapon[]; lean: number[]; prowess: number | null; armor: string; form: string }>> = {
    recruit: { slots: ['any', 'any', 'any'], weapons: ['greatsword', 'axe', 'lance'], lean: [1, 1, 1, 1, 1, 1], prowess: null, armor: 'physical', form: 'bell greatsword' },
    apprentice: { slots: ['any', 'any', 'any'], weapons: ['tome-fire', 'tome-ice', 'tome-lightning'], lean: [1, 1, 1, 1, 1, 1], prowess: null, armor: 'magical', form: 'pendant' },
    duelist: { slots: ['any', 'any', 'any'], weapons: ['katana', 'lance', 'tome-lightning'], lean: [1, 1, 1, 1, 1, 1], prowess: null, armor: 'physical', form: 'pendant' },
    caller: { slots: ['any', 'any', 'any'], weapons: ['tome-dark', 'tome-ice', 'axe'], lean: [1, 1, 1, 1, 1, 1], prowess: null, armor: 'magical', form: 'orb ice' },
    acolyte: { slots: ['any', 'any', 'any'], weapons: ['tome-light', 'tome-ice', 'bow'], lean: [1, 1, 1, 1, 1, 1], prowess: null, armor: 'magical', form: 'orb ice' },
    brawler: { slots: [A, A, A], weapons: ['greatsword', 'axe', 'lance'], lean: [1.15, 1.1, 0.9, 1.1, 0.9, 0.8], prowess: 100, armor: 'physical', form: 'bell greatsword' },
    spellblade: { slots: [A, A, T], weapons: ['katana', 'lance', 'tome-lightning'], lean: [1, 1.1, 0.95, 1, 1, 1], prowess: 70, armor: 'physical', form: 'pendant' },
    armsummoner: { slots: [A, A, T], weapons: ['bow', 'axe', 'tome-dark'], lean: [1, 1.1, 0.95, 1, 1, 1], prowess: 70, armor: 'physical', form: 'orb bow' },
    paladin: { slots: [A, A, T], weapons: ['greatsword', 'axe', 'tome-light'], lean: [1, 1, 0.8, 1.15, 1, 1.3], prowess: 80, armor: 'physical', form: 'pendant' },
    cleric: { slots: [T, T, A], weapons: ['tome-light', 'tome-ice', 'bow'], lean: [1, 0.8, 1, 1, 1.15, 1.3], prowess: 20, armor: 'magical', form: 'orb ice' },
    summoner: { slots: [T, T, A], weapons: ['tome-dark', 'tome-ice', 'axe'], lean: [1, 0.95, 1.1, 1, 1, 1], prowess: 30, armor: 'magical', form: 'orb ice' },
    tomeblade: { slots: [T, T, A], weapons: ['tome-light', 'tome-lightning', 'katana'], lean: [1, 0.95, 1.1, 1, 1, 1], prowess: 30, armor: 'magical', form: 'pendant' },
    mage: { slots: [T, T, T], weapons: ['tome-fire', 'tome-ice', 'tome-lightning'], lean: [0.9, 0.9, 1.15, 0.9, 1.1, 1.3], prowess: 0, armor: 'magical', form: 'pendant' },
  }
  const form = (c: RpgClass, v: number) => { const f = classPresetAccessory(c, v); return f.kind ? `${f.family} ${f.kind}` : f.family }

  it('gives every class its slots, defaults, lean, Prowess, armor half and preset form', () => {
    for (const c of rpgClasses(V19)) {
      const row = V19_ROWS[c]
      const lean = rpgClassStats(c, V19)
      expect(rpgClassSlots(c, V19), c).toEqual(row.slots)
      expect(rpgDefaultWeapons(c, V19), c).toEqual(row.weapons)
      expect(validRpgWeapons(c, rpgDefaultWeapons(c, V19), V19), c).toBe(true)
      expect([lean.hp, lean.atk, lean.matk, lean.pdef, lean.mdef, lean.mp], c).toEqual(row.lean)
      expect(lean.heal, c).toBe(0)
      expect(rpgIsTier0(c) ? null : PROWESS_SPLIT[c], c).toBe(row.prowess)
      expect(RPG_CLASS_ARMOR[c], c).toBe(row.armor)
      expect(form(c, V19), c).toBe(row.form)
      expect(classPresetV3(c, V19).weapons, c).toEqual(row.weapons)
    }
  })

  it('keeps v18\'s rows: the Summoner on Dark, Light and Bow with her Orb on Light, every other class as v19', () => {
    expect(rpgDefaultWeapons('summoner', V18)).toEqual(['tome-dark', 'tome-light', 'bow'])
    // The live default is v19's since H134.
    expect(rpgDefaultWeapons('summoner')).toEqual(['tome-dark', 'tome-ice', 'axe'])
    expect(form('summoner', V18)).toBe('orb light')
    for (const c of rpgClasses(V18).filter((x) => x !== 'summoner')) {
      expect(rpgDefaultWeapons(c, V18), c).toEqual(rpgDefaultWeapons(c, V19))
      expect(rpgClassSlots(c, V18), c).toEqual(rpgClassSlots(c, V19))
      expect(rpgClassStats(c, V18), c).toEqual(rpgClassStats(c, V19))
      expect(rpgHand({ classId: c }, V18), c).toEqual(rpgHand({ classId: c }, V19))
      expect(form(c, V18), c).toBe(form(c, V19))
    }
  })

  it('gives the hands: Tier 0 ×1 on both channels, the new hybrids their pair\'s mirror, the lead half from data', () => {
    const shape = (c: RpgClass, v: number) => { const h = rpgHand({ classId: c }, v); return [h.arms, h.tome, h.mp, h.pair, h.lead, h.extra, h.linger] }
    for (const c of RPG_TIER0_CLASSES) expect(shape(c, V19), c).toEqual([1, 1, 1, false, null, false, 0])
    expect(shape('spellblade', V19)).toEqual([0.72, 0.44, 0.5, true, 'arms', true, 0])
    // H131 (D249) tuned the mirrors' hands from these drafts: the Tome Spellblade's Arms 0.44 → 0.48, the Arms Summoner's
    // Tome 0.50 → 0.46, the Summoners' lead 0.62 → 0.57 (the Tome Summoner's from v19 only).
    expect(shape('tomeblade', V19)).toEqual([0.48, 0.72, 0.5, true, 'tome', true, 0])
    expect(shape('armsummoner', V19)).toEqual([0.57, 0.46, 0.5, true, 'arms', false, 0.3])
    expect(shape('summoner', V19)).toEqual([0.5, 0.57, 0.5, true, 'tome', false, 0.3])
    expect(shape('summoner', 18)).toEqual([0.5, 0.62, 0.5, true, 'tome', false, 0.3])
    for (const c of ['brawler', 'mage'] as const) expect(shape(c, V19), c).toEqual([1, 1, 1, false, null, false, 0])
    for (const c of ['paladin', 'cleric'] as const) expect(shape(c, V19), c).toEqual([0.5, 0.5, 0.6, false, null, false, 0])
  })

  it('sets every hand\'s lead half from v15 as the engine played it: the Spell Blade\'s Arms with her extra hit, the Summoner\'s Tome', () => {
    const lead = (c: RpgClass, v: number) => { const h = rpgHand({ classId: c }, v); return [h.lead, h.extra] }
    for (const v of [V15, V16, V17, V18, V19]) {
      expect(lead('spellblade', v), `v${v}`).toEqual(['arms', true])
      expect(lead('summoner', v), `v${v}`).toEqual(['tome', false])
      for (const c of ['brawler', 'mage', 'paladin', 'cleric'] as const) expect(lead(c, v), `${c} v${v}`).toEqual([null, false])
      // The lead half is the stronger hand, as `hand.tome > hand.arms` read it.
      for (const c of rpgClasses(v)) {
        const h = rpgHand({ classId: c }, v)
        if (h.pair) expect(h.lead === 'tome', `${c} v${v}`).toBe(h.tome > h.arms)
      }
    }
    // Before v15 no half led.
    expect(lead('spellblade', 14)).toEqual([null, false])
  })
})

describe('Tier 0\'s weapons (CV7)', () => {
  it('takes any three different weapons, in any slot; two of one kind never', () => {
    expect(validRpgWeapons('recruit', ['tome-fire', 'bow', 'tome-dark'], V19)).toBe(true)
    expect(validRpgWeapons('acolyte', ['greatsword', 'axe', 'lance'], V19)).toBe(true)
    expect(validRpgWeapons('caller', ['tome-fire', 'tome-ice', 'tome-light'], V19)).toBe(true)
    expect(validRpgWeapons('recruit', ['bow', 'bow', 'axe'], V19)).toBe(false)
    expect(validRpgWeapons('recruit', ['bow', 'axe'], V19)).toBe(false)
    for (const c of RPG_TIER0_CLASSES) for (const w of RPG_WEAPONS) {
      const spread: RpgWeapon[] = [w, ...RPG_WEAPONS.filter((x) => x !== w).slice(0, 2)]
      expect(validRpgWeapons(c, spread, V19), `${c} ${w}`).toBe(true)
    }
  })

  it('types the new hybrids\' slots by channel, lead first', () => {
    expect(validRpgWeapons('armsummoner', ['lance', 'greatsword', 'tome-lightning'], V19)).toBe(true)
    expect(validRpgWeapons('armsummoner', ['tome-dark', 'bow', 'axe'], V19)).toBe(false)
    expect(validRpgWeapons('tomeblade', ['tome-dark', 'tome-ice', 'axe'], V19)).toBe(true)
    expect(validRpgWeapons('tomeblade', ['katana', 'tome-light', 'tome-lightning'], V19)).toBe(false)
    expect(validRpgWeapons('tomeblade', ['tome-light', 'tome-lightning', 'tome-fire'], V19)).toBe(false)
  })
})

describe('the default parties\' coverage (§3.8, §11)', () => {
  const kinds = (party: readonly RpgClass[]) => new Set(party.flatMap((c) => rpgDefaultWeapons(c, V19).map(rpgWeaponKind)))
  const missing = (party: readonly RpgClass[]) => RPG_DAMAGE_KINDS.filter((k) => !kinds(party).has(k))
  it('holds all ten kinds with the balance party, the Paladin\'s party and the five Tier 0s; only the Bow lacks with a Paladin for the Cleric', () => {
    expect(missing(['brawler', 'mage', 'spellblade', 'summoner', 'cleric'])).toEqual([])
    expect(missing(['brawler', 'mage', 'spellblade', 'summoner', 'paladin'])).toEqual(['bow'])
    expect(missing(['brawler', 'mage', 'tomeblade', 'armsummoner', 'paladin'])).toEqual([])
    expect(missing(RPG_TIER0_CLASSES)).toEqual([])
  })

  it('holds one twin set in both halves per hybrid, three of its identity\'s four kinds', () => {
    const halves = (c: RpgClass) => { const w = rpgDefaultWeapons(c, V19); return [w.filter((x) => !isRpgTome(x)).map(rpgWeaponKind), w.filter(isRpgTome).map(rpgWeaponKind)] }
    expect(halves('spellblade')).toEqual([['katana', 'lance'], ['lightning']])
    expect(halves('tomeblade')).toEqual([['katana'], ['light', 'lightning']])
    expect(halves('armsummoner')).toEqual([['bow', 'axe'], ['dark']])
    expect(halves('summoner')).toEqual([['axe'], ['dark', 'ice']])
  })
})

describe('a Tier 0 in the fight\'s rules (CV6; Halls v2 §3.1)', () => {
  const recruit = (classRank: number): RpgProfile => ({ outfitId: '1', baseStats: { speed: 100, stamina: 100, power: 100, guts: 100, wit: 100 },
    growthRates: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0 }, classId: 'recruit', weapons: ['greatsword', 'bow', 'tome-fire'], tier: 1, level: 10,
    exp: 0, tree: [], legacy: [], classRank, lines: {} })

  it('opens depth 1 only, whatever her rank; her open power is her skill\'s at her Class Rank', () => {
    expect([1, 5, 10].map((r) => rpgOpenDepthOf({ classId: 'recruit', classRank: r }, V19))).toEqual([1, 1, 1])
    expect([1, 7, 10].map((r) => rpgOpenPower({ classId: 'recruit', classRank: r }, V19))).toEqual([1.596, 2.069, 2.31]) // §2.2's 1.52, 1.97, 2.20 × H131's 1.05
    expect([1, 10, 20].map((r) => rpgOpenDepthOf({ classId: 'brawler', classRank: r }, V19))).toEqual([1, 2, 3])
    expect([1, 10, 30].map((r) => rpgOpenPower({ classId: 'brawler', classRank: r }, V19))).toEqual([1.6, 2.2, 3.7])
    expect(rpgSkillFactor({ classId: 'recruit', depth: 1 }, 4, V19)).toBe(1.838)
    expect(rpgSkillFactor({ classId: 'brawler', depth: 1 }, 1, V19)).toBe(0.95)
  })

  it('regains depth 1\'s 1% of her max MP a round at every rank, and holds her three weapons\' one node each', () => {
    for (const r of [1, 10]) expect(rpgBaseMpRegen(300, { classId: 'recruit', classRank: r }, V19), `R${r}`).toBe(3)
    expect(rpgBaseMpRegen(300, { classId: 'brawler', classRank: 10 }, V19)).toBe(6)
    expect(rpgHeldSkills(recruit(10), V19).map((r) => r.id)).toEqual(['recruit-greatsword.1', 'recruit-bow.1', 'recruit-tome-fire.1'])
  })

  it('ranks 1–10 on her own ladder, every other class 1–50', () => {
    expect([rpgClassMaxRank('recruit', V19), rpgClassMaxRank('brawler', V19), rpgClassMaxRank('recruit', V18)]).toEqual([10, 50, 50])
    expect([rpgClassExpToNext('caller', 1, V19), rpgClassExpToNext('caller', 10, V19), rpgClassExpToNext('mage', 10, V19)]).toEqual([272, Infinity, 280])
  })
})
