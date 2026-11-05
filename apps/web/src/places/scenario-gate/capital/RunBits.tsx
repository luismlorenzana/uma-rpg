import { FaceTile } from '@luismlorenzana/uma-kit/album'
import type { Campaign } from '../../../battle/campaign'

export function Pips({ count, total, label }: { count: number; total: number; label: string }) {
  return <span role="img" aria-label={`${label}: ${count} of ${total}`} className="inline-flex items-center gap-1.5">
    {Array.from({ length: total }, (_, i) => <span key={i} className={`size-2 rounded-full ${i < count ? 'bg-accent' : 'bg-ink-faint/30'}`} />)}
  </span>
}

export function RunFaces({ ids, campaign, size = 32 }: { ids: readonly (string | null)[]; campaign: Campaign; size?: number }) {
  return <span className="flex shrink-0 gap-1">
    {ids.map((id, i) => id ? <span key={i} className="shrink-0" style={{ width: size }}><FaceTile outfitId={id} size={size} label={campaign.outfits.get(id)?.name ?? 'Uma'} round /></span>
      : <span key={i} className="shrink-0 rounded-full bg-sunken" style={{ width: size, height: size }} />)}
  </span>
}
