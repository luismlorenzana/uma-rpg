// Creates the Phaser game for a fight inside a host element, like the Hub's (lazy chunk, DPR-aware, `?canvas` in dev).
import type { BattleCue, BattleState } from '@rpg/domain'
import Phaser from 'phaser'
import type { BattleSpeed } from '../battle-prefs'
import { BattleScene, type StageSetup } from './BattleScene'

export interface BattleGame {
  play(cues: readonly BattleCue[], onCue: (cue: BattleCue) => void): Promise<void>
  skip(): void
  sync(state: BattleState): void
  setSpeed(speed: BattleSpeed): void
  setPaused(paused: boolean): void
  destroy(): void
}

export function createBattleGame(host: HTMLElement, setup: StageSetup, state: BattleState): Promise<BattleGame> {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const css = () => ({ w: Math.max(1, host.clientWidth), h: Math.max(1, host.clientHeight) })
  const { w, h } = css()
  const scene = new BattleScene()
  const game = new Phaser.Game({
    type: import.meta.env.DEV && new URLSearchParams(location.search).has('canvas') ? Phaser.CANVAS : Phaser.AUTO,
    parent: host,
    width: Math.round(w * dpr),
    height: Math.round(h * dpr),
    transparent: false,
    backgroundColor: '#0f1620',
    banner: false,
    audio: { noAudio: true },
    scale: { mode: Phaser.Scale.NONE, zoom: 1 / dpr },
    render: { antialias: true },
    scene,
  })
  let latest = state
  let destroyed = false
  const observer = new ResizeObserver(() => {
    if (destroyed) return
    const next = css()
    game.scale.resize(Math.round(next.w * dpr), Math.round(next.h * dpr))
    game.scale.setZoom(1 / dpr)
    scene.configure(setup, next.w, next.h, dpr)
    scene.sync(latest)
  })
  return new Promise((resolve) => {
    game.events.once(Phaser.Core.Events.READY, () => {
      scene.configure(setup, w, h, dpr)
      scene.sync(state)
      observer.observe(host)
      if (import.meta.env.DEV) (window as unknown as { __battle?: unknown }).__battle = { scene, game }
      resolve({
        play: (cues, onCue) => scene.play(cues, onCue),
        skip: () => scene.skip(),
        sync(next) {
          latest = next
          scene.sync(next)
        },
        setSpeed: (speed) => scene.setSpeed(speed),
        setPaused(paused) {
          if (paused) game.scene.pause('battle')
          else game.scene.resume('battle')
        },
        destroy() {
          destroyed = true
          observer.disconnect()
          game.destroy(true)
        },
      })
    })
  })
}
