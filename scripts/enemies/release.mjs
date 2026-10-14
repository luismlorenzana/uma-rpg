// Builds the enemy release (D135, docs/design/enemy-roster.md): every unit of the three locked franchise packs (PriConne
// and Azur Lane from D133's export, NIKKE from D134's) re-encoded for the phone as WebP, with `enemies.json`, the list
// the game reads. Writes the gitignored content/enemies-release/, laid out as the bucket is: `enemies.json` and
// `enemies/<unit>-<role>.<hash8>.webp`. The same inputs give the same files.
//
//   pnpm enemies:release
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createCanvas, loadImage } from '@napi-rs/canvas'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')
/** The locked packs, by their pointers in content/authoring/exports/. */
export const SOURCES = ['latest.json', 'latest-nikke.json']
/** The franchises in the game, in the order their regions come (D135). */
export const FRANCHISES = ['priconne', 'azurlane', 'nikke']
/** The packs' tiers 1–4 in the game's words. */
export const TIERS = { 1: 'regular', 2: 'key', 3: 'subboss', 4: 'boss' }
/** Each franchise's colour, behind a face that doesn't fill its circle. */
export const COLOR = { priconne: '#e0709a', azurlane: '#4a7bd0', nikke: '#c8363d' }
/**
 * What each image becomes: a square face for round avatars, the vertical a foe stands as on the stage, the splash for
 * cut-ins. Never upscaled; WebP keeps the transparency the sources have.
 */
export const ROLES = {
  face: { from: 'face', width: 128, height: 128, quality: 85, square: true },
  art: { from: 'vertical', width: 480, height: 720, quality: 82 },
  splash: { from: 'splash', width: 1280, height: 720, quality: 80 },
}

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex')

/** A locked bundle, checked against its completion marker and every asset's hash as it's read. */
export async function readBundle(exportsRoot, pointer) {
  const marker = JSON.parse(await readFile(join(exportsRoot, pointer), 'utf8'))
  const folder = join(exportsRoot, marker.id)
  const bytes = await readFile(join(folder, 'manifest.json'))
  if (sha256(bytes) !== marker.manifestSha256) throw new Error(`${marker.id}: manifest doesn't match its marker`)
  const complete = JSON.parse(await readFile(join(folder, 'complete.json'), 'utf8'))
  if (complete.manifestSha256 !== marker.manifestSha256) throw new Error(`${marker.id}: not the completed bundle`)
  const manifest = JSON.parse(bytes)
  return {
    id: marker.id, units: manifest.units,
    asset: async (asset) => {
      const file = await readFile(join(folder, asset.path))
      if (sha256(file) !== asset.sha256) throw new Error(`${asset.path}: changed since it was locked`)
      return file
    },
  }
}

/** The crop and size an image becomes: the whole image fitted inside the role's box, or for a face a square from its
 * top (a bust's head) or its middle, at most the role's size. */
export function plan(width, height, role) {
  const spec = ROLES[role]
  if (spec.square) {
    const side = Math.min(width, height), out = Math.min(side, spec.width)
    return { sx: (width - side) / 2, sy: height > width ? 0 : (height - side) / 2, sw: side, sh: side, width: out, height: out }
  }
  const scale = Math.min(1, spec.width / width, spec.height / height)
  return { sx: 0, sy: 0, sw: width, sh: height, width: Math.round(width * scale), height: Math.round(height * scale) }
}

async function encode(bytes, role) {
  const image = await loadImage(bytes)
  const p = plan(image.width, image.height, role)
  const canvas = createCanvas(p.width, p.height)
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(image, p.sx, p.sy, p.sw, p.sh, 0, 0, p.width, p.height)
  return { bytes: await canvas.encode('webp', ROLES[role].quality), width: p.width, height: p.height }
}

/** Builds the release from the locked bundles into `out`. Returns the list it wrote. */
export async function buildRelease(exportsRoot, out, log = () => {}) {
  const bundles = []
  for (const pointer of SOURCES) bundles.push(await readBundle(exportsRoot, pointer))
  const staging = join(out, 'enemies.part')
  await rm(staging, { recursive: true, force: true })
  await mkdir(staging, { recursive: true })
  const units = []
  let done = 0, total = bundles.reduce((n, b) => n + b.units.length, 0), totalBytes = 0
  for (const bundle of bundles) {
    for (const unit of bundle.units) {
      if (!FRANCHISES.includes(unit.franchise)) throw new Error(`${unit.id}: unknown franchise ${unit.franchise}`)
      const tier = TIERS[unit.tier]
      if (!tier) throw new Error(`${unit.id}: unknown tier ${unit.tier}`)
      const entry = { id: unit.id, franchise: unit.franchise, tier, name: unit.name, ...(unit.nameJa && unit.nameJa !== unit.name ? { nameJa: unit.nameJa } : {}), color: COLOR[unit.franchise] }
      for (const [role, spec] of Object.entries(ROLES)) {
        const asset = unit.assets[spec.from]
        if (!asset) {
          if (role === 'splash' && tier === 'regular') continue
          throw new Error(`${unit.id}: no ${spec.from} image`)
        }
        const image = await encode(await bundle.asset(asset), role)
        const path = `enemies/${unit.id}-${role}.${sha256(image.bytes).slice(0, 8)}.webp`
        await writeFile(join(staging, path.slice('enemies/'.length)), image.bytes)
        entry[role] = { path, width: image.width, height: image.height, bytes: image.bytes.length }
        totalBytes += image.bytes.length
      }
      units.push(entry)
      log(++done, total)
    }
  }
  units.sort((a, b) => FRANCHISES.indexOf(a.franchise) - FRANCHISES.indexOf(b.franchise) || a.id.localeCompare(b.id))
  const counts = Object.fromEntries(FRANCHISES.map((f) => [f, Object.fromEntries(Object.values(TIERS).map((t) => [t, units.filter((u) => u.franchise === f && u.tier === t).length]))]))
  const list = { schemaVersion: 2, sources: bundles.map((b) => b.id), counts, totalBytes, units }
  // Swap the finished folder in, then the list that names its files.
  await rm(join(out, 'enemies'), { recursive: true, force: true })
  await rename(staging, join(out, 'enemies'))
  await writeFile(join(out, 'enemies.json'), JSON.stringify(list) + '\n')
  return list
}

async function main() {
  const out = join(ROOT, 'content/enemies-release')
  if (!existsSync(join(ROOT, 'content/authoring/exports'))) throw new Error('No locked packs in content/authoring/exports')
  await mkdir(out, { recursive: true })
  const list = await buildRelease(join(ROOT, 'content/authoring/exports'), out, (n, total) => process.stdout.write(`\r${n}/${total}`))
  console.log(`\n${list.units.length} units, ${(list.totalBytes / 1024 / 1024).toFixed(1)} MiB → content/enemies-release/`)
  for (const [f, c] of Object.entries(list.counts)) console.log(`  ${f}: ${JSON.stringify(c)}`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main()
