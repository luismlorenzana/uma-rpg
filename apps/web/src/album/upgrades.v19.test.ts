// The Stable's "Can upgrade" from the switch (H137, D253; inert until H134), with the switch mocked to 19: a Tier 0 she
// fights as at Class Rank 10 with a child she doesn't hold carries the mark and the Can upgrade filter finds her (one reason,
// Promote); below Rank 10, or once she fights as a Tier 1 class, nothing. Invented outfits only.
import { describe, expect, it, vi } from 'vitest'
import { albumRows, stableResult, STABLE_PRESETS, STABLE_SCHEMA } from './rows'
import { albumFixture, NOW } from './testing'
import { umaUpgrades, withUpgrades } from './upgrades'

vi.mock('../../../../packages/domain/src/rpg/battle/caps', async (orig) =>
  (await import('../../../../packages/domain/src/rpg/battle/caps-at.fixture')).capsAt(19, await orig()))

describe('Can upgrade: Promote (v19)', () => {
  it('marks a Recruit at R10 and the preset keeps her; a Recruit at R9 and a Brawler stay unmarked', async () => {
    const { view, world } = await albumFixture()
    const set = (id: string, classId: 'recruit' | 'brawler', classes: Record<string, { rank: number; exp: number }>) => {
      world.umas[id] = { ...world.umas[id]!, classId, ranks: { classes } }
    }
    set('81001', 'recruit', { recruit: { rank: 10, exp: 400 } })
    set('81002', 'recruit', { recruit: { rank: 9, exp: 0 } })
    set('81003', 'brawler', { recruit: { rank: 10, exp: 0 }, brawler: { rank: 12, exp: 0 } })
    expect(umaUpgrades(world, view.roster[0]!)).toMatchObject({ promote: true, gear: 0, stars: 0, any: true })
    const rows = withUpgrades(albumRows(view, world, [], NOW), world)
    const picked = STABLE_PRESETS.find((p) => p.key === 'upgrade')!.apply(STABLE_SCHEMA.fallback)
    expect(stableResult(rows, picked).rows.map((row) => row.id)).toEqual(['81001'])
    expect(rows.find((row) => row.id === '81003')).toMatchObject({ upgrades: { promote: false }, facets: { upgrade: false } })
  })
})
