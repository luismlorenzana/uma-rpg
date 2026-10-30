// The warning a failed backup earns (D260): a small "Sync paused" tag let days of play sit on one phone unnoticed, so once
// the server has gone ten minutes without this device's changes the app says so in words, on every page. It also says when
// a newer save replaced changes here. Either opens the Account, where the safety copies are.
import { Link } from 'react-router'
import { dateWords } from '../places/account/safety-view'
import { useGame, type GameState } from '../save/game'
import { useNow } from '../ui/useNow'

export const SYNC_WARNING_AFTER_MS = 10 * 60_000

/** The warning for this state at `now`, or null. Only unsynced changes earn one: a server error with nothing to send costs
 * nothing, and a moment's error is a moment's. */
export function syncWarning(state: Pick<GameState, 'sync' | 'dirty' | 'lastSyncedAt' | 'replacedAt'>, now: string): string | null {
  if (state.replacedAt) return 'A newer save replaced this device’s changes. They’re kept in Account.'
  if (state.sync !== 'error' || !state.dirty) return null
  const last = state.lastSyncedAt
  if (last && Date.parse(now) - Date.parse(last) < SYNC_WARNING_AFTER_MS) return null
  return last ? `Not backed up since ${dateWords(last)}. Your progress is only on this device.` : 'Not backed up. Your progress is only on this device.'
}

export function SyncWarning() {
  const now = useNow(30_000)
  const warning = useGame((s) => syncWarning(s, now))
  if (!warning) return null
  return (
    <Link to="/town/account" role="status" data-sync-warning
      className="block bg-danger/15 px-4 py-2 text-center text-[13px] font-semibold leading-4 text-danger">{warning}</Link>
  )
}
