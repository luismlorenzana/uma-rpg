// The Exchange's Class Manual sheet from the switch (H132, CV §14.3; inert until H134), with the switch mocked to 19: CV
// §8.7's Uma A after the reset (Front A, 21 Manuals), her five Tier 0 bars with her calling's first, "To Rank 10", "Her
// share" counting down as she reads, and a Tier 0 at Rank 10 banking EXP for her promotion up to the bank's room. Made-up
// outfits only.
import { newOwnedUma, newTierWorld, readManuals, newSave, type BattleOutfit, type ClassesV3Record, type RpgClass, type Save, type TierWorld } from '@rpg/domain'
import { describe, expect, it, vi } from 'vitest'
import { manualBars, manualCounts, manualFooter, manualHead, manualStep, toRankTen } from './manual-view'

vi.mock('../../../../../packages/domain/src/rpg/battle/caps', async (orig) =>
  (await import('../../../../../packages/domain/src/rpg/battle/caps-at.fixture')).capsAt(19, await orig()))

const NOW = '2026-10-29T12:00:00.000Z'
const A = '81001'
const stats = { speed: 100, stamina: 100, power: 110, guts: 100, wit: 90 }
const outfit = (outfitId: string, style: 'front' | 'late'): BattleOutfit => ({
  outfitId, baseStats: stats, growthRatePercents: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0 },
  aptitudes: { strategy: { front: 'B', pace: 'B', late: 'B', end: 'B', [style]: 'A' }, distance: { sprint: 'B', mile: 'B', medium: 'A', long: 'B' } },
})
/** Uma A: Front A, so her calling's Tier 0 is the Recruit. */
const OUTFIT = outfit(A, 'front')
const recruit = { kind: 'class', id: 'recruit' } as const
const brawler = { kind: 'class', id: 'brawler' } as const

/** Tier 1 just after the reset: Uma A with no Class Rank and her share of 21 unread; the world's 78,000 Class Marks. */
function world(ranks: TierWorld['umas'][string]['ranks']['classes'] = {}): TierWorld {
  const w = newTierWorld(NOW, 3)
  w.wallet.classMarks = 78_000
  w.umas[A] = { ...newOwnedUma(NOW), classId: null, ranks: { classes: ranks } }
  const record: ClassesV3Record = {
    manuals: 78, marks: 78_000, traded: true, seen: true, halls: [],
    umas: { [A]: { classId: 'brawler', ranks: { brawler: { rank: 34, exp: 300 }, paladin: { rank: 12, exp: 100 } }, pick: null, manuals: 21, left: 21 } },
  }
  w.classesV3 = record
  return w
}
/** The world read through the domain's `readManuals`, as the sheet's footer does. */
function read(w: TierWorld, ref: { kind: 'class'; id: RpgClass }, n: number): TierWorld {
  const save: Save = { ...newSave('Tester', NOW), tierWorlds: { '1': w } }
  return readManuals(save, A, ref, n, NOW, '1').tierWorlds['1']!
}

describe('the Manual sheet from v19, Tier 1\'s world', () => {
  it('lists the five Tier 0s, her calling\'s Recruit first "R1/10 · Calling", and no Tier 1 class she doesn\'t hold', () => {
    const bars = manualBars(OUTFIT, world().umas[A]!, 1)
    expect(bars.map((b) => [b.name, b.caption])).toEqual([
      ['Recruit', 'R1/10 · Calling'], ['Duelist', 'R1/10'], ['Acolyte', 'R1/10'], ['Caller', 'R1/10'], ['Initiate', 'R1/10'],
    ])
    expect(bars[0]!.fill).toEqual({ value: 0, max: 272 })
    // A Late A Uma's calling is the Acolyte: hers comes first.
    expect(manualBars(outfit('81002', 'late'), world().umas[A]!, 1)[0]!.name).toBe('Acolyte')
  })

  it('counts 1, 5, 10, To Rank 10 · 4, Her share · 21 and Max · 78, and starts on her share', () => {
    const counts = manualCounts(world(), A, recruit, 1)
    expect(counts.map((c) => [c.label, c.count, c.block])).toEqual([
      ['1', 1, null], ['5', 5, null], ['10', 10, null], ['To Rank 10 · 4', 4, null], ['Her share · 21', 21, null], ['Max · 78', 78, null],
    ])
    expect(manualHead('Uma A', world(), A)).toMatchObject({ line: 'Uma A · Class Marks 78,000', share: 'Her share · 21' })
  })

  it('reads her share on her Recruit to Rank 10 with the rest waiting: Recruit R1 → R10 · +17,400 EXP waiting', () => {
    expect(manualStep(world().umas[A]!, recruit, 21).text).toBe('Recruit R1 → R10 · +17,400 EXP waiting')
    expect(manualFooter(world(), A, recruit, 21, 1)).toMatchObject({ label: 'Read 21 · 21,000 Class Marks', block: null })
  })

  it('counts her share down as she reads, on any bar, and drops the chip at 0', () => {
    const after = read(world(), recruit, 16)
    expect(manualBars(OUTFIT, after.umas[A]!, 1)[0]!.caption).toBe('R10 · +12,400 EXP waiting')
    expect(manualCounts(after, A, recruit, 1).find((c) => c.key === 'share')!.label).toBe('Her share · 5')
    expect(manualHead('Uma A', after, A).share).toBe('Her share · 5')
    const done = read(after, { kind: 'class', id: 'duelist' }, 5)
    expect(manualCounts(done, A, recruit, 1).some((c) => c.key === 'share')).toBe(false)
    expect(manualHead('Uma A', done, A).share).toBeNull()
  })

  it('takes "To Rank 10" from her track: 3,600 less what she has, in whole Manuals', () => {
    expect(toRankTen('recruit', { rank: 1, exp: 0 })).toBe(4)
    expect(toRankTen('recruit', { rank: 4, exp: 100 })).toBe(3) // 912 + 100 in: 2,588 to go
    expect(toRankTen('recruit', { rank: 9, exp: 528 - 1 })).toBe(1)
  })

  it('banks past Rank 10 for her promotion: "R10 · +400 EXP waiting", no To Rank 10, the counts capped at the room left', () => {
    const w = world({ recruit: { rank: 10, exp: 400 } })
    expect(manualBars(OUTFIT, w.umas[A]!, 1)[0]).toMatchObject({ caption: 'R10 · +400 EXP waiting', fill: { value: 400, max: 23_680 } })
    expect(manualCounts(w, A, recruit, 1).map((c) => c.label)).toEqual(['1', '5', '10', 'Her share · 21', 'Max · 24'])
    // 3,680 of room: four Manuals, the fourth passing the bank by 320 (half back as Class Marks).
    const tight = world({ recruit: { rank: 10, exp: 20_000 } })
    expect(manualCounts(tight, A, recruit, 1).map((c) => [c.label, c.block])).toEqual([
      ['1', null], ['5', 'Room for 4'], ['10', 'Room for 4'], ['Her share · 21', 'Room for 4'], ['Max · 4', null],
    ])
    expect(manualStep(tight.umas[A]!, recruit, 4).text).toBe('Recruit R10 → R10 · +23,680 EXP waiting · +160 Class Marks back')
    const full = world({ recruit: { rank: 10, exp: 23_680 } })
    expect(manualFooter(full, A, recruit, 1, 1)).toEqual({ step: null, label: 'Already at the top rank', block: 'Already at the top rank' })
  })

  it('lists a held Brawler after the Tier 0s; the Arms Summoner she could promote into isn\'t listed', () => {
    const bars = manualBars(OUTFIT, world({ recruit: { rank: 10, exp: 0 }, brawler: { rank: 10, exp: 0 } }).umas[A]!, 1)
    expect(bars.map((b) => b.ref.id)).toEqual(['recruit', 'duelist', 'acolyte', 'caller', 'apprentice', 'brawler'])
    expect(bars[0]!.caption).toBe('R10/10 · Calling')
    expect(bars.at(-1)).toMatchObject({ name: 'Brawler', caption: 'R10' })
    const w = world({ recruit: { rank: 10, exp: 0 }, brawler: { rank: 10, exp: 0 } })
    expect(manualCounts(w, A, brawler, 1).map((c) => c.key)).toEqual(['1', '5', '10', 'share', 'max'])
  })
})

describe('the Manual sheet from v19, a later tier\'s world', () => {
  it('lists the eight Tier 1 classes, her active class first, with no To Rank 10', () => {
    const w = world()
    w.umas[A] = { ...w.umas[A]!, classId: 'paladin', ranks: { classes: { paladin: { rank: 3, exp: 0 } } } }
    const bars = manualBars(OUTFIT, w.umas[A]!, 2)
    expect(bars.map((b) => b.ref.id)).toEqual(['paladin', 'brawler', 'spellblade', 'armsummoner', 'cleric', 'summoner', 'tomeblade', 'mage'])
    expect(bars[0]!.caption).toBe('R3')
    expect(manualCounts(w, A, { kind: 'class', id: 'paladin' }, 2).some((c) => c.key === 'rank10')).toBe(false)
  })
})
