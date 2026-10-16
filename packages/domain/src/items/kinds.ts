// Tiny shared vocabulary; importing an effect must not load the 160 item names (H16).
export const ITEM_EFFECTS = ['hp', 'mp', 'atk', 'matk', 'def', 'mdef', 'speed', 'limit'] as const
export type ItemEffect = typeof ITEM_EFFECTS[number]
