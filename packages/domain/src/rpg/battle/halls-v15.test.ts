// Engine v15's six halls, built dark (H56, classes-v2.md §5; C3) and live since H61 (D188; v16's two kinds since H72): 24 Limit Breaks, the Chapel's seats 3–4 moved to the
// Paladin Bastion, two new Limit Breaks in each of those halls, Sunfire Edge and Moon Fox reshaped, the hybrids' power at
// 2.2×, a Limit Break's support at its strength, and a Learner's inherited hits at her higher offense.
import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { rpgFoe } from '../campaign/enemies'
import { RPG_SKILL_POWER, RPG_SUPPORT_ALL } from '../catalog'
import {
  ALL_HERO_LIMIT_IDS, HERO_LIMIT_SUPPORT_SHARE, HERO_LIMITS, heroLimit, heroLimitFor, heroLimitPower, heroLimitSkills, type HeroLimitId,
} from '../heroes'
import { projectRpgStats, rpgDefaultWeapons, RPG_ALL_CLASSES, rpgOpenDepth, type RpgClass, type RpgProfile } from '../rules'
import { applyBattleAction, createBattle } from './engine'
import { battleLimitPlan } from './limit'
import { BATTLE_HEAL_OFFENSE_SCALE, BATTLE_REVIVE_SHARE } from './skills'
import type { BattleAlly, BattleCue, BattleEnemy, BattleInherit, BattleState, BattleStep } from './types'

type V = 14 | 15 | 16
const LEVEL = 30
/** An invented Uma at Lv 30 (depths 1–4 open), built by the fight's generation. */
function member(id: string, classId: RpgClass, version: V, extra: Partial<BattleAlly> = {}): BattleAlly {
  const weapons = rpgDefaultWeapons(classId, version)
  const p: RpgProfile = { outfitId: id, baseStats: { speed: 110, stamina: 110, power: 130, guts: 110, wit: 90 },
    growthRates: { speed: 0.05, stamina: 0.05, power: 0.05, guts: 0.05, wit: 0.05 }, classId, weapons, tier: 1, level: LEVEL, exp: 0,
    tree: [], legacy: [], classRank: LEVEL }
  const stats = projectRpgStats(p, version)
  return { id, classId, weapons, tier: 1, level: LEVEL, stats, tree: [], legacy: [], loadout: [{ tier: 1, id: `${classId}-${weapons[0]}.1` }],
    mp: stats.mp, classRank: LEVEL, ...extra }
}
const foe = (id: string): BattleEnemy => {
  const f = rpgFoe({ id, castId: `cast-${id}`, element: 'ice', role: 'striker', rank: 'regular', level: LEVEL, shield: 6,
    weaknesses: { weapons: ['greatsword'], elements: ['fire'] } })
  return { ...f, stats: { ...f.stats, hp: 100_000, atk: 1, matk: 1 } }
}
const FOES = [foe('f1'), foe('f2'), foe('f3')]
/** `caster` in seat 1 with a full gauge, and four Brawlers and Mages; v15 parties carry no healer here. */
function fight(caster: BattleAlly, version: V, foes = FOES): BattleState {
  const allies = [caster, member('a2', 'mage', version), member('a3', 'brawler', version), member('a4', 'mage', version), member('a5', 'brawler', version)]
  const s = createBattle({ version, seed: 1560, allies, enemies: foes }).state
  s.units.find((u) => u.id === 'a1')!.limit = 12
  return s
}
const hero = (seat: HeroLimitId, version: V, classId: RpgClass = 'brawler') => member('a1', classId, version, { hero: seat })
const learner = (seat: HeroLimitId, bond: number, version: V, classId: RpgClass = 'brawler') =>
  member('a1', classId, version, { inherits: [{ limit: seat, bond, from: 'x9' } satisfies BattleInherit] })
function fire(s: BattleState, seat: HeroLimitId): BattleStep {
  const ally = s.input.allies[0]!
  const step = applyBattleAction(s, { kind: 'limit', actorId: 'a1', targetId: 'f1', ...(ally.inherits ? { hero: seat } : {}) })
  expect(step.error, seat).toBeUndefined()
  return step
}
type Cue = { kind: BattleCue['kind']; actorId: string; targetId: string; amount?: number; label?: string; element?: string | null; channel?: string; weak?: boolean }
const mine = (cues: readonly BattleCue[], kind: BattleCue['kind']): Cue[] => cues.filter((c) => c.kind === kind && 'actorId' in c && c.actorId === 'a1') as Cue[]
const hits = (cues: readonly BattleCue[]) => mine(cues, 'hit').filter((c) => c.targetId.startsWith('f'))
const maxHpOf = (s: BattleState, id: string) => s.input.allies.find((a) => a.id === id)!.stats.hp
/** v15's scaling for anyone but a healer: her higher offense (§3.3). */
const scaling = (a: BattleAlly) => 1 + Math.max(a.stats.atk, a.stats.matk) / BATTLE_HEAL_OFFENSE_SCALE
const sha = (v: unknown) => createHash('sha256').update(JSON.stringify(v)).digest('hex').slice(0, 32)

describe('the six halls’ table (H56, §5)', () => {
  const table = (version: V) => ALL_HERO_LIMIT_IDS.map((id) => heroLimitFor(id, version)).filter((l) => !!l)

  it('gives v14 today’s 20, byte for byte, and v15 the six halls’ 24 in seat order', () => {
    // Digests of `heroLimitFor(id, 14)` and its casts on main before H56 (`de4cecd`): today's table, unchanged.
    expect(table(14)).toHaveLength(20)
    expect(sha(table(14))).toBe('72cb9b8facbc49012c92684942f1c9ae')
    expect(sha(table(14).map((l) => heroLimitSkills(l, 10)))).toBe('6f6d2c3e98ed23205d012a1319da59a8')
    // The live table is v16's since H72 (D210): v15's but Choir of Angels and Rampart Charge (H65, `trees-v16.test.ts`).
    expect(table(16)).toEqual(HERO_LIMITS)
    expect(HERO_LIMITS.filter((l) => l !== heroLimitFor(l.id, 15)).map((l) => l.id)).toEqual(['cleric-1', 'paladin-3'])
    expect(table(15).map((l) => l.id)).toEqual(ALL_HERO_LIMIT_IDS)
    expect(Object.fromEntries(table(15).map((l) => [l.id, l.name]))).toEqual({
      'brawler-1': 'Arsenal Rush', 'brawler-2': 'Iaido Cleave', 'brawler-3': 'Spear and Arrow Storm', 'brawler-4': 'Earthsplitter',
      'mage-1': 'Elemental Cascade', 'mage-2': 'Twilight Eclipse', 'mage-3': 'Trinity Storm', 'mage-4': 'Chaos Rain',
      'spellblade-1': 'Sunfire Edge', 'spellblade-2': 'Rimefang Waltz', 'spellblade-3': 'Thunder Javelin', 'spellblade-4': 'Eclipse Volley',
      'cleric-1': 'Choir of Angels', 'cleric-2': 'Legion of Demons', 'cleric-3': 'Dawn Hymn', 'cleric-4': 'Frost Sanctuary',
      'summoner-1': 'Cinder Wyrm', 'summoner-2': 'Frost Behemoth', 'summoner-3': 'Thunderbird', 'summoner-4': 'Moon Fox',
      'paladin-1': 'Archangel’s Verdict', 'paladin-2': 'Archdemon’s Pact', 'paladin-3': 'Rampart Charge', 'paladin-4': 'Valkyrie Lances',
    })
    // Each Limit Break is its seat's class's, and the unchanged seats are today's.
    for (const l of table(15)) expect(l.classId, l.id).toBe(l.id.slice(0, l.id.lastIndexOf('-')))
    const changed = ['spellblade-1', 'cleric-3', 'cleric-4', 'summoner-4']
    for (const l of table(14)) if (!changed.includes(l.id)) expect(heroLimitFor(l.id, 15), l.id).toBe(l)
  })

  it('moves Archangel’s Verdict and Archdemon’s Pact to the Bastion’s seats 1–2; the live table is v15’s', () => {
    expect(heroLimitFor('cleric-3', 14)!.name).toBe('Archangel’s Verdict')
    expect(heroLimitFor('cleric-3', 15)!.name).toBe('Dawn Hymn')
    expect(heroLimitFor('paladin-1', 15)).toEqual({ ...heroLimitFor('cleric-3', 14)!, id: 'paladin-1', classId: 'paladin' })
    expect(heroLimitFor('paladin-2', 15)).toEqual({ ...heroLimitFor('cleric-4', 14)!, id: 'paladin-2', classId: 'paladin' })
    expect(heroLimitFor('paladin-1', 14)).toBeUndefined()
    expect(heroLimit('cleric-3').name).toBe('Dawn Hymn')
    expect(heroLimit('paladin-1').name).toBe('Archangel’s Verdict')
  })

  it('raises the hybrids’ power to 2.2× from v15', () => {
    expect(Object.fromEntries(RPG_ALL_CLASSES.map((c) => [c, [heroLimitPower(c, 14), heroLimitPower(c, 15)]]))).toEqual({
      brawler: [2, 2], mage: [2.4, 2.4], spellblade: [2, 2.2], cleric: [1.5, 1.5], summoner: [1.8, 2.2], paladin: [1.5, 1.5],
    })
    const level = RPG_SKILL_POWER[rpgOpenDepth(LEVEL) - 1]!
    const total = (classId: RpgClass, version: V) =>
      battleLimitPlan(hero('brawler-1', version, classId), { hero: 'brawler-1' }, version)!.casts.reduce((n, c) => n + c.def.hits.reduce((m, h) => m + h.power, 0), 0)
    expect(total('spellblade', 14)).toBeCloseTo(2 * level, 2)
    expect(total('spellblade', 15)).toBeCloseTo(2.2 * level, 2)
    expect(total('summoner', 15)).toBeCloseTo(2.2 * level, 2)
  })
})

describe('the reshaped and new Limit Breaks in a fight (H56, §5)', () => {
  it('lands Sunfire Edge as three Greatsword-and-Fire cleaves on one foe, then its splash on the others (one cleave in v14)', () => {
    const shape = (version: V) => hits(fire(fight(hero('spellblade-1', version), version), 'spellblade-1').cues).map((c) => `${c.targetId}:${c.element}`)
    expect(shape(15)).toEqual(['f1:greatsword', 'f1:fire', 'f1:greatsword', 'f1:fire', 'f1:greatsword', 'f1:fire', 'f2:fire', 'f3:fire'])
    expect(shape(14)).toEqual(['f1:greatsword', 'f1:fire', 'f2:fire', 'f3:fire'])
  })

  it('sends Moon Fox’s eight strikes at random foes (one foe in v14)', () => {
    const targets = (version: V) => hits(fire(fight(hero('summoner-4', version), version), 'summoner-4').cues)
    expect(targets(15).map((c) => c.element)).toEqual(['katana', 'dark', 'bow', 'light', 'katana', 'dark', 'bow', 'light'])
    expect(new Set(targets(15).map((c) => c.targetId)).size).toBeGreaterThan(1)
    expect(new Set(targets(14).map((c) => c.targetId))).toEqual(new Set(['f1']))
  })

  it('Dawn Hymn: Fire on every foe, then a mend on every Uma at 0.66 × 0.4 × her scaling', () => {
    const a = hero('cleric-3', 15)
    const s = fight(a, 15)
    for (const u of s.units) if (u.side === 'ally') u.hp = 1
    const cues = fire(s, 'cleric-3').cues
    expect(hits(cues).map((c) => `${c.targetId}:${c.element}`)).toEqual(['f1:fire', 'f2:fire', 'f3:fire'])
    const mends = mine(cues, 'heal')
    expect(mends.map((c) => c.targetId)).toEqual(['a1', 'a2', 'a3', 'a4', 'a5'])
    for (const c of mends) expect(c.amount, c.targetId).toBe(Math.round(maxHpOf(s, c.targetId) * HERO_LIMIT_SUPPORT_SHARE * scaling(a) * RPG_SUPPORT_ALL))
  })

  it('Frost Sanctuary: Ice on every foe, then a cleanse and a Barrier on every Uma', () => {
    const a = hero('cleric-4', 15)
    const s = fight(a, 15)
    for (const u of s.units) if (u.side === 'ally') u.statuses.push({ kind: 'burn', stacks: 1, turns: 2 })
    const step = fire(s, 'cleric-4')
    expect(hits(step.cues).map((c) => `${c.targetId}:${c.element}`)).toEqual(['f1:ice', 'f2:ice', 'f3:ice'])
    expect(mine(step.cues, 'status').filter((c) => c.label === 'burn cleansed')).toHaveLength(5)
    const covers = mine(step.cues, 'cover')
    expect(covers.map((c) => c.targetId)).toEqual(['a1', 'a2', 'a3', 'a4', 'a5'])
    for (const c of covers) expect(c.amount, c.targetId).toBe(Math.round(maxHpOf(s, c.targetId) * HERO_LIMIT_SUPPORT_SHARE * scaling(a) * RPG_SUPPORT_ALL))
  })

  it('Rampart Charge: one Greatsword charge on one foe, then a Barrier on every Uma', () => {
    const a = hero('paladin-3', 15)
    const s = fight(a, 15)
    const cues = fire(s, 'paladin-3').cues
    expect(hits(cues).map((c) => `${c.targetId}:${c.element}`)).toEqual(['f1:greatsword'])
    const covers = mine(cues, 'cover')
    expect(covers.map((c) => c.targetId)).toEqual(['a1', 'a2', 'a3', 'a4', 'a5'])
    for (const c of covers) expect(c.amount, c.targetId).toBe(Math.round(maxHpOf(s, c.targetId) * HERO_LIMIT_SUPPORT_SHARE * scaling(a) * RPG_SUPPORT_ALL))
  })

  it('Valkyrie Lances: four Lance hits at random foes, then the first fallen Uma rises at 25% × her scaling', () => {
    const a = hero('paladin-4', 15)
    const s = fight(a, 15)
    s.units.find((u) => u.id === 'a3')!.hp = 0
    s.units.find((u) => u.id === 'a4')!.hp = 0
    const cues = fire(s, 'paladin-4').cues
    expect(hits(cues).map((c) => c.element)).toEqual(['lance', 'lance', 'lance', 'lance'])
    const top = maxHpOf(s, 'a3')
    expect(mine(cues, 'heal')).toEqual([{ kind: 'heal', actorId: 'a1', targetId: 'a3', amount: Math.round(top * BATTLE_REVIVE_SHARE * scaling(a)), label: 'Revived' }])
  })
})

describe('a Limit Break’s support at its strength, and C3 (H56, §5)', () => {
  it('mends at half a Hero’s for a Learner at Bond 0; her Frost Sanctuary still cleanses and her Valkyrie Lances still revive', () => {
    const mends = (a: BattleAlly) => {
      const s = fight(a, 15)
      for (const u of s.units) if (u.side === 'ally') u.hp = 1
      return mine(fire(s, 'cleric-3').cues, 'heal').map((c) => c.amount!)
    }
    const full = mends(hero('cleric-3', 15)), half = mends(learner('cleric-3', 0, 15))
    expect(half).toHaveLength(5)
    half.forEach((n, i) => expect(Math.abs(2 * n - full[i]!)).toBeLessThanOrEqual(1))

    const sanctuary = fight(learner('cleric-4', 0, 15), 15)
    for (const u of sanctuary.units) if (u.side === 'ally') u.statuses.push({ kind: 'mark', stacks: 1, turns: 2 })
    expect(mine(fire(sanctuary, 'cleric-4').cues, 'status').filter((c) => c.label === 'mark cleansed')).toHaveLength(5)

    const lances = fight(learner('paladin-4', 0, 15), 15)
    lances.units.find((u) => u.id === 'a2')!.hp = 0
    const raised = mine(fire(lances, 'paladin-4').cues, 'heal')
    expect(raised.map((c) => [c.targetId, c.label])).toEqual([['a2', 'Revived']])
    // A revive's 25% is whole at any strength; only the mend and Barrier shares scale.
    expect(raised[0]!.amount).toBe(Math.round(maxHpOf(lances, 'a2') * BATTLE_REVIVE_SHARE * scaling(lances.input.allies[0]!)))
  })

  it('C3: a Mage Learner swings Arsenal Rush with her M.ATK from v15; its kinds still decide weaknesses', () => {
    // The same Mage in both fights, stats and all.
    const mage = member('a1', 'mage', 14, { inherits: [{ limit: 'brawler-1', bond: 10, from: 'x9' }] })
    expect(mage.stats.matk).toBeGreaterThan(mage.stats.atk)
    const rush = (version: V, a: BattleAlly) => hits(fire(fight(a, version), 'brawler-1').cues)
    const v14 = rush(14, mage), v15 = rush(15, mage)
    const total = (cues: Cue[]) => cues.reduce((n, c) => n + c.amount!, 0)
    expect(total(v15)).toBeGreaterThan(total(v14) * 1.2)
    for (const cues of [v14, v15]) {
      expect(cues.map((c) => c.element)).toEqual(['greatsword', 'axe', 'lance', 'bow', 'katana'])
      expect(cues.every((c) => c.channel === 'physical')).toBe(true)
      expect(cues.map((c) => c.weak)).toEqual([true, false, false, false, false])
    }
    // A Hero's own Limit Break keeps each kind's offense (C3 names inherited ones).
    const seated = { ...mage, inherits: undefined, hero: 'brawler-1' as const }
    expect(total(rush(15, seated))).toBe(total(rush(14, seated)))
  })
})
