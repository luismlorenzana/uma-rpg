// Builds the private PriConne cast (D50, D118): reads the character list captured from the official site into
// content/sources/priconne-characters.json and fetches, once each, every playable character's full-body art (`whole`,
// from her character page; the site loads its data in the browser, so the paths were read there) and her list-panel
// bust (`panel`). The image CDN resizes and encodes: the full art comes as a 720 px PNG, is trimmed to the figure and
// shrunk to FULL_SIZE; the bust stays a 320 px WebP and becomes her face icon for small round avatars. Writes
// content/release/cast.json plus content/release/cast/<slug>.<hash>.png and <slug>-face.<hash>.webp. Everything it
// writes is gitignored; `scripts/cast/publish.sh` uploads it to the private bucket.
//
//   node scripts/cast/import.mjs            # fetch what's missing, reuse the cache
//   node scripts/cast/import.mjs --refresh  # fetch every image again
import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { imageInfo, sha256, shrinkPng, trimPng } from './pack.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')
const SOURCE = join(ROOT, 'content/sources/priconne-characters.json')
const CACHE = join(ROOT, 'content/.cache/cast')
const RELEASE = join(ROOT, 'content/release')
const refresh = process.argv.includes('--refresh')

/** Story characters on the official list who aren't playable units: never in the cast. */
const NOT_PLAYABLE = new Set(['zane', 'azold', 'kariza', 'aglaia', 'octo', 'masaki', 'rajraj', 'daigo'])
/** English names where the slug isn't one word. Everything else is the slug, capitalised. */
const NAMES = { louisemarie: 'Louise Marie', omniscientkaiser: 'Omniscient Kaiser', djeeta: 'Djeeta', cleuru: 'Cleuru' }
const PORTRAIT_WIDTH = 320
/** Full art is fetched this wide, then trimmed to the figure. */
const WHOLE_WIDTH = 720
/** The figure's longer side (her height, mostly): sharp on a 3× screen at the largest foe box. */
const FULL_SIZE = 400

const nameOf = (slug) => NAMES[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1)

async function fetchCached(file, url) {
  const cached = join(CACHE, file)
  if (!refresh && existsSync(cached)) return readFile(cached)
  const response = await fetch(url, { headers: { 'user-agent': 'uma-rpg-cast-import (private, one-time)' } })
  if (!response.ok) throw new Error(`${file}: HTTP ${response.status}`)
  const bytes = Buffer.from(await response.arrayBuffer())
  imageInfo(bytes) // rejects an error page
  await writeFile(cached, bytes)
  return bytes
}

/** Her stage art: the full body trimmed and shrunk, else the bust. And her face icon: the bust, when the art isn't. */
async function images(base, c) {
  const panel = await fetchCached(`${c.slug}.webp`, `${base}${c.panel}?w=${PORTRAIT_WIDTH}&fm=webp&q=80`)
  if (!c.whole) return { art: panel }
  const whole = await fetchCached(`${c.slug}-whole.png`, `${base}${c.whole}?w=${WHOLE_WIDTH}&fm=png`)
  return { art: shrinkPng(trimPng(whole), FULL_SIZE), face: panel }
}

const source = JSON.parse(await readFile(SOURCE, 'utf8'))
const characters = source.characters.filter((c) => !NOT_PLAYABLE.has(c.slug))
await mkdir(CACHE, { recursive: true })
await rm(join(RELEASE, 'cast'), { recursive: true, force: true })
await mkdir(join(RELEASE, 'cast'), { recursive: true })

const members = []
const save = async (name, bytes) => {
  const { ext, width, height } = imageInfo(bytes)
  const path = `cast/${name}.${sha256(bytes).slice(0, 8)}.${ext}`
  await writeFile(join(RELEASE, path), bytes)
  return { path, width, height, bytes: bytes.length }
}
// Four at a time, once: the CDN caches for a year.
for (let i = 0; i < characters.length; i += 4) {
  const batch = characters.slice(i, i + 4)
  const fetched = await Promise.all(batch.map((c) => images(source.assetBase, c)))
  for (const [j, c] of batch.entries()) {
    const { art, face } = fetched[j]
    members.push({ id: c.slug, name: nameOf(c.slug), nameJa: c.nameJa, color: c.color, art: await save(c.slug, art),
      ...(face ? { face: await save(`${c.slug}-face`, face) } : {}) })
  }
  process.stdout.write(`\r${members.length}/${characters.length}`)
}
members.sort((a, b) => a.id.localeCompare(b.id))
const body = JSON.stringify({ schemaVersion: 1, source: source.source, capturedAt: source.capturedAt, members })
await writeFile(join(RELEASE, 'cast.json'), body)
const total = members.reduce((n, m) => n + m.art.bytes + (m.face?.bytes ?? 0), 0)
console.log(`\n${members.length} cast members, ${(total / 1024).toFixed(0)} KiB of portraits → content/release/cast.json (${(await readdir(join(RELEASE, 'cast'))).length} files)`)
