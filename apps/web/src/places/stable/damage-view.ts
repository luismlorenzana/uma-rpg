// Details' first page (H140, D279; profile-polish §2): each weapon's row, every source on it, the key and the tiles. Pure, on
// `umaDamageSheet` and the battle sheet, so a rule change shows here and no number has a second formula.
import type { DamageSheet, RpgDamageKind, SheetGroup, WeaponDamage } from '@rpg/domain'
import { kindLabel } from '../../battle/labels'
import type { StatMarkId } from '../observatory/star-marks'
import { damageKey, damageLabel, type StatPart } from './copy'

/** The colors of Details' sources (`--src-*`, `index.css`). */
export const SOURCE_COLOR = {
  ATK: 'var(--src-atk)', 'M.ATK': 'var(--src-matk)', might: 'var(--src-might)', accessory: 'var(--src-accessory)', armor: 'var(--src-armor)',
  stars: 'var(--src-stars)', star: 'var(--src-star)',
} as const
export type DamageSource = keyof typeof SOURCE_COLOR
export const PART_COLOR: Readonly<Record<StatPart['source'], string | undefined>> = {
  base: undefined, armor: SOURCE_COLOR.armor, accessory: SOURCE_COLOR.accessory, stars: SOURCE_COLOR.stars, moon: SOURCE_COLOR.star,
}

/** One number in a row's parentheses, with its share of the strip. */
export interface DamagePart { source: DamageSource; value: number; text: string }
export interface DamageRow { kind: RpgDamageKind; total: number; parts: DamagePart[]; width: number; label: string }

/** A row's sources after her base, in the owner's order: the weapon's, her accessories', then the rest. */
const sources = (row: WeaponDamage): [Exclude<DamageSource, 'ATK' | 'M.ATK'>, string, number][] => [
  ['might', damageKey.might, row.might], ['accessory', damageKey.accessory, row.accessory], ['armor', damageKey.armor, row.armor],
  ['stars', damageKey.stars, row.stars], ['star', damageKey.star, row.signature + row.moon],
]

/** Her three rows: her base always, then every source, zero parts dropped. `width` is the row's share of her largest, so the three
 * compare. */
export function damageRows(sheet: DamageSheet): DamageRow[] {
  const top = Math.max(1, ...sheet.weapons.map((row) => row.total))
  return sheet.weapons.map((row) => {
    const rest = sources(row).filter(([, , value]) => value)
    return {
      kind: row.kind, total: row.total, width: row.total / top,
      parts: [{ source: row.stat, value: row.base, text: String(row.base) }, ...rest.map(([source, , value]) => ({ source, value, text: `+${value}` }))],
      label: damageLabel(kindLabel(row.kind), row.total, [{ name: damageKey.base(row.stat), value: row.base }, ...rest.map(([, name, value]) => ({ name, value }))]),
    }
  })
}

/** The key: each stat's base she uses, ATK first, then every other source. */
export const damageKeyRows = (sheet: DamageSheet): { source: DamageSource; label: string }[] => [
  ...(['ATK', 'M.ATK'] as const).filter((stat) => sheet.weapons.some((row) => row.stat === stat)).map((stat) => ({ source: stat, label: damageKey.base(stat) })),
  { source: 'might', label: damageKey.might }, { source: 'accessory', label: damageKey.accessory }, { source: 'armor', label: damageKey.armor },
  { source: 'stars', label: damageKey.stars }, { source: 'star', label: damageKey.star },
]

const TILES: readonly (readonly [string, StatMarkId])[] = [['HP', 'hp'], ['MP', 'mp'], ['DEF', 'def'], ['M.DEF', 'mdef'], ['Evasion', 'evasion']]

/** The Stats tiles: final numbers only, and a healer's Mends (PP12). */
export function statTiles(groups: readonly SheetGroup[]): { label: string; value: string; mark?: StatMarkId }[] {
  const rows = new Map(groups.flatMap((group) => group.rows).map((row) => [row.label, row.value]))
  const shown = (value: string) => (/^\d+$/.test(value) ? Number(value).toLocaleString('en-US') : value)
  const tiles = TILES.flatMap(([label, mark]) => {
    const value = rows.get(label)
    return value === undefined ? [] : [{ label, value: shown(value), mark }]
  })
  const mends = rows.get('Mends')
  return mends ? [...tiles, { label: 'Mends', value: mends.split(' ')[0]! }] : tiles
}
