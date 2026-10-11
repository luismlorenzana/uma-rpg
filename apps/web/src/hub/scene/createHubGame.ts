// Creates the Phaser game for the Hub map inside a host element (uma-racer's imperative scene pattern). Loaded lazily:
// Phaser never enters the main chunk.
import Phaser from 'phaser'
import { hubDpr } from '../grid'
import { HubScene, PALETTES, type HubSceneState } from './HubScene'

export interface HubGame {
  update(state: HubSceneState): void
  setPaused(paused: boolean): void
  destroy(): void
}

export function createHubGame(host: HTMLElement, initial: HubSceneState): Promise<HubGame> {
  const dpr = hubDpr()
  const size = () => ({ w: Math.max(1, Math.round(host.clientWidth * dpr)), h: Math.max(1, Math.round(host.clientHeight * dpr)) })
  const { w, h } = size()
  const scene = new HubScene()
  const game = new Phaser.Game({
    // `?canvas` (dev only) forces the Canvas renderer: preview screenshots can't capture WebGL.
    type: import.meta.env.DEV && new URLSearchParams(location.search).has('canvas') ? Phaser.CANVAS : Phaser.AUTO,
    parent: host,
    width: w,
    height: h,
    backgroundColor: PALETTES[initial.page].background,
    banner: false,
    audio: { noAudio: true },
    scale: { mode: Phaser.Scale.NONE, zoom: 1 / dpr },
    render: { antialias: true },
    scene,
  })
  let state = initial
  let destroyed = false
  const observer = new ResizeObserver(() => {
    if (destroyed) return
    const next = size()
    game.scale.resize(next.w, next.h)
    game.scale.setZoom(1 / dpr)
    scene.configure(state, dpr, false)
  })

  return new Promise((resolve) => {
    game.events.once(Phaser.Core.Events.READY, () => {
      scene.configure(state, dpr, false)
      observer.observe(host)
      if (import.meta.env.DEV) (window as unknown as { __hub?: unknown }).__hub = { scene, game, setPage: (page: HubSceneState['page']) => scene.configure({ ...state, page }, dpr, true) }
      resolve({
        update(next) {
          state = next
          scene.configure(next, dpr, true)
        },
        // Pausing the scene stops its updates but keeps the last frame on screen; a hidden page gets no animation
        // frames from the browser at all, so the loop itself needs no pausing.
        setPaused(paused) {
          if (paused) game.scene.pause('hub')
          else game.scene.resume('hub')
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
