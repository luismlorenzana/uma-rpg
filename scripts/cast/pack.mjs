// Shared by the franchise pack imports (D76): a polite one-at-a-time fetcher with a cache, PNG sizes, slugs, and the
// writer for content/release/<folder>/cast.json plus <folder>/cast/<slug>.<hash>.<ext>. Everything lands in the
// gitignored content/ folder.
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deflateSync, inflateSync } from 'node:zlib'

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')
const USER_AGENT = 'uma-rpg-cast-import (private, one-time)'
const PNG_SIGNATURE = '89504e470d0a1a0a'

export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** A lowercase ASCII slug: accents dropped, everything else a hyphen. */
export const slugOf = (name) =>
  name.replaceAll('ß', 'ss').normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

/** Width and height of a PNG, or a throw for anything else (an error page, say). */
export function pngSize(b) {
  if (b.subarray(0, 8).toString('hex') !== PNG_SIGNATURE) throw new Error('not a PNG')
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) }
}

const paeth = (a, b, c) => {
  const p = a + b - c
  const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c)
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c
}

/** Decodes an 8-bit RGBA, non-interlaced PNG (what both franchise sources serve) to raw pixels. */
function decodeRgba(b) {
  const { width, height } = pngSize(b)
  if (b[24] !== 8 || b[25] !== 6 || b[28] !== 0) throw new Error('only 8-bit RGBA, non-interlaced PNGs')
  const idat = []
  for (let at = 8; at < b.length;) {
    const length = b.readUInt32BE(at)
    const type = b.toString('ascii', at + 4, at + 8)
    if (type === 'IDAT') idat.push(b.subarray(at + 8, at + 8 + length))
    at += 12 + length
  }
  const raw = inflateSync(Buffer.concat(idat))
  const stride = width * 4
  const px = Buffer.alloc(stride * height)
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)]
    for (let x = 0; x < stride; x++) {
      const v = raw[y * (stride + 1) + 1 + x]
      const a = x >= 4 ? px[y * stride + x - 4] : 0
      const up = y > 0 ? px[(y - 1) * stride + x] : 0
      const c = x >= 4 && y > 0 ? px[(y - 1) * stride + x - 4] : 0
      px[y * stride + x] = (v + [0, a, up, (a + up) >> 1, paeth(a, up, c)][filter]) & 0xff
    }
  }
  return { width, height, px }
}

function chunk(type, data) {
  const out = Buffer.alloc(12 + data.length)
  out.writeUInt32BE(data.length, 0)
  out.write(type, 4, 'ascii')
  data.copy(out, 8)
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length)
  return out
}
const CRC = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
function crc32(buf) {
  let c = 0xffffffff
  for (const byte of buf) c = CRC[(c ^ byte) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

/** Encodes raw RGBA pixels as a PNG, each row with the filter that leaves the smallest sum (the usual heuristic). */
function encodeRgba(width, height, px) {
  const stride = width * 4
  const rows = []
  for (let y = 0; y < height; y++) {
    let best = null
    for (let filter = 0; filter < 5; filter++) {
      const row = Buffer.alloc(stride + 1)
      row[0] = filter
      let sum = 0
      for (let x = 0; x < stride; x++) {
        const v = px[y * stride + x]
        const a = x >= 4 ? px[y * stride + x - 4] : 0
        const up = y > 0 ? px[(y - 1) * stride + x] : 0
        const c = x >= 4 && y > 0 ? px[(y - 1) * stride + x - 4] : 0
        const f = (v - [0, a, up, (a + up) >> 1, paeth(a, up, c)][filter]) & 0xff
        row[1 + x] = f
        sum += f < 128 ? f : 256 - f
      }
      if (!best || sum < best.sum) best = { row, sum }
    }
    rows.push(best.row)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr.set([8, 6, 0, 0, 0], 8)
  return Buffer.concat([Buffer.from(PNG_SIGNATURE, 'hex'), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(Buffer.concat(rows), { level: 9 })), chunk('IEND', Buffer.alloc(0))])
}

/** Crops a portrait to what isn't transparent, plus a small margin, so it fills its card. */
export function trimPng(bytes, margin = 4) {
  const { width, height, px } = decodeRgba(bytes)
  let x0 = width, y0 = height, x1 = -1, y1 = -1
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (px[(y * width + x) * 4 + 3] > 8) {
        if (x < x0) x0 = x
        if (x > x1) x1 = x
        if (y < y0) y0 = y
        if (y > y1) y1 = y
      }
    }
  }
  if (x1 < 0) return bytes
  x0 = Math.max(0, x0 - margin), y0 = Math.max(0, y0 - margin), x1 = Math.min(width - 1, x1 + margin), y1 = Math.min(height - 1, y1 + margin)
  const w = x1 - x0 + 1, h = y1 - y0 + 1
  const out = Buffer.alloc(w * h * 4)
  for (let y = 0; y < h; y++) px.copy(out, y * w * 4, ((y0 + y) * width + x0) * 4, ((y0 + y) * width + x1 + 1) * 4)
  return encodeRgba(w, h, out)
}

/**
 * Fetches each url once into the cache, waiting `delayMs` between network requests (a site's Crawl-delay). Returns
 * the bytes, or null on a 404.
 */
export function cachedFetcher(cacheDir, delayMs) {
  let last = 0
  return async (key, url) => {
    const cached = join(cacheDir, key)
    if (existsSync(cached)) return readFile(cached)
    const wait = last + delayMs - Date.now()
    if (wait > 0) await sleep(wait)
    last = Date.now()
    const response = await fetch(url, { headers: { 'user-agent': USER_AGENT } })
    if (response.status === 404) return null
    if (!response.ok) throw new Error(`${key}: HTTP ${response.status}`)
    const bytes = Buffer.from(await response.arrayBuffer())
    await mkdir(dirname(cached), { recursive: true })
    await writeFile(cached, bytes)
    return bytes
  }
}

/** Writes a pack: every portrait under <folder>/cast/, hash-named, then the list. Returns the total bytes. */
export async function writePack(folder, meta, members) {
  const release = join(ROOT, 'content/release', folder)
  await rm(join(release, 'cast'), { recursive: true, force: true })
  await mkdir(join(release, 'cast'), { recursive: true })
  const out = []
  for (const { bytes, ext, ...member } of members) {
    const path = `${folder}/cast/${member.id}.${sha256(bytes).slice(0, 8)}.${ext}`
    await writeFile(join(ROOT, 'content/release', path), bytes)
    out.push({ ...member, art: { path, ...pngSize(bytes), bytes: bytes.length } })
  }
  out.sort((a, b) => a.id.localeCompare(b.id))
  await writeFile(join(release, 'cast.json'), JSON.stringify({ schemaVersion: 1, ...meta, members: out }))
  return out.reduce((n, m) => n + m.art.bytes, 0)
}
