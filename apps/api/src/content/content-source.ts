import { readFile } from 'node:fs/promises'
import { resolve, sep } from 'node:path'
import type { MasterSource } from '../master/master-source'

/**
 * uma-rpg's own private content: the foes' faces by franchise (D50, D76, D81, D85). PriConne's pack sits at the root, the
 * others in their own folders; only each `cast.json` and its hash-named portraits are served. Null when refused.
 */
const PACK = '((azurlane|lastorigin|destinychild|nikke|girlsfrontline)\\/)?'
export function safeContentPath(raw: string): string | null {
  const path = raw.replace(/^\/+/, '')
  if (new RegExp(`^${PACK}cast\\.json$`).test(path)) return path
  return new RegExp(`^${PACK}cast\\/[a-z0-9_-]{1,60}\\.[a-f0-9]{8}\\.(webp|png)$`).test(path) ? path : null
}

export function contentCacheControl(path: string): string {
  return path.endsWith('cast.json') ? 'private, no-cache' : 'private, max-age=31536000, immutable'
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
