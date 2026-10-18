// One-time device migration only. The kit owns all ongoing album preferences, saved views and seen ids.
import { loadAlbumPrefs, markSeen, sanitizeQuery, saveAlbumPrefs } from '@luismlorenzana/uma-kit/roster'
import { readPref, writePref } from '@luismlorenzana/uma-kit/ui'
import { STABLE_SCHEMA } from './rows'

export function prepareStablePrefs(ids: readonly string[]): void {
  const current = loadAlbumPrefs('stable', STABLE_SCHEMA)
  const oldKeys = ['rpg.stable.v2']
  if (current.fresh) {
    let legacy: unknown = null
    try { legacy = JSON.parse(readPref(oldKeys[0]!) ?? 'null') as unknown } catch { /* Invalid old preferences reset. */ }
    const record = (value: unknown): Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : {}
    const stored = record(legacy)
    const sort = record(record(stored.query).sort)
    const query = sanitizeQuery({ ...STABLE_SCHEMA.fallback,
      view: stored.view === 'list' ? 'list' : 'icons',
      sort: sort.key, direction: sort.direction,
    }, STABLE_SCHEMA)
    // Seed today's catalogue once: future arrivals remain New until their profile is opened.
    saveAlbumPrefs('stable', { query, views: [], seen: ids })
  }
  // A blocked write must not destroy the recoverable old preference row.
  if (!loadAlbumPrefs('stable', STABLE_SCHEMA).fresh) for (const key of oldKeys) writePref(key, null)
}

/** Profiles reached from the plaza, party or a direct link clear New just like the Stable grid does. */
export function seeStableOutfit(ids: readonly string[], outfitId: string): void {
  if (!ids.includes(outfitId)) return
  prepareStablePrefs(ids)
  const prefs = loadAlbumPrefs('stable', STABLE_SCHEMA)
  saveAlbumPrefs('stable', { ...prefs, seen: markSeen(prefs.seen, [outfitId]) })
}
