// Achievements (H49): the catalog and each rule of `achievementsEarned`, on wins built by hand.
import { describe, expect, it } from 'vitest'
import { BATTLE_ENGINE_VERSION, createBattle } from '../rpg/battle/engine'
import type { BattleInput, BattleState } from '../rpg/battle/types'
import { rpgFoe } from '../rpg/campaign/enemies'
import type { RpgClass } from '../rpg/rules'
import { BALANCE_PARTY, balanceMember } from '../world/balance-party'
import type { EnemyRoster } from '../world/roster'
import { ACHIEVEMENTS, achievementDef, achievementsEarned, type RiftWin } from './achievements'
import { ACHIEVEMENT_IDS, RIFT_TITLES, type RiftFightRef, type RiftRun } from './state'

const NOW = '2026-10-21T12:00:00.000Z'
const ROSTER: EnemyRoster = [
  { id: 'boss-a', name: 'A', tier: 'boss' }, { id: 'boss-b', name: 'B', tier: 'boss' },
  { id: 'subboss-c', name: 'C', tier: 'subboss' }, { id: 'key-d', name: 'D', tier: 'key' }, { id: 'regular-e', name: 'E', tier: 'regular' },
]
const ALL_FACES = { 'boss-a': NOW, 'boss-b': NOW, 'subboss-c': NOW }

/** A finished fight: Lv 50 balance Umas of these classes against one boss, won in `round` rounds. */
function fight(classes: readonly RpgClass[] = BALANCE_PARTY, round = 6, outcome: BattleState['outcome'] = 'victory'): BattleState {
  const input: BattleInput = {
    version: BATTLE_ENGINE_VERSION, seed: 49,
    allies: classes.map((c, k) => balanceMember(c, 101 + k, 50)),
    enemies: [rpgFoe({ id: 'f1', castId: 'boss-a', element: 'fire', role: 'champion', rank: 'boss', level: 50, shield: 6,
      weaknesses: { weapons: ['greatsword'], elements: ['ice'] } })],
  }
  return { ...createBattle(input).state, outcome, round }
}
function run(over: Partial<RiftRun> = {}): RiftRun {
  return { id: 't1-r2', roster: Array.from({ length: 20 }, (_, i) => `${101 + i}`), startedAt: NOW,
    fronts: { iron: 12, arcane: 12, duel: 12, horde: 12 }, convergence: { attempts: 1, open: null }, traces: {},
    wonAt: null, ascendedAt: null, ...over }
}
const front = (f: 'iron' | 'arcane' | 'duel' | 'horde', stage = 12): RiftFightRef => ({ kind: 'front', front: f, stage })
function win(over: Partial<RiftWin> = {}): RiftWin {
  return { tier: 1, ref: front('iron'), run: run(), attemptRounds: null, state: fight(), defeated: {}, roster: ROSTER, ...over }
}
const ids = (w: RiftWin, held: Record<string, unknown> = {}) => achievementsEarned(w, held).map((g) => g.id)

describe('the catalog', () => {
  it('has one entry per id, in ACHIEVEMENT_IDS order', () => {
    expect(ACHIEVEMENTS.map((a) => a.id)).toEqual([...ACHIEVEMENT_IDS])
    for (const id of ACHIEVEMENT_IDS) expect(ACHIEVEMENTS.filter((a) => a.id === id)).toHaveLength(1)
    expect(ACHIEVEMENTS).toHaveLength(19)
  })

  it('names each one and its tier, front and badge', () => {
    expect(achievementDef('t2-seal-iron')).toEqual({ id: 't2-seal-iron', kind: 'seal', tier: 2, front: 'iron', name: 'Iron Seal',
      how: 'Win the Iron front’s champion', badge: 'achievement/seal-iron' })
    expect(achievementDef('t1-rift-conquered')).toMatchObject({ kind: 'conquered', tier: 1, front: null, name: 'Rift Conquered',
      how: 'Win the Convergence', badge: 'achievement/rift-conquered' })
    expect(achievementDef('untouched-duel')).toMatchObject({ kind: 'title', tier: null, front: 'duel', name: 'Untouched · Duel',
      how: 'Seal Duel with no Uma knocked out', badge: 'achievement/untouched' })
    expect(achievementDef('iron-will')).toMatchObject({ front: null, badge: 'achievement/iron-will', how: 'Seal Iron with no magic dealt' })
    expect(ACHIEVEMENTS.filter((a) => a.kind === 'title').map((a) => a.id)).toEqual([...RIFT_TITLES])
    expect(achievementDef('t3-seal-iron')).toBeUndefined()
  })
})

describe('achievementsEarned', () => {
  it('earns a champion\'s seal and titles in catalog order, with the run', () => {
    const w = win({ run: run({ traces: { iron: ['physical'] } }) })
    expect(achievementsEarned(w, {})).toEqual([
      { id: 't1-seal-iron', run: 't1-r2' }, { id: 'iron-will', run: 't1-r2' }, { id: 'untouched-iron', run: 't1-r2' }, { id: 'crossover', run: 't1-r2' },
    ])
  })

  it('earns nothing below a front\'s twelfth stage', () => {
    expect(ids(win({ ref: front('iron', 11) }))).toEqual([])
    expect(ids(win({ ref: front('arcane', 5) }))).toEqual([])
  })

  it('keeps Iron Will and Arcane Purity to their front and channel', () => {
    expect(ids(win({ run: run({ traces: { iron: ['physical', 'magical'] } }) }))).not.toContain('iron-will')
    expect(ids(win({ ref: front('arcane'), run: run({ traces: { arcane: ['magical'] } }) })))
      .toEqual(['t1-seal-arcane', 'arcane-purity', 'untouched-arcane', 'crossover'])
    expect(ids(win({ ref: front('arcane'), run: run({ traces: { arcane: ['physical', 'magical'] } }) }))).not.toContain('arcane-purity')
    expect(ids(win({ ref: front('duel'), run: run({ traces: { duel: ['physical'] } }) }))).toEqual(['t1-seal-duel', 'untouched-duel', 'crossover'])
  })

  it('earns Untouched only with no Uma knocked out on that front', () => {
    expect(ids(win({ ref: front('horde'), run: run({ traces: { horde: ['physical', 'ko'] } }) }))).toEqual(['t1-seal-horde', 'crossover'])
    expect(ids(win({ ref: front('horde'), run: run({ traces: { iron: ['ko'], horde: ['magical'] } }) }))).toContain('untouched-horde')
  })

  it('earns Rift Conquered on the Convergence\'s last fight, and Swift Convergence under 8 rounds each', () => {
    const last: RiftFightRef = { kind: 'convergence', fight: 3 }
    const four = (attemptRounds: number[]) => win({ ref: last, attemptRounds, run: run({ wonAt: NOW }), state: fight(['brawler', 'brawler', 'mage', 'cleric', 'summoner']) })
    expect(ids(four([5, 6, 7, 7]))).toEqual(['t1-rift-conquered', 'swift-convergence'])
    expect(ids(four([5, 6, 8, 7]))).toEqual(['t1-rift-conquered'])
    expect(ids(four([5, 6, 7]))).toEqual(['t1-rift-conquered'])
    expect(ids(win({ ref: { kind: 'convergence', fight: 2 }, attemptRounds: [5, 6, 7] }))).toEqual(['crossover'])
  })

  it('earns the Bestiary with every boss and sub-boss defeated, on any win, with no run', () => {
    const echo: RiftFightRef = { kind: 'echo', front: 'iron', level: '50' }
    expect(achievementsEarned(win({ ref: echo, run: null, defeated: ALL_FACES }), {})).toEqual([{ id: 'bestiary', run: null }])
    expect(achievementsEarned(win({ ref: front('iron', 3), defeated: ALL_FACES }), {})).toEqual([{ id: 'bestiary', run: null }])
    expect(ids(win({ ref: echo, run: null, defeated: { 'boss-a': NOW, 'boss-b': NOW } }))).toEqual([])
    expect(ids(win({ ref: echo, run: null, defeated: ALL_FACES, roster: ROSTER.filter((m) => m.tier === 'regular' || m.tier === 'key') }))).toEqual([])
  })

  it('earns Crossover on a champion fight won by one party of five classes', () => {
    expect(ids(win({ state: fight(['brawler', 'brawler', 'mage', 'cleric', 'summoner']) }))).not.toContain('crossover')
    expect(ids(win({ ref: front('iron', 5) }))).not.toContain('crossover')
    expect(ids(win({ ref: { kind: 'convergence', fight: 0 }, attemptRounds: [4] }))).toEqual(['crossover'])
    expect(ids(win({ ref: { kind: 'echo', front: 'iron', level: '55' }, run: null }))).toEqual([])
  })

  it('never earns what the account holds, and seals carry their tier', () => {
    const held = { 't1-seal-iron': { at: NOW, run: 't1-r1' }, crossover: { at: NOW, run: 't1-r1' } }
    expect(ids(win(), held)).toEqual(['iron-will', 'untouched-iron'])
    expect(ids(win({ tier: 2, run: run({ id: 't2-r1' }) }), held)).toEqual(['t2-seal-iron', 'iron-will', 'untouched-iron'])
    expect(ids(win({ tier: 2, ref: { kind: 'convergence', fight: 3 }, attemptRounds: [9, 9, 9, 9] }))).toEqual(['t2-rift-conquered', 'crossover'])
  })

  it('earns nothing from a fight that wasn\'t won', () => {
    expect(ids(win({ state: fight(BALANCE_PARTY, 6, 'loss'), defeated: ALL_FACES }))).toEqual([])
  })
})
