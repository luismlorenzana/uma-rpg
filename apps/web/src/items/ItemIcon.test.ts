import atlas from '@luismlorenzana/uma-art/items/atlas.json'
import { ITEMS } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { itemFrame } from './ItemIcon'

describe('item icons', () => {
  it('finds every catalog item on the shared atlas, at the frame the atlas index names', () => {
    const frames = (atlas as { frames: Record<string, { x: number; y: number; grade: number; family: string }> }).frames
    expect(Object.keys(frames).sort()).toEqual(ITEMS.map((i) => i.id).sort())
    for (const item of ITEMS) {
      expect(itemFrame(item.id)).toEqual({ x: frames[item.id]!.x, y: frames[item.id]!.y })
      expect(frames[item.id]).toMatchObject({ grade: item.grade, family: item.family })
    }
  })
})
