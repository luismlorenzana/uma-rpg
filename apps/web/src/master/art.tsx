// Release art in the page. Images need the owner's token, so they're fetched with it and shown from blob URLs, which
// are kept for the session; the service worker caches the bytes (hash-named, immutable).
import type { ArtIndex, AtlasFamily, ImageFamily } from '@luismlorenzana/uma-data'
import { useEffect, useState, type CSSProperties } from 'react'
import { authHeaders } from '../api/client'

const blobUrls = new Map<string, Promise<string>>()

/** A blob URL for a release file path (`atlases/…`, `art/…`). */
export function artUrl(path: string): Promise<string> {
  let url = blobUrls.get(path)
  if (!url) {
    url = (async () => {
      const res = await fetch(`/api/master/files/${path.split('/').map(encodeURIComponent).join('/')}`, { headers: await authHeaders() })
      if (!res.ok) throw new Error(`art ${res.status}`)
      return URL.createObjectURL(await res.blob())
    })()
    url.catch(() => blobUrls.delete(path))
    blobUrls.set(path, url)
  }
  return url
}

export function useArtUrl(path: string | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    let live = true
    setUrl(null)
    if (path) void artUrl(path).then((u) => live && setUrl(u), () => undefined)
    return () => {
      live = false
    }
  }, [path])
  return url
}

export function imagePath(art: ArtIndex | null, family: ImageFamily, key: string): string | null {
  return art?.images[family]?.[key]?.path ?? null
}

/** One frame of an icon atlas, drawn at `size` CSS px with a CSS background. Falls back to a placeholder tile. */
export function AtlasSprite({ art, family, frameKey, size, className = '', label }: {
  art: ArtIndex | null
  family: AtlasFamily
  frameKey: string
  size: number
  className?: string
  label?: string
}) {
  const atlas = art?.atlases[family]
  const frame = atlas?.frames[frameKey]
  const page = frame ? atlas?.pages[frame.page] : undefined
  const url = useArtUrl(page?.path)
  const style: CSSProperties = { width: size, height: size }
  if (frame && page && url) {
    const scale = size / frame.width
    style.backgroundImage = `url(${url})`
    style.backgroundSize = `${page.width * scale}px ${page.height * scale}px`
    style.backgroundPosition = `-${frame.x * scale}px -${frame.y * scale}px`
  }
  return <div role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} className={`shrink-0 rounded-sm bg-raised bg-no-repeat ${className}`} style={style} />
}
