// Draws the app icons (a gold horseshoe on the night-stable navy) with no dependencies: node scripts/generate-icons.mjs
import { writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

const CRC = new Uint32Array(256).map((_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
const crc32 = (b) => {
  let c = 0xffffffff
  for (const x of b) c = CRC[(c ^ x) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function chunk(type, data) {
  const out = Buffer.alloc(12 + data.length)
  out.writeUInt32BE(data.length, 0)
  out.write(type, 4, 'ascii')
  Buffer.from(data).copy(out, 8)
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length)
  return out
}
function png(size, px) {
  const head = Buffer.alloc(13)
  head.writeUInt32BE(size, 0)
  head.writeUInt32BE(size, 4)
  head.set([8, 6, 0, 0, 0], 8)
  const raw = Buffer.alloc((size * 4 + 1) * size)
  for (let y = 0; y < size; y++) Buffer.from(px.buffer, y * size * 4, size * 4).copy(raw, y * (size * 4 + 1) + 1)
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', head), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))])
}

const BG = [15, 22, 32], GOLD = [214, 162, 62], GOLD_LIGHT = [242, 206, 120], NAIL = [70, 48, 14]

// Coverage of the horseshoe at a point in unit coordinates (0..1), with the opening at the bottom.
function shape(u, v) {
  const x = u - 0.5, y = v - 0.47
  const r = Math.hypot(x, y)
  const angle = Math.atan2(y, x) // 0 = right, +π/2 = down
  const inRing = r > 0.19 && r < 0.33
  const gap = angle > Math.PI * 0.3 && angle < Math.PI * 0.7 && y > 0
  if (!inRing || gap) return null
  for (let i = 0; i < 6; i++) {
    const a = Math.PI * (0.85 + i * 0.26)
    if (Math.hypot(x - Math.cos(a) * 0.26, y - Math.sin(a) * 0.26) < 0.022) return NAIL
  }
  return y < -0.05 && x < 0.05 ? GOLD_LIGHT : GOLD
}

function draw(size) {
  const px = new Uint8Array(size * size * 4)
  const ss = 4
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0
      for (let sy = 0; sy < ss; sy++)
        for (let sx = 0; sx < ss; sx++) {
          const c = shape((x + (sx + 0.5) / ss) / size, (y + (sy + 0.5) / ss) / size) ?? BG
          r += c[0]; g += c[1]; b += c[2]
        }
      const n = ss * ss, i = (y * size + x) * 4
      px.set([Math.round(r / n), Math.round(g / n), Math.round(b / n), 255], i)
    }
  return png(size, px)
}

for (const [name, size] of [['icon-192.png', 192], ['icon-512.png', 512], ['apple-touch-icon.png', 180]]) writeFileSync(new URL(`../public/icons/${name}`, import.meta.url), draw(size))
writeFileSync(
  new URL('../public/icons/icon.svg', import.meta.url),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="#0f1620"/><path d="M38 77 A26 26 0 1 1 62 77" fill="none" stroke="#d6a23e" stroke-width="14" stroke-linecap="butt"/></svg>`,
)
console.log('icons written')
