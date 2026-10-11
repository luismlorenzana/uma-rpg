// Builds the private Girls' Frontline pack (D85): Jungle, Geyser Basin and Crystal Caverns foes. Its roster is the IOP
// Wiki's T-Doll Index (iopwiki.com/wiki/T-Doll_Index, kept in content/sources once fetched): every normal T-Doll by
// game id, name, gun type and rarity; collabs ("Extra"), unreleased and rejected dolls are left out, and MOD3s and
// skins aren't separate entries. Each portrait is her full-body art (`<Title>.png`, transparent) as the wiki's 300 px
// thumbnail, its path the md5 of the file name. The wiki's robots.txt asks for 20 seconds between requests and keeps
// agents off its API, index.php and Special pages, so this touches only /wiki/ pages and /images/, at that pace: about
// 2 h 20 min for the roster. Writes content/release/girlsfrontline/, gitignored; `bash scripts/cast/publish.sh
// girlsfrontline` uploads it.
//
//   node scripts/cast/import-girlsfrontline.mjs          # fetch and build
//   node scripts/cast/import-girlsfrontline.mjs --dry    # parse the saved index only, no requests
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { cachedFetcher, headBox, imageInfo, ROOT, trimPng, writePack } from './pack.mjs'

const WIKI = 'https://iopwiki.com'
const INDEX = join(ROOT, 'content/sources/girlsfrontline-tdoll-index.html')
const COLOR = { HG: '#c9a227', SMG: '#d9483b', AR: '#3b8ad9', RF: '#4fa34a', MG: '#8a4fc9', SG: '#5a7d8c' }
/** Head and shoulders in full-body art, for small round avatars when one image can't be measured. */
const AVATAR = { x: 0.5, y: 0.2, size: 0.4 }
const dry = process.argv.includes('--dry')
const fetchOnce = cachedFetcher(join(ROOT, 'content/.cache/girlsfrontline'), 20_000)

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#039;|&#39;/g, "'").replace(/&quot;/g, '"')
const CARD = /<span class="gfl-doll-card doll-rarity-(\w+) doll-classification-(\w+)"><span class="layout-image doll-image" data-bg-lazy="[^"]+"><\/span><span class="plainlinks card-frame" title="[^"]*"><a [^>]*href="([^"]+)">[\s\S]*?<span class="name">([^<]*)<\/span><span class="index">([^<]*)<\/span><\/span>/g

if (!existsSync(INDEX)) {
  const bytes = await fetchOnce('T-Doll_Index.html', `${WIKI}/wiki/T-Doll_Index`)
  if (!bytes) throw new Error('T-Doll_Index not found')
  await writeFile(INDEX, bytes)
}
const html = await readFile(INDEX, 'utf8')
// The normal T-Dolls sit between their heading and the Extra T-Dolls'.
const normal = html.slice(html.indexOf('id="All_normal_T-Dolls"'), html.indexOf('id="Extra_T-Dolls"'))
const dolls = [...normal.matchAll(CARD)].map(([, rarity, type, href, name, index]) => ({
  id: Number(index), title: decodeURIComponent(href.split('/wiki/')[1]), name: decode(name), type, rarity: Number(rarity),
})).filter((d) => Number.isInteger(d.id) && d.id > 0)
console.log(`${dolls.length} T-Dolls: ${dolls.slice(0, 4).map((d) => `${d.name} (${d.type} ${d.rarity}★ #${d.id})`).join(', ')} …`)
if (dry) process.exit(0)

/** MediaWiki's thumbnail path: /images/thumb/<h0>/<h0h1>/<File>/<W>px-<File>, h the md5 of the file name. */
function thumb(file, width) {
  const h = createHash('md5').update(file, 'utf8').digest('hex')
  const q = encodeURIComponent(file)
  return `${WIKI}/images/thumb/${h[0]}/${h.slice(0, 2)}/${q}/${width}px-${q}`
}

const members = []
const missing = []
for (const d of dolls) {
  let art = await fetchOnce(`${d.id}.png`, thumb(`${d.title}.png`, 300))
  if (!art) {
    // A renamed file: the doll's page names her full artwork.
    const page = await fetchOnce(`${d.id}.html`, `${WIKI}/wiki/${encodeURIComponent(d.title)}`)
    const file = page && /href="\/wiki\/File:([^"]+)" class="mw-file-description" title="Full artwork"/.exec(page.toString('utf8'))?.[1]
    if (file) art = await fetchOnce(`${d.id}-alt.png`, thumb(decodeURIComponent(file), 300))
  }
  if (!art) {
    missing.push(d.name)
    continue
  }
  imageInfo(art) // rejects an error page
  // Trimmed to the figure: the wiki's artwork sits on a square canvas, and the battle stage stands foes on its floor.
  art = trimPng(art)
  const avatar = headBox(art)
  members.push({ id: `gf-${d.id}`, name: d.name, nameJa: '', color: COLOR[d.type] ?? '#888888', gun: d.type, rarity: d.rarity, ...(avatar ? { avatar } : {}), bytes: art })
  process.stdout.write(`\r${members.length + missing.length}/${dolls.length}`)
}
const total = await writePack('girlsfrontline', { franchise: 'girlsfrontline', source: `${WIKI}/wiki/T-Doll_Index`, capturedAt: new Date().toISOString().slice(0, 10), avatar: AVATAR }, members)
console.log(`\n${members.length} T-Dolls, ${(total / 1024 / 1024).toFixed(1)} MiB → content/release/girlsfrontline/cast.json`)
if (missing.length) console.log(`No full artwork for ${missing.length}: ${missing.join(', ')}`)
