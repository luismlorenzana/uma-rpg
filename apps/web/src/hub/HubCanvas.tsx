// Hosts the lazy Phaser Hub map (T007): created on mount, destroyed on unmount, paused while covered or hidden.
import type { HubPage, Place } from '@rpg/domain'
import { useEffect, useRef } from 'react'
import type { HubGame } from './scene/createHubGame'

export function HubCanvas({ page, places, paused, reducedMotion }: { page: HubPage; places: Place[]; paused: boolean; reducedMotion: boolean }) {
  const host = useRef<HTMLDivElement>(null)
  const game = useRef<HubGame | null>(null)
  const latest = useRef({ page, places, reducedMotion })
  latest.current = { page, places, reducedMotion }

  useEffect(() => {
    let cancelled = false
    void import('./scene/createHubGame').then(async ({ createHubGame }) => {
      if (cancelled || !host.current) return
      const created = await createHubGame(host.current, latest.current)
      if (cancelled) {
        created.destroy()
        return
      }
      game.current = created
      created.setPaused(document.hidden)
    })
    return () => {
      cancelled = true
      game.current?.destroy()
      game.current = null
    }
  }, [])

  useEffect(() => {
    game.current?.update({ page, places, reducedMotion })
  }, [page, places, reducedMotion])

  useEffect(() => {
    const apply = () => game.current?.setPaused(paused || document.hidden)
    apply()
    document.addEventListener('visibilitychange', apply)
    return () => document.removeEventListener('visibilitychange', apply)
  }, [paused])

  return <div ref={host} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true" />
}
