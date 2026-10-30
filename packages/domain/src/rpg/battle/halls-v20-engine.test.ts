// The trim of the halls in a fight (D261), engine v20: the closed seats are refused, an open v19 fight keeps them, and the
// Sanctum's three new seats strike as they read.
import { describe, expect, it } from 'vitest'
import { rpgFoe } from '../campaign/enemies'
import type { HeroLimitId } from '../heroes'
import { projectRpgStats, rpgDefaultWeapons, type RpgClass, type RpgProfile } from '../rules'
import { applyBattleAction, createBattle } from './engine'
import type { BattleAlly, BattleEnemy, BattleInput } from './types'

function member(id: string, classId: RpgClass, version: number, extra: Partial<BattleAlly> = {}): BattleAlly {
  const weapons = rpgDefaultWeapons(classId, version)
  const p: RpgProfile = { outfitId: id, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
    growthRates: { speed: 0.05, stamina: 0.05, power: 0.05, guts: 0.05, wit: 0.05 }, classId, weapons, tier: 1, level: 20, exp: 0,
    tree: [], legacy: [], classRank: 20 }
  const stats = projectRpgStats(p, version)
  return { id, classId, weapons, tier: 1, level: 20, stats, tree: [], legacy: [], loadout: [{ tier: 1, id: `${classId}-${weapons[0]}.1` }], mp: stats.mp, classRank: 20, ...extra }
}
function foe(id: string): BattleEnemy {
  const f = rpgFoe({ id, castId: `cast-${id}`, element: 'dark', role: 'striker', rank: 'regular', level: 20, shield: 10, weaknesses: { weapons: ['greatsword'], elements: ['fire'] } })
  return { ...f, stats: { ...f.stats, hp: 1_000_000, atk: 1, matk: 1 }, phaseTwo: undefined,
    moves: [{ id: 'poke', kind: 'damage', channel: 'physical', element: null, power: 1, label: 'Poke', target: 'front' }] }
}
const input = (caster: Partial<BattleAlly>, version: BattleInput['version'], classId: RpgClass = 'brawler'): BattleInput => ({
  version, seed: 2020, enemies: [foe('f1')],
  allies: [member('a1', classId, version, caster), ...(['a2', 'a3', 'a4', 'a5'] as const).map((id) => member(id, 'brawler', version))],
})
function cast(seat: HeroLimitId, classId: RpgClass, version: BattleInput['version'] = 20) {
  const s = createBattle(input({ hero: seat }, version, classId)).state
  s.units.find((u) => u.id === 'a1')!.limit = 12
  const step = applyBattleAction(s, { kind: 'limit', actorId: 'a1', targetId: 'f1' })
  expect(step.error, seat).toBeUndefined()
  return step
}
const kinds = (step: ReturnType<typeof cast>) => step.cues.flatMap((c) => (c.kind === 'hit' ? [c.element] : []))

describe('the trim in a fight (D261)', () => {
  it.each(['brawler-3', 'brawler-4', 'mage-3', 'mage-4'] as const)('refuses %s on engine v20 and takes it on v19', (seat) => {
    expect(() => createBattle(input({ hero: seat }, 20))).toThrow(/Invalid battle ally/)
    expect(() => createBattle(input({ inherits: [{ limit: seat, bond: 4, from: 'x9' }] }, 20))).toThrow(/Invalid battle ally/)
    expect(() => createBattle(input({ hero: seat }, 19))).not.toThrow()
    cast(seat, 'brawler', 19)
  })

  it('casts the Sanctum’s new three by engine: v20 reads the trim, v19 its own', () => {
    expect(cast('healer-2', 'paladin').cues.find((c) => c.kind === 'limit')).toMatchObject({ label: 'Archdemon’s Toll' })
    expect(cast('healer-3', 'cleric').cues.find((c) => c.kind === 'limit')).toMatchObject({ label: 'Seraph’s Storm' })
    expect(cast('healer-4', 'cleric').cues.find((c) => c.kind === 'limit')).toMatchObject({ label: 'Cinder Fiend’s Barrage' })
    expect(cast('healer-3', 'cleric', 19).cues.find((c) => c.kind === 'limit')).toMatchObject({ label: 'Seraph’s Pyre' })
    expect(cast('healer-4', 'cleric', 19).cues.find((c) => c.kind === 'limit')).toMatchObject({ label: 'Thunder Fiend’s Barrage' })
  })

  it('lands the owner’s kinds, four hits a cast on one foe', () => {
    expect(kinds(cast('healer-2', 'paladin'))).toEqual(['greatsword', 'greatsword', 'dark', 'dark'])
    expect(kinds(cast('healer-3', 'cleric'))).toEqual(['lightning', 'lightning', 'light', 'light'])
    expect(kinds(cast('healer-4', 'cleric'))).toEqual(['fire', 'fire', 'dark', 'dark'])
  })
})
