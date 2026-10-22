// Class rules by generation (H53, D179): classes v1 to engine v14, classes v2 from v15, the live game on the switch's
// default (15 since H61, D188). Every v1 row is the old game's exactly; the v2 rows are classes-v2.md §3's.
import { describe, expect, it } from 'vitest'
import { RPG_ALL_NODES, RPG_NODES, rpgNode } from './catalog'
import { ALL_HERO_LIMIT_IDS, hallClass, HERO_HALLS, HERO_LIMIT_IDS, HERO_LIMIT_POWER, HERO_LIMITS, heroLimit, heroLimitFor, heroLimitPower,
  isHeroLimitId } from './heroes'
import { rpgNodeIdentity } from './node-identity'
import {
  projectRpgStats, RPG_ALL_CLASSES, RPG_CLASS_ARMOR, RPG_CLASS_SLOTS, RPG_CLASS_STATS, RPG_CLASSES, RPG_HEALERS, RPG_WEAPONS, rpgClasses,
  rpgClassSlots, rpgClassStats, rpgClassWeapons, rpgDefaultWeapons, rpgHand, rpgIsHealer, validRpgWeapons, type RpgClass, type RpgWeapon,
} from './rules'
import { BATTLE_ENGINE_VERSION, BATTLE_HEAL_OFFENSE_SCALE, RPG_V2_ENGINE, rpgV2 } from './battle/caps'

const V1 = 14, V2 = 15
const FIVE: readonly RpgClass[] = ['brawler', 'mage', 'spellblade', 'cleric', 'summoner']

describe('the one switch (D179)', () => {
  it('is on engine 15 since H61 (D188), with classes v2 from 15', () => {
    expect(BATTLE_ENGINE_VERSION).toBe(15)
    expect(RPG_V2_ENGINE).toBe(15)
    expect([rpgV2(), rpgV2(14), rpgV2(15)]).toEqual([true, false, true])
    expect(BATTLE_HEAL_OFFENSE_SCALE).toBe(300)
  })

  it('lists six live classes, the Paladin last; v1 had five', () => {
    expect(RPG_CLASSES).toEqual([...FIVE, 'paladin'])
    expect(RPG_ALL_CLASSES).toEqual([...FIVE, 'paladin'])
    expect(rpgClasses(V1)).toEqual(FIVE)
    expect(rpgClasses(V2)).toEqual(RPG_ALL_CLASSES)
    expect(RPG_HEALERS).toEqual(['paladin', 'cleric'])
    // A healer only from v15: a v1 Cleric shares the support with the Summoner.
    expect(RPG_ALL_CLASSES.filter((c) => rpgIsHealer(c, V2))).toEqual(['cleric', 'paladin'])
    expect(RPG_ALL_CLASSES.filter((c) => rpgIsHealer(c, V1))).toEqual([])
    expect(RPG_ALL_CLASSES.filter((c) => rpgIsHealer(c))).toEqual(['cleric', 'paladin'])
  })
})

describe('class rules by generation (D179)', () => {
  const A = 'arms', T = 'tome'
  it('gives the slots: today’s in v1, the Cleric 3 Tomes + 2 Arms and the Paladin her mirror in v2', () => {
    const v1 = { brawler: [A, A, A, A, A], mage: [T, T, T, T, T], spellblade: [A, A, A, T, T], cleric: ['any', 'any', 'any', 'any', 'any'],
      summoner: [T, T, T, A, A], paladin: [A, A, A, T, T] }
    for (const c of RPG_ALL_CLASSES) expect(rpgClassSlots(c, V1), c).toEqual(v1[c])
    for (const c of RPG_ALL_CLASSES) expect(rpgClassSlots(c, V2), c).toEqual(c === 'cleric' ? [T, T, T, A, A] : v1[c])
    expect(RPG_CLASS_SLOTS).toEqual(Object.fromEntries(RPG_ALL_CLASSES.map((c) => [c, rpgClassSlots(c, V2)])))
    expect(RPG_CLASS_ARMOR.paladin).toBe('physical')
  })

  it('checks weapons by the generation’s slots', () => {
    const fourArms: RpgWeapon[] = ['greatsword', 'axe', 'lance', 'bow', 'tome-fire']
    const threeTomes: RpgWeapon[] = ['tome-light', 'tome-dark', 'tome-lightning', 'katana', 'bow']
    expect([validRpgWeapons('cleric', fourArms, V1), validRpgWeapons('cleric', fourArms, V2)]).toEqual([true, false])
    expect([validRpgWeapons('cleric', threeTomes, V1), validRpgWeapons('cleric', threeTomes, V2)]).toEqual([true, true])
    expect([validRpgWeapons('paladin', threeTomes, V2), validRpgWeapons('paladin', ['greatsword', 'axe', 'lance', 'tome-ice', 'tome-fire'], V2)])
      .toEqual([false, true])
    // The default reads the live generation, v2.
    expect(validRpgWeapons('cleric', fourArms)).toBe(false)
  })

  it('gives the default spreads: today’s in v1; the Cleric’s and the Paladin’s v2 spreads', () => {
    const today: Record<Exclude<RpgClass, 'paladin'>, RpgWeapon[]> = {
      brawler: ['greatsword', 'axe', 'lance', 'bow', 'katana'], mage: ['tome-fire', 'tome-ice', 'tome-lightning', 'tome-light', 'tome-dark'],
      spellblade: ['greatsword', 'lance', 'katana', 'tome-fire', 'tome-lightning'], cleric: ['greatsword', 'axe', 'bow', 'tome-fire', 'tome-light'],
      summoner: ['tome-fire', 'tome-ice', 'tome-lightning', 'greatsword', 'lance'],
    }
    for (const c of FIVE) expect(rpgDefaultWeapons(c, V1), c).toEqual(today[c as keyof typeof today])
    expect(rpgDefaultWeapons('cleric', V2)).toEqual(['tome-light', 'tome-dark', 'tome-lightning', 'katana', 'bow'])
    expect(rpgDefaultWeapons('paladin', V2)).toEqual(['greatsword', 'axe', 'lance', 'tome-ice', 'tome-fire'])
    expect(rpgDefaultWeapons('paladin', V1)).toEqual(rpgDefaultWeapons('paladin', V2))
    for (const c of ['brawler', 'mage', 'spellblade', 'summoner'] as const) expect(rpgDefaultWeapons(c, V2), c).toEqual(today[c])
    for (const c of RPG_ALL_CLASSES) for (const v of [V1, V2]) expect(validRpgWeapons(c, rpgDefaultWeapons(c, v), v), `${c} v${v}`).toBe(true)
    // A fresh copy each time.
    const spread = rpgDefaultWeapons('brawler')
    spread.pop()
    expect(rpgDefaultWeapons('brawler')).toHaveLength(5)
  })

  it('gives the leans: today’s in v1; the mirrored hybrids, the Paladin and no Heal in v2', () => {
    const today = {
      brawler: { hp: 1.15, atk: 1.1, matk: 0.9, pdef: 1.1, mdef: 0.9, mp: 0.8, heal: 0.8 },
      mage: { hp: 0.9, atk: 0.9, matk: 1.15, pdef: 0.9, mdef: 1.1, mp: 1.3, heal: 1 },
      spellblade: { hp: 1, atk: 1.05, matk: 1.05, pdef: 1, mdef: 1, mp: 1, heal: 0.9 },
      cleric: { hp: 1, atk: 0.8, matk: 1, pdef: 1, mdef: 1.15, mp: 1.3, heal: 1.3 },
      summoner: { hp: 1, atk: 1, matk: 1, pdef: 1, mdef: 1, mp: 1.1, heal: 1.2 },
    }
    const paladin = { hp: 1, atk: 1, matk: 0.8, pdef: 1.15, mdef: 1, mp: 1.3, heal: 0 }
    for (const c of FIVE) expect(rpgClassStats(c, V1), c).toEqual(today[c as keyof typeof today])
    expect(rpgClassStats('paladin', V1)).toEqual(paladin)
    expect(RPG_CLASS_STATS).toEqual(Object.fromEntries(RPG_ALL_CLASSES.map((c) => [c, rpgClassStats(c, V2)])))
    expect(rpgClassStats('spellblade', V2)).toEqual({ hp: 1, atk: 1.1, matk: 0.95, pdef: 1, mdef: 1, mp: 1, heal: 0 })
    expect(rpgClassStats('summoner', V2)).toEqual({ hp: 1, atk: 0.95, matk: 1.1, pdef: 1, mdef: 1, mp: 1, heal: 0 })
    expect(rpgClassStats('paladin', V2)).toEqual(paladin)
    for (const c of ['brawler', 'mage', 'cleric'] as const) expect(rpgClassStats(c, V2), c).toEqual({ ...today[c], heal: 0 })
  })

  it('projects HP with Guts and no Heal in v2 (C1): a Paladin at Lv 50', () => {
    const at50 = { baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
      growthRates: { speed: 0.1, stamina: 0.1, power: 0.1, guts: 0.1, wit: 0.1 }, tier: 1, level: 50 }
    // Each core stat is round(110 ÷ 5 + 49 × 1.5 × 1.1) = 103.
    const v1 = projectRpgStats({ ...at50, classId: 'paladin' }, V1), v2 = projectRpgStats({ ...at50, classId: 'paladin' }, V2)
    expect(v1.hp).toBe(100 + 5 * 103 + 2 * 103)
    expect(v2.hp).toBe(100 + 5 * 103 + 2 * 103 + 103)
    expect([v1.atk, v1.matk, v1.pdef, v1.mp]).toEqual([v2.atk, v2.matk, v2.pdef, v2.mp])
    expect(v2.dexterity).toBe(0)
    // A Cleric's Heal: Guts × 1.3 in v1, none in v2; the default is the live v2.
    expect(projectRpgStats({ ...at50, classId: 'cleric' }, V1).dexterity).toBe(Math.round(103 * 1.3))
    expect(projectRpgStats({ ...at50, classId: 'cleric' }, V2).dexterity).toBe(0)
    expect(projectRpgStats({ ...at50, classId: 'cleric' })).toEqual(projectRpgStats({ ...at50, classId: 'cleric' }, V2))
  })

  it('gives the hands: today’s in v1 for all five, with each half at her power; the v2 hybrids’ (H63: 0.72 and 0.44, 0.58 and 0.56)', () => {
    const today = {
      brawler: { power: 1, mp: 1, linger: 0, pair: false }, mage: { power: 1, mp: 1, linger: 0, pair: false },
      spellblade: { power: 0.45, mp: 0.5, linger: 0, pair: true }, cleric: { power: 0.5, mp: 0.6, linger: 0, pair: false },
      summoner: { power: 0.6, mp: 0.7, linger: 0.3, pair: false },
    }
    for (const c of FIVE) {
      const t = today[c as keyof typeof today]
      expect(rpgHand({ classId: c }, V1), c).toEqual({ ...t, arms: t.power, tome: t.power })
      expect(rpgHand({ classId: c }), c).toEqual(rpgHand({ classId: c }, V2))
    }
    expect(rpgHand({ classId: 'spellblade' }, V2)).toEqual({ power: 0.72, arms: 0.72, tome: 0.44, mp: 0.5, linger: 0, pair: true })
    expect(rpgHand({ classId: 'summoner' }, V2)).toEqual({ power: 0.58, arms: 0.56, tome: 0.58, mp: 0.5, linger: 0.3, pair: true })
    for (const c of ['paladin', 'cleric'] as const) expect(rpgHand({ classId: c }, V2), c).toEqual({ power: 0.5, arms: 0.5, tome: 0.5, mp: 0.6, linger: 0, pair: false })
    for (const c of ['brawler', 'mage'] as const) expect(rpgHand({ classId: c }, V2), c).toEqual(rpgHand({ classId: c }, V1))
  })
})

describe('the Paladin as an identity (D179)', () => {
  it('has hero seats from v15: 24 in all and live, 20 in v14; the Paladin Bastion; her power; v15’s Limit Breaks live, v1’s in v14', () => {
    expect(ALL_HERO_LIMIT_IDS).toHaveLength(24)
    expect(HERO_LIMIT_IDS).toEqual(ALL_HERO_LIMIT_IDS)
    expect([isHeroLimitId('paladin-1'), isHeroLimitId('paladin-1', V1), isHeroLimitId('paladin-1', V2)]).toEqual([true, false, true])
    expect(ALL_HERO_LIMIT_IDS.slice(0, 20).every((id) => isHeroLimitId(id, V1) && isHeroLimitId(id, V2))).toBe(true)
    expect(HERO_HALLS.paladin).toBe('paladin-bastion')
    expect(hallClass('paladin-bastion')).toBe('paladin')
    expect(HERO_LIMIT_POWER.paladin).toBe(1.5)
    // v15's table and powers (H56) are `rpg/battle/halls-v15.test.ts`'s.
    for (const c of RPG_ALL_CLASSES) expect(heroLimitPower(c, V2)).toBe(HERO_LIMIT_POWER[c])
    for (const l of HERO_LIMITS) expect(heroLimitFor(l.id, V2)).toEqual(heroLimit(l.id))
    expect(heroLimitFor('paladin-1', V1)).toBeUndefined()
    expect(HERO_LIMITS).toHaveLength(24)
  })

  it('has ten trees of node identities; the live catalog lists the six classes’ 750', () => {
    expect(RPG_ALL_NODES).toHaveLength(750)
    expect(RPG_NODES).toEqual(RPG_ALL_NODES)
    expect(RPG_NODES.filter((n) => n.classId === 'paladin')).toHaveLength(150)
    expect(rpgClassWeapons('paladin')).toEqual(RPG_WEAPONS)
    const ids = new Set(RPG_ALL_NODES.map((n) => n.id))
    for (const n of RPG_ALL_NODES) expect(rpgNodeIdentity(n.id)).toEqual({ id: n.id, tree: n.tree, classId: n.classId, weapon: n.weapon,
      depth: n.depth, variant: n.variant, cost: n.cost })
    for (const w of RPG_WEAPONS) for (let d = 0; d <= 6; d++) for (const suffix of ['', 'a', 'b', 'c']) {
      const id = `paladin-${w}.${d}${suffix}`
      expect(!!rpgNodeIdentity(id), id).toBe(ids.has(id))
    }
    expect(rpgNode('paladin-greatsword.1a')?.classId).toBe('paladin')
  })

  it('builds her trees with the Cleric’s kit and names: her Axe on every foe from depth 4, Heavy Devotion, Valkyrie’s Oath, no v14 support', () => {
    for (const n of RPG_ALL_NODES.filter((x) => x.classId === 'paladin')) {
      const twin = rpgNode(n.id.replace('paladin-', 'cleric-'))!
      // Both have v15's support (H56, `rpg/battle/healers-v15.test.ts`); only the Cleric has v14's.
      const { support, support15: _, ...kit } = twin.skill
      const { support15, ...own } = n.skill
      expect(support, twin.id).toBeDefined()
      expect([n.skill.support, support15 && 'v15'], n.id).toEqual([undefined, 'v15'])
      const to = n.weapon === 'axe' && n.depth === 4 ? 'foes' : kit.status!.to
      expect(own, n.id).toEqual({ ...kit, status: { ...kit.status!, to } })
      const name = n.id === 'paladin-tome-light.3b' ? 'Heavy Devotion' : n.id === 'paladin-lance.4b' ? "Valkyrie's Oath" : twin.name
      expect(n.name, n.id).toBe(name)
    }
    expect(rpgNode('cleric-tome-light.3b')?.name).toBe('Rebirth')
    expect(rpgNode('paladin-axe.4')?.skill.status?.to).toBe('foes')
    expect(rpgNode('cleric-axe.4')?.skill.status?.to).toBe('foe')
    expect(rpgNode('paladin-greatsword.4')?.skill.status?.to).toBe('foe')
    expect(rpgNode('paladin-greatsword.5')?.skill.status?.to).toBe('foes')
  })
})
