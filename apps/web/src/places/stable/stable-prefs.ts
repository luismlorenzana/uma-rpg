// The Stable's remembered controls (device only): ownership, facets, sort and view. Search isn't remembered.
import { DEFAULT_ROSTER_QUERY, EMPTY_FACETS, type RosterQuery } from '@rpg/domain'

export type StableView = 'grid' | 'list'

export interface StablePrefs {
  query: Omit<RosterQuery, 'search'>
  view: StableView
}

const KEY = 'rpg.stable.v1'

const DEFAULT_PREFS: StablePrefs = { query: { ownership: DEFAULT_ROSTER_QUERY.ownership, facets: EMPTY_FACETS, sort: DEFAULT_ROSTER_QUERY.sort }, view: 'grid' }

export function loadPrefs(): StablePrefs {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Partial<StablePrefs> | null
    if (!raw?.query) return DEFAULT_PREFS
    return { query: { ...DEFAULT_PREFS.query, ...raw.query, facets: { ...EMPTY_FACETS, ...raw.query.facets } }, view: raw.view === 'list' ? 'list' : 'grid' }
  } catch {
    return DEFAULT_PREFS
  }
}

export function savePrefs(prefs: StablePrefs): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs))
  } catch {
    // Storage blocked: the controls just reset next time.
  }
}
