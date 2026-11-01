// v20 fights replay exactly under the combat pass (engine v21, D282): the frozen fixture's fights were generated on the
// live v20 engine before D282 touched it, so their guards still cover, their healers keep v20's kits and their riders land.
import { describe, expect, it } from 'vitest'
import { loadV20Replays, regenerateV20Replays, replayV20 } from './v20-replays.fixture'

const replays = process.env.UPDATE_V20 ? regenerateV20Replays() : loadV20Replays()

describe('the frozen v20 replays (D282)', () => {
  it.each(replays.map((r) => [r.name, r] as const))('%s replays byte for byte under the live engine', (_, r) => {
    expect(r.input.version).toBe(20)
    expect(replayV20(r.input, r.actions)).toEqual({ outcome: r.outcome, rounds: r.rounds, hash: r.hash, cues: r.cues, cueDigest: r.cueDigest })
  })

  it('pins fights where v21 would differ: a guard covering, both healers and every damage class', () => {
    const allies = replays.flatMap((r) => r.input.allies.map((a) => a.classId))
    for (const c of ['brawler', 'mage', 'spellblade', 'tomeblade', 'summoner', 'armsummoner', 'paladin', 'cleric']) expect(allies, c).toContain(c)
    const foes = replays.flatMap((r) => [...r.input.enemies, ...(r.input.waves ?? []).flat()])
    expect(foes.some((e) => e.moves.some((m) => m.kind === 'guard'))).toBe(true)
  })
})
