import { readFile } from 'node:fs/promises'
import { resolve, sep } from 'node:path'
import type { MasterSource } from '../master/master-source'

/**
 * uma-rpg's own private content: the enemy release (D135), `enemies.json` and its hash-named images
 * (`enemies/<unit>-<face|art|splash>.<hash8>.webp`). Nothing else is served. Null when refused.
 */
export function safeContentPath(raw: string): string | null {
  const path = raw.replace(/^\/+/, '')
  if (path === 'enemies.json') return path
  return /^enemies\/[a-z0-9]+(-[a-z0-9]+)*-(face|art|splash)\.[a-f0-9]{8}\.webp$/.test(path) && path.length <= 100 ? path : null
}

export function contentCacheControl(path: string): string {
  return path === 'enemies.json' ? 'private, no-cache' : 'private, max-age=31536000, immutable'
}

/** Local dev: the repo's gitignored `content/enemies-release`. */
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
