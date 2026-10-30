// One healer a party and the Paladin's start with the switch on (H58, classes v2 C8 and §3.3), the live game since H61
// (D188); `starting-class-v2.test.ts` holds the same rules at engine 14. Classes v3 keeps one healer a party (CV22, live
// since H134): the Paladin and the Cleric are Tier 1 classes, held once promoted from the Acolyte, and a Tier 0 is no
// healer. The Paladin's start is v15–v18's, engine 18 explicit.
import { describe, expect, it } from 'vitest'
import type { RpgClass, RpgTier0Class, RpgTier1Class } from '../rpg/kinds'
import { BALANCE_PARTY } from '../world/balance-party'
import { regionChapter, worldContinent } from '../world/world'
import { activeClass, chooseClass, healerBlock, ONE_HEALER, promoteUma, startFight, startingClass, type BattleOutfit } from './battle'
import { beginConvergence, convergenceBlock, riftFightBlock, signUpRift, startRiftFight, sweepEcho } from './rift'
import { ids, OUTFITS as RIFT_OUTFITS, riftWorldSave, ROSTER, T, TWENTY } from './rift-rules.fixture'
import { setPartySlot, unlockUma, worldOf } from './rules'
import { gearV1, newOwnedUma, newSave, type OwnedUma, type Save, type TierWorld } from './save'


const cast = Array.from({ length: 7 }, (_, i) => ({ id: `cast${i}`, name: `Rival ${i}` }))
const ura = regionChapter(worldContinent({ name: 'Test Circuit', order: 1 }).regions[0]!, cast)
const S1 = 'w1-1-1-s1'
// Invented outfits only: 103 is a Late surger with Power and Wit even, so she starts as an Acolyte (to v18 a Cleric).
const outfit = (id: string, style: 'front' | 'pace' | 'late' | 'end', power = 110): BattleOutfit => ({
  outfitId: id, baseStats: { speed: 110, stamina: 110, power, guts: 110, wit: 110 },
  growthRatePercents: { speed: 10, stamina: 10, power: 0, guts: 0, wit: 20 },
  aptitudes: { strategy: { front: style === 'front' ? 'A' : 'G', pace: style === 'pace' ? 'A' : 'G', late: style === 'late' ? 'A' : 'G', end: style === 'end' ? 'A' : 'G' }, distance: { sprint: 'G', mile: 'G', medium: 'A', long: 'G' } },
})
const OUTFITS = new Map([['101', outfit('101', 'front')], ['102', outfit('102', 'pace')], ['103', outfit('103', 'late')],
  ['104', outfit('104', 'end')], ['105', outfit('105', 'front')]])

/** Tier 1 changed in place of a rule (test setup only). */
const edit = (save: Save, change: (w: TierWorld) => void): Save => {
  const copy: Save = JSON.parse(JSON.stringify(save))
  change(copy.tierWorlds['1']!)
  return copy
}
/** Uma `id` with `from` at Class Rank 10, promoted into `to` (CV8): she holds it and fights as it. */
const promoted = (save: Save, id: string, from: RpgTier0Class, to: RpgTier1Class): Save =>
  promoteUma(edit(save, (w) => { w.umas[id]!.ranks.classes[from] = { rank: 10, exp: 0 } }), id, from, to, T(1))
/** Five Umas unlocked in their starting classes (their Tier 0), in party 0; 101 a Paladin and 103 a Cleric. */
function worldMap(): Save {
  let save = newSave('Luis', T(0))
  for (const o of OUTFITS.values()) save = unlockUma(save, o.outfitId, T(0), '1', startingClass(o))
  ;[...OUTFITS.keys()].forEach((id, slot) => { save = setPartySlot(save, 0, slot, id, T(0)) })
  return promoted(promoted(save, '101', 'acolyte', 'paladin'), '103', 'acolyte', 'cleric')
}

/** Each balance-party class's Tier 0 (CV8): who she promoted from. */
const PARENT: Readonly<Partial<Record<RpgClass, RpgTier0Class>>> = { brawler: 'recruit', mage: 'apprentice', spellblade: 'recruit', cleric: 'acolyte',
  summoner: 'caller', paladin: 'acolyte' }
/** Her Tier 1 class as Tier 1's world holds it: it and her Tier 0 at Class Rank 10. */
const holding = (uma: OwnedUma, classId: RpgClass): OwnedUma =>
  ({ ...uma, classId, ranks: { ...uma.ranks, classes: { [PARENT[classId]!]: { rank: 10, exp: 0 }, [classId]: { rank: 10, exp: 0 } } } })
/** The Rift's fixture signed up, each Uma holding her balance-party class (party 0: Brawler, Mage, Spell Blade, Cleric,
 * Summoner), with 101 a Paladin. */
const riftWithPaladin = (): Save => edit(signUpRift(riftWorldSave(), TWENTY, T(1)), (w) => {
  ids(101, 25).forEach((id, i) => { w.umas[id] = holding(w.umas[id]!, i === 0 ? 'paladin' : BALANCE_PARTY[i % BALANCE_PARTY.length]!) })
})
const IRON1 = { kind: 'front', front: 'iron', stage: 1 } as const
const ECHO = { kind: 'echo', front: 'iron', level: '50' } as const

describe('one healer a party, with the switch on (H58, C8; CV22)', () => {
  it('starts a world-map fight with one healer and refuses a Paladin and a Cleric together', () => {
    const save = worldMap()
    expect(healerBlock(worldOf(save), ['101', '102', '103', '104', '105'], OUTFITS)).toBe(ONE_HEALER)
    expect(ONE_HEALER).toBe('One healer a party')
    expect(() => startFight(save, ura, S1, OUTFITS, T(2))).toThrow('One healer a party')
    // Back on her Acolyte, 103 is no healer (a Tier 0 is none).
    const one = startFight(chooseClass(save, '103', 'acolyte', T(2)), ura, S1, OUTFITS, T(3))
    const input = worldOf(one).world.run.battle!.input
    expect(input.version).toBe(19)
    expect(input.allies.map((a) => a.classId)).toEqual(['paladin', 'duelist', 'acolyte', 'caller', 'recruit'])
  })

  it('never refuses a party edit or a class switch, whatever it leaves', () => {
    const save = chooseClass(worldMap(), '103', 'acolyte', T(2))
    const two = chooseClass(save, '103', 'cleric', T(3))
    expect(activeClass(OUTFITS.get('103')!, worldOf(two).umas['103']!)).toBe('cleric')
    expect(() => setPartySlot(two, 1, 0, '103', T(4))).not.toThrow()
    expect(() => startFight(two, ura, S1, OUTFITS, T(4))).toThrow('One healer a party')
  })

  it('refuses a Rift front or Echo fight with two healers, given the outfits', () => {
    const save = riftWithPaladin()
    expect(riftFightBlock(save, IRON1, 0, '1', RIFT_OUTFITS)).toBe(ONE_HEALER)
    expect(riftFightBlock(save, ECHO, 0, '1', RIFT_OUTFITS)).toBe(ONE_HEALER)
    expect(riftFightBlock(save, IRON1, 1, '1', RIFT_OUTFITS)).toBeNull()
    // The world party's other checks come first.
    expect(riftFightBlock(save, IRON1, 4, '1', RIFT_OUTFITS)).toBe('Only the run’s twenty fight here')
    expect(() => startRiftFight(save, IRON1, 0, RIFT_OUTFITS, ROSTER, T(3))).toThrow('One healer a party')
    const started = startRiftFight(save, IRON1, 1, RIFT_OUTFITS, ROSTER, T(3))
    expect(worldOf(started).rift.battle!.input.version).toBe(19)
  })

  it('refuses to begin a Convergence attempt with two healers in any of its parties, and its frozen fight with two', () => {
    const sealed = edit(riftWithPaladin(), (w) => { w.rift.runs.at(-1)!.fronts = { iron: 12, arcane: 12, duel: 12, horde: 12 } })
    expect(convergenceBlock(sealed, [0, 1, 2, 3], '1', RIFT_OUTFITS)).toBe(ONE_HEALER)
    expect(convergenceBlock(sealed, [1, 2, 3, 0], '1', RIFT_OUTFITS)).toBe(ONE_HEALER)
    expect(() => beginConvergence(sealed, [0, 1, 2, 3], T(3), '1', RIFT_OUTFITS)).toThrow('One healer a party')
    const fixed = chooseClass(sealed, '101', 'acolyte', T(3))
    expect(convergenceBlock(fixed, [0, 1, 2, 3], '1', RIFT_OUTFITS)).toBeNull()
    expect(worldOf(beginConvergence(fixed, [0, 1, 2, 3], T(4), '1', RIFT_OUTFITS)).rift.runs.at(-1)!.convergence.open!.parties[0]).toContain('101')
    // An attempt frozen with two healers (none in the guidance) can't fight its next fight; the player abandons it.
    const frozen = beginConvergence(sealed, [0, 1, 2, 3], T(4))
    expect(riftFightBlock(frozen, { kind: 'convergence', fight: 0 }, null, '1', RIFT_OUTFITS)).toBe(ONE_HEALER)
    expect(riftFightBlock(chooseClass(frozen, '104', 'acolyte', T(5)), { kind: 'convergence', fight: 0 }, null, '1', RIFT_OUTFITS)).toBeNull()
  })

  it('pays a Sweep with two healers: nothing fights', () => {
    const save = edit(riftWithPaladin(), (w) => { w.rift.echoes = { iron: { '50': T(0) } }; w.wallet.sweepTickets = 1 })
    const swept = sweepEcho(save, 'iron', '50', 0, 1, RIFT_OUTFITS, T(3))
    expect(swept.swept).toBe(1)
    expect(swept.result.members.map((m) => m.outfitId)).toEqual(['101', '102', '103', '104', '105'])
    expect(worldOf(swept.save).umas['101']!.ranks.classes.paladin!.exp).toBeGreaterThan(0)
  })
})

describe('the Paladin’s start, v15–v18 (H58, §3.3), engine 18 explicit', () => {
  it('starts a Late surger whose Power beats her Wit as a Paladin, in physical armor, and keeps unpicked Umas in their style’s class', () => {
    const strong = outfit('201', 'late', 111)
    expect(startingClass(strong, 18)).toBe('paladin')
    expect(startingClass(outfit('202', 'late'), 18)).toBe('cleric')
    const uma = newOwnedUma(T(0), startingClass(strong, 18), 18)
    expect(uma.classId).toBe('paladin')
    expect(gearV1(uma).kinds).toEqual({})
    expect(activeClass(strong, uma, 1, 18)).toBe('paladin')
    // An Uma who never picked keeps her style's class at the switch: a Late surger stays a Cleric.
    expect(activeClass(strong, { classId: null }, 1, 18)).toBe('cleric')
    // From v19 she starts as her Acolyte in Tier 1's world, read as the Paladin (her suggested promotion) in a later one.
    expect([startingClass(strong), startingClass(strong, 19, 2)]).toEqual(['acolyte', 'paladin'])
  })
})
