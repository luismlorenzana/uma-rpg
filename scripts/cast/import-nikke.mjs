// Builds the private NIKKE pack (D81): Desert, Tundra and Storm Peaks foes. Two lists captured once into content/sources:
// Prydwen's NIKKE sitemap (`https://www.prydwen.gg/sitemap/9.xml`, the playable roster as /nikke/characters/<slug>;
// robots allows sitemaps) and nikke-db's `src/utils/json/l2d.json` on GitHub (English names and ids). A base character
// is a sitemap slug that matches a name with an id below c800: no collabs (c8xx), alternate versions ("Rapi: Red Hood")
// or Treasure pages. Each portrait is her full-body art from the NIKKE wiki's image host (Fandom's CDN, which robots
// leaves open; the wiki's own pages are never touched), its path the md5 of `<Name>_FB.png`, resized to 300 px wide
// WebP, one request a second. Writes content/release/nikke/, gitignored; `bash scripts/cast/publish.sh nikke` uploads it.
//
//   node scripts/cast/import-nikke.mjs
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { cachedFetcher, headBox, imageInfo, ROOT, slugOf, writePack } from './pack.mjs'

const CDN = 'https://static.wikia.nocookie.net/nikke-goddess-of-victory-international/images'
/** Base characters newer than nikke-db's list. */
const EXTRA = ['Siren']
/** Each manufacturer's color would be nicer; the list doesn't carry it for newer units, so one NIKKE red. */
const COLOR = '#c8363d'
/** Head and shoulders in full-body art, for small round avatars when one image can't be measured. */
const AVATAR = { x: 0.5, y: 0.2, size: 0.4 }

const sitemap = await readFile(join(ROOT, 'content/sources/nikke-prydwen-sitemap.xml'), 'utf8')
const slugs = new Set([...sitemap.matchAll(/\/nikke\/characters\/([^<]+)<\/loc>/g)].map((m) => m[1]).filter((s) => !s.endsWith('-treasure')))
const l2d = JSON.parse(await readFile(join(ROOT, 'content/sources/nikke-l2d.json'), 'utf8'))
const names = new Map()
for (const { id, name } of l2d) {
  if (!/^c\d{3}$/.test(id) || id >= 'c800' || name.includes(':')) continue
  const slug = slugOf(name)
  if (slugs.has(slug) && (!names.has(slug) || id < names.get(slug).id)) names.set(slug, { id, name })
}
for (const name of EXTRA) if (slugs.has(slugOf(name))) names.set(slugOf(name), { id: '', name })

const fetchOnce = cachedFetcher(join(ROOT, 'content/.cache/nikke'), 1000)
const members = []
const missing = []
for (const [slug, { name }] of [...names].sort((a, b) => a[0].localeCompare(b[0]))) {
  const file = `${name.replaceAll(' ', '_')}_FB.png`
  const h = createHash('md5').update(file, 'utf8').digest('hex')
  const bytes = await fetchOnce(`${slug}.webp`, `${CDN}/${h[0]}/${h.slice(0, 2)}/${encodeURIComponent(file)}/revision/latest/scale-to-width-down/300`)
  if (!bytes) {
    missing.push(name)
    continue
  }
  imageInfo(bytes) // rejects an error page
  const avatar = headBox(bytes)
  members.push({ id: `nk-${slug}`, name, nameJa: '', color: COLOR, ...(avatar ? { avatar } : {}), bytes })
  process.stdout.write(`\r${members.length + missing.length}/${names.size}`)
}
const total = await writePack('nikke', { franchise: 'nikke', source: 'https://www.prydwen.gg/nikke/characters + NIKKE wiki art', capturedAt: '2026-10-11', avatar: AVATAR }, members)
console.log(`\n${members.length} NIKKEs, ${(total / 1024 / 1024).toFixed(1)} MiB → content/release/nikke/cast.json`)
if (missing.length) console.log(`No full-body art for ${missing.length}: ${missing.join(', ')}`)
