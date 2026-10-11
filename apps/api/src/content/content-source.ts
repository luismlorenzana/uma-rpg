import { readFile } from 'node:fs/promises'
import { resolve, sep } from 'node:path'
import type { MasterSource } from '../master/master-source'

/**
 * uma-rpg's own private content (D50): the PriConne cast, built by `scripts/cast/import.mjs`. Only `cast.json` and the
 * hash-named portraits under `cast/` are served. Null when refused.
 */
export function safeContentPath(raw: string): string | null {
  const path = raw.replace(/^\/+/, '')
  if (path === 'cast.json') return path
  return /^cast\/[a-z0-9_-]{1,40}\.[a-f0-9]{8}\.webp$/.test(path) ? path : null
}

export function contentCacheControl(path: string): string {
  return path === 'cast.json' ? 'private, no-cache' : 'private, max-age=31536000, immutable'
}

/** Local dev: the repo's gitignored `content/release`. */
export class DirectoryContentSource implements MasterSource {
  private readonly root: string
  constructor(dir: string) {
    this.root = resolve(dir)
  }

  async read(path: string): Promise<Uint8Array | null> {
    const full = resolve(this.root, path)
    if (!full.startsWith(this.root + sep)) return null
    try {
      return new Uint8Array(await readFile(full))
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null
      throw err
    }
  }
}
