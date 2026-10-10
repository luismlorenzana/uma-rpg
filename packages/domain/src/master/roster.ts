// The master data adapter (P8): master records → uma-rpg's own shapes. Games read master data only through here.
// Field reference: uma-platform docs/master-data.md. Unknown or missing ids are skipped, never fatal.
import type { Aptitudes, LocalText, MasterData, Outfit, Scenario, Stats } from '@luismlorenzana/uma-data'

export interface RosterOutfit {
  /** The master outfit id as a string: uma-rpg's stable key for an Uma. */
  outfitId: string
  masterId: number
  characterId: number
  /** Character name, e.g. "Special Week". */
  name: string
  /** Outfit title without brackets, e.g. "Special Dreamer"; null when the source has none. */
  title: string | null
  rarity: number
  aptitudes: Aptitudes
  /** Base stats at the outfit's starting stars. */
  baseStats: Stats
  growthRatePercents: Stats
  uniqueSkill: { name: string; description: string } | null
  /** Japan release date; the roster sorts by it. */
  releasedJp: string
}

export interface ChapterInfo {
  scenarioId: number
  name: string
  /** Japan release order, from 1. */
  order: number
  /** Five scenarios per tier (D2). */
  tier: number
  /** Uma levels the chapter covers within its tier (ten per chapter). */
  levelBand: readonly [number, number]
  /** Theme colour as `#RRGGBB`. */
  color: string
}

/** Global English first, then GameTora's English, then Japanese. */
export function displayText(text: LocalText | null | undefined): string {
  return text?.global ?? text?.en ?? text?.ja ?? ''
}

function stripBrackets(value: string): string {
  return value.replace(/^\[(.*)\]$/, '$1').trim()
}

function startingStats(outfit: Outfit): Stats {
  const key = `star${outfit.rarity}` as keyof Outfit['stats']
  return outfit.stats[key] ?? outfit.stats.star4
}

export function buildRoster(data: MasterData): RosterOutfit[] {
  const characters = new Map(data.characters.map((c) => [c.id, c]))
  const skills = new Map(data.skills.map((s) => [s.id, s]))
  const roster: RosterOutfit[] = []
  for (const outfit of data.outfits) {
    const character = characters.get(outfit.characterId)
    if (!character) continue
    const unique = outfit.skills.unique[0] === undefined ? undefined : skills.get(outfit.skills.unique[0])
    const title = stripBrackets(displayText(outfit.title))
    roster.push({
      outfitId: String(outfit.id),
      masterId: outfit.id,
      characterId: outfit.characterId,
      name: displayText(character.name),
      title: title || null,
      rarity: outfit.rarity,
      aptitudes: outfit.aptitudes,
      baseStats: startingStats(outfit),
      growthRatePercents: outfit.growthRatePercents,
      uniqueSkill: unique ? { name: displayText(unique.name), description: displayText(unique.description) } : null,
      releasedJp: outfit.release.jp,
    })
  }
  return roster.sort((a, b) => a.releasedJp.localeCompare(b.releasedJp) || a.masterId - b.masterId)
}

export function chapterFor(order: number): { tier: number; levelBand: readonly [number, number] } {
  const tier = Math.ceil(order / 5)
  const first = ((order - 1) % 5) * 10 + 1
  return { tier, levelBand: [first, first + 9] }
}

export function buildChapters(scenarios: readonly Scenario[]): ChapterInfo[] {
  return [...scenarios]
    .sort((a, b) => a.order - b.order)
    .map((s) => ({ scenarioId: s.id, name: displayText(s.name), order: s.order, ...chapterFor(s.order), color: `#${s.color}` }))
}

/** Case- and accent-insensitive search over name and title. */
export function matchesSearch(outfit: RosterOutfit, query: string): boolean {
  const fold = (v: string) => v.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
  const q = fold(query.trim())
  return q === '' || fold(`${outfit.name} ${outfit.title ?? ''}`).includes(q)
}
