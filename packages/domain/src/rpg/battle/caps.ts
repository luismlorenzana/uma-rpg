import type { BattleInput, RpgFlourish } from './types'

// Shared replay bounds: safe to use while parsing a save without loading the engine or skill catalog (H16).
export const BATTLE_MAX_ROUNDS = 40
export const BATTLE_MAX_EXTRA_WAVES = 2
/** Five actions per round over every wave's cap, with room to spare. */
export const BATTLE_MAX_ACTIONS = BATTLE_MAX_ROUNDS * 10 * (1 + BATTLE_MAX_EXTRA_WAVES)
export const BATTLE_LIMIT_MAX = 12
/** v12 (D141): her Heal raises her mends and Barriers ×(1 + Heal ÷ 300). Here so the profile reads it without the engine. */
export const BATTLE_HEAL_SCALE = 300

// --- The one switch (H53, D179) ----------------------------------------------------------------------------------------
//
// Classes v2 (docs/archive/design/classes-v2.md, D160) is engine v15, built dark in H53–H60 and live since H61 (D188): every v2
// rule answers by generation, and H61 turned the whole of it on by changing BATTLE_ENGINE_VERSION alone (with save v25).
// The pattern every v2 rule follows:
// - a rule outside the engine takes an `engine` argument that defaults to BATTLE_ENGINE_VERSION, so the live game
//   (profiles, the save, the screens) follows the switch: `rpgHand(profile, engine = BATTLE_ENGINE_VERSION)`;
// - the engine never relies on that default: every rules call it makes passes the fight's own version
//   (`rpgHand(ally, s.engineVersion)`), so a v6–v14 fight reads classes v1's rules whatever the switch says;
// - the live lists and tables (`RPG_CLASSES`, `HERO_LIMIT_IDS`, `RPG_CLASS_SLOTS`…) are the default generation's.
// `rpg/battle/v14-replays*.test.ts` proves it: v14 fights replay byte for byte under the live switch and with it at 15.
//
// The Tier rework's five releases (D198, docs/archive/design/tier-rework/implementation.md) each open at their engine:
// `rpgRework(stage, engine)`, the same pattern. Each is built dark and turned on by its switch packet, which moves
// BATTLE_ENGINE_VERSION to the stage's engine: R1, Tier 1's fight, is engine v16, built in H64–H71 and live since H72
// (D210); R2, Tier 1's economy, is engine v17, built in H73–H81 and live since H82 (D218); weaknesses v2 is engine v18,
// only the foes' generation (D235), built dark in H115 and turned on by H116. `rpg/battle/v15-replays.test.ts`
// `v16-replays.test.ts` and `v17-replays.test.ts` pin v15's through v17's fights under the live switch (H64, D200;
// H82; H116); tests mock the switch with `caps-at.fixture.ts`'s `capsAt`.
//
// Classes v3 and Halls v2 (D240, D241; docs/design/classes-v3/) are engine v19 and save v32 under one stage, `classes`:
// thirteen classes in a tree (five Tier 0 that promote at Class Rank 10 into eight Tier 1), the calling by running style,
// and the twenty Limit Breaks. Built dark from H126 (D244, D245), every rule reads `rpgRework('classes', engine)`; H134
// moved BATTLE_ENGINE_VERSION to 19 (and the save to v32), live since. `rpg/battle/v18-replays.test.ts` pins v18's fights
// under the live switch. R3–R5 (Tier 2's weapons and classes, Tier 3) were removed by D238: their
// stages went, but `t2Weapons` stays, at no engine, since the Branch Gem's two gates read it; the Tier 2 re-plan gives it one.

/** The engine new fights start on, and the generation every rule's default reads (D179). Older versions still replay. */
export const BATTLE_ENGINE_VERSION: BattleInput['version'] = 19
/** The first engine of classes v2: the Paladin, the hybrids' hands, healers from ATK or M.ATK, flat Orbs (D160, D179). */
export const RPG_V2_ENGINE = 15
/** Whether an engine plays classes v2's rules. Rules call it with their `engine` argument, never bare. */
export const rpgV2 = (engine: number = BATTLE_ENGINE_VERSION): boolean => engine >= RPG_V2_ENGINE
/** The first engine of each release (D198): R1 Tier 1's fight, R2 its economy, weaknesses v2 (D235: every foe her own
 * list, by rank, weaknesses-v2.md), Classes v3 with Halls v2 (D240, D241: live since H134), and Tier 2's weapons, which
 * has no engine until the Tier 2 re-plan (D238 removed R3–R5; the Branch Gem's gates read it, so it stays shut). */
export const RPG_REWORK_ENGINE = { fight: 16, economy: 17, weak: 18, classes: 19, t2Weapons: Infinity } as const
/** A Tier rework release, by its stage name. */
export type RpgReworkStage = keyof typeof RPG_REWORK_ENGINE
/** Whether an engine plays a Tier rework release's rules (H64, D200). Rules call it with their `engine` argument; rules
 * outside fights (the places, the professions) read the live default, so one flip turns a release on everywhere. */
export const rpgRework = (stage: RpgReworkStage, engine: number = BATTLE_ENGINE_VERSION): boolean => engine >= RPG_REWORK_ENGINE[stage]
/** v15 (D179): a healer's mends, Barriers and revives grow ×(1 + ATK or M.ATK ÷ this). Here so the profile reads it without
 * the engine; H56 uses it, H60 tunes it. */
export const BATTLE_HEAL_OFFENSE_SCALE = 300
/** v15 (classes v2 §4): the round ends a Cleric's Regen mends at, the round she casts her Light spell and the next. */
export const BATTLE_REGEN_ROUNDS = 2
/** v16 (SB18, D204): at each round's end every Uma regains this share of her max MP for each skill depth her class has
 * open (`rpgBaseMpRegen`). Here so the sheet reads it without the engine. R1's balance (H71, D207) set it 0.8% → 0.9%:
 * with today's supports worn it brings a region's last four stages to today's pace at Lv 50 (0.88× → 0.90×), MP's drag
 * there to today's (1.24); no deep cast refunded by a round (a healer's 63% the most). */
export const RPG_BASE_MP_REGEN = 0.009
/** v17 (R2's balance, H81, D215): with the Spring and the Siphon retired, 0.9% → 1.0% a depth (5% from Class Rank 40)
 * brings a region's last four stages to today's pace ±10% at Lv 10 · 30 · 50 (0.93 · 0.94 · 0.90×; 0.9%: 0.84× at Lv 50),
 * MP's drag there to today's (1.21 against 1.24); no deep cast refunded by a round (a healer's 94% at Lv 49 the most). */
export const RPG_BASE_MP_REGEN_V17 = 0.010
/** v16: the depths the base MP regen counts, at most: five, so 4.5% from Class Rank 40 (Tier 3's sixth doesn't raise it). */
export const RPG_BASE_MP_REGEN_DEPTHS = 5
/** v16 (UT6, D204): her Flourish gives this share of her max HP a fight, as her calling's class: Clean break's Barrier, or
 * the most Even pace and Late reserve mend. */
export const BATTLE_FLOURISH_SHARE = 0.04
/** v16: the share of her max HP Even pace and Late reserve mend at a round's end, within the fight's share. */
export const BATTLE_FLOURISH_RATE: Readonly<Record<Exclude<RpgFlourish, 'clean-break'>, number>> = { 'even-pace': 0.01, 'late-reserve': 0.02 }
/** v16: the first round whose end Late reserve mends at. */
export const BATTLE_FLOURISH_FROM = 3
