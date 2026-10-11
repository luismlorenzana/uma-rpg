// Builds the private Destiny Child pack (D81): Haunted Moor, Swamp and Twilight Rift foes. Its lists come from the Destiny
// Child Mods Archive (phasmaexmachina.github.io/destiny-child-mods-archive, GitHub Pages), whose script bundle carries
// them as two JSON blocks, captured once into content/sources: every child (code, name, element, variants with their
// models) and the model registry (which models are fan mods). The archive stops in September 2020. A child here has an
// element and an original-game model of her base look (`_01`); collabs and alternate versions ("Newbie Mona") are left
// out, and fan mods are never fetched. Each portrait is that model's rendered still (`static.png`, full body, 350 px
// tall), two requests a second. Writes content/release/destinychild/, gitignored; `bash scripts/cast/publish.sh
// destinychild` uploads it.
//
//   node scripts/cast/import-destinychild.mjs
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { cachedFetcher, headBox, imageInfo, ROOT, slugOf, writePack } from './pack.mjs'

const ARCHIVE = 'https://phasmaexmachina.github.io/destiny-child-mods-archive/characters'
/** Collab children with full metadata: Street Fighter, VOCALOID, Dead or Alive, Kemono Friends and A.I. */
const COLLAB = new Set(['c174', 'c244', 'c245', 'c358', 'c359', 'c385', 'c386', 'c387', 'c401', 'c406', 'c407', 'c408'])
/** The game's five elements on ours (forest stands in for lightning, water for ice). */
const ELEMENT = { fire: 'fire', water: 'ice', forest: 'lightning', light: 'light', dark: 'dark' }
const COLOR = { fire: '#d9483b', water: '#3b8ad9', forest: '#4fa34a', light: '#e0c04a', dark: '#7a4fb3' }
/** Head and shoulders in the still, for small round avatars when one image can't be measured. */
const AVATAR = { x: 0.5, y: 0.2, size: 0.4 }

const children = JSON.parse(await readFile(join(ROOT, 'content/sources/destinychild-characters.json'), 'utf8'))
const registry = JSON.parse(await readFile(join(ROOT, 'content/sources/destinychild-mods.json'), 'utf8'))
const original = (hash) => registry[hash] && !('modder' in registry[hash])
const base = Object.values(children).flatMap((c) => {
  const model = (c.variants?.['01']?.mods ?? []).find(original)
  return c.element && ELEMENT[c.element] && model && !COLLAB.has(c.code) ? [{ ...c, model }] : []
})
const names = new Set(base.map((c) => c.name))
const kids = base.filter((c) => ![...names].some((n) => n !== c.name && c.name.endsWith(` ${n}`)))

const fetchOnce = cachedFetcher(join(ROOT, 'content/.cache/destinychild'), 500)
const members = []
const missing = []
for (const c of kids.sort((a, b) => a.code.localeCompare(b.code))) {
  const bytes = await fetchOnce(`${c.code}.png`, `${ARCHIVE}/${c.code}_01/${c.model}/static.png`)
  if (!bytes) {
    missing.push(c.name)
    continue
  }
  imageInfo(bytes) // rejects an error page
  const avatar = headBox(bytes)
  members.push({ id: `dc-${c.code}-${slugOf(c.name)}`.slice(0, 60), name: c.name, nameJa: '', color: COLOR[c.element], element: ELEMENT[c.element], ...(avatar ? { avatar } : {}), bytes })
  process.stdout.write(`\r${members.length + missing.length}/${kids.length}`)
}
const total = await writePack('destinychild', { franchise: 'destinychild', source: 'https://phasmaexmachina.github.io/destiny-child-mods-archive/', capturedAt: '2026-10-11', avatar: AVATAR }, members)
console.log(`\n${members.length} children, ${(total / 1024 / 1024).toFixed(1)} MiB → content/release/destinychild/cast.json`)
if (missing.length) console.log(`No still for ${missing.length}: ${missing.join(', ')}`)
