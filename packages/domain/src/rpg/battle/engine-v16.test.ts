// Engine v16, the Tier rework's fight, accepted dark (H64, D200): three weapons by channel, no side skills (`tree`) and no
// legacy skills, every class rule read by the fight's own version. Nothing starts a v16 fight until H72; H65 adds the
// branch picks, the equipped-slot count and Skill Ranks, H68 the base MP regen and the Flourish.
import { describe, expect, it } from 'vitest'
import { rpgFoe } from '../campaign/enemies'
import { rpgNodeIdentity } from '../node-identity'
import { isRpgTome, learnRpgNode, projectRpgStats, rpgActiveSlots, rpgDefaultWeapons, type RpgClass, type RpgProfile, type RpgWeapon } from '../rules'
import { autoAction } from './auto'
import { applyBattleAction, battleActionsLeft, battleActorSkill, createBattle } from './engine'
import type { BattleAlly, BattleEnemy, BattleInput } from './types'

const LEVEL = 20
type Version = 15 | 16
/** An invented Uma of a class at Lv 20 (depths 1–3 open), built by the fight's generation: her default weapons, her stats,
 * and in her loadout the cores of depth 1 of each weapon's tree, then of depth 2, as her generation's slots allow (H65:
 * five at Lv 20 from v16, six to v15). */
function member(id: string, classId: RpgClass, version: Version, options: { weapons?: RpgWeapon[]; sides?: string[]; tier?: number } = {}): BattleAlly {
  const weapons = options.weapons ?? rpgDefaultWeapons(classId, version)
  const tier = options.tier ?? 1
  let p: RpgProfile = { outfitId: id, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
    growthRates: { speed: 0.05, stamina: 0.05, power: 0.05, guts: 0.05, wit: 0.05 }, classId, weapons, tier, level: LEVEL, exp: 0,
    tree: [], legacy: [], classRank: LEVEL }
  p = (options.sides ?? []).reduce(learnRpgNode, p)
  const stats = projectRpgStats(p, version)
  const loadout = [1, 2].flatMap((d) => weapons.map((w) => ({ tier, id: `${classId}-${w}.${d}` }))).slice(0, rpgActiveSlots(LEVEL, version))
  return { id, classId, weapons, tier, level: LEVEL, stats, tree: p.tree, legacy: [], loadout, mp: stats.mp, classRank: LEVEL }
}
/** One Uma of each class but one healer. */
const party = (version: Version, healer: 'paladin' | 'cleric' = 'paladin'): BattleAlly[] =>
  (['brawler', 'mage', 'spellblade', 'summoner', healer] as const).map((c, i) => member(`a${i + 1}`, c, version))
const FOE: BattleEnemy = (() => {
  const f = rpgFoe({ id: 'f1', castId: 'cast-f1', element: 'ice', role: 'striker', rank: 'regular', level: LEVEL, shield: 6,
    weaknesses: { weapons: ['greatsword'], elements: ['fire'] } })
  return { ...f, stats: { ...f.stats, hp: 100_000 } }
})()
const input = (allies: BattleAlly[], version: Version): BattleInput => ({ version, seed: 1616, allies, enemies: [FOE] })

describe('battle engine v16: the Tier rework’s fight, dark (D200)', () => {
  it.each(['paladin', 'cleric'] as const)('plays two rounds on Auto with one Uma of each class, three weapons each, and a %s', (healer) => {
    const allies = party(16, healer)
    expect(allies.map((a) => a.weapons.length)).toEqual([3, 3, 3, 3, 3])
    expect(allies.every((a) => a.tree.length === 0 && a.loadout.every((r) => /\.\d$/.test(r.id)))).toBe(true)
    let s = createBattle(input(allies, 16)).state
    expect(s.engineVersion).toBe(16)
    for (let n = 0; n < 40 && s.round < 3 && s.outcome === 'active'; n++) {
      const actor = s.units.find((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(s, u.id) > 0)!
      const action = autoAction(s, actor.id)
      const step = applyBattleAction(s, action)
      expect(step.error, actor.id).toBeUndefined()
      // She acts with her three weapons only.
      const ally = allies.find((a) => a.id === actor.id)!
      if (action.kind === 'attack' && action.weapon) expect(ally.weapons).toContain(action.weapon)
      s = step.state
    }
    expect(s.round).toBe(3)
  })

  it('reads the fight’s own generation: a Summoner’s Arms summon at 0.48 in v16, 0.56 in v15', () => {
    const armsSkill = (version: Version) => {
      const allies = party(version)
      const summoner = allies.find((a) => a.classId === 'summoner')!
      const ref = summoner.loadout.find((r) => !isRpgTome(rpgNodeIdentity(r.id)!.weapon))!
      return battleActorSkill(createBattle(input(allies, version)).state, summoner.id, ref)!.power
    }
    expect([armsSkill(15), armsSkill(16)]).toEqual([0.56, 0.48])
  })

  it('takes three weapons from v16 and five to v15', () => {
    const five = party(16).map((a) => ({ ...a, weapons: rpgDefaultWeapons(a.classId, 15) }))
    expect(() => createBattle(input(five, 16))).toThrow(/Invalid battle ally/)
    expect(() => createBattle(input(party(16), 15))).toThrow(/Invalid battle ally/)
    expect(() => createBattle(input(party(15), 15))).not.toThrow()
    // A Spell Blade's Tome out of its slot.
    const misplaced = party(16).map((a) => (a.classId === 'spellblade' ? { ...a, weapons: ['tome-lightning', 'katana', 'lance'] as RpgWeapon[] } : a))
    expect(() => createBattle(input(misplaced, 16))).toThrow(/Invalid battle ally/)
  })

  it('refuses side skills and legacy skills from v16; v15 keeps both', () => {
    const sided = (version: Version) => party(version).map((a) => (a.classId === 'brawler' ? member('a1', 'brawler', version, { sides: ['brawler-greatsword.1a'] }) : a))
    expect(sided(15)[0]!.tree).toHaveLength(1)
    expect(() => createBattle(input(sided(15), 15))).not.toThrow()
    expect(() => createBattle(input(sided(16), 16))).toThrow(/Invalid battle ally/)
    const legacy = (version: Version) => party(version).map((a) =>
      (a.classId === 'brawler' ? { ...member('a1', 'brawler', version, { tier: 2 }), legacy: [{ tier: 1, id: 'brawler-greatsword.3' }] } : a))
    expect(() => createBattle(input(legacy(15), 15))).not.toThrow()
    expect(() => createBattle(input(legacy(16), 16))).toThrow(/Invalid battle ally/)
    // The same tier-2 Brawler without it fights in v16.
    const plain = party(16).map((a) => (a.classId === 'brawler' ? member('a1', 'brawler', 16, { tier: 2 }) : a))
    expect(() => createBattle(input(plain, 16))).not.toThrow()
  })

  it('still fields one healer a party: a Paladin and a Cleric together are refused', () => {
    const two = party(16).map((a) => (a.classId === 'brawler' ? member('a1', 'cleric', 16) : a))
    expect(() => createBattle(input(two, 16))).toThrow(/Invalid battle party/)
  })
})
