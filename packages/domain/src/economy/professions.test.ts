// R2's professions and trades (H77; profession-progression.md §2, §4.1, PP1–PP3, PP4): ten professions in three kinds, ten
// places, one trade an Uma by her calling, and the place a job runs at by generation.
import { describe, expect, it } from 'vitest'
import { RPG_ALL_CLASSES } from '../rpg/kinds'
import type { CallingOutfit } from '../roster/template'
import { RPG_WORK_ENV } from '../work/env'
import { liveWorkEnv, RPG_BUILDINGS_V3 } from '../work/env-v3'
import { facilitySpec } from './jobs'
import {
  PLACES_V3, placeSpecV3, professionById, PROFESSIONS, tradeOfCalling, tradePlaces, tradeProfessions, tradeResolver, TRADES, umaTrade, workPlace,
} from './professions'

describe('ten professions (PP1)', () => {
  it('splits into five gathering, one processing and four making, one place each', () => {
    expect(PROFESSIONS.map((p) => [p.id, p.kind, p.place])).toEqual([
      ['mining', 'gathering', 'mine'], ['wood-chopping', 'gathering', 'forest'], ['farming', 'gathering', 'fields'], ['fishing', 'gathering', 'fishery'],
      ['hunting', 'gathering', 'monster-den'], ['processing', 'processing', 'workbench'], ['weapon-crafting', 'making', 'forge'],
      ['armor-crafting', 'making', 'armorer'], ['accessory-crafting', 'making', 'charm-shop'], ['jewel-crafting', 'making', 'lapidary'],
    ])
    expect(professionById('jewel-crafting')?.name).toBe('Jewel Crafting')
  })

  it('keeps the engine\'s four job kinds: gather, refine, craft at the Forge, the Armorer and the Charm Shop, cut at the Lapidary', () => {
    expect(Object.fromEntries(PLACES_V3.map((p) => [p.id, p.kind]))).toEqual({
      mine: 'gather', forge: 'craft', forest: 'gather', armorer: 'craft', fields: 'gather', workbench: 'refine', fishery: 'gather',
      'charm-shop': 'craft', 'monster-den': 'gather', lapidary: 'cut',
    })
    for (const place of PLACES_V3) expect(professionById(place.profession)?.place).toBe(place.id)
    expect(PLACES_V3.filter((p) => p.kind === 'gather').map((p) => p.line)).toEqual(['metal', 'wood', 'vegetables', 'fish', 'stone'])
    expect(placeSpecV3('forge')?.made).toEqual(['weapon-gem', 'branch-gem'])
    expect(placeSpecV3('lapidary')?.made).toEqual(['jewel-planet', 'jewel-moon'])
    expect(placeSpecV3('quarry')).toBeUndefined()
  })

  it('answers a place by generation: today\'s facility to v16, R2\'s place from v17', () => {
    expect(workPlace('quarry', 16)).toEqual(facilitySpec('quarry'))
    expect(workPlace('quarry', 17)).toBeUndefined()
    expect(workPlace('armorer', 16)).toBeUndefined()
    expect(workPlace('armorer', 17)?.kind).toBe('craft')
    expect(workPlace('mine', 16)).toEqual(facilitySpec('mine'))
    // The live game (engine 17 since H82) works R2's places on R2's env.
    expect(workPlace('mine')).toEqual(workPlace('mine', 17))
    expect(workPlace('quarry')).toBeUndefined()
    expect(liveWorkEnv(1)).not.toBe(RPG_WORK_ENV)
    expect(liveWorkEnv(1).buildings).toBe(RPG_BUILDINGS_V3)
  })
})

describe('the trade (PP2, PP3)', () => {
  it('reads her calling\'s class, never anything else', () => {
    expect(Object.fromEntries(RPG_ALL_CLASSES.map((c) => [c, tradeOfCalling(c)]))).toEqual({
      brawler: 'physical', mage: 'magical', spellblade: 'physical-hybrid', summoner: 'magical-hybrid', paladin: 'healer', cleric: 'healer',
    })
  })

  it('pairs each trade\'s gathering and crafting places', () => {
    expect(Object.fromEntries(TRADES.map((t) => [t.id, tradePlaces(t.id)]))).toEqual({
      physical: ['mine', 'forge'], 'physical-hybrid': ['forest', 'armorer'], healer: ['fields', 'workbench'],
      'magical-hybrid': ['fishery', 'charm-shop'], magical: ['monster-den', 'lapidary'],
    })
    expect(tradeProfessions('healer')).toEqual(['farming', 'processing'])
    // Every profession belongs to exactly one trade.
    expect(TRADES.flatMap((t) => tradeProfessions(t.id)).sort()).toEqual(PROFESSIONS.map((p) => p.id).sort())
  })

  it('moves a Pace Uma between the Forest · Armorer and Monster Den · Lapidary trades by her pick (CP29)', () => {
    // An invented Pace Uma, Wit over Power: her pre-selection is the Mage, her other option the Spell Blade.
    const pace: CallingOutfit = {
      aptitudes: { strategy: { front: 'G', pace: 'A', late: 'G', end: 'G' }, distance: { sprint: 'G', mile: 'G', medium: 'A', long: 'G' } },
      baseStats: { power: 90, wit: 104 },
    }
    expect(umaTrade(pace)).toBe('magical')
    expect(umaTrade(pace, 'spellblade')).toBe('physical-hybrid')
    const world = { umas: { a: { calling: { pick: 'spellblade' as const } }, b: { calling: { pick: null } } } }
    const tradeOf = tradeResolver(world, (id) => (id === 'c' ? undefined : pace))
    expect(['a', 'b', 'c', 'nobody'].map(tradeOf)).toEqual(['physical-hybrid', 'magical', null, null])
  })
})
