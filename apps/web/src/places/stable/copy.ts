// The Uma profile's wording list (D258, H117; proposal C1–C10 / UP25–UP27).
// Every fact printed by today's profile enters here first. Screens split a returned line into cells when useful,
// but never invent a second wording. Rules and confirms remain in HelpButton or confirmation sheets.
import type { AccessoryFamily, ArmorSlot, GearTier, RpgBranch, RpgDamageKind, RpgFlourish } from '@rpg/domain'

export { accessoryEffect, flourish, limitStart, mp, signature } from '@rpg/domain'

const n = (value: number): string => value.toLocaleString('en-US')

/** C8: Uma Level. */
export const level = (value: number): string => `Lv ${n(value)}`
/** C8: current/next EXP, or banked EXP at max. */
export const exp = (value: number, next: number | null): string => next === null ? `Max · ${n(value)} EXP` : `${n(value)}/${n(next)}`
/** C8/C9: Class Rank. The expanded wording belongs only in aria labels. */
export const classRank = (value: number): string => `R${n(value)}`
export const tier0Rank = (value: number): string => `${classRank(value)}/10`
export const waitingExp = (value: number): string => `+${n(value)} EXP waiting`
/** C8/C9: Craft Level. */
export const craftLevel = (value: number): string => `Craft ${n(value)}`

export type GateKind = 'level' | 'rank' | 'craft'
/** C9: a level, rank or craft gate. */
export const gate = (kind: GateKind, value: number): string => kind === 'level' ? level(value) : kind === 'rank' ? classRank(value) : craftLevel(value)
/** C9: an ordered map-node gate. */
export const nodeGate = (node: string): string => `${node} first`

/** C8: a grade, a raise, or the maximum. */
export const grade = (value: number): string => `G${value}`
export const gradeStep = (from: number, to: number): string => `${grade(from)} → ${grade(to)}`
export const maxGrade = (): string => 'G10 · Max'
/** C1: a weapon's Might. */
export const might = (value: number): string => `Might ${n(value)}`
/** C1: an armor stat and its value. */
export const armorStat = (stat: string, value: number | string): string => `${stat} ${typeof value === 'number' ? n(value) : value}`
export const armorHalf = (half: 'physical' | 'magical'): string => half === 'physical' ? 'Physical' : 'Magical'
/** C10: a selected kind the Uma no longer holds. */
export const staleKind = (weapon: string): string => `${weapon} not held`

export type MoonState = 'Open' | 'Ready' | `Lv ${number}`
/** C1/C7: one of her two moon rows. */
export const moonNode = (roman: 'I' | 'II', stat: string, state: MoonState): string => `★ Moon ${roman} · ${stat} · ${state}`
/** C1: opened Extra Stats nodes. */
export const extraStatsCount = (open: number, total = 22): string => `Open ${n(open)}/${n(total)}`

export type NodeValue =
  | { kind: 'planet'; value: number }
  | { kind: 'prowess'; stat: 'ATK' | 'M.ATK'; value: number }
  | { kind: 'vigor'; hp: number; mp: number }
  | { kind: 'guard'; value: number }
  | { kind: 'stat'; stat: string; value: number | string }
/** C1: one map node's value. */
export function nodeValue(value: NodeValue): string {
  if (value.kind === 'planet') return `+${n(value.value)} · all six`
  if (value.kind === 'prowess') return `${value.stat} +${n(value.value)}`
  if (value.kind === 'vigor') return `HP +${n(value.hp)} · MP +${n(value.mp)}`
  if (value.kind === 'guard') return `DEF/M.DEF +${n(value.value)}`
  return `${value.stat} +${typeof value.value === 'number' ? n(value.value) : value.value}`
}

/** C1/C8: an item, its cost and optional stock. */
export const itemCount = (item: string, count: number, held?: number): string =>
  `${item} ×${n(count)}${held === undefined ? '' : ` · ${n(held)} held`}`
/** C3: a template reading and its source. */
export const reading = (value: string, source: string): string => `${value} · ${source === 'Picked' ? 'Picked' : `from ${source}`}`
/** C3: a trade. */
export const trade = (place: string, maker: string): string => `${place} · ${maker}`
/** C7: party state. */
export const party = (value: number | 'fighting' | null): string => value === null ? 'No party' : value === 'fighting' ? 'Fighting' : `Party ${n(value)}`
/** C7: work state. */
export const work = (place: string | null, state?: string | 'done'): string => !place ? 'Idle' : `${place} · ${state === 'done' ? 'Done' : state ?? ''}`.replace(/ · $/, '')
/** C7: equipped skills. */
export const equipped = (value: number, slots: number): string => `Equipped ${n(value)}/${n(slots)}`
/** C7: one weapon tree line. */
export const line = (value: RpgBranch, name?: string): string => `Line ${value}${name ? ` · ${name}` : ''}`
/** C8/C9: a Skill Rank and its next gate. */
export const skillRank = (value: number, next?: number | null): string => next == null ? `Rank ${n(value)}` : `Rank ${n(value)} · next ${classRank(next)}`
/** C1: tree depth and path. */
export const depth = (value: number, path: RpgBranch | 'trunk'): string => `Depth ${n(value)} · ${path === 'trunk' ? 'Trunk' : line(path)}`
/** C1/C8: an inherited Bond. */
export const bond = (value: number, percent: number): string => `Bond ${n(value)}/10 · Strength ${n(percent)}%`
export const bondLevel = (value: number): string => `Bond ${n(value)}/10`
export const heroBond = (): string => 'Hero · Strength 100%'
/** C3/C8: a class's two-part hand. */
export const hand = (arms: number, tome: number): string => `Hand${arms ? ` · Arms ×${+arms.toFixed(2)}` : ''}${tome ? ` · Tome ×${+tome.toFixed(2)}` : ''}`
/** C7: the standard class preset. */
export const standardPreset = (on = false): string => `Standard preset${on ? ' · On' : ''}`

export type UnlockState = { kind: 'ticket' } | { kind: 'tier'; tier: number } | { kind: 'tier-one' } | { kind: 'pick'; a: string; b: string }
/** C7/C9: the four unlock wordings. */
export function unlock(value: UnlockState): string {
  if (value.kind === 'ticket') return 'Unlock · 1 Ticket'
  if (value.kind === 'tier') return `In Tier ${n(value.tier)}`
  if (value.kind === 'tier-one') return 'Unlock in Tier 1'
  return `Pick on unlock · ${value.a} or ${value.b}`
}

/** The profile's action vocabulary (UP25). */
export const actions = {
  raiseTo: (value: number) => `Raise to ${grade(value)}`,
  raiseAll: 'Raise all',
  raise: (count: number) => `Raise ${n(count)}`,
  set: 'Set', setAll: 'Set all', setCount: (count: number) => `Set ${n(count)}`,
  equip: 'Equip', unequip: 'Unequip', replace: 'Replace',
  takeLine: (value: RpgBranch) => `Take line ${value}`,
  auto: 'Auto', standardPreset: 'Standard preset', confirm: 'Confirm', confirmOnce: 'Confirm once',
  fightAs: (name: string) => `Fight as ${name}`,
  unlock: 'Unlock · 1 Ticket',
  open: (place: string) => `Open ${place}`,
} as const

/** Interim H117 chip; H120 removes it. The full Flourish fact stays in `flourish`. */
export const flourishChip = (value: RpgFlourish, on: boolean): string => {
  const name = value === 'clean-break' ? 'Clean break' : value === 'even-pace' ? 'Even pace' : 'Late reserve'
  return `★ ${name} · ${on ? 'On' : 'Off'}`
}

/** Grade-sheet slot labels that are data rather than prose. */
export const armorSlot = (slot: ArmorSlot): string => ({ head: 'Head', body: 'Body', legs: 'Legs', arms: 'Arms', feet: 'Feet' })[slot]
/** Re-exported type anchors keep the wording module's public surface explicit for later profile packets. */
export type CopyAccessory = { family: AccessoryFamily; tier: GearTier; kind?: RpgDamageKind; flourish?: RpgFlourish }
