import { describe, expect, it } from 'vitest'
import { applyBattleAction, battleActionsLeft, createBattle } from '../battle/engine'
import { battleWeakness } from '../battle/skills'
import type { BattleState } from '../battle/types'
import { grantRpgExp, projectRpgStats, RPG_ELEMENTS, type RpgProfile } from '../rules'
import { rpgCampaignChapter, rpgChapterReach, rpgNodeParents, rpgTierLevel, type RpgCampaignChapter, type RpgMapNode } from './chapters'
import { RPG_FINALS, rpgFinals } from './finals'
import { rpgBattleBaseExp, rpgBattleExp, rpgBattleLaurels, rpgLevelExpFactor, rpgRewardKind, rpgShardsBetween } from './rewards'
import {
  createRpgRun, rpgAbandonRunBattle, rpgActInRun, rpgBeginRunBattle, rpgCarriedMp, rpgChapterCleared, rpgCloseRunBattle, rpgNodeStatus,
  rpgRestAtCamp, rpgRunBattleStep,
} from './run'

// Invented cast only.
const cast = Array.from({ length: 7 }, (_, i) => ({ id: `cast${i}`, name: `Rival ${i}` }))
const T = (n: number) => `2026-10-10T12:00:${String(n).padStart(2, '0')}.000Z`
const tier1 = [1, 2, 3, 4, 5].map((order) => rpgCampaignChapter({ scenarioId: 1000 + order, name: `Chapter ${order}`, order }, cast))
const ura = tier1[0]!

describe('generated chapters (D48)', () => {
  it('builds ten-level chapters: three fight stages, then three authored Finals routes at the tenth level', () => {
    expect(tier1.map((c) => c.levelStart)).toEqual([1, 11, 21, 31, 41])
    expect(tier1.map((c) => c.tier)).toEqual([1, 1, 1, 1, 1])
    for (const chapter of tier1) {
      const ids = new Set(chapter.nodes.map((n) => n.id))
      expect(ids.size).toBe(chapter.nodes.length)
      expect(chapter.nodes.every((n) => n.exits.every((e) => ids.has(e)))).toBe(true)
      expect(chapter.nodes.filter((n) => n.id !== 'start').every((n) => rpgNodeParents(chapter, n.id).length > 0)).toBe(true)
      const finals = rpgFinals(chapter.order)
      const bosses = chapter.nodes.filter((n) => n.kind === 'boss')
      expect(bosses.map((n) => n.id)).toEqual(['route1-boss', 'route2-boss', 'route3-boss'])
      expect(bosses.map((n) => n.element)).toEqual(finals.routes.map((r) => r.champion.element))
      expect(bosses.every((n) => n.level === chapter.levelStart + 9 && n.exits.length === 0)).toBe(true)
      expect(chapter.nodes.filter((n) => n.kind === 'sub-boss').map((n) => n.level - chapter.levelStart)).toEqual([2, 5, 8, 9, 9, 9])
      const fights = chapter.nodes.filter((n) => n.kind === 'fight')
      expect(fights.map((n) => n.level - chapter.levelStart)).toEqual([0, 0, 0, 1, 1, 1, 3, 3, 3, 4, 4, 4, 6, 6, 6, 7, 7, 7])
      expect(chapter.nodes.every((n) => n.col >= 0 && n.col < 5 && n.enemies.length <= 5)).toBe(true)
      for (const n of chapter.nodes.filter((x) => x.kind !== 'camp')) {
        expect(n.enemies.every((e) => e.level === n.level && cast.some((c) => c.id === e.castId))).toBe(true)
      }
    }
  })

  it('is deterministic for a chapter and cast, and maps lifetime levels to tiers', () => {
    const source = { scenarioId: 1001, name: 'URA', order: 1 }
    expect(JSON.stringify(rpgCampaignChapter(source, [...cast].reverse()))).toBe(JSON.stringify(rpgCampaignChapter(source, cast)))
    expect(rpgCampaignChapter({ ...source, order: 6 }, cast)).toMatchObject({ tier: 2, levelStart: 51 })
    expect(rpgTierLevel(51)).toEqual({ tier: 2, level: 1 })
    expect(rpgTierLevel(140)).toEqual({ tier: 3, level: 40 })
  })

  it('reads the fourteen authored Finals by release order and reuses them past the fourteenth', () => {
    expect(RPG_FINALS).toHaveLength(14)
    expect(rpgFinals(1).title).toBe('URA Finals')
    expect(rpgFinals(15)).toBe(rpgFinals(1))
    for (const finals of RPG_FINALS) expect(new Set(finals.routes.map((r) => r.champion.element)).size).toBe(3)
  })

  it('shows more weaknesses on weaker foes and bigger shields on stronger ones, never their own element', () => {
    const foes = ura.nodes.flatMap((n) => n.enemies)
    const counts = (rank: string) => new Set(foes.filter((f) => f.rank === rank).map((f) => `${f.weaknesses.weapons.length}+${f.weaknesses.elements.length}`))
    expect([...counts('regular')].sort()).toEqual(['2+3', '3+2'])
    expect([...counts('sub-boss')]).toEqual(['2+2'])
    expect(foes.every((f) => !f.weaknesses.elements.includes(f.element) && f.weaknesses.elements[0] === battleWeakness(f.element))).toBe(true)
    expect(new Set(foes.filter((f) => f.rank === 'boss').map((f) => f.shield))).toEqual(new Set([8]))
    expect([rpgChapterReach(1), rpgChapterReach(11), rpgChapterReach(21)]).toEqual([1, 1.375, 2.9 / 1.6])
  })
})

describe('rewards (D51)', () => {
  it('pays a share of a level, scaled ±10% per level of gap within 10%–200%', () => {
    expect([rpgBattleBaseExp('fight', 5), rpgBattleBaseExp('sub-boss', 5), rpgBattleBaseExp('vanguard', 5), rpgBattleBaseExp('boss', 5)])
      .toEqual([84, 56, 30, 40])
    expect([rpgLevelExpFactor(8, 5), rpgLevelExpFactor(5, 8), rpgLevelExpFactor(20, 5), rpgLevelExpFactor(1, 30)]).toEqual([0.7, 1.3, 0.1, 2])
    expect(rpgBattleExp('fight', 5, 8)).toBe(59)
    expect(ura.nodes.filter((n) => n.kind === 'sub-boss').map(rpgRewardKind)).toEqual(['sub-boss', 'sub-boss', 'sub-boss', 'vanguard', 'vanguard', 'vanguard'])
  })

  it('pays Laurels by kind and tier, and a Shard at Lv10, 20, 30, 40 and 50', () => {
    expect([rpgBattleLaurels('fight', 1), rpgBattleLaurels('boss', 1), rpgBattleLaurels('boss', 2)]).toEqual([2, 10, 20])
    expect([rpgShardsBetween(9, 10), rpgShardsBetween(10, 11), rpgShardsBetween(8, 31), rpgShardsBetween(49, 50)]).toEqual([1, 0, 3, 1])
  })

  // Pacing (D48): a party that clears every node of a chapter ends near its last level; one path ends a few levels short.
  const levelAfter = (chapters: RpgCampaignChapter[], pick: (c: RpgCampaignChapter) => RpgMapNode[]) => {
    let me = { tier: 1, level: 1, exp: 0 }
    const ends: number[] = []
    for (const chapter of chapters) {
      for (const node of pick(chapter)) {
        const gained = grantRpgExp(me, rpgBattleExp(rpgRewardKind(node), node.level, me.level))
        me = { ...me, level: gained.level, exp: gained.exp }
      }
      ends.push(me.level)
    }
    return ends
  }
  it('levels a party through Tier 1 at about ten levels a chapter', () => {
    const everything = levelAfter(tier1, (c) => c.nodes.filter((n) => n.kind !== 'camp'))
    const onePath = levelAfter(tier1, (c) => c.nodes.filter((n) => n.kind !== 'camp' && (n.kind !== 'fight' || n.col === 2) &&
      (!n.id.startsWith('route') || n.id.startsWith('route1'))))
    expect(everything).toEqual([10, 20, 30, 40, 50])
    // One path a chapter falls behind; replays close the gap, since fights above her level pay up to double.
    expect(onePath).toEqual([6, 14, 22, 31, 40])
  })
})

/** An invented Lv1 party: five Brawlers with no skills. */
function member(id: string, level = 1): RpgProfile {
  return { outfitId: id, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
    growthRates: { speed: 0.1, stamina: 0.1, power: 0.1, guts: 0.1, wit: 0.1 }, classId: 'brawler', weapons: ['greatsword', 'spear'],
    tier: 1, level, exp: 0, tree: [], legacy: [] }
}
const party = ['m1', 'm2', 'm3', 'm4', 'm5'].map((id) => ({ profile: member(id), loadout: [], familiar: 'greatsword' as const }))

/** Attacks the weakest-shielded foe with each weapon in turn until the fight ends. */
function autoplay(state: BattleState): BattleState {
  let s = state
  for (let guard = 0; s.outcome === 'active' && guard < 400; guard += 1) {
    const ally = s.units.find((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(s, u.id) > 0)!
    const target = s.units.filter((u) => u.side === 'enemy' && u.hp > 0).sort((a, b) => a.shield - b.shield || a.hp - b.hp)[0]!
    const step = applyBattleAction(s, { kind: 'attack', actorId: ally.id, targetId: target.id })
    expect(step.error).toBeUndefined()
    s = step.state
  }
  return s
}

describe('runs (D52)', () => {
  it('opens nodes below each clear, replays the open fight from its actions and carries MP', () => {
    let run = createRpgRun(0, ura.id, T(1))
    const first = ura.nodes.find((n) => n.id === 'start')!.exits[0]!
    const below = ura.nodes.find((n) => n.id === first)!.exits[0]!
    expect(rpgNodeStatus(ura, run, first)).toBe('available')
    expect(rpgNodeStatus(ura, run, below)).toBe('locked')
    expect(() => rpgBeginRunBattle(ura, run, below, party, T(2))).toThrow(/path/)
    expect(() => rpgBeginRunBattle(ura, run, first, party.slice(0, 4), T(2))).toThrow(/five/)
    run = rpgBeginRunBattle(ura, run, first, party, T(2))
    // Two actions, then the replayed state matches the live one.
    let live = createBattle(run.battle!.input).state
    for (const [i, actor] of ['m1', 'm2'].entries()) {
      const action = { kind: 'attack' as const, actorId: actor, targetId: 'foe1' }
      const acted = rpgActInRun(run, action, T(3 + i))
      run = acted.run
      live = applyBattleAction(live, action).state
      expect(acted.step.state).toEqual(live)
    }
    expect(rpgRunBattleStep(run)!.state).toEqual(live)
    expect(() => rpgActInRun(run, { kind: 'attack', actorId: 'm1', targetId: 'foe1' }, T(5))).toThrow(/refused/)
    const won = autoplay(live)
    expect(won.outcome).toBe('victory')
    run = rpgCloseRunBattle(run, won, ura.nodes.find((n) => n.id === first)!, T(6))
    expect(run.battle).toBeNull()
    expect(run.wins[first]).toBe(1)
    expect(rpgNodeStatus(ura, run, below)).toBe('available')
    expect(rpgCarriedMp(run, party[0]!.profile)).toBe(won.units.find((u) => u.id === 'm1')!.mp)
    run = rpgRestAtCamp(ura, run, 'start', T(7))
    expect(rpgCarriedMp(run, party[0]!.profile)).toBe(projectRpgStats(party[0]!.profile).mp)
    expect(rpgChapterCleared(ura, run)).toBe(false)
  })

  it('leaves the run as it was after a loss or a retreat', () => {
    const open = rpgBeginRunBattle(ura, createRpgRun(0, ura.id, T(1)), 'a1r1c1', party, T(2))
    const lost = rpgCloseRunBattle(open, { ...createBattle(open.battle!.input).state, outcome: 'loss' }, { id: 'a1r1c1', kind: 'fight' }, T(3))
    expect(lost.wins).toEqual({ start: 1 })
    expect(lost.battle).toBeNull()
    expect(rpgAbandonRunBattle(open, T(3)).battle).toBeNull()
  })

  it('lets a fresh Lv1 party of attackers win the first fights of the first chapter', () => {
    for (const id of ['a1r1c1', 'a1r1c2', 'a1r1c3']) {
      const run = rpgBeginRunBattle(ura, createRpgRun(0, ura.id, T(1)), id, party, T(2))
      expect(autoplay(createBattle(run.battle!.input).state).outcome).toBe('victory')
    }
  })

  it('keeps every element in play for the chapter bosses', () => {
    const elements = new Set(tier1.flatMap((c) => c.nodes.filter((n) => n.kind !== 'fight' && n.element).map((n) => n.element)))
    expect(elements.size).toBe(RPG_ELEMENTS.length)
  })
})
