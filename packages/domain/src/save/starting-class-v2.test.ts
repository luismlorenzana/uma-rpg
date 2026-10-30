// The Paladin's start and one healer a party by generation (H58): both are classes v2 rules, so engine v14 started every
// Late surger as a Cleric and let two Clerics fight together, and the game since H61 (D188) doesn't. From v16 (live from
// H72, D210) her start is her calling (`starting-class-v16.test.ts`), which keeps the Paladin's for a Late surger to v18;
// from v19 (Classes v3, live since H134) she starts as her Acolyte and holds the Paladin once promoted. `healers-v2.test.ts`
// holds the live rules where a party fights.
import { describe, expect, it } from 'vitest'
import { BATTLE_ENGINE_VERSION } from '../rpg/battle/caps'
import { regionChapter, worldContinent } from '../world/world'
import { activeClass, healerBlock, ONE_HEALER, startFight, startingClass, styleClass, type BattleOutfit } from './battle'
import { T } from './rift-rules.fixture'
import { setPartySlot, unlockUma, worldOf } from './rules'
import { armorHalf } from '../economy/grades'
import { newSave, type Save, type TierWorld } from './save'

const outfit = (id: string, style: 'front' | 'pace' | 'late' | 'end', power = 110, wit = 110): BattleOutfit => ({
  outfitId: id, baseStats: { speed: 110, stamina: 110, power, guts: 110, wit },
  growthRatePercents: { speed: 10, stamina: 10, power: 0, guts: 0, wit: 20 },
  aptitudes: { strategy: { front: style === 'front' ? 'A' : 'G', pace: style === 'pace' ? 'A' : 'G', late: style === 'late' ? 'A' : 'G', end: style === 'end' ? 'A' : 'G' }, distance: { sprint: 'G', mile: 'G', medium: 'A', long: 'G' } },
})
const STYLES = ['front', 'pace', 'late', 'end'] as const

describe('the Paladin’s start (H58, §3.3)', () => {
  it('is a Late surger whose base Power beats her base Wit, from classes v2 to v18 (her calling from v16); from v19 her Acolyte', () => {
    expect(BATTLE_ENGINE_VERSION).toBe(19)
    const strong = outfit('1', 'late', 120, 100), even = outfit('2', 'late', 110, 110), wise = outfit('3', 'late', 100, 120)
    expect([strong, even, wise].map((o) => startingClass(o, 15))).toEqual(['paladin', 'cleric', 'cleric'])
    expect([strong, even, wise].map((o) => startingClass(o, 14))).toEqual(['cleric', 'cleric', 'cleric'])
    expect([strong, even, wise].map((o) => startingClass(o, 18))).toEqual(['paladin', 'cleric', 'cleric'])
    expect([strong, even, wise].map((o) => startingClass(o))).toEqual(['acolyte', 'acolyte', 'acolyte'])
    // The other styles start as before in both generations, whatever their stats.
    expect(STYLES.map((s) => startingClass(outfit('4', s, 120, 100), 15))).toEqual(['brawler', 'mage', 'paladin', 'summoner'])
    expect(STYLES.map((s) => startingClass(outfit('4', s, 120, 100), 14))).toEqual(['brawler', 'mage', 'cleric', 'summoner'])
    // Without base stats (an outfit always has them) she starts as her style's class.
    expect(startingClass({ aptitudes: strong.aptitudes }, 15)).toBe('cleric')
  })

  it('writes a Paladin start as her class, on the physical half; from v16 every start is written (H67; v28: the half is her class’s, H82)', () => {
    let save = newSave('Luis', T(0))
    save = unlockUma(save, '1', T(0), '1', 'paladin')
    save = unlockUma(save, '2', T(0), '1', 'cleric')
    save = unlockUma(save, '3', T(0), '1', 'brawler')
    const { umas } = worldOf(save)
    expect(umas['1']).toMatchObject({ classId: 'paladin', gear: { weapons: {}, armor: {}, accessories: [{ grade: 0, family: null, form: 'base' }] } })
    expect(umas['2']!.classId).toBe('cleric')
    expect(umas['3']).toMatchObject({ classId: 'brawler', gear: { weapons: {}, armor: {}, accessories: [{ grade: 0, family: null, form: 'base' }] } })
    expect([armorHalf('paladin'), armorHalf('cleric'), armorHalf('brawler')]).toEqual(['physical', 'magical', 'physical'])
  })

  it('keeps an unpicked Late surger a Cleric in both generations: her style’s class, not her start', () => {
    const strong = outfit('1', 'late', 120, 100)
    expect(styleClass(strong)).toBe('cleric')
    expect([activeClass(strong, { classId: null }, 1, 14), activeClass(strong, { classId: null }, 1, 18)]).toEqual(['cleric', 'cleric'])
    expect(activeClass(strong, { classId: 'mage' })).toBe('mage')
    // From v19 a null class reads her world: her calling's Tier 0 in Tier 1's (CV10).
    expect(activeClass(strong, { classId: null })).toBe('acolyte')
  })
})

describe('one healer a party is a classes v2 rule (H58)', () => {
  const cast = Array.from({ length: 7 }, (_, i) => ({ id: `cast${i}`, name: `Rival ${i}` }))
  const ura = regionChapter(worldContinent({ name: 'Test Circuit', order: 1 }).regions[0]!, cast)
  const OUTFITS = new Map(['101', '102', '103', '104', '105'].map((id, i) => [id, outfit(id, STYLES[i % 4]!)]))

  it('let three Clerics fight together on engine v14; the live game refuses them (H61)', () => {
    let save: Save = newSave('Luis', T(0))
    for (const id of OUTFITS.keys()) save = unlockUma(save, id, T(0))
    ;[...OUTFITS.keys()].forEach((id, slot) => { save = setPartySlot(save, 0, slot, id, T(0)) })
    // 101 and 102 Clerics, promoted from the Acolyte (v19's Tier 1 world holds them so); 103, a Late Uma with no class, is
    // her style's Cleric to v18 and her Acolyte, no healer, from v19.
    const w: TierWorld = JSON.parse(JSON.stringify(worldOf(save)))
    for (const id of ['101', '102']) w.umas[id] = { ...w.umas[id]!, classId: 'cleric', ranks: { ...w.umas[id]!.ranks, classes: { acolyte: { rank: 10, exp: 0 }, cleric: { rank: 10, exp: 0 } } } }
    save = { ...save, tierWorlds: { ...save.tierWorlds, '1': w } }
    const slots = worldOf(save).parties[0]!.slots as string[]
    expect(healerBlock(worldOf(save), slots, OUTFITS, 14)).toBeNull()
    expect(healerBlock(worldOf(save), slots, OUTFITS, 15)).toBe(ONE_HEALER)
    expect(healerBlock(worldOf(save), slots, OUTFITS)).toBe(ONE_HEALER)
    expect(() => startFight(save, ura, 'w1-1-1-s1', OUTFITS, T(2))).toThrow(ONE_HEALER)
  })
})
