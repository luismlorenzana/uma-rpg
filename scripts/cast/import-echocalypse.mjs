// Builds the private Echocalypse pack (D84): Jungle, Geyser Basin and Crystal Caverns foes. Its roster was captured once
// into content/sources/echocalypse-roster.json by joining gacha.gg's character list (every Case: slug, name, a 128 px
// face icon) with the official site's character data (echocalypseglobal.gtarcade.com: faction and, for twenty, a
// transparent showcase). No source that allows fetching has full-body art for everyone: a Case with the official
// showcase fights as it (upper body, cropped to a centred portrait of the figure), the rest as their face icon.
// Collabs (Overlord's Albedo and Shalltear) and alternate versions (Holy Lady Vivi) are left out. One request a second.
// Writes content/release/echocalypse/, gitignored; `bash scripts/cast/publish.sh echocalypse` uploads it.
//
//   node scripts/cast/import-echocalypse.mjs
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { cachedFetcher, imageInfo, portraitPng, ROOT, trimPng, writePack } from './pack.mjs'

const SKIP = new Set(['albedo', 'shalltear', 'holy-lady-vivi'])
const FACTION_COLOR = { 'Bifrost Industries': '#3b8ad9', 'Augustine Empire': '#c9a227', 'Nebu Alliance': '#8a4fc9', Eastrise: '#d9483b' }
/** The official CDN resizes on request; 800 px keeps the figure sharp after trimming. */
const SHOWCASE = '?x-oss-process=image/resize,w_800'

const roster = JSON.parse(await readFile(join(ROOT, 'content/sources/echocalypse-roster.json'), 'utf8'))
const fetchOnce = cachedFetcher(join(ROOT, 'content/.cache/echocalypse'), 1000)
const members = []
const missing = []
for (const c of roster.filter((r) => !SKIP.has(r.slug))) {
  const icon = c.gachaIcon ? await fetchOnce(`${c.slug}-icon.webp`, c.gachaIcon) : c.icon128 ? await fetchOnce(`${c.slug}-icon.png`, c.icon128) : null
  if (!icon) {
    missing.push(c.name)
    continue
  }
  imageInfo(icon) // rejects an error page
  const showcase = c.cgTransparent ? await fetchOnce(`${c.slug}-showcase.png`, `${c.cgTransparent}${SHOWCASE}`) : null
  let art = icon
  if (showcase) {
    try {
      art = trimPng(portraitPng(trimPng(showcase)))
    } catch {
      art = icon // not an 8-bit RGBA PNG after all: fight as the icon
    }
  }
  members.push({ id: `ec-${c.slug}`, name: c.name, nameJa: '', color: FACTION_COLOR[c.faction] ?? '#5a7d8c', ...(c.faction ? { faction: c.faction } : {}), bytes: art, face: icon })
  process.stdout.write(`\r${members.length + missing.length}/${roster.length - SKIP.size}`)
}
const total = await writePack('echocalypse', { franchise: 'echocalypse', source: 'https://www.gacha.gg/echocalypse/characters + echocalypseglobal.gtarcade.com', capturedAt: '2026-10-11' }, members)
console.log(`\n${members.length} Cases (${members.filter((m) => m.bytes !== m.face).length} with showcase art), ${(total / 1024 / 1024).toFixed(1)} MiB → content/release/echocalypse/cast.json`)
if (missing.length) console.log(`No icon for ${missing.length}: ${missing.join(', ')}`)
