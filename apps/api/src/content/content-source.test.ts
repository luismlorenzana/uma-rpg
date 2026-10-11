import { describe, expect, it } from 'vitest'
import { contentCacheControl, safeContentPath } from './content-source'

describe('content paths', () => {
  it('serves only the cast list and hash-named portraits', () => {
    expect(safeContentPath('cast.json')).toBe('cast.json')
    expect(safeContentPath('/cast/karyl.3c29e295.webp')).toBe('cast/karyl.3c29e295.webp')
    for (const bad of ['cast/../save.json', 'cast/karyl.webp', 'sources/priconne-characters.json', '.cache/cast/karyl.webp', 'cast/Karyl.3c29e295.webp']) {
      expect(safeContentPath(bad)).toBeNull()
    }
    expect(contentCacheControl('cast.json')).toBe('private, no-cache')
    expect(contentCacheControl('cast/karyl.3c29e295.webp')).toContain('immutable')
  })
})
