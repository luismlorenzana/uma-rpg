// The Paladin's start and one healer a party with the switch off (H58): both are classes v2 rules, so the live game
// (engine v14) starts every Late surger as a Cleric and fights two Clerics together, as before. `healers-v2.test.ts`
// holds the same rules switched on.
import { describe, expect, it } from 'vitest'
import { STYLE_CLASSES } from '../roster/aptitudes'
import { BATTLE_ENGINE_VERSION } from '../rpg/battle/caps'
import { regionChapter, worldContinent } from '../world/world'
import { activeClass, chooseClass, healerBlock, ONE_HEALER, startFight, startingClass, styleClass, type BattleOutfit } from './battle'
import { convergenceBlock, riftFightBlock, signUpRift } from './rift'
import { OUTFITS as RIFT_OUTFITS, riftWorldSave, T, TWENTY } from './rift-rules.fixture'
import { setPartySlot, unlockUma, worldOf } from './rules'
import { newSave, type Save } from './save'

const outfit = (id: string, style: 'front' | 'pace' | 'late' | 'end', power = 110, wit = 110): BattleOutfit => ({
  outfitId: id, baseStats: { speed: 110, stamina: 110, power, guts: 110, wit },
  growthRatePercents: { speed: 10, stamina: 10, power: 0, guts: 0, wit: 20 },
  aptitudes: { strategy: { front: style === 'front' ? 'A' : 'G', pace: style === 'pace' ? 'A' : 'G', late: style === 'late' ? 'A' : 'G', end: style === 'end' ? 'A' : 'G' } },
})
const STYLES = ['front', 'pace', 'late', 'end'] as const

describe('the Paladin’s start (H58, §3.3)', () => {
  it('is a Late surger whose base Power beats her base Wit, from classes v2 only', () => {
    expect(BATTLE_ENGINE_VERSION).toBe(14)
    const strong = outfit('1', 'late', 120, 100), even = outfit('2', 'late', 110, 110), wise = outfit('3', 'late', 100, 120)
    expect([strong, even, wise].map((o) => startingClass(o, 15))).toEqual(['paladin', 'cleric', 'cleric'])
    expect([strong, even, wise].map((o) => startingClass(o))).toEqual(['cleric', 'cleric', 'cleric'])
    // The other styles start as before in both generations, whatever their stats.
    expect(STYLES.map((s) => startingClass(outfit('4', s, 120, 100), 15))).toEqual(['brawler', 'mage', 'paladin', 'summoner'])
    expect(STYLES.map((s) => startingClass(outfit('4', s, 120, 100)))).toEqual(['brawler', 'mage', 'cleric', 'summoner'])
    // Without base stats (an outfit always has them) she starts as her style's class.
    expect(startingClass({ aptitudes: strong.aptitudes }, 15)).toBe('cleric')
    expect(STYLE_CLASSES.late).toEqual(['Cleric'])
  })

  it('writes a Paladin start as her class, with no magical armor kinds; every other start stays null', () => {
    let save = newSave('Luis', T(0))
    save = unlockUma(save, '1', T(0), '1', 'paladin')
    save = unlockUma(save, '2', T(0), '1', 'cleric')
    save = unlockUma(save, '3', T(0), '1', 'brawler')
    const { umas } = worldOf(save)
    expect(umas['1']).toMatchObject({ classId: 'paladin', gear: { kinds: {} } })
    expect(umas['2']!.classId).toBeNull()
    expect(Object.keys(umas['2']!.gear.kinds)).toHaveLength(5)
    expect(umas['3']).toMatchObject({ classId: null, gear: { kinds: {} } })
  })

  it('keeps an unpicked Late surger a Cleric in both generations: her style’s class, not her start', () => {
    const strong = outfit('1', 'late', 120, 100)
    expect(styleClass(strong)).toBe('cleric')
    expect(activeClass(strong, { classId: null })).toBe('cleric')
    expect(activeClass(strong, { classId: 'mage' })).toBe('mage')
  })
})

describe('one healer a party is a classes v2 rule (H58)', () => {
  const cast = Array.from({ length: 7 }, (_, i) => ({ id: `cast${i}`, name: `Rival ${i}` }))
  const ura = regionChapter(worldContinent({ name: 'URA Finale', order: 1 }).regions[0]!, cast)
  const OUTFITS = new Map(['101', '102', '103', '104', '105'].map((id, i) => [id, outfit(id, STYLES[i % 4]!)]))

  it('still fights two Clerics together on engine v14', () => {
    let save: Save = newSave('Luis', T(0))
    for (const id of OUTFITS.keys()) save = unlockUma(save, id, T(0))
    ;[...OUTFITS.keys()].forEach((id, slot) => { save = setPartySlot(save, 0, slot, id, T(0)) })
    save = chooseClass(chooseClass(save, '101', 'cleric', T(1)), '102', 'cleric', T(1))
    const slots = worldOf(save).parties[0]!.slots as string[]
    expect(healerBlock(worldOf(save), slots, OUTFITS)).toBeNull()
    expect(healerBlock(worldOf(save), slots, OUTFITS, 15)).toBe(ONE_HEALER)
    const input = worldOf(startFight(save, ura, 'w1-1-1-s1', OUTFITS, T(2))).world.run.battle!.input
    expect(input.version).toBe(14)
    expect(input.allies.filter((a) => a.classId === 'cleric')).toHaveLength(3)
  })

  it('leaves the Rift’s checks as they were', () => {
    const save = chooseClass(signUpRift(riftWorldSave(), TWENTY, T(1)), '101', 'cleric', T(2))
    expect(riftFightBlock(save, { kind: 'front', front: 'iron', stage: 1 }, 0, '1', RIFT_OUTFITS)).toBeNull()
    const sealed: Save = JSON.parse(JSON.stringify(save))
    sealed.tierWorlds['1']!.rift.runs.at(-1)!.fronts = { iron: 12, arcane: 12, duel: 12, horde: 12 }
    expect(convergenceBlock(sealed, [0, 1, 2, 3], '1', RIFT_OUTFITS)).toBeNull()
  })
})
