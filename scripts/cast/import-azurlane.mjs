// Builds the private Azur Lane pack (D76): the Underworld's foes. Reads the ship list captured once from the Azur Lane
// Wiki's Cargo table into content/sources/azurlane-ships.json (two requests: `api.php?action=cargoquery&tables=ships
// &fields=ShipGroup,ShipID,Name,Rarity,Nationality,Type,SubtypeRetro,Class,Remodel,_pageName=Page&limit=500&offset=0|500`).
// The wiki's robots.txt keeps crawlers off /w/, so this script never calls the API: it fetches each ship's full-body art
// (`<Name>.png`, her default skin with its rigging, transparent, about 800×1000; the host serves no thumbnails) from the
// wiki's image host, whose path is the md5 of the file name, one request a second (the Crawl-delay). Full art is
// trimmed to the figure and shrunk with macOS `sips` to FULL_SIZE px on its longer side. Her shipyard bust
// (`<Name>ShipyardIcon.png`, 192×256) is her face icon for small round avatars, since rigging, effects and companions
// often sit above her head; a ship without full art shows the bust on the stage too. Standard and Research ships only: no
// collabs, META, chibi or µ (idol) variants, nor the Universal Bulins. Writes content/release/azurlane/cast.json and
// azurlane/cast/al-<slug>.<hash>.png, all gitignored; `bash scripts/cast/publish.sh azurlane` uploads them to the
// private bucket.
//
//   node scripts/cast/import-azurlane.mjs
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { cachedFetcher, pngSize, ROOT, shrinkPng, slugOf, trimPng, writePack } from './pack.mjs'

const IMAGE_HOST = 'https://azurlane.netojuu.com/images'
/** The figure's longer side: sharp on a 3× screen at the largest foe box, about 145 KB a ship. */
const FULL_SIZE = 360
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

/** Full art trimmed to the figure, then shrunk to FULL_SIZE. Trimming reads 8-bit RGBA, so it works on a 2× copy. */
function fullBody(bytes) {
  let png = shrinkPng(bytes, FULL_SIZE * 2)
  try {
    png = trimPng(png)
  } catch {
    // A format the trimmer doesn't read: keep the margins.
  }
  return shrinkPng(png, FULL_SIZE)
}

const source = JSON.parse(await readFile(join(ROOT, 'content/sources/azurlane-ships.json'), 'utf8'))
const ships = source.ships.filter((s) => (s.ShipGroup === 'Standard' || s.ShipGroup === 'Research') && s.Nationality !== 'Universal' && !s.Name.endsWith(' µ'))
const fetchOnce = cachedFetcher(join(ROOT, 'content/.cache/azurlane'), 1000)

const members = []
const busts = []
const missing = []
const seen = new Set()
for (const [i, ship] of ships.entries()) {
  const id = `al-${slugOf(ship.Name)}`
  if (seen.has(id)) throw new Error(`two ships slug to ${id}`)
  seen.add(id)
  const full = await fetchOnce(`${id}-full.png`, imageUrl(`${ship.Name}.png`))
  const bust = await fetchOnce(`${id}.png`, imageUrl(`${ship.Name}ShipyardIcon.png`))
  const bytes = full ? fullBody(full) : bust
  if (!bytes) {
    missing.push(ship.Name)
    continue
  }
  pngSize(bytes) // rejects an error page
  if (!full) busts.push(ship.Name)
  if (full && bust) pngSize(bust) // the face icon too
  members.push({ id, name: ship.Name, nameJa: '', color: NATION_COLOR[ship.Nationality] ?? '#888888', nation: ship.Nationality, hull: ship.Type,
    rarity: ship.Rarity, bytes, ...(full && bust ? { face: bust } : {}), ext: 'png' })
  process.stdout.write(`\r${i + 1}/${ships.length}`)
}
const total = await writePack('azurlane', { franchise: 'azurlane', source: 'https://azurlane.koumakan.jp/', capturedAt: source.capturedAt }, members)
console.log(`\n${members.length} ships, ${(total / 1024 / 1024).toFixed(1)} MiB → content/release/azurlane/cast.json`)
if (busts.length) console.log(`No full art, so the shipyard bust, for ${busts.length}: ${busts.join(', ')}`)
if (missing.length) console.log(`No art at all for ${missing.length}: ${missing.join(', ')}`)
