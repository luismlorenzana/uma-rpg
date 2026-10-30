// The owner's trim of the halls (D261), engine v20, live: sixteen seats. The Warrior Dojo and the Mage Tower keep seats 1–2,
// the Salle and the Circle keep their four, and the Healer Sanctum's seats are Lance + Light, Greatsword + Dark, Lightning +
// Light and Fire + Dark. Every kept seat that didn't change kinds is v19's own Limit Break, and v19's fights keep the twenty.
import { describe, expect, it } from 'vitest'
import { RPG_RANDOM_BONUS } from './catalog'
import { RPG_TIER1_CLASSES } from './class-tree'
import {
  ALL_HERO_LIMIT_IDS, HERO_LIMIT_IDS, HERO_LIMITS, heroHalls, heroLimit, heroLimitFor, heroLimitIds, heroLimitKinds, heroLimitsOfHall, heroLimitSkills,
  isHeroLimitId, type HeroLimit,
} from './heroes'
import { RPG_DAMAGE_KINDS, rpgAnsweredTwinSets, rpgDefaultWeapons, rpgPhysical, type RpgDamageKind, type RpgTwinSet } from './rules'
import { BATTLE_STATUS_STEP } from './battle/skills'

const V19 = 19, V20 = 20
const CLOSED = ['brawler-3', 'brawler-4', 'mage-3', 'mage-4'] as const
const sixteen = heroLimitIds(V20).map((id) => heroLimitFor(id, V20)!)
/** Her cast at 100%, scale 1 and open power 1 on one foe, weak to `weak`, with her own curse counted unless `curse` is false. */
function onOne(l: HeroLimit, weak: readonly RpgDamageKind[] = [], curse = true): number {
  let total = 0, cursed: 'physical' | 'magical' | null = null
  for (const d of heroLimitSkills(l, l.power! * 1000)) {
    for (const h of d.hits) {
      const k = h.parts[0]!.kind, channel = rpgPhysical(k) ? 'physical' : 'magical'
      total += (h.power / 1000) * (weak.includes(k) ? 1.3 : 1) * (cursed === channel ? 1 + BATTLE_STATUS_STEP : 1)
    }
    if (curse && d.status?.key === 'armor-break') cursed = 'physical'
    if (curse && d.status?.key === 'mind-break') cursed = 'magical'
  }
  return total
}

describe('the sixteen seats (D261)', () => {
  it('is live: two seats in the Dojo and the Tower, four in the other three, in seat order', () => {
    expect(HERO_LIMIT_IDS).toEqual(heroLimitIds(V20))
    expect(HERO_LIMITS.map((l) => l.id)).toEqual(heroLimitIds(V20))
    expect(heroHalls(V20)).toEqual(heroHalls(V19))
    expect(Object.fromEntries(heroHalls().map((h) => [h, heroLimitsOfHall(h).map((l) => l.id.slice(l.id.lastIndexOf('-') + 1)).join('')]))).toEqual({
      brawler: '12', mage: '12', spellblade: '1234', summoner: '1234', healer: '1234',
    })
    expect(HERO_LIMITS).toHaveLength(16)
    expect(heroLimit('brawler-1')).toBe(heroLimitFor('brawler-1', V20))
  })

  it('closes the four from v20 only: v19 keeps them, and every generation still counts 28', () => {
    for (const id of CLOSED) {
      expect([isHeroLimitId(id, V19), isHeroLimitId(id, V20), isHeroLimitId(id)], id).toEqual([true, false, false])
      expect(heroLimitFor(id, V19), id).toBeDefined()
      expect(heroLimitFor(id, V20), id).toBeUndefined()
    }
    expect(heroLimitIds(V19)).toHaveLength(20)
    expect(ALL_HERO_LIMIT_IDS).toHaveLength(28)
  })

  it('keeps each other seat v19’s own, the Salle and the Circle whole, and only the Sanctum’s 2–4 change', () => {
    const changed = heroLimitIds(V20).filter((id) => heroLimitFor(id, V20) !== heroLimitFor(id, V19))
    expect(changed).toEqual(['healer-2', 'healer-3', 'healer-4'])
    expect(heroLimitFor('healer-1', V20)!.name).toBe('Archangel’s Judgment')
  })

  it('gives the Sanctum the owner’s four: kinds in lead order, the lead 60%, a Light strike doubled, one stack each', () => {
    const row = (l: HeroLimit) => [l.name, heroLimitKinds(l), l.classId, l.power, l.casts.flatMap((c) => (c.status ? [c.status.key] : []))]
    expect(heroLimitsOfHall('healer').map(row)).toEqual([
      ['Archangel’s Judgment', ['lance', 'light'], 'paladin', 2, ['brave']],
      ['Archdemon’s Toll', ['greatsword', 'dark'], 'paladin', 2, ['armor-break']],
      ['Seraph’s Storm', ['lightning', 'light'], 'cleric', 2, ['faith']],
      ['Cinder Fiend’s Barrage', ['fire', 'dark'], 'cleric', 2, ['mind-break']],
    ])
    for (const l of heroLimitsOfHall('healer')) {
      const hits = l.casts.flatMap((c) => c.hits)
      expect(hits.reduce((n, h) => n + h.share * (h.kinds[0] === heroLimitKinds(l)[0] ? 1 : 0), 0), l.id).toBeCloseTo(0.6, 10)
      expect(hits.reduce((n, h) => n + h.share, 0), l.id).toBeCloseTo(1, 10)
      expect(hits.every((h) => !!h.double === (h.kinds[0] === 'light')), l.id).toBe(true)
      expect(hits.reduce((n, h) => n + (h.double ? 2 : 1), 0), l.id).toBe(4)
    }
    // Their blessing lands after the hits, their curse before.
    expect(heroLimit('healer-3').casts).toHaveLength(1)
    expect(heroLimit('healer-4').casts.map((c) => c.hits.length)).toEqual([0, 4])
  })

  it('holds the ladder: the Ultimates first, the tri next on two weaknesses; the fiend’s own curse is worth its whole cast', () => {
    expect(onOne(heroLimit('healer-1'))).toBeCloseTo(2, 2)
    expect(onOne(heroLimit('healer-2'))).toBeCloseTo(2.12, 2)
    expect(onOne(heroLimit('healer-3'))).toBeCloseTo(2, 2)
    expect(onOne(heroLimit('healer-4'))).toBeCloseTo(2.2, 2)
    expect(onOne(heroLimit('healer-4'), ['fire', 'dark'])).toBeCloseTo(2.86, 2)
    const ultimate = heroLimit('brawler-2')
    for (const l of sixteen.filter((x) => x.power !== 2.9)) {
      expect(onOne(l), l.name).toBeLessThan(onOne(ultimate))
      expect(onOne(l, heroLimitKinds(l)), l.name).toBeLessThan(onOne(ultimate, ['greatsword']))
    }
    // The mean over the sixteen, the pacts' random bonus and the healers' own curses counted.
    const nominal = (l: HeroLimit) => l.power! * (l.casts.some((c) => c.target === 'random') ? RPG_RANDOM_BONUS : 1) * (onOne(l) / onOne(l, [], false))
    expect(sixteen.reduce((n, l) => n + nominal(l), 0) / 16).toBeCloseTo(2.24, 2)
  })

  it('carries no volley any more', () => {
    expect(sixteen.flatMap((l) => l.casts).some((c) => c.volley)).toBe(false)
  })
})

describe('coverage on the sixteen', () => {
  const holds = (l: HeroLimit, k: RpgDamageKind) => heroLimitKinds(l).includes(k)
  const count = (set: RpgTwinSet) => sixteen.filter((l) => rpgAnsweredTwinSets(heroLimitKinds(l), V20).includes(set)).length

  it('leaves the Bow in one seat and the Katana in one hall, by the owner’s list; every other kind in two halls or more', () => {
    expect(RPG_DAMAGE_KINDS.map((k) => sixteen.filter((l) => holds(l, k)).length)).toEqual([3, 4, 3, 1, 3, 3, 2, 3, 5, 5])
    expect(sixteen.filter((l) => holds(l, 'bow')).map((l) => l.name)).toEqual(['Centaur Warband'])
    const thin = RPG_DAMAGE_KINDS.filter((k) => new Set(sixteen.filter((l) => holds(l, k)).map((l) => l.hall)).size < 2)
    expect(thin).toEqual(['bow', 'katana'])
  })

  it('answers each element’s twin set from six seats and Twilight from four', () => {
    expect(Object.fromEntries((['fire', 'ice', 'lightning', 'light', 'dark', 'twilight'] as const).map((s) => [s, count(s)])))
      .toEqual({ fire: 6, ice: 6, lightning: 6, light: 6, dark: 6, twilight: 4 })
  })

  it('still closes every set each Tier 1 class’s defaults miss with two Heroes: 28 to 45 of the 120 pairs', () => {
    const SETS = ['fire', 'ice', 'lightning', 'light', 'dark'] as const
    const pairs = (c: (typeof RPG_TIER1_CLASSES)[number]) => {
      const missing = SETS.filter((s) => !rpgAnsweredTwinSets(rpgDefaultWeapons(c, V20), V20).includes(s))
      let n = 0
      for (let i = 0; i < sixteen.length; i++) for (let j = i + 1; j < sixteen.length; j++) {
        const answered = rpgAnsweredTwinSets([...heroLimitKinds(sixteen[i]!), ...heroLimitKinds(sixteen[j]!)], V20)
        if (missing.every((s) => answered.includes(s))) n++
      }
      return n
    }
    expect(Object.fromEntries(RPG_TIER1_CLASSES.map((c) => [c, pairs(c)]))).toEqual({
      brawler: 36, mage: 36, spellblade: 28, tomeblade: 28, armsummoner: 28, summoner: 28, paladin: 36, cleric: 45,
    })
  })
})
