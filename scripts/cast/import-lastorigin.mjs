// Builds the private Last Origin pack (D81): Ancient Ruins, Canyon and Volcano foes. The owner runs this one by hand:
// lastorigin.wiki.gg's robots.txt allows ordinary scripts its /wiki/ pages and /images/, but asks AI agents (Claude's
// included) to stay away, so Claude wrote it and never runs it. It reads the wiki's Unit_List page (every unit, by type,
// role and starting rank; kept in content/sources once fetched), leaves out the collab units, and for each unit fetches
// her full art at 300 px (the censored version when the wiki has one) plus her face icon at 128 px, one request a
// second. Writes content/release/lastorigin/, gitignored; `bash scripts/cast/publish.sh lastorigin` uploads it.
//
//   node scripts/cast/import-lastorigin.mjs          # fetch and build
//   node scripts/cast/import-lastorigin.mjs --dry    # parse the saved list only, no image requests
import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { cachedFetcher, imageInfo, ROOT, slugOf, writePack } from './pack.mjs'

const WIKI = 'https://lastorigin.wiki.gg'
const LIST = join(ROOT, 'content/sources/lastorigin-unit-list.html')
/** Category:Another_Game: units from other games. */
const COLLAB = new Set(['Chii_Aruel', 'Dhana_Opini', 'Ephnel', 'Haru_Estia', 'Iris_Yuma', 'Koyori', 'Lee_Nabi', 'Lily_Bloommerchen', 'Orellia', 'Sengoku_Kaen', 'Stella_Unibell', 'Tachi'])
const COLOR = { Light: '#5a8fd9', Heavy: '#c4553b', Flying: '#5fb88a' }
const dry = process.argv.includes('--dry')
const fetchOnce = cachedFetcher(join(ROOT, 'content/.cache/lastorigin'), 1000)

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
const text = (html) => html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).join(' ')

/** Units from the Unit_List tables: a type per table, roles across, starting ranks down, icon links in each cell. */
function parseUnits(html) {
  const body = html.slice(html.indexOf('mw-parser-output'))
  const units = new Map()
  for (const table of body.matchAll(/<table[^>]*wikitable[^>]*>([\s\S]*?)<\/table>/g)) {
    let type = null
    let roles = []
    for (const [, row] of table[1].matchAll(/<tr>([\s\S]*?)<\/tr>/g)) {
      const heads = [...row.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map((m) => text(m[1]))
      const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => m[1])
      if (heads.length && !cells.length) {
        if (heads.length === 1) type = heads[0]
        else roles = heads.slice(1)
        continue
      }
      cells.slice(1).forEach((cell, i) => {
        for (const m of cell.matchAll(/<a href="\/wiki\/([^"]+)" title="([^"]+)"><img/g)) {
          if (!units.has(m[1])) units.set(m[1], { slug: m[1], name: decode(m[2]), type, role: roles[i] ?? null, rank: text(cells[0]) })
        }
      })
    }
  }
  return [...units.values()]
}

if (!existsSync(LIST)) {
  const bytes = await fetchOnce('Unit_List.html', `${WIKI}/wiki/Unit_List`)
  if (!bytes) throw new Error('Unit_List not found')
  await writeFile(LIST, bytes)
}
const units = parseUnits(await readFile(LIST, 'utf8')).filter((u) => !COLLAB.has(u.slug))
console.log(`${units.length} units (no collabs): ${units.slice(0, 5).map((u) => `${u.name} (${u.type} ${u.role}, ${u.rank})`).join(', ')} …`)
if (dry) process.exit(0)

const thumb = (file, width) => `${WIKI}/images/thumb/${encodeURIComponent(file)}/${width}px-${encodeURIComponent(file)}`
const members = []
const missing = []
for (const u of units) {
  const key = slugOf(u.slug)
  const art = (await fetchOnce(`${key}-censored.png`, thumb(`${u.slug}_Censored.png`, 300))) ?? (await fetchOnce(`${key}.png`, thumb(`${u.slug}.png`, 300)))
  if (!art) {
    missing.push(u.name)
    continue
  }
  imageInfo(art) // rejects an error page
  const face = await fetchOnce(`${key}-face.png`, thumb(`${u.slug}_Icon.png`, 128))
  members.push({ id: `lo-${key}`, name: u.name, nameJa: '', color: COLOR[u.type] ?? '#888888', type: u.type, role: u.role, bytes: art, ...(face ? { face } : {}) })
  process.stdout.write(`\r${members.length + missing.length}/${units.length}`)
}
const total = await writePack('lastorigin', { franchise: 'lastorigin', source: `${WIKI}/wiki/Unit_List`, capturedAt: new Date().toISOString().slice(0, 10) }, members)
console.log(`\n${members.length} units, ${(total / 1024 / 1024).toFixed(1)} MiB → content/release/lastorigin/cast.json`)
if (missing.length) console.log(`No art for ${missing.length}: ${missing.join(', ')}`)
