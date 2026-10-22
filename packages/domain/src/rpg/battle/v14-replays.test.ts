// v6–v14 fights replay exactly, whatever classes v2 builds (H53, D179): the frozen fixture's v14 fights, replayed under the
// live engine. Its twin, `v14-replays-live15.test.ts`, replays them with the switch mocked to 15.
import { describe, expect, it } from 'vitest'
import { replayBattle } from './engine'
import { loadV14Replays, regenerateV14Replays, replayV14 } from './v14-replays.fixture'

const replays = process.env.UPDATE_V14 ? regenerateV14Replays() : loadV14Replays()

describe('the frozen v14 replays (H53)', () => {
  it.each(replays.map((r) => [r.name, r] as const))('%s replays byte for byte under the live engine', (_, r) => {
    expect(replayV14(r.input, r.actions)).toEqual({ outcome: r.outcome, rounds: r.rounds, hash: r.hash, cues: r.cues, cueDigest: r.cueDigest })
  })

  it('pins only v14 fights, and covers what classes v2 must not move', () => {
    expect(replays).toHaveLength(7)
    expect(replays.every((r) => r.input.version === 14)).toBe(true)
    const allies = replays.flatMap((r) => r.input.allies)
    const foes = replays.flatMap((r) => [...r.input.enemies, ...(r.input.waves ?? []).flat()])
    const acts = replays.flatMap((r) => r.actions)
    // Every class of classes v1, Learners, and the accessories' Orb kinds.
    expect(new Set(allies.map((a) => a.classId))).toEqual(new Set(['brawler', 'mage', 'spellblade', 'cleric', 'summoner']))
    expect(allies.some((a) => a.inherits?.length)).toBe(true)
    expect(allies.some((a) => a.orbs?.length)).toBe(true)
    // Spell Blade pairs and inherited Limit Breaks on Auto.
    expect(acts.some((a) => a.kind !== 'limit' && a.kind !== 'guard' && a.pair)).toBe(true)
    expect(acts.some((a) => a.kind === 'limit' && a.hero)).toBe(true)
    // The Rift's traits: the ward, a third act and mixed locks.
    expect(foes.some((e) => e.ward)).toBe(true)
    expect(foes.some((e) => e.thrice)).toBe(true)
    expect(foes.some((e) => e.mixedLocks)).toBe(true)
    // Wins and multi-wave stages.
    expect(replays.some((r) => r.outcome === 'victory')).toBe(true)
    expect(replays.some((r) => r.input.waves?.length)).toBe(true)
    // Mends and Barriers (Clerics and Summoners), lingering summons, Limit Breaks, locks broken and warded hits.
    const cues = replays.flatMap((r) => replayBattle(r.input, r.actions).cues)
    for (const kind of ['heal', 'cover', 'summon', 'limit', 'lock', 'break'] as const) expect(cues.some((c) => c.kind === kind), kind).toBe(true)
    expect(cues.some((c) => c.kind === 'hit' && c.label === 'Warded')).toBe(true)
  })
})
