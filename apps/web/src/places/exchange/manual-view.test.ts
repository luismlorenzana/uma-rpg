// The Exchange's Class Manual sheet on the live engine (v18; H132, CV §14.3): her six classes as bars, the counts 1 · 5 ·
// 10 · Max by her Marks, before → after on the class's own curve, and a bar at Rank 50 blocked with `manualBlock`'s reason.
// Nothing of Classes v3 shows: no Tier 0 bar, no "To Rank 10", no "Her share". Made-up outfits only.
import { newOwnedUma, newTierWorld, RPG_CLASSES, type BattleOutfit, type TierWorld } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { firstBar, firstCount, manualBars, manualCounts, manualFooter, manualHead, manualStep, readLabel } from './manual-view'

const NOW = '2026-10-29T12:00:00.000Z'
const ID = '81001'
const stats = { speed: 100, stamina: 100, power: 110, guts: 100, wit: 90 }
/** Front A: a Brawler. */
const OUTFIT: BattleOutfit = {
  outfitId: ID, baseStats: stats, growthRatePercents: { speed: 0, stamina: 0, power: 0, guts: 0, wit: 0 },
  aptitudes: { strategy: { front: 'A', pace: 'B', late: 'B', end: 'B' }, distance: { sprint: 'B', mile: 'B', medium: 'A', long: 'B' } },
}

/** Tier 1 with her: a Brawler R34 (no bar yet), a Paladin at Rank 50, 78,000 Class Marks. */
function world(marks = 78_000): TierWorld {
  const w = newTierWorld(NOW, 3)
  w.wallet.classMarks = marks
  w.umas[ID] = { ...newOwnedUma(NOW), classId: 'brawler', ranks: { classes: { brawler: { rank: 34, exp: 0 }, paladin: { rank: 50, exp: 0 } } } }
  return w
}
const brawler = { kind: 'class', id: 'brawler' } as const
const paladin = { kind: 'class', id: 'paladin' } as const

describe('the Manual sheet on v18 (live)', () => {
  it('lists her six classes in the live order, each "R34" with its bar; Rank 50 reads Max', () => {
    const bars = manualBars(OUTFIT, world().umas[ID]!, 1)
    expect(bars.map((b) => b.ref.id)).toEqual([...RPG_CLASSES])
    expect(bars.map((b) => b.name)).toEqual(['Brawler', 'Mage', 'Spell Blade', 'Cleric', 'Summoner', 'Paladin'])
    const of = (id: string) => bars.find((b) => b.ref.id === id)!
    expect(of('brawler')).toMatchObject({ caption: 'R34', fill: { value: 0, max: 120 + 16 * 34 }, calling: false })
    expect(of('mage').caption).toBe('R1')
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
