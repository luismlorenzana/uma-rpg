// H81: R2's profession pacing ledger against profession-progression.md §5.3 and §7 (Tier 1 in full). Print the report,
// with Tiers 2 and 3 (R2's shape: no secondary until R3), with `SIM=1 npx vitest run src/economy/professions.sim.test.ts`.
import { describe, expect, it } from 'vitest'
import {
  craftDay, FORTY, gradeDays, placeHours, placeSupply, professionsReport, rosterRate, TWENTY, tradeHours, umaPieces, umaRefined,
} from './professions.sim'

const total = (r: Record<string, number>) => Object.values(r).reduce((a, b) => a + b, 0)

describe('R2\'s profession pacing ledger (H81)', () => {
  it('one Uma\'s Tier 1 demand: 110 pieces, 485 refined (493 with her moon), 822 hours (835) at Craft Lv 25 (§7.1, §7.2)', () => {
    expect(total(umaPieces())).toBe(110)
    expect(total(umaPieces(true))).toBe(112)
    expect(total(umaRefined(1))).toBe(485)
    expect(total(umaRefined(1, true))).toBe(493)
    expect(Math.abs(total(placeHours(1)) - 822)).toBeLessThanOrEqual(1)
    expect(Math.abs(total(placeHours(1, true)) - 835)).toBeLessThanOrEqual(1)
    // By type (§7.1): Copper 36, Iron 64; Pine 39, Cedar 61; Carrot 64, Cabbage 36; Carp 64, Sardine 36; Quartz 27, Citrine 58.
    expect(umaRefined(1)).toEqual({
      'copper-ingot': 36, 'iron-ingot': 64, 'pine-plank': 39, 'cedar-plank': 61, 'chopped-carrot': 64, 'shredded-cabbage': 36,
      'carp-fillet': 64, 'sardine-fillet': 36, 'cut-quartz': 27, 'cut-citrine': 58,
    })
  })

  it('splits her work by trade as §7.2 does, within 0.1 point', () => {
    const t = tradeHours(1)
    const want = { physical: [166, 20.2], 'physical-hybrid': [169, 20.6], healer: [167, 20.3], 'magical-hybrid': [166, 20.2], magical: [154, 18.8] } as const
    for (const [trade, [hours, share]] of Object.entries(want)) {
      expect(Math.abs(t[trade as keyof typeof t].hours - hours), trade).toBeLessThanOrEqual(1)
      expect(Math.abs(100 * t[trade as keyof typeof t].share - share), trade).toBeLessThanOrEqual(0.1)
    }
  })

  it('supplies each place\'s maxed Umas a day as §7.3 does, the Armorer the slowest at 1.28', () => {
    const s = placeSupply(1)
    const want = { mine: 1.59, forest: 1.59, fields: 1.59, fishery: 1.59, 'monster-den': 1.88, forge: 1.33, 'charm-shop': 1.33, lapidary: 1.33, workbench: 1.31, armorer: 1.28 }
    for (const [place, n] of Object.entries(want)) expect(Math.abs(s[place as keyof typeof s] - n), place).toBeLessThanOrEqual(0.01)
  })

  it('paces a roster as §7.4 does: forty at the callings\' split 1.27 a day, a run of twenty in 15.8 days; twenty 0.54', () => {
    const forty = rosterRate(FORTY, 1)
    expect(Math.abs(forty.rate - 1.27)).toBeLessThanOrEqual(0.01)
    expect(Math.abs(5 / forty.rate - 3.9)).toBeLessThanOrEqual(0.1)
    expect(Math.abs(20 / forty.rate - 15.8)).toBeLessThanOrEqual(0.1)
    expect(Math.abs(rosterRate(TWENTY, 1).rate - 0.54)).toBeLessThanOrEqual(0.01)
  })

  it('opens grades on §5.3\'s days at ×1.25, and the party holds G10 on day 22.5, a run of twenty on 23.7', () => {
    const days = gradeDays()
    expect(Math.abs(days[1]!.opens - 2.0)).toBeLessThanOrEqual(0.1)
    expect(Math.abs(days[5]!.opens - 11.2)).toBeLessThanOrEqual(0.1)
    expect(Math.abs(days[9]!.opens - 22.1)).toBeLessThanOrEqual(0.1)
    expect(Math.abs(craftDay(50) - 24.5)).toBeLessThanOrEqual(0.1)
    expect(Math.abs(days[9]!.party - 22.5)).toBeLessThanOrEqual(0.1)
    expect(Math.abs(days[9]!.run - 23.7)).toBeLessThanOrEqual(0.1)
  })

  it('keeps R2\'s Tier 2 and 3 worlds on 485 refined, on their own pairs by the ladder', () => {
    for (const tier of [2, 3]) expect(total(umaRefined(tier)), `Tier ${tier}`).toBe(485)
    expect(Object.keys(umaRefined(2))).toContain('gold-ingot')
    expect(Object.keys(umaRefined(3))).toContain('mythril-ingot')
  })

  it.skipIf(!process.env.SIM)('prints the ledger', () => {
    console.log(professionsReport())
  })
})
