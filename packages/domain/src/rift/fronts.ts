// The Rift's four fronts (docs/design/rift.md §5, D161; built in H47, D173): what each asks of a party, the shape of every
// stage, and every number the generator reads, in one table (`RIFT_TUNING`) that the balance pass (H51) tunes against
// §11's targets. Which ranks a stage holds is §5's and stays; its counts, shares, shields and acts are tuning. Lazy: only
// `@rpg/domain/rift` loads it.
import type { BattleChannel, EnemyRank } from '../rpg/battle/types'
import type { RpgFoeRole } from '../rpg/campaign/enemies'
import type { RpgClass } from '../rpg/rules'
import { formationOffense } from '../world/world'
import { RIFT_FRONTS, RIFT_STAGES, type RiftFront } from './state'

export interface RiftFrontSpec {
  front: RiftFront
  name: 'Iron' | 'Arcane' | 'Duel' | 'Horde'
  /** The channel its foes ward (H44): Iron magical, Arcane physical; null on Duel and Horde. */
  ward: BattleChannel | null
  /** Today's party guidance (D168, point 2), five classes; retuned with classes v2. */
  party: readonly RpgClass[]
}

/** §5's fronts: Iron's foes are weak to Arms only and ward elements, Arcane's the reverse; the Duel is one boss weak to
 * both, the Horde many foes each weak to her own pair. */
export const RIFT_FRONT_SPECS: Readonly<Record<RiftFront, RiftFrontSpec>> = {
  iron: { front: 'iron', name: 'Iron', ward: 'magical', party: ['brawler', 'brawler', 'spellblade', 'spellblade', 'cleric'] },
  arcane: { front: 'arcane', name: 'Arcane', ward: 'physical', party: ['mage', 'mage', 'summoner', 'summoner', 'cleric'] },
  duel: { front: 'duel', name: 'Duel', ward: null, party: ['brawler', 'brawler', 'mage', 'mage', 'cleric'] },
  horde: { front: 'horde', name: 'Horde', ward: null, party: ['spellblade', 'spellblade', 'summoner', 'summoner', 'cleric'] },
}

/** The face tier a slot draws from the enemy roster (rift.md §9). */
export type RiftFace = 'boss' | 'subboss' | 'key'

/** Twelve per-stage values, stage 1 first. */
type PerStage = readonly [number, number, number, number, number, number, number, number, number, number, number, number]

/**
 * Every number the Rift's generator reads (D173), tuned by H51 against rift.md §11 (`rift/balance.test.ts`). HP shares are
 * of `rpgFoe`'s own HP for her rank (a regular's also take the world's regular-foe HP step); offense multiplies her ATK
 * and M.ATK (a formation foe's on top of the world's for her share); a formation's `budget` is in regular foes' HP.
 * Per-stage lists run stage 1 to 12.
 */
export const RIFT_TUNING = {
  /** Front and Convergence foes stand at this tier level (§5). */
  level: 50,
  /** Strength climbs by this over a front's twelve stages: stage n is 1 + climb × (n − 1) ÷ 11 (×1.10 at the champion). */
  climb: 0.1,
  /** A Convergence fight is a champion at (1 + climb) × (1 + convergence) (§6). H51: below the champion's (×0.92), since an
   * attempt must win all four in a row and §11 wants about half of attempts won. */
  convergence: -0.165,
  /** The Lv 55 Echo is the Lv 50 shape at this strength: a tier stops at Lv 50, and five levels on the Tier 1 curve are
   * ×1.23 HP (Lv 45 → 50). */
  echo55: 1.22,
  /** An Echo is its front's shape at this stage (§8). */
  echoStage: 8,
  /** Iron and Arcane share one shape; each front scales its foes' HP and offense, since today's guided parties differ in
   * power (D168): Arcane's casters clear the shared shape far faster than Iron's Arms. The Duel and the Horde carry their
   * own. */
  scale: { iron: { hp: 1, offense: 1 }, arcane: { hp: 1.5, offense: 1.3 } },
  /** Iron and Arcane, stages 1–4: a sub-boss captain and her key guard (a region elite). */
  escort: { captain: { face: 'subboss', hp: 1, offense: 1.8, shield: 8, acts: 2 }, guards: 1, guard: { face: 'key', hp: 0.8, offense: 1.8, shield: 4 } },
  /** Iron and Arcane, stages 5 and 7: sub-bosses together. */
  elites: { count: 2, face: 'subboss', hp: 1, offense: 1.6, shield: 6, acts: 1 },
  /** Iron and Arcane, stages 6 and 8 and the last wave of 9–11: a boss and her sub-boss-faced guard (a region boss's last
   * wave; `hp` is the world's boss share, 0.5). */
  boss: { face: 'boss', hp: 0.5, offense: 1.3, shield: 8, acts: 2, guards: 1, guard: { face: 'subboss', hp: 0.8, offense: 1.3, shield: 4 } },
  /** Iron and Arcane, stages 9–11: opening waves of `count` sub-boss-faced regulars sharing `share` of `budget` regular
   * foes' HP (a region boss's opening waves). Their offense is the world's for a foe of that share, times `offense`. */
  openers: { waves: 2, count: 1, face: 'subboss', budget: 3.6, share: 0.3, offense: 1.2, shield: 4 },
  /** Iron and Arcane, stage 12, the champion: bosses from different packs, together (a twin-boss row). */
  champion: { count: 2, face: 'boss', hp: 0.55, offense: 2.2, shield: 16, acts: 1 },
  /** The Duel: one boss, acting twice, three times at the champion; shields by stage, above the best single act of any
   * class (classes-v2 §3.1's guard rail: 12, a Limit Break of twelve weak hits). */
  duel: { face: 'boss', hp: 1, offense: 1.65, acts: 2, championActs: 3, shields: [13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15] as PerStage },
  /**
   * The Horde: waves of `counts` foes (a swarm and a squad), each sharing `budget` regular foes' HP, a leader taking
   * `leader` shares and the rest one each; a foe's offense is the world's for her share, times `offense`. All regular rank.
   * The leader is sub-boss-faced, boss-faced in the last wave from stage `bossFrom`, and the champion's last wave has
   * `pairs` bosses.
   */
  horde: {
    waves: 3, counts: [4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6] as PerStage, budget: 2.4, leader: 1.5, offense: 4.6,
    shields: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3] as PerStage, leaderShield: 6,
    face: 'key', leaderFace: 'subboss', bossFace: 'boss', bossFrom: 1, pairs: 2,
  },
  /** How many kinds each foe is weak to (§5): Iron's Arms and Arcane's elements by rank; the Duel's both, by stage. The
   * Horde's is always one of each, dealt so no two foes of a wave share a pair. Iron's single Arms kind favours the
   * Brawlers, who carry all five, over the Arms a caster party brings. */
  weak: {
    iron: { regular: 1, 'sub-boss': 1, boss: 1 },
    arcane: { regular: 2, 'sub-boss': 2, boss: 1 },
    duel: { weapons: [2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1] as PerStage, elements: [2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1] as PerStage },
  },
} as const

/** One foe of a Rift stage, before faces, weaknesses and levels. */
export interface RiftSlot {
  face: RiftFace
  rank: EnemyRank
  /** Her role; `seeded`: one of the four regular roles, by the fight's seed. */
  role: RpgFoeRole | 'seeded'
  /** A share of `rpgFoe`'s own HP for her rank (times the regular-foe HP step for a regular). */
  hp: number
  /** Multiplies her ATK and M.ATK. */
  offense: number
  shield: number
  acts: 1 | 2 | 3
  /** One of a champion pair: her face comes from another pack than her partner's, and her weaknesses differ. */
  pair?: true
}

const times = (n: number, slot: () => RiftSlot): RiftSlot[] => Array.from({ length: n }, slot)
const valid = (front: RiftFront, stage: number): boolean =>
  RIFT_FRONTS.includes(front) && Number.isInteger(stage) && stage >= 1 && stage <= RIFT_STAGES

/** Iron's and Arcane's stages (§5): 1–4 a sub-boss and her key guards; 5 and 7 two sub-bosses; 6 and 8 a boss and her
 * sub-boss-faced guards; 9–11 two opening waves of sub-boss-faced foes, then the boss and her guards; 12 two bosses. The
 * counts are `RIFT_TUNING`'s. */
function wardShape(stage: number): RiftSlot[][] {
  const t = RIFT_TUNING
  const bossWave = (): RiftSlot[] => [
    { face: t.boss.face, rank: 'boss', role: 'champion', hp: t.boss.hp, offense: t.boss.offense, shield: t.boss.shield, acts: t.boss.acts },
    ...times(t.boss.guards, () => ({ face: t.boss.guard.face, rank: 'regular', role: 'guard', hp: t.boss.guard.hp, offense: t.boss.guard.offense, shield: t.boss.guard.shield, acts: 1 })),
  ]
  if (stage <= 4) {
    const c = t.escort.captain, g = t.escort.guard
    return [[{ face: c.face, rank: 'sub-boss', role: 'captain', hp: c.hp, offense: c.offense, shield: c.shield, acts: c.acts },
      ...times(t.escort.guards, () => ({ face: g.face, rank: 'regular', role: 'guard', hp: g.hp, offense: g.offense, shield: g.shield, acts: 1 }))]]
  }
  if (stage <= 8) {
    if (stage % 2 === 1) {
      const e = t.elites
      return [times(e.count, () => ({ face: e.face, rank: 'sub-boss', role: 'captain', hp: e.hp, offense: e.offense, shield: e.shield, acts: e.acts }))]
    }
    return [bossWave()]
  }
  if (stage < RIFT_STAGES) {
    const o = t.openers
    const each = o.budget / o.count
    const opener = (): RiftSlot[] => times(o.count, () => ({ face: o.face, rank: 'regular', role: 'seeded', hp: o.share * each,
      offense: o.offense * formationOffense(each), shield: o.shield, acts: 1 }))
    return [...Array.from({ length: o.waves }, opener), bossWave()]
  }
  const c = t.champion
  return [times(c.count, () => ({ face: c.face, rank: 'boss', role: 'champion', hp: c.hp, offense: c.offense, shield: c.shield, acts: c.acts, pair: true }))]
}

/** The Duel (§5): one boss a fight, acting twice, three times at the champion; her shield rises by band. */
function duelShape(stage: number): RiftSlot[][] {
  const d = RIFT_TUNING.duel
  return [[{ face: d.face, rank: 'boss', role: 'champion', hp: d.hp, offense: d.offense, shield: d.shields[stage - 1]!,
    acts: stage === RIFT_STAGES ? d.championActs : d.acts }]]
}

/** The Horde (§5): three waves of a leader and keys, every foe regular rank; a boss leads the last wave from stage
 * `bossFrom`, and two bosses from different packs the champion's. */
function hordeShape(stage: number): RiftSlot[][] {
  const h = RIFT_TUNING.horde
  const count = h.counts[stage - 1]!
  const shield = h.shields[stage - 1]!
  return Array.from({ length: h.waves }, (_, w) => {
    const last = w === h.waves - 1
    const leaders = last && stage === RIFT_STAGES ? h.pairs : 1
    const face: RiftFace = last && stage >= h.bossFrom ? h.bossFace : h.leaderFace
    const unit = h.budget / (leaders * h.leader + (count - leaders))
    const lead = h.leader * unit
    return [
      ...times(leaders, () => ({ face, rank: 'regular' as const, role: face === 'boss' ? 'champion' as const : 'captain' as const, hp: lead,
        offense: h.offense * formationOffense(lead), shield: h.leaderShield, acts: 1 as const, ...(leaders > 1 ? { pair: true as const } : {}) })),
      ...times(count - leaders, () => ({ face: h.face, rank: 'regular', role: 'seeded', hp: unit, offense: h.offense * formationOffense(unit), shield, acts: 1 })),
    ]
  })
}

/** A front stage's foes, wave by wave (§5's table, D173): exported for the balance pass and the manual. Throws a
 * `RangeError` for an unknown front or a stage outside 1–12. */
export function riftShape(front: RiftFront, stage: number): RiftSlot[][] {
  if (!valid(front, stage)) throw new RangeError(`Unknown Rift stage: ${String(front)} ${stage}`)
  switch (front) {
    case 'iron': case 'arcane': {
      const { hp, offense } = RIFT_TUNING.scale[front]
      return wardShape(stage).map((wave) => wave.map((slot) => ({ ...slot, hp: slot.hp * hp, offense: slot.offense * offense })))
    }
    case 'duel': return duelShape(stage)
    case 'horde': return hordeShape(stage)
  }
}
