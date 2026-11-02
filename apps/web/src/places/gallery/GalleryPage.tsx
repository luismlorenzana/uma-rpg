// The Gallery (D283, H155; collections.md §7.3, CO7, CO36, CO37): where the Observatory stood, every Uma's window in the
// world, most complete first, each with her count and share; then the outfits nobody owns, unlit, and the Umas who
// ascended from here, their windows full. A tap on an owned Uma opens her Window sheet, on any other her Stable profile.
// Ascend moves the ready ones up a tier. From save v35; `/learning/gallery/:id` opens her sheet (the Observatory's old
// links land here).
import { LockedIcon } from '@luismlorenzana/uma-kit/ui'
import { boardOf, lastLitDay, readyToAscend, windowOf } from '@rpg/domain/windows'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import type { MasterView } from '../../master/master'
import { useActiveTier, useAlbumScope, useGame, useWorld } from '../../save/game'
import { MasterGate } from '../MasterGate'
import type { PageProps } from '../registry'
import { profileDoor } from '../stable/profile-tabs'
import { AscendSheet } from './AscendSheet'
import { GlassWindow } from './GlassWindow'
import {
  ascendCount, collectionLine, collectionPercent, GALLERY_FILTERS, GALLERY_WORDS, galleryHead, rankedName, rankGallery, windowCount,
  type GalleryFilter,
} from './glass-view'
import { TIER_FRAME, WindowSheet } from './WindowSheet'

export default function GalleryPage({ rest }: PageProps) {
  const [id] = rest.split('/').filter(Boolean)
  return <MasterGate>{(view) => <Gallery view={view} asked={id ?? null} />}</MasterGate>
}

/** A tile's window, four a row at 375 and up. */
const TILE = 76

function Gallery({ view, asked }: { view: MasterView; asked: string | null }) {
  const save = useGame((s) => s.save)
  const world = useWorld()
  const tier = useActiveTier()
  const scope = useAlbumScope()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<GalleryFilter>('all')
  const [picked, setPicked] = useState<string | null>(asked)
  const [ascending, setAscending] = useState(false)
  const outfits = useMemo(() => new Map(view.roster.map((o) => [o.outfitId, o])), [view])
  const data = useMemo(() => {
    if (!save || !world) return null
    const ready = new Set(readyToAscend(save, tier))
    const owned = rankGallery(Object.keys(world.umas).filter((id) => outfits.has(id)).map((id) => {
      const w = windowOf(save, id, tier)
      return { id, percent: w.percent, lit: w.lit, total: w.total, last: lastLitDay(save, id, tier), name: outfits.get(id)!.name }
    }))
    const ascended = Object.entries(save.account.history)
      .filter(([id, entries]) => !world.umas[id] && outfits.has(id) && entries.some((e) => e.tier === tier + 1)).map(([id]) => id)
    const gone = new Set(ascended)
    const locked = view.roster.filter((o) => !world.umas[o.outfitId] && !scope.elsewhere.has(o.outfitId) && !gone.has(o.outfitId)).map((o) => o.outfitId)
    return { ready, owned, ascended, locked, full: owned.filter((e) => e.lit === e.total).length, percent: collectionPercent(owned) }
  }, [save, world, tier, outfits, view, scope])
  if (!save || !world || !data) return null
  const steps = boardOf(tier).length
  const toProfile = (id: string) => {
    const door = profileDoor(id)
    void navigate(door.to, { state: door.state })
  }
  const pickedOutfit = picked ? outfits.get(picked) : undefined
  const pickedUma = picked ? world.umas[picked] : undefined
  const shown = data.owned.filter((e) => filter === 'all' || filter === 'owned' || (filter === 'ready' && data.ready.has(e.id)))

  return (
    <div className="space-y-3 p-3 pb-6" data-gallery>
      <section className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] text-ink-soft" data-gallery-head>{galleryHead(data.full, data.ready.size)}</p>
          <p className="font-display text-[17px] font-bold" data-gallery-collection>{collectionLine(data.percent)}</p>
        </div>
        {data.ready.size > 0 && (
          <button type="button" onClick={() => setAscending(true)} data-gallery-ascend
            className="min-h-11 shrink-0 rounded-sm bg-accent px-4 font-display font-bold text-accent-ink">
            {ascendCount(data.ready.size)}
          </button>
        )}
      </section>

      <div role="tablist" aria-label="Filter" className="flex gap-1" data-gallery-filters>
        {GALLERY_FILTERS.map(({ key, label }) => (
          <button key={key} type="button" role="tab" aria-selected={filter === key} onClick={() => setFilter(key)}
            className={`min-h-11 flex-1 rounded-sm text-[13px] font-semibold ${filter === key ? 'bg-accent text-accent-ink' : 'bg-raised text-ink-soft'}`}>
            {label}
          </button>
        ))}
      </div>

      <ul className="grid grid-cols-4 gap-x-2 gap-y-3" data-gallery-grid>
        {filter !== 'locked' && shown.map((e) => (
          <Tile key={e.id} id={e.id} lit={e.lit} steps={e.total} ring={e.lit === e.total ? TIER_FRAME[tier] : undefined} onClick={() => setPicked(e.id)}
            line={<>{data.ready.has(e.id) && <span aria-hidden className="mr-1 inline-block size-1.5 rounded-full bg-success align-middle" />}{rankedName(data.owned.indexOf(e) + 1, e.name)}</>}
            sub={windowCount(e)} label={`${e.name}, ${e.percent}%${data.ready.has(e.id) ? ', ready' : ''}`} />
        ))}
        {(filter === 'all' || filter === 'locked') && data.locked.map((id) => (
          <Tile key={id} id={id} lit={0} steps={steps} locked onClick={() => toProfile(id)} line={outfits.get(id)!.name} sub={GALLERY_WORDS.locked}
            label={`${outfits.get(id)!.name}, locked`} />
        ))}
        {filter === 'all' && data.ascended.map((id) => {
          const total = windowOf(save, id, tier).total
          return (
            <Tile key={id} id={id} lit={total} steps={total} ring={TIER_FRAME[tier]} onClick={() => toProfile(id)} line={outfits.get(id)!.name}
              sub={GALLERY_WORDS.ascended} label={`${outfits.get(id)!.name}, ascended`} />
          )
        })}
      </ul>

      {pickedOutfit && pickedUma && (
        <WindowSheet outfit={pickedOutfit} uma={pickedUma} tier={tier} onClose={() => setPicked(null)}
          onReady={() => { setPicked(null); setAscending(true) }} />
      )}
      {ascending && <AscendSheet ready={[...data.ready]} outfits={outfits} onClose={() => setAscending(false)} />}
    </div>
  )
}

/** One window, mounted once it nears the screen: a world's few hundred windows load as they scroll in. */
function Tile({ id, lit, steps, ring, locked = false, line, sub, label, onClick }: {
  id: string; lit: number; steps: number; ring?: string; locked?: boolean; line: ReactNode; sub: string; label: string; onClick: () => void
}) {
  const ref = useRef<HTMLLIElement>(null)
  const [seen, setSeen] = useState(() => typeof IntersectionObserver === 'undefined')
  useEffect(() => {
    if (seen || !ref.current) return
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) setSeen(true)
    }, { rootMargin: '240px' })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [seen])
  return (
    <li ref={ref} data-gallery-tile={id}>
      <button type="button" onClick={onClick} aria-label={label} className="flex w-full flex-col items-center gap-1 text-center">
        <span className="relative block rounded-sm" style={{ width: TILE, height: TILE, boxShadow: ring ? `0 0 0 3px ${ring}` : undefined }}>
          {seen ? <GlassWindow outfitId={id} lit={lit} steps={steps} size={TILE} className="rounded-sm" /> : <span className="block size-full rounded-sm bg-[#0e1117]" />}
          {locked && <span className="absolute top-1 left-1 flex rounded-full bg-scrim/60 p-0.5 text-ink-on-dark"><LockedIcon size={14} /></span>}
        </span>
        <span className="w-full truncate text-[12px] leading-tight font-semibold">{line}</span>
        <span className="text-[11px] leading-tight text-ink-soft">{sub}</span>
      </button>
    </li>
  )
}
