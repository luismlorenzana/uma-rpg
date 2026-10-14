// The L2D reviewer's pure parts and its server, on synthetic ids and bytes only.
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { isWebPage } from './download.mjs'
import { posesOf, RENDERS, rendersForRole } from './formats.mjs'
import { atlasPages, groupOf, idlesFor, poseStem, rosterOf, skinsFor } from './roster.mjs'
import { l2dHandler, spineVersion } from './server.mjs'
import { applyVote, emptyTiers, parseTiers, tierCounts } from './tiers.mjs'
import { animatedWebp, webpChunks } from './webp-anim.mjs'

test('keeps every character model once, in its group, and skips scenes, title cards and bad ids', () => {
  const list = [
    { id: 'c123', name: 'Unit A' }, { id: 'c123_01', name: 'Unit A Outfit' }, { id: 'c123_old', name: 'Unit A old' },
    { id: 'favorite_c123', name: 'Favorite: Unit A' }, { id: 'c812', name: 'Guest' }, { id: 'c8004', name: 'Guest Two' },
    { id: 'c951', name: 'Story Person' }, { id: 'c952', name: 'Faceless NPC 3' }, { id: 'c9001', name: 'Story Two' },
    { id: 'xb001', name: 'Boss: Machine' }, { id: 'smol_unit', name: 'Smol Unit' }, { id: 'ce009_char_01', name: 'Smol Other', f: 'ce009_char_01' },
    { id: 'eventscene', name: 'A Scene' }, { id: 'story0001', name: 'Story 00-01' }, { id: '../x', name: 'Bad' },
    { id: 'c123', name: 'Unit A again' }, { id: 'c124', name: 'Unit B', f: 'c124_alt' },
  ]
  assert.deepEqual(list.map(groupOf), ['base', 'skin', 'skin', 'skin', 'collab', 'collab', 'story', 'story', 'story', 'boss', 'chibi', 'chibi',
    null, null, null, 'base', 'base'])
  const roster = rosterOf(list)
  assert.deepEqual(roster.map((e) => e.id), ['c123', 'c123_01', 'c123_old', 'favorite_c123', 'c812', 'c8004', 'c951', 'c952', 'c9001', 'xb001',
    'smol_unit', 'ce009_char_01', 'c124'])
  assert.deepEqual(rosterOf(list, ['collab']).map((e) => e.id), ['c812', 'c8004'])
  const [a] = roster, b = roster.at(-1)
  assert.deepEqual(['fb', 'aim', 'cover'].map((p) => poseStem(a, p)), ['c123_00', 'aim/c123_aim_00', 'cover/c123_cover_00'])
  assert.equal(poseStem(b, 'aim'), 'aim/c124_alt')
  assert.equal(poseStem(roster.find((e) => e.id === 'ce009_char_01'), 'fb'), 'ce009_char_01')
  assert.deepEqual(['c123', 'favorite_c123', 'smol_unit', 'ce009_char_01'].map((id) => idlesFor(id, 'fb')[0]), ['idle', 'idle_merged', 'pose_idle', 'down_idle'])
  assert.deepEqual(idlesFor('c123', 'cover'), ['cover_idle'])
})

test('reads atlas pages and picks the skins the viewer shows, backdrops last', () => {
  assert.deepEqual(atlasPages('one.png\nsize:2048,2048\npma:true\nregion\nbounds:1,2,3,4\n\ntwo.png\nsize:1024,1024\n'), ['one.png', 'two.png'])
  assert.deepEqual(skinsFor('c999', 'fb'), ['default'])
  assert.deepEqual(skinsFor('c220', 'fb'), ['acc', 'default'])
  assert.deepEqual(skinsFor('c015', 'fb'), ['default', 'bg'])
  assert.deepEqual(skinsFor('c570', 'aim'), ['part_0', 'default'])
  assert.deepEqual(['\x00\x074.0.47', '\x074.1.20\x00', '\x073.8.99', ''].map((h) => spineVersion(Buffer.from(h, 'latin1'))), ['4.0', '4.1', null, null])
  // The host serves its web page, with a 200, for a file it doesn't have.
  assert.equal(isWebPage(Buffer.from('\n<!DOCTYPE html><html>')), true)
  assert.equal(isWebPage(Buffer.from([137, 80, 78, 71])), false)
})

test('splashes Aim and Cover when she has them, else Standing; batches by role', () => {
  const splash = RENDERS.find((r) => r.name === 'splash.webp')
  assert.deepEqual(posesOf(splash, ['fb', 'aim', 'cover']), ['aim', 'cover'])
  assert.deepEqual(posesOf(splash, ['fb']), ['fb'])
  assert.equal(posesOf(RENDERS.find((r) => r.name === 'compare-front-back.webp'), ['fb']), null)
  assert.deepEqual(rendersForRole('regular').map((r) => r.name), ['full.webp', 'splash.webp'])
  assert.deepEqual(rendersForRole('boss').map((r) => r.name), ['full.webp', 'splash.webp', 'full-anim.webp', 'splash-anim.webp'])
  assert.deepEqual(rendersForRole('exclude'), [])
  assert.deepEqual(rendersForRole(undefined), [])
})

/** A synthetic still WebP: RIFF, VP8X, an odd-sized ALPH (padded) and a VP8 chunk. The muxer never decodes them. */
function still(seed) {
  const chunk = (id, data) => Buffer.concat([Buffer.from(id), Buffer.from(Uint32Array.of(data.length).buffer), data, Buffer.alloc(data.length & 1)])
  const body = Buffer.concat([Buffer.from('WEBP'), chunk('VP8X', Buffer.alloc(10)), chunk('ALPH', Buffer.from([seed, 1, 2])), chunk('VP8 ', Buffer.from([seed, 9, 8, 7]))])
  return new Uint8Array(Buffer.concat([Buffer.from('RIFF'), Buffer.from(Uint32Array.of(body.length).buffer), body]))
}

test('joins still WebPs into a looping animation: each frame full-canvas, unblended, with its own duration', () => {
  const out = animatedWebp([{ bytes: still(1), duration: 83.4 }, { bytes: still(2), duration: 84 }], { width: 640, height: 360 })
  const view = Buffer.from(out)
  assert.equal(view.readUInt32LE(4), out.length - 8)
  const chunks = webpChunks(out)
  assert.deepEqual(chunks.map((c) => c.id), ['VP8X', 'ANIM', 'ANMF', 'ANMF'])
  const vp8x = Buffer.from(chunks[0].data)
  assert.equal(vp8x[0], 0x12) // alpha and animation
  assert.equal(vp8x.readUIntLE(4, 3) + 1, 640)
  assert.equal(vp8x.readUIntLE(7, 3) + 1, 360)
  assert.equal(Buffer.from(chunks[1].data).readUInt16LE(4), 0) // loops forever
  const frame = Buffer.from(chunks[2].data)
  assert.deepEqual([frame.readUIntLE(0, 3), frame.readUIntLE(3, 3), frame.readUIntLE(6, 3) + 1, frame.readUIntLE(9, 3) + 1, frame.readUIntLE(12, 3), frame[15]], [0, 0, 640, 360, 83, 2])
  const inner = webpChunks(new Uint8Array(Buffer.concat([Buffer.from('RIFF'), Buffer.alloc(4), Buffer.from('WEBP'), frame.subarray(16)])))
  assert.deepEqual(inner.map((c) => [c.id, [...c.data]]), [['ALPH', [1, 1, 2]], ['VP8 ', [1, 9, 8, 7]]])
  assert.throws(() => animatedWebp([], { width: 1, height: 1 }), /no frames/)
  assert.throws(() => animatedWebp([{ bytes: new Uint8Array(20), duration: 1 }], { width: 1, height: 1 }), /not a WebP/)
})

test('reads, applies and counts tier votes, refusing anything it does not know', () => {
  let state = applyVote(applyVote(emptyTiers(), 'c123', 'boss'), 'c124', 'exclude')
  state = applyVote(state, 'c124', null)
  assert.deepEqual(state, { schemaVersion: 1, revision: 3, tiers: { c123: 'boss' } })
  assert.deepEqual(parseTiers(JSON.parse(JSON.stringify(state))), state)
  assert.deepEqual(tierCounts({ a: 'boss', b: 'boss', c: 'regular' }), { exclude: 0, regular: 1, key: 0, subboss: 0, boss: 2 })
  assert.throws(() => applyVote(state, 'c123', 'legend'), /unknown tier/)
  assert.throws(() => parseTiers({ schemaVersion: 2, revision: 0, tiers: {} }), /not an L2D tiers file/)
  assert.throws(() => parseTiers({ schemaVersion: 1, revision: 0, tiers: { c1: 'great' } }), /unknown tier/)
  assert.throws(() => parseTiers({ schemaVersion: 1, revision: 0, tiers: { '../x': 'boss' } }), /bad id/)
})

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'l2d-server-test-')), content = join(root, 'l2d')
  t.after(() => rm(root, { recursive: true, force: true }))
  await mkdir(join(content, 'sources/c123/aim'), { recursive: true })
  await mkdir(join(content, 'vendor'), { recursive: true })
  await writeFile(join(content, 'roster.json'), JSON.stringify({ schemaVersion: 1, entries: [{ id: 'c123', name: 'Synthetic <unit>', group: 'base' }, { id: 'c124', name: 'Not downloaded', group: 'skin' }] }))
  await writeFile(join(content, 'sources/c123/c123_00.skel'), 'xxxxxxxx\x074.1.20 skeleton')
  await writeFile(join(content, 'sources/c123/aim/c123_aim_00.skel'), 'xxxxxxxx\x074.0.47 aim skeleton')
  await writeFile(join(content, 'sources/c123/face.png'), 'face')
  await writeFile(join(content, 'sources/c123/secret.txt'), 'not listed')
  await writeFile(join(content, 'sources/c123/manifest.json'), JSON.stringify({ id: 'c123', face: { bytes: 4, sha256: 'x' }, poses: {
    fb: { stem: 'c123_00', files: { 'c123_00.skel': { bytes: 8 } } }, aim: { stem: 'aim/c123_aim_00', files: { 'aim/c123_aim_00.skel': { bytes: 12 } } }, cover: { stem: 'cover/c123_cover_00', missing: true } } }))
  await writeFile(join(content, 'vendor/spine-webgl-4.0.min.js'), 'var spine = 40')
  await writeFile(join(content, 'vendor/spine-webgl-4.1.min.js'), 'var spine = 41')
  await writeFile(join(content, 'vendor/gifenc.esm.js'), 'export {}')
  const handler = await l2dHandler({ content, port: 5195 })
  const request = async (path, { method = 'GET', host = '127.0.0.1:5195', origin, token, body, contentType = 'application/json' } = {}) => {
    const headers = { host, ...(origin ? { origin } : {}), ...(token ? { 'x-l2d-token': token } : {}), 'content-type': contentType }
    const req = { url: path, method, headers, async *[Symbol.asyncIterator]() { if (body !== undefined) yield Buffer.from(typeof body === 'string' || body instanceof Uint8Array ? body : JSON.stringify(body)) } }
    const res = { headers: {}, status: 200, setHeader(k, v) { this.headers[k] = v }, writeHead(status, headers) { this.status = status; Object.assign(this.headers, headers) }, end(bytes) { this.bytes = Buffer.from(bytes ?? '') } }
    await handler(req, res)
    return { status: res.status, headers: res.headers, text: () => res.bytes.toString(), json: () => JSON.parse(res.bytes) }
  }
  const token = (await request('/api/state')).json().token
  return { root, content, request, token, origin: 'http://127.0.0.1:5195' }
}

test('serves the app and only the files a manifest lists, to local hosts', async (t) => {
  const { root, content, request, token } = await fixture(t)
  const page = await request('/')
  assert.match(page.text(), new RegExp(`content="${token}"`))
  assert.match(page.headers['Content-Security-Policy'], /script-src 'self'/)
  const state = (await request('/api/state')).json()
  assert.deepEqual(state.entries.map((e) => [e.id, e.poses, e.pending, e.spine, e.face]), [
    ['c123', { fb: 'c123_00', aim: 'aim/c123_aim_00' }, [], { fb: '4.1', aim: '4.0' }, true], ['c124', {}, ['fb', 'aim', 'cover'], {}, false]])
  assert.match((await request('/src/c123/aim/c123_aim_00.skel')).text(), /aim skeleton$/)
  assert.equal((await request('/src/c123/face.png')).text(), 'face')
  // Both runtimes define `spine`: each is kept under its own name as it loads.
  const runtimes = {}
  new Function('out', `${(await request('/vendor/spine.js')).text()}; out.a = spine40; out.b = spine41`)(runtimes)
  assert.deepEqual(runtimes, { a: 40, b: 41 })
  assert.equal((await request('/vendor/gifenc.esm.js')).text(), 'export {}')
  for (const path of ['/src/c123/secret.txt', '/src/c123/manifest.json', '/src/c123/../roster.json', '/src/c124/face.png', '/src/c999/c123_00.skel',
    '/vendor/other.js', '/vendor/spine-webgl-4.1.min.js', '/renders/c123/full.webp', '/renders/c123/../../roster.json', '/app.html', '/server.mjs']) assert.equal((await request(path)).status, 404, path)
  assert.equal((await request('/', { host: 'evil.example:5195' })).status, 403)
  assert.equal((await request('/api/state', { origin: 'http://evil.example' })).status, 403)
  // A listed file swapped for a link out of the folder isn't followed.
  await writeFile(join(root, 'outside.txt'), 'private')
  await rm(join(content, 'sources/c123/face.png'))
  await symlink(join(root, 'outside.txt'), join(content, 'sources/c123/face.png'))
  assert.equal((await request('/src/c123/face.png')).status, 404)
})

test('saves votes with a history line each, and keeps renders under their allowlisted names', async (t) => {
  const { content, request, token, origin } = await fixture(t)
  assert.equal((await request('/api/tier', { method: 'POST', body: { id: 'c123', tier: 'boss' } })).status, 403)
  assert.equal((await request('/api/tier', { method: 'POST', origin, token: 'wrong', body: { id: 'c123', tier: 'boss' } })).status, 403)
  assert.deepEqual((await request('/api/tier', { method: 'POST', origin, token, body: { id: 'c123', tier: 'boss' } })).json(), { revision: 1, tier: 'boss' })
  assert.deepEqual((await request('/api/tier', { method: 'POST', origin, token, body: { id: 'c123', tier: null } })).json(), { revision: 2, tier: null })
  await request('/api/tier', { method: 'POST', origin, token, body: { id: 'c124', tier: 'regular' } })
  assert.equal((await request('/api/tier', { method: 'POST', origin, token, body: { id: 'c999', tier: 'boss' } })).status, 404)
  assert.equal((await request('/api/tier', { method: 'POST', origin, token, body: { id: 'c123', tier: 'legend' } })).status, 400)
  assert.deepEqual(JSON.parse(await readFile(join(content, 'tiers.json'), 'utf8')), { schemaVersion: 1, revision: 3, tiers: { c124: 'regular' } })
  const history = (await readFile(join(content, 'tiers-history.jsonl'), 'utf8')).trim().split('\n').map((l) => JSON.parse(l))
  assert.deepEqual(history.map((h) => [h.id, h.from, h.tier]), [['c123', null, 'boss'], ['c123', 'boss', null], ['c124', null, 'regular']])

  const webp = new Uint8Array([82, 73, 70, 70])
  assert.equal((await request('/api/render/c123/full.webp', { method: 'PUT', origin, token, body: webp, contentType: 'image/png' })).status, 415)
  assert.equal((await request('/api/render/c123/other.webp', { method: 'PUT', origin, token, body: webp, contentType: 'image/webp' })).status, 404)
  assert.equal((await request('/api/render/c123/full.webp', { method: 'PUT', origin, token, body: webp, contentType: 'image/webp' })).status, 200)
  assert.ok(existsSync(join(content, 'renders/c123/full.webp')))
  assert.equal((await request('/renders/c123/full.webp')).text(), 'RIFF')
  assert.deepEqual((await request('/api/state')).json().entries[0].renders, { 'full.webp': 4 })
})
