import { describe, expect, it } from 'vitest'
import { contentCacheControl, safeContentPath } from './content-source'

describe('content paths', () => {
  it('serves only the cast list and hash-named portraits', () => {
    expect(safeContentPath('cast.json')).toBe('cast.json')
    expect(safeContentPath('/cast/karyl.3c29e295.webp')).toBe('cast/karyl.3c29e295.webp')
    for (const bad of ['cast/../save.json', 'cast/karyl.webp', 'sources/priconne-characters.json', '.cache/cast/karyl.webp', 'cast/Karyl.3c29e295.webp']) {
      expect(safeContentPath(bad)).toBeNull()
    }
    expect(safeContentPath('azurlane/cast.json')).toBe('azurlane/cast.json')
    expect(safeContentPath('nikke/cast/nk-rapi.0a1b2c3d.png')).toBe('nikke/cast/nk-rapi.0a1b2c3d.png')
    expect(safeContentPath('lastorigin/cast.json')).toBe('lastorigin/cast.json')
    expect(safeContentPath('echocalypse/cast.json')).toBe('echocalypse/cast.json')
    expect(safeContentPath('destinychild/cast/dc-1.0a1b2c3d.webp')).toBe('destinychild/cast/dc-1.0a1b2c3d.webp')
    for (const bad of ['other/cast.json', 'pad/cast.json', 'pad/cast/x.0a1b2c3d.png', 'nikke/cast.json/../x', 'azurlane/sources/list.json']) expect(safeContentPath(bad)).toBeNull()
    expect(contentCacheControl('cast.json')).toBe('private, no-cache')
    expect(contentCacheControl('nikke/cast.json')).toBe('private, no-cache')
    expect(contentCacheControl('cast/karyl.3c29e295.webp')).toContain('immutable')
  })
})
