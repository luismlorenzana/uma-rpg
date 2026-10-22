import type { BattleInput } from './types'

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
// Classes v2 (docs/design/classes-v2.md, D160) is engine v15, built dark: every v2 rule answers by generation, and H61
// turns the whole of it on by changing BATTLE_ENGINE_VERSION alone (with save v25). The pattern every v2 rule follows:
// - a rule outside the engine takes an `engine` argument that defaults to BATTLE_ENGINE_VERSION, so the live game
//   (profiles, the save, the screens) follows the switch: `rpgHand(profile, engine = BATTLE_ENGINE_VERSION)`;
// - the engine never relies on that default: every rules call it makes passes the fight's own version
//   (`rpgHand(ally, s.engineVersion)`), so a v6–v14 fight reads classes v1's rules whatever the switch says;
// - the live lists and tables (`RPG_CLASSES`, `HERO_LIMIT_IDS`, `RPG_CLASS_SLOTS`…) are the default generation's.
// `rpg/battle/v14-replays*.test.ts` proves it: v14 fights replay byte for byte under the live switch and with it at 15.

/** The engine new fights start on, and the generation every rule's default reads (D179). Older versions still replay. */
export const BATTLE_ENGINE_VERSION: BattleInput['version'] = 14
/** The first engine of classes v2: the Paladin, the hybrids' hands, healers from ATK or M.ATK, flat Orbs (D160, D179). */
export const RPG_V2_ENGINE = 15
/** Whether an engine plays classes v2's rules. Rules call it with their `engine` argument, never bare. */
export const rpgV2 = (engine: number = BATTLE_ENGINE_VERSION): boolean => engine >= RPG_V2_ENGINE
/** v15 (D179): a healer's mends, Barriers and revives grow ×(1 + ATK or M.ATK ÷ this). Here so the profile reads it without
 * the engine; H56 uses it, H60 tunes it. */
export const BATTLE_HEAL_OFFENSE_SCALE = 300
