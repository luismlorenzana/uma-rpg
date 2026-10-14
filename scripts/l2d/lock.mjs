// Locks the NIKKE pack (D134): every unit the owner kept in content/l2d/tiers.json, with the reviewer's pack renders
// and her face, copied into a versioned bundle beside the other franchises' exports (content/authoring/exports/), on
// their manifest schema. Excluded and unrated entries are left out; their sources stay on disk. Nothing is uploaded.
// Rerunning with the same votes and images reuses the bundle; anything changed makes a new sibling version.
//
//   pnpm l2d:lock
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PACK, posesOf, RENDERS } from './formats.mjs'
import { parseTiers } from './tiers.mjs'

/** The tiers' numbers and labels in the other franchises' exports. */
export const TIER_OF = { regular: [1, 'Regular'], key: [2, 'KeyEnemy'], subboss: [3, 'MiniBoss'], boss: [4, 'FinalBoss'] }
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex')
/** The pack's stable id for a viewer id: `nk-` and the id with dashes, like the other franchises' slugs. */
export const unitId = (id) => `nk-${id.replaceAll('_', '-')}`

/** A PNG's size, from its header; an error for anything else. */
export function pngSize(bytes) {
  if (bytes.length < 24 || !bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) || bytes.toString('latin1', 12, 16) !== 'IHDR') throw new Error('not a PNG')
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }
}

async function writeOnce(path, bytes) {
  if (existsSync(path)) {
    if (!(await readFile(path)).equals(bytes)) throw new Error(`${path} exists with different bytes`)
    return
  }
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path + '.part', bytes)
  await rename(path + '.part', path)
}

/** Builds and verifies the bundle. Returns its manifest. */
export async function lockPack(content, exportsRoot) {
  const tiersBytes = await readFile(join(content, 'tiers.json'))
  const { tiers } = parseTiers(JSON.parse(tiersBytes.toString('utf8')))
  const rosterBytes = await readFile(join(content, 'roster.json'))
  const roster = JSON.parse(rosterBytes.toString('utf8')).entries

  // Every kept unit's files, checked before anything is written: a pack is whole or not made.
  const plan = [], missing = []
  for (const entry of roster) {
    const tier = TIER_OF[tiers[entry.id]]
    if (!tier) continue
    const manifest = JSON.parse(await readFile(join(content, 'sources', entry.id, 'manifest.json'), 'utf8'))
    const downloaded = Object.keys(manifest.poses).filter((p) => manifest.poses[p].files)
    const roles = [['vertical', join(content, 'renders', entry.id, PACK.vertical.name), PACK.vertical, ['fb']]]
    if (tier[0] > 1) roles.push(['splash', join(content, 'renders', entry.id, PACK.splash.name), PACK.splash, posesOf(RENDERS.find((r) => r.name === 'splash.webp'), downloaded)])
    const iconFace = !!manifest.face?.sha256
    roles.push(['face', iconFace ? join(content, 'sources', entry.id, 'face.png') : join(content, 'renders', entry.id, PACK.face.name), iconFace ? null : PACK.face, ['fb']])
    const files = []
    for (const [role, path, size, poses] of roles) {
      if (!existsSync(path)) { missing.push(`${entry.id} ${role}`); continue }
      const bytes = await readFile(path)
      const dims = pngSize(bytes)
      if (size && (dims.width !== size.width || dims.height !== size.height)) throw new Error(`${entry.id} ${role}: ${dims.width}×${dims.height}, not ${size.width}×${size.height}`)
      files.push({ role, bytes, dims, poses, reused: role === 'face' && iconFace })
    }
    plan.push({ entry, tier, manifest, files })
  }
  if (missing.length) throw new Error(`Render these first (${missing.length}): ${missing.join(', ')}`)

  const identity = { tiersSha256: sha256(tiersBytes), files: plan.flatMap((u) => u.files.map((f) => [u.entry.id, f.role, sha256(f.bytes)])) }
  const fingerprint = sha256(JSON.stringify(identity))
  const id = `nikke-r${JSON.parse(tiersBytes).revision}-${fingerprint.slice(0, 12)}`
  const folder = join(exportsRoot, id)
  await writeOnce(join(folder, 'snapshots', 'classification.json'), tiersBytes)
  await writeOnce(join(folder, 'snapshots', 'roster.json'), rosterBytes)

  const units = [], counts = { units: 0, vertical: 0, splash: 0, face: 0, files: 0 }
  let totalBytes = 0
  for (const { entry, tier, manifest, files } of plan) {
    const uid = unitId(entry.id)
    const unit = {
      franchise: 'nikke', id: uid, name: entry.name, nameJa: '', tier: tier[0], tierLabel: tier[1],
      source: { franchise: 'nikke', id: entry.id, name: entry.name, group: entry.group, poses: manifest.poses, face: manifest.face, kind: 'nikke-db-spine-render' },
      assets: {},
    }
    for (const { role, bytes, dims, poses, reused } of files) {
      const hash = sha256(bytes)
      const path = `nikke/${uid}/${role}.${hash.slice(0, 16)}.png`
      await writeOnce(join(folder, path), bytes)
      unit.assets[role] = { path, sha256: hash, bytes: bytes.length, width: dims.width, height: dims.height, ...(reused ? { reused: true } : { poses }) }
      counts[role]++
      counts.files++
      totalBytes += bytes.length
    }
    counts.units++
    units.push(unit)
  }
  const manifest = { schemaVersion: 1, id, complete: true, createdAt: new Date().toISOString(), fingerprint, franchise: 'nikke', counts, totalBytes, units }
  const manifestPath = join(folder, 'manifest.json')
  // A completed bundle keeps its first manifest: same inputs, same bundle. An interrupted one is rewritten.
  if (!existsSync(join(folder, 'complete.json'))) {
    await writeFile(manifestPath + '.part', JSON.stringify(manifest, null, 2) + '\n')
    await rename(manifestPath + '.part', manifestPath)
  }
  const written = await readFile(manifestPath)
  const marker = { schemaVersion: 1, id, manifestSha256: sha256(written) }
  await writeOnce(join(folder, 'complete.json'), Buffer.from(JSON.stringify(marker, null, 2) + '\n'))
  await verifyPack(folder)
  await mkdir(exportsRoot, { recursive: true })
  await writeFile(join(exportsRoot, 'latest-nikke.json.part'), JSON.stringify(marker, null, 2) + '\n')
  await rename(join(exportsRoot, 'latest-nikke.json.part'), join(exportsRoot, 'latest-nikke.json'))
  return JSON.parse(written)
}

/** Rechecks a bundle against its completion marker: manifest hash, every file's hash and size. */
export async function verifyPack(folder) {
  const marker = JSON.parse(await readFile(join(folder, 'complete.json'), 'utf8'))
  const bytes = await readFile(join(folder, 'manifest.json'))
  if (sha256(bytes) !== marker.manifestSha256) throw new Error('manifest changed since the pack was locked')
  const manifest = JSON.parse(bytes)
  for (const unit of manifest.units) {
    const want = unit.tier === 1 ? ['face', 'vertical'] : ['face', 'splash', 'vertical']
    if (JSON.stringify(Object.keys(unit.assets).sort()) !== JSON.stringify(want)) throw new Error(`${unit.id}: wrong images`)
    for (const asset of Object.values(unit.assets)) {
      const file = await readFile(join(folder, asset.path))
      if (sha256(file) !== asset.sha256 || file.length !== asset.bytes) throw new Error(`${asset.path}: changed`)
    }
  }
  return manifest
}

async function main() {
  const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
  const content = resolve(process.env.L2D_CONTENT_DIR ?? join(root, 'content/l2d'))
  const manifest = await lockPack(content, join(root, 'content/authoring/exports'))
  const byTier = Object.fromEntries(Object.values(TIER_OF).map(([n, label]) => [label, manifest.units.filter((u) => u.tier === n).length]))
  console.log(`Locked ${manifest.id}: ${manifest.counts.units} units ${JSON.stringify(byTier)}, ${manifest.counts.files} files, ${(manifest.totalBytes / 1024 / 1024).toFixed(0)} MiB`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main()
