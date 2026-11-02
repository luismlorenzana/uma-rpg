// An Uma's stained-glass window at her share lit (D283, H155; collections.md §4.3): the release's window and its pane map
// drawn on a canvas by `litRgba`, at the size it shows, cached as an image by outfit, share and size. A full window is
// the art itself, and an unlit one needs no map. Newly lit panes fade up over 600 ms (at once under reduced motion). The
// art derives from original art (P6): it's only ever loaded from the private release, never bundled.
import { imagePath, useArtUrl } from '@luismlorenzana/uma-kit/content'
import { useEffect, useRef, useState } from 'react'
import { useMaster } from '../../master/master'
import { litRgba } from './glass-view'

const cache = new Map<string, string>()
const CACHE_MAX = 300

function remember(key: string, url: string): void {
  if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value!)
  cache.set(key, url)
}

function load(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`can't load ${url}`))
    image.src = url
  })
}

/** Draws a window `px` square at `lit` of `steps`, as a data URL. */
async function render(windowUrl: string, orderUrl: string | null, lit: number, steps: number, px: number): Promise<string> {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = px
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return windowUrl
  ctx.drawImage(await load(windowUrl), 0, 0, px, px)
  const art = ctx.getImageData(0, 0, px, px)
  let order: Uint8ClampedArray | null = null
  if (orderUrl) {
    // The map keeps one value a pane, so it scales by nearest neighbour.
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(await load(orderUrl), 0, 0, px, px)
    order = ctx.getImageData(0, 0, px, px).data
  }
  ctx.putImageData(new ImageData(litRgba(art.data, order, lit, steps) as Uint8ClampedArray<ArrayBuffer>, px, px), 0, 0)
  return canvas.toDataURL('image/webp', 0.9)
}

const reducedMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

export function GlassWindow({ outfitId, lit, steps, size, className = '', label }: {
  outfitId: string; lit: number; steps: number; size: number; className?: string; label?: string
}) {
  const master = useMaster()
  const art = master.status === 'ready' ? master.view.art : null
  const windowUrl = useArtUrl(imagePath(art, 'outfit-glass', outfitId))
  const partial = lit > 0 && lit < steps
  const orderPath = partial ? imagePath(art, 'outfit-glass-order', outfitId) : null
  const orderUrl = useArtUrl(orderPath)
  const px = Math.min(512, Math.round(size * (typeof devicePixelRatio === 'number' ? devicePixelRatio : 2)))
  const key = `${outfitId}:${lit}:${steps}:${px}`
  const [src, setSrc] = useState<string | null>(() => (lit >= steps ? windowUrl : cache.get(key) ?? null))
  const before = useRef<{ src: string | null; lit: number }>({ src: null, lit })
  const [fade, setFade] = useState<string | null>(null)

  useEffect(() => {
    if (!windowUrl) return
    if (lit >= steps) {
      setSrc(windowUrl)
      return
    }
    const hit = cache.get(key)
    if (hit) {
      setSrc(hit)
      return
    }
    // A partial window waits for its map; without one in the release it's drawn dark whole.
    if (partial && orderPath && !orderUrl) return
    let live = true
    render(windowUrl, partial ? orderUrl : null, lit, steps, px).then((url) => {
      remember(key, url)
      if (live) setSrc(url)
    }, () => { if (live) setSrc(null) })
    return () => { live = false }
  }, [key, lit, orderPath, orderUrl, partial, px, steps, windowUrl])

  // A step lit while the window is on screen: the new state fades in over the old.
  useEffect(() => {
    if (src && before.current.src && lit > before.current.lit && !reducedMotion()) setFade(before.current.src)
    before.current = { src, lit }
    const t = setTimeout(() => setFade(null), 650)
    return () => clearTimeout(t)
  }, [src, lit])

  return (
    <span className={`relative block shrink-0 overflow-hidden bg-[#0e1117] ${className}`} style={{ width: size, height: size }}
      role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} data-glass={outfitId} data-glass-lit={lit}>
      {fade && <img src={fade} alt="" className="absolute inset-0 size-full" draggable={false} />}
      {src && <img src={src} alt="" className={`absolute inset-0 size-full ${fade ? 'animate-[glass-light_600ms_ease-out]' : ''}`} draggable={false} />}
    </span>
  )
}
