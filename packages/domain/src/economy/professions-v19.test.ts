// Classes v3's trades (H126; classes-v3.md §6, CV20): one trade a Tier 0, her calling naming it; the trade ids keep their
// names, and a class switch or a promotion never moves a trade. Invented outfits only.
import { describe, expect, it } from 'vitest'
import { RPG_TIER0_CLASSES } from '../rpg/kinds'
import { tradeOfCalling, tradePlaces, tradeResolver, umaTrade } from './professions'

const V18 = 18, V19 = 19
const outfit = (style: 'front' | 'pace' | 'late' | 'end', also?: 'late' | 'end') => ({
  aptitudes: { strategy: { front: 'B', pace: 'B', late: 'B', end: 'B', [style]: 'A', ...(also ? { [also]: 'A' } : {}) },
    distance: { sprint: 'B', mile: 'B', medium: 'A', long: 'B' } },
  baseStats: { power: 100, wit: 90 },
}) as const

describe('trades by Tier 0 (CV20)', () => {
  it('gives each Tier 0 one trade: Warrior Metal, Spellblade Wood, Healer Vegetables, Summoner Fish, Mage Stone', () => {
    expect(Object.fromEntries(RPG_TIER0_CLASSES.map((c) => [c, tradeOfCalling(c)]))).toEqual({
      recruit: 'physical', duelist: 'physical-hybrid', acolyte: 'healer', caller: 'magical-hybrid', apprentice: 'magical',
    })
    expect(Object.fromEntries(RPG_TIER0_CLASSES.map((c) => [c, tradePlaces(tradeOfCalling(c))[0]]))).toEqual({
      recruit: 'mine', duelist: 'forest', acolyte: 'fields', caller: 'fishery', apprentice: 'monster-den',
    })
  })

  it('reads her trade from her Tier 0 from v19, the pick ignored; today\'s calling before', () => {
    const pace = outfit('pace')
    expect([umaTrade(pace, null, V19), umaTrade(pace, 'mage', V19), umaTrade(pace, 'spellblade', V19)]).toEqual(['physical-hybrid', 'physical-hybrid', 'physical-hybrid'])
    expect([umaTrade(pace, 'spellblade', V18), umaTrade(pace, null, V18), umaTrade(pace)]).toEqual(['physical-hybrid', 'physical-hybrid', 'physical-hybrid'])
    // Pace + Late with Power over Wit: today the Spell Blade's Wood, from v19 the Mage's Stone.
    expect([umaTrade(outfit('pace', 'late'), null, V19), umaTrade(outfit('pace', 'late'), null, V18)]).toEqual(['magical', 'physical-hybrid'])
    expect(umaTrade(outfit('front'), null, V19)).toBe('physical')
    expect(umaTrade(outfit('late'), null, V19)).toBe('healer')
    expect([umaTrade(outfit('end'), null, V19), umaTrade(outfit('late', 'end'), null, V19)]).toEqual(['magical-hybrid', 'magical-hybrid'])
  })

  it('resolves a world\'s trades by generation, whatever class she fights as', () => {
    const world = { umas: { a: { calling: { pick: 'mage' as const } }, b: { calling: { pick: null } } } }
    const outfits = new Map([['a', outfit('pace')], ['b', outfit('late')]])
    const of = (engine: number) => tradeResolver(world, (id) => outfits.get(id), engine)
    expect([of(V18)('a'), of(V19)('a'), of(V19)('b'), of(V19)('c')]).toEqual(['magical', 'physical-hybrid', 'healer', null])
  })
})
