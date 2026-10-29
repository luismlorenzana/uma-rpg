// The Rift's four fronts (docs/design/rift.md §5, D161; built in H47, D173): what each asks of a party, the shape of every
// stage, and every number the generator reads, in one table (`RIFT_TUNING`) that the balance pass (H51) tunes against
// §11's targets. Which ranks a stage holds is §5's and stays; its counts, shares, shields and acts are tuning. Lazy: only
// `@rpg/domain/rift` loads it.
import { BATTLE_ENGINE_VERSION, rpgRework, rpgV2 } from '../rpg/battle/caps'
import type { BattleChannel, EnemyRank } from '../rpg/battle/types'
import type { RpgFoeRole } from '../rpg/campaign/enemies'
import { rpgDefaultWeapons, type RpgClass, type RpgWeapon } from '../rpg/rules'
import { formationOffense } from '../world/world'
import { RIFT_FRONTS, RIFT_STAGES, type RiftFront } from './state'

export interface RiftFrontSpec {
  front: RiftFront
  name: 'Iron' | 'Arcane' | 'Duel' | 'Horde'
  /** The channel its foes ward (H44): Iron magical, Arcane physical; null on Duel and Horde. */
  ward: BattleChannel | null
  /** The party guidance, five classes: classes v1's (D168, point 2) or v2's (D178, point 5), by `riftParty`. */
  party: readonly RpgClass[]
  /** The guided build (`riftGuidedBuild`): `party`'s members, each with her three weapons from v16 (CP7), her defaults before. */
  build: readonly RiftGuidedMember[]
}
/** One member of a guided build: her class and her weapons, in slot order. */
export interface RiftGuidedMember { classId: RpgClass; weapons: readonly RpgWeapon[] }

const PARTY_V1: Readonly<Record<RiftFront, readonly RpgClass[]>> = {
  iron: ['brawler', 'brawler', 'spellblade', 'spellblade', 'cleric'],
  arcane: ['mage', 'mage', 'summoner', 'summoner', 'cleric'],
  duel: ['brawler', 'brawler', 'mage', 'mage', 'cleric'],
  horde: ['spellblade', 'spellblade', 'summoner', 'summoner', 'cleric'],
}
/** Classes v2's guidance (D178, point 5; H60 measured both healers on the Duel and the Horde and kept these): one healer
 * a party, the Paladin with the Arms-led parties, the Cleric with the Tome-led. */
const PARTY_V2: Readonly<Record<RiftFront, readonly RpgClass[]>> = {
  iron: ['brawler', 'brawler', 'spellblade', 'spellblade', 'paladin'],
  arcane: ['mage', 'mage', 'summoner', 'summoner', 'cleric'],
  duel: ['brawler', 'brawler', 'mage', 'mage', 'paladin'],
  horde: ['spellblade', 'spellblade', 'summoner', 'summoner', 'cleric'],
}
/** Classes v3's guidance (CV23; H126): each front's build is a family of the tree. Iron the Warrior side, Arcane the Mage
 * side, Duel the Spellblades, Horde the Summoners; one healer each, the Paladin with the Arms-led, the Cleric with the
 * Tome-led. A run's twenty hold all eight Tier 1 classes. */
export const PARTY_V19: Readonly<Record<RiftFront, readonly RpgClass[]>> = {
  iron: ['brawler', 'brawler', 'spellblade', 'armsummoner', 'paladin'],
  arcane: ['mage', 'mage', 'tomeblade', 'summoner', 'cleric'],
  duel: ['spellblade', 'spellblade', 'tomeblade', 'tomeblade', 'paladin'],
  horde: ['armsummoner', 'armsummoner', 'summoner', 'summoner', 'cleric'],
}
/** A front's guided party in an engine's class generation (H60): the balance simulation asks by version, the screens
 * read the live one through `RIFT_FRONT_SPECS`. */
export const riftParty = (front: RiftFront, engine: number = BATTLE_ENGINE_VERSION): readonly RpgClass[] =>
  (rpgRework('classes', engine) ? PARTY_V19 : rpgV2(engine) ? PARTY_V2 : PARTY_V1)[front]

/** The guided builds from v16 (CP7, class-progression.md §2.3, D202): classes v2's compositions (D178, point 5), the
 * second copy of a class re-specced to the kinds the first doesn't hold; `null` keeps her defaults (CP3). Each build answers
 * each of its front's Tier 1 foes at least twice and holds every kind its later foes ask for (§4.5). */
const BUILDS_V16: Readonly<Record<RiftFront, readonly (readonly [RpgClass, readonly RpgWeapon[] | null])[]>> = {
  iron: [['brawler', null], ['brawler', ['bow', 'katana', 'axe']], ['spellblade', null], ['spellblade', ['bow', 'greatsword', 'tome-fire']],
    ['paladin', null]],
  arcane: [['mage', null], ['mage', null], ['summoner', null], ['summoner', null], ['cleric', null]],
  duel: [['brawler', null], ['brawler', ['bow', 'katana', 'lance']], ['mage', null], ['mage', ['tome-light', 'tome-dark', 'tome-lightning']],
    ['paladin', null]],
  horde: [['spellblade', null], ['spellblade', ['greatsword', 'axe', 'tome-fire']], ['summoner', null], ['summoner', ['tome-ice', 'tome-fire', 'lance']],
    ['cleric', null]],
}
/** Classes v3's guided builds (CV23, §10.1; H126), in slot order: `PARTY_V19`'s members, a second copy of a class re-specced
 * so each front holds its kinds twice (Iron Greatsword 2, Axe 4, Lance 2, Bow 2, Katana 2; Arcane Fire 2, Ice 3, Lightning
 * 2, Light 3, Dark 2; the Duel and the Horde every twin set 2–3 times); `null` keeps her v19 defaults. */
export const BUILDS_V19: Readonly<Record<RiftFront, readonly (readonly [RpgClass, readonly RpgWeapon[] | null])[]>> = {
  iron: [['brawler', null], ['brawler', ['bow', 'katana', 'axe']], ['spellblade', null], ['armsummoner', null], ['paladin', null]],
  arcane: [['mage', null], ['mage', ['tome-light', 'tome-dark', 'tome-fire']], ['tomeblade', null], ['summoner', null], ['cleric', null]],
  duel: [['spellblade', null], ['spellblade', ['bow', 'greatsword', 'tome-fire']], ['tomeblade', null], ['tomeblade', ['tome-dark', 'tome-ice', 'axe']],
    ['paladin', null]],
  horde: [['armsummoner', null], ['armsummoner', ['lance', 'greatsword', 'tome-lightning']], ['summoner', null],
    ['summoner', ['tome-fire', 'tome-lightning', 'katana']], ['cleric', null]],
}
/** A front's guided build in an engine's generation (CP7): five members and their weapons, in slot order. From v16 the
 * table above, from v19 Classes v3's (`BUILDS_V19`); before v16 the guided classes (`riftParty`) on their own defaults.
 * The screen's one-tap use is H70's. */
export function riftGuidedBuild(front: RiftFront, engine: number = BATTLE_ENGINE_VERSION): RiftGuidedMember[] {
  if (rpgRework('fight', engine)) {
    return (rpgRework('classes', engine) ? BUILDS_V19 : BUILDS_V16)[front]
      .map(([classId, weapons]) => ({ classId, weapons: weapons ? [...weapons] : rpgDefaultWeapons(classId, engine) }))
  }
  return riftParty(front, engine).map((classId) => ({ classId, weapons: rpgDefaultWeapons(classId, engine) }))
}

/** §5's fronts in an engine's generation: Iron's foes are weak to Arms only and ward elements, Arcane's the reverse; the
 * Duel is one boss weak to both, the Horde many foes each weak to her own pair (from v16 a twin set each). */
export const riftFrontSpecs = (engine: number = BATTLE_ENGINE_VERSION): Readonly<Record<RiftFront, RiftFrontSpec>> => ({
  iron: { front: 'iron', name: 'Iron', ward: 'magical', party: riftParty('iron', engine), build: riftGuidedBuild('iron', engine) },
  arcane: { front: 'arcane', name: 'Arcane', ward: 'physical', party: riftParty('arcane', engine), build: riftGuidedBuild('arcane', engine) },
  duel: { front: 'duel', name: 'Duel', ward: null, party: riftParty('duel', engine), build: riftGuidedBuild('duel', engine) },
  horde: { front: 'horde', name: 'Horde', ward: null, party: riftParty('horde', engine), build: riftGuidedBuild('horde', engine) },
})
/** The live generation's fronts: today's guidance until the switch (H61), classes v2's after. */
export const RIFT_FRONT_SPECS: Readonly<Record<RiftFront, RiftFrontSpec>> = riftFrontSpecs()

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
   * Brawlers, who carry all five, over the Arms a caster party brings. From v16 (CP7) the Duel draws twin sets
   * (`duel.sets`, `RIFT_TUNING_V16`) and the Horde a twin set a foe. */
  weak: {
    iron: { regular: 1, 'sub-boss': 1, boss: 1 },
    arcane: { regular: 2, 'sub-boss': 2, boss: 1 },
    duel: { weapons: [2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1] as PerStage, elements: [2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1] as PerStage },
  },
} as const

type Widen<T> = T extends number ? number : T extends string ? T : { readonly [K in keyof T]: Widen<T[K]> }
/** `RIFT_TUNING`'s shape with its numbers free, so a generation's override is one. */
export type RiftTuning = Widen<typeof RIFT_TUNING> & {
  /** v15: a front's champion (stage 12, and so its Convergence fight) at this HP and offense over its front's shape. */
  champions?: Partial<Record<RiftFront, { hp: number; offense: number }>>
  /** v16 (CP7): the Duel's boss is weak to this many twin sets a stage, each its Arm and its element, in place of
   * `weapons` and `elements`' independent draws. */
  weak: { duel: { sets?: PerStage } }
}

/** Classes v2's Rift (H60, D186; rift.md §5, §11): `RIFT_TUNING` with what classes v2's parties' measurements moved:
 * Iron's and Arcane's shields doubled, Arcane's scale, each front's champion, the Duel, the Horde's offense and the
 * Convergence. H63 (D187): Iron's champion ×1.2 (H60 ×1.17), for the mirror's stronger Spell Blades. */
const RIFT_TUNING_V15: RiftTuning = {
  ...RIFT_TUNING,
  scale: { iron: { hp: 1, offense: 1 }, arcane: { hp: 1.2, offense: 1.1 } },
  champions: { iron: { hp: 1.2, offense: 1.2 }, arcane: { hp: 1, offense: 0.92 }, horde: { hp: 1.05, offense: 1.05 } },
  escort: { ...RIFT_TUNING.escort, captain: { ...RIFT_TUNING.escort.captain, shield: 16 }, guard: { ...RIFT_TUNING.escort.guard, shield: 8 } },
  elites: { ...RIFT_TUNING.elites, shield: 16 },
  boss: { ...RIFT_TUNING.boss, shield: 16, guard: { ...RIFT_TUNING.boss.guard, shield: 12 } },
  openers: { ...RIFT_TUNING.openers, shield: 12 },
  duel: { ...RIFT_TUNING.duel, hp: 1.1, offense: 2.3 },
  horde: { ...RIFT_TUNING.horde, offense: 4.4 },
  convergence: -0.18,
}

/**
 * The Tier rework's Rift, Tier 1 (CP7, D202): v15's numbers, with the Duel's weaknesses drawn as twin sets, two at stages
 * 1–6 and one at 7–12 (today's counts, as sets). R1's balance (H71, D207) re-tuned it for the v16 guided builds, which
 * cleared v15's numbers far faster (Iron's champion 100%, the Horde's 99%, the Convergence 94%; the Duel's champion
 * 22%), against rift.md §11's bands: Iron's offense ×1.6, Arcane ×1.6 HP and ×1.2 offense (×1.2 and ×1.1) with its
 * sub-bosses weak to one element (two), the elites' offense 1.6 → 2, the Duel's champion ×0.8 and the Horde's ×1.3
 * (×1.05), the Convergence −0.18 → −0.1; Iron's and Arcane's champions keep v15's scales. Faces, ranks and counts stay
 * v15's (a test).
 */
const RIFT_TUNING_V16: RiftTuning = {
  ...RIFT_TUNING_V15,
  scale: { iron: { hp: 1, offense: 1.6 }, arcane: { hp: 1.6, offense: 1.2 } },
  champions: { ...RIFT_TUNING_V15.champions, duel: { hp: 0.8, offense: 0.8 }, horde: { hp: 1.3, offense: 1.3 } },
  elites: { ...RIFT_TUNING_V15.elites, offense: 2 },
  weak: { ...RIFT_TUNING_V15.weak, arcane: { ...RIFT_TUNING_V15.weak.arcane, 'sub-boss': 1 },
    duel: { ...RIFT_TUNING_V15.weak.duel, sets: [2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1] } },
  convergence: -0.1,
}

/**
 * R2's Rift, Tier 1 (engine v17; R2's balance, H81, D215): v16's numbers for the v17 guided builds (graded in WP25's
 * forms, no MP accessory, the base regen at 1.0% a depth), which won Iron's champion 56% and the Horde's 77% on v16's
 * against rift.md §11's 60–70%: Iron's champion ×1.2 → ×1.15, the Horde's ×1.3 → ×1.4 (65% and 67% at 96 fights each).
 * Every other number, face, rank and count is v16's.
 */
const RIFT_TUNING_V17: RiftTuning = {
  ...RIFT_TUNING_V16,
  champions: { ...RIFT_TUNING_V16.champions, iron: { hp: 1.15, offense: 1.15 }, horde: { hp: 1.4, offense: 1.4 } },
}

/** The numbers a Rift fight's engine reads (H60): `RIFT_TUNING` to v14, classes v2's override from v15, the Tier rework's
 * from v16 (H66) and R2's from v17 (H81), read through the fight's version so a fight started before the switch keeps its generation's foes.
 * Faces, ranks and counts are the same in all, so the run's face allocation (`picker.ts`) holds for any. */
export const riftTuning = (engine: number = BATTLE_ENGINE_VERSION): RiftTuning =>
  (rpgRework('economy', engine) ? RIFT_TUNING_V17 : rpgRework('fight', engine) ? RIFT_TUNING_V16 : rpgV2(engine) ? RIFT_TUNING_V15 : RIFT_TUNING)

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

const actsOf = (n: number): RiftSlot['acts'] => n as RiftSlot['acts']
const times = (n: number, slot: () => RiftSlot): RiftSlot[] => Array.from({ length: n }, slot)
const valid = (front: RiftFront, stage: number): boolean =>
  RIFT_FRONTS.includes(front) && Number.isInteger(stage) && stage >= 1 && stage <= RIFT_STAGES

/** Iron's and Arcane's stages (§5): 1–4 a sub-boss and her key guards; 5 and 7 two sub-bosses; 6 and 8 a boss and her
 * sub-boss-faced guards; 9–11 two opening waves of sub-boss-faced foes, then the boss and her guards; 12 two bosses. The
 * counts are `RIFT_TUNING`'s. */
function wardShape(stage: number, t: RiftTuning): RiftSlot[][] {
  const bossWave = (): RiftSlot[] => [
    { face: t.boss.face, rank: 'boss', role: 'champion', hp: t.boss.hp, offense: t.boss.offense, shield: t.boss.shield, acts: actsOf(t.boss.acts) },
    ...times(t.boss.guards, () => ({ face: t.boss.guard.face, rank: 'regular', role: 'guard', hp: t.boss.guard.hp, offense: t.boss.guard.offense, shield: t.boss.guard.shield, acts: 1 })),
  ]
  if (stage <= 4) {
    const c = t.escort.captain, g = t.escort.guard
    return [[{ face: c.face, rank: 'sub-boss', role: 'captain', hp: c.hp, offense: c.offense, shield: c.shield, acts: actsOf(c.acts) },
      ...times(t.escort.guards, () => ({ face: g.face, rank: 'regular', role: 'guard', hp: g.hp, offense: g.offense, shield: g.shield, acts: 1 }))]]
  }
  if (stage <= 8) {
    if (stage % 2 === 1) {
      const e = t.elites
      return [times(e.count, () => ({ face: e.face, rank: 'sub-boss', role: 'captain', hp: e.hp, offense: e.offense, shield: e.shield, acts: actsOf(e.acts) }))]
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
  return [times(c.count, () => ({ face: c.face, rank: 'boss', role: 'champion', hp: c.hp, offense: c.offense, shield: c.shield, acts: actsOf(c.acts), pair: true }))]
}

/** The Duel (§5): one boss a fight, acting twice, three times at the champion; her shield rises by band. */
function duelShape(stage: number, t: RiftTuning): RiftSlot[][] {
  const d = t.duel
  return [[{ face: d.face, rank: 'boss', role: 'champion', hp: d.hp, offense: d.offense, shield: d.shields[stage - 1]!,
    acts: actsOf(stage === RIFT_STAGES ? d.championActs : d.acts) }]]
}

/** The Horde (§5): three waves of a leader and keys, every foe regular rank; a boss leads the last wave from stage
 * `bossFrom`, and two bosses from different packs the champion's. */
function hordeShape(stage: number, t: RiftTuning): RiftSlot[][] {
  const h = t.horde
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

/** A front stage's foes, wave by wave (§5's table, D173), in an engine's tuning (`riftTuning`, H60): exported for the
 * balance pass and the manual. Throws a `RangeError` for an unknown front or a stage outside 1–12. */
export function riftShape(front: RiftFront, stage: number, engine: number = BATTLE_ENGINE_VERSION): RiftSlot[][] {
  if (!valid(front, stage)) throw new RangeError(`Unknown Rift stage: ${String(front)} ${stage}`)
  const t = riftTuning(engine)
  const shape = ((): RiftSlot[][] => {
    switch (front) {
      case 'iron': case 'arcane': {
        const { hp, offense } = t.scale[front]
        return wardShape(stage, t).map((wave) => wave.map((slot) => ({ ...slot, hp: slot.hp * hp, offense: slot.offense * offense })))
      }
      case 'duel': return duelShape(stage, t)
      case 'horde': return hordeShape(stage, t)
    }
  })()
  // v15: a front's own champion scale (its Convergence fight, the same shape, too).
  const c = stage === RIFT_STAGES ? t.champions?.[front] : undefined
  return c ? shape.map((wave) => wave.map((slot) => ({ ...slot, hp: slot.hp * c.hp, offense: slot.offense * c.offense }))) : shape
}
