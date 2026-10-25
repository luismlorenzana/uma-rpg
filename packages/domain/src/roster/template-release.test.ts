// The template rule against the local master-data release (H67, D203): its words never equal a master-data skill name,
// and the release's aggregate counts match uma-templates §2.4. It runs only where the release is on disk (uma-platform
// checked out beside this repo, or `MASTER_DIR` pointing at a release), so CI skips it. It prints counts only, never a
// name: nothing from the original games reaches git or a log.
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import type { Character, LocalText, Outfit } from '@luismlorenzana/uma-data'
import { describe, expect, it } from 'vitest'
import { buildRoster, type RosterOutfit } from '../master/roster'
import {
  FLOURISH_NAMES, UMA_FAMILIES, UMA_KNACK_WORDS, UMA_KNACKS, UMA_STRIDES, UMA_TYPE_NAMES, umaCallingPick, umaTemplate, type UmaCallingRow,
} from './template'

const ROOT = join(__dirname, '..', '..', '..', '..')
const RELEASE = process.env.MASTER_DIR ? resolve(process.env.MASTER_DIR) : join(ROOT, '..', 'uma-platform', 'content', 'release')
const HAS_RELEASE = existsSync(join(RELEASE, 'data')) && existsSync(join(RELEASE, 'manifest.json'))

function load<T>(set: string): T[] {
  const manifest = JSON.parse(readFileSync(join(RELEASE, 'manifest.json'), 'utf8')) as { sets: Record<string, string> }
  const path = manifest.sets[set]
  if (!path) throw new Error(`the release has no ${set}`)
  return (JSON.parse(readFileSync(join(RELEASE, path), 'utf8')) as { items: T[] }).items
}
const tally = <K extends string>(keys: readonly K[]): Record<K, number> => Object.fromEntries(keys.map((k) => [k, 0])) as Record<K, number>

describe.skipIf(!HAS_RELEASE)('the template against the local master-data release (H67)', () => {
  const roster: RosterOutfit[] = HAS_RELEASE ? buildRoster({ characters: load<Character>('characters'), outfits: load<Outfit>('outfits') }) : []

  it('uses no master-data skill name for a type, a knack word, a template or a Flourish', () => {
    const skills = load<{ name: LocalText }>('skills')
    const taken = new Set(skills.flatMap((s) => [s.name.ja, s.name.en, s.name.global]).filter((n): n is string => !!n).map((n) => n.trim().toLowerCase()))
    const types = Object.values(UMA_TYPE_NAMES).flatMap((t) => Object.values(t))
    const words = Object.values(UMA_KNACK_WORDS)
    const ours = [...types, ...words, ...types.flatMap((t) => words.map((w) => `${w} ${t}`)), ...Object.values(FLOURISH_NAMES)]
    expect(ours).toHaveLength(18 + 5 + 90 + 3)
    const clashes = ours.filter((n) => taken.has(n.toLowerCase()))
    console.log(`template names checked: ${ours.length} against ${taken.size} skill names; clashes: ${clashes.length}`)
    expect(clashes.length, 'a template word equals a master-data skill name').toBe(0)
  })

  it('matches uma-templates §2.4’s counts', () => {
    const rows = tally<`${UmaCallingRow}`>(['1', '2', '3', '4', '5', '6', '7', '8'])
    const fight = { physical: 0, 'physical hybrid': 0, magical: 0, 'magical hybrid': 0, healer: 0 }
    const strides = tally(UMA_STRIDES), knacks = tally(UMA_KNACKS), families = tally(UMA_FAMILIES)
    const types = new Map(Object.values(UMA_TYPE_NAMES).flatMap((t) => Object.values(t)).map((t) => [t, 0]))
    const names = new Map<string, number>()
    let picks = 0, pace = 0, late = 0
    for (const outfit of roster) {
      const t = umaTemplate(outfit)
      rows[`${t.row}`] += 1
      fight[({ brawler: 'physical', spellblade: 'physical hybrid', mage: 'magical', summoner: 'magical hybrid', paladin: 'healer', cleric: 'healer' } as const)[t.calling]] += 1
      strides[t.stride] += 1
      knacks[t.knack] += 1
      families[t.family] += 1
      types.set(t.type, (types.get(t.type) ?? 0) + 1)
      names.set(t.name, (names.get(t.name) ?? 0) + 1)
      const pick = umaCallingPick(outfit)
      if (pick) { picks += 1; if (pick.options.includes('mage')) pace += 1; else late += 1 }
    }
    const sizes = [...names.values()].sort((a, b) => a - b)
    const counts = {
      outfits: roster.length, rows: Object.values(rows), fight: Object.values(fight), picks: [picks, pace, late],
      templates: names.size, largest: sizes.at(-1), median: sizes[Math.floor(sizes.length / 2)], single: sizes.filter((n) => n === 1).length,
      types: [...types.values()], strides: Object.values(strides), knacks: Object.values(knacks), families: Object.values(families),
    }
    console.log(`template counts: ${JSON.stringify(counts)}`)
    expect(counts).toEqual({
      outfits: 270, rows: [47, 33, 13, 14, 56, 46, 48, 13], fight: [61, 56, 46, 46, 61], picks: [163, 102, 61],
      templates: 66, largest: 14, median: 3, single: 18,
      // By calling (Brawler, Spell Blade, Mage, Summoner, Paladin, Cleric), Dash · Middle · Stayer: 16 of the 18 in use.
      types: [26, 20, 15, 9, 28, 19, 0, 25, 21, 3, 20, 23, 10, 21, 17, 0, 4, 9],
      strides: [48, 118, 104], knacks: [69, 69, 48, 43, 41], families: [48, 69, 69, 84],
    })
  })
})
