// v17 fights replay exactly after weaknesses v2 goes live (H116): the frozen fixture's fights were generated on the
// live v17 engine before the switch. Their stored foes keep the twin lists and every R2 rule reads the fight's version.
import { describe, expect, it } from 'vitest'
import { RPG_ALL_CLASSES } from '../rules'
import { BATTLE_ENGINE_VERSION, rpgRework } from './engine'
import { loadV17Replays, regenerateV17Replays, replayV17 } from './v17-replays.fixture'

const replays = process.env.UPDATE_V17 ? regenerateV17Replays() : loadV17Replays()

describe('the frozen v17 replays (H116)', () => {
  it('runs with weaknesses v2 live while the next release stays dark', () => {
    expect(BATTLE_ENGINE_VERSION).toBe(18)
    expect([rpgRework('economy'), rpgRework('weak'), rpgRework('t2Weapons')]).toEqual([true, true, false])
  })

  it.each(replays.map((r) => [r.name, r] as const))('%s replays byte for byte under the live engine', (_, r) => {
    expect(r.input.version).toBe(17)
    expect(replayV17(r.input, r.actions)).toEqual({ outcome: r.outcome, rounds: r.rounds, hash: r.hash, cues: r.cues, cueDigest: r.cueDigest })
  })

  it('pins only v17 fights: every class, graded gear, the Rift traits and wins', () => {
    expect(replays).toHaveLength(7)
    expect(replays.every((r) => r.input.version === 17)).toBe(true)
    const allies = replays.flatMap((r) => r.input.allies)
    const foes = replays.flatMap((r) => [...r.input.enemies, ...(r.input.waves ?? []).flat()])
    expect(new Set(allies.map((a) => a.classId))).toEqual(new Set(RPG_ALL_CLASSES))
    expect(allies.some((a) => a.inherits?.length)).toBe(true)
    expect(allies.every((a) => a.might && Object.keys(a.might).length > 0)).toBe(true)
    expect([foes.some((e) => e.ward), foes.some((e) => e.thrice), foes.some((e) => e.mixedLocks)]).toEqual([true, true, true])
    expect(replays.some((r) => r.outcome === 'victory')).toBe(true)
  })
})
