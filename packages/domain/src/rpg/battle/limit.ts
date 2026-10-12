// Limit Breaks (D311, reworked by D86), after Final Fantasy and Octopath Traveler: every attack and skill charges a bar,
// and a full bar buys one whole turn worth about twice her usual damage, at 0 MP.
import { RPG_SKILL_POWER, RPG_CLERIC_STATUS, rpgNode, type RpgHit, type RpgSkillDef } from '../catalog'
import { bondCapacity, HERO_LIMIT_POWER, heroLimit, heroLimitSkills, isHeroLimitId, type HeroLimitId } from '../heroes'
import { RPG_ELEMENTS, isRpgTome, rpgHand, rpgOpenDepth, rpgWeaponKind, type RpgNodeRef, type RpgWeapon } from '../rules'
import { battleSkillFor } from './skills'
import type { BattleAlly } from './types'

export { BATTLE_LIMIT_MAX } from './caps'
/** An attack charges 2 and a skill 4: every class acts once a turn (D86), so every class fills alike. */
export const BATTLE_LIMIT_CHARGE = { attack: 2, skill: 4 } as const
export const battleLimitGain = (kind: keyof typeof BATTLE_LIMIT_CHARGE): number => BATTLE_LIMIT_CHARGE[kind]
/**
 * Limit Break power, as a multiple of a single-target cast open at her level: a Mage's five elements are 2.4, a Cleric's
 * patrons 1.5 with every status; the others replay her own skills at double strength.
 */
export const BATTLE_LIMIT_POWER = { mage: 2.4, cleric: 1.5 } as const
export const BATTLE_LIMIT_NAMES = { mage: 'Prismatic Nova', cleric: 'Divine Patrons', twin: 'Twin Strike', arts: 'Twin Arts', grand: 'Grand Summon' } as const

export interface BattleLimitChoice { skill?: RpgNodeRef; skills?: RpgNodeRef[]; weapon?: RpgWeapon; hero?: HeroLimitId }
/** Each cast resolves at `scale`; a Grand Summon also leaves its summon lingering at `linger`. An inherited Limit Break
 * names the Hero it came from (`from`) and the strength it works at (`capacity`, D106). */
export interface BattleLimitPlan {
  name: string; casts: { def: RpgSkillDef; scale: number }[]; linger?: { ref: RpgNodeRef; scale: number }
  from?: string; capacity?: number
}


const round = (n: number) => Math.round(n * 1000) / 1000
const single = (hits: RpgHit[], primary: RpgSkillDef['primary']): RpgSkillDef => ({ target: 'one', hits, mp: 0, primary })

/** A hero Limit Break at `capacity` of her class's Limit Break power (D106, D107). */
function heroPlan(ally: BattleAlly, id: HeroLimitId, level: number, capacity: number, from?: string): BattleLimitPlan {
  const limit = heroLimit(id)
  return { name: limit.name, casts: heroLimitSkills(limit, HERO_LIMIT_POWER[ally.classId] * level).map((def) => ({ def, scale: capacity })),
    capacity, ...(from ? { from } : {}) }
}

/** The casts this Limit Break makes, or null when the choice names something she can't use. */
export function battleLimitPlan(ally: BattleAlly, choice: BattleLimitChoice): BattleLimitPlan | null {
  const hand = rpgHand(ally)
  // v8: her Class Rank's open depth (D102); v6–v7 fights went by her level.
  const level = RPG_SKILL_POWER[Math.max(1, rpgOpenDepth(ally.classRank ?? ally.level)) - 1]!
  const known = (ref: unknown) => ref && typeof ref === 'object' ? battleSkillFor(ally, ref as RpgNodeRef) : null
  const { skill, skills, weapon, hero } = choice
  // v9 (D106): a Hero has only her seat's Limit Break, at 100%; a Learner may name one she inherits, at 50% + 5% a Bond.
  if (ally.hero) return skill || skills || weapon || (hero !== undefined && hero !== ally.hero) ? null : heroPlan(ally, ally.hero, level, 1)
  if (hero !== undefined) {
    const from = isHeroLimitId(hero) && !skill && !skills && !weapon ? ally.inherits?.find((i) => i.limit === hero) : undefined
    return from ? heroPlan(ally, from.limit, level, bondCapacity(from.bond), from.from) : null
  }
  switch (ally.classId) {
    case 'mage': {
      if (skill || skills || weapon) return null
      return { name: BATTLE_LIMIT_NAMES.mage, casts: [{ scale: 1, def: single(RPG_ELEMENTS.map((kind) =>
        ({ power: round(BATTLE_LIMIT_POWER.mage * level / RPG_ELEMENTS.length), parts: [{ kind, share: 1 }] })), 'fire') }] }
    }
    case 'cleric': {
      if (skill || skills || weapon) return null
      // A hit with every weapon she wields, each carrying its status at three stacks.
      return { name: BATTLE_LIMIT_NAMES.cleric, casts: ally.weapons.map((w) => ({ scale: 1, def: {
        ...single([{ power: round(BATTLE_LIMIT_POWER.cleric * level / ally.weapons.length), parts: [{ kind: rpgWeaponKind(w), share: 1 }] }], rpgWeaponKind(w)),
        status: { key: RPG_CLERIC_STATUS[w], stacks: 3, turns: 2, to: isRpgTome(w) ? 'allies' as const : 'foe' as const } } })) }
    }
    case 'brawler': {
      if (skills) return null
      if (skill) {
        const k = known(skill)
        return k ? { name: k.label, casts: [{ def: k.def, scale: hand.power }, { def: k.def, scale: hand.power }] } : null
      }
      const w = weapon ?? ally.weapons[0]!
      if (!ally.weapons.includes(w)) return null
      const strike = single([{ power: hand.power, parts: [{ kind: rpgWeaponKind(w), share: 1 }] }], rpgWeaponKind(w))
      return { name: BATTLE_LIMIT_NAMES.twin, casts: [{ def: strike, scale: 1 }, { def: strike, scale: 1 }] }
    }
    case 'spellblade': {
      // Both halves at full power: an Arms skill and a Tome skill.
      if (skill || weapon || !Array.isArray(skills) || skills.length !== 2) return null
      const picks = skills.map(known)
      if (picks.some((k) => !k)) return null
      const [a, b] = picks as NonNullable<ReturnType<typeof known>>[]
      if (isRpgTome(a!.node.weapon) === isRpgTome(b!.node.weapon)) return null
      return { name: BATTLE_LIMIT_NAMES.arts, casts: [{ def: a!.def, scale: 1 }, { def: b!.def, scale: 1 }] }
    }
    case 'summoner': {
      // One summon at twice her strength that lingers at twice too.
      if (skills || weapon || !skill) return null
      const k = known(skill)
      if (!k?.def.summon) return null
      return { name: BATTLE_LIMIT_NAMES.grand, casts: [{ def: k.def, scale: 2 * hand.power }], linger: { ref: k.ref, scale: 2 * k.def.summon.linger } }
    }
  }
}

/** The weapon a node belongs to, for menus. */
export const battleSkillWeapon = (id: string): RpgWeapon | null => rpgNode(id)?.weapon ?? null
