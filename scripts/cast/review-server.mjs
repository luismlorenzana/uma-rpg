import { randomBytes } from 'node:crypto'
import { readFile, realpath, stat } from 'node:fs/promises'
import { join, resolve, sep } from 'node:path'
import { loadReview, parseRatings, ratingsPath, readRatings, saveVotes } from './ratings.mjs'
import { loadCropSession, saveCrops } from './crop-authoring.mjs'

export const artPathAllowed = path => /^(?:(?:azurlane|lastorigin|destinychild|nikke|girlsfrontline)\/)?cast\/[a-z0-9_-]{1,60}\.[a-f0-9]{8}\.(png|webp|jpg)$/.test(path)

/** Preload the three static files so a merged task worktree can be cleaned up while the reviewer remains open. */
export async function reviewHandler({ release, file = ratingsPath(release), port, assets }) {
  const token = randomBytes(24).toString('hex')
  const staticFiles = new Map(await Promise.all([
    ['/', 'review.html', 'text/html; charset=utf-8'], ['/review.js', 'review.js', 'text/javascript; charset=utf-8'],
    ['/review.css', 'review.css', 'text/css; charset=utf-8'],
    ['/crop','crop.html','text/html; charset=utf-8'], ['/crop.js','crop.js','text/javascript; charset=utf-8'],
    ['/crop.css','crop.css','text/css; charset=utf-8'], ['/crop-geometry.mjs','crop-geometry.mjs','text/javascript; charset=utf-8'],
  ].map(async ([url, name, type]) => [url, { type, bytes: await readFile(join(assets, name)) }])))
  const root = await realpath(release)
  const imagePaths = new Set()
  const reviewData = async () => {
    const data = await loadReview(release, file)
    imagePaths.clear()
    for (const pack of data.packs) for (const member of pack.members) {
      for (const image of [member.art, member.face]) if (image && artPathAllowed(image.path)) imagePaths.add(image.path)
    }
    return data
  }
  await reviewData()
  let queue = Promise.resolve()
  const serialize = action => {
    const result = queue.then(action)
    queue = result.catch(() => undefined)
    return result
  }
  const send = (res, status, value) => {
    res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
    res.end(JSON.stringify(value))
  }
  const body = async req => {
    if (!req.headers['content-type']?.startsWith('application/json')) throw new Error('JSON required')
    let bytes = 0, text = ''
    for await (const chunk of req) {
      bytes += Buffer.byteLength(chunk)
      if (bytes > 256 * 1024) throw new Error('Request too large')
      text += chunk
    }
    return JSON.parse(text)
  }
  return async (req, res) => {
    try {
      const host = req.headers.host
      if (![ '127.0.0.1:' + port, 'localhost:' + port ].includes(host)) return send(res, 403, { error: 'Local access only' })
      const origin = 'http://' + host
      if (req.headers.origin && req.headers.origin !== origin) return send(res, 403, { error: 'Local access only' })
      const path = new URL(req.url, origin).pathname
      res.setHeader('X-Content-Type-Options', 'nosniff')
      res.setHeader('Referrer-Policy', 'no-referrer')
      res.setHeader('Cross-Origin-Resource-Policy', 'same-origin')
      res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'")
      if (req.method === 'GET' && staticFiles.has(path)) {
        const { type, bytes } = staticFiles.get(path)
        res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' }); res.end(bytes); return
      }
      if (req.method === 'GET' && path === '/api/review') return send(res, 200, { ...await reviewData(), token })
      if (req.method === 'GET' && path === '/api/export') { await reviewData(); return send(res, 200, await readRatings(file)) }
      if(req.method==='GET' && ['/api/crops','/api/crops/export'].includes(path)) {
        const session=await loadCropSession(release,file)
        if(!session)return send(res,404,{error:'No crop session prepared yet'})
        return send(res,200,{manifest:session.manifest,...session.data,...(path==='/api/crops'?{token}:{})})
      }
      if (req.method === 'GET' && path.startsWith('/art/')) {
        const image = decodeURIComponent(path.slice(5))
        if (!artPathAllowed(image)) return send(res, 404, { error: 'Image not found' })
        if (!imagePaths.has(image)) return send(res, 404, { error: 'Image not found' })
        const target = await realpath(resolve(root, image))
        if (!target.startsWith(root + sep)) return send(res, 404, { error: 'Image not found' })
        const info = await stat(target)
        if (!info.isFile()) return send(res, 404, { error: 'Image not found' })
        res.writeHead(200, { 'Content-Type': image.endsWith('.png') ? 'image/png' : image.endsWith('.jpg') ? 'image/jpeg' : 'image/webp',
          'Cache-Control': 'private, max-age=31536000, immutable' })
        res.end(await readFile(target)); return
      }
      if (req.method !== 'POST' || !['/api/votes', '/api/import','/api/crops'].includes(path)) return send(res, 404, { error: 'Not found' })
      if (req.headers.origin !== origin || req.headers['x-review-token'] !== token) return send(res, 403, { error: 'Reload the reviewer' })
      const raw = await body(req)
      if(path==='/api/crops')return send(res,200,await serialize(()=>saveCrops(release,file,raw)))
      const data=await reviewData()
      if(data.round && raw.roundId!==data.round.id) return send(res,409,{error:'Review round changed. Reload before voting.'})
      if(path==='/api/import' && data.round && (raw.data?.roundId!==data.round.id || raw.data?.datasetId!==data.round.datasetId))return send(res,409,{error:'Import belongs to a different review round.'})
      const imported = path === '/api/import' ? parseRatings(raw.data) : null
      if (imported && imported.schemaVersion !== (data.mode === 'tiers' ? 2 : 1)) return send(res,400,{error:'Import uses a different rating scale.'})
      const entries = imported ? Object.entries(imported.ratings)
        .flatMap(([franchise, values]) => Object.entries(values).map(([id, rating]) => ({ franchise, id, rating }))) : raw.entries
      const next = await serialize(() => saveVotes(release, file, entries, raw.revision,{restoreArchived:path==='/api/import' && !data.round}))
      send(res, 200, { revision: next.revision })
    } catch (error) {
      const status = error.code === 'ENOENT' ? 404 : error.status ?? 400
      send(res, status, { error: error.message ?? 'Review request failed' })
    }
  }
}
