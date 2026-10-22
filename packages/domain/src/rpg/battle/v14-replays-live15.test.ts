// The frozen v14 fights replay byte for byte with the one switch at 15 (H53, D179): every class rule's default then reads
// classes v2, so a rules call in the engine that leaned on its default instead of the fight's version would move them.
// `caps.ts` is mocked in this file of its own; H61's switch makes this the live case.
import { describe, expect, it, vi } from 'vitest'
import { RPG_ALL_CLASSES, RPG_CLASSES, rpgHand } from '../rules'
import { HERO_LIMIT_IDS } from '../hero-id'
import { BATTLE_ENGINE_VERSION, rpgV2 } from './engine'
import { loadV14Replays, replayV14 } from './v14-replays.fixture'

vi.mock('./caps', async (importOriginal) => {
  const caps = await importOriginal<typeof import('./caps')>()
  return { ...caps, BATTLE_ENGINE_VERSION: 15, rpgV2: (engine: number = 15) => engine >= caps.RPG_V2_ENGINE }
})

describe('the frozen v14 replays with the switch at 15 (H53)', () => {
  it('runs with classes v2 live', () => {
    expect(BATTLE_ENGINE_VERSION).toBe(15)
    expect(rpgV2()).toBe(true)
    expect(RPG_CLASSES).toEqual(RPG_ALL_CLASSES)
    expect(HERO_LIMIT_IDS).toHaveLength(24)
    expect(rpgHand({ classId: 'spellblade' })).toMatchObject({ arms: 0.72, tome: 0.44 })
  })

  it.each(loadV14Replays().map((r) => [r.name, r] as const))('%s replays byte for byte', (_, r) => {
    expect(r.input.version).toBe(14)
    expect(replayV14(r.input, r.actions)).toEqual({ outcome: r.outcome, rounds: r.rounds, hash: r.hash, cues: r.cues, cueDigest: r.cueDigest })
  })
})
