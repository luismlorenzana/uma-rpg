// Frozen v15 and v14 fights stay byte-exact with R2's economy switch mocked live (H74).
import { describe, expect, it, vi } from 'vitest'
import { BATTLE_ENGINE_VERSION, rpgRework } from './engine'
import { loadV14Replays, replayV14 } from './v14-replays.fixture'
import { loadV15Replays, replayV15 } from './v15-replays.fixture'

vi.mock('./caps', async (orig) => (await import('./caps-at.fixture')).capsAt(17, await orig()))

describe('the frozen v15 and v14 replays with the switch at 17 (H74)', () => {
  it('runs with R2’s economy live', () => {
    expect(BATTLE_ENGINE_VERSION).toBe(17)
    expect([rpgRework('fight'), rpgRework('economy'), rpgRework('t2Weapons')]).toEqual([true, true, false])
  })

  it.each(loadV15Replays().map((replay) => [replay.name, replay] as const))('v15, %s, replays byte for byte', (_, replay) => {
    expect(replayV15(replay.input, replay.actions)).toEqual({ outcome: replay.outcome, rounds: replay.rounds, hash: replay.hash, cues: replay.cues, cueDigest: replay.cueDigest })
  })

  it.each(loadV14Replays().map((replay) => [replay.name, replay] as const))('v14, %s, replays byte for byte', (_, replay) => {
    expect(replayV14(replay.input, replay.actions)).toEqual({ outcome: replay.outcome, rounds: replay.rounds, hash: replay.hash, cues: replay.cues, cueDigest: replay.cueDigest })
  })
})
