import { describe, expect, it } from 'vitest'
import { autoAction } from '../rpg/battle/auto'
import { applyBattleAction, battleActionsLeft, createBattle } from '../rpg/battle/engine'
import { rpgCampaignChapter, rpgFinalsNodeIds } from '../rpg/campaign/chapters'
import { rpgFinals } from '../rpg/campaign/finals'
import { rpgBattleExp, rpgRewardKind } from '../rpg/campaign/rewards'
import { createRpgRun, rpgNodeStatus, rpgRunBattleStep } from '../rpg/campaign/run'
import { actInFight, chooseClass, openFightOf, stageLaurels, startFight, worldRun, type BattleOutfit } from '../save/battle'
import { setPartySlot, unlockUma, worldOf } from '../save/rules'
import { newSave, parseSave, type Save } from '../save/save'
import { capitalChapter, capitalId, capitalStageIds } from './capital'
import { stageBand, stageExpPay, stagePay, stageRegionId, worldContinent } from './world'
import { grantRpgExp, type RpgClass } from '../rpg/rules'

const NOW = '2026-10-12T12:00:00.000Z'
const cast = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))
const synthetic = worldContinent({ name: 'Synthetic continent', order: 1 })
const chapter = capitalChapter(synthetic, cast)
const classes: readonly RpgClass[] = ['brawler', 'mage', 'spellblade', 'cleric', 'summoner']
const outfits = new Map(classes.map((_, i) => {
  const outfitId = `${9000000 + i}`
  const outfit: BattleOutfit = { outfitId, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
    growthRatePercents: { speed: 10, stamina: 10, power: 10, guts: 0, wit: 0 },
    aptitudes: { strategy: { front: 'A', pace: 'B', late: 'C', end: 'D' }, distance: { sprint: 'G', mile: 'G', medium: 'A', long: 'G' } } }
  return [outfitId, outfit]
}))

/** On-time Lv10, Class Rank 10; automatic core loadouts, no gear, side skills or stat points. The ranks come first: from v19
 * (live since H134) she fights as a Tier 1 class only once she holds it, from Class Rank 10 (CV8). */
function party(): Save {
  let save = newSave('Finals test', NOW)
  ;[...outfits.keys()].forEach((id, i) => { save = setPartySlot(unlockUma(save, id, NOW), 0, i, id, NOW) })
  const w = worldOf(save)
  save = { ...save, tierWorlds: { '1': { ...w, umas: Object.fromEntries(Object.entries(w.umas).map(([id, u]) =>
    [id, { ...u, level: 10, ranks: { ...u.ranks, classes: Object.fromEntries(classes.map((classId) => [classId, { rank: 10, exp: 0 }])) } }])) } } }
  ;[...outfits.keys()].forEach((id, i) => { save = chooseClass(save, id, classes[i]!, NOW) })
  return save
}

function play(save: Save, nodeId: string): ReturnType<typeof actInFight> {
  let next = startFight(save, chapter, nodeId, outfits, NOW)
  for (let i = 0; i < 600; i++) {
    const state = rpgRunBattleStep(openFightOf(worldOf(next))!)!.state
    const actor = state.units.find((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(state, u.id) > 0)!
    const acted = actInFight(next, chapter, autoAction(state, actor.id), NOW)
    next = acted.save
    if (acted.result) return acted
  }
  throw new Error('Finals fight did not finish')
}

describe('capital Finals (H15)', () => {
  it('faces a vanguard as a Sub-boss with Key minions and a champion as a Boss with Sub-boss minions, from its franchise (D135)', () => {
    const roster = (['priconne', 'azurlane', 'nikke'] as const).flatMap((franchise) => (['regular', 'key', 'subboss', 'boss'] as const)
      .flatMap((tier) => Array.from({ length: 4 }, (_, n) => ({ id: `${franchise}-${tier}-${n}`, name: 'x', franchise, tier }))))
    for (const [order, franchise] of [[1, 'priconne'], [2, 'azurlane'], [3, 'nikke']] as const) {
      const capital = capitalChapter(worldContinent({ name: 'Synthetic', order }), roster)
      for (const n of capital.nodes.filter((x) => x.kind !== 'camp')) {
        const tiers = n.enemies.map((e) => e.castId.replace(`${franchise}-`, '').replace(/-\d+$/, ''))
        expect(tiers, n.id).toEqual(n.kind === 'boss' ? ['boss', 'subboss', 'subboss'] : ['subboss', 'key', 'key'])
      }
    }
  })

  it('builds three deterministic routes per continent with stable ids and the unchanged authored foes', () => {
    for (let order = 1; order <= 5; order++) {
      const continent = worldContinent({ name: `World ${order}`, order })
      const capital = capitalChapter(continent, cast)
      const legacy = rpgCampaignChapter({ scenarioId: capitalId(continent.id), name: continent.name, order }, cast)
      expect(capital).toEqual(capitalChapter(continent, [...cast].reverse()))
      expect(capital.title).toBe(continent.name)
      expect(capital.nodes).toHaveLength(7)
      expect(capital.levelStart).toBe(order * 10)
      for (let route = 1; route <= 3; route++) {
        const ids = capitalStageIds(continent.id, route), old = rpgFinalsNodeIds(route)
        expect(ids).toEqual({ vanguard: `w${order}-capital-r${route}-s1`, champion: `w${order}-capital-r${route}-s2` })
        for (const kind of ['vanguard', 'champion'] as const) {
          const n = capital.nodes.find((n) => n.id === ids[kind])!
          const spec = rpgFinals(order).routes[route - 1]![kind]
          expect(n.level).toBe(order * 10)
          // The authored foes, unchanged but for their faces (D135).
          const faceless = (list: readonly { castId: string }[]) => list.map(({ castId: _, ...rest }) => rest)
          expect(faceless(n.enemies)).toEqual(faceless(legacy.nodes.find((n) => n.id === old[kind])!.enemies))
          expect(n.enemies).toHaveLength(3)
          expect(n.enemies.map((e) => e.element)).toEqual([spec.element, ...spec.escorts.map((e) => e[1])])
          expect(n.waves).toBeUndefined()
          expect(stagePay(n)).toBe(1)
          expect(stageExpPay(n)).toBe(0.5)
          expect(stageRegionId(n.id)).toBe(capital.id)
          expect(stageBand(n.id)).toBe(order)
        }
      }
    }
    expect(capitalChapter({ ...synthetic, name: 'Renamed synthetic continent' }, cast).title).toBe('Renamed synthetic continent')
    expect(stageExpPay({ id: 'w1-1-1-s12' })).toBe(1)
    expect(stageExpPay({ id: 'w1-1-1-s12', waves: [[]] })).toBe(1.5)
    expect(stageRegionId('w1-1-1-s12')).toBe('w1-1-1')
    for (const route of [0, 4, 1.5, NaN]) expect(() => capitalStageIds('w1', route)).toThrow(RangeError)
  })

  it('adds about one level, not two, when all three routes are cleared on time', () => {
    for (const order of [1, 2, 3, 4]) {
      const capital = capitalChapter(worldContinent({ name: 'Synthetic continent', order }), cast)
      let member = { tier: 1, level: order * 10, exp: 0 }
      for (const node of capital.nodes.filter((n) => n.kind !== 'camp')) {
        member = { ...member, ...grantRpgExp(member, Math.round(rpgBattleExp(rpgRewardKind(node), node.level, member.level) * stageExpPay(node))) }
      }
      expect(member.level).toBe(order * 10 + 1)
    }
  })

  it('opens all vanguards immediately and each champion only after her own vanguard', () => {
    const run = createRpgRun(0, 'world', NOW)
    for (let route = 1; route <= 3; route++) {
      const ids = capitalStageIds(synthetic.id, route)
      expect(rpgNodeStatus(chapter, run, ids.vanguard)).toBe('available')
      expect(rpgNodeStatus(chapter, run, ids.champion)).toBe('locked')
      expect(() => startFight(party(), chapter, ids.champion, outfits, NOW)).toThrow(/before it/)
    }
    run.wins[capitalStageIds(synthetic.id, 2).vanguard] = 1
    expect(rpgNodeStatus(chapter, run, capitalStageIds(synthetic.id, 2).champion)).toBe('available')
    expect(rpgNodeStatus(chapter, run, capitalStageIds(synthetic.id, 1).champion)).toBe('locked')
    expect(rpgNodeStatus(chapter, run, capitalStageIds(synthetic.id, 3).champion)).toBe('locked')
  })

  it('pays sub-boss and boss rewards, not the legacy vanguard rate, including quarter replays and band 5', () => {
    for (let order = 1; order <= 5; order++) {
      const c = capitalChapter(worldContinent({ name: 'Test', order }), cast)
      for (const n of c.nodes.filter((n) => n.kind !== 'camp')) {
        const kind = rpgRewardKind(n), late = order === 5 ? 4 : 1
        expect(kind).toBe(n.kind)
        const full = (n.kind === 'sub-boss' ? 75 : 150) * late
        expect(stageLaurels(kind, c.tier, true, n.level)).toBe(full)
        expect(stageLaurels(kind, c.tier, false, n.level)).toBe(Math.round(full / 4))
      }
    }
  })

  // D112: Limit Breaks come only from the Halls of Heroes, so this party, with no Heroes or Learners, has none. It won 30 of
  // 30 with class Limit Breaks and 29 of 30 without; 27 is the bar, as for any boss.
  it('lets an on-time Lv10 party win the six synthetic capital stages with the shared Auto policy over five seeds, without Limit Breaks', () => {
    let wins = 0
    for (const node of chapter.nodes.filter((n) => n.kind !== 'camp')) {
      const save = party(), w = worldOf(save)
      const unlocked = { ...save, tierWorlds: { '1': { ...w, world: { ...w.world, run: { ...worldRun(w),
        wins: Object.fromEntries(chapter.nodes.map((n) => [n.id, 1])) } } } } }
      const input = openFightOf(worldOf(startFight(unlocked, chapter, node.id, outfits, NOW)))!.battle!.input
      for (const seed of [7, 1001, 2002, 6999, 99999]) {
        let state = createBattle({ ...input, seed }).state
        for (let i = 0; i < 600 && state.outcome === 'active'; i++) {
          const actor = state.units.find((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(state, u.id) > 0)!
          const step = applyBattleAction(state, autoAction(state, actor.id))
          expect(step.error, node.id).toBeUndefined()
          state = step.state
        }
        expect(state.outcome, `${node.id}, seed ${seed}`).not.toBe('active')
        if (state.outcome === 'victory') wins++
      }
    }
    expect(wins).toBeGreaterThanOrEqual(27)
  }, 20_000) // 30 full battles: 4.5 s on CI beside the other simulation files.

  it('saves and reloads capital fights, opens the champion after settlement and banks the correct first/replay rewards', () => {
    const ids = capitalStageIds(synthetic.id, 1)
    const frozen = startFight(party(), chapter, ids.vanguard, outfits, NOW)
    expect(parseSave(JSON.parse(JSON.stringify(frozen)))).toEqual(frozen)
    const first = play(party(), ids.vanguard)
    expect(first.result).toMatchObject({ outcome: 'victory', nodeId: ids.vanguard, chapterId: chapter.id, firstClear: true, laurels: 75 })
    expect(first.result!.members.every((m) => m.exp === Math.round(rpgBattleExp('sub-boss', 10, 10) / 2))).toBe(true)
    for (const member of first.result!.members) {
      expect(member.ranks.find((r) => r.ref.kind === 'class')!.exp).toBe(2 * member.exp)
      // R2 retired the gear bars (WP3; live since H82): a win pays her Class bar alone.
      expect(member.ranks.every((r) => r.ref.kind === 'class')).toBe(true)
    }
    expect(first.result).not.toHaveProperty('tokens')
    expect(rpgNodeStatus(chapter, worldRun(worldOf(first.save)), ids.champion)).toBe('available')
    expect(parseSave(JSON.parse(JSON.stringify(first.save)))).toEqual(first.save)
    // A Spring between fights: the same carried-MP reset the real world uses, without adding a special capital refill.
    const refill = (s: Save): Save => {
      const w = worldOf(s)
      return { ...s, tierWorlds: { '1': { ...w, world: { ...w.world, run: { ...worldRun(w), mp: {} } } } } }
    }
    const boss = play(refill(first.save), ids.champion)
    expect(boss.result).toMatchObject({ outcome: 'victory', firstClear: true, laurels: 150 })
    const replay = play(refill(boss.save), ids.vanguard)
    expect(replay.result).toMatchObject({ outcome: 'victory', firstClear: false, laurels: 19 })
    expect(replay.result!.members.every((m) => m.exp <= Math.ceil(first.result!.members[0]!.exp / 4))).toBe(true)
    expect(worldOf(replay.save).wallet.laurels).toBe(75 + 150 + 19)
    expect(worldRun(worldOf(replay.save)).wins[ids.vanguard]).toBe(2)
  }, 20_000) // Full fight replays and save validation exceeded 5 s on the production runner.
})
