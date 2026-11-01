// The Uma profile's wording list (D258, H117–H119; proposal C1–C10 / UP25–UP27).
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
/** C7: the class tile while a promotion waits. */
export const promoteRank = (value: number): string => `${classRank(value)} · Promote`
export const waitingExp = (value: number): string => `+${n(value)} EXP waiting`
/** C8/C9: Craft Level. */
export const craftLevel = (value: number): string => `Craft ${n(value)}`

export type GateKind = 'level' | 'rank' | 'craft'
/** C9: a level, rank or craft gate. */
export const gate = (kind: GateKind, value: number): string => kind === 'level' ? level(value) : kind === 'rank' ? classRank(value) : craftLevel(value)
/** C9: a gate in a sheet. */
export const opens = (value: string): string => `Opens · ${value}`
/** C9: an ordered map-node gate. */
export const nodeGate = (node: string): string => `${node} first`

/** C8: a grade, a raise, or the maximum. */
export const grade = (value: number): string => `G${value}`
export const gradeStep = (from: number, to: number): string => `${grade(from)} → ${grade(to)}`
export const maxGrade = (): string => 'G10 · Max'
/** C8: a number before and after a change. */
export const valueStep = (label: string, from: number | string, to: number | string): string =>
  `${label} ${typeof from === 'number' ? n(from) : from} → ${typeof to === 'number' ? n(to) : to}`
/** C8: an accessory's effect before and after a raise; the label once when they share it ("ATK +7 → +9"). */
export function effectStep(from: string, to: string): string {
  const label = from.slice(0, from.lastIndexOf(' '))
  return from !== 'Off' && to.startsWith(`${label} `) ? `${from} → ${to.slice(label.length + 1)}` : `${from} → ${to}`
}
/** C1: Raise all's line for a slot: the first item in full, later grades by their grade alone. */
export function raiseLine(slot: string, from: number, to: number, items: readonly string[]): string {
  const cost = items.map((item, i) => (i === 0 ? itemCount(item, 1) : itemCount(item.slice(item.lastIndexOf(' ') + 1), 1)))
  return [`${slot} ${gradeStep(from, to)}`, ...cost].join(' · ')
}
/** C1: how many made items a Raise all spends. */
export const usesItems = (count: number): string => `Uses ${n(count)} item${count === 1 ? '' : 's'}`
/** C7: Gear's first row: her armor's half and what's ready. */
export const gearSummary = (half: 'physical' | 'magical', ready: number): string => `${armorHalf(half)}${ready ? ` · ${n(ready)} ready` : ''}`
/** C1: a weapon's Might. */
export const might = (value: number): string => `Might ${n(value)}`
/** C1: an armor stat and its value. */
export const armorStat = (stat: string, value: number | string): string => `${stat} ${typeof value === 'number' ? n(value) : value}`
export const armorHalf = (half: 'physical' | 'magical'): string => half === 'physical' ? 'Physical' : 'Magical'
/** C10: a selected kind the Uma no longer holds. */
export const staleKind = (weapon: string): string => `${weapon} not held`

export type MoonState = 'Open' | 'With its moons' | `Lv ${number}`
/** C1/C7: one of her two moon rows. */
export const moonNode = (roman: 'I' | 'II', stat: string, state: MoonState): string => `★ Moon ${roman} · ${stat} · ${state}`
/** C1: opened Extra Stats nodes. */
export const extraStatsCount = (open: number, total = 22): string => `Open ${n(open)}/${n(total)}`
/** C1: a count with what's ready: the Observatory's rows. */
export const extraStatsRow = (open: number, ready: number): string => `${extraStatsCount(open)}${ready ? ` · ${n(ready)} ready` : ''}`
/** C1: the Stars tab's first row. */
export const extraStats = (open: number, ready: number): string => `Extra Stats · ${extraStatsRow(open, ready)}`
/** C1: Set all's line. */
export const setLine = (jewel: string, node: string, value: string): string => `${jewel} → ${node} · ${value}`

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
/** C7: her calling, as the Template tab reads it. */
export const calling = (name: string): string => `Calling · ${name} · fixed`
export const callingOnUnlock = (name: string): string => `Calling on unlock · ${name}`
/** C7: what a Flourish works as, and how it stands now. */
export const worksAs = (names: readonly string[]): string => `Works as · ${names.join(', ')}`
export const flourishNow = (on: boolean, name: string): string => (on ? 'Now · On' : `Now · ${offAs(name)}`)
/** C7: a ★ piece's state outside her family. */
export const offAs = (name: string): string => `Off · as ${name}`
/** C9: her signature's first gate. */
export const signatureFirst = 'G1 first'
/** C1: a locked Uma's number, at the level it's read. */
export const atLevel = (value: string, at: number): string => `${value} · ${level(at)}`
/** C1: her growth rates that aren't 0. */
export const growth = (rates: readonly { stat: string; percent: number }[]): string => rates.map(({ stat, percent }) => `${stat} +${n(percent)}%`).join(' · ')
/** C7: the racing skill's row. */
export const racingSkill = 'Racing skill'
/** C3: a trade. */
export const trade = (place: string, maker: string): string => `${place} · ${maker}`
/** C7: the three compact profile facts. */
export const profileFacts = { party: 'Party', work: 'Work', details: 'Details' } as const
/** C7: party state. */
export const party = (value: number | 'fighting' | null): string => value === null ? 'No party' : value === 'fighting' ? 'Fighting' : `Party ${n(value)}`
/** C7: work state. */
export const work = (place: string | null, state?: string | 'done'): string => !place ? 'Idle' : `${place} · ${state === 'done' ? 'Done' : state ?? ''}`.replace(/ · $/, '')
/** C7: Details' two pages and their sections (H140). */
export const details = { title: 'Details', all: 'All stats', back: '‹ Details', damage: 'Damage', stats: 'Stats' } as const
/** C7: where a stat's points come from, each with its color in Details (H140). */
export type StatSource = 'base' | 'armor' | 'accessory' | 'stars' | 'moon'
export interface StatPart { source: StatSource; text: string }
/** C7: a stat's parts in order, zero parts dropped. Armor and accessory apart, since "gear" hid armor (PP14). */
export function statPartList(base: number, armor = 0, accessory = 0, stars = 0, moon = 0): StatPart[] {
  const parts: [StatSource, number, string][] = [['base', base, `base ${n(base)}`], ['armor', armor, `armor ${n(armor)}`],
    ['accessory', accessory, `accessory ${n(accessory)}`], ['stars', stars, `Stars ${n(stars)}`], ['moon', moon, `★ ${n(moon)}`]]
  return parts.filter(([, value]) => value).map(([source, , text]) => ({ source, text }))
}
/** C7: her Insignias on Details' Damage. */
export const bosses = (percent: number): string => `Bosses +${n(percent)}%`
/** C7: the sources in Details' key. */
export const damageKey = { might: 'Might', accessory: 'Accessory', star: '★ Signature' } as const
/** C7: a damage row for a screen reader: "Fire 86: M.ATK 70, Might 8, Accessory 6, Signature 2". */
export const damageLabel = (kind: string, total: number, stat: string, base: number, might: number, orb: number, signature: number): string =>
  `${kind} ${n(total)}: ${[`${stat} ${n(base)}`, might ? `Might ${n(might)}` : '', orb ? `Accessory ${n(orb)}` : '', signature ? `Signature ${n(signature)}` : ''].filter(Boolean).join(', ')}`
/** C7: a core stat's base and growth. */
export const coreSource = (base: number, growth: number): string => `${n(base)}${growth ? ` · +${n(growth)}%` : ''}`
/** C7: the open grade and its next Craft gate. */
export const gradeGate = (open: number, next?: { grade: number; craft: number } | null): string =>
  `${grade(open)} open${next ? ` · ${grade(next.grade)} at ${craftLevel(next.craft)}` : ''}`
/** C7: the collapsed Details formula's lines. */
export const statFormulaLines = [
  'Core · base/5 + levels × 1.5 × (1 + growth)',
  'HP · class × (100 + 5 Stamina + 2 Power + Guts)',
  'MP · class × (20 + 1.5 Wit)',
  'ATK/M.ATK · Speed × class',
  'DEF · Power × class',
  'M.DEF · (Power + Wit)/2 × class',
  'Totals · core + gear + Stars + moon',
  'Damage · stat + Might + Orb + ★',
  'Hit · damage²/(damage + DEF) × skill',
] as const
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
/** C7: a Bond's EXP toward its next level. */
export const bondNext = (value: number, of: number): string => `Next · ${n(value)}/${n(of)}`
/** C7: the Hero a Learner borrows from. */
export const heroName = (name: string): string => `Hero · ${name}`
export type LimitLine = { kind: 'none' } | { kind: 'hero'; name: string; more?: boolean } | { kind: 'learner'; name: string; bond: number; more: boolean }
/** C7: the Class tab's Limit line, the Limit Break Auto fires; ` · +1` for a second one. */
export function limitLine(value: LimitLine): string {
  if (value.kind === 'none') return 'None'
  const line = value.kind === 'hero' ? `${value.name} · Hero` : `${value.name} · Learner · ${bondLevel(value.bond)}`
  return value.more ? `${line} · +1` : line
}
/** C7: a seat, by its hall and number. */
export const limitSeat = (role: 'Hero' | 'Learner', hall: string, seat: number): string => `${role} · ${hall} · Seat ${n(seat)}`
/** C1: a Limit Break's power, and her class's scale when it isn't 1. */
export const limitPower = (power: number, scale?: { value: number; name: string } | null): string =>
  `×${+power.toFixed(2)}${scale ? ` · ×${+scale.value.toFixed(2)} as ${scale.name}` : ''}`
/** C1: a weapon slot's sheet: "Slot 3 · Arms", a Tier 0's "Slot 3 · Any". */
export const weaponSlot = (slot: number, kind: 'arms' | 'tome' | 'any'): string =>
  `Slot ${n(slot)} · ${kind === 'arms' ? 'Arms' : kind === 'tome' ? 'Tome' : 'Any'}`
/** C3/C8: a class's two-part hand. */
export const hand = (arms: number, tome: number): string => `Hand${arms ? ` · Arms ×${+arms.toFixed(2)}` : ''}${tome ? ` · Tome ×${+tome.toFixed(2)}` : ''}`
/** C7: the standard class preset. */
export const standardPreset = (on = false): string => `Standard preset${on ? ' · On' : ''}`
/** C7: one of a Tier 0's presets, by the class it leads to (D263). */
export const classPresetName = (name: string, on = false): string => `${name}${on ? ' · On' : ''}`

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
  promoteTo: (name: string) => `Promote to ${name}`,
  startClass: (name: string) => `Start ${name} · R1`,
  unlock: 'Unlock · 1 Ticket',
  open: (place: string) => `Open ${place}`,
} as const

/** Grade-sheet slot labels that are data rather than prose. */
export const armorSlot = (slot: ArmorSlot): string => ({ head: 'Head', body: 'Body', legs: 'Legs', arms: 'Arms', feet: 'Feet' })[slot]
/** Re-exported type anchors keep the wording module's public surface explicit for later profile packets. */
export type CopyAccessory = { family: AccessoryFamily; tier: GearTier; kind?: RpgDamageKind; flourish?: RpgFlourish }
