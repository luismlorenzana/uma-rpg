import type { ReactNode } from 'react'
import { retryMaster, useMaster, type MasterView } from '../master/master'

/** Renders children once master data is loaded; otherwise a loading or "connect once" state (T005). */
export function MasterGate({ children, skeleton }: { children: (view: MasterView) => ReactNode; skeleton?: ReactNode }) {
  const master = useMaster()
  if (master.status === 'ready') return <>{children(master.view)}</>
  if (master.status === 'error')
    return (
      <div className="space-y-3 p-4">
        <p className="text-ink">{master.offline ? 'Connect once to download the game data.' : 'The game data could not be loaded.'}</p>
        <button type="button" onClick={retryMaster} className="min-h-11 rounded-sm bg-accent px-4 font-display font-bold text-accent-ink">
          Try again
        </button>
      </div>
    )
  return <>{skeleton ?? <p className="p-4 text-ink-soft">Loading game data…</p>}</>
}
