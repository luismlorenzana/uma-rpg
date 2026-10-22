// Engine v15's hands, built dark (H55, D183; classes-v2 §3.1–§3.2): each half at its own power, the leading half first,
// the Spell Blade's extra Arms hit, and the Summoner's mirrored pair with her lingering Tome summon's farewell on every
// foe. Nothing starts a v15 fight until H61; v6–v14 act as before, which `v14-replays*.test.ts` prove.
import { describe, expect, it } from 'vitest'
import { rpgFoe } from '../campaign/enemies'
import { RPG_ALL_NODES, rpgNode, type RpgSkillDef } from '../catalog'
import { learnRpgNode, projectRpgStats, rpgDefaultWeapons, rpgHand, type RpgClass, type RpgProfile, type RpgWeapon } from '../rules'
import { regionChapter, worldContinent } from '../../world/world'
import { autoAction } from './auto'
import { applyBattleAction, battleActionsLeft, battleDamage, battleExtraHit, createBattle } from './engine'
import { BATTLE_FAREWELL_FACTOR } from './skills'
import type { BattleAction, BattleAlly, BattleCue, BattleEnemy, BattleInput, BattleState, BattleStep } from './types'

type Version = 14 | 15
/** The v15 hybrids' hands (H60 set them: D186). */
const SB = rpgHand({ classId: 'spellblade' }, 15), SU = rpgHand({ classId: 'summoner' }, 15)
/** An invented Uma of a class, built by the fight's generation: her spread, her stats, her side skills and loadout. */
function member(id: string, classId: RpgClass, version: Version, options: { sides?: string[]; loadout?: string[]; weapons?: RpgWeapon[]; level?: number } = {}): BattleAlly {
  const level = options.level ?? 20
  const weapons = options.weapons ?? rpgDefaultWeapons(classId, version)
  let p: RpgProfile = { outfitId: id, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
    growthRates: { speed: 0.05, stamina: 0.05, power: 0.05, guts: 0.05, wit: 0.05 }, classId, weapons, tier: 1, level, exp: 0,
    tree: [], legacy: [], classRank: level }
  p = (options.sides ?? []).reduce(learnRpgNode, p)
  const stats = projectRpgStats(p, version)
  const loadout = options.loadout ?? weapons.slice(0, 3).map((w) => `${classId}-${w}.1`)
  return { id, classId, weapons, tier: 1, level, stats, tree: p.tree, legacy: [], loadout: loadout.map((n) => ({ tier: 1, id: n })),
    mp: stats.mp, classRank: level }
}
const BLADE: RpgWeapon[] = ['greatsword', 'lance', 'bow', 'tome-fire', 'tome-lightning']
const CALLER: RpgWeapon[] = ['tome-fire', 'tome-ice', 'tome-lightning', 'greatsword', 'bow']
const blade = (version: Version = 15, options: Parameters<typeof member>[3] = {}) =>
  member('a3', 'spellblade', version, { weapons: BLADE, loadout: ['spellblade-greatsword.1', 'spellblade-lance.1', 'spellblade-tome-fire.1', 'spellblade-tome-lightning.1'], ...options })
const caller = (options: Parameters<typeof member>[3] = {}) =>
  member('a5', 'summoner', 15, { weapons: CALLER, loadout: ['summoner-tome-fire.1', 'summoner-greatsword.1', 'summoner-tome-lightning.1', 'summoner-tome-ice.1'], ...options })
/** A Brawler, a Mage, the Spell Blade, a fourth and the Summoner (or a second Mage); legal in v14 and v15 alike. */
function party(version: Version, a3 = blade(version), a5?: BattleAlly, a4?: BattleAlly): BattleAlly[] {
  return [member('a1', 'brawler', version), member('a2', 'mage', version), a3, a4 ?? member('a4', 'brawler', version), a5 ?? member('a5', 'mage', version)]
}
/** A sturdy foe that barely hurts: one weak poke, no guards, no second phase, so a round changes nothing but the hits. */
function foe(id: string, weaknesses: BattleEnemy['weaknesses'], shield = 10, hp = 1_000_000): BattleEnemy {
  const f = rpgFoe({ id, castId: `cast-${id}`, element: 'dark', role: 'striker', rank: 'regular', level: 20, shield, weaknesses })
  return { ...f, stats: { ...f.stats, hp }, phaseTwo: undefined,
    moves: [{ id: 'poke', kind: 'damage', channel: 'physical', element: null, power: 1, label: 'Poke', target: 'front' }] }
}
const WEAK = { weapons: ['greatsword' as const], elements: ['fire' as const] }
const input = (version: Version, allies: BattleAlly[], enemies: BattleEnemy[], waves?: BattleEnemy[][]): BattleInput =>
  ({ version, seed: 1555, allies, enemies, ...(waves ? { waves } : {}) })
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
const unitOf = (s: BattleState, id: string) => s.units.find((u) => u.id === id)!
const ref = (id: string) => ({ tier: 1, id })
const total = (def: Pick<RpgSkillDef, 'hits'>) => def.hits.reduce((sum, h) => sum + h.power, 0)

describe('engine v15: the Spell Blade, 70/30 with an extra Arms hit (classes-v2 §3.1, D183)', () => {
  it('lands an Attack pair as two Arms hits and one Tome hit: three shield points, at her v15 Arms and Tome hands of v14’s 0.45', () => {
    // The same Uma, stats and all, in a v14 fight and a v15 fight; her offense high so rounding stays small.
    const a3 = (version: Version) => { const a = blade(version); return { ...a, stats: { ...a.stats, atk: 2000, matk: 2000 } } }
    const pair: BattleAction = { kind: 'attack', actorId: 'a3', targetId: 'f1', weapon: 'greatsword', pair: { weapon: 'tome-fire' } }
    const v14 = ok(start(input(14, party(14, a3(15)), [foe('f1', WEAK)])), pair)
    const s15 = start(input(15, party(15, a3(15)), [foe('f1', WEAK)]))
    const v15 = ok(s15, pair)
    expect(hitsOf(v14.cues, 'a3').map((c) => c.element)).toEqual(['greatsword', 'fire'])
    expect(hitsOf(v15.cues, 'a3').map((c) => [c.element, c.weak])).toEqual([['greatsword', true], ['greatsword', true], ['fire', true]])
    expect(v15.cues.flatMap((c) => (c.kind === 'shield' ? [c.amount] : []))).toEqual([9, 8, 7])
    expect(unitOf(v15.state, 'f1').shield).toBe(7)
    const sum = (cues: Hit[], element: string) => cues.filter((c) => c.element === element).reduce((n, c) => n + c.amount, 0)
    expect(sum(hitsOf(v15.cues, 'a3'), 'greatsword') / sum(hitsOf(v14.cues, 'a3'), 'greatsword')).toBeCloseTo(SB.arms / 0.45, 2)
    expect(sum(hitsOf(v15.cues, 'a3'), 'fire') / sum(hitsOf(v14.cues, 'a3'), 'fire')).toBeCloseTo(SB.tome / 0.45, 2)
    // Each Arms hit is exactly half the Attack's power at her Arms hand.
    const each = battleDamage(s15, unitOf(s15, 'a3'), unitOf(s15, 'f1'), 'physical', 0.5 * 1 * SB.arms, 'greatsword').amount
    expect(hitsOf(v15.cues, 'a3').slice(0, 2).map((c) => c.amount)).toEqual([each, each])
  })

  it('lands an n-hit Arms skill as n + 1 hits with the same total; her Tome skill as it was', () => {
    const s = start(input(15, party(15), [foe('f1', { weapons: ['axe'], elements: ['ice'] })]))
    const lance = rpgNode('spellblade-lance.1')!.skill
    const fire = rpgNode('spellblade-tome-fire.1')!.skill
    const step = ok(s, { kind: 'skill', actorId: 'a3', targetId: 'f1', skill: ref('spellblade-lance.1'), pair: { skill: ref('spellblade-tome-fire.1') } })
    const hits = hitsOf(step.cues, 'a3')
    expect(hits.map((c) => c.element)).toEqual([...Array(lance.hits.length + 1).fill('lance'), ...Array(fire.hits.length).fill('fire')])
    const whole = battleDamage(s, unitOf(s, 'a3'), unitOf(s, 'f1'), 'physical', total(lance) * SB.arms, 'lance').amount
    const arms = hits.filter((c) => c.element === 'lance').reduce((n, c) => n + c.amount, 0)
    expect(Math.abs(arms - whole)).toBeLessThanOrEqual(lance.hits.length + 1)
  })

  it('battleExtraHit adds a copy of the last hit and keeps the total, whatever the hits; it leaves the rest alone', () => {
    const def: RpgSkillDef = { target: 'one', mp: 10, primary: 'bow', rider: { status: 'shock', stacks: 1, per: 'hit' },
      hits: [{ power: 1, parts: [{ kind: 'bow', share: 1 }] }, { power: 2, parts: [{ kind: 'bow', share: 0.5 }, { kind: 'light', share: 0.5 }] },
        { power: 3, parts: [{ kind: 'katana', share: 1 }] }],
      focus: [{ power: 0.5, parts: [{ kind: 'bow', share: 1 }] }] }
    const out = battleExtraHit(def)
    expect(out.hits).toHaveLength(4)
    expect(total(out)).toBeCloseTo(6, 10)
    expect(out.hits.map((h) => h.power)).toEqual([1, 2, 3, 3].map((p) => (p * 6) / 9))
    expect(out.hits[3]!.parts).toEqual(def.hits[2]!.parts)
    expect({ ...out, hits: def.hits }).toEqual(def)
    expect(def.hits).toHaveLength(3)
    // An Attack: two hits at half its power.
    expect(battleExtraHit({ hits: [{ power: 1, parts: [{ kind: 'axe', share: 1 }] }] }).hits.map((h) => h.power)).toEqual([0.5, 0.5])
  })

  it('lands a per-hit rider on the extra hit too', () => {
    // No Spell Blade node carries a per-hit rider today: give her Lance core one for this case.
    const skill = rpgNode('spellblade-lance.1')!.skill
    const n = skill.hits.length
    skill.rider = { status: 'shock', stacks: 1, per: 'hit' }
    try {
      const step = ok(start(input(15, party(15), [foe('f1', WEAK)])),
        { kind: 'skill', actorId: 'a3', targetId: 'f1', skill: ref('spellblade-lance.1'), pair: { weapon: 'tome-fire' } })
      expect(step.cues.filter((c) => c.kind === 'status' && c.actorId === 'a3' && c.label === 'shock')).toHaveLength(n + 1)
    } finally {
      delete skill.rider
    }
  })

  it('resolves her Arms half first whatever order the action names, from v15 only', () => {
    const s = (version: Version) => start(input(version, party(version), [foe('f1', WEAK), foe('f2', WEAK)]))
    const armsFirst: BattleAction = { kind: 'skill', actorId: 'a3', targetId: 'f1', skill: ref('spellblade-lance.1'), pair: { skill: ref('spellblade-tome-lightning.1') } }
    const tomeFirst: BattleAction = { kind: 'skill', actorId: 'a3', targetId: 'f1', skill: ref('spellblade-tome-lightning.1'), pair: { skill: ref('spellblade-lance.1') } }
    const a = ok(s(15), armsFirst), b = ok(s(15), tomeFirst)
    expect(b.cues).toEqual(a.cues)
    expect(b.hash).toBe(a.hash)
    expect(hitsOf(a.cues, 'a3')[0]!.element).toBe('lance')
    // v14 resolves them as named.
    expect(hitsOf(ok(s(14), tomeFirst).cues, 'a3')[0]!.element).toBe('lightning')
  })
})

describe('engine v15: the Summoner, the Spell Blade’s mirror (classes-v2 §3.2, D183)', () => {
  const three = () => [foe('f1', WEAK), foe('f2', WEAK), foe('f3', { weapons: ['axe'], elements: ['ice'] })]
  const s0 = (a5 = caller(), enemies = three(), waves?: BattleEnemy[][]) => start(input(15, party(15, blade(15), a5), enemies, waves))
  const pair = (tome: string | RpgWeapon, arms: string | RpgWeapon, targetId = 'f1'): BattleAction => {
    const half = (x: string) => (x.includes('.') ? { skill: ref(x) } : { weapon: x as RpgWeapon })
    const lead = half(tome)
    return lead.skill ? { kind: 'skill', actorId: 'a5', targetId, skill: lead.skill, pair: half(arms) }
      : { kind: 'attack', actorId: 'a5', targetId, weapon: lead.weapon, pair: half(arms) }
  }

  it('always acts in a pair, one Tome half and one Arms half', () => {
    const s = s0()
    expect(applyBattleAction(s, { kind: 'skill', actorId: 'a5', targetId: 'f1', skill: ref('summoner-tome-fire.1') }).error).toBe('invalid-skill')
    expect(applyBattleAction(s, { kind: 'attack', actorId: 'a5', targetId: 'f1', weapon: 'tome-fire' }).error).toBe('invalid-skill')
    expect(applyBattleAction(s, pair('summoner-tome-fire.1', 'summoner-tome-ice.1')).error).toBe('invalid-skill')
    expect(applyBattleAction(s, pair('summoner-greatsword.1', 'bow')).error).toBe('invalid-skill')
    // MP is the halves' sum, ×0.5 a half.
    const step = ok(s, pair('summoner-tome-fire.1', 'summoner-greatsword.1'))
    const mp = (id: string) => Math.max(1, Math.round(rpgNode(id)!.skill.mp * 0.5))
    expect(unitOf(s, 'a5').mp - unitOf(step.state, 'a5').mp).toBe(mp('summoner-tome-fire.1') + mp('summoner-greatsword.1'))
  })

  it('casts her Tome summon first at her Tome hand, then her Arms summon at her Arms hand, and only the Tome summon lingers', () => {
    const s = s0()
    // Named Arms first: the Tome half still leads.
    const step = ok(s, pair('summoner-greatsword.1', 'summoner-tome-fire.1'))
    expect(step.cues.some((c) => c.kind === 'summon')).toBe(false)
    const hits = hitsOf(step.cues, 'a5')
    expect(hits.map((c) => c.element)).toEqual(['fire', 'greatsword'])
    const a5 = unitOf(s, 'a5'), f1 = unitOf(s, 'f1')
    const fire = rpgNode('summoner-tome-fire.1')!.skill.hits[0]!.power, sword = rpgNode('summoner-greatsword.1')!.skill.hits[0]!.power
    expect(hits[0]!.amount).toBe(battleDamage(s, a5, f1, 'magical', fire * 1 * SU.tome, 'fire').amount)
    expect(hits[1]!.amount).toBe(battleDamage(s, a5, f1, 'physical', sword * 1 * SU.arms, 'greatsword').amount)
    expect(step.state.summons).toEqual([{ allyId: 'a5', ref: ref('summoner-tome-fire.1'), scale: 0.3 }])
    expect(ok(s, pair('summoner-tome-fire.1', 'summoner-greatsword.1')).cues).toEqual(step.cues)
  })

  it('leads with a random-target Tome summon on the same seed whichever half is named first', () => {
    const s = s0()
    const a = ok(s, pair('summoner-tome-lightning.1', 'summoner-greatsword.1'))
    const b = ok(s, { kind: 'skill', actorId: 'a5', targetId: 'f1', skill: ref('summoner-greatsword.1'), pair: { skill: ref('summoner-tome-lightning.1') } })
    expect(b.cues).toEqual(a.cues)
    expect(b.hash).toBe(a.hash)
    expect(hitsOf(a.cues, 'a5')[0]!.element).toBe('lightning')
  })

  it('opens her next pair with the farewell: one strike on each living foe at its linger share, then the arrivals', () => {
    const first = round(s0(), pair('summoner-tome-fire.1', 'summoner-greatsword.1')).next
    expect(first.round).toBe(2)
    expect(first.summons).toHaveLength(1)
    // A foe guarding another: the farewell is never intercepted.
    unitOf(first, 'f2').guardingFor = 'f1'
    const step = ok(first, pair('summoner-tome-lightning.1', 'summoner-greatsword.1', 'f3'))
    expect(step.cues[0]).toEqual({ kind: 'summon', actorId: 'a5', targetId: 'f3', label: 'Ember Sprites' })
    const hits = hitsOf(step.cues, 'a5')
    const farewell = hits.slice(0, 3)
    expect(farewell.map((c) => [c.targetId, c.element, c.label])).toEqual([['f1', 'fire', undefined], ['f2', 'fire', undefined], ['f3', 'fire', undefined]])
    // One hit of the summon's kind at linger × its hits' power × the factor; weak foes chip a point.
    const power = total(rpgNode('summoner-tome-fire.1')!.skill) * 1 * (0.3 * BATTLE_FAREWELL_FACTOR)
    for (const id of ['f1', 'f2', 'f3']) {
      expect(farewell.find((c) => c.targetId === id)!.amount).toBe(battleDamage(first, unitOf(first, 'a5'), unitOf(first, id), 'magical', power, 'fire').amount)
    }
    expect(farewell.map((c) => c.weak)).toEqual([true, true, false])
    expect(step.cues.flatMap((c) => (c.kind === 'shield' ? [c.targetId] : [])).slice(0, 2)).toEqual(['f1', 'f2'])
    // Then the arrivals: the Lightning summon, then the Greatsword summon; the Lightning one lingers.
    expect(hits.slice(3).map((c) => c.element)).toEqual([...Array(rpgNode('summoner-tome-lightning.1')!.skill.hits.length).fill('lightning'), 'greatsword'])
    expect(step.state.summons).toEqual([{ allyId: 'a5', ref: ref('summoner-tome-lightning.1'), scale: 0.3 }])
  })

  it('says a Bonded summon’s farewell at 0.4', () => {
    const a5 = caller({ sides: ['summoner-tome-fire.1b'], loadout: ['summoner-tome-fire.1b', 'summoner-greatsword.1'] })
    const first = round(s0(a5), pair('summoner-tome-fire.1b', 'summoner-greatsword.1')).next
    expect(first.summons).toEqual([{ allyId: 'a5', ref: ref('summoner-tome-fire.1b'), scale: 0.4 }])
    const step = ok(first, pair('tome-fire', 'greatsword'))
    expect(step.cues[0]).toMatchObject({ kind: 'summon', label: 'Bonded Ember Sprites' })
    const power = total(rpgNode('summoner-tome-fire.1b')!.skill) * 1 * (0.4 * BATTLE_FAREWELL_FACTOR)
    expect(hitsOf(step.cues, 'a5')[0]!.amount).toBe(battleDamage(first, unitOf(first, 'a5'), unitOf(first, 'f1'), 'magical', power, 'fire').amount)
  })

  it('leaves nothing lingering after a Tome Attack, and an Arms summon never lingers', () => {
    const first = round(s0(), pair('summoner-tome-fire.1', 'summoner-greatsword.1')).next
    const step = ok(first, pair('tome-fire', 'summoner-greatsword.1'))
    expect(step.cues[0]).toMatchObject({ kind: 'summon', label: 'Ember Sprites' })
    expect(hitsOf(step.cues, 'a5').slice(3).map((c) => c.element)).toEqual(['fire', 'greatsword'])
    expect(step.state.summons).toEqual([])
    // With nothing lingering, the next pair has no farewell.
    const after = round(first, pair('tome-fire', 'summoner-greatsword.1')).next
    expect(ok(after, pair('tome-fire', 'bow')).cues.some((c) => c.kind === 'summon')).toBe(false)
  })

  it('keeps her summon lingering through a Limit Break or a Guard, for her next pair', () => {
    const a5 = { ...caller(), hero: 'summoner-1' as const }
    const first = round(s0(a5), pair('summoner-tome-fire.1', 'summoner-greatsword.1')).next
    unitOf(first, 'a5').limit = 12
    const limit = round(first, { kind: 'limit', actorId: 'a5', targetId: 'f1' })
    expect(limit.step.cues.some((c) => c.kind === 'limit')).toBe(true)
    expect(limit.step.cues.some((c) => c.kind === 'summon')).toBe(false)
    expect(limit.next.summons).toEqual(first.summons)
    const guard = round(limit.next, { kind: 'guard', actorId: 'a5', targetId: 'a1' }).next
    expect(guard.summons).toEqual(first.summons)
    expect(ok(guard, pair('tome-fire', 'bow')).cues[0]).toMatchObject({ kind: 'summon', label: 'Ember Sprites' })
  })

  it('says farewell to the next wave’s foes', () => {
    const waves = [[foe('w1', WEAK), foe('w2', WEAK)]]
    // Her Tome summon fells the first wave's only foe and lingers into the next.
    const s = s0(caller(), [foe('f1', WEAK, 10, 1)], waves)
    const first = ok(s, pair('summoner-tome-fire.1', 'summoner-greatsword.1'))
    expect(first.state.wave).toBe(1)
    expect(first.state.summons).toHaveLength(1)
    const step = ok(first.state, pair('tome-fire', 'bow', 'w2'))
    expect(step.cues[0]).toMatchObject({ kind: 'summon', label: 'Ember Sprites' })
    expect(hitsOf(step.cues, 'a5').slice(0, 2).map((c) => [c.targetId, c.element])).toEqual([['w1', 'fire'], ['w2', 'fire']])
  })

  it('takes her summon away when she falls, so a revive brings back no farewell', () => {
    const first = round(s0(), pair('summoner-tome-fire.1', 'summoner-greatsword.1')).next
    unitOf(first, 'a5').hp = 0
    const down = ok(first, { kind: 'guard', actorId: 'a1', targetId: 'a2' }).state
    expect(down.summons).toEqual([])
    // Raised again (as a revive would), her next pair opens with no farewell.
    unitOf(down, 'a5').hp = 100
    expect(ok(down, pair('tome-fire', 'bow')).cues.some((c) => c.kind === 'summon')).toBe(false)
  })

  it('names the Greatsword line’s depth-3 summon by the live generation: still "Paladin" until the switch', () => {
    expect(['summoner-greatsword.3', 'summoner-greatsword.3a', 'summoner-greatsword.3b'].map((id) => rpgNode(id)!.name))
      .toEqual(['Paladin', 'Paladin Pack', 'Bonded Paladin'])
  })

  // H56 moved every support to `support15`, which no Summoner node has (D181); H55 landed second and turns this on.
  it('heals, shields, drains, blesses or revives nothing with any Summoner skill in v15: arriving, saying farewell or at the round’s end', () => {
    const TOMES: RpgWeapon[] = ['tome-fire', 'tome-ice', 'tome-lightning', 'tome-light', 'tome-dark']
    const ARMS: RpgWeapon[] = ['greatsword', 'axe', 'lance', 'bow', 'katana']
    const nodes = RPG_ALL_NODES.filter((n) => n.classId === 'summoner')
    expect(nodes).toHaveLength(150)
    for (const node of nodes) {
      const tome = node.weapon.startsWith('tome-')
      const weapons = tome ? [node.weapon, ...TOMES.filter((w) => w !== node.weapon).slice(0, 2), 'greatsword', 'bow'] as RpgWeapon[]
        : ['tome-fire', 'tome-ice', 'tome-light', node.weapon, ARMS.find((w) => w !== node.weapon)!] as RpgWeapon[]
      const a5 = member('a5', 'summoner', 15, { level: 50, weapons, sides: node.variant ? [node.id] : [], loadout: [node.id] })
      const s = s0(a5, [foe('f1', WEAK), foe('f2', WEAK)])
      // A hurt party with a fallen Uma, and this summon lingering, so its farewell runs too.
      for (const u of s.units) if (u.side === 'ally' && u.id !== 'a5') u.hp = Math.ceil(u.hp / 2)
      unitOf(s, 'a4').hp = 0
      s.summons = [{ allyId: 'a5', ref: ref(node.id), scale: 0.3 }]
      const [lead, other] = [weapons[0]!, weapons[4]!]
      const { step, next } = round(s, tome ? pair(node.id, other) : pair(lead, node.id))
      // Her next pair: the farewell of a Tome summon that arrived above.
      const cues = [...step.cues, ...ok(next, pair(lead, other)).cues]
      const support = cues.filter((c) => c.kind !== 'result' && c.actorId === 'a5' && (c.kind === 'heal' || c.kind === 'cover' ||
        (c.kind === 'status' && unitOf(next, c.targetId).side === 'ally')))
      expect(support, node.id).toEqual([])
      expect(unitOf(next, 'a4').hp, node.id).toBe(0)
    }
  })
})

describe('engine v15: Auto with the hybrids’ hands (D183)', () => {
  it('plays a world stage to its end with a Summoner and a Spell Blade, every act accepted and every Summoner act a pair', () => {
    const cast = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))
    const node = regionChapter(worldContinent({ name: 'Sim', order: 2 }).regions[0]!, cast).nodes.filter((n) => n.kind !== 'camp').at(-1)!
    const level = node.level
    const learner = (classId: RpgClass) => ({ inherits: [{ limit: `${classId}-1` as const, bond: 5, from: `hero-${classId}` }] })
    const allies: BattleAlly[] = [
      { ...member('a1', 'brawler', 15, { level }), ...learner('brawler') },
      { ...member('a2', 'mage', 15, { level }), ...learner('mage') },
      { ...member('a3', 'spellblade', 15, { level }), ...learner('spellblade') },
      { ...member('a4', 'cleric', 15, { level }), ...learner('cleric') },
      { ...member('a5', 'summoner', 15, { level }), ...learner('summoner') },
    ]
    let step = createBattle({ version: 15, seed: 9155, allies, enemies: node.enemies, ...(node.waves?.length ? { waves: node.waves } : {}) })
    const acts: BattleAction[] = []
    const cues: BattleCue[] = []
    for (let n = 0; n < 800 && step.state.outcome === 'active'; n++) {
      const actor = step.state.units.find((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(step.state, u.id) > 0)
      if (!actor) break
      const action = autoAction(step.state, actor.id)
      step = applyBattleAction(step.state, action)
      expect(step.error, JSON.stringify(action)).toBeUndefined()
      acts.push(action)
      cues.push(...step.cues)
    }
    expect(step.state.outcome).toBe('victory')
    const theirs = (id: string) => acts.filter((a) => a.actorId === id)
    expect(theirs('a5').length).toBeGreaterThan(2)
    expect(theirs('a5').every((a) => a.kind === 'limit' || (a.kind !== 'guard' && a.pair !== undefined))).toBe(true)
    // Her Tome half leads; the Spell Blade still pairs with her Arms half first.
    const isTome = (a: BattleAction) => a.kind === 'skill' ? rpgNode(a.skill.id)!.weapon.startsWith('tome-') : a.kind === 'attack' && !!a.weapon?.startsWith('tome-')
    expect(theirs('a5').filter((a) => a.kind !== 'limit').every(isTome)).toBe(true)
    expect(theirs('a3').filter((a) => a.kind !== 'limit').every((a) => a.kind !== 'guard' && a.pair !== undefined && !isTome(a))).toBe(true)
    expect(cues.some((c) => c.kind === 'summon' && c.actorId === 'a5')).toBe(true)
  })
})

describe('engine v15: the guard rail with the new hands (classes-v2 §3.1, D176, D183)', () => {
  /** A Duel-like foe weak to every kind, her shield at the engine's cap, HP no act can take. */
  const rail = (): BattleEnemy => foe('f1', { weapons: ['greatsword', 'axe', 'lance', 'bow', 'katana'], elements: ['fire', 'ice', 'lightning', 'light', 'dark'] },
    20, 10_000_000)
  const chips = (a: BattleAlly, action: BattleAction, setup?: (s: BattleState) => void): number => {
    const allies = party(15, a.id === 'a3' ? a : blade(15), a.id === 'a5' ? a : undefined)
    const s = start({ version: 15, seed: 7, allies, enemies: [rail()] })
    setup?.(s)
    return 20 - unitOf(ok(s, action).state, 'f1').shield
  }

  it('the Spell Blade’s Bow flurry (5 + 1 hits) with her Light flurry (5) chips 11', () => {
    const a3 = member('a3', 'spellblade', 15, { level: 50, weapons: ['bow', 'greatsword', 'lance', 'tome-light', 'tome-fire'],
      sides: ['spellblade-bow.5b', 'spellblade-tome-light.5b'], loadout: ['spellblade-bow.5b', 'spellblade-tome-light.5b'] })
    expect(rpgNode('spellblade-bow.5b')!.skill.hits).toHaveLength(5)
    expect(chips(a3, { kind: 'skill', actorId: 'a3', targetId: 'f1', skill: ref('spellblade-bow.5b'), pair: { skill: ref('spellblade-tome-light.5b') } })).toBe(11)
  })

  it('the Summoner’s lingering Light Pack farewell (1), Light Pack (5) and Bow Pack (5) chip 11', () => {
    const a5 = member('a5', 'summoner', 15, { level: 50, weapons: ['tome-light', 'tome-fire', 'tome-ice', 'bow', 'greatsword'],
      sides: ['summoner-tome-light.5a', 'summoner-bow.5a'], loadout: ['summoner-tome-light.5a', 'summoner-bow.5a'] })
    const lingering = (s: BattleState) => { s.summons = [{ allyId: 'a5', ref: ref('summoner-tome-light.5a'), scale: 0.3 }] }
    expect(chips(a5, pair5(), lingering)).toBe(11)
    expect(chips(a5, pair5())).toBe(10)
  })
  const pair5 = (): BattleAction => ({ kind: 'skill', actorId: 'a5', targetId: 'f1', skill: ref('summoner-tome-light.5a'), pair: { skill: ref('summoner-bow.5a') } })
})
