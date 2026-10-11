// Builds the private Azur Lane pack (D76): the Underworld's foes. Reads the ship list captured once from the Azur Lane
// Wiki's Cargo table into content/sources/azurlane-ships.json (two requests: `api.php?action=cargoquery&tables=ships
// &fields=ShipGroup,ShipID,Name,Rarity,Nationality,Type,SubtypeRetro,Class,Remodel,_pageName=Page&limit=500&offset=0|500`).
// The wiki's robots.txt keeps crawlers off /w/, so this script never calls the API: it fetches each ship's shipyard bust
// (`<Name>ShipyardIcon.png`, 192×256 with a transparent background) from the wiki's image host, whose path is the md5
// of the file name, one request a second (the Crawl-delay). Standard and Research ships only: no collabs, META, chibi
// or µ (idol) variants, nor the Universal Bulins. Writes content/release/azurlane/cast.json and
// azurlane/cast/al-<slug>.<hash>.png, all gitignored; `bash scripts/cast/publish.sh azurlane` uploads them to the
// private bucket.
//
//   node scripts/cast/import-azurlane.mjs
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { cachedFetcher, pngSize, ROOT, slugOf, writePack } from './pack.mjs'

const IMAGE_HOST = 'https://azurlane.netojuu.com/images'
/** Each nation's color, behind her face on the stage map. */
const NATION_COLOR = {
  'Sakura Empire': '#d94a5a', 'Eagle Union': '#3b6fd8', 'Royal Navy': '#c9a227', 'Iron Blood': '#8c2f39', 'Northern Parliament': '#6fb3d9',
  'Sardegna Empire': '#3a9d5d', 'Iris Libre': '#7a6fd8', 'Dragon Empery': '#e0b340', 'Vichya Dominion': '#5a5f73', Tempesta: '#2b8a8a',
  'Kingdom of Tulipa': '#e07a2f', 'Liga de Pedrería': '#b0563a',
}

/** MediaWiki's upload path: /<h0>/<h0h1>/<File_name>, h the md5 of the underscored name. */
function imageUrl(file) {
  const name = file.normalize('NFC').replaceAll(' ', '_')
  const h = createHash('md5').update(name, 'utf8').digest('hex')
  return `${IMAGE_HOST}/${h[0]}/${h.slice(0, 2)}/${encodeURIComponent(name)}`
}

const source = JSON.parse(await readFile(join(ROOT, 'content/sources/azurlane-ships.json'), 'utf8'))
const ships = source.ships.filter((s) => (s.ShipGroup === 'Standard' || s.ShipGroup === 'Research') && s.Nationality !== 'Universal' && !s.Name.endsWith(' µ'))
const fetchOnce = cachedFetcher(join(ROOT, 'content/.cache/azurlane'), 1000)

const members = []
const missing = []
const seen = new Set()
for (const [i, ship] of ships.entries()) {
  const id = `al-${slugOf(ship.Name)}`
  if (seen.has(id)) throw new Error(`two ships slug to ${id}`)
  seen.add(id)
  const bytes = await fetchOnce(`${id}.png`, imageUrl(`${ship.Name}ShipyardIcon.png`))
  if (!bytes) {
    missing.push(ship.Name)
    continue
  }
  pngSize(bytes) // rejects an error page
  members.push({ id, name: ship.Name, nameJa: '', color: NATION_COLOR[ship.Nationality] ?? '#888888', nation: ship.Nationality, hull: ship.Type,
    rarity: ship.Rarity, bytes, ext: 'png' })
  process.stdout.write(`\r${i + 1}/${ships.length}`)
}
const total = await writePack('azurlane', { franchise: 'azurlane', source: 'https://azurlane.koumakan.jp/', capturedAt: source.capturedAt }, members)
console.log(`\n${members.length} ships, ${(total / 1024 / 1024).toFixed(1)} MiB → content/release/azurlane/cast.json`)
if (missing.length) console.log(`No shipyard bust for ${missing.length}: ${missing.join(', ')}`)
