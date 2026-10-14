import { describe, expect, it } from 'vitest'
import { contentCacheControl, safeContentPath } from './content-source'

describe('content paths', () => {
  it('serves only the enemy list and its hash-named images (D135)', () => {
    expect(safeContentPath('enemies.json')).toBe('enemies.json')
    expect(safeContentPath('/enemies/al-admiral-graf-spee-art.3c29e295.webp')).toBe('enemies/al-admiral-graf-spee-art.3c29e295.webp')
    expect(safeContentPath('enemies/nk-c550-01-splash.0a1b2c3d.webp')).toBe('enemies/nk-c550-01-splash.0a1b2c3d.webp')
    expect(safeContentPath('enemies/gw-92870-face.0a1b2c3d.webp')).toBe('enemies/gw-92870-face.0a1b2c3d.webp')
    for (const bad of ['cast.json', 'nikke/cast.json', 'cast/karyl.3c29e295.webp', 'enemies/../save.json', 'enemies/al-x-art.webp',
      'enemies/al-x-art.3c29e295.png', 'enemies/al-x-bust.3c29e295.webp', 'enemies/AL-x-art.3c29e295.webp', 'enemies/sub/al-x-art.3c29e295.webp',
      'enemies.json/../x', 'sources/list.json', 'enemies/-art.3c29e295.webp']) {
      expect(safeContentPath(bad)).toBeNull()
    }
    expect(contentCacheControl('enemies.json')).toBe('private, no-cache')
    expect(contentCacheControl('enemies/al-x-art.3c29e295.webp')).toContain('immutable')
  })
})
