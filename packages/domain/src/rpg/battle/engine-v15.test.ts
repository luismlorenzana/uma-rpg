// Engine v15, classes v2's validation, built dark (H53, D179): the Paladin fights only from v15, one healer a party,
// no Orb kinds, the Cleric's v2 slots, and every class rule read by the fight's own version. Nothing starts a v15 fight
// until H61; the Summoner stays out of these parties, since her v2 pair and its Auto are H55's.
import { describe, expect, it } from 'vitest'
import { rpgFoe } from '../campaign/enemies'
import { learnRpgNode, projectRpgStats, rpgDefaultWeapons, type RpgClass, type RpgProfile, type RpgWeapon } from '../rules'
import { autoAction } from './auto'
import { applyBattleAction, battleActorSkill, createBattle } from './engine'
import { battleLimitPlan } from './limit'
import type { BattleAlly, BattleCue, BattleEnemy, BattleInput } from './types'

const LEVEL = 20
/** An invented Uma of a class at Lv 20 (depths 1–3 open), built by the fight's generation: her spread, her stats. */
function member(id: string, classId: RpgClass, version: 14 | 15, options: { sides?: string[]; loadout?: string[]; weapons?: RpgWeapon[] } = {}): BattleAlly {
  const weapons = options.weapons ?? rpgDefaultWeapons(classId, version)
  let p: RpgProfile = { outfitId: id, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
    growthRates: { speed: 0.05, stamina: 0.05, power: 0.05, guts: 0.05, wit: 0.05 }, classId, weapons, tier: 1, level: LEVEL, exp: 0,
    tree: [], legacy: [], classRank: LEVEL }
  p = (options.sides ?? []).reduce(learnRpgNode, p)
  const stats = projectRpgStats(p, version)
  const loadout = options.loadout ?? weapons.slice(0, 3).map((w) => `${classId}-${w}.1`)
  return { id, classId, weapons, tier: 1, level: LEVEL, stats, tree: p.tree, legacy: [], loadout: loadout.map((n) => ({ tier: 1, id: n })),
    mp: stats.mp, classRank: LEVEL }
}
const paladin = (version: 14 | 15 = 15) =>
  member('a4', 'paladin', version, { sides: ['paladin-greatsword.1a'], loadout: ['paladin-greatsword.1a', 'paladin-tome-ice.1', 'paladin-axe.2'] })
/** A Brawler, a Mage, a Spell Blade, a healer and a second Brawler. */
const party = (healer: BattleAlly, version: 14 | 15 = 15): BattleAlly[] => [member('a1', 'brawler', version), member('a2', 'mage', version),
  member('a3', 'spellblade', version, { loadout: ['spellblade-greatsword.1', 'spellblade-tome-fire.1', 'spellblade-lance.2'] }), healer,
  member('a5', 'brawler', version)]
const FOE: BattleEnemy = (() => {
  const f = rpgFoe({ id: 'f1', castId: 'cast-f1', element: 'ice', role: 'striker', rank: 'regular', level: LEVEL, shield: 6,
    weaknesses: { weapons: ['greatsword'], elements: ['fire'] } })
  return { ...f, stats: { ...f.stats, hp: 100_000 } }
})()
const input = (allies: BattleAlly[], version: 14 | 15 = 15): BattleInput => ({ version, seed: 1515, allies, enemies: [FOE] })

describe('battle engine v15: classes v2, dark (D179)', () => {
  it('plays a round on Auto with a Paladin of her spread and a side skill learned in a Paladin tree', () => {
    const allies = party(paladin())
    expect(allies[3]!.weapons).toEqual(['greatsword', 'axe', 'lance', 'tome-ice', 'tome-fire'])
    let s = createBattle(input(allies)).state
    const cues: BattleCue[] = []
    for (const a of allies) {
      const action = autoAction(s, a.id)
      expect(action.kind, a.id).not.toBe('guard')
      const step = applyBattleAction(s, action)
      expect(step.error, a.id).toBeUndefined()
      cues.push(...step.cues)
      s = step.state
    }
    expect(s.round).toBe(2)
    expect(cues.some((c) => c.kind === 'hit' && c.actorId === 'a4' && c.targetId === 'f1')).toBe(true)
    // Her Greatsword side skill, cast by hand: a Paladin node in a v15 fight.
    const blow = applyBattleAction(createBattle(input(allies)).state, { kind: 'skill', actorId: 'a4', targetId: 'f1', skill: { tier: 1, id: 'paladin-greatsword.1a' } })
    expect(blow.error).toBeUndefined()
    expect(blow.cues.some((c) => c.kind === 'status' && c.actorId === 'a4' && c.label === 'armor-break')).toBe(true)
  })

  it('refuses the Paladin before v15', () => {
    expect(() => createBattle(input(party(paladin(14)), 14))).toThrow(/Invalid battle ally/)
    expect(() => createBattle(input(party(paladin())))).not.toThrow()
  })

  it('refuses Orb kinds from v15', () => {
    const orbed = (allies: BattleAlly[]) => allies.map((a) => (a.id === 'a1' ? { ...a, orbs: ['fire' as const] } : a))
    expect(() => createBattle(input(orbed(party(paladin()))))).toThrow(/Invalid battle ally/)
    expect(() => createBattle(input(orbed(party(member('a4', 'cleric', 14), 14)), 14))).not.toThrow()
  })

  it('fields one healer a party from v15; v14 keeps two Clerics legal', () => {
    const withCleric = party(paladin()).map((a) => (a.id === 'a5' ? member('a5', 'cleric', 15) : a))
    expect(() => createBattle(input(withCleric))).toThrow(/Invalid battle party/)
    const twoClerics = (version: 14 | 15) => party(member('a4', 'cleric', version), version).map((a) => (a.id === 'a5' ? member('a5', 'cleric', version) : a))
    expect(() => createBattle(input(twoClerics(15)))).toThrow(/Invalid battle party/)
    expect(() => createBattle(input(twoClerics(14), 14))).not.toThrow()
  })

  it('takes a Cleric’s weapons by the fight’s slots: four Arms in v14, three Tomes and two Arms from v15', () => {
    const fourArms: RpgWeapon[] = ['greatsword', 'axe', 'lance', 'bow', 'tome-fire']
    const cleric = (version: 14 | 15) => member('a4', 'cleric', version, { weapons: fourArms })
    expect(() => createBattle(input(party(cleric(14), 14), 14))).not.toThrow()
    expect(() => createBattle(input(party(cleric(15))))).toThrow(/Invalid battle ally/)
    expect(() => createBattle(input(party(member('a4', 'cleric', 15))))).not.toThrow()
  })

  it('takes a Paladin seat only from v15, and fires its Limit Break there (H56)', () => {
    const v14 = party(member('a4', 'cleric', 14), 14)
    const seated = (allies: BattleAlly[], extra: Partial<BattleAlly>) => allies.map((a) => (a.id === 'a1' ? { ...a, ...extra } : a))
    expect(() => createBattle(input(seated(v14, { hero: 'paladin-1' }), 14))).toThrow(/Invalid battle ally/)
    expect(() => createBattle(input(seated(v14, { inherits: [{ limit: 'paladin-1', bond: 3, from: 'x9' }] }), 14))).toThrow(/Invalid battle ally/)
    expect(() => createBattle(input(seated(v14, { hero: 'brawler-1' }), 14))).not.toThrow()
    const v15 = seated(party(paladin()), { hero: 'paladin-1' })
    const s = createBattle(input(v15)).state
    expect(battleLimitPlan(v15[0]!, { hero: 'paladin-1' }, 15)?.name).toBe('Archangel’s Verdict')
    // With a full gauge, Auto fires it.
    s.units.find((u) => u.id === 'a1')!.limit = 12
    const action = autoAction(s, 'a1')
    expect(action.kind).toBe('limit')
    expect(applyBattleAction(s, action).error).toBeUndefined()
  })

  it('reads every class rule by the fight’s version, whatever the switch says', () => {
    const blade = (version: 14 | 15) => createBattle(input(party(version === 15 ? paladin() : member('a4', 'cleric', 14), version), version)).state
    const power = (version: 14 | 15, id: string) => battleActorSkill(blade(version), 'a3', { tier: 1, id })?.power
    expect(power(14, 'spellblade-greatsword.1')).toBe(0.45)
    expect(power(14, 'spellblade-tome-fire.1')).toBe(0.45)
    expect(power(15, 'spellblade-greatsword.1')).toBe(0.63)
    expect(power(15, 'spellblade-tome-fire.1')).toBe(0.27)
  })
})
