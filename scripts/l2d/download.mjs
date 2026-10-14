// Downloads the NIKKE L2D roster into the private, gitignored content/l2d/ (docs/design/l2d-enemies.md): the viewer's
// list, each character's face icon and her three poses' Spine files (skeleton, atlas, texture pages), one request a
// second, one whole character at a time. It resumes: files already on disk are kept. Also fetches the local app's
// browser libraries, pinned and hash-checked.
//
//   node scripts/l2d/download.mjs                          # every character model, all three poses
//   node scripts/l2d/download.mjs --only c550_01           # one entry
//   node scripts/l2d/download.mjs --poses fb               # faces and Standing only
//   node scripts/l2d/download.mjs --groups base,skin,boss  # pick groups (base, skin, collab, story, boss, chibi)
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ASSET_HOST, atlasPages, DEFAULT_GROUPS, faceUrl, GROUPS, LIST_URL, POSES, poseStem, rosterOf } from './roster.mjs'

export const CONTENT = resolve(process.env.L2D_CONTENT_DIR ?? join(dirname(fileURLToPath(import.meta.url)), '../../content/l2d'))
/** The local app's libraries: Spine's WebGL runtimes for the 4.0 and 4.1 skeletons (the models use both), and a small
 * GIF encoder. */
export const VENDOR = [
  { file: 'spine-webgl-4.0.min.js', url: 'https://cdn.jsdelivr.net/npm/@esotericsoftware/spine-webgl@4.0.31/dist/iife/spine-webgl.min.js',
    sha256: 'db31d4ff4d604ca9971f817427277607185b233158cbb4744409288c004a6d2b' },
  { file: 'spine-webgl-4.1.min.js', url: 'https://cdn.jsdelivr.net/npm/@esotericsoftware/spine-webgl@4.1.56/dist/iife/spine-webgl.min.js',
    sha256: '305b5f54f4f1ac238d3d59a0c2591416ac2dd95cb21e2b9f65b27066c607320f' },
  { file: 'gifenc.esm.js', url: 'https://cdn.jsdelivr.net/npm/gifenc@1.0.3/dist/gifenc.esm.js',
    sha256: '217761244379253ba5815510d3048a4fb1f4c4dbe9fb51a5cfbfe26f34eec093' },
]
const AGENT = { 'user-agent': 'uma-rpg-l2d-import (private, one-time, 1 req/s)' }
const PAUSE_MS = 1000

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function writeAtomic(path, bytes) {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path + '.part', bytes)
  await rename(path + '.part', path)
}

let last = 0
/** One polite GET: null on 404. A busy or failing host gets three more tries, 30 s apart; then it's an error. */
async function get(url) {
  for (let attempt = 0; ; attempt++) {
    await sleep(Math.max(0, last + PAUSE_MS - Date.now()))
    last = Date.now()
    const response = await fetch(url, { headers: AGENT }).catch((error) => ({ ok: false, status: error.message }))
    if (response.status === 404) return null
    if (response.ok) return Buffer.from(await response.arrayBuffer())
    if (attempt === 3 || !(response.status === 429 || response.status >= 500 || typeof response.status === 'string')) throw new Error(`${url}: HTTP ${response.status}`)
    last += 30_000
  }
}

/** Rejects an HTML error page served with a 200. */
function check(name, bytes) {
  if (name.endsWith('.png') && !bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) throw new Error(`${name}: not a PNG`)
  if (name.endsWith('.atlas') && !/\nsize:/.test(bytes.toString('utf8'))) throw new Error(`${name}: not a Spine atlas`)
  // A binary skeleton starts with a hash (any bytes, even '<'), then the editor version.
  if (name.endsWith('.skel') && !/\b[34]\.\d+\.\d+/.test(bytes.subarray(0, 64).toString('latin1'))) throw new Error(`${name}: not a Spine skeleton`)
}

/** The host answers a missing file with its web page and a 200, not a 404. */
export const isWebPage = (bytes) => /^\s*<(!doctype|html)/i.test(bytes.subarray(0, 64).toString('latin1'))

/** A file once: from disk if there, else from the host. Returns its bytes, or null if the host has none. */
async function fetchOnce(path, url) {
  if (existsSync(path)) return readFile(path)
  const bytes = await get(url)
  if (!bytes || isWebPage(bytes)) return null
  check(path, bytes)
  await writeAtomic(path, bytes)
  return bytes
}

/** One pose: skeleton, atlas, then the atlas's pages. Returns its manifest entry; `missing` when the host has none. */
async function downloadPose(entry, pose) {
  const stem = poseStem(entry, pose)
  const dir = join(CONTENT, 'sources', entry.id)
  const files = {}
  for (const ext of ['skel', 'atlas']) {
    const bytes = await fetchOnce(join(dir, `${stem}.${ext}`), `${ASSET_HOST}${entry.id}/${stem}.${ext}`)
    if (!bytes) return { stem, missing: true }
    files[`${stem}.${ext}`] = { bytes: bytes.length, sha256: sha256(bytes) }
  }
  const folder = stem.includes('/') ? stem.slice(0, stem.lastIndexOf('/') + 1) : ''
  for (const page of atlasPages((await readFile(join(dir, `${stem}.atlas`))).toString('utf8'))) {
    if (!/^[A-Za-z0-9_.-]{1,80}$/.test(page)) throw new Error(`${entry.id}: odd page name ${page}`)
    const bytes = await fetchOnce(join(dir, folder + page), `${ASSET_HOST}${entry.id}/${folder}${page}`)
    if (!bytes) throw new Error(`${entry.id} ${pose}: page ${page} is missing`)
    files[folder + page] = { bytes: bytes.length, sha256: sha256(bytes) }
  }
  return { stem, files }
}

async function readManifest(id) {
  const path = join(CONTENT, 'sources', id, 'manifest.json')
  return existsSync(path) ? JSON.parse(await readFile(path, 'utf8')) : { id, poses: {} }
}

async function main() {
  const arg = (flag) => { const i = process.argv.indexOf(flag); return i > 0 ? process.argv[i + 1] : undefined }
  const groups = arg('--groups')?.split(',') ?? DEFAULT_GROUPS
  const poses = arg('--poses')?.split(',') ?? POSES
  for (const g of groups) if (!GROUPS.includes(g)) throw new Error(`unknown group ${g}`)
  for (const p of poses) if (!POSES.includes(p)) throw new Error(`unknown pose ${p}`)

  for (const v of VENDOR) {
    const path = join(CONTENT, 'vendor', v.file)
    const bytes = existsSync(path) ? await readFile(path) : await get(v.url)
    if (sha256(bytes) !== v.sha256) throw new Error(`${v.file}: unexpected hash`)
    if (!existsSync(path)) await writeAtomic(path, bytes)
  }

  const list = JSON.parse((await get(LIST_URL)).toString('utf8'))
  const roster = rosterOf(list, groups)
  await writeAtomic(join(CONTENT, 'roster.json'), JSON.stringify({ schemaVersion: 1, source: LIST_URL, capturedAt: new Date().toISOString(), groups, entries: roster }, null, 1))
  const only = arg('--only')
  const entries = only ? roster.filter((e) => only.split(',').includes(e.id)) : roster
  if (only && !entries.length) throw new Error(`${only} isn't in the roster's groups`)

  // One whole character at a time, so whoever the reviewer shows has all her poses (and so her splash).
  let done = 0
  const failed = []
  for (const entry of entries) {
    try {
      const manifest = await readManifest(entry.id)
      if (!manifest.face) {
        const face = await fetchOnce(join(CONTENT, 'sources', entry.id, 'face.png'), faceUrl(entry.id))
        manifest.face = face ? { bytes: face.length, sha256: sha256(face) } : { missing: true }
      }
      for (const pose of poses) if (!manifest.poses[pose]?.files && !manifest.poses[pose]?.missing) manifest.poses[pose] = await downloadPose(entry, pose)
      await writeAtomic(join(CONTENT, 'sources', entry.id, 'manifest.json'), JSON.stringify(manifest, null, 1))
    } catch (error) {
      failed.push(`${entry.id}: ${error.message}`)
    }
    process.stdout.write(`\r${++done}/${entries.length} ${entry.id}          `)
  }
  console.log(`\n${entries.length} entries → ${join(CONTENT, 'sources')}`)
  if (failed.length) console.log(`Failed (run again to retry):\n  ${failed.join('\n  ')}`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main()
