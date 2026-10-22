// The API's path for the Rift's saves (H48): what the run rules write passes `parseSavePut`, and a local row stores and
// loads it. Invented outfits and enemy ids only.
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  autoAction, battleActionsLeft, newOwnedUma, newSave, parseSavePut, SAVE_SCHEMA_VERSION as V, type BattleOutfit, type RiftFightRef, type RosterMember,
  type Save,
} from '@rpg/domain'
import { actInRiftFight, ascend, beginConvergence, riftBattleStep, signUpRift, startRiftFight } from '@rpg/domain/rift'
import { describe, expect, it } from 'vitest'
import { LocalSaveRepository } from './local-save.repository'

const T = (n: number) => new Date(Date.UTC(2026, 9, 20, 12) + n * 60_000).toISOString()
const ids = (from: number, n: number) => Array.from({ length: n }, (_, i) => `${from + i}`)
const CLASSES = ['brawler', 'mage', 'spellblade', 'cleric', 'summoner'] as const
const ROSTER: RosterMember[] = (['boss', 'subboss', 'key', 'regular'] as const).flatMap((tier) =>
  (['azurlane', 'nikke', 'priconne'] as const).flatMap((franchise) => [1, 2, 3].map((i) => ({ id: `${franchise}-${tier}-${i}`, name: `${tier} ${i}`, franchise, tier }))))
const OUTFITS = new Map(ids(101, 25).map((id): [string, BattleOutfit] => [id, {
  outfitId: id, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
  growthRatePercents: { speed: 10, stamina: 10, power: 10, guts: 10, wit: 10 }, aptitudes: { strategy: { front: 'A', pace: 'G', late: 'G', end: 'G' } },
}]))

/** Twenty-five Lv 50 Umas in parties 0–4. */
function lv50(): Save {
  const save = newSave('API Rift', T(0))
  const world = save.tierWorlds['1']!
  ids(101, 25).forEach((id, i) => {
    world.umas[id] = { ...newOwnedUma(T(0)), level: 50, classId: CLASSES[i % 5]! }
    world.parties[Math.floor(i / 5)]!.slots[i % 5] = id
  })
  return save
}

/** Starts a fight, sets its foes to 1 HP, and plays it on Auto to a win. */
function win(save: Save, ref: RiftFightRef, party: number | null, at: number): Save {
  let s = startRiftFight(save, ref, party, OUTFITS, ROSTER, T(at))
  const battle = s.tierWorlds['1']!.rift.battle!
  const soft = <E extends { stats: { hp: number } }>(e: E): E => ({ ...e, stats: { ...e.stats, hp: 1 } })
  battle.input = { ...battle.input, enemies: battle.input.enemies.map(soft), ...(battle.input.waves ? { waves: battle.input.waves.map((w) => w.map(soft)) } : {}) }
  for (let n = 1; n < 1000; n += 1) {
    const state = riftBattleStep(s.tierWorlds['1']!)!.state
    const ally = state.units.find((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(state, u.id) > 0)!
    const acted = actInRiftFight(s, autoAction(state, ally.id), ROSTER, T(at + n))
    s = acted.save
    if (acted.result) {
      expect(acted.result.outcome).toBe('victory')
      return s
    }
  }
  throw new Error('the fight never ended')
}

const put = (save: Save) => parseSavePut(JSON.parse(JSON.stringify({ baseRevision: 3, save })))

describe('the Rift’s saves through the API (H48)', () => {
  it('parses a sign-up, a won stage, an open attempt, an Echo win and an Ascend as written', async () => {
    let save = signUpRift(lv50(), ids(101, 20), T(1))
    expect(put(save).save).toEqual(save)
    save = win(save, { kind: 'front', front: 'iron', stage: 1 }, 0, 10)
    expect(put(save).save).toEqual(save)
    expect(save.account.defeated).not.toEqual({})
    for (const front of ['iron', 'arcane', 'duel', 'horde'] as const) save.tierWorlds['1']!.rift.runs[0]!.fronts[front] = 12
    save = beginConvergence(save, [0, 1, 2, 3], T(100))
    expect(put(save).save).toEqual(save)
    save = win(save, { kind: 'echo', front: 'horde', level: '50' }, 4, 200)
    expect(put(save).save).toEqual(save)
    for (let fight = 0; fight < 4; fight += 1) save = win(save, { kind: 'convergence', fight }, null, 300 + 100 * fight)
    const ascended = ascend(save, T(800)).save
    const parsed = put(ascended)
    expect(parsed).toMatchObject({ baseRevision: 3, sentSchemaVersion: V })
    expect(parsed.save).toEqual(ascended)
    expect(Object.keys(ascended.tierWorlds['2']!.umas)).toHaveLength(20)

    const repo = new LocalSaveRepository(join(await mkdtemp(join(tmpdir(), 'rpg-save-')), 'save.json'))
    expect((await repo.put('u', 0, parsed.save, V)).revision).toBe(1)
    expect((await repo.load('u')).save).toEqual(ascended)
  })
})
