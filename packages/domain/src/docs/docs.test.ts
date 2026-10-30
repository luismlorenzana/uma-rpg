// Keeps the live docs (docs/game/, D92) true to the rules: every `<!-- live:<key> -->` block must equal what
// `render.ts` makes of the code today. When a rule changes, run `pnpm docs:update` (UPDATE_DOCS=1) to rewrite the blocks.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'
import { renderBlock, type PackageJson } from './render'

const ROOT = join(__dirname, '..', '..', '..', '..')
const DOCS = join(ROOT, 'docs', 'game')
const BLOCK = /<!-- live:([a-z0-9-]+) -->\n[\s\S]*?<!-- \/live -->/g
const PACKAGES = ['package.json', 'apps/web/package.json', 'apps/api/package.json', 'packages/domain/package.json']
const packages = PACKAGES.map((path) => ({ path, json: JSON.parse(readFileSync(join(ROOT, path), 'utf8')) as PackageJson }))

/** A doc with every live block rendered fresh; unknown keys are reported. */
function refresh(text: string, unknown: string[]): string {
  return text.replace(BLOCK, (_, key: string) => {
    const body = renderBlock(key, { packages })
    if (body === null) { unknown.push(key); return `<!-- live:${key} -->\n<!-- /live -->` }
    return `<!-- live:${key} -->\n${body}\n<!-- /live -->`
  })
}

describe('live docs (D92)', () => {
  const files = [...readdirSync(DOCS).filter((f) => f.endsWith('.md')).map((f) => join(DOCS, f)),
    join(ROOT, 'docs', 'design', 'pacing.md')]

  it('has a game manual with live blocks', () => {
    expect(files.length).toBeGreaterThan(5)
    expect(files.some((f) => readFileSync(f, 'utf8').includes('<!-- live:'))).toBe(true)
  })

  it.each(files.map((f) => [relative(ROOT, f), f]))('%s matches the rules (run `pnpm docs:update` to update)', (_, file) => {
    const text = readFileSync(file, 'utf8')
    const unknown: string[] = []
    const fresh = refresh(text, unknown)
    expect(unknown, 'unknown live blocks').toEqual([])
    if (process.env.UPDATE_DOCS && fresh !== text) writeFileSync(file, fresh)
    else expect(fresh === text, `${relative(ROOT, file)} is stale: run \`pnpm docs:update\``).toBe(true)
  })
})
