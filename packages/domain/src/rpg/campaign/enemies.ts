// Campaign foes: roles and level scaling (docs/design/battles.md), ported from uma-racer where a campaign sim tuned them.
import type { RpgElement } from '../rules'
import type { BattleEnemy, BattleEnemyMove, BattleWeaknesses, EnemyRank } from '../battle/types'

/** Average enrolled outfit core stat at a lifetime level: base ≈ 110 / 5 plus 1.5 × (1 + 0.06) per level. */
export const rpgReferenceStat = (lifetimeLevel: number): number => 22 + 1.59 * (lifetimeLevel - 1)

export const RPG_FOE_ROLES = ['striker', 'caster', 'guard', 'skirmisher'] as const
export type RpgFoeRole = typeof RPG_FOE_ROLES[number] | 'captain' | 'champion'
export const RPG_FOE_TUNING = {
  hpBase: 40, hpPerStat: 4.2, defense: 0.8,
  /** Offense (D141): a 100% hit on an average Uma of her level, with no gear or Extra Stats, takes this share of her HP,
   * raised by the expected gear budget below, so an Uma built on curve takes about this share. */
  hitShare: 0.28,
  /** The first levels teach: the share starts here at Lv 1 and reaches `hitShare` at `hitShareFull`. */
  hitShareStart: 0.2, hitShareFull: 10,
  subBossHp: 3.5, bossHp: 5.5,
  /** Expected gear and Extra Stats by level (§7.3, D59, D141): what a built party's damage calls for in foe HP and
   * defense, and in offense, so a built Uma takes about `hitShare` a hit. Gear and Extra Stats grow slowly at first and
   * fast late (grade-10 Might, high-grade nodes), so the budget follows the square of the level: `1 + rate × (L − 1)² ÷ 49`,
   * ×2.7 HP and ×2 offense at Lv 50. */
  budgetPerLevel: 0.035, offenseBudgetPerLevel: 0.01, budgetFrom: 1,
  /** Break shields (D279): regular foes 2 early and 3 from Senior Year, sub-bosses 6, champions 8. */
  regularShield: 2, lateRegularShield: 3, subBossShield: 6, bossShield: 8,
} as const

interface RoleShape { hp: number; atk: number; matk: number; def: number; mdef: number; speed: number }
const ROLE: Readonly<Record<RpgFoeRole, RoleShape>> = {
  striker: { hp: 1, atk: 1, matk: 0.6, def: 1, mdef: 0.8, speed: 1 },
  caster: { hp: 0.8, atk: 0.6, matk: 1.1, def: 0.7, mdef: 1.1, speed: 1.05 },
  guard: { hp: 1.3, atk: 0.75, matk: 0.6, def: 1.3, mdef: 1.1, speed: 0.9 },
  skirmisher: { hp: 0.85, atk: 0.9, matk: 0.7, def: 0.9, mdef: 0.9, speed: 1.3 },
  captain: { hp: 1, atk: 0.85, matk: 0.85, def: 1, mdef: 1, speed: 1.1 },
  champion: { hp: 1, atk: 0.9, matk: 0.9, def: 1.05, mdef: 1.05, speed: 1.15 },
}
const ELEMENT_NAME: Readonly<Record<RpgElement, string>> = { fire: 'Flame', ice: 'Frost', lightning: 'Volt', light: 'Dawn', dark: 'Shade' }

/** A foe's kit. A dual-element foe (W3) uses her second element for her second elemental move, so her moves split
 * between the two. */
function moves(role: RpgFoeRole, element: RpgElement, second: RpgElement = element): { moves: BattleEnemyMove[]; phaseTwo?: BattleEnemy['phaseTwo'] } {
  const e = ELEMENT_NAME[element]
  const e2 = ELEMENT_NAME[second]
  const m = (id: string, kind: BattleEnemyMove['kind'], channel: BattleEnemyMove['channel'], el: RpgElement | null,
    power: number, target: BattleEnemyMove['target'], label: string, status?: BattleEnemyMove['status']): BattleEnemyMove =>
    ({ id, kind, channel, element: el, power, target, label, ...(status ? { status } : {}) })
  switch (role) {
    case 'striker': return { moves: [m('strike', 'damage', 'physical', null, 100, 'front', 'Strike the front'),
      m('heavy', 'damage', 'physical', second, 130, 'seeded', `${e2} blow`)] }
    case 'caster': return { moves: [m('bolt', 'damage', 'magical', element, 110, 'lowest-hp', `${e} bolt at the weakest`),
      m('hex', 'debuff', 'magical', second, 0, 'seeded', 'Hex: weaken', 'weaken')] }
    case 'guard': return { moves: [m('bash', 'damage', 'physical', null, 80, 'front', 'Shield bash'),
      m('cover', 'guard', 'physical', null, 0, 'ally', 'Guard an ally')] }
    case 'skirmisher': return { moves: [m('cut', 'damage', 'physical', element, 90, 'seeded', `${e} cut + mark`, 'mark'),
      m('strike', 'damage', 'physical', null, 100, 'front', 'Strike the front')] }
    // Captains and champions each carry a charged move (D141): shown a round early with locks, answered by Breaks.
    case 'captain': return {
      moves: [m('smash', 'damage', 'physical', element, 150, 'front', `${e} smash`),
        m('rally', 'buff', 'physical', null, 0, 'self', 'Rally: power up', 'power-up'),
        m('sweep', 'damage', 'magical', second, 55, 'all', `${e2} sweep (all)`),
        { ...m('execute', 'damage', 'physical', element, 260, 'lowest-hp', `${e} execution`), charge: 2 }],
      phaseTwo: { thresholdPercent: 50, moves: [m('storm', 'damage', 'magical', second, 75, 'all', `${e2} storm (all)`),
        m('crush', 'damage', 'physical', element, 190, 'lowest-hp', 'Crush the weakest'),
        { ...m('cataclysm', 'damage', 'magical', second, 130, 'all', `${e2} cataclysm (all)`), charge: 3 }] } }
    case 'champion': return {
      moves: [m('smash', 'damage', 'physical', element, 160, 'front', `${e} smash`),
        m('sweep', 'damage', 'magical', second, 60, 'all', `${e2} sweep (all)`),
        m('ward', 'buff', 'magical', null, 0, 'self', 'Ward: guard up', 'ward'),
        { ...m('cataclysm', 'damage', 'magical', second, 130, 'all', `${e2} cataclysm (all)`), charge: 3 }],
      phaseTwo: { thresholdPercent: 50, moves: [m('storm', 'damage', 'magical', second, 85, 'all', `${e2} storm (all)`, second === 'fire' ? 'burn' : undefined),
        m('crush', 'damage', 'physical', element, 210, 'lowest-hp', 'Crush the weakest'),
        m('focus', 'damage', 'physical', element, 170, 'front', `${e} lance`),
        { ...m('apocalypse', 'damage', 'magical', element, 170, 'all', `${e} apocalypse (all)`), charge: 4 }] } }
  }
}

/** The share of an Uma's HP a 100% hit takes at a lifetime level, before the build budget (D141): it ramps up over the
 * first levels, so a fresh party's first fights stay gentle. */
export function rpgFoeHitShare(level: number): number {
  const t = RPG_FOE_TUNING
  const k = Math.min(1, Math.max(0, (level - 1) / (t.hitShareFull - 1)))
  return t.hitShareStart + (t.hitShare - t.hitShareStart) * k
}

/** The expected-build budget at a lifetime level (D141): `1 + rate × (L − 1)² ÷ 49`. */
export function rpgFoeBudget(level: number, rate: number): number {
  const past = Math.max(0, level - RPG_FOE_TUNING.budgetFrom)
  return 1 + (rate * past * past) / 49
}

/** The offense that makes a 100% hit take `share` of an average Uma's HP at a lifetime level (D141): an average Uma has
 * core stats of the reference, so HP 100 + 7 × it and DEF and M.DEF of it, and a hit is offense² ÷ (offense + defense). */
export function rpgFoeOffense(level: number, share: number = rpgFoeHitShare(level)): number {
  const s = rpgReferenceStat(level)
  const target = share * (100 + 7 * s)
  return (target + Math.sqrt(target * target + 4 * target * s)) / 2
}

/** A foe's full frozen kit at a lifetime level. Stats are code, so a rebalance never needs a content publish. */
export function rpgFoe(input: { id: string; castId: string; element: RpgElement; element2?: RpgElement; twice?: boolean; role: RpgFoeRole;
  rank: EnemyRank; level: number; shield: number; weaknesses: BattleWeaknesses; reach?: number }): BattleEnemy {
  const t = RPG_FOE_TUNING
  const s = rpgReferenceStat(input.level)
  const shape = ROLE[input.role]
  // Sub-bosses and champions also grow with the skill depth the party can reach (D282): that is where its MP goes.
  const scale = (input.rank === 'boss' ? t.bossHp : input.rank === 'sub-boss' ? t.subBossHp : 1) * (input.rank === 'regular' ? 1 : input.reach ?? 1)
  const kit = moves(input.role, input.element, input.element2)
  // The party's expected gear and Extra Stats at this level, given to the foe's HP and defense (§7.3, D59); her offense is
  // set by the share of an Uma's HP a hit takes (D141).
  const budget = rpgFoeBudget(input.level, t.budgetPerLevel)
  const offense = rpgFoeOffense(input.level, rpgFoeHitShare(input.level) * rpgFoeBudget(input.level, t.offenseBudgetPerLevel))
  return {
    id: input.id, castId: input.castId, element: input.element, ...(input.element2 ? { element2: input.element2 } : {}),
    ...(input.twice ? { twice: true } : {}), rank: input.rank, level: input.level,
    stats: {
      hp: Math.round((t.hpBase + t.hpPerStat * s) * shape.hp * scale * budget),
      atk: Math.round(offense * shape.atk), matk: Math.round(offense * shape.matk),
      pdef: Math.round(s * t.defense * shape.def * budget), mdef: Math.round(s * t.defense * shape.mdef * budget),
      initiative: Math.round(s * shape.speed),
    },
    shield: input.shield,
    weaknesses: { weapons: [...input.weaknesses.weapons], elements: [...input.weaknesses.elements] },
    ...kit,
  }
}
