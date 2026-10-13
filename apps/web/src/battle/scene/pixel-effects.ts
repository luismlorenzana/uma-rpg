import { rpgNode, rpgWeaponKind, type BattleState, type RpgDamageKind } from '@rpg/domain'
import type Phaser from 'phaser'
import type { Box } from '../stage-layout'

type Image = Phaser.GameObjects.Image
type Timer = Phaser.Time.TimerEvent
type Target = { box: Box; side: 'ally' | 'enemy' }
/** The engine retains the skill ref, not an art id. No familiar survives its owner's KO. */
export function lingeringFamiliars(state: BattleState) {
  return state.summons.flatMap((s) => {
    const node = rpgNode(s.ref.id)
    if (!node?.skill.summon || !state.units.some((u) => u.id === s.allyId && u.hp > 0)) return []
    return [{ id: s.allyId, kind: rpgWeaponKind(node.weapon), key: `${s.ref.tier}:${s.ref.id}` }]
  })
}
/** Positions come from the actors on the current wave, never input.enemies. Whole device pixels only. */
export function impactPlacement({ box, side }: Target, dpr: number) {
  return {
    x: Math.round((box.x + box.w / 2) * dpr),
    y: Math.round((box.y + box.h * (side === 'enemy' ? 0.45 : 0.55)) * dpr),
    scale: Math.max(1, Math.min(Math.round(2 * dpr), Math.floor(Math.min(box.w, box.h) * dpr / 32))),
  }
}

/** Sprite playback uses the scene clock, so pause and 1×/2×/4× apply to every frame. */
export class PixelEffects {
  private hits = new Map<Image, Timer[]>()
  private familiars = new Map<string, { kind: RpgDamageKind; key: string; image: Image; timer: Timer | null }>()
  constructor(private scene: Phaser.Scene) {}

  hit(kind: RpgDamageKind | null, target: Target, dpr: number, reduced: boolean): boolean {
    if (!kind || !this.has(`hit/${kind}-3`)) return false
    const p = impactPlacement(target, dpr)
    const image = this.scene.add.image(p.x, p.y, 'battle-fx', `hit/${kind}-${reduced ? 3 : 0}`).setScale(p.scale).setDepth(2)
    const timers: Timer[] = []
    if (!reduced) for (let pose = 1; pose <= 3; pose++) {
      timers.push(this.scene.time.delayedCall(pose * 70, () => image.setFrame(`hit/${kind}-${pose}`)))
    }
    timers.push(this.scene.time.delayedCall(reduced ? 500 : 300, () => {
      image.destroy()
      this.hits.delete(image)
    }))
    this.hits.set(image, timers)
    return true
  }

  sync(state: BattleState, actors: ReadonlyMap<string, Target>, width: number, dpr: number, reduced: boolean): void {
    const next = lingeringFamiliars(state).filter((s) => actors.has(s.id) && this.has(`familiar/${s.kind}-0`))
    for (const [id, old] of this.familiars) {
      if (next.some((s) => s.id === id && s.key === old.key)) continue
      old.timer?.remove()
      old.image.destroy()
      this.familiars.delete(id)
    }
    for (const s of next) {
      let familiar = this.familiars.get(s.id)
      if (!familiar) {
        const image = this.scene.add.image(0, 0, 'battle-fx', `familiar/${s.kind}-0`).setDepth(1)
        familiar = { ...s, image, timer: null }
        if (!reduced) {
          let pose = 0
          familiar.timer = this.scene.time.addEvent({ delay: 650, loop: true, callback: () => {
            pose = 1 - pose
            image.setFrame(`familiar/${s.kind}-${pose}`)
          } })
        }
        this.familiars.set(s.id, familiar)
      }
      const box = actors.get(s.id)!.box, scale = Math.max(1, Math.round(dpr)), half = 16 * scale
      // Above the owner's right shoulder; never spill past a phone's edges or cover her bars.
      const x = Math.max(half, Math.min(width * dpr - half, (box.x + box.w * 0.78) * dpr))
      familiar.image.setPosition(Math.round(x), Math.round((box.y + box.h * 0.2) * dpr)).setScale(scale)
    }
  }

  clearHits(): void {
    for (const [image, timers] of this.hits) {
      for (const t of timers) t.remove()
      image.destroy()
    }
    this.hits.clear()
  }
  destroy(): void {
    this.clearHits()
    for (const f of this.familiars.values()) { f.timer?.remove(); f.image.destroy() }
    this.familiars.clear()
  }
  private has(frame: string): boolean {
    return this.scene.textures.exists('battle-fx') && this.scene.textures.get('battle-fx').has(frame)
  }
}
