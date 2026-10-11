import { useEffect, useState } from 'react'

/** The current time as an ISO string, refreshed every `ms` while mounted and visible: job timers read from it. */
export function useNow(ms = 1000): string {
  const [now, setNow] = useState(() => new Date().toISOString())
  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === 'visible') setNow(new Date().toISOString())
    }
    const id = setInterval(tick, ms)
    document.addEventListener('visibilitychange', tick)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [ms])
  return now
}

/** "2h 05m", "4m 10s", "now". */
export function formatDuration(ms: number): string {
  if (ms <= 0) return 'now'
  const s = Math.ceil(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`
  if (m > 0) return `${m}m ${String(s % 60).padStart(2, '0')}s`
  return `${s}s`
}
