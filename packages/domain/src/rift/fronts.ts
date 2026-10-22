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
 * Every number the Rift's generator reads (D173), starting from the world's nearest fight; H51 tunes them to rift.md §11.
 * HP shares are of `rpgFoe`'s own HP for her rank (a regular's also take the world's regular-foe HP step); a formation's
 * `budget` is in regular foes' HP. Per-stage lists run stage 1 to 12.
 */
export const RIFT_TUNING = {
  /** Front and Convergence foes stand at this tier level (§5). */
  level: 50,
  /** Strength climbs by this over a front's twelve stages: stage n is 1 + climb × (n − 1) ÷ 11 (×1.10 at the champion). */
  climb: 0.1,
  /** A Convergence fight is a champion at (1 + climb) × (1 + convergence) (§6). */
  convergence: 0.1,
  /** The Lv 55 Echo is the Lv 50 shape at this strength: a tier stops at Lv 50, and five levels on the Tier 1 curve are
   * ×1.23 HP (Lv 45 → 50). */
  echo55: 1.22,
  /** An Echo is its front's shape at this stage (§8). */
  echoStage: 8,
  /** Iron and Arcane, stages 1–4: a sub-boss captain and her key guards (a region elite). */
  escort: { captain: { face: 'subboss', hp: 1, shield: 6, acts: 2 }, guards: 2, guard: { face: 'key', hp: 0.8, shield: 3 } },
  /** Iron and Arcane, stages 5 and 7: sub-bosses together. */
  elites: { count: 2, face: 'subboss', hp: 1, shield: 6, acts: 1 },
  /** Iron and Arcane, stages 6 and 8 and the last wave of 9–11: a boss and her sub-boss-faced guards (a region boss's last
   * wave; `hp` is the world's boss share, 0.5). */
  boss: { face: 'boss', hp: 0.5, shield: 8, acts: 2, guards: 2, guard: { face: 'subboss', hp: 0.8, shield: 3 } },
  /** Iron and Arcane, stages 9–11: opening waves of sub-boss-faced regulars, each wave `share` of a trio's `budget` (a
   * region boss's opening waves). Their offense is the world's for a trio's foe. */
  openers: { waves: 2, count: 3, face: 'subboss', budget: 3.6, share: 0.3, shield: 3 },
  /** Iron and Arcane, stage 12, the champion: bosses from different packs, together (a twin-boss row). */
  champion: { count: 2, face: 'boss', hp: 0.55, shield: 8, acts: 1 },
  /** The Duel: one boss, acting twice, three times at the champion; shields by stage. */
  duel: { face: 'boss', hp: 1, acts: 2, championActs: 3, shields: [10, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 12] as PerStage },
  /**
   * The Horde: waves of `counts` foes (a swarm and a squad), each sharing `budget` regular foes' HP, a leader taking
   * `leader` shares and the rest one each; a foe's offense is the world's for her share. All regular rank. The leader is
   * sub-boss-faced, boss-faced in the last wave from stage `bossFrom`, and the champion's last wave has `pairs` bosses.
   */
  horde: {
    waves: 3, counts: [4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6] as PerStage, budget: 3.6, leader: 1.5,
    shields: [3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4] as PerStage, leaderShield: 6,
    face: 'key', leaderFace: 'subboss', bossFace: 'boss', bossFrom: 9, pairs: 2,
  },
  /** How many kinds each foe is weak to (§5): Iron's Arms and Arcane's elements by rank; the Duel's both, by stage. The
   * Horde's is always one of each, dealt so no two foes of a wave share a pair. */
  weak: {
    iron: { regular: 3, 'sub-boss': 2, boss: 1 },
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

/** Iron's and Arcane's stages (§5): 1–4 a sub-boss and two keys; 5 and 7 two sub-bosses; 6 and 8 a boss and sub-boss
 * guards; 9–11 two waves of sub-boss-faced trios, then the boss and her guards; 12 two bosses. */
function wardShape(stage: number): RiftSlot[][] {
  const t = RIFT_TUNING
  const bossWave = (): RiftSlot[] => [
    { face: t.boss.face, rank: 'boss', role: 'champion', hp: t.boss.hp, offense: 1, shield: t.boss.shield, acts: t.boss.acts },
    ...times(t.boss.guards, () => ({ face: t.boss.guard.face, rank: 'regular', role: 'guard', hp: t.boss.guard.hp, offense: 1, shield: t.boss.guard.shield, acts: 1 })),
  ]
  if (stage <= 4) {
    const c = t.escort.captain, g = t.escort.guard
    return [[{ face: c.face, rank: 'sub-boss', role: 'captain', hp: c.hp, offense: 1, shield: c.shield, acts: c.acts },
      ...times(t.escort.guards, () => ({ face: g.face, rank: 'regular', role: 'guard', hp: g.hp, offense: 1, shield: g.shield, acts: 1 }))]]
  }
  if (stage <= 8) {
    if (stage % 2 === 1) {
      const e = t.elites
      return [times(e.count, () => ({ face: e.face, rank: 'sub-boss', role: 'captain', hp: e.hp, offense: 1, shield: e.shield, acts: e.acts }))]
    }
    return [bossWave()]
  }
  if (stage < RIFT_STAGES) {
    const o = t.openers
    const each = o.budget / o.count
    const opener = (): RiftSlot[] => times(o.count, () => ({ face: o.face, rank: 'regular', role: 'seeded', hp: o.share * each,
      offense: formationOffense(each), shield: o.shield, acts: 1 }))
    return [...Array.from({ length: o.waves }, opener), bossWave()]
  }
  const c = t.champion
  return [times(c.count, () => ({ face: c.face, rank: 'boss', role: 'champion', hp: c.hp, offense: 1, shield: c.shield, acts: c.acts, pair: true }))]
}

/** The Duel (§5): one boss a fight, acting twice, three times at the champion; her shield rises by band. */
function duelShape(stage: number): RiftSlot[][] {
  const d = RIFT_TUNING.duel
  return [[{ face: d.face, rank: 'boss', role: 'champion', hp: d.hp, offense: 1, shield: d.shields[stage - 1]!,
    acts: stage === RIFT_STAGES ? d.championActs : d.acts }]]
}

/** The Horde (§5): three waves of a leader and keys, every foe regular rank; a boss leads the last wave from stage 9, and
 * two bosses from different packs the champion's. */
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
        offense: formationOffense(lead), shield: h.leaderShield, acts: 1 as const, ...(leaders > 1 ? { pair: true as const } : {}) })),
      ...times(count - leaders, () => ({ face: h.face, rank: 'regular', role: 'seeded', hp: unit, offense: formationOffense(unit), shield, acts: 1 })),
    ]
  })
}

/** A front stage's foes, wave by wave (§5's table, D173): exported for the balance pass and the manual. Throws a
 * `RangeError` for an unknown front or a stage outside 1–12. */
export function riftShape(front: RiftFront, stage: number): RiftSlot[][] {
  if (!valid(front, stage)) throw new RangeError(`Unknown Rift stage: ${String(front)} ${stage}`)
  switch (front) {
    case 'iron': case 'arcane': return wardShape(stage)
    case 'duel': return duelShape(stage)
    case 'horde': return hordeShape(stage)
  }
}
