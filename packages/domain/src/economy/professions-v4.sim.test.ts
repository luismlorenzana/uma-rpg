// H114: the Wilds' trios ledger against farm-by-line.md FL30 (Tier 1, Craft Lv 25's manual times, before ×1.25).
import { describe, expect, it } from 'vitest'
import { placeHoursV4, professionsReport, umaPiecesV4, umaRefinedByLine, umaRefinedV4 } from './professions-v4.sim'
import { craftDay, FORTY, gradeDaysAt, placeSupplyOf, rosterRateOf, tradeHoursOf, TWENTY } from './professions.sim'

const total = (r: Record<string, number>) => Object.values(r).reduce((a, b) => a + b, 0)
const near = (actual: number, want: number, within: number, label?: string) => expect(Math.abs(actual - want), label).toBeLessThanOrEqual(within)

describe('the Wilds\' trios pacing ledger (H114, FL30)', () => {
  it('one Uma: 140 pieces, 750 refined, 150 on every line (D264)', () => {
    expect(total(umaPiecesV4())).toBe(140)
    expect(total(umaRefinedV4())).toBe(750)
    expect(umaRefinedByLine()).toEqual({ metal: 150, wood: 150, vegetables: 150, fish: 150, stone: 150 })
    // A grade-g item takes its line's grade g: Arms Gems on Ingots G1–G10, 15 a grade, and so on every line at every grade.
    expect(umaRefinedV4()['iron-ingot']).toBe(15)
    expect(umaRefinedV4()['cut-emerald']).toBe(15)
    expect(umaRefinedV4()['cut-philosophers-stone']).toBe(15)
    expect(new Set(Object.values(umaRefinedV4()))).toEqual(new Set([15]))
  })

  it('753.1 hours, 50.2 at every one of the fifteen places (D264)', () => {
    const hours = placeHoursV4()
    near(total(hours), 753.1, 0.1)
    for (const place of Object.values(hours)) near(place, 50.2, 0.05)
  })

  it('splits her work by trade and supplies each place as FL11 says', () => {
    const t = tradeHoursOf(placeHoursV4())
    for (const trade of Object.values(t)) { near(trade.hours, 150.6, 0.05); near(100 * trade.share, 20, 0.01) }
    for (const supply of Object.values(placeSupplyOf(placeHoursV4()))) near(supply, 2.39, 0.005)
  })

  it('beats R2\'s pace with no line behind: forty 1.39 a day, a run of twenty in 14.3 days; twenty 0.60; G10 held on day 22.5', () => {
    const forty = rosterRateOf(FORTY, placeHoursV4())
    near(forty.rate, 1.39, 0.005)
    near(20 / forty.rate, 14.3, 0.05)
    near(rosterRateOf(TWENTY, placeHoursV4()).rate, 0.60, 0.005)
    const days = gradeDaysAt(forty.rate)
    near(days[9]!.opens, craftDay(46), 1e-9)
    near(days[9]!.party, 22.5, 0.05)
  })

  it('opens grades on §5.3\'s days at ×1.25: G2 on day 2.0, G6 on 11.2, G10 on 22.1, Lv 50 on 24.5', () => {
    const days = gradeDaysAt(rosterRateOf(FORTY, placeHoursV4()).rate)
    near(days[1]!.opens, 2.0, 0.1)
    near(days[5]!.opens, 11.2, 0.1)
    near(days[9]!.opens, 22.1, 0.1)
    near(craftDay(50), 24.5, 0.1)
  })

  it.skipIf(!process.env.SIM)('prints the ledger', () => {
    console.log(professionsReport())
  })
})
