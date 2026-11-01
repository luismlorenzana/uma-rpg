// H140: Details' rows, key, tiles and colors.
import type { DamageSheet, SheetGroup } from '@rpg/domain'
import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { damageKeyRows, damageRows, statTiles } from './damage-view'

const SORCERER: DamageSheet = {
  weapons: [
    { weapon: 'tome-fire', kind: 'fire', stat: 'M.ATK', total: 86, base: 52, might: 8, accessory: 9, orb: 6, armor: 10, stars: 5, moon: 0, signature: 2 },
    { weapon: 'tome-ice', kind: 'ice', stat: 'M.ATK', total: 80, base: 52, might: 8, accessory: 3, orb: 0, armor: 10, stars: 5, moon: 0, signature: 2 },
    { weapon: 'tome-lightning', kind: 'lightning', stat: 'M.ATK', total: 52, base: 52, might: 0, accessory: 0, orb: 0, armor: 0, stars: 0, moon: 0, signature: 0 },
  ],
  bosses: 3,
}

describe('damageRows (D279)', () => {
  it('reads every source, from her base, in the owner’s order, zero parts dropped', () => {
    const [fire, ice, thunder] = damageRows(SORCERER)
    expect(fire!.parts.map((part) => part.text)).toEqual(['52', '+8', '+9', '+10', '+5', '+2'])
    expect(fire!.parts.map((part) => part.source)).toEqual(['M.ATK', 'might', 'accessory', 'armor', 'stars', 'star'])
    expect(ice!.parts.map((part) => part.text)).toEqual(['52', '+8', '+3', '+10', '+5', '+2'])
    expect(thunder!.parts.map((part) => part.text)).toEqual(['52'])
  })

  it('adds each row’s parts up to its total, and scales the strips to her largest row', () => {
    const rows = damageRows(SORCERER)
    for (const row of rows) expect(row.parts.reduce((sum, part) => sum + part.value, 0)).toBe(row.total)
    expect(rows.map((row) => row.width)).toEqual([1, 80 / 86, 52 / 86])
  })

  it('counts her moon in ★, if it ever gives offense', () => {
    const row = { ...SORCERER.weapons[0]!, moon: 3, signature: 2, total: 89 }
    expect(damageRows({ ...SORCERER, weapons: [row] })[0]!.parts.at(-1)).toEqual({ source: 'star', value: 5, text: '+5' })
  })

  it('labels a row for a screen reader', () => {
    expect(damageRows(SORCERER)[0]!.label).toBe('Fire 86: M.ATK base 52, Might 8, Accessory 9, Armor 10, Stars 5, ★ Signature 2')
  })

  it('survives a row of nothing', () => {
    const empty: DamageSheet = { ...SORCERER, weapons: [{ ...SORCERER.weapons[2]!, total: 0, base: 0 }] }
    expect(damageRows(empty)[0]).toMatchObject({ width: 0, parts: [{ source: 'M.ATK', text: '0' }] })
  })
})

describe('the key', () => {
  it('names each base she uses, then every source', () => {
    expect(damageKeyRows(SORCERER).map((row) => row.label)).toEqual(['M.ATK base', 'Might', 'Accessory', 'Armor', 'Stars', '★ Signature'])
    const hybrid = { ...SORCERER, weapons: [{ ...SORCERER.weapons[0]!, stat: 'ATK' as const }, SORCERER.weapons[1]!] }
    expect(damageKeyRows(hybrid).map((row) => row.label).slice(0, 2)).toEqual(['ATK base', 'M.ATK base'])
  })
})

describe('statTiles', () => {
  const groups = (extra: SheetGroup['rows'] = []): SheetGroup[] => [
    { title: 'Defense', rows: [{ label: 'DEF', value: '65' }, { label: 'M.DEF', value: '64' }, { label: 'Evasion', value: '3.6%' }] },
    { title: 'Sustain', rows: [{ label: 'HP', value: '1140' }, ...extra, { label: 'MP', value: '103', note: '+1/round' }] },
  ]

  it('shows her five final numbers, in order', () => {
    expect(statTiles(groups())).toEqual([{ label: 'HP', value: '1,140', mark: 'hp' }, { label: 'MP', value: '103', mark: 'mp' }, { label: 'DEF', value: '65', mark: 'def' },
      { label: 'M.DEF', value: '64', mark: 'mdef' }, { label: 'Evasion', value: '3.6%', mark: 'evasion' }])
  })

  it('adds a healer’s Mends, its number alone', () => {
    expect(statTiles(groups([{ label: 'Mends', value: '×1.43 (from ATK)' }])).at(-1)).toEqual({ label: 'Mends', value: '×1.43' })
  })
})

describe('the sources’ colors (H140)', () => {
  const css = fs.readFileSync(path.resolve(__dirname, '../../index.css'), 'utf8')
  const tokens = (block: string) => Object.fromEntries([...block.matchAll(/--src-([a-z]+): (#[0-9a-f]{6})/g)].map((m) => [m[1]!, m[2]!]))
  const blockAfter = (head: string) => css.slice(css.indexOf(head), css.indexOf('}', css.indexOf(head)))
  const light = tokens(blockAfter(':root {'))
  const dark = tokens(blockAfter("[data-theme='dark'] {"))
  const luminance = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
  }
  const contrast = (a: string, b: string) => {
    const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x)
    return (high! + 0.05) / (low! + 0.05)
  }

  it('defines all seven in both themes, the same in dark’s two blocks', () => {
    const names = ['accessory', 'armor', 'atk', 'matk', 'might', 'star', 'stars']
    expect(Object.keys(light).sort()).toEqual(names)
    expect(Object.keys(dark).sort()).toEqual(names)
    expect(tokens(blockAfter(":root:not([data-theme='light']) {"))).toEqual(dark)
  })

  it('reads at 4.5:1 or better on a panel and a raised card, in both themes', () => {
    for (const [name, color] of Object.entries(light)) for (const surface of ['#ffffff', '#f3f6fa']) expect(contrast(color, surface), `light ${name} on ${surface}`).toBeGreaterThanOrEqual(4.5)
    for (const [name, color] of Object.entries(dark)) for (const surface of ['#17202b', '#1f2a37']) expect(contrast(color, surface), `dark ${name} on ${surface}`).toBeGreaterThanOrEqual(4.5)
  })
})
