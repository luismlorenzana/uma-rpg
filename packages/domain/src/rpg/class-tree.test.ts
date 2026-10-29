// Classes v3's class tree (H126; classes-v3.md §1, §2, §7; CV1–CV11): the parent matrix, families, roots, the suggested
// promotion, the Tier 0 ladder and power, the names by generation and the gate texts.
import { describe, expect, it } from 'vitest'
import { classExpToNext } from '../economy/ranks'
import {
  RPG_CLASS_CHILDREN, RPG_CLASS_PARENTS, RPG_ROOT_NAME, RPG_TIER0_BANK, RPG_TIER0_MAX_RANK, RPG_TIER0_MODEL, RPG_TIER0_MP, RPG_TIER0_POWER, RPG_TIER0_POWER_FACTOR,
  RPG_TIER0_ROOT, RPG_TIER0_SKILL, RPG_TIER1_CLASSES, rpgClassClosedText, rpgClassFamily, rpgClassGate, rpgClassName, rpgClassOpen,
  rpgSuggestedPromotion, rpgThirdsSplit, rpgTier0ExpToNext, rpgTier0Power,
} from './class-tree'
import { RPG_TIER0_CLASSES, rpgClasses, type RpgClass, type RpgTier0Class } from './kinds'

const V18 = 18, V19 = 19
const ranks = (classes: Partial<Record<RpgClass, number>>) =>
  ({ classes: Object.fromEntries(Object.entries(classes).map(([c, rank]) => [c, { rank, exp: 0 }])) })

describe('the class tree (CV1, §1)', () => {
  it('draws §1\'s parent matrix exactly: a hybrid has two parents, its All-Rounder Tier 0 and its channel\'s root class', () => {
    const matrix = Object.fromEntries(RPG_TIER1_CLASSES.map((c) => [c, RPG_TIER0_CLASSES.map((p) => (RPG_CLASS_PARENTS[c].includes(p) ? '●' : ''))]))
    // Columns: Recruit, Duelist, Acolyte, Caller, Initiate.
    expect(matrix).toEqual({
      brawler: ['●', '', '', '', ''],
      spellblade: ['●', '●', '', '', ''],
      armsummoner: ['●', '', '', '●', ''],
      paladin: ['', '', '●', '', ''],
      cleric: ['', '', '●', '', ''],
      summoner: ['', '', '', '●', '●'],
      tomeblade: ['', '●', '', '', '●'],
      mage: ['', '', '', '', '●'],
    })
    // The parents in the gate's order, and children the promotion sheet's.
    expect(RPG_CLASS_PARENTS).toEqual({
      brawler: ['recruit'], spellblade: ['recruit', 'duelist'], armsummoner: ['recruit', 'caller'], paladin: ['acolyte'], cleric: ['acolyte'],
      summoner: ['caller', 'apprentice'], tomeblade: ['duelist', 'apprentice'], mage: ['apprentice'],
    })
    expect(RPG_CLASS_CHILDREN).toEqual({
      recruit: ['brawler', 'spellblade', 'armsummoner'], duelist: ['spellblade', 'tomeblade'], acolyte: ['paladin', 'cleric'],
      caller: ['armsummoner', 'summoner'], apprentice: ['mage', 'tomeblade', 'summoner'],
    })
    // Every edge both ways.
    for (const t0 of RPG_TIER0_CLASSES) for (const c of RPG_CLASS_CHILDREN[t0]) expect(RPG_CLASS_PARENTS[c], `${t0} → ${c}`).toContain(t0)
    for (const c of RPG_TIER1_CLASSES) for (const p of RPG_CLASS_PARENTS[c]) expect(RPG_CLASS_CHILDREN[p], `${p} → ${c}`).toContain(c)
  })

  it('makes families of a Tier 0 and its children, and roots of labels', () => {
    expect(RPG_TIER0_CLASSES.map(rpgClassFamily)).toEqual([
      ['recruit', 'brawler', 'spellblade', 'armsummoner'], ['duelist', 'spellblade', 'tomeblade'], ['acolyte', 'paladin', 'cleric'],
      ['caller', 'armsummoner', 'summoner'], ['apprentice', 'mage', 'tomeblade', 'summoner'],
    ])
    expect(RPG_TIER0_ROOT).toEqual({ recruit: 'warrior', duelist: 'all-rounder', acolyte: 'all-rounder', caller: 'all-rounder', apprentice: 'mage' })
    expect(RPG_ROOT_NAME).toEqual({ warrior: 'Warrior', 'all-rounder': 'All-Rounder', mage: 'Mage' })
    expect(RPG_TIER0_MODEL).toEqual({ recruit: 'brawler', apprentice: 'mage', duelist: 'spellblade', caller: 'summoner', acolyte: 'cleric' })
  })

  it('suggests one child (CV11): the Brawler and the Sorcerer always; for a two-way choice the Arms child when Power beats Wit', () => {
    const at = (power: number, wit: number) => Object.fromEntries(RPG_TIER0_CLASSES.map((t) => [t, rpgSuggestedPromotion(t, { power, wit })]))
    expect(at(96, 88)).toEqual({ recruit: 'brawler', duelist: 'spellblade', acolyte: 'paladin', caller: 'armsummoner', apprentice: 'mage' })
    expect(at(90, 90)).toEqual({ recruit: 'brawler', duelist: 'tomeblade', acolyte: 'cleric', caller: 'summoner', apprentice: 'mage' })
    expect(at(80, 99)).toEqual(at(90, 90))
    for (const t of RPG_TIER0_CLASSES) expect(RPG_CLASS_CHILDREN[t]).toContain(rpgSuggestedPromotion(t, { power: 1, wit: 2 }))
  })
})

describe('Tier 0 (CV5, CV6)', () => {
  it('climbs Class Rank 1–10 at twice today\'s curve: 3,600 to Rank 10, and banks Ranks 10–50\'s 23,680', () => {
    const steps = Array.from({ length: 9 }, (_, i) => rpgTier0ExpToNext(i + 1))
    expect(steps).toEqual([272, 304, 336, 368, 400, 432, 464, 496, 528])
    expect(steps.reduce((a, b) => a + b, 0)).toBe(3_600)
    expect([rpgTier0ExpToNext(10), rpgTier0ExpToNext(0)]).toEqual([Infinity, Infinity])
    for (let r = 1; r < 10; r++) expect(rpgTier0ExpToNext(r)).toBe(2 * classExpToNext(r))
    let tenToFifty = 0
    for (let r = 10; r < 50; r++) tenToFifty += classExpToNext(r)
    expect([RPG_TIER0_BANK, RPG_TIER0_MAX_RANK]).toEqual([tenToFifty, 10])
    // A campaign (Lv 1–50, 2E a win) takes one Tier 0 to Rank 10 and two Tier 1 classes of its family to Rank 50.
    expect(3_600 + 2 * RPG_TIER0_BANK).toBe(50_960)
  })

  it('casts one skill a class, its power by Class Rank §2.2\'s 1.52 → 2.20 × H131\'s 1.05 (D249), 10 MP', () => {
    expect(RPG_TIER0_POWER_FACTOR).toBe(1.05)
    expect(RPG_TIER0_POWER).toEqual([1.596, 1.68, 1.754, 1.838, 1.911, 1.995, 2.069, 2.153, 2.226, 2.31])
    expect([rpgTier0Power(1), rpgTier0Power(10), rpgTier0Power(14), rpgTier0Power(0)]).toEqual([1.596, 2.31, 2.31, 1.596])
    expect(RPG_TIER0_MP).toBe(10)
    expect(RPG_TIER0_SKILL).toEqual({ recruit: 'Drill Strike', apprentice: 'Primer', duelist: 'Feint', caller: 'Beckon', acolyte: 'Vigil' })
  })

  it('splits her offense a third a slot, half up to ATK', () => {
    expect([0, 1, 2, 3].map((arms) => rpgThirdsSplit(30, arms))).toEqual([{ atk: 0, matk: 30 }, { atk: 10, matk: 20 }, { atk: 20, matk: 10 }, { atk: 30, matk: 0 }])
    expect([rpgThirdsSplit(5, 2), rpgThirdsSplit(5, 1), rpgThirdsSplit(4, 1), rpgThirdsSplit(1, 2)]).toEqual([
      { atk: 3, matk: 2 }, { atk: 2, matk: 3 }, { atk: 1, matk: 3 }, { atk: 1, matk: 0 },
    ])
  })
})

describe('names and gates (CV3, CV4, CV8–CV10)', () => {
  it('names the classes by generation: v3\'s from v19, today\'s before', () => {
    expect(rpgClasses(V19).map((c) => rpgClassName(c, V19))).toEqual(['Recruit', 'Duelist', 'Acolyte', 'Caller', 'Initiate', 'Brawler',
      'Arms Spellblade', 'Arms Summoner', 'Paladin', 'Cleric', 'Tome Summoner', 'Tome Spellblade', 'Sorcerer'])
    expect(rpgClasses(V18).map((c) => rpgClassName(c, V18))).toEqual(['Brawler', 'Mage', 'Spell Blade', 'Cleric', 'Summoner', 'Paladin'])
    // The live default is v18's until H134.
    expect([rpgClassName('spellblade'), rpgClassName('spellblade', V19)]).toEqual(['Spell Blade', 'Arms Spellblade'])
  })

  it('opens every Tier 0 to every Uma in Tier 1\'s world and a Tier 1 class once held; a closed one says how', () => {
    const fresh = ranks({})
    for (const t of RPG_TIER0_CLASSES) expect(rpgClassGate(fresh, t, 1, V19), t).toBeNull()
    expect(rpgClassGate(fresh, 'armsummoner', 1, V19)).toBe('Opens with Recruit R10 or Caller R10')
    expect(RPG_TIER1_CLASSES.map(rpgClassClosedText)).toEqual([
      'Opens with Recruit R10', 'Opens with Recruit R10 or Duelist R10', 'Opens with Recruit R10 or Caller R10', 'Opens with Acolyte R10',
      'Opens with Acolyte R10', 'Opens with Caller R10 or Initiate R10', 'Opens with Duelist R10 or Initiate R10', 'Opens with Initiate R10',
    ])
    // Ready to promote: the gate names the parent; held from Rank 10.
    const ready = ranks({ recruit: 10 })
    expect(rpgClassGate(ready, 'brawler', 1, V19)).toBe('Promote from Recruit')
    expect(rpgClassGate(ranks({ recruit: 10, brawler: 11 }), 'brawler', 1, V19)).toBeNull()
    expect(rpgClassOpen(ranks({ brawler: 10 }), 'brawler', 1, V19)).toBe(true)
    expect(rpgClassOpen(ranks({ brawler: 9 }), 'brawler', 1, V19)).toBe(false)
    // Later tiers: every Tier 1 class from Rank 1, no Tier 0 (CV10).
    expect(rpgClassGate(fresh, 'tomeblade', 2, V19)).toBeNull()
    expect(rpgClassGate(fresh, 'recruit', 3, V19)).toBe('Tier 0 is Tier 1’s')
    // Before v19 every class of the generation is open, and the seven don't exist.
    expect(rpgClassGate(fresh, 'paladin', 1, V18)).toBeNull()
    expect(rpgClassGate(fresh, 'recruit', 1, V18)).toBe('No such class')
    expect(rpgClassGate(fresh, 'recruit')).toBe('No such class')
  })

  it('types the Tier 0 list in the tree\'s order', () => {
    const order: readonly RpgTier0Class[] = ['recruit', 'duelist', 'acolyte', 'caller', 'apprentice']
    expect(RPG_TIER0_CLASSES).toEqual(order)
  })
})
