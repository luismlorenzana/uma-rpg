import { readFile } from 'node:fs/promises'
import { resolve, sep } from 'node:path'
import { Storage } from '@google-cloud/storage'

/** Reads one release object by its bucket path. Mirrors uma-data's ReleaseSource, but returns null when it's missing. */
export interface MasterSource {
  read(path: string): Promise<Uint8Array | null>
}

const ALLOWED_ROOTS = ['files/', 'manifests/', 'channels/'] as const
const CONTENT_TYPES: Record<string, string> = { json: 'application/json', webp: 'image/webp', png: 'image/png' }

/** Only release paths: under files/, manifests/ or channels/, no traversal, no hidden segments. Null when refused. */
export function safeMasterPath(raw: string): string | null {
  const path = raw.replace(/^\/+/, '')
  if (!ALLOWED_ROOTS.some((root) => path.startsWith(root))) return null
  if (path.split('/').some((part) => part === '' || part === '.' || part === '..' || part.startsWith('.'))) return null
  return path
}

/** Hash-named files never change; channels and manifests must be revalidated. */
export function cacheControlFor(path: string): string {
  return path.startsWith('files/') ? 'private, max-age=31536000, immutable' : 'private, no-cache'
}

export function contentTypeFor(path: string): string {
  return CONTENT_TYPES[path.slice(path.lastIndexOf('.') + 1).toLowerCase()] ?? 'application/octet-stream'
}

/** Local dev: uma-platform's local release folder (`content/release` there), so dev never needs cloud credentials. */
export class DirectoryMasterSource implements MasterSource {
  private readonly root: string
  constructor(dir: string) {
    this.root = resolve(dir)
  }

  async read(path: string): Promise<Uint8Array | null> {
    // The local release keeps the manifest at `manifest.json`; serve it for any `manifests/v1/<version>.json` and
    // synthesize the `latest` channel from it, so the local folder behaves like the bucket.
    const full = resolve(this.root, path)
    if (!full.startsWith(this.root + sep)) return null
    try {
      return new Uint8Array(await readFile(full))
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err
    }
    if (path.startsWith('manifests/') || path.startsWith('channels/')) {
      const manifest = await readFile(resolve(this.root, 'manifest.json')).catch(() => null)
      if (!manifest) return null
      if (path.startsWith('manifests/')) return new Uint8Array(manifest)
      const parsed = JSON.parse(manifest.toString('utf8')) as { version: string; schemaMajor: number; createdAt: string }
      return new TextEncoder().encode(
        JSON.stringify({ schemaMajor: parsed.schemaMajor, channel: 'latest', version: parsed.version, manifest: `manifests/v${parsed.schemaMajor}/${parsed.version}.json`, updatedAt: parsed.createdAt }),
      )
    }
    return null
  }
}

/** Production: the platform's private bucket, read with the runtime service account (read-only, P6). */
export class BucketMasterSource implements MasterSource {
  private readonly bucket
  constructor(bucketName: string) {
    this.bucket = new Storage().bucket(bucketName)
  }

  async read(path: string): Promise<Uint8Array | null> {
    try {
      const [bytes] = await this.bucket.file(path).download()
      return new Uint8Array(bytes)
    } catch (err) {
      if ((err as { code?: number }).code === 404) return null
      throw err
    }
  }
}
