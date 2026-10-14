// The local L2D reviewer (docs/design/l2d-enemies.md): plays each downloaded character live, saves the owner's role
// votes and keeps the images rendered from her poses. Loopback only; reads and writes nothing outside content/l2d/.
//
//   pnpm l2d:review     # then open http://127.0.0.1:5195
import { randomBytes } from 'node:crypto'
import { existsSync } from 'node:fs'
import { appendFile, mkdir, open, readdir, readFile, realpath, rename, stat, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { dirname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { RENDER_NAMES, RENDER_TYPE } from './formats.mjs'
import { POSES } from './roster.mjs'
import { applyVote, emptyTiers, parseTiers } from './tiers.mjs'

const ASSETS = dirname(fileURLToPath(import.meta.url))
/** The app's own files, served from this folder. */
const APP_FILES = {
  '/app.js': 'app.js', '/app.css': 'app.css', '/spine-view.js': 'spine-view.js', '/render.js': 'render.js',
  '/roster.mjs': 'roster.mjs', '/tiers.mjs': 'tiers.mjs', '/formats.mjs': 'formats.mjs', '/webp-anim.mjs': 'webp-anim.mjs',
}
const VENDOR_FILES = new Set(['gifenc.esm.js'])
/** Spine's runtime for each skeleton version: both define the global `spine`, so /vendor/spine.js loads them in turn
 * and keeps each under its own name. */
export const SPINE_RUNTIMES = { '4.0': 'spine-webgl-4.0.min.js', '4.1': 'spine-webgl-4.1.min.js' }
/** A skeleton's Spine version, from the editor version in its header: '4.0' or '4.1'. */
export const spineVersion = (header) => /\b4\.([01])\.\d+/.exec(header.toString('latin1'))?.[0].slice(0, 3) ?? null
const TYPE = { js: 'text/javascript; charset=utf-8', mjs: 'text/javascript; charset=utf-8', css: 'text/css; charset=utf-8',
  png: 'image/png', webp: 'image/webp', gif: 'image/gif', skel: 'application/octet-stream', atlas: 'text/plain; charset=utf-8' }
const MAX_RENDER_BYTES = 40 * 1024 * 1024
const typeOf = (name) => TYPE[name.slice(name.lastIndexOf('.') + 1)] ?? 'application/octet-stream'

async function writeAtomic(path, bytes) {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path + '.part', bytes)
  await rename(path + '.part', path)
}

/** The request handler, over a content folder (roster.json, sources/, vendor/, tiers.json, renders/). */
export async function l2dHandler({ content, port }) {
  const token = randomBytes(24).toString('hex')
  const tiersFile = join(content, 'tiers.json')
  const roster = JSON.parse(await readFile(join(content, 'roster.json'), 'utf8')).entries
  const known = new Set(roster.map((e) => e.id))
  let tiers = existsSync(tiersFile) ? parseTiers(JSON.parse(await readFile(tiersFile, 'utf8'))) : emptyTiers()

  /** What's on disk for an entry: the poses downloaded (with their Spine versions), her face, her renders. */
  const manifests = new Map()
  const versions = new Map()
  const entryState = async (entry) => {
    const path = join(content, 'sources', entry.id, 'manifest.json')
    const manifest = existsSync(path) ? JSON.parse(await readFile(path, 'utf8')) : { poses: {} }
    manifests.set(entry.id, manifest)
    const downloaded = Object.entries(manifest.poses).filter(([, p]) => p.files)
    const poses = Object.fromEntries(downloaded.map(([pose, p]) => [pose, p.stem]))
    const spine = {}
    for (const [pose, p] of downloaded) {
      const key = `${entry.id}/${p.stem}`
      if (!versions.has(key)) {
        const file = await open(join(content, 'sources', entry.id, `${p.stem}.skel`)).catch(() => null)
        const header = Buffer.alloc(64)
        if (file) { await file.read(header, 0, 64, 0); await file.close() }
        versions.set(key, spineVersion(header))
      }
      if (versions.get(key)) spine[pose] = versions.get(key)
    }
    const renderDir = join(content, 'renders', entry.id)
    const renders = {}
    if (existsSync(renderDir)) for (const name of await readdir(renderDir)) if (RENDER_NAMES.has(name)) renders[name] = (await stat(join(renderDir, name))).size
    // Poses the downloader hasn't tried yet: until it has, a splash can't know which poses she has.
    const pending = POSES.filter((pose) => !manifest.poses[pose])
    return { ...entry, poses, pending, spine, face: !!manifest.face?.sha256, renders }
  }
  const state = async () => ({ token, revision: tiers.revision, tiers: tiers.tiers, entries: await Promise.all(roster.map(entryState)) })
  await state()

  let queue = Promise.resolve()
  const serialize = (action) => { const next = queue.then(action); queue = next.catch(() => undefined); return next }
  const send = (res, status, value) => {
    res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
    res.end(JSON.stringify(value))
  }
  const root = await realpath(content)
  const sendFile = async (res, path, type, cache = 'no-store') => {
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': cache })
    res.end(await readFile(path))
  }
  /** A file under content/, never one a link points out of it. */
  const sendContent = async (res, path, type, cache) => {
    const target = await realpath(path).catch(() => null)
    if (!target?.startsWith(root + sep)) return send(res, 404, { error: 'Not found' })
    return sendFile(res, target, type, cache)
  }
  const readBody = async (req, limit) => {
    const chunks = []
    let bytes = 0
    for await (const chunk of req) {
      bytes += chunk.length
      if (bytes > limit) throw Object.assign(new Error('Request too large'), { status: 413 })
      chunks.push(Buffer.from(chunk))
    }
    return Buffer.concat(chunks)
  }

  return async (req, res) => {
    try {
      const host = req.headers.host
      if (!['127.0.0.1:' + port, 'localhost:' + port].includes(host)) return send(res, 403, { error: 'Local access only' })
      const origin = 'http://' + host
      if (req.headers.origin && req.headers.origin !== origin) return send(res, 403, { error: 'Local access only' })
      const path = decodeURIComponent(new URL(req.url, origin).pathname)
      res.setHeader('X-Content-Type-Options', 'nosniff')
      res.setHeader('Referrer-Policy', 'no-referrer')
      res.setHeader('Cross-Origin-Resource-Policy', 'same-origin')
      res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' blob: data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'")

      if (req.method === 'GET') {
        if (path === '/') {
          const html = (await readFile(join(ASSETS, 'app.html'), 'utf8')).replace('%TOKEN%', token)
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' })
          return res.end(html)
        }
        if (APP_FILES[path]) return sendFile(res, join(ASSETS, APP_FILES[path]), typeOf(path))
        if (path === '/vendor/spine.js') {
          const parts = []
          for (const [version, file] of Object.entries(SPINE_RUNTIMES)) parts.push(await readFile(join(content, 'vendor', file), 'utf8'), `\nvar spine${version.replace('.', '')} = spine;\n`)
          res.writeHead(200, { 'Content-Type': TYPE.js, 'Cache-Control': 'no-store' })
          return res.end(parts.join(''))
        }
        if (path.startsWith('/vendor/') && VENDOR_FILES.has(path.slice(8))) return sendContent(res, join(content, 'vendor', path.slice(8)), typeOf(path), 'private, max-age=31536000, immutable')
        if (path === '/api/state') return send(res, 200, await state())
        // /src/<id>/<file>: only files her manifest lists, so nothing else under content/ can be named.
        const src = /^\/src\/([a-z0-9_]{1,40})\/(.+)$/.exec(path)
        if (src && known.has(src[1])) {
          const manifest = manifests.get(src[1]) ?? { poses: {} }
          const listed = src[2] === 'face.png' ? !!manifest.face?.sha256 : Object.values(manifest.poses).some((p) => p.files && Object.hasOwn(p.files, src[2]))
          if (listed) return sendContent(res, join(content, 'sources', src[1], src[2]), typeOf(src[2]), 'private, max-age=31536000, immutable')
        }
        const out = /^\/renders\/([a-z0-9_]{1,40})\/([a-z0-9.-]{1,40})$/.exec(path)
        if (out && known.has(out[1]) && RENDER_NAMES.has(out[2]) && existsSync(join(content, 'renders', out[1], out[2]))) {
          return sendContent(res, join(content, 'renders', out[1], out[2]), typeOf(out[2]))
        }
        return send(res, 404, { error: 'Not found' })
      }

      if (req.headers.origin !== origin || req.headers['x-l2d-token'] !== token) return send(res, 403, { error: 'Reload the reviewer' })
      if (req.method === 'POST' && path === '/api/tier') {
        if (!req.headers['content-type']?.startsWith('application/json')) return send(res, 415, { error: 'JSON required' })
        const { id, tier } = JSON.parse((await readBody(req, 4096)).toString('utf8'))
        if (!known.has(id)) return send(res, 404, { error: 'Not in the roster' })
        const next = await serialize(async () => {
          const updated = applyVote(tiers, id, tier ?? null)
          await writeAtomic(tiersFile, JSON.stringify(updated, null, 1))
          await appendFile(join(content, 'tiers-history.jsonl'), JSON.stringify({ at: new Date().toISOString(), id, tier: tier ?? null, from: tiers.tiers[id] ?? null }) + '\n')
          tiers = updated
          return updated
        })
        return send(res, 200, { revision: next.revision, tier: next.tiers[id] ?? null })
      }
      const put = /^\/api\/render\/([a-z0-9_]{1,40})\/([a-z0-9.-]{1,40})$/.exec(path)
      if (req.method === 'PUT' && put && known.has(put[1]) && RENDER_NAMES.has(put[2])) {
        const ext = put[2].slice(put[2].lastIndexOf('.') + 1)
        if (req.headers['content-type'] !== RENDER_TYPE[ext]) return send(res, 415, { error: `${RENDER_TYPE[ext]} required` })
        const bytes = await readBody(req, MAX_RENDER_BYTES)
        await writeAtomic(join(content, 'renders', put[1], put[2]), bytes)
        return send(res, 200, { bytes: bytes.length })
      }
      return send(res, 404, { error: 'Not found' })
    } catch (error) {
      send(res, error.status ?? 400, { error: error.message ?? 'Request failed' })
    }
  }
}

async function main() {
  const content = resolve(process.env.L2D_CONTENT_DIR ?? join(ASSETS, '../../content/l2d'))
  const port = Number(process.env.L2D_PORT ?? 5195)
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid L2D_PORT')
  if (!existsSync(join(content, 'roster.json'))) throw new Error('No roster yet: run `pnpm l2d:download` first')
  const server = createServer(await l2dHandler({ content, port }))
  server.on('error', (error) => {
    console.error(error.code === 'EADDRINUSE' ? `Port ${port} is taken: the reviewer may already be running (restart it to load changes).` : error.message)
    process.exitCode = 1
  })
  server.listen(port, '127.0.0.1', () => console.log(`L2D reviewer: http://127.0.0.1:${port}`))
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit()))
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main()
