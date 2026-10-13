import atlas from '@luismlorenzana/uma-art/fx/atlas.json'
import { RPG_DAMAGE_KINDS, rpgTreeNodes, type BattleState } from '@rpg/domain'
import type Phaser from 'phaser'
import { describe, expect, it } from 'vitest'
import { stageLayout } from '../stage-layout'
import { impactPlacement, lingeringFamiliars, PixelEffects } from './pixel-effects'

const ref = (kind: 'fire' | 'ice') => ({ tier: 1 as const, id: rpgTreeNodes(`summoner-tome-${kind}`).find((n) => n.skill.summon)!.id })
const state = (kind: 'fire' | 'ice' | null = 'fire', hp = 100) => ({
  units: [{ id: 'a', side: 'ally', hp }], summons: kind ? [{ allyId: 'a', ref: ref(kind), scale: 0.3 }] : [],
}) as BattleState
function harness(loaded = true) {
  const images: { frame: string; x: number; y: number; scale: number; dead: boolean }[] = []
  let now = 0
  const timers: { at: number; delay: number; loop: boolean; dead: boolean; callback: () => void; remove: () => void }[] = []
  const event = (delay: number, callback: () => void, loop = false) => {
    const t = { at: now + delay, delay, callback, loop, dead: false, remove() { this.dead = true } }
    timers.push(t); return t
  }
  const scene = {
    add: { image(x: number, y: number, _texture: string, frame: string) {
      const image = { x, y, frame, scale: 1, dead: false,
        setFrame(f: string) { this.frame = f; return this }, setScale(s: number) { this.scale = s; return this },
        setDepth() { return this }, setPosition(x: number, y: number) { this.x = x; this.y = y; return this },
        destroy() { this.dead = true },
      }
      images.push(image); return image
    } },
    textures: { exists: () => loaded, get: () => ({ has: (f: string) => Object.hasOwn(atlas.frames, f) }) },
    time: { timeScale: 1, delayedCall: (ms: number, cb: () => void) => event(ms, cb),
      addEvent: ({ delay, callback }: { delay: number; callback: () => void }) => event(delay, callback, true) },
  }
  return { scene, images, timers, fx: new PixelEffects(scene as unknown as Phaser.Scene), advance(ms: number) {
    const end = now + ms * scene.time.timeScale
    while (true) {
      const t = timers.filter((t) => !t.dead && t.at <= end).sort((a, b) => a.at - b.at)[0]
      if (!t) break
      now = t.at; t.callback()
      if (t.loop) t.at += t.delay
      else t.dead = true
    }
    now = end
  } }
}
const target = { side: 'enemy' as const, box: { x: 12, y: 20, w: 80, h: 110 } }
const actors = new Map([['a', { side: 'ally' as const, box: { x: 315, y: 380, w: 78, h: 78 } }]])

describe('pixel battle effects', () => {
  it('covers all ten kinds and uses the four poses on the sped-up scene clock', () => {
    for (const kind of RPG_DAMAGE_KINDS) for (const speed of [1, 2, 4]) {
      const h = harness(); h.scene.time.timeScale = speed
      expect(h.fx.hit(kind, target, 2, false)).toBe(true)
      const image = h.images[0]!
      expect(image.frame).toBe(`hit/${kind}-0`)
      for (let i = 1; i <= 3; i++) { h.advance(70 / speed); expect(image.frame).toBe(`hit/${kind}-${i}`) }
      h.advance(90 / speed); expect(image.dead).toBe(true)
    }
  })
  it('shows only a still final pose under reduced motion and signals the procedural fallback', () => {
    const h = harness()
    h.fx.hit('katana', target, 2, true); h.advance(210)
    expect(h.images[0]!.frame).toBe('hit/katana-3'); expect(h.images[0]!.dead).toBe(false)
    expect(h.timers).toHaveLength(1)
    h.advance(290); expect(h.images[0]!.dead).toBe(true)
    expect(harness(false).fx.hit('lance', target, 2, false)).toBe(false)
    expect(h.fx.hit(null, target, 2, false)).toBe(false)
  })
  it('aims inside each actor, in both rows and a later wave, at integer device pixels', () => {
    for (const count of [1, 5, 6, 7, 8]) for (const dpr of [1, 2]) for (const width of [375, 390]) {
      const boxes = stageLayout(width, 430, Array.from({ length: count }, () => 'regular'), 5).enemies
      const h = harness()
      for (const box of boxes) {
        const t = { box, side: 'enemy' as const }, p = impactPlacement(t, dpr)
        expect(p.x % 1).toBe(0); expect(p.y % 1).toBe(0); expect(p.scale % 1).toBe(0)
        expect(p.x).toBeGreaterThanOrEqual(box.x * dpr - 1)
        expect(p.y).toBeLessThanOrEqual((box.y + box.h) * dpr + 1)
        expect(h.fx.hit('axe', t, dpr, false)).toBe(true)
      }
      expect(h.images).toHaveLength(count)
      const nextWave = { box: boxes.at(-1)!, side: 'enemy' as const }
      h.fx.hit('lance', nextWave, dpr, false)
      expect(h.images.at(-1)!.x).toBe(impactPlacement(nextWave, dpr).x)
    }
  })
  it('keeps and idles a familiar, replaces it, and removes it on expiry or KO', () => {
    const h = harness()
    h.fx.sync(state(), actors, 375, 2, false)
    const fire = h.images[0]!
    h.advance(650); expect(fire.frame).toBe('familiar/fire-1')
    h.fx.sync(state(), actors, 375, 2, false); expect(h.images).toHaveLength(1)
    expect(fire.x + 32).toBeLessThanOrEqual(750)
    h.fx.sync(state('ice'), actors, 375, 2, false); expect(fire.dead).toBe(true)
    expect(h.images[1]!.frame).toBe('familiar/ice-0')
    h.fx.sync(state('ice', 0), actors, 375, 2, false); expect(h.images[1]!.dead).toBe(true)
    h.fx.sync(state(), actors, 375, 2, false)
    h.fx.sync(state(null), actors, 375, 2, false); expect(h.images[2]!.dead).toBe(true)
    expect(lingeringFamiliars(state('fire', 0))).toEqual([])
  })
  it('retains familiars across resize/waves and skips only impacts; destroy cancels all clocks', () => {
    const h = harness()
    h.fx.sync(state(), actors, 390, 2, true); h.fx.hit('fire', target, 2, false)
    expect(h.timers.filter((t) => t.loop)).toHaveLength(0)
    h.fx.clearHits(); expect(h.images[0]!.dead).toBe(false); expect(h.images[1]!.dead).toBe(true)
    const resized = new Map([['a', { ...actors.get('a')!, box: { x: 200, y: 200, w: 60, h: 60 } }]])
    h.fx.sync(state(), resized, 375, 2, true)
    expect(h.images).toHaveLength(2); expect(h.images[0]!.x).toBe(Math.round(246.8 * 2))
    h.fx.destroy(); expect(h.images.every((i) => i.dead)).toBe(true)
    expect(h.timers.every((t) => t.dead)).toBe(true)
    const missing = harness(false); missing.fx.sync(state(), actors, 390, 2, false); expect(missing.images).toHaveLength(0)
  })
})
