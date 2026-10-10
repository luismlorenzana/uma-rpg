import { mkdtemp, mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { cacheControlFor, contentTypeFor, DirectoryMasterSource, safeMasterPath } from './master-source'

describe('master data proxy', () => {
  it('allows only release paths', () => {
    expect(safeMasterPath('channels/v1/latest.json')).toBe('channels/v1/latest.json')
    expect(safeMasterPath('/files/data/outfits.abc.json')).toBe('files/data/outfits.abc.json')
    expect(safeMasterPath('files/../secrets.json')).toBeNull()
    expect(safeMasterPath('files/.hidden')).toBeNull()
    expect(safeMasterPath('content/overrides/x.json')).toBeNull()
    expect(safeMasterPath('files//double')).toBeNull()
  })

  it('caches hash-named files forever and revalidates pointers', () => {
    expect(cacheControlFor('files/art/a.0123.webp')).toContain('immutable')
    expect(cacheControlFor('channels/v1/latest.json')).toBe('private, no-cache')
    expect(cacheControlFor('manifests/v1/abc.json')).toBe('private, no-cache')
    expect(contentTypeFor('files/x.webp')).toBe('image/webp')
    expect(contentTypeFor('channels/v1/latest.json')).toBe('application/json')
  })

  it('serves a local release folder like the bucket', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'rpg-master-'))
    await mkdir(join(dir, 'files', 'data'), { recursive: true })
    await writeFile(join(dir, 'manifest.json'), JSON.stringify({ schemaMajor: 1, version: 'abcdef123456', createdAt: '2026-10-10T00:00:00.000Z' }))
    await writeFile(join(dir, 'files', 'data', 'x.json'), '{"ok":true}')
    const source = new DirectoryMasterSource(dir)
    const channel = JSON.parse(new TextDecoder().decode((await source.read('channels/v1/latest.json')) ?? new Uint8Array()))
    expect(channel).toMatchObject({ version: 'abcdef123456', manifest: 'manifests/v1/abcdef123456.json', channel: 'latest' })
    expect(await source.read('manifests/v1/abcdef123456.json')).not.toBeNull()
    expect(new TextDecoder().decode((await source.read('files/data/x.json')) ?? new Uint8Array())).toBe('{"ok":true}')
    expect(await source.read('files/data/missing.json')).toBeNull()
  })
})
