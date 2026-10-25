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
// Classes v2 (docs/design/classes-v2.md, D160) is engine v15, built dark in H53–H60 and live since H61 (D188): every v2
// rule answers by generation, and H61 turned the whole of it on by changing BATTLE_ENGINE_VERSION alone (with save v25).
// The pattern every v2 rule follows:
// - a rule outside the engine takes an `engine` argument that defaults to BATTLE_ENGINE_VERSION, so the live game
//   (profiles, the save, the screens) follows the switch: `rpgHand(profile, engine = BATTLE_ENGINE_VERSION)`;
// - the engine never relies on that default: every rules call it makes passes the fight's own version
//   (`rpgHand(ally, s.engineVersion)`), so a v6–v14 fight reads classes v1's rules whatever the switch says;
// - the live lists and tables (`RPG_CLASSES`, `HERO_LIMIT_IDS`, `RPG_CLASS_SLOTS`…) are the default generation's.
// `rpg/battle/v14-replays*.test.ts` proves it: v14 fights replay byte for byte under the live switch and with it at 15.
//
// The Tier rework's five releases (D198, docs/design/tier-rework/implementation.md) each open at their engine:
// `rpgRework(stage, engine)`, the same pattern. Each is built dark and turned on by its switch packet, which moves
// BATTLE_ENGINE_VERSION to the stage's engine (H72 for the fight, 16). `rpg/battle/v15-replays*.test.ts` pins v15's fights
// under the live switch and with it at 16 (H64, D200); tests mock the switch with `caps-at.fixture.ts`'s `capsAt`.

/** The engine new fights start on, and the generation every rule's default reads (D179). Older versions still replay. */
export const BATTLE_ENGINE_VERSION: BattleInput['version'] = 15
/** The first engine of classes v2: the Paladin, the hybrids' hands, healers from ATK or M.ATK, flat Orbs (D160, D179). */
export const RPG_V2_ENGINE = 15
/** Whether an engine plays classes v2's rules. Rules call it with their `engine` argument, never bare. */
export const rpgV2 = (engine: number = BATTLE_ENGINE_VERSION): boolean => engine >= RPG_V2_ENGINE
/** The first engine of each Tier rework release (D198): R1 Tier 1's fight, R2 its economy, R3 Tier 2's weapons, R4 its
 * classes, R5 Tier 3. */
export const RPG_REWORK_ENGINE = { fight: 16, economy: 17, t2Weapons: 18, t2Classes: 19, t3: 20 } as const
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
 * open (`rpgBaseMpRegen`). Here so the sheet reads it without the engine; H71 tunes it. */
export const RPG_BASE_MP_REGEN = 0.008
/** v16: the depths the base MP regen counts, at most: five, so 4% from Class Rank 40 (Tier 3's sixth doesn't raise it). */
export const RPG_BASE_MP_REGEN_DEPTHS = 5
/** v16 (UT6, D204): her Flourish gives this share of her max HP a fight, as her calling's class: Clean break's Barrier, or
 * the most Even pace and Late reserve mend. */
export const BATTLE_FLOURISH_SHARE = 0.04
/** v16: the share of her max HP Even pace and Late reserve mend at a round's end, within the fight's share. */
export const BATTLE_FLOURISH_RATE: Readonly<Record<Exclude<RpgFlourish, 'clean-break'>, number>> = { 'even-pace': 0.01, 'late-reserve': 0.02 }
/** v16: the first round whose end Late reserve mends at. */
export const BATTLE_FLOURISH_FROM = 3
