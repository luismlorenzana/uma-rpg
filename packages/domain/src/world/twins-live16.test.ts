// The foe generators follow the one switch (H66, D202): with it mocked to 16 (H72's live case), a chapter, a capital, a
// Rift fight, the shields and the Rift's guided builds asked for without an engine are v16's, and asked for v15 they
// stay byte for byte today's. `caps.ts` is mocked in this file of its own.
import { describe, expect, it, vi } from 'vitest'
import { BATTLE_ENGINE_VERSION } from '../rpg/battle/caps'
import { rpgCampaignChapter } from '../rpg/campaign/chapters'
import { RPG_FOE_SHIELDS_V16, rpgFoeShields } from '../rpg/campaign/enemies'
import { RIFT_FRONT_SPECS, riftGuidedBuild, riftTuning } from '../rift/fronts'
import { riftFight } from '../rift/generate'
import { packRoster } from '../rift/roster.fixture'
import { RIFT_FRONTS } from '../rift/state'
import { capitalChapter } from './capital'
import { regionChapter, worldContinent } from './world'

vi.mock('../rpg/battle/caps', async (orig) => (await import('../rpg/battle/caps-at.fixture')).capsAt(16, await orig()))

const cast = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))

/** FNV-1a, as `tier1-foes.test.ts` pins. */
function fnv1a(text: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i += 1) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) }
  return (h >>> 0).toString(16).padStart(8, '0')
}

describe('the foe generators with the switch at 16 (H66)', () => {
  it('generate v16’s foes by default', () => {
    expect(BATTLE_ENGINE_VERSION).toBe(16)
    const w1 = worldContinent({ name: 'T', order: 1 })
    for (const region of w1.regions.slice(0, 8)) expect(regionChapter(region, cast)).toEqual(regionChapter(region, cast, 16))
    expect(capitalChapter(w1, cast)).toEqual(capitalChapter(w1, cast, 16))
    expect(rpgCampaignChapter({ scenarioId: 7, name: 'C', order: 2 }, cast)).toEqual(rpgCampaignChapter({ scenarioId: 7, name: 'C', order: 2 }, cast, 16))
    expect(rpgFoeShields()).toEqual(RPG_FOE_SHIELDS_V16)
    const ctx = { tier: 1, runId: 't1-r1', roster: packRoster(), defeated: new Set<string>() }
    for (const front of ['duel', 'horde'] as const) {
      expect(riftFight(ctx, { kind: 'front', front, stage: 3 })).toEqual(riftFight(ctx, { kind: 'front', front, stage: 3 }, 16))
    }
    expect(riftTuning()).toBe(riftTuning(16))
    for (const front of RIFT_FRONTS) expect(RIFT_FRONT_SPECS[front].build).toEqual(riftGuidedBuild(front, 16))
  })

  it('keep v15’s Tier 1 byte for byte when asked for it', () => {
    const parts: string[] = []
    for (let order = 1; order <= 5; order++) {
      const continent = worldContinent({ name: 'T', order })
      for (const region of continent.regions) parts.push(JSON.stringify(regionChapter(region, cast, 15).nodes))
      parts.push(JSON.stringify(capitalChapter(continent, cast, 15).nodes))
    }
    expect(fnv1a(parts.join('\n'))).toBe('719d3a73')
  })
})
