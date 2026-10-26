import { describe, expect, it } from 'vitest'
import { observatoryLayoutV3 } from './layout-v3'

describe('R2 Observatory layout', () => {
  it('keeps all 22 nodes inside 360×360, apart, with her moon on its own orbit', () => {
    const nodes = observatoryLayoutV3()
    expect(nodes).toHaveLength(22)
    expect(new Set(nodes.map((node) => node.id)).size).toBe(22)
    for (const node of nodes) {
      expect(node.x - node.r, node.id).toBeGreaterThanOrEqual(0)
      expect(node.y - node.r, node.id).toBeGreaterThanOrEqual(0)
      expect(node.x + node.r, node.id).toBeLessThanOrEqual(360)
      expect(node.y + node.r, node.id).toBeLessThanOrEqual(360)
    }
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i]!, b = nodes[j]!
      const distance = Math.hypot(a.x - b.x, a.y - b.y)
      expect(distance, `${a.id} overlaps ${b.id}`).toBeGreaterThanOrEqual(a.r + b.r)
      expect(distance, `${a.id} and ${b.id} need separate 44px targets`).toBeGreaterThanOrEqual(44)
    }
    expect(nodes.filter((node) => node.orbit === 'template').map((node) => node.id)).toEqual(['template:1', 'template:2'])
  })
})
