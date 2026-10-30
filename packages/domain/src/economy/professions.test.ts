// The professions and trades (H77; profession-progression.md §2, §4.1, PP1–PP3, PP4; the farm by line, D224, FL1–FL3):
// ten professions in two kinds, ten places each one line's, one trade an Uma by her calling, and the place a job runs at
// by generation.
import { describe, expect, it } from 'vitest'
import { RPG_V2_CLASSES } from '../rpg/kinds'
import type { CallingOutfit } from '../roster/template'
import { RPG_WORK_ENV } from '../work/env'
import { liveWorkEnv } from '../work/env-v3'
import { RPG_BUILDINGS_V4 } from '../work/env-v4'
import { facilitySpec } from './jobs'
import { PLACES_V4, placeSpecV4, workPlace } from './places-v4'
import { professionById, PROFESSIONS, tradeOfCalling, tradePlaces, tradeProfessions, tradeResolver, TRADES, umaTrade } from './professions'

describe('fifteen professions (FL25)', () => {
  it('splits into five gathering, processing and making professions, one place each', () => {
    expect(PROFESSIONS.map((p) => [p.id, p.name, p.kind, p.place])).toEqual([
      ['mining', 'Mining', 'gathering', 'mine'], ['smelting', 'Smelting', 'processing', 'mine-workbench'],
      ['arms-crafting', 'Arms Crafting', 'making', 'weapon-forge'], ['farming', 'Farming', 'gathering', 'fields'],
      ['prepping', 'Prepping', 'processing', 'fields-workbench'], ['tome-crafting', 'Tome Crafting', 'making', 'tome-forge'],
      ['wood-chopping', 'Wood Chopping', 'gathering', 'forest'], ['sawing', 'Sawing', 'processing', 'forest-workbench'],
      ['armor-crafting', 'Armor Crafting', 'making', 'armorer'], ['fishing', 'Fishing', 'gathering', 'fishery'],
      ['filleting', 'Filleting', 'processing', 'fishery-workbench'], ['accessory-crafting', 'Accessory Crafting', 'making', 'charm-forge'],
      ['hunting', 'Hunting', 'gathering', 'monster-den'], ['stonecutting', 'Stonecutting', 'processing', 'den-workbench'],
      ['jewel-crafting', 'Jewel Crafting', 'making', 'lapidary'],
    ])
    expect(professionById('jewel-crafting')?.name).toBe('Jewel Crafting')
  })

  it('keeps the engine\'s four job kinds, exactly one per place', () => {
    expect(Object.fromEntries(PLACES_V4.map((p) => [p.id, p.kinds.join('+')]))).toEqual({
      mine: 'gather', 'mine-workbench': 'refine', 'weapon-forge': 'craft', fields: 'gather', 'fields-workbench': 'refine', 'tome-forge': 'craft',
      forest: 'gather', 'forest-workbench': 'refine', armorer: 'craft', fishery: 'gather', 'fishery-workbench': 'refine', 'charm-forge': 'craft',
      'monster-den': 'gather', 'den-workbench': 'refine', lapidary: 'cut',
    })
    for (const place of PLACES_V4) expect(professionById(place.profession)?.place).toBe(place.id)
    expect(PLACES_V4.filter((p) => p.kinds.includes('gather')).map((p) => p.line)).toEqual(['metal', 'vegetables', 'wood', 'fish', 'stone'])
    expect(placeSpecV4('weapon-forge')?.made).toEqual(['weapon-gem', 'branch-gem'])
    expect(placeSpecV4('lapidary')?.made).toEqual(['jewel-planet', 'jewel-moon'])
    expect(placeSpecV4('quarry')).toBeUndefined()
  })

  it('answers a place by generation: today\'s facility to v16, the Wilds\' place from v17', () => {
    expect(workPlace('quarry', 16)).toEqual(facilitySpec('quarry'))
    expect(workPlace('quarry', 17)).toBeUndefined()
    expect(workPlace('armorer', 16)).toBeUndefined()
    expect(workPlace('armorer', 17)).toEqual(placeSpecV4('armorer'))
    expect(workPlace('mine', 16)).toEqual(facilitySpec('mine'))
    // The live game (engine 17 since H82) works the Wilds' places on the farm by line's env (H112).
    expect(workPlace('mine')).toEqual(workPlace('mine', 17))
    expect(workPlace('quarry')).toBeUndefined()
    expect(liveWorkEnv(1)).not.toBe(RPG_WORK_ENV)
    expect(liveWorkEnv(1).buildings).toBe(RPG_BUILDINGS_V4)
  })
})

describe('the trade (PP2, PP3)', () => {
  it('reads her calling\'s class, never anything else', () => {
    expect(Object.fromEntries(RPG_V2_CLASSES.map((c) => [c, tradeOfCalling(c)]))).toEqual({
      brawler: 'physical', mage: 'magical', spellblade: 'physical-hybrid', summoner: 'magical-hybrid', paladin: 'healer', cleric: 'healer',
    })
  })

  it('gives each trade its gathering, processing and crafting places', () => {
    expect(Object.fromEntries(TRADES.map((t) => [t.id, tradePlaces(t.id)]))).toEqual({
      physical: ['mine', 'mine-workbench', 'weapon-forge'], 'physical-hybrid': ['forest', 'forest-workbench', 'armorer'],
      healer: ['fields', 'fields-workbench', 'tome-forge'], 'magical-hybrid': ['fishery', 'fishery-workbench', 'charm-forge'],
      magical: ['monster-den', 'den-workbench', 'lapidary'],
    })
    expect(tradeProfessions('healer')).toEqual(['farming', 'prepping', 'tome-crafting'])
    // Every profession belongs to exactly one trade.
    expect(TRADES.flatMap((t) => tradeProfessions(t.id)).sort()).toEqual(PROFESSIONS.map((p) => p.id).sort())
  })

  it('moves a Pace Uma between the Forest · Armorer and Monster Den · Lapidary trades by her pick (CP29, to v18)', () => {
    // An invented Pace Uma, Wit over Power: her pre-selection is the Mage, her other option the Spell Blade. The pick is
    // v18's; from v19 her Tier 0 names her trade (professions-v19.test.ts).
    const V18 = 18
    const pace: CallingOutfit = {
      aptitudes: { strategy: { front: 'G', pace: 'A', late: 'G', end: 'G' }, distance: { sprint: 'G', mile: 'G', medium: 'A', long: 'G' } },
      baseStats: { power: 90, wit: 104 },
    }
    expect(umaTrade(pace, null, V18)).toBe('magical')
    expect(umaTrade(pace, 'spellblade', V18)).toBe('physical-hybrid')
    const world = { umas: { a: { calling: { pick: 'spellblade' as const } }, b: { calling: { pick: null } } } }
    const tradeOf = tradeResolver(world, (id) => (id === 'c' ? undefined : pace), V18)
    expect(['a', 'b', 'c', 'nobody'].map(tradeOf)).toEqual(['physical-hybrid', 'magical', null, null])
  })
})
