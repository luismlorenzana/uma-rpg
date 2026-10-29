// Classes v3's switch at 19 (H126, D240): with `caps.ts` mocked to 19 (what H134 will make live), every frozen fight of
// engines v14–v18 replays byte for byte. Every rules call in the engine reads the fight's own version, so the thirteen
// classes, the hands' lead half from data, Tier 0 and the v19 rows leave every older fight as it was.
import { describe, expect, it, vi } from 'vitest'
import { RPG_CLASSES } from '../rules'
import { BATTLE_ENGINE_VERSION, rpgRework } from './engine'
import { loadV14Replays, replayV14 } from './v14-replays.fixture'
import { loadV15Replays } from './v15-replays.fixture'
import { loadV16Replays } from './v16-replays.fixture'
import { loadV17Replays } from './v17-replays.fixture'
import { loadV18Replays } from './v18-replays.fixture'

vi.mock('./caps', async (orig) => (await import('./caps-at.fixture')).capsAt(19, await orig()))

const ALL = [
  ...loadV14Replays(), ...loadV15Replays(), ...loadV16Replays(), ...loadV17Replays(), ...loadV18Replays(),
]

describe('the frozen v14–v18 replays with the switch at 19 (H126)', () => {
  it('runs Classes v3 live: engine 19, the classes stage on, thirteen classes', () => {
    expect(BATTLE_ENGINE_VERSION).toBe(19)
    expect([rpgRework('weak'), rpgRework('classes'), rpgRework('t2Weapons')]).toEqual([true, true, false])
    expect(RPG_CLASSES).toHaveLength(13)
  })

  it.each(ALL.map((r) => [`v${r.input.version} ${r.name}`, r] as const))('%s replays byte for byte', (_, r) => {
    expect(replayV14(r.input, r.actions)).toEqual({ outcome: r.outcome, rounds: r.rounds, hash: r.hash, cues: r.cues, cueDigest: r.cueDigest })
  })

  it('covers every older engine from v14', () => {
    expect([...new Set(ALL.map((r) => r.input.version))].sort()).toEqual([14, 15, 16, 17, 18])
  })
})
