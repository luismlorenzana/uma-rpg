// The template rule against the local master-data release (H67, D203): its words never equal a master-data skill name,
// and the release's aggregate counts match uma-templates §2.4. It runs only where the release is on disk (uma-platform
// checked out beside this repo, or `MASTER_DIR` pointing at a release), so CI skips it. It prints counts only, never a
// name: nothing from the original games reaches git or a log. Classes v3 (engine v19, H126) adds a block: the calling by
// running style, its combinations and types by stride, and none of its new words equal to a master-data string.
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import type { Character, LocalText, Outfit } from '@luismlorenzana/uma-data'
import { describe, expect, it } from 'vitest'
import { buildRoster, type RosterOutfit } from '../master/roster'
import { RPG_ALL_NODES, RPG_TOMEBLADE_DEPTHS, RPG_TOMEBLADE_SPELLS } from '../rpg/catalog'
import { RPG_ROOT_NAME, RPG_TIER0_SKILL, rpgClassName } from '../rpg/class-tree'
import { heroLimitFor, heroLimitIds } from '../rpg/heroes'
import { RPG_TIER0_CLASSES, rpgClasses, type RpgV2Class } from '../rpg/kinds'
import {
  FLOURISH_NAMES, UMA_FAMILIES, UMA_KNACK_WORDS, UMA_KNACKS, UMA_STRIDES, UMA_TYPE_NAMES, umaCalling, umaCallingPick, umaTemplate, type UmaCallingRow,
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
/** The six callings of engines v16–v18, in `UMA_TYPE_NAMES`'s order (Classes v3's five Tier 0 follow them, H126). */
const SIX = ['brawler', 'spellblade', 'mage', 'summoner', 'paladin', 'cleric'] as const
const tally = <K extends string>(keys: readonly K[]): Record<K, number> => Object.fromEntries(keys.map((k) => [k, 0])) as Record<K, number>

describe.skipIf(!HAS_RELEASE)('the template against the local master-data release (H67)', () => {
  const roster: RosterOutfit[] = HAS_RELEASE ? buildRoster({ characters: load<Character>('characters'), outfits: load<Outfit>('outfits') }) : []

  it('uses no master-data skill name for a type, a knack word, a template or a Flourish', () => {
    const skills = load<{ name: LocalText }>('skills')
    const taken = new Set(skills.flatMap((s) => [s.name.ja, s.name.en, s.name.global]).filter((n): n is string => !!n).map((n) => n.trim().toLowerCase()))
    const types = SIX.flatMap((c) => Object.values(UMA_TYPE_NAMES[c]))
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
    const types = new Map(SIX.flatMap((c) => Object.values(UMA_TYPE_NAMES[c])).map((t) => [t, 0]))
    const names = new Map<string, number>()
    let picks = 0, pace = 0, late = 0
    for (const outfit of roster) {
      const t = umaTemplate(outfit)
      rows[`${t.row}`] += 1
      fight[({ brawler: 'physical', spellblade: 'physical hybrid', mage: 'magical', summoner: 'magical hybrid', paladin: 'healer', cleric: 'healer' } as const)[t.calling as RpgV2Class]] += 1
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
      outfits: 270, rows: [47, 20, 13, 14, 56, 74, 33, 13], fight: [61, 56, 74, 33, 46], picks: [176, 130, 46],
      templates: 63, largest: 14, median: 4, single: 17,
      // By calling (Brawler, Spell Blade, Mage, Summoner, Paladin, Cleric), Dash · Middle · Stayer: 17 of the 18 in use.
      types: [26, 20, 15, 9, 28, 19, 2, 41, 31, 3, 10, 20, 8, 15, 10, 0, 4, 9],
      strides: [48, 118, 104], knacks: [69, 69, 48, 43, 41], families: [48, 69, 69, 84],
    })
  })
})

/** Every string in a set's items, at any depth. */
function strings(value: unknown, out: Set<string>): Set<string> {
  if (typeof value === 'string') out.add(value.trim().toLowerCase())
  else if (Array.isArray(value)) for (const v of value) strings(v, out)
  else if (value && typeof value === 'object') for (const v of Object.values(value)) strings(v, out)
  return out
}

describe.skipIf(!HAS_RELEASE)('Classes v3\'s calling and templates against the local release (H126, CV19, CV21)', () => {
  const roster: RosterOutfit[] = HAS_RELEASE ? buildRoster({ characters: load<Character>('characters'), outfits: load<Outfit>('outfits') }) : []
  const V19 = 19

  it('gives §5\'s callings: Recruit 47 · Duelist 72 · Initiate 72 · Caller 33 · Acolyte 46, by §5.2\'s combinations', () => {
    const callings = tally(RPG_TIER0_CLASSES)
    const combos: Record<string, number> = {}
    for (const outfit of roster) {
      callings[umaCalling(outfit, null, V19) as (typeof RPG_TIER0_CLASSES)[number]] += 1
      const s = outfit.aptitudes.strategy
      const grades = ['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G']
      const top = Math.min(...(['front', 'pace', 'late', 'end'] as const).map((k) => grades.indexOf(s[k])))
      const key = (['front', 'pace', 'late', 'end'] as const).filter((k) => grades.indexOf(s[k]) === top).join('+')
      combos[key] = (combos[key] ?? 0) + 1
    }
    console.log(`v19 callings: ${JSON.stringify(callings)}; combinations: ${JSON.stringify(combos)}`)
    expect(callings).toEqual({ recruit: 47, duelist: 72, acolyte: 46, caller: 33, apprentice: 72 })
    expect(combos).toEqual({ front: 27, 'front+pace': 19, 'front+late': 1, pace: 72, 'pace+late': 68, 'pace+late+end': 3, 'pace+end': 1,
      'late+end': 20, end: 13, late: 46 })
  })

  it('gives §9\'s types by stride, every type in use', () => {
    const byCalling = Object.fromEntries(RPG_TIER0_CLASSES.map((c) => [c, tally(UMA_STRIDES)]))
    for (const outfit of roster) {
      const t = umaTemplate(outfit, null, V19)
      byCalling[t.calling]![t.stride] += 1
    }
    const rows = Object.fromEntries(RPG_TIER0_CLASSES.map((c) => [c, Object.values(byCalling[c]!)]))
    console.log(`v19 types by stride: ${JSON.stringify(rows)}`)
    expect(rows).toEqual({ recruit: [12, 20, 15], duelist: [17, 31, 24], acolyte: [8, 19, 19], caller: [3, 10, 20], apprentice: [8, 38, 26] })
  })

  it('uses no master-data string for a type, a Tier 0, her skill, a root, a v3 class name or a Tome Spellblade word', () => {
    const taken = new Set<string>()
    for (const set of ['characters', 'outfits', 'support-cards', 'skills', 'scenarios', 'races', 'tracks', 'courses', 'objectives']) strings(load(set), taken)
    const types = RPG_TIER0_CLASSES.flatMap((c) => Object.values(UMA_TYPE_NAMES[c]))
    const tier0 = RPG_TIER0_CLASSES.map((c) => rpgClassName(c, V19))
    const skills = Object.values(RPG_TIER0_SKILL)
    const tome = RPG_TOMEBLADE_DEPTHS.flatMap((d) => Object.values(RPG_TOMEBLADE_SPELLS).map((w) => `${d} ${w}`))
    const nodes = RPG_ALL_NODES.filter((n) => n.classId === 'tomeblade').map((n) => n.name)
    const ours = [...new Set([...types, ...tier0, ...skills, ...tome, ...nodes, ...RPG_TOMEBLADE_DEPTHS, ...Object.values(RPG_TOMEBLADE_SPELLS),
      ...Object.values(RPG_ROOT_NAME), ...rpgClasses(V19).map((c) => rpgClassName(c, V19))])]
    expect([types.length, tier0.length, skills.length, tome.length]).toEqual([15, 5, 5, 25])
    const clashes = ours.filter((n) => taken.has(n.toLowerCase()))
    console.log(`v19 words checked: ${ours.length} against ${taken.size} master-data strings; clashes: ${clashes.length}`)
    expect(clashes.length, 'a Classes v3 word equals a master-data string').toBe(0)
  })

  it('uses no master-data string for the weapon shapes\' new names (H128), exactly or as a word inside', () => {
    const taken = new Set<string>()
    for (const set of ['characters', 'outfits', 'support-cards', 'skills', 'scenarios', 'races', 'tracks', 'courses', 'objectives']) strings(load(set), taken)
    const ours = ['Starfall Volley', 'Quiver Barrage', 'Storm Barrage', 'Starfall Barrage', 'Luxaga Pierce', 'Luxaja Pierce', 'Holy Pierce',
      'Noxaga Barrage', 'Noxaja Barrage', 'Void Barrage']
    const exact = ours.filter((n) => taken.has(n.toLowerCase()))
    const word = (n: string) => new RegExp(`(^|[^a-z])${n.toLowerCase()}([^a-z]|$)`)
    const inside = ours.filter((n) => [...taken].some((t) => t !== n.toLowerCase() && word(n).test(t)))
    console.log(`H128 names checked: ${ours.length} against ${taken.size} master-data strings; exact ${exact.length}, as a word inside ${inside.length}`)
    expect([exact.length, inside.length], 'a weapon shape name is in master data').toEqual([0, 0])
  })

  it('uses no master-data string for Halls v2\'s twenty Limit Breaks or five halls (H129), exactly or as a word inside', () => {
    const taken = new Set<string>()
    for (const set of ['characters', 'outfits', 'support-cards', 'skills', 'scenarios', 'races', 'tracks', 'courses', 'objectives']) strings(load(set), taken)
    // Either apostrophe: the data's typographic one and a plain one.
    const names = heroLimitIds(V19).map((id) => heroLimitFor(id, V19)!.name)
    const ours = [...new Set([...names, ...names.map((n) => n.replace(/’/g, "'")),
      'Warrior Dojo', 'Mage Tower', 'Spell Blade Salle', 'Summoner Circle', 'Healer Sanctum'])]
    expect(names).toHaveLength(20)
    const exact = ours.filter((n) => taken.has(n.toLowerCase()))
    const escape = (n: string) => n.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const word = (n: string) => new RegExp(`(^|[^a-z])${escape(n)}([^a-z]|$)`)
    const inside = ours.filter((n) => [...taken].some((t) => t !== n.toLowerCase() && word(n).test(t)))
    console.log(`H129 names checked: ${ours.length} against ${taken.size} master-data strings; exact ${exact.length}, as a word inside ${inside.length}`)
    expect([exact.length, inside.length], 'a Halls v2 name is in master data').toEqual([0, 0])
  })
})
