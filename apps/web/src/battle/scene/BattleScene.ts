// The battle stage (D53): PriConne rivals as bust portraits, the party as chibis, and procedural effects that play the
// engine's cues: lunges, hit flashes, element particles, weapon slashes, the shield break and a Limit Break cut-in.
// Playback never decides anything; the engine already did. The DOM overlay carries every lasting number and control,
// and the canvas only draws effect text (damage numbers, BREAK).
import type { BattleCue, BattleState, EnemyRank, RpgDamageKind } from '@rpg/domain'
import Phaser from 'phaser'
import { stageLayout, type Box } from '../stage-layout'

export interface StageAlly { id: string; idle: HTMLImageElement | null; cheer: HTMLImageElement | null; bust: HTMLImageElement | null }
export interface StageEnemy { id: string; rank: EnemyRank; art: HTMLImageElement | null; color: string }
export interface StageSetup {
  allies: StageAlly[]
  enemies: StageEnemy[]
  /** The chapter's colour, `#RRGGBB`. */
  color: string
  reducedMotion: boolean
}

const KIND_COLOR: Record<string, number> = {
  fire: 0xff8a5c, ice: 0x8fd3ff, lightning: 0xffd84d, light: 0xfff2b0, dark: 0xc79bff, ultima: 0xf0b8ff, staff: 0xd6c8ff,
  greatsword: 0xffffff, spear: 0xffffff, axe: 0xffffff, bow: 0xffffff, 'short-sword': 0xffffff,
}
const WEAPONS = new Set(['greatsword', 'spear', 'axe', 'bow', 'short-sword'])

interface Actor { id: string; side: 'ally' | 'enemy'; sprite: Phaser.GameObjects.Image; shadow: Phaser.GameObjects.Ellipse; box: Box; index: number; scaleY: number; idle: Phaser.Tweens.Tween | null }

export class BattleScene extends Phaser.Scene {
  private setup!: StageSetup
  private dpr = 1
  private actors = new Map<string, Actor>()
  private layer!: Phaser.GameObjects.Container
  private fx!: Phaser.GameObjects.Container
  private background!: Phaser.GameObjects.Graphics
  private waiting = new Set<() => void>()
  private skipping = false
  private cssSize = { w: 1, h: 1 }

  constructor() {
    super('battle')
  }

  /** Speeds every cue clock together; reduced motion still skips playback entirely. */
  setSpeed(speed: 1 | 2 | 4): void {
    this.tweens.timeScale = speed
    this.time.timeScale = speed
  }

  create(): void {
    this.background = this.add.graphics()
    this.layer = this.add.container(0, 0)
    this.fx = this.add.container(0, 0)
    const g = this.make.graphics({}, false)
    // Effect textures, drawn once: a soft dot, a shard and a ring.
    for (let r = 12; r > 0; r -= 2) {
      g.fillStyle(0xffffff, 0.12 + (12 - r) * 0.07)
      g.fillCircle(12, 12, r)
    }
    g.generateTexture('fx-dot', 24, 24)
    g.clear()
    g.fillStyle(0xffffff, 1)
    g.fillPoints([new Phaser.Math.Vector2(6, 0), new Phaser.Math.Vector2(12, 9), new Phaser.Math.Vector2(6, 22), new Phaser.Math.Vector2(0, 9)], true)
    g.generateTexture('fx-shard', 12, 22)
    g.destroy()
  }

  /** Builds the stage for a fight at a CSS size. Safe to call again on resize. */
  configure(setup: StageSetup, cssW: number, cssH: number, dpr: number): void {
    this.setup = setup
    this.dpr = dpr
    this.cssSize = { w: cssW, h: cssH }
    for (const a of setup.allies) this.addTexture(`ally-${a.id}`, a.idle).addTexture(`cheer-${a.id}`, a.cheer).addTexture(`bust-${a.id}`, a.bust)
    for (const e of setup.enemies) this.addTexture(`foe-${e.id}`, e.art)
    this.drawBackground()
    this.layer.removeAll(true)
    this.actors.clear()
    const layout = stageLayout(cssW, cssH, setup.enemies.map((e) => e.rank), setup.allies.length)
    setup.enemies.forEach((e, i) => this.addActor(e.id, 'enemy', `foe-${e.id}`, layout.enemies[i]!, i))
    setup.allies.forEach((a, i) => this.addActor(a.id, 'ally', `ally-${a.id}`, layout.allies[i]!, i))
  }

  private addTexture(key: string, image: HTMLImageElement | null): this {
    if (image && !this.textures.exists(key)) this.textures.addImage(key, image)
    return this
  }

  private drawBackground(): void {
    const { w, h } = this.cssSize
    const d = this.dpr
    const base = Phaser.Display.Color.HexStringToColor(this.setup.color)
    const top = Phaser.Display.Color.GetColor(base.red * 0.28, base.green * 0.28, base.blue * 0.34)
    const mid = Phaser.Display.Color.GetColor(base.red * 0.12 + 10, base.green * 0.12 + 14, base.blue * 0.14 + 20)
    this.background.clear()
    this.background.fillGradientStyle(top, top, mid, mid, 1)
    this.background.fillRect(0, 0, w * d, h * d)
    // A floor line under the rivals and a soft band for the party.
    this.background.fillStyle(0xffffff, 0.04)
    this.background.fillRect(0, h * 0.5 * d, w * d, 2 * d)
    this.background.fillStyle(0x000000, 0.18)
    this.background.fillRect(0, h * 0.62 * d, w * d, h * 0.38 * d)
  }

  private addActor(id: string, side: 'ally' | 'enemy', key: string, box: Box, index: number): void {
    const d = this.dpr
    const cx = (box.x + box.w / 2) * d
    const bottom = (box.y + box.h) * d
    const shadow = this.add.ellipse(cx, bottom - 2 * d, box.w * 0.7 * d, box.w * 0.16 * d, 0x000000, 0.35)
    // No art for this one (a new outfit, say): an invisible stand-in keeps the effects aimed; the DOM shows her icon.
    const missing = !this.textures.exists(key)
    const sprite = this.add.image(cx, bottom, missing ? '__DEFAULT' : key).setOrigin(0.5, 1)
    this.fit(sprite, box, side)
    if (missing) sprite.setVisible(false)
    this.layer.add([shadow, sprite])
    const actor: Actor = { id, side, sprite, shadow, box, index, scaleY: sprite.scaleY, idle: null }
    this.actors.set(id, actor)
    this.startIdle(actor)
  }

  /** Fills the box; a foe's portrait keeps its own shape inside it (franchise packs differ, D76), feet on the floor. */
  private fit(sprite: Phaser.GameObjects.Image, box: Box, side: 'ally' | 'enemy'): void {
    const d = this.dpr
    const { width, height } = sprite.frame
    if (side === 'ally' || width <= 1 || height <= 1) {
      sprite.setDisplaySize(box.w * d, box.h * d)
      return
    }
    const scale = Math.min((box.w * d) / width, (box.h * d) / height)
    sprite.setDisplaySize(width * scale, height * scale)
  }

  /** Breathing: a small squash from the feet, so it never fights the lunges, which move them. */
  private startIdle(actor: Actor): void {
    if (this.setup.reducedMotion || actor.idle) return
    actor.sprite.scaleY = actor.scaleY
    actor.idle = this.tweens.add({ targets: actor.sprite, scaleY: actor.scaleY * (actor.side === 'ally' ? 1.03 : 1.012),
      duration: (actor.side === 'ally' ? 820 : 1500) + actor.index * 80, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: actor.index * 110 })
  }

  /** Brings every unit's look in line with the state: knocked out, broken, or standing. */
  sync(state: BattleState): void {
    for (const unit of state.units) {
      const actor = this.actors.get(unit.id)
      if (!actor) continue
      const base = this.basePos(actor)
      actor.sprite.setPosition(base.x, base.y)
      actor.sprite.clearTint()
      if (unit.hp <= 0) {
        actor.idle?.stop()
        actor.idle = null
        actor.sprite.setAlpha(actor.side === 'enemy' ? 0.12 : 0.35).setTint(0x777777).setAngle(0)
        actor.shadow.setAlpha(0.1)
      } else {
        actor.sprite.setAlpha(1).setAngle(unit.brokenAt > 0 ? -6 : 0)
        if (unit.brokenAt > 0) actor.sprite.setTint(0x9a9aa6)
        actor.shadow.setAlpha(0.35)
        this.startIdle(actor)
      }
    }
  }

  private basePos(actor: Actor): { x: number; y: number } {
    const d = this.dpr
    return { x: (actor.box.x + actor.box.w / 2) * d, y: (actor.box.y + actor.box.h) * d }
  }

  private center(id: string): { x: number; y: number } {
    const actor = this.actors.get(id)
    if (!actor) return { x: this.cssSize.w * this.dpr / 2, y: this.cssSize.h * this.dpr / 2 }
    const d = this.dpr
    return { x: (actor.box.x + actor.box.w / 2) * d, y: (actor.box.y + actor.box.h * (actor.side === 'enemy' ? 0.45 : 0.55)) * d }
  }

  private wait(ms: number): Promise<void> {
    if (this.skipping || ms <= 0) return Promise.resolve()
    return new Promise((resolve) => {
      const done = () => {
        this.waiting.delete(done)
        resolve()
      }
      this.waiting.add(done)
      this.time.delayedCall(ms, done)
    })
  }

  /** Plays cues in order; `onCue` fires as each one starts, so the DOM can follow along. */
  async play(cues: readonly BattleCue[], onCue: (cue: BattleCue) => void): Promise<void> {
    this.skipping = this.setup.reducedMotion
    for (const cue of cues) {
      onCue(cue)
      if (this.skipping) continue
      await this.animate(cue)
    }
    this.skipping = false
  }

  /** Ends the current playback at once; the caller syncs to the final state. */
  skip(): void {
    this.skipping = true
    for (const done of [...this.waiting]) done()
    this.fx.removeAll(true)
    for (const actor of this.actors.values()) {
      const base = this.basePos(actor)
      this.tweens.killTweensOf(actor.sprite)
      actor.sprite.setPosition(base.x, base.y)
      actor.sprite.scaleY = actor.scaleY
      actor.idle = null
    }
  }

  private async animate(cue: BattleCue): Promise<void> {
    switch (cue.kind) {
      case 'hit':
        return this.hit(cue.actorId, cue.targetId, cue.amount, cue.element, cue.weak, cue.channel === 'status')
      case 'heal':
        this.burst(cue.targetId, 0x7be3a0, 14, -1)
        this.number(cue.targetId, `+${cue.amount ?? 0}`, '#8ff0b0')
        return this.wait(360)
      case 'mp':
        this.number(cue.targetId, `+${cue.amount ?? 0} MP`, '#8fc0ff', 0.75)
        return this.wait(220)
      case 'shield':
        this.shards(cue.targetId, 4, 0xdfe8f3)
        return this.wait(140)
      case 'break':
        return this.breakFx(cue.targetId)
      case 'ko':
        return this.ko(cue.targetId)
      case 'guard':
        this.ring(cue.targetId, 0x8fd3ff)
        return this.wait(300)
      case 'status':
        this.label(cue.targetId, cue.label ?? '', '#ffe6a6')
        return this.wait(300)
      case 'skip':
        this.label(cue.actorId, cue.label ?? '…', '#c9d2dd')
        return this.wait(260)
      case 'phase':
        this.flash(cue.targetId, 0xff5050)
        this.label(cue.targetId, 'Changes tactics!', '#ff9b9b')
        this.cameras.main.shake(220, 0.006)
        return this.wait(520)
      case 'revive':
        this.burst(cue.targetId, 0xffe08a, 18, -1)
        this.actors.get(cue.targetId)?.sprite.setAlpha(1).clearTint()
        return this.wait(480)
      case 'recover':
        this.actors.get(cue.targetId)?.sprite.clearTint().setAngle(0)
        this.ring(cue.targetId, 0xdfe8f3)
        return this.wait(300)
      case 'limit':
        return this.cutIn(cue.actorId, cue.label ?? '')
      case 'summon':
        // A Summoner's lingering summon strikes again before it leaves (D86).
        this.burst(cue.actorId, 0xc79bff, 14, -1)
        this.label(cue.actorId, `${cue.label ?? 'Summon'}!`, '#e0c8ff')
        return this.wait(360)
      case 'result':
        return this.result(cue.label)
      default:
        return this.wait(0)
    }
  }

  private async hit(actorId: string, targetId: string, amount: number, kind: RpgDamageKind | null, weak: boolean, tick: boolean): Promise<void> {
    const actor = this.actors.get(actorId)
    const target = this.actors.get(targetId)
    if (!target) return
    const d = this.dpr
    if (actor && !tick && actor.id !== target.id) {
      const base = this.basePos(actor)
      this.tweens.add({ targets: actor.sprite, y: base.y + (actor.side === 'ally' ? -18 : 14) * d, duration: 110, yoyo: true, ease: 'Quad.easeOut' })
      await this.wait(110)
    }
    const color = kind ? KIND_COLOR[kind] ?? 0xffffff : 0xffffff
    if (tick) this.burst(targetId, 0xff8a5c, 8, -1)
    else if (kind && WEAPONS.has(kind)) this.slash(targetId, weak ? 0xffd84d : 0xffffff)
    else if (kind === 'lightning') this.bolt(targetId)
    else this.burst(targetId, color, weak ? 22 : 14, 0)
    this.flash(targetId, 0xffffff)
    const base = this.basePos(target)
    this.tweens.add({ targets: target.sprite, x: base.x + 6 * d, duration: 40, yoyo: true, repeat: 2, onComplete: () => target.sprite.setX(base.x) })
    this.number(targetId, String(amount), target.side === 'ally' ? '#ff8f8f' : weak ? '#ffd84d' : '#ffffff', weak ? 1.15 : 1, weak ? 'WEAK' : undefined)
    await this.wait(tick ? 260 : 300)
  }

  private flash(id: string, color: number): void {
    const sprite = this.actors.get(id)?.sprite
    if (!sprite) return
    sprite.setTint(color).setTintMode(Phaser.TintModes.FILL)
    this.time.delayedCall(70, () => sprite.setTintMode(Phaser.TintModes.MULTIPLY).clearTint())
  }

  private burst(id: string, color: number, count: number, rise: number): void {
    const { x, y } = this.center(id)
    const d = this.dpr
    const emitter = this.add.particles(x, y, 'fx-dot', {
      speed: { min: 40 * d, max: 170 * d }, lifespan: 480, scale: { start: 0.9 * d, end: 0 }, tint: color, blendMode: 'ADD', emitting: false,
      gravityY: rise < 0 ? -220 * d : 0,
    })
    this.fx.add(emitter)
    emitter.explode(count)
    this.time.delayedCall(700, () => emitter.destroy())
  }

  private shards(id: string, count: number, color: number): void {
    const { x, y } = this.center(id)
    const d = this.dpr
    const emitter = this.add.particles(x, y, 'fx-shard', {
      speed: { min: 80 * d, max: 260 * d }, lifespan: 560, rotate: { min: 0, max: 360 }, scale: { start: 0.8 * d, end: 0.2 * d }, tint: color,
      gravityY: 500 * d, emitting: false,
    })
    this.fx.add(emitter)
    emitter.explode(count)
    this.time.delayedCall(800, () => emitter.destroy())
  }

  private slash(id: string, color: number): void {
    const { x, y } = this.center(id)
    const d = this.dpr
    const g = this.add.graphics({ x, y })
    g.lineStyle(5 * d, color, 1)
    g.beginPath()
    g.arc(0, 0, 34 * d, Phaser.Math.DegToRad(200), Phaser.Math.DegToRad(330))
    g.strokePath()
    g.setRotation(Phaser.Math.FloatBetween(-0.6, 0.6))
    this.fx.add(g)
    this.tweens.add({ targets: g, alpha: 0, scale: 1.4, duration: 260, onComplete: () => g.destroy() })
  }

  private bolt(id: string): void {
    const { x, y } = this.center(id)
    const d = this.dpr
    const g = this.add.graphics()
    g.lineStyle(4 * d, 0xffd84d, 1)
    g.beginPath()
    let px = x + Phaser.Math.Between(-20, 20) * d
    let py = 0
    g.moveTo(px, py)
    while (py < y) {
      py = Math.min(y, py + Phaser.Math.Between(14, 26) * d)
      px = x + Phaser.Math.Between(-16, 16) * d
      g.lineTo(px, py)
    }
    g.strokePath()
    this.fx.add(g)
    this.burst(id, 0xffd84d, 10, 0)
    this.tweens.add({ targets: g, alpha: 0, duration: 240, onComplete: () => g.destroy() })
  }

  private ring(id: string, color: number): void {
    const { x, y } = this.center(id)
    const d = this.dpr
    const c = this.add.circle(x, y, 26 * d).setStrokeStyle(3 * d, color, 1)
    this.fx.add(c)
    this.tweens.add({ targets: c, scale: 1.6, alpha: 0, duration: 360, onComplete: () => c.destroy() })
  }

  private text(x: number, y: number, value: string, color: string, size: number): Phaser.GameObjects.Text {
    const d = this.dpr
    const t = this.add.text(x, y, value, {
      fontFamily: '"Outfit Variable", system-ui, sans-serif', fontSize: `${Math.round(size * d)}px`, fontStyle: '800', color,
      stroke: '#0b1118', strokeThickness: Math.max(3, Math.round(size * 0.22 * d)),
    }).setOrigin(0.5)
    this.fx.add(t)
    return t
  }

  private number(id: string, value: string, color: string, scale = 1, tag?: string): void {
    const { x, y } = this.center(id)
    const d = this.dpr
    const t = this.text(x + Phaser.Math.Between(-10, 10) * d, y - 10 * d, value, color, 22 * scale)
    this.tweens.add({ targets: t, y: t.y - 34 * d, alpha: { from: 1, to: 0 }, duration: 760, ease: 'Cubic.easeOut', onComplete: () => t.destroy() })
    if (tag) {
      const w = this.text(x, y - 34 * d, tag, '#ffd84d', 12)
      this.tweens.add({ targets: w, y: w.y - 20 * d, alpha: { from: 1, to: 0 }, duration: 700, onComplete: () => w.destroy() })
    }
  }

  private label(id: string, value: string, color: string): void {
    const actor = this.actors.get(id)
    if (!actor || !value) return
    const d = this.dpr
    const t = this.text((actor.box.x + actor.box.w / 2) * d, (actor.box.y + 10) * d, value, color, 13)
    this.tweens.add({ targets: t, y: t.y - 16 * d, alpha: { from: 1, to: 0 }, duration: 900, onComplete: () => t.destroy() })
  }

  private async breakFx(id: string): Promise<void> {
    const actor = this.actors.get(id)
    const d = this.dpr
    this.flash(id, 0xffffff)
    this.shards(id, 18, 0xdfe8f3)
    this.burst(id, 0xffd84d, 24, 0)
    this.cameras.main.shake(240, 0.008)
    const { x, y } = this.center(id)
    const t = this.text(x, y - 20 * d, 'BREAK!', '#ffd84d', 30)
    t.setScale(0.4)
    this.tweens.add({ targets: t, scale: 1, duration: 180, ease: 'Back.easeOut' })
    this.tweens.add({ targets: t, alpha: 0, delay: 520, duration: 260, onComplete: () => t.destroy() })
    if (actor) {
      actor.sprite.setTint(0x9a9aa6)
      this.tweens.add({ targets: actor.sprite, angle: -6, duration: 200, ease: 'Back.easeOut' })
    }
    await this.wait(640)
  }

  private async ko(id: string): Promise<void> {
    const actor = this.actors.get(id)
    if (!actor) return
    const d = this.dpr
    actor.idle?.stop()
    actor.idle = null
    if (actor.side === 'enemy') {
      this.shards(id, 10, 0xb0b8c4)
      this.tweens.add({ targets: actor.sprite, alpha: 0.12, y: actor.sprite.y + 16 * d, duration: 360 })
    } else {
      this.tweens.add({ targets: actor.sprite, alpha: 0.35, duration: 300 })
      actor.sprite.setTint(0x777777)
    }
    this.tweens.add({ targets: actor.shadow, alpha: 0.1, duration: 300 })
    await this.wait(380)
  }

  /** A Union Burst-style cut-in: a dark band, her bust sliding across and the Limit Break's name. */
  private async cutIn(id: string, name: string): Promise<void> {
    const { w, h } = this.cssSize
    const d = this.dpr
    const bandH = h * 0.34 * d
    const y = h * 0.3 * d
    const band = this.add.rectangle(w * d / 2, y, w * d, bandH, 0x0b1118, 0.82).setScale(1, 0)
    const stripe = this.add.rectangle(w * d / 2, y + bandH / 2, w * d, 3 * d, 0xffd84d, 1).setScale(0, 1)
    this.fx.add([band, stripe])
    this.tweens.add({ targets: band, scaleY: 1, duration: 140, ease: 'Quad.easeOut' })
    this.tweens.add({ targets: stripe, scaleX: 1, duration: 260 })
    const key = `bust-${id}`
    let bust: Phaser.GameObjects.Image | null = null
    if (this.textures.exists(key)) {
      bust = this.add.image(-w * 0.3 * d, y + bandH / 2, key).setOrigin(0.5, 1)
      bust.setScale((bandH * 1.05) / bust.height)
      this.fx.add(bust)
      this.tweens.add({ targets: bust, x: w * 0.3 * d, duration: 320, ease: 'Cubic.easeOut' })
    }
    const title = this.text(w * 0.68 * d, y - 12 * d, 'LIMIT BREAK', '#ffd84d', 20).setAlpha(0)
    const sub = this.text(w * 0.68 * d, y + 14 * d, name, '#ffffff', 15).setAlpha(0)
    this.tweens.add({ targets: [title, sub], alpha: 1, x: `-=${12 * d}`, duration: 260, delay: 120 })
    this.burst(id, 0xffd84d, 20, -1)
    await this.wait(820)
    this.tweens.add({ targets: [band, stripe, title, sub, ...(bust ? [bust] : [])], alpha: 0, duration: 180, onComplete: () => {
      for (const o of [band, stripe, title, sub, bust]) o?.destroy()
    } })
    await this.wait(160)
  }

  private async result(label: 'victory' | 'loss'): Promise<void> {
    const d = this.dpr
    for (const actor of this.actors.values()) {
      if (actor.side !== 'ally' || actor.sprite.alpha < 0.5) continue
      if (label === 'victory') {
        const key = `cheer-${actor.id}`
        actor.idle?.stop()
        actor.idle = null
        if (this.textures.exists(key)) actor.sprite.setTexture(key).setDisplaySize(actor.box.w * d, actor.box.h * d)
        this.tweens.add({ targets: actor.sprite, y: actor.sprite.y - 16 * d, duration: 180, yoyo: true, repeat: 1, ease: 'Quad.easeOut', delay: Phaser.Math.Between(0, 160) })
      } else {
        actor.sprite.setTint(0x8a8a8a)
      }
    }
    await this.wait(700)
  }
}
