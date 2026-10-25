// The frozen v15 and v14 fights replay byte for byte with the one switch at 16 (H64, D200): every rule's default then reads
// the Tier rework's fight (three weapons, the Summoner's Arms hand 0.50), so a rules call in the engine that leaned on its
// default instead of the fight's version would move them. `caps.ts` is mocked in this file of its own; H72's switch makes
// this the live case.
import { describe, expect, it, vi } from 'vitest'
import { RPG_CLASS_SLOTS, RPG_WEAPON_SLOTS, rpgHand } from '../rules'
import { BATTLE_ENGINE_VERSION, rpgRework, rpgV2 } from './engine'
import { loadV14Replays, replayV14 } from './v14-replays.fixture'
import { loadV15Replays, replayV15 } from './v15-replays.fixture'

vi.mock('./caps', async (orig) => (await import('./caps-at.fixture')).capsAt(16, await orig()))

describe('the frozen v15 and v14 replays with the switch at 16 (H64)', () => {
  it('runs with the Tier rework’s fight live', () => {
    expect(BATTLE_ENGINE_VERSION).toBe(16)
    expect([rpgV2(), rpgRework('fight'), rpgRework('economy')]).toEqual([true, true, false])
    expect(RPG_WEAPON_SLOTS).toBe(3)
    expect(RPG_CLASS_SLOTS.brawler).toHaveLength(3)
    expect(rpgHand({ classId: 'summoner' })).toMatchObject({ arms: 0.5, tome: 0.58 })
  })

  it.each(loadV15Replays().map((r) => [r.name, r] as const))('v15, %s, replays byte for byte', (_, r) => {
    expect(r.input.version).toBe(15)
    expect(replayV15(r.input, r.actions)).toEqual({ outcome: r.outcome, rounds: r.rounds, hash: r.hash, cues: r.cues, cueDigest: r.cueDigest })
  })

  it.each(loadV14Replays().map((r) => [r.name, r] as const))('v14, %s, replays byte for byte', (_, r) => {
    expect(r.input.version).toBe(14)
    expect(replayV14(r.input, r.actions)).toEqual({ outcome: r.outcome, rounds: r.rounds, hash: r.hash, cues: r.cues, cueDigest: r.cueDigest })
  })
})
