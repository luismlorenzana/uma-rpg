// The NIKKE L2D roster (docs/design/l2d-enemies.md): which entries of nikke-db's viewer list are characters, where each
// pose's files live on the viewer's asset host, and the skin and idle animation the viewer shows. Pure, so the
// downloader, the local server and the browser all import it.

export const LIST_URL = 'https://raw.githubusercontent.com/Nikke-db/nikke-db-vue/main/src/utils/json/l2d.json'
export const ASSET_HOST = 'https://nikke-db-legacy.pages.dev/l2d/'
/** The viewer's own 128 px square face icon. */
export const faceUrl = (id) => `https://nikke-db-legacy.pages.dev/images/sprite/si_${id}_00_s.png`

/** Standing (front, full body), Aim and Cover (both seen from behind, as in battle). */
export const POSES = ['fb', 'aim', 'cover']
export const POSE_LABEL = { fb: 'Standing', aim: 'Aim', cover: 'Cover' }
export const IDLE = { fb: 'idle', aim: 'aim_idle', cover: 'cover_idle' }

export const GROUPS = ['base', 'skin', 'boss', 'story', 'collab']
/** Collabs are other franchises' characters, left out as the earlier NIKKE pack did (D81). */
export const DEFAULT_GROUPS = ['base', 'skin', 'boss', 'story']

/** An entry's group, or null for what isn't a character: event scenes, title cards, chibis, faceless extras. */
export function groupOf({ id, name }) {
  if (/^Boss:/.test(name)) return 'boss'
  const m = /^c(\d{3})(_\d{2})?$/.exec(id)
  if (!m) return null
  const n = Number(m[1])
  if (n >= 900) return /faceless/i.test(name) ? null : 'story'
  if (n >= 800) return 'collab'
  return m[2] ? 'skin' : 'base'
}

/** The list's entries in the chosen groups, each with its group. */
export function rosterOf(list, groups = DEFAULT_GROUPS) {
  const seen = new Set()
  const entries = []
  for (const raw of list) {
    if (typeof raw?.id !== 'string' || typeof raw?.name !== 'string' || !/^[a-z0-9_]{1,40}$/.test(raw.id)) continue
    const group = groupOf(raw)
    if (!group || !groups.includes(group) || seen.has(raw.id)) continue
    seen.add(raw.id)
    entries.push({ id: raw.id, name: raw.name, group, ...(raw.f ? { f: raw.f } : {}) })
  }
  return entries
}

/** A pose's folder and file stem: `<id>_00`, `aim/<id>_aim_00`, `cover/<id>_cover_00`; an entry's `f` names its stem. */
export function poseStem(entry, pose) {
  const dir = pose === 'fb' ? '' : `${pose}/`
  return `${dir}${entry.f || entry.id + (pose === 'fb' ? '_00' : `_${pose}_00`)}`
}

/** The atlas's page images: each name line is followed by its `size:` line. */
export function atlasPages(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim())
  return lines.filter((line, i) => /\.(png|webp)$/i.test(line) && /^size:/.test(lines[i + 1] ?? ''))
}

// The viewer's skin choices, by id (its source's tables): some standing poses default to a skin with an accessory or a
// backdrop, and a few Aim and Cover poses to a weapon part.
const ACC = 'c220 c220_01 c102 c102_01 c940 c101_01 c350 c810 c810_01 c810_03 c321 c382 c382_01 c400_01 c403 c182 c354 c355 c532 c043_02 c017 c074 c270_03 c075 c018 c281_02 c322 c063'
const BG = 'c015 c351 c070_02 c810_02 c224 c430_02 c411 c481 c283 c284 c321_01 c350_02 c351_01 c470_01 c830_02 c830_03 c831_02 c832_02 c132 c095 c095_01 c450_02 c352_02 c832_04 c835_02 c162_01 c222_01 c850_03 c016_01 c272_01 c223 c403_01 c191_02 c471 c354_01 c112_03 c170_04 c583 c620'
const SKINS = {
  fb: { ...Object.fromEntries(ACC.split(' ').map((id) => [id, 'acc'])), ...Object.fromEntries(BG.split(' ').map((id) => [id, 'bg'])) },
  aim: { c570: 'part_0', c233: 'part_1', c233_01: 'part_1', c094_01: 'part_1' },
  cover: { c220: 'weapon_2', c220_01: 'weapon_2', c570: 'part_0', c233: 'part_1', c233_01: 'part_1', c223: 'part_1', c223_01: 'part_1' },
}

/**
 * The skins to try, best first. A backdrop skin is our last choice: the figure stands alone on a transparent canvas.
 * The caller picks the first the skeleton has, else its first skin.
 */
export function skinsFor(id, pose) {
  if (id === 'c010_01' || id === 'c907_01') return ['00', 'default']
  const viewer = SKINS[pose][id]
  if (viewer === 'bg') return ['default', 'bg']
  return viewer ? [viewer, 'default'] : ['default']
}
