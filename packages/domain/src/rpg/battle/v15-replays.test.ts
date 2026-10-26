// v6–v15 fights replay exactly, whatever the Tier rework builds (H64, D200): the frozen fixture's v15 fights, generated on
// the engine before H64, replayed under the live engine. Since H72 (D210) every rule's default reads the Tier rework's
// fight (three weapons, the Summoner's Arms hand 0.50), and since H82 (D218) its economy (engine v17): a rules call in the
// engine that leaned on its default instead of the fight's version would move them. (Until H72 and H82 twin files
// replayed them with `caps.ts` mocked to 16 and 17; this is now that case, live.)
import { describe, expect, it } from 'vitest'
import { RPG_ALL_CLASSES, RPG_CLASS_SLOTS, RPG_WEAPON_SLOTS, rpgHand } from '../rules'
import { applyBattleAction, BATTLE_ENGINE_VERSION, createBattle, rpgRework, rpgV2 } from './engine'
import type { BattleAction, BattleCue } from './types'
import { loadV15Replays, regenerateV15Replays, replayV15, type V15Replay } from './v15-replays.fixture'

const replays = process.env.UPDATE_V15 ? regenerateV15Replays() : loadV15Replays()

/** Each action of a pinned fight with the cues it made, and the class of its actor. */
function steps(r: V15Replay): { action: BattleAction; classId: string; cues: BattleCue[] }[] {
  let state = createBattle(r.input).state
  return r.actions.map((action) => {
    const step = applyBattleAction(state, action)
    state = step.state
    return { action, classId: r.input.allies.find((a) => a.id === action.actorId)!.classId, cues: step.cues }
  })
}
const halves = (a: BattleAction): string[] =>
  a.kind === 'guard' || a.kind === 'limit' ? [] : [...(a.kind === 'skill' ? [a.skill.id] : []), ...(a.pair?.skill ? [a.pair.skill.id] : [])]

describe('the frozen v15 replays (H64)', () => {
  it('runs with the Tier rework’s fight and economy live (H72, H82)', () => {
    expect(BATTLE_ENGINE_VERSION).toBe(17)
    expect([rpgV2(), rpgRework('fight'), rpgRework('economy'), rpgRework('t2Weapons')]).toEqual([true, true, true, false])
    expect(RPG_WEAPON_SLOTS).toBe(3)
    expect(RPG_CLASS_SLOTS.brawler).toHaveLength(3)
    expect(rpgHand({ classId: 'summoner' })).toMatchObject({ arms: 0.5, tome: 0.58 })
  })

  it.each(replays.map((r) => [r.name, r] as const))('%s replays byte for byte under the live engine', (_, r) => {
    expect(r.input.version).toBe(15)
    expect(replayV15(r.input, r.actions)).toEqual({ outcome: r.outcome, rounds: r.rounds, hash: r.hash, cues: r.cues, cueDigest: r.cueDigest })
  })

  it('pins only v15 fights, and covers what the Tier rework must not move', () => {
    expect(replays).toHaveLength(8)
    expect(replays.every((r) => r.input.version === 15)).toBe(true)
    const allies = replays.flatMap((r) => r.input.allies)
    const foes = replays.flatMap((r) => [...r.input.enemies, ...(r.input.waves ?? []).flat()])
    const all = replays.flatMap(steps)
    const cues = all.flatMap((s) => s.cues)
    // Every class of classes v2, both healers, and Learners.
    expect(new Set(allies.map((a) => a.classId))).toEqual(new Set(RPG_ALL_CLASSES))
    expect(replays.filter((r) => r.input.allies.some((a) => a.classId === 'paladin')).length).toBeGreaterThanOrEqual(2)
    expect(replays.filter((r) => r.input.allies.some((a) => a.classId === 'cleric')).length).toBeGreaterThanOrEqual(3)
    expect(allies.some((a) => a.inherits?.length)).toBe(true)
    // Spell Blade and Summoner pairs; a Summoner's pair opening on her lingering summon's farewell (a summon cue, then hits).
    const pair = (classId: string) => all.filter((s) => s.classId === classId && s.action.kind !== 'limit' && s.action.kind !== 'guard' && s.action.pair)
    expect(pair('spellblade').length).toBeGreaterThan(0)
    expect(pair('summoner').some((s) => s.cues[0]?.kind === 'summon' && s.cues[1]?.kind === 'hit' && s.cues[1].actorId === s.action.actorId)).toBe(true)
    // Both healers' kits: Barriers on every Uma, Aegis, Regen, drain, and a revive.
    const wide = (classId: string) => all.some((s) => s.classId === classId &&
      new Set(s.cues.flatMap((c) => (c.kind === 'cover' ? [c.targetId] : []))).size >= 4)
    expect([wide('paladin'), wide('cleric')]).toEqual([true, true])
    expect(cues.some((c) => c.kind === 'status' && c.label === 'aegis')).toBe(true)
    for (const label of ['Regen', 'Drain', 'Revived']) expect(cues.some((c) => c.kind === 'heal' && c.label === label), label).toBe(true)
    // Inherited Limit Breaks, locks, Breaks, warded hits and the Rift's traits.
    expect(all.some((s) => s.action.kind === 'limit' && s.action.hero)).toBe(true)
    for (const kind of ['limit', 'lock', 'break', 'summon'] as const) expect(cues.some((c) => c.kind === kind), kind).toBe(true)
    expect(cues.some((c) => c.kind === 'hit' && c.label === 'Warded')).toBe(true)
    expect([foes.some((e) => e.ward), foes.some((e) => e.thrice), foes.some((e) => e.mixedLocks)]).toEqual([true, true, true])
    // Waves and wins.
    expect(replays.some((r) => r.input.waves?.length)).toBe(true)
    expect(replays.some((r) => r.outcome === 'victory')).toBe(true)
  })

  it('pins what R1 changes: the Flurry line, Valkyrie’s Oath and the Light 3B, the Axe summons, and two hall Limit Breaks', () => {
    const r = replays.find((x) => x.name.startsWith('what R1 changes'))!
    const of = (classId: string) => r.input.allies.find((a) => a.classId === classId)!
    const equipped = (classId: string) => of(classId).loadout.map((x) => x.id)
    expect(equipped('spellblade')).toEqual(expect.arrayContaining(['spellblade-katana.3b', 'spellblade-katana.4b', 'spellblade-katana.5b']))
    expect(of('paladin').weapons).toEqual(['greatsword', 'axe', 'lance', 'tome-light', 'tome-ice'])
    expect(equipped('paladin')).toEqual(expect.arrayContaining(['paladin-lance.4b', 'paladin-tome-light.3b']))
    expect(of('summoner').weapons).toContain('axe')
    expect(equipped('summoner')).toEqual(expect.arrayContaining(['summoner-axe.2', 'summoner-axe.5']))
    expect(r.input.allies.flatMap((a) => a.inherits?.map((i) => i.limit) ?? [])).toEqual(expect.arrayContaining(['cleric-1', 'paladin-3']))
    // Each node cast on Auto, both Limit Breaks fired, and Valkyrie's Oath raised the fallen: a win.
    const played = steps(r)
    const cast = new Set(played.flatMap((s) => halves(s.action)))
    for (const id of ['spellblade-katana.3b', 'spellblade-katana.4b', 'spellblade-katana.5b', 'paladin-lance.4b', 'paladin-tome-light.3b',
      'summoner-axe.2', 'summoner-axe.5']) expect(cast.has(id), id).toBe(true)
    const heroes = played.flatMap((s) => (s.action.kind === 'limit' && s.action.hero ? [s.action.hero] : []))
    expect(heroes).toEqual(expect.arrayContaining(['cleric-1', 'paladin-3']))
    const oath = played.filter((s) => halves(s.action).includes('paladin-lance.4b'))
    expect(oath.some((s) => s.cues.some((c) => c.kind === 'heal' && c.label === 'Revived' && c.actorId === of('paladin').id))).toBe(true)
    expect(r.outcome).toBe('victory')
  })
})
