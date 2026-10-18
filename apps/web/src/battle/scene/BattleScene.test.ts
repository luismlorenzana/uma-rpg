import type { BattleCue, BattleState } from '@rpg/domain'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BattleScene, type StageSetup } from './BattleScene'

// Exercise scene decisions without WebGL, a browser clock, or downloaded art.
const h = vi.hoisted(() => {
  const textures = new Map<string, { width: number; height: number }>()
  const images: ReturnType<typeof image>[] = []
  const tweens: Record<string, unknown>[] = []
  function image(x: number, y: number, key: string) {
    const frame = textures.get(key) ?? { width: 32, height: 32 }
    return {
      x, y, frame, texture: { key }, scaleX: 1, scaleY: 1, alpha: 1, angle: 0, visible: true, dead: false,
      tint: 0xffffff, originX: 0.5, originY: 0.5,
      get width() { return this.frame.width }, get height() { return this.frame.height },
      get displayWidth() { return this.frame.width * this.scaleX }, get displayHeight() { return this.frame.height * this.scaleY },
      setOrigin(x: number, y = x) { this.originX = x; this.originY = y; return this },
      setPosition(x: number, y: number) { this.x = x; this.y = y; return this },
      setX(x: number) { this.x = x; return this },
      setDisplaySize(w: number, h: number) { this.scaleX = w / frame.width; this.scaleY = h / frame.height; return this },
      setScale(x: number, y = x) { this.scaleX = x; this.scaleY = y; return this },
      setAlpha(n: number) { this.alpha = n; return this },
      setTint(n: number) { this.tint = n; return this }, clearTint() { this.tint = 0xffffff; return this },
      setTintMode() { return this }, setBlendMode() { return this }, setDepth() { return this }, setStrokeStyle() { return this },
      setAngle(n: number) { this.angle = n; return this },
      setVisible(b: boolean) { this.visible = b; return this },
      destroy() { this.dead = true },
    }
  }
  const objects = () => {
    const children: ReturnType<typeof image>[] = []
    return {
      add(value: ReturnType<typeof image> | ReturnType<typeof image>[]) { children.push(...Array.isArray(value) ? value : [value]); return this },
      removeAll(destroy: boolean) { if (destroy) children.forEach(i => i.destroy()); children.length = 0 },
      setDepth() { return this },
    }
  }
  const graphics = () => ({ clear() {}, fillGradientStyle() {}, fillStyle() {}, fillRect() {} })
  class Scene {
    textures = { exists: (key: string) => textures.has(key), addImage: (key: string, img: HTMLImageElement) => textures.set(key, { width: img.width, height: img.height }) }
    add = {
      image: (x: number, y: number, key: string) => { const i = image(x, y, key); images.push(i); return i },
      ellipse: (x: number, y: number) => image(x, y, '__shadow'),
      rectangle: (x: number, y: number) => image(x, y, '__band'),
      text: (x: number, y: number) => image(x, y, '__text'),
      particles: () => ({ explode() {}, destroy() {} }),
    }
    tweens = { add: (config: Record<string, unknown>) => { tweens.push(config); return { stop: vi.fn() } }, killTweensOf: vi.fn() }
    time = { timeScale: 1, delayedCall: (ms: number, cb: () => void) => setTimeout(cb, ms) }
  }
  return { textures, images, tweens, objects, graphics, Scene }
})
vi.mock('phaser', () => ({ default: {
  Scene: h.Scene, BlendModes: { ADD: 1 }, TintModes: { FILL: 1, MULTIPLY: 0 },
  Display: { Color: { HexStringToColor: () => ({ red: 40, green: 60, blue: 80 }), GetColor: () => 0 } },
  Math: { Between: (min: number) => min },
} }))

const bust = (width = 256, height = 256) => ({ width, height }) as HTMLImageElement
function harness(reducedMotion = false, width = 390, height = 430, dpr = 1) {
  const setup: StageSetup = {
    allies: Array.from({ length: 5 }, (_, i) => ({ id: `a${i}`, bust: i === 4 ? null : bust(i === 0 ? 128 : 256, i === 1 ? 128 : 256) })),
    enemies: [{ id: 'e', rank: 'regular', art: bust(320, 470), color: '#888888' }],
    heroes: [{ id: 'hero', bust: bust() }], field: ['e'], color: '#345678', reducedMotion,
  }
  const scene = new BattleScene()
  Object.assign(scene, { background: h.graphics(), layer: h.objects(), fx: h.objects(), pixels: { sync() {}, clearHits() {} } })
  scene.configure(setup, width, height, dpr)
  return { scene, setup, allies: h.images.filter(i => i.texture.key.startsWith('bust-a') || i.texture.key === '__DEFAULT') }
}
const state = (ko = false) => ({ units: [
  ...Array.from({ length: 5 }, (_, i) => ({ id: `a${i}`, side: 'ally', hp: ko && i === 0 ? 0 : 100, brokenAt: 0 })),
  { id: 'e', side: 'enemy', hp: 100, brokenAt: 0 },
] }) as BattleState
async function play(scene: BattleScene, cue: BattleCue) {
  const playing = scene.play([cue], () => undefined)
  await vi.runAllTimersAsync()
  await playing
}

beforeEach(() => { h.textures.clear(); h.images.length = 0; h.tweens.length = 0; vi.useFakeTimers() })
afterEach(() => vi.useRealTimers())

describe('battle busts (SB5)', () => {
  it('loads only bust textures, keeps inherited Hero busts, and fits all five boxes without stretching', () => {
    for (const width of [375, 390]) for (const dpr of [1, 2]) {
      h.images.length = 0
      const { allies } = harness(false, width, 320, dpr)
      expect(allies).toHaveLength(5)
      for (const ally of allies.slice(0, 4)) {
        expect(ally.originX).toBe(0.5); expect(ally.originY).toBe(1)
        expect(ally.scaleX).toBeCloseTo(ally.scaleY)
        expect(ally.displayWidth).toBeLessThanOrEqual((width / 5 - 14) * dpr)
        expect(ally.displayHeight).toBeLessThanOrEqual((width / 5 - 14) * dpr)
        expect(ally.y).toBe((320 - 34 - 3) * dpr)
      }
      expect(allies[4]!.visible).toBe(false) // The DOM, not a default Phaser image, supplies her icon.
    }
    expect(h.textures.has('bust-hero')).toBe(true)
    expect([...h.textures.keys()].some(k => /^(ally|cheer)-/.test(k))).toBe(false)
  })

  it('breathes from the fitted size at 1.015 and more slowly than the old 820ms idle', () => {
    const { allies } = harness()
    const breath = h.tweens.find(t => t.targets === allies[0])!
    expect(breath.scaleY).toBeCloseTo(allies[0]!.scaleY * 1.015)
    expect(breath.duration).toBe(1600)
    expect(breath).toMatchObject({ repeat: -1, yoyo: true })
  })

  it('wins with a single small hop and a brief glow, without swapping or stretching the bust', async () => {
    const { scene, allies } = harness(false, 390, 430, 2)
    scene.sync(state(true))
    h.tweens.length = 0
    await play(scene, { kind: 'result', label: 'victory' })
    const hops = h.tweens.filter(t => Array.isArray(t.targets))
    expect(hops).toHaveLength(4) // The knocked-out ally does not celebrate.
    for (const hop of hops) {
      const [sprite, glow] = hop.targets as typeof allies
      expect(hop).toMatchObject({ y: '-=16', duration: 180, yoyo: true })
      expect(hop.targets).toHaveLength(3) // The solid backplate hops with the image.
      expect(hop.repeat).toBeUndefined()
      expect(glow!.texture.key).toBe(sprite!.texture.key)
      expect(glow!.displayWidth).toBe(sprite!.displayWidth)
      expect(glow!.displayHeight).toBe(sprite!.displayHeight)
      const fade = h.tweens.find(t => t.targets === glow)!
      expect(fade.alpha).toEqual({ from: 0.45, to: 0 })
      expect(fade.duration).toBe(420)
      ;(fade.onComplete as () => void)()
      expect(glow!.dead).toBe(true)
    }
  })

  it('retains the KO fade and does not restart idle for a fallen ally', async () => {
    const { scene, allies } = harness()
    await play(scene, { kind: 'ko', actorId: 'e', targetId: 'a0' })
    expect(h.tweens.some(t => t.targets === allies[0] && t.alpha === 0.35)).toBe(true)
    scene.sync(state(true))
    expect(allies[0]!.alpha).toBe(0.35)
    h.tweens.length = 0
    scene.sync(state(true))
    expect(h.tweens.some(t => t.targets === allies[0])).toBe(false)
  })

  it('keeps the inherited Limit Break cut-in on the Hero bust', async () => {
    const { scene } = harness()
    await play(scene, { kind: 'limit', actorId: 'a0', targetId: 'e', label: 'Synthetic Limit', from: 'hero' })
    expect(h.images.some(i => i.texture.key === 'bust-hero')).toBe(true)
    expect(h.tweens.some(t => t.x === 390 * 0.3)).toBe(true)
  })

  it('under reduced motion has no breath, win hop/glow, KO tween or moving cut-in', async () => {
    const { scene, allies } = harness(true)
    await play(scene, { kind: 'ko', actorId: 'e', targetId: 'a0' })
    await play(scene, { kind: 'limit', actorId: 'a1', targetId: 'e', label: 'Synthetic Limit' })
    await play(scene, { kind: 'result', label: 'victory' })
    scene.sync(state(true))
    expect(h.tweens).toHaveLength(0)
    expect(h.images).toHaveLength(6)
    expect(allies[0]!.alpha).toBe(0.35)
  })

  it('skip removes victory glows and restores the fitted bust pose before state sync', async () => {
    const { scene, allies } = harness()
    const before = h.images.length
    const playing = scene.play([{ kind: 'result', label: 'victory' }], () => undefined)
    expect(h.images.length).toBe(before + 5)
    scene.skip()
    await playing
    expect(h.images.slice(before).every(i => i.dead)).toBe(true)
    expect(allies.slice(0, 4).every(i => i.scaleX === i.scaleY)).toBe(true)
  })
})
