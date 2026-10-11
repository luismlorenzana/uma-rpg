// Hosts the lazy Phaser battle stage: created once the art is loaded, destroyed on unmount, paused while hidden.
import type { BattleState } from '@rpg/domain'
import { useEffect, useRef } from 'react'
import type { StageSetup } from './scene/BattleScene'
import type { BattleGame } from './scene/createBattleGame'

export function BattleStage({ setup, state, onGame }: { setup: StageSetup; state: BattleState; onGame: (game: BattleGame | null) => void }) {
  const host = useRef<HTMLDivElement>(null)
  const initial = useRef(state)
  useEffect(() => {
    let cancelled = false
    let created: BattleGame | null = null
    void import('./scene/createBattleGame').then(async ({ createBattleGame }) => {
      if (cancelled || !host.current) return
      created = await createBattleGame(host.current, setup, initial.current)
      if (cancelled) {
        created.destroy()
        return
      }
      created.setPaused(document.hidden)
      onGame(created)
    })
    const visibility = () => created?.setPaused(document.hidden)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', visibility)
      onGame(null)
      created?.destroy()
    }
    // The stage is built once per fight; later states arrive through game.sync.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setup])
  return <div ref={host} className="absolute inset-0 overflow-hidden" aria-hidden="true" />
}
