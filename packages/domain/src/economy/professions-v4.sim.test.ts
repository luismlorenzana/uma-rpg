// H109: the farm by line's pacing ledger against farm-by-line.md FL9 and FL11 (Tier 1, Craft Lv 25's manual times,
// before ×1.25): the same pace as R2's (forty Umas 1.27 maxed a day, twenty 0.54), every place within 75–83 hours.
import { describe, expect, it } from 'vitest'
import { placeHoursV4, professionsReport, umaPiecesV4, umaRefinedByLine, umaRefinedV4 } from './professions-v4.sim'
import { craftDay, FORTY, gradeDaysAt, placeSupplyOf, rosterRateOf, tradeHoursOf, TWENTY } from './professions.sim'

const total = (r: Record<string, number>) => Object.values(r).reduce((a, b) => a + b, 0)
const near = (actual: number, want: number, within: number, label?: string) => expect(Math.abs(actual - want), label).toBeLessThanOrEqual(within)

describe('the farm by line\'s pacing ledger (H109, FL9–FL11)', () => {
  it('one Uma: 110 pieces, 520 refined (528 with her moon), each line 100–110 (FL9)', () => {
    expect(total(umaPiecesV4())).toBe(110)
    expect(total(umaPiecesV4(true))).toBe(112)
    expect(total(umaRefinedV4())).toBe(520)
    expect(total(umaRefinedV4(true))).toBe(528)
    expect(umaRefinedByLine()).toEqual({ metal: 105, wood: 100, vegetables: 105, fish: 100, stone: 110 })
    expect(umaRefinedByLine(true).stone).toBe(118)
    // A grade-g item takes its line's grade g: Arms Gems on Ingots G1–G10, 10.5 a grade.
    expect(umaRefinedV4()['iron-ingot']).toBe(10.5)
    expect(umaRefinedV4()['cut-emerald']).toBe(10)
    expect(umaRefinedV4()['cut-philosophers-stone']).toBe(12)
  })

  it('783 hours (795 with her moon), every place 75.3–82.8, a trade\'s two places equal (FL10, FL11)', () => {
    const hours = placeHoursV4()
    near(total(hours), 783.2, 0.1)
    near(total(placeHoursV4(true)), 795.2, 0.1)
    for (const [gathering, making, h] of [['mine', 'forge', 79.1], ['forest', 'armorer', 75.3], ['fields', 'workbench', 79.1],
      ['fishery', 'charm-shop', 75.3], ['monster-den', 'lapidary', 82.8]] as const) {
      near(hours[gathering], h, 0.05, gathering)
      near(hours[making], hours[gathering], 1e-9, making)
    }
  })

  it('splits her work by trade and supplies each place as FL11 says', () => {
    const t = tradeHoursOf(placeHoursV4())
    const want = { physical: [158.1, 20.2], 'physical-hybrid': [150.6, 19.2], healer: [158.1, 20.2], 'magical-hybrid': [150.6, 19.2], magical: [165.7, 21.2] } as const
    for (const [trade, [hours, share]] of Object.entries(want)) {
      near(t[trade as keyof typeof t].hours, hours, 0.05, trade)
      near(100 * t[trade as keyof typeof t].share, share, 0.05, trade)
    }
    const s = placeSupplyOf(placeHoursV4())
    near(s['monster-den'], 1.45, 0.005); near(s.lapidary, 1.45, 0.005)
    near(s.mine, 1.52, 0.005); near(s.workbench, 1.52, 0.005)
    near(s.forest, 1.59, 0.005); near(s['charm-shop'], 1.59, 0.005)
  })

  it('keeps R2\'s pace: forty 1.27 a day (Stone\'s seven bind), a run of twenty in 15.8 days; twenty 0.54; G10 held on day 22.5', () => {
    const forty = rosterRateOf(FORTY, placeHoursV4())
    near(forty.rate, 1.27, 0.005)
    expect(forty.binds).toBe('magical (7 Umas)')
    near(20 / forty.rate, 15.8, 0.05)
    near(rosterRateOf(TWENTY, placeHoursV4()).rate, 0.54, 0.005)
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
