// v18 fights replay exactly while Classes v3 and Halls v2 are built dark at engine v19 (H126, D240–D241): the frozen
// fixture's fights were generated on the live v18 engine before H126 touched it. Every rules call in the engine reads the
// fight's version, so they replay whatever v19 adds; `v18-replays-live19.test.ts` replays them with the switch at 19.
import { describe, expect, it } from 'vitest'
import { rpgClasses } from '../rules'
import { applyBattleAction, BATTLE_ENGINE_VERSION, createBattle, rpgRework } from './engine'
import type { BattleAction, BattleCue } from './types'
import { loadV18Replays, regenerateV18Replays, replayV18, type V18Replay } from './v18-replays.fixture'

const replays = process.env.UPDATE_V18 ? regenerateV18Replays() : loadV18Replays()

/** Each action of a pinned fight with the cues it made, and the class of its actor. */
function steps(r: V18Replay): { action: BattleAction; classId: string; cues: BattleCue[] }[] {
  let state = createBattle(r.input).state
  return r.actions.map((action) => {
    const step = applyBattleAction(state, action)
    state = step.state
    return { action, classId: r.input.allies.find((a) => a.id === action.actorId)!.classId, cues: step.cues }
  })
}
const halves = (a: BattleAction): string[] =>
  a.kind === 'guard' || a.kind === 'limit' ? [] : [...(a.kind === 'skill' ? [a.skill.id] : []), ...(a.pair?.skill ? [a.pair.skill.id] : [])]

describe('the frozen v18 replays (H126)', () => {
  it('runs with weaknesses v2 live while Classes v3 stays dark', () => {
    expect(BATTLE_ENGINE_VERSION).toBe(18)
    expect([rpgRework('weak'), rpgRework('classes'), rpgRework('t2Weapons')]).toEqual([true, false, false])
  })

  it.each(replays.map((r) => [r.name, r] as const))('%s replays byte for byte under the live engine', (_, r) => {
    expect(r.input.version).toBe(18)
    expect(replayV18(r.input, r.actions)).toEqual({ outcome: r.outcome, rounds: r.rounds, hash: r.hash, cues: r.cues, cueDigest: r.cueDigest })
  })

  it('pins only v18 fights: every class, graded gear, the Rift traits and wins', () => {
    expect(replays).toHaveLength(8)
    expect(replays.every((r) => r.input.version === 18)).toBe(true)
    const allies = replays.flatMap((r) => r.input.allies)
    const foes = replays.flatMap((r) => [...r.input.enemies, ...(r.input.waves ?? []).flat()])
    expect(new Set(allies.map((a) => a.classId))).toEqual(new Set(rpgClasses(18)))
    expect(replays.filter((r) => r.input.allies.some((a) => a.classId === 'paladin')).length).toBeGreaterThanOrEqual(2)
    expect(replays.filter((r) => r.input.allies.some((a) => a.classId === 'cleric')).length).toBeGreaterThanOrEqual(3)
    expect(allies.some((a) => a.inherits?.length)).toBe(true)
    expect(allies.every((a) => a.might && Object.keys(a.might).length > 0)).toBe(true)
    expect([allies.some((a) => a.bell), allies.some((a) => a.insignia)]).toEqual([true, true])
    expect([foes.some((e) => e.ward), foes.some((e) => e.thrice), foes.some((e) => e.mixedLocks)]).toEqual([true, true, true])
    expect(replays.some((r) => r.outcome === 'victory')).toBe(true)
  })

  it('pins what H128 and H129 change: the extra hit, the farewell, the four reshaped kinds, a splash, a Hero and a Learner', () => {
    const all = replays.flatMap(steps)
    const cast = all.flatMap((s) => halves(s.action))
    const pair = (classId: string) => all.filter((s) => s.classId === classId && (s.action.kind === 'attack' || s.action.kind === 'skill') && s.action.pair)
    // A Spell Blade's pair (her Arms half lands one hit more) and a Summoner's opening on her lingering summon's farewell.
    expect(pair('spellblade').length).toBeGreaterThan(0)
    expect(pair('summoner').some((s) => s.cues[0]?.kind === 'summon' && s.cues[1]?.kind === 'hit' && s.cues[1].actorId === s.action.actorId)).toBe(true)
    // A Bow, a Katana, a Light and a Dark skill, and the Brawler's Bow on line B (Rain: a splash).
    for (const w of ['bow', 'katana', 'tome-light', 'tome-dark']) expect(cast.some((id) => id.includes(`-${w}.`)), w).toBe(true)
    expect(cast.some((id) => /^brawler-bow\.[345]b$/.test(id))).toBe(true)
    // Limit Breaks from a paladin-* seat by its Hero and a cleric-* seat by a Learner.
    const limits = all.flatMap((s) => (s.action.kind === 'limit' ? [{ s, ally: replays.flatMap((r) => r.input.allies).find((a) => a.id === s.action.actorId) }] : []))
    expect(all.some((s) => s.action.kind === 'limit' && s.cues.some((c) => c.kind === 'limit'))).toBe(true)
    const changes = replays.find((r) => r.name.startsWith('what H128'))!
    const fired = steps(changes).filter((s) => s.action.kind === 'limit')
    const heroOf = (id: string) => changes.input.allies.find((a) => a.id === id)!
    expect(fired.some((s) => heroOf(s.action.actorId).hero?.startsWith('paladin-'))).toBe(true)
    expect(fired.some((s) => s.action.kind === 'limit' && s.action.hero?.startsWith('cleric-') && !heroOf(s.action.actorId).hero)).toBe(true)
    expect(limits.length).toBeGreaterThan(0)
  })
})
