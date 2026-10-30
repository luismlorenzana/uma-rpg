// The Exchange's Class Manual sheet (H132, CV §14.3; live since H134). On a Tier 1 class she holds: the counts 1 · 5 · 10 ·
// Max by her Marks, before → after on the class's own curve, and a bar at Rank 50 blocked with `manualBlock`'s reason (no
// "To Rank 10", no "Her share" without the reset's record). Then CV §8.7's Uma A after the reset (Front A, 21 Manuals): her
// five Tier 0 bars with her calling's first, "To Rank 10", "Her share" counting down as she reads, and a Tier 0 at Rank 10
// banking EXP for her promotion up to the bank's room. Made-up outfits only.
import { newOwnedUma, newTierWorld, readManuals, newSave, type BattleOutfit, type ClassesV3Record, type RpgClass, type Save, type TierWorld } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { firstBar, firstCount, manualBars, manualCounts, manualFooter, manualHead, manualStep, readLabel, toRankTen } from './manual-view'

const NOW = '2026-10-29T12:00:00.000Z'
const ID = '81001'
const stats = { speed: 100, stamina: 100, power: 110, guts: 100, wit: 90 }
const outfit = (outfitId: string, style: 'front' | 'late'): BattleOutfit => ({
  outfitId, baseStats: stats, growthRatePercents: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0 },
  aptitudes: { strategy: { front: 'B', pace: 'B', late: 'B', end: 'B', [style]: 'A' }, distance: { sprint: 'B', mile: 'B', medium: 'A', long: 'B' } },
})
/** Front A: her calling's Tier 0 is the Recruit. */
const OUTFIT = outfit(ID, 'front')

/** Tier 1 with her: a Brawler R34 (no bar yet) and a Paladin at Rank 50, both held, 78,000 Class Marks. */
function world(marks = 78_000): TierWorld {
  const w = newTierWorld(NOW, 3)
  w.wallet.classMarks = marks
  w.umas[ID] = { ...newOwnedUma(NOW), classId: 'brawler', ranks: { classes: { brawler: { rank: 34, exp: 0 }, paladin: { rank: 50, exp: 0 } } } }
  return w
}
const brawler = { kind: 'class', id: 'brawler' } as const
const paladin = { kind: 'class', id: 'paladin' } as const

describe('the Manual sheet on a Tier 1 class she holds', () => {
  it('lists the five Tier 0s, then her held Tier 1 classes: "R34" with its bar; Rank 50 reads Max', () => {
    const bars = manualBars(OUTFIT, world().umas[ID]!, 1)
    expect(bars.map((b) => b.ref.id)).toEqual(['recruit', 'duelist', 'acolyte', 'caller', 'apprentice', 'brawler', 'paladin'])
    expect(bars.map((b) => b.name)).toEqual(['Recruit', 'Duelist', 'Acolyte', 'Caller', 'Initiate', 'Brawler', 'Paladin'])
    const of = (id: string) => bars.find((b) => b.ref.id === id)!
    expect(of('brawler')).toMatchObject({ caption: 'R34', fill: { value: 0, max: 120 + 16 * 34 }, calling: false })
    expect(of('duelist').caption).toBe('R1/10')
    expect(of('paladin')).toMatchObject({ caption: 'R50 · Max', fill: { value: 1, max: 1 } })
    expect(firstBar(bars, OUTFIT, world().umas[ID]!, 1)).toBe('brawler')
  })

  it('counts 1, 5, 10 and Max by the Marks, with no Tier 0 count and no share', () => {
    const counts = manualCounts(world(), ID, brawler, 1)
    expect(counts.map((c) => [c.label, c.count, c.block])).toEqual([['1', 1, null], ['5', 5, null], ['10', 10, null], ['Max · 78', 78, null]])
    expect(firstCount(counts)).toBe('1')
    const short = manualCounts(world(7_000), ID, brawler, 1)
    expect(short.map((c) => [c.label, c.block])).toEqual([['1', null], ['5', null], ['10', 'Needs 10,000 Class Marks'], ['Max · 7', null]])
    expect(manualCounts(world(500), ID, brawler, 1).at(-1)).toMatchObject({ label: 'Max · 0', block: 'Needs 1,000 Class Marks' })
  })

  it('caps Max at a purchase\'s 99', () => {
    expect(manualCounts(world(150_000), ID, brawler, 1).at(-1)).toMatchObject({ label: 'Max · 99', count: 99, block: null })
  })

  it('reads before → after from the class\'s own curve: Brawler R34 → R36 for 2 Manuals', () => {
    expect(manualStep(world().umas[ID]!, brawler, 2).text).toBe('Brawler R34 → R36')
    expect(manualFooter(world(), ID, brawler, 5, 1)).toMatchObject({ label: 'Read 5 · 5,000 Class Marks', block: null })
    expect(readLabel(21)).toBe('Read 21 · 21,000 Class Marks')
  })

  it('shows before → after while only the Marks fall short, the button disabled with their reason', () => {
    const footer = manualFooter(world(7_000), ID, brawler, 10, 1)
    expect(footer).toMatchObject({ label: 'Needs 10,000 Class Marks', block: 'Needs 10,000 Class Marks' })
    // 10,000 EXP from R34: 664 + 680 + … + 856 = 9,880 takes thirteen ranks.
    expect(footer.step?.head).toBe('Brawler R34 → R47')
  })

  it('says what banks back past Rank 50: a Brawler R49 reading 5 Manuals', () => {
    const w = world()
    w.umas[ID]!.ranks.classes.brawler = { rank: 49, exp: 0 }
    expect(manualStep(w.umas[ID]!, brawler, 5).text).toBe(`Brawler R49 → R50 · +${(Math.floor((5000 - (120 + 16 * 49)) / 2)).toLocaleString('en-US')} Class Marks back`)
  })

  it('blocks a bar at Rank 50 with manualBlock\'s reason: every count, and the footer without before → after', () => {
    expect(manualCounts(world(), ID, paladin, 1).every((c) => c.block === 'Already at the top rank')).toBe(true)
    expect(manualFooter(world(), ID, paladin, 1, 1)).toEqual({ step: null, label: 'Already at the top rank', block: 'Already at the top rank' })
  })

  it('heads with her name and the world\'s Class Marks, and no share without the reset\'s record', () => {
    expect(manualHead('Aster', world(), ID)).toMatchObject({ line: 'Aster · Class Marks 78,000', marks: 'Class Marks 78,000', share: null })
  })
})

const A = ID
const recruit = { kind: 'class', id: 'recruit' } as const

/** Tier 1 just after the reset: Uma A with no Class Rank and her share of 21 unread; the world's 78,000 Class Marks. */
function resetWorld(ranks: TierWorld['umas'][string]['ranks']['classes'] = {}): TierWorld {
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

describe('the Manual sheet from v19, Tier 1\'s world after the reset', () => {
  it('lists the five Tier 0s, her calling\'s Recruit first "R1/10 · Calling", and no Tier 1 class she doesn\'t hold', () => {
    const bars = manualBars(OUTFIT, resetWorld().umas[A]!, 1)
    expect(bars.map((b) => [b.name, b.caption])).toEqual([
      ['Recruit', 'R1/10 · Calling'], ['Duelist', 'R1/10'], ['Acolyte', 'R1/10'], ['Caller', 'R1/10'], ['Initiate', 'R1/10'],
    ])
    expect(bars[0]!.fill).toEqual({ value: 0, max: 272 })
    // A Late A Uma's calling is the Acolyte: hers comes first.
    expect(manualBars(outfit('81002', 'late'), resetWorld().umas[A]!, 1)[0]!.name).toBe('Acolyte')
  })

  it('counts 1, 5, 10, To Rank 10 · 4, Her share · 21 and Max · 78, and starts on her share', () => {
    const counts = manualCounts(resetWorld(), A, recruit, 1)
    expect(counts.map((c) => [c.label, c.count, c.block])).toEqual([
      ['1', 1, null], ['5', 5, null], ['10', 10, null], ['To Rank 10 · 4', 4, null], ['Her share · 21', 21, null], ['Max · 78', 78, null],
    ])
    expect(firstCount(counts)).toBe('share')
    expect(manualHead('Uma A', resetWorld(), A)).toMatchObject({ line: 'Uma A · Class Marks 78,000', share: 'Her share · 21' })
  })

  it('reads her share on her Recruit to Rank 10 with the rest waiting: Recruit R1 → R10 · +17,400 EXP waiting', () => {
    expect(manualStep(resetWorld().umas[A]!, recruit, 21).text).toBe('Recruit R1 → R10 · +17,400 EXP waiting')
    expect(manualFooter(resetWorld(), A, recruit, 21, 1)).toMatchObject({ label: 'Read 21 · 21,000 Class Marks', block: null })
  })

  it('counts her share down as she reads, on any bar, and drops the chip at 0', () => {
    const after = read(resetWorld(), recruit, 16)
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
    const w = resetWorld({ recruit: { rank: 10, exp: 400 } })
    expect(manualBars(OUTFIT, w.umas[A]!, 1)[0]).toMatchObject({ caption: 'R10 · +400 EXP waiting', fill: { value: 400, max: 23_680 } })
    expect(manualCounts(w, A, recruit, 1).map((c) => c.label)).toEqual(['1', '5', '10', 'Her share · 21', 'Max · 24'])
    // 3,680 of room: four Manuals, the fourth passing the bank by 320 (half back as Class Marks).
    const tight = resetWorld({ recruit: { rank: 10, exp: 20_000 } })
    expect(manualCounts(tight, A, recruit, 1).map((c) => [c.label, c.block])).toEqual([
      ['1', null], ['5', 'Room for 4'], ['10', 'Room for 4'], ['Her share · 21', 'Room for 4'], ['Max · 4', null],
    ])
    expect(manualStep(tight.umas[A]!, recruit, 4).text).toBe('Recruit R10 → R10 · +23,680 EXP waiting · +160 Class Marks back')
    const full = resetWorld({ recruit: { rank: 10, exp: 23_680 } })
    expect(manualFooter(full, A, recruit, 1, 1)).toEqual({ step: null, label: 'Already at the top rank', block: 'Already at the top rank' })
  })

  it('lists a held Brawler after the Tier 0s; the Arms Summoner she could promote into isn\'t listed', () => {
    const w = resetWorld({ recruit: { rank: 10, exp: 0 }, brawler: { rank: 10, exp: 0 } })
    const bars = manualBars(OUTFIT, w.umas[A]!, 1)
    expect(bars.map((b) => b.ref.id)).toEqual(['recruit', 'duelist', 'acolyte', 'caller', 'apprentice', 'brawler'])
    expect(bars[0]!.caption).toBe('R10/10 · Calling')
    expect(bars.at(-1)).toMatchObject({ name: 'Brawler', caption: 'R10' })
    expect(manualCounts(w, A, brawler, 1).map((c) => c.key)).toEqual(['1', '5', '10', 'share', 'max'])
  })
})

describe('the Manual sheet from v19, a later tier\'s world', () => {
  it('lists the eight Tier 1 classes, her active class first, with no To Rank 10', () => {
    const w = resetWorld()
    w.umas[A] = { ...w.umas[A]!, classId: 'paladin', ranks: { classes: { paladin: { rank: 3, exp: 0 } } } }
    const bars = manualBars(OUTFIT, w.umas[A]!, 2)
    expect(bars.map((b) => b.ref.id)).toEqual(['paladin', 'brawler', 'spellblade', 'armsummoner', 'cleric', 'summoner', 'tomeblade', 'mage'])
    expect(bars[0]!.caption).toBe('R3')
    expect(manualCounts(w, A, paladin, 2).some((c) => c.key === 'rank10')).toBe(false)
  })
})
