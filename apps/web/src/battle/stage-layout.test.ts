import { describe, expect, it } from 'vitest'
import { ENEMY_INFO_HEIGHT, stageLayout } from './stage-layout'

describe('stage layout', () => {
  it('stands up to five foes in one row on the floor line', () => {
    const l = stageLayout(390, 560, ['regular', 'regular', 'boss', 'regular', 'regular'], 5)
    expect(l.enemies).toHaveLength(5)
    expect(new Set(l.enemies.map((b) => Math.round(b.y + b.h)))).toEqual(new Set([280]))
  })

  it('splits six to eight foes into two rows that never overlap, and keeps 44 pt targets at 375 px (W3)', () => {
    for (const n of [6, 7, 8]) {
      const l = stageLayout(375, 520, Array(n).fill('regular'), 5)
      const back = Math.ceil(n / 2)
      expect(l.enemies).toHaveLength(n)
      const backBottom = l.enemies[0]!.y + l.enemies[0]!.h
      const frontTop = Math.min(...l.enemies.slice(back).map((b) => b.y))
      expect(backBottom + ENEMY_INFO_HEIGHT).toBeLessThanOrEqual(frontTop)
      expect(l.enemies.every((b) => b.w >= 44 && b.h >= 44 && b.x >= 0 && b.x + b.w <= 375 && b.y >= 0)).toBe(true)
    }
  })
})
