// A foe's round face (D81, D135), shared by the world map's stage lists and the Rift's chains and sheets.
import { useEffect, useState } from 'react'
import { castArtUrl } from '../content/cast'
import type { Campaign } from './campaign'

/** A foe's round face: her face icon over her colour (nothing while it loads or when she has none). */
export function CastFace({ campaign, castId, size }: { campaign: Campaign; castId: string; size: number }) {
  const [url, setUrl] = useState<string | null>(null)
  const member = campaign.cast.byId.get(castId)
  const image = member?.face
  useEffect(() => {
    let live = true
    if (image) void castArtUrl(image.path).then((u) => live && setUrl(u), () => undefined)
    return () => {
      live = false
    }
  }, [image])
  return (
    <span className="relative block shrink-0 overflow-hidden rounded-full bg-raised" style={{ width: size, height: size, background: member?.color }}>
      {url && <img src={url} alt="" className="size-full object-cover" />}
    </span>
  )
}
