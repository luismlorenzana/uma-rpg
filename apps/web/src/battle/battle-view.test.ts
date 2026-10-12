import { BATTLE_LIMIT_MAX, createBattle, projectRpgStats, rpgFoe, type BattleAlly, type BattleInput, type BattleState, type RpgClass, type RpgWeapon } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { limitMode, limitOptions, limitReady } from './battle-view'

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
