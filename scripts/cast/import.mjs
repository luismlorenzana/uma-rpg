// Builds the private PriConne cast (D50): reads the character list captured from the official site into
// content/sources/priconne-characters.json, fetches each playable character's bust portrait once (the image CDN resizes
// and encodes WebP), and writes content/release/cast.json plus content/release/cast/<slug>.<hash>.webp.
// Everything it writes is gitignored; `scripts/cast/publish.sh` uploads it to the private bucket.
//
//   node scripts/cast/import.mjs            # fetch what's missing, reuse the cache
//   node scripts/cast/import.mjs --refresh  # fetch every portrait again
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

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

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex')
const nameOf = (slug) => NAMES[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1)

/** Width and height of a WebP (VP8X, VP8L or VP8). */
function webpSize(b) {
  if (b.toString('ascii', 0, 4) !== 'RIFF' || b.toString('ascii', 8, 12) !== 'WEBP') throw new Error('not a WebP')
  const chunk = b.toString('ascii', 12, 16)
  if (chunk === 'VP8X') return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) }
  if (chunk === 'VP8L') {
    const bits = b.readUInt32LE(21)
    return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) }
  }
  if (chunk === 'VP8 ') return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff }
  throw new Error(`unknown WebP chunk ${chunk}`)
}

async function portrait(base, character) {
  const cached = join(CACHE, `${character.slug}.webp`)
  if (!refresh && existsSync(cached)) return readFile(cached)
  const url = `${base}${character.panel}?w=${PORTRAIT_WIDTH}&fm=webp&q=80`
  const response = await fetch(url, { headers: { 'user-agent': 'uma-rpg-cast-import (private, one-time)' } })
  if (!response.ok) throw new Error(`${character.slug}: HTTP ${response.status}`)
  const bytes = Buffer.from(await response.arrayBuffer())
  webpSize(bytes) // rejects an error page
  await writeFile(cached, bytes)
  return bytes
}

const source = JSON.parse(await readFile(SOURCE, 'utf8'))
const characters = source.characters.filter((c) => !NOT_PLAYABLE.has(c.slug))
await mkdir(CACHE, { recursive: true })
await rm(join(RELEASE, 'cast'), { recursive: true, force: true })
await mkdir(join(RELEASE, 'cast'), { recursive: true })

const members = []
// Four at a time, once: the CDN caches for a year.
for (let i = 0; i < characters.length; i += 4) {
  const batch = characters.slice(i, i + 4)
  const images = await Promise.all(batch.map((c) => portrait(source.assetBase, c)))
  batch.forEach((c, j) => {
    const bytes = images[j]
    const path = `cast/${c.slug}.${sha256(bytes).slice(0, 8)}.webp`
    members.push({ id: c.slug, name: nameOf(c.slug), nameJa: c.nameJa, color: c.color, art: { path, ...webpSize(bytes), bytes: bytes.length } })
  })
  await Promise.all(batch.map((c, j) => writeFile(join(RELEASE, members[i + j].art.path), images[j])))
  process.stdout.write(`\r${members.length}/${characters.length}`)
}
members.sort((a, b) => a.id.localeCompare(b.id))
const body = JSON.stringify({ schemaVersion: 1, source: source.source, capturedAt: source.capturedAt, members })
await writeFile(join(RELEASE, 'cast.json'), body)
const total = members.reduce((n, m) => n + m.art.bytes, 0)
console.log(`\n${members.length} cast members, ${(total / 1024).toFixed(0)} KiB of portraits → content/release/cast.json (${(await readdir(join(RELEASE, 'cast'))).length} files)`)
