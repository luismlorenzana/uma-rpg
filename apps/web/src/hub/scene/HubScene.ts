// The Hub map scene (T007, D61, P38): the page's pixel-art terrain and building sprites from uma-art, laid on the
// shared grid and drawn once into a texture, with gentle ambient life on top. World units are CSS pixels; the camera
// zooms by the device pixel ratio, and art pixels land on whole device pixels. No text: names, pips and badges are DOM
// buttons over the canvas (D33). If the art can't load, the code-drawn markers stand in.
import buildingsIndex from '@luismlorenzana/uma-art/buildings/atlas.json'
import buildingsUrl from '@luismlorenzana/uma-art/buildings/atlas.png?url'
import tilesIndex from '@luismlorenzana/uma-art/tiles/atlas.json'
import tilesUrl from '@luismlorenzana/uma-art/tiles/atlas.png?url'
import type { HubPage, Place } from '@rpg/domain'
import Phaser from 'phaser'
import { ART_TILE, buildingFrame, hubGrid } from '../grid'
import { drawMarker, type Ambient } from './markers'
import { layTerrain } from './terrain'

type Frames = Record<string, { x: number; y: number; w: number; h: number; smoke?: { x: number; y: number } }>
const TILES = 'hub-tiles'
const BUILDINGS = 'hub-buildings'

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
  private art: Phaser.GameObjects.RenderTexture | null = null
  private markers!: Phaser.GameObjects.Graphics
  private fx!: Phaser.GameObjects.Graphics
  private ambient: Ambient[] = []
  private clouds: { x: number; y: number; w: number; speed: number }[] = []
  private elapsed = 0
  private dpr = 1

  constructor() {
    super('hub')
  }

  preload(): void {
    this.load.image(TILES, tilesUrl)
    this.load.image(BUILDINGS, buildingsUrl)
  }

  /** Names every frame of an atlas the scene loaded; false when it didn't load. */
  private addFrames(key: string, frames: Frames): boolean {
    if (!this.textures.exists(key)) return false
    const texture = this.textures.get(key)
    for (const [id, f] of Object.entries(frames)) if (!texture.has(id)) texture.add(id, 0, f.x, f.y, f.w, f.h)
    texture.setFilter(Phaser.Textures.FilterMode.NEAREST)
    return true
  }

  private hasArt = false

  create(): void {
    this.hasArt = this.addFrames(TILES, tilesIndex.frames as Frames) && this.addFrames(BUILDINGS, buildingsIndex.frames as Frames)
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
    this.markers.clear()
    this.ambient = []
    const pageSeed = page.length * 31 + page.charCodeAt(0)
    this.clouds = [0, 1, 2].map((i) => ({ x: hash(i, 7, pageSeed) * w, y: (0.15 + i * 0.32) * h, w: 70 + i * 24, speed: 4 + i * 2 }))
    this.art?.destroy()
    this.art = null
    if (this.hasArt) {
      this.drawArt(page, places, w, h)
      this.drawFx()
      return
    }
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
    for (const place of places) this.ambient.push(...drawMarker(this.markers, place.id, place.at.x * w, place.at.y * h - 12))
    this.drawFx()
  }

  /** Terrain, props and buildings, stamped once in art pixels into one texture and scaled up crisp. */
  private drawArt(page: HubPage, places: Place[], w: number, h: number): void {
    const grid = hubGrid(w, h, this.dpr)
    const terrain = layTerrain(page, places, grid.cols, grid.rows)
    const buildings = buildingsIndex.frames as Frames
    const rt = this.add.renderTexture(0, 0, grid.cols * ART_TILE, grid.rows * ART_TILE).setOrigin(0, 0).setScale(grid.scale).setDepth(-1)
    // Before drawing: under WebGL, changing a render texture's filter rebuilds it empty.
    rt.texture.setFilter(Phaser.Textures.FilterMode.NEAREST)
    const topLeft = { originX: 0, originY: 0 }
    terrain.cells.forEach((frame, i) => rt.stamp(TILES, frame, (i % grid.cols) * ART_TILE, Math.floor(i / grid.cols) * ART_TILE, topLeft))
    // Props and buildings by the row they stand on, so nearer ones overlap farther ones.
    const sprites = [
      ...terrain.props.map((p) => ({ row: p.row, key: TILES, frame: p.frame, x: p.col * ART_TILE, y: (p.tall ? p.row - 1 : p.row) * ART_TILE })),
      ...places.filter((p) => buildings[buildingFrame(p.id)] && terrain.footprints[p.id]).map((p) => {
        const { col, row } = terrain.footprints[p.id]!
        return { row: row + 0.5, key: BUILDINGS, frame: buildingFrame(p.id), x: (col - 1) * ART_TILE, y: (row - 2) * ART_TILE }
      }),
    ].sort((a, b) => a.row - b.row)
    for (const s of sprites) {
      rt.stamp(s.key, s.frame, s.x, s.y, topLeft)
      const smoke = s.key === BUILDINGS ? buildings[s.frame]?.smoke : undefined
      if (smoke) this.ambient.push({ kind: 'smoke', x: (s.x + smoke.x) * grid.scale, y: (s.y + smoke.y) * grid.scale })
    }
    rt.render()
    this.art = rt
    // A glint now and then on the Wilds' stream.
    terrain.cells.forEach((frame, i) => {
      if (frame.startsWith('wilds/water') && i % 5 === 0) {
        this.ambient.push({ kind: 'shimmer', x: ((i % grid.cols) + 0.5) * grid.tile, y: (Math.floor(i / grid.cols) + 0.5) * grid.tile, w: grid.tile * 0.5, color: 0xd8f0ff })
      }
    })
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
