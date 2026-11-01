// Details' first page (H140; profile-polish §2, PP3–PP12): each weapon's row, the key, the stat lines and the tiles. Pure, on
// `umaDamageSheet` and the battle sheet, so a rule change shows here and no number has a second formula.
import type { DamageSheet, OffenseStat, RpgDamageKind, SheetGroup } from '@rpg/domain'
import { kindLabel } from '../../battle/labels'
import type { StatMarkId } from '../observatory/star-marks'
import { damageKey, damageLabel, statPartList, type StatPart } from './copy'

/** The colors of Details' sources (`--src-*`, `index.css`). */
export const SOURCE_COLOR = {
  ATK: 'var(--src-atk)', 'M.ATK': 'var(--src-matk)', might: 'var(--src-might)', accessory: 'var(--src-accessory)', star: 'var(--src-star)',
} as const
export type DamageSource = keyof typeof SOURCE_COLOR
export const PART_COLOR: Readonly<Record<StatPart['source'], string | undefined>> = {
  base: undefined, armor: SOURCE_COLOR.might, accessory: SOURCE_COLOR.accessory, stars: 'var(--src-stars)', moon: SOURCE_COLOR.star,
}

/** One number in a row's parentheses, with its share of the strip. */
export interface DamagePart { source: DamageSource; value: number; text: string }
export interface DamageRow { kind: RpgDamageKind; total: number; parts: DamagePart[]; width: number; label: string }

/** Her three rows: the stat always, then Might, her Orbs and her signature, zero parts dropped. `width` is the row's share of her
 * largest, so the three compare. */
export function damageRows(sheet: DamageSheet): DamageRow[] {
  const top = Math.max(1, ...sheet.weapons.map((row) => row.total))
  return sheet.weapons.map((row) => {
    const rest: [DamageSource, number][] = [['might', row.might], ['accessory', row.orb], ['star', row.signature]]
    const parts = [{ source: row.stat, value: row.base, text: String(row.base) },
      ...rest.filter(([, value]) => value).map(([source, value]) => ({ source, value, text: `+${value}` }))]
    return { kind: row.kind, total: row.total, parts, width: row.total / top,
      label: damageLabel(kindLabel(row.kind), row.total, row.stat, row.base, row.might, row.orb, row.signature) }
  })
}

/** The key: each stat she uses, then Might, Accessory and ★ Signature. */
export const damageKeyRows = (sheet: DamageSheet): { source: DamageSource; label: string }[] => [
  ...sheet.stats.map((stat) => ({ source: stat.label, label: stat.label })),
  { source: 'might', label: damageKey.might }, { source: 'accessory', label: damageKey.accessory }, { source: 'star', label: damageKey.star },
]

/** A stat's parts for the line under the rows: `M.ATK 70 · base 52 · armor 10 · accessory 3 · Stars 5`. */
export const offenseParts = (stat: OffenseStat): StatPart[] => statPartList(stat.base, stat.armor, stat.accessory, stat.stars, stat.moon)

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
