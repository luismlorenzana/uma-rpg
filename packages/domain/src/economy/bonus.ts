// Stat points from Extra Stats (S6) and armor (S7), applied to a battle profile (§7.3, §10, D58, D104). A point is a flat
// +1 to its stat (+5 HP); Speed becomes evasion and Limit Break charge a head start on the gauge.
import { ITEM_EFFECTS, type ItemEffect } from '../items/kinds'
import { BATTLE_LIMIT_MAX } from '../rpg/battle/caps'
import type { RpgCoreStats } from '../rpg/rules'
import { POINT_EVASION, POINT_HP, POINT_LIMIT } from './pacing'

export type Points = Record<ItemEffect, number>
export const noPoints = (): Points => Object.fromEntries(ITEM_EFFECTS.map((e) => [e, 0])) as Points
export function addPoints(...all: Points[]): Points {
  const out = noPoints()
  for (const p of all) for (const e of ITEM_EFFECTS) out[e] += p[e]
  return out
}

/** Evasion is capped at half of every hit. */
export const MAX_EVASION_PERMILLE = 500

export interface Boosted { stats: RpgCoreStats; evasion: number; limitStart: number }
/** Stats with points applied, plus evasion (per mille of damage avoided) and the Limit Break head start. */
export function applyPoints(stats: RpgCoreStats, points: Points): Boosted {
  const up = (value: number, p: number, per = 1) => Math.round(value + p * per)
  return {
    stats: { ...stats, hp: up(stats.hp, points.hp, POINT_HP), mp: up(stats.mp, points.mp), atk: up(stats.atk, points.atk), matk: up(stats.matk, points.matk),
      pdef: up(stats.pdef, points.def), mdef: up(stats.mdef, points.mdef) },
    evasion: Math.min(MAX_EVASION_PERMILLE, Math.round(POINT_EVASION * points.speed * 1000)),
    limitStart: Math.min(BATTLE_LIMIT_MAX, Math.floor(POINT_LIMIT * points.limit)),
  }
}
