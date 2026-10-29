// Engine v19's weapon shapes in a fight (H128; classes-v3.md §4.1, §4.2; CV12), built dark: every input here is
// `version: 19` against three identical foes. A volley strikes the tapped foe with its hits and every other foe with one
// plain splash hit (no rider, no special; it still chips a weak foe's shield); a double lands two hits on one foe; a
// lingering volley summon bids any summon's farewell; Auto counts the splash, so it aims a volley at a crowd.
import { describe, expect, it } from 'vitest'
import { rpgFoe } from '../campaign/enemies'
import { RPG_VOLLEY, rpgNode } from '../catalog'
import { projectRpgStats, rpgDefaultWeapons, rpgHand, type RpgClass, type RpgProfile, type RpgWeapon } from '../rules'
import { autoAction } from './auto'
import { applyBattleAction, battleActionsLeft, battleDamage, createBattle } from './engine'
import { battleNodeDef } from './skills'
import type { BattleAction, BattleAlly, BattleCue, BattleEnemy, BattleInput, BattleState, BattleStep } from './types'

const V19 = 19
/** An invented Uma of a class at engine v19: her defaults (or `weapons`), stats, `loadout` equipped. */
function member(id: string, classId: RpgClass, o: { weapons?: RpgWeapon[]; loadout?: string[]; level?: number } = {}): BattleAlly {
  const level = o.level ?? 20
  const weapons = o.weapons ?? rpgDefaultWeapons(classId, V19)
  const p: RpgProfile = { outfitId: id, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
    growthRates: { speed: 0.05, stamina: 0.05, power: 0.05, guts: 0.05, wit: 0.05 }, classId, weapons, tier: 1, level, exp: 0,
    tree: [], legacy: [], classRank: level }
  const stats = projectRpgStats(p, V19)
  const loadout = o.loadout ?? weapons.map((w) => `${classId}-${w}.1`)
  return { id, classId, weapons, tier: 1, level, stats, tree: [], legacy: [], loadout: loadout.map((n) => ({ tier: 1, id: n })), mp: stats.mp, classRank: level }
}
/** A sturdy foe that barely hurts, weak only to the Lance and Lightning (nothing these tests cast) unless named; the three
 * of a fight are identical. */
function foe(id: string, weaknesses: BattleEnemy['weaknesses'] = { weapons: ['lance'], elements: ['lightning'] }, hp = 1_000_000): BattleEnemy {
  const f = rpgFoe({ id, castId: `cast-${id}`, element: 'fire', role: 'striker', rank: 'regular', level: 20, shield: 10, weaknesses })
  return { ...f, stats: { ...f.stats, hp }, phaseTwo: undefined,
    moves: [{ id: 'poke', kind: 'damage', channel: 'physical', element: null, power: 1, label: 'Poke', target: 'front' }] }
}
const three = (weaknesses?: BattleEnemy['weaknesses']) => ['f1', 'f2', 'f3'].map((id) => foe(id, weaknesses))
const party = (a3: BattleAlly): BattleAlly[] => [member('a1', 'brawler'), member('a2', 'brawler'), a3, member('a4', 'brawler'), member('a5', 'brawler')]
const input = (a3: BattleAlly, enemies: BattleEnemy[] = three(), version: BattleInput['version'] = V19): BattleInput =>
  ({ version, seed: 1928, allies: party(a3), enemies })
const start = (i: BattleInput): BattleState => createBattle(i).state
const ok = (s: BattleState, action: BattleAction): BattleStep => {
  const step = applyBattleAction(s, action)
  expect(step.error, JSON.stringify(action)).toBeUndefined()
  return step
}
/** Her act, then everyone else guards so the foes move and the next round opens. */
function round(s: BattleState, action: BattleAction): { step: BattleStep; next: BattleState } {
  const step = ok(s, action)
  let next = step.state
  for (const u of next.units) {
    if (next.round !== s.round || next.outcome !== 'active') break
    if (u.side !== 'ally' || u.hp <= 0 || battleActionsLeft(next, u.id) <= 0) continue
    next = ok(next, { kind: 'guard', actorId: u.id, targetId: u.id === 'a1' ? 'a2' : 'a1' }).state
  }
  return { step, next }
}
type Hit = Extract<BattleCue, { kind: 'hit' }>
const hitsOf = (cues: readonly BattleCue[], actorId: string): Hit[] => cues.filter((c): c is Hit => c.kind === 'hit' && c.actorId === actorId)
const on = (hits: readonly Hit[], targetId: string) => hits.filter((h) => h.targetId === targetId)
const unitOf = (s: BattleState, id: string) => s.units.find((u) => u.id === id)!
const stacksOf = (s: BattleState, id: string, kind: string) => unitOf(s, id).statuses.find((x) => x.kind === kind)?.stacks ?? 0
const ref = (id: string) => ({ tier: 1, id })
const skill = (id: string, targetId = 'f1'): BattleAction => ({ kind: 'skill', actorId: 'a3', targetId, skill: ref(id) })

describe('engine v19: the volley (CV12)', () => {
  it('lands a Sorcerer\'s Noxaga on the tapped foe and one splash hit on each other foe, worth 0.35 ÷ 0.8 of her hits', () => {
    const a3 = member('a3', 'mage', { weapons: ['tome-dark', 'tome-fire', 'tome-ice'], loadout: ['mage-tome-dark.3'], level: 25 })
    const s = start(input(a3))
    const hits = hitsOf(ok(s, skill('mage-tome-dark.3')).cues, 'a3')
    const def = battleNodeDef(a3, rpgNode('mage-tome-dark.3')!, V19)
    const tome = rpgHand(a3, V19).tome
    expect(def.hits).toHaveLength(2)
    expect(on(hits, 'f1')).toHaveLength(2)
    expect([on(hits, 'f2').length, on(hits, 'f3').length]).toEqual([1, 1])
    // As the engine rounds: each hit and the splash at their own power, the splash plain.
    const amount = (target: string, power: number) => battleDamage(s, unitOf(s, 'a3'), unitOf(s, target), 'magical', power * tome, 'dark').amount
    expect(on(hits, 'f1').map((h) => h.amount)).toEqual(def.hits.map((h) => amount('f1', h.power)))
    const splash = amount('f2', def.splash!.power)
    expect([on(hits, 'f2')[0]!.amount, on(hits, 'f3')[0]!.amount]).toEqual([splash, splash])
    const total = on(hits, 'f1').reduce((n, h) => n + h.amount, 0)
    expect(Math.abs(splash - total * (RPG_VOLLEY.splash / RPG_VOLLEY.target))).toBeLessThanOrEqual(1)
    // The splash comes after her hits, one foe at a time.
    expect(hits.map((h) => h.targetId)).toEqual(['f1', 'f1', 'f2', 'f3'])
  })

  it('puts a depth-5 Bow volley\'s Armor Break 2 on the tapped foe only', () => {
    const a3 = member('a3', 'brawler', { weapons: ['bow', 'greatsword', 'axe'], loadout: ['brawler-bow.5'], level: 45 })
    const step = ok(start(input(a3)), skill('brawler-bow.5', 'f2'))
    const hits = hitsOf(step.cues, 'a3')
    expect([on(hits, 'f2').length, on(hits, 'f1').length, on(hits, 'f3').length]).toEqual([3, 1, 1])
    expect(['f1', 'f2', 'f3'].map((id) => stacksOf(step.state, id, 'armor-break'))).toEqual([0, 2, 0])
    const statuses = step.cues.flatMap((c) => (c.kind === 'status' && c.actorId === 'a3' ? [c.targetId] : []))
    expect(statuses).toEqual(['f2'])
  })

  it('counts a Black Hole\'s ×1.3 below half HP on the tapped foe only', () => {
    const a3 = member('a3', 'mage', { weapons: ['tome-dark', 'tome-fire', 'tome-ice'], loadout: ['mage-tome-dark.5'], level: 45 })
    const s = start(input(a3))
    for (const id of ['f1', 'f2', 'f3']) unitOf(s, id).hp = 400_000
    const hits = hitsOf(ok(s, skill('mage-tome-dark.5')).cues, 'a3')
    const def = battleNodeDef(a3, rpgNode('mage-tome-dark.5')!, V19)
    expect(def.special).toBe('vs-wounded')
    const tome = rpgHand(a3, V19).tome
    const amount = (target: string, power: number, wounded: boolean) =>
      battleDamage(s, unitOf(s, 'a3'), unitOf(s, target), 'magical', power * tome, 'dark', wounded ? { special: 'vs-wounded' } : {}).amount
    expect(on(hits, 'f1').map((h) => h.amount)).toEqual(def.hits.map((h) => amount('f1', h.power, true)))
    expect(on(hits, 'f1')[0]!.amount).toBeGreaterThan(amount('f1', def.hits[0]!.power, false))
    for (const id of ['f2', 'f3']) {
      expect(on(hits, id).map((h) => h.amount), id).toEqual([amount(id, def.splash!.power, false)])
      expect(on(hits, id)[0]!.amount).toBeLessThan(amount(id, def.splash!.power, true))
    }
  })

  it('chips one shield point off a foe weak to the splash, as any weak hit', () => {
    const a3 = member('a3', 'mage', { weapons: ['tome-dark', 'tome-fire', 'tome-ice'], loadout: ['mage-tome-dark.1'] })
    const s = start(input(a3, three({ weapons: ['lance'], elements: ['dark'] })))
    const before = ['f1', 'f2', 'f3'].map((id) => unitOf(s, id).shield)
    const step = ok(s, skill('mage-tome-dark.1'))
    expect(hitsOf(step.cues, 'a3').map((h) => [h.targetId, h.weak])).toEqual([['f1', true], ['f2', true], ['f3', true]])
    expect(['f1', 'f2', 'f3'].map((id) => unitOf(step.state, id).shield)).toEqual(before.map((n) => n - 1))
  })
})

describe('engine v19: the double (CV12)', () => {
  it('lands a Sorcerer\'s Luxaga as two hits on one foe (four at v18)', () => {
    const a3 = member('a3', 'mage', { weapons: ['tome-light', 'tome-fire', 'tome-ice'], loadout: ['mage-tome-light.3'], level: 25 })
    const hits = hitsOf(ok(start(input(a3)), skill('mage-tome-light.3')).cues, 'a3')
    expect(hits.map((h) => [h.targetId, h.element])).toEqual([['f1', 'light'], ['f1', 'light']])
    const v18 = hitsOf(ok(start(input(a3, three(), 18)), skill('mage-tome-light.3')).cues, 'a3')
    expect(v18.map((h) => h.targetId)).toEqual(['f1', 'f1', 'f1', 'f1'])
  })
})

describe('engine v19: a lingering volley summon', () => {
  it('bids an Arms Summoner\'s Slinger farewell with one hit on every foe as her next pair comes', () => {
    const as = member('a3', 'armsummoner', { loadout: ['armsummoner-bow.1', 'armsummoner-axe.1', 'armsummoner-tome-dark.1'] })
    expect(as.weapons).toEqual(['bow', 'axe', 'tome-dark'])
    const s = start(input(as))
    const pair: BattleAction = { kind: 'skill', actorId: 'a3', targetId: 'f1', skill: ref('armsummoner-bow.1'), pair: { skill: ref('armsummoner-tome-dark.1') } }
    const { step, next } = round(s, pair)
    // Her Bow volley leads, then her Dark volley: each on f1 and a splash on f2 and f3.
    expect(hitsOf(step.cues, 'a3').map((h) => [h.element, h.targetId])).toEqual([['bow', 'f1'], ['bow', 'f2'], ['bow', 'f3'],
      ['dark', 'f1'], ['dark', 'f2'], ['dark', 'f3']])
    expect(step.state.summons).toEqual([{ allyId: 'a3', ref: ref('armsummoner-bow.1'), scale: 0.3 }])
    const again = ok(next, { ...pair, targetId: 'f2' })
    expect(again.cues[0]).toMatchObject({ kind: 'summon', actorId: 'a3', label: 'Slinger' })
    const farewell = again.cues.slice(1, 4)
    expect(farewell.map((c) => [c.kind, (c as Hit).element, (c as Hit).targetId])).toEqual([['hit', 'bow', 'f1'], ['hit', 'bow', 'f2'], ['hit', 'bow', 'f3']])
    expect(again.cues[4]).toMatchObject({ kind: 'hit', element: 'bow', targetId: 'f2' })
  })
})

describe('engine v19: Auto counts the splash', () => {
  const sorcerer = () => member('a3', 'mage', { weapons: ['tome-dark', 'tome-fire', 'tome-ice'], loadout: ['mage-tome-dark.1', 'mage-tome-fire.1'] })

  it('prefers a Sorcerer\'s Nox (0.8 + 0.35) to her Fire (1.0) on two foes weak to neither, and the Fire on one', () => {
    const two = start(input(sorcerer(), three().slice(0, 2)))
    expect(autoAction(two, 'a3')).toMatchObject({ kind: 'skill', skill: ref('mage-tome-dark.1') })
    const one = start(input(sorcerer(), three().slice(0, 1)))
    expect(autoAction(one, 'a3')).toMatchObject({ kind: 'skill', skill: ref('mage-tome-fire.1') })
    // Two foes standing of three count as two.
    const thinned = start(input(sorcerer()))
    unitOf(thinned, 'f3').hp = 0
    expect(autoAction(thinned, 'a3')).toMatchObject({ kind: 'skill', skill: ref('mage-tome-dark.1') })
  })
})
