import { describe, expect, it } from 'vitest'
import { neighbourPage, swipeDirection } from './swipe'

describe('hub swipes', () => {
  it('needs a long, mostly horizontal drag', () => {
    expect(swipeDirection({ x: 200, y: 300 }, { x: 120, y: 310 })).toBe(1)
    expect(swipeDirection({ x: 100, y: 300 }, { x: 180, y: 290 })).toBe(-1)
    expect(swipeDirection({ x: 200, y: 300 }, { x: 150, y: 300 })).toBe(0)
    expect(swipeDirection({ x: 200, y: 300 }, { x: 110, y: 380 })).toBe(0)
  })

  it('stops at the first and last pages', () => {
    expect(neighbourPage('wilds', -1)).toBeNull()
    expect(neighbourPage('wilds', 1)).toBe('learning')
    expect(neighbourPage('town', 1)).toBeNull()
    expect(neighbourPage('town', -1)).toBe('learning')
  })
})
