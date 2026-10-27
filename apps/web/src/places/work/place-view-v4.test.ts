// The farm by line's place pages as data (H111; farm-by-line.md FL2, FL5, FL6, FL16, FL22): a gathering place's ten raw
// tiles, a making place's Process tiles and Make chips with their gates, each job's kind and sizes, the opening job,
// the (i) and the quick look. Pure helpers: they don't read the switch.
import { REFINE_BATCHES } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { gatherTilesV4, helpLinesV4, initialJobV4, jobKindAtV4, jobSizesV4, makeGroupsV4, peekV4, processTilesV4 } from './place-view-v4'

describe('the farm by line\'s What step (FL22)', () => {
  it('lists a gathering place\'s ten raw items, grade g open at Craft Lv 5g − 4', () => {
    const tiles = gatherTilesV4('metal', 5)
    expect(tiles.map((t) => t.id)).toEqual(['copper-ore', 'tin-ore', 'iron-ore', 'silver-ore', 'cobalt-ore', 'gold-ore', 'platinum-ore', 'titanium-ore',
      'mythril-ore', 'orichalcum-ore'])
    expect(tiles.map((t) => t.locked)).toEqual([null, 'From Craft Lv 6', 'From Craft Lv 11', 'From Craft Lv 16', 'From Craft Lv 21', 'From Craft Lv 26',
      'From Craft Lv 31', 'From Craft Lv 36', 'From Craft Lv 41', 'From Craft Lv 46'])
    expect(gatherTilesV4('metal', 6)[1]!.locked).toBeNull()
    expect(gatherTilesV4('fish', 50).map((t) => t.id).slice(0, 3)).toEqual(['carp', 'trout', 'sardine'])
  })

  it('gives a making place its line\'s refined tiles and its item\'s chips', () => {
    expect(processTilesV4('vegetables', 1).map((t) => t.id).slice(0, 3)).toEqual(['chopped-carrot', 'diced-potato', 'shredded-cabbage'])
    const forge = makeGroupsV4('forge', 11)
    expect(forge).toHaveLength(1)
    expect(forge[0]!.chips.map((c) => c.id)).toEqual(Array.from({ length: 10 }, (_, i) => `weapon-gem-g${i + 1}`))
    expect(forge[0]!.chips.map((c) => c.locked === null)).toEqual([true, true, true, false, false, false, false, false, false, false])
    expect(makeGroupsV4('workbench', 1)[0]!.chips[0]!.id).toBe('tome-ink-g1')
    expect(makeGroupsV4('armorer', 1)[0]!.chips[9]!.id).toBe('armor-fittings-g10')
    expect(makeGroupsV4('charm-shop', 1)[0]!.chips[0]!.id).toBe('accessory-setting-g1')
    const lapidary = makeGroupsV4('lapidary', 21)
    expect(lapidary.map((g) => [g.label, g.chips.map((c) => `${c.label}:${c.grade}:${c.locked === null}`)])).toEqual([
      ['Planet', ['I:1:true', 'II:3:true', 'III:5:true', 'IV:7:false', 'V:9:false']],
      ['Moon', ['I:2:true', 'II:4:true', 'III:6:false', 'IV:8:false', 'V:10:false']],
    ])
    expect(makeGroupsV4('mine', 50)).toEqual([])
  })

  it('tells each job\'s kind and sizes: process ×1 … ×40, make and gather 1–10', () => {
    expect(['copper-ore', 'copper-ingot', 'weapon-gem-g1'].map((id) => jobKindAtV4('forge', id))).toEqual(['refine', 'refine', 'craft'])
    expect(jobKindAtV4('mine', 'tin-ore')).toBe('gather')
    expect(jobKindAtV4('lapidary', 'jewel-planet-1')).toBe('cut')
    expect(jobKindAtV4('lapidary', 'cut-ruby')).toBe('refine')
    expect(jobSizesV4('refine')).toBe(REFINE_BATCHES)
    expect(jobSizesV4('craft')).toBeUndefined()
    expect(jobSizesV4('gather')).toBeUndefined()
  })

  it('opens on the highest grade she can take', () => {
    expect(initialJobV4('forge', 12)).toBe('weapon-gem-g3')
    expect(initialJobV4('forge', 1)).toBe('weapon-gem-g1')
    expect(initialJobV4('mine', 26)).toBe('gold-ore')
    expect(initialJobV4('lapidary', 16)).toBe('jewel-moon-2')
  })

  it('says what each place does (FL16) and shows it in the quick look', () => {
    expect(helpLinesV4('mine')[0]).toBe('Gathers metal, G1–G10. Grade g opens at Craft Lv 5g − 4.')
    expect(helpLinesV4('forge').slice(0, 2)).toEqual([
      'Processes its line’s raw items into refined ones, one for one, in a quarter of a gather.',
      'Makes Arms Gems from Ingots, three quarters of a gather for each Ingot. Grade g opens at Craft Lv 5g − 4.',
    ])
    expect(helpLinesV4('workbench')[1]).toContain('Tome Ink from vegetable cuts')
    expect(peekV4('fields')).toEqual({ icons: ['carrot', 'potato', 'cabbage', 'onion', 'tomato', 'bell-pepper', 'eggplant', 'asparagus', 'golden-carrot', 'emperor-pumpkin'] })
    const forge = peekV4('forge')
    expect('process' in forge && forge.process).toBe('Processes Metal G1–G10')
    expect('chips' in forge && forge.chips).toHaveLength(10)
    expect('chips' in peekV4('lapidary') && (peekV4('lapidary') as { chips: unknown[] }).chips).toHaveLength(10)
  })
})
