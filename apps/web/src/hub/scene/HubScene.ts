// The Hub map scene (T007): ground tiles in the page's palette, a marker per place, gentle ambient life. World units
// are CSS pixels; the camera zooms by the device pixel ratio so shapes render crisp. No text: names, pips and badges
// are DOM buttons over the canvas (D33).
import type { HubPage, Place } from '@rpg/domain'
import Phaser from 'phaser'
import { drawMarker, type Ambient } from './markers'

interface Palette {
  ground: number[]
  feature: number
  background: string
}

export const PALETTES: Record<HubPage, Palette> = {
  farmlands: { ground: [0x3f6b3a, 0x44723e, 0x3b6536, 0x416e3b], feature: 0x7a6444, background: '#2c4a28' },
  wilds: { ground: [0x4d4a3c, 0x55513f, 0x48463a, 0x504c3e], feature: 0x2f6fa8, background: '#34322a' },
  learning: { ground: [0x3f3f52, 0x45455a, 0x3b3b4d, 0x42425a], feature: 0x56546e, background: '#2c2c3a' },
  town: { ground: [0x5a4636, 0x614b3a, 0x553f31, 0x5d4838], feature: 0x76604a, background: '#3e3026' },
}

const TILE = 24

function hash(a: number, b: number, c: number): number {
  let h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

export interface HubSceneState {
  page: HubPage
  places: Place[]
  reducedMotion: boolean
}

export class HubScene extends Phaser.Scene {
  private state: HubSceneState | null = null
  private ground!: Phaser.GameObjects.Graphics
  private markers!: Phaser.GameObjects.Graphics
  private fx!: Phaser.GameObjects.Graphics
  private ambient: Ambient[] = []
  private clouds: { x: number; y: number; w: number; speed: number }[] = []
  private elapsed = 0
  private dpr = 1

  constructor() {
    super('hub')
  }

  create(): void {
    this.ground = this.add.graphics()
    this.markers = this.add.graphics()
    this.fx = this.add.graphics()
    this.cameras.main.setOrigin(0, 0)
    this.redraw()
  }

  /** World size in CSS px. */
  private size(): { w: number; h: number } {
    return { w: this.scale.width / this.dpr, h: this.scale.height / this.dpr }
  }

  configure(state: HubSceneState, dpr: number, fade: boolean): void {
    const pageChanged = this.state !== null && this.state.page !== state.page
    this.state = state
    this.dpr = dpr
    if (!this.ground) return
    if (pageChanged && fade && !state.reducedMotion) {
      this.cameras.main.fadeOut(90, 0, 0, 0)
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        this.redraw()
        this.cameras.main.fadeIn(130, 0, 0, 0)
      })
    } else {
      this.redraw()
    }
  }

  redraw(): void {
    if (!this.state || !this.ground) return
    const { page, places } = this.state
    const palette = PALETTES[page]
    const { w, h } = this.size()
    this.cameras.main.setZoom(this.dpr)
    this.cameras.main.setBackgroundColor(palette.background)
    const g = this.ground
    g.clear()
    const pageSeed = page.length * 31 + page.charCodeAt(0)
    for (let ty = 0; ty * TILE < h; ty++)
      for (let tx = 0; tx * TILE < w; tx++) {
        const r = hash(tx, ty, pageSeed)
        g.fillStyle(palette.ground[Math.floor(r * palette.ground.length)] ?? palette.ground[0] ?? 0, 1)
        g.fillRect(tx * TILE, ty * TILE, TILE, TILE)
        if (r > 0.86) {
          g.fillStyle(0xffffff, 0.04)
          g.fillRect(tx * TILE + 6, ty * TILE + 8, 4, 4)
        }
      }
    this.drawFeatures(g, page, places, w, h)
    this.markers.clear()
    this.ambient = []
    for (const place of places) this.ambient.push(...drawMarker(this.markers, place.id, place.at.x * w, place.at.y * h - 12))
    this.clouds = [0, 1, 2].map((i) => ({ x: hash(i, 7, pageSeed) * w, y: (0.15 + i * 0.32) * h, w: 70 + i * 24, speed: 4 + i * 2 }))
    this.drawFx()
  }

  private drawFeatures(g: Phaser.GameObjects.Graphics, page: HubPage, places: Place[], w: number, h: number): void {
    const palette = PALETTES[page]
    g.fillStyle(palette.feature, page === 'wilds' ? 0.9 : 0.55)
    if (page === 'farmlands' || page === 'town') {
      // A dirt road down the middle and one across, linking the places.
      g.fillRect(w / 2 - 9, 0, 18, h)
      g.fillRect(0, h * 0.51 - 8, w, 16)
    }
    if (page === 'wilds') {
      // A stream winding down the map.
      for (let y = 0; y < h; y += 4) {
        const x = w * 0.5 + Math.sin(y / 46) * w * 0.07
        g.fillRect(x - 6, y, 12, 5)
      }
      this.ambient.push({ kind: 'shimmer', x: w * 0.5, y: h * 0.3, w: 10, color: 0xbfe6ff })
    }
    if (page === 'learning' || page === 'town') {
      const center = places.find((p) => p.id === (page === 'learning' ? 'summoner-circle' : 'scenario-gate'))
      if (center) {
        g.fillStyle(palette.feature, 0.85)
        g.fillEllipse(center.at.x * w, center.at.y * h - 6, Math.min(w * 0.62, 240), 96)
      }
      g.lineStyle(1, 0x000000, 0.12)
      for (let x = 0; x < w; x += TILE * 2) g.lineBetween(x, 0, x, h)
    }
  }

  private drawFx(): void {
    const fx = this.fx
    fx.clear()
    const t = this.elapsed / 1000
    const { w } = this.size()
    for (const c of this.clouds) {
      const x = ((c.x + t * c.speed) % (w + c.w * 2)) - c.w
      fx.fillStyle(0xffffff, 0.05)
      fx.fillEllipse(x, c.y, c.w, c.w * 0.32)
      fx.fillEllipse(x + c.w * 0.25, c.y - c.w * 0.08, c.w * 0.6, c.w * 0.26)
    }
    for (const a of this.ambient) {
      if (a.kind === 'shimmer') {
        for (let i = 0; i < 3; i++) {
          const phase = Math.sin(t * 2.2 + i * 2.1)
          fx.fillStyle(a.color, 0.25 + 0.25 * phase)
          fx.fillRect(a.x - a.w / 2 + ((i * 13 + t * 6) % a.w), a.y - 4 + i * 4, 6, 1.5)
        }
      } else if (a.kind === 'sway') {
        const dx = Math.sin(t * 1.6 + a.y) * 1.2
        fx.fillStyle(a.color, 0.9)
        for (let k = 0; k < 6; k++) fx.fillRect(a.x - a.w / 2 + 2 + k * 8 + dx, a.y - 4, 2, 3)
      } else if (a.kind === 'smoke') {
        for (let i = 0; i < 3; i++) {
          const p = ((t * 0.5 + i / 3) % 1)
          fx.fillStyle(0xd8d8d8, 0.35 * (1 - p))
          fx.fillCircle(a.x + Math.sin(p * 6 + i) * 3, a.y - p * 20, 2.5 + p * 4)
        }
      } else if (a.kind === 'glow') {
        fx.fillStyle(a.color, 0.18 + 0.1 * Math.sin(t * 1.8))
        fx.fillEllipse(a.x, a.y, a.r * 2.4, a.r * 1.2)
      }
    }
  }

  override update(_time: number, delta: number): void {
    if (!this.state || this.state.reducedMotion) return
    this.elapsed += delta
    this.drawFx()
  }
}
