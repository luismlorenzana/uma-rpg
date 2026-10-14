// Animated WebP from still WebP frames, with no encoder: a browser's `canvas.toBlob('image/webp')` encodes each frame,
// and this wraps their image chunks in the animation container (RIFF: VP8X, ANIM, one ANMF per frame; see Google's
// "WebP Container Specification"). Pure, so the browser and the tests share it.

const ascii = (s) => Uint8Array.from(s, (c) => c.charCodeAt(0))
const fourcc = (b, o) => String.fromCharCode(b[o], b[o + 1], b[o + 2], b[o + 3])
const u32 = (b, o) => (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16)) + b[o + 3] * 0x1000000
const put24 = (b, o, v) => { b[o] = v & 255; b[o + 1] = (v >> 8) & 255; b[o + 2] = (v >> 16) & 255 }

function concat(parts) {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0))
  let o = 0
  for (const p of parts) { out.set(p, o); o += p.length }
  return out
}

/** A chunk: four-letter id, little-endian size, data, a pad byte to keep chunks even. */
function chunk(id, data) {
  const out = new Uint8Array(8 + data.length + (data.length & 1))
  out.set(ascii(id), 0)
  new DataView(out.buffer).setUint32(4, data.length, true)
  out.set(data, 8)
  return out
}

/** A WebP file's top-level chunks. */
export function webpChunks(bytes) {
  if (bytes.length < 12 || fourcc(bytes, 0) !== 'RIFF' || fourcc(bytes, 8) !== 'WEBP') throw new Error('not a WebP file')
  const chunks = []
  for (let o = 12; o + 8 <= bytes.length;) {
    const size = u32(bytes, o + 4)
    if (o + 8 + size > bytes.length) throw new Error('truncated WebP chunk')
    chunks.push({ id: fourcc(bytes, o), data: bytes.subarray(o + 8, o + 8 + size) })
    o += 8 + size + (size & 1)
  }
  return chunks
}

/**
 * Joins full-canvas frames into a looping animation. Each frame replaces the last (no blending), so transparent
 * areas stay transparent. `frames`: `{ bytes, duration }`, durations in ms.
 */
export function animatedWebp(frames, { width, height, loops = 0 }) {
  if (!frames.length) throw new Error('no frames')
  let alpha = false
  const anmf = frames.map(({ bytes, duration }) => {
    const image = webpChunks(bytes).filter((c) => c.id === 'ALPH' || c.id === 'VP8 ' || c.id === 'VP8L')
    if (!image.some((c) => c.id !== 'ALPH')) throw new Error('a frame has no image data')
    if (image.some((c) => c.id !== 'VP8 ')) alpha = true
    const header = new Uint8Array(16)
    put24(header, 6, width - 1)
    put24(header, 9, height - 1)
    put24(header, 12, Math.max(1, Math.round(duration)))
    header[15] = 0b10 // do not blend; no disposal
    return chunk('ANMF', concat([header, ...image.map((c) => chunk(c.id, c.data))]))
  })
  const vp8x = new Uint8Array(10)
  vp8x[0] = (alpha ? 0x10 : 0) | 0x02
  put24(vp8x, 4, width - 1)
  put24(vp8x, 7, height - 1)
  const anim = new Uint8Array(6) // transparent background, then the loop count
  anim[4] = loops & 255
  anim[5] = (loops >> 8) & 255
  const body = concat([ascii('WEBP'), chunk('VP8X', vp8x), chunk('ANIM', anim), ...anmf])
  const size = new Uint8Array(4)
  new DataView(size.buffer).setUint32(0, body.length, true)
  return concat([ascii('RIFF'), size, body])
}
