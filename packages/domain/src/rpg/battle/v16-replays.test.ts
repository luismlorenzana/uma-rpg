// v16 fights replay exactly under R2's economy (H82, D218; R2's build decision 3): the frozen fixture's v16 fights,
// generated on the live v16 engine before the flip, replayed under the live engine.
import { describe, expect, it } from 'vitest'
import { RPG_V2_CLASSES } from '../rules'
import { BATTLE_ENGINE_VERSION, rpgRework } from './engine'
import { loadV16Replays, regenerateV16Replays, replayV16 } from './v16-replays.fixture'

const replays = process.env.UPDATE_V16 ? regenerateV16Replays() : loadV16Replays()

describe('the frozen v16 replays (H82)', () => {
  it('runs with R2’s economy and Classes v3 live (H82, H134)', () => {
    expect(BATTLE_ENGINE_VERSION).toBe(20)
    expect([rpgRework('economy'), rpgRework('classes'), rpgRework('t2Weapons')]).toEqual([true, true, false])
  })

  it.each(replays.map((r) => [r.name, r] as const))('%s replays byte for byte under the live engine', (_, r) => {
    expect(r.input.version).toBe(16)
    expect(replayV16(r.input, r.actions)).toEqual({ outcome: r.outcome, rounds: r.rounds, hash: r.hash, cues: r.cues, cueDigest: r.cueDigest })
  })

  it('pins only v16 fights: every class, today\'s gear with its supports, the Rift\'s traits and wins', () => {
    expect(replays).toHaveLength(7)
    expect(replays.every((r) => r.input.version === 16)).toBe(true)
    const allies = replays.flatMap((r) => r.input.allies)
    const foes = replays.flatMap((r) => [...r.input.enemies, ...(r.input.waves ?? []).flat()])
    expect(new Set(allies.map((a) => a.classId))).toEqual(new Set(RPG_V2_CLASSES))
    expect(allies.some((a) => a.inherits?.length)).toBe(true)
    // Today's gear: Might on every member and a Talisman's and an Amulet's support fields.
    expect(allies.every((a) => a.might && Object.keys(a.might).length > 0)).toBe(true)
    expect(allies.some((a) => (a.lifesteal ?? 0) > 0)).toBe(true)
    expect(allies.some((a) => (a.mpRegen ?? 0) > 0 || (a.regen ?? 0) > 0)).toBe(true)
    expect([foes.some((e) => e.ward), foes.some((e) => e.thrice), foes.some((e) => e.mixedLocks)]).toEqual([true, true, true])
    expect(replays.some((r) => r.outcome === 'victory')).toBe(true)
  })
})
