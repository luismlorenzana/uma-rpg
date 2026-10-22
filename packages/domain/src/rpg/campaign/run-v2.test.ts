// Every fight's allies by the fight's generation (H57, classes-v2.md §6.2, C1, C4): from v15 an Orb's flat offense joins
// her Might on its kind, no Orb kinds are sent, and her HP takes Guts; a v14 build stays today's.
import { describe, expect, it } from 'vitest'
import { equippedAccessories, orbOffense } from '../../economy/gear'
import { createBattle } from '../battle/engine'
import type { BattleEnemy } from '../battle/types'
import { projectRpgStats, rpgDefaultWeapons, type RpgClass, type RpgProfile } from '../rules'
import { rpgFoe } from './enemies'
import { rpgCarriedMp, rpgPartyAllies, type RpgPartyMember } from './run'

const LEVEL = 20
/** An invented Uma of a class at Lv 20 with her generation's spread. */
function member(id: string, classId: RpgClass, engine: 14 | 15, equipped: Record<string, string>, might?: RpgPartyMember['might']): RpgPartyMember {
  const weapons = rpgDefaultWeapons(classId, engine)
  const profile: RpgProfile = { outfitId: id, baseStats: { speed: 110, stamina: 110, power: 110, guts: 130, wit: 110 },
    growthRates: { speed: 0.05, stamina: 0.05, power: 0.05, guts: 0.05, wit: 0.05 }, classId, weapons, tier: 1, level: LEVEL, exp: 0,
    tree: [], legacy: [], classRank: LEVEL }
  return { profile, loadout: weapons.slice(0, 3).map((w) => ({ tier: 1, id: `${classId}-${w}.1` })), might,
    accessories: equippedAccessories(equipped, engine) }
}
/** A Brawler with a Greatsword Orb on her Greatsword, a Mage with a Lance Orb she doesn't wield, a bare Spell Blade, a
 * healer with a Fire Orb and Thorns, and a Brawler with an Axe Orb and no weapon pieces. */
function party(engine: 14 | 15): RpgPartyMember[] {
  return [
    member('a1', 'brawler', engine, { 'accessory-1': 'orb-greatsword-g10', 'accessory-2': 'talisman-vampire-g4' }, { greatsword: 12, axe: 8 }),
    member('a2', 'mage', engine, { 'accessory-1': 'orb-lance-g3', 'accessory-2': 'amulet-siphon-g10' }, { fire: 4 }),
    member('a3', 'spellblade', engine, {}),
    member('a4', engine === 15 ? 'paladin' : 'cleric', engine, { 'accessory-1': 'orb-fire-g5', 'accessory-2': 'talisman-thorn-g2' }),
    member('a5', 'brawler', engine, { 'accessory-1': 'orb-axe-g1' }),
  ]
}
const mpOf = (engine: 14 | 15) => (profile: RpgProfile, points?: Parameters<typeof rpgCarriedMp>[2]) => rpgCarriedMp({ mp: {} }, profile, points, engine)
const FOE: BattleEnemy = rpgFoe({ id: 'f1', castId: 'cast-f1', element: 'ice', role: 'striker', rank: 'regular', level: LEVEL, shield: 6,
  weaknesses: { weapons: ['greatsword'], elements: ['fire'] } })

describe('a fight’s allies in classes v2 (H57)', () => {
  it('adds an Orb’s offense to her Might on its kind, beside a weapon’s of that kind, and sends no Orb kinds', () => {
    const allies = rpgPartyAllies(party(15), mpOf(15), 15)
    for (const a of allies) expect(a, a.id).not.toHaveProperty('orbs')
    expect(allies.map((a) => a.might)).toEqual([
      { greatsword: 12 + orbOffense(10), axe: 8 },
      { fire: 4, lance: orbOffense(3) },
      undefined,
      { fire: orbOffense(5) },
      { axe: 1 },
    ])
    expect(allies[0]!.might!.greatsword).toBe(46)
    // The support effects arrive as before, at v2's values: Siphon 8% at grade 10, Thorn 5% a grade (H60).
    expect(allies[0]).toMatchObject({ lifesteal: 80 })
    expect(allies[1]).toMatchObject({ mpSteal: 80 })
    expect(allies[3]).toMatchObject({ thorns: 100 })
  })

  it('projects her stats by v2’s rules: HP with Guts, and MP to match', () => {
    const p = party(15)
    const allies = rpgPartyAllies(p, mpOf(15), 15)
    allies.forEach((a, i) => {
      const v2 = projectRpgStats(p[i]!.profile, 15)
      expect(a.stats, a.id).toEqual(v2)
      expect(a.mp, a.id).toBe(v2.mp)
    })
    expect(allies[0]!.stats.hp).toBeGreaterThan(projectRpgStats(p[0]!.profile, 14).hp)
    expect(rpgCarriedMp({ mp: {} }, p[3]!.profile, undefined, 15)).toBe(projectRpgStats(p[3]!.profile, 15).mp)
  })

  it('makes an input engine v15 takes', () => {
    const allies = rpgPartyAllies(party(15), mpOf(15), 15)
    expect(() => createBattle({ version: 15, seed: 57, allies, enemies: [FOE] })).not.toThrow()
    // Engine v15 refuses Orb kinds (H53): even v1's effects send none into a v15 fight.
    const v1Kinds = rpgPartyAllies(party(15).map((m) => ({ ...m, accessories: equippedAccessories({ 'accessory-1': 'orb-fire-g1' }, 14) })), mpOf(15), 15)
    expect(v1Kinds.some((a) => 'orbs' in a)).toBe(false)
  })
})

describe('a fight’s allies in classes v1 stay today’s', () => {
  it('sends Orb kinds, keeps Might to her weapons and her stats v14’s', () => {
    const p = party(14)
    const allies = rpgPartyAllies(p, mpOf(14), 14)
    expect(rpgPartyAllies(p, mpOf(14))).toEqual(allies)
    expect(allies.map((a) => a.orbs)).toEqual([['greatsword'], ['lance'], undefined, ['fire'], ['axe']])
    expect(allies.map((a) => a.might)).toEqual([{ greatsword: 12, axe: 8 }, { fire: 4 }, undefined, undefined, undefined])
    allies.forEach((a, i) => expect(a.stats, a.id).toEqual(projectRpgStats(p[i]!.profile, 14)))
    expect(allies[1]).toMatchObject({ mpSteal: 50 })
    expect(() => createBattle({ version: 14, seed: 57, allies, enemies: [FOE] })).not.toThrow()
  })
})
