// Where everything sits on the battle stage, in CSS pixels. The Phaser scene draws at these spots and the DOM overlay
// puts its tap targets, bars and badges at the same ones (the Hub's split, D33): the canvas has art and effects, the DOM
// has text and controls.
import type { EnemyRank } from '@rpg/domain'

export interface Box { x: number; y: number; w: number; h: number }
export interface StageLayout {
  enemies: Box[]
  /** Under each foe: name, HP, shield and weaknesses. */
  enemyInfo: Box[]
  allies: Box[]
  /** Under each Uma: HP, MP and her Limit Break. */
  allyInfo: Box[]
}

/** Bust portraits are 320×470. */
const PORTRAIT_ASPECT = 320 / 470
export const ENEMY_INFO_HEIGHT = 46
export const ALLY_INFO_HEIGHT = 34

export function stageLayout(width: number, height: number, ranks: readonly EnemyRank[], allyCount: number): StageLayout {
  const n = Math.max(1, ranks.length)
  const enemyBottom = height * 0.5
  const slot = width / n
  const enemies: Box[] = []
  const enemyInfo: Box[] = []
  ranks.forEach((rank, i) => {
    const scale = rank === 'boss' ? 1.12 : rank === 'sub-boss' ? 1.05 : 0.94
    const h = Math.min(enemyBottom - 8, (slot * 0.96) / PORTRAIT_ASPECT) * scale
    const w = h * PORTRAIT_ASPECT
    const cx = slot * (i + 0.5)
    enemies.push({ x: cx - w / 2, y: enemyBottom - h, w, h })
    enemyInfo.push({ x: cx - slot / 2 + 2, y: enemyBottom + 2, w: slot - 4, h: ENEMY_INFO_HEIGHT })
  })
  const allySlot = width / Math.max(1, allyCount)
  const top = enemyBottom + ENEMY_INFO_HEIGHT + 8
  const size = Math.min(allySlot * 1.05, height - top - ALLY_INFO_HEIGHT)
  const allies: Box[] = []
  const allyInfo: Box[] = []
  for (let i = 0; i < allyCount; i++) {
    const cx = allySlot * (i + 0.5)
    allies.push({ x: cx - size / 2, y: height - ALLY_INFO_HEIGHT - size, w: size, h: size })
    allyInfo.push({ x: cx - allySlot / 2 + 2, y: height - ALLY_INFO_HEIGHT, w: allySlot - 4, h: ALLY_INFO_HEIGHT })
  }
  return { enemies, enemyInfo, allies, allyInfo }
}
