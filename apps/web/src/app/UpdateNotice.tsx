import { useSyncExternalStore } from 'react'
import { appUpdateLifecycle } from './update-lifecycle'

export function useAppUpdate() {
  return useSyncExternalStore(appUpdateLifecycle.subscribe, appUpdateLifecycle.getSnapshot, appUpdateLifecycle.getSnapshot)
}

/** uma-racer's "Update ready — Restart" prompt. */
export function UpdateNotice() {
  const update = useAppUpdate()
  if (update.status === 'current') return null
  const working = update.status === 'activating' || update.status === 'restarting'
  return (
    <aside
      role="status"
      aria-label="App update ready"
      className="fixed inset-x-3 top-[calc(env(safe-area-inset-top)+0.75rem)] z-50 flex min-h-14 items-center gap-3 rounded-sm border border-accent/40 bg-raised px-4 py-2 text-ink shadow-3"
    >
      <div className="min-w-0 flex-1">
        <p className="font-display text-sm font-bold">Update ready</p>
        <p className="text-xs text-ink-soft">{working ? 'Updating…' : 'Restart to update'}</p>
      </div>
      {!working && (
        <button type="button" onClick={() => appUpdateLifecycle.requestRestart()} className="min-h-11 shrink-0 rounded-sm bg-accent px-4 font-display text-sm font-bold text-accent-ink">
          Restart
        </button>
      )}
    </aside>
  )
}
