import {
  BATTLE_LIMIT_MAX, isRpgTome, projectRpgStats, rpgDefaultWeapons, rpgFoe, type BattleAlly, type BattleInput, type BattleState, type RpgClass,
  type RpgWeapon,
} from '@rpg/domain'
import { applyBattleAction, createBattle } from '@rpg/domain/engine'
import { describe, expect, it } from 'vitest'
import { actionFor, describeCue, limitMode, limitOptions, limitReady, pairing, pairMode, pairOf } from './battle-view'

// Invented outfits only. Depth-1 cores at Class Rank 4.
const ARMS: RpgWeapon[] = ['greatsword', 'axe', 'lance', 'bow', 'katana']
const TOMES: RpgWeapon[] = ['tome-fire', 'tome-ice', 'tome-lightning', 'tome-light', 'tome-dark']
function ally(id: string, classId: RpgClass, weapons: RpgWeapon[], loadout: string[], extra: Partial<BattleAlly> = {}): BattleAlly {
  const stats = projectRpgStats({ baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
    growthRates: { speed: 0.05, stamina: 0.05, power: 0.05, guts: 0.05, wit: 0.05 }, classId, tier: 1, level: 4 })
  return { id, classId, weapons, tier: 1, level: 4, stats, tree: [], legacy: [], loadout: loadout.map((n) => ({ tier: 1, id: n })), mp: stats.mp, classRank: 4, ...extra }
}
function fight(version: BattleInput['version'], first: Partial<BattleAlly>): BattleState {
  const allies = [
    ally('a1', 'brawler', ARMS, ['brawler-greatsword.1'], first),
    ally('a2', 'mage', TOMES, ['mage-tome-fire.1']),
    ally('a3', 'brawler', ARMS, ['brawler-axe.1']),
    ally('a4', 'mage', TOMES, ['mage-tome-ice.1']),
    ally('a5', 'brawler', ARMS, ['brawler-lance.1']),
  ]
  const foe = rpgFoe({ id: 'f1', castId: 'cast-f1', element: 'dark', role: 'striker', rank: 'regular', level: 4, shield: 3, weaknesses: { weapons: ['bow'], elements: ['light'] } })
  const state = createBattle({ version, seed: 1, allies, enemies: [foe] }).state
  for (const u of state.units) if (u.side === 'ally') u.limit = BATTLE_LIMIT_MAX
  return state
}

describe('the Limit Break menu (D106, D112)', () => {
  it('offers a Learner only her Heroes’ Limit Breaks from v10, with their faces and strength', () => {
    const state = fight(10, { inherits: [{ limit: 'mage-2', bond: 4, from: 'h1' }, { limit: 'brawler-3', bond: 0, from: 'h2' }] })
    const { pick, options } = limitOptions(state, 'a1')
    expect(pick).toBe(1)
    expect(options.map((o) => [o.name, o.face, o.strength])).toEqual([['Twilight Eclipse', 'h1', 0.7], ['Spear and Arrow Storm', 'h2', 0.5]])
    expect(limitMode(state, 'a1', { hero: 'mage-2' })).toMatchObject({ kind: 'limit', name: 'Twilight Eclipse', hero: 'mage-2' })
    expect(limitMode(state, 'a1', { skill: { tier: 1, id: 'brawler-greatsword.1' } })).toBeNull()
  })

  it('never shows the badge to an Uma with no Limit Break from v10; older fights keep their class ones', () => {
    expect(limitReady(fight(10, {}), 'a1')).toBe(false)
    expect(limitOptions(fight(10, {}), 'a1').options).toEqual([])
    expect(limitReady(fight(10, { hero: 'cleric-1' }), 'a1')).toBe(true)
    expect(limitReady(fight(9, {}), 'a1')).toBe(true)
    expect(limitOptions(fight(9, {}), 'a1').options[0]).toMatchObject({ name: 'Heavy Slash' })
  })
})

describe('the hit line (D169)', () => {
  const name = (id: string) => ({ a1: 'Ally', f1: 'Foe' })[id] ?? id
  const hit = (label?: string) => describeCue({ kind: 'hit', actorId: 'a1', targetId: 'f1', amount: 40, channel: 'magical', element: 'fire', weak: false, ...(label ? { label } : {}) }, name)

  it('names a warded hit, as it names a guarded one', () => {
    expect(hit()).toBe('Ally → Foe: 40')
    expect(hit('Warded')).toBe('Ally → Foe: 40 · warded')
    expect(hit('Intercepted')).toBe('Ally → Foe: 40 · guarded')
    expect(describeCue({ kind: 'hit', actorId: 'a1', targetId: 'f1', amount: 12, channel: 'physical', element: 'bow', weak: true, label: 'Warded' }, name))
      .toBe('Ally → Foe: 12 · WEAK · warded')
  })
})

describe('the hybrids\' pairs by the fight\'s version (H59, D183)', () => {
  const ref = (id: string) => ({ tier: 1, id })
  /** A fight with a Summoner (s1) and a Spell Blade (b1) on each generation's default weapons. */
  function hybrids(version: BattleInput['version']): BattleState {
    const allies = [
      ally('s1', 'summoner', rpgDefaultWeapons('summoner', version), ['summoner-tome-fire.1', 'summoner-greatsword.1']),
      ally('b1', 'spellblade', rpgDefaultWeapons('spellblade', version), ['spellblade-greatsword.1', 'spellblade-tome-fire.1']),
      ally('a3', 'brawler', ARMS, ['brawler-axe.1']),
      ally('a4', 'mage', TOMES, ['mage-tome-ice.1']),
      ally('a5', 'brawler', ARMS, ['brawler-lance.1']),
    ]
    const foes = ['f1', 'f2'].map((id) => rpgFoe({ id, castId: `cast-${id}`, element: 'dark', role: 'striker', rank: 'regular', level: 4, shield: 3, weaknesses: { weapons: ['bow'], elements: ['light'] } }))
    return createBattle({ version, seed: 1, allies, enemies: foes }).state
  }
  const allyOf = (state: BattleState, id: string) => state.input.allies.find((a) => a.id === id)!

  it('leads a v15 Summoner\'s pair with a Tome half, and the engine takes it', () => {
    const state = hybrids(15)
    const summoner = allyOf(state, 's1')
    expect(pairing(state, summoner)).toEqual({ tomeFirst: true })
    const attack = pairMode(pairOf({ kind: 'attack' }, summoner, true), true)
    expect(attack).toMatchObject({ kind: 'attack', weapon: 'tome-fire', pair: { weapon: 'greatsword' } })
    expect(applyBattleAction(state, actionFor(attack, 's1', 'f1')).error).toBeUndefined()
    const skills = pairMode({ tome: { skill: ref('summoner-tome-fire.1') }, arms: { skill: ref('summoner-greatsword.1') } }, true)
    expect(skills).toMatchObject({ kind: 'skill', ref: { id: 'summoner-tome-fire.1' }, pair: { skill: { id: 'summoner-greatsword.1' } } })
    expect(pairOf(skills, summoner, true)).toEqual({ tome: { skill: ref('summoner-tome-fire.1') }, arms: { skill: ref('summoner-greatsword.1') } })
    const step = applyBattleAction(state, actionFor(skills, 's1', 'f1'))
    expect(step.error).toBeUndefined()
    // Her Tome summon lands first, as the screen shows it.
    const first = step.cues.find((c) => c.kind === 'hit' && c.actorId === 's1')
    expect(first && 'element' in first && first.element).toBe('fire')
    // One half alone is no act of hers any more.
    expect(applyBattleAction(state, actionFor({ kind: 'skill', ref: ref('summoner-tome-fire.1') }, 's1', 'f1')).error).toBe('invalid-skill')
  })

  it('keeps a v14 Summoner to her one half, and every Spell Blade\'s pair Arms first', () => {
    const old = hybrids(14)
    expect(pairing(old, allyOf(old, 's1'))).toBeNull()
    expect(applyBattleAction(old, actionFor({ kind: 'skill', ref: ref('summoner-tome-fire.1') }, 's1', 'f1')).error).toBeUndefined()
    for (const state of [old, hybrids(15)]) {
      const blade = allyOf(state, 'b1')
      expect(pairing(state, blade)).toEqual({ tomeFirst: false })
      const mode = pairMode(pairOf({ kind: 'attack' }, blade), false)
      expect(mode.kind === 'attack' && !isRpgTome(mode.weapon!) && isRpgTome(mode.pair!.weapon!)).toBe(true)
      expect(applyBattleAction(state, actionFor(mode, 'b1', 'f1')).error).toBeUndefined()
    }
  })

  it('says a v15 farewell strikes every foe, and a v14 summon strikes again', () => {
    const name = (id: string) => ({ s1: 'Sum' })[id] ?? id
    const cue = { kind: 'summon', actorId: 's1', targetId: 'f1', label: 'Ember Sprites' } as const
    expect(describeCue(cue, name, 15)).toBe('Sum’s Ember Sprites strikes every foe')
    expect(describeCue(cue, name, 14)).toBe('Sum’s Ember Sprites strikes again')
    expect(describeCue({ kind: 'heal', actorId: 'c1', targetId: 's1', amount: 12, label: 'Regen' }, name, 15)).toBe('Sum +12 HP · Regen')
  })

  it('reads a v16 Flourish as her ★: a mend "★ +30 HP" and Clean break\'s Barrier "★ Barrier 59" (H70)', () => {
    const name = (id: string) => ({ a1: 'Aster' })[id] ?? id
    expect(describeCue({ kind: 'heal', actorId: 'a1', targetId: 'a1', amount: 30, label: 'Flourish' }, name, 16)).toBe('Aster ★ +30 HP')
    expect(describeCue({ kind: 'cover', actorId: 'a1', targetId: 'a1', amount: 59, label: 'Flourish' }, name, 16)).toBe('Aster: ★ Barrier 59')
    // Other mends and Barriers, and an MP cue, read as today.
    expect(describeCue({ kind: 'heal', actorId: 'c1', targetId: 'a1', amount: 12, label: 'Regen' }, name, 16)).toBe('Aster +12 HP · Regen')
    expect(describeCue({ kind: 'cover', actorId: 'c1', targetId: 'a1', amount: 40 }, name, 16)).toBe('Aster: Barrier 40')
    expect(describeCue({ kind: 'mp', actorId: 'a1', targetId: 'a1', amount: 12 }, name, 16)).toBe('Aster +12 MP')
  })
})

describe('the Limit Break menu reads the fight\'s table (H59, D181)', () => {
  it('names a v14 fight\'s cleric-3 Archangel\'s Verdict and a v15 one\'s Dawn Hymn', () => {
    for (const [version, name] of [[14, 'Archangel’s Verdict'], [15, 'Dawn Hymn']] as const) {
      const hero = fight(version, { hero: 'cleric-3' })
      expect(limitOptions(hero, 'a1').options.map((o) => o.name)).toEqual([name])
      const learner = fight(version, { inherits: [{ limit: 'cleric-3', bond: 10, from: 'h1' }] })
      expect(limitOptions(learner, 'a1').options).toMatchObject([{ name, face: 'h1', strength: 1 }])
    }
  })
})
