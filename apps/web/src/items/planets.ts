// Each planet's colour and short name on the Observatory map, and what a node gives, shared with the Lapidary.
import { EFFECT_LABEL, ITEM_EFFECTS, POINT_EVASION, POINT_HP, POINT_LIMIT, starPoints, type ItemEffect } from '@rpg/domain'

export const PLANET_SHORT: Readonly<Record<ItemEffect, string>> = { hp: 'HP', mp: 'MP', atk: 'ATK', matk: 'MATK', def: 'DEF', mdef: 'MDEF', speed: 'SPD', limit: 'LB' }

export const PLANET_COLOR: Readonly<Record<ItemEffect, string>> = {
  hp: '#e8706a', mp: '#6aa8ff', atk: '#ff9a4d', matk: '#c48bff', def: '#9fb4cc', mdef: '#5fd3c0', speed: '#ffd84d', limit: '#f0b8ff',
}
/** A node's name: "ATK moon 4", "HP + DEF bridge 1", "Sun 2". */
export function nodeLabel(id: string): string {
  const [kind, key, n] = id.split(':')
  if (kind === 'moon') return `${EFFECT_LABEL[key as ItemEffect]} moon ${n}`
  if (kind === 'bridge') return `${key!.split('-').map((e) => EFFECT_LABEL[e as ItemEffect]).join(' + ')} bridge ${n}`
  return `Sun ${key}`
}
/** What one node gives: its grade's worth (D141), e.g. "+7 ATK" for ATK moon 7. */
export function nodeValue(id: string): string {
  const points = starPoints([id])
  return ITEM_EFFECTS.filter((e) => points[e] > 0).map((e) => `${pointText(e, points[e])}${e === 'speed' || e === 'limit' ? '' : ` ${PLANET_SHORT[e]}`}`).join(', ')
}
export function pointText(e: ItemEffect, p: number): string {
  if (e === 'speed') return `${(p * POINT_EVASION * 100).toFixed(1)}% evasion`
  if (e === 'limit') return `+${Math.floor(p * POINT_LIMIT)} Limit start`
  return `+${Math.round(p * (e === 'hp' ? POINT_HP : 1) * 10) / 10}`
}
