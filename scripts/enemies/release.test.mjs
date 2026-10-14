// The enemy release builder on synthetic bundles: sizes, crops, tiers and its refusal of changed files.
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { createCanvas, loadImage } from '@napi-rs/canvas'
import { buildRelease, plan } from './release.mjs'

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex')
const png = async (width, height) => {
  const c = createCanvas(width, height), x = c.getContext('2d')
  x.fillStyle = '#c04060'; x.fillRect(0, 0, width, height)
  return c.encode('png')
}

test('fits images inside their role without upscaling, and cuts faces square from a bust’s top', () => {
  assert.deepEqual(plan(640, 960, 'art'), { sx: 0, sy: 0, sw: 640, sh: 960, width: 480, height: 720 })
  assert.deepEqual(plan(244, 366, 'art'), { sx: 0, sy: 0, sw: 244, sh: 366, width: 244, height: 366 })
  assert.deepEqual(plan(1280, 720, 'splash'), { sx: 0, sy: 0, sw: 1280, sh: 720, width: 1280, height: 720 })
  assert.deepEqual(plan(192, 256, 'face'), { sx: 0, sy: 0, sw: 192, sh: 192, width: 128, height: 128 })
  assert.deepEqual(plan(96, 96, 'face'), { sx: 0, sy: 0, sw: 96, sh: 96, width: 96, height: 96 })
  assert.deepEqual(plan(130, 128, 'face'), { sx: 1, sy: 0, sw: 128, sh: 128, width: 128, height: 128 })
})

/** A locked bundle as D133/D134 write it: images, a manifest, its completion marker and the pointer. */
async function bundle(root, pointer, id, units) {
  const folder = join(root, id)
  const out = []
  for (const u of units) {
    const assets = {}
    for (const [role, [w, h]] of Object.entries(u.images)) {
      const bytes = await png(w, h), path = `${u.franchise}/${u.id}/${role}.${sha256(bytes).slice(0, 16)}.png`
      await mkdir(join(folder, u.franchise, u.id), { recursive: true })
      await writeFile(join(folder, path), bytes)
      assets[role] = { path, sha256: sha256(bytes), bytes: bytes.length, width: w, height: h }
    }
    out.push({ franchise: u.franchise, id: u.id, name: u.name, tier: u.tier, assets })
  }
  const manifest = Buffer.from(JSON.stringify({ schemaVersion: 1, id, units: out }))
  await writeFile(join(folder, 'manifest.json'), manifest)
  const marker = { schemaVersion: 1, id, manifestSha256: sha256(manifest) }
  await writeFile(join(folder, 'complete.json'), JSON.stringify(marker))
  await writeFile(join(root, pointer), JSON.stringify(marker))
  return out
}

test('builds one list of every unit with its tier and phone-sized images, and refuses a changed file', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'enemies-release-test-')), exportsRoot = join(root, 'exports'), out = join(root, 'release')
  t.after(() => rm(root, { recursive: true, force: true }))
  await mkdir(exportsRoot, { recursive: true })
  await bundle(exportsRoot, 'latest.json', 'full-test', [
    { franchise: 'priconne', id: 'gw-1', name: 'Unit One', tier: 1, images: { vertical: [244, 366], face: [96, 96] } },
    { franchise: 'azurlane', id: 'al-two', name: 'Unit Two', tier: 4, images: { vertical: [640, 960], splash: [1280, 720], face: [192, 256] } },
  ])
  const nikke = await bundle(exportsRoot, 'latest-nikke.json', 'nikke-test', [
    { franchise: 'nikke', id: 'nk-c1', name: 'Unit Three', tier: 2, images: { vertical: [640, 960], splash: [1280, 720], face: [128, 128] } },
  ])
  const list = await buildRelease(exportsRoot, out)
  assert.deepEqual(list.units.map((u) => [u.id, u.franchise, u.tier, Object.keys(u).filter((k) => ['face', 'art', 'splash'].includes(k))]),
    [['gw-1', 'priconne', 'regular', ['face', 'art']], ['al-two', 'azurlane', 'boss', ['face', 'art', 'splash']], ['nk-c1', 'nikke', 'key', ['face', 'art', 'splash']]])
  assert.deepEqual(list.counts.azurlane, { regular: 0, key: 0, subboss: 0, boss: 1 })
  const al = list.units[1]
  assert.deepEqual([al.face.width, al.face.height, al.art.width, al.art.height, al.splash.width], [128, 128, 480, 720, 1280])
  assert.match(al.art.path, /^enemies\/al-two-art\.[a-f0-9]{8}\.webp$/)
  const image = await loadImage(await readFile(join(out, al.art.path)))
  assert.deepEqual([image.width, image.height], [480, 720])
  assert.deepEqual(JSON.parse(await readFile(join(out, 'enemies.json'), 'utf8')).units.length, 3)
  assert.equal((await readdir(join(out, 'enemies'))).length, 8)
  // A locked file that no longer matches its hash stops the build.
  await writeFile(join(exportsRoot, 'nikke-test', nikke[0].assets.face.path), await png(128, 127))
  await assert.rejects(buildRelease(exportsRoot, out), /changed since it was locked/)
})
