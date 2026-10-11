// Device-local battle conveniences. A saved Auto preference lets a reloaded fight resume; failures (private browsing,
// a full store or malformed old data) never keep the fight screen from opening.
export type BattleSpeed = 1 | 2 | 4
export interface BattlePreferences { auto: boolean; speed: BattleSpeed }

const KEY = 'uma-rpg:battle-preferences'
const DEFAULTS: BattlePreferences = { auto: false, speed: 1 }

export function loadBattlePreferences(): BattlePreferences {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Partial<BattlePreferences> | null
    return {
      auto: typeof value?.auto === 'boolean' ? value.auto : DEFAULTS.auto,
      speed: value?.speed === 2 || value?.speed === 4 ? value.speed : DEFAULTS.speed,
    }
  } catch {
    return { ...DEFAULTS }
  }
}

export function saveBattlePreferences(value: BattlePreferences): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(value))
  } catch {
    // A convenience setting is never worth interrupting a fight.
  }
}

export const nextBattleSpeed = (speed: BattleSpeed): BattleSpeed => speed === 1 ? 2 : speed === 2 ? 4 : 1
