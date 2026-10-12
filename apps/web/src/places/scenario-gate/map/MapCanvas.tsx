import atlasUrl from '@luismlorenzana/uma-art/world/atlas.png?url'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { artScale, hubDpr } from '../../../hub/grid'
import { frames } from './visuals'
import type { MapLayout, MapSpot } from './layout'

let imagePromise: Promise<HTMLImageElement> | undefined
function atlasImage() {
  return imagePromise ??= new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => { imagePromise = undefined; reject(new Error('Map art unavailable')) }
    image.src = atlasUrl
  })
}
/** Same whole-device-pixel scale as the Hub; allow at most half a tile of edge crop on narrow phones. */
export const mapScale = (width: number, dpr: number): number =>
  Math.min(artScale(dpr), Math.max(1, Math.floor(width * dpr / 240)) / dpr)
export interface SpotContent { label: string; content?: ReactNode; disabled?: boolean }
export function MapCanvas({ layout, describe, onSpot, focusKey, focusId, children }: {
  layout: MapLayout; describe: (spot: MapSpot) => SpotContent; onSpot: (spot: MapSpot) => void
  focusKey: string; focusId?: string; children?: ReactNode
}) {
  const host = useRef<HTMLDivElement>(null), canvas = useRef<HTMLCanvasElement>(null), ring = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null), [failed, setFailed] = useState(false)
  const [width, setWidth] = useState(390), [dpr, setDpr] = useState(hubDpr)
  const scale = mapScale(width, dpr), w = layout.cols * 16 * scale, h = layout.rows * 16 * scale
  const frontier = layout.sprites.find((s) => s.frame === 'marker/frontier-0')
  useEffect(() => {
    let live = true
    void atlasImage().then((img) => { if (live) { setImage(img); setFailed(false) } }, () => { if (live) setFailed(true) })
    return () => { live = false }
  }, [])
  useEffect(() => {
    const el = host.current!
    const measure = () => { setWidth(el.clientWidth || 390); setDpr(hubDpr()) }
    measure()
    const observer = new ResizeObserver(measure); observer.observe(el)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    const ctx = canvas.current?.getContext('2d')
    if (!ctx || !image) return
    ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0)
    ctx.imageSmoothingEnabled = false
    const draw = (id: string, x: number, y: number) => {
      const f = frames[id]!
      ctx.drawImage(image, f.x, f.y, f.w, f.h, x, y, f.w, f.h)
    }
    ctx.clearRect(0, 0, layout.cols * 16, layout.rows * 16)
    for (const c of layout.cells) draw(c.frame, c.col * 16, c.row * 16)
    for (const s of layout.sprites) if (!s.frame.startsWith('marker/frontier-')) draw(s.frame, s.x, s.y)
  }, [layout, image, scale, dpr])
  // Only the 16×16 ring redraws; the full terrain canvas never enters the animation loop.
  useEffect(() => {
    const ctx = ring.current?.getContext('2d')
    if (!ctx || !image || !frontier) return
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    let timer: ReturnType<typeof setInterval> | undefined, phase = 0
    const draw = () => {
      const f = frames['marker/frontier-' + phase]!
      ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0); ctx.imageSmoothingEnabled = false
      ctx.clearRect(0, 0, 16, 16)
      ctx.drawImage(image, f.x, f.y, f.w, f.h, 0, 0, 16, 16)
    }
    const update = () => {
      clearInterval(timer); phase = 0; draw()
      if (!query.matches) timer = setInterval(() => { phase = 1 - phase; draw() }, 650)
    }
    update(); query.addEventListener('change', update)
    return () => { clearInterval(timer); query.removeEventListener('change', update) }
  }, [frontier, image, scale, dpr])
  const focused = useRef('')
  useEffect(() => {
    if (focused.current === focusKey || width !== (host.current?.clientWidth || 390)) return
    const el = host.current
    if (!el) return
    let scroll = el.parentElement
    while (scroll && !/auto|scroll/.test(getComputedStyle(scroll).overflowY)) scroll = scroll.parentElement
    if (!scroll) return
    const spot = layout.spots.find((s) => s.id === focusId)
    const header = scroll.querySelector<HTMLElement>('[data-map-header]')?.offsetHeight ?? 0
    scroll.scrollTop += el.getBoundingClientRect().top - scroll.getBoundingClientRect().top
      + (spot ? (spot.y + spot.h / 2) * scale : 0) - header - (scroll.clientHeight - header) * 0.65
    focused.current = focusKey
  }, [focusKey, focusId, layout, scale, width])
  return <div ref={host} className="relative w-full overflow-x-clip" data-map-canvas>
    <div className="relative mx-auto" style={{ width: w, height: h, marginLeft: w > width ? (width - w) / 2 : undefined }}>
      <canvas ref={canvas} aria-hidden="true" width={Math.round(w * dpr)} height={Math.round(h * dpr)} style={{ width: w, height: h, imageRendering: 'pixelated' }} />
      {frontier && <canvas ref={ring} aria-hidden="true" width={Math.round(16 * scale * dpr)} height={Math.round(16 * scale * dpr)} className="pointer-events-none absolute" style={{ left: frontier.x * scale, top: frontier.y * scale, width: 16 * scale, height: 16 * scale, imageRendering: 'pixelated' }} />}
      {layout.spots.map((spot) => {
        const item = describe(spot), bw = Math.max(44, spot.w * scale), bh = Math.max(44, spot.h * scale)
        const inset = Math.max(0, (w - width) / 2)
        const left = Math.max(inset, Math.min(w - inset - bw, (spot.x + spot.w / 2) * scale - bw / 2))
        return <button key={spot.kind + spot.id} type="button" aria-label={item.label} disabled={item.disabled} onClick={() => onSpot(spot)}
          className="absolute rounded-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
          style={{ left, top: Math.max(0, (spot.y + spot.h / 2) * scale - bh / 2), width: bw, height: bh }}>{item.content}</button>
      })}
      {children}
    </div>
    {failed && <p role="status" className="absolute left-3 top-3 rounded-sm bg-page p-2 text-[13px]">Map art unavailable. Use List.</p>}
  </div>
}

export function BiomeIcon({ biome }: { biome: string }) {
  const f = frames['icon/' + biome]!
  return <span aria-hidden="true" className="inline-block size-6 shrink-0 bg-no-repeat align-middle" style={{ backgroundImage: `url(${atlasUrl})`, backgroundSize: '384px 768px', backgroundPosition: `-${f.x * 1.5}px -${f.y * 1.5}px`, imageRendering: 'pixelated' }} />
}
