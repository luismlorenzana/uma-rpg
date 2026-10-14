import { describe, expect, it } from 'vitest'
import { learnRpgNode, projectRpgStats, rpgHand, type RpgClass, type RpgDamageKind, type RpgElement, type RpgProfile, type RpgWeapon, type RpgWeaponKind } from '../rules'
import { rpgFoe } from '../campaign/enemies'
import { BATTLE_LIMIT_MAX, applyBattleAction, battleActionsLeft, battleBroken, battleLimitGain, battleStateHash, createBattle, replayBattle,
  type BattleAction } from './index'
import { BATTLE_UNBROKEN_FACTOR, BATTLE_WEAK, battleWeakness } from './skills'
import { battleHasLimit, battleLimitPlan } from './limit'
import { autoAction } from './auto'
import { RPG_AOE_SHARE, RPG_RANDOM_BONUS } from '../catalog'
import { HERO_LIMIT_IDS, HERO_LIMIT_POWER, HERO_LIMITS, heroLimitSkills } from '../heroes'
import type { BattleAlly, BattleEnemy, BattleInput, BattleState, BattleStep } from './types'

// Invented outfits only; no private Uma or cast content. At Lv4 depth 1 is open, so every tree's depth-1 core is known.
function profile(id: string, classId: RpgClass, weapons: RpgWeapon[], sides: string[] = [], level = 4): RpgProfile {
  const p: RpgProfile = { outfitId: id, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
    growthRates: { speed: 0.05, stamina: 0.05, power: 0.05, guts: 0.05, wit: 0.05 }, classId, weapons, tier: 1, level, exp: 0, tree: [], legacy: [], classRank: level }
  return sides.reduce(learnRpgNode, p)
}
function ally(p: RpgProfile, loadout: string[], mp?: number, orb?: RpgDamageKind): BattleAlly {
  const stats = projectRpgStats(p)
  return { id: p.outfitId, classId: p.classId, weapons: p.weapons, tier: p.tier, level: p.level, stats, tree: p.tree, legacy: p.legacy,
    loadout: loadout.map((id) => ({ tier: 1, id })), mp: mp ?? stats.mp, ...(orb ? { orb } : {}) }
}
const ARMS: RpgWeapon[] = ['greatsword', 'axe', 'lance', 'bow', 'katana']
const TOMES: RpgWeapon[] = ['tome-fire', 'tome-ice', 'tome-lightning', 'tome-light', 'tome-dark']
const party = (mp?: number, orb?: RpgDamageKind) => [
  ally(profile('a1', 'brawler', ARMS), ['brawler-greatsword.1', 'brawler-axe.1', 'brawler-katana.1'], mp, orb),
  ally(profile('a2', 'mage', TOMES), ['mage-tome-fire.1', 'mage-tome-ice.1', 'mage-tome-light.1'], mp),
  ally(profile('a3', 'spellblade', ['greatsword', 'lance', 'katana', 'tome-fire', 'tome-lightning']),
    ['spellblade-greatsword.1', 'spellblade-tome-fire.1', 'spellblade-tome-lightning.1'], mp),
  ally(profile('a4', 'cleric', ['greatsword', 'axe', 'bow', 'tome-fire', 'tome-light']), ['cleric-greatsword.1', 'cleric-tome-fire.1', 'cleric-bow.1'], mp),
  ally(profile('a5', 'summoner', ['tome-fire', 'tome-ice', 'tome-lightning', 'greatsword', 'lance']),
    ['summoner-tome-fire.1', 'summoner-greatsword.1', 'summoner-tome-ice.1'], mp),
]
const foe = (id: string, element: RpgElement, weapons: RpgWeaponKind[] = ['greatsword', 'axe'], elements: RpgElement[] = ['fire'], shield = 3,
  rank: BattleEnemy['rank'] = 'regular') =>
  rpgFoe({ id, castId: `cast-${id}`, element, role: rank === 'regular' ? 'striker' : 'captain', rank, level: 4, shield, weaknesses: { weapons, elements } })
const input = (enemies: BattleEnemy[], mp?: number, orb?: RpgDamageKind): BattleInput => ({ version: 6, seed: 1234, allies: party(mp, orb), enemies })
const hits = (step: BattleStep, target: string) => step.cues.filter((c) => c.kind === 'hit' && c.targetId === target)
const shieldOf = (s: BattleState, id: string) => s.units.find((u) => u.id === id)!.shield
const unitOf = (s: BattleState, id: string) => s.units.find((u) => u.id === id)!
const skill = (id: string) => ({ tier: 1, id })
const act = (s: BattleState, action: BattleAction): BattleState => {
  const step = applyBattleAction(s, action)
  if (step.error) throw new Error(step.error)
  return step.state
}

describe('battle engine v6: one act a turn, ten kinds, Orbs (D86)', () => {
  it('a weak hit removes a shield point, and an Orb makes a hit weak too, without damage of its own', () => {
    let s = createBattle(input([foe('f1', 'ice')])).state
    s = act(s, { kind: 'attack', actorId: 'a1', targetId: 'f1', weapon: 'lance' }) // Lance: not on the list
    expect(shieldOf(s, 'f1')).toBe(3)
    s = act(createBattle(input([foe('f1', 'ice')])).state, { kind: 'attack', actorId: 'a1', targetId: 'f1', weapon: 'greatsword' })
    expect(shieldOf(s, 'f1')).toBe(2)
    // A Fire Orb: the Lance hit is weak through it, and still one hit.
    const step = applyBattleAction(createBattle(input([foe('f1', 'ice')], undefined, 'fire')).state, { kind: 'attack', actorId: 'a1', targetId: 'f1', weapon: 'lance' })
    expect(hits(step, 'f1').map((c) => c.kind === 'hit' && [c.element, c.weak])).toEqual([['lance', true]])
    expect(shieldOf(step.state, 'f1')).toBe(2)
    expect(applyBattleAction(createBattle(input([foe('f1', 'ice')])).state, { kind: 'attack', actorId: 'a2', targetId: 'f1', weapon: 'greatsword' }).error).toBe('invalid-skill')
  })

  it('unbroken foes take half damage; a Break doubles it back to full', () => {
    const s = createBattle(input([foe('f1', 'ice', ['greatsword'], ['fire'], 1)])).state
    const before = hits(applyBattleAction(s, { kind: 'attack', actorId: 'a1', targetId: 'f1', weapon: 'lance' }), 'f1')[0]!
    const broken = act(s, { kind: 'attack', actorId: 'a4', targetId: 'f1', weapon: 'greatsword' })
    expect(battleBroken(unitOf(broken, 'f1'))).toBe(true)
    const after = hits(applyBattleAction(broken, { kind: 'attack', actorId: 'a1', targetId: 'f1', weapon: 'lance' }), 'f1')[0]!
    expect(before.kind === 'hit' && after.kind === 'hit' && after.amount / before.amount).toBeCloseTo(1 / BATTLE_UNBROKEN_FACTOR, 0)
    expect(BATTLE_WEAK).toBeGreaterThan(1)
  })

  it('every class acts once a round, and the foes act after the last', () => {
    let s = createBattle(input([foe('f1', 'ice')])).state
    s = act(s, { kind: 'attack', actorId: 'a1', targetId: 'f1' })
    expect(battleActionsLeft(s, 'a1')).toBe(0)
    expect(applyBattleAction(s, { kind: 'attack', actorId: 'a1', targetId: 'f1' }).error).toBe('already-acted')
    for (const id of ['a2', 'a4', 'a5']) s = act(s, { kind: 'guard', actorId: id, targetId: 'a1' })
    expect(s.round).toBe(1)
    s = act(s, { kind: 'attack', actorId: 'a3', targetId: 'f1', weapon: 'katana', pair: { weapon: 'tome-fire' } })
    expect(s.round).toBe(2)
  })

  it('a Spell Blade’s act is an Arms half and a Tome half, each at 0.45', () => {
    const s = createBattle(input([foe('f1', 'dark', ['katana'], ['lightning'], 5)])).state
    expect(applyBattleAction(s, { kind: 'skill', actorId: 'a3', targetId: 'f1', skill: skill('spellblade-greatsword.1') }).error).toBe('invalid-skill')
    expect(applyBattleAction(s, { kind: 'skill', actorId: 'a3', targetId: 'f1', skill: skill('spellblade-greatsword.1'), pair: { weapon: 'katana' } }).error).toBe('invalid-skill')
    const step = applyBattleAction(s, { kind: 'skill', actorId: 'a3', targetId: 'f1', skill: skill('spellblade-greatsword.1'), pair: { skill: skill('spellblade-tome-lightning.1') } })
    expect(step.error).toBeUndefined()
    expect(hits(step, 'f1').map((c) => c.kind === 'hit' && c.element)).toEqual(['greatsword', 'lightning', 'lightning'])
    expect(shieldOf(step.state, 'f1')).toBe(3) // two weak Lightning hits
    expect(unitOf(s, 'a3').mp - unitOf(step.state, 'a3').mp).toBe(Math.round(10 * 0.5) * 2)
    expect(rpgHand({ classId: 'spellblade' }).power).toBe(0.45)
  })

  it('a summon lingers, then acts again at 0.3 when she next summons, and leaves', () => {
    const one = (s: BattleState, action: BattleAction): BattleStep => {
      let step = applyBattleAction(s, action)
      for (const id of ['a1', 'a2', 'a3', 'a4']) step = applyBattleAction(step.state, { kind: 'guard', actorId: id, targetId: 'a5' })
      return step
    }
    const s = createBattle(input([foe('f1', 'dark', ['bow'], ['light'], 9)])).state
    const first = applyBattleAction(s, { kind: 'skill', actorId: 'a5', targetId: 'f1', skill: skill('summoner-tome-fire.1') })
    expect(first.state.summons).toEqual([{ allyId: 'a5', ref: skill('summoner-tome-fire.1'), scale: 0.3 }])
    const round2 = one(s, { kind: 'skill', actorId: 'a5', targetId: 'f1', skill: skill('summoner-tome-fire.1') }).state
    const second = applyBattleAction(round2, { kind: 'skill', actorId: 'a5', targetId: 'f1', skill: skill('summoner-greatsword.1') })
    expect(second.cues.find((c) => c.kind === 'summon')).toMatchObject({ label: 'Ember Sprites' })
    expect(hits(second, 'f1').map((c) => c.kind === 'hit' && c.element)).toEqual(['fire', 'greatsword'])
    const [linger, summoned] = hits(second, 'f1').map((c) => (c.kind === 'hit' ? c.amount : 0))
    expect(linger! / summoned!).toBeCloseTo(0.3 / 0.6, 1)
    expect(second.state.summons).toEqual([{ allyId: 'a5', ref: skill('summoner-greatsword.1'), scale: 0.3 }])
  })

  it('a Cleric’s blow debuffs the foe it hits, her spell buffs every ally, and Shatter takes shield points', () => {
    const s = createBattle(input([foe('f1', 'dark', ['bow'], ['light'], 4)])).state
    const blow = act(s, { kind: 'skill', actorId: 'a4', targetId: 'f1', skill: skill('cleric-greatsword.1') })
    expect(unitOf(blow, 'f1').statuses).toContainEqual({ kind: 'armor-break', stacks: 1, turns: 2 })
    const spell = act(s, { kind: 'skill', actorId: 'a4', targetId: 'f1', skill: skill('cleric-tome-fire.1') })
    for (const id of ['a1', 'a2', 'a3', 'a4', 'a5']) expect(unitOf(spell, id).statuses).toContainEqual({ kind: 'brave', stacks: 1, turns: 2 })
    const shatter = act(s, { kind: 'skill', actorId: 'a4', targetId: 'f1', skill: skill('cleric-bow.1') })
    expect(shieldOf(shatter, 'f1')).toBe(2) // a weak Bow hit, then Shatter 1
  })

  it('scales MP by the hand and refuses a skill it cannot pay for', () => {
    const s = createBattle(input([foe('f1', 'ice')], 5)).state
    expect(applyBattleAction(s, { kind: 'skill', actorId: 'a1', targetId: 'f1', skill: skill('brawler-greatsword.1') }).error).toBe('insufficient-mp')
    const full = createBattle(input([foe('f1', 'ice')])).state
    const summoned = act(full, { kind: 'skill', actorId: 'a5', targetId: 'f1', skill: skill('summoner-tome-fire.1') })
    expect(unitOf(full, 'a5').mp - unitOf(summoned, 'a5').mp).toBe(Math.round(10 * 0.7))
  })

  it('a Broken foe loses this round and the next, then raises its shield', () => {
    let s = createBattle(input([foe('f1', 'ice', ['greatsword'], ['fire'], 1, 'sub-boss')])).state
    s = act(s, { kind: 'attack', actorId: 'a1', targetId: 'f1' })
    expect(battleBroken(unitOf(s, 'f1'))).toBe(true)
    const round = (state: BattleState): BattleStep => {
      let step: BattleStep = { state, cues: [], hash: '' }
      for (const id of ['a1', 'a2', 'a3', 'a4', 'a5']) {
        if (battleActionsLeft(step.state, id) <= 0) continue
        const next = applyBattleAction(step.state, { kind: 'guard', actorId: id, targetId: id === 'a1' ? 'a2' : 'a1' })
        step = { ...next, cues: [...step.cues, ...next.cues] }
      }
      return step
    }
    const first = round(s)
    expect(first.cues.some((c) => c.kind === 'skip')).toBe(true)
    const second = round(first.state)
    expect(second.cues.some((c) => c.kind === 'skip')).toBe(true)
    expect(second.cues.some((c) => c.kind === 'recover')).toBe(true)
    expect(shieldOf(second.state, 'f1')).toBe(1)
  })

  it('replays identically from the frozen input and refuses skills she hasn’t equipped', () => {
    const start = createBattle(input([foe('f1', 'ice'), foe('f2', 'dark')]))
    const actions: BattleAction[] = [
      { kind: 'skill', actorId: 'a1', targetId: 'f1', skill: skill('brawler-axe.1') },
      { kind: 'skill', actorId: 'a5', targetId: 'f2', skill: skill('summoner-tome-ice.1') },
    ]
    const a = replayBattle(start.state.input, actions)
    const b = replayBattle(start.state.input, actions)
    expect(a.hash).toBe(b.hash)
    expect(battleStateHash(a.state)).toMatch(/^rpg-battle-v6:/)
    expect(applyBattleAction(start.state, { kind: 'skill', actorId: 'a1', targetId: 'f1', skill: skill('brawler-bow.1') }).error).toBe('invalid-skill')
    expect(applyBattleAction(start.state, { kind: 'skill', actorId: 'a1', targetId: 'f1', skill: skill('brawler-greatsword.2') }).error).toBe('invalid-skill')
    expect(battleWeakness('fire')).toBe('lightning')
  })
})

describe('Limit Break (D311, D86)', () => {
  const ready = (s: BattleState, ...ids: string[]) => { for (const id of ids) unitOf(s, id).limit = BATTLE_LIMIT_MAX; return s }
  const kinds = (step: BattleStep, target: string) => hits(step, target).map((c) => c.kind === 'hit' && c.element)

  it('charges 2 an attack and 4 a skill, the same for every class, and stays full until used', () => {
    expect([battleLimitGain('attack'), battleLimitGain('skill')]).toEqual([2, 4])
    let s = createBattle(input([foe('f1', 'ice', [], ['fire'], 9)])).state
    s = act(s, { kind: 'attack', actorId: 'a1', targetId: 'f1' })
    s = act(s, { kind: 'skill', actorId: 'a2', targetId: 'f1', skill: skill('mage-tome-ice.1') })
    expect([unitOf(s, 'a1').limit, unitOf(s, 'a2').limit]).toEqual([2, 4])
  })

  it('needs a full bar and a fresh turn, costs no MP and empties the bar', () => {
    const s = createBattle(input([foe('f1', 'ice')])).state
    expect(applyBattleAction(s, { kind: 'limit', actorId: 'a2', targetId: 'f1' }).error).toBe('limit-not-ready')
    const step = applyBattleAction(ready(s, 'a2'), { kind: 'limit', actorId: 'a2', targetId: 'f1' })
    expect(step.cues.find((c) => c.kind === 'limit')).toMatchObject({ label: 'Prismatic Nova' })
    expect(kinds(step, 'f1')).toEqual(['fire', 'ice', 'lightning', 'light', 'dark'])
    expect(unitOf(step.state, 'a2')).toMatchObject({ limit: 0, mp: unitOf(s, 'a2').mp })
    expect(battleActionsLeft(step.state, 'a2')).toBe(0)
  })

  it('casts a Brawler’s skill twice, both Spell Blade halves at full, every Cleric status, and a Grand Summon that lingers at twice', () => {
    const base = () => ready(createBattle(input([foe('f1', 'dark', ['bow'], ['light'], 9)])).state, 'a1', 'a3', 'a4', 'a5')
    expect(kinds(applyBattleAction(base(), { kind: 'limit', actorId: 'a1', targetId: 'f1', skill: skill('brawler-katana.1') }), 'f1'))
      .toEqual(['katana', 'katana', 'katana', 'katana'])
    const arts = applyBattleAction(base(), { kind: 'limit', actorId: 'a3', targetId: 'f1', skills: [skill('spellblade-greatsword.1'), skill('spellblade-tome-fire.1')] })
    expect(kinds(arts, 'f1')).toEqual(['greatsword', 'fire'])
    expect(applyBattleAction(base(), { kind: 'limit', actorId: 'a3', targetId: 'f1', skills: [skill('spellblade-tome-fire.1'), skill('spellblade-tome-lightning.1')] }).error).toBe('invalid-skill')
    const patrons = applyBattleAction(base(), { kind: 'limit', actorId: 'a4', targetId: 'f1' })
    expect(kinds(patrons, 'f1')).toEqual(['greatsword', 'axe', 'bow', 'fire', 'light'])
    expect(unitOf(patrons.state, 'f1').statuses.map((x) => x.kind)).toEqual(expect.arrayContaining(['armor-break', 'enfeeble']))
    expect(unitOf(patrons.state, 'a1').statuses.map((x) => x.kind)).toEqual(expect.arrayContaining(['brave', 'faith']))
    const grand = applyBattleAction(base(), { kind: 'limit', actorId: 'a5', targetId: 'f1', skill: skill('summoner-tome-fire.1') })
    expect(grand.cues.find((c) => c.kind === 'limit')).toMatchObject({ label: 'Grand Summon' })
    expect(grand.state.summons).toEqual([{ allyId: 'a5', ref: skill('summoner-tome-fire.1'), scale: 0.6 }])
  })
})

describe('battle engine v7: eight foes, dual elements, twice-acting elites, waves (W3)', () => {
  const v7 = (enemies: BattleEnemy[], waves?: BattleEnemy[][]): BattleInput => ({ version: 7, seed: 1234, allies: party(), enemies, ...(waves ? { waves } : {}) })
  /** Every ready ally attacks the first living foe with her first weapon (a Spell Blade adds a Tome half). */
  const round = (s: BattleState): BattleState => {
    let state = s
    const start = state.round
    while (state.outcome === 'active' && state.round === start) {
      const a = state.units.find((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(state, u.id) > 0)
      const target = state.units.find((u) => u.side === 'enemy' && u.hp > 0)
      if (!a || !target) break
      const source = state.input.allies.find((x) => x.id === a.id)!
      const pair = source.classId === 'spellblade' ? { pair: { weapon: source.weapons.find((w) => w.startsWith('tome-')) } } : {}
      state = act(state, { kind: 'attack', actorId: a.id, targetId: target.id, weapon: source.weapons.find((w) => !w.startsWith('tome-')) ?? source.weapons[0], ...pair })
    }
    return state
  }

  it('fields up to eight foes in v7 and five in v6; dual elements, twice and waves are v7 only', () => {
    const eight = Array.from({ length: 8 }, (_, i) => foe(`f${i + 1}`, 'fire'))
    expect(createBattle(v7(eight)).state.units.filter((u) => u.side === 'enemy')).toHaveLength(8)
    expect(() => createBattle(v7([...eight, foe('f9', 'fire')]))).toThrow(/header/)
    expect(() => createBattle(input(eight.slice(0, 6)))).toThrow(/header/)
    const dual = { ...foe('f1', 'fire'), element2: 'dark' as const }
    expect(() => createBattle(v7([dual]))).not.toThrow()
    expect(() => createBattle(input([dual]))).toThrow(/enemy/)
    expect(() => createBattle(v7([{ ...dual, element2: 'fire' }]))).toThrow(/enemy/)
    expect(() => createBattle({ ...input([foe('f1', 'fire')]), waves: [[foe('f2', 'ice')]] })).toThrow(/header/)
    expect(() => createBattle(v7([foe('f1', 'fire')], [[foe('f1', 'ice')]]))).toThrow(/Duplicate/)
    expect(() => createBattle(v7([foe('f1', 'fire')], [[foe('f2', 'ice')], [foe('f3', 'ice')], [foe('f4', 'ice')]]))).toThrow(/header/)
  })

  it('splits a dual foe’s elemental moves between her two elements', () => {
    const f = rpgFoe({ id: 'f1', castId: 'c', element: 'fire', element2: 'dark', role: 'champion', rank: 'boss', level: 10, shield: 6,
      weaknesses: { weapons: ['axe'], elements: ['lightning', 'light'] } })
    const elements = new Set([...f.moves, ...f.phaseTwo!.moves].map((m) => m.element).filter(Boolean))
    expect(elements).toEqual(new Set(['fire', 'dark']))
    expect(f.element2).toBe('dark')
  })

  it('lets a twice-acting foe move twice a round, both after everyone’s first', () => {
    const s = createBattle(v7([{ ...foe('f1', 'fire'), twice: true }, foe('f2', 'ice')])).state
    expect(s.intents.map((i) => i.enemyId).filter((id) => id === 'f1')).toHaveLength(2)
    expect(s.intents.at(-1)!.enemyId).toBe('f1')
    // Same input without the flag: one move each.
    expect(createBattle(v7([foe('f1', 'fire'), foe('f2', 'ice')])).state.intents).toHaveLength(2)
  })

  it('brings the next wave in a fresh round, keeping the party’s HP, MP and Limit charge', () => {
    const weak = (id: string) => ({ ...foe(id, 'ice'), stats: { ...foe(id, 'ice').stats, hp: 1 } })
    let s = createBattle(v7([weak('f1')], [[foe('f2', 'ice'), foe('f3', 'ice')], [foe('f4', 'ice')]])).state
    expect(s.wave).toBe(0)
    const before = s.units.filter((u) => u.side === 'ally').map((u) => ({ id: u.id, mp: u.mp }))
    const step = applyBattleAction(s, { kind: 'attack', actorId: 'a1', targetId: 'f1', weapon: 'greatsword' })
    expect(step.error).toBeUndefined()
    s = step.state
    expect(step.cues.some((c) => c.kind === 'wave' && c.label === 'Wave 2 of 3')).toBe(true)
    expect(s.outcome).toBe('active')
    expect(s.wave).toBe(1)
    expect(s.round).toBe(2)
    expect(s.acted).toEqual([])
    expect(s.units.filter((u) => u.side === 'enemy').map((u) => u.id)).toEqual(['f2', 'f3'])
    expect(s.intents.every((i) => ['f2', 'f3'].includes(i.enemyId))).toBe(true)
    expect(unitOf(s, 'a1').limit).toBe(battleLimitGain('attack'))
    expect(s.units.filter((u) => u.side === 'ally').map((u) => ({ id: u.id, mp: u.mp }))).toEqual(before)
    // Fight on to the end: the last wave's fall is the victory, and a replay lands the same state.
    const actions: BattleAction[] = []
    let state = s
    for (let n = 0; n < 60 && state.outcome === 'active'; n++) {
      const a = state.units.find((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(state, u.id) > 0)!
      const t = state.units.find((u) => u.side === 'enemy' && u.hp > 0)!
      const source = state.input.allies.find((x) => x.id === a.id)!
      const action: BattleAction = { kind: 'attack', actorId: a.id, targetId: t.id, weapon: source.weapons.find((w) => !w.startsWith('tome-')) ?? source.weapons[0],
        ...(source.classId === 'spellblade' ? { pair: { weapon: source.weapons.find((w) => w.startsWith('tome-')) } } : {}) }
      actions.push(action)
      state = act(state, action)
    }
    expect(state.outcome).toBe('victory')
    expect(state.wave).toBe(2)
    const replayed = replayBattle(v7([weak('f1')], [[foe('f2', 'ice'), foe('f3', 'ice')], [foe('f4', 'ice')]]),
      [{ kind: 'attack', actorId: 'a1', targetId: 'f1', weapon: 'greatsword' }, ...actions])
    expect(battleStateHash(replayed.state)).toBe(battleStateHash(state))
  })

  it('keeps a v6 fight as it was: version 6 and no wave field, so its hash and replay don’t move', () => {
    const s = round(createBattle(input([foe('f1', 'ice'), foe('f2', 'fire')])).state)
    expect(s.engineVersion).toBe(6)
    expect(s.wave).toBeUndefined()
    expect('wave' in createBattle(input([foe('f1', 'ice')])).state).toBe(false)
  })
})

describe('battle engine v8: Class Ranks, Might, Barrier and Regen (D102, D104)', () => {
  const v8 = (allies: BattleAlly[], enemies: BattleEnemy[]): BattleInput => ({ version: 8, seed: 99, allies, enemies })
  const ranked = (a: BattleAlly, extra: Partial<BattleAlly> = {}): BattleAlly => ({ ...a, classRank: a.level, ...extra })

  it('adds a weapon\'s Might to the hits made with it, and only those', () => {
    const plain = party().map((a) => ranked(a))
    const strong = plain.map((a, i) => (i === 0 ? { ...a, might: { greatsword: 40 } } : a))
    const hit = (allies: BattleAlly[], weapon: RpgWeapon) => {
      const step = applyBattleAction(createBattle(v8(allies, [foe('f1', 'fire', ['greatsword', 'axe'], ['fire'], 9)])).state,
        { kind: 'attack', actorId: 'a1', targetId: 'f1', weapon })
      return hits(step, 'f1').reduce((n, c) => n + (c.kind === 'hit' ? c.amount : 0), 0)
    }
    expect(hit(strong, 'greatsword')).toBeGreaterThan(hit(plain, 'greatsword'))
    expect(hit(strong, 'axe')).toBe(hit(plain, 'axe'))
  })

  it('starts her with her armor\'s Barrier and heals her Regen at each round\'s end', () => {
    const allies = party().map((a, i) => ranked(a, i === 0 ? { barrier: 30, regen: 7 } : {}))
    const start = createBattle(v8(allies, [foe('f1', 'fire')])).state
    expect(unitOf(start, 'a1').barrier).toBe(30)
    const hurt = { ...start, units: start.units.map((u) => (u.id === 'a1' ? { ...u, hp: u.hp - 50 } : u)) }
    let s: BattleState = hurt
    allies.forEach((a, i) => { s = act(s, { kind: 'guard', actorId: a.id, targetId: allies[(i + 1) % allies.length]!.id }) })
    expect(unitOf(s, 'a1').hp).toBeGreaterThan(unitOf(hurt, 'a1').hp - 50)
    expect(s.round).toBe(2)
  })

  it('opens depths by Class Rank, not level: a Lv 50 Uma at Class Rank 9 has no depth-2 skill', () => {
    const a = ranked(party()[0]!, { level: 50, classRank: 9, loadout: [skill('brawler-greatsword.2')] })
    expect(() => createBattle(v8([a, ...party().slice(1).map((x) => ranked(x))], [foe('f1', 'fire')]))).toThrow(/Invalid battle ally/)
    const ok = ranked(party()[0]!, { level: 1, classRank: 10, loadout: [skill('brawler-greatsword.2')] })
    expect(() => createBattle(v8([ok, ...party().slice(1).map((x) => ranked(x))], [foe('f1', 'fire')]))).not.toThrow()
    // v6 and v7 allies never carry the new fields.
    expect(() => createBattle({ ...input([foe('f1', 'fire')]), allies: party().map((x) => ({ ...x, classRank: 4 })) })).toThrow(/Invalid battle ally/)
  })
})

describe('battle engine v9: Heroes and inherited Limit Breaks (D106, D107)', () => {
  const v9 = (allies: BattleAlly[], enemies: BattleEnemy[]): BattleInput => ({ version: 9, seed: 7, allies, enemies })
  const team = (first: Partial<BattleAlly> = {}) => party().map((a, i) => ({ ...a, classRank: a.level, ...(i === 0 ? first : {}) }))
  const ready = (s: BattleState, id = 'a1') => { unitOf(s, id).limit = BATTLE_LIMIT_MAX; return s }
  const tough = () => [foe('f1', 'dark', ['bow'], ['light'], 9), foe('f2', 'dark', ['bow'], ['light'], 9)]
  const dealt = (step: BattleStep) => step.cues.reduce((n, c) => n + (c.kind === 'hit' && c.actorId === 'a1' ? c.amount : 0), 0)

  it('gives a Hero only her seat’s Limit Break, at full strength', () => {
    const s = () => ready(createBattle(v9(team({ hero: 'brawler-1' }), tough())).state)
    const step = applyBattleAction(s(), { kind: 'limit', actorId: 'a1', targetId: 'f1' })
    expect(step.cues.find((c) => c.kind === 'limit')).toEqual({ kind: 'limit', actorId: 'a1', targetId: 'f1', label: 'Arsenal Rush' })
    expect(hits(step, 'f1').map((c) => c.kind === 'hit' && c.element)).toEqual(['greatsword', 'axe', 'lance', 'bow', 'katana'])
    expect(applyBattleAction(s(), { kind: 'limit', actorId: 'a1', targetId: 'f1', hero: 'brawler-1' }).error).toBeUndefined()
    expect(applyBattleAction(s(), { kind: 'limit', actorId: 'a1', targetId: 'f1', hero: 'mage-1' }).error).toBe('invalid-skill')
    expect(applyBattleAction(s(), { kind: 'limit', actorId: 'a1', targetId: 'f1', weapon: 'axe' }).error).toBe('invalid-skill')
    expect(battleLimitPlan({ ...team()[0]!, hero: 'brawler-1' }, {})).toMatchObject({ capacity: 1 })
  })

  it('lets a Learner pick an inherited one at 50% plus 5% a Bond Level, naming its Hero, or keep her own', () => {
    const learner = (bond: number) => team({ inherits: [{ limit: 'brawler-1', bond, from: 'h1' }, { limit: 'mage-2', bond: 0, from: 'h2' }] })
    const cast = (bond: number, hero?: 'brawler-1' | 'cleric-1') =>
      applyBattleAction(ready(createBattle(v9(learner(bond), tough())).state), { kind: 'limit', actorId: 'a1', targetId: 'f1', ...(hero ? { hero } : {}) })
    const hero = applyBattleAction(ready(createBattle(v9(team({ hero: 'brawler-1' }), tough())).state), { kind: 'limit', actorId: 'a1', targetId: 'f1' })
    expect(cast(0, 'brawler-1').cues.find((c) => c.kind === 'limit')).toMatchObject({ label: 'Arsenal Rush', from: 'h1' })
    expect(dealt(cast(0, 'brawler-1')) / dealt(hero)).toBeCloseTo(0.5, 1)
    expect(dealt(cast(4, 'brawler-1')) / dealt(hero)).toBeCloseTo(0.7, 1)
    expect(dealt(cast(10, 'brawler-1'))).toBe(dealt(hero))
    expect(battleLimitPlan(learner(6)[0]!, { hero: 'brawler-1' })).toMatchObject({ capacity: 0.8, from: 'h1' })
    // A Mage's spells from a Brawler: a fused Light-and-Dark hit, magic she has no Tome for.
    expect(battleLimitPlan(learner(0)[0]!, { hero: 'mage-2' })!.casts[0]!.def.hits[0]!.parts.map((p) => p.kind)).toEqual(['light', 'dark'])
    expect(cast(0, 'cleric-1').error).toBe('invalid-skill')
    expect(cast(0).cues.find((c) => c.kind === 'limit')).toMatchObject({ label: 'Twin Strike' })
  })

  it('casts every one of the twenty, statuses included', () => {
    for (const id of HERO_LIMIT_IDS) {
      const step = applyBattleAction(ready(createBattle(v9(team({ hero: id }), tough())).state), { kind: 'limit', actorId: 'a1', targetId: 'f1' })
      expect(step.error, id).toBeUndefined()
      expect(dealt(step), id).toBeGreaterThan(0)
    }
    const demons = applyBattleAction(ready(createBattle(v9(team({ hero: 'cleric-2' }), tough())).state), { kind: 'limit', actorId: 'a1', targetId: 'f1' })
    // Hex first, so every Dark claw lands weak.
    expect(demons.cues.filter((c) => c.kind === 'hit' && c.actorId === 'a1').every((c) => c.kind === 'hit' && c.weak)).toBe(true)
    const choir = applyBattleAction(ready(createBattle(v9(team({ hero: 'cleric-1' }), tough())).state), { kind: 'limit', actorId: 'a1', targetId: 'f1' })
    expect(unitOf(choir.state, 'a3').statuses.map((x) => x.kind)).toContain('aegis')
  })

  it('keeps Heroes out of older fights and checks seats, Bonds and Heroes', () => {
    const bad = (first: Partial<BattleAlly>) => () => createBattle(v9(team(first), tough()))
    expect(() => createBattle({ ...v9(team({ hero: 'brawler-1' }), tough()), version: 8 })).toThrow(/Invalid battle ally/)
    expect(bad({ hero: 'brawler-9' as never })).toThrow(/Invalid battle ally/)
    expect(bad({ hero: 'brawler-1', inherits: [{ limit: 'mage-1', bond: 0, from: 'h1' }] })).toThrow(/Invalid battle ally/)
    expect(bad({ inherits: [{ limit: 'mage-1', bond: 11, from: 'h1' }] })).toThrow(/Invalid battle ally/)
    expect(bad({ inherits: [{ limit: 'mage-1', bond: 1, from: 'h1' }, { limit: 'mage-1', bond: 1, from: 'h2' }] })).toThrow(/Invalid battle ally/)
    expect(bad({ inherits: ['mage-1', 'mage-2', 'mage-3'].map((limit) => ({ limit: limit as 'mage-1', bond: 0, from: 'h1' })) })).toThrow(/Invalid battle ally/)
    expect(bad({ inherits: [{ limit: 'mage-1', bond: 3, from: 'h1' }] })).not.toThrow()
  })

  it('lets Auto fire a Hero’s Limit Break, and a Learner’s first Hero’s when she has none of her own', () => {
    const hero = ready(createBattle(v9(team({ hero: 'brawler-2' }), tough())).state)
    expect(autoAction(hero, 'a1')).toMatchObject({ kind: 'limit', hero: 'brawler-2' })
    // A Summoner with no summon equipped has no Limit Break of her own.
    const learner = team().map((a, i) => (i === 4 ? { ...a, loadout: [], inherits: [{ limit: 'mage-4' as const, bond: 2, from: 'h1' }] } : a))
    expect(autoAction(ready(createBattle(v9(learner, tough())).state, 'a5'), 'a5')).toMatchObject({ kind: 'limit', hero: 'mage-4' })
  })

  it('makes each Limit Break worth her class’s own at full strength', () => {
    const level = 1.6 // depth 1
    for (const limit of HERO_LIMITS) {
      const total = heroLimitSkills(limit, 10).reduce((n, def) => {
        const factor = def.target === 'all' ? RPG_AOE_SHARE : def.target === 'random' ? RPG_RANDOM_BONUS : 1
        return n + def.hits.reduce((m, h) => m + h.power / factor, 0) + (def.splash ? def.splash.power / RPG_AOE_SHARE : 0)
      }, 0)
      expect(total, limit.id).toBeCloseTo(10, 1)
    }
    expect(battleLimitPlan({ ...team()[0]!, hero: 'mage-3' }, {})!.casts[0]!.def.hits.reduce((n, h) => n + h.power, 0)).toBeCloseTo(HERO_LIMIT_POWER.brawler * level, 2)
  })
})

describe('battle engine v10: Limit Breaks only from the Halls of Heroes (D112)', () => {
  const v10 = (allies: BattleAlly[], enemies: BattleEnemy[]): BattleInput => ({ version: 10, seed: 7, allies, enemies })
  const team = (first: Partial<BattleAlly> = {}) => party().map((a, i) => ({ ...a, classRank: a.level, ...(i === 0 ? first : {}) }))
  const ready = (s: BattleState, id = 'a1') => { unitOf(s, id).limit = BATTLE_LIMIT_MAX; return s }
  const foes = () => [foe('f1', 'dark', ['bow'], ['light'], 9)]

  it('gives an Uma with no Hero seat and no Heroes no Limit Break; class ones still replay in older fights', () => {
    const s = () => ready(createBattle(v10(team(), foes())).state)
    expect(applyBattleAction(s(), { kind: 'limit', actorId: 'a1', targetId: 'f1' }).error).toBe('invalid-skill')
    expect(applyBattleAction(s(), { kind: 'limit', actorId: 'a1', targetId: 'f1', weapon: 'axe' }).error).toBe('invalid-skill')
    expect(battleHasLimit(team()[0]!, 10)).toBe(false)
    expect(battleHasLimit(team()[0]!, 9)).toBe(true)
    const v9 = ready(createBattle({ ...v10(team(), foes()), version: 9 }).state)
    expect(applyBattleAction(v9, { kind: 'limit', actorId: 'a1', targetId: 'f1' }).cues.find((c) => c.kind === 'limit')).toMatchObject({ label: 'Twin Strike' })
  })

  it('keeps a Hero’s own and a Learner’s inherited ones, and Auto fires the strongest Bond', () => {
    const hero = ready(createBattle(v10(team({ hero: 'brawler-4' }), foes())).state)
    expect(applyBattleAction(hero, { kind: 'limit', actorId: 'a1', targetId: 'f1' }).cues.find((c) => c.kind === 'limit')).toMatchObject({ label: 'Earthsplitter' })
    const learner = team({ inherits: [{ limit: 'mage-1', bond: 2, from: 'h1' }, { limit: 'cleric-2', bond: 6, from: 'h2' }] })
    const s = ready(createBattle(v10(learner, foes())).state)
    expect(applyBattleAction(s, { kind: 'limit', actorId: 'a1', targetId: 'f1', hero: 'mage-1' }).error).toBeUndefined()
    expect(applyBattleAction(s, { kind: 'limit', actorId: 'a1', targetId: 'f1', skill: skill('brawler-greatsword.1') }).error).toBe('invalid-skill')
    expect(autoAction(s, 'a1')).toMatchObject({ kind: 'limit', hero: 'cleric-2' })
    // Auto never reaches for a Limit Break she doesn't have.
    expect(autoAction(ready(createBattle(v10(team(), foes())).state), 'a1').kind).not.toBe('limit')
  })
})

describe('battle engine v11: two accessories and their effects (D124)', () => {
  const team = (each: Partial<BattleAlly> = {}, first: Partial<BattleAlly> = {}) =>
    party().map((a, i) => ({ ...a, classRank: a.level, ...each, ...(i === 0 ? first : {}) }))
  const v11 = (allies: BattleAlly[], enemies: BattleEnemy[]): BattleInput => ({ version: 11, seed: 5, allies, enemies })
  /** A foe whose only move hits every ally on one channel. */
  const hitter = (channel: 'physical' | 'magical', power = 100): BattleEnemy => {
    const f = foe('f1', 'fire', ['greatsword'], ['fire'], 9)
    return { ...f, moves: [{ id: 'all', kind: 'damage', channel, element: channel === 'magical' ? 'fire' : null, power, target: 'all', label: 'Hit' }], phaseTwo: undefined }
  }
  /** Everyone guards, so the round ends and the foe acts. */
  const round = (s: BattleState): BattleState => {
    const ids = s.input.allies.map((a) => a.id)
    ids.forEach((id, i) => { s = act(s, { kind: 'guard', actorId: id, targetId: ids[(i + 1) % ids.length]! }) })
    return s
  }
  const hpOf = (s: BattleState, id = 'a1') => unitOf(s, id).hp

  it('shields physical damage with a Barrier and magical with a Veil, each only its own', () => {
    const shielded = team({ barrier: 1000 })
    expect(hpOf(round(createBattle(v11(shielded, [hitter('physical')])).state))).toBe(shielded[0]!.stats.hp)
    expect(hpOf(round(createBattle(v11(shielded, [hitter('magical')])).state))).toBeLessThan(shielded[0]!.stats.hp)
    const veiled = team({ veil: 1000 })
    expect(hpOf(round(createBattle(v11(veiled, [hitter('magical')])).state))).toBe(veiled[0]!.stats.hp)
    expect(unitOf(round(createBattle(v11(veiled, [hitter('magical')])).state), 'a1').veil).toBeLessThan(1000)
    // Before v11 a Barrier took any damage.
    const old = round(createBattle({ ...v11(team({ barrier: 1000 }), [hitter('magical')]), version: 10 }).state)
    expect(hpOf(old)).toBe(team()[0]!.stats.hp)
  })

  it('cuts damage taken with Iron and Ward, and returns a share with Thorn and Mirror', () => {
    const lost = (allies: BattleAlly[], channel: 'physical' | 'magical') => allies[0]!.stats.hp - hpOf(round(createBattle(v11(allies, [hitter(channel)])).state))
    expect(lost(team({ guard: 500 }), 'physical')).toBeLessThan(lost(team(), 'physical'))
    expect(lost(team({ guard: 500 }), 'magical')).toBe(lost(team(), 'magical'))
    expect(lost(team({ resist: 500 }), 'magical')).toBeLessThan(lost(team(), 'magical'))
    const s = round(createBattle(v11(team({}, { thorns: 1000 }), [hitter('physical')])).state)
    const foeHp = unitOf(s, 'f1').hp
    expect(foeHp).toBe(s.input.enemies[0]!.stats.hp - (team()[0]!.stats.hp - hpOf(s)))
    const m = round(createBattle(v11(team({}, { mirror: 1000 }), [hitter('physical')])).state)
    expect(unitOf(m, 'f1').hp).toBe(m.input.enemies[0]!.stats.hp)
  })

  it('heals from physical damage dealt (Vampire), restores MP from magical (Siphon) and each round (Spring)', () => {
    const hurt = (s: BattleState, id: string) => { unitOf(s, id).hp = 10; unitOf(s, id).mp = 0; return s }
    const swing = applyBattleAction(hurt(createBattle(v11(team({}, { lifesteal: 1000 }), [hitter('physical', 1)])).state, 'a1'), { kind: 'attack', actorId: 'a1', targetId: 'f1' })
    const dealt = hits(swing, 'f1').reduce((n, c) => n + (c.kind === 'hit' ? c.amount : 0), 0)
    expect(unitOf(swing.state, 'a1').hp).toBe(10 + dealt)
    const mage = team({}, {})
    mage[1] = { ...mage[1]!, mpSteal: 1000 }
    const spell = applyBattleAction(hurt(createBattle(v11(mage, [hitter('physical', 1)])).state, 'a2'), { kind: 'attack', actorId: 'a2', targetId: 'f1', weapon: 'tome-fire' })
    expect(unitOf(spell.state, 'a2').mp).toBe(hits(spell, 'f1').reduce((n, c) => n + (c.kind === 'hit' ? c.amount : 0), 0))
    const spring = round(hurt(createBattle(v11(team({}, { mpRegen: 7 }), [hitter('physical', 1)])).state, 'a1'))
    expect(unitOf(spring, 'a1').mp).toBe(7)
  })

  it('makes a hit weak through either of her two Orbs', () => {
    const lanceFoe = foe('f1', 'ice', ['bow'], ['light'], 3)
    const attack = (orbs: RpgDamageKind[]) => hits(applyBattleAction(createBattle(v11(team({}, { orbs }), [lanceFoe])).state,
      { kind: 'attack', actorId: 'a1', targetId: 'f1', weapon: 'lance' }), 'f1').map((c) => c.kind === 'hit' && c.weak)
    expect(attack(['axe'])).toEqual([false])
    expect(attack(['axe', 'light'])).toEqual([true])
  })

  it('takes the new fields only from v11, and Orbs as a list there', () => {
    expect(() => createBattle({ ...v11(team({ veil: 5 }), [hitter('physical')]), version: 10 })).toThrow(/Invalid battle ally/)
    expect(() => createBattle({ ...v11(team({ orbs: ['fire'] }), [hitter('physical')]), version: 10 })).toThrow(/Invalid battle ally/)
    expect(() => createBattle(v11(team({ orb: 'fire' }), [hitter('physical')]))).toThrow(/Invalid battle ally/)
    expect(() => createBattle(v11(team({ orbs: ['fire', 'fire'] }), [hitter('physical')]))).toThrow(/Invalid battle ally/)
    expect(() => createBattle(v11(team({ thorns: 1001 }), [hitter('physical')]))).toThrow(/Invalid battle ally/)
    expect(() => createBattle(v11(team({ orbs: ['fire', 'katana'], lifesteal: 50, mpRegen: 3 }), [hitter('physical')]))).not.toThrow()
  })
})
