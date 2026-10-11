// The Stable's query model (S2, T012): ownership, search, facets and sorts over the roster, in the spirit of
// uma-racer's Stable album. Within a facet the choices are OR; across facets, AND.
import type { AptitudeGrade, Distance, Strategy, Surface } from '@luismlorenzana/uma-data'
import { matchesSearch, type RosterOutfit } from '../master/roster'
import type { OwnedUma } from '../save/save'

export type Ownership = 'all' | 'owned' | 'locked'
export type RosterSortKey = 'release' | 'name' | 'rarity' | 'statTotal' | 'level' | 'farm' | 'craft' | 'classRank'
export type SortDirection = 'asc' | 'desc'

export interface RosterFacets {
  rarity: number[]
  /** Aptitude "A or better" (S or A) in any of the chosen keys. */
  surface: Surface[]
  distance: Distance[]
  strategy: Strategy[]
  sex: ('male' | 'female' | 'unknown')[]
  /** Unlocked within the last 24 hours. */
  newOnly: boolean
  /** Owned and not working or fighting right now. */
  freeOnly: boolean
}

export interface RosterQuery {
  ownership: Ownership
  search: string
  facets: RosterFacets
  sort: { key: RosterSortKey; direction: SortDirection }
}

export interface RosterEntry {
  outfit: RosterOutfit
  owned: OwnedUma | null
  isNew: boolean
}

export interface RosterResult {
  entries: RosterEntry[]
  /** Counts after search and facets, before the ownership switch, so the switch can show them. */
  counts: Record<Ownership, number>
}

export const EMPTY_FACETS: RosterFacets = { rarity: [], surface: [], distance: [], strategy: [], sex: [], newOnly: false, freeOnly: false }

export const DEFAULT_ROSTER_QUERY: RosterQuery = { ownership: 'all', search: '', facets: EMPTY_FACETS, sort: { key: 'release', direction: 'desc' } }

export const SORT_LABELS: Record<RosterSortKey, string> = {
  release: 'Release date',
  name: 'Name',
  rarity: 'Rarity',
  statTotal: 'Total base stats',
  level: 'Uma level',
  farm: 'Farm Level',
  craft: 'Craft Level',
  classRank: 'Top class rank',
}

const NEW_MS = 24 * 60 * 60 * 1000
const TOP: readonly AptitudeGrade[] = ['S', 'A']

export function activeFacetCount(f: RosterFacets): number {
  return f.rarity.length + f.surface.length + f.distance.length + f.strategy.length + f.sex.length + (f.newOnly ? 1 : 0) + (f.freeOnly ? 1 : 0)
}

export function statTotal(outfit: RosterOutfit): number {
  const s = outfit.baseStats
  return s.speed + s.stamina + s.power + s.guts + s.wit
}

function passesFacets(entry: RosterEntry, f: RosterFacets, busy: ReadonlySet<string>): boolean {
  const o = entry.outfit
  if (f.rarity.length > 0 && !f.rarity.includes(o.rarity)) return false
  if (f.surface.length > 0 && !f.surface.some((k) => TOP.includes(o.aptitudes.surface[k]))) return false
  if (f.distance.length > 0 && !f.distance.some((k) => TOP.includes(o.aptitudes.distance[k]))) return false
  if (f.strategy.length > 0 && !f.strategy.some((k) => TOP.includes(o.aptitudes.strategy[k]))) return false
  if (f.sex.length > 0 && !f.sex.includes(o.realHorseSex ?? 'unknown')) return false
  if (f.newOnly && !entry.isNew) return false
  if (f.freeOnly && (!entry.owned || busy.has(o.outfitId))) return false
  return true
}

function compare(a: RosterEntry, b: RosterEntry, key: RosterSortKey): number {
  switch (key) {
    case 'name':
      return a.outfit.name.localeCompare(b.outfit.name) || (a.outfit.title ?? '').localeCompare(b.outfit.title ?? '')
    case 'rarity':
      return a.outfit.rarity - b.outfit.rarity
    case 'statTotal':
      return statTotal(a.outfit) - statTotal(b.outfit)
    case 'level':
      // Owned before locked whatever the direction would say; then by level.
      return (a.owned?.level ?? 0) - (b.owned?.level ?? 0)
    case 'release':
      return a.outfit.releasedJp.localeCompare(b.outfit.releasedJp)
    case 'farm':
      return (a.owned?.professions.farming.level ?? 0) - (b.owned?.professions.farming.level ?? 0)
    case 'craft':
      return (a.owned?.professions.gathering.level ?? 0) - (b.owned?.professions.gathering.level ?? 0)
    case 'classRank': {
      const top = (e: RosterEntry) => (e.owned ? Math.max(...Object.values(e.owned.ranks.classes)) : 0)
      return top(a) - top(b)
    }
  }
}

/** `busy`: Umas working or fighting now, for the "free only" facet. */
export function runRosterQuery(roster: readonly RosterOutfit[], umas: Readonly<Record<string, OwnedUma>>, query: RosterQuery, now: number,
  busy: ReadonlySet<string> = new Set()): RosterResult {
  const filtered: RosterEntry[] = []
  for (const outfit of roster) {
    if (!matchesSearch(outfit, query.search)) continue
    const owned = umas[outfit.outfitId] ?? null
    const entry: RosterEntry = { outfit, owned, isNew: owned !== null && now - Date.parse(owned.unlockedAt) < NEW_MS }
    if (passesFacets(entry, query.facets, busy)) filtered.push(entry)
  }
  const counts: Record<Ownership, number> = { all: filtered.length, owned: filtered.filter((e) => e.owned).length, locked: 0 }
  counts.locked = counts.all - counts.owned
  const shown = filtered.filter((e) => query.ownership === 'all' || (query.ownership === 'owned') === (e.owned !== null))
  const sign = query.sort.direction === 'asc' ? 1 : -1
  shown.sort((a, b) => sign * compare(a, b, query.sort.key) || b.outfit.releasedJp.localeCompare(a.outfit.releasedJp) || a.outfit.masterId - b.outfit.masterId)
  return { entries: shown, counts }
}
