import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { autoAction } from '../rpg/battle/auto'
import { battleActionsLeft } from '../rpg/battle/engine'
import type { BattleEnemy } from '../rpg/battle/types'
import { rpgFinals } from '../rpg/campaign/finals'
import { rpgRunBattleStep } from '../rpg/campaign/run'
import type { RpgClass } from '../rpg/rules'
import { actInFight, chooseClass, openFightOf, startFight, type BattleOutfit } from '../save/battle'
import { setPartySlot, unlockUma, worldOf } from '../save/rules'
import { newSave, type Save } from '../save/save'
import { capitalChapter, capitalRunChapter } from './capital'
import { capitalRunNodeId, capitalRunNodeOf, isCapitalRunChapter } from './capital-run-id'
import { stagePay, worldContinent } from './world'

const roster = (['priconne', 'azurlane', 'nikke'] as const).flatMap((franchise) => (['regular', 'key', 'subboss', 'boss'] as const)
  .flatMap((tier) => Array.from({ length: 6 }, (_, n) => ({ id: `${franchise}-${tier}-${n}`, name: 'x', franchise, tier }))))
const c1 = worldContinent({ name: 'Continent 1', order: 1 })
const tierOf = (e: BattleEnemy) => e.castId.replace(/^[a-z]+-/, '').replace(/-\d+$/, '')
const faceless = (list: readonly BattleEnemy[]) => list.map(({ castId: _, ...rest }) => rest)

describe('a capital run’s fights (D293, H159)', () => {
  it('lays out four lanes of three generals and a two-wave final boss, all at the capital’s level', () => {
    for (let order = 1; order <= 14; order++) {
      const continent = worldContinent({ name: `C${order}`, order }), level = continent.levelStart + 9
      const run = capitalRunChapter(continent, `w${order}-run1`, roster)
      expect(isCapitalRunChapter(run)).toBe(true)
      expect(run).toMatchObject({ id: `w${order}-run1`, order, tier: Math.ceil(order / 5), title: `C${order} · Run 1`, levelStart: level })
      const fights = run.nodes.filter((n) => n.kind !== 'camp')
      expect(fights).toHaveLength(16)
      expect(fights.filter((n) => n.kind === 'sub-boss')).toHaveLength(12)
      expect(fights.filter((n) => n.kind === 'boss')).toHaveLength(4)
      expect(run.nodes[0]).toMatchObject({ id: 'start', kind: 'camp', exits: fights.map((n) => n.id) })
      rpgFinals(order).routes.forEach((route, i) => {
        const lane = i + 1
        for (const k of [1, 2, 3] as const) {
          const n = run.nodes.find((x) => x.id === capitalRunNodeId(run.id, lane, k))!
          const foe = k === 2 ? route.champion : route.vanguard
          expect(n).toMatchObject({ kind: 'sub-boss', level, stage: 0, exits: [], element: foe.element, note: route.line,
            name: `${route.name} · General ${['I', 'II', 'III'][k - 1]}` })
          expect(n.waves).toBeUndefined()
          expect(n.enemies.map((e) => e.element)).toEqual([foe.element, ...foe.escorts.map(([, el]) => el)])
          expect(n.enemies.map((e) => [e.rank, e.shield])).toEqual([['sub-boss', 6], ['regular', 3], ['regular', 3]])
          expect(n.enemies.every((e) => e.level === level)).toBe(true)
          expect(stagePay(n)).toBe(1)
        }
        const final = run.nodes.find((x) => x.id === capitalRunNodeId(run.id, lane, 'final'))!
        expect(final).toMatchObject({ kind: 'boss', level, stage: 0, exits: [], element: route.champion.element, name: `${route.name} · Final` })
        expect(final.enemies.map((e) => e.element)).toEqual([...route.champion.escorts.map(([, el]) => el), route.vanguard.element])
        expect(final.enemies.every((e) => e.rank === 'regular')).toBe(true)
        expect(final.waves).toHaveLength(1)
        expect(final.waves![0]!.map((e) => e.element)).toEqual([route.champion.element, ...route.champion.escorts.map(([, el]) => el)])
        expect(final.waves![0]!.map((e) => [e.rank, e.shield])).toEqual([['boss', 8], ['regular', 3], ['regular', 3]])
        expect([...final.enemies, ...final.waves![0]!].map((e) => e.id)).toEqual(['foe1', 'foe2', 'foe3', 'foe4', 'foe5', 'foe6'])
        expect(stagePay(final)).toBe(1.5)
      })
    }
  })

  it('faces a general as a Sub-boss with Key minions and a final as Key escorts, then a Boss with Sub-boss minions', () => {
    const run = capitalRunChapter(c1, 'w1-run2', roster)
    for (const n of run.nodes.filter((x) => x.kind !== 'camp')) {
      expect(n.enemies.every((e) => e.castId.startsWith('priconne-')), n.id).toBe(true)
      if (n.kind === 'sub-boss') expect(n.enemies.map(tierOf)).toEqual(['subboss', 'key', 'key'])
      else {
        expect(n.enemies.map(tierOf)).toEqual(['key', 'key', 'key'])
        expect(n.waves![0]!.map(tierOf)).toEqual(['boss', 'subboss', 'subboss'])
      }
      const faces = [...n.enemies, ...(n.waves?.[0] ?? [])].map((e) => e.castId)
      expect(new Set(faces).size, n.id).toBe(faces.length)
    }
  })

  it('builds the same run for a run id, and new faces on the same foes for another run', () => {
    const a = capitalRunChapter(c1, 'w1-run1', roster)
    expect(capitalRunChapter(c1, 'w1-run1', [...roster].reverse())).toEqual(a)
    const b = capitalRunChapter(c1, 'w1-run2', roster)
    let changed = 0
    for (const n of a.nodes.filter((x) => x.kind !== 'camp')) {
      const where = capitalRunNodeOf(n.id)!
      const m = b.nodes.find((x) => x.id === capitalRunNodeId('w1-run2', where.lane, where.final ? 'final' : where.general!))!
      expect(faceless(m.enemies)).toEqual(faceless(n.enemies))
      expect(faceless(m.waves?.[0] ?? [])).toEqual(faceless(n.waves?.[0] ?? []))
      if ([...m.enemies, ...(m.waves?.[0] ?? [])].some((e, i) => e.castId !== [...n.enemies, ...(n.waves?.[0] ?? [])][i]!.castId)) changed += 1
    }
    expect(changed).toBeGreaterThan(8)
  })

  it('refuses a run of another continent or a malformed id', () => {
    for (const id of ['w2-run1', 'w1-capital', 'w1-run0', 'run1']) expect(() => capitalRunChapter(c1, id, roster), id).toThrow(RangeError)
  })

  it('leaves the map’s three-route capital as it was', () => {
    const fourTier = roster.filter((m) => Number(m.id.slice(-1)) < 4)
    const sha = (v: unknown) => createHash('sha256').update(JSON.stringify(v)).digest('hex').slice(0, 16)
    // Fingerprinted before the fourth routes were written (H159): the capital still holds three routes, byte for byte.
    const before = capitalChapter(worldContinent({ name: 'C1', order: 1 }), fourTier)
    expect(sha(before)).toBe('32b78d6f19ad394f')
    expect(before.nodes.filter((n) => n.kind !== 'camp')).toHaveLength(6)
  })
})

describe('a capital run’s final, fought', () => {
  const classes: readonly RpgClass[] = ['brawler', 'mage', 'spellblade', 'cleric', 'summoner']
  const outfits = new Map(classes.map((_, i) => {
    const outfitId = `${9100000 + i}`
    const outfit: BattleOutfit = { outfitId, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
      growthRatePercents: { speed: 10, stamina: 10, power: 10, guts: 0, wit: 0 },
      aptitudes: { strategy: { front: 'A', pace: 'B', late: 'C', end: 'D' }, distance: { sprint: 'G', mile: 'G', medium: 'A', long: 'G' } } }
    return [outfitId, outfit]
  }))
  const NOW = '2026-11-03T12:00:00.000Z'
  function party(): Save {
    let save = newSave('Run test', NOW)
    ;[...outfits.keys()].forEach((id, i) => { save = setPartySlot(unlockUma(save, id, NOW), 0, i, id, NOW) })
    const w = worldOf(save)
    save = { ...save, tierWorlds: { '1': { ...w, umas: Object.fromEntries(Object.entries(w.umas).map(([id, u]) =>
      [id, { ...u, level: 10, ranks: { ...u.ranks, classes: Object.fromEntries(classes.map((c) => [c, { rank: 10, exp: 0 }])) } }])) } } }
    ;[...outfits.keys()].forEach((id, i) => { save = chooseClass(save, id, classes[i]!, NOW) })
    return save
  }

  it('plays its escorts’ wave, then its boss’s, to a win', () => {
    const run = capitalRunChapter(c1, 'w1-run1', roster)
    const nodeId = capitalRunNodeId(run.id, 1, 'final')
    let save = startFight(party(), run, nodeId, outfits, NOW)
    const seen = new Set<string>()
    for (let i = 0; i < 900; i++) {
      const state = rpgRunBattleStep(openFightOf(worldOf(save))!)!.state
      for (const u of state.units) if (u.side === 'enemy') seen.add(u.id)
      const actor = state.units.find((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(state, u.id) > 0)!
      const acted = actInFight(save, run, autoAction(state, actor.id), NOW)
      save = acted.save
      if (acted.result) {
        // An on-time Lv10 party on Auto clears the escorts' wave, meets the boss's and wins.
        expect(acted.result).toMatchObject({ nodeId, outcome: 'victory' })
        expect([...seen].sort()).toEqual(['foe1', 'foe2', 'foe3', 'foe4', 'foe5', 'foe6'])
        return
      }
    }
    throw new Error('The final did not finish')
  })
})
