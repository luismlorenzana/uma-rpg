// v19 fights replay exactly under the owner's trim of the halls (engine v20, D261): the frozen fixture's fights were
// generated on the live v19 engine before D261 touched it. Every rules call in the engine reads the fight's version, so the
// four closed seats and the three re-kinded ones still play as they did for any fight that started on them.
import { describe, expect, it } from 'vitest'
import { heroLimitFor } from '../heroes'
import { applyBattleAction, createBattle } from './engine'
import type { BattleAction, BattleCue } from './types'
import { loadV19Replays, regenerateV19Replays, replayV19, type V19Replay } from './v19-replays.fixture'

const replays = process.env.UPDATE_V19 ? regenerateV19Replays() : loadV19Replays()

/** Each action of a pinned fight with the cues it made. */
function steps(r: V19Replay): { action: BattleAction; cues: BattleCue[] }[] {
  let state = createBattle(r.input).state
  return r.actions.map((action) => {
    const step = applyBattleAction(state, action)
    state = step.state
    return { action, cues: step.cues }
  })
}

describe('the frozen v19 replays (D261)', () => {
  it.each(replays.map((r) => [r.name, r] as const))('%s replays byte for byte under the live engine', (_, r) => {
    expect(r.input.version).toBe(19)
    expect(replayV19(r.input, r.actions)).toEqual({ outcome: r.outcome, rounds: r.rounds, hash: r.hash, cues: r.cues, cueDigest: r.cueDigest })
  })

  it('pins only v19 fights, with wins, Tier 0s and both healers', () => {
    expect(replays).toHaveLength(8)
    const allies = replays.flatMap((r) => r.input.allies)
    for (const c of ['brawler', 'mage', 'spellblade', 'tomeblade', 'paladin', 'cleric', 'summoner', 'recruit', 'apprentice', 'duelist', 'acolyte', 'caller']) {
      expect(allies.some((a) => a.classId === c), c).toBe(true)
    }
    expect(replays.some((r) => r.outcome === 'victory')).toBe(true)
  })

  it('fires every seat D261 closes or re-kinds, as its Hero or its Learner, with v19\'s kinds', () => {
    const fired = new Map<string, string>()
    for (const r of replays) for (const s of steps(r)) {
      const a = s.action
      if (a.kind !== 'limit') continue
      const ally = r.input.allies.find((x) => x.id === a.actorId)!
      const seat = a.hero ?? ally.hero
      const cue = s.cues.find((c) => c.kind === 'limit')
      if (seat && cue?.kind === 'limit') fired.set(seat, cue.label)
    }
    for (const seat of ['brawler-3', 'brawler-4', 'mage-3', 'mage-4', 'healer-2', 'healer-3', 'healer-4'] as const) {
      expect(fired.get(seat), seat).toBe(heroLimitFor(seat, 19)!.name)
    }
  })
})
