// Shared replay bounds: safe to use while parsing a save without loading the engine or skill catalog (H16).
export const BATTLE_MAX_ROUNDS = 40
export const BATTLE_MAX_EXTRA_WAVES = 2
/** Five actions per round over every wave's cap, with room to spare. */
export const BATTLE_MAX_ACTIONS = BATTLE_MAX_ROUNDS * 10 * (1 + BATTLE_MAX_EXTRA_WAVES)
export const BATTLE_LIMIT_MAX = 12
